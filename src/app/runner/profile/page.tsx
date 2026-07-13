import { requireRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";

export default async function ProfilePage() {
  const runner = await requireRunner("/runner/profile");

  return (
    <>
      <SiteHeader showBackHome />
      <section style={{ padding: "var(--space-12) var(--space-6) var(--space-24)", background: "var(--color-paper)" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
            <h1 style={{ fontSize: "var(--text-3xl)", fontStyle: "italic" }}>个人信息</h1>
            <Link href="/runner/profile/edit" className="btn-secondary" style={{ fontSize: "var(--text-sm)", padding: "var(--space-2) var(--space-5)" }}>
              编辑
            </Link>
          </div>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-10)" }}>
            查看你的账号信息，点击“编辑”修改邮箱或密码。
          </p>

          <div className="card notch" style={{ padding: "var(--space-8)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
              <h2 style={{ fontSize: "var(--text-lg)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--color-text-secondary)" }}>基本信息</h2>
              <span title="URA ID（不可更改）" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: ".04em", color: "var(--color-text-secondary)", padding: "var(--space-2) var(--space-3)", border: "1px solid var(--color-asphalt)", borderRadius: "var(--radius-sm)", background: "var(--color-surface)", whiteSpace: "nowrap" }}>
                URA ID <span style={{ color: "var(--color-red)", letterSpacing: ".08em" }}>{String(runner.uraId ?? "").padStart(5, "0")}</span>
              </span>
            </div>
            <div className="form-row" style={{ marginBottom: "var(--space-5)" }}>
              <InfoField label="姓名" value={runner.name} />
              <InfoField label="性别" value={runner.gender === "male" ? "男" : "女"} />
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
      <label className="form-label" style={{ fontSize: "var(--text-xs)" }}>{label}</label>
      <p style={{ fontSize: "var(--text-base)", fontWeight: 500, color: "var(--color-text-primary)", padding: "var(--space-2) 0" }}>{value}</p>
    </div>
  );
}