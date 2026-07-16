import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getPublishedArticleBySlug, getPublishedArticlesByCategory } from "@/lib/db";
import { NEWS_CATEGORIES } from "@/lib/news-data";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

function formatDateFull(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const cat = NEWS_CATEGORIES.find((c) => c.id === article.category)!;
  const related = await getPublishedArticlesByCategory(article.category, article.slug, 2);
  const html = renderMarkdown(article.content);
  const date = article.publishedAt ?? article.createdAt;

  return (
    <>
      <SiteHeader showBackHome />

      {/* hero */}
      <section className="section-dark" style={{ padding: "var(--space-16) 0 var(--space-20)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "var(--text-xs)",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                color: cat.accent,
                border: `1px solid ${cat.accent}`,
                padding: "var(--space-1) var(--space-3)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {cat.label} / {cat.labelEn}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-on-dark-muted)", letterSpacing: ".04em" }}>
              {formatDateFull(date)}
            </span>
          </div>

          <h1 style={{ fontSize: "var(--text-6xl)", marginBottom: "var(--space-5)", fontStyle: "italic", lineHeight: 1.02 }}>
            {article.title}
          </h1>
          {article.subtitle && (
            <p style={{ color: "var(--color-text-on-dark-muted)", fontSize: "var(--text-xl)", maxWidth: "60ch" }}>
              {article.subtitle}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "var(--space-5)",
              alignItems: "center",
              marginTop: "var(--space-10)",
              paddingTop: "var(--space-6)",
              borderTop: "1px solid rgba(255,255,255,.12)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-sm)",
              color: "var(--color-text-on-dark-muted)",
              flexWrap: "wrap",
            }}
          >
            {article.author && <span>{article.author}</span>}
            <span aria-hidden>·</span>
            <span>{article.readMinutes} 分钟阅读</span>
            <span aria-hidden>·</span>
            <span style={{ color: "var(--color-yellow)" }}>URA NEWS DESK</span>
          </div>
        </div>
      </section>

      {/* cover image */}
      {article.coverUrl && (
        <section className="section-light" style={{ padding: "var(--space-12) 0 0" }}>
          <div className="container" style={{ maxWidth: 880 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverUrl}
              alt={article.title}
              style={{ width: "100%", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}
            />
          </div>
        </section>
      )}

      {/* body */}
      <section className="section-light" style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <article className="md-body" dangerouslySetInnerHTML={{ __html: html }} />

          {/* back to news */}
          <div style={{ marginTop: "var(--space-16)", paddingTop: "var(--space-8)", borderTop: "1px dashed var(--color-border-strong)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <Link href="/news" style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "var(--text-sm)", letterSpacing: ".04em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
              ← 返回新闻中心
            </Link>
            <Link href={`/news?cat=${article.category}`} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-sm)", letterSpacing: ".02em", textTransform: "uppercase", color: cat.accent }}>
              更多{cat.label} →
            </Link>
          </div>

          {/* related */}
          {related.length > 0 && (
            <div style={{ marginTop: "var(--space-12)" }}>
              <p className="eyebrow" style={{ marginBottom: "var(--space-6)" }}>RELATED</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
                {related.map((a) => {
                  const rc = NEWS_CATEGORIES.find((c) => c.id === a.category)!;
                  return (
                    <Link key={a.slug} href={`/news/${a.slug}`} className="card notch" style={{ padding: "var(--space-6) var(--space-6) var(--space-5) var(--space-8)", display: "grid", gap: "var(--space-3)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "var(--text-xs)", letterSpacing: ".04em", textTransform: "uppercase", color: rc.accent }}>{rc.label}</span>
                      <h3 style={{ fontSize: "var(--text-xl)", lineHeight: 1.1 }}>{a.title}</h3>
                      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.excerpt}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
