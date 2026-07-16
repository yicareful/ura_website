import Link from "next/link";
import { getArticlesForAdmin } from "@/lib/db";
import { formatDate, formatDateTime } from "@/lib/format";
import { ARTICLE_CATEGORY_LABEL, ARTICLE_STATUS_LABEL } from "@/lib/constants";
import { NEWS_CATEGORIES } from "@/lib/news-data";
import { toggleArticlePublish } from "./actions";
import { DeleteArticleButton } from "./DeleteArticleButton";

function CategoryBadge({ category }: { category: string }) {
  const cat = NEWS_CATEGORIES.find((c) => c.id === category);
  const label = ARTICLE_CATEGORY_LABEL[category] ?? category;
  const accent = cat?.accent ?? "var(--color-text-muted)";
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: "var(--text-xs)",
        letterSpacing: ".04em",
        textTransform: "uppercase",
        color: accent,
        border: `1px solid ${accent}`,
        padding: "var(--space-1) var(--space-2)",
        borderRadius: "var(--radius-sm)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export default async function AdminArticlesPage() {
  const articles = await getArticlesForAdmin();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "var(--space-6)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>NEWS DESK</p>
          <h1 style={{ fontSize: "var(--text-5xl)", fontStyle: "italic" }}>文章管理</h1>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          发布文章
        </Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>标题</th>
              <th>栏目</th>
              <th>状态</th>
              <th>发布时间</th>
              <th>阅读</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "var(--text-base)" }}>
                  {article.title}
                  {article.featured && (
                    <span style={{ marginLeft: "var(--space-2)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-yellow)", letterSpacing: ".04em" }}>★ 推荐</span>
                  )}
                </td>
                <td><CategoryBadge category={article.category} /></td>
                <td>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      letterSpacing: ".04em",
                      color: article.status === "published" ? "var(--color-green)" : "var(--color-text-muted)",
                    }}
                  >
                    {ARTICLE_STATUS_LABEL[article.status] ?? article.status}
                  </span>
                </td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                  {article.publishedAt ? formatDateTime(article.publishedAt) : "—"}
                </td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{article.readMinutes} 分钟</td>
                <td>
                  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: ".03em" }}>
                    <Link href={`/admin/articles/${article.id}/edit`} style={{ color: "var(--color-text-secondary)", fontWeight: 700 }}>编辑</Link>
                    {article.status === "published" ? (
                      <Link href={`/news/${article.slug}`} style={{ color: "var(--color-blue)", fontWeight: 700 }}>查看</Link>
                    ) : null}
                    <form action={toggleArticlePublish.bind(null, article.id)}>
                      <button type="submit" style={{ background: "none", border: "none", color: article.status === "published" ? "var(--color-warning)" : "var(--color-green)", fontWeight: 700, padding: 0, cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit" }}>
                        {article.status === "published" ? "撤回" : "发布"}
                      </button>
                    </form>
                    <DeleteArticleButton articleId={article.id} title={article.title} />
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>暂无文章，点击右上角「发布文章」开始</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


