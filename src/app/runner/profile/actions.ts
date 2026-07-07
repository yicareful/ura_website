"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { RUNNER_SESSION_COOKIE } from "@/lib/constants";
import { verifyPassword, hashPassword } from "@/lib/runner-auth";

export type UpdateEmailState = {
  success?: string;
  error?: string;
};

export async function updateEmailAction(
  _prevState: UpdateEmailState,
  formData: FormData
): Promise<UpdateEmailState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email) {
    return { error: "请填写新邮箱" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "邮箱格式不正确" };
  }

  if (!password) {
    return { error: "请输入当前密码以确认修改" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(RUNNER_SESSION_COOKIE)?.value;
  if (!token) {
    return { error: "请先登录" };
  }

  const runner = await prisma.runner.findUnique({
    where: { sessionToken: token },
  });

  if (!runner) {
    return { error: "请先登录" };
  }

  if (!verifyPassword(password, runner.password)) {
    return { error: "当前密码不正确" };
  }

  await prisma.runner.update({
    where: { id: runner.id },
    data: { email },
  });

  return { success: "邮箱更新成功" };
}

export type UpdatePasswordState = {
  success?: string;
  error?: string;
};

export async function updatePasswordAction(
  _prevState: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword) {
    return { error: "请输入当前密码" };
  }

  if (!newPassword) {
    return { error: "请输入新密码" };
  }

  if (newPassword.length < 6) {
    return { error: "新密码长度不能少于6位" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "两次输入的新密码不一致" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(RUNNER_SESSION_COOKIE)?.value;
  if (!token) {
    return { error: "请先登录" };
  }

  const runner = await prisma.runner.findUnique({
    where: { sessionToken: token },
  });

  if (!runner) {
    return { error: "请先登录" };
  }

  if (!verifyPassword(currentPassword, runner.password)) {
    return { error: "当前密码不正确" };
  }

  const passwordHash = hashPassword(newPassword);

  await prisma.runner.update({
    where: { id: runner.id },
    data: { password: passwordHash },
  });

  return { success: "密码更新成功" };
}
