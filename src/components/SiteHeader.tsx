import Link from "next/link";

export function SiteHeader({ dark = false }: { dark?: boolean }) {
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
        <nav style={{ display: "flex", gap: "var(--space-8)", fontSize: "var(--text-sm)", fontWeight: 500 }}>
          <Link href="/events">赛事</Link>
          <Link href="/registration/lookup">查询报名</Link>
          <Link href="/admin">管理后台</Link>
        </nav>
      </div>
    </header>
  );
}
