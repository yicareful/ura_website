"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { RUNNER_SESSION_COOKIE } from "@/lib/constants";
import { hashPassword, createSessionToken } from "@/lib/runner-auth";

export type RegisterFormState = {
  error?: string;
};

export async function registerAction(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const name = String(formData.get("name") || "").trim();
  const gender = String(formData.get("gender") || "");
  const idCard = String(formData.get("idCard") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const school = String(formData.get("school") || "").trim();
  const major = String(formData.get("major") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const redirectTo = String(formData.get("redirect") || "");

  if (!name || !gender || !idCard || !phone || !school || !password) {
    return { error: "请完整填写所有必填项" };
  }

  if (!/^\d{15}(\d{2}[0-9Xx])?$/.test(idCard)) {
    return { error: "身份证号格式不正确" };
  }

  if (!/^1\d{10}$/.test(phone)) {
    return { error: "手机号格式不正确" };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "邮箱格式不正确" };
  }

  if (password.length < 6) {
    return { error: "密码长度不能少于6位" };
  }

  if (password !== confirmPassword) {
    return { error: "两次输入的密码不一致" };
  }

  const existing = await prisma.runner.findUnique({
    where: { phone },
  });

  if (existing) {
    return { error: "该手机号已注册，请直接登录" };
  }

  const passwordHash = hashPassword(password);
  const sessionToken = createSessionToken();

  await prisma.runner.create({
    data: {
      phone,
      password: passwordHash,
      name,
      gender,
      idCard,
      email: email || null,
      school,
      major: major || null,
      sessionToken,
    },
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