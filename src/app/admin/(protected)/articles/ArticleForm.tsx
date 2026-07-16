"use client";

import { useActionState, useMemo, useState } from "react";
import { renderMarkdown } from "@/lib/markdown";
import type { ArticleFormState } from "./actions";

type ArticleForForm = {
  id: string;
  title: string;
  subtitle: string | null;
  category: string;
  author: string | null;
  excerpt: string;
  coverTag: string | null;
  coverMeta: string | null;
  coverUrl: string | null;
  content: string;
  status: string;
  featured: boolean;
  publishedAt: Date | null;
};

const CATEGORY_OPTIONS = [
  { value: "platform", label: "平台动态" },
  { value: "interview", label: "专访" },
  { value: "race", label: "赛事资讯" },
];

function toDatetimeLocal(date: Date | null): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ArticleForm({
  action,
  initialState,
  article,
  submitLabel,
}: {
  action: (prevState: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
  initialState: ArticleFormState;
  article?: ArticleForForm;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [content, setContent] = useState(article?.content ?? "");
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const previewHtml = useMemo(() => renderMarkdown(content), [content]);

  return (
    <form action={formAction}>
      <div className="card notch" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-5)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--color-text-secondary)" }}>文章信息</h2>

        <div className="form-group">
          <label className="form-label" htmlFor="title">标题</label>
          <input className="form-input" id="title" name="title" defaultValue={article?.title} required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="subtitle">副标题（可选）</label>
          <input className="form-input" id="subtitle" name="subtitle" defaultValue={article?.subtitle ?? ""} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="category">栏目</label>
            <select className="form-select" id="category" name="category" defaultValue={article?.category ?? "platform"} required>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="author">作者（可选）</label>
            <input className="form-input" id="author" name="author" defaultValue={article?.author ?? ""} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="excerpt">摘要</label>
          <textarea className="form-textarea" id="excerpt" name="excerpt" rows={3} defaultValue={article?.excerpt} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="coverTag">封面标签（可选）</label>
            <input className="form-input" id="coverTag" name="coverTag" defaultValue={article?.coverTag ?? ""} placeholder="例：平台动态 / PLATFORM" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="coverMeta">封面说明（可选）</label>
            <input className="form-input" id="coverMeta" name="coverMeta" defaultValue={article?.coverMeta ?? ""} placeholder="例：2026.07.16 · 功能更新" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="coverUrl">封面图片 URL（可选）</label>
          <input className="form-input" id="coverUrl" name="coverUrl" defaultValue={article?.coverUrl ?? ""} placeholder="https://..." />
        </div>
      </div>

      {/* Markdown editor + preview */}
      <div className="card notch" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)", flexWrap: "wrap", gap: "var(--space-3)" }}>
          <h2 style={{ fontSize: "var(--text-lg)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--color-text-secondary)" }}>
            正文（Markdown）
          </h2>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <button type="button" className={mode === "edit" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("edit")} style={{ padding: "var(--space-2) var(--space-4)", fontSize: "var(--text-sm)" }}>编辑</button>
            <button type="button" className={mode === "preview" ? "btn-primary" : "btn-secondary"} onClick={() => setMode("preview")} style={{ padding: "var(--space-2) var(--space-4)", fontSize: "var(--text-sm)" }}>预览</button>
          </div>
        </div>

        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", marginBottom: "var(--space-3)", letterSpacing: ".03em" }}>
          支持：# 标题、**加粗**、*斜体*、`代码`、&gt; 引用、- 列表、[链接](url)、![图片](url)、```代码块```
        </p>

        {mode === "edit" ? (
          <textarea
            className="form-textarea"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={24}
            required
            style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", lineHeight: 1.7, minHeight: 420 }}
            placeholder="在此输入正文内容（Markdown 格式）..."
          />
        ) : (
          <div
            className="md-body"
            style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-6)", background: "var(--color-surface)", minHeight: 420 }}
            dangerouslySetInnerHTML={{ __html: previewHtml || '<p style="color: var(--color-text-muted)">暂无内容</p>' }}
          />
        )}
      </div>

      {/* Publish settings */}
      <div className="card notch" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-5)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--color-text-secondary)" }}>发布设置</h2>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="status">状态</label>
            <select className="form-select" id="status" name="status" defaultValue={article?.status ?? "draft"}>
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="publishedAt">发布时间（可选，发布时自动填充）</label>
            <input className="form-input" id="publishedAt" name="publishedAt" type="datetime-local" defaultValue={toDatetimeLocal(article?.publishedAt ?? null)} />
          </div>
        </div>

        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <input type="checkbox" id="featured" name="featured" defaultChecked={article?.featured ?? false} style={{ width: 18, height: 18, minHeight: 18 }} />
          <label htmlFor="featured" style={{ fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", textTransform: "none", letterSpacing: 0, margin: 0, color: "var(--color-text-primary)" }}>
            设为首页推荐（Featured）
          </label>
        </div>
      </div>

      {state.error && (
        <p className="form-error" style={{ marginBottom: "var(--space-4)", padding: "var(--space-3) var(--space-4)", background: "rgba(225,29,46,0.08)", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--color-red)" }}>
          {state.error}
        </p>
      )}

      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "保存中..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
