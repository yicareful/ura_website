import { requireRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { EditPasswordForm } from "../../EditPasswordForm";
import Link from "next/link";

export default async function EditPasswordPage() {
  await requireRunner("/runner/profile/edit/password");

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
            修改密码
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-8)",
            }}
          >
            为了安全，修改密码需要验证当前密码
          </p>

          <EditPasswordForm />
        </div>
      </section>
    </>
  );
}
