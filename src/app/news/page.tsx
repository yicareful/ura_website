import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getPublishedArticles } from "@/lib/db";
import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/news-data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const sp = await searchParams;
  const activeCat = (sp.cat as NewsCategory) || undefined;
  const validCat = activeCat && NEWS_CATEGORIES.some((c) => c.id === activeCat) ? activeCat : undefined;

  const articles = await getPublishedArticles(validCat);
  const sorted = [...articles].sort(
    (a, b) => +(b.publishedAt ?? b.createdAt) - +(a.publishedAt ?? a.createdAt)
  );

  return (
    <>
      <SiteHeader showBackHome />

      <section className="section-dark" style={{ padding: "var(--space-16) 0 var(--space-20)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <p className="eyebrow eyebrow--yellow" style={{ marginBottom: "var(--space-3)" }}>NEWS DESK</p>
          <h1 style={{ fontSize: "var(--text-6xl)", marginBottom: "var(--space-4)", fontStyle: "italic" }}>新闻中心</h1>
          <p style={{ color: "var(--color-text-on-dark-muted)", fontSize: "var(--text-lg)", maxWidth: "56ch" }}>
            平台动态、人物专访与赛事资讯。URA 编辑部持续跟踪校园长跑与越野世界。
          </p>
        </div>
      </section>

      <section className="section-light" style={{ padding: "var(--space-12) 0 var(--space-24)" }}>
        <div className="container">
          {/* category filter */}
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-12)" }}>
            <Link
              href="/news"
              className="news-cat-chip"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-4)",
                border: "1px solid var(--color-border-strong)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "var(--text-sm)",
                letterSpacing: ".02em",
                background: !validCat ? "var(--color-asphalt)" : "transparent",
                color: !validCat ? "var(--color-text-on-dark)" : "var(--color-text-primary)",
                borderColor: !validCat ? "var(--color-asphalt)" : "var(--color-border-strong)",
              }}
            >
              全部
            </Link>
            {NEWS_CATEGORIES.map((cat) => {
              const active = validCat === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={`/news?cat=${cat.id}`}
                  className="news-cat-chip"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "var(--space-2) var(--space-4)",
                    border: "1px solid var(--color-border-strong)",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "var(--text-sm)",
                    letterSpacing: ".02em",
                    background: active ? cat.accent : "transparent",
                    color: active ? "#fff" : "var(--color-text-primary)",
                    borderColor: active ? cat.accent : "var(--color-border-strong)",
                  }}
                >
                  <span aria-hidden style={{ width: 8, height: 8, background: active ? "#fff" : cat.accent, flexShrink: 0 }} />
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {sorted.length === 0 ? (
            <div className="card" style={{ padding: "var(--space-10)", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
              暂无新闻。
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              {sorted.map((article, i) => {
                const cat = NEWS_CATEGORIES.find((c) => c.id === article.category)!;
                return (
                  <Link
                    key={article.slug}
                    href={`/news/${article.slug}`}
                    className="card notch stagger-enter visible"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "92px 1fr",
                      gap: "var(--space-6)",
                      padding: "var(--space-6) var(--space-6) var(--space-6) var(--space-8)",
                      transitionDelay: `${i * 60}ms`,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", alignItems: "flex-start" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "var(--text-4xl)",
                          lineHeight: 1,
                          color: cat.accent,
                          fontStyle: "italic",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          fontSize: "var(--text-xs)",
                          letterSpacing: ".04em",
                          textTransform: "uppercase",
                          color: cat.accent,
                          border: `1px solid ${cat.accent}`,
                          padding: "var(--space-1) var(--space-2)",
                          borderRadius: "var(--radius-sm)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cat.label}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateRows: "auto auto 1fr auto", gap: "var(--space-2)" }}>
                      <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "baseline" }}>
                        <h2 style={{ fontSize: "var(--text-2xl)", lineHeight: 1.1 }}>{article.title}</h2>
                      </div>
                      {article.subtitle && (
                        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-base)" }}>{article.subtitle}</p>
                      )}
                      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--space-1)" }}>
                        {article.excerpt}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--space-4)",
                          alignItems: "center",
                          paddingTop: "var(--space-3)",
                          marginTop: "var(--space-2)",
                          borderTop: "1px dashed var(--color-border-strong)",
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-muted)",
                          letterSpacing: ".04em",
                        }}
                      >
                        <span>{formatDate(article.publishedAt ?? article.createdAt)}</span>
                        <span aria-hidden>·</span>
                        <span>{article.readMinutes} 分钟阅读</span>
                        {article.author && (
                          <>
                            <span aria-hidden>·</span>
                            <span>{article.author}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
