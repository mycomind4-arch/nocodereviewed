import { useState, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   BOLT.NEW — FULL REVIEW MICROSITE
   no-code-reviewed.bolt.app
   Design system: Space Mono + Syne, #00d4ff accent, #e8f4f8 text, #0a0e14 bg
═══════════════════════════════════════════════════════════ */

const G = {
  accent: "#00d4ff",
  accentDim: "#0099bb",
  text: "#e8f4f8",
  card: "#111820",
  bg: "#0a0e14",
  muted: "#6a8a9a",
  border: "#1e2d3d",
  good: "#00e5a0",
  warn: "#ff6b4a",
  goodBg: "#001a12",
  warnBg: "#1a0900",
  navH: 60,
};

/* ─── Shared micro-components ─── */
const Badge = ({ children, variant = "neutral" }) => {
  const colors = {
    neutral: { bg: "#1a2535", color: G.muted },
    accent: { bg: "#001a22", color: G.accent },
    critical: { bg: G.warnBg, color: G.warn },
    good: { bg: G.goodBg, color: G.good },
    warn: { bg: "#1a0e00", color: "#ffaa44" },
  };
  const c = colors[variant];
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 4,
      background: c.bg, color: c.color,
      fontFamily: "'Space Mono', monospace",
    }}>{children}</span>
  );
};

