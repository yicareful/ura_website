import { notFound } from "next/navigation";
import { getEventById } from "@/lib/db";
import { requireRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { RegistrationForm } from "@/components/RegistrationForm";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ groupId?: string }>;
}) {
  const { id } = await params;
  const { groupId } = await searchParams;

  const runner = await requireRunner(`/events/${id}/register${groupId ? `?groupId=${groupId}` : ""}`);

  const event = await getEventById(id);

  if (!event) notFound();
  if (event.status !== "open") notFound();

  const groups = event.groups.map((group) => ({
    id: group.id,
    name: group.name,
    distance: group.distance,
    startTime: group.startTime,
    cutoffTime: group.cutoffTime,
    gender: group.gender,
    minAge: group.minAge,
    maxAge: group.maxAge,
    fee: group.fee,
    remaining: group.isOpen ? group.capacity - group._count.registrations : 0,
  }));

  return (
    <>
      <SiteHeader showBackHome />
      <section style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>REGISTRATION FORM</p>
          <h1 style={{ fontSize: "var(--text-5xl)", marginBottom: "var(--space-3)", fontStyle: "italic" }}>报名 · {event.title}</h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-10)", fontSize: "var(--text-lg)" }}>
            请核对个人信息并补充紧急联系人。提交后可在“我的报名”中查看状态。
          </p>

          <RegistrationForm eventId={event.id} groups={groups} defaultGroupId={groupId} runner={runner} />
        </div>
      </section>
    </>
  );
}