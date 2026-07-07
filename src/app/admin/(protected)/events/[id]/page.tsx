import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/db";
import { EventStatusBadge } from "@/components/StatusBadge";
import { formatDateTime, formatFee, formatAgeRange } from "@/lib/format";
import { GENDER_LABEL } from "@/lib/constants";

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <h1 style={{ fontSize: "var(--text-3xl)" }}>{event.title}</h1>
          <EventStatusBadge status={event.status} />
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <Link href={`/admin/events/${event.id}/edit`} className="btn-secondary">
            编辑
          </Link>
          <Link href={`/admin/events/${event.id}/registrations`} className="btn-primary">
            查看报名名册
          </Link>
        </div>
      </div>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
        {event.city} · {event.location}
      </p>

      <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "var(--space-4) var(--space-6)",
            fontSize: "var(--text-sm)",
          }}
        >
          <Field label="报名开始" value={formatDateTime(event.registrationStart)} />
          <Field label="报名截止" value={formatDateTime(event.registrationEnd)} />
          <Field label="赛事日期" value={formatDateTime(event.eventDate)} />
        </dl>
        <p style={{ marginTop: "var(--space-5)", fontSize: "var(--text-sm)" }}>{event.description}</p>
      </div>

      {event.schedules.map((schedule) => (
        <div key={schedule.id} className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-5)" }}>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-1)" }}>{schedule.name}</h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
            {schedule.distance}km · 起跑 {schedule.startTime} · 关门 {schedule.cutoffTime} · 名额 {schedule.capacity}
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>组别</th>
                  <th>性别</th>
                  <th>年龄</th>
                  <th>名额</th>
                  <th>报名费</th>
                  <th>已报名</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {schedule.groups.map((group) => (
                  <tr key={group.id}>
                    <td>{group.name}</td>
                    <td>{GENDER_LABEL[group.gender] ?? group.gender}</td>
                    <td>{formatAgeRange(group.minAge, group.maxAge)}</td>
                    <td>{group.capacity}</td>
                    <td>{formatFee(group.fee)}</td>
                    <td>{group._count.registrations}</td>
                    <td>{group.isOpen ? "开放" : "关闭"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>{label}</dt>
      <dd style={{ fontWeight: 600 }}>{value}</dd>
    </div>
  );
}
