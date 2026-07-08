"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-light-base)",
        position: "relative",
      }}
    >
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "var(--space-6)",
          left: "var(--space-6)",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-1)",
        }}
      >
        返回首页
      </Link>
      <div className="card" style={{ padding: "var(--space-10)", width: 380 }}>
        <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-1)" }}>选手登录</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-8)" }}>
          使用手机号和密码登录
        </p>

        <form action={formAction}>
          <input type="hidden" name="redirect" value={redirectTo} />

          <div className="form-group">
            <label className="form-label" htmlFor="phone">手机号</label>
            <input className="form-input" id="phone" name="phone" type="tel" maxLength={11} required autoFocus />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">密码</label>
            <input className="form-input" id="password" name="password" type="password" required />
          </div>

          {state.error && <p className="form-error" style={{ marginBottom: "var(--space-4)" }}>{state.error}</p>}

          <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={pending}>
            {pending ? "登录中..." : "登录"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "var(--space-6)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          还没有账号？{" "}
          <Link href={`/runner/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} style={{ color: "var(--color-primary)", fontWeight: 600 }}>
            立即注册
          </Link>
        </p>
      </div>
    </section>
  );
}