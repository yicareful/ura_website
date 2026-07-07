import { requireRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { EditEmailForm } from "../../EditEmailForm";
import Link from "next/link";

export default async function EditEmailPage() {
  const runner = await requireRunner("/runner/profile/edit/email");

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
            href="/runner/profile/edit"
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
            ← 返回编辑选择
          </Link>

          <h1
            style={{
              fontSize: "var(--text-2xl)",
              marginBottom: "var(--space-2)",
            }}
          >
            修改邮箱
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-8)",
            }}
          >
            当前邮箱：{runner.email || "未设置"}
          </p>

          <EditEmailForm />
        </div>
      </section>
    </>
  );
}
