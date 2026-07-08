import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventById } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getCurrentRunner } from "@/lib/runner-auth";
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

  // For finished events: if the logged-in runner has a paid registration here,
  // surface a finisher-certificate entry.
  const runner = await getCurrentRunner();
  let myRegistrationId: string | null = null;
  if (runner && event.status === "finished") {
    const reg = await prisma.registration.findFirst({
      where: { eventId: event.id, runnerId: runner.id, status: "paid" },
      select: { id: true },
    });
    myRegistrationId = reg?.id ?? null;
  }

  return (
    <>
      <SiteHeader showBackHome />
      <section
        className="section-dark"
        style={{ padding: "var(--space-16) 0 var(--space-20)", position: "relative", overflow: "hidden" }}
      >
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)", gap: "var(--space-12)", alignItems: "end" }}>
            <div>
              <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", marginBottom: "var(--space-5)", flexWrap: "wrap" }}>
                <EventStatusBadge status={event.status} />
                <span style={{ color: "var(--color-text-on-dark-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: ".03em", textTransform: "uppercase" }}>
                  {event.city} / {event.location}
                </span>
              </div>
              <h1 style={{ fontSize: "var(--text-6xl)", marginBottom: "var(--space-6)", maxWidth: "14ch", fontStyle: "italic" }}>
                {event.title}
              </h1>
              <p style={{ color: "var(--color-text-on-dark-muted)", maxWidth: "62ch", fontSize: "var(--text-lg)" }}>
                {event.description}
              </p>
            </div>

            <div className="race-window notch">
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--color-yellow)", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-5)", letterSpacing: ".06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <span style={{ width: 8, height: 8, background: "var(--color-red)", borderRadius: "50%", display: "inline-block" }} />
                RACE WINDOW
              </div>
              <div style={{ display: "grid", gap: "var(--space-5)" }}>
                <div>
                  <div style={{ color: "var(--color-text-on-dark-muted)", marginBottom: "var(--space-1)", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".03em" }}>比赛日期</div>
                  <div style={{ fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "var(--text-xl)" }}>{formatDateTime(event.eventDate)}</div>
                </div>
                <div>
                  <div style={{ color: "var(--color-text-on-dark-muted)", marginBottom: "var(--space-1)", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".03em" }}>报名截止</div>
                  <div style={{ fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "var(--text-xl)" }}>{formatDateTime(event.registrationEnd)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light" style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container">
          {event.status === "finished" && myRegistrationId && (
            <div
              className="card notch"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-5)",
                flexWrap: "wrap",
                padding: "var(--space-6) var(--space-8)",
                marginBottom: "var(--space-8)",
                borderLeft: "4px solid var(--color-red)",
              }}
            >
              <div>
                <p className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>RESULTS / 完赛证书</p>
                <div style={{ fontWeight: 800, fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontStyle: "italic" }}>你已完赛</div>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-mono)", marginTop: "var(--space-2)" }}>
                  查看并打印你的电子完赛证书。
                </p>
              </div>
              <Link href={`/registration/${myRegistrationId}/certificate`} className="btn-primary">
                查看完赛证书
              </Link>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-6)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>START LIST</p>
              <h2 style={{ fontSize: "var(--text-4xl)", fontStyle: "italic" }}>报名组别</h2>
            </div>

            {!canRegister && event.status !== "finished" && (
              <div className="badge badge-muted" style={{ padding: "var(--space-3) var(--space-5)" }}>
                该赛事当前不可报名
              </div>
            )}
            {event.status === "finished" && (
              <div className="badge badge-muted" style={{ padding: "var(--space-3) var(--space-5)" }}>
                赛事已完赛
              </div>
            )}
          </div>

          <GroupTable eventId={event.id} groups={event.groups} interactive={canRegister} />
        </div>
      </section>
    </>
  );
}