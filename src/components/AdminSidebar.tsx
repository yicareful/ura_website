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
        width: 220,
        flexShrink: 0,
        background: "var(--color-dark-base)",
        color: "var(--color-text-on-dark)",
        minHeight: "100vh",
        padding: "var(--space-6) var(--space-4)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link
        href="/admin"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "var(--text-lg)",
          marginBottom: "var(--space-1)",
          display: "block",
        }}
      >
        URA 管理后台
      </Link>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-on-dark-muted)", marginBottom: "var(--space-8)" }}>
        简易验证 · 非生产级安全
      </p>

      <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
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
