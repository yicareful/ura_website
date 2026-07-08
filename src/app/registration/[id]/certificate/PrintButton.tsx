"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      className="btn-secondary cert-no-print"
      onClick={() => window.print()}
      style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}
    >
      打印 / 保存为 PDF
    </button>
  );
}