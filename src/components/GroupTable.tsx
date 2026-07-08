import Link from "next/link";
import { GENDER_LABEL } from "@/lib/constants";
import { formatAgeRange, formatFee } from "@/lib/format";

type GroupWithCount = {
  id: string;
  name: string;
  distance: number;
  startTime: string;
  cutoffTime: string;
  gender: string;
  minAge: number | null;
  maxAge: number | null;
  capacity: number;
  fee: number;
  isOpen: boolean;
  _count: { registrations: number };
};

export function GroupTable({
  eventId,
  groups,
  interactive = true,
}: {
  eventId: string;
  groups: GroupWithCount[];
  interactive?: boolean;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>组别</th>
            <th>距离</th>
            <th>起跑</th>
            <th>关门</th>
            <th>性别</th>
            <th>年龄限制</th>
            <th>报名费</th>
            <th>名额</th>
            {interactive && <th></th>}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const remaining = group.capacity - group._count.registrations;
            const isFull = remaining <= 0 || !group.isOpen;
            return (
              <tr key={group.id}>
                <td style={{ fontWeight: 700 }}>{group.name}</td>
                <td>{group.distance} km</td>
                <td>{group.startTime}</td>
                <td>{group.cutoffTime}</td>
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
                        style={{ padding: "var(--space-2) var(--space-4)", fontSize: "var(--text-sm)", minHeight: 34 }}
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
  );
}
