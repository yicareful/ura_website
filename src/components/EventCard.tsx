import Link from "next/link";
import { EventStatusBadge } from "./StatusBadge";

type EventCardProps = {
  id: string;
  title: string;
  city: string;
  eventDate: Date;
  status: string;
  groupCount: number;
  registrationCount: number;
  index: number;
};

export function EventCard({
  id,
  title,
  city,
  eventDate,
  status,
  groupCount,
  registrationCount,
  index,
}: EventCardProps) {
  const dateLabel = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(eventDate);

  return (
    <Link
      href={`/events/${id}`}
      className="card stagger-enter visible"
      style={{
        display: "block",
        padding: "var(--space-6)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            color: "var(--color-primary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {city}
        </span>
        <EventStatusBadge status={status} />
      </div>
      <h3 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-3)" }}>{title}</h3>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-5)" }}>
        {dateLabel}
      </p>
      <div
        style={{
          display: "flex",
          gap: "var(--space-6)",
          paddingTop: "var(--space-4)",
          borderTop: "1px solid var(--color-light-border)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
        }}
      >
        <span>{groupCount} 个组别</span>
        <span>{registrationCount} 人已报名</span>
      </div>
    </Link>
  );
}