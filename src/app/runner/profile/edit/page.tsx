import { requireRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";

export default async function EditIndexPage() {
  const runner = await requireRunner("/runner/profile/edit");

  return (
    <>
      <SiteHeader showBackHome />
      <section style={{ padding: "var(--space-12) var(--space-6) var(--space-24)", background: "var(--color-paper)" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <Link
            href="/runner/profile"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "var(--text-xs)",
              color: "var(--color-text-secondary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-1)",
              marginBottom: "var(--space-8)",
              letterSpacing: ".03em",
            }}
          >
            ← 返回个人信息
          </Link>

          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-1)", fontStyle: "italic" }}>编辑信息</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-8)" }}>
            选择你要修改的内容。
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <Link href="/runner/profile/edit/email" className="card notch" style={{ padding: "var(--space-6)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: "var(--text-base)", marginBottom: "var(--space-1)", fontFamily: "var(--font-display)", fontWeight: 700 }}>修改邮箱</h2>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-mono)" }}>
                  当前：{runner.email || "未设置"}
                </p>
              </div>
              <span style={{ color: "var(--color-red)", fontSize: "var(--text-lg)", fontFamily: "var(--font-display)", fontWeight: 800 }}>→</span>
            </Link>

            <Link href="/runner/profile/edit/password" className="card notch" style={{ padding: "var(--space-6)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: "var(--text-base)", marginBottom: "var(--space-1)", fontFamily: "var(--font-display)", fontWeight: 700 }}>修改密码</h2>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-mono)" }}>
                  需要验证当前密码
                </p>
              </div>
              <span style={{ color: "var(--color-red)", fontSize: "var(--text-lg)", fontFamily: "var(--font-display)", fontWeight: 800 }}>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}