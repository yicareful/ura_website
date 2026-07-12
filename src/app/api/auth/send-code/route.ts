import { NextResponse } from "next/server";
import { checkSmsRateLimit, setSmsCode } from "@/lib/redis";
import { sendVerificationCode } from "@/lib/sms";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!/^1\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "手机号格式不正确" }, { status: 400 });
    }

    // 频率限制：同一手机号60秒内只能发一次
    const canSend = await checkSmsRateLimit(phone);
    if (!canSend) {
      return NextResponse.json(
        { error: "发送过于频繁，请60秒后再试" },
        { status: 429 }
      );
    }

    // 生成6位验证码
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // 存入 Redis（5分钟过期）
    await setSmsCode(phone, code);

    // 通过阿里云短信服务发送
    await sendVerificationCode(phone, code);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("发送验证码失败:", error);
    return NextResponse.json(
      { error: "发送失败，请稍后再试" },
      { status: 500 }
    );
  }
}
