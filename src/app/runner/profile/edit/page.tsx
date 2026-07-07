import { requireRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";

export default async function EditIndexPage() {
  const runner = await requireRunner("/runner/profile/edit");

  return (
    <>
      <SiteHeader showBackHome />
      <section
        style={{
          minHeight: "calc(100vh - var(--header-h))",
          background: "var(--color-light-base)",
          padding: "var(--space-10) var(--space-6)",
        }}
      >
        <div className="container" style={{ maxWidth: 640 }}>
          <Link
            href="/runner/profile"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-1)",
              marginBottom: "var(--space-8)",
            }}
          >
            ← 返回个人信息
          </Link>

          <h1
            style={{
              fontSize: "var(--text-2xl)",
              marginBottom: "var(--space-1)",
            }}
          >
            编辑信息
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-8)",
            }}
          >
            选择你要修改的内容
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <Link
              href="/runner/profile/edit/email"
              className="card"
              style={{
                padding: "var(--space-6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ fontSize: "var(--text-base)", marginBottom: "var(--space-1)" }}>
                  修改邮箱
                </h2>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
                  当前：{runner.email || "未设置"}
                </p>
              </div>
              <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-lg)" }}>→</span>
            </Link>

            <Link
              href="/runner/profile/edit/password"
              className="card"
              style={{
                padding: "var(--space-6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ fontSize: "var(--text-base)", marginBottom: "var(--space-1)" }}>
                  修改密码
                </h2>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
                  需要验证当前密码
                </p>
              </div>
              <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-lg)" }}>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
