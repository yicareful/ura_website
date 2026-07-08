"use client";

import { useActionState } from "react";
import Link from "next/link";
import { adminLogin, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

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
          OPERATOR ACCESS
        </p>
        <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-2)" }}>管理后台</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-8)" }}>
          简易验证，仅用于原型演示。
        </p>

        <form action={formAction}>
          <div className="form-group">
            <label className="form-label" htmlFor="secret">
              管理密钥
            </label>
            <input
              className="form-input"
              id="secret"
              name="secret"
              type="password"
              required
              autoFocus
            />
          </div>

          {state.error && <p className="form-error" style={{ marginBottom: "var(--space-4)" }}>{state.error}</p>}

          <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={pending}>
            {pending ? "验证中..." : "进入管理后台"}
          </button>
        </form>
      </div>
    </section>
  );
}
