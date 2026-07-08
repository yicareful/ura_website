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
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>EVENT OPERATIONS</p>
          <h1 style={{ fontSize: "var(--text-5xl)", fontStyle: "italic" }}>赛事管理</h1>
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
                <td style={{ fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "var(--text-base)" }}>{event.title}</td>
                <td>{event.city}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{formatDate(event.eventDate)}</td>
                <td><EventStatusBadge status={event.status} /></td>
                <td>{event._count.groups}</td>
                <td>{event._count.registrations}</td>
                <td>
                  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".03em" }}>
                    <Link href={`/admin/events/${event.id}`} style={{ color: "var(--color-blue)", fontWeight: 700 }}>查看</Link>
                    <Link href={`/admin/events/${event.id}/edit`} style={{ color: "var(--color-text-secondary)", fontWeight: 700 }}>编辑</Link>
                    <Link href={`/admin/events/${event.id}/registrations`} style={{ color: "var(--color-red)", fontWeight: 700 }}>名册</Link>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>暂无赛事</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}