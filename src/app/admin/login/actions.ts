"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSecret } from "@/lib/admin-auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

export type LoginState = {
  error?: string;
};

export async function adminLogin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const secret = String(formData.get("secret") || "");

  if (!verifyAdminSecret(secret)) {
    return { error: "密钥不正确" };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "true", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  redirect("/admin");
}

export async function adminLogout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
