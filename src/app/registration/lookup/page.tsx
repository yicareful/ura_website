import { SiteHeader } from "@/components/SiteHeader";
import { LookupForm } from "./LookupForm";

export default async function LookupPage() {
  return (
    <>
      <SiteHeader showBackHome />
      <section style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>REGISTRATION LOOKUP</p>
          <h1 style={{ fontSize: "var(--text-5xl)", marginBottom: "var(--space-3)", fontStyle: "italic" }}>查询我的报名</h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-10)", fontSize: "var(--text-lg)" }}>
            输入报名时填写的身份证号与手机号，查看报名状态。
          </p>
          <LookupForm />
        </div>
      </section>
    </>
  );
}