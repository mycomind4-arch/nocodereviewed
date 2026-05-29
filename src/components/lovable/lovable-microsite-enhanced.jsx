import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   LOVABLE — FULL REVIEW MICROSITE (ENHANCED)
   no-code-reviewed.lovable.app
   Design system: DM Sans, #e8541a accent, #0f0e0d text, #faf8f4 card
   ENHANCEMENTS: Animated score bars, security timeline, live credit
   calculator, animated stat counters, radar chart, progress ring,
   scroll-triggered reveal animations
═══════════════════════════════════════════════════════════ */

const G = {
  accent: "#e8541a",
  text: "#0f0e0d",
  card: "#faf8f4",
  bg: "#f0ede7",
  muted: "#72685f",
  border: "#e0dbd3",
  good: "#1a6e3c",
  warn: "#b83020",
  goodBg: "#edf7f2",
  warnBg: "#fdf0ee",
  navH: 60,
};

/* ─────────────────────────────────────────────
   HOOK: useInView — triggers animation when element scrolls into view
───────────────────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─────────────────────────────────────────────
   HOOK: useCountUp — animates a number from 0 to target
───────────────────────────────────────────── */
function useCountUp(target, duration = 1400, active = true, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setVal(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration, decimals]);
  return val;
}

/* ─────────────────────────────────────────────
   SHARED MICRO-COMPONENTS (unchanged from original)
───────────────────────────────────────────── */
const Badge = ({ children, variant = "neutral" }) => {
  const colors = {
    neutral: { bg: "#f0ede7", color: G.muted },
    accent: { bg: "#fde8de", color: G.accent },
    critical: { bg: G.warnBg, color: G.warn },
    good: { bg: G.goodBg, color: G.good },
    warn: { bg: "#fff3e0", color: "#a06000" },
  };
  const c = colors[variant];
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 99,
      background: c.bg, color: c.color,
    }}>{children}</span>
  );
};

const Alert = ({ type = "neutral", title, children }) => {
  const map = {
    neutral: { border: G.border, bg: G.card },
    warn: { border: G.warn, bg: G.warnBg },
    good: { border: G.good, bg: G.goodBg },
    info: { border: G.accent, bg: "#fde8de" },
  };
  const s = map[type];
  return (
    <div style={{ borderLeft: `4px solid ${s.border}`, background: s.bg, borderRadius: "0 12px 12px 0", padding: "18px 22px", marginBottom: 20 }}>
      {title && <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, color: s.border }}>{title}</div>}
      <div style={{ fontSize: 14, lineHeight: 1.65, color: "#2e2a25" }}>{children}</div>
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "22px 24px", ...style }}>
    {children}
  </div>
);

const SectionHead = ({ eyebrow, title, sub }) => (
  <div style={{ marginBottom: 32 }}>
    {eyebrow && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.accent, marginBottom: 10 }}>{eyebrow}</div>}
    <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: sub ? 10 : 0, lineHeight: 1.15 }}>{title}</h2>
    {sub && <p style={{ fontSize: 16, color: G.muted, lineHeight: 1.6, maxWidth: 620 }}>{sub}</p>}
  </div>
);

const Prose = ({ children }) => (
  <div style={{ fontSize: 15, lineHeight: 1.8, color: "#2e2a25", marginBottom: 16 }}>{children}</div>
);

const Divider = () => <div style={{ height: 1, background: G.border, margin: "36px 0" }} />;

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }} style={{
      position: "absolute", top: 10, right: 10, padding: "5px 12px",
      background: copied ? G.good : G.accent, color: "#fff",
      border: "none", borderRadius: 7, fontSize: 11, fontWeight: 700,
      cursor: "pointer", transition: "background 0.2s",
    }}>{copied ? "Copied!" : "Copy"}</button>
  );
};

