import type { CertificateData } from "./types";

/**
 * Generic finisher certificate — the system fallback.
 * Classic chrono-diploma: top tri-color bar, big italic URA ghost, 4-cell
 * timing board, red-official seal. Used for any event without a dedicated
 * template.
 */
export function DefaultCertificate({ data }: { data: CertificateData }) {
  return (
    <div className="cert-sheet">
      <div className="cert-sheet__grid" aria-hidden />
      <div className="cert-sheet__ghost" aria-hidden>URA</div>

      <div className="cert-sheet__inner">
        {/* masthead */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-6)", flexWrap: "wrap", marginBottom: "var(--space-10)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-blue)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "var(--space-2)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <span style={{ width: 24, height: 2, background: "var(--color-red)", display: "inline-block" }} />
              Official Finisher Certificate
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", color: "var(--color-text-secondary)", letterSpacing: ".01em" }}>
              {data.eventTitle}
            </div>
          </div>
          <div className="cert-bib" aria-label="报名编号">
            <span style={{ color: "var(--color-text-secondary)" }}>BIB</span>
            <span style={{ fontWeight: 700 }}>{data.bib}</span>
          </div>
        </div>

        {/* honoree */}
        <div style={{ textAlign: "center", padding: "var(--space-8) 0 var(--space-10)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>
            兹证明完赛选手
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 800, fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1, color: "var(--color-asphalt)", letterSpacing: "-.01em" }}>
            {data.name}
          </div>
          <div style={{ marginTop: "var(--space-5)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
            {data.school} · {data.genderLabel}
          </div>
        </div>

        {/* citation */}
        <p style={{ maxWidth: "64ch", textAlign: "center", margin: "var(--space-10) auto", fontSize: "var(--text-lg)", lineHeight: 1.7, color: "var(--color-text-primary)" }}>
          于 <strong style={{ color: "var(--color-asphalt)" }}>{data.eventDateLabel}</strong>{" "}
          在 <strong style={{ color: "var(--color-asphalt)" }}>{data.eventCity} · {data.eventLocation}</strong> 举行的
          <strong style={{ color: "var(--color-red)", fontFamily: "var(--font-display)", fontStyle: "italic" }}> {data.groupName} </strong>
          组别 {data.distance} 公里比赛中，按既定规程完赛，特发此证。
        </p>

        {/* chrono stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--space-3)", marginBottom: "var(--space-12)" }}>
          <div className="cert-stat">
            <div className="cert-stat__label">距离</div>
            <div className="cert-stat__value">{data.distance} km</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat__label">净计时</div>
            <div className="cert-stat__value">{data.finish.duration}</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat__label">平均配速</div>
            <div className="cert-stat__value" style={{ fontSize: "1.5rem" }}>{data.finish.pace}</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat__label">终点冲线</div>
            <div className="cert-stat__value" style={{ fontSize: "1.5rem" }}>{data.finish.finishClock}</div>
          </div>
        </div>

        {/* footer / signatures */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "var(--space-8)", flexWrap: "wrap", paddingTop: "var(--space-8)", borderTop: "1px solid var(--color-border)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: "var(--text-xl)", color: "var(--color-asphalt)" }}>URA 赛事组委会</div>
            <div style={{ marginTop: "var(--space-3)", width: 200, borderTop: "2px solid var(--color-asphalt)" }} />
            <div style={{ marginTop: "var(--space-2)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", letterSpacing: ".04em" }}>签发日期 {data.issued}</div>
          </div>
          <div className="cert-seal" aria-hidden>
            <div>
              <div className="cert-seal__mark">URA</div>
              <div className="cert-seal__label">OFFICIAL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}