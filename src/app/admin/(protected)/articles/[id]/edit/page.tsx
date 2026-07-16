import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/db";
import { updateArticle, type ArticleFormState } from "../../actions";
import { ArticleForm } from "../../ArticleForm";

const initialState: ArticleFormState = {};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) notFound();

  const boundAction = updateArticle.bind(null, article.id);

  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>EDIT ARTICLE</p>
      <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-8)", fontStyle: "italic" }}>编辑文章</h1>
      <ArticleForm action={boundAction} initialState={initialState} article={article} submitLabel="保存修改" />
    </div>
  );
}
