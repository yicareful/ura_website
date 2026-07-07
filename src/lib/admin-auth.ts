import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "./constants";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === "true";
}

export function verifyAdminSecret(secret: string) {
  return secret === process.env.ADMIN_SECRET;
}
