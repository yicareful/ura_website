import { notFound } from "next/navigation";
import { getRegistrationById } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { RegistrationStatusBadge } from "@/components/StatusBadge";
import { GENDER_LABEL } from "@/lib/constants";
import { formatFee } from "@/lib/format";
import { markAsPaid } from "../../events/[id]/register/actions";

export default async function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const registration = await getRegistrationById(id);

  if (!registration) notFound();

  const boundMarkAsPaid = markAsPaid.bind(null, registration.id);

  return (
    <>
      <SiteHeader showBackHome />
      <section style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>ENTRY TICKET</p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "var(--text-5xl)", fontStyle: "italic" }}>报名详情</h1>
            <RegistrationStatusBadge status={registration.status} />
          </div>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-10)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: ".03em" }}>
            报名编号 / {registration.id}
          </p>

          <div className="card notch" style={{ padding: "var(--space-8)" }}>
            <h2 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-6)", fontStyle: "italic" }}>{registration.event.title}</h2>

            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "var(--space-5) var(--space-6)",
                fontSize: "var(--text-sm)",
              }}
            >
              <Field label="组别" value={`${registration.group.name}，${GENDER_LABEL[registration.gender] ?? registration.gender}`} />
              <Field label="距离" value={`${registration.group.distance}km`} />
              <Field label="起跑时间" value={registration.group.startTime} />
              <Field label="关门时间" value={registration.group.cutoffTime} />
              <Field label="姓名" value={registration.name} />
              <Field label="学校" value={registration.school} />
              <Field label="手机号" value={registration.phone} />
              <Field label="报名费" value={formatFee(registration.group.fee)} />
            </dl>

            {registration.status === "pending_payment" && (
              <div
                style={{
                  marginTop: "var(--space-8)",
                  paddingTop: "var(--space-6)",
                  borderTop: "1px dashed var(--color-border-strong)",
                }}
              >
                <p style={{ marginBottom: "var(--space-4)", color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-mono)" }}>
                  真实支付网关尚未接入，此按钮用于原型演示。模拟支付成功后，报名状态会更新。
                </p>
                <form action={boundMarkAsPaid}>
                  <button type="submit" className="btn-primary">
                    模拟支付 {formatFee(registration.group.fee)}
                  </button>
                </form>
              </div>
            )}

            {registration.status === "paid" && (
              <div
                style={{
                  marginTop: "var(--space-8)",
                  paddingTop: "var(--space-6)",
                  borderTop: "1px dashed var(--color-border-strong)",
                  color: "var(--color-success)",
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <span style={{ width: 10, height: 10, background: "var(--color-success)", borderRadius: "50%", display: "inline-block" }} />
                报名成功，请留意赛事通知。
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-1)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: ".03em", textTransform: "uppercase" }}>{label}</dt>
      <dd style={{ fontWeight: 800 }}>{value}</dd>
    </div>
  );
}