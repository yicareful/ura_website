import Link from "next/link";
import { getFeaturedPublishedArticles, getLatestPublishedArticles } from "@/lib/db";
import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/news-data";
import { formatDate } from "@/lib/format";

type ArticleLite = {
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  author: string | null;
  excerpt: string;
  publishedAt: Date | null;
  createdAt: Date;
  readMinutes: number;
  featured: boolean;
};

function CategoryTag({ category }: { category: NewsCategory }) {
  const cat = NEWS_CATEGORIES.find((c) => c.id === category)!;
  return (
    <span
      className="news-tag"
      style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: "var(--text-xs)",
        letterSpacing: ".06em",
        textTransform: "uppercase",
        color: cat.accent,
        background:
          category === "platform"
            ? "rgba(225,29,46,.1)"
            : category === "interview"
            ? "rgba(21,180,198,.12)"
            : "rgba(242,200,75,.14)",
        border: `1px solid ${cat.accent}`,
        padding: "var(--space-1) var(--space-3)",
        borderRadius: "var(--radius-sm)",
        whiteSpace: "nowrap",
      }}
    >
      {cat.label}
    </span>
  );
}

function FeaturedCard({ article }: { article: ArticleLite }) {
  const cat = NEWS_CATEGORIES.find((c) => c.id === article.category)!;
  return (
    <Link
      href={`/news/${article.slug}`}
      className="card news-featured notch stagger-enter visible"
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        padding: "var(--space-8) var(--space-8) var(--space-6) var(--space-10)",
        minHeight: 320,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--space-4)",
          marginBottom: "var(--space-6)",
          flexWrap: "wrap",
        }}
      >
        <CategoryTag category={article.category as NewsCategory} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-secondary)",
            letterSpacing: ".04em",
          }}
        >
          {formatDate(article.publishedAt ?? article.createdAt)} · {article.readMinutes} 分钟阅读
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-4)", lineHeight: 1.05 }}>
          {article.title}
        </h3>
        {article.subtitle && (
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>
            {article.subtitle}
          </p>
        )}
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-base)", maxWidth: "60ch" }}>
          {article.excerpt}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "var(--space-6)",
          marginTop: "var(--space-8)",
          borderTop: "1px dashed var(--color-border-strong)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-sm)",
        }}
      >
        <span style={{ color: cat.accent, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" }}>
          阅读全文 →
        </span>
        {article.author && <span style={{ color: "var(--color-text-muted)" }}>{article.author}</span>}
      </div>
    </Link>
  );
}

function CompactCard({ article, index }: { article: ArticleLite; index: number }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="card news-card notch stagger-enter visible"
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        padding: "var(--space-6) var(--space-6) var(--space-5) var(--space-8)",
        minHeight: 200,
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
        <CategoryTag category={article.category as NewsCategory} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: ".02em" }}>
          {formatDate(article.publishedAt ?? article.createdAt)}
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: "var(--text-2xl)", lineHeight: 1.1, marginBottom: "var(--space-3)" }}>{article.title}</h3>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-sm)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.excerpt}
        </p>
      </div>

      <div
        style={{
          paddingTop: "var(--space-4)",
          marginTop: "var(--space-5)",
          borderTop: "1px dashed var(--color-border-strong)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          letterSpacing: ".04em",
          textTransform: "uppercase",
        }}
      >
        阅读全文 →
      </div>
    </Link>
  );
}

export async function NewsSection() {
  const [featured, latest] = await Promise.all([
    getFeaturedPublishedArticles(3),
    getLatestPublishedArticles(6),
  ]);

  // Fill featured with latest if not enough featured articles.
  const featuredList: ArticleLite[] =
    featured.length > 0
      ? featured
      : latest.slice(0, 1);
  const featuredSlugs = new Set(featuredList.map((a) => a.slug));
  const rest = latest.filter((a) => !featuredSlugs.has(a.slug)).slice(0, 3);

  return (
    <section className="section-light" style={{ padding: "var(--space-20) 0 var(--space-24)" }}>
      <div className="container">
        <div
          style={{
            marginBottom: "var(--space-12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: "var(--space-6)",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>NEWS DESK</p>
            <h2 style={{ fontSize: "var(--text-6xl)", fontStyle: "italic" }}>新闻</h2>
            <p style={{ marginTop: "var(--space-4)", color: "var(--color-text-secondary)", fontSize: "var(--text-lg)", maxWidth: "52ch" }}>
              平台动态、人物专访与赛事资讯——URA 编辑部持续跟踪校园长跑与越野世界。
            </p>
          </div>
          <Link href="/news" className="btn-secondary">进入新闻中心</Link>
        </div>

        {/* category strip */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-10)" }}>
          {NEWS_CATEGORIES.map((cat) => (
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
                transition:
                  "border-color var(--duration-fast) var(--ease-smooth), color var(--duration-fast) var(--ease-smooth), background var(--duration-fast) var(--ease-smooth)",
              }}
            >
              <span aria-hidden style={{ width: 8, height: 8, background: cat.accent, flexShrink: 0 }} />
              {cat.label}
            </Link>
          ))}
        </div>

        {featuredList.length === 0 && rest.length === 0 ? (
          <div className="card" style={{ padding: "var(--space-10)", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
            暂无新闻。
          </div>
        ) : (
          <>
            {featuredList.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-6)", marginBottom: "var(--space-6)" }}>
                {featuredList.map((a) => (
                  <FeaturedCard key={a.slug} article={a} />
                ))}
              </div>
            )}

            {rest.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-6)" }}>
                {rest.map((a, i) => (
                  <CompactCard key={a.slug} article={a} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
