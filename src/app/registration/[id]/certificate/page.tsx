import { notFound } from "next/navigation";
import Link from "next/link";
import { getRegistrationById } from "@/lib/db";
import { simulateFinish } from "@/lib/certificate";
import { formatDate } from "@/lib/format";
import { GENDER_LABEL } from "@/lib/constants";
import { SiteHeader } from "@/components/SiteHeader";
import { PrintButton } from "./PrintButton";
import { getCertificateTemplate } from "@/components/certificates";
import type { CertificateData } from "@/components/certificates/types";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const registration = await getRegistrationById(id);

  if (!registration) notFound();
  if (registration.event.status !== "finished") notFound();
  if (registration.status !== "paid") notFound();

  const { event, group } = registration;
  const finish = simulateFinish(registration.id, group.distance, group.startTime);
  const issued = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date());

  // System stays decoupled: only the slug decides which template renders the
  // sheet. The page below just assembles data + the shared chrome (top bar,
  // footer note) around whatever template the event owns.
  const Template = getCertificateTemplate(event.slug);

  const data: CertificateData = {
    registrationId: registration.id,
    bib: registration.id.slice(-8).toUpperCase(),
    name: registration.name,
    genderLabel: GENDER_LABEL[registration.gender] ?? registration.gender,
    school: registration.school,
    eventTitle: event.title,
    eventSlug: event.slug,
    eventCity: event.city,
    eventLocation: event.location,
    eventDateLabel: formatDate(event.eventDate),
    groupName: group.name,
    distance: group.distance,
    startTime: group.startTime,
    finish,
    issued,
  };

  return (
    <>
      <SiteHeader showBackHome />
      <section className="cert-wrap">
        <div style={{ maxWidth: 1000, margin: "0 auto var(--space-6)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }} className="cert-no-print">
          <Link href={`/registration/${registration.id}`} style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", letterSpacing: ".03em" }}>
            ← 返回报名详情
          </Link>
          <PrintButton />
        </div>

        <Template data={data} />

        <p style={{ maxWidth: 1000, margin: "var(--space-6) auto 0", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textAlign: "center" }} className="cert-no-print">
          成绩为模拟数据，正式计时系统尚未接入。证书编号 {registration.id}
        </p>
      </section>
    </>
  );
}