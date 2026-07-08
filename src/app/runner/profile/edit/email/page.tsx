import { requireRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { EditEmailForm } from "../../EditEmailForm";
import Link from "next/link";

export default async function EditEmailPage() {
  const runner = await requireRunner("/runner/profile/edit/email");

  return (
    <>
      <SiteHeader showBackHome />
      <section style={{ padding: "var(--space-12) var(--space-6) var(--space-24)", background: "var(--color-paper)" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <Link
            href="/runner/profile/edit"
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
            ← 返回编辑选择
          </Link>

          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)", fontStyle: "italic" }}>修改邮箱</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-8)", fontFamily: "var(--font-mono)" }}>
            当前邮箱：{runner.email || "未设置"}
          </p>

          <div className="card notch" style={{ padding: "var(--space-8)" }}>
            <EditEmailForm />
          </div>
        </div>
      </section>
    </>
  );
}