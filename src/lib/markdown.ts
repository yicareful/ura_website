// Minimal, dependency-free Markdown → HTML renderer for article content.
// Supports: headings, paragraphs, blockquotes, ordered/unordered lists,
// fenced code blocks, horizontal rules, inline bold/italic/strike/code,
// links and images. All non-construct text is HTML-escaped (no raw HTML).

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(text: string): string {
  // Protect inline code spans first.
  const codeSpans: string[] = [];
  let working = text.replace(/`([^`]+)`/g, (_m, code: string) => {
    codeSpans.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000${codeSpans.length - 1}\u0000`;
  });

  // Images: ![alt](url)
  working = working.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_m, alt: string, url: string, title?: string) => {
      const t = title ? ` title="${escapeHtml(title)}"` : "";
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}"${t} loading="lazy" />`;
    }
  );

  // Links: [text](url)
  working = working.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_m, label: string, url: string, title?: string) => {
      const t = title ? ` title="${escapeHtml(title)}"` : "";
      const safeUrl = /^(https?:|mailto:|\/|#)/i.test(url) ? url : "#";
      return `<a href="${escapeHtml(safeUrl)}"${t} target="_blank" rel="noopener noreferrer">${renderInlineInline(label)}</a>`;
    }
  );

  // Bold **text** or __text__
  working = working.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  working = working.replace(/__([^_]+)__/g, "<strong>$1</strong>");

  // Italic *text* or _text_
  working = working.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
  working = working.replace(/(^|[^_])_([^_]+)_(?!_)/g, "$1<em>$2</em>");

  // Strikethrough ~~text~~
  working = working.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  // Restore code spans.
  working = working.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => codeSpans[Number(i)]);

  return working;
}

// Inline rendering without re-running code-span protection (used inside link labels).
function renderInlineInline(text: string): string {
  let working = escapeHtml(text);
  working = working.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  working = working.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  working = working.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
  return working;
}

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "hr" };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line — skip.
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // Fenced code block.
    const fence = line.match(/^```(\s*\w+)?\s*$/);
    if (fence) {
      const lang = (fence[1] || "").trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ type: "code", lang, code: code.join("\n") });
      continue;
    }

    // Horizontal rule.
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Heading.
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2].trim() });
      i++;
      continue;
    }

    // Blockquote (consecutive > lines).
    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", lines: quoteLines });
      continue;
    }

    // Unordered list.
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list.
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Paragraph (consume until blank line or a block-starting line).
    const para: string[] = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*([-*_])\1{2,}\s*$/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", text: para.join("\n") });
  }

  return blocks;
}

export function renderMarkdown(src: string): string {
  const blocks = parseBlocks(src);
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "heading": {
        const level = Math.min(Math.max(block.level, 1), 6);
        parts.push(
          `<h${level} class="md-h md-h-${level}">${renderInline(block.text)}</h${level}>`
        );
        break;
      }
      case "paragraph": {
        const html = renderInline(block.text).replace(/\n/g, "<br />");
        parts.push(`<p class="md-p">${html}</p>`);
        break;
      }
      case "quote": {
        const inner = block.lines
          .join("\n")
          .trim()
          .replace(/\n/g, "<br />");
        parts.push(
          `<blockquote class="md-quote">${renderInline(inner)}</blockquote>`
        );
        break;
      }
      case "ul": {
        const items = block.items
          .map((it) => `<li>${renderInline(it)}</li>`)
          .join("");
        parts.push(`<ul class="md-list">${items}</ul>`);
        break;
      }
      case "ol": {
        const items = block.items
          .map((it) => `<li>${renderInline(it)}</li>`)
          .join("");
        parts.push(`<ol class="md-list md-list--ordered">${items}</ol>`);
        break;
      }
      case "code": {
        parts.push(
          `<pre class="md-pre"><code class="md-code${block.lang ? ` language-${escapeHtml(block.lang)}` : ""}">${escapeHtml(block.code)}</code></pre>`
        );
        break;
      }
      case "hr": {
        parts.push(`<hr class="md-hr" />`);
        break;
      }
    }
  }

  return parts.join("\n");
}

// Rough reading-time estimate (Chinese chars counted per-char, ~400 cpm; English ~220 wpm).
export function estimateReadMinutes(src: string): number {
  const chars = (src.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = src
    .replace(/[\u4e00-\u9fa5]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.ceil(chars / 400 + words / 220);
  return Math.max(1, minutes);
}

