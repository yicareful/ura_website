import { CountUp } from "./CountUp";

export function HeroSection({
  eventCount,
  totalRunners,
  totalDistance,
  runner,
}: {
  eventCount: number;
  totalRunners: number;
  totalDistance: number;
  runner?: { name: string } | null;
}) {
  return (
    <section
      className="section-dark"
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "calc(var(--header-h) + var(--space-16))",
        paddingBottom: "var(--space-24)",
      }}
    >
      <svg
        aria-hidden
        width="100%"
        height="420"
        viewBox="0 0 1200 420"
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.5 }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF5B2E" />
            <stop offset="100%" stopColor="#FF2E63" />
          </linearGradient>
        </defs>
        <path
          className="route-line"
          d="M -50 320 C 150 200, 300 380, 480 220 S 780 60, 960 200 S 1180 340, 1300 180"
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <div className="container" style={{ position: "relative" }}>
        <div
          className="stagger-enter visible"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-4)",
            borderRadius: "var(--radius-full)",
            background: "rgba(255,91,46,0.12)",
            border: "1px solid rgba(255,91,46,0.3)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "#ff8a5e",
            marginBottom: "var(--space-6)",
          }}
        >
          山东省大学生长跑IP赛事
        </div>

        <h1
          className="stagger-enter visible"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            maxWidth: "18ch",
            transitionDelay: "80ms",
          }}
        >
          为跑向<span className="gradient-text">终点</span>的每一步
        </h1>

        <p
          className="stagger-enter visible"
          style={{
            marginTop: "var(--space-6)",
            fontSize: "var(--text-lg)",
            color: "var(--color-text-on-dark-muted)",
            maxWidth: "56ch",
            transitionDelay: "160ms",
          }}
        >
          覆盖全省高校的长跑赛事管理与报名平台。从选择赛程到完成比赛，一站式数字化服务。
        </p>

        <div
          className="stagger-enter visible"
          style={{ marginTop: "var(--space-10)", display: "flex", gap: "var(--space-4)", transitionDelay: "240ms" }}
        >
          <a href="/events" className="btn-primary">
            浏览赛事
          </a>
          {runner ? (
            <a href="/runner/my-registrations" className="btn-ghost-dark">
              查询我的报名
            </a>
          ) : (
            <a href="/runner/login" className="btn-ghost-dark">
              前往登录
            </a>
          )}
        </div>

        <div
          className="stagger-enter visible"
          style={{
            marginTop: "var(--space-20)",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: "var(--space-8)",
            maxWidth: 560,
            transitionDelay: "320ms",
          }}
        >
          <div className="count-up">
            <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", fontWeight: 700 }}>
              <CountUp to={eventCount} />
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-on-dark-muted)" }}>在办赛事</div>
          </div>
          <div className="count-up">
            <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", fontWeight: 700 }}>
              <CountUp to={totalRunners} />
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-on-dark-muted)" }}>已报名选手</div>
          </div>
          <div className="count-up">
            <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", fontWeight: 700 }}>
              <CountUp to={totalDistance} suffix="km" />
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-on-dark-muted)" }}>累计赛道里程</div>
          </div>
        </div>
      </div>
    </section>
  );
}
