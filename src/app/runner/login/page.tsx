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
      className="section-dark"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "var(--space-6)",
        position: "relative",
      }}
    >
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "var(--space-6)",
          left: "var(--space-6)",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "var(--text-xs)",
          color: "var(--color-text-on-dark-muted)",
        }}
      >
        ← 返回首页
      </Link>
      <div className="card" style={{ padding: "var(--space-10)", width: 400, maxWidth: "100%" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-blue)", fontWeight: 700, fontSize: "var(--text-xs)", marginBottom: "var(--space-2)" }}>
          RUNNER ACCESS
        </p>
        <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-2)" }}>选手登录</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-8)" }}>
          使用手机号和密码进入报名中心。
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
          <Link href={`/runner/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} style={{ color: "var(--color-primary)", fontWeight: 800 }}>
            立即注册
          </Link>
        </p>
      </div>
    </section>
  );
}
