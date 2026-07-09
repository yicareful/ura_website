"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Select } from "@/components/Select";
import { registerAction, type RegisterFormState } from "./actions";

const initialState: RegisterFormState = {};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function FormFieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="form-error">{error}</p>;
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [gender, setGender] = useState("");

  return (
    <section className="section-dark auth-screen" style={{ padding: "var(--space-12) var(--space-6)" }}>
      <Link href="/" className="auth-back">← 返回首页</Link>

      <div className="auth-card auth-card--dark notch" style={{ width: 580 }}>
        {/* Top gradient signal bar */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, var(--color-red), var(--color-yellow) 38%, var(--color-blue))",
            borderTopLeftRadius: "var(--radius-lg)",
            borderTopRightRadius: "var(--radius-lg)",
          }}
        />

        <div style={{ position: "relative", marginTop: "var(--space-4)" }}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>RUNNER PROFILE</p>
          <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-2)", fontStyle: "italic" }}>创建账号</h1>
          <p style={{ color: "var(--color-text-on-dark-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-8)" }}>
            注册后即可报名赛事，并随时查看报名状态与完赛成绩。
          </p>
        </div>

        <form action={formAction} noValidate>
          <input type="hidden" name="redirect" value={redirectTo} />

          {/* Global error banner */}
          {state.error && (
            <div
              style={{
                marginBottom: "var(--space-6)",
                padding: "var(--space-3) var(--space-4)",
                background: "rgba(225,29,46,0.12)",
                borderRadius: "var(--radius-sm)",
                borderLeft: "4px solid var(--color-red)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                color: "#f87171",
              }}
            >
              {state.error}
            </div>
          )}

          {/* ── 个人信息 ── */}
          <div className="form-section">
            <p className="form-section__header form-section__header--dark">个人信息</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">姓名</label>
                <input
                  className="form-input form-input--dark"
                  id="name"
                  name="name"
                  required
                  placeholder="请输入真实姓名"
                  autoFocus
                />
                <FormFieldError error={state?.fieldErrors?.name} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="gender">性别</label>
                <Select
                  name="gender"
                  value={gender}
                  onChange={setGender}
                  placeholder="请选择性别"
                  dark
                  options={[
                    { value: "male", label: "男" },
                    { value: "female", label: "女" },
                  ]}
                />
                <FormFieldError error={state?.fieldErrors?.gender} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="idCard">身份证号</label>
                <input
                  className="form-input form-input--dark"
                  id="idCard"
                  name="idCard"
                  required
                  maxLength={18}
                  pattern="\d{17}[\dXx]"
                  title="身份证号应为18位，前17位为数字，最后一位为数字或字母X"
                  placeholder="18 位身份证号码"
                />
                <FormFieldError error={state?.fieldErrors?.idCard} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">手机号</label>
                <input
                  className="form-input form-input--dark"
                  id="phone"
                  name="phone"
                  required
                  maxLength={11}
                  pattern="[0-9]+"
                  inputMode="numeric"
                  title="手机号只能包含数字"
                  placeholder="11 位手机号码"
                />
                <FormFieldError error={state?.fieldErrors?.phone} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">邮箱</label>
              <input
                className="form-input form-input--dark"
                id="email"
                name="email"
                type="email"
                placeholder="your@example.com"
              />
              <p className="form-hint">选填，用于接收报名确认和赛事通知</p>
              <FormFieldError error={state?.fieldErrors?.email} />
            </div>
          </div>

          {/* ── 教育信息 ── */}
          <div className="form-section">
            <p className="form-section__header form-section__header--dark">教育信息</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="school">学校</label>
                <input
                  className="form-input form-input--dark"
                  id="school"
                  name="school"
                  required
                  placeholder="所在院校全称"
                />
                <FormFieldError error={state?.fieldErrors?.school} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="major">院系 / 专业</label>
                <input
                  className="form-input form-input--dark"
                  id="major"
                  name="major"
                  placeholder="如：计算机科学与技术"
                />
                <FormFieldError error={state?.fieldErrors?.major} />
              </div>
            </div>
          </div>

          {/* ── 账号安全 ── */}
          <div className="form-section">
            <p className="form-section__header form-section__header--dark">账号安全</p>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="password">密码</label>
                <input
                  className="form-input form-input--dark"
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="至少 6 位密码"
                  autoComplete="new-password"
                />
                <FormFieldError error={state?.fieldErrors?.password} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">确认密码</label>
                <input
                  className="form-input form-input--dark"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  placeholder="再次输入密码"
                  autoComplete="new-password"
                />
                <FormFieldError error={state?.fieldErrors?.confirmPassword} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={pending}
            style={{
              width: "100%",
              marginTop: "var(--space-4)",
              minHeight: 50,
              fontSize: "var(--text-lg)",
            }}
          >
            {pending ? "注册中..." : "创建账号"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "var(--space-6)",
            fontSize: "var(--text-sm)",
            color: "var(--color-text-on-dark-muted)",
          }}
        >
          已有账号？{" "}
          <Link
            href={`/runner/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            style={{ color: "var(--color-yellow)", fontWeight: 800, letterSpacing: ".02em" }}
          >
            立即登录 →
          </Link>
        </p>
      </div>
    </section>
  );
}
