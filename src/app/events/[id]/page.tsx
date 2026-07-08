import { notFound } from "next/navigation";
import { getEventById } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { EventStatusBadge } from "@/components/StatusBadge";
import { GroupTable } from "@/components/GroupTable";
import { formatDateTime } from "@/lib/format";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  const canRegister = event.status === "open";

  return (
    <>
      <SiteHeader showBackHome />
      <section
        className="section-dark"
        style={{ padding: "calc(var(--header-h) + var(--space-12)) 0 var(--space-16)" }}
      >
        <div className="container">
          <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", marginBottom: "var(--space-4)" }}>
            <EventStatusBadge status={event.status} />
            <span style={{ color: "var(--color-text-on-dark-muted)", fontSize: "var(--text-sm)" }}>
              {event.city} · {event.location}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", marginBottom: "var(--space-5)", maxWidth: "20ch" }}>
            {event.title}
          </h1>
          <p style={{ color: "var(--color-text-on-dark-muted)", maxWidth: "60ch", fontSize: "var(--text-lg)" }}>
            {event.description}
          </p>

          <div
            style={{
              marginTop: "var(--space-10)",
              display: "flex",
              gap: "var(--space-10)",
              flexWrap: "wrap",
              fontSize: "var(--text-sm)",
            }}
          >
            <div>
              <div style={{ color: "var(--color-text-on-dark-muted)", marginBottom: "var(--space-1)" }}>比赛日期</div>
              <div style={{ fontWeight: 600 }}>{formatDateTime(event.eventDate)}</div>
            </div>
            <div>
              <div style={{ color: "var(--color-text-on-dark-muted)", marginBottom: "var(--space-1)" }}>报名截止</div>
              <div style={{ fontWeight: 600 }}>{formatDateTime(event.registrationEnd)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light" style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container">
          <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-8)" }}>报名组别</h2>

          {!canRegister && (
            <div
              className="badge badge-muted"
              style={{ marginBottom: "var(--space-6)", padding: "var(--space-3) var(--space-5)", display: "inline-block" }}
            >
              该赛事当前不可报名
            </div>
          )}

          <GroupTable eventId={event.id} groups={event.groups} interactive={canRegister} />
        </div>
      </section>
    </>
  );
}