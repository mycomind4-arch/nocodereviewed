import { useState } from "react";

/* ═══════════════════════════════════════════════════════════
   NO-CODE REVIEWED — PLATFORM FINDER WIZARD
   nocodereviewed.lovable.app
   Design: DM Sans + DM Mono, matches anchor site aesthetic
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   BRAND SVG ASSETS — No-Code Reviewed
───────────────────────────────────────────── */

const IconPersonalized = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="20" stroke="#72685f" strokeWidth="2"/>
    <circle cx="36" cy="36" r="6" fill="#e8541a"/>
    <path d="M36 36L50 24" stroke="#e8541a" strokeWidth="3" strokeLinecap="round"/>
    <path d="M24 50L31 57L48 40" stroke="#72685f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSixtySeconds = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="38" r="20" stroke="#72685f" strokeWidth="2"/>
    <path d="M36 18V12" stroke="#72685f" strokeWidth="2" strokeLinecap="round"/>
    <path d="M30 12H42" stroke="#72685f" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 38L36 27" stroke="#e8541a" strokeWidth="3" strokeLinecap="round"/>
    <path d="M36 18L36 22" stroke="#0f0e0d" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const IconFullReviews = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="12" width="36" height="48" rx="2" stroke="#72685f" strokeWidth="2"/>
    <path d="M25 24H47" stroke="#a09890" strokeWidth="2" strokeLinecap="round"/>
    <path d="M25 31H47" stroke="#a09890" strokeWidth="2" strokeLinecap="round"/>
    <path d="M25 38H41" stroke="#a09890" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 50L25.8 53.6L29.8 54.1L26.9 56.9L27.6 60.9L24 59L20.4 60.9L21.1 56.9L18.2 54.1L22.2 53.6L24 50Z" fill="#e8541a"/>
    <path d="M36 50L37.8 53.6L41.8 54.1L38.9 56.9L39.6 60.9L36 59L32.4 60.9L33.1 56.9L30.2 54.1L34.2 53.6L36 50Z" fill="#e8541a"/>
    <path d="M48 50L49.8 53.6L53.8 54.1L50.9 56.9L51.6 60.9L48 59L44.4 60.9L45.1 56.9L42.2 54.1L46.2 53.6L48 50Z" fill="#e8541a"/>
  </svg>
);

const TopPickBadge = () => (
  <svg width="240" height="36" viewBox="0 0 320 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 12C0 5.37258 5.37258 0 12 0H308C314.627 0 320 5.37258 320 12V60C320 66.6274 314.627 72 308 72H12C5.37258 72 0 66.6274 0 60V12Z" fill="#e8541a"/>
    <path d="M30 36L35 41L44 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="58" y="42" fill="white" fontSize="20" fontFamily="DM Sans, sans-serif" fontWeight="700" letterSpacing="-0.02em">No-Code Reviewed Pick</text>
  </svg>
);

const RankBadge = ({ rank }) => {
  const fills = { 1: "#e8541a", 2: "#a09890", 3: "#b7afa8" };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill={fills[rank] || "#b7afa8"}/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontFamily="DM Mono, monospace" fontWeight="700">{rank}</text>
    </svg>
  );
};

const RadarWatermark = () => (
  <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", right: -40, bottom: -40, opacity: 0.6, pointerEvents: "none" }}>
    <g stroke="#e0dbd3" strokeWidth="1.5">
      <polygon points="140,30 230,85 230,195 140,250 50,195 50,85"/>
      <polygon points="140,60 204,98 204,182 140,220 76,182 76,98"/>
      <polygon points="140,90 178,111 178,169 140,190 102,169 102,111"/>
      <line x1="140" y1="140" x2="140" y2="30"/>
      <line x1="140" y1="140" x2="230" y2="85"/>
      <line x1="140" y1="140" x2="230" y2="195"/>
      <line x1="140" y1="140" x2="140" y2="250"/>
      <line x1="140" y1="140" x2="50" y2="195"/>
      <line x1="140" y1="140" x2="50" y2="85"/>
    </g>
  </svg>
);

const EmptyState = () => (
  <div style={{ textAlign: "center", padding: "40px 20px" }}>
    <svg width="240" height="180" viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="78" y="42" width="84" height="108" rx="4" fill="#f7f4ef" stroke="#d8d1c8" strokeWidth="2"/>
      <path d="M95 68H145" stroke="#c8c0b8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M95 84H145" stroke="#c8c0b8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M95 100H132" stroke="#c8c0b8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="116" cy="118" r="22" stroke="#a09890" strokeWidth="4"/>
      <path d="M131 133L150 152" stroke="#a09890" strokeWidth="4" strokeLinecap="round"/>
    </svg>
    <p style={{ fontSize: 14, color: "#72685f", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginTop: 8 }}>
      No matches — try different answers.
    </p>
  </div>
);

const G = {
  bg: "#f0ede7",
  card: "#faf8f4",
  border: "#e0dbd3",
  border2: "#d0c9c0",
  text: "#0f0e0d",
  muted: "#72685f",
  soft: "#a09890",
  accent: "#e8541a",
  accentBg: "#fdf0eb",
  accentBorder: "#f4c4a8",
  good: "#1a6e3c",
  goodBg: "#edf7f2",
  goodBorder: "#a8d9bc",
  surface: "#ffffff",
};

/* ─────────────────────────────────────────────
   PLATFORM DATABASE
   All scores out of 10. Based on review data.
───────────────────────────────────────────── */
const PLATFORMS = {
  webflow: {
    name: "Webflow",
    tagline: "Design-led visual web builder",
    url: "https://nocodereviewed.lovable.app/webflow",
    color: "#146EF5",
    colorBg: "rgba(20,110,245,0.08)",
    scores: {
      designFreedom: 9.5,
      aiQuality: 6.5,
      easeOfUse: 6.5,
      appBuilding: 5.0,
      ecommerce: 7.0,
      cms: 8.0,
      speed: 7.0,
      value: 7.0,
      seo: 9.0,
    },
    pricing: { free: true, startingAt: 14, label: "$14/mo" },
    techLevel: ["designer", "developer"],
    bestFor: ["marketing", "portfolio", "agency"],
    notFor: ["app", "ecommerce_heavy"],
    strengths: ["Pixel-perfect design control", "Excellent SEO tooling", "Built-in CMS", "World-class interactions"],
    weaknesses: ["Steep learning curve", "Weak AI features", "Expensive for ecommerce"],
    verdict: "The gold standard for design-led marketing sites. Requires real investment in learning.",
    rating: "8.6",
  },
  lovable: {
    name: "Lovable",
    tagline: "AI-first app builder",
    url: "https://nocodereviewed.lovable.app",
    color: "#e8541a",
    colorBg: "rgba(232,84,26,0.08)",
    scores: {
      designFreedom: 7.0,
      aiQuality: 9.0,
      easeOfUse: 8.5,
      appBuilding: 9.0,
      ecommerce: 6.0,
      cms: 6.5,
      speed: 9.0,
      value: 8.5,
      seo: 6.0,
    },
    pricing: { free: true, startingAt: 20, label: "$20/mo" },
    techLevel: ["none", "designer", "developer"],
    bestFor: ["app", "saas", "mvp", "marketing"],
    notFor: ["ecommerce_heavy"],
    strengths: ["Fastest path from idea to live app", "Full-stack with Supabase", "Great for MVPs", "Generous free tier"],
    weaknesses: ["Less design control than Webflow", "Credit system can surprise", "Weaker SEO"],
    verdict: "Best AI builder for getting something live fast. Surprisingly capable for real apps.",
    rating: "8.8",
  },
  bolt: {
    name: "Bolt.new",
    tagline: "Browser-native dev environment",
    url: "https://nocodereviewed.lovable.app/bolt",
    color: "#00d4ff",
    colorBg: "rgba(0,212,255,0.07)",
    scores: {
      designFreedom: 7.5,
      aiQuality: 8.5,
      easeOfUse: 6.0,
      appBuilding: 9.5,
      ecommerce: 5.5,
      cms: 5.0,
      speed: 8.5,
      value: 7.9,
      seo: 5.5,
    },
    pricing: { free: true, startingAt: 20, label: "$20/mo" },
    techLevel: ["developer"],
    bestFor: ["app", "saas", "mvp"],
    notFor: ["marketing", "ecommerce_heavy", "portfolio"],
    strengths: ["Full Node.js in the browser", "Real npm ecosystem", "Full-codebase AI context", "Transparent token usage"],
    weaknesses: ["Assumes technical knowledge", "No visual editor", "Poor for content sites"],
    verdict: "The developer's AI builder. More power, higher floor — not for true non-coders.",
    rating: "8.3",
  },
  v0: {
    name: "v0 by Vercel",
    tagline: "Component generation for developers",
    url: "https://nocodereviewed.lovable.app/v0",
    color: "#0070f3",
    colorBg: "rgba(0,112,243,0.08)",
    scores: {
      designFreedom: 8.0,
      aiQuality: 9.0,
      easeOfUse: 7.0,
      appBuilding: 7.5,
      ecommerce: 5.0,
      cms: 4.5,
      speed: 8.0,
      value: 8.5,
      seo: 6.0,
    },
    pricing: { free: true, startingAt: 20, label: "$20/mo" },
    techLevel: ["developer"],
    bestFor: ["app", "component", "saas"],
    notFor: ["marketing", "ecommerce_heavy", "portfolio"],
    strengths: ["Best React component quality", "Deploys to Vercel instantly", "Great shadcn/ui integration", "Generous free credits"],
    weaknesses: ["Full apps still rough", "Needs React knowledge", "Weak CMS story"],
    verdict: "The best way to generate production-quality React components. Less complete as a full-app builder.",
    rating: "8.1",
  },
  framer: {
    name: "Framer",
    tagline: "Motion-first website builder",
    url: "https://nocodereviewed.lovable.app/framer",
    color: "#0099ff",
    colorBg: "rgba(0,153,255,0.08)",
    scores: {
      designFreedom: 8.5,
      aiQuality: 7.0,
      easeOfUse: 8.0,
      appBuilding: 4.5,
      ecommerce: 5.0,
      cms: 7.0,
      speed: 8.5,
      value: 8.0,
      seo: 7.5,
    },
    pricing: { free: true, startingAt: 10, label: "$10/mo" },
    techLevel: ["none", "designer"],
    bestFor: ["marketing", "portfolio", "agency"],
    notFor: ["app", "ecommerce_heavy"],
    strengths: ["Beautiful animations out of the box", "Easiest of the design-led tools", "React component support", "Affordable pricing"],
    weaknesses: ["Limited for real apps", "CMS less powerful than Webflow", "Weaker SEO controls"],
    verdict: "The friendlier Webflow. Slightly less control, much easier to learn. Great for portfolios and marketing.",
    rating: "8.2",
  },
};

/* ─────────────────────────────────────────────
   SCORING ALGORITHM
   Returns platforms ranked by fit score (0–100)
───────────────────────────────────────────── */
function scorePlatform(platform, answers) {
  const { techLevel, projectType, priority, budget } = answers;
  const p = PLATFORMS[platform];
  let score = 0;
  let reasons = [];
  let flags = [];

  // Tech level fit (0–30)
  if (p.techLevel.includes(techLevel)) {
    score += 30;
  } else if (techLevel === "none" && p.techLevel.includes("designer")) {
    score += 15;
    flags.push("Learning curve may be significant");
  } else if (techLevel === "designer" && p.techLevel.includes("developer")) {
    score += 10;
    flags.push("Built more for developers");
  } else if (techLevel === "developer") {
    score += 20; // devs can use anything
  }

  // Project type fit (0–30)
  if (p.bestFor.includes(projectType)) {
    score += 30;
  } else if (!p.notFor.includes(projectType)) {
    score += 10;
  } else {
    flags.push(`Not ideal for ${projectType.replace("_", " ")} projects`);
  }

  // Priority scoring (0–25) — what matters most to the user
  const priorityScoreMap = {
    design: p.scores.designFreedom,
    speed: p.scores.speed,
    ai: p.scores.aiQuality,
    value: p.scores.value,
    ease: p.scores.easeOfUse,
    seo: p.scores.seo,
  };
  const priorityScore = priorityScoreMap[priority] || 7;
  score += Math.round((priorityScore / 10) * 25);

  // Budget fit (0–15)
  const monthlyBudget = parseInt(budget, 10);
  if (monthlyBudget === 0 && p.pricing.free) {
    score += 15;
    if (p.pricing.startingAt > 30) flags.push("Paid features get expensive quickly");
  } else if (monthlyBudget >= p.pricing.startingAt) {
    score += 15;
  } else if (monthlyBudget > 0 && monthlyBudget < p.pricing.startingAt) {
    score += 8;
    flags.push(`Starter plan is $${p.pricing.startingAt}/mo`);
  }

  // Build positive reasons
  if (p.bestFor.includes(projectType)) reasons.push(`Built for ${projectType.replace("_", " ")} projects`);
  if (p.techLevel.includes(techLevel)) reasons.push("Matches your technical level");
  if (priorityScore >= 8.5) reasons.push(`Top-tier ${priority} score (${priorityScore}/10)`);
  if (p.pricing.free && monthlyBudget === 0) reasons.push("Has a real free tier");
  if (priorityScore >= 7.5 && reasons.length < 2) reasons.push(`Strong ${priority} score (${priorityScore}/10)`);

  return { score: Math.min(score, 100), reasons, flags };
}

