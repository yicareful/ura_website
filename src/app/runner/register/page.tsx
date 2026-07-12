"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "";

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
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
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入正确的手机号");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "发送失败");
      } else {
        setCountdown(60);
      }
    } catch {
      setError("发送失败，请检查网络");
    } finally {
      setSending(false);
    }
  };

  // 验证验证码
  const handleVerify = async () => {
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入正确的手机号");
      return;
    }
    if (!code || code.length !== 6) {
      setError("请输入6位验证码");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "验证失败");
        return;
      }
      if (data.action === "login") {
        // 手机号已注册 → 已自动登录，跳首页
        router.push(redirectTo || "/");
      } else if (data.action === "register") {
        // 手机号未注册 → 跳转完善资料
        router.push(`/runner/register/profile?token=${data.tempToken}`);
      }
    } catch {
      setError("验证失败，请稍后再试");
    } finally {
      setVerifying(false);
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
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>RUNNER REGISTRATION</p>
          <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-2)", fontStyle: "italic" }}>
            注册
          </h1>
          <p style={{ color: "var(--color-text-on-dark-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-8)" }}>
            验证手机号后即可创建账号。
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="regPhone">手机号</label>
          <input
            className="form-input form-input--dark"
            id="regPhone"
            type="tel"
            maxLength={11}
            placeholder="11 位手机号码"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="regCode">验证码</label>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <input
              className="form-input form-input--dark"
              id="regCode"
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

        {error && (
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
            {error}
          </div>
        )}

        <button
          type="button"
          className="btn-primary"
          style={{ width: "100%" }}
          disabled={verifying}
          onClick={handleVerify}
        >
          {verifying ? "验证中..." : "下一步"}
        </button>

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
