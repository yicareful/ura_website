"use client";

import { useActionState } from "react";
import { adminLogin, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-light-base)",
      }}
    >
      <div className="card" style={{ padding: "var(--space-10)", width: 380 }}>
        <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-1)" }}>管理后台</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-8)" }}>
          简易验证 · 非生产级安全方案，仅用于原型演示
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
            {pending ? "验证中…" : "进入管理后台"}
          </button>
        </form>
      </div>
    </section>
  );
}
