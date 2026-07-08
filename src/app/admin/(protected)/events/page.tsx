import Link from "next/link";
import { getEventsForAdmin } from "@/lib/db";
import { EventStatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";

export default async function AdminEventsPage() {
  const events = await getEventsForAdmin();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "var(--space-6)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-blue)", fontWeight: 700, fontSize: "var(--text-xs)", marginBottom: "var(--space-2)" }}>
            EVENT OPERATIONS
          </p>
          <h1 style={{ fontSize: "var(--text-5xl)" }}>赛事管理</h1>
        </div>
        <Link href="/admin/events/new" className="btn-primary">
          新建赛事
        </Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th>城市</th>
              <th>赛事日期</th>
              <th>状态</th>
              <th>组别数</th>
              <th>报名数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td style={{ fontWeight: 700 }}>{event.title}</td>
                <td>{event.city}</td>
                <td>{formatDate(event.eventDate)}</td>
                <td>
                  <EventStatusBadge status={event.status} />
                </td>
                <td>{event._count.groups}</td>
                <td>{event._count.registrations}</td>
                <td style={{ display: "flex", gap: "var(--space-3)" }}>
                  <Link href={`/admin/events/${event.id}`}>查看</Link>
                  <Link href={`/admin/events/${event.id}/edit`}>编辑</Link>
                  <Link href={`/admin/events/${event.id}/registrations`}>名册</Link>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--color-text-secondary)" }}>
                  暂无赛事
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
