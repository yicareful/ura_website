import { getEvents } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { EventCard } from "@/components/EventCard";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <SiteHeader showBackHome />
      <section style={{ padding: "calc(var(--header-h) + var(--space-12)) 0 var(--space-24)" }}>
        <div className="container">
          <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-3)" }}>全部赛事</h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-10)" }}>
            浏览所有已发布的长跑赛事，选择适合的报名组别。
          </p>

          {events.length === 0 ? (
            <p style={{ color: "var(--color-text-secondary)" }}>暂无赛事。</p>
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