import { getEvents } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { EventCard } from "@/components/EventCard";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <SiteHeader showBackHome />
      <section style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container">
          <div style={{ maxWidth: 760, marginBottom: "var(--space-12)" }}>
            <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-blue)", fontWeight: 700, fontSize: "var(--text-xs)", marginBottom: "var(--space-2)" }}>
              EVENT BOARD
            </p>
            <h1 style={{ fontSize: "var(--text-6xl)", marginBottom: "var(--space-4)" }}>全部赛事</h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-lg)" }}>
              浏览已发布的长跑赛事，进入详情后选择适合的报名组别。
            </p>
          </div>

          {events.length === 0 ? (
            <div className="card" style={{ padding: "var(--space-8)", color: "var(--color-text-secondary)" }}>暂无赛事。</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "var(--space-6)",
              }}
            >
              {events.map((event, i) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  city={event.city}
                  eventDate={event.eventDate}
                  status={event.status}
                  groupCount={event.groups.length}
                  registrationCount={event._count.registrations}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
