import { notFound } from "next/navigation";
import { getEventById, getEventRegistrations } from "@/lib/db";
import { RegistrationStatusBadge } from "@/components/StatusBadge";
import { GENDER_LABEL } from "@/lib/constants";
import { formatFee } from "@/lib/format";

export default async function EventRegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const registrations = await getEventRegistrations(id);

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-1)" }}>{event.title} · 报名名册</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
        共 {registrations.length} 条报名记录
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>性别</th>
              <th>身份证号</th>
              <th>手机号</th>
              <th>学校</th>
              <th>组别</th>
              <th>报名费</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{GENDER_LABEL[r.gender] ?? r.gender}</td>
                <td>{r.idCard}</td>
                <td>{r.phone}</td>
                <td>{r.school}</td>
                <td>{r.group.name}</td>
                <td>{formatFee(r.group.fee)}</td>
                <td>
                  <RegistrationStatusBadge status={r.status} />
                </td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", color: "var(--color-text-secondary)" }}>
                  暂无报名记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}