import { EventForm } from "./EventForm";

export default function NewEventPage() {
  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>NEW EVENT</p>
      <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-8)", fontStyle: "italic" }}>新建赛事</h1>
      <EventForm />
    </div>
  );
}