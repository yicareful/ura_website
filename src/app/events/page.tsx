import { getEvents } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { EventCard } from "@/components/EventCard";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <SiteHeader showBackHome />
      <section className="section-dark" style={{ padding: "var(--space-16) 0 var(--space-20)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <p className="eyebrow eyebrow--yellow" style={{ marginBottom: "var(--space-3)" }}>EVENT BOARD</p>
          <h1 style={{ fontSize: "var(--text-6xl)", marginBottom: "var(--space-4)", fontStyle: "italic" }}>全部赛事</h1>
          <p style={{ color: "var(--color-text-on-dark-muted)", fontSize: "var(--text-lg)", maxWidth: "56ch" }}>
            浏览已发布的长跑赛事，进入详情后选择适合的报名组别。
          </p>
        </div>
      </section>

      <section className="section-light" style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container">
          {events.length === 0 ? (
            <div className="card" style={{ padding: "var(--space-10)", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>暂无赛事。</div>
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