"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RUNNER_SESSION_COOKIE } from "@/lib/constants";
import { verifyPassword, createSessionToken } from "@/lib/runner-auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirect") || "");

  if (!phone || !password) {
    return { error: "请填写手机号和密码" };
  }

  const runner = await prisma.runner.findUnique({
    where: { phone },
  });

  if (!runner) {
    return { error: "手机号未注册" };
  }

  if (!verifyPassword(password, runner.password)) {
    return { error: "密码不正确" };
  }

  const sessionToken = createSessionToken();

  await prisma.runner.update({
    where: { id: runner.id },
    data: { sessionToken },
  });

  const cookieStore = await cookies();
  cookieStore.set(RUNNER_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect(redirectTo || "/");
}

export async function logoutAction() {
  "use server";

  const cookieStore = await cookies();
  const token = cookieStore.get(RUNNER_SESSION_COOKIE)?.value;

  if (token) {
    await prisma.runner.updateMany({
      where: { sessionToken: token },
      data: { sessionToken: null },
    });
  }

  cookieStore.delete(RUNNER_SESSION_COOKIE);
  redirect("/");
}
