"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { lookupRegistrations } from "./actions";
import { RegistrationStatusBadge } from "@/components/StatusBadge";

type Result = Awaited<ReturnType<typeof lookupRegistrations>>[number];

export function LookupForm() {
  const [results, setResults] = useState<Result[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const idCard = String(formData.get("idCard") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    startTransition(async () => {
      const data = await lookupRegistrations(idCard, phone);
      setResults(data);
      setSearched(true);
    });
  }

  return (
    <div className="card" style={{ padding: "var(--space-8)" }}>
      <form action={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="idCard">身份证号</label>
            <input className="form-input" id="idCard" name="idCard" required maxLength={18} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">手机号</label>
            <input className="form-input" id="phone" name="phone" required maxLength={11} />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "查询中..." : "查询报名"}
        </button>
      </form>

      {searched && (
        <div style={{ marginTop: "var(--space-10)" }}>
          {results && results.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {results.map((r) => (
                <Link
                  key={r.id}
                  href={`/registration/${r.id}`}
                  className="card"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "var(--space-5) var(--space-6)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{r.eventTitle}</div>
                    <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
                      {r.groupName}
                    </div>
                  </div>
                  <RegistrationStatusBadge status={r.status} />
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--color-text-secondary)" }}>未找到匹配的报名记录，请核对身份证号与手机号。</p>
          )}
        </div>
      )}
    </div>
  );
}