function getRankedResults(answers) {
  return Object.entries(PLATFORMS)
    .map(([id, p]) => ({ id, ...p, ...scorePlatform(id, answers) }))
    .sort((a, b) => b.score - a.score);
}

/* ─────────────────────────────────────────────
   QUESTIONS CONFIG
───────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: "projectType",
    question: "What are you building?",
    sub: "Pick the closest match — we'll refine from here.",
    options: [
      { value: "marketing", label: "Marketing site or landing page", icon: "📣", desc: "Promote a product, service, or brand" },
      { value: "portfolio", label: "Portfolio or personal site", icon: "🎨", desc: "Showcase your work or yourself" },
      { value: "app", label: "Web app or SaaS product", icon: "⚙️", desc: "Something users log in to and use" },
      { value: "ecommerce_heavy", label: "Ecommerce store", icon: "🛍️", desc: "Selling products online" },
      { value: "mvp", label: "Startup MVP or prototype", icon: "🚀", desc: "Validate an idea fast" },
      { value: "saas", label: "Internal tool or dashboard", icon: "📊", desc: "For your team, not the public" },
    ],
  },
  {
    id: "techLevel",
    question: "How technical are you?",
    sub: "Be honest — it changes the recommendation significantly.",
    options: [
      { value: "none", label: "Non-technical", icon: "🙋", desc: "I don't code and don't want to learn" },
      { value: "designer", label: "Designer", icon: "✏️", desc: "I understand design but not code" },
      { value: "developer", label: "Developer", icon: "💻", desc: "I can read and write code comfortably" },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you?",
    sub: "Forces a tradeoff — choose your top priority.",
    options: [
      { value: "design", label: "Design quality & control", icon: "🎯", desc: "I need pixel-perfect output" },
      { value: "speed", label: "Speed of building", icon: "⚡", desc: "I want to launch as fast as possible" },
      { value: "ai", label: "AI capability", icon: "🤖", desc: "I want the smartest AI assistant" },
      { value: "ease", label: "Ease of use", icon: "😌", desc: "I want the gentlest learning curve" },
      { value: "value", label: "Value for money", icon: "💰", desc: "I'm budget-conscious" },
      { value: "seo", label: "SEO & marketing", icon: "📈", desc: "I need to rank on Google" },
    ],
  },
  {
    id: "budget",
    question: "What's your monthly budget?",
    sub: "For the platform itself — not including any extras.",
    options: [
      { value: "0", label: "Free only", icon: "🆓", desc: "I won't pay anything right now" },
      { value: "15", label: "Up to $15/mo", icon: "💵", desc: "Starter / hobbyist tier" },
      { value: "30", label: "Up to $30/mo", icon: "💳", desc: "Standard professional plan" },
      { value: "100", label: "$30–$100/mo", icon: "📦", desc: "Serious project or small team" },
      { value: "999", label: "$100+/mo", icon: "🏢", desc: "Agency, team, or high-traffic" },
    ],
  },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
const ProgressDots = ({ total, current }) => (
  <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 28 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        width: i === current ? 20 : 6, height: 6, borderRadius: 3,
        background: i < current ? G.accent : i === current ? G.accent : G.border2,
        transition: "all 0.25s ease", opacity: i > current ? 0.4 : 1,
      }} />
    ))}
  </div>
);

const OptionButton = ({ option, selected, onClick }) => (
  <button onClick={onClick} style={{
    width: "100%", padding: "14px 16px",
    background: selected ? G.accentBg : G.surface,
    border: `1.5px solid ${selected ? G.accent : G.border}`,
    borderRadius: 10, cursor: "pointer", textAlign: "left",
    display: "flex", alignItems: "center", gap: 12,
    transition: "all 0.15s ease",
    outline: "none",
  }}
    onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = G.border2; }}
    onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = G.border; }}
  >
    <span style={{ fontSize: 20, flexShrink: 0, width: 28, textAlign: "center" }}>{option.icon}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: selected ? G.accent : G.text, marginBottom: 1 }}>{option.label}</div>
      <div style={{ fontSize: 12, color: G.muted }}>{option.desc}</div>
    </div>
    <div style={{
      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
      border: `2px solid ${selected ? G.accent : G.border2}`,
      background: selected ? G.accent : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {selected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
    </div>
  </button>
);

const ScoreRing = ({ score, color }) => {
  const pct = Math.round(score);
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
      <circle cx={32} cy={32} r={r} fill="none" stroke={G.border} strokeWidth={5} />
      <circle cx={32} cy={32} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 32 32)" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x={32} y={36} textAnchor="middle" fontSize={13} fontWeight={700} fill={G.text}
        fontFamily="'DM Mono', monospace">{pct}</text>
    </svg>
  );
};

const MiniBar = ({ label, value }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: G.muted }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: G.text, fontFamily: "'DM Mono', monospace" }}>{value}/10</span>
    </div>
    <div style={{ height: 3, background: G.border, borderRadius: 2 }}>
      <div style={{ height: "100%", width: `${(value / 10) * 100}%`, background: G.accent, borderRadius: 2, transition: "width 0.5s ease" }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   RESULTS CARD
───────────────────────────────────────────── */
const ResultCard = ({ result, rank, answers }) => {
  const [expanded, setExpanded] = useState(false);
  const isTop = rank === 0;
  const priorityLabelMap = { design: "Design freedom", speed: "Build speed", ai: "AI quality", ease: "Ease of use", value: "Value", seo: "SEO" };
  const priorityScoreKey = answers.priority;
  const highlightScore = result.scores[{
    design: "designFreedom", speed: "speed", ai: "aiQuality",
    ease: "easeOfUse", value: "value", seo: "seo"
  }[priorityScoreKey]];

  return (
    <div style={{
      background: G.surface,
      border: isTop ? `2px solid ${G.accent}` : `1px solid ${G.border}`,
      borderRadius: 14,
      padding: "22px 22px 0",
      transition: "box-shadow 0.2s",
      marginBottom: isTop ? 12 : 10,
      position: "relative",
      overflow: "hidden",
    }}>
      {!isTop && <RadarWatermark />}
      {isTop && (
        <div style={{ marginBottom: 14 }}>
          <TopPickBadge />
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
        <ScoreRing score={result.score} color={result.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: G.text }}>{result.name}</span>
            <RankBadge rank={rank + 1} />
          </div>
          <p style={{ fontSize: 12, color: G.muted, margin: "0 0 10px" }}>{result.tagline}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {result.reasons.slice(0, 2).map((r, i) => (
              <span key={i} style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 99,
                background: G.goodBg, color: G.good, border: `1px solid ${G.goodBorder}`,
                fontFamily: "'DM Mono', monospace",
              }}>✓ {r}</span>
            ))}
            {result.flags.slice(0, 1).map((f, i) => (
              <span key={i} style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 99,
                background: "#fff8f0", color: "#a05000", border: "1px solid #f4c88a",
                fontFamily: "'DM Mono', monospace",
              }}>⚠ {f}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: G.muted, marginBottom: 2, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your priority</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: result.color }}>{highlightScore}</div>
          <div style={{ fontSize: 10, color: G.muted }}>{priorityLabelMap[priorityScoreKey]}</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.7, marginBottom: 16, paddingTop: 12, borderTop: `1px solid ${G.border}` }}>
        {result.verdict}
      </p>

      {expanded && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: G.good, marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>Strengths</div>
              {result.strengths.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: G.muted, padding: "4px 0", paddingLeft: 14, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: G.good }}>✓</span>{s}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a05000", marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>Watch Out For</div>
              {result.weaknesses.map((w, i) => (
                <div key={i} style={{ fontSize: 12, color: G.muted, padding: "4px 0", paddingLeft: 14, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "#a05000" }}>→</span>{w}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, paddingTop: 16, borderTop: `1px solid ${G.border}` }}>
            <MiniBar label="Design freedom" value={result.scores.designFreedom} />
            <MiniBar label="AI quality" value={result.scores.aiQuality} />
            <MiniBar label="Ease of use" value={result.scores.easeOfUse} />
            <MiniBar label="Build speed" value={result.scores.speed} />
            <MiniBar label="Value" value={result.scores.value} />
            <MiniBar label="SEO" value={result.scores.seo} />
          </div>
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 0", borderTop: `1px solid ${G.border}`,
      }}>
        <button onClick={() => setExpanded(e => !e)} style={{
          fontSize: 12, color: G.muted, background: "none", border: "none", cursor: "pointer", padding: 0,
          fontFamily: "'DM Sans', sans-serif",
        }}>{expanded ? "↑ Less detail" : "↓ More detail"}</button>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 12, color: G.muted, alignSelf: "center" }}>{result.pricing.label}</span>
          <a href={result.url} target="_blank" rel="noopener noreferrer" style={{
            padding: "8px 18px", borderRadius: 8,
            background: isTop ? G.accent : "transparent",
            color: isTop ? "#fff" : G.accent,
            border: `1.5px solid ${G.accent}`,
            fontSize: 12, fontWeight: 700, textDecoration: "none",
            display: "inline-block", letterSpacing: "0.02em",
          }}>Full review →</a>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SUMMARY CHIPS — shows answers at top of results
