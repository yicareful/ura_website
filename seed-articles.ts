import { PrismaClient } from "@prisma/client";
import { NEWS_ARTICLES, type NewsParagraph } from "./src/lib/news-data";

const prisma = new PrismaClient();

function paragraphToMd(block: NewsParagraph): string {
  switch (block.type) {
    case "p":
      return block.text;
    case "h":
      return `## ${block.text}`;
    case "quote":
      return `> ${block.text}${block.cite ? `\n> —— ${block.cite}` : ""}`;
    case "list":
      return block.items.map((it) => `- ${it}`).join("\n");
    case "data": {
      const header = `| ${block.rows.map((r) => r.label).join(" | ")} |`;
      const sep = `| ${block.rows.map(() => "---").join(" | ")} |`;
      const row = `| ${block.rows.map((r) => r.value).join(" | ")} |`;
      return `${header}\n${sep}\n${row}`;
    }
    default:
      return "";
  }
}

async function main() {
  let created = 0;
  let updated = 0;
  for (const a of NEWS_ARTICLES) {
    const content = a.body.map(paragraphToMd).join("\n\n");
    const publishedAt = new Date(a.date);
    const result = await prisma.article.upsert({
      where: { slug: a.slug },
      create: {
        slug: a.slug,
        title: a.title,
        subtitle: a.subtitle ?? null,
        category: a.category,
        author: a.author ?? null,
        excerpt: a.excerpt,
        coverTag: a.cover.tag ?? null,
        coverMeta: a.cover.meta ?? null,
        content,
        status: "published",
        featured: a.featured ?? false,
        readMinutes: a.readMinutes,
        publishedAt,
      },
      update: {
        title: a.title,
        subtitle: a.subtitle ?? null,
        category: a.category,
        author: a.author ?? null,
        excerpt: a.excerpt,
        coverTag: a.cover.tag ?? null,
        coverMeta: a.cover.meta ?? null,
        content,
        status: "published",
        featured: a.featured ?? false,
        readMinutes: a.readMinutes,
        publishedAt,
      },
    });
    if (result.createdAt) created++;
    else updated++;
  }
  console.log(`Articles seed done: ${created} created, ${updated} updated (total ${NEWS_ARTICLES.length})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
