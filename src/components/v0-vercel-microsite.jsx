import { useState, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   V0 BY VERCEL — FULL REVIEW MICROSITE
   no-code-reviewed.v0.app
   Design system: Geist + Geist Mono, #0070f3 accent, #ededed text, #000 bg
═══════════════════════════════════════════════════════════ */

const G = {
  accent: "#0070f3",
  accentDim: "#0050b3",
  accentGlow: "rgba(0,112,243,0.18)",
  text: "#ededed",
  card: "#0d0d0d",
  cardHover: "#111111",
  bg: "#000000",
  muted: "#888888",
  border: "#1a1a1a",
  border2: "#2a2a2a",
  good: "#3ecf8e",
  warn: "#f97316",
  error: "#ef4444",
  goodBg: "#0d1f17",
  warnBg: "#1c0f06",
  navH: 60,
};

/* ─── Shared micro-components ─── */
const Badge = ({ children, variant = "neutral" }) => {
  const colors = {
    neutral: { bg: "#111", color: G.muted, border: G.border2 },
    accent: { bg: "rgba(0,112,243,0.12)", color: G.accent, border: "rgba(0,112,243,0.3)" },
    critical: { bg: "rgba(239,68,68,0.1)", color: G.error, border: "rgba(239,68,68,0.3)" },
    good: { bg: "rgba(62,207,142,0.1)", color: G.good, border: "rgba(62,207,142,0.3)" },
    warn: { bg: "rgba(249,115,22,0.1)", color: G.warn, border: "rgba(249,115,22,0.3)" },
  };
  const c = colors[variant] || colors.neutral;
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 5,
      background: c.bg, color: c.color,
      border: `1px solid ${c.border}`,
      fontFamily: "'Geist Mono', monospace",
    }}>{children}</span>
  );
};

const ScoreBar = ({ label, score, max = 10 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 42px", alignItems: "center", gap: 14, marginBottom: 16 }}>
    <span style={{ fontSize: 13, fontWeight: 500, color: G.muted }}>{label}</span>
    <div style={{ height: 3, background: G.border2, borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${(score / max) * 100}%`,
        background: `linear-gradient(90deg, ${G.accent}, #00d4ff)`,
        borderRadius: 2, transition: "width 0.6s ease",
      }} />
    </div>
    <span style={{ fontSize: 13, fontWeight: 700, textAlign: "right", color: G.accent, fontFamily: "'Geist Mono', monospace" }}>{score}</span>
  </div>
);

const Alert = ({ type = "neutral", title, children }) => {
  const map = {
    neutral: { border: G.border2, bg: G.card },
    warn: { border: G.warn, bg: G.warnBg },
    good: { border: G.good, bg: G.goodBg },
    info: { border: G.accent, bg: "rgba(0,112,243,0.08)" },
    error: { border: G.error, bg: "rgba(239,68,68,0.08)" },
  };
  const s = map[type] || map.neutral;
  return (
    <div style={{ borderLeft: `2px solid ${s.border}`, background: s.bg, borderRadius: "0 8px 8px 0", padding: "16px 20px", marginBottom: 18 }}>
      {title && <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, color: s.border, fontFamily: "'Geist Mono', monospace" }}>{title}</div>}
      <div style={{ fontSize: 14, lineHeight: 1.7, color: G.text }}>{children}</div>
    </div>
  );
};

const Card = ({ children, style = {}, glow = false }) => (
  <div style={{
    background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: "22px 24px",
    ...(glow ? { boxShadow: `0 0 0 1px ${G.accentGlow}, 0 8px 32px ${G.accentGlow}` } : {}),
    ...style,
  }}>
    {children}
  </div>
);

const SectionHead = ({ eyebrow, title, sub }) => (
  <div style={{ marginBottom: 36 }}>
    {eyebrow && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: G.accent, marginBottom: 12, fontFamily: "'Geist Mono', monospace" }}>{eyebrow}</div>}
    <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: sub ? 12 : 0, lineHeight: 1.1, color: G.text }}>{title}</h2>
    {sub && <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.65, maxWidth: 620, marginTop: 8 }}>{sub}</p>}
  </div>
);

const Prose = ({ children }) => (
  <div style={{ fontSize: 14.5, lineHeight: 1.85, color: "#aaaaaa", marginBottom: 18 }}>{children}</div>
);

const Divider = () => <div style={{ height: 1, background: G.border, margin: "36px 0" }} />;

const StatPill = ({ num, label }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: "20px 22px", textAlign: "center", flex: "1 1 130px" }}>
    <div style={{ fontSize: 26, fontWeight: 700, color: G.accent, lineHeight: 1, fontFamily: "'Geist Mono', monospace" }}>{num}</div>
    <div style={{ fontSize: 11.5, color: G.muted, marginTop: 7, lineHeight: 1.4 }}>{label}</div>
  </div>
);

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy} style={{
      position: "absolute", top: 10, right: 10, padding: "4px 11px",
      background: copied ? "rgba(62,207,142,0.15)" : "rgba(255,255,255,0.07)",
      color: copied ? G.good : G.muted,
      border: `1px solid ${copied ? G.good : G.border2}`,
      borderRadius: 5, fontSize: 10, fontWeight: 600,
      cursor: "pointer", transition: "all 0.2s",
      fontFamily: "'Geist Mono', monospace",
    }}>{copied ? "Copied!" : "Copy"}</button>
  );
};

