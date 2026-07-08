"use client";

import { useActionState } from "react";
import Link from "next/link";
import { adminLogin, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <section className="section-dark auth-screen">
      <Link href="/" className="auth-back">← 返回首页</Link>
      <div className="auth-card notch" style={{ width: 400 }}>
        <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>OPERATOR ACCESS</p>
        <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-2)", fontStyle: "italic" }}>管理后台</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-8)" }}>
          简易验证，仅用于原型演示。
        </p>

        <form action={formAction}>
          <div className="form-group">
            <label className="form-label" htmlFor="secret">管理密钥</label>
            <input className="form-input" id="secret" name="secret" type="password" required autoFocus />
          </div>

          {state.error && <p className="form-error" style={{ marginBottom: "var(--space-4)", padding: "var(--space-3) var(--space-4)", background: "rgba(225,29,46,0.08)", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--color-red)" }}>{state.error}</p>}

          <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={pending}>
            {pending ? "验证中..." : "进入管理后台"}
          </button>
        </form>
      </div>
    </section>
  );
}