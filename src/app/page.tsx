import { getEvents } from "@/lib/db";
import { getCurrentRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { EventCard } from "@/components/EventCard";
import { NewsSection } from "@/components/NewsSection";

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

      <section className="section-light" style={{ padding: "var(--space-20) 0 var(--space-24)" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--space-12)", display: "flex", justifyContent: "space-between", alignItems: "end", gap: "var(--space-6)", flexWrap: "wrap" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>OPEN RACE WINDOWS</p>
              <h2 style={{ fontSize: "var(--text-6xl)", fontStyle: "italic" }}>近期赛事</h2>
            </div>
            <a href="/events" className="btn-secondary">
              查看全部赛事
            </a>
          </div>

          {events.length === 0 ? (
            <div className="card" style={{ padding: "var(--space-10)", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
              暂无赛事，请稍后再来查看。
            </div>
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

      <NewsSection />
    </>
  );
}