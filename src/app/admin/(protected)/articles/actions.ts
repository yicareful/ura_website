"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { estimateReadMinutes } from "@/lib/markdown";

export type ArticleFormState = {
  error?: string;
};

const CATEGORIES = ["platform", "interview", "race"];
const STATUSES = ["draft", "published"];

function slugifyBase(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const fallback = `article-${Math.floor(Math.random() * 1e6)}`;
  const candidate = base || fallback;
  let slug = candidate;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.article.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    });
    if (!existing) return slug;
    slug = `${candidate}-${++n}`;
  }
}

export async function createArticle(
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const category = String(formData.get("category") || "");
  const author = String(formData.get("author") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const coverTag = String(formData.get("coverTag") || "").trim();
  const coverMeta = String(formData.get("coverMeta") || "").trim();
  const coverUrl = String(formData.get("coverUrl") || "").trim();
  const content = String(formData.get("content") || "");
  const status = String(formData.get("status") || "draft");
  const featured = formData.get("featured") === "on";
  const publishedAtRaw = String(formData.get("publishedAt") || "");

  if (!title) return { error: "请填写文章标题" };
  if (!CATEGORIES.includes(category)) return { error: "请选择文章栏目" };
  if (!excerpt) return { error: "请填写文章摘要" };
  if (!content.trim()) return { error: "请填写正文内容（支持 Markdown）" };
  if (!STATUSES.includes(status)) return { error: "文章状态不合法" };

  const slug = await uniqueSlug(slugifyBase(title));

  const publishedAt =
    status === "published" ? (publishedAtRaw ? new Date(publishedAtRaw) : new Date()) : null;

  await prisma.article.create({
    data: {
      slug,
      title,
      subtitle: subtitle || null,
      category,
      author: author || null,
      excerpt,
      coverTag: coverTag || null,
      coverMeta: coverMeta || null,
      coverUrl: coverUrl || null,
      content,
      status,
      featured,
      readMinutes: estimateReadMinutes(content),
      publishedAt: publishedAt && !isNaN(publishedAt.getTime()) ? publishedAt : null,
    },
  });

  redirect("/admin/articles");
}

export async function updateArticle(
  articleId: string,
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const category = String(formData.get("category") || "");
  const author = String(formData.get("author") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const coverTag = String(formData.get("coverTag") || "").trim();
  const coverMeta = String(formData.get("coverMeta") || "").trim();
  const coverUrl = String(formData.get("coverUrl") || "").trim();
  const content = String(formData.get("content") || "");
  const status = String(formData.get("status") || "draft");
  const featured = formData.get("featured") === "on";
  const publishedAtRaw = String(formData.get("publishedAt") || "");

  if (!title) return { error: "请填写文章标题" };
  if (!CATEGORIES.includes(category)) return { error: "请选择文章栏目" };
  if (!excerpt) return { error: "请填写文章摘要" };
  if (!content.trim()) return { error: "请填写正文内容（支持 Markdown）" };
  if (!STATUSES.includes(status)) return { error: "文章状态不合法" };

  const existing = await prisma.article.findUnique({ where: { id: articleId } });
  if (!existing) return { error: "文章不存在" };

  let slug = existing.slug;
  if (slugifyBase(title) && slugifyBase(title) !== slugifyBase(existing.title)) {
    slug = await uniqueSlug(slugifyBase(title), articleId);
  }

  // First publish: stamp publishedAt automatically.
  let publishedAt = existing.publishedAt;
  if (status === "published") {
    if (!existing.publishedAt) {
      publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();
    } else if (publishedAtRaw) {
      publishedAt = new Date(publishedAtRaw);
    }
  } else {
    publishedAt = null;
  }

  await prisma.article.update({
    where: { id: articleId },
    data: {
      slug,
      title,
      subtitle: subtitle || null,
      category,
      author: author || null,
      excerpt,
      coverTag: coverTag || null,
      coverMeta: coverMeta || null,
      coverUrl: coverUrl || null,
      content,
      status,
      featured,
      readMinutes: estimateReadMinutes(content),
      publishedAt: publishedAt && !isNaN(publishedAt.getTime()) ? publishedAt : null,
    },
  });

  redirect("/admin/articles");
}

export async function deleteArticle(articleId: string): Promise<void> {
  await prisma.article.delete({ where: { id: articleId } });
  redirect("/admin/articles");
}

export async function toggleArticlePublish(articleId: string): Promise<void> {
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) return;

  const willPublish = article.status !== "published";
  await prisma.article.update({
    where: { id: articleId },
    data: {
      status: willPublish ? "published" : "draft",
      publishedAt: willPublish
        ? article.publishedAt ?? new Date()
        : null,
    },
  });

  redirect("/admin/articles");
}

