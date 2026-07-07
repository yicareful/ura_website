import { SiteHeader } from "@/components/SiteHeader";
import { LookupForm } from "./LookupForm";

export default async function LookupPage() {
  return (
    <>
      <SiteHeader />
      <section style={{ padding: "calc(var(--header-h) + var(--space-12)) 0 var(--space-24)" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>查询我的报名</h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-10)" }}>
            输入报名时填写的身份证号与手机号，查看报名状态。
          </p>
          <LookupForm />
        </div>
      </section>
    </>
  );
}
