import { getAdminStats } from "@/lib/db";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>LIVE OPERATIONS</p>
      <h1 style={{ fontSize: "var(--text-5xl)", marginBottom: "var(--space-8)", fontStyle: "italic" }}>仪表盘</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-5)" }}>
        <div className="stat-card">
          <div className="stat-value">{stats.eventCount}</div>
          <div className="stat-label">赛事总数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.registrationCount}</div>
          <div className="stat-label">报名总数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.paidCount}</div>
          <div className="stat-label">已支付报名</div>
        </div>
      </div>
    </div>
  );
}