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

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "var(--header-h)",
        display: "flex",
        alignItems: "center",
        background: dark ? "rgba(10,10,15,0.8)" : "rgba(250,250,249,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${dark ? "var(--color-dark-border)" : "var(--color-light-border)"}`,
        color: dark ? "var(--color-text-on-dark)" : "var(--color-text-primary)",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        {showBackHome ? (
          <Link
            href="/"
            style={{
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
        ) : (
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-xl)",
              letterSpacing: "-0.02em",
            }}
          >
            URA
          </Link>
        )}
        <nav style={{ display: "flex", gap: "var(--space-8)", fontSize: "var(--text-sm)", fontWeight: 500, alignItems: "center" }}>
          <Link href="/events">赛事</Link>
          <Link href="/runner/my-registrations">我的报名</Link>
          <Link href="/admin">管理后台</Link>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          {runner ? (
            <>
              <Link
                href="/runner/profile"
                className="header-runner-badge"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  padding: "var(--space-1) var(--space-4)",
                  borderRadius: "var(--radius-full)",
                  background: "var(--accent-gradient)",
                  color: "#fff",
                  letterSpacing: "0.02em",
                  boxShadow: "0 0 12px rgba(255,91,46,0.3)",
                  transition: "transform var(--duration-fast) var(--ease-spring), box-shadow var(--duration-fast) var(--ease-smooth)",
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
                    fontWeight: 500,
                    padding: 0,
                  }}
                >
                  退出
                </button>
              </form>
            </>
          ) : (
            <Link href="/runner/login">登录</Link>
          )}
        </div>
      </div>
    </header>
  );
}