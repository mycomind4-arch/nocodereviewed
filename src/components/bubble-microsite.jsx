import { useState, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   BUBBLE.IO — FULL REVIEW MICROSITE
   no-code-reviewed.lovable.app
   Design: DM Sans · #e8541a accent · #0f0e0d text · #faf8f4 card
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
  // Bubble brand for accents
  bubble: "#1a56db",
  bubbleLight: "#e8f0fe",
};

/* ─── Shared components ─── */
const Badge = ({ children, variant = "neutral" }) => {
  const map = {
    neutral: { bg: "#f0ede7", color: G.muted },
    accent: { bg: "#fde8de", color: G.accent },
    critical: { bg: G.warnBg, color: G.warn },
    good: { bg: G.goodBg, color: G.good },
    warn: { bg: "#fff3e0", color: "#a06000" },
    info: { bg: G.bubbleLight, color: G.bubble },
  };
  const c = map[variant] || map.neutral;
  return (
    <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 99, background: c.bg, color: c.color }}>{children}</span>
  );
};

const ScoreBar = ({ label, score, max = 10 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 38px", alignItems: "center", gap: 12, marginBottom: 14 }}>
    <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
    <div style={{ height: 6, background: G.border, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(score / max) * 100}%`, background: score >= 8 ? G.good : score >= 6 ? G.accent : G.warn, borderRadius: 99 }} />
    </div>
    <span style={{ fontSize: 14, fontWeight: 700, textAlign: "right" }}>{score}</span>
  </div>
);

const Alert = ({ type = "neutral", title, children }) => {
  const map = { neutral: { border: G.border, bg: G.card }, warn: { border: G.warn, bg: G.warnBg }, good: { border: G.good, bg: G.goodBg }, info: { border: G.accent, bg: "#fde8de" }, critical: { border: G.warn, bg: "#2a0a05" } };
  const s = map[type];
  return (
    <div style={{ borderLeft: `4px solid ${s.border}`, background: s.bg, borderRadius: "0 12px 12px 0", padding: "18px 22px", marginBottom: 20 }}>
      {title && <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, color: type === "critical" ? "#f08070" : s.border }}>{title}</div>}
      <div style={{ fontSize: 14, lineHeight: 1.65, color: type === "critical" ? "rgba(250,240,235,0.85)" : "#2e2a25" }}>{children}</div>
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "22px 24px", ...style }}>{children}</div>
);

const SectionHead = ({ eyebrow, title, sub }) => (
  <div style={{ marginBottom: 28 }}>
    {eyebrow && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.accent, marginBottom: 10 }}>{eyebrow}</div>}
    <h2 style={{ fontSize: "clamp(20px,4vw,30px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: sub ? 10 : 0, lineHeight: 1.15 }}>{title}</h2>
    {sub && <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.6, maxWidth: 640 }}>{sub}</p>}
  </div>
);

const Prose = ({ children }) => (
  <p style={{ fontSize: 15, lineHeight: 1.8, color: "#2e2a25", marginBottom: 16 }}>{children}</p>
);

const Divider = () => <div style={{ height: 1, background: G.border, margin: "36px 0" }} />;

const StatPill = ({ num, label }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: "20px 22px", textAlign: "center", flex: "1 1 140px" }}>
    <div style={{ fontSize: 26, fontWeight: 800, color: G.accent, lineHeight: 1 }}>{num}</div>
    <div style={{ fontSize: 12, color: G.muted, marginTop: 6, lineHeight: 1.4 }}>{label}</div>
  </div>
);

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }} style={{ position: "absolute", top: 10, right: 10, padding: "5px 12px", background: copied ? G.good : G.accent, color: "#fff", border: "none", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}>{copied ? "Copied!" : "Copy"}</button>
  );
};

const PromptBlock = ({ text }) => (
  <div style={{ position: "relative", background: "#1a1714", borderRadius: 10, padding: "16px 52px 16px 18px", marginBottom: 14 }}>
    <CopyBtn text={text} />
    <p style={{ color: "#e8e0d5", fontSize: 13, lineHeight: 1.7, fontFamily: "monospace", margin: 0, whiteSpace: "pre-wrap" }}>{text}</p>
  </div>
);

const CheckRow = ({ text, good = true }) => (
  <div style={{ fontSize: 13, lineHeight: 1.6, padding: "5px 0 5px 18px", position: "relative", color: "#2e2a25" }}>
    <span style={{ position: "absolute", left: 0, color: good ? G.good : G.warn, fontWeight: 800 }}>{good ? "✓" : "✗"}</span>{text}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════ */
const NAV = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "learning-curve", label: "Learning Curve" },
  { id: "database", label: "Database & Logic" },
  { id: "mobile", label: "Mobile" },
  { id: "security", label: "Security" },
  { id: "pricing", label: "Pricing & WUs" },
  { id: "comparisons", label: "vs Competitors" },
  { id: "prompts", label: "Prompt Library" },
  { id: "tutorials", label: "Tutorials" },
  { id: "verdict", label: "Verdict" },
];

/* ═══════════════════════════════════════════════════════════
   OVERVIEW
═══════════════════════════════════════════════════════════ */
const PageOverview = ({ goTo }) => (
  <div>
    <div style={{ background: G.text, borderRadius: 20, padding: "48px 40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: G.accent, opacity: 0.1 }} />
      <div style={{ position: "absolute", bottom: -60, left: "45%", width: 180, height: 180, borderRadius: "50%", background: G.bubble, opacity: 0.08 }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.accent, marginBottom: 14 }}>No-Code Reviewed · In-Depth Platform Review</div>
        <h1 style={{ fontSize: "clamp(30px,5vw,50px)", fontWeight: 800, color: "#faf8f4", letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: 18 }}>
          Bubble.io<br />Complete Review 2026
        </h1>
        <p style={{ fontSize: 17, color: "rgba(250,248,244,0.72)", lineHeight: 1.65, maxWidth: 580, marginBottom: 32 }}>
          The most powerful no-code platform ever built — and the most complex one to master. After a decade of development, 3 million apps, and a new native mobile layer, is Bubble still the right choice in 2026?
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => goTo("verdict")} style={{ padding: "13px 26px", background: G.accent, color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>See Our Verdict →</button>
          <button onClick={() => goTo("pricing")} style={{ padding: "13px 26px", background: "rgba(250,248,244,0.1)", color: "#faf8f4", border: "1px solid rgba(250,248,244,0.2)", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Decode the WU Pricing</button>
        </div>
      </div>
    </div>

    {/* Quick scores */}
    <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "20px 28px", marginBottom: 32, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
      {[{ label: "Overall Score", val: "7.9" }, { label: "Power & Depth", val: "9.6" }, { label: "Ease of Use", val: "5.5" }, { label: "Security", val: "8.2" }, { label: "Value", val: "6.8" }].map(item => (
        <div key={item.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: G.accent }}>{item.val}<span style={{ fontSize: 13, color: G.muted, fontWeight: 500 }}> /10</span></div>
          <div style={{ fontSize: 11, color: G.muted, marginTop: 2, letterSpacing: "0.04em" }}>{item.label}</div>
        </div>
      ))}
      <div style={{ marginLeft: "auto" }}><Badge variant="accent">Updated May 2026</Badge></div>
    </div>

    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
      <StatPill num="3M+" label="Apps built on Bubble" />
      <StatPill num="5,300+" label="Plugins in the ecosystem" />
      <StatPill num="400+" label="Free templates available" />
      <StatPill num="~5 months" label="To truly master the platform" />
      <StatPill num="$0–$549" label="Monthly pricing range (web + mobile)" />
    </div>

    <SectionHead eyebrow="What Is Bubble" title="The Original No-Code Powerhouse" sub="Founded in 2012 — Bubble has been doing this longer than anyone else." />
    <Prose>Bubble.io is a visual full-stack development platform that lets you build complex web applications — and now native mobile apps — without writing code. Unlike AI-first tools that generate code from prompts, Bubble uses a visual editor where you define your data types, design your UI, and wire up logic through a workflow system. Everything runs on Bubble's proprietary infrastructure — there's no underlying codebase to export.</Prose>
    <Prose>With over 3 million apps created and a plugin ecosystem of 5,300+ integrations, Bubble has more depth and flexibility than any other no-code platform. But that power comes with a steep learning curve that can take months to climb, and a pricing model built around "workload units" that's notoriously hard to predict at scale.</Prose>
    <Prose>The 2025–2026 period has been transformative for Bubble. Native mobile app building entered public beta in mid-2025, dedicated mobile pricing launched in October 2025, and the AI Copilot feature has been steadily improving. This is a platform in active evolution — but the core fundamentals haven't changed: maximum power, maximum learning investment, no code export.</Prose>

    <Divider />
    <SectionHead eyebrow="At a Glance" title="The Most Important Things to Know" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: G.good, letterSpacing: "0.07em", marginBottom: 14 }}>Where Bubble Wins</div>
        {["Deepest feature set in no-code — full relational DB, complex workflows", "5,300+ plugins fill every gap the platform doesn't cover natively", "Battle-tested at scale: apps serving 1M+ monthly active users", "Stronger security posture than AI code generators", "Best community, documentation, and tutorial library in the category", "New native mobile layer opens iOS/Android without separate tools", "Trusted by enterprises: SOC 2 compliance on Business+ plans"].map(t => <CheckRow key={t} text={t} good={true} />)}
      </Card>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: G.warn, letterSpacing: "0.07em", marginBottom: 14 }}>Where It Struggles</div>
        {["No source code export — permanent vendor lock-in", "~5 months of daily practice to truly master the platform", "Workload Unit pricing spikes costs 3–5x unpredictably at scale", "AI Copilot is weak compared to Lovable, Bolt, and v0", "Performance limitations on poorly optimized high-traffic apps", "Native mobile is still maturing — missing deep links, some plugins", "Expensive relative to competitors for basic apps"].map(t => <CheckRow key={t} text={t} good={false} />)}
      </Card>
    </div>

    <div style={{ marginTop: 24 }}>
      <Alert type="critical">
        <strong style={{ color: "#f08070" }}>The Lock-In Warning:</strong> Bubble does not export your source code. Ever. If you outgrow the platform, change your mind, or Bubble changes its terms, you rebuild from scratch. This is the single most important thing to understand before investing significant time and money into a Bubble project.
      </Alert>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   FEATURES
═══════════════════════════════════════════════════════════ */
const PageFeatures = () => {
  const features = [
    { icon: "🎨", title: "Visual Editor", tier: "All plans", body: "Drag-and-drop canvas for designing responsive web apps. Supports desktop, tablet, and mobile layouts. The new responsive engine (launched 2022, refined since) makes multi-breakpoint design significantly more manageable than older versions, but still requires deliberate effort to get right." },
    { icon: "🗄️", title: "Relational Database", tier: "All plans", body: "Bubble's built-in database supports true relational data — data types with fields, linked things, lists, and complex queries. This is more powerful than what most no-code tools offer and closer to a real backend database in terms of expressiveness." },
    { icon: "⚙️", title: "Workflow Engine", tier: "All plans", body: "Visual workflow builder for defining business logic. Trigger workflows on button clicks, page loads, API calls, scheduled events, or database changes. Supports conditional branching, loops, and multi-step sequences. This is where Bubble's power really lives — and where its learning curve is steepest." },
    { icon: "🔌", title: "Plugin Ecosystem (5,300+)", tier: "All plans", body: "The largest plugin library in no-code. Covers payments (Stripe), maps (Google), charts, AI integrations, calendar widgets, file handling, authentication providers, and essentially anything else you'd need. Quality varies by plugin author — check reviews and update frequency before relying on a plugin." },
    { icon: "🔗", title: "API Connector", tier: "All plans", body: "Connect to any REST API without code. Define API calls, authenticate with OAuth or API keys, map responses to Bubble data types, and trigger API calls inside workflows. Essential for integrating Bubble with external services." },
    { icon: "🤖", title: "AI Copilot", tier: "All plans", body: "Describe what you want to build in natural language and Copilot generates the structure. Good for scaffolding basic app skeletons and generating simple workflow logic. Significantly weaker than Lovable or Bolt for complex apps — more of a learning aid than a full AI builder at this stage." },
    { icon: "📱", title: "Native Mobile Builder", tier: "Mobile plans ($42+/mo)", body: "Entered public beta mid-2025, dedicated pricing since October 2025. Build iOS and Android apps from a single Bubble codebase. Still maturing — deep links and third-party plugin support are in progress. A major step forward but not yet feature-complete compared to FlutterFlow for mobile-first projects." },
    { icon: "🔐", title: "Privacy Rules", tier: "All plans", body: "Bubble's equivalent of row-level security. Define rules that restrict which users can see, create, modify, or delete each data type. Unlike Lovable's Supabase RLS, these are configured inside Bubble's interface rather than in a separate database — which makes them more integrated but equally important to configure correctly." },
    { icon: "🔄", title: "Version Control", tier: "Team+ plans", body: "Development and live versions of your app — make changes in dev, test thoroughly, then deploy to live. Essential for any serious app that can't afford downtime. Not available on Free or Starter." },
    { icon: "👥", title: "Collaboration", tier: "Growth+ plans", body: "Multiple editors on the same app. Growth allows additional collaborators; Team increases limits further. Locked behind paid plans — solo builders on Starter cannot share editor access." },
    { icon: "📊", title: "App Metrics Dashboard", tier: "All plans", body: "Real-time WU usage monitoring, workflow performance, API call counts, and database query analytics. Critical for managing costs — you need to watch this closely to avoid surprise WU overages." },
    { icon: "🌐", title: "Custom Domains", tier: "Starter+ plans", body: "Free plan runs on .bubbleapps.io subdomain. Custom domain requires Starter ($29/mo) or above. SSL included automatically." },
  ];
  return (
    <div>
      <SectionHead eyebrow="Platform Features" title="Everything Bubble Can Do" sub="The deepest feature set in no-code — and what each one actually means in practice." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16, marginBottom: 40 }}>
        {features.map(f => (
          <Card key={f.title}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>{f.icon}</span>
              <Badge variant={f.tier.includes("Mobile") ? "warn" : f.tier.includes("Team") || f.tier.includes("Growth") ? "accent" : "neutral"}>{f.tier}</Badge>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{f.body}</p>
          </Card>
        ))}
      </div>
      <Alert type="good" title="What Bubble Builds Best">
        Complex web applications are Bubble's home territory: SaaS platforms, marketplaces, social networks, CRMs, booking systems, ERPs, and multi-sided platforms. If your app has complex data relationships, multiple user roles, conditional logic across many steps, and integration with external APIs — Bubble is likely the right tool.
      </Alert>
      <Alert type="warn" title="What Bubble Struggles With">
        Real-time collaborative features (think Google Docs-style live editing), extremely high-performance apps requiring sub-100ms response times, native mobile apps with complex OS integrations, and any project where the team might need to migrate off the platform or export the codebase.
      </Alert>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   LEARNING CURVE
═══════════════════════════════════════════════════════════ */
const PageLearningCurve = () => (
  <div>
    <SectionHead eyebrow="Learning Curve" title="The Honest Truth About Learning Bubble" sub="This page exists because no other review is direct enough about what it actually takes to get good at Bubble." />

    <div style={{ background: G.text, borderRadius: 16, padding: "32px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: G.accent, opacity: 0.1 }} />
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.accent, marginBottom: 12 }}>The Honest Number</div>
      <p style={{ color: "rgba(250,248,244,0.9)", fontSize: 18, lineHeight: 1.65, maxWidth: 620 }}>
        <strong style={{ color: "#faf8f4" }}>Approximately five months of daily practice</strong> to truly master Bubble's interface, according to multiple experienced no-code builders and developers who've reviewed the platform in 2026. Even programmers find it difficult. Even experienced no-code builders coming from other platforms find it difficult.
      </p>
    </div>

    <Prose>This is not a criticism — it's a prerequisite for making a good decision. Bubble's learning curve exists because its flexibility is real. The same system that makes it complex is what lets you build things other no-code tools can't. The question is whether that investment is worth it for your specific use case.</Prose>

    <Divider />
    <SectionHead eyebrow="The Three Hard Parts" title="What Actually Takes Time to Learn" />

    {[
      { n: "01", title: "The Data Model", hard: true, body: "Bubble's relational database requires you to think carefully about data types, fields, and relationships before you start building. Things (Bubble's word for records), their fields, and how they link to other Things — this is closer to designing a real database schema than filling in a spreadsheet. Getting this wrong early means refactoring later, which is painful. The learning investment here is front-loaded and high." },
      { n: "02", title: "The Workflow System", hard: true, body: "Bubble's visual workflow editor is powerful but non-intuitive. Workflows trigger from user actions, scheduled events, API calls, or database changes. Each step can be conditional. Workflows can call other workflows. The visual representation becomes spaghetti quickly on complex apps. Understanding how to structure workflows efficiently — when to use backend workflows, when to use front-end, how to handle async operations — takes significant practice." },
      { n: "03", title: "The Responsive Engine", hard: true, body: "Making Bubble apps look good on all screen sizes requires deliberate work with the responsive engine. Setting up containers, understanding how elements collapse and reflow, managing min/max widths — this is markedly harder than responsive design in Webflow or even standard CSS. Most Bubble beginners produce desktop-only apps and have to go back and retrofit responsiveness." },
      { n: "04", title: "Performance Optimization", hard: false, body: "Once you can build in Bubble, the next challenge is building efficiently. Poorly structured workflows and database queries burn WUs exponentially faster than optimized ones. The App Metrics dashboard helps, but understanding why something is slow and how to fix it is an advanced skill." },
      { n: "05", title: "Plugin Evaluation", hard: false, body: "With 5,300+ plugins, evaluating which to trust is itself a skill. Look for: recent updates, high user counts, active developer support, and compatibility with the current Bubble version. Relying on an unmaintained plugin that breaks with a Bubble update is a real risk." },
    ].map(s => (
      <div key={s.n} style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: s.hard ? G.accent : G.border, color: s.hard ? "#fff" : G.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{s.n}</div>
        <Card>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{s.title}</h3>
            {s.hard && <Badge variant="critical">Hardest</Badge>}
          </div>
          <p style={{ fontSize: 14, color: G.muted, lineHeight: 1.65 }}>{s.body}</p>
        </Card>
      </div>
    ))}

    <Divider />
    <SectionHead eyebrow="Resources" title="How to Actually Learn Bubble" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14, marginBottom: 24 }}>
      {[
        { icon: "🎓", title: "Bubble Academy", free: true, body: "Official tutorials and courses from Bubble. Start here. The interactive lessons walk you through each core concept in sequence." },
        { icon: "💬", title: "Bubble Forum", free: true, body: "The most active no-code community online. Search before posting — most problems have been solved before. Extremely responsive to new questions." },
        { icon: "📹", title: "Coaching No Code Apps", free: false, body: "One of the best third-party Bubble tutorial channels. Detailed project walkthroughs that cover real-world app patterns." },
        { icon: "🏕️", title: "Bootcamps (2026)", free: false, body: "Multiple Bubble agencies run intensive bootcamps. Typically €500–1500. CET and US time zones available. High ROI for teams with a specific project to build." },
      ].map(r => (
        <Card key={r.title} style={{ padding: "18px 20px" }}>
          <span style={{ fontSize: 22, marginBottom: 10, display: "block" }}>{r.icon}</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700 }}>{r.title}</h4>
            <Badge variant={r.free ? "good" : "neutral"}>{r.free ? "Free" : "Paid"}</Badge>
          </div>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.55 }}>{r.body}</p>
        </Card>
      ))}
    </div>

    <Alert type="info" title="Bubble vs AI Builders on Learning Curve">
      Lovable and Bolt.new require almost no learning investment — you describe what you want and iterate in plain English. For simple apps, this beats Bubble hands-down. Bubble becomes the right choice when your app complexity exceeds what AI generators can reliably produce — complex data relationships, multi-role access, sophisticated workflow logic. At that threshold, Bubble's upfront learning cost pays for itself in flexibility and reliability.
    </Alert>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   DATABASE & LOGIC
═══════════════════════════════════════════════════════════ */
const PageDatabase = () => (
  <div>
    <SectionHead eyebrow="Database & Logic" title="Bubble's Core Engine" sub="The relational database and workflow system are what separate Bubble from every other no-code tool. Here's how they actually work." />

    <Alert type="good" title="Why This Matters">
      Most no-code tools treat data as simple spreadsheets. Bubble's database supports true relational data — linked records, lists of Things, nested data types, and complex filtered queries. This is the foundation that lets Bubble build apps like marketplaces, SaaS platforms, and CRMs that would be impossible on simpler tools.
    </Alert>

    <SectionHead eyebrow="The Database" title="Data Types, Things & Fields" />
    <Prose>In Bubble, your database is made up of Data Types — equivalent to database tables. Each Data Type has Fields — equivalent to columns. A field can be a text, number, date, boolean, file, another Thing (creating a relationship), or a list of Things. This relational structure is more expressive than flat databases in tools like Glide or Softr, and close to what you'd design in PostgreSQL.</Prose>

    <Card style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.muted, marginBottom: 16 }}>Example: Marketplace Data Model</div>
      {[
        { type: "User", fields: "Name (text) · Email (text) · Role (option set: buyer/seller) · Listings (list of Listing)" },
        { type: "Listing", fields: "Title (text) · Price (number) · Seller (User) · Images (list of files) · Status (option: active/sold)" },
        { type: "Order", fields: "Buyer (User) · Listing (Listing) · Amount (number) · Created (date) · Status (option: pending/complete)" },
        { type: "Review", fields: "Order (Order) · Rating (number 1-5) · Comment (text) · Reviewer (User)" },
      ].map((r, i) => (
        <div key={r.type} style={{ padding: "12px 0", borderBottom: i < 3 ? `1px solid ${G.border}` : "none" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{r.type}</div>
          <div style={{ fontSize: 13, color: G.muted, fontFamily: "monospace" }}>{r.fields}</div>
        </div>
      ))}
    </Card>

    <SectionHead eyebrow="Workflows" title="Bubble's Logic Engine" />
    <Prose>Workflows are the heartbeat of every Bubble app. A workflow says: when X happens, do Y (and then Z, and then W, under condition C). Triggers can be button clicks, page loads, API calls, scheduled intervals, database events, or custom states changing. Each step in a workflow can create, update, or delete data; call an API; send an email; change a page state; navigate to a page; or trigger another workflow.</Prose>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
      {[
        { title: "Frontend Workflows", body: "Run in the user's browser. Triggered by UI events like button clicks. Good for: page navigation, showing/hiding elements, setting states, simple data creation. Cheaper on WUs." },
        { title: "Backend Workflows", body: "Run on Bubble's servers. Triggered by API calls, schedules, or other workflows. Required for: bulk data operations, scheduled jobs, sensitive logic that shouldn't run client-side. Can run in parallel." },
        { title: "Recursive Workflows", body: "Workflows that call themselves — Bubble's way of doing loops. Iterate over a list of Things one at a time. Powerful but easy to accidentally run infinitely. WU costs can spike." },
        { title: "API Workflows", body: "Expose Bubble backend workflows as API endpoints. Essential for connecting Bubble to external services, webhooks, and third-party tools." },
      ].map(w => (
        <Card key={w.title}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{w.title}</h4>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.6 }}>{w.body}</p>
        </Card>
      ))}
    </div>

    <SectionHead eyebrow="Privacy Rules" title="Data Security in Bubble" />
    <Alert type="info" title="Better Than You Might Expect">
      Unlike AI code generators where auth can be misconfigured invisibly, Bubble's privacy rules are a first-class feature configured in the Data tab. You explicitly define who can find, view, create, modify, and delete each data type. When properly configured, these rules enforce data isolation at the platform level — not in client-side code that can be bypassed.
    </Alert>
    <Prose>The critical difference from Supabase RLS (as used in Lovable): Bubble's privacy rules are configured inside Bubble's interface, not in a separate database. This makes them more integrated but equally easy to misconfigure. Always test privacy rules with multiple user accounts before launch — and specifically test whether one user can access another user's data through direct API calls or URL manipulation.</Prose>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MOBILE
═══════════════════════════════════════════════════════════ */
const PageMobile = () => (
  <div>
    <SectionHead eyebrow="Native Mobile" title="Bubble's Mobile Story in 2026" sub="Native mobile launched in beta mid-2025. Here's where it stands, what it can do, and where it still has gaps." />

    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
      <StatPill num="Mid-2025" label="Native mobile entered public beta" />
      <StatPill num="Oct 2025" label="Dedicated mobile pricing launched" />
      <StatPill num="$42/mo" label="Mobile-only plan starting price" />
      <StatPill num="$59/mo" label="Web + Mobile combined plan minimum" />
    </div>

    <Alert type="good" title="What's Now Possible">
      Bubble's native mobile builder lets you build iOS and Android apps from a single Bubble editor, compile native builds, and distribute through the App Store and Google Play. Previously, Bubble was web-only — mobile meant progressive web apps with compromised performance and limited device access.
    </Alert>

    <SectionHead eyebrow="Capabilities" title="What the Mobile Builder Does" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14, marginBottom: 28 }}>
      {[
        { icon: "📱", title: "Single Codebase", good: true, body: "Build once, compile to both iOS and Android. Web and mobile apps share the same Bubble database and backend logic." },
        { icon: "🏪", title: "App Store Distribution", good: true, body: "Compile native builds and submit directly to the Apple App Store and Google Play Store." },
        { icon: "🔔", title: "Push Notifications", good: true, body: "Native push notifications — not available in progressive web apps. A major capability unlocked by the native mobile layer." },
        { icon: "📷", title: "Device Features", good: true, body: "Camera, GPS, haptics, and other native device APIs accessible through the mobile builder." },
        { icon: "🔗", title: "Deep Links", good: false, body: "Still in progress as of May 2026. Deep linking (navigating to a specific in-app screen from an external URL) is not yet fully supported." },
        { icon: "🔌", title: "Third-Party Plugins", good: false, body: "Not all web plugins work in the mobile builder. The ecosystem is catching up but mobile plugin support is still limited compared to web." },
      ].map(f => (
        <Card key={f.title} style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>{f.icon}</span>
            <Badge variant={f.good ? "good" : "warn"}>{f.good ? "Available" : "In Progress"}</Badge>
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.title}</h4>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.55 }}>{f.body}</p>
        </Card>
      ))}
    </div>

    <Alert type="warn" title="Mobile Pricing Is Separate — And Adds Up">
      Web and mobile plans are priced separately. A web app at $29/mo + a mobile app at $42/mo = $71/mo minimum. The combined Web + Mobile plan at $59/mo is the most cost-effective option if you need both. WU allocations are shared across web and mobile in combined plans — heavy mobile usage can deplete your web WU budget.
    </Alert>

    <Divider />
    <SectionHead eyebrow="Bubble vs FlutterFlow" title="Should You Use Bubble or FlutterFlow for Mobile?" />
    <Card>
      {[
        { factor: "Mobile-first apps", bubble: "Works, still maturing", flutter: "Native-first, more mature" },
        { factor: "Web app required too", bubble: "Same codebase for both ✓", flutter: "Separate web implementation" },
        { factor: "Plugin ecosystem", bubble: "5,300+ (web), mobile growing", flutter: "Strong Flutter ecosystem" },
        { factor: "Code export", bubble: "No export ever", flutter: "Exports Flutter/Dart code" },
        { factor: "Deep links", bubble: "In progress", flutter: "Fully supported" },
        { factor: "Learning curve", bubble: "Very high", flutter: "High (Flutter concepts)" },
        { factor: "Price (mobile)", bubble: "$42/mo+", flutter: "$80/mo/seat" },
      ].map((r, i) => (
        <div key={r.factor} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, padding: "11px 0", borderBottom: i < 6 ? `1px solid ${G.border}` : "none", fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>{r.factor}</span>
          <span style={{ color: G.muted }}>{r.bubble}</span>
          <span style={{ color: G.muted }}>{r.flutter}</span>
        </div>
      ))}
    </Card>
    <p style={{ fontSize: 13, color: G.muted, marginTop: 12 }}>Verdict: Choose Bubble if you're already on Bubble for web and need mobile too. Choose FlutterFlow if mobile is your primary target and code export matters.</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   SECURITY
═══════════════════════════════════════════════════════════ */
const PageSecurity = () => (
  <div>
    <SectionHead eyebrow="Security" title="Bubble's Security Posture" sub="A significantly stronger picture than AI code generators — but with its own specific risks." />

    <Alert type="good" title="The Good News First">
      Bubble's security posture is substantially better than AI-generated code platforms like Lovable and Bolt.new. Privacy rules are a first-class feature, not an afterthought. SOC 2 compliance is available on Business plans. GDPR and HIPAA compliance options exist. There are no documented incidents comparable to Lovable's 2026 BOLA vulnerability or permission regression.
    </Alert>

    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
      <StatPill num="SOC 2" label="Compliance on Business+ plans" />
      <StatPill num="GDPR" label="Compliant infrastructure available" />
      <StatPill num="HIPAA" label="Available with BAA on Enterprise" />
      <StatPill num="0" label="Documented major security incidents in 2026" />
    </div>

    <SectionHead eyebrow="Built-In Security" title="What Bubble Provides" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14, marginBottom: 28 }}>
      {[
        { icon: "🔐", title: "Privacy Rules", body: "First-class data access control. Define who can find, view, create, and modify each data type. Enforced at the platform level, not in client code." },
        { icon: "🔑", title: "Authentication", body: "Built-in email/password auth, plus OAuth integrations with Google, Facebook, and others via plugins. 2FA available." },
        { icon: "🛡️", title: "SOC 2 Type II", body: "Available on Business and Enterprise plans. Required for most enterprise sales cycles and many regulated industries." },
        { icon: "📋", title: "GDPR Compliance", body: "Data processing agreements, data residency options, and privacy controls meet GDPR requirements for EU data subjects." },
        { icon: "🏥", title: "HIPAA (Enterprise)", body: "Business Associate Agreement available on Enterprise. Required for any healthcare application handling PHI." },
        { icon: "🔄", title: "Version Control", body: "Development environment separate from production — test security changes before deploying. Available on Team+ plans." },
        { icon: "🌍", title: "HTTPS Everywhere", body: "All Bubble apps served over HTTPS by default. SSL certificates provisioned and renewed automatically." },
        { icon: "🔒", title: "API Token Auth", body: "Secure API workflows with token-based authentication. Control which external services can trigger backend workflows." },
      ].map(f => (
        <Card key={f.title} style={{ padding: "16px 18px" }}>
          <span style={{ fontSize: 20, marginBottom: 8, display: "block" }}>{f.icon}</span>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{f.title}</h4>
          <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.55 }}>{f.body}</p>
        </Card>
      ))}
    </div>

    <Divider />
    <SectionHead eyebrow="Risks to Know" title="Bubble-Specific Security Risks" />

    {[
      { title: "Privacy Rule Misconfiguration", severity: "High", body: "The most common Bubble security failure. Privacy rules that are too permissive (or not set at all) allow users to access other users' data. Bubble doesn't enforce any privacy rules by default — you have to explicitly create them for every data type. Always test with multiple accounts before launch." },
      { title: "No Source Code Audit", severity: "Medium", body: "Unlike code-based platforms where a developer can audit the codebase, Bubble's logic lives in a proprietary format. You can't run a static analysis tool on your Bubble app. Security review requires testing every data access pathway manually." },
      { title: "Third-Party Plugin Trust", severity: "Medium", body: "Plugins can access your Bubble database and user data. A malicious or compromised plugin could exfiltrate data. Stick to plugins from established developers with verified track records and regular updates." },
      { title: "Vendor Lock-In as a Risk", severity: "Low", body: "If Bubble experiences a major security incident affecting the platform infrastructure, you have no code to migrate. You're dependent on Bubble's response and remediation. This is a systemic risk, not an application-layer one." },
    ].map(r => (
      <Card key={r.title} style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>{r.title}</h3>
          <Badge variant={r.severity === "High" ? "critical" : r.severity === "Medium" ? "warn" : "neutral"}>{r.severity}</Badge>
        </div>
        <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.65 }}>{r.body}</p>
      </Card>
    ))}

    <Divider />
    <SectionHead eyebrow="Checklist" title="Security Checklist for Bubble Apps" />
    <Card>
      {["Set privacy rules on every single data type before launch — don't leave any unprotected", "Test privacy rules logged in as two different user accounts — verify one cannot see the other's data", "Enable 2FA for admin accounts through your auth plugin", "Audit every plugin for last-update date and user reviews before relying on it", "Use development/live environments (Team+) — never test security changes on live apps", "Review your API workflow authentication tokens and rotate them periodically", "If on Business plan or above, enable SOC 2 compliance documentation for enterprise clients", "For healthcare or finance apps, arrange a HIPAA BAA with Bubble before storing any PHI"].map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 7 ? `1px solid ${G.border}` : "none" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fde8de", color: G.accent, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item}</p>
        </div>
      ))}
    </Card>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PRICING & WUs
═══════════════════════════════════════════════════════════ */
const PagePricing = () => {
  const webPlans = [
    { name: "Free", price: "$0", wus: "50K WUs/mo", domain: "No custom domain", collab: "Solo only", vc: "No", highlight: false, note: "Learning and prototyping only. Cannot publish to custom domain." },
    { name: "Starter", price: "$29/mo", wus: "175K WUs/mo", domain: "Custom domain ✓", collab: "Solo + 1", vc: "No", highlight: false, note: "Minimum viable plan for a live app. Limited collaboration and no version control." },
    { name: "Growth", price: "$119/mo", wus: "250K WUs/mo", domain: "Custom domain ✓", collab: "Multiple editors", vc: "No", highlight: true, note: "Right fit for live SaaS products with real users and a small team." },
    { name: "Team", price: "$349/mo", wus: "500K WUs/mo", domain: "Custom domain ✓", collab: "Full team", vc: "Yes ✓", highlight: false, note: "Business-critical apps needing version control and larger team collaboration." },
    { name: "Enterprise", price: "Custom", wus: "Custom", domain: "Custom domain ✓", collab: "Custom", vc: "Yes ✓", highlight: false, note: "SOC 2, HIPAA BAA, SLA, dedicated support, custom infrastructure." },
  ];

  return (
    <div>
      <SectionHead eyebrow="Pricing & Workload Units" title="Bubble's Pricing — Fully Decoded" sub="The most confusing pricing model in no-code, explained plainly. Understand this before you commit." />

      <div style={{ background: "#1a0a00", borderRadius: 16, padding: "28px 32px", marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.accent, marginBottom: 12 }}>The #1 Thing to Understand</div>
        <p style={{ color: "rgba(250,240,235,0.88)", fontSize: 17, lineHeight: 1.65 }}>
          Bubble's plan tier determines your features. <strong style={{ color: "#faf8f4" }}>Workload Units determine your actual costs.</strong> Two apps on the same Growth plan can have wildly different monthly costs depending on how they're built and how much traffic they get. A poorly optimized app can burn through WUs 3–5x faster than an efficient one — on identical user volumes.
        </p>
      </div>

      <SectionHead eyebrow="Workload Units Explained" title="What Are WUs and What Consumes Them?" />
      <Prose>Workload Units (WUs) measure server processing effort. Every time your app does something on Bubble's servers, it costs WUs. The more complex the operation and the more data involved, the more WUs it costs.</Prose>

      <Card style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.muted, marginBottom: 16 }}>What Consumes Workload Units</div>
        {[
          { action: "Database search (basic)", cost: "Low", note: "Simple lookup by ID" },
          { action: "Database search with multiple filters", cost: "Medium", note: "Scales with result set size" },
          { action: "Backend workflow execution", cost: "Medium–High", note: "Depends on workflow complexity" },
          { action: "API call (external service)", cost: "Medium", note: "Both triggering and receiving" },
          { action: "Recursive workflow (loop)", cost: "High", note: "Multiplies by iteration count" },
          { action: "Page load (simple)", cost: "Low", note: "Basic element renders" },
          { action: "File/image processing", cost: "High", note: "Scales with file size" },
          { action: "Scheduled backend workflows", cost: "Ongoing", note: "Run even with zero users" },
        ].map((r, i) => (
          <div key={r.action} style={{ display: "grid", gridTemplateColumns: "1fr 80px 200px", gap: 16, padding: "10px 0", borderBottom: i < 7 ? `1px solid ${G.border}` : "none", fontSize: 13, alignItems: "center" }}>
            <span>{r.action}</span>
            <Badge variant={r.cost === "Low" ? "good" : r.cost === "High" || r.cost === "Ongoing" ? "critical" : "warn"}>{r.cost}</Badge>
            <span style={{ color: G.muted }}>{r.note}</span>
          </div>
        ))}
      </Card>

      <Alert type="warn" title="The Overage Trap">
        Exceeding your monthly WU allocation costs <strong>$0.30 per 1,000 WUs</strong>. That sounds cheap — until your recursive workflow runs on 10,000 records and your app goes viral in the same month. Monitor your WU consumption in the App Metrics dashboard daily during launch. Upgrade proactively rather than paying overage rates, which are always more expensive than the next tier up.
      </Alert>

      <Divider />
      <SectionHead eyebrow="Web Plans" title="Full Plan Comparison" />
      <div style={{ overflowX: "auto", marginBottom: 28 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ background: G.text, color: G.card }}>
              {["Plan", "Price", "WUs/mo", "Custom Domain", "Collaboration", "Version Control", "Notes"].map((h, i) => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, borderRadius: i === 0 ? "8px 0 0 0" : i === 6 ? "0 8px 0 0" : 0 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {webPlans.map((p, i) => (
              <tr key={p.name} style={{ background: p.highlight ? "#fde8de" : G.card }}>
                <td style={{ padding: "12px 14px", fontWeight: 700, fontSize: 13, borderBottom: `1px solid ${G.border}` }}>{p.name}{p.highlight && <span style={{ marginLeft: 6, fontSize: 10, background: G.accent, color: "#fff", padding: "2px 6px", borderRadius: 99, fontWeight: 800 }}>Popular</span>}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: G.accent, borderBottom: `1px solid ${G.border}` }}>{p.price}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, borderBottom: `1px solid ${G.border}` }}>{p.wus}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, borderBottom: `1px solid ${G.border}` }}>{p.domain}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, borderBottom: `1px solid ${G.border}` }}>{p.collab}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, borderBottom: `1px solid ${G.border}` }}>{p.vc}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: G.muted, borderBottom: `1px solid ${G.border}` }}>{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Alert type="info" title="Web + Mobile Plans">
        Combined Web + Mobile plans start at $59/mo (vs $29 web + $42 mobile = $71 separately). If you need both, the combined plan saves money and shares a single backend. Mobile-only plans start at $42/mo. Mobile pricing tiers mirror web tiers in structure — Starter, Growth, Team, Enterprise.
      </Alert>

      <Divider />
      <SectionHead eyebrow="Real-World Cost Guide" title="What Will It Actually Cost?" />
      <Card>
        {[
          { stage: "Learning & prototyping", plan: "Free", cost: "$0/mo", note: "No custom domain — fine for testing" },
          { stage: "Small internal tool (solo)", plan: "Starter", cost: "$29/mo", note: "Low WU usage, single builder" },
          { stage: "Early MVP, first real users", plan: "Starter → Growth", cost: "$29–$119/mo", note: "Watch WUs closely at launch" },
          { stage: "Live SaaS, 500–2K users", plan: "Growth", cost: "$119–$200/mo", note: "May need WU add-ons" },
          { stage: "Live SaaS, 2K–20K users", plan: "Growth + WU add-ons", cost: "$200–$500/mo", note: "Optimization critical here" },
          { stage: "Business-critical team app", plan: "Team", cost: "$349+/mo", note: "Version control worth the jump" },
          { stage: "Enterprise / regulated industry", plan: "Enterprise", cost: "Custom", note: "Budget $800–$2,000+/mo" },
        ].map((r, i) => (
          <div key={r.stage} style={{ display: "grid", gridTemplateColumns: "1fr 120px 130px 200px", gap: 12, padding: "11px 0", borderBottom: i < 6 ? `1px solid ${G.border}` : "none", fontSize: 13, alignItems: "center" }}>
            <span style={{ fontWeight: 500 }}>{r.stage}</span>
            <Badge variant="neutral">{r.plan}</Badge>
            <span style={{ fontWeight: 700, color: G.accent }}>{r.cost}</span>
            <span style={{ color: G.muted }}>{r.note}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   COMPARISONS
═══════════════════════════════════════════════════════════ */
const PageComparisons = () => {
  const comps = [
    { name: "Lovable", summary: "AI-first app builder. Lovable is faster to start and requires zero learning investment. Bubble is more powerful and has better security fundamentals. The choice comes down to complexity: Lovable for MVPs and simple apps, Bubble when you need sophisticated data models and workflows.", rows: [["Ease of start", "5–10min from idea to app", "Weeks to months of learning"], ["App complexity ceiling", "Medium — hits limits on complex logic", "Very high — few hard limits"], ["Security", "3 major incidents in H1 2026", "Stronger — privacy rules built-in"], ["Code ownership", "Export to GitHub anytime", "No code export — ever"], ["AI generation", "Core feature ✓", "Copilot — basic only"], ["Pricing model", "Credits (unpredictable at scale)", "WUs (unpredictable at scale)"]] },
    { name: "Webflow", summary: "Webflow is a design-first tool for marketing sites and content-driven websites. Bubble is an app-first tool for functional web applications. They rarely compete directly — if you're building a website, Webflow. If you're building a web app, Bubble.", rows: [["Best for", "Marketing sites, CMS, portfolios", "Web apps, SaaS, marketplaces"], ["Database", "Basic CMS fields only", "Full relational database"], ["Workflow logic", "None", "Complex visual workflows"], ["Design quality ceiling", "Very high — designer-grade", "Lower — UI is functional"], ["E-commerce", "Native, polished", "Via plugins only"], ["Code export", "Partial HTML/CSS", "No export ever"]] },
    { name: "FlutterFlow", summary: "Both now build mobile apps. FlutterFlow exports real Flutter/Dart code and is more mature for mobile-first projects. Bubble wins if you need both web and mobile from one codebase, and you're already invested in Bubble.", rows: [["Code export", "Full Flutter/Dart export ✓", "No export ever"], ["Mobile maturity", "Mature, full-featured", "Beta — missing deep links, plugins"], ["Web + Mobile", "Separate web implementation", "Single shared codebase ✓"], ["Price", "$80/mo/seat", "$59/mo (web + mobile combined)"], ["Learning curve", "High (Flutter concepts)", "Very high (Bubble concepts)"], ["Plugin ecosystem", "Flutter ecosystem", "5,300+ web, mobile growing"]] },
    { name: "Retool", summary: "Retool is purpose-built for internal tools used by technical teams. Bubble can also build internal tools but doesn't require coding knowledge. Retool wins for teams with developer resources who need to connect directly to databases and APIs.", rows: [["Target audience", "Non-technical founders", "Developers and ops teams"], ["Database connections", "Built-in Bubble DB only", "Connect any DB directly"], ["App types", "Consumer-facing + internal", "Internal tools primarily"], ["Learning curve", "Very high (no-code)", "High (requires API/DB knowledge)"], ["Pricing", "$29–$349/mo", "$50,000+/yr typical enterprise"], ["Best for", "Complex no-code apps", "Internal dashboards and admin panels"]] },
  ];

  return (
    <div>
      <SectionHead eyebrow="vs The Competition" title="Bubble vs Every Major Alternative" sub="Four honest head-to-head comparisons for the most common decision scenarios." />
      {comps.map(c => (
        <div key={c.name} style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Bubble vs {c.name}</h3>
          <Prose>{c.summary}</Prose>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: G.text, color: G.card, fontSize: 12, fontWeight: 700, padding: "10px 20px", letterSpacing: "0.06em", gap: 16 }}>
              <span>Factor</span><span>Bubble</span><span>{c.name}</span>
            </div>
            {c.rows.map(([factor, bubble, comp], i) => (
              <div key={factor} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "11px 20px", borderBottom: i < c.rows.length - 1 ? `1px solid ${G.border}` : "none", fontSize: 13, gap: 16 }}>
                <span style={{ fontWeight: 600 }}>{factor}</span>
                <span style={{ color: G.muted }}>{bubble}</span>
                <span style={{ color: G.muted }}>{comp}</span>
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PROMPT LIBRARY
═══════════════════════════════════════════════════════════ */
const PagePrompts = () => {
  const [cat, setCat] = useState("SaaS & Marketplaces");
  const library = {
    "SaaS & Marketplaces": [
      { title: "Two-Sided Marketplace", prompt: `Build a two-sided marketplace in Bubble for freelance services.\n\nData Types:\n- User: name, email, role (client/freelancer), avatar, bio\n- Service: title, description, price, category, seller (User), images, status\n- Order: buyer (User), service (Service), amount, status (pending/active/complete), created date\n- Review: order (Order), rating (1–5), comment, reviewer (User)\n\nPages needed:\n1. Home — searchable service listings with category filter\n2. Service detail page — description, seller info, reviews, Book Now button\n3. Seller dashboard — manage services, view orders, earnings summary\n4. Buyer dashboard — active and past orders\n5. Admin panel — approve/reject services, user management\n\nPrivacy Rules: Users can only see their own Orders and Reviews. Services are public only if status = active.` },
      { title: "SaaS App with Subscription Billing", prompt: `Create a SaaS project management tool in Bubble with Stripe subscription billing.\n\nData Types:\n- User: name, email, plan (free/pro/team), stripe_customer_id, subscription_status\n- Workspace: name, owner (User), members (list of Users)\n- Project: workspace (Workspace), name, description, status\n- Task: project (Project), title, assignee (User), due_date, priority, status\n\nSubscription tiers:\n- Free: 1 workspace, 3 projects, solo only\n- Pro ($15/mo): 3 workspaces, unlimited projects, invite 5 members\n- Team ($49/mo): unlimited workspaces, unlimited projects, unlimited members\n\nBuild: Stripe webhook backend workflow to update plan on subscription change. Gate features based on User.plan field. Show upgrade prompts when free users hit limits.` },
    ],
    "Internal Tools": [
      { title: "Employee Directory & Org Chart", prompt: `Build an internal employee directory in Bubble.\n\nData Types:\n- Employee: name, email, title, department, manager (Employee), photo, start_date, bio, skills (list of text)\n- Department: name, head (Employee), description\n\nPages:\n1. Directory — searchable list with filter by department, sort by name or start date\n2. Employee profile — full info, reporting chain, direct reports list\n3. Org chart view — visual hierarchy using nested repeating groups\n4. Admin panel — add/edit/archive employees, manage departments\n\nPrivacy: All employees can view all profiles. Only admins can edit. Archived employees hidden from directory but accessible to admins.` },
      { title: "Inventory Management System", prompt: `Create an inventory management system in Bubble.\n\nData Types:\n- Item: name, SKU, category, quantity, reorder_point, cost_price, sale_price, supplier\n- Supplier: name, contact, email, lead_time_days\n- Transaction: item (Item), type (restock/sale/adjustment), quantity, date, note, user (User)\n- PurchaseOrder: supplier (Supplier), items (list of Items), status, expected_date\n\nWorkflows:\n- When Transaction created with type=sale: decrease Item quantity by transaction quantity\n- When Item.quantity drops below reorder_point: create alert record and send email to admin\n\nPages: Dashboard (low stock alerts, recent transactions), Item list, Item detail with transaction history, Suppliers, Purchase orders` },
    ],
    "Community & Social": [
      { title: "Community Forum", prompt: `Build a community discussion forum in Bubble.\n\nData Types:\n- User: username, bio, avatar, join_date, post_count\n- Category: name, description, icon, post_count\n- Post: title, body, author (User), category (Category), created, views, upvotes (number), tags (list of text)\n- Comment: post (Post), body, author (User), created, upvotes\n- Vote: user (User), post (Post), type (up/down) — prevent duplicate votes via privacy rules\n\nPages:\n1. Home — hot posts (sorted by upvotes last 7 days), recent, category nav\n2. Category page — posts in category, sort by hot/new/top\n3. Post detail — full post, nested comments, upvote button\n4. User profile — post history, join date, stats\n5. Submit post form\n\nPrivacy: Users can only delete their own posts. Admins can delete any post. Votes are private.` },
    ],
    "Workflows & Automation": [
      { title: "Lead CRM with Email Sequences", prompt: `Build a sales CRM in Bubble with automated email sequences.\n\nData Types:\n- Lead: name, email, company, source, status (new/contacted/qualified/won/lost), assigned_to (User), created, notes\n- EmailSequence: name, trigger_status (text), steps (list of EmailStep)\n- EmailStep: sequence (EmailSequence), delay_days (number), subject, body\n- EmailLog: lead (Lead), step (EmailStep), sent_date, opened (boolean)\n\nBackend Workflows:\n- When Lead.status changes: check if EmailSequence exists for new status, schedule first EmailStep\n- Scheduled: each day, check EmailLogs for steps due, send emails, create next scheduled step\n\nPages: Lead pipeline board (kanban by status), Lead detail with timeline, Email sequence builder, Analytics (conversion by source, step open rates)` },
      { title: "Approval Workflow System", prompt: `Create a multi-step approval system in Bubble for expense requests.\n\nData Types:\n- Request: submitter (User), amount, category, description, receipts (list of files), status (draft/pending/approved/rejected), current_step (number)\n- ApprovalStep: request (Request), approver (User), step_number, decision (pending/approved/rejected), comment, decided_at\n- ApprovalChain: name, steps (list of Users)\n\nWorkflows:\n- On submit: create ApprovalStep for step 1 approver, send email, set status=pending\n- On step approved: if more steps remain, create next ApprovalStep and notify; else set Request.status=approved\n- On step rejected: set Request.status=rejected, notify submitter\n\nPages: My Requests dashboard, Submit request form, Pending approvals (for approvers), Admin: approval chains config, Analytics: avg approval time, rejection reasons` },
    ],
    "Data & Analytics": [
      { title: "Client Reporting Dashboard", prompt: `Build a client-facing analytics dashboard in Bubble.\n\nData Types:\n- Client: name, logo, primary_color, contact_email\n- Report: client (Client), month, year, status (draft/published)\n- Metric: report (Report), name, value (number), previous_value, unit (text), type (revenue/traffic/conversion/custom)\n- Chart: report (Report), title, type (bar/line/donut), data_labels (list of text), data_values (list of numbers)\n\nPages:\n1. Client login — magic link auth, no password\n2. Report list — all published reports for this client\n3. Report detail — KPI cards (with delta % vs previous), charts using Chart.js plugin, commentary text blocks\n4. Admin: report builder — create reports, add metrics, write commentary, toggle published\n\nPrivacy: Clients can ONLY see their own reports and metrics. Never another client's data.` },
    ],
  };

  return (
    <div>
      <SectionHead eyebrow="Prompt Library" title="Bubble App Blueprints" sub="These aren't just prompts — they're complete data model designs ready to paste into Bubble's AI Copilot or use as your own planning blueprint." />
      <Alert type="info" title="How to Use These">
        Paste into Bubble's AI Copilot for an initial scaffold, or use them as your own planning reference when setting up data types and workflows manually. The data model section of each blueprint is the most valuable part — copying this into Copilot gives it the context to generate a much more accurate starting structure.
      </Alert>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28, background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: 6 }}>
        {Object.keys(library).map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: "8px 14px", border: "none", borderRadius: 8, background: cat === c ? G.accent : "transparent", color: cat === c ? "#fff" : G.muted, fontSize: 13, fontWeight: cat === c ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>{c}</button>
        ))}
      </div>

      {library[cat].map(item => (
        <div key={item.title} style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
          <PromptBlock text={item.prompt} />
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   TUTORIALS
═══════════════════════════════════════════════════════════ */
const PageTutorials = () => {
  const [active, setActive] = useState(0);
  const tutorials = [
    {
      title: "Your First Bubble App in One Sitting",
      level: "Beginner", time: "45 min",
      steps: [
        { title: "Create your account and orient the editor", body: "Sign up at bubble.io and create a new app. Choose 'Blank app' — don't start from a template for learning purposes. You'll see four main tabs at the top of the left panel: Design (the canvas), Workflow (logic), Data (your database), and Styles. Spend 5 minutes clicking through each tab without doing anything — just understand what lives where. The Design tab is your visual editor; it's where you'll spend most of your time." },
        { title: "Set up your data types first", body: "Before touching the canvas, go to the Data tab. Click 'Add a type' and create your first data type — for this tutorial, create a 'Task' type with fields: Name (text), Done (yes/no), Created By (User), Priority (option set: Low, Medium, High). Setting up your data model before building your UI is the single best habit you can develop as a Bubble builder. It prevents painful refactoring later." },
        { title: "Build the UI on the canvas", body: "Go to the Design tab. Drag a Repeating Group from the element panel onto the canvas — this is the core element for displaying lists of data. Set its data source to 'Search for Tasks' with a constraint of 'Created By = Current User'. Add a text element inside the repeating group cell and set its content to 'Current cell's Task's Name'. Now drag an Input element and a Button below the repeating group — this will be your 'Add task' form." },
        { title: "Wire up the workflow", body: "Click the 'Add Task' button, then click the Workflow tab. Create a workflow triggered by 'Button is clicked'. Add an action: 'Create a new Thing > Task' with Name = Input's value, Done = no, Created By = Current User, Priority = Medium. Add a second action: 'Reset inputs' to clear the input field after submission. Run the preview and test it — type a task name, click the button, watch it appear in the list." },
        { title: "Add a complete action", body: "Click the task text in the repeating group cell. Create a workflow: when clicked, 'Make changes to a thing > Current cell's Task, Done = yes'. Back in Design, add a conditional on the text element: when 'Current cell's Task's Done is yes', change font to strikethrough. Preview and test — clicking a task should strike it through." },
        { title: "Set privacy rules", body: "Go to Data > Privacy. Select the Task type. Add a rule: 'Find this in searches' — condition: 'This Task's Created By = Current User'. This ensures each user only sees their own tasks. Without this rule, all tasks from all users would be visible to each other. Test by creating two test accounts and verifying one cannot see the other's tasks." },
      ],
    },
    {
      title: "Designing the Data Model for a Complex App",
      level: "Intermediate", time: "30 min",
      steps: [
        { title: "Start with entities, not screens", body: "The most common Bubble beginner mistake is starting with the UI. Before you open the Design tab, write down every 'thing' in your app — every noun. For a job board: Job, Company, Application, User, Message. Each noun is probably a data type. This thinking exercise saves hours of refactoring." },
        { title: "Define fields and their types carefully", body: "For each data type, list every piece of information you need to store. Use Bubble's field types intentionally: text for short strings, long text for paragraphs, number for values you'll do math on (don't use text for prices), date for timestamps, yes/no for booleans, option set for fixed categories, another data type for relationships, list of [type] for one-to-many relationships." },
        { title: "Map the relationships", body: "Draw your data model on paper. For every relationship between data types, decide the direction. A Job belongs to a Company (Job has a Company field). A Company has many Jobs (search for Jobs where Company = this Company — don't store a list on Company). A User can apply to many Jobs and a Job can have many Applications — the Application is its own data type linking User and Job." },
        { title: "Use option sets for fixed categories", body: "Anywhere you have a fixed list of categories — status types, priority levels, user roles — use Option Sets rather than text fields. Go to Data > Option Sets to create them. Option Sets are faster to query, prevent typos, and make conditional logic much cleaner. Never use raw text for statuses like 'pending', 'active', 'complete' — create an Option Set." },
        { title: "Plan for privacy before building", body: "For each data type, ask: who should be able to see this? Create this? Modify this? Delete this? Write it down. Then implement privacy rules in the Data > Privacy tab before you build a single workflow. It's 10x harder to retrofit privacy rules into a finished app than to set them correctly from the start." },
      ],
    },
    {
      title: "Monitoring & Optimizing Workload Units",
      level: "Intermediate", time: "40 min",
      steps: [
        { title: "Find your WU dashboard", body: "In your Bubble editor, go to Settings > App Metrics. This shows your WU consumption over time — hourly, daily, and monthly views. Look for spikes: sudden increases in WU consumption that don't match user activity spikes indicate an inefficient workflow, possibly a recursive workflow running more times than intended or an API call being triggered in a loop." },
        { title: "Identify your top consumers", body: "The Metrics dashboard breaks WU consumption by source: page loads, backend workflows, API calls, database operations. Identify which category is consuming the most WUs. If backend workflows dominate, look for scheduled workflows that run frequently. If database operations dominate, look for repeating groups doing expensive searches." },
        { title: "Optimize database searches", body: "Every 'Search for Things' operation costs WUs proportional to the result set it evaluates — not just what it returns. Add more constraints to narrow searches. Instead of 'Search for Orders' filtered client-side, add 'User = Current User' to the search itself. Use 'Do a search for > first item' instead of fetching a full list when you only need one record. Paginate large lists instead of loading everything at once." },
        { title: "Fix inefficient workflows", body: "Recursive workflows (loops) are the most common WU killer. A recursive workflow that processes 1,000 records individually can cost 1,000x more WUs than a bulk operation. Look for opportunities to use 'Make changes to a list of things' (bulk update) instead of looping through individual records. Avoid triggering backend workflows on every page load — use database state instead." },
        { title: "Set up WU alerts", body: "In Bubble's settings, configure email alerts when WU usage hits 70% and 90% of your monthly allocation. This gives you time to either optimize or upgrade before hitting overages. During launch week of a new feature, check the Metrics dashboard daily — new features can have unexpected WU costs that only show up with real user behavior." },
      ],
    },
    {
      title: "Building Secure Multi-Role Apps",
      level: "Advanced", time: "60 min",
      steps: [
        { title: "Design your role system", body: "Start by defining every role in your app and what each role can do. Common patterns: (1) Option Set on User — add a 'Role' field with option set values like Admin, Manager, Member. (2) Membership records — a separate data type linking User to Workspace with a role field, supporting per-workspace roles. (3) Boolean fields — simpler for two-role apps (is_admin yes/no). Choose based on whether roles are global or per-context." },
        { title: "Implement privacy rules per role", body: "Go to Data > Privacy for each data type. For each rule, use conditions that reference Current User's role. Example: 'Find this in searches' — condition: 'This Thing's owner is Current User OR Current User's role is Admin'. Create separate rules for find, view, create, modify, and delete permissions. Test each rule combination after creating them." },
        { title: "Gate UI elements by role", body: "In the Design tab, use conditionals to show/hide UI elements based on role. Select an element > Add condition: 'When Current User's Role is not Admin, This element is not visible'. Do this for admin-only buttons, edit controls, and sensitive data displays. UI gating is UX, not security — it reduces confusion but doesn't prevent data access. Privacy rules are your actual security layer." },
        { title: "Test every role combination", body: "Create a test account for every role in your app. Log in as each role and systematically test: Can they see data they shouldn't? Can they access pages they shouldn't? Can they trigger workflows they shouldn't? Use Bubble's inspector tool to verify what data is actually being returned by searches. This testing phase is non-negotiable before any real users touch your app." },
        { title: "Audit API workflow authentication", body: "Every API workflow (backend workflow exposed as an API endpoint) should require authentication. In the workflow settings, check 'Ignore privacy rules' is OFF (never turn this on for user-facing data). Enable API token authentication and rotate tokens periodically. Test your API endpoints with unauthorized requests to verify they return 403 errors, not data." },
      ],
    },
  ];

  const t = tutorials[active];

  return (
    <div>
      <SectionHead eyebrow="Tutorials" title="Step-by-Step Bubble Guides" sub="Practical walkthroughs built around the parts of Bubble that take the longest to learn on your own." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 32 }}>
        {tutorials.map((tut, i) => (
          <button key={tut.title} onClick={() => setActive(i)} style={{ background: active === i ? G.accent : G.card, border: `2px solid ${active === i ? G.accent : G.border}`, borderRadius: 12, padding: "16px", textAlign: "left", cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: active === i ? "rgba(255,255,255,0.7)" : G.muted, marginBottom: 6 }}>{tut.level} · {tut.time}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: active === i ? "#fff" : G.text, lineHeight: 1.4 }}>{tut.title}</div>
          </button>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <Badge variant="accent">{t.level}</Badge>
          <Badge>⏱ {t.time}</Badge>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28, letterSpacing: "-0.02em" }}>{t.title}</h2>
        {t.steps.map((s, i) => (
          <div key={s.title} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 20, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${G.accent}`, color: G.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.title}</h4>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#2e2a25" }}>{s.body}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   VERDICT
═══════════════════════════════════════════════════════════ */
const PageVerdict = ({ goTo }) => {
  const scores = [
    { label: "Power & Flexibility", score: 9.6 },
    { label: "Ease of Use", score: 5.5 },
    { label: "Security", score: 8.2 },
    { label: "Pricing Transparency", score: 5.8 },
    { label: "Plugin Ecosystem", score: 9.2 },
    { label: "Documentation & Community", score: 9.0 },
    { label: "Mobile (Native)", score: 6.5 },
    { label: "AI / Copilot", score: 5.0 },
    { label: "Value for Money", score: 6.8 },
    { label: "Competitor Position", score: 8.5 },
  ];
  const overall = (scores.reduce((a, s) => a + s.score, 0) / scores.length).toFixed(1);

  return (
    <div>
      <SectionHead eyebrow="Final Verdict" title="Our Definitive Take on Bubble 2026" />

      <div style={{ background: G.text, borderRadius: 20, padding: "40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: G.accent, opacity: 0.09 }} />
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: G.accent, lineHeight: 1 }}>{overall}</div>
            <div style={{ fontSize: 13, color: "rgba(250,248,244,0.5)", marginTop: 4 }}>out of 10</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: G.accent, marginTop: 8 }}>Overall Score</div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ color: "rgba(250,248,244,0.9)", fontSize: 17, lineHeight: 1.7 }}>Bubble is the most powerful no-code platform ever built. If your app has complex data relationships, multi-step conditional workflows, multi-role user access, and a need to scale to thousands of users — Bubble is probably the right choice, and nothing else gets close.</p>
            <p style={{ color: "rgba(250,248,244,0.62)", fontSize: 15, lineHeight: 1.65, marginTop: 14 }}>But "powerful" has a price: a ~5 month learning curve, unpredictable WU-based costs, a weaker AI Copilot than its younger competitors, and permanent vendor lock-in with no code export. Bubble earns its place at the top of the no-code stack — but only for the right project and the right builder.</p>
          </div>
        </div>
      </div>

      <Card style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: G.muted, marginBottom: 20 }}>Full Score Breakdown</div>
        {scores.map(s => <ScoreBar key={s.label} label={s.label} score={s.score} />)}
      </Card>

      <SectionHead eyebrow="Who Should Use Bubble" title="Our Specific Recommendations" />
      {[
        { persona: "Founder building a complex SaaS or marketplace", rec: "Bubble is your best option in no-code. The learning investment is real but worth it for apps with complex data models, multi-role access, and the need to scale. Budget the learning time before committing to a launch date.", verdict: "Strong Yes", badge: "good" },
        { persona: "Non-technical founder validating an MVP quickly", rec: "Lovable or Bolt.new will get you to a working prototype 10x faster with zero learning investment. Use Bubble only if your MVP genuinely requires complex logic that simpler tools can't handle. Validate first, invest in Bubble second.", verdict: "Try Others First", badge: "warn" },
        { persona: "Agency building apps for multiple clients", rec: "Strong fit — IF you invest in properly learning the platform. The 5,300+ plugin ecosystem means you can cover almost any client requirement. Be explicit with clients about the no-code-export lock-in. Prioritize Security (privacy rules) on every project.", verdict: "Yes, With Training", badge: "good" },
        { persona: "Enterprise team for internal tools", rec: "Viable for internal tools, especially on Team and Enterprise plans with SOC 2 compliance. Evaluate seriously against Retool (developer-friendly) and PowerApps (Microsoft ecosystem). The governance capabilities were designed for app teams, not enterprise IT departments.", verdict: "Case-by-Case", badge: "neutral" },
        { persona: "Builder who might need to migrate later", rec: "Do not use Bubble. The lock-in is absolute — no code export means rebuilding from scratch if you leave. If there's any meaningful chance you'll need to migrate, choose a tool with code export (Lovable, Webflow, FlutterFlow) from the start.", verdict: "Avoid", badge: "critical" },
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "28px 32px", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to start with Bubble?</h3>
          <p style={{ fontSize: 14, color: G.muted, lineHeight: 1.6 }}>The free plan is genuinely useful for learning. Start with Bubble Academy before you touch the canvas — it pays for itself in saved frustration.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a href="https://bubble.io" target="_blank" rel="noopener noreferrer" style={{ padding: "13px 26px", background: G.accent, color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", textDecoration: "none", textAlign: "center" }}>Try Bubble Free →</a>
          <button onClick={() => goTo("prompts")} style={{ padding: "11px 26px", background: "transparent", color: G.text, border: `1.5px solid ${G.border}`, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Browse Prompt Library</button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function BubbleMicrosite() {
  const [activePage, setActivePage] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const topRef = useRef(null);

  const goTo = (id) => {
    setActivePage(id);
    setMenuOpen(false);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeLabel = NAV.find(n => n.id === activePage)?.label;

  const pages = {
    "overview": <PageOverview goTo={goTo} />,
    "features": <PageFeatures />,
    "learning-curve": <PageLearningCurve />,
    "database": <PageDatabase />,
    "mobile": <PageMobile />,
    "security": <PageSecurity />,
    "pricing": <PagePricing />,
    "comparisons": <PageComparisons />,
    "prompts": <PagePrompts />,
    "tutorials": <PageTutorials />,
    "verdict": <PageVerdict goTo={goTo} />,
  };

  const curIdx = NAV.findIndex(n => n.id === activePage);
  const prev = curIdx > 0 ? NAV[curIdx - 1] : null;
  const next = curIdx < NAV.length - 1 ? NAV[curIdx + 1] : null;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: G.text, background: G.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        button,a{font-family:'DM Sans',sans-serif;}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:${G.border};}::-webkit-scrollbar-thumb{background:${G.muted};border-radius:3px;}
        @media(max-width:680px){.dnav{display:none!important;}.mnav{display:flex!important;}}
        @media(min-width:681px){.mnav{display:none!important;}.mmenu{display:none!important;}}
      `}</style>

      {/* Sticky nav */}
      <div ref={topRef} style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(240,237,231,0.93)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${G.border}`, height: G.navH }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: "100%", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.muted }}>No-Code Reviewed</div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>Bubble.io <span style={{ color: G.accent }}>2026</span></div>
          </div>

          <nav className="dnav" style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto", msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => goTo(n.id)} style={{ padding: "6px 11px", border: "none", borderRadius: 7, background: activePage === n.id ? G.accent : "transparent", color: activePage === n.id ? "#fff" : G.muted, fontSize: 12, fontWeight: activePage === n.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.12s" }}>
                {n.id === "pricing" ? "💰 " : ""}{n.label}
              </button>
            ))}
          </nav>

          <button className="mnav" onClick={() => setMenuOpen(!menuOpen)} style={{ marginLeft: "auto", background: "none", border: `1px solid ${G.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: G.text, display: "none", alignItems: "center", gap: 6 }}>
            ☰ {activeLabel}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mmenu" style={{ position: "fixed", top: G.navH, left: 0, right: 0, zIndex: 99, background: G.card, borderBottom: `1px solid ${G.border}`, padding: 12, maxHeight: "70vh", overflowY: "auto" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => goTo(n.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", border: "none", borderRadius: 8, background: activePage === n.id ? G.accent : "transparent", color: activePage === n.id ? "#fff" : G.text, fontSize: 14, fontWeight: activePage === n.id ? 700 : 500, cursor: "pointer", marginBottom: 2 }}>{n.label}</button>
          ))}
        </div>
      )}

      {/* Page content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ fontSize: 12, color: G.muted, marginBottom: 24, display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ cursor: "pointer" }} onClick={() => goTo("overview")}>Bubble.io Review</span>
          {activePage !== "overview" && <><span>›</span><span style={{ color: G.accent, fontWeight: 600 }}>{activeLabel}</span></>}
        </div>

        {pages[activePage]}

        <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 32, marginTop: 48, display: "flex", justifyContent: "space-between", gap: 12 }}>
          {prev
            ? <button onClick={() => goTo(prev.id)} style={{ padding: "10px 18px", background: G.card, border: `1px solid ${G.border}`, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", color: G.text }}>← {prev.label}</button>
            : <div />}
          {next && <button onClick={() => goTo(next.id)} style={{ padding: "10px 18px", background: G.accent, border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#fff" }}>{next.label} →</button>}
        </div>
      </div>
    </div>
  );
}
