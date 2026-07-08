import Link from "next/link";
import { getCurrentRunner } from "@/lib/runner-auth";
import { logoutAction } from "@/app/runner/login/actions";

export async function SiteHeader({
  dark = false,
  showBackHome = false,
}: {
  dark?: boolean;
  showBackHome?: boolean;
}) {
  const runner = await getCurrentRunner();

  const textColor = dark ? "var(--color-text-on-dark)" : "var(--color-text-primary)";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        minHeight: "72px",
        display: "flex",
        alignItems: "center",
        background: dark ? "rgba(23,25,26,0.88)" : "rgba(246,247,242,0.9)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.14)" : "var(--color-border)"}`,
        color: textColor,
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-5)", flexWrap: "wrap", paddingTop: "var(--space-3)", paddingBottom: "var(--space-3)" }}
      >
        {showBackHome ? (
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "var(--text-xs)",
              color: dark ? "var(--color-text-on-dark-muted)" : "var(--color-text-secondary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            ← 返回首页
          </Link>
        ) : (
          <Link
            href="/"
            style={{
              display: "inline-grid",
              lineHeight: 1,
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "var(--text-2xl)",
            }}
          >
            <span>URA</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: dark ? "var(--color-yellow)" : "var(--color-blue)" }}>
              RACE CONTROL
            </span>
          </Link>
        )}

        <nav style={{ display: "flex", gap: "var(--space-6)", fontSize: "var(--text-sm)", fontWeight: 700, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/events">赛事</Link>
          <Link href="/runner/my-registrations">我的报名</Link>
          <Link href="/admin">管理后台</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
          {runner ? (
            <>
              <Link
                href="/runner/profile"
                className="header-runner-badge"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  background: dark ? "rgba(242,200,75,0.16)" : "#fff8da",
                  color: dark ? "var(--color-yellow)" : "var(--color-asphalt)",
                  border: `1px solid ${dark ? "rgba(242,200,75,0.42)" : "rgba(197,133,18,0.28)"}`,
                  transition: "transform var(--duration-fast) var(--ease-smooth), box-shadow var(--duration-fast) var(--ease-smooth)",
                  display: "inline-block",
                }}
              >
                {runner.school} · {runner.name}
              </Link>
              <form action={logoutAction} style={{ display: "inline" }}>
                <button
                  type="submit"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    padding: 0,
                  }}
                >
                  退出
                </button>
              </form>
            </>
          ) : (
            <Link href="/runner/login" style={{ fontWeight: 800 }}>登录</Link>
          )}
        </div>
      </div>
    </header>
  );
}
