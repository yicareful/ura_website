"use client";

import { useTransition } from "react";
import { deleteArticle } from "./actions";

export function DeleteArticleButton({ articleId, title }: { articleId: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`确认删除文章「${title}」？此操作不可撤销。`)) {
          startTransition(() => deleteArticle(articleId));
        }
      }}
      style={{
        background: "none",
        border: "none",
        color: "var(--color-red)",
        fontWeight: 700,
        padding: 0,
        cursor: pending ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        fontSize: "inherit",
        letterSpacing: "inherit",
        textTransform: "inherit",
        opacity: pending ? 0.6 : 1,
      }}
    >
      {pending ? "删除中..." : "删除"}
    </button>
  );
}