───────────────────────────────────────────── */
const AnswerSummary = ({ answers }) => {
  const labels = {
    projectType: { marketing: "Marketing site", portfolio: "Portfolio", app: "Web app", ecommerce_heavy: "Ecommerce", mvp: "MVP", saas: "Internal tool" },
    techLevel: { none: "Non-technical", designer: "Designer", developer: "Developer" },
    priority: { design: "Design-first", speed: "Speed-first", ai: "AI-first", ease: "Ease-first", value: "Value-first", seo: "SEO-first" },
    budget: { "0": "Free only", "15": "Up to $15/mo", "30": "Up to $30/mo", "100": "Up to $100/mo", "999": "$100+/mo" },
  };
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
      {Object.entries(answers).map(([key, val]) => (
        <span key={key} style={{
          fontSize: 11, padding: "4px 11px", borderRadius: 99,
          background: G.card, border: `1px solid ${G.border}`,
          color: G.muted, fontFamily: "'DM Mono', monospace",
        }}>{labels[key]?.[val] ?? val}</span>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN WIZARD
───────────────────────────────────────────── */
export default function NCRWizard() {
  const [step, setStep] = useState(0); // -1 = intro, 0..3 = questions, 4 = results
  const [answers, setAnswers] = useState({});
  const [pendingAnswer, setPendingAnswer] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const currentQ = QUESTIONS[step];
  const isAnswered = pendingAnswer !== null;
  const totalSteps = QUESTIONS.length;

  const handleSelect = (value) => setPendingAnswer(value);

  const handleNext = () => {
    const newAnswers = { ...answers, [currentQ.id]: pendingAnswer };
    setAnswers(newAnswers);
    setPendingAnswer(null);
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      setStep(totalSteps); // results
    }
  };

  const handleBack = () => {
    if (step === 0) { setShowIntro(true); setPendingAnswer(null); return; }
    setStep(s => s - 1);
    setPendingAnswer(answers[QUESTIONS[step - 1].id] ?? null);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setPendingAnswer(null);
    setShowIntro(true);
  };

  const results = step === totalSteps ? getRankedResults(answers) : [];

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: G.bg,
      minHeight: "100vh",
      padding: "40px 20px 80px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0ede7; }
      `}</style>

      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <a href="https://nocodereviewed.lovable.app" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: G.soft, fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>No-Code Reviewed</div>
          </a>
          {showIntro ? (
            <h1 style={{ fontSize: 30, fontWeight: 700, color: G.text, letterSpacing: "-0.02em", lineHeight: 1.2 }}>Find your platform</h1>
          ) : step < totalSteps ? (
            <h1 style={{ fontSize: 22, fontWeight: 600, color: G.text, letterSpacing: "-0.01em" }}>Platform Finder</h1>
          ) : (
            <h1 style={{ fontSize: 22, fontWeight: 600, color: G.text, letterSpacing: "-0.01em" }}>Your recommendations</h1>
          )}
        </div>

        {/* INTRO SCREEN */}
        {showIntro && (
          <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 16, padding: "32px 28px" }}>
            <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.75, marginBottom: 28, textAlign: "center" }}>
              We've reviewed every major no-code platform in depth. Answer 4 questions and we'll rank them for your exact situation — no generic listicles, no affiliate bias.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
              {[
                { Icon: IconPersonalized, label: "Personalized", desc: "Ranked for your use case" },
                { Icon: IconSixtySeconds, label: "60 seconds", desc: "Four quick questions" },
                { Icon: IconFullReviews, label: "Full reviews", desc: "Deep-dives behind each pick" },
              ].map(({ Icon, label, desc }) => (
                <div key={label} style={{ textAlign: "center", padding: "16px 12px", background: G.bg, borderRadius: 10, border: `1px solid ${G.border}` }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Icon /></div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: G.text, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 11, color: G.muted }}>{desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 8 }}>
              {Object.values(PLATFORMS).map(p => (
                <span key={p.name} style={{ fontSize: 11, color: G.muted, padding: "3px 10px", border: `1px solid ${G.border}`, borderRadius: 99, fontFamily: "'DM Mono', monospace" }}>{p.name}</span>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button onClick={() => setShowIntro(false)} style={{
                padding: "14px 40px", background: G.accent, color: "#fff",
                border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.01em",
              }}>Start the quiz →</button>
            </div>
          </div>
        )}

        {/* QUESTION SCREEN */}
        {!showIntro && step < totalSteps && (
          <div>
            <ProgressDots total={totalSteps} current={step} />
            <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 16, padding: "28px 24px" }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: G.soft, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Question {step + 1} of {totalSteps}</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: G.text, letterSpacing: "-0.015em", marginBottom: 6 }}>{currentQ.question}</h2>
                <p style={{ fontSize: 13, color: G.muted }}>{currentQ.sub}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {currentQ.options.map(opt => (
                  <OptionButton
                    key={opt.value}
                    option={opt}
                    selected={pendingAnswer === opt.value}
                    onClick={() => handleSelect(opt.value)}
                  />
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: `1px solid ${G.border}` }}>
                <button onClick={handleBack} style={{
                  padding: "10px 18px", background: "transparent", border: `1px solid ${G.border2}`,
                  borderRadius: 8, fontSize: 13, color: G.muted, cursor: "pointer",
                }}>← Back</button>
                <button onClick={handleNext} disabled={!isAnswered} style={{
                  padding: "12px 28px", background: isAnswered ? G.accent : G.border,
                  color: isAnswered ? "#fff" : G.soft,
                  border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  cursor: isAnswered ? "pointer" : "not-allowed", transition: "all 0.15s",
                }}>{step === totalSteps - 1 ? "See my results →" : "Next →"}</button>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {step === totalSteps && (
          <div>
            <AnswerSummary answers={answers} />

            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 13, color: G.muted, marginBottom: 20, lineHeight: 1.65 }}>
                Ranked by fit score across project type, technical level, your top priority, and budget. Tap any card to see the full breakdown.
              </p>

            {results.length === 0 ? <EmptyState /> : results.map((result, i) => (
                <ResultCard key={result.id} result={result} rank={i} answers={answers} />
              ))}
            </div>

            <div style={{ textAlign: "center", paddingTop: 28, borderTop: `1px solid ${G.border}` }}>
              <div style={{ fontSize: 13, color: G.muted, marginBottom: 16 }}>Not quite right? Try different answers.</div>
              <button onClick={handleReset} style={{
                padding: "11px 28px", background: "transparent", border: `1.5px solid ${G.border2}`,
                borderRadius: 10, fontSize: 13, fontWeight: 600, color: G.text, cursor: "pointer",
              }}>Start over</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
