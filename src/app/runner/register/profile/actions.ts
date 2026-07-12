"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { RUNNER_SESSION_COOKIE } from "@/lib/constants";
import { hashPassword, createSessionToken } from "@/lib/runner-auth";
import { getRegTempToken, delRegTempToken } from "@/lib/redis";

export type ProfileFormState = {
  error?: string;
  prevValues?: {
    name: string;
    gender: string;
    idCard: string;
    school: string;
    major: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  fieldErrors?: {
    name?: string;
    gender?: string;
    idCard?: string;
    school?: string;
    major?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
};

export async function completeProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const tempToken = String(formData.get("token") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const gender = String(formData.get("gender") || "");
  const idCard = String(formData.get("idCard") || "").trim();
  const school = String(formData.get("school") || "").trim();
  const major = String(formData.get("major") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  // 验证临时令牌
  if (!tempToken) {
    return { error: "无效的注册会话，请重新验证手机号" };
  }
  const phone = await getRegTempToken(tempToken);
  if (!phone) {
    return { error: "注册会话已过期，请重新验证手机号" };
  }

  // 字段校验
  const fieldErrors: ProfileFormState["fieldErrors"] = {};

  if (!name) fieldErrors.name = "请输入姓名";
  if (!gender) fieldErrors.gender = "请选择性别";
  if (!idCard) fieldErrors.idCard = "请输入身份证号";
  else if (!/^\d{17}[\dXx]$/.test(idCard))
    fieldErrors.idCard = "身份证号格式不正确（18位）";
  if (!school) fieldErrors.school = "请输入学校名称";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = "邮箱格式不正确";
  if (password && password.length < 6)
    fieldErrors.password = "密码不能少于6位";
  if (password !== confirmPassword)
    fieldErrors.confirmPassword = "两次输入的密码不一致";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "请修正表单中的错误",
      fieldErrors,
      prevValues: { name, gender, idCard, school, major, email, password, confirmPassword },
    };
  }

  // 检查手机号是否已被注册（防并发 / 重复提交）
  const existing = await prisma.runner.findUnique({ where: { phone } });
  if (existing) {
    await delRegTempToken(tempToken);
    return { error: "该手机号已注册，请直接登录" };
  }

  // 创建用户
  // 如果用户没设密码，随机生成一个（之后可以通过手机验证码重置）
  const passwordHash = password
    ? hashPassword(password)
    : hashPassword(Math.random().toString(36).slice(2));
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

  // 删除临时令牌（用完即焚）
  await delRegTempToken(tempToken);

  // 写登录 cookie
  const cookieStore = await cookies();
  cookieStore.set(RUNNER_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/");
}
