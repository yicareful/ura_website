import type { CertificateData } from "./types";

/**
 * 2026 URA 济南半程马拉松 — 完赛证书
 *
 * 主题：九曲黄河 · 穿越现在与未来
 * 赛道穿过鹊华新区与黄河新城，巍然黄河体育中心（"九曲黄河" 设计理念）
 * 如母亲河畔的明珠。证书背景以一条九曲黄河斜贯纸面，沿岸标记九处弯道
 * 节点与黄河体育中心的涟漪明珠，并以"现在 → 未来"暗示这是一场穿越之旅。
 */

const GOLD = "#C9A227";
const RIVER = "#0E7C86";
const INK = "#1F2318";
const PAPER = "#FBF7EC";

export function JinanHalfCertificate({ data }: { data: CertificateData }) {
  const riverPoints: [number, number][] = [
    [46, 616], [150, 604], [256, 552], [362, 504], [470, 474],
    [556, 422], [690, 452], [800, 322], [948, 300],
  ];

  return (
    <div
      className="cert-jinan"
      style={{ background: `linear-gradient(160deg, ${PAPER} 0%, #F2EBD2 100%)`, border: `1px solid #D9C78A` }}
    >
      {/* river background */}
      <svg
        aria-hidden
        viewBox="0 0 1000 760"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
      >
        <defs>
          <linearGradient id="jinanRiver" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={GOLD} />
            <stop offset="55%" stopColor="#B8862E" />
            <stop offset="100%" stopColor={RIVER} />
          </linearGradient>
          <radialGradient id="jinanPearl" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.9" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* main river ribbon (nine bends sweeping diagonally) */}
        <path
          d="M -20 660 C 80 600,160 640,240 560 C 320 480,420 540,500 470 C 580 400,680 460,760 380 C 840 304,920 340,1030 270 L 1030 334 C 920 404,840 368,760 444 C 680 524,580 464,500 534 C 420 604,320 544,240 624 C 160 704,80 664,-20 724 Z"
          fill="url(#jinanRiver)"
          opacity="0.16"
        />
        {/* river crest line for definition */}
        <path
          d="M -20 660 C 80 600,160 640,240 560 C 320 480,420 540,500 470 C 580 400,680 460,760 380 C 840 304,920 340,1030 270"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.5"
          opacity="0.45"
        />

        {/* nine bend nodes along the river */}
        {riverPoints.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.5} fill={GOLD} opacity="0.55" />
        ))}

        {/* 黄河体育中心 — ripple / pearl at the river curl */}
        <circle cx="748" cy="388" r="10" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.5" />
        <circle cx="748" cy="388" r="18" fill="none" stroke={GOLD} strokeWidth="1.6" opacity="0.34" />
        <circle cx="748" cy="388" r="28" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.2" />
        <circle cx="748" cy="388" r="38" fill="url(#jinanPearl)" opacity="0.7" />

        {/* travel markers — 现在 / 未来 */}
        <text x="58" y="652" fill={RIVER} opacity="0.22" fontFamily="'IBM Plex Mono', monospace" fontSize="15" letterSpacing="2">现在</text>
        <text x="950" y="246" fill={RIVER} opacity="0.22" fontFamily="'IBM Plex Mono', monospace" fontSize="15" letterSpacing="2">未来</text>
      </svg>

      {/* ghost watermark */}
      <div
        aria-hidden
        style={{
          position: "absolute", right: "-2%", bottom: "-10%", zIndex: 0,
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 800,
          fontSize: "clamp(8rem, 24vw, 22rem)", color: "rgba(201,162,39,0.07)",
          letterSpacing: "-.04em", lineHeight: 0.8, pointerEvents: "none", userSelect: "none",
        }}
      >
        九曲黄河
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "var(--space-10) var(--space-12)" }}>
        {/* masthead */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-6)", flexWrap: "wrap", marginBottom: "var(--space-10)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 700, color: INK, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "var(--space-2)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <span style={{ width: 24, height: 2, background: GOLD, display: "inline-block" }} />
              Official Finisher · 九曲黄河畔
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", color: INK, letterSpacing: ".01em" }}>
              {data.eventTitle}
            </div>
            <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "#8A7A3E", letterSpacing: ".04em" }}>
              {data.eventCity} · {data.eventLocation}
            </div>
          </div>
          <div className="cert-bib" aria-label="报名编号" style={{ borderColor: "#D9C78A", backgroundColor: "#FFFDF3", color: INK }}>
            <span style={{ color: "#8A7A3E" }}>BIB</span>
            <span style={{ fontWeight: 700 }}>{data.bib}</span>
          </div>
        </div>

        {/* honoree */}
        <div style={{ textAlign: "center", padding: "var(--space-8) 0 var(--space-10)", borderTop: "1px solid rgba(201,162,39,0.45)", borderBottom: "1px solid rgba(201,162,39,0.45)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 700, color: "#8A7A3E", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>
            兹证明完赛选手
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 800, fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1, color: INK, letterSpacing: "-.01em" }}>
            {data.name}
          </div>
          <div style={{ marginTop: "var(--space-5)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "#5A5648" }}>
            {data.school} · {data.genderLabel}
          </div>
        </div>

        {/* citation */}
        <p style={{ maxWidth: "62ch", textAlign: "center", margin: "var(--space-10) auto", fontSize: "var(--text-lg)", lineHeight: 1.75, color: "#3A3A30" }}>
          于 <strong style={{ color: INK }}>{data.eventDateLabel}</strong>，
          沿 <strong style={{ color: GOLD }}>{data.eventCity}</strong> 之畔举行的
          <strong style={{ color: GOLD, fontFamily: "var(--font-display)", fontStyle: "italic" }}> {data.groupName} </strong>
          组别 {data.distance} 公里比赛中，穿越鹊华新区与黄河新城，在以「九曲黄河」为理念的
          <strong style={{ color: INK }}>黄河体育中心</strong> 见证下，完成了一场跨越现在与未来的奔跑，按既定规程完赛，特发此证。
        </p>

        {/* chrono stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--space-3)", marginBottom: "var(--space-12)" }}>
          <div className="cert-stat" style={{ background: "#FFFDF3", borderLeftColor: GOLD, borderColor: "rgba(201,162,39,0.4)" }}>
            <div className="cert-stat__label" style={{ color: "#8A7A3E" }}>距离</div>
            <div className="cert-stat__value">{data.distance} km</div>
          </div>
          <div className="cert-stat" style={{ background: "#FFFDF3", borderColor: "rgba(201,162,39,0.4)" }}>
            <div className="cert-stat__label" style={{ color: "#8A7A3E" }}>净计时</div>
            <div className="cert-stat__value">{data.finish.duration}</div>
          </div>
          <div className="cert-stat" style={{ background: "#FFFDF3", borderColor: "rgba(201,162,39,0.4)" }}>
            <div className="cert-stat__label" style={{ color: "#8A7A3E" }}>平均配速</div>
            <div className="cert-stat__value" style={{ fontSize: "1.5rem" }}>{data.finish.pace}</div>
          </div>
          <div className="cert-stat" style={{ background: "#FFFDF3", borderColor: "rgba(201,162,39,0.4)" }}>
            <div className="cert-stat__label" style={{ color: "#8A7A3E" }}>终点冲线</div>
            <div className="cert-stat__value" style={{ fontSize: "1.5rem" }}>{data.finish.finishClock}</div>
          </div>
        </div>

        {/* footer / signatures */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "var(--space-8)", flexWrap: "wrap", paddingTop: "var(--space-8)", borderTop: "1px solid rgba(201,162,39,0.45)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: "var(--text-xl)", color: INK }}>URA 赛事组委会</div>
            <div style={{ marginTop: "var(--space-3)", width: 200, borderTop: `2px solid ${INK}` }} />
            <div style={{ marginTop: "var(--space-2)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "#8A7A3E", letterSpacing: ".04em" }}>签发日期 {data.issued}</div>
            <div style={{ marginTop: "var(--space-1)", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#A8975A", letterSpacing: ".04em" }}>证书编号 {data.registrationId}</div>
          </div>
          <div
            aria-hidden
            style={{
              width: 116, height: 116, borderRadius: "50%", border: `3px double ${GOLD}`,
              display: "grid", placeItems: "center", textAlign: "center", color: GOLD,
              fontFamily: "var(--font-mono)", fontWeight: 700, transform: "rotate(-8deg)",
              background: "radial-gradient(circle at 50% 40%, rgba(201,162,39,0.08), transparent 70%)",
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 800, fontSize: "1.7rem", lineHeight: 1 }}>URA</div>
              <div style={{ fontSize: 8, letterSpacing: ".16em", marginTop: 2 }}>九曲黄河</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}