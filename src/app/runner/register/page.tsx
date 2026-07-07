"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerAction, type RegisterFormState } from "./actions";

const initialState: RegisterFormState = {};

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-light-base)",
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
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-1)",
        }}
      >
        ← 回到首页
      </Link>
      <div className="card" style={{ padding: "var(--space-10)", width: 480, maxWidth: "100%" }}>
        <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-1)" }}>创建账号</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-8)" }}>
          注册后即可报名赛事，随时查看报名状态
        </p>

        <form action={formAction}>
          <input type="hidden" name="redirect" value={redirectTo} />

          {state.error && (
            <p className="form-error" style={{ marginBottom: "var(--space-4)", padding: "var(--space-3) var(--space-4)", background: "rgba(239,68,68,0.08)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {state.error}
            </p>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="name">姓名 *</label>
              <input className="form-input" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gender">性别 *</label>
              <select className="form-select" id="gender" name="gender" required>
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="idCard">身份证号 *</label>
              <input className="form-input" id="idCard" name="idCard" required maxLength={18} pattern="[0-9A-Za-z]+" title="身份证号只能包含数字和英文字母" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">手机号 *</label>
              <input className="form-input" id="phone" name="phone" required maxLength={11} pattern="[0-9]+" inputMode="numeric" title="手机号只能包含数字" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">邮箱</label>
            <input className="form-input" id="email" name="email" type="email" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="school">学校 *</label>
              <input className="form-input" id="school" name="school" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="major">院系/专业</label>
              <input className="form-input" id="major" name="major" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="password">密码 *</label>
              <input className="form-input" id="password" name="password" type="password" required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">确认密码 *</label>
              <input className="form-input" id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "var(--space-2)" }} disabled={pending}>
            {pending ? "注册中…" : "注册"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "var(--space-6)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          已有账号？{" "}
          <Link href={`/runner/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} style={{ color: "var(--color-primary)", fontWeight: 600 }}>
            立即登录
          </Link>
        </p>
      </div>
    </section>
  );
}