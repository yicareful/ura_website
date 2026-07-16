import { ArticleForm } from "../ArticleForm";
import { createArticle, type ArticleFormState } from "../actions";

const initialState: ArticleFormState = {};

export default function NewArticlePage() {
  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>NEW ARTICLE</p>
      <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: "var(--space-8)", fontStyle: "italic" }}>发布文章</h1>
      <ArticleForm action={createArticle} initialState={initialState} submitLabel="创建文章" />
    </div>
  );
}
