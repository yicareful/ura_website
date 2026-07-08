import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentRunner } from "@/lib/runner-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { RegistrationStatusBadge } from "@/components/StatusBadge";

export default async function MyRegistrationsPage() {
  const runner = await getCurrentRunner();

  if (!runner) {
    return (
      <>
        <SiteHeader showBackHome />
        <section style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
          <div className="container" style={{ maxWidth: 680 }}>
            <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>RUNNER ENTRIES</p>
            <h1 style={{ fontSize: "var(--text-5xl)", marginBottom: "var(--space-3)", fontStyle: "italic" }}>我的赛事</h1>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)", fontSize: "var(--text-lg)" }}>
              请先登录后查看你的赛事。
            </p>
            <Link href="/runner/login?redirect=/runner/my-registrations" className="btn-primary">
              前往登录
            </Link>
          </div>
        </section>
      </>
    );
  }

  const registrations = await prisma.registration.findMany({
    where: { runnerId: runner.id },
    include: {
      event: true,
      group: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <SiteHeader showBackHome />
      <section style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>RUNNER ENTRIES</p>
          <h1 style={{ fontSize: "var(--text-5xl)", marginBottom: "var(--space-3)", fontStyle: "italic" }}>我的赛事</h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-10)", fontSize: "var(--text-lg)" }}>
            {runner.school} · {runner.name}，共有 {registrations.length} 条报名记录。
          </p>

          {registrations.length === 0 ? (
            <div
              className="card notch"
              style={{
                padding: "var(--space-10)",
                textAlign: "center",
                color: "var(--color-text-secondary)",
              }}
            >
              <p style={{ marginBottom: "var(--space-6)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>暂无报名记录</p>
              <Link href="/events" className="btn-primary">
                浏览赛事
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {registrations.map((r) => (
                <Link
                  key={r.id}
                  href={`/registration/${r.id}`}
                  className="card notch"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "var(--space-4)",
                    padding: "var(--space-5) var(--space-6)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontFamily: "var(--font-display)", fontSize: "var(--text-xl)" }}>{r.event.title}</div>
                    <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
                      {r.group.name}
                    </div>
                    <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)", marginTop: "var(--space-1)", fontFamily: "var(--font-mono)", letterSpacing: ".02em" }}>
                      报名编号 / {r.id.slice(0, 8)}…
                    </div>
                  </div>
                  <RegistrationStatusBadge status={r.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}