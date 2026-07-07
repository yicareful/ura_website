import { notFound } from "next/navigation";
import { getEventById } from "@/lib/db";
import { EditEventForm } from "./EditEventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-8)" }}>编辑赛事</h1>
      <EditEventForm event={event} />
    </div>
  );
}
