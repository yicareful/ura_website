"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { RUNNER_SESSION_COOKIE } from "@/lib/constants";
import { hashPassword, createSessionToken } from "@/lib/runner-auth";

export type RegisterFormState = {
  error?: string;
  fieldErrors?: {
    name?: string;
    gender?: string;
    idCard?: string;
    phone?: string;
    email?: string;
    school?: string;
    major?: string;
    password?: string;
    confirmPassword?: string;
  };
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

  const fieldErrors: RegisterFormState["fieldErrors"] = {};

  if (!name) fieldErrors.name = "请输入姓名";
  if (!gender) fieldErrors.gender = "请选择性别";
  if (!idCard) fieldErrors.idCard = "请输入身份证号";
  else if (!/^\d{17}[\dXx]$/.test(idCard)) fieldErrors.idCard = "身份证号格式不正确（18位）";
  if (!phone) fieldErrors.phone = "请输入手机号";
  else if (!/^1\d{10}$/.test(phone)) fieldErrors.phone = "手机号格式不正确";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "邮箱格式不正确";
  if (!school) fieldErrors.school = "请输入学校名称";
  if (!password) fieldErrors.password = "请输入密码";
  else if (password.length < 6) fieldErrors.password = "密码不能少于6位";
  if (!confirmPassword) fieldErrors.confirmPassword = "请再次输入密码";
  else if (password !== confirmPassword) fieldErrors.confirmPassword = "两次输入的密码不一致";

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "请修正表单中的错误", fieldErrors };
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