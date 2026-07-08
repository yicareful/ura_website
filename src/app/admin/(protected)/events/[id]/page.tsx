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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)", flexWrap: "wrap", gap: "var(--space-3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <h1 style={{ fontSize: "var(--text-3xl)", fontStyle: "italic" }}>{event.title}</h1>
          <EventStatusBadge status={event.status} />
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <Link href={`/admin/events/${event.id}/edit`} className="btn-secondary">编辑</Link>
          <Link href={`/admin/events/${event.id}/registrations`} className="btn-primary">查看报名名册</Link>
        </div>
      </div>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: ".03em", textTransform: "uppercase" }}>
        {event.city} / {event.location}
      </p>

      <div className="card notch" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-5) var(--space-6)", fontSize: "var(--text-sm)" }}>
          <Field label="报名开始" value={formatDateTime(event.registrationStart)} />
          <Field label="报名截止" value={formatDateTime(event.registrationEnd)} />
          <Field label="赛事日期" value={formatDateTime(event.eventDate)} />
        </dl>
        <p style={{ marginTop: "var(--space-5)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{event.description}</p>
      </div>

      <div className="card notch" style={{ padding: "var(--space-6)", marginBottom: "var(--space-5)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--color-text-secondary)" }}>报名组别</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>组别</th>
                <th>距离</th>
                <th>起跑</th>
                <th>关门</th>
                <th>性别</th>
                <th>年龄</th>
                <th>名额</th>
                <th>报名费</th>
                <th>已报名</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {event.groups.map((group) => (
                <tr key={group.id}>
                  <td>{group.name}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{group.distance}km</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{group.startTime}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{group.cutoffTime}</td>
                  <td>{GENDER_LABEL[group.gender] ?? group.gender}</td>
                  <td>{formatAgeRange(group.minAge, group.maxAge)}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{group.capacity}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{formatFee(group.fee)}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{group._count.registrations}</td>
                  <td>{group.isOpen ? "开放" : "关闭"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-1)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: ".03em", textTransform: "uppercase" }}>{label}</dt>
      <dd style={{ fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "var(--text-lg)" }}>{value}</dd>
    </div>
  );
}