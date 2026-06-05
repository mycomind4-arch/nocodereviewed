import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   LOVABLE — FULL REVIEW MICROSITE
   no-code-reviewed.lovable.app
   Design system: DM Sans, #e8541a accent, #0f0e0d text, #faf8f4 card
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

/* ─── Shared micro-components ─── */
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

const ScoreBar = ({ label, score, max = 10 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 38px", alignItems: "center", gap: 12, marginBottom: 14 }}>
    <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
    <div style={{ height: 6, background: G.border, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(score / max) * 100}%`, background: G.accent, borderRadius: 99 }} />
    </div>
    <span style={{ fontSize: 14, fontWeight: 700, textAlign: "right" }}>{score}</span>
  </div>
);

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

const StatPill = ({ num, label }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: "20px 22px", textAlign: "center", flex: "1 1 140px" }}>
    <div style={{ fontSize: 28, fontWeight: 800, color: G.accent, lineHeight: 1 }}>{num}</div>
    <div style={{ fontSize: 12, color: G.muted, marginTop: 6, lineHeight: 1.4 }}>{label}</div>
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

    {/* Key stats */}
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
      <StatPill num="$6.6B" label="Series B valuation, late 2025" />
      <StatPill num="8M+" label="Registered users in 2026" />
      <StatPill num="$200M+" label="Annual Recurring Revenue" />
      <StatPill num="$330M" label="Series B funding raised" />
      <StatPill num="60%" label="Of all new code projected AI-generated by end of 2026" />
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
    { icon: "⚡", title: "Prompt-to-App Generation", tier: "All plans", detail: "Type a description and Lovable builds pages, routes, components, and logic. The more specific your prompt, the more accurate the output. Works best for standard app patterns: dashboards, CRMs, booking tools, and marketplaces." },
    { icon: "🗄️", title: "Supabase Integration", tier: "All plans", detail: "Authentication, database, and file storage are wired automatically. Lovable creates tables, sets up auth flows, and writes RLS policies — though these policies need human review before going live with real users." },
    { icon: "🎨", title: "Visual Editor", tier: "All plans", detail: "Point-and-click editing on top of generated code. Unique in the category — most competitors are chat-only. Lets you adjust layouts, colors, and content without prompting." },
    { icon: "🔗", title: "Figma Import", tier: "All plans", detail: "Import your design mockup and Lovable attempts to match the layout and styles. Fidelity varies — complex components require follow-up prompts. Best for getting 80% of the way there quickly." },
    { icon: "💻", title: "GitHub Integration & Export", tier: "All plans", detail: "Full bidirectional GitHub sync. Your code is never trapped. Export the entire repo at any time. This is what separates Lovable from vendor-locked no-code tools." },
    { icon: "🤖", title: "Code Agent Mode", tier: "Paid plans", detail: "Unlocks direct code editing within the platform. The AI debugs and refactors across multiple files simultaneously, understanding the full codebase context rather than just the current file." },
    { icon: "🚀", title: "Lovable Cloud Hosting", tier: "All plans", detail: "Apps deploy to lovable.app subdomains automatically. Custom domain support on Starter and above. Infrastructure is managed — no server config needed. Not suitable for high-traffic production workloads." },
    { icon: "👥", title: "Collaboration", tier: "All plans", detail: "Free plan supports up to 20 collaborators on public projects. Paid plans unlock private project collaboration, per-user credit limits, and workspace management." },
    { icon: "🧠", title: "Persistent Context", tier: "All plans", detail: "The 2026 version maintains architectural memory across sessions — the AI remembers your design decisions, component names, and data models. A significant improvement over 2025 versions that would 'forget' structure after a few hours." },
    { icon: "🔐", title: "SSO & Data Training Opt-Out", tier: "Business+", detail: "Enterprise essentials: Single Sign-On for corporate environments, and opt-out from having your prompts and code used to train Lovable's AI. Critical for client work or proprietary systems." },
    { icon: "📐", title: "Design Templates", tier: "Business+", detail: "Reusable design system templates to standardize output across a team. Ensures consistent brand application when multiple people are building in the same workspace." },
    { icon: "🔑", title: "API Key Scanner", tier: "All plans", detail: "Automatically detects when API keys are exposed in generated code before you publish. First line of defense — but not a substitute for a full security review." },
  ];

  return (
    <div>
      <SectionHead eyebrow="Platform Features" title="Everything Lovable Can Do" sub="A complete breakdown of every significant feature — what it actually does in practice, not just what the marketing page says." />

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
      <Alert type="good" title="Strong Fit">
        CRUD applications (create, read, update, delete) are Lovable's sweet spot. CRMs, project trackers, dashboards, booking tools, waitlist apps, internal admin panels, SaaS landing pages with auth, and marketplaces all generate cleanly with minimal follow-up prompting.
      </Alert>
      <Alert type="warn" title="Weaker Territory">
        Complex business logic — multi-step conditional workflows, nuanced data transformations, real-time collaborative features — can still trip up the AI. Expect to spend meaningful credit iterating. Enterprise-grade security requirements are not met by default.
      </Alert>

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
      From a single prompt, Lovable autonomously generates route structure, all page components, database schema, auth configuration, API layer, styling system, and deployment. This is not scaffolding — it's a working app. The iteration loop is equally autonomous: describe a bug and Lovable finds the right files and fixes them without you specifying where to look.
    </Alert>

    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
      <StatPill num="1 prompt" label="To generate a complete full-stack app" />
      <StatPill num="Minutes" label="From prompt to live hosted URL" />
      <StatPill num="~2 credits" label="Typical cost of a full feature addition" />
      <StatPill num="5/day" label="Free plan daily credit limit" />
    </div>

    <SectionHead eyebrow="The Build Loop" title="How Lovable's Autonomy Works" />

    {[
      { step: "01", title: "Prompt Interpretation", body: "Lovable parses your natural language description and infers app type, data model, and required pages. It makes architectural decisions without asking — which is fast but means you need to be specific upfront. Vague prompts produce working but generic apps." },
      { step: "02", title: "Code Generation", body: "React components, routes, Supabase tables, auth flows, and Tailwind styles are generated simultaneously across multiple files. The 2026 version does this as a coherent whole — earlier versions sometimes generated components that didn't match each other's data contracts." },
      { step: "03", title: "Deployment", body: "The app is automatically built and deployed to a Lovable subdomain. No manual build step, no config. Every subsequent prompt triggers a new deploy." },
      { step: "04", title: "Iteration", body: "Subsequent prompts modify the existing app rather than regenerating from scratch. The AI maintains awareness of what exists. 'Add a notifications panel' adds to the existing nav — it doesn't rebuild the nav from scratch." },
      { step: "05", title: "Context Persistence (2026)", body: "Unlike earlier versions, the AI now remembers your design decisions, component names, and data model across sessions. This prevents the architectural drift that frustrated users in 2025, where a returned session might generate a conflicting component style." },
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
        { title: "Hallucination Rate", body: "91.5% of vibe-coded apps had at least one AI hallucination-related flaw in Q1 2026. Lovable is not immune — review generated logic before launch." },
      ].map(l => (
        <Card key={l.title}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: G.warn }}>⚠ {l.title}</h4>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{l.body}</p>
        </Card>
      ))}
    </div>

    <Alert type="info" title="MCP Integration: Extending Autonomy">
      Lovable supports Model Context Protocol (MCP) connections, which lets you wire external services directly into your app's AI context. Third-party tools like Frase.io, Supabase extensions, and custom API connectors can be bridged into Lovable's build loop — enabling more autonomous workflows where the AI can read live data, trigger external actions, and update app logic based on external state.
    </Alert>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: CONTENT GENERATION
═══════════════════════════════════════════════════════════ */
const PageContent = () => (
  <div>
    <SectionHead eyebrow="Content Generation" title="What Lovable Actually Does With Content" sub="An honest breakdown — because the answer matters a lot for site builders and content-driven businesses." />

    <Alert type="warn" title="Important Distinction">
      Lovable builds apps. It does not write content. It has no native blog generation, SEO tooling, keyword research, or autonomous publishing pipeline. If content generation at scale is your primary need, Lovable is the wrong tool.
    </Alert>

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
    <SectionHead eyebrow="Integration Strategy" title="Using Lovable + External Content Tools" sub="The MCP bridge changes what's possible — here's how to think about it." />

    <Prose>Lovable supports Model Context Protocol (MCP) integrations. Frase.io confirmed in their 2026 documentation that Claude, Cursor, Lovable, and Replit can all connect to their read-write MCP endpoint. This means an AI agent running inside your Lovable environment can theoretically trigger content brief creation, generate article drafts, run SEO audits, and publish to your CMS — through the bridge, not natively.</Prose>

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

    <Alert type="neutral" title="The Right Mental Model for Content-Driven Sites">
      Use Lovable to build your review site infrastructure — the CMS, the article templates, the comparison tables, the scoring system, the user-facing pages. Use a dedicated content tool (Frase, Surfer, Jasper) to generate and optimize the articles that fill it. The two categories complement each other; neither replaces the other.
    </Alert>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: SECURITY
═══════════════════════════════════════════════════════════ */
const PageSecurity = () => {
  const incidents = [
    {
      date: "Q1 2026 — 48 Days",
      severity: "critical",
      title: "BOLA Vulnerability Left Open After Bug Report Closed",
      body: "A Broken Object Level Authorization flaw was reported to Lovable via HackerOne. The company closed the bug report without proper escalation. The vulnerability remained open for 48 days, exposing source code, database credentials, and thousands of user records across projects built on the platform.",
    },
    {
      date: "February 2026",
      severity: "critical",
      title: "Permission Regression Re-Enables Public Chat Access",
      body: "During a backend unification effort, Lovable accidentally re-enabled access to chat histories on public projects. Chat histories had been patched as private — but the regression reversed this. Projects created before November 2025 were exposed. Live Supabase keys, database structures, and proprietary business logic were visible in those chats.",
    },
    {
      date: "March 2026",
      severity: "moderate",
      title: "16 Vulnerabilities in a Single Hosted App (100K+ Views)",
      body: "Security researcher Taimur Khan identified 16 vulnerabilities — including 6 critical ones — in a Lovable-hosted application with over 100,000 views. A malformed authentication function incorrectly blocked legitimate users while allowing unauthorized access. Affected PII included data from UC Berkeley, UC Davis, and K-12 institutions.",
    },
  ];

  return (
    <div>
      <SectionHead eyebrow="Security Deep-Dive" title="The Full Security Picture" sub="This is where the review gets uncomfortable. Read this before putting any real user data near Lovable." />

      <div style={{ background: "#2a0a05", borderRadius: 16, padding: "28px 32px", marginBottom: 36 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f08070", marginBottom: 12 }}>Security Status as of May 2026</div>
        <p style={{ color: "rgba(250,240,235,0.85)", fontSize: 16, lineHeight: 1.65 }}>
          Lovable experienced <strong style={{ color: "#f08070" }}>three documented security incidents</strong> in the first half of 2026. These include a critical vulnerability left open for 48 days after a bug report was closed without escalation, a permission regression that exposed chat histories from all pre-November 2025 projects, and a hosted app with 6 critical vulnerabilities affecting real user data. Source code, database credentials, and user PII were all affected across these incidents.
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
        <StatPill num="3" label="Documented security incidents, H1 2026" />
        <StatPill num="48 days" label="BOLA vulnerability was live after bug report closed" />
        <StatPill num="40–62%" label="Of AI-generated code contains vulnerabilities (2026 studies)" />
        <StatPill num="91.5%" label="Of vibe-coded apps had hallucination-related flaws in Q1 2026" />
      </div>

      <SectionHead eyebrow="Incident Timeline" title="What Actually Happened" />
      {incidents.map(inc => (
        <div key={inc.title} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ paddingTop: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: G.muted, lineHeight: 1.5 }}>{inc.date}</div>
            <Badge variant={inc.severity}>{inc.severity}</Badge>
          </div>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{inc.title}</h3>
            <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>{inc.body}</p>
          </Card>
        </div>
      ))}

      <Divider />
      <SectionHead eyebrow="Root Cause" title="The Structural Problem" />
      <Prose>Lovable's security issues are not just bugs — they represent a structural challenge baked into the vibe coding model. When you describe an app and AI generates all the code, nobody reviews it. Most users can't review it even if they wanted to. The platform's value proposition is removing the need to understand code — which also removes the ability to audit it.</Prose>
      <Prose>Lovable is "representatively insecure" — not uniquely so. Industry-wide data shows 40–62% of AI-generated code contains security vulnerabilities. The market rewards growth and ease of use over security hardening. Lovable grew to 8 million users faster than its security practices could keep pace.</Prose>

      <Alert type="warn" title="If You Were Using Lovable Before November 2025">
        Rotate all credentials immediately: API keys, Supabase access tokens, and any third-party integration tokens connected to Lovable projects. Chat histories were exposed and may have included live credentials, database structures, and business logic.
      </Alert>

      <Divider />
      <SectionHead eyebrow="What Lovable Does Provide" title="Built-In Security Features" sub="To be fair — there are real security tools. They're just not sufficient on their own." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { icon: "🔑", title: "API Key Detection", body: "Automatically flags exposed API keys in generated code before publishing. Effective first-pass scan." },
          { icon: "🛡️", title: "RLS Prompting", body: "Flags when Supabase row-level security is not configured on tables containing user data." },
          { icon: "🔐", title: "Supabase Auth", body: "Secure auth flows built in. Email, OAuth, and magic link — all wired to Supabase's auth service." },
          { icon: "🔒", title: "SSO (Business+)", body: "Single Sign-On for corporate environments — required for many enterprise security policies." },
          { icon: "🚫", title: "Training Opt-Out (Business+)", body: "Your prompts and code won't be used to train Lovable's AI models. Critical for proprietary work." },
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
          "Treat Lovable-hosted apps as prototypes until a security audit is completed by a qualified reviewer",
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
};

/* ═══════════════════════════════════════════════════════════
   PAGE: PRICING
═══════════════════════════════════════════════════════════ */
const PagePricing = () => {
  const plans = [
    { name: "Free", price: "$0", period: "forever", credits: "5/day · 30/mo cap", highlight: false, features: ["Unlimited public projects", "5 daily credits (reset midnight UTC)", "GitHub integration", "Up to 20 collaborators", "lovable.app subdomain", "Lovable badge displayed", "No private projects", "No custom domain", "No Code mode access"] },
    { name: "Starter", price: "~$21", period: "/mo (annual)", credits: "More daily credits", highlight: false, features: ["Everything in Free", "Private projects", "Custom domain", "Code editing mode", "Credit rollover", "No Lovable badge"] },
    { name: "Pro", price: "~$42", period: "/mo (annual)", credits: "Substantially more", highlight: true, features: ["Everything in Starter", "Higher credit limits", "Priority support", "Team collaboration", "Advanced project settings"] },
    { name: "Business", price: "$50+", period: "/mo", credits: "Per-user configurable", highlight: false, features: ["Everything in Pro", "SSO (Single Sign-On)", "Data training opt-out ⚠", "Restricted projects", "Reusable design templates", "Per-user credit limits", "Admin credit caps"] },
    { name: "Enterprise", price: "Custom", period: "", credits: "Custom", highlight: false, features: ["Everything in Business", "Custom API connections", "Dedicated support", "Professional onboarding", "Group-based access controls", "Custom design systems", "SLA guarantees"] },
  ];

  return (
    <div>
      <SectionHead eyebrow="Pricing" title="All Plans, Real Costs, Hidden Gotchas" sub="Lovable uses a credit-based model. The free plan is genuinely useful. The costs get harder to predict as you scale." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 36, alignItems: "start" }}>
        {plans.map(p => (
          <div key={p.name} style={{
            background: p.highlight ? G.text : G.card,
            border: `2px solid ${p.highlight ? G.accent : G.border}`,
            borderRadius: 14, padding: "22px 20px",
            position: "relative",
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
        Credits are tied to prompt complexity, not just volume. "Build this landing page" ≈ 2 credits. Iterative UI refinements, debugging sessions, and multi-file changes drain credits unpredictably. There is no published pay-as-you-go overage rate — you must upgrade tiers. Monthly billing runs ~20% higher than annual pricing. The credit system feels cheap upfront and becomes expensive once you're actively building.
      </Alert>

      <Alert type="warn" title="⚠ Data Training Opt-Out: Business Plan Only">
        This is the most important pricing footnote. By default, your prompts and generated code can be used to train Lovable's AI models. The opt-out is only available on Business plan ($50+/mo). If you're building client work, anything proprietary, or apps with sensitive logic — you need Business tier minimum for this reason alone.
      </Alert>

      <Divider />
      <SectionHead eyebrow="Credit Usage Guide" title="How Fast Will You Burn Credits?" />
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
const PageComparisons = () => {
  const competitors = [
    { name: "Bolt.new", desc: "StackBlitz's AI app builder. Strong token billing transparency, slightly better AI image editing. Less polished visual editor than Lovable.", vs: [["Visual editor", true, false], ["Figma import", true, false], ["Token transparency", false, true], ["GitHub export", true, true], ["Free tier", true, true]] },
    { name: "v0 by Vercel", desc: "Focused on React UI component generation. Best-in-class for individual component output. Not a full app builder — no backend, no auth.", vs: [["Full-stack generation", true, false], ["UI component quality", "Good", "Best-in-class"], ["Backend / DB", true, false], ["Auth built-in", true, false], ["Free tier", true, true]] },
    { name: "Cursor", desc: "AI-powered code editor for developers. Not a no-code tool — requires coding ability. Gives much more control over output quality and security.", vs: [["No-code accessible", true, false], ["Code control", "Low", "Full"], ["Security review", "Hard", "Easy"], ["Learning curve", "Low", "High"], ["Price", "$0–42/mo", "$20/mo"]] },
    { name: "Bubble", desc: "Mature no-code platform. Visual drag-and-drop, not AI-generated code. Steeper learning curve but more predictable security model and enterprise adoption.", vs: [["AI generation", true, false], ["Learning curve", "Low", "High"], ["Enterprise adoption", "Growing", "Established"], ["Security track record", "Mixed 2026", "Stronger"], ["Exportable code", true, false]] },
  ];

  return (
    <div>
      <SectionHead eyebrow="vs The Competition" title="How Lovable Stacks Up" sub="Head-to-head against the main alternatives in 2026." />

      {competitors.map(c => (
        <div key={c.name} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>Lovable vs {c.name}</h3>
          </div>
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
      ))}

      <Divider />
      <Alert type="neutral" title="Bottom Line on Competitors">
        Lovable wins on accessibility and speed-to-deployed-app. It loses on security track record (vs Bubble), code control (vs Cursor), and UI component quality (vs v0). Bolt.new is the closest direct competitor — choose based on whether you need the visual editor and Figma import (Lovable) or prefer more token cost transparency (Bolt.new).
      </Alert>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: PROMPT LIBRARY
═══════════════════════════════════════════════════════════ */
const PagePrompts = () => {
  const [activeCategory, setActiveCategory] = useState("Starter Apps");

  const library = {
    "Starter Apps": [
      { title: "SaaS Landing Page + Waitlist", prompt: "Build a SaaS landing page for a project management tool called 'Flowdesk'. Include a hero with headline and subheadline, a features section with 3 feature cards, a pricing section with 3 tiers (Free, Pro $29/mo, Team $79/mo), and a waitlist signup form that stores emails in Supabase. Use a clean, modern dark theme with a blue accent color." },
      { title: "CRM with Pipeline", prompt: "Create a CRM application with: a contacts list view with search and filter by status, a deals pipeline board with drag-and-drop between stages (Lead, Qualified, Proposal, Won, Lost), individual contact detail pages with notes and activity history, and a dashboard showing total deal value by stage. Connect to Supabase for auth and data storage." },
      { title: "Booking / Scheduling App", prompt: "Build a service booking app for a personal trainer. Include: a public-facing page showing available time slots for the next 14 days, a booking form collecting name, email, and service type (1hr session, 30min consultation), a confirmation email trigger via Supabase edge functions, and an admin dashboard to view and manage all bookings. Auth required for admin only." },
      { title: "Internal Knowledge Base", prompt: "Create an internal knowledge base app with: a searchable article library, category-based navigation (Engineering, HR, Product, Marketing), a rich text article editor for admins, article view counts, and a 'last updated' timestamp on each article. Supabase auth with role-based access — admins can create/edit, regular users can only read." },
    ],
    "Review & Comparison": [
      { title: "Software Review Site Structure", prompt: "Build a software review and comparison site. Include: a homepage with featured reviews and a search bar, individual review pages with a scoring system (1-10 on 6 criteria: Ease of Use, Features, Pricing, Support, Security, Value), a comparison tool that shows two products side-by-side, a category browser, and a submit-your-review form. Store all data in Supabase. Admin panel to approve reviews." },
      { title: "Product Comparison Table", prompt: "Create a dynamic product comparison page for no-code tools. Display a sticky comparison table with rows for: Price, Free Plan, AI Generation, GitHub Export, Custom Domain, Auth Built-in, Database Included, and our Score. Allow visitors to toggle which products are shown (checkboxes at top). Data stored in Supabase so admin can update without code changes." },
      { title: "Review Scoring Widget", prompt: "Build a reusable review score component for a review site. It should display: an overall score as a large number with a circular progress ring, individual category scores as horizontal bars (label, bar, score), a color-coded verdict badge (Excellent/Good/Fair/Poor), and pros and cons lists. Make it embeddable as a standalone component." },
    ],
    "Dashboards & Tools": [
      { title: "Analytics Dashboard", prompt: "Build a business analytics dashboard with: a header showing date range picker (last 7d, 30d, 90d, custom), 4 KPI cards (Revenue, New Users, Conversion Rate, Churn), a line chart for revenue over time, a bar chart for top traffic sources, a recent signups table, and a goal progress tracker. Use placeholder data initially, structured so it's easy to connect to a real data source." },
      { title: "Link-in-Bio Tool", prompt: "Create a link-in-bio builder similar to Linktree. Users sign up, create a profile with a custom username, add/edit/reorder links with a title and URL, choose from 5 color themes, and get a public URL at /username. Track click counts per link. Admin can see all users. Public profiles require no login to view." },
      { title: "Microtool: ROI Calculator", prompt: "Build a standalone ROI calculator for a SaaS product. Inputs: current team size (slider), hours per week on manual task (slider), hourly rate ($), current tool cost ($). Output: time saved per week, annual dollar value of time saved, net ROI after tool cost, payback period in months. Show results dynamically as sliders move. Clean, single-page design." },
    ],
    "Content & CMS": [
      { title: "Blog CMS with Admin", prompt: "Build a blog CMS. Public side: article list with search, filter by tag, estimated read time, and author avatar. Single article pages with table of contents, prev/next navigation. Admin side (auth required): create/edit/delete articles with a rich text editor, manage tags, set publish status (draft/published), and upload featured images to Supabase storage. SEO fields: title, meta description, OG image URL." },
      { title: "Newsletter Management", prompt: "Create a newsletter management app. Features: public subscribe form with email + first name, double opt-in confirmation via Supabase edge function, admin dashboard showing total subscribers, growth chart, and recent subscribers list, compose and send newsletter to all confirmed subscribers, unsubscribe page. Store all data in Supabase." },
      { title: "Resource Directory", prompt: "Build a curated resource directory for no-code tools. Each resource has: name, description, URL, category (Builder, Automation, Database, Design, AI), tags, date added, and upvote count. Features: browseable by category, search, sort by newest or most upvoted, submit a resource form (stored as pending until admin approves), admin approval queue." },
    ],
    "Auth & Security": [
      { title: "Secure App with RLS", prompt: "Build a personal notes app with proper security. Requirements: Supabase auth with email/password login, row-level security policies explicitly defined so each user can ONLY read and write their own notes, a notes list page, a note editor, and a settings page to update display name and password. Include a comment in the code explaining each RLS policy." },
      { title: "Role-Based Access", prompt: "Create a team workspace app with three roles: Owner, Admin, and Member. Owners can invite members and delete the workspace. Admins can create projects and manage members. Members can only view projects and add comments. Implement Supabase RLS policies for each role. Show the logged-in user's role in the nav. Build a role management page for owners." },
    ],
  };

  const categories = Object.keys(library);

  return (
    <div>
      <SectionHead eyebrow="Prompt Library" title="Ready-to-Use Lovable Prompts" sub="Tested prompt templates for the most common build types. Copy any prompt directly into Lovable to get a working starting point." />

      <Alert type="info" title="How to Use These Prompts">
        Paste any prompt directly into Lovable's chat. They're designed to give the AI enough specificity to make good architectural decisions upfront — reducing the number of follow-up prompts needed. Customize the product names, colors, and specific fields to match your use case before submitting.
      </Alert>

      {/* Category nav */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28, background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: 6 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "8px 14px", border: "none", borderRadius: 8,
            background: activeCategory === cat ? G.accent : "transparent",
            color: activeCategory === cat ? "#fff" : G.muted,
            fontSize: 13, fontWeight: activeCategory === cat ? 700 : 500,
            cursor: "pointer", transition: "all 0.15s",
          }}>{cat}</button>
        ))}
      </div>

      {library[activeCategory].map(item => (
        <div key={item.title} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
          <PromptBlock text={item.prompt} />
        </div>
      ))}

      <Divider />
      <Alert type="neutral" title="Tips for Better Lovable Prompts">
        <strong>Be specific about data:</strong> Name your database tables and fields. "A contacts table with name, email, company, status (lead/customer/churned)" is far better than "a contacts feature." <br /><br />
        <strong>Specify auth requirements upfront:</strong> Tell Lovable who needs to be logged in and who doesn't in your first prompt — retrofitting auth is expensive in credits.<br /><br />
        <strong>Name your app:</strong> Give Lovable a product name. It generates better copy, navigation labels, and branding when it has a name to work with.<br /><br />
        <strong>State your theme:</strong> "Clean, minimal, light background" or "dark theme with orange accent" in your first prompt prevents multiple styling iterations later.
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
      title: "Build Your First App in 20 Minutes",
      level: "Beginner",
      time: "20 min",
      steps: [
        { title: "Sign up & orient yourself", body: "Go to lovable.dev and sign up with email or Google. No credit card needed for the free plan. You'll land on a dashboard showing your projects — it'll be empty. Click 'New Project' to start. The chat interface is where all the magic happens: you type prompts on the left, see the generated app preview on the right, and can toggle between the visual editor and the code view." },
        { title: "Write your first prompt", body: "In the chat box, type a detailed description of what you want to build. For this tutorial: \"Build a simple task manager app. Include a homepage showing all tasks in a list, the ability to add new tasks with a title and priority level (Low, Medium, High), mark tasks as complete, delete tasks, and filter by status (All, Active, Completed). Use a clean light theme with a green accent color. Store tasks in Supabase.\"" },
        { title: "Wait for generation (1–2 minutes)", body: "Lovable will generate all the code and deploy the app. You'll see the file tree building on the left and the preview updating on the right. The first generation creates the React components, Supabase configuration, and Tailwind styles simultaneously. When it finishes, you'll see a live preview URL in the top right — your app is already deployed." },
        { title: "Review and iterate", body: "Click through the preview. Test the features. Notice anything that needs fixing or improvement — write it as a new prompt. \"The task priority badge colors are hard to read — make High priority red, Medium orange, and Low grey. Also, the completed tasks should be visually crossed out.\" Each new prompt modifies the existing app without regenerating from scratch." },
        { title: "Connect your GitHub", body: "In the top right, click the GitHub icon. Connect your account and create a new repo for this project. Lovable will push the full codebase — React components, Supabase config, package.json, everything. You now own the code. Any changes you make in Lovable sync automatically." },
        { title: "Share your app", body: "Your app is already live at a lovable.app URL. Share it directly, or — on paid plans — connect a custom domain in Project Settings. Your Supabase database is running in the background; any tasks added by testers are stored in real database rows you can view in your Supabase dashboard." },
      ],
    },
    {
      title: "Setting Up Supabase Auth Properly",
      level: "Intermediate",
      time: "30 min",
      steps: [
        { title: "Understand how Lovable connects to Supabase", body: "Lovable automatically creates and connects a Supabase project when you first use auth features. You can see your Supabase project by clicking the database icon in the left sidebar. Your Supabase URL and anon key are stored as environment variables — Lovable manages this automatically. Do not paste your Supabase service role key into any prompt — only the anon key is safe for client-side use." },
        { title: "Prompt for auth with specific requirements", body: "When building with auth, specify your requirements upfront: \"Add authentication to this app. Requirements: email/password signup and login, email verification required before accessing the app, a protected dashboard page that requires auth to view, a public landing page that anyone can see, and a user profile page where logged-in users can update their display name. Redirect to /login if an unauthenticated user tries to access /dashboard.\"" },
        { title: "Verify the generated auth flow", body: "After generation, test every auth path manually: sign up with a test email, check that the verification email arrives (check Supabase email templates in your Supabase dashboard under Authentication > Email Templates), verify the link, confirm you land on the dashboard, try accessing /dashboard while logged out and verify the redirect, test the sign-out button. Document any failures as specific prompts." },
        { title: "Enable Row-Level Security", body: "Go to your Supabase dashboard, click on Table Editor, select any table with user data, and click the RLS icon. If Lovable hasn't generated RLS policies, you'll see 'RLS is disabled.' This means ANY authenticated user can read ANY row in that table. Prompt Lovable: \"Enable row-level security on the [table name] table. Each user should only be able to read, update, and delete their own rows. Create the appropriate Supabase RLS policies.\" Then verify in Supabase that the policies were created correctly." },
        { title: "Test security manually", body: "Create two test accounts. Log in as User A and create some data. Log out. Log in as User B. Attempt to access User A's data by navigating directly to a URL or using the browser console to make a Supabase query. If RLS is working correctly, User B should see zero results for User A's data. If they can see it, your RLS policies are not working — go back to Lovable and be more explicit about what you want the policy to do." },
      ],
    },
    {
      title: "Exporting & Handing Off to a Developer",
      level: "Intermediate",
      time: "45 min",
      steps: [
        { title: "Prepare for export", body: "Before exporting, do a final cleanup pass in Lovable. Prompt: \"Review the codebase for any hardcoded credentials, placeholder text that should be removed, unused components, or console.log statements left from debugging. Clean these up and make sure all environment variables are properly referenced.\" This prevents you from handing over a repo with embarrassing or insecure artifacts." },
        { title: "Export to GitHub", body: "Click the GitHub icon in the top navigation. If not already connected, authorize Lovable with your GitHub account. Choose 'Push to new repository' and name it something descriptive. Lovable will push the complete codebase including: all React components, Tailwind config, package.json with all dependencies, Supabase client setup, and .env.example showing which environment variables are needed (with placeholder values, not real keys)." },
        { title: "Document the architecture for the developer", body: "In Lovable, prompt: \"Generate a README.md for this project that includes: an overview of what the app does, the tech stack (React, Tailwind, Supabase), all environment variables needed and where to get them, how to run the project locally, a description of the database schema and relationships, and any known limitations or areas that need improvement.\" Review and edit this README before handing off." },
        { title: "Export Supabase configuration", body: "In your Supabase dashboard, go to Settings > Database > Database Settings and export your schema SQL. Also export your RLS policies under Authentication > Policies. Include these SQL files in your repository. The developer needs these to spin up a local Supabase environment that matches production." },
        { title: "Brief the developer on security", body: "Specifically flag: which RLS policies exist and which tables might still need them, any auth flows that were tested and any that weren't, the Supabase service role key (never in the frontend — make sure the developer knows this), and any API integrations that use third-party keys. Ask the developer to run Semgrep or Snyk on the codebase as their first action and to review all RLS policies before launch." },
      ],
    },
    {
      title: "Building a Review Site on Lovable",
      level: "Intermediate",
      time: "60 min",
      steps: [
        { title: "Plan your data model first", body: "Before writing a single prompt, design your database on paper. For a review site you likely need: a reviews table (id, title, slug, overall_score, published, created_at), a scores table (review_id, category, score), a pros_cons table (review_id, type, text), and a categories table (id, name, slug). Having this mapped out lets you write a precise first prompt that generates the right schema." },
        { title: "First prompt: full structure", body: "Write a comprehensive first prompt: \"Build a software review website called 'No-Code Reviewed'. Database tables: reviews (id, title, slug, tagline, overall_score, published, created_at, updated_at), score_categories (id, review_id, category_name, score), pros_cons (id, review_id, type [pro/con], text). Public pages: homepage with featured reviews grid, category filter, search. Individual review pages showing scores as progress bars, pros/cons lists, and a verdict section. Admin panel (auth-required) to create, edit, and publish reviews. Clean editorial design with orange accent color #e8541a.\"" },
        { title: "Build the scoring component", body: "After initial generation, focus on the scoring visualization: \"Create a reusable ScoreCard component that takes a score (0-10) and label as props. Display the score as a horizontal bar with the label on the left and the numeric score on the right. Color the bar: red for scores under 4, orange for 4-7, green for 7+. Use this component throughout all review pages.\"" },
        { title: "Add the comparison feature", body: "Comparison tables are high-value for review sites. Prompt: \"Add a comparison page at /compare. Allow users to select 2-4 products from a dropdown populated from the reviews table. Display a side-by-side comparison table showing all score categories, overall score, and pricing. Highlight the highest score in each row with a light green background.\"" },
        { title: "SEO and metadata", body: "Prompt: \"Add SEO metadata to all pages. Each review page should dynamically set: document title as '[Product Name] Review 2026 — No-Code Reviewed', meta description from the review's tagline, og:title, og:description, og:image from a featured_image field (add this field to the reviews table). The homepage should have static metadata. Use React Helmet for this.\"" },
        { title: "Test, export, and plan your security review", body: "Test all auth flows (admin login/logout), test that published/unpublished status works correctly (unpublished reviews shouldn't be visible to public), verify RLS policies prevent anonymous users from accessing the admin endpoints, and check that search and filter work correctly with real data. Export to GitHub and plan a developer security review before you start adding real review content." },
      ],
    },
  ];

  const activeTut = tutorials[activeTutorial];

  return (
    <div>
      <SectionHead eyebrow="Tutorials" title="Step-by-Step Guides" sub="Real workflows for the most important Lovable use cases — from first app to secure production handoff." />

      {/* Tutorial selector */}
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

      {/* Active tutorial */}
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
    { label: "Autonomous Build", score: 8.5 },
    { label: "Content Generation", score: 5.5 },
    { label: "Security", score: 5.0 },
    { label: "Value for Money", score: 7.4 },
    { label: "Documentation", score: 7.0 },
    { label: "Competitor Position", score: 8.0 },
  ];
  const overall = (scores.reduce((a, s) => a + s.score, 0) / scores.length).toFixed(1);

  return (
    <div>
      <SectionHead eyebrow="Final Verdict" title="Our Definitive Take on Lovable 2026" sub="After testing every feature, reviewing every incident, and building real apps — here's the complete picture." />

      {/* The big verdict */}
      <div style={{ background: G.text, borderRadius: 20, padding: "40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: G.accent, opacity: 0.1 }} />
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: G.accent, lineHeight: 1 }}>{overall}</div>
            <div style={{ fontSize: 13, color: "rgba(250,248,244,0.5)", marginTop: 4 }}>out of 10</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: G.accent, marginTop: 8 }}>Overall Score</div>
          </div>
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

      {/* Score breakdown */}
      <Card style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.muted, marginBottom: 20 }}>Category Breakdown</div>
        {scores.map(s => <ScoreBar key={s.label} label={s.label} score={s.score} />)}
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

      {/* Use case recommendations */}
      <SectionHead eyebrow="Who Should Use It" title="Our Specific Recommendations" />
      {[
        { persona: "Non-technical founder with an idea", rec: "Start here. Lovable is the fastest way to validate whether your idea is worth pursuing before hiring a developer. Use the free plan, build your MVP in a weekend, share it with potential users. If it gains traction, upgrade and bring in a developer for the security review.", verdict: "Strong Yes", badge: "good" },
        { persona: "Designer wanting to ship without code", rec: "Import your Figma designs and use Lovable to bring them to life. You'll still need to iterate on components that don't translate perfectly, but you'll get 80% of the way there much faster than learning to code. Focus on getting the visual layer right — treat the backend as a starting point to hand off.", verdict: "Yes", badge: "good" },
        { persona: "Agency building client MVPs", rec: "Solid choice for fast prototyping and client demos. Upgrade to Business plan for the data training opt-out — client code and logic should not be training Lovable's models. Always have a developer review Supabase RLS policies before the client goes live.", verdict: "Yes, with caveats", badge: "warn" },
        { persona: "Enterprise with production requirements", rec: "Not yet. Lovable is making progress on security but three incidents in H1 2026 means it hasn't earned production trust for enterprise data. Use it for internal prototyping, ideation, and tools that don't handle sensitive data. Hand off the GitHub export to your engineering team for production-grade hardening.", verdict: "Not Yet", badge: "critical" },
        { persona: "Content-driven site builder", rec: "Lovable builds the infrastructure; you'll need separate tools for content. It's an excellent platform for building your CMS, review templates, comparison tools, and public-facing site structure. Budget separately for content generation tools (Frase, Surfer, Jasper) and plan the integration strategy before you start building.", verdict: "Partial Fit", badge: "neutral" },
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

      {/* CTA */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "28px 32px", alignItems: "center", flexWrap: "wrap" }}>
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
          {/* Brand */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.muted, lineHeight: 1 }}>No-Code Reviewed</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: G.text, lineHeight: 1.2 }}>Lovable <span style={{ color: G.accent }}>2026</span></div>
          </div>

          {/* Desktop nav */}
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

          {/* Mobile nav btn */}
          <button className="mobile-nav-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            marginLeft: "auto", background: "none", border: `1px solid ${G.border}`,
            borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: G.text, display: "none", alignItems: "center", gap: 6,
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
              border: "none", borderRadius: 8, background: activePage === n.id ? G.accent : "transparent",
              color: activePage === n.id ? "#fff" : G.text, fontSize: 14, fontWeight: activePage === n.id ? 700 : 500,
              cursor: "pointer", marginBottom: 2,
            }}>{n.label}</button>
          ))}
        </div>
      )}

      {/* Content */}
      <div ref={mainRef} style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: G.muted, marginBottom: 24, display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ cursor: "pointer" }} onClick={() => goTo("overview")}>Lovable Review</span>
          {activePage !== "overview" && <>
            <span>›</span>
            <span style={{ color: G.accent, fontWeight: 600 }}>{activeLabel}</span>
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
                  <button onClick={() => goTo(prev.id)} style={{ padding: "10px 18px", background: G.card, border: `1px solid ${G.border}`, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", color: G.text }}>
                    ← {prev.label}
                  </button>
                ) : <div />}
                {next && (
                  <button onClick={() => goTo(next.id)} style={{ padding: "10px 18px", background: G.accent, border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff" }}>
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
