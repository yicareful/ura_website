import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSmsCode, delSmsCode, setRegTempToken } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { RUNNER_SESSION_COOKIE } from "@/lib/constants";
import { createSessionToken } from "@/lib/runner-auth";

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();

    // 参数校验
    if (!/^1\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "手机号格式不正确" }, { status: 400 });
    }
    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "验证码格式不正确" }, { status: 400 });
    }

    // 校验验证码（用 Redis 本地比对）
    const storedCode = await getSmsCode(phone);
    if (!storedCode) {
      return NextResponse.json(
        { error: "验证码已过期，请重新发送" },
        { status: 400 }
      );
    }
    if (storedCode !== code) {
      return NextResponse.json({ error: "验证码错误" }, { status: 400 });
    }

    // 验证码正确，立即删除（用完即焚）
    await delSmsCode(phone);

    // 查询手机号是否已注册
    const runner = await prisma.runner.findUnique({ where: { phone } });

    if (runner) {
      // 已注册 → 直接登录
      const sessionToken = createSessionToken();
      await prisma.runner.update({
        where: { id: runner.id },
        data: { sessionToken },
      });

      const cookieStore = await cookies();
      cookieStore.set(RUNNER_SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7天
        path: "/",
      });

      return NextResponse.json({
        valid: true,
        action: "login" as const,
        redirect: "/",
      });
    } else {
      // 未注册 → 返回临时令牌，跳转完善资料
      const tempToken = createSessionToken();
      await setRegTempToken(tempToken, phone);

      return NextResponse.json({
        valid: true,
        action: "register" as const,
        tempToken,
      });
    }
  } catch (error) {
    console.error("验证码校验失败:", error);
    return NextResponse.json(
      { error: "验证失败，请稍后再试" },
      { status: 500 }
    );
  }
}
