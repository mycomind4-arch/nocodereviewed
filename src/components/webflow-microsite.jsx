import { useState, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   WEBFLOW — FULL REVIEW MICROSITE
   no-code-reviewed.webflow.app
   Design system: Cabinet Grotesk + DM Mono, #146EF5 accent, #E8EDF5 text, #06080F bg
═══════════════════════════════════════════════════════════ */

const G = {
  accent: "#146EF5",
  accentLight: "#4D94FF",
  accentGlow: "rgba(20,110,245,0.2)",
  accentDim: "#0E4DB3",
  text: "#E8EDF5",
  textSoft: "#C2CCE0",
  card: "#0D1120",
  cardHover: "#111827",
  bg: "#06080F",
  muted: "#6B7A99",
  border: "#1A2240",
  border2: "#243060",
  good: "#22C55E",
  warn: "#F59E0B",
  error: "#EF4444",
  goodBg: "#0A1F12",
  warnBg: "#1C1406",
  purple: "#8B5CF6",
  purpleGlow: "rgba(139,92,246,0.15)",
  navH: 62,
};

/* ─── Shared micro-components ─── */
const Badge = ({ children, variant = "neutral" }) => {
  const colors = {
    neutral: { bg: "#111827", color: G.muted, border: G.border2 },
    accent: { bg: "rgba(20,110,245,0.12)", color: G.accentLight, border: "rgba(20,110,245,0.35)" },
    critical: { bg: "rgba(239,68,68,0.1)", color: G.error, border: "rgba(239,68,68,0.3)" },
    good: { bg: "rgba(34,197,94,0.1)", color: G.good, border: "rgba(34,197,94,0.3)" },
    warn: { bg: "rgba(245,158,11,0.1)", color: G.warn, border: "rgba(245,158,11,0.3)" },
    purple: { bg: "rgba(139,92,246,0.12)", color: "#A78BFA", border: "rgba(139,92,246,0.35)" },
  };
  const c = colors[variant] || colors.neutral;
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.09em", textTransform: "uppercase",
      padding: "3px 10px", borderRadius: 6,
      background: c.bg, color: c.color,
      border: `1px solid ${c.border}`,
      fontFamily: "'DM Mono', monospace",
    }}>{children}</span>
  );
};

const ScoreBar = ({ label, score, max = 10 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 42px", alignItems: "center", gap: 14, marginBottom: 16 }}>
    <span style={{ fontSize: 13, fontWeight: 500, color: G.muted }}>{label}</span>
    <div style={{ height: 3, background: G.border2, borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${(score / max) * 100}%`,
        background: `linear-gradient(90deg, ${G.accent}, ${G.purple})`,
        borderRadius: 2,
      }} />
    </div>
    <span style={{ fontSize: 13, fontWeight: 700, textAlign: "right", color: G.accentLight, fontFamily: "'DM Mono', monospace" }}>{score}</span>
  </div>
);

const Alert = ({ type = "neutral", title, children }) => {
  const map = {
    neutral: { border: G.border2, bg: G.card },
    warn: { border: G.warn, bg: G.warnBg },
    good: { border: G.good, bg: G.goodBg },
    info: { border: G.accent, bg: "rgba(20,110,245,0.07)" },
    error: { border: G.error, bg: "rgba(239,68,68,0.07)" },
    purple: { border: G.purple, bg: "rgba(139,92,246,0.07)" },
  };
  const s = map[type] || map.neutral;
  return (
    <div style={{ borderLeft: `2px solid ${s.border}`, background: s.bg, borderRadius: "0 8px 8px 0", padding: "16px 20px", marginBottom: 18 }}>
      {title && <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, color: s.border, fontFamily: "'DM Mono', monospace" }}>{title}</div>}
      <div style={{ fontSize: 14, lineHeight: 1.75, color: G.textSoft }}>{children}</div>
    </div>
  );
};

const Card = ({ children, style = {}, glow = false, purpleGlow = false }) => (
  <div style={{
    background: G.card,
    border: `1px solid ${G.border}`,
    borderRadius: 12,
    padding: "22px 24px",
    ...(glow ? { boxShadow: `0 0 0 1px ${G.accentGlow}, 0 8px 32px ${G.accentGlow}` } : {}),
    ...(purpleGlow ? { boxShadow: `0 0 0 1px ${G.purpleGlow}, 0 8px 32px ${G.purpleGlow}` } : {}),
    ...style,
  }}>
    {children}
  </div>
);

const SectionHead = ({ eyebrow, title, sub }) => (
  <div style={{ marginBottom: 36 }}>
    {eyebrow && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: G.accentLight, marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>{eyebrow}</div>}
    <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: sub ? 12 : 0, lineHeight: 1.1, color: G.text }}>{title}</h2>
    {sub && <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.7, maxWidth: 640, marginTop: 10 }}>{sub}</p>}
  </div>
);

const Prose = ({ children }) => (
  <div style={{ fontSize: 14.5, lineHeight: 1.85, color: "#9AAAC4", marginBottom: 18 }}>{children}</div>
);

const Divider = () => <div style={{ height: 1, background: G.border, margin: "36px 0" }} />;

const StatPill = ({ num, label, color }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: "20px 22px", textAlign: "center", flex: "1 1 130px" }}>
    <div style={{ fontSize: 26, fontWeight: 700, color: color || G.accentLight, lineHeight: 1, fontFamily: "'DM Mono', monospace" }}>{num}</div>
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
      background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
      color: copied ? G.good : G.muted,
      border: `1px solid ${copied ? G.good : G.border2}`,
      borderRadius: 5, fontSize: 10, fontWeight: 600,
      cursor: "pointer", transition: "all 0.2s",
      fontFamily: "'DM Mono', monospace",
    }}>{copied ? "Copied!" : "Copy"}</button>
  );
};

const PromptBlock = ({ text }) => (
  <div style={{ position: "relative", background: "#080B14", border: `1px solid ${G.border}`, borderRadius: 8, padding: "16px 52px 16px 18px", marginBottom: 14 }}>
    <CopyBtn text={text} />
    <p style={{ color: "#8FA4C8", fontSize: 13, lineHeight: 1.75, fontFamily: "'DM Mono', monospace", margin: 0 }}>{text}</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════ */
const NAV = [
  { id: "overview", label: "Overview" },
  { id: "designer", label: "Designer" },
  { id: "cms", label: "CMS" },
  { id: "ecommerce", label: "Ecommerce" },
  { id: "interactions", label: "Interactions" },
  { id: "hosting", label: "Hosting" },
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
    <div style={{
      background: `linear-gradient(135deg, #0D1529 0%, #0A0F1E 60%, #0D0B1A 100%)`,
      borderRadius: 18,
      padding: "52px 44px",
      marginBottom: 40,
      position: "relative",
      overflow: "hidden",
      border: `1px solid ${G.border}`,
    }}>
      {/* Decorative orbs */}
      <div style={{ position: "absolute", top: -80, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,110,245,0.18) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -60, left: "35%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: G.accentLight, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>No-Code Reviewed · In-Depth Platform Review</div>
        <h1 style={{ fontSize: "clamp(32px,5.5vw,58px)", fontWeight: 800, color: G.text, letterSpacing: "-0.03em", lineHeight: 1.06, marginBottom: 20 }}>
          Webflow<br />Complete Review 2026
        </h1>
        <p style={{ fontSize: 16, color: "rgba(200,215,240,0.75)", lineHeight: 1.7, maxWidth: 600, marginBottom: 36 }}>
          The professional visual web builder that gives designers pixel-perfect control, a built-in CMS, and production-grade hosting — without writing code. We tested every major capability across design, CMS, ecommerce, and interactions to give you the most complete Webflow review available.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => goTo("verdict")} style={{ padding: "13px 28px", background: G.accent, color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px ${G.accentGlow}` }}>See Our Verdict →</button>
          <button onClick={() => goTo("designer")} style={{ padding: "13px 28px", background: "rgba(255,255,255,0.07)", color: G.text, border: `1px solid ${G.border2}`, borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Explore the Designer</button>
        </div>
      </div>
    </div>

    {/* Quick verdict bar */}
    <Card style={{ marginBottom: 32, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
      {[
        { label: "Overall Score", val: "8.6 / 10" },
        { label: "Design Freedom", val: "★★★★★" },
        { label: "Learning Curve", val: "Steep" },
        { label: "Best For", val: "Designers & Agencies" },
        { label: "Pricing Tier", val: "Mid–High" },
      ].map(i => (
        <div key={i.label} style={{ flex: "1 1 120px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: G.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, fontFamily: "'DM Mono', monospace" }}>{i.label}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: G.text }}>{i.val}</div>
        </div>
      ))}
    </Card>

    {/* Scores */}
    <Card style={{ marginBottom: 28 }} glow>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.accentLight, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>Category Scores</div>
      <ScoreBar label="Visual Designer" score={9.5} />
      <ScoreBar label="CMS Capability" score={8.0} />
      <ScoreBar label="Interactions" score={9.0} />
      <ScoreBar label="Ecommerce" score={7.0} />
      <ScoreBar label="Hosting & Speed" score={8.5} />
      <ScoreBar label="SEO Controls" score={9.0} />
      <ScoreBar label="AI Features" score={6.5} />
      <ScoreBar label="Value for Money" score={7.0} />
      <ScoreBar label="Ease of Use" score={6.5} />
    </Card>

    {/* Stats */}
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 32 }}>
      <StatPill num="3.5M+" label="Sites built on Webflow" />
      <StatPill num="200K+" label="Active paying customers" color={G.purple} />
      <StatPill num="200+" label="Integrations available" />
      <StatPill num="2013" label="Year founded" color={G.warn} />
    </div>

    <Divider />

    <SectionHead eyebrow="The Bottom Line" title="What is Webflow, really?" sub="A professional-grade visual development environment disguised as a no-code tool." />

    <Prose>
      Webflow occupies a unique and intentionally narrow niche: it's the tool built for people who know design but don't want to hand off to a developer. It renders a real DOM, generates real semantic HTML and CSS, and gives you control over box model, flexbox, grid, and CSS variables — all through a visual interface.
    </Prose>
    <Prose>
      That positioning creates a paradox. Webflow is simultaneously the most powerful no-code web builder available and one of the hardest to learn. If you understand web design principles, the interface will feel transformative. If you're a true non-developer with limited design background, the interface will likely feel overwhelming within the first hour.
    </Prose>

    <Alert type="info" title="Who This Review Is For">
      This review is written for designers, freelancers, and agency professionals who are deciding whether Webflow justifies the learning investment. We assume familiarity with HTML/CSS concepts even if you don't write code daily. Non-developers without design backgrounds should look at our Lovable or Framer reviews instead.
    </Alert>

    <Prose>
      The platform has evolved significantly since its 2013 launch. The CMS matured. Ecommerce arrived (and has matured slowly). Webflow University became a legitimate educational resource. And in 2024–2025, Webflow began integrating AI — first with AI Assistant for copy, then with more substantive component generation features in 2025 and early 2026.
    </Prose>

    <Divider />

    <SectionHead eyebrow="Key Strengths" title="Where Webflow leads the industry" />
    {[
      { title: "The Designer is genuinely exceptional", body: "No other no-code tool gives you this level of CSS control visually. Flexbox, Grid, custom properties, pseudo-states, breakpoints — it's all there and it works exactly as you'd expect if you know CSS." },
      { title: "Clean, exportable code", body: "The HTML and CSS Webflow generates is semantic, performant, and structured. You can export your project and host it anywhere — a rare and valuable escape hatch." },
      { title: "Interactions & Animations", body: "The Interactions panel is one of Webflow's most underrated features. Multi-step scroll triggers, mouse-tracking parallax, element-enter animations — all without touching JavaScript." },
      { title: "Built-in CMS with structure", body: "The CMS is properly relational. Collections, reference fields, multi-image fields — it's a real CMS, not a glorified blog plugin. Dynamic pages render from collection data without any workarounds." },
      { title: "SEO at the code level", body: "Custom meta fields, canonical tags, schema markup, open graph control, sitemap generation, clean heading hierarchy — Webflow's SEO capability is best-in-class for no-code." },
    ].map(f => (
      <Card key={f.title} style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 7 }}>{f.title}</h4>
        <p style={{ fontSize: 13.5, color: G.muted, lineHeight: 1.65 }}>{f.body}</p>
      </Card>
    ))}

    <Divider />

    <SectionHead eyebrow="Key Weaknesses" title="Where Webflow falls short" />
    <Alert type="warn" title="Steep Learning Curve">
      Webflow is routinely cited as the no-code tool with the steepest learning curve in the industry. Most users report 20–40 hours before they feel productive. Plan for this investment explicitly.
    </Alert>
    <Alert type="warn" title="Pricing Complexity">
      Webflow's pricing separates workspace plans (for building) from site plans (for hosting and CMS). Understanding what you actually need — and what tier your client site needs — is genuinely confusing. The pricing page requires careful reading.
    </Alert>
    <Alert type="error" title="Ecommerce Lags Behind">
      Webflow Ecommerce has improved but remains behind Shopify, Squarespace Commerce, and even some newer competitors. Product variants, inventory sync, and checkout customization all have meaningful limitations. Evaluate carefully before committing to it for serious stores.
    </Alert>
    {[
      { title: "No native team collaboration in lower tiers", body: "Simultaneous multi-user editing is only available on Enterprise or higher workspace plans. Freelancers working with clients will feel this pain immediately." },
      { title: "AI features are still catching up", body: "Webflow's AI Assistant (copy and image) and AI component generation are useful but not yet transformative. Competitors like Framer have moved faster here." },
    ].map(f => (
      <Card key={f.title} style={{ marginBottom: 14 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 7 }}>{f.title}</h4>
        <p style={{ fontSize: 13.5, color: G.muted, lineHeight: 1.65 }}>{f.body}</p>
      </Card>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: DESIGNER
═══════════════════════════════════════════════════════════ */
const PageDesigner = () => (
  <div>
    <SectionHead eyebrow="The Visual Designer" title="The most powerful no-code designer on the market" sub="Webflow's visual canvas is its crown jewel — a direct manipulation interface that maps 1:1 to real CSS and HTML." />

    <Prose>
      Open the Webflow Designer and you're immediately faced with two panels, a canvas, a style inspector, and a navigator — essentially a visual IDE. The left Navigator shows your DOM tree. The right Style panel shows every CSS property for the selected element. The canvas is live and rendered in real browser pixels.
    </Prose>
    <Prose>
      That fidelity to real CSS is Webflow's biggest differentiator. When you set a flexbox property, it sets the actual CSS flexbox property. There's no abstraction layer creating "magic" behavior that breaks in production. What you see in the Designer is — with minor exceptions around canvas viewport behavior — what you get in the browser.
    </Prose>

    <Alert type="info" title="Designer vs. No-Code Editor">
      Webflow is not a drag-and-drop page builder in the traditional sense. You work with HTML elements (div, section, p, h1, etc.) that you style in the panel. It's closer to working in browser DevTools than to dragging pre-styled widgets from a library. This is a fundamental distinction that catches many new users off guard.
    </Alert>

    <Divider />

    <SectionHead eyebrow="Layout System" title="Flexbox & Grid: the full power" />
    <Prose>
      Webflow supports full CSS Flexbox and Grid layout, and has done so since before most other no-code tools even understood what Grid was. The visual controls for flex direction, wrap, alignment, and gap map cleanly to their CSS equivalents. Grid mode adds a visual grid template editor with named areas, column tracks, and row tracks.
    </Prose>
    {[
      { title: "Flexbox Editor", score: "9.5/10", body: "Best-in-class. Every flex property is accessible and predictable. Container and child controls are logically separated." },
      { title: "CSS Grid Editor", score: "8.5/10", body: "Full grid support with visual template editing. Named areas are supported. Subgrid is not yet available, but standard grid covers 95% of use cases." },
      { title: "Absolute Positioning", score: "9/10", body: "Position, z-index, offset — all work as expected. Overflow and clip behaviour is correctly handled." },
      { title: "Responsive Controls", score: "9/10", body: "6 breakpoints (min 320px) with cascade inheritance from Desktop down. Styles set at Mobile Small inherit up correctly." },
    ].map(f => (
      <Card key={f.title} style={{ marginBottom: 12, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 13.5, fontWeight: 700, color: G.text, marginBottom: 5 }}>{f.title}</h4>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{f.body}</p>
        </div>
        <Badge variant="accent">{f.score}</Badge>
      </Card>
    ))}

    <Divider />

    <SectionHead eyebrow="Class System" title="Global styles & the class model" />
    <Prose>
      Webflow uses a class-based styling system that will be immediately familiar to CSS developers. Base classes, combo classes, and global styles cascade just as they would in a stylesheet. The class panel shows all existing classes for easy reuse. Changes to a shared class update everywhere that class is applied — exactly as CSS should work.
    </Prose>
    <Prose>
      The class system is powerful but requires discipline. Without naming conventions, complex projects become unmaintainable quickly. We recommend adopting BEM or a similar convention early, and Webflow's "Finsweet Attributes" ecosystem has become a community standard for extending class-based behavior.
    </Prose>

    <Alert type="purple" title="Pro Tip: Style Guide Page">
      Create a hidden "Style Guide" page as your first page on every new Webflow project. Define all your global styles, type styles, and base classes there before building any other page. This discipline pays compounding dividends as the project grows.
    </Alert>

    <Divider />

    <SectionHead eyebrow="Component System" title="Symbols → Components evolution" />
    <Prose>
      In 2024, Webflow rebranded and expanded its "Symbols" feature into a full "Components" system with properties. Components can now accept text, image, color, and boolean properties — letting you build a component library with variants that differ based on passed props. This is a major improvement and closes a long-standing gap with Framer.
    </Prose>
    <Alert type="good" title="2025 Update">
      Component nesting — components inside components — shipped in mid-2025 and was a significant milestone. Complex design systems are now properly expressible inside Webflow without workarounds.
    </Alert>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: CMS
═══════════════════════════════════════════════════════════ */
const PageCMS = () => (
  <div>
    <SectionHead eyebrow="Content Management System" title="A real CMS, not a blog plugin" sub="Webflow's CMS is properly relational, editable by non-technical clients, and deeply integrated into the Designer." />

    <Prose>
      Webflow CMS is built around Collections — structured content types you define. Each collection has fields (text, rich text, image, multi-image, reference, multi-reference, switch, number, date, color, video link, and more). Collection items become dynamic pages via Collection Page templates, and display in Collection Lists across any page in your site.
    </Prose>

    <Card style={{ marginBottom: 24 }} glow>
      <div style={{ fontSize: 10, fontWeight: 700, color: G.accentLight, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18, fontFamily: "'DM Mono', monospace" }}>CMS Capability Overview</div>
      <ScoreBar label="Collection Fields" score={8.5} />
      <ScoreBar label="Reference Fields" score={8.0} />
      <ScoreBar label="Dynamic Pages" score={9.0} />
      <ScoreBar label="Editor Interface" score={7.5} />
      <ScoreBar label="CMS API" score={8.5} />
      <ScoreBar label="Content Limits" score={6.5} />
    </Card>

    <SectionHead eyebrow="Field Types" title="What data can you structure?" />
    {[
      { field: "Plain Text", note: "Single-line and multi-line. Length limits configurable." },
      { field: "Rich Text", note: "Full WYSIWYG with embeds. Supports custom formatting via classes." },
      { field: "Image / Multi-Image", note: "Native CDN delivery. Alt text per image." },
      { field: "Reference / Multi-Reference", note: "Relational links between collections. Up to 5 levels deep." },
      { field: "Switch (Boolean)", note: "Useful for toggling visibility or state in dynamic templates." },
      { field: "Number / Date / Color", note: "Typed fields with validation." },
      { field: "Video Link", note: "YouTube/Vimeo embeds via URL." },
      { field: "Option (Enum)", note: "Dropdown selects with defined options. Filterable in Collection Lists." },
    ].map(f => (
      <div key={f.field} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 12, padding: "12px 0", borderBottom: `1px solid ${G.border}` }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: G.text, fontFamily: "'DM Mono', monospace" }}>{f.field}</span>
        <span style={{ fontSize: 13, color: G.muted, lineHeight: 1.55 }}>{f.note}</span>
      </div>
    ))}

    <Divider />

    <SectionHead eyebrow="Content Limits" title="Where the CMS hits walls" />
    <Alert type="warn" title="Item Limits by Plan">
      The CMS Site plan allows 2,000 CMS items total across all collections. The Business plan raises this to 10,000. For content-heavy sites — news publishers, large portfolios, product catalogs — these limits are real constraints. Enterprise removes them.
    </Alert>
    <Prose>
      The 2,000-item limit on the CMS plan trips up more projects than any other single Webflow limitation. A real estate listing site, a recipe collection, or a job board can hit this surprisingly quickly. Plan your CMS item count before committing to a hosting tier.
    </Prose>

    <Alert type="info" title="Workaround: External CMS via API">
      Webflow's CMS API allows write access, so teams sometimes populate collections via external scripts. Tools like Whalesync, Airtable integrations, or custom scripts can sync content from external sources directly into CMS collections. This extends Webflow's CMS utility significantly for complex content ops.
    </Alert>

    <Divider />

    <SectionHead eyebrow="Client Editor" title="The non-developer editing experience" />
    <Prose>
      Webflow provides an "Editor" mode accessible at your site URL — a simplified overlay UI for client content editing. Clients can edit CMS items, static text, and images without touching the Designer. The experience is clean but limited compared to dedicated CMS UIs like Contentful or Sanity.
    </Prose>
    {[
      { pro: true, text: "Easy for non-technical clients to use for basic content changes" },
      { pro: true, text: "CMS item creation/editing is well-handled" },
      { pro: false, text: "No content scheduling or draft/publish workflows on lower plans" },
      { pro: false, text: "No role-based content permissions below Enterprise" },
      { pro: false, text: "Rich text field editing in Editor mode can be unpredictable" },
    ].map((i, idx) => (
      <div key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, fontSize: 13.5, color: i.pro ? G.good : G.muted }}>
        <span style={{ flexShrink: 0, marginTop: 1 }}>{i.pro ? "✓" : "✗"}</span>
        <span style={{ lineHeight: 1.55 }}>{i.text}</span>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: ECOMMERCE
═══════════════════════════════════════════════════════════ */
const PageEcommerce = () => (
  <div>
    <SectionHead eyebrow="Ecommerce" title="Built-in but not best-in-class" sub="Webflow Ecommerce exists and handles simple stores, but serious ecommerce still belongs on Shopify." />

    <Alert type="warn" title="Honest Assessment Upfront">
      Webflow Ecommerce has improved steadily since its 2019 launch, but as of 2026 it remains behind Shopify, WooCommerce, and even newer focused alternatives for anything beyond simple product catalogs. If ecommerce is your primary use case, evaluate Shopify first.
    </Alert>

    <Card style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: G.accentLight, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18, fontFamily: "'DM Mono', monospace" }}>Ecommerce Capability Scores</div>
      <ScoreBar label="Product Setup" score={7.5} />
      <ScoreBar label="Product Variants" score={6.5} />
      <ScoreBar label="Checkout UX" score={7.0} />
      <ScoreBar label="Order Management" score={6.5} />
      <ScoreBar label="Inventory Sync" score={5.5} />
      <ScoreBar label="Payment Options" score={7.5} />
      <ScoreBar label="Subscription Support" score={4.5} />
      <ScoreBar label="Marketplace Integrations" score={5.5} />
    </Card>

    <SectionHead eyebrow="What Works" title="Where Webflow Ecommerce earns its keep" />
    {[
      { title: "Product page design freedom", body: "This is where Webflow genuinely outshines Shopify: your product page template is a full Webflow Designer canvas. Custom layouts, animation on scroll, dynamic CMS fields mixed with product data — you can build product experiences that are simply impossible in Shopify's Liquid without heavy customization." },
      { title: "Stripe & PayPal native", body: "Core payment processing through Stripe and PayPal works reliably. Apple Pay and Google Pay are supported via Stripe. Setup is straightforward." },
      { title: "Simple digital products", body: "Downloadable digital products and pay-what-you-want pricing work well. For creators selling a small catalog of digital products, Webflow Ecommerce is quite sufficient." },
    ].map(f => (
      <Card key={f.title} style={{ marginBottom: 12 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 6 }}>{f.title}</h4>
        <p style={{ fontSize: 13.5, color: G.muted, lineHeight: 1.65 }}>{f.body}</p>
      </Card>
    ))}

    <Divider />

    <SectionHead eyebrow="Known Limitations" title="Where it falls short" />
    {[
      { title: "Product variants max at 3 options, 1,000 SKUs", body: "A shoes store with size + color + width quickly brushes this limit. Complex variant matrices that are routine on Shopify hit hard walls here." },
      { title: "No native subscription / recurring billing", body: "Recurring product subscriptions require third-party integrations (Outseta, MemberStack, Memberspace). There's no native subscription product type." },
      { title: "Checkout is a hosted Webflow page — minimal customization", body: "The cart and checkout pages cannot be fully redesigned. You can adjust colors and basic styling but not the layout or flow. This is a significant limitation for brand-sensitive stores." },
      { title: "Inventory management is basic", body: "No multi-location inventory, no reorder points, no real purchase order workflow. You'll outgrow it quickly if you're managing physical stock seriously." },
    ].map(f => (
      <Alert key={f.title} type="error" title={f.title}>{f.body}</Alert>
    ))}

    <Divider />

    <SectionHead eyebrow="Recommendation" title="Who should use Webflow Ecommerce?" />
    <Prose>
      Webflow Ecommerce is a good fit if ecommerce is secondary to your marketing site, your product catalog is simple (under ~200 SKUs, no complex variants), and the design flexibility of the product page is more important than robust order management. A brand that sells 5–20 products and wants a beautifully designed site that also converts is the sweet spot.
    </Prose>
    <Prose>
      For anything beyond this — high SKU counts, subscription billing, B2B ordering, multi-currency, or complex fulfillment — use Shopify and consider headless Webflow as your CMS/frontend layer.
    </Prose>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: INTERACTIONS
═══════════════════════════════════════════════════════════ */
const PageInteractions = () => (
  <div>
    <SectionHead eyebrow="Interactions & Animations" title="The secret weapon most users underuse" sub="Webflow Interactions is a timeline-based animation system that creates effects most developers would write in GSAP — visually, without code." />

    <Prose>
      Webflow Interactions 2.0 (IX2) is arguably the most powerful feature in the platform, and the least understood by newcomers. It's a keyframe-based animation editor that hooks into scroll position, page load, hover state, click events, and more. The output is performant CSS and JavaScript that matches what a seasoned front-end animator would hand-code.
    </Prose>

    <Alert type="purple" title="The Webflow Portfolio Effect">
      The majority of award-winning Webflow sites — the ones that get shared on Awwwards, Site Inspire, and design Twitter — are award-winning because of Interactions. Scroll-triggered reveals, parallax layers, cursor-follow effects, and load sequences are what separate Webflow from every other no-code tool aesthetically.
    </Alert>

    <Divider />

    <SectionHead eyebrow="Trigger Types" title="What can trigger an animation?" />
    {[
      { trigger: "Page Load", note: "Run animations when the page is first loaded. Classic entrance animations — fade in, slide up, stagger." },
      { trigger: "Scroll Into View", note: "Element-enter triggers when any element enters the viewport. The workhorse of modern scroll-storytelling." },
      { trigger: "Scroll Position", note: "Timeline-linked animations that play as you scroll. Parallax, pinned elements, progress bars." },
      { trigger: "Mouse Move (Page)", note: "CSS custom property–powered mouse tracking. Creates depth, parallax cursor effects." },
      { trigger: "Hover", note: "Two-phase hover (in/out) with full keyframe control. More powerful than CSS :hover alone." },
      { trigger: "Click", note: "Toggle, open, close. Accordion, modal, navigation interactions." },
      { trigger: "2nd Click", note: "Alternating state for toggle-style interactions." },
      { trigger: "Navbar Scroll", note: "Trigger navbar style changes based on scroll position. Sticky header effects." },
    ].map(t => (
      <div key={t.trigger} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 12, padding: "12px 0", borderBottom: `1px solid ${G.border}` }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: G.accentLight, fontFamily: "'DM Mono', monospace" }}>{t.trigger}</span>
        <span style={{ fontSize: 13, color: G.muted, lineHeight: 1.55 }}>{t.note}</span>
      </div>
    ))}

    <Divider />

    <SectionHead eyebrow="Animation Properties" title="What can you animate?" />
    <Prose>
      Webflow IX2 can animate: position (move X/Y/Z), scale, rotation, skew, opacity, blur, brightness, contrast, hue rotate, saturate, width, height, and custom CSS properties. The last one — custom CSS properties — is the escape hatch that lets you animate anything CSS can animate, including color values and gradients via CSS variable interpolation.
    </Prose>

    <Alert type="good" title="Lottie Integration">
      Webflow has native Lottie animation support. You can use Lottie JSON files as elements that trigger and scrub via scroll position — turning complex motion graphics into scroll-driven narratives without a single line of code.
    </Alert>

    <Divider />

    <SectionHead eyebrow="Learning Resources" title="How to actually learn Interactions" />
    <Prose>
      Interactions has a genuinely steep learning curve separate from the rest of Webflow's learning curve. The key conceptual hurdle is understanding "actions" (what happens) vs. "triggers" (what causes it to happen) and how initial states relate to the animation sequence.
    </Prose>
    {[
      "Webflow University's Interactions course (free, ~4 hours) — the mandatory starting point",
      "Nelson Abalos Jr.'s YouTube channel covers advanced scroll-linked techniques",
      "Finsweet's 'Cloneable' directory has hundreds of interaction patterns to clone and reverse-engineer",
      "Matt Hias on YouTube for scroll-trigger deep dives",
    ].map((tip, i) => (
      <Card key={i} style={{ marginBottom: 10, padding: "14px 18px" }}>
        <p style={{ fontSize: 13.5, color: G.muted, lineHeight: 1.6, margin: 0 }}>→ {tip}</p>
      </Card>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: HOSTING
═══════════════════════════════════════════════════════════ */
const PageHosting = () => (
  <div>
    <SectionHead eyebrow="Hosting & Infrastructure" title="Fastly-backed CDN, solid performance" sub="Webflow's hosting tier is genuinely good — built on Fastly CDN with 100+ global PoPs, automatic SSL, and thoughtful performance defaults." />

    <Card style={{ marginBottom: 28 }} glow>
      <div style={{ fontSize: 10, fontWeight: 700, color: G.accentLight, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18, fontFamily: "'DM Mono', monospace" }}>Hosting Performance Scores</div>
      <ScoreBar label="Global CDN" score={9.0} />
      <ScoreBar label="Time to First Byte" score={8.5} />
      <ScoreBar label="Core Web Vitals" score={8.0} />
      <ScoreBar label="SSL & Security" score={9.5} />
      <ScoreBar label="Uptime (historical)" score={9.5} />
      <ScoreBar label="Image Optimization" score={8.5} />
      <ScoreBar label="Custom Code Support" score={7.5} />
    </Card>

    <Prose>
      Webflow runs on Fastly, the same CDN used by the New York Times and GitHub. All sites are served over HTTP/2 with automatic SSL provisioning via Let's Encrypt. Asset files are automatically fingerprinted for cache invalidation. Images are optimized and served in WebP format to supported browsers automatically.
    </Prose>

    <Alert type="good" title="Core Web Vitals">
      Webflow-hosted sites consistently perform well on Core Web Vitals. The platform's opinionated approach to image delivery, render-blocking script deferral, and clean HTML structure means you're starting from a solid performance baseline without manual optimization work.
    </Alert>

    <Divider />

    <SectionHead eyebrow="Custom Code" title="Extending Webflow with code" />
    <Prose>
      Webflow supports custom HTML, CSS, and JavaScript in head/body embed blocks, on pages, and on individual elements. This is the bridge between no-code and custom functionality. Third-party scripts, custom analytics, chat widgets, and complex form behavior are all achievable via embed code.
    </Prose>
    {[
      { title: "Head/body custom code per site", body: "Global custom code injected into every page. Ideal for analytics scripts, font fallbacks, and global behavior." },
      { title: "Per-page custom code", body: "Page-level code injection for page-specific behavior. UTM tracking scripts, page-specific integrations." },
      { title: "Element embed", body: "HTML embed element placed anywhere in the Designer canvas. Custom UI components, third-party widgets, iframes." },
      { title: "No server-side code", body: "Webflow is a static hosting platform. No PHP, no server functions, no backend execution. For dynamic backend behavior, connect via client-side API calls to external services." },
    ].map(f => (
      <Card key={f.title} style={{ marginBottom: 12 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 6 }}>{f.title}</h4>
        <p style={{ fontSize: 13.5, color: G.muted, lineHeight: 1.65 }}>{f.body}</p>
      </Card>
    ))}

    <Alert type="info" title="Code Export">
      Webflow allows export of your site's HTML, CSS, and JavaScript for self-hosting. This is a genuine differentiator — you're not locked into Webflow's infrastructure. The exported code is well-structured and production-ready for static hosting on Netlify, Vercel, GitHub Pages, or AWS S3.
    </Alert>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: PRICING
═══════════════════════════════════════════════════════════ */
const PagePricing = () => (
  <div>
    <SectionHead eyebrow="Pricing" title="The most confusing pricing in no-code" sub="Two separate pricing axes — Workspace plans for building, Site plans for hosting — create a matrix that trips up nearly every new user." />

    <Alert type="warn" title="The Pricing Trap">
      Webflow charges separately for workspace access (where you build) and site hosting (where the site lives). A freelancer building 5 client sites needs both a Freelancer workspace plan AND a Site plan for each client site. Read the pricing page very carefully before assuming you know your total cost.
    </Alert>

    <SectionHead eyebrow="Workspace Plans" title="Plans for building & collaboration" sub="Workspace plans govern how many unhosted projects you can build and how many people can collaborate." />
    {[
      { name: "Starter", price: "Free", seats: "1", projects: "2 unhosted", highlight: false, notes: "Good for learning. Cannot publish to a custom domain without a site plan." },
      { name: "Basic", price: "$14/mo", seats: "1", projects: "Unlimited unhosted", highlight: false, notes: "Solo builders who want unlimited projects in progress." },
      { name: "Freelancer", price: "$24/mo", seats: "1", projects: "Unlimited unhosted + client billing", highlight: true, notes: "The standard freelancer plan. Client billing means clients pay site plans directly." },
      { name: "Agency", price: "$42/mo", seats: "3", projects: "Unlimited + white label", highlight: false, notes: "Small agency teams. White-label client dashboard." },
    ].map(p => (
      <Card key={p.name} style={{ marginBottom: 14, ...(p.highlight ? { border: `1px solid ${G.border2}` } : {}) }} glow={p.highlight}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: G.text }}>{p.name}</h3>
            <div style={{ fontSize: 12, color: G.muted, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{p.seats} seat · {p.projects}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: G.accentLight, fontFamily: "'DM Mono', monospace" }}>{p.price}</div>
            {p.highlight && <Badge variant="accent">Most Popular</Badge>}
          </div>
        </div>
        <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{p.notes}</p>
      </Card>
    ))}

    <Divider />

    <SectionHead eyebrow="Site Plans" title="Plans for hosting & publishing" sub="Every published site needs its own site plan. These are paid by either you or your client." />
    {[
      { name: "Basic", price: "$14/mo", cms: "No CMS", bandwidth: "50 GB", notes: "Brochure sites only. No CMS, no ecommerce." },
      { name: "CMS", price: "$23/mo", cms: "2,000 items", bandwidth: "200 GB", notes: "The standard plan for CMS-powered sites. The 2,000-item limit is real — plan for it." },
      { name: "Business", price: "$39/mo", cms: "10,000 items", bandwidth: "400 GB", notes: "High-traffic sites with large CMS collections. Adds form file uploads." },
      { name: "E-commerce Standard", price: "$29/mo", cms: "2,000 CMS + 500 products", bandwidth: "200 GB", notes: "Entry-level ecommerce. 2% transaction fee applies." },
      { name: "E-commerce Plus", price: "$74/mo", cms: "2,000 CMS + 1,000 products", bandwidth: "400 GB", notes: "No transaction fees on this tier." },
    ].map(p => (
      <div key={p.name} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", gap: 12, padding: "14px 0", borderBottom: `1px solid ${G.border}`, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: G.text, marginBottom: 3 }}>{p.name}</div>
          <div style={{ fontSize: 12, color: G.muted, lineHeight: 1.5 }}>{p.cms} · {p.notes}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: G.accentLight, textAlign: "center", fontFamily: "'DM Mono', monospace" }}>{p.price}</div>
        <div style={{ fontSize: 12, color: G.muted, textAlign: "center" }}>{p.bandwidth}</div>
      </div>
    ))}

    <Divider />

    <SectionHead eyebrow="Real-World Cost" title="What you'll actually pay" />
    {[
      { scenario: "Solo freelancer, 1 active client site (CMS)", cost: "$47/mo", breakdown: "$24 Freelancer workspace + $23 CMS site plan" },
      { scenario: "Agency, 5 client sites (CMS)", cost: "$157/mo", breakdown: "$42 Agency workspace + 5 × $23 CMS site plans (billable to clients)" },
      { scenario: "In-house team, 1 Business site", cost: "~$80+/mo", breakdown: "Team workspace ($varies) + $39 Business site plan" },
      { scenario: "Founder, simple portfolio site", cost: "$37/mo", breakdown: "$14 Basic workspace + $23 CMS site plan" },
    ].map(s => (
      <Card key={s.scenario} style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: G.text, marginBottom: 4 }}>{s.scenario}</div>
            <div style={{ fontSize: 12, color: G.muted }}>{s.breakdown}</div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: G.accentLight, fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>{s.cost}</div>
        </div>
      </Card>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: COMPARISONS
═══════════════════════════════════════════════════════════ */
const PageComparisons = () => (
  <div>
    <SectionHead eyebrow="vs Competitors" title="How Webflow stacks up" sub="Webflow is often compared to Framer, Squarespace, WordPress, and Wix — but the competition isn't as direct as it seems." />

    {[
      {
        competitor: "Webflow vs Framer",
        verdict: "Different philosophies",
        vb: "purple",
        body: "Framer has pulled ahead on AI-powered generation and React component integration. Webflow leads on CMS depth, SEO control, ecommerce (minimal as it is), and production-site reliability. Framer is better for design-forward portfolio and SaaS marketing sites. Webflow is better for content-heavy sites that need a robust CMS and longer-term maintainability.",
        wfWins: ["Deeper CMS with more field types", "Ecommerce (however limited)", "Better SEO controls", "Larger template ecosystem", "Code export"],
        compWins: ["Faster AI generation", "React component support", "Easier to learn for pure designers", "Better for pure portfolio sites"],
      },
      {
        competitor: "Webflow vs Squarespace",
        verdict: "Apples vs. Oranges",
        vb: "neutral",
        body: "Squarespace is a consumer product designed for maximum ease. Webflow is a professional tool designed for design capability. They don't really compete for the same user. If you're comparing these two, you probably belong on Squarespace — Webflow's learning investment isn't worth it if ease of use is your priority.",
        wfWins: ["Design freedom and fidelity", "CMS flexibility", "Custom interactions and animations", "Code export and migration path", "SEO granularity"],
        compWins: ["Far easier to use", "Better integrated ecommerce", "Built-in email campaigns", "No learning curve"],
      },
      {
        competitor: "Webflow vs WordPress",
        verdict: "Different tool categories",
        vb: "neutral",
        body: "WordPress with page builders (Elementor, Divi) is often the alternative considered. WordPress wins on plugin ecosystem depth, server-side execution capability, and sheer flexibility. Webflow wins on design integrity, hosting reliability without DevOps overhead, and the elimination of plugin maintenance hell. The right choice depends heavily on whether you need server-side functionality.",
        wfWins: ["No plugin maintenance", "Managed hosting, zero DevOps", "Better design fidelity and visual consistency", "Performance without optimization work"],
        compWins: ["Massive plugin ecosystem", "Server-side execution", "WooCommerce for serious ecommerce", "Lower hosting cost at scale", "Greater content flexibility"],
      },
    ].map(c => (
      <Card key={c.competitor} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: G.text }}>{c.competitor}</h3>
          <Badge variant={c.vb}>{c.verdict}</Badge>
        </div>
        <p style={{ fontSize: 13.5, color: G.muted, lineHeight: 1.7, marginBottom: 18 }}>{c.body}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: G.good, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>Webflow Wins</div>
            {c.wfWins.map(w => <div key={w} style={{ fontSize: 12.5, color: G.muted, marginBottom: 7, paddingLeft: 12, borderLeft: `2px solid ${G.good}`, lineHeight: 1.4 }}>{w}</div>)}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: G.error, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>Competitor Wins</div>
            {c.compWins.map(w => <div key={w} style={{ fontSize: 12.5, color: G.muted, marginBottom: 7, paddingLeft: 12, borderLeft: `2px solid ${G.error}`, lineHeight: 1.4 }}>{w}</div>)}
          </div>
        </div>
      </Card>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: PROMPTS
═══════════════════════════════════════════════════════════ */
const PagePrompts = () => (
  <div>
    <SectionHead eyebrow="Prompt Library" title="AI prompts for Webflow projects" sub="Webflow's AI features are limited, but you can use external AI tools (Claude, ChatGPT, Cursor) effectively alongside Webflow. Here are the prompts we rely on." />

    <Alert type="info" title="How to Use These Prompts">
      These prompts are primarily for use with Claude or ChatGPT alongside Webflow — generating custom code embeds, CMS structures, and Finsweet attributes logic. Paste them directly into your AI assistant of choice.
    </Alert>

    {[
      {
        category: "CMS Structure Design",
        prompts: [
          "Design a Webflow CMS collection structure for a [real estate listings] site. Include all field types needed, which fields should be references vs plain text, and any multi-reference fields I'll need. Explain any tradeoffs.",
          "I need to build a [job board] on Webflow CMS. What collections do I need, what are the reference relationships, and what filtering/sorting should I plan for in Collection Lists?",
          "Review this Webflow CMS structure and identify any fields that could be better typed, any missing reference fields, and potential CMS item limit issues: [paste your collection structure]",
        ],
      },
      {
        category: "Custom Code Embeds",
        prompts: [
          "Write a vanilla JavaScript embed block for Webflow that filters a Collection List by a URL parameter on page load. The Collection List items have a data attribute of data-category. No jQuery.",
          "Write a Webflow custom code snippet that reads a URL query parameter called 'ref' and stores it in localStorage, then pre-populates a hidden form field with that value on any page that has a form.",
          "Create a Webflow embed block that counts words in a Webflow rich text field and displays a reading time estimate in a span with id='reading-time'.",
        ],
      },
      {
        category: "Finsweet Attributes",
        prompts: [
          "I'm using Finsweet CMS Filter on my Webflow site. Explain the fs-cmsfilter-field attributes I need and write the complete attribute configuration for filtering a portfolio collection by both category and tool type simultaneously.",
          "Set up Finsweet CMS Load (fs-cmsload) for load more functionality on a Webflow Collection List. Give me all the required attributes and the script tag to add to page settings.",
        ],
      },
      {
        category: "Interactions Planning",
        prompts: [
          "Plan a Webflow IX2 interaction for a scroll-triggered stagger animation. I have 6 cards in a grid. Describe exactly which trigger to use, what action to set, what the initial state should be, and the timing for each card.",
          "I want to build a sticky navigation that changes background color and reduces padding on scroll in Webflow Interactions. Give me the exact IX2 setup: trigger type, actions, and what CSS properties to animate.",
        ],
      },
      {
        category: "SEO & Performance",
        prompts: [
          "Write the JSON-LD schema markup for a Webflow blog post page. The CMS fields are: post-title, post-date, author-name, author-slug, post-category, and post-image. Use Webflow's dynamic embed syntax.",
          "Review my Webflow page structure for SEO issues: [paste your HTML structure or describe your heading hierarchy and meta setup]. Focus on heading hierarchy, meta description, and structured data gaps.",
        ],
      },
    ].map(section => (
      <div key={section.category} style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.accentLight, marginBottom: 14, fontFamily: "'DM Mono', monospace" }}>{section.category}</div>
        {section.prompts.map(p => <PromptBlock key={p} text={p} />)}
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: TUTORIALS
═══════════════════════════════════════════════════════════ */
const PageTutorials = () => (
  <div>
    <SectionHead eyebrow="Tutorials & Learning Path" title="How to actually learn Webflow" sub="The honest learning path — what to study first, what to skip, and the resources that actually work." />

    <Alert type="purple" title="Time Investment Reality Check">
      Budget 30–50 hours to reach genuine Webflow proficiency. This is not a platform you'll master in a weekend. The time investment is real, and the tools that promise otherwise are understating how much there is to understand. The payoff, however, is substantial.
    </Alert>

    <SectionHead eyebrow="The Learning Path" title="Phase 1: Foundations (10–15 hours)" />
    {[
      { step: "01", title: "Webflow University: Web Design 101", note: "Start here before anything else. HTML/CSS mental models will save you hours of confusion later.", time: "~3 hrs", link: "university.webflow.com" },
      { step: "02", title: "Webflow University: Webflow 101 Crash Course", note: "The official structured intro to the Designer, Navigator, and Style Panel.", time: "~4 hrs", link: "university.webflow.com" },
      { step: "03", title: "Build a landing page from scratch", note: "No templates. One page, one section at a time. Flex layout only. Get comfortable with the Style Panel.", time: "~4 hrs", link: "your own project" },
    ].map(t => (
      <Card key={t.step} style={{ marginBottom: 14, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: G.border2, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{t.step}</div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 5 }}>{t.title}</h4>
          <p style={{ fontSize: 12.5, color: G.muted, lineHeight: 1.55 }}>{t.note}</p>
          <p style={{ fontSize: 11, color: G.accentLight, marginTop: 4, fontFamily: "'DM Mono', monospace" }}>{t.link}</p>
        </div>
        <Badge variant="neutral">{t.time}</Badge>
      </Card>
    ))}

    <SectionHead eyebrow="The Learning Path" title="Phase 2: Intermediate (10–20 hours)" />
    {[
      { step: "04", title: "Webflow University: Interactions & Animations", note: "The IX2 course is mandatory. Don't try to learn interactions by experimenting — the mental model needs to be taught.", time: "~5 hrs" },
      { step: "05", title: "Webflow University: CMS Course", note: "Collections, dynamic pages, Collection Lists, filtering. Build a CMS-powered blog from scratch.", time: "~4 hrs" },
      { step: "06", title: "Clone and dissect 3 Webflow templates", note: "Buy or clone complex templates. Open them in the Designer and trace how they're built. This is worth more than any tutorial.", time: "~6 hrs" },
    ].map(t => (
      <Card key={t.step} style={{ marginBottom: 14, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: G.border2, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{t.step}</div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 5 }}>{t.title}</h4>
          <p style={{ fontSize: 12.5, color: G.muted, lineHeight: 1.55 }}>{t.note}</p>
        </div>
        <Badge variant="neutral">{t.time}</Badge>
      </Card>
    ))}

    <Divider />

    <SectionHead eyebrow="Community Resources" title="The Webflow ecosystem" />
    {[
      { name: "Webflow Forum", note: "The official community. High signal, active moderation. Search before posting — most questions have been answered.", url: "forum.webflow.com" },
      { name: "Finsweet", note: "The most important third-party ecosystem for Webflow. Finsweet Attributes (CMS filter, load more, nest) and the Client-First CSS naming system are near-ubiquitous on professional Webflow projects.", url: "finsweet.com" },
      { name: "Webflow Cloneable Directory", note: "Clone-ready Webflow projects covering interactions, CMS patterns, and design systems. The fastest way to learn techniques by examining real implementations.", url: "webflow.com/made-in-webflow" },
      { name: "Client-First (Finsweet)", note: "A CSS class naming system specifically designed for Webflow's class model. Adopting Client-First early on complex projects will save you considerable pain later.", url: "finsweet.com/client-first" },
      { name: "Relume", note: "AI-powered sitemap and wireframe generator that exports to Webflow. Dramatically accelerates project scaffolding for agency work.", url: "relume.io" },
    ].map(r => (
      <Card key={r.name} style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 4 }}>{r.name}</h4>
            <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{r.note}</p>
          </div>
          <a href={`https://${r.url}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: G.accentLight, textDecoration: "none", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: 2 }}>{r.url} ↗</a>
        </div>
      </Card>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: VERDICT
═══════════════════════════════════════════════════════════ */
const PageVerdict = ({ goTo }) => (
  <div>
    <SectionHead eyebrow="Final Verdict" title="The definitive Webflow verdict for 2026" sub="After extensive testing across all major features, here is our honest assessment." />

    <div style={{ background: `linear-gradient(135deg, #0D1529, #0A0F1E)`, borderRadius: 16, padding: "36px 40px", marginBottom: 32, border: `1px solid ${G.border2}` }}>
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", marginBottom: 24 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: G.accentLight, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>8.6</div>
          <div style={{ fontSize: 11, color: G.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>out of 10</div>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: G.text, marginBottom: 10 }}>Highly Recommended — for the right user</h2>
          <p style={{ fontSize: 14, color: G.muted, lineHeight: 1.7 }}>Webflow is the most powerful visual web design tool available. The learning investment is steep but pays back substantially for designers and agencies who commit to it. The pricing complexity and ecommerce limitations are real, but for the core use case — beautifully designed, CMS-powered marketing sites — nothing comes close.</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Badge variant="good">Design Freedom: Unmatched</Badge>
        <Badge variant="good">CMS: Excellent</Badge>
        <Badge variant="warn">Ecommerce: Limited</Badge>
        <Badge variant="warn">Learning Curve: Steep</Badge>
        <Badge variant="accent">SEO: Best-in-class</Badge>
      </div>
    </div>

    <Divider />

    <SectionHead eyebrow="By Persona" title="Should you use Webflow?" />
    {[
      { persona: "Freelance Web Designer", badge: "Highly Recommended", bv: "good", rec: "Webflow is built for you. The design fidelity, the ability to own hosting or transfer to clients, the code export escape hatch — this is the tool the no-code industry built for professional web designers. The learning investment is steep but directly marketable as a skill." },
      { persona: "Marketing / Growth Team (In-House)", badge: "Recommended", bv: "accent", rec: "Good fit if you have a designer who can commit to Webflow University. The CMS makes ongoing content operations manageable without developer dependency. Plan for the pricing matrix complexity and budget accordingly across workspace and site plans." },
      { persona: "Design Agency", badge: "Highly Recommended", bv: "good", rec: "The de facto standard for design-forward agencies that want to own production. Client-First CSS, Finsweet ecosystem, and Webflow's client billing model are all built around the agency workflow. The ROI on the tool is clear if your team bills by the hour." },
      { persona: "Non-Developer / Founder", badge: "Evaluate Carefully", bv: "warn", rec: "Webflow is not designed for non-developers without design backgrounds. If you want to ship a working product quickly without a 40-hour learning investment, use Lovable, Framer, or Squarespace. Return to Webflow when you have a designer on the team." },
      { persona: "Serious Ecommerce Business", badge: "Not Recommended for Core", bv: "critical", rec: "Use Shopify for your store. You can use Webflow as a headless frontend for your marketing pages, connecting to Shopify for cart/checkout via JavaScript. But do not attempt to build a serious product catalog on Webflow Ecommerce — the variant and inventory limitations will hurt you." },
      { persona: "Developer Who Wants Design Tools", badge: "Worth Evaluating", bv: "neutral", rec: "If you're a front-end developer, Webflow's code export and clean output may appeal to you as a prototyping tool. The code it produces is reasonable starting material. However, Framer's React component integration may be a better fit for modern JS-focused workflows." },
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

    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "28px 32px", alignItems: "center", flexWrap: "wrap" }}>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: G.text, marginBottom: 8 }}>Ready to try Webflow?</h3>
        <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>Start on the free Starter workspace plan — no credit card needed. Build your first project and go through Webflow University before committing to a paid plan.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <a href="https://webflow.com" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 24px", background: G.accent, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "block", whiteSpace: "nowrap", boxShadow: `0 4px 16px ${G.accentGlow}` }}>Try Webflow Free →</a>
        <button onClick={() => goTo("tutorials")} style={{ padding: "10px 24px", background: "transparent", color: G.textSoft, border: `1px solid ${G.border2}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Learning Path →</button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function WebflowMicrosite() {
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
    designer: <PageDesigner />,
    cms: <PageCMS />,
    ecommerce: <PageEcommerce />,
    interactions: <PageInteractions />,
    hosting: <PageHosting />,
    pricing: <PagePricing />,
    comparisons: <PageComparisons />,
    prompts: <PagePrompts />,
    tutorials: <PageTutorials />,
    verdict: <PageVerdict goTo={goTo} />,
  };

  return (
    <div style={{ fontFamily: "'Cabinet Grotesk', 'DM Sans', sans-serif", color: G.text, background: G.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500;600&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@300,400,500,600,700,800,900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #06080F; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0D1120; }
        ::-webkit-scrollbar-thumb { background: #1A2240; border-radius: 3px; }
        button { font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif; }
        a { font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif; }
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
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(6,8,15,0.88)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${G.border}`, height: G.navH }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 20px", height: "100%", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: G.muted, lineHeight: 1, fontFamily: "'DM Mono', monospace" }}>No-Code Reviewed</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: G.text, lineHeight: 1.3 }}>Webflow <span style={{ color: G.accentLight }}>2026</span></div>
          </div>

          <nav className="desktop-nav" style={{ display: "flex", gap: 2, flex: 1, overflow: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => goTo(n.id)} style={{
                padding: "6px 12px", border: "none", borderRadius: 7,
                background: activePage === n.id ? "rgba(20,110,245,0.14)" : "transparent",
                color: activePage === n.id ? G.accentLight : G.muted,
                fontSize: 12.5, fontWeight: activePage === n.id ? 700 : 500,
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.12s",
                outline: activePage === n.id ? `1px solid rgba(20,110,245,0.35)` : "none",
              }}>{n.label}</button>
            ))}
          </nav>

          <button className="mobile-nav-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            marginLeft: "auto", background: "none", border: `1px solid ${G.border2}`,
            borderRadius: 7, padding: "6px 12px", cursor: "pointer",
            fontSize: 12, fontWeight: 600, color: G.text, display: "none", alignItems: "center", gap: 6,
          }}>☰ {activeLabel}</button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu" style={{ position: "fixed", top: G.navH, left: 0, right: 0, zIndex: 99, background: "#0A0F1E", borderBottom: `1px solid ${G.border}`, padding: 12 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => goTo(n.id)} style={{
              display: "block", width: "100%", textAlign: "left", padding: "12px 16px",
              border: "none", borderRadius: 7,
              background: activePage === n.id ? "rgba(20,110,245,0.14)" : "transparent",
              color: activePage === n.id ? G.accentLight : G.text, fontSize: 14, fontWeight: activePage === n.id ? 700 : 500,
              cursor: "pointer", marginBottom: 2,
            }}>{n.label}</button>
          ))}
        </div>
      )}

      <div ref={mainRef} style={{ maxWidth: 880, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ fontSize: 11.5, color: G.muted, marginBottom: 26, display: "flex", gap: 6, alignItems: "center", fontFamily: "'DM Mono', monospace" }}>
          <span style={{ cursor: "pointer" }} onClick={() => goTo("overview")}>Webflow Review</span>
          {activePage !== "overview" && <>
            <span style={{ color: G.border2 }}>›</span>
            <span style={{ color: G.accentLight, fontWeight: 600 }}>{activeLabel}</span>
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
                  <button onClick={() => goTo(prev.id)} style={{ padding: "10px 18px", background: "transparent", border: `1px solid ${G.border2}`, borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: G.muted }}>
                    ← {prev.label}
                  </button>
                ) : <div />}
                {next && (
                  <button onClick={() => goTo(next.id)} style={{ padding: "10px 18px", background: G.accent, border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", color: "#fff", boxShadow: `0 4px 14px ${G.accentGlow}` }}>
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