const PromptBlock = ({ text }) => (
  <div style={{ position: "relative", background: "#1a1714", borderRadius: 10, padding: "16px 52px 16px 18px", marginBottom: 14 }}>
    <CopyBtn text={text} />
    <p style={{ color: "#e8e0d5", fontSize: 13, lineHeight: 1.7, fontFamily: "monospace", margin: 0 }}>{text}</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   ★ ENHANCED COMPONENT 1: AnimatedScoreBar
   Replaces the static ScoreBar — bar fills in on scroll entry
   with a smooth ease-out animation. Color shifts red for low scores.
═══════════════════════════════════════════════════════════ */
const AnimatedScoreBar = ({ label, score, max = 10, delay = 0 }) => {
  const [ref, inView] = useInView(0.1);
  const color = score < 5 ? G.warn : score < 7 ? "#c07000" : G.accent;
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "160px 1fr 38px", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
      <div style={{ height: 6, background: G.border, borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: inView ? `${(score / max) * 100}%` : "0%",
          background: color,
          borderRadius: 99,
          transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, textAlign: "right", color }}>{score}</span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ★ ENHANCED COMPONENT 2: AnimatedStatPill
   Replaces static StatPill — number counts up from 0 on scroll entry.
   Handles $, +, %, and plain numbers.
═══════════════════════════════════════════════════════════ */
const AnimatedStatPill = ({ num, label }) => {
  const [ref, inView] = useInView(0.2);
  // Parse the number out of the display string
  const match = String(num).match(/[\d.]+/);
  const rawNum = match ? parseFloat(match[0]) : 0;
  const prefix = String(num).match(/^[^0-9]*/)?.[0] || "";
  const suffix = String(num).match(/[^0-9.]*$/)?.[0] || "";
  const decimals = String(rawNum).includes(".") ? String(rawNum).split(".")[1].length : 0;
  const counted = useCountUp(rawNum, 1600, inView, decimals);

  return (
    <div ref={ref} style={{
      background: G.card, border: `1px solid ${G.border}`, borderRadius: 12,
      padding: "20px 22px", textAlign: "center", flex: "1 1 140px",
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: G.accent, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {prefix}{counted}{suffix}
      </div>
      <div style={{ fontSize: 12, color: G.muted, marginTop: 6, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ★ ENHANCED COMPONENT 3: ScoreRing (animated SVG circle)
   The overall verdict score as an animated progress ring.
   Stroke draws in on mount/scroll.
═══════════════════════════════════════════════════════════ */
const ScoreRing = ({ score, size = 140, label = "Overall Score" }) => {
  const [ref, inView] = useInView(0.3);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const pct = score / 10;

  return (
    <div ref={ref} style={{ textAlign: "center", flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        {/* track */}
        <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(250,248,244,0.15)" strokeWidth={8} />
        {/* fill */}
        <circle
          cx={60} cy={60} r={r}
          fill="none"
          stroke={G.accent}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${inView ? pct * circ : 0} ${circ}`}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s" }}
        />
        <text x={60} y={55} textAnchor="middle" fontSize={28} fontWeight={900} fill={G.accent} fontFamily="DM Sans, sans-serif">{score}</text>
        <text x={60} y={72} textAnchor="middle" fontSize={11} fill="rgba(250,248,244,0.5)" fontFamily="DM Sans, sans-serif">out of 10</text>
      </svg>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: G.accent, marginTop: 4 }}>{label}</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ★ ENHANCED COMPONENT 4: SecurityTimeline
   Replaces the static incident grid on the Security page.
   Visual timeline with severity indicators and staggered reveal.
═══════════════════════════════════════════════════════════ */
const SecurityTimeline = () => {
  const [ref, inView] = useInView(0.1);
  const incidents = [
    {
      date: "Q1 2026",
      duration: "48 days open",
      severity: "critical",
      title: "BOLA Vulnerability",
      body: "Bug report closed without escalation. Vulnerability left open for 48 days, exposing source code, DB credentials, and user records.",
    },
    {
      date: "Feb 2026",
      duration: "All pre-Nov 2025 projects",
      severity: "critical",
      title: "Permission Regression",
      body: "Backend unification accidentally re-enabled access to chat histories on public projects — exposing Supabase keys and business logic.",
    },
    {
      date: "Mar 2026",
      duration: "100K+ views affected",
      severity: "moderate",
      title: "16 Vulnerabilities in Live App",
      body: "6 critical flaws in a single hosted app. PII exposed from UC Berkeley, UC Davis, and K-12 institutions.",
    },
  ];

  const severityColors = { critical: "#f08070", moderate: "#e8b090" };

  return (
    <div ref={ref} style={{ background: "#2a0a05", borderRadius: 16, padding: "32px 36px", marginBottom: 36 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f08070", marginBottom: 28 }}>
        Security Incident Log — H1 2026
      </div>

      {/* timeline track */}
      <div style={{ position: "relative" }}>
        {/* vertical line */}
        <div style={{
          position: "absolute", left: 87, top: 0, bottom: 0, width: 2,
          background: "rgba(240,128,112,0.2)",
        }} />

        {incidents.map((inc, i) => (
          <div key={inc.title} style={{
            display: "grid", gridTemplateColumns: "88px 1fr",
            gap: 24, marginBottom: i < incidents.length - 1 ? 28 : 0,
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: `opacity 0.5s ease ${i * 160}ms, transform 0.5s ease ${i * 160}ms`,
          }}>
            {/* date column */}
            <div style={{ textAlign: "right", paddingTop: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: severityColors[inc.severity], lineHeight: 1.4 }}>{inc.date}</div>
              <div style={{ fontSize: 10, color: "rgba(240,200,180,0.5)", marginTop: 2 }}>{inc.duration}</div>
            </div>

            {/* dot + content */}
            <div style={{ position: "relative", paddingLeft: 20 }}>
              {/* connector dot */}
              <div style={{
                position: "absolute", left: -7, top: 5,
                width: 12, height: 12, borderRadius: "50%",
                background: severityColors[inc.severity],
                border: "2px solid #2a0a05",
                boxShadow: `0 0 10px ${severityColors[inc.severity]}80`,
              }} />
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <span style={{
                  fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
                  padding: "2px 7px", borderRadius: 99,
                  background: inc.severity === "critical" ? "rgba(240,128,112,0.2)" : "rgba(232,176,144,0.2)",
                  color: severityColors[inc.severity],
                  border: `1px solid ${severityColors[inc.severity]}40`,
                }}>{inc.severity}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#faf8f4", marginBottom: 6 }}>{inc.title}</div>
              <div style={{ fontSize: 12, color: "rgba(250,240,235,0.65)", lineHeight: 1.65 }}>{inc.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ★ ENHANCED COMPONENT 5: CreditCalculator
   Interactive live calculator for the Pricing page.
   User adjusts sliders → credit burn rate updates in real time.
═══════════════════════════════════════════════════════════ */
const CreditCalculator = () => {
  const [initialApps, setInitialApps] = useState(1);
  const [pagesPerApp, setPagesPerApp] = useState(4);
  const [bugsPerWeek, setBugsPerWeek] = useState(3);
  const [refactors, setRefactors] = useState(1);

  const creditsPerApp = initialApps * 4.5;
  const creditsPages = pagesPerApp * 1.5;
  const creditsBugs = bugsPerWeek * 1.5;
  const creditsRefactors = refactors * 6;
  const totalWeekly = creditsPerApp / 4 + creditsPages + creditsBugs + creditsRefactors;
  const totalMonthly = Math.round(totalWeekly * 4.3);

  const plan = totalMonthly <= 30 ? { name: "Free", price: "$0" }
    : totalMonthly <= 100 ? { name: "Starter", price: "~$21/mo" }
    : totalMonthly <= 250 ? { name: "Pro", price: "~$42/mo" }
    : { name: "Business", price: "$50+/mo" };

  const Slider = ({ label, value, min, max, step = 1, onChange, note }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: G.text }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: G.accent, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: G.accent, cursor: "pointer" }} />
      {note && <div style={{ fontSize: 11, color: G.muted, marginTop: 3 }}>{note}</div>}
    </div>
  );

  return (
    <div style={{ background: G.card, border: `2px solid ${G.border}`, borderRadius: 16, padding: "28px 28px", marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.accent, marginBottom: 6 }}>
        Interactive Credit Calculator
      </div>
      <p style={{ fontSize: 13, color: G.muted, marginBottom: 24, lineHeight: 1.6 }}>
        Adjust your usage to estimate monthly credit burn and which plan fits.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
        <Slider label="New apps per month" value={initialApps} min={0} max={8} onChange={setInitialApps} note="~4.5 credits each on average" />
        <Slider label="New pages/features per week" value={pagesPerApp} min={0} max={20} onChange={setPagesPerApp} note="~1.5 credits per page" />
        <Slider label="Bug fixes per week" value={bugsPerWeek} min={0} max={20} onChange={setBugsPerWeek} note="~1.5 credits each" />
        <Slider label="Major refactors per month" value={refactors} min={0} max={6} onChange={setRefactors} note="~6 credits each" />
      </div>

      {/* Result */}
      <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 20, marginTop: 4 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div style={{ textAlign: "center", padding: "16px 12px", background: G.bg, borderRadius: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: G.accent, lineHeight: 1 }}>{Math.round(totalWeekly)}</div>
            <div style={{ fontSize: 11, color: G.muted, marginTop: 4 }}>credits / week</div>
          </div>
          <div style={{ textAlign: "center", padding: "16px 12px", background: G.bg, borderRadius: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: G.accent, lineHeight: 1 }}>{totalMonthly}</div>
            <div style={{ fontSize: 11, color: G.muted, marginTop: 4 }}>credits / month</div>
          </div>
          <div style={{ textAlign: "center", padding: "16px 12px", background: G.text, borderRadius: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: G.accent, lineHeight: 1.2 }}>{plan.name}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#faf8f4", marginTop: 2 }}>{plan.price}</div>
            <div style={{ fontSize: 10, color: "rgba(250,248,244,0.5)", marginTop: 2 }}>suggested plan</div>
          </div>
        </div>
        {totalMonthly > 30 && (
          <div style={{ marginTop: 12, fontSize: 12, color: G.warn, padding: "8px 14px", background: G.warnBg, borderRadius: 8 }}>
            ⚠ Free plan only gives 30 credits/month. At this usage level you'll hit the wall in week one.
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ★ ENHANCED COMPONENT 6: RadarChart
   SVG spider/radar chart for the Verdict page score breakdown.
   All 8 categories plotted, animates in on scroll.
═══════════════════════════════════════════════════════════ */
const RadarChart = ({ scores }) => {
  const [ref, inView] = useInView(0.2);
  const cx = 160, cy = 160, maxR = 120;
  const n = scores.length;

  const toXY = (i, val, max = 10) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const r = (val / max) * maxR * (inView ? 1 : 0);
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <div ref={ref} style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
      <svg width={320} height={320} viewBox="0 0 320 320">
        {/* Grid rings */}
        {gridLevels.map(level => {
          const pts = scores.map((_, i) => {
            const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            const r = (level / 10) * maxR;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          }).join(" ");
          return <polygon key={level} points={pts} fill="none" stroke={G.border} strokeWidth={level === 10 ? 1.5 : 1} />;
        })}

        {/* Axis lines */}
        {scores.map((_, i) => {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          return (
            <line key={i}
              x1={cx} y1={cy}
              x2={cx + maxR * Math.cos(angle)}
              y2={cy + maxR * Math.sin(angle)}
              stroke={G.border} strokeWidth={1}
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={scores.map((s, i) => { const p = toXY(i, s.score); return `${p.x},${p.y}`; }).join(" ")}
          fill={`${G.accent}25`}
          stroke={G.accent}
          strokeWidth={2}
          strokeLinejoin="round"
          style={{ transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.3s" }}
        />

        {/* Data points */}
        {scores.map((s, i) => {
          const p = toXY(i, s.score);
          return <circle key={i} cx={p.x} cy={p.y} r={4} fill={G.accent} style={{ transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.3s" }} />;
        })}

        {/* Labels */}
        {scores.map((s, i) => {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          const labelR = maxR + 22;
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy + labelR * Math.sin(angle);
          return (
            <text key={i} x={lx} y={ly + 4}
              textAnchor="middle" fontSize={10} fontWeight={600}
              fill={G.muted} fontFamily="DM Sans, sans-serif"
            >{s.label}</text>
          );
        })}

        {/* Center score */}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize={22} fontWeight={900} fill={G.accent} fontFamily="DM Sans, sans-serif">
          {inView ? (scores.reduce((a, s) => a + s.score, 0) / scores.length).toFixed(1) : "—"}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={10} fill={G.muted} fontFamily="DM Sans, sans-serif">overall</text>
      </svg>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ★ ENHANCED COMPONENT 7: HowItWorksFlow
   Animated step-by-step flow diagram for the Features page.
   Each step slides in sequentially.
═══════════════════════════════════════════════════════════ */
const HowItWorksFlow = () => {
  const [ref, inView] = useInView(0.15);
  const steps = [
    { n: "01", label: "Text Prompt", desc: "Describe your app in plain English" },
    { n: "02", label: "AI Generates", desc: "React + Supabase + Tailwind built simultaneously" },
    { n: "03", label: "Visual Editor", desc: "Point-and-click refinement, no code needed" },
    { n: "04", label: "GitHub Sync", desc: "Bidirectional export — you own the code" },
    { n: "05", label: "Live Deploy", desc: "lovable.app subdomain or your custom domain" },
  ];

  return (
    <div ref={ref} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "28px 24px", marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.accent, marginBottom: 20 }}>
        From Idea to Deployed App
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 0, overflowX: "auto", paddingBottom: 4 }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "flex-start", flex: "1 0 auto", minWidth: 120 }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              flex: 1,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: G.accent, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, marginBottom: 10, flexShrink: 0,
              }}>{s.n}</div>
              <div style={{ fontSize: 13, fontWeight: 700, textAlign: "center", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: G.muted, textAlign: "center", lineHeight: 1.5 }}>{s.desc}</div>
            </div>

            {/* connector arrow */}
            {i < steps.length - 1 && (
              <div style={{
                display: "flex", alignItems: "flex-start", paddingTop: 18, flexShrink: 0, width: 28,
                opacity: inView ? 1 : 0,
                transition: `opacity 0.4s ease ${i * 120 + 80}ms`,
              }}>
                <svg width={28} height={12} viewBox="0 0 28 12" fill="none">
                  <line x1={2} y1={6} x2={22} y2={6} stroke={G.border} strokeWidth={1.5} />
                  <path d="M18 2L24 6L18 10" stroke={G.border} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ★ ENHANCED COMPONENT 8: ComparisonToggle
   The vs-competitors tables now have a tab switcher with
   a smooth highlight transition instead of stacked tables.
═══════════════════════════════════════════════════════════ */
const ComparisonToggle = () => {
  const [active, setActive] = useState(0);
  const competitors = [
    { name: "Bolt.new", desc: "StackBlitz's AI app builder. Strong token billing transparency, slightly better AI image editing. Less polished visual editor than Lovable.", vs: [["Visual editor", true, false], ["Figma import", true, false], ["Token transparency", false, true], ["GitHub export", true, true], ["Free tier", true, true]] },
    { name: "v0 by Vercel", desc: "Focused on React UI component generation. Best-in-class for individual component output. Not a full app builder — no backend, no auth.", vs: [["Full-stack generation", true, false], ["UI component quality", "Good", "Best-in-class"], ["Backend / DB", true, false], ["Auth built-in", true, false], ["Free tier", true, true]] },
    { name: "Framer", desc: "Motion-first website builder for designers. Beautiful animations, easy to learn. Very different use case — Framer is for marketing sites, not apps.", vs: [["App building", true, false], ["Animation quality", "Good", "Excellent"], ["Ease of use", "Medium", "High"], ["Full-stack", true, false], ["Free tier", true, true]] },
    { name: "Webflow", desc: "The gold standard for design-led marketing sites. Pixel-perfect control, excellent SEO. Not an AI builder — requires real learning investment.", vs: [["AI generation", true, false], ["Design control", "Good", "Excellent"], ["SEO tooling", "Basic", "Excellent"], ["Learning curve", "Low", "High"], ["Free tier", true, true]] },
    { name: "Cursor", desc: "AI-powered code editor for developers. Not a no-code tool — requires coding ability. Gives much more control over output quality and security.", vs: [["No-code accessible", true, false], ["Code control", "Low", "Full"], ["Security review", "Hard", "Easy"], ["Learning curve", "Low", "High"], ["Price", "$0–42/mo", "$20/mo"]] },
    { name: "Bubble", desc: "Mature no-code platform. Visual drag-and-drop, not AI-generated code. Steeper learning curve but more predictable security model.", vs: [["AI generation", true, false], ["Learning curve", "Low", "High"], ["Enterprise adoption", "Growing", "Established"], ["Security track record", "Mixed 2026", "Stronger"], ["Exportable code", true, false]] },
  ];
  const c = competitors[active];

  return (
    <div>
      {/* Tab strip */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {competitors.map((comp, i) => (
          <button key={comp.name} onClick={() => setActive(i)} style={{
            padding: "7px 14px", border: `1.5px solid ${active === i ? G.accent : G.border}`,
            borderRadius: 8, background: active === i ? G.accent : "transparent",
            color: active === i ? "#fff" : G.muted,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            transition: "all 0.15s ease",
          }}>vs {comp.name}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ animation: "fadeIn 0.25s ease" }}>
        <Prose>{c.desc}</Prose>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", background: G.text, color: G.card, fontSize: 12, fontWeight: 700, padding: "10px 20px", letterSpacing: "0.06em" }}>
            <span>Feature</span><span style={{ textAlign: "center" }}>Lovable</span><span style={{ textAlign: "center" }}>{c.name}</span>
          </div>
          {c.vs.map(([feat, lov, comp], i) => (
            <div key={feat} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", padding: "11px 20px", borderBottom: i < c.vs.length - 1 ? `1px solid ${G.border}` : "none", fontSize: 13 }}>
              <span>{feat}</span>
              <span style={{ textAlign: "center", color: lov === true ? G.good : lov === false ? G.warn : G.accent, fontWeight: 600 }}>{lov === true ? "✓" : lov === false ? "✗" : lov}</span>
              <span style={{ textAlign: "center", color: comp === true ? G.good : comp === false ? G.warn : G.accent, fontWeight: 600 }}>{comp === true ? "✓" : comp === false ? "✗" : comp}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   NAV DATA
═══════════════════════════════════════════════════════════ */
const NAV = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "autonomous", label: "Autonomous AI" },
  { id: "content", label: "Content" },
  { id: "security", label: "Security" },
  { id: "pricing", label: "Pricing" },
  { id: "comparisons", label: "vs Competitors" },
  { id: "prompts", label: "Prompt Library" },
  { id: "tutorials", label: "Tutorials" },
  { id: "verdict", label: "Verdict" },
];

/* ═══════════════════════════════════════════════════════════
   PAGE: OVERVIEW
═══════════════════════════════════════════════════════════ */
const PageOverview = ({ goTo }) => (
  <div>
    {/* Hero */}
    <div style={{ background: G.text, borderRadius: 20, padding: "48px 40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: G.accent, opacity: 0.12 }} />
      <div style={{ position: "absolute", bottom: -80, left: "40%", width: 200, height: 200, borderRadius: "50%", background: G.accent, opacity: 0.07 }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.accent, marginBottom: 14 }}>No-Code Reviewed · In-Depth Platform Review</div>
        <h1 style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 800, color: "#faf8f4", letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: 18 }}>
          Lovable<br />Complete Review 2026
        </h1>
        <p style={{ fontSize: 17, color: "rgba(250,248,244,0.72)", lineHeight: 1.65, maxWidth: 580, marginBottom: 32 }}>
          The AI app builder that lets anyone go from idea to deployed full-stack web app in hours. We tested every major capability, dug into the security record, and built real apps to give you the most thorough Lovable review available.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => goTo("verdict")} style={{ padding: "13px 26px", background: G.accent, color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>See Our Verdict →</button>
          <button onClick={() => goTo("prompts")} style={{ padding: "13px 26px", background: "rgba(250,248,244,0.12)", color: "#faf8f4", border: "1px solid rgba(250,248,244,0.2)", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Prompt Library</button>
        </div>
      </div>
    </div>

    {/* Quick verdict bar */}
    <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "20px 28px", marginBottom: 32, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
      {[
        { label: "Overall Score", val: "7.6 / 10" },
        { label: "Ease of Use", val: "9.2 / 10" },
        { label: "Autonomous AI", val: "8.5 / 10" },
        { label: "Security", val: "5.0 / 10" },
        { label: "Value", val: "7.4 / 10" },
      ].map(item => (
        <div key={item.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: G.accent }}>{item.val}</div>
          <div style={{ fontSize: 11, color: G.muted, marginTop: 2, letterSpacing: "0.04em" }}>{item.label}</div>
        </div>
      ))}
      <div style={{ marginLeft: "auto" }}>
        <Badge variant="accent">Updated May 2026</Badge>
      </div>
    </div>

    {/* ★ ENHANCED: Key stats with animated count-up */}
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
      <AnimatedStatPill num="$6.6B" label="Series B valuation, late 2025" />
      <AnimatedStatPill num="8M+" label="Registered users in 2026" />
      <AnimatedStatPill num="$200M+" label="Annual Recurring Revenue" />
      <AnimatedStatPill num="$330M" label="Series B funding raised" />
      <AnimatedStatPill num="60%" label="Of all new code projected AI-generated by end of 2026" />
    </div>

    <SectionHead eyebrow="What Is Lovable" title="The AI Full-Stack Engineer" sub="Formerly GPT Engineer — now the category leader in vibe coding." />
    <Prose>Lovable is an AI-powered full-stack app builder. Describe what you want in plain English and the platform generates a complete web application — React frontend, Tailwind styling, Supabase backend, authentication, database schema, and a live hosted URL — without you writing a single line of code.</Prose>
    <Prose>What separates it from traditional no-code tools is that Lovable generates real, exportable code. You're not locked into proprietary markup. Export your project to GitHub at any time and hand it to a developer. That "AI full-stack engineer" positioning attracted enterprise-adjacent users from Nvidia, Microsoft, Uber, and Spotify — and made the security incidents of early 2026 all the more significant.</Prose>
    <Prose>Collins English Dictionary named "vibe coding" — describing an app and having AI build it — Word of the Year for 2025. Lovable is the most prominent platform in that category, backed by a $6.6B valuation after its late 2025 Series B.</Prose>

    <Divider />

    <SectionHead eyebrow="The Bottom Line" title="Who It's For" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.good, marginBottom: 14 }}>Best For</div>
        {["Non-technical founders validating MVPs", "Designers bringing Figma work to life", "Agencies prototyping before dev handoff", "Internal tools for small teams", "Students learning full-stack concepts", "Anyone needing a demo in hours, not weeks"].map(t => (
          <div key={t} style={{ fontSize: 13, lineHeight: 1.6, padding: "4px 0", paddingLeft: 16, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: G.good, fontWeight: 700 }}>✓</span>{t}
          </div>
        ))}
      </Card>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.warn, marginBottom: 14 }}>Approach With Caution</div>
        {["Apps collecting real user PII without a security audit", "Enterprise production systems at scale", "Complex multi-step business logic", "High-traffic apps needing robust hosting", "Regulated industries without dev review", "Teams needing autonomous content generation"].map(t => (
          <div key={t} style={{ fontSize: 13, lineHeight: 1.6, padding: "4px 0", paddingLeft: 16, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: G.warn, fontWeight: 700 }}>✗</span>{t}
          </div>
        ))}
      </Card>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: FEATURES
═══════════════════════════════════════════════════════════ */
const PageFeatures = () => {
  const features = [
    { icon: "⚡", title: "Prompt-to-App Generation", tier: "All plans", detail: "Type a description and Lovable builds pages, routes, components, and logic. Works best for standard app patterns: dashboards, CRMs, booking tools, and marketplaces." },
    { icon: "🗄️", title: "Supabase Integration", tier: "All plans", detail: "Authentication, database, and file storage are wired automatically. Lovable creates tables, sets up auth flows, and writes RLS policies — though these need human review before going live." },
    { icon: "🎨", title: "Visual Editor", tier: "All plans", detail: "Point-and-click editing on top of generated code. Unique in the category — most competitors are chat-only. Adjust layouts, colors, and content without prompting." },
    { icon: "🔗", title: "Figma Import", tier: "All plans", detail: "Import your design mockup and Lovable attempts to match the layout and styles. Best for getting 80% of the way there quickly." },
    { icon: "💻", title: "GitHub Integration & Export", tier: "All plans", detail: "Full bidirectional GitHub sync. Your code is never trapped. Export the entire repo at any time." },
    { icon: "🤖", title: "Code Agent Mode", tier: "Paid plans", detail: "Unlocks direct code editing within the platform. The AI debugs and refactors across multiple files simultaneously." },
    { icon: "🚀", title: "Lovable Cloud Hosting", tier: "All plans", detail: "Apps deploy to lovable.app subdomains automatically. Custom domain support on Starter and above." },
    { icon: "👥", title: "Collaboration", tier: "All plans", detail: "Free plan supports up to 20 collaborators on public projects. Paid plans unlock private project collaboration." },
    { icon: "🧠", title: "Persistent Context", tier: "All plans", detail: "The 2026 version maintains architectural memory across sessions — design decisions, component names, and data models are remembered." },
    { icon: "🔐", title: "SSO & Data Training Opt-Out", tier: "Business+", detail: "Enterprise essentials: Single Sign-On and opt-out from having your prompts used to train Lovable's AI. Critical for client work." },
    { icon: "📐", title: "Design Templates", tier: "Business+", detail: "Reusable design system templates to standardize output across a team." },
    { icon: "🔑", title: "API Key Scanner", tier: "All plans", detail: "Automatically detects when API keys are exposed in generated code before you publish." },
  ];

  return (
    <div>
      <SectionHead eyebrow="Platform Features" title="Everything Lovable Can Do" sub="A complete breakdown of every significant feature — what it actually does in practice, not just what the marketing page says." />

      {/* ★ ENHANCED: How It Works animated flow diagram */}
      <HowItWorksFlow />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
        {features.map(f => (
          <Card key={f.title}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>{f.icon}</span>
              <Badge variant={f.tier === "Business+" ? "warn" : f.tier === "Paid plans" ? "accent" : "neutral"}>{f.tier}</Badge>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{f.detail}</p>
          </Card>
        ))}
      </div>

      <Divider />
      <SectionHead eyebrow="What It Builds Best" title="Ideal App Types" />
      <Alert type="good" title="Strong Fit">CRUD applications — CRMs, project trackers, dashboards, booking tools, waitlist apps, internal admin panels, SaaS landing pages with auth, and marketplaces all generate cleanly with minimal follow-up prompting.</Alert>
      <Alert type="warn" title="Weaker Territory">Complex business logic — multi-step conditional workflows, nuanced data transformations, real-time collaborative features — can still trip up the AI. Expect to spend meaningful credit iterating.</Alert>

      <Divider />
      <SectionHead eyebrow="Tech Stack" title="What Lovable Actually Generates" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { layer: "Frontend", tech: "React + Tailwind CSS", note: "Modern, clean, exportable" },
          { layer: "Backend", tech: "Supabase (PostgreSQL)", note: "Auth, DB, storage, edge functions" },
          { layer: "Hosting", tech: "Lovable Cloud", note: "Automatic deploy on every change" },
          { layer: "Auth", tech: "Supabase Auth", note: "Email, OAuth, magic link" },
          { layer: "Version Control", tech: "GitHub Sync", note: "Full bidirectional integration" },
          { layer: "Routing", tech: "React Router", note: "Multi-page apps out of the box" },
        ].map(r => (
          <Card key={r.layer} style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.muted, marginBottom: 6 }}>{r.layer}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{r.tech}</div>
            <div style={{ fontSize: 12, color: G.muted }}>{r.note}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: AUTONOMOUS AI
═══════════════════════════════════════════════════════════ */
const PageAutonomous = () => (
  <div>
    <SectionHead eyebrow="Autonomous Capabilities" title="How Much Can Lovable Actually Do On Its Own?" sub="The build loop, iteration quality, context persistence, and where the autonomy breaks down." />

    <Alert type="good" title="What's Genuinely Autonomous">
      From a single prompt, Lovable autonomously generates route structure, all page components, database schema, auth configuration, API layer, styling system, and deployment. This is not scaffolding — it's a working app.
    </Alert>

    {/* ★ ENHANCED: Animated stat pills */}
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
      <AnimatedStatPill num="1" label="Prompt to generate a complete full-stack app" />
      <AnimatedStatPill num="5" label="Minutes from prompt to live hosted URL" />
      <AnimatedStatPill num="2" label="Typical credits for a full feature addition" />
      <AnimatedStatPill num="5" label="Free plan daily credit limit" />
    </div>

    <SectionHead eyebrow="The Build Loop" title="How Lovable's Autonomy Works" />
    {[
      { step: "01", title: "Prompt Interpretation", body: "Lovable parses your natural language description and infers app type, data model, and required pages. It makes architectural decisions without asking — which is fast but means you need to be specific upfront." },
      { step: "02", title: "Code Generation", body: "React components, routes, Supabase tables, auth flows, and Tailwind styles are generated simultaneously across multiple files as a coherent whole." },
      { step: "03", title: "Deployment", body: "The app is automatically built and deployed to a Lovable subdomain. No manual build step, no config. Every subsequent prompt triggers a new deploy." },
      { step: "04", title: "Iteration", body: "Subsequent prompts modify the existing app rather than regenerating from scratch. The AI maintains awareness of what exists." },
      { step: "05", title: "Context Persistence (2026)", body: "The AI now remembers your design decisions, component names, and data model across sessions — preventing the architectural drift that frustrated users in 2025." },
    ].map(s => (
      <div key={s.step} style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: G.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{s.step}</div>
        <Card style={{ marginTop: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
          <p style={{ fontSize: 14, color: G.muted, lineHeight: 1.65 }}>{s.body}</p>
        </Card>
      </div>
    ))}

    <Divider />
    <SectionHead eyebrow="Limitations" title="Where the Autonomy Breaks Down" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
      {[
        { title: "Complex Business Logic", body: "Multi-step conditional workflows, nuanced data transformations, and real-time features often require many iterations or developer intervention." },
        { title: "Credit Burn Rate", body: "Iterative debugging and refinement consumes credits faster than initial generation. Hard to predict total cost for a complex app." },
        { title: "Security by Default", body: "The AI doesn't always implement RLS, validate auth functions, or follow security best practices — you have to explicitly ask, and then verify." },
        { title: "Hallucination Rate", body: "91.5% of vibe-coded apps had at least one AI hallucination-related flaw in Q1 2026. Review generated logic before launch." },
      ].map(l => (
        <Card key={l.title}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: G.warn }}>⚠ {l.title}</h4>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{l.body}</p>
        </Card>
      ))}
    </div>

    <Alert type="info" title="MCP Integration: Extending Autonomy">
      Lovable supports Model Context Protocol (MCP) connections, which lets you wire external services directly into your app's AI context. Third-party tools like Frase.io, Supabase extensions, and custom API connectors can be bridged into Lovable's build loop.
    </Alert>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: CONTENT GENERATION
═══════════════════════════════════════════════════════════ */
const PageContent = () => (
  <div>
    <SectionHead eyebrow="Content Generation" title="What Lovable Actually Does With Content" sub="An honest breakdown — because the answer matters a lot for site builders and content-driven businesses." />
    <Alert type="warn" title="Important Distinction">Lovable builds apps. It does not write content. It has no native blog generation, SEO tooling, keyword research, or autonomous publishing pipeline.</Alert>
    <Prose>Think of Lovable as the platform that builds and hosts the infrastructure where content lives — not the system that creates content. It can scaffold a fully functional CMS, a blog with category filtering, an article editor, and a public-facing reading experience. It will not populate any of that with articles.</Prose>
    <Divider />
    <SectionHead eyebrow="What It CAN Build" title="Content Infrastructure Lovable Excels At" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginBottom: 32 }}>
      {[
        { icon: "📝", title: "Blog CMS", body: "Full admin panel for managing articles, drafts, tags, and authors. Built in one prompt." },
        { icon: "🗂️", title: "Category System", body: "Tag-based filtering, category pages, related article recommendations." },
        { icon: "✍️", title: "Article Editor UI", body: "Rich text editor interface connected to your Supabase database." },
        { icon: "📡", title: "RSS & Feeds", body: "RSS feed generation, newsletter signup forms, subscription management." },
        { icon: "📊", title: "Analytics Dashboard", body: "Page view tracking, reading time, popular posts — display layer for existing data." },
        { icon: "🔍", title: "SEO Metadata Fields", body: "Title, description, OG image, canonical URL fields scaffolded into every article." },
        { icon: "💬", title: "Comment Sections", body: "Supabase-backed commenting, upvotes, moderation queues." },
        { icon: "🔎", title: "Search Interface", body: "Full-text search UI connected to Supabase's search capabilities." },
      ].map(f => (
        <Card key={f.title} style={{ padding: "18px 20px" }}>
          <span style={{ fontSize: 22, marginBottom: 10, display: "block" }}>{f.icon}</span>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.title}</h4>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.55 }}>{f.body}</p>
        </Card>
      ))}
    </div>
    <Divider />
    <SectionHead eyebrow="Integration Strategy" title="Using Lovable + External Content Tools" />
    <Prose>Lovable supports Model Context Protocol (MCP) integrations. Frase.io confirmed in their 2026 documentation that Claude, Cursor, Lovable, and Replit can all connect to their read-write MCP endpoint — enabling content briefs, article drafts, and SEO audits through the bridge, not natively.</Prose>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
      {[
        { tool: "Frase.io", role: "SEO briefs, content scoring, keyword research", fit: "Strong — confirmed MCP integration with Lovable" },
        { tool: "Surfer SEO", role: "NLP-based content structure optimization", fit: "Manual integration via API" },
        { tool: "Jasper AI", role: "Long-form article generation at scale", fit: "Embed via API within your Lovable CMS" },
        { tool: "Writesonic", role: "Meta descriptions, SEO-optimized drafts", fit: "API integration, not native" },
      ].map(r => (
        <Card key={r.tool}>
          <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{r.tool}</h4>
          <p style={{ fontSize: 13, color: G.muted, marginBottom: 8, lineHeight: 1.5 }}>{r.role}</p>
          <Badge variant={r.fit.startsWith("Strong") ? "good" : "neutral"}>{r.fit}</Badge>
        </Card>
      ))}
    </div>
    <Alert type="neutral" title="The Right Mental Model for Content-Driven Sites">Use Lovable to build your review site infrastructure — the CMS, the article templates, the comparison tables, the scoring system, the user-facing pages. Use a dedicated content tool (Frase, Surfer, Jasper) to generate and optimize the articles that fill it.</Alert>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: SECURITY
═══════════════════════════════════════════════════════════ */
const PageSecurity = () => (
  <div>
    <SectionHead eyebrow="Security Deep-Dive" title="The Full Security Picture" sub="This is where the review gets uncomfortable. Read this before putting any real user data near Lovable." />

    {/* ★ ENHANCED: Animated security timeline replaces static incident grid */}
    <SecurityTimeline />

    {/* ★ ENHANCED: Animated stat pills */}
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
      <AnimatedStatPill num="3" label="Documented security incidents, H1 2026" />
      <AnimatedStatPill num="48" label="Days BOLA vulnerability was live after bug report closed" />
      <AnimatedStatPill num="62%" label="Max % of AI-generated code with vulnerabilities (2026 studies)" />
      <AnimatedStatPill num="91.5%" label="Of vibe-coded apps had hallucination-related flaws in Q1 2026" />
    </div>

    <SectionHead eyebrow="Root Cause" title="The Structural Problem" />
    <Prose>Lovable's security issues are not just bugs — they represent a structural challenge baked into the vibe coding model. When you describe an app and AI generates all the code, nobody reviews it. Most users can't review it even if they wanted to. The platform's value proposition is removing the need to understand code — which also removes the ability to audit it.</Prose>
    <Prose>Lovable is "representatively insecure" — not uniquely so. Industry-wide data shows 40–62% of AI-generated code contains security vulnerabilities. The market rewards growth and ease of use over security hardening.</Prose>

    <Alert type="warn" title="If You Were Using Lovable Before November 2025">
      Rotate all credentials immediately: API keys, Supabase access tokens, and any third-party integration tokens. Chat histories were exposed and may have included live credentials, database structures, and business logic.
    </Alert>

    <Divider />
    <SectionHead eyebrow="What Lovable Does Provide" title="Built-In Security Features" sub="To be fair — there are real security tools. They're just not sufficient on their own." />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginBottom: 28 }}>
      {[
        { icon: "🔑", title: "API Key Detection", body: "Automatically flags exposed API keys in generated code before publishing." },
        { icon: "🛡️", title: "RLS Prompting", body: "Flags when Supabase row-level security is not configured on tables containing user data." },
        { icon: "🔐", title: "Supabase Auth", body: "Secure auth flows built in. Email, OAuth, and magic link — all wired to Supabase's auth service." },
        { icon: "🔒", title: "SSO (Business+)", body: "Single Sign-On for corporate environments." },
        { icon: "🚫", title: "Training Opt-Out (Business+)", body: "Your prompts and code won't be used to train Lovable's AI models." },
        { icon: "🔏", title: "Encrypted Connections", body: "AI integrations use encrypted connections — no plain-text API traffic." },
      ].map(f => (
        <Card key={f.title} style={{ padding: "16px 18px" }}>
          <span style={{ fontSize: 20, marginBottom: 8, display: "block" }}>{f.icon}</span>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{f.title}</h4>
          <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.55 }}>{f.body}</p>
        </Card>
      ))}
    </div>

    <Divider />
    <SectionHead eyebrow="Action Items" title="Security Checklist for Lovable Users" />
    <Card>
      {[
        "Enable Supabase Row-Level Security on every table containing user data — don't assume it's on by default",
        "Never paste live API keys into Lovable's chat window — use environment variables instead",
        "Manually audit generated authentication functions before launch — test both happy path and edge cases",
        "If on Business plan, enable data training opt-out to protect proprietary logic and client work",
        "Export your GitHub repo and run a static analysis tool (e.g. Semgrep or Snyk) on the codebase",
        "For any app with real users, have a developer review all Supabase RLS policies before go-live",
        "Treat Lovable-hosted apps as prototypes until a security audit is completed",
        "Set up Supabase access logging and monitor for unusual query patterns after launch",
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 7 ? `1px solid ${G.border}` : "none" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fde8de", color: G.accent, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item}</p>
        </div>
      ))}
    </Card>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: PRICING
═══════════════════════════════════════════════════════════ */
const PagePricing = () => {
  const plans = [
    { name: "Free", price: "$0", period: "forever", credits: "5/day · 30/mo cap", highlight: false, features: ["Unlimited public projects", "5 daily credits (reset midnight UTC)", "GitHub integration", "Up to 20 collaborators", "lovable.app subdomain", "Lovable badge displayed", "No private projects", "No custom domain"] },
    { name: "Starter", price: "~$21", period: "/mo (annual)", credits: "More daily credits", highlight: false, features: ["Everything in Free", "Private projects", "Custom domain", "Code editing mode", "Credit rollover", "No Lovable badge"] },
    { name: "Pro", price: "~$42", period: "/mo (annual)", credits: "Substantially more", highlight: true, features: ["Everything in Starter", "Higher credit limits", "Priority support", "Team collaboration", "Advanced project settings"] },
    { name: "Business", price: "$50+", period: "/mo", credits: "Per-user configurable", highlight: false, features: ["Everything in Pro", "SSO (Single Sign-On)", "Data training opt-out ⚠", "Restricted projects", "Reusable design templates"] },
    { name: "Enterprise", price: "Custom", period: "", credits: "Custom", highlight: false, features: ["Everything in Business", "Custom API connections", "Dedicated support", "Professional onboarding", "SLA guarantees"] },
  ];

  return (
    <div>
      <SectionHead eyebrow="Pricing" title="All Plans, Real Costs, Hidden Gotchas" sub="Lovable uses a credit-based model. The free plan is genuinely useful. The costs get harder to predict as you scale." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 36, alignItems: "start" }}>
        {plans.map(p => (
          <div key={p.name} style={{
            background: p.highlight ? G.text : G.card,
            border: `2px solid ${p.highlight ? G.accent : G.border}`,
            borderRadius: 14, padding: "22px 20px", position: "relative",
          }}>
            {p.highlight && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: G.accent, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 99, letterSpacing: "0.07em", textTransform: "uppercase" }}>Most Popular</div>}
            <div style={{ fontSize: 14, fontWeight: 700, color: p.highlight ? "rgba(250,248,244,0.7)" : G.muted, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: p.highlight ? "#faf8f4" : G.text, lineHeight: 1 }}>{p.price}</div>
            <div style={{ fontSize: 12, color: p.highlight ? "rgba(250,248,244,0.5)" : G.muted, marginBottom: 14 }}>{p.period}</div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.accent, marginBottom: 12 }}>Credits: {p.credits}</div>
            {p.features.map(f => (
              <div key={f} style={{ fontSize: 12, padding: "3px 0", color: p.highlight ? "rgba(250,248,244,0.8)" : "#2e2a25", paddingLeft: 14, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: G.accent, fontWeight: 700 }}>·</span>{f}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Alert type="warn" title="The Hidden Cost Problem — Read This">
        Credits are tied to prompt complexity, not just volume. "Build this landing page" ≈ 2 credits. Iterative UI refinements and debugging sessions drain credits unpredictably. The credit system feels cheap upfront and becomes expensive once you're actively building.
      </Alert>

      <Alert type="warn" title="⚠ Data Training Opt-Out: Business Plan Only">
        By default, your prompts and generated code can be used to train Lovable's AI models. The opt-out is only available on Business plan ($50+/mo). If you're building client work or anything proprietary — you need Business tier minimum.
      </Alert>

      <Divider />

      {/* ★ ENHANCED: Interactive credit calculator */}
      <SectionHead eyebrow="Credit Usage Guide" title="How Fast Will You Burn Credits?" />
      <CreditCalculator />

      <Card>
        {[
          { action: "Generate initial app from scratch", cost: "3–6 credits", note: "Depends on app complexity" },
          { action: "Add a new page or section", cost: "~1–2 credits", note: "Simple additions" },
          { action: "Fix a specific bug", cost: "1 credit", note: "Clear, targeted prompts" },
          { action: "Redesign a component's styling", cost: "1–2 credits", note: "More if multiple components" },
          { action: "Add authentication flow", cost: "2–4 credits", note: "Supabase config included" },
          { action: "Major structural refactor", cost: "4–8 credits", note: "Multiple file changes" },
          { action: "Debug complex logic issue", cost: "2–6 credits", note: "May require multiple attempts" },
        ].map((r, i) => (
          <div key={r.action} style={{ display: "grid", gridTemplateColumns: "1fr auto 160px", gap: 16, padding: "12px 0", borderBottom: i < 6 ? `1px solid ${G.border}` : "none", alignItems: "center" }}>
            <span style={{ fontSize: 14 }}>{r.action}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: G.accent, whiteSpace: "nowrap" }}>{r.cost}</span>
            <span style={{ fontSize: 12, color: G.muted }}>{r.note}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: COMPARISONS
═══════════════════════════════════════════════════════════ */
const PageComparisons = () => (
  <div>
    <SectionHead eyebrow="vs The Competition" title="How Lovable Stacks Up" sub="Head-to-head against the main alternatives in 2026." />
    {/* ★ ENHANCED: Tab-based comparison toggle instead of stacked tables */}
    <ComparisonToggle />
    <Divider />
    <Alert type="neutral" title="Bottom Line on Competitors">
      Lovable wins on accessibility and speed-to-deployed-app. It loses on security track record (vs Bubble), code control (vs Cursor), and UI component quality (vs v0). Bolt.new is the closest direct competitor — choose based on whether you need the visual editor and Figma import (Lovable) or prefer more token cost transparency (Bolt.new).
    </Alert>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: PROMPT LIBRARY
═══════════════════════════════════════════════════════════ */
const PagePrompts = () => {
  const [activeCategory, setActiveCategory] = useState("Starter Apps");
  const library = {
    "Starter Apps": [
      { title: "SaaS Landing Page + Waitlist", prompt: "Build a SaaS landing page for a project management tool called 'Flowdesk'. Include a hero with headline and subheadline, a features section with 3 feature cards, a pricing section with 3 tiers (Free, Pro $29/mo, Team $79/mo), and a waitlist signup form that stores emails in Supabase. Use a clean, modern dark theme with a blue accent color." },
      { title: "CRM with Pipeline", prompt: "Create a CRM application with: a contacts list view with search and filter by status, a deals pipeline board with drag-and-drop between stages (Lead, Qualified, Proposal, Won, Lost), individual contact detail pages with notes and activity history, and a dashboard showing total deal value by stage. Connect to Supabase for auth and data storage." },
      { title: "Booking / Scheduling App", prompt: "Build a service booking app for a personal trainer. Include: a public-facing page showing available time slots for the next 14 days, a booking form collecting name, email, and service type, a confirmation email trigger via Supabase edge functions, and an admin dashboard to view and manage all bookings." },
      { title: "Internal Knowledge Base", prompt: "Create an internal knowledge base app with: a searchable article library, category-based navigation (Engineering, HR, Product, Marketing), a rich text article editor for admins, article view counts, and a 'last updated' timestamp on each article. Supabase auth with role-based access — admins can create/edit, regular users can only read." },
    ],
    "Review & Comparison": [
      { title: "Software Review Site Structure", prompt: "Build a software review and comparison site. Include: a homepage with featured reviews and a search bar, individual review pages with a scoring system (1-10 on 6 criteria), a comparison tool that shows two products side-by-side, a category browser, and a submit-your-review form. Store all data in Supabase. Admin panel to approve reviews." },
      { title: "Product Comparison Table", prompt: "Create a dynamic product comparison page for no-code tools. Display a sticky comparison table with rows for: Price, Free Plan, AI Generation, GitHub Export, Custom Domain, Auth Built-in, Database Included, and our Score. Allow visitors to toggle which products are shown. Data stored in Supabase." },
      { title: "Review Scoring Widget", prompt: "Build a reusable review score component. Display: an overall score as a large number with a circular progress ring, individual category scores as horizontal bars, a color-coded verdict badge (Excellent/Good/Fair/Poor), and pros and cons lists." },
    ],
    "Dashboards & Tools": [
      { title: "Analytics Dashboard", prompt: "Build a business analytics dashboard with: a header showing date range picker (last 7d, 30d, 90d, custom), 4 KPI cards (Revenue, New Users, Conversion Rate, Churn), a line chart for revenue over time, a bar chart for top traffic sources, a recent signups table, and a goal progress tracker." },
      { title: "Link-in-Bio Tool", prompt: "Create a link-in-bio builder similar to Linktree. Users sign up, create a profile with a custom username, add/edit/reorder links, choose from 5 color themes, and get a public URL at /username. Track click counts per link." },
      { title: "ROI Calculator", prompt: "Build a standalone ROI calculator for a SaaS product. Inputs: current team size (slider), hours per week on manual task (slider), hourly rate ($), current tool cost ($). Output: time saved per week, annual dollar value of time saved, net ROI after tool cost, payback period in months. Show results dynamically as sliders move." },
    ],
    "Content & CMS": [
      { title: "Blog CMS with Admin", prompt: "Build a blog CMS. Public side: article list with search, filter by tag, estimated read time, and author avatar. Admin side (auth required): create/edit/delete articles with a rich text editor, manage tags, set publish status (draft/published), and upload featured images to Supabase storage. SEO fields: title, meta description, OG image URL." },
      { title: "Newsletter + Archive", prompt: "Build a newsletter platform. Public side: archive of past issues with subject line, date, and preview. Subscription form collecting email and frequency preference. Admin side: compose new issues with a rich text editor, send to Supabase-stored subscribers, track open rates via unique link tracking." },
    ],
  };
  const categories = Object.keys(library);

  return (
    <div>
      <SectionHead eyebrow="Prompt Library" title="Copy-Paste Prompts That Work" sub="Tested prompts for common Lovable use cases. Each one is written to minimize follow-up iterations." />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "7px 16px", border: `1.5px solid ${activeCategory === cat ? G.accent : G.border}`,
            borderRadius: 8, background: activeCategory === cat ? G.accent : "transparent",
            color: activeCategory === cat ? "#fff" : G.muted,
            fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
          }}>{cat}</button>
        ))}
      </div>
      {library[activeCategory].map(p => (
        <div key={p.title} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{p.title}</h3>
          <PromptBlock text={p.prompt} />
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: TUTORIALS
═══════════════════════════════════════════════════════════ */
const PageTutorials = () => {
  const [activeTutorial, setActiveTutorial] = useState(0);
  const tutorials = [
    {
      title: "Your First App in 30 Minutes",
      level: "Beginner",
      time: "30 min",
      steps: [
        { title: "Start with a specific prompt", body: "The most common mistake is a vague first prompt. Instead of 'Build me a task manager,' write: 'Build a task management app with a projects list, individual project pages showing tasks grouped by status (Todo, In Progress, Done), the ability to create, edit, and delete tasks, and user authentication so each user only sees their own tasks. Use a minimal design with white background and blue accent color.'" },
        { title: "Review what was generated", body: "Before doing anything else, click through every page Lovable created. Check the navigation, test the forms, try to create and delete a record. Note what works and what needs adjustment. Don't start iterating yet — complete your audit first so you can batch your follow-up prompts." },
        { title: "Fix the most important thing first", body: "Pick the single most broken or missing thing and prompt to fix that first. Don't try to change three things at once — you'll spend credits on conflicting changes. One clear, specific prompt per iteration." },
        { title: "Connect your own Supabase project", body: "By default, Lovable uses a shared Supabase instance. For anything beyond a quick prototype, connect your own: go to Settings in Lovable, add your Supabase project URL and anon key. This gives you full control of your database, better security, and the ability to add custom edge functions later." },
        { title: "Publish and share", body: "Hit Deploy in the Lovable interface. Your app is live on a lovable.app subdomain instantly. Share the link — this is the fastest way to get real feedback on whether you've built the right thing before spending more credits refining it." },
      ],
    },
    {
      title: "Connecting Supabase & Securing Your App",
      level: "Intermediate",
      time: "45 min",
      steps: [
        { title: "Understand what Lovable generates by default", body: "Lovable creates Supabase tables, auth flows, and API calls automatically. But it does not always create Row-Level Security policies — and even when it does, those policies may not be correct. Never assume your app is secure until you've manually verified the RLS configuration in the Supabase dashboard." },
        { title: "Enable Row-Level Security", body: "Go to your Supabase dashboard, click on Table Editor, select any table with user data, and click the RLS icon. If Lovable hasn't generated RLS policies, you'll see 'RLS is disabled.' Prompt Lovable: 'Enable row-level security on the [table name] table. Each user should only be able to read, update, and delete their own rows.'" },
        { title: "Test security manually", body: "Create two test accounts. Log in as User A and create some data. Log out. Log in as User B. Attempt to access User A's data by navigating directly to a URL or using the browser console to make a Supabase query. If RLS is working correctly, User B should see zero results for User A's data." },
      ],
    },
    {
      title: "Exporting & Handing Off to a Developer",
      level: "Intermediate",
      time: "45 min",
      steps: [
        { title: "Prepare for export", body: "Before exporting, do a final cleanup pass in Lovable. Prompt: 'Review the codebase for any hardcoded credentials, placeholder text that should be removed, unused components, or console.log statements left from debugging. Clean these up and make sure all environment variables are properly referenced.'" },
        { title: "Export to GitHub", body: "Click the GitHub icon in the top navigation. Choose 'Push to new repository' and name it something descriptive. Lovable will push the complete codebase including all React components, Tailwind config, package.json with all dependencies, and Supabase client setup." },
        { title: "Document the architecture", body: "In Lovable, prompt: 'Generate a README.md for this project that includes: an overview of what the app does, the tech stack, all environment variables needed, how to run the project locally, a description of the database schema and relationships, and any known limitations.' Review and edit this README before handing off." },
        { title: "Brief the developer on security", body: "Specifically flag: which RLS policies exist and which tables might still need them, any auth flows that were tested, and any API integrations that use third-party keys. Ask the developer to run Semgrep or Snyk on the codebase as their first action." },
      ],
    },
    {
      title: "Building a Review Site on Lovable",
      level: "Intermediate",
      time: "60 min",
      steps: [
        { title: "Plan your data model first", body: "Before writing a single prompt, design your database on paper. For a review site you likely need: a reviews table (id, title, slug, overall_score, published), a scores table (review_id, category, score), a pros_cons table (review_id, type, text), and a categories table. Having this mapped out lets you write a precise first prompt." },
        { title: "First prompt: full structure", body: "Write a comprehensive first prompt: 'Build a software review website called No-Code Reviewed. Database tables: reviews (id, title, slug, tagline, overall_score, published), score_categories (id, review_id, category_name, score), pros_cons (id, review_id, type [pro/con], text). Public pages: homepage with featured reviews grid, category filter, search. Individual review pages showing scores as progress bars, pros/cons lists, and a verdict section. Admin panel (auth-required) to create, edit, and publish reviews. Clean editorial design with orange accent color #e8541a.'" },
        { title: "Build the scoring component", body: "After initial generation, focus on the scoring visualization: 'Create a reusable ScoreCard component that takes a score (0-10) and label as props. Display the score as a horizontal bar with the label on the left and the numeric score on the right. Color the bar: red for scores under 4, orange for 4-7, green for 7+.'" },
        { title: "Add comparison and SEO", body: "Prompt for a comparison page at /compare — side-by-side table showing all score categories for 2-4 selected products. Then add SEO: 'Add SEO metadata to all pages. Each review page should dynamically set: document title as [Product Name] Review 2026 — No-Code Reviewed, meta description from the review's tagline, og:title, og:description, og:image.'" },
      ],
    },
  ];
  const activeTut = tutorials[activeTutorial];

  return (
    <div>
      <SectionHead eyebrow="Tutorials" title="Step-by-Step Guides" sub="Real workflows for the most important Lovable use cases — from first app to secure production handoff." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
        {tutorials.map((t, i) => (
          <button key={t.title} onClick={() => setActiveTutorial(i)} style={{
            background: activeTutorial === i ? G.accent : G.card,
            border: `2px solid ${activeTutorial === i ? G.accent : G.border}`,
            borderRadius: 12, padding: "16px 16px", textAlign: "left",
            cursor: "pointer", transition: "all 0.15s",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: activeTutorial === i ? "rgba(255,255,255,0.7)" : G.muted, marginBottom: 6 }}>
              {t.level} · {t.time}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: activeTutorial === i ? "#fff" : G.text, lineHeight: 1.4 }}>{t.title}</div>
          </button>
        ))}
      </div>
      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "32px 36px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24 }}>
          <Badge variant="accent">{activeTut.level}</Badge>
          <Badge>⏱ {activeTut.time}</Badge>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 28, letterSpacing: "-0.02em" }}>{activeTut.title}</h2>
        {activeTut.steps.map((step, i) => (
          <div key={step.title} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 20, marginBottom: 28 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${G.accent}`, color: G.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{step.title}</h4>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#2e2a25" }}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: VERDICT
═══════════════════════════════════════════════════════════ */
const PageVerdict = ({ goTo }) => {
  const scores = [
    { label: "Ease of Use", score: 9.2 },
    { label: "App Quality", score: 7.8 },
    { label: "Autonomous", score: 8.5 },
    { label: "Content", score: 5.5 },
    { label: "Security", score: 5.0 },
    { label: "Value", score: 7.4 },
    { label: "Docs", score: 7.0 },
    { label: "vs Rivals", score: 8.0 },
  ];
  const overall = (scores.reduce((a, s) => a + s.score, 0) / scores.length).toFixed(1);

  return (
    <div>
      <SectionHead eyebrow="Final Verdict" title="Our Definitive Take on Lovable 2026" sub="After testing every feature, reviewing every incident, and building real apps — here's the complete picture." />

      {/* The big verdict with animated score ring */}
      <div style={{ background: G.text, borderRadius: 20, padding: "40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: G.accent, opacity: 0.1 }} />
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* ★ ENHANCED: Animated progress ring replaces the static big number */}
          <ScoreRing score={overall} />
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ color: "rgba(250,248,244,0.88)", fontSize: 17, lineHeight: 1.7 }}>
              Lovable is genuinely impressive for going from idea to deployed app in hours — one of the best tools available for that specific job. The persistent context, improved Supabase integration, and clean default UI make it a legitimate productivity multiplier for non-technical founders.
            </p>
            <p style={{ color: "rgba(250,248,244,0.65)", fontSize: 15, lineHeight: 1.65, marginTop: 14 }}>
              But the security record in 2026 cannot be glossed over. Three documented incidents, a BOLA vulnerability left open for 48 days, and an industry-wide statistic that 40–62% of AI-generated code contains vulnerabilities. Use it for prototyping, validation, and MVPs. Don't treat the output as production-ready without a security audit.
            </p>
          </div>
        </div>
      </div>

      {/* ★ ENHANCED: Radar chart + animated score bars side by side */}
      <Card style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.muted, marginBottom: 20 }}>Category Breakdown</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
          <div>
            {scores.map((s, i) => <AnimatedScoreBar key={s.label} label={s.label} score={s.score} delay={i * 60} />)}
          </div>
          <RadarChart scores={scores} />
        </div>
      </Card>

      {/* Verdict grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.good, marginBottom: 16 }}>✓ Where It Wins</div>
          {["Fastest path from idea to deployed app in 2026", "Generates real, exportable React code — not locked-in markup", "Clean, contemporary UI — doesn't look obviously AI-generated", "Persistent context prevents architectural drift across sessions", "Figma import and visual editor are unique competitive advantages", "Free plan is genuinely useful with no credit card required", "GitHub export means you always own your code"].map(t => (
            <div key={t} style={{ fontSize: 13, lineHeight: 1.6, padding: "4px 0 4px 16px", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: G.good }}>·</span>{t}
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.warn, marginBottom: 16 }}>✗ Where It Falls Short</div>
          {["Three documented security incidents in H1 2026", "40–62% of AI-generated code contains vulnerabilities", "Data training opt-out locked behind Business plan", "Credit costs unpredictable and expensive when iterating", "Complex business logic still requires developer intervention", "Content generation is not a feature — it's an infrastructure platform", "Not suitable for high-traffic or regulated-industry production"].map(t => (
            <div key={t} style={{ fontSize: 13, lineHeight: 1.6, padding: "4px 0 4px 16px", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: G.warn }}>·</span>{t}
            </div>
          ))}
        </Card>
      </div>

      <SectionHead eyebrow="Who Should Use It" title="Our Specific Recommendations" />
      {[
        { persona: "Non-technical founder with an idea", rec: "Start here. Lovable is the fastest way to validate whether your idea is worth pursuing before hiring a developer. Use the free plan, build your MVP in a weekend, share it with potential users.", verdict: "Strong Yes", badge: "good" },
        { persona: "Designer wanting to ship without code", rec: "Import your Figma designs and use Lovable to bring them to life. You'll get 80% of the way there much faster than learning to code.", verdict: "Yes", badge: "good" },
        { persona: "Agency building client MVPs", rec: "Solid choice for fast prototyping. Upgrade to Business plan for the data training opt-out — client code should not be training Lovable's models.", verdict: "Yes, with caveats", badge: "warn" },
        { persona: "Enterprise with production requirements", rec: "Not yet. Three incidents in H1 2026 means it hasn't earned production trust for enterprise data. Use it for internal prototyping only.", verdict: "Not Yet", badge: "critical" },
        { persona: "Content-driven site builder", rec: "Lovable builds the infrastructure; you'll need separate tools for content. Budget separately for content generation tools and plan the integration strategy before you start building.", verdict: "Partial Fit", badge: "neutral" },
      ].map(r => (
        <div key={r.persona} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: "18px 22px", marginBottom: 12, alignItems: "start" }}>
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{r.persona}</h4>
            <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{r.rec}</p>
          </div>
          <Badge variant={r.badge}>{r.verdict}</Badge>
        </div>
      ))}

      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "28px 32px", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to try Lovable?</h3>
          <p style={{ fontSize: 14, color: G.muted, lineHeight: 1.6 }}>Start on the free plan — no credit card needed. Build your first prototype and see how far you get before hitting the credit wall.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" style={{ padding: "13px 26px", background: G.accent, color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "block" }}>Try Lovable Free →</a>
          <button onClick={() => goTo("prompts")} style={{ padding: "11px 26px", background: "transparent", color: G.text, border: `1.5px solid ${G.border}`, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Browse Prompt Library</button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function LovableMicrosite() {
  const [activePage, setActivePage] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);

  const goTo = (id) => {
    setActivePage(id);
    setMenuOpen(false);
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  };

  const activeLabel = NAV.find(n => n.id === activePage)?.label;

  const pages = {
    overview: <PageOverview goTo={goTo} />,
    features: <PageFeatures />,
    autonomous: <PageAutonomous />,
    content: <PageContent />,
    security: <PageSecurity />,
    pricing: <PagePricing />,
    comparisons: <PageComparisons />,
    prompts: <PagePrompts />,
    tutorials: <PageTutorials />,
    verdict: <PageVerdict goTo={goTo} />,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: G.text, background: G.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${G.bg}; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${G.border}; } ::-webkit-scrollbar-thumb { background: ${G.muted}; border-radius: 3px; }
        button { font-family: 'DM Sans', sans-serif; }
        a { font-family: 'DM Sans', sans-serif; }
        input[type=range] { height: 4px; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: flex !important; }
        }
        @media (min-width: 641px) {
          .mobile-nav-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      {/* Top nav bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(240,237,231,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${G.border}`, height: G.navH }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: "100%", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.muted, lineHeight: 1 }}>No-Code Reviewed</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: G.text, lineHeight: 1.2 }}>Lovable <span style={{ color: G.accent }}>2026</span></div>
          </div>
          <nav className="desktop-nav" style={{ display: "flex", gap: 2, flex: 1, overflow: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => goTo(n.id)} style={{
                padding: "6px 12px", border: "none", borderRadius: 7,
                background: activePage === n.id ? G.accent : "transparent",
                color: activePage === n.id ? "#fff" : G.muted,
                fontSize: 12.5, fontWeight: activePage === n.id ? 700 : 500,
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.12s",
              }}>
                {n.id === "security" && <span style={{ marginRight: 4 }}>⚠</span>}{n.label}
              </button>
            ))}
          </nav>
          <button className="mobile-nav-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            marginLeft: "auto", background: "none", border: `1px solid ${G.border}`,
            borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: G.text, display: "none", alignItems: "center", gap: 6,
          }}>
            ☰ {activeLabel}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu" style={{ position: "fixed", top: G.navH, left: 0, right: 0, zIndex: 99, background: G.card, borderBottom: `1px solid ${G.border}`, padding: 12 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => goTo(n.id)} style={{
              display: "block", width: "100%", textAlign: "left", padding: "12px 16px",
              border: "none", borderRadius: 8, background: activePage === n.id ? G.accent : "transparent",
              color: activePage === n.id ? "#fff" : G.text, fontSize: 14, fontWeight: activePage === n.id ? 700 : 500,
              cursor: "pointer", marginBottom: 2,
            }}>{n.label}</button>
          ))}
        </div>
      )}

      <div ref={mainRef} style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ fontSize: 12, color: G.muted, marginBottom: 24, display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ cursor: "pointer" }} onClick={() => goTo("overview")}>Lovable Review</span>
          {activePage !== "overview" && <>
            <span>›</span>
            <span style={{ color: G.accent, fontWeight: 600 }}>{activeLabel}</span>
          </>}
        </div>

        {pages[activePage]}

        <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 32, marginTop: 48, display: "flex", justifyContent: "space-between", gap: 12 }}>
          {(() => {
            const idx = NAV.findIndex(n => n.id === activePage);
            const prev = idx > 0 ? NAV[idx - 1] : null;
            const next = idx < NAV.length - 1 ? NAV[idx + 1] : null;
            return (
              <>
                {prev ? (
                  <button onClick={() => goTo(prev.id)} style={{ padding: "10px 18px", background: G.card, border: `1px solid ${G.border}`, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", color: G.text }}>← {prev.label}</button>
                ) : <div />}
                {next && (
                  <button onClick={() => goTo(next.id)} style={{ padding: "10px 18px", background: G.accent, border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff" }}>{next.label} →</button>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
