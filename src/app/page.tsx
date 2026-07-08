import { getEvents } from "@/lib/db";
import { getCurrentRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { EventCard } from "@/components/EventCard";

export default async function HomePage() {
  const events = await getEvents();
  const runner = await getCurrentRunner();

  const totalRunners = events.reduce((sum, e) => sum + e._count.registrations, 0);
  const totalDistance = events.reduce(
    (sum, e) => sum + e.groups.reduce((s, group) => s + group.distance, 0),
    0
  );

  return (
    <>
      <SiteHeader dark />
      <HeroSection
        eventCount={events.length}
        totalRunners={totalRunners}
        totalDistance={Math.round(totalDistance)}
        runner={runner}
      />

      <section className="section-light" style={{ padding: "var(--space-24) 0" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--space-10)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ fontSize: "var(--text-3xl)" }}>近期赛事</h2>
            <a href="/events" style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "var(--text-sm)" }}>
              查看全部 →
            </a>
          </div>

          {events.length === 0 ? (
            <p style={{ color: "var(--color-text-secondary)" }}>暂无赛事，请稍后再来查看。</p>
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