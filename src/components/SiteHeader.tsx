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
        minHeight: "var(--header-h)",
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
        borderBottom: `2px solid ${dark ? "rgba(255,255,255,0.12)" : "var(--color-asphalt)"}`,
      }}
    >
      {/* signal line */}
      <div aria-hidden style={{ height: 3, background: "linear-gradient(90deg, var(--color-red), var(--color-yellow) 38%, var(--color-blue))", flexShrink: 0 }} />
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          background: dark ? "rgba(11,13,16,0.9)" : "rgba(241,242,236,0.92)",
          backdropFilter: "blur(14px)",
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
                letterSpacing: ".03em",
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
                fontStyle: "italic",
                letterSpacing: "-.02em",
              }}
            >
              <span>URA</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontStyle: "normal", color: dark ? "var(--color-yellow)" : "var(--color-red)", letterSpacing: ".1em" }}>
                RACE CONTROL
              </span>
            </Link>
          )}

          <nav style={{ display: "flex", gap: "var(--space-6)", fontSize: "var(--text-sm)", fontWeight: 700, alignItems: "center", flexWrap: "wrap", fontFamily: "var(--font-display)" }}>
            <Link href="/events" style={{ textTransform: "uppercase", letterSpacing: ".02em" }}>赛事</Link>
            <Link href="/runner/my-registrations" style={{ textTransform: "uppercase", letterSpacing: ".02em" }}>我的报名</Link>
            <Link href="/admin" style={{ textTransform: "uppercase", letterSpacing: ".02em" }}>管理后台</Link>
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
                    borderRadius: "var(--radius-sm)",
                    background: dark ? "rgba(242,200,75,0.16)" : "#fff6d6",
                    color: dark ? "var(--color-yellow)" : "var(--color-asphalt)",
                    border: `1px solid ${dark ? "rgba(242,200,75,0.42)" : "rgba(197,133,18,0.3)"}`,
                    transition: "transform var(--duration-fast) var(--ease-smooth), box-shadow var(--duration-fast) var(--ease-smooth)",
                    display: "inline-block",
                    letterSpacing: ".02em",
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
                      fontFamily: "var(--font-display)",
                      textTransform: "uppercase",
                      letterSpacing: ".02em",
                    }}
                  >
                    退出
                  </button>
                </form>
              </>
            ) : (
              <Link href="/runner/login" style={{ fontWeight: 800, fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: ".02em", fontSize: "var(--text-base)" }}>登录</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}