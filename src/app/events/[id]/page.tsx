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
        style={{ padding: "var(--space-16) 0 var(--space-20)", position: "relative", overflow: "hidden" }}
      >
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 360px)", gap: "var(--space-12)", alignItems: "end" }}>
            <div>
              <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", marginBottom: "var(--space-5)", flexWrap: "wrap" }}>
                <EventStatusBadge status={event.status} />
                <span style={{ color: "var(--color-text-on-dark-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                  {event.city} · {event.location}
                </span>
              </div>
              <h1 style={{ fontSize: "var(--text-6xl)", marginBottom: "var(--space-6)", maxWidth: "13ch" }}>
                {event.title}
              </h1>
              <p style={{ color: "var(--color-text-on-dark-muted)", maxWidth: "62ch", fontSize: "var(--text-lg)" }}>
                {event.description}
              </p>
            </div>

            <div className="card-dark" style={{ padding: "var(--space-6)", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--color-yellow)", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-5)" }}>
                RACE WINDOW
              </div>
              <div style={{ display: "grid", gap: "var(--space-5)" }}>
                <div>
                  <div style={{ color: "var(--color-text-on-dark-muted)", marginBottom: "var(--space-1)", fontSize: "var(--text-sm)" }}>比赛日期</div>
                  <div style={{ fontWeight: 700 }}>{formatDateTime(event.eventDate)}</div>
                </div>
                <div>
                  <div style={{ color: "var(--color-text-on-dark-muted)", marginBottom: "var(--space-1)", fontSize: "var(--text-sm)" }}>报名截止</div>
                  <div style={{ fontWeight: 700 }}>{formatDateTime(event.registrationEnd)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light" style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-6)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-blue)", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-2)" }}>GROUPS</p>
              <h2 style={{ fontSize: "var(--text-4xl)" }}>报名组别</h2>
            </div>

            {!canRegister && (
              <div className="badge badge-muted" style={{ padding: "var(--space-3) var(--space-5)" }}>
                该赛事当前不可报名
              </div>
            )}
          </div>

          <GroupTable eventId={event.id} groups={event.groups} interactive={canRegister} />
        </div>
      </section>
    </>
  );
}
