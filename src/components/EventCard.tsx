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

  const serial = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/events/${id}`}
      className="card event-card stagger-enter visible"
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        padding: "var(--space-6) var(--space-6) var(--space-5) var(--space-8)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div style={{ fontFamily: "var(--font-mono)", color: "var(--color-blue)", fontWeight: 700, fontSize: "var(--text-xs)" }}>
          CHECKPOINT {serial} / {city}
        </div>
        <EventStatusBadge status={status} />
      </div>

      <div>
        <h3 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-3)", maxWidth: "13ch" }}>{title}</h3>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-mono)" }}>
          {dateLabel}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
          paddingTop: "var(--space-5)",
          marginTop: "var(--space-6)",
          borderTop: "1px dashed var(--color-border-strong)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
        }}
      >
        <span><strong style={{ color: "var(--color-text-primary)" }}>{groupCount}</strong> 个组别</span>
        <span><strong style={{ color: "var(--color-text-primary)" }}>{registrationCount}</strong> 人报名</span>
      </div>
    </Link>
  );
}
