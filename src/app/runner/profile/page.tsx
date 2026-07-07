import { requireRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";

export default async function ProfilePage() {
  const runner = await requireRunner("/runner/profile");

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
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "var(--space-2)",
            }}
          >
            <h1 style={{ fontSize: "var(--text-2xl)" }}>个人信息</h1>
            <Link
              href="/runner/profile/edit"
              className="btn-secondary"
              style={{ fontSize: "var(--text-sm)", padding: "var(--space-2) var(--space-5)" }}
            >
              编辑
            </Link>
          </div>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-10)",
            }}
          >
            查看你的账号信息，点击"编辑"修改邮箱或密码
          </p>

          {/* 基本信息（只读） */}
          <div
            className="card"
            style={{ padding: "var(--space-8)" }}
          >
            <h2
              style={{
                fontSize: "var(--text-lg)",
                marginBottom: "var(--space-6)",
              }}
            >
              基本信息
            </h2>
            <div className="form-row" style={{ marginBottom: "var(--space-5)" }}>
              <InfoField label="姓名" value={runner.name} />
              <InfoField
                label="性别"
                value={runner.gender === "male" ? "男" : "女"}
              />
            </div>
            <div className="form-row" style={{ marginBottom: "var(--space-5)" }}>
              <InfoField label="手机号" value={runner.phone} />
              <InfoField label="身份证号" value={runner.idCard} />
            </div>
            <div className="form-row" style={{ marginBottom: "var(--space-5)" }}>
              <InfoField label="邮箱" value={runner.email || "未设置"} />
              <InfoField label="" value="" />
            </div>
            <div className="form-row">
              <InfoField label="学校" value={runner.school} />
              <InfoField label="院系/专业" value={runner.major || "未填写"} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label" style={{ fontSize: "var(--text-xs)" }}>
        {label}
      </label>
      <p
        style={{
          fontSize: "var(--text-base)",
          fontWeight: 500,
          color: "var(--color-text-primary)",
          padding: "var(--space-2) 0",
        }}
      >
        {value}
      </p>
    </div>
  );
}
