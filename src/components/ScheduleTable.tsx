import Link from "next/link";
import { GENDER_LABEL } from "@/lib/constants";
import { formatAgeRange, formatFee } from "@/lib/format";

type GroupWithCount = {
  id: string;
  name: string;
  gender: string;
  minAge: number | null;
  maxAge: number | null;
  capacity: number;
  fee: number;
  isOpen: boolean;
  _count: { registrations: number };
};

type ScheduleWithGroups = {
  id: string;
  name: string;
  distance: number;
  startTime: string;
  cutoffTime: string;
  capacity: number;
  groups: GroupWithCount[];
};

export function ScheduleTable({
  eventId,
  schedules,
  interactive = true,
}: {
  eventId: string;
  schedules: ScheduleWithGroups[];
  interactive?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      {schedules.map((schedule) => (
        <div key={schedule.id}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "var(--space-3)",
              marginBottom: "var(--space-4)",
            }}
          >
            <h3 style={{ fontSize: "var(--text-xl)" }}>{schedule.name}</h3>
            <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
              {schedule.distance} km · 起跑 {schedule.startTime} · 关门时间 {schedule.cutoffTime}
            </span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>组别</th>
                  <th>性别</th>
                  <th>年龄限制</th>
                  <th>报名费</th>
                  <th>名额</th>
                  {interactive && <th></th>}
                </tr>
              </thead>
              <tbody>
                {schedule.groups.map((group) => {
                  const remaining = group.capacity - group._count.registrations;
                  const isFull = remaining <= 0 || !group.isOpen;
                  return (
                    <tr key={group.id}>
                      <td>{group.name}</td>
                      <td>{GENDER_LABEL[group.gender] ?? group.gender}</td>
                      <td>{formatAgeRange(group.minAge, group.maxAge)}</td>
                      <td>{formatFee(group.fee)}</td>
                      <td>
                        {isFull ? (
                          <span className="badge badge-error">已满</span>
                        ) : (
                          `剩余 ${remaining} / ${group.capacity}`
                        )}
                      </td>
                      {interactive && (
                        <td>
                          {isFull ? (
                            <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
                              名额已满
                            </span>
                          ) : (
                            <Link
                              href={`/events/${eventId}/register?groupId=${group.id}`}
                              className="btn-secondary"
                              style={{ padding: "var(--space-1) var(--space-4)", fontSize: "var(--text-sm)" }}
                            >
                              报名
                            </Link>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
