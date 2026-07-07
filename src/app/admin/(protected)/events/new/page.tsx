import { EventForm } from "./EventForm";

export default function NewEventPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-8)" }}>新建赛事</h1>
      <EventForm />
    </div>
  );
}