const ScoreBar = ({ label, score, max = 10 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 38px", alignItems: "center", gap: 12, marginBottom: 14 }}>
    <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "'Space Mono', monospace", color: G.muted }}>{label}</span>
    <div style={{ height: 3, background: G.border, borderRadius: 0, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(score / max) * 100}%`, background: `linear-gradient(90deg, ${G.accent}, ${G.good})`, borderRadius: 0 }} />
    </div>
    <span style={{ fontSize: 13, fontWeight: 700, textAlign: "right", color: G.accent, fontFamily: "'Space Mono', monospace" }}>{score}</span>
  </div>
);

const Alert = ({ type = "neutral", title, children }) => {
  const map = {
    neutral: { border: G.border, bg: G.card },
    warn: { border: G.warn, bg: G.warnBg },
    good: { border: G.good, bg: G.goodBg },
    info: { border: G.accent, bg: "#001a22" },
  };
  const s = map[type];
  return (
    <div style={{ borderLeft: `3px solid ${s.border}`, background: s.bg, borderRadius: "0 8px 8px 0", padding: "18px 22px", marginBottom: 20 }}>
      {title && <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, color: s.border, fontFamily: "'Space Mono', monospace" }}>{title}</div>}
      <div style={{ fontSize: 14, lineHeight: 1.7, color: G.text }}>{children}</div>
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 8, padding: "22px 24px", ...style }}>
    {children}
  </div>
);

const SectionHead = ({ eyebrow, title, sub }) => (
  <div style={{ marginBottom: 32 }}>
    {eyebrow && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.accent, marginBottom: 10, fontFamily: "'Space Mono', monospace" }}>{eyebrow}</div>}
    <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: sub ? 10 : 0, lineHeight: 1.1, fontFamily: "'Syne', sans-serif", color: G.text }}>{title}</h2>
    {sub && <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.65, maxWidth: 620 }}>{sub}</p>}
  </div>
);

const Prose = ({ children }) => (
  <div style={{ fontSize: 14, lineHeight: 1.85, color: "#a8c4cc", marginBottom: 16 }}>{children}</div>
);

const Divider = () => <div style={{ height: 1, background: G.border, margin: "36px 0" }} />;

const StatPill = ({ num, label }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 8, padding: "20px 22px", textAlign: "center", flex: "1 1 140px" }}>
    <div style={{ fontSize: 26, fontWeight: 800, color: G.accent, lineHeight: 1, fontFamily: "'Space Mono', monospace" }}>{num}</div>
    <div style={{ fontSize: 11, color: G.muted, marginTop: 6, lineHeight: 1.4 }}>{label}</div>
  </div>
);

/* ─── Copy button ─── */
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy} style={{
      position: "absolute", top: 10, right: 10, padding: "5px 12px",
      background: copied ? G.good : G.accent, color: "#000",
      border: "none", borderRadius: 4, fontSize: 10, fontWeight: 700,
      cursor: "pointer", transition: "background 0.2s", fontFamily: "'Space Mono', monospace",
      letterSpacing: "0.05em",
    }}>{copied ? "COPIED!" : "COPY"}</button>
  );
};

const PromptBlock = ({ text }) => (
  <div style={{ position: "relative", background: "#060a10", border: `1px solid ${G.border}`, borderRadius: 8, padding: "16px 52px 16px 18px", marginBottom: 14 }}>
    <CopyBtn text={text} />
    <p style={{ color: "#7ecfdf", fontSize: 13, lineHeight: 1.7, fontFamily: "'Space Mono', monospace", margin: 0 }}>{text}</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   NAV DATA
═══════════════════════════════════════════════════════════ */
const NAV = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "webcontainers", label: "WebContainers" },
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
    <div style={{ background: "#060a10", border: `1px solid ${G.border}`, borderRadius: 12, padding: "48px 40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, borderRadius: "50%", background: G.accent, opacity: 0.04, transform: "translate(30%, -30%)" }} />
      <div style={{ position: "absolute", bottom: -100, left: "30%", width: 300, height: 300, borderRadius: "50%", background: G.good, opacity: 0.03 }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.accent, marginBottom: 14, fontFamily: "'Space Mono', monospace" }}>No-Code Reviewed · In-Depth Platform Review</div>
        <h1 style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 800, color: G.text, letterSpacing: "-0.025em", lineHeight: 1.05, marginBottom: 18, fontFamily: "'Syne', sans-serif" }}>
          Bolt.new<br />Complete Review 2026
        </h1>
        <p style={{ fontSize: 16, color: G.muted, lineHeight: 1.7, maxWidth: 580, marginBottom: 32 }}>
          StackBlitz's AI-powered full-stack development environment. We ran hundreds of prompts, stress-tested the WebContainers runtime, and built real production apps to give you the most thorough bolt.new review available.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => goTo("verdict")} style={{ padding: "12px 24px", background: G.accent, color: "#000", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}>SEE OUR VERDICT →</button>
          <button onClick={() => goTo("prompts")} style={{ padding: "12px 24px", background: "transparent", color: G.text, border: `1px solid ${G.border}`, borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Prompt Library</button>
        </div>
      </div>
    </div>

    {/* Quick verdict bar */}
    <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 8, padding: "20px 28px", marginBottom: 32, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
      {[
        { label: "Overall Score", val: "8.1 / 10" },
        { label: "Dev Experience", val: "9.4 / 10" },
        { label: "Runtime Speed", val: "8.8 / 10" },
        { label: "Token Transparency", val: "8.5 / 10" },
        { label: "Value", val: "7.9 / 10" },
      ].map(item => (
        <div key={item.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: G.accent, fontFamily: "'Space Mono', monospace" }}>{item.val}</div>
          <div style={{ fontSize: 10, color: G.muted, marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</div>
        </div>
      ))}
      <div style={{ marginLeft: "auto" }}>
        <Badge variant="accent">Updated May 2026</Badge>
      </div>
    </div>

    {/* Key stats */}
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
      <StatPill num="StackBlitz" label="Parent company, the WebContainers inventors" />
      <StatPill num="4M+" label="Registered users as of 2026" />
      <StatPill num="~$30M" label="Funding raised to date" />
      <StatPill num="1.4B+" label="NPM packages available in-browser" />
      <StatPill num="0ms" label="Cold-start time — no cloud VM spin-up" />
    </div>

    <SectionHead eyebrow="What Is Bolt.new" title="The Browser-Native Dev Environment" sub="Runs a full Node.js stack in your browser tab — no installs, no cloud VMs, no waiting." />

    <Prose>Bolt.new is an AI-powered development environment built on StackBlitz's WebContainers technology. Unlike Lovable or other vibe-coding tools that generate code and push it to a remote server, bolt.new runs an entire Node.js runtime directly inside your browser using WebAssembly. Every npm install, every build process, every dev server — it happens locally in your tab.</Prose>
    <Prose>The practical result: you get a real IDE, a real terminal, real npm packages, and instant hot-reload — with an AI that can see and modify the full project at once. It's the closest thing to having a developer pair-programming with you, without either of you writing the first line of code. The AI has genuine full-codebase context, not just the current file.</Prose>
    <Prose>Founded by the StackBlitz team who pioneered browser-native runtimes, bolt.new targets developers and technical users more than pure no-coders. It's more powerful but less hand-holding than Lovable — it expects you to understand what a package.json is, even if you don't want to write one.</Prose>

    <Divider />

    <SectionHead eyebrow="The Bottom Line" title="Who It's For" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: G.good, marginBottom: 14, fontFamily: "'Space Mono', monospace" }}>Best For</div>
        {["Developers who want AI to handle boilerplate", "Technical founders who can read generated code", "Teams prototyping with real npm dependencies", "Full-stack devs moving fast on MVPs", "Anyone who wants transparent token/cost usage", "Projects needing real Node.js backend logic"].map(t => (
          <div key={t} style={{ fontSize: 13, lineHeight: 1.65, padding: "4px 0", paddingLeft: 16, position: "relative", color: "#a8c4cc" }}>
            <span style={{ position: "absolute", left: 0, color: G.good, fontWeight: 700 }}>✓</span>{t}
          </div>
        ))}
      </Card>
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: G.warn, marginBottom: 14, fontFamily: "'Space Mono', monospace" }}>Approach With Caution</div>
        {["Complete non-coders with no JS/Node familiarity", "Users who want point-and-click visual editing", "Teams needing polished Figma-to-code workflow", "High-traffic production without DevOps review", "Regulated industries without developer oversight", "Projects needing built-in CMS or content tooling"].map(t => (
          <div key={t} style={{ fontSize: 13, lineHeight: 1.65, padding: "4px 0", paddingLeft: 16, position: "relative", color: "#a8c4cc" }}>
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
    { icon: "⚡", title: "WebContainers Runtime", tier: "All plans", detail: "The core differentiator. A full Node.js environment running inside WebAssembly in your browser. No cloud VM, no cold starts, no waiting. npm installs resolve in seconds. This isn't a simulation — it's a real runtime that can run Vite, Express, Astro, or any Node-compatible stack." },
    { icon: "🧠", title: "Full-Codebase AI Context", tier: "All plans", detail: "Unlike chat-based tools that see one file at a time, bolt.new's AI has access to the entire project tree simultaneously. It can refactor across components, update type definitions, and maintain consistency — making multi-file changes feel coherent rather than patched." },
    { icon: "🖥️", title: "Real In-Browser Terminal", tier: "All plans", detail: "A proper bash-like terminal that runs inside WebContainers. Run npm scripts, install packages, execute node scripts, or tail logs. Non-coders may not use this, but developers will find it indispensable for debugging and fine-tuning the AI's work." },
    { icon: "📦", title: "Full NPM Ecosystem", tier: "All plans", detail: "Access to over 1.4 billion npm packages directly in the browser. Want to add Zod for validation, Drizzle ORM, or a specific date library? Just describe it or type it in the terminal. The full ecosystem is available without setup." },
    { icon: "🔗", title: "GitHub Export", tier: "All plans", detail: "Push your project to GitHub or download it as a zip at any time. All code is standard — React, Vue, Svelte, Astro, or plain JS. No proprietary markup. The export is a real project you can run locally or deploy anywhere." },
    { icon: "🔄", title: "Instant Hot Reload", tier: "All plans", detail: "WebContainers enables native hot module replacement. Code changes — whether made by you or the AI — reflect in the preview instantly. No deploy step, no manual refresh. This makes iterating with AI dramatically faster than cloud-based alternatives." },
    { icon: "🎯", title: "Framework Agnostic", tier: "All plans", detail: "Works with React, Vue, Svelte, Astro, SolidJS, Vanilla JS, Node.js APIs, and more. You can specify the framework in your first prompt or let the AI choose based on the project type. No lock-in to a single frontend library." },
    { icon: "💰", title: "Transparent Token Usage", tier: "All plans", detail: "Bolt.new shows how many AI tokens each action consumes — a rare and valued feature among power users. Lets you understand and optimize your prompting strategy. Credit costs are more predictable than competitors like Lovable." },
    { icon: "🌐", title: "Custom Domain Deployment", tier: "Paid plans", detail: "Deploy to a custom domain directly from bolt.new on paid tiers. The platform handles the hosting infrastructure. Not designed for high-traffic production workloads — use it for MVPs, demos, internal tools, and client prototypes." },
    { icon: "🔐", title: "Environment Variables", tier: "All plans", detail: "Proper .env support built into the IDE. API keys are stored as environment variables, not hardcoded into source. The AI is instructed to reference process.env rather than paste keys inline — a meaningful baseline security practice." },
    { icon: "🤝", title: "Supabase Integration", tier: "All plans", detail: "One-click Supabase connect for auth, database, and storage. Less hand-holding than Lovable's integration — bolt.new sets up the client but expects you to understand the basics of what you're building. RLS policies require manual review." },
    { icon: "📡", title: "API-First Backend", tier: "All plans", detail: "Native support for building Express, Hono, or other Node.js backends. Unlike frontend-only tools, you can build actual server logic, API routes, webhooks, and background processing — all running in WebContainers." },
  ];

  return (
    <div>
      <SectionHead eyebrow="Platform Features" title="Everything Bolt.new Can Do" sub="A complete breakdown of every significant feature — what it actually does in practice, not just what the marketing page says." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
        {features.map(f => (
          <Card key={f.title}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{f.icon}</span>
              <Badge variant={f.tier === "Paid plans" ? "accent" : "neutral"}>{f.tier}</Badge>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: G.text, fontFamily: "'Syne', sans-serif" }}>{f.title}</h3>
            <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.65 }}>{f.detail}</p>
          </Card>
        ))}
      </div>

      <Divider />
      <SectionHead eyebrow="What It Builds Best" title="Ideal Project Types" />
      <Alert type="good" title="Strong Fit">
        Full-stack web apps with Node.js backends. REST or tRPC APIs. React/Vue/Svelte frontends with complex state. CLI tools and scripts. Internal dashboards consuming third-party APIs. Prototypes that need real npm dependencies (not just CDN scripts). Projects where a developer will eventually own the codebase.
      </Alert>
      <Alert type="warn" title="Not the Right Tool">
        Marketing sites where you need a visual page builder and don't want to touch code. Mobile apps (bolt.new is web-only). Projects requiring Figma design import. Purely content-driven sites where you want built-in CMS tooling. Teams with zero JavaScript familiarity who want guardrails.
      </Alert>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: WEBCONTAINERS
═══════════════════════════════════════════════════════════ */
const PageWebcontainers = () => (
  <div>
    <SectionHead eyebrow="Core Technology" title="WebContainers Explained" sub="The reason bolt.new feels fundamentally different from every other AI builder — and why it matters." />

    <div style={{ background: "#060a10", border: `1px solid ${G.accent}22`, borderRadius: 10, padding: "28px 32px", marginBottom: 36 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.accent, marginBottom: 12, fontFamily: "'Space Mono', monospace" }}>How it works</div>
      <p style={{ color: G.text, fontSize: 15, lineHeight: 1.7 }}>
        WebContainers is a browser-native runtime built on <strong style={{ color: G.accent }}>WebAssembly + modern browser APIs</strong>. It boots a real Node.js environment in milliseconds — no cloud VM, no Docker container, no network latency between your code and the preview. Your entire dev stack lives in a single browser tab.
      </p>
    </div>

    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
      <StatPill num="<1s" label="Average environment boot time" />
      <StatPill num="WASM" label="Node.js compiled to WebAssembly" />
      <StatPill num="1.4B+" label="Compatible NPM packages" />
      <StatPill num="0" label="Server-side dependencies for the runtime" />
    </div>

    <SectionHead eyebrow="Technical Deep Dive" title="What This Means In Practice" />

    {[
      { title: "No Cold Starts", body: "Cloud-based builders like Replit or legacy StackBlitz cloud spin up a remote VM when you open a project. That takes 5-30 seconds. WebContainers bootstraps in under a second because there's no network round-trip. The environment is already inside your browser before you type your first prompt." },
      { title: "Real npm, Not Polyfills", body: "This isn't a mock npm. When you run `npm install react-query`, it resolves the real package from the registry, installs it into a virtual file system, and makes it importable. Tree-shaking, peer dependencies, and version resolution all work as expected. The 1.4 billion package figure isn't marketing — it's the actual npm registry." },
      { title: "Native File System API", body: "WebContainers uses the browser's Origin Private File System (OPFS) for storage. Files persist across page refreshes. You get real read/write operations, not in-memory simulation. The AI's code changes write to this file system — that's why edits appear instantly without a deploy step." },
      { title: "Security Model", body: "Because WebContainers runs in a sandboxed iframe, it inherits the browser's security model. Code running in WebContainers cannot access your local file system, cannot make arbitrary network requests outside the browser's CORS rules, and is isolated from other tabs. This is a meaningful security advantage over cloud VMs for certain threat models — and a limitation for others (no raw TCP sockets, limited system calls)." },
      { title: "Limitations to Know", body: "WebContainers cannot run native binaries (no C extensions, no Python C-extensions), has limited support for fork/spawn subprocess calls, and cannot access raw TCP sockets (so PostgreSQL drivers that use direct TCP won't work — use Supabase's HTTPS client instead). Server-sent events and WebSocket servers work. Most Node.js web stacks work without modification." },
    ].map((item, i) => (
      <div key={item.title} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, borderRadius: 4, border: `1px solid ${G.accent}44`, color: G.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0, fontFamily: "'Space Mono', monospace" }}>{i + 1}</div>
        <Card style={{ padding: "16px 20px" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: G.text, fontFamily: "'Syne', sans-serif" }}>{item.title}</h4>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.65, margin: 0 }}>{item.body}</p>
        </Card>
      </div>
    ))}

    <Divider />
    <Alert type="info" title="Why This Matters for AI Coding">
      Most AI builders have a feedback loop: write code → push to cloud → wait for deploy → test → repeat. WebContainers collapses this to: write code → see result (instantly). When iterating with AI, you might make 20-50 changes to get something right. The time savings compound. This is the single biggest reason bolt.new feels faster to iterate in, even when the AI output quality is similar to competitors.
    </Alert>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: INTEGRATIONS
═══════════════════════════════════════════════════════════ */
const PageIntegrations = () => {
  const integrations = [
    { name: "Supabase", tier: "All plans", status: "Official", body: "One-click auth, database, storage, and edge functions. The recommended backend for most bolt.new projects. RLS policies are generated but must be reviewed before production." },
    { name: "Netlify", tier: "All plans", status: "Official", body: "Deploy directly from bolt.new to Netlify with one click. Supports custom domains, environment variable sync, and automatic deployments on future changes." },
    { name: "Vercel", tier: "All plans", status: "Community", body: "Deploy to Vercel by exporting to GitHub and connecting via Vercel's GitHub integration. Not a one-click native integration, but works cleanly for Next.js projects." },
    { name: "Cloudflare Workers", tier: "All plans", status: "Supported", body: "Generate edge functions with Hono or Cloudflare's Workers runtime. Bolt.new can scaffold a full Cloudflare Workers project from a prompt." },
    { name: "Stripe", tier: "All plans", status: "Supported", body: "Payment integration via prompt — bolt.new will scaffold checkout sessions, webhooks, and customer management. Always audit generated webhook handlers before taking real payments." },
    { name: "OpenAI / Anthropic APIs", tier: "All plans", status: "Supported", body: "Build AI-powered apps on top of major model providers. Bolt.new will generate proper streaming implementations and handle API key management via env vars." },
    { name: "Prisma + PlanetScale", tier: "All plans", status: "Supported", body: "ORM-based database patterns work well in bolt.new. Prisma schema generation, migrations, and seeding are all within the AI's capabilities. Use HTTPS-based DB connections for WebContainers compatibility." },
    { name: "Figma", tier: "Not available", status: "Not available", body: "No native Figma import. This is one of bolt.new's meaningful gaps versus Lovable. You can paste CSS from Figma Inspect, but there's no automated design-to-code flow." },
  ];

  return (
    <div>
      <SectionHead eyebrow="Integrations" title="The Ecosystem" sub="What connects to bolt.new natively, and what requires manual setup." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 36 }}>
        {integrations.map(intg => (
          <Card key={intg.name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: G.text, fontFamily: "'Syne', sans-serif" }}>{intg.name}</h3>
              <Badge variant={intg.status === "Not available" ? "critical" : intg.status === "Official" ? "good" : "neutral"}>{intg.status}</Badge>
            </div>
            <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.65, margin: 0 }}>{intg.body}</p>
          </Card>
        ))}
      </div>

      <Divider />
      <SectionHead eyebrow="Deployment" title="Where Your Apps Live" />
      <Alert type="info" title="Bolt.new Hosting vs Your Own">
        Bolt.new provides hosting on their infrastructure for rapid sharing and demos. For production, most serious users export to GitHub and deploy via Netlify, Vercel, or Cloudflare Pages. The bolt.new hosted URL is fine for MVPs and client prototypes — it's not designed for high-traffic workloads.
      </Alert>

      <Card style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: G.muted, marginBottom: 16, fontFamily: "'Space Mono', monospace" }}>Deployment Paths</div>
        {[
          { path: "Bolt.new hosting", best: "Demos & client previews", notes: "Built-in, instant, shareable URL" },
          { path: "Netlify (native)", best: "Most web apps", notes: "One-click, custom domain, CDN" },
          { path: "Vercel (via GitHub)", best: "Next.js / React", notes: "Best DX for Node edge functions" },
          { path: "Cloudflare Pages", best: "Global performance", notes: "Edge-native, best for static + Workers" },
          { path: "Self-hosted (VPS)", best: "Full control needed", notes: "Export repo, deploy manually" },
        ].map((r, i) => (
          <div key={r.path} style={{ display: "grid", gridTemplateColumns: "1fr auto 160px", gap: 16, padding: "11px 0", borderBottom: i < 4 ? `1px solid ${G.border}` : "none", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: G.text, fontFamily: "'Space Mono', monospace" }}>{r.path}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: G.accent, whiteSpace: "nowrap" }}>{r.best}</span>
            <span style={{ fontSize: 11, color: G.muted }}>{r.notes}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: PRICING
═══════════════════════════════════════════════════════════ */
const PagePricing = () => {
  const plans = [
    { name: "Free", price: "$0", period: "forever", tokens: "~150K tokens/mo", highlight: false, features: ["Unlimited public projects", "Limited daily AI tokens", "WebContainers runtime", "GitHub export", "Community support", "Bolt.new subdomain", "No custom domain", "No private projects"] },
    { name: "Basic", price: "$10", period: "/mo", tokens: "~1M tokens/mo", highlight: false, features: ["Everything in Free", "Private projects", "Custom domain", "Priority rendering", "10M tokens/month"] },
    { name: "Pro", price: "$20", period: "/mo", tokens: "~5M tokens/mo", highlight: true, features: ["Everything in Basic", "Substantially more tokens", "Faster AI responses", "Badge removal", "Advanced deployment", "Priority support queue"] },
    { name: "Teams", price: "$30+", period: "/mo/user", tokens: "Pooled token budget", highlight: false, features: ["Everything in Pro", "Shared workspace", "Admin controls", "Pooled token limits", "Team billing", "Audit logs (planned)"] },
  ];

  return (
    <div>
      <SectionHead eyebrow="Pricing" title="Plans, Token Costs & Real Value" sub="Bolt.new's token-based pricing is more transparent than competitors — but still complex once you're building actively." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 36, alignItems: "start" }}>
        {plans.map(p => (
          <div key={p.name} style={{
            background: p.highlight ? "#060a10" : G.card,
            border: `2px solid ${p.highlight ? G.accent : G.border}`,
            borderRadius: 8, padding: "22px 20px",
            position: "relative",
          }}>
            {p.highlight && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: G.accent, color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 12px", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>Most Popular</div>}
            <div style={{ fontSize: 12, fontWeight: 700, color: G.muted, marginBottom: 4, fontFamily: "'Space Mono', monospace" }}>{p.name}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: p.highlight ? G.accent : G.text, lineHeight: 1, fontFamily: "'Syne', sans-serif" }}>{p.price}</div>
            <div style={{ fontSize: 11, color: G.muted, marginBottom: 14 }}>{p.period}</div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: G.good, marginBottom: 12, fontFamily: "'Space Mono', monospace" }}>{p.tokens}</div>
            {p.features.map(f => (
              <div key={f} style={{ fontSize: 12, padding: "3px 0", color: "#a8c4cc", paddingLeft: 14, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: G.accent }}>›</span>{f}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Alert type="warn" title="Token Burn Rate — Read This Before Upgrading">
        Tokens are consumed per AI action, not per message. A complex "build me a CRM" prompt consumes 20-40k tokens. Refactoring a multi-file component: 10-25k. A simple styling fix: 2-5k. On the free plan (~150K/mo) you'll exhaust your budget in 3-7 active days. The Basic plan at $10 is the minimum viable tier for any serious project. Token counting being visible is the good news — at least you know where your budget is going.
      </Alert>

      <Alert type="info" title="Bolt.new vs Lovable Pricing">
        Lovable's credit system is less transparent but their Pro tier (~$42/mo) offers more sustained output for heavy users. Bolt.new's token model is more honest about costs but can feel expensive for iterative UI work that requires many small changes. For developer-speed workflows (fewer but larger changes), bolt.new pricing is competitive. For design-iteration workflows (many small visual tweaks), Lovable's credits may go further.
      </Alert>

      <Divider />
      <SectionHead eyebrow="Token Usage Guide" title="How Fast Will You Burn Tokens?" />
      <Card>
        {[
          { action: "Generate full-stack app from scratch", cost: "30–60K tokens", note: "Varies by complexity" },
          { action: "Add a new page/route", cost: "8–15K tokens", note: "Including nav updates" },
          { action: "Fix a specific bug", cost: "3–8K tokens", note: "Clear prompt = lower cost" },
          { action: "Refactor component styling", cost: "5–12K tokens", note: "Multi-file if shared styles" },
          { action: "Add auth + DB schema", cost: "15–30K tokens", note: "Full Supabase scaffold" },
          { action: "Major architecture refactor", cost: "25–60K tokens", note: "Full codebase context used" },
          { action: "Debug complex async issue", cost: "10–25K tokens", note: "May need multiple rounds" },
        ].map((r, i) => (
          <div key={r.action} style={{ display: "grid", gridTemplateColumns: "1fr auto 160px", gap: 16, padding: "12px 0", borderBottom: i < 6 ? `1px solid ${G.border}` : "none", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: G.text }}>{r.action}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: G.accent, whiteSpace: "nowrap", fontFamily: "'Space Mono', monospace" }}>{r.cost}</span>
            <span style={{ fontSize: 11, color: G.muted }}>{r.note}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: COMPARISONS
═══════════════════════════════════════════════════════════ */
const PageComparisons = () => {
  const competitors = [
    {
      name: "Lovable",
      desc: "The closest direct competitor. Lovable has a more polished visual editor and native Figma import. Bolt.new has a more powerful runtime, better token transparency, and stronger appeal to technical users.",
      vs: [["Visual editor", false, true], ["Figma import", false, true], ["Token transparency", true, false], ["Real Node.js runtime", true, false], ["GitHub export", true, true], ["Free tier", true, true]],
    },
    {
      name: "v0 by Vercel",
      desc: "v0 is laser-focused on React UI components. It's the best tool in the world for polished individual components. But it's not a full app builder — no backend, no routing, no auth. Bolt.new is the full-stack evolution.",
      vs: [["Full-stack generation", true, false], ["UI component quality", "Good", "Best-in-class"], ["Backend / DB", true, false], ["Auth built-in", true, false], ["Custom domains", true, false], ["Free tier", true, true]],
    },
    {
      name: "Cursor",
      desc: "Cursor is an AI-powered code editor for developers who write code. It gives maximum control but requires coding ability. Bolt.new is the AI-first product that fills the gap between Cursor (developer-grade) and Lovable (non-coder-grade).",
      vs: [["No coding required", "Partial", false], ["Code control", "Full", "Full"], ["Browser-native", true, false], ["Local dev setup needed", false, true], ["Free tier", true, false], ["Learning curve", "Low", "High"]],
    },
    {
      name: "Replit",
      desc: "Replit is the established cloud IDE with AI features bolted on. It runs in a cloud VM (not browser-native) which means slower boot times. Replit targets education and beginner coders; bolt.new targets developers who want speed.",
      vs: [["Browser-native runtime", true, false], ["AI-first design", true, false], ["Education focus", false, true], ["Multiplayer collaboration", true, true], ["Free tier", true, true], ["Boot time", "< 1s", "5–30s"]],
    },
  ];

  return (
    <div>
      <SectionHead eyebrow="vs The Competition" title="How Bolt.new Stacks Up" sub="Head-to-head against the main alternatives in 2026." />

      {competitors.map(c => (
        <div key={c.name} style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: G.text }}>Bolt.new vs {c.name}</h3>
          </div>
          <Prose>{c.desc}</Prose>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", background: "#060a10", color: G.text, fontSize: 11, fontWeight: 700, padding: "10px 20px", letterSpacing: "0.08em", fontFamily: "'Space Mono', monospace" }}>
              <span>Feature</span><span style={{ textAlign: "center", color: G.accent }}>Bolt.new</span><span style={{ textAlign: "center", color: G.muted }}>{c.name}</span>
            </div>
            {c.vs.map(([feat, bolt, comp], i) => (
              <div key={feat} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", padding: "11px 20px", borderBottom: i < c.vs.length - 1 ? `1px solid ${G.border}` : "none", fontSize: 13 }}>
                <span style={{ color: "#a8c4cc" }}>{feat}</span>
                <span style={{ textAlign: "center", color: bolt === true ? G.good : bolt === false ? G.warn : G.accent, fontWeight: 600 }}>{bolt === true ? "✓" : bolt === false ? "✗" : bolt}</span>
                <span style={{ textAlign: "center", color: comp === true ? G.good : comp === false ? G.warn : G.muted, fontWeight: 600 }}>{comp === true ? "✓" : comp === false ? "✗" : comp}</span>
              </div>
            ))}
          </Card>
        </div>
      ))}

      <Divider />
      <Alert type="neutral" title="Bottom Line on Competitors">
        Bolt.new wins on runtime power, npm ecosystem access, terminal access, and token cost transparency. It loses on visual editor quality (vs Lovable), polished UI component output (vs v0), and code control for experienced developers (vs Cursor). Choose bolt.new if you need a real Node.js stack and want AI to handle the boilerplate. Choose Lovable if you want a point-and-click visual editor and Figma import.
      </Alert>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: PROMPTS
═══════════════════════════════════════════════════════════ */
const PagePrompts = () => {
  const [activeCategory, setActiveCategory] = useState("Starter Apps");

  const library = {
    "Starter Apps": [
      { title: "Full-Stack SaaS Starter", prompt: "Build a SaaS starter with React + Vite frontend and a Hono backend API. Include: JWT-based auth (sign up, log in, log out), a protected dashboard route, a user profile page, a settings page with update profile form, and a public landing page. Use Supabase for the database. Tailwind CSS for styling. Clean, professional dark theme with a blue accent. Structure the project with separate /src/api and /src/pages directories." },
      { title: "REST API with Hono + Drizzle", prompt: "Build a REST API using Hono.js and Drizzle ORM. Implement a /users resource with full CRUD. Use Supabase Postgres as the database (connect via the HTTPS client, not raw TCP). Include input validation with Zod, proper error handling with typed error responses, and a simple middleware for request logging. Generate OpenAPI-compatible route comments. Expose the API on port 3000." },
      { title: "Real-Time Kanban Board", prompt: "Create a Kanban board app with React. Three default columns: To Do, In Progress, Done. Cards can be created, edited, deleted, and dragged between columns. Use @dnd-kit for drag-and-drop. Store board state in Supabase with real-time subscriptions so multiple users see updates live. Auth via Supabase — each user has their own board. Clean, minimal dark UI." },
      { title: "AI Chatbot with Streaming", prompt: "Build a chat interface that streams responses from the Anthropic API (claude-sonnet-4-20250514). React frontend with a message thread, input box, and streaming token-by-token rendering. Handle loading states, error states, and retry on failure. Support conversation history (send the full thread with each request). Store conversations in localStorage. Use environment variables for the API key. Clean, messaging-app style UI." },
    ],
    "APIs & Backends": [
      { title: "Webhook Handler", prompt: "Build a Hono.js webhook receiver for Stripe events. Handle: checkout.session.completed (provision access), customer.subscription.updated (update plan), customer.subscription.deleted (revoke access). Verify the Stripe-Signature header on every request. Write events to a Supabase webhook_events table with status (pending, processed, failed). Include a /webhooks/status endpoint for health checks. Proper error boundaries so a failed handler doesn't crash the server." },
      { title: "File Upload API", prompt: "Build a file upload API with Express. Accept multipart/form-data uploads up to 10MB. Validate file type (allow only image/jpeg, image/png, application/pdf). Generate a unique filename with nanoid, upload to Supabase Storage, and return the public URL. Include rate limiting (10 uploads per IP per hour using a simple in-memory store). Return structured JSON responses for both success and error cases." },
      { title: "Cron Job + Email Digest", prompt: "Build a daily email digest system. A Node.js cron job (node-cron) runs at 8am UTC. It queries Supabase for all items created in the past 24 hours grouped by category. For each user with email_digest=true in their settings, it generates an HTML email summary and sends it via the Resend API. Track sends in a digest_sends table to avoid duplicates. Console.log all activity for debugging." },
    ],
    "UI Components": [
      { title: "Data Table with Sorting & Filters", prompt: "Build a reusable DataTable React component using TanStack Table. Features: column sorting (click header to sort asc/desc), global search filter, per-column filters, pagination (10/25/50 rows), row selection with checkboxes, and an action column with edit/delete buttons. Accept data and column definitions as props. Export selected rows as CSV. Tailwind styling, dark theme, compact density." },
      { title: "Auth Flow (Sign Up / Login)", prompt: "Build a complete authentication UI with React and Supabase. Pages: Sign Up (email + password + confirm password + terms checkbox), Log In (email + password + forgot password link), Forgot Password (email input → sends reset link), Reset Password (new password form, accessible from email link), and Email Verification pending screen. Full form validation with react-hook-form and Zod. Proper error messages, loading states, and redirect after auth." },
      { title: "Command Palette", prompt: "Build a cmd+K command palette component for React. Opens on Cmd+K (or Ctrl+K on Windows), shows a modal with a search input, and filters a list of commands as you type using fuzzy search (fuse.js). Commands have: an icon, label, description, and keyboard shortcut hint. Support command groups (Navigation, Actions, Settings). Execute the command on Enter or click. Close on Escape or outside click. Keyboard navigation with arrow keys. Framer Motion animations." },
    ],
    "Full Projects": [
      { title: "Link Shortener", prompt: "Build a link shortener similar to bit.ly. Backend: Hono.js API with two endpoints — POST /links (create short link, store in Supabase, return short code) and GET /:code (redirect to original URL, log click event with timestamp and user agent). Frontend: a single page with an input for the long URL, shows the short URL on submit with a copy button, and a table of the user's recent links with click counts. No auth required — links are anonymous. Use nanoid for short codes." },
      { title: "Invoice Generator", prompt: "Build an invoice generator app. User fills in: company details (name, address, logo upload), client details (name, email, address), line items (description, quantity, unit price — add/remove rows dynamically), payment terms (due date, accepted methods), and notes. Calculate subtotal, tax (configurable %), and total automatically. Generate a print-ready PDF using @react-pdf/renderer. Save invoice history in Supabase. Allow editing and re-downloading past invoices. Professional, clean design." },
    ],
  };

  const categories = Object.keys(library);

  return (
    <div>
      <SectionHead eyebrow="Prompt Library" title="Proven Bolt.new Prompts" sub="Tested prompts that produce quality output — with enough specificity to avoid the most common AI mistakes." />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "7px 16px", border: `1px solid ${activeCategory === cat ? G.accent : G.border}`,
            borderRadius: 4, background: activeCategory === cat ? "#001a22" : "transparent",
            color: activeCategory === cat ? G.accent : G.muted,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em",
          }}>{cat}</button>
        ))}
      </div>

      {library[activeCategory].map(item => (
        <div key={item.title} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: G.text, fontFamily: "'Syne', sans-serif" }}>{item.title}</div>
          <PromptBlock text={item.prompt} />
        </div>
      ))}

      <Divider />
      <Alert type="info" title="Prompting Tips for Bolt.new">
        Be specific about your tech stack in the first prompt — bolt.new will default to React + Vite unless told otherwise. Mention the exact npm packages you want used. Request error handling explicitly ("include proper error states and loading indicators"). For API projects, ask for typed responses. Bolt.new handles multi-file refactors well — you can say "reorganize this into feature-based folders" and it will get most of it right in one pass.
      </Alert>
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
      title: "Your First Full-Stack App in 20 Minutes",
      level: "Beginner",
      time: "20 min",
      steps: [
        { title: "Write a complete first prompt", body: "Don't start with 'build me an app.' Start with the full spec: 'Build a task manager with React + Vite. Features: add tasks with a title and optional due date, mark tasks complete, delete tasks, filter by All/Active/Completed. Use Tailwind CSS with a dark theme. Store tasks in Supabase — create a tasks table with id, title, due_date, completed, created_at. Include Supabase auth so each user sees only their own tasks. Deploy-ready.' The more specific the first prompt, the less iteration you need." },
        { title: "Review the generated structure", body: "Before clicking around in the preview, look at the file tree on the left. You should see /src/components, /src/lib (Supabase client), /src/pages or /src/App.tsx, and a .env.example. If the structure looks odd (everything in one file, no component separation), prompt: 'Reorganize this into proper React components — one file per component in /src/components, and a /src/lib/supabase.ts file for the client.' Getting the architecture right early saves refactoring later." },
        { title: "Connect Supabase", body: "Click the Supabase icon in the bolt.new sidebar (or prompt 'Connect Supabase'). Authorize with your Supabase account. Bolt.new will read your project list and let you select one. It will automatically populate your .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. If you see a yellow warning that RLS is disabled on your tasks table, prompt: 'Enable RLS on the tasks table. Each user should only be able to read, insert, update, and delete their own tasks. Create the Supabase RLS policies.'" },
        { title: "Test the auth flow manually", body: "In the preview pane, sign up with a test email. Verify the sign-up confirmation flow. Sign in. Create some tasks. Open a second incognito window and sign in as a different user — verify they cannot see the first user's tasks. This manual cross-account test is the most important security check you can do before sharing the app. If data leaks between accounts, your RLS is not configured correctly — go back to the prompts." },
        { title: "Export and share", body: "Click the GitHub icon → push to new repository. Name it something meaningful. Once pushed, click the Netlify deployment button to deploy to a custom subdomain. Share the Netlify URL for feedback. If you want a custom domain, go to Netlify's domain settings and follow their DNS setup instructions — this is done outside bolt.new." },
      ],
    },
    {
      title: "Building a Real API with Hono + Supabase",
      level: "Intermediate",
      time: "45 min",
      steps: [
        { title: "Specify the full API contract upfront", body: "Before building, define your endpoints. Write them out in your prompt: resource name, HTTP method, request body shape, response shape, and auth requirement. Example: 'Build a REST API with Hono.js. Endpoints: POST /api/users/register (body: {email, password, name}, response: {user, token}), POST /api/users/login (body: {email, password}, response: {user, token}), GET /api/users/me (requires Bearer token, response: {user}). Use Supabase for the database and Supabase JWT for token verification.' Bolt.new does better when it knows the full contract, not just the resource name." },
        { title: "Validate inputs with Zod", body: "After initial generation, if Zod schemas are missing, prompt: 'Add Zod schemas for all request body types. Validate incoming requests at the route handler level and return a 400 with the validation errors in a structured format: {error: \"Validation failed\", details: [{field, message}]}.' Input validation is the difference between an API that works and one that crashes in production." },
        { title: "Add proper error handling", body: "Prompt: 'Add a global error handler middleware for Hono. Catch all unhandled errors and return a structured JSON response: {error: string, code: string, timestamp: ISO string}. Map Supabase error codes to appropriate HTTP status codes (23505 unique violation → 409 Conflict, PGRST116 not found → 404). Log all 5xx errors with the full stack trace.' Without this, API debugging in production is painful." },
        { title: "Test with the in-browser terminal", body: "Use bolt.new's terminal to curl your own API: 'curl -X POST http://localhost:3000/api/users/register -H \"Content-Type: application/json\" -d \"{\\\"email\\\": \\\"test@test.com\\\", \\\"password\\\": \\\"password123\\\", \\\"name\\\": \\\"Test User\\\"}\". Test the happy path, test with invalid input, test with missing fields. If the curl commands feel complex, prompt bolt.new: \"Write curl commands to test all the API endpoints I can paste into the terminal.\" It will generate them for you." },
        { title: "Document and export", body: "Prompt: 'Add JSDoc comments to all route handlers documenting the request/response format. Generate a README.md with: setup instructions, environment variables needed, all available endpoints with example requests/responses, and local development commands.' Export to GitHub, add a CONTRIBUTING.md if others will work on it, and set up a Netlify or Cloudflare Workers deployment for the production API." },
      ],
    },
    {
      title: "Migrating a Bolt.new Project to Production",
      level: "Advanced",
      time: "60 min",
      steps: [
        { title: "Security audit before anything else", body: "Export your project to GitHub. Clone it locally. Run: npx semgrep --config=auto . to catch common security patterns. Run: npm audit to check for vulnerable dependencies. Look specifically for: hardcoded API keys or secrets anywhere in the code (even in comments), eval() calls, SQL string concatenation instead of parameterized queries, any auth middleware that might be bypassed, and Supabase anon key usage on the server side (should be service role key, stored securely)." },
        { title: "Audit all Supabase RLS policies", body: "In your Supabase dashboard, go to Authentication → Policies. For every table, verify: the policy exists, it references auth.uid() correctly, it's applied to all four operations (SELECT, INSERT, UPDATE, DELETE), and there are no overly permissive policies like 'using (true)'. Test each policy by creating two test accounts and attempting cross-account data access via the Supabase client in your browser console." },
        { title: "Replace bolt.new hosting with production infrastructure", body: "Bolt.new's hosting is not production infrastructure. For a real launch: use Vercel or Netlify for the frontend (they handle CDN, SSL, and scaling automatically), use Supabase's hosted database (it's already production-grade), and add Cloudflare in front of everything for DDoS protection and caching. Set up environment variable groups in your deployment platform so production, staging, and local all use separate Supabase projects." },
        { title: "Set up monitoring and error tracking", body: "Add Sentry for frontend error tracking (free tier covers most early-stage apps). Set up Supabase's built-in query performance monitoring. Use Vercel or Netlify's access logs to identify 4xx/5xx patterns after launch. Configure uptime monitoring with a service like Better Uptime or UptimeRobot — both have free tiers. Without monitoring, you won't know your app is broken until a user tells you." },
        { title: "Load test before launch", body: "Use k6 (free, open source) to simulate concurrent users before launch. Even a simple test — 50 virtual users, 30-second ramp-up, running for 2 minutes — will expose N+1 query issues, unindexed table scans, and memory leaks that weren't visible with a single user. Prompt bolt.new or Claude to help generate the k6 test script based on your app's main user flows." },
      ],
    },
  ];

  const activeTut = tutorials[activeTutorial];

  return (
    <div>
      <SectionHead eyebrow="Tutorials" title="Step-by-Step Guides" sub="Real workflows from first prompt to production-grade deployment." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
        {tutorials.map((t, i) => (
          <button key={t.title} onClick={() => setActiveTutorial(i)} style={{
            background: activeTutorial === i ? "#001a22" : G.card,
            border: `2px solid ${activeTutorial === i ? G.accent : G.border}`,
            borderRadius: 8, padding: "16px 16px", textAlign: "left",
            cursor: "pointer", transition: "all 0.15s",
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: activeTutorial === i ? G.accent : G.muted, marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>
              {t.level} · {t.time}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: activeTutorial === i ? G.accent : G.text, lineHeight: 1.4, fontFamily: "'Syne', sans-serif" }}>{t.title}</div>
          </button>
        ))}
      </div>

      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: "32px 36px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24 }}>
          <Badge variant="accent">{activeTut.level}</Badge>
          <Badge>⏱ {activeTut.time}</Badge>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28, letterSpacing: "-0.02em", fontFamily: "'Syne', sans-serif", color: G.text }}>{activeTut.title}</h2>

        {activeTut.steps.map((step, i) => (
          <div key={step.title} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 20, marginBottom: 28 }}>
            <div style={{ width: 36, height: 36, borderRadius: 4, border: `1px solid ${G.accent}55`, color: G.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0, fontFamily: "'Space Mono', monospace" }}>{i + 1}</div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: G.text, fontFamily: "'Syne', sans-serif" }}>{step.title}</h4>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#a8c4cc" }}>{step.body}</p>
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
    { label: "Ease of Use", score: 7.8 },
    { label: "App Quality", score: 8.4 },
    { label: "Runtime Performance", score: 8.8 },
    { label: "Token Transparency", score: 8.5 },
    { label: "Security Posture", score: 7.6 },
    { label: "Value for Money", score: 7.9 },
    { label: "Documentation", score: 7.2 },
    { label: "Competitor Position", score: 8.6 },
  ];
  const overall = (scores.reduce((a, s) => a + s.score, 0) / scores.length).toFixed(1);

  return (
    <div>
      <SectionHead eyebrow="Final Verdict" title="Our Definitive Take on Bolt.new 2026" sub="After testing every feature, running hundreds of prompts, and building real projects — here's the complete picture." />

      {/* The big verdict */}
      <div style={{ background: "#060a10", border: `1px solid ${G.accent}33`, borderRadius: 12, padding: "40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: G.accent, opacity: 0.05 }} />
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: G.accent, lineHeight: 1, fontFamily: "'Space Mono', monospace" }}>{overall}</div>
            <div style={{ fontSize: 11, color: G.muted, marginTop: 4, fontFamily: "'Space Mono', monospace" }}>out of 10</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.accent, marginTop: 8, fontFamily: "'Space Mono', monospace" }}>Overall Score</div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ color: G.text, fontSize: 16, lineHeight: 1.75 }}>
              Bolt.new is the most technically impressive AI builder available in 2026. The WebContainers runtime is a genuine technological leap — running a real Node.js stack in a browser tab with zero cold starts changes the iteration speed in ways you have to experience to believe.
            </p>
            <p style={{ color: G.muted, fontSize: 14, lineHeight: 1.7, marginTop: 14 }}>
              The tradeoff is accessibility. This is a tool for people who understand what npm, environment variables, and a REST API are — even if they can't write them from scratch. The AI handles the implementation, but you need enough technical literacy to review the output and know when something looks wrong. If that's you, it's the best tool in the category.
            </p>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <Card style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: G.muted, marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>Category Breakdown</div>
        {scores.map(s => <ScoreBar key={s.label} label={s.label} score={s.score} />)}
      </Card>

      {/* Verdict grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: G.good, marginBottom: 16, fontFamily: "'Space Mono', monospace" }}>✓ Where It Wins</div>
          {["WebContainers is a genuine technological advantage", "Real Node.js stack — not simulated, not limited", "Full npm ecosystem in the browser with no setup", "Transparent token usage lets you optimize prompts", "Full-codebase AI context makes large refactors work", "In-browser terminal for real debugging", "Framework agnostic — React, Vue, Astro, Hono, all work"].map(t => (
            <div key={t} style={{ fontSize: 12, lineHeight: 1.65, padding: "4px 0 4px 14px", position: "relative", color: "#a8c4cc" }}>
              <span style={{ position: "absolute", left: 0, color: G.good }}>›</span>{t}
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: G.warn, marginBottom: 16, fontFamily: "'Space Mono', monospace" }}>✗ Where It Falls Short</div>
          {["No Figma import — a real gap for design-first teams", "No visual point-and-click editor like Lovable", "Free plan token limit is hit quickly in real projects", "Requires basic technical literacy to use effectively", "WebContainers has real limits (no native binaries, no raw TCP)", "Less polished default UI than Lovable's generations", "Smaller user community than Lovable for troubleshooting"].map(t => (
            <div key={t} style={{ fontSize: 12, lineHeight: 1.65, padding: "4px 0 4px 14px", position: "relative", color: "#a8c4cc" }}>
              <span style={{ position: "absolute", left: 0, color: G.warn }}>›</span>{t}
            </div>
          ))}
        </Card>
      </div>

      {/* Use case recommendations */}
      <SectionHead eyebrow="Who Should Use It" title="Our Specific Recommendations" />
      {[
        { persona: "Technical founder who can read code", rec: "This is your tool. You get the full npm ecosystem, real backend logic, and an AI that can execute multi-file architectural changes. The technical literacy floor is low enough that you don't need to write code — just understand what you're reviewing. Start on the free plan, hit the limit in a day or two, and upgrade to Basic or Pro.", verdict: "Strong Yes", badge: "good" },
        { persona: "Developer wanting AI pair programming", rec: "Bolt.new competes with Cursor for this use case. Bolt wins on browser-native convenience and zero setup — great for greenfield projects. Cursor wins when you need to work in an existing local codebase. Use bolt.new for net-new projects, Cursor for ongoing codebases. Many developers use both.", verdict: "Yes", badge: "good" },
        { persona: "Non-technical founder with zero JS knowledge", rec: "Lovable is probably a better fit. You'll get a visual editor, Figma import, and a more hand-holding experience. Bolt.new will confuse you when it generates a Node.js project structure and you don't know what to do with it. If you're willing to learn the basics — what a component is, what an API call is — bolt.new's power will become accessible within a few projects.", verdict: "Try Lovable First", badge: "warn" },
        { persona: "Agency prototyping client projects", rec: "Strong choice, especially for clients who have technical stakeholders. Upgrade to Pro for private projects. Note: there is no data training opt-out equivalent to Lovable's Business plan as of May 2026 — verify the current terms before building client work. Export to GitHub and do a security review before any client-facing launch.", verdict: "Yes, with caveats", badge: "warn" },
        { persona: "Enterprise evaluating AI coding tools", rec: "Promising, but not yet enterprise-complete. The WebContainers technology is sound. The missing pieces are: a formal security audit program, enterprise SSO, dedicated support tiers, and data privacy guarantees equivalent to what mature SaaS tools offer. Watch the roadmap — StackBlitz has the technical credibility to close these gaps.", verdict: "Evaluate Q3 2026", badge: "neutral" },
      ].map(r => (
        <div key={r.persona} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, background: G.card, border: `1px solid ${G.border}`, borderRadius: 8, padding: "18px 22px", marginBottom: 12, alignItems: "start" }}>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: G.text, fontFamily: "'Syne', sans-serif" }}>{r.persona}</h4>
            <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.65 }}>{r.rec}</p>
          </div>
          <Badge variant={r.badge}>{r.verdict}</Badge>
        </div>
      ))}

      <Divider />

      {/* CTA */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, background: "#060a10", border: `1px solid ${G.accent}33`, borderRadius: 10, padding: "28px 32px", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: G.text, fontFamily: "'Syne', sans-serif" }}>Ready to try Bolt.new?</h3>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>Start on the free plan — no credit card needed. Open a browser tab, describe what you want to build, and have a running app in minutes. Hit the token limit, then decide if it's worth upgrading.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a href="https://bolt.new" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 24px", background: G.accent, color: "#000", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "block", fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}>TRY BOLT.NEW FREE →</a>
          <button onClick={() => goTo("prompts")} style={{ padding: "10px 24px", background: "transparent", color: G.text, border: `1px solid ${G.border}`, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Browse Prompt Library</button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function BoltMicrosite() {
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
    webcontainers: <PageWebcontainers />,
    integrations: <PageIntegrations />,
    pricing: <PagePricing />,
    comparisons: <PageComparisons />,
    prompts: <PagePrompts />,
    tutorials: <PageTutorials />,
    verdict: <PageVerdict goTo={goTo} />,
  };

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", color: G.text, background: G.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${G.bg}; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${G.border}; } ::-webkit-scrollbar-thumb { background: ${G.accent}66; border-radius: 0; }
        button { font-family: 'Syne', sans-serif; }
        a { font-family: 'Syne', sans-serif; }
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
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: `${G.bg}ee`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${G.border}`, height: G.navH }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: "100%", display: "flex", alignItems: "center", gap: 16 }}>
          {/* Brand */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.muted, lineHeight: 1, fontFamily: "'Space Mono', monospace" }}>No-Code Reviewed</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: G.text, lineHeight: 1.2, fontFamily: "'Space Mono', monospace" }}>bolt.new <span style={{ color: G.accent }}>2026</span></div>
          </div>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: "flex", gap: 2, flex: 1, overflow: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => goTo(n.id)} style={{
                padding: "6px 12px", border: "none", borderRadius: 4,
                background: activePage === n.id ? G.accent : "transparent",
                color: activePage === n.id ? "#000" : G.muted,
                fontSize: 12, fontWeight: activePage === n.id ? 700 : 500,
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.12s",
                fontFamily: "'Space Mono', monospace", letterSpacing: "0.03em",
              }}>
                {n.label}
              </button>
            ))}
          </nav>

          {/* Mobile nav btn */}
          <button className="mobile-nav-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            marginLeft: "auto", background: "none", border: `1px solid ${G.border}`,
            borderRadius: 4, padding: "6px 12px", cursor: "pointer",
            fontSize: 12, fontWeight: 600, color: G.text, display: "none", alignItems: "center", gap: 6,
            fontFamily: "'Space Mono', monospace",
          }}>
            ☰ {activeLabel}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{ position: "fixed", top: G.navH, left: 0, right: 0, zIndex: 99, background: G.card, borderBottom: `1px solid ${G.border}`, padding: 12 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => goTo(n.id)} style={{
              display: "block", width: "100%", textAlign: "left", padding: "12px 16px",
              border: "none", borderRadius: 4, background: activePage === n.id ? "#001a22" : "transparent",
              color: activePage === n.id ? G.accent : G.text, fontSize: 13, fontWeight: activePage === n.id ? 700 : 500,
              cursor: "pointer", marginBottom: 2, fontFamily: "'Space Mono', monospace",
            }}>{n.label}</button>
          ))}
        </div>
      )}

      {/* Content */}
      <div ref={mainRef} style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 11, color: G.muted, marginBottom: 24, display: "flex", gap: 6, alignItems: "center", fontFamily: "'Space Mono', monospace" }}>
          <span style={{ cursor: "pointer" }} onClick={() => goTo("overview")}>bolt.new Review</span>
          {activePage !== "overview" && <>
            <span>›</span>
            <span style={{ color: G.accent, fontWeight: 700 }}>{activeLabel}</span>
          </>}
        </div>

        {pages[activePage]}

        {/* Page nav footer */}
        <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 32, marginTop: 48, display: "flex", justifyContent: "space-between", gap: 12 }}>
          {(() => {
            const idx = NAV.findIndex(n => n.id === activePage);
            const prev = idx > 0 ? NAV[idx - 1] : null;
            const next = idx < NAV.length - 1 ? NAV[idx + 1] : null;
            return (
              <>
                {prev ? (
                  <button onClick={() => goTo(prev.id)} style={{ padding: "10px 18px", background: G.card, border: `1px solid ${G.border}`, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", color: G.text, fontFamily: "'Space Mono', monospace" }}>
                    ← {prev.label}
                  </button>
                ) : <div />}
                {next && (
                  <button onClick={() => goTo(next.id)} style={{ padding: "10px 18px", background: G.accent, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#000", fontFamily: "'Space Mono', monospace" }}>
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
