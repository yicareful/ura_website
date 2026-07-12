"use client";

import { Suspense, useActionState, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "";
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  // ── Tab ──
  const [activeTab, setActiveTab] = useState<"password" | "code">("code");

  // ── 验证码登录 state ──
  const [codePhone, setCodePhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [codeLoginLoading, setCodeLoginLoading] = useState(false);
  const [codeError, setCodeError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [countdown]);

  // 发送验证码
  const handleSendCode = async () => {
    if (!/^1\d{10}$/.test(codePhone)) {
      setCodeError("请输入正确的手机号");
      return;
    }
    setSending(true);
    setCodeError("");
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: codePhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCodeError(data.error || "发送失败");
      } else {
        setCountdown(60);
      }
    } catch {
      setCodeError("发送失败，请检查网络");
    } finally {
      setSending(false);
    }
  };

  // 验证码登录
  const handleCodeLogin = async () => {
    if (!/^1\d{10}$/.test(codePhone)) {
      setCodeError("请输入正确的手机号");
      return;
    }
    if (!code || code.length !== 6) {
      setCodeError("请输入6位验证码");
      return;
    }
    setCodeLoginLoading(true);
    setCodeError("");
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: codePhone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCodeError(data.error || "验证失败");
        return;
      }
      if (data.action === "login") {
        router.push(redirectTo || "/");
      } else if (data.action === "register") {
        router.push(`/runner/register/profile?token=${data.tempToken}`);
      }
    } catch {
      setCodeError("验证失败，请稍后再试");
    } finally {
      setCodeLoginLoading(false);
    }
  };

  return (
    <section className="section-dark auth-screen">
      <Link href="/" className="auth-back">← 返回首页</Link>

      <div className="auth-card auth-card--dark notch" style={{ maxWidth: 420 }}>
        {/* Race-flag gradient bar */}
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

        <div style={{ position: "relative", marginTop: "var(--space-3)" }}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>RUNNER ACCESS</p>
          <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-2)", fontStyle: "italic" }}>
            选手登录
          </h1>
        </div>

        {/* ── Tab 切换 ── */}
        <div
          role="tablist"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            marginTop: "var(--space-5)",
            marginBottom: "var(--space-6)",
            borderBottom: "2px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            role="tab"
            aria-selected={activeTab === "code"}
            onClick={() => setActiveTab("code")}
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: "none",
              border: "none",
              borderBottom: activeTab === "code" ? "3px solid var(--color-red)" : "3px solid transparent",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-sm)",
              textTransform: "uppercase",
              letterSpacing: ".03em",
              color: activeTab === "code" ? "var(--color-red)" : "var(--color-text-on-dark-muted)",
              transition: "color var(--duration-fast), border-color var(--duration-fast)",
              cursor: "pointer",
            }}
          >
            验证码登录
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "password"}
            onClick={() => setActiveTab("password")}
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: "none",
              border: "none",
              borderBottom: activeTab === "password" ? "3px solid var(--color-red)" : "3px solid transparent",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-sm)",
              textTransform: "uppercase",
              letterSpacing: ".03em",
              color: activeTab === "password" ? "var(--color-red)" : "var(--color-text-on-dark-muted)",
              transition: "color var(--duration-fast), border-color var(--duration-fast)",
              cursor: "pointer",
            }}
          >
            密码登录
          </button>
        </div>

        {/* ── Tab: 密码登录 ── */}
        {activeTab === "password" && (
          <form action={formAction}>
            <input type="hidden" name="redirect" value={redirectTo} />

            <div className="form-group">
              <label className="form-label" htmlFor="phone">手机号</label>
              <input
                className="form-input form-input--dark"
                id="phone"
                name="phone"
                type="tel"
                maxLength={11}
                required
                autoFocus
                placeholder="11 位手机号码"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">密码</label>
              <input
                className="form-input form-input--dark"
                id="password"
                name="password"
                type="password"
                required
                placeholder="输入密码"
              />
            </div>

            {state.error && (
              <div
                style={{
                  marginBottom: "var(--space-5)",
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

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%" }}
              disabled={pending}
            >
              {pending ? "登录中..." : "登录"}
            </button>
          </form>
        )}

        {/* ── Tab: 验证码登录 ── */}
        {activeTab === "code" && (
          <div>
            <div className="form-group">
              <label className="form-label" htmlFor="codePhone">手机号</label>
              <input
                className="form-input form-input--dark"
                id="codePhone"
                type="tel"
                maxLength={11}
                placeholder="11 位手机号码"
                value={codePhone}
                onChange={(e) => setCodePhone(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="smsCode">验证码</label>
              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <input
                  className="form-input form-input--dark"
                  id="smsCode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6 位验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || sending}
                  style={{
                    minWidth: 120,
                    minHeight: 48,
                    padding: "0 var(--space-3)",
                    background:
                      countdown > 0
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.12)",
                    color:
                      countdown > 0
                        ? "var(--color-text-on-dark-muted)"
                        : "var(--color-text-on-dark)",
                    border: "2px solid rgba(255,255,255,0.18)",
                    borderRadius: "var(--radius-md)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: "var(--text-xs)",
                    whiteSpace: "nowrap",
                    cursor: countdown > 0 ? "not-allowed" : "pointer",
                    transition: "all var(--duration-fast)",
                  }}
                >
                  {sending
                    ? "发送中..."
                    : countdown > 0
                      ? `${countdown}s`
                      : "获取验证码"}
                </button>
              </div>
            </div>

            {codeError && (
              <div
                style={{
                  marginBottom: "var(--space-5)",
                  padding: "var(--space-3) var(--space-4)",
                  background: "rgba(225,29,46,0.12)",
                  borderRadius: "var(--radius-sm)",
                  borderLeft: "4px solid var(--color-red)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-sm)",
                  color: "#f87171",
                }}
              >
                {codeError}
              </div>
            )}

            <button
              type="button"
              className="btn-primary"
              style={{ width: "100%" }}
              disabled={codeLoginLoading}
              onClick={handleCodeLogin}
            >
              {codeLoginLoading ? "登录中..." : "登录"}
            </button>
          </div>
        )}

        {/* ── 注册入口 ── */}
        <p
          style={{
            textAlign: "center",
            marginTop: "var(--space-6)",
            fontSize: "var(--text-sm)",
            color: "var(--color-text-on-dark-muted)",
          }}
        >
          还没有账号？{" "}
          <Link
            href={`/runner/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            style={{ color: "var(--color-yellow)", fontWeight: 800, letterSpacing: ".02em" }}
          >
            立即注册
          </Link>
        </p>
      </div>
    </section>
  );
}
