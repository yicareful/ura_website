import Link from "next/link";
import { adminLogout } from "@/app/admin/login/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/events", label: "赛事管理" },
];

export function AdminSidebar() {
  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: "var(--color-asphalt)",
        color: "var(--color-text-on-dark)",
        minHeight: "100vh",
        padding: "var(--space-6) var(--space-4)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "var(--text-xs)",
          color: "var(--color-text-on-dark-muted)",
          marginBottom: "var(--space-6)",
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
      >
        ← 返回首页
      </Link>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 800, lineHeight: 1 }}>URA</div>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-yellow)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
          RACE OPERATIONS
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              fontWeight: 800,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            className="admin-nav-link"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <form action={adminLogout}>
        <button
          type="submit"
          className="btn-ghost-dark"
          style={{ width: "100%", fontSize: "var(--text-sm)" }}
        >
          退出登录
        </button>
      </form>
    </aside>
  );
}