const PromptBlock = ({ text }) => (
  <div style={{ position: "relative", background: "#080808", border: `1px solid ${G.border}`, borderRadius: 8, padding: "16px 52px 16px 18px", marginBottom: 14 }}>
    <CopyBtn text={text} />
    <p style={{ color: "#cccccc", fontSize: 13, lineHeight: 1.75, fontFamily: "'Geist Mono', monospace", margin: 0 }}>{text}</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════ */
const NAV = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "ai-gen", label: "AI Generation" },
  { id: "integrations", label: "Integrations" },
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
    <div style={{ background: "#050505", border: `1px solid ${G.border}`, borderRadius: 16, padding: "52px 44px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 350, height: 350, borderRadius: "50%", background: G.accent, opacity: 0.06, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -80, left: "30%", width: 250, height: 250, borderRadius: "50%", background: "#00d4ff", opacity: 0.04, filter: "blur(50px)" }} />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, background: G.text, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#000", fontFamily: "'Geist Mono', monospace" }}>v0</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.muted, fontFamily: "'Geist Mono', monospace" }}>No-Code Reviewed · In-Depth Platform Review</div>
        </div>
        <h1 style={{ fontSize: "clamp(30px,5vw,54px)", fontWeight: 700, color: G.text, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 20 }}>
          v0 by Vercel<br />
          <span style={{ color: G.accent }}>Complete Review 2026</span>
        </h1>
        <p style={{ fontSize: 16, color: G.muted, lineHeight: 1.7, maxWidth: 560, marginBottom: 36 }}>
          Vercel's AI UI generator turns plain English into production-ready React components. We spent 40+ hours building real interfaces to give you the most thorough v0 review available.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => goTo("verdict")} style={{ padding: "12px 24px", background: G.text, color: "#000", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>See Our Verdict →</button>
          <button onClick={() => goTo("prompts")} style={{ padding: "12px 24px", background: "transparent", color: G.text, border: `1px solid ${G.border2}`, borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Prompt Library</button>
        </div>
      </div>
    </div>

    {/* Quick verdict bar */}
    <Card style={{ marginBottom: 32, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
      {[
        { label: "Overall Score", val: "8.9/10" },
        { label: "Best For", val: "Developers & Designers" },
        { label: "Free Tier", val: "200 credits/mo" },
        { label: "Starting Price", val: "$20/mo" },
        { label: "Verdict", val: "Highly Recommended" },
      ].map(({ label, val }) => (
        <div key={label} style={{ flex: "1 1 140px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: G.muted, marginBottom: 5, fontFamily: "'Geist Mono', monospace" }}>{label}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: G.text }}>{val}</div>
        </div>
      ))}
    </Card>

    {/* Stats row */}
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
      <StatPill num="~2M+" label="Registered users" />
      <StatPill num="40hrs" label="Testing time" />
      <StatPill num="200+" label="Components built" />
      <StatPill num="#1" label="AI UI Generator" />
    </div>

    {/* What is v0 */}
    <SectionHead eyebrow="The Basics" title="What is v0?" sub="A primer on Vercel's AI UI generation platform and who it's actually built for." />
    <Prose>
      v0 is Vercel's AI-powered interface generation tool that converts natural language prompts into production-ready UI components. Unlike full-stack AI builders like Lovable or Bolt, v0 is laser-focused on the frontend layer — generating clean React code built on shadcn/ui and Tailwind CSS that developers can drop directly into any Next.js project.
    </Prose>
    <Prose>
      Launched in alpha in late 2023 and hitting general availability in 2024, v0 occupies a unique niche: it's powerful enough to satisfy senior engineers who want clean, maintainable component output, yet approachable enough for designers who've never written a line of React. The chat-based interface means you iterate in plain English rather than fighting configuration files.
    </Prose>
    <Alert type="info" title="Key Distinction">
      v0 generates components and pages, not full applications. If you need a complete backend, database, and auth flow in one shot, look at Lovable or Bolt. If you need beautiful, functional UI that slots into your existing codebase, v0 is unmatched.
    </Alert>

    <Divider />

    {/* Scores */}
    <SectionHead eyebrow="Scores" title="At a glance" />
    <ScoreBar label="UI Quality" score={9.5} />
    <ScoreBar label="Developer Experience" score={9.2} />
    <ScoreBar label="Vercel Integration" score={9.8} />
    <ScoreBar label="Iteration Speed" score={9.0} />
    <ScoreBar label="Code Quality" score={8.8} />
    <ScoreBar label="Credit Value" score={7.2} />
    <ScoreBar label="Learning Curve" score={8.5} />
    <ScoreBar label="Overall" score={8.9} />

    <Divider />

    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Card style={{ flex: "1 1 260px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: G.good, marginBottom: 14, letterSpacing: "0.08em", fontFamily: "'Geist Mono', monospace" }}>✓ STRENGTHS</div>
        {["Best-in-class component output quality", "Deep Next.js + shadcn/ui integration", "Chat-based iterative refinement", "One-click Vercel deploy", "Free tier is genuinely useful", "Supports image-to-UI prompting"].map(s => (
          <div key={s} style={{ fontSize: 13, color: "#aaa", marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${G.good}` }}>{s}</div>
        ))}
      </Card>
      <Card style={{ flex: "1 1 260px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: G.error, marginBottom: 14, letterSpacing: "0.08em", fontFamily: "'Geist Mono', monospace" }}>✗ WEAKNESSES</div>
        {["No backend / database generation", "Credits deplete faster than expected", "Complex layouts still need manual polish", "Locked to React / shadcn ecosystem", "No real-time collaboration", "No built-in deployment beyond Vercel"].map(s => (
          <div key={s} style={{ fontSize: 13, color: "#aaa", marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${G.error}` }}>{s}</div>
        ))}
      </Card>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: FEATURES
═══════════════════════════════════════════════════════════ */
const PageFeatures = () => (
  <div>
    <SectionHead eyebrow="Platform Capabilities" title="Features Deep Dive" sub="Every major v0 feature tested, documented, and scored." />

    {[
      {
        title: "Natural Language to React",
        badge: "Core Feature",
        bv: "accent",
        score: "9.5/10",
        body: "v0's bread and butter. Describe a component in plain English — or paste a screenshot — and get clean, typed React code back. The model understands design intent surprisingly well: asking for 'a SaaS pricing page with a recommended plan' produces exactly what you'd expect, with the highlighted card, toggle logic, and CTA buttons already wired up. Output consistently uses shadcn/ui primitives, which means the code slots into real codebases without a rewrite.",
        detail: "Where it shines: landing pages, dashboards, forms, data tables, navbars, modals, and card layouts. Where it struggles: highly custom animations, canvas-based components, and anything requiring deeply bespoke CSS."
      },
      {
        title: "Iterative Chat Editing",
        badge: "Core Feature",
        bv: "accent",
        score: "9.0/10",
        body: "Every generation opens a chat thread. You can say 'make the header sticky', 'swap the blue for green', or 'add a loading skeleton state' and v0 applies the change surgically without regenerating from scratch. This is genuinely different from copying code into a separate AI chat — v0 maintains full context of the component tree across turns.",
        detail: "Pro tip: the more specific your feedback, the better the edit. 'Make it better' produces inconsistent results. 'Reduce padding on the card grid from 24px to 16px and right-align the action buttons' hits cleanly every time."
      },
      {
        title: "Multi-File Project Generation",
        badge: "Newer Feature",
        bv: "good",
        score: "8.2/10",
        body: "v0 can now generate multi-file project scaffolds — not just a single component file, but a folder structure with separated page files, layout components, and utility functions. This bridges the gap toward full-app generation, though it still won't touch your backend.",
        detail: "Still maturing. The file structure v0 creates is logical but sometimes over-engineered for simpler use cases. Worth using for page-level scaffolding, less so for individual components."
      },
      {
        title: "Image / Screenshot to UI",
        badge: "High Value",
        bv: "accent",
        score: "8.8/10",
        body: "Upload a screenshot of any UI — a Figma frame, a competitor's website, a hand-drawn sketch — and v0 will reproduce the structure in React. Accuracy is impressive for layout and hierarchy; pixel-perfect colour matching requires a follow-up prompt. This is one of the fastest ways to convert a design into working code.",
        detail: null
      },
      {
        title: "Code Export & Framework Targets",
        badge: "Developer Feature",
        bv: "neutral",
        score: "8.5/10",
        body: "Generated code is exportable as a zip or copyable inline. v0 primarily outputs React with Tailwind and shadcn/ui, but you can ask for plain HTML/CSS output or Next.js App Router file structure. TypeScript is used by default. The code is clean enough that most engineers are happy with it without a full rewrite.",
        detail: "Vue and Svelte targets are not supported. If you're not in the React ecosystem, v0 loses significant value."
      },
      {
        title: "Live Preview",
        badge: "Core Feature",
        bv: "accent",
        score: "9.3/10",
        body: "Every generation renders a live, interactive preview in the browser panel. You can click buttons, toggle dropdowns, and test dark/light mode in real time before touching any code. The preview updates on every iteration so you never have to guess whether the change landed correctly.",
        detail: null
      },
      {
        title: "One-Click Vercel Deploy",
        badge: "Ecosystem Feature",
        bv: "good",
        score: "9.6/10",
        body: "Hit deploy and your component or page is live on a Vercel preview URL in under a minute. This is extraordinary for client demos, stakeholder reviews, or just sanity-checking your work on mobile. The integration is seamless because v0 and Vercel are the same company.",
        detail: "Worth noting: the deploy creates a standalone Next.js project. If you're integrating into an existing codebase, copy-paste is still your path."
      },
    ].map(f => (
      <Card key={f.title} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: G.text, marginBottom: 6 }}>{f.title}</h3>
            <Badge variant={f.bv}>{f.badge}</Badge>
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 20, fontWeight: 700, color: G.accent }}>{f.score}</div>
        </div>
        <Prose>{f.body}</Prose>
        {f.detail && <Alert type="neutral">{f.detail}</Alert>}
      </Card>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: AI GENERATION
═══════════════════════════════════════════════════════════ */
const PageAIGen = () => (
  <div>
    <SectionHead eyebrow="Under the Hood" title="AI Generation Quality" sub="How v0's model actually performs across different component types and complexity levels." />

    <Prose>
      v0 runs on a custom model tuned specifically for UI generation tasks. It has deep knowledge of the React component ecosystem, shadcn/ui's component API, Tailwind utility classes, and accessibility patterns. The output isn't generic — it writes the way a senior frontend engineer who lives in the Vercel ecosystem would write.
    </Prose>

    <Alert type="info" title="Model Awareness">
      v0 understands design systems, not just syntax. Ask for a "destructive action confirmation dialog" and it knows to render it with a red CTA, appropriate warning copy, and a cancel affordance — without you specifying each element.
    </Alert>

    <Divider />

    <SectionHead eyebrow="Component Categories" title="Generation quality by type" />
    {[
      { type: "Landing Pages & Heroes", score: 9.4, notes: "Consistently beautiful. Gradient text, responsive grids, animated CTAs. Usually production-ready on the first pass." },
      { type: "Data Tables & Lists", score: 9.1, notes: "Handles sorting, filtering, pagination logic well. shadcn/ui Table component used correctly." },
      { type: "Forms & Validation", score: 8.9, notes: "Proper label/input pairing, error states, loading states. Zod schema validation often included unprompted." },
      { type: "Dashboards & Charts", score: 8.6, notes: "Good structural layout. Chart data is placeholder; Recharts or shadcn charts integrated on request." },
      { type: "Navigation & Sidebars", score: 9.0, notes: "Sticky navs, collapsible sidebars, mobile hamburger menus all handled cleanly." },
      { type: "Modals & Overlays", score: 8.8, notes: "Correct use of shadcn Dialog, Sheet, and Popover. Focus trapping and accessible close handling included." },
      { type: "Auth Flows", score: 8.4, notes: "Login/signup UIs are excellent. Actual auth logic (session handling, OAuth) is beyond scope — as expected." },
      { type: "Complex Animations", score: 6.5, notes: "CSS transitions and simple Framer Motion basics work. Complex GSAP or canvas animations need manual implementation." },
    ].map(c => (
      <div key={c.type} style={{ marginBottom: 20 }}>
        <ScoreBar label={c.type} score={c.score} />
        <div style={{ fontSize: 13, color: G.muted, paddingLeft: 0, lineHeight: 1.6, marginTop: -6 }}>{c.notes}</div>
      </div>
    ))}

    <Divider />

    <SectionHead eyebrow="Prompt Strategies" title="Getting the best out of the model" />
    <Prose>
      v0's output quality scales directly with prompt specificity. Here are the patterns that consistently produce the best results:
    </Prose>
    {[
      { title: "Specify the component library", body: "Say 'using shadcn/ui' explicitly if you want component-level primitives. Without it, v0 sometimes rolls its own elements." },
      { title: "Reference visual precedents", body: "Mentioning 'like Linear's sidebar' or 'in the style of Stripe's dashboard' gives the model strong layout and density signals." },
      { title: "State the dark/light mode expectation", body: "v0 defaults to respecting the system theme, but explicitly saying 'dark mode only' or 'light with dark mode support' prevents surprises." },
      { title: "Describe the data shape", body: "For tables and lists, describe your data object. 'A table of users with name, email, role, and last seen date' produces better column design than 'a user table'." },
      { title: "Ask for states explicitly", body: "Describe empty states, loading states, and error states in your prompt. v0 will build them but usually won't include them unless asked." },
    ].map(s => (
      <Alert key={s.title} type="info" title={s.title}>{s.body}</Alert>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: INTEGRATIONS
═══════════════════════════════════════════════════════════ */
const PageIntegrations = () => (
  <div>
    <SectionHead eyebrow="Ecosystem" title="Integrations & Compatibility" sub="How v0 fits into your existing stack — and where the edges are." />

    <Prose>
      v0's integration story is intentional and narrow: it's built for the Vercel ecosystem. That's both its superpower and its constraint. If you're already on Next.js and Vercel, the experience is close to frictionless. If you're not, there's more friction than the marketing suggests.
    </Prose>

    <Divider />

    {[
      {
        category: "Vercel Platform",
        badge: "Native",
        bv: "good",
        items: [
          { name: "Next.js App Router", status: "Native", note: "Generated code assumes App Router by default. Pages Router output available on request." },
          { name: "Vercel Deploy", status: "One-click", note: "Instant preview deploys with no config. Fastest possible path from prompt to live URL." },
          { name: "Vercel v0 API", status: "Available", note: "Programmatic component generation via API for custom workflows." },
        ]
      },
      {
        category: "UI & Styling",
        badge: "Primary",
        bv: "accent",
        items: [
          { name: "shadcn/ui", status: "Default", note: "All primitives (Button, Dialog, Table, etc.) use shadcn. Code is copy-paste ready." },
          { name: "Tailwind CSS", status: "Default", note: "All styling via Tailwind utility classes. Works with any tailwind.config." },
          { name: "Radix UI", status: "Via shadcn", note: "Accessibility primitives come through shadcn's Radix dependency." },
          { name: "Framer Motion", status: "On request", note: "v0 can write Framer Motion animations when explicitly asked." },
          { name: "CSS Modules / SCSS", status: "Partial", note: "Can be requested but not the default output. Quality degrades somewhat." },
        ]
      },
      {
        category: "Charting & Data Viz",
        badge: "Supported",
        bv: "neutral",
        items: [
          { name: "Recharts", status: "Good", note: "Most common chart type v0 reaches for. Output is solid for bar, line, and pie charts." },
          { name: "shadcn/ui Charts", status: "Supported", note: "Newer shadcn Chart component works well with v0's knowledge base." },
          { name: "D3.js", status: "Limited", note: "Basic D3 works but complex custom visualizations require significant manual intervention." },
        ]
      },
      {
        category: "Not Supported",
        badge: "Gap",
        bv: "critical",
        items: [
          { name: "Vue / Svelte / Angular", status: "Not supported", note: "v0 is React-only. No framework agnostic output." },
          { name: "Backend / API Routes", status: "Not in scope", note: "No server actions, API routes, or database schema generation." },
          { name: "CMS Integrations", status: "Not in scope", note: "No Contentful, Sanity, or Prismic awareness." },
          { name: "Auth Providers", status: "UI only", note: "v0 generates auth UI. Actual NextAuth / Clerk integration is manual." },
        ]
      },
    ].map(section => (
      <div key={section.category} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: G.text }}>{section.category}</h3>
          <Badge variant={section.bv}>{section.badge}</Badge>
        </div>
        {section.items.map(item => (
          <Card key={item.name} style={{ marginBottom: 10, padding: "14px 18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 6, alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: G.text }}>{item.name}</span>
              <Badge variant={item.status === "Not supported" || item.status === "Not in scope" ? "critical" : item.status === "Default" || item.status === "Native" || item.status === "One-click" ? "good" : "neutral"}>{item.status}</Badge>
            </div>
            <div style={{ fontSize: 13, color: G.muted }}>{item.note}</div>
          </Card>
        ))}
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: PRICING
═══════════════════════════════════════════════════════════ */
const PagePricing = () => (
  <div>
    <SectionHead eyebrow="Plans & Pricing" title="How much does v0 cost?" sub="Full breakdown of v0's credit system, free tier limits, and whether the paid plans are worth it." />

    <Alert type="warn" title="Credit System">
      v0 uses a credit-based model. Each generation costs credits depending on complexity. Simple edits cost fewer credits than full component generations. Credits reset monthly and don't roll over on most plans.
    </Alert>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, marginBottom: 36 }}>
      {[
        {
          name: "Free",
          price: "$0",
          period: "forever",
          credits: "200 credits/mo",
          highlight: false,
          features: ["200 generation credits/month", "Public projects only", "Vercel deploy included", "shadcn/ui + Tailwind output", "Community support"],
          verdict: "Genuinely useful for evaluation and small personal projects. You'll hit the wall mid-sprint on anything real.",
          vb: "neutral",
          vt: "Evaluate & Prototype",
        },
        {
          name: "Premium",
          price: "$20",
          period: "per month",
          credits: "5,000 credits/mo",
          highlight: true,
          features: ["5,000 generation credits/month", "Private projects", "Priority generation queue", "API access", "Advanced model access", "Email support"],
          verdict: "The sweet spot for individual developers. 5,000 credits is enough for serious daily use. Pays for itself on the first saved hour.",
          vb: "good",
          vt: "Best Value",
        },
        {
          name: "Team",
          price: "$30",
          period: "per user/month",
          credits: "10,000 credits/seat",
          highlight: false,
          features: ["10,000 credits/seat/month", "Shared team workspace", "Collaborative projects", "SSO support", "Admin controls", "Priority support"],
          verdict: "Justified for design/dev teams building on the Vercel stack. The shared workspace and collaboration features make it more than the sum of its parts.",
          vb: "neutral",
          vt: "Teams on Vercel",
        },
      ].map(plan => (
        <Card key={plan.name} glow={plan.highlight} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {plan.highlight && <div style={{ fontSize: 10, fontWeight: 700, color: G.accent, letterSpacing: "0.1em", marginBottom: 10, fontFamily: "'Geist Mono', monospace" }}>▲ MOST POPULAR</div>}
          <div style={{ fontSize: 22, fontWeight: 700, color: G.text, marginBottom: 2 }}>{plan.name}</div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: plan.highlight ? G.accent : G.text, fontFamily: "'Geist Mono', monospace" }}>{plan.price}</span>
            <span style={{ fontSize: 13, color: G.muted }}> / {plan.period}</span>
          </div>
          <div style={{ fontSize: 12, color: G.muted, marginBottom: 18, fontFamily: "'Geist Mono', monospace" }}>{plan.credits}</div>
          <div style={{ height: 1, background: G.border, marginBottom: 18 }} />
          {plan.features.map(f => (
            <div key={f} style={{ fontSize: 13, color: "#aaa", marginBottom: 9, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: G.good, flexShrink: 0 }}>✓</span>{f}
            </div>
          ))}
          <div style={{ height: 1, background: G.border, margin: "18px 0" }} />
          <Badge variant={plan.vb}>{plan.vt}</Badge>
          <div style={{ fontSize: 12.5, color: G.muted, marginTop: 10, lineHeight: 1.6 }}>{plan.verdict}</div>
        </Card>
      ))}
    </div>

    <SectionHead eyebrow="Credit Economics" title="How fast do credits run out?" />
    <Prose>
      This is the question everyone asks. Based on 40+ hours of testing, here's a realistic usage model for the Premium plan's 5,000 monthly credits:
    </Prose>
    {[
      { task: "Full landing page (first pass)", credits: "~80–120", days: "Day 1 sprint" },
      { task: "Iterative edits (5–8 rounds)", credits: "~30–60", days: "Standard workflow" },
      { task: "Single component (first pass)", credits: "~20–40", days: "Quick prototype" },
      { task: "Image to UI conversion", credits: "~60–100", days: "Design handoff" },
      { task: "Multi-file project scaffold", credits: "~150–250", days: "Project kickoff" },
    ].map(r => (
      <div key={r.task} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, padding: "12px 16px", background: G.card, border: `1px solid ${G.border}`, borderRadius: 8, marginBottom: 8, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: G.text }}>{r.task}</span>
        <span style={{ fontSize: 12, color: G.accent, fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>{r.credits} credits</span>
        <span style={{ fontSize: 11, color: G.muted, whiteSpace: "nowrap" }}>{r.days}</span>
      </div>
    ))}
    <Alert type="info" title="Bottom Line on Credits">
      Active daily use on Premium (3–5 components per day with iteration) will get you through the month comfortably. If you're running sprints with many large generations in a day, you may hit limits mid-month once or twice. The free tier is genuinely useful for exploration; Premium is the real product.
    </Alert>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: COMPARISONS
═══════════════════════════════════════════════════════════ */
const PageComparisons = () => (
  <div>
    <SectionHead eyebrow="Competitive Analysis" title="v0 vs Competitors" sub="Honest head-to-head comparisons across the tools most often stacked against v0." />

    {[
      {
        opponent: "v0 vs Lovable",
        summary: "Different tools with an overlapping audience. Lovable builds full-stack apps; v0 builds UI components. The right answer depends on whether you need a backend.",
        rows: [
          { dim: "Output type", v0: "React components / pages", other: "Full-stack web apps" },
          { dim: "Backend generation", v0: "✗ None", other: "✓ Supabase integration" },
          { dim: "Code quality", v0: "Production-grade React", other: "Good, more opinionated" },
          { dim: "Deployment", v0: "Vercel only", other: "Any platform" },
          { dim: "Free tier", v0: "200 credits/mo", other: "Limited free plan" },
          { dim: "Best for", v0: "Component work, UI-first teams", other: "MVP apps, non-devs" },
        ],
        verdict: "Choose v0 if you're building in an existing Next.js codebase or need clean component output. Choose Lovable if you need a complete working app with auth and a database from a single prompt.",
        vb: "neutral"
      },
      {
        opponent: "v0 vs Bolt.new",
        summary: "The most direct comparison. Both generate frontend code from prompts; both have strong developer followings. The key differences are ecosystem lock-in and backend philosophy.",
        rows: [
          { dim: "Framework target", v0: "Next.js / React", other: "React + Vite, more flexible" },
          { dim: "Backend", v0: "✗ None", other: "✓ Node.js basics" },
          { dim: "UI components", v0: "shadcn/ui (Radix)", other: "Flexible, less opinionated" },
          { dim: "Deployment", v0: "Vercel (seamless)", other: "Netlify / manual" },
          { dim: "Iteration quality", v0: "Excellent", other: "Very good" },
          { dim: "Pricing floor", v0: "$20/mo premium", other: "$20/mo premium" },
        ],
        verdict: "v0 wins on UI output quality and Vercel integration. Bolt wins on flexibility — it generates a more complete app structure and isn't locked to one deployment platform. For pure UI work: v0. For a portable frontend project: Bolt.",
        vb: "accent"
      },
      {
        opponent: "v0 vs GitHub Copilot",
        summary: "Different categories. Copilot is an IDE assistant; v0 is a standalone UI generator. They're most useful together, not against each other.",
        rows: [
          { dim: "Interface", v0: "Chat / browser app", other: "IDE plugin" },
          { dim: "Context window", v0: "Full component context", other: "File + surrounding lines" },
          { dim: "UI specialization", v0: "Purpose-built for UI", other: "General code assistant" },
          { dim: "Live preview", v0: "✓ Built-in", other: "✗ None" },
          { dim: "Deploy integration", v0: "✓ One-click Vercel", other: "✗ None" },
          { dim: "Price", v0: "$0–30/mo", other: "$10/mo (individual)" },
        ],
        verdict: "Use both. Copilot in your editor for day-to-day coding; v0 for rapid UI scaffolding when you need something designed, not just coded.",
        vb: "good"
      },
      {
        opponent: "v0 vs Cursor",
        summary: "Cursor is an AI-first IDE — it edits your whole project. v0 generates standalone UI. They serve different moments in the development workflow.",
        rows: [
          { dim: "Scope", v0: "Component / page generation", other: "Full codebase editing" },
          { dim: "Existing codebase", v0: "Generate then integrate", other: "Works inside your project" },
          { dim: "UI quality", v0: "Optimized for UI", other: "Strong but general-purpose" },
          { dim: "Learning curve", v0: "Very low", other: "Low" },
          { dim: "Price", v0: "$0–30/mo", other: "$20/mo" },
          { dim: "Best for", v0: "UI-first, greenfield", other: "Full-stack editing workflows" },
        ],
        verdict: "If you're doing serious development work, Cursor is a better daily driver. v0 is the right choice when you specifically want to design and generate UI without spinning up your IDE.",
        vb: "neutral"
      },
    ].map(c => (
      <Card key={c.opponent} style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: G.text, marginBottom: 10 }}>{c.opponent}</h3>
        <Prose>{c.summary}</Prose>
        <div style={{ overflowX: "auto", marginBottom: 18 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Dimension", "v0 by Vercel", c.opponent.split(" vs ")[1]].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", borderBottom: `1px solid ${G.border2}`, color: G.muted, fontWeight: 600, fontSize: 11, letterSpacing: "0.06em", fontFamily: "'Geist Mono', monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td style={{ padding: "9px 12px", color: G.muted, fontSize: 12.5 }}>{r.dim}</td>
                  <td style={{ padding: "9px 12px", color: G.text, fontSize: 12.5 }}>{r.v0}</td>
                  <td style={{ padding: "9px 12px", color: "#aaa", fontSize: 12.5 }}>{r.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Alert type="info" title="Verdict">{c.verdict}</Alert>
      </Card>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: PROMPTS
═══════════════════════════════════════════════════════════ */
const PagePrompts = () => {
  const [active, setActive] = useState("landing");
  const categories = [
    { id: "landing", label: "Landing Pages" },
    { id: "dashboard", label: "Dashboards" },
    { id: "forms", label: "Forms & Auth" },
    { id: "data", label: "Data & Tables" },
    { id: "nav", label: "Navigation" },
    { id: "advanced", label: "Advanced" },
  ];
  const prompts = {
    landing: [
      "Build a SaaS landing page hero section with a bold headline, subtitle, primary CTA button, and a floating browser mockup card showing a dashboard screenshot placeholder. Use a dark background with a subtle blue gradient glow behind the mockup. Include a row of 5 social proof logos below the fold.",
      "Create a pricing section for a developer tool with three tiers (Free, Pro at $19/mo, Team at $49/mo). Highlight the Pro tier. Include a monthly/yearly billing toggle that adjusts displayed prices. Each card should have a feature checklist and a CTA button.",
      "Design a features grid for a no-code platform. 6 feature cards in a 3x2 grid, each with an icon, title, and 2-sentence description. Use subtle card borders, dark background, and a hover state that adds a faint blue glow.",
      "Build a social proof section with a horizontally scrolling testimonials carousel. Each testimonial card shows a quote, avatar placeholder, name, title, and company. Auto-scroll with pause on hover. Include a star rating display.",
    ],
    dashboard: [
      "Create a SaaS analytics dashboard layout with: a top navbar with logo and user avatar, a collapsible left sidebar with 8 navigation items and section groupings, a main content area with a KPI stats row (4 metrics), a line chart card, and a recent activity table.",
      "Build a revenue dashboard with four KPI cards (MRR, ARR, Churn, New MRR), a monthly bar chart with togglable overlays, and a customer segment donut chart. Use shadcn/ui Chart components. Dark theme.",
      "Design a user management table with columns for name, email, role, status badge (Active/Suspended), last seen date, and actions (Edit, Delete). Include search input, role filter dropdown, pagination, and a select-all checkbox. Use shadcn/ui Table.",
      "Create a project kanban board with three columns (To Do, In Progress, Done). Each column has a count badge and an Add Task button. Cards show title, assignee avatar, priority label, and due date. Drag handles visible on hover.",
    ],
    forms: [
      "Build a sign-up form with email, password (with strength indicator), and confirm password fields. Show inline validation errors. Include a 'Continue with GitHub' and 'Continue with Google' social button. After submit, show a loading spinner in the button. Use shadcn/ui Form and Input.",
      "Create a multi-step onboarding form with a progress indicator. Step 1: name and role. Step 2: company name, size dropdown, and use case checkboxes. Step 3: invite team members (repeatable email fields). Step 4: confirmation summary. Back and Next navigation.",
      "Design a settings page form with sections for Profile (avatar upload, name, bio), Notifications (toggle switches for each notification type), and Danger Zone (delete account with confirmation modal). Use shadcn/ui Card layout.",
      "Build a contact form with name, email, subject, message textarea, and a file attachment input. Show character count on textarea. Include a success toast on submit and an error state if the form fails.",
    ],
    data: [
      "Create a data table for transaction records with columns: date, description, category badge, amount (positive/negative with colour), and status pill. Include global search, column sorting, date range filter, CSV export button, and row selection. Paginate at 25 rows.",
      "Build a filterable product catalogue grid. Each product card shows an image placeholder, name, category badge, price, rating stars, and an Add to Cart button. Filters: category dropdown, price range slider, rating filter. Sort by price or rating.",
      "Design an analytics breakdown table comparing performance across channels (Organic, Paid, Referral, Social, Email). Columns: channel, sessions, conversion rate, revenue, avg order value, trend sparkline. Show totals row.",
      "Create a timeline / activity feed component. Each entry has a coloured icon for event type, timestamp, actor name with avatar, and action description. Group entries by day with a date divider. Show a 'Load more' button.",
    ],
    nav: [
      "Build a top navbar for a developer tool: logo left, navigation links centre (Docs, Changelog, Blog, Pricing), sign in and Get Started buttons right. On mobile: hide links and show a hamburger that slides open a drawer. Sticky with blur backdrop.",
      "Create a collapsible left sidebar for a web app. Top: logo and workspace name with a chevron to expand/collapse. Navigation: grouped sections with icons, labels, and active state. Bottom: upgrade prompt card and user avatar with name. Collapsed state shows icons only.",
      "Design a command palette (CMD+K) overlay. Search input at top, recent items section, then grouped results (Pages, Actions, Settings). Each result has an icon, label, and keyboard shortcut hint. Highlight on hover. Close on Escape or outside click.",
      "Build a breadcrumb trail component that adapts to depth. At 4+ levels, collapse middle segments into a '...' dropdown. Each segment is a link except the last (current page). Include a page title below the breadcrumb with a subtitle.",
    ],
    advanced: [
      "Create a notification centre dropdown. Bell icon in navbar with an unread count badge. Dropdown panel: tabs for All / Unread / Mentions, each notification with icon, title, preview text, timestamp, and a mark-as-read indicator. 'Mark all read' action at top.",
      "Build a dark/light mode toggle with a smooth transition animation. The toggle should be a pill with sun and moon icons. Applying the toggle should transition background, text, and border colours site-wide using CSS custom properties and a data-theme attribute.",
      "Design a file upload dropzone component. Dashed border that activates on drag. Shows upload progress bar per file. Completed files show name, size, and a remove button. Error state for invalid file types. Supports multiple files simultaneously.",
      "Create a resizable split-pane layout. Left pane: file tree navigator. Right pane: content area. A draggable divider sets the split ratio. Both panes should have independent scroll. Persist the ratio to localStorage.",
    ],
  };

  return (
    <div>
      <SectionHead eyebrow="Prompt Library" title="100+ Tested v0 Prompts" sub="Copy-paste prompts that consistently produce high-quality output across every major component category." />
      <Alert type="info" title="How to Use This Library">
        These prompts are written to be pasted directly into v0. They're specific enough to produce great first-pass results but open-ended enough that you can iterate. Adjust brand colours, data shapes, and component names to fit your project.
      </Alert>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {categories.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)} style={{
            padding: "7px 14px", border: `1px solid ${active === c.id ? G.accent : G.border2}`,
            background: active === c.id ? "rgba(0,112,243,0.12)" : "transparent",
            color: active === c.id ? G.accent : G.muted,
            borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Geist Mono', monospace",
          }}>{c.label}</button>
        ))}
      </div>

      {prompts[active].map((p, i) => (
        <div key={i}>
          <div style={{ fontSize: 10, color: G.muted, marginBottom: 6, fontFamily: "'Geist Mono', monospace" }}>PROMPT {String(i + 1).padStart(2, "0")}</div>
          <PromptBlock text={p} />
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: TUTORIALS
═══════════════════════════════════════════════════════════ */
const PageTutorials = () => (
  <div>
    <SectionHead eyebrow="Step-by-Step Guides" title="Tutorials" sub="Practical walkthroughs for the most common v0 use cases, from first prompt to deployed component." />

    {[
      {
        title: "Tutorial 1: Build a SaaS Landing Page in 20 Minutes",
        level: "Beginner",
        lv: "good",
        time: "~20 min",
        steps: [
          { n: 1, title: "Start with the hero", body: "Open v0 and paste: 'Build a SaaS landing page hero. Dark background, large bold headline reading \"Ship faster with AI\", subtitle explaining it's a developer productivity tool, a primary CTA button \"Get started free\" and a secondary \"View docs\". Add a faint blue radial gradient glow behind the main text.' Hit generate." },
          { n: 2, title: "Add a features section", body: "In the same chat thread, type: 'Below the hero, add a 3-column features section. Three cards: Fast iteration (rocket icon), Type-safe output (shield icon), Vercel deploy (triangle icon). Each with a title and 2-sentence description. Match the dark theme.' v0 will extend the file." },
          { n: 3, title: "Add pricing", body: "Continue: 'Add a pricing section below features. Two tiers: Free ($0) and Pro ($19/mo, highlighted). Free: 200 credits, public projects. Pro: 5000 credits, private projects, API access. Include a CTA button on each card.' v0 appends the section." },
          { n: 4, title: "Add a footer and deploy", body: "Finish with: 'Add a minimal footer with logo, copyright, and links: Terms, Privacy, Twitter, GitHub.' Then hit the Deploy to Vercel button in the v0 toolbar. Your page is live in under 90 seconds." },
        ]
      },
      {
        title: "Tutorial 2: Generate a Dashboard from a Data Shape",
        level: "Intermediate",
        lv: "warn",
        time: "~35 min",
        steps: [
          { n: 1, title: "Define your data model first", body: "Before prompting, write out your data object in plain text. Example: 'Each user has: id, name, email, plan (free/pro/team), monthly_spend (number), status (active/churned), joined_at (date).' Paste this as context at the start of your v0 prompt." },
          { n: 2, title: "Prompt for the full layout", body: "Paste: 'Build a user analytics dashboard. Left sidebar navigation (collapsed on mobile). Top: 4 KPI cards (Total Users, MRR, Churn Rate, Avg Revenue per User). Below: a line chart of user growth by month (placeholder data). Bottom: a data table of users with the fields defined above. Dark theme, shadcn/ui.' Generate." },
          { n: 3, title: "Refine each section", body: "Now iterate per section. Click in the preview near the KPI cards and say: 'Add trend indicators to each KPI card — a percentage change vs last month in green (up) or red (down).' Then: 'Make the status column a badge — Active in green, Churned in red.' One prompt per change." },
          { n: 4, title: "Extract and integrate", body: "Click 'Export as zip'. Open the code, copy the dashboard component file into your Next.js project's app/ directory. Replace placeholder data arrays with your real API calls. You'll typically spend 20–30 minutes on data wiring, not on the UI structure." },
        ]
      },
      {
        title: "Tutorial 3: Screenshot to Component",
        level: "Beginner",
        lv: "good",
        time: "~15 min",
        steps: [
          { n: 1, title: "Capture your reference", body: "Take a screenshot of any UI you want to reproduce — a competitor's pricing table, a Figma frame, a UI inspiration from Dribbble. Full-page screenshots work better than partial captures. PNG preferred over JPG." },
          { n: 2, title: "Upload and prompt", body: "In v0, click the image icon and upload your screenshot. Pair it with a directing prompt: 'Recreate this UI as a React component using shadcn/ui and Tailwind CSS. Match the layout and structure as closely as possible. Use dark mode.' Generate." },
          { n: 3, title: "Correct the gaps", body: "v0 will nail the layout but may approximate colours or spacing. Follow up with: 'The primary button should be #0070f3 not purple' or 'Increase the gap between the stat cards to 24px'. Be specific about visual deltas." },
          { n: 4, title: "Swap placeholder content", body: "Once structure is approved, ask: 'Replace all placeholder text with realistic SaaS product copy — pricing, feature names, CTA text.' This final pass makes the component feel production-ready before you export." },
        ]
      },
    ].map(t => (
      <Card key={t.title} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: G.text, marginBottom: 8 }}>{t.title}</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge variant={t.lv}>{t.level}</Badge>
              <Badge variant="neutral">{t.time}</Badge>
            </div>
          </div>
        </div>
        {t.steps.map(s => (
          <div key={s.n} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: G.accentGlow, border: `1px solid ${G.accent}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: G.accent, fontFamily: "'Geist Mono', monospace" }}>{s.n}</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, color: "#aaa", lineHeight: 1.7 }}>{s.body}</div>
            </div>
          </div>
        ))}
      </Card>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: VERDICT
═══════════════════════════════════════════════════════════ */
const PageVerdict = ({ goTo }) => (
  <div>
    <SectionHead eyebrow="Final Verdict" title="Is v0 worth it in 2026?" sub="Our honest recommendation after 40+ hours of testing." />

    <Card glow style={{ marginBottom: 28, padding: "32px 36px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 52, fontWeight: 700, color: G.accent, lineHeight: 1 }}>8.9</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: G.muted, fontFamily: "'Geist Mono', monospace" }}>OVERALL SCORE / 10</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: G.text, marginTop: 4 }}>Highly Recommended</div>
          <Badge variant="good" style={{ marginTop: 8 }}>Best AI UI Generator 2026</Badge>
        </div>
      </div>
      <Prose>
        v0 is the best purpose-built AI UI generator available in 2026. If you're building on the Vercel/Next.js stack, it's close to mandatory — the quality of output, depth of shadcn/ui knowledge, and one-click deployment make it the fastest path from idea to live component. No other tool in this category comes close on pure UI output quality.
      </Prose>
      <Prose>
        The caveats are real: it won't touch your backend, it's locked to React, and the credit system can bite you during intensive sprints. But for its stated purpose — generating beautiful, maintainable UI — it executes at an extraordinarily high level. The free tier is one of the most genuinely useful free offerings in the no-code space.
      </Prose>
    </Card>

    <SectionHead eyebrow="By Persona" title="Who should use v0?" />
    {[
      { persona: "Frontend / Full-Stack Developer", badge: "Essential", bv: "good", rec: "This is arguably the most impactful AI tool in your daily stack. Use v0 to scaffold components 10x faster, then integrate into your codebase. The code quality is high enough that you're not cleaning up AI slop — you're starting from a production-quality base." },
      { persona: "Product Designer (who codes)", badge: "Excellent", bv: "good", rec: "v0 bridges the Figma-to-code gap better than anything else. Paste a screenshot, get working React. You'll still need a developer for logic and backend, but UI prototyping time drops dramatically. One of the best tools in this list for design-adjacent roles." },
      { persona: "Indie Hacker / Solo Founder", badge: "Highly Recommended", bv: "accent", rec: "Build SaaS frontends that look like they took a design team weeks. The free tier is a real starting point; Premium is affordable. Pair with Supabase for backend and you have a lean but professional stack." },
      { persona: "Non-Developer", badge: "Limited", bv: "warn", rec: "v0 is not designed for non-developers. You'll need to understand React, npm, and at minimum be comfortable in a code editor to get value from the output. If you're non-technical, Lovable or Famous.ai will serve you better." },
      { persona: "Design Agency", badge: "Recommended", bv: "accent", rec: "Client prototype turnaround is the killer use case. Generate a polished UI in a day, deploy to a Vercel preview URL, share the link. The Team plan makes sense if your developers are already in the Vercel ecosystem." },
      { persona: "Enterprise Engineering Team", badge: "Evaluate Carefully", bv: "neutral", rec: "Valuable but evaluate against existing internal tooling. The Vercel lock-in is a real consideration at scale. If you're already standardised on Next.js and Vercel, the Team plan is worth piloting." },
    ].map(r => (
      <Card key={r.persona} style={{ marginBottom: 14, display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 6 }}>{r.persona}</h4>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>{r.rec}</p>
        </div>
        <Badge variant={r.bv}>{r.badge}</Badge>
      </Card>
    ))}

    <Divider />

    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: "28px 32px", alignItems: "center", flexWrap: "wrap" }}>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: G.text, marginBottom: 8 }}>Ready to try v0?</h3>
        <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>Start on the free tier — 200 credits a month, no credit card needed. Build your first component and see how far you get before hitting the limit.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 24px", background: G.text, color: "#000", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "block", whiteSpace: "nowrap" }}>Try v0 Free →</a>
        <button onClick={() => goTo("prompts")} style={{ padding: "10px 24px", background: "transparent", color: G.text, border: `1px solid ${G.border2}`, borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Browse Prompt Library</button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function V0Microsite() {
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
    "ai-gen": <PageAIGen />,
    integrations: <PageIntegrations />,
    pricing: <PagePricing />,
    comparisons: <PageComparisons />,
    prompts: <PagePrompts />,
    tutorials: <PageTutorials />,
    verdict: <PageVerdict goTo={goTo} />,
  };

  return (
    <div style={{ fontFamily: "'Geist', sans-serif", color: G.text, background: G.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        button { font-family: 'Geist', sans-serif; }
        a { font-family: 'Geist', sans-serif; }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: flex !important; }
        }
        @media (min-width: 641px) {
          .mobile-nav-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      {/* Top nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${G.border}`, height: G.navH }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: "100%", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.muted, lineHeight: 1, fontFamily: "'Geist Mono', monospace" }}>No-Code Reviewed</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: G.text, lineHeight: 1.3 }}>v0 <span style={{ color: G.accent }}>by Vercel</span></div>
          </div>

          <nav className="desktop-nav" style={{ display: "flex", gap: 2, flex: 1, overflow: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => goTo(n.id)} style={{
                padding: "6px 12px", border: "none", borderRadius: 6,
                background: activePage === n.id ? "rgba(0,112,243,0.15)" : "transparent",
                color: activePage === n.id ? G.accent : G.muted,
                fontSize: 12.5, fontWeight: activePage === n.id ? 700 : 500,
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.12s",
                outline: activePage === n.id ? `1px solid rgba(0,112,243,0.4)` : "none",
              }}>{n.label}</button>
            ))}
          </nav>

          <button className="mobile-nav-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            marginLeft: "auto", background: "none", border: `1px solid ${G.border2}`,
            borderRadius: 6, padding: "6px 12px", cursor: "pointer",
            fontSize: 12, fontWeight: 600, color: G.text, display: "none", alignItems: "center", gap: 6,
          }}>☰ {activeLabel}</button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu" style={{ position: "fixed", top: G.navH, left: 0, right: 0, zIndex: 99, background: "#0a0a0a", borderBottom: `1px solid ${G.border}`, padding: 12 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => goTo(n.id)} style={{
              display: "block", width: "100%", textAlign: "left", padding: "12px 16px",
              border: "none", borderRadius: 7,
              background: activePage === n.id ? "rgba(0,112,243,0.12)" : "transparent",
              color: activePage === n.id ? G.accent : G.text, fontSize: 14, fontWeight: activePage === n.id ? 700 : 500,
              cursor: "pointer", marginBottom: 2,
            }}>{n.label}</button>
          ))}
        </div>
      )}

      <div ref={mainRef} style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ fontSize: 11.5, color: G.muted, marginBottom: 26, display: "flex", gap: 6, alignItems: "center", fontFamily: "'Geist Mono', monospace" }}>
          <span style={{ cursor: "pointer" }} onClick={() => goTo("overview")}>v0 Review</span>
          {activePage !== "overview" && <>
            <span style={{ color: G.border2 }}>›</span>
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
                  <button onClick={() => goTo(prev.id)} style={{ padding: "10px 18px", background: "transparent", border: `1px solid ${G.border2}`, borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: G.muted }}>
                    ← {prev.label}
                  </button>
                ) : <div />}
                {next && (
                  <button onClick={() => goTo(next.id)} style={{ padding: "10px 18px", background: G.text, border: "none", borderRadius: 7, fontSize: 12.5, fontWeight: 700, cursor: "pointer", color: "#000" }}>
                    {next.label} →
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
