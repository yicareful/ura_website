import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { scryptSync, randomBytes, randomUUID, timingSafeEqual } from "crypto";
import { prisma } from "./prisma";
import { RUNNER_SESSION_COOKIE } from "./constants";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(derived), Buffer.from(hash));
}

export function createSessionToken(): string {
  return randomUUID();
}

export async function getCurrentRunner() {
  const cookieStore = await cookies();
  const token = cookieStore.get(RUNNER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const runner = await prisma.runner.findUnique({
    where: { sessionToken: token },
  });

  return runner;
}

export async function requireRunner(redirectTo?: string) {
  const runner = await getCurrentRunner();
  if (!runner) {
    const redirectPath = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : "";
    redirect(`/runner/login${redirectPath}`);
  }
  return runner;
}