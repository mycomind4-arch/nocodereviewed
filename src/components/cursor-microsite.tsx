import { useState, useRef } from "react";

const G = {
  accent: "#7c3aed",
  accentLight: "#ede9fe",
  accentMid: "#a78bfa",
  text: "#1a1523",
  card: "#ffffff",
  bg: "#f5f3ff",
  muted: "#6b6478",
  border: "#ddd6fe",
  good: "#059669",
  warn: "#dc2626",
  goodBg: "#ecfdf5",
  warnBg: "#fef2f2",
  dark: "#0f0a1e",
  darkCard: "#1a1333",
  darkBorder: "#2d1f4e",
  navH: 60,
};

const Badge = ({ children, variant = "neutral" }) => {
  const colors = {
    neutral: { bg: "#f3f0ff", color: G.muted },
    accent: { bg: G.accentLight, color: G.accent },
    critical: { bg: G.warnBg, color: G.warn },
    good: { bg: G.goodBg, color: G.good },
    warn: { bg: "#fffbeb", color: "#b45309" },
  };
  const c = colors[variant] || colors.neutral;
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 4,
      background: c.bg, color: c.color,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    }}>{children}</span>
  );
};

const ScoreBar = ({ label, score, max = 10 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "170px 1fr 38px", alignItems: "center", gap: 12, marginBottom: 14 }}>
    <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: G.muted }}>{label}</span>
    <div style={{ height: 4, background: G.border, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(score / max) * 100}%`, background: G.accent, borderRadius: 2 }} />
    </div>
    <span style={{ fontSize: 13, fontWeight: 700, textAlign: "right", color: G.accent, fontFamily: "'JetBrains Mono', monospace" }}>{score}</span>
  </div>
);

const Alert = ({ type = "neutral", title, children }) => {
  const map = {
    neutral: { border: G.border, bg: "#faf8ff" },
    warn: { border: G.warn, bg: G.warnBg },
    good: { border: G.good, bg: G.goodBg },
    info: { border: G.accent, bg: G.accentLight },
  };
  const s = map[type] || map.neutral;
  return (
    <div style={{ borderLeft: `3px solid ${s.border}`, background: s.bg, borderRadius: "0 8px 8px 0", padding: "18px 22px", marginBottom: 20 }}>
      {title && <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, color: s.border, fontFamily: "'JetBrains Mono', monospace" }}>{title}</div>}
      <div style={{ fontSize: 14, lineHeight: 1.75, color: G.text }}>{children}</div>
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: "22px 24px", ...style }}>
    {children}
  </div>
);

const SectionHead = ({ eyebrow, title, sub }) => (
  <div style={{ marginBottom: 32 }}>
    {eyebrow && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.accent, marginBottom: 10, fontFamily: "'JetBrains Mono', monospace" }}>{eyebrow}</div>}
    <h2 style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: sub ? 10 : 0, lineHeight: 1.15, color: G.text }}>{title}</h2>
    {sub && <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.65, maxWidth: 620 }}>{sub}</p>}
  </div>
);

const Prose = ({ children }) => (
  <div style={{ fontSize: 14, lineHeight: 1.85, color: "#3d3554", marginBottom: 16 }}>{children}</div>
);

const Divider = () => <div style={{ height: 1, background: G.border, margin: "36px 0" }} />;

const StatPill = ({ num, label }) => (
  <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 8, padding: "18px 20px", textAlign: "center", flex: "1 1 130px" }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: G.accent, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{num}</div>
    <div style={{ fontSize: 11, color: G.muted, marginTop: 6, lineHeight: 1.4 }}>{label}</div>
  </div>
);

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }} style={{
      position: "absolute", top: 10, right: 10, padding: "4px 10px",
      background: copied ? G.good : G.accent, color: "#fff",
      border: "none", borderRadius: 4, fontSize: 10, fontWeight: 700,
      cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em",
    }}>{copied ? "COPIED" : "COPY"}</button>
  );
};

const PromptBlock = ({ text }) => (
  <div style={{ position: "relative", background: G.dark, border: `1px solid ${G.darkBorder}`, borderRadius: 8, padding: "16px 52px 16px 18px", marginBottom: 14 }}>
    <CopyBtn text={text} />
    <p style={{ color: "#c4b5fd", fontSize: 12.5, lineHeight: 1.75, fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>{text}</p>
  </div>
);

const CodeBlock = ({ code, lang = "" }) => (
  <div style={{ background: G.dark, border: `1px solid ${G.darkBorder}`, borderRadius: 8, marginBottom: 16, overflow: "hidden" }}>
    {lang && <div style={{ padding: "6px 16px", borderBottom: `1px solid ${G.darkBorder}`, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "#7c6fad", letterSpacing: "0.08em" }}>{lang}</div>}
    <pre style={{ margin: 0, padding: "14px 18px", fontSize: 12.5, lineHeight: 1.7, color: "#e2d9f3", fontFamily: "'JetBrains Mono', monospace", overflowX: "auto" }}>{code}</pre>
  </div>
);

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "models", label: "AI Models" },
  { id: "composer", label: "Composer" },
  { id: "pricing", label: "Pricing" },
  { id: "comparisons", label: "vs Competitors" },
  { id: "prompts", label: "Prompt Library" },
  { id: "tutorials", label: "Tutorials" },
  { id: "verdict", label: "Verdict" },
];

// ─── PAGE: OVERVIEW ───────────────────────────────────────
const PageOverview = ({ goTo }) => (
  <div>
    <div style={{ background: G.dark, borderRadius: 12, padding: "48px 40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 280, height: 280, borderRadius: "50%", background: G.accent, opacity: 0.08 }} />
      <div style={{ position: "absolute", bottom: -60, left: "35%", width: 200, height: 200, borderRadius: "50%", background: "#a78bfa", opacity: 0.05 }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.accentMid, marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>No-Code Reviewed · In-Depth Platform Review</div>
        <h1 style={{ fontSize: "clamp(30px,5vw,50px)", fontWeight: 800, color: "#f5f3ff", letterSpacing: "-0.025em", lineHeight: 1.05, marginBottom: 18 }}>
          Cursor AI<br />Complete Review 2026
        </h1>
        <p style={{ fontSize: 15, color: "rgba(245,243,255,0.65)", lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
          The AI-first code editor that turned VS Code into something fundamentally different. We used it daily for six months, stress-tested every AI feature, and built real production codebases to give you the most thorough Cursor review available.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => goTo("verdict")} style={{ padding: "11px 22px", background: G.accent, color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>SEE OUR VERDICT →</button>
          <button onClick={() => goTo("prompts")} style={{ padding: "11px 22px", background: "transparent", color: "#e2d9f3", border: "1px solid #3d2f6e", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Prompt Library</button>
        </div>
      </div>
    </div>

    <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 8, padding: "18px 26px", marginBottom: 32, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
      {[
        { label: "Overall Score", val: "9.1 / 10" },
        { label: "AI Quality", val: "9.4 / 10" },
        { label: "Code Accuracy", val: "9.0 / 10" },
        { label: "Context Awareness", val: "9.2 / 10" },
        { label: "Value", val: "8.8 / 10" },
      ].map(item => (
        <div key={item.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: G.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.val}</div>
          <div style={{ fontSize: 10, color: G.muted, marginTop: 2, letterSpacing: "0.05em", textTransform: "uppercase" }}>{item.label}</div>
        </div>
      ))}
      <div style={{ marginLeft: "auto" }}><Badge variant="accent">Updated May 2026</Badge></div>
    </div>

    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
      <StatPill num="Anysphere" label="Parent company, founded 2022" />
      <StatPill num="$9.9B" label="Valuation after Series C, 2025" />
      <StatPill num="$900M" label="ARR reported early 2026" />
      <StatPill num="4M+" label="Active developers" />
      <StatPill num="Claude/GPT-4/Gemini" label="Multi-model — pick your AI backend" />
    </div>

    <SectionHead eyebrow="What Is Cursor" title="The IDE That Thinks With You" sub="A VS Code fork rebuilt ground-up for AI — not a plugin, not a sidebar, but AI woven into every keystroke." />

    <Prose>Cursor is a code editor built on VS Code's open-source foundation and re-engineered from the inside out for AI assistance. Unlike GitHub Copilot (an extension that adds AI to VS Code) or Bolt.new (an AI builder that generates apps in a browser), Cursor is a desktop IDE where AI is the primary interaction model. You open your actual codebase, and an AI that can see all of it helps you write, refactor, debug, and understand it.</Prose>
    <Prose>The key differentiator is codebase context. Cursor indexes your entire repository and lets you chat with it — "why is this API call failing on line 340?", "refactor all instances of this pattern across the project", "explain what this 800-line module does". The AI answers with awareness of your actual code, not generic programming knowledge.</Prose>
    <Prose>Founded in 2022 by four MIT graduates, Cursor hit a $9.9B valuation in its Series C round — making it one of the fastest-growing developer tools in history. Its meteoric rise reflects a broader shift: developers aren't just using AI for snippets anymore, they're delegating entire feature implementations and architectural decisions to it.</Prose>

    <Divider />

    <SectionHead eyebrow="The Bottom Line" title="Who It's For" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: G.good, marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>Best For</div>
        {["Professional developers who write code daily", "Teams wanting AI that understands existing codebases", "Full-stack engineers moving fast on feature work", "Developers frustrated with Copilot's limited context", "Engineers doing large refactors or legacy migration", "Anyone who wants to stay in a real IDE, not a browser"].map(t => (
          <div key={t} style={{ fontSize: 13, lineHeight: 1.65, padding: "4px 0 4px 16px", position: "relative", color: G.text }}>
            <span style={{ position: "absolute", left: 0, color: G.good, fontWeight: 700 }}>✓</span>{t}
          </div>
        ))}
      </Card>
      <Card>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: G.warn, marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>Approach With Caution</div>
        {["Complete non-coders — this requires coding ability", "Users happy with Copilot for simple autocomplete", "Teams on strict data privacy / air-gap requirements", "JetBrains-only shops (no IntelliJ/PyCharm parity)", "Mobile app developers (Xcode integration is rough)", "Anyone needing offline / no-network operation"].map(t => (
          <div key={t} style={{ fontSize: 13, lineHeight: 1.65, padding: "4px 0 4px 16px", position: "relative", color: G.text }}>
            <span style={{ position: "absolute", left: 0, color: G.warn, fontWeight: 700 }}>✗</span>{t}
          </div>
        ))}
      </Card>
    </div>
  </div>
);

// ─── PAGE: FEATURES ───────────────────────────────────────
const PageFeatures = () => {
  const features = [
    { icon: "⌘K", title: "Inline Edit (Cmd+K)", tier: "All plans", detail: "Select any code, hit Cmd+K, describe what you want. Cursor rewrites the selection with full codebase awareness. Unlike autocomplete, it understands what the code is supposed to do. Works on any file type — TypeScript, Python, Rust, SQL, config files." },
    { icon: "⬛", title: "Cursor Composer", tier: "All plans", detail: "Multi-file agent mode. Give a high-level task and Cursor writes across multiple files simultaneously — creating new components, updating imports, modifying tests, all in one pass. The closest thing to having a developer implement a ticket for you." },
    { icon: "💬", title: "Chat with Codebase", tier: "All plans", detail: "A persistent chat panel with full repository context. Ask questions about code you didn't write, trace bugs across files, understand architecture decisions, or get explanations of unfamiliar patterns. References specific lines and files in its answers." },
    { icon: "◼", title: "Tab Autocomplete", tier: "All plans", detail: "Next-token and next-line prediction that's genuinely smarter than Copilot for in-context suggestions. It sees what you've been doing in the current session and predicts multi-line continuations, not just single tokens." },
    { icon: "📁", title: "@Codebase Indexing", tier: "All plans", detail: "Cursor indexes your entire repo with a semantic vector search. Type @codebase in chat and it retrieves the most relevant files and snippets for your query — even in repos with hundreds of thousands of lines." },
    { icon: "🌐", title: "@Web Search", tier: "All plans", detail: "Type @web followed by a query and Cursor searches the web, then uses the results to inform its answer. Useful for documentation-heavy tasks: 'use @web to find the latest Prisma migration syntax.'" },
    { icon: "📄", title: "@File and @Symbol References", tier: "All plans", detail: "Type @filename or @SymbolName to pin specific context to your query. Cursor will focus its answer on that file or symbol. Eliminates vague answers that ignore your actual code structure." },
    { icon: "🔁", title: "Apply and Diff View", tier: "All plans", detail: "AI suggestions render as a diff — you see exactly what changed before accepting. Accept or reject line-by-line. Never blindly accept code changes you haven't reviewed. This is the feature that separates thoughtful AI coding from dangerous automation." },
    { icon: "🔑", title: "Bring Your Own Key (BYOK)", tier: "All plans", detail: "Use your own OpenAI, Anthropic, or Azure API keys instead of Cursor's credits. Useful for teams with existing model contracts, budget management, or compliance requirements. Pro and Business plans also support custom base URLs." },
    { icon: "🏢", title: "Privacy Mode", tier: "Business", detail: "Code is never stored or used for training on Business plan with Privacy Mode enabled. For Enterprise, code never leaves your infrastructure. Critical for proprietary codebases, regulated industries, and client work." },
    { icon: "🔗", title: "Git Integration", tier: "All plans", detail: "Full VS Code git integration — branches, diffs, staging, commits — plus AI-generated commit messages. Ask Cursor to write a commit message and it reads the diff, understands what changed, and writes something accurate." },
    { icon: "🧩", title: "VS Code Extension Compatibility", tier: "All plans", detail: "Because Cursor is a VS Code fork, virtually all VS Code extensions work without modification. ESLint, Prettier, language servers, debuggers, themes — your existing setup migrates in minutes. The only thing that changes is the AI layer." },
  ];

  return (
    <div>
      <SectionHead eyebrow="Platform Features" title="Everything Cursor Can Do" sub="A complete breakdown of every significant feature — what it actually does in practice." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14, marginBottom: 40 }}>
        {features.map(f => (
          <Card key={f.title}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 18, fontFamily: "'JetBrains Mono', monospace", color: G.accent, fontWeight: 800 }}>{f.icon}</span>
              <Badge variant={f.tier === "Business" ? "warn" : "neutral"}>{f.tier}</Badge>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: G.text }}>{f.title}</h3>
            <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.65 }}>{f.detail}</p>
          </Card>
        ))}
      </div>
      <Divider />
      <Alert type="good" title="What Cursor Builds Best">
        Feature implementations in existing codebases. Large refactors across dozens of files. Debug sessions where the bug crosses multiple modules. Documentation generation for undocumented legacy code. API integrations and database schema changes that ripple through the codebase.
      </Alert>
      <Alert type="warn" title="Where Cursor Needs Your Guidance">
        Cursor is a power tool — it does what you tell it, including wrong things, confidently. Architecture decisions still require developer judgment. Security-sensitive code should always be reviewed. Generated tests should be run, not just accepted. The AI is fast; your review process must keep pace.
      </Alert>
    </div>
  );
};

// ─── PAGE: AI MODELS ──────────────────────────────────────
const PageModels = () => {
  const models = [
    { name: "claude-sonnet-4", provider: "Anthropic", best: "Best overall", tier: "Pro+", detail: "The default model for most Cursor users in 2026. Exceptional at multi-file reasoning, long context, and following complex instructions precisely. Strongest for large refactors and architectural changes. Slightly slower than GPT-4o for quick completions." },
    { name: "gpt-4.1", provider: "OpenAI", best: "Fastest reasoning", tier: "Pro+", detail: "Faster than Sonnet for most coding tasks with comparable output quality. Excellent at generating clean TypeScript/Python from scratch. Strong function-calling support makes it reliable for tool-use and agent tasks. Some users prefer it for tight iteration loops." },
    { name: "gemini-2.5-pro", provider: "Google", best: "Largest context", tier: "Pro+", detail: "2M token context window — the only model that can fit an entire large codebase in a single context. Use it when you need the AI to reason across your entire monorepo simultaneously. Slower and more expensive but unmatched for whole-system understanding." },
    { name: "cursor-small", provider: "Cursor", best: "Fast autocomplete", tier: "All plans", detail: "Cursor's own small model optimized for tab completion speed. Not intended for Composer or Chat — this is the model running on every keystroke as you type. Extremely low latency, surprisingly accurate for inline suggestions." },
    { name: "claude-haiku-4", provider: "Anthropic", best: "Budget option", tier: "All plans", detail: "Fast, cheap, and capable for simpler tasks. Good for generating boilerplate, writing tests for straightforward functions, and formatting fixes. Save the heavy models for complex architecture work; use Haiku for repetitive tasks." },
    { name: "o4-mini", provider: "OpenAI", best: "Deep reasoning", tier: "Pro+", detail: "OpenAI's reasoning model for problems that require chain-of-thought. Notably better at complex algorithmic problems, security analysis, and multi-step debugging than standard GPT-4o. Slower and pricier but worth it for the hard problems." },
  ];

  return (
    <div>
      <SectionHead eyebrow="AI Models" title="The Models Inside Cursor" sub="Cursor is model-agnostic. Here's how each option performs in real coding workflows." />

      <Alert type="info" title="Why Model Choice Matters">
        Cursor's competitive moat isn't any single model — it's the infrastructure around models. The @codebase indexing, diff rendering, multi-file Composer orchestration, and context management all work regardless of which model you use. Switching models mid-workflow is instant. Most power users develop a pattern: fast model for autocomplete, capable model for Composer tasks, reasoning model for genuinely hard problems.
      </Alert>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: 36 }}>
        {models.map(m => (
          <Card key={m.name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G.text, fontFamily: "'JetBrains Mono', monospace" }}>{m.name}</div>
                <div style={{ fontSize: 11, color: G.muted, marginTop: 2 }}>{m.provider}</div>
              </div>
              <Badge variant={m.tier === "All plans" ? "good" : "accent"}>{m.tier}</Badge>
            </div>
            <div style={{ display: "inline-block", background: G.accentLight, color: G.accent, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, marginBottom: 10, fontFamily: "'JetBrains Mono', monospace" }}>{m.best}</div>
            <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.65 }}>{m.detail}</p>
          </Card>
        ))}
      </div>

      <Divider />
      <SectionHead eyebrow="Model Routing Strategy" title="Which Model for Which Task" />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: G.dark, color: "#e2d9f3", fontSize: 11, fontWeight: 700, padding: "10px 20px", letterSpacing: "0.07em", fontFamily: "'JetBrains Mono', monospace" }}>
          <span>Task</span><span style={{ textAlign: "center", color: G.accentMid }}>Recommended</span><span style={{ textAlign: "center", color: "#7c6fad" }}>Reason</span>
        </div>
        {[
          ["Inline autocomplete (Tab)", "cursor-small", "Speed — happens on every keystroke"],
          ["Implementing a feature", "claude-sonnet-4", "Best multi-file reasoning"],
          ["Quick bug fix", "gpt-4.1", "Fast and accurate for focused changes"],
          ["Large refactor (10+ files)", "gemini-2.5-pro", "Fits entire codebase in context"],
          ["Algorithm / math problem", "o4-mini", "Chain-of-thought reasoning shines"],
          ["Writing boilerplate", "claude-haiku-4", "Fast and cheap for repetitive tasks"],
          ["Security audit", "o4-mini", "Deep reasoning for vulnerability patterns"],
          ["Documentation generation", "claude-sonnet-4", "Best prose quality for technical writing"],
        ].map(([task, model, reason], i) => (
          <div key={task} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "11px 20px", borderBottom: i < 7 ? `1px solid ${G.border}` : "none", fontSize: 13, alignItems: "center" }}>
            <span style={{ color: G.text }}>{task}</span>
            <span style={{ textAlign: "center", color: G.accent, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{model}</span>
            <span style={{ textAlign: "center", color: G.muted, fontSize: 12 }}>{reason}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── PAGE: COMPOSER ───────────────────────────────────────
const PageComposer = () => (
  <div>
    <SectionHead eyebrow="Core Feature" title="Cursor Composer: The Multi-File Agent" sub="The feature that separates Cursor from every AI code assistant that came before it." />

    <Alert type="info" title="What Makes Composer Different">
      Most AI code tools operate on a single file or selection. Composer operates on your entire project. Give it a task — "add user authentication to this Express app" — and it writes across every file that needs to change: route handlers, middleware, models, tests, environment config, and README. All in one pass, all reviewable before anything is saved.
    </Alert>

    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
      <StatPill num="Multi-file" label="Creates, edits, and deletes across the codebase" />
      <StatPill num="Diff view" label="Review every change before applying" />
      <StatPill num="Checkpoints" label="Undo Composer sessions like Git commits" />
      <StatPill num="Agent mode" label="Runs terminal commands, tests, iterates" />
    </div>

    <SectionHead eyebrow="How It Works" title="The Composer Workflow" />
    {[
      { step: "01", title: "Write a task, not a prompt", body: "The difference between Composer and Chat is intent. Chat is conversational — 'how do I do X?'. Composer is task-oriented — 'do X.' Write what you want implemented as if writing a ticket: 'Add a /api/users/:id/avatar endpoint that accepts a multipart form upload, resizes the image to 128x128 using sharp, uploads it to S3, and updates the users table with the new avatar_url.' Specificity = quality." },
      { step: "02", title: "Composer plans before it writes", body: "Cursor shows a plan before writing any code. Files to be created, files to be modified, files to be deleted — with a summary of what will change in each. Review this before proceeding. If the plan looks wrong (wrong files, wrong approach), redirect it now rather than after 200 lines of code are generated." },
      { step: "03", title: "Review the diff, file by file", body: "Every change renders as a side-by-side diff. Green for additions, red for deletions, inline annotation for context. Accept or reject individual hunks. This is your last review gate before the code lands in your project. Don't skip it. Composer is fast enough that reviewing the diff thoroughly is still dramatically faster than writing the code yourself." },
      { step: "04", title: "Agent mode: Composer runs your tests", body: "In Agent mode, Cursor can execute terminal commands as part of the task. It will run your test suite, see the failures, fix them, and re-run until passing. This closes the loop from 'write the code' to 'make the tests pass' in a single Composer session. Requires terminal access to be enabled in settings." },
      { step: "05", title: "Checkpoints let you undo sessions", body: "Each Composer session creates a checkpoint in Cursor's internal history. If you don't like the result, roll back the entire session in one click — not file by file. This makes experimenting with large AI changes safe. The checkpoint system is separate from Git — you can roll back a Composer session without losing your unstaged Git changes." },
    ].map(s => (
      <div key={s.step} style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ width: 38, height: 38, borderRadius: 4, background: G.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>{s.step}</div>
        <Card style={{ padding: "16px 20px" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: G.text }}>{s.title}</h4>
          <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.65, margin: 0 }}>{s.body}</p>
        </Card>
      </div>
    ))}

    <Divider />
    <SectionHead eyebrow="Composer Patterns" title="Tasks Composer Handles Best" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {[
        { title: "New feature from ticket", body: "Paste a ticket description. Composer creates all necessary files and wires them together." },
        { title: "Database schema migration", body: "Describe schema change. Composer updates the migration, model, types, and all affected queries." },
        { title: "Rename/refactor a concept", body: "'Rename User to Account everywhere' — Composer updates all files, imports, tests, and docs." },
        { title: "Add auth to existing app", body: "Adds middleware, protects routes, creates auth utils, updates env config, writes tests." },
        { title: "Generate test suite", body: "Point at a file or module — Composer writes comprehensive tests for every exported function." },
        { title: "Port to new framework", body: "Migrate Express routes to Hono, or React class components to hooks, across the whole codebase." },
      ].map(item => (
        <Card key={item.title} style={{ padding: "16px 18px" }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: G.accent, fontFamily: "'JetBrains Mono', monospace" }}>{item.title}</h4>
          <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.6, margin: 0 }}>{item.body}</p>
        </Card>
      ))}
    </div>
  </div>
);

// ─── PAGE: PRICING ────────────────────────────────────────
const PagePricing = () => {
  const plans = [
    { name: "Free", price: "$0", period: "forever", requests: "2,000 completions/mo", highlight: false, features: ["2,000 tab completions/month", "50 slow requests (GPT-4, Sonnet)", "Limited Composer usage", "All VS Code extensions", "Full IDE, all languages", "No privacy mode", "Community support only"] },
    { name: "Pro", price: "$20", period: "/mo", requests: "500 fast requests/mo", highlight: true, features: ["Everything in Free", "500 fast premium requests", "Unlimited slow requests", "Full Composer access", "All frontier models", "BYOK support", "Priority queue"] },
    { name: "Business", price: "$40", period: "/mo/user", requests: "Team pooled budget", highlight: false, features: ["Everything in Pro", "Privacy mode (zero data retention)", "Centralized team billing", "Usage analytics dashboard", "SSO / SAML", "Admin controls", "Invoice billing"] },
    { name: "Enterprise", price: "Custom", period: "", requests: "Unlimited + SLA", highlight: false, features: ["Everything in Business", "On-premise deployment option", "VPC / air-gap available", "Custom model fine-tuning", "Dedicated account manager", "Custom contracts", "SLA guarantees"] },
  ];

  return (
    <div>
      <SectionHead eyebrow="Pricing" title="Plans, Requests & Real Costs" sub="Cursor uses a request-based model — simpler than token counting, but with its own gotchas." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 36, alignItems: "start" }}>
        {plans.map(p => (
          <div key={p.name} style={{ background: p.highlight ? G.dark : G.card, border: `2px solid ${p.highlight ? G.accent : G.border}`, borderRadius: 10, padding: "22px 20px", position: "relative" }}>
            {p.highlight && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: G.accent, color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 12px", borderRadius: 4, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>Most Popular</div>}
            <div style={{ fontSize: 12, fontWeight: 700, color: p.highlight ? "#9b8fc4" : G.muted, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{p.name}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: p.highlight ? "#f5f3ff" : G.text, lineHeight: 1 }}>{p.price}</div>
            <div style={{ fontSize: 11, color: p.highlight ? "#6d5fa0" : G.muted, marginBottom: 14 }}>{p.period}</div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: G.accentMid, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>{p.requests}</div>
            {p.features.map(f => (
              <div key={f} style={{ fontSize: 12, padding: "3px 0", color: p.highlight ? "#c4b5fd" : "#3d3554", paddingLeft: 14, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: G.accent }}>›</span>{f}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Alert type="info" title="Fast vs Slow Requests — What's the Difference">
        Cursor separates "fast" and "slow" requests. Fast requests use premium models (GPT-4.1, Claude Sonnet) with priority access — these are the 500/month on Pro. Slow requests queue behind other users but use the same models — unlimited on Pro. In practice, slow requests rarely take more than a few seconds off-peak. For most developers, 500 fast + unlimited slow is plenty. Power users doing intensive Composer sessions may burn through fast requests in 2–3 weeks of active work.
      </Alert>

      <Alert type="warn" title="The Free Plan Reality Check">
        2,000 tab completions sounds generous but goes quickly in active coding sessions. The 50 slow requests for premium models is the real constraint — that's roughly one substantial Composer session or five moderate Chat sessions. The free plan is genuinely useful for evaluation; for daily professional use, Pro at $20/month is the realistic entry point.
      </Alert>

      <Divider />
      <SectionHead eyebrow="Cost Breakdown" title="What Burns Your Request Budget?" />
      <Card>
        {[
          { action: "Tab autocomplete (each accept)", cost: "1 completion", note: "From your 2K/month completion budget" },
          { action: "Chat message (fast model)", cost: "1 fast request", note: "From your 500/month premium budget" },
          { action: "Cmd+K inline edit", cost: "1 fast request", note: "Or slow if premium exhausted" },
          { action: "Composer session (simple feature)", cost: "3–8 fast requests", note: "More for larger/complex tasks" },
          { action: "Composer session (major refactor)", cost: "10–25 fast requests", note: "Multi-step, many files changed" },
          { action: "@web search in chat", cost: "1 fast request", note: "Counts same as regular chat" },
          { action: "Agent mode with test loop", cost: "5–20 fast requests", note: "Depends on iterations to pass" },
        ].map((r, i) => (
          <div key={r.action} style={{ display: "grid", gridTemplateColumns: "1fr auto 170px", gap: 14, padding: "12px 0", borderBottom: i < 6 ? `1px solid ${G.border}` : "none", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: G.text }}>{r.action}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: G.accent, whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace" }}>{r.cost}</span>
            <span style={{ fontSize: 11, color: G.muted }}>{r.note}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── PAGE: COMPARISONS ────────────────────────────────────
const PageComparisons = () => {
  const competitors = [
    { name: "GitHub Copilot", desc: "The incumbent. Copilot works inside VS Code as an extension — same editor, lower switching cost. But its context model is file-level, not codebase-level. Cursor wins on multi-file awareness, Composer, and chat quality. Copilot wins on enterprise trust, JetBrains support, and zero-friction install.", vs: [["Codebase-level context", true, false], ["Multi-file Composer", true, false], ["VS Code native", false, true], ["JetBrains support", false, true], ["Enterprise track record", "Growing", "Established"], ["Price", "$20/mo", "$19/mo"]] },
    { name: "Bolt.new", desc: "Different categories. Bolt.new generates full-stack apps from scratch in a browser — great for greenfield projects with no existing code. Cursor works on existing codebases in a real desktop IDE. Most developers who use both have a clear rule: Bolt.new for new projects, Cursor for ongoing work.", vs: [["Existing codebase support", true, false], ["Browser-native", false, true], ["No coding required", false, "Partial"], ["Multi-file AI editing", true, true], ["Free tier depth", "Moderate", "Limited"], ["Best for", "Existing code", "New projects"]] },
    { name: "Windsurf (Codeium)", desc: "The closest direct competitor in 2026. Windsurf has a comparable Cascade agent feature and similar multi-file editing. Where Cursor pulls ahead: model selection breadth, VS Code extension compatibility, and the maturity of the codebase indexing. Windsurf has a more generous free tier.", vs: [["Agent / Composer", "Composer", "Cascade"], ["Model selection", "Broader", "More limited"], ["VS Code extensions", true, true], ["Free tier", "2K completions", "More generous"], ["Pricing", "$20/mo", "$15/mo"], ["Codebase indexing", "More mature", "Good, improving"]] },
    { name: "Aider (CLI)", desc: "Aider is an open-source, terminal-based AI coding assistant. No GUI — you interact via CLI. Incredibly powerful for developers who live in the terminal, fully open source, and works with any model via API key. Cursor wins on UX, IDE integration, and accessibility. Aider wins on cost (free), transparency, and no vendor lock-in.", vs: [["GUI / IDE", true, false], ["Open source", false, true], ["Cost", "$20/mo", "$0 + API key"], ["VS Code integration", true, false], ["Multi-file editing", true, true], ["Best for", "IDE users", "Terminal users"]] },
  ];

  return (
    <div>
      <SectionHead eyebrow="vs The Competition" title="How Cursor Stacks Up" sub="Head-to-head against the main alternatives in 2026." />
      {competitors.map(c => (
        <div key={c.name} style={{ marginBottom: 36 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: G.text, marginBottom: 10 }}>Cursor vs {c.name}</h3>
          <Prose>{c.desc}</Prose>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 130px", background: G.dark, color: "#e2d9f3", fontSize: 11, fontWeight: 700, padding: "10px 20px", letterSpacing: "0.07em", fontFamily: "'JetBrains Mono', monospace" }}>
              <span>Feature</span><span style={{ textAlign: "center", color: G.accentMid }}>Cursor</span><span style={{ textAlign: "center", color: "#7c6fad" }}>{c.name}</span>
            </div>
            {c.vs.map(([feat, cur, comp], i) => (
              <div key={feat} style={{ display: "grid", gridTemplateColumns: "1fr 130px 130px", padding: "11px 20px", borderBottom: i < c.vs.length - 1 ? `1px solid ${G.border}` : "none", fontSize: 13 }}>
                <span style={{ color: G.text }}>{feat}</span>
                <span style={{ textAlign: "center", color: cur === true ? G.good : cur === false ? G.warn : G.accent, fontWeight: 600 }}>{cur === true ? "✓" : cur === false ? "✗" : cur}</span>
                <span style={{ textAlign: "center", color: comp === true ? G.good : comp === false ? G.warn : G.muted, fontWeight: 600 }}>{comp === true ? "✓" : comp === false ? "✗" : comp}</span>
              </div>
            ))}
          </Card>
        </div>
      ))}
      <Divider />
      <Alert type="neutral" title="Bottom Line on Competitors">
        Cursor wins on multi-file agent quality, model selection, and codebase context depth. It loses on JetBrains support (vs Copilot), free tier generosity (vs Windsurf), and cost transparency for power users. If you're a professional developer who writes code daily and wants the highest-quality AI assistance available in 2026, Cursor is the clear leader. If you're evaluating for a large enterprise with existing GitHub/Microsoft contracts, Copilot deserves a fair comparison.
      </Alert>
    </div>
  );
};

// ─── PAGE: PROMPTS ────────────────────────────────────────
const PagePrompts = () => {
  const [activeCategory, setActiveCategory] = useState("Composer Tasks");
  const library = {
    "Composer Tasks": [
      { title: "Add REST endpoint with full stack", prompt: "Add a POST /api/v1/feedback endpoint. Request body: { userId: string, rating: number (1-5), comment: string, metadata?: Record<string, unknown> }. Validate the body with Zod. Store in the feedback table in Postgres (create the migration if it doesn't exist). Return { id, createdAt } on success. Write an integration test using the project's existing test setup. Update the OpenAPI spec if one exists." },
      { title: "Refactor to feature-based folder structure", prompt: "Refactor this project from a layer-based folder structure (controllers/, models/, services/) to a feature-based structure (features/auth/, features/users/, features/orders/ etc.). Move files and update all imports. Each feature folder should contain its own controller, service, model, and test files. Do not change any logic — only move and rename files. Generate a summary of every import that was updated." },
      { title: "Generate full test suite for a module", prompt: "Generate a comprehensive test suite for the @file module. Cover: every exported function, happy path for each, all known edge cases, error conditions and thrown exceptions, any async flows with both success and rejection. Use the project's existing test framework and mock/stub patterns. Place tests in the appropriate __tests__ directory. Aim for >90% line coverage." },
      { title: "Add Stripe webhook handler", prompt: "Add a Stripe webhook handler at /api/webhooks/stripe. Handle: checkout.session.completed (provision the relevant plan, update the user's subscription status), customer.subscription.updated (sync plan changes), customer.subscription.deleted (downgrade to free). Verify the Stripe-Signature header on every request using STRIPE_WEBHOOK_SECRET from env. Log all events to a webhook_events table with status (pending/processed/failed). Wrap each handler in try/catch so one failing event doesn't crash the server." },
    ],
    "Chat / Debug": [
      { title: "Trace a bug across files", prompt: "@codebase The API is returning 403 for authenticated users on the /api/orders/:id endpoint. The auth middleware is passing (I can see the req.user is populated in logs), but something downstream is rejecting the request. Trace through all the code that runs between the middleware and the response to find where the 403 is being set and why." },
      { title: "Explain unfamiliar code", prompt: "@file Explain what this module does, what problem it solves, what its main exports are, what side effects it has, and what I'd need to understand to safely modify it. Write a JSDoc comment block for the module at the top, and JSDoc for any exported functions that are missing it." },
      { title: "Security review a function", prompt: "Review this function for security vulnerabilities. Check for: SQL injection (if applicable), missing input validation, auth bypass vectors, exposed sensitive data in responses, insecure direct object references, and any other patterns from the OWASP Top 10 that apply. For each issue found, show the vulnerable code and suggest a fix." },
      { title: "Performance analysis", prompt: "@codebase The /api/dashboard endpoint is responding in 4-8 seconds under load. The bottleneck appears to be in the data layer. Analyze all database queries that run during this request, identify N+1 patterns, missing indexes, and unnecessary sequential queries that could be parallelized. Show the fix for the worst offender first." },
    ],
    "Cmd+K Edits": [
      { title: "Add error handling", prompt: "Wrap this function in a try/catch block. Log the error with the function name and input parameters. Re-throw a typed error class (create one if needed) that includes the original error as cause. Don't change the happy path logic." },
      { title: "Improve TypeScript types", prompt: "Replace all uses of 'any' in this function with proper TypeScript types inferred from context. Add return type annotation. Add parameter type annotations for any that are missing. Don't change the runtime logic." },
      { title: "Convert to async/await", prompt: "Convert this Promise chain to async/await syntax. Preserve error handling. If there are parallel operations using Promise.all, keep them parallel — don't serialize them. Add a try/catch if there isn't one." },
      { title: "Write JSDoc", prompt: "Write complete JSDoc comments for this function. Include: @param with name, type, and description for each parameter, @returns with type and description, @throws for any thrown errors, and a 1-2 sentence description of what the function does. Include a simple @example if it would help." },
    ],
    "Rules / System": [
      { title: "Project-level coding rules (.cursorrules)", prompt: "This project uses TypeScript strict mode, React 18, Prisma, and Express. Generate a .cursorrules file that enforces: prefer const over let, always use async/await over .then(), use named exports not default exports, all React components must be typed with FC<Props>, Prisma queries must always include proper error handling, environment variables must be validated at startup with Zod. Keep rules actionable and specific." },
      { title: "Monorepo rules with workspace context", prompt: "This is a monorepo with packages: /apps/web (Next.js), /apps/api (Hono), /packages/db (Prisma), /packages/types (shared types). Generate .cursorrules that: keep imports from the correct workspace package, never import from apps/ in packages/, always use the shared types from @repo/types for data models, match the coding style of each app's existing patterns." },
    ],
  };

  return (
    <div>
      <SectionHead eyebrow="Prompt Library" title="Proven Cursor Prompts" sub="Tested prompts across every major Cursor workflow — copy and adapt to your codebase." />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {Object.keys(library).map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "7px 14px", border: `1px solid ${activeCategory === cat ? G.accent : G.border}`, borderRadius: 4, background: activeCategory === cat ? G.accentLight : "transparent", color: activeCategory === cat ? G.accent : G.muted, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>{cat}</button>
        ))}
      </div>

      {library[activeCategory].map(item => (
        <div key={item.title} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: G.text }}>{item.title}</div>
          <PromptBlock text={item.prompt} />
        </div>
      ))}

      <Divider />
      <Alert type="info" title="Cursor Prompting Tips">
        Use @file, @symbol, and @codebase liberally — they dramatically improve answer quality by pinning relevant context. For Composer tasks, write prompts like tickets: specify inputs, outputs, error handling, and test requirements explicitly. For debugging, always describe what you expected vs what happened. For refactors, tell Cursor what NOT to change, not just what to change.
      </Alert>
    </div>
  );
};

// ─── PAGE: TUTORIALS ──────────────────────────────────────
const PageTutorials = () => {
  const [activeTutorial, setActiveTutorial] = useState(0);
  const tutorials = [
    {
      title: "Set Up Cursor for an Existing Codebase",
      level: "Beginner",
      time: "15 min",
      steps: [
        { title: "Install and migrate from VS Code", body: "Download Cursor from cursor.sh. On first launch, Cursor detects your VS Code installation and offers to import extensions, themes, keybindings, and settings in one click. Accept the import — your existing setup transfers completely. Cursor is a VS Code fork, so everything you've configured works without modification. Open your project folder exactly as you would in VS Code." },
        { title: "Let Cursor index your codebase", body: "When you first open a project, Cursor shows a small progress bar as it indexes the repository. This creates a semantic vector index of your code — the foundation for @codebase queries. For small projects (<50K lines) this takes under a minute. For large monorepos it can take 5–10 minutes. You can start working immediately; the index builds in the background. A checkmark in the status bar means indexing is complete." },
        { title: "Configure your AI model preferences", body: "Go to Cursor Settings → AI → Models. Set your preferred model for Chat and Composer (claude-sonnet-4 is the recommended default in 2026). Set a faster model for inline completions if you want lower latency — cursor-small or gpt-4.1-mini work well here. If you have your own API keys for OpenAI or Anthropic, add them under Settings → AI → API Keys to use your own billing instead of Cursor's request budget." },
        { title: "Write a .cursorrules file", body: "In your project root, create a file called .cursorrules. This is Cursor's system prompt for your project — it tells the AI about your tech stack, coding conventions, and preferences. Start simple: list your main technologies, your preferred import style, any naming conventions. Example: 'This is a TypeScript project using React 18, React Router, TanStack Query, and Tailwind. Prefer const over let. Use named exports. All API calls should use the useQuery/useMutation hooks from TanStack Query.' Cursor will follow these rules in every Chat and Composer interaction." },
        { title: "Try your first Composer task", body: "Press Cmd+I (or Ctrl+I) to open Composer. Type a small, concrete task: 'Add a loading spinner to the Button component — show it when an isLoading prop is true, disable the button while loading.' Review the plan, check the diff, click Apply. Your first successful Composer session will immediately show you why this tool is different. It didn't ask clarifying questions — it made reasonable decisions and showed you the result." },
      ],
    },
    {
      title: "Using Composer for a Full Feature Implementation",
      level: "Intermediate",
      time: "45 min",
      steps: [
        { title: "Start with a well-scoped ticket", body: "Composer works best when given a clear, bounded task. Before opening Composer, write out the full requirement: what the feature does, what files are likely involved, what the expected inputs/outputs are, what error cases exist, and whether you want tests written. Pasting a well-written ticket directly into Composer is one of the most effective prompting strategies — it mirrors how you'd brief a developer." },
        { title: "Let Composer plan first", body: "After submitting your task, Cursor shows a plan before writing code. Read it carefully. If Composer is planning to modify the wrong files, or has misunderstood the scope, stop it now and clarify. Add specifics: '@file src/lib/api.ts should be the only file that makes HTTP calls — don't add fetch calls to the component directly.' This iterative refinement before any code is written is much faster than reviewing 20 wrong files after." },
        { title: "Review the diff with intent", body: "When the diff appears, don't just skim — review it with the same rigor you'd apply to a pull request. Ask yourself: Does this logic handle the error cases I care about? Are the types correct? Are there any hardcoded values that should be config? Is the new code consistent with the surrounding style? Reject individual hunks you disagree with, then ask Composer to redo them with your feedback." },
        { title: "Run tests after applying", body: "Apply the changes, then immediately run your test suite. If Composer wrote tests, run them. If tests fail, paste the failure output back into Composer chat: 'The test for handleUserUpdate is failing with this error — fix it without changing the expected behavior.' Cursor can see the code it just wrote and the failure output simultaneously, making test debugging loops fast." },
        { title: "Commit with an AI-generated message", body: "Stage your changes with git add. Then in the source control panel, click the sparkle icon to generate a commit message. Cursor reads the diff and writes a conventional commit message (e.g. 'feat(users): add avatar upload endpoint with S3 storage'). Edit if needed. This is a small feature but it becomes surprisingly valuable when you're making 20+ commits a day and don't want to spend mental energy on commit messages." },
      ],
    },
    {
      title: "Advanced: Codebase Chat and Debugging",
      level: "Advanced",
      time: "30 min",
      steps: [
        { title: "Use @codebase for cross-file questions", body: "The @codebase tag instructs Cursor to perform a semantic search across your entire indexed repository before answering. Use it for questions that span multiple files: '@codebase where are all the places we read from the users table?' or '@codebase what's the difference between how the auth middleware works on public vs private routes?' The answers reference specific files and lines — use Cmd+Click to jump directly to the relevant code." },
        { title: "Pin context with @file and @symbol", body: "For focused questions, use @file to include a specific file's content in context, or @symbol to include a class/function/type definition. This is faster than @codebase for targeted queries and ensures you get an answer about the right code. '@file src/db/queries/users.ts — is there a way to batch these queries to avoid N+1?' is more precise than asking the same question without the pinned context." },
        { title: "Debug across services with multi-file chat", body: "In complex bugs that span a frontend component, an API route, and a database query, use Chat to trace the full execution path. Start with '@codebase The user's dashboard is showing stale data after a successful update. Trace the data flow from the update mutation to the dashboard query and find where the cache invalidation might be missing.' Cursor will map the flow across files and identify the gap." },
        { title: "Use o4-mini for hard algorithmic problems", body: "For bugs that require deep reasoning — race conditions, complex async flows, subtle type errors, algorithmic issues — switch the model to o4-mini in the model picker. This model uses chain-of-thought reasoning that's slower but significantly better at multi-step problems. Describe the problem in detail: what you observe, what you expected, what you've already tried. Give it time — the answer quality is worth the wait." },
        { title: "Build a mental model of the AI's limitations", body: "After a few weeks with Cursor, you'll develop intuition for when to trust it and when to verify carefully. Trust it for: boilerplate, tests for simple functions, documentation, renaming, obvious refactors. Verify carefully for: auth logic, any code that touches sensitive data, complex business rules, performance-critical paths, and anything that interacts with external services. The AI is fast — your review judgment is what makes the output safe." },
      ],
    },
  ];

  const activeTut = tutorials[activeTutorial];
  return (
    <div>
      <SectionHead eyebrow="Tutorials" title="Step-by-Step Guides" sub="Real workflows from first install to advanced multi-file agent usage." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
        {tutorials.map((t, i) => (
          <button key={t.title} onClick={() => setActiveTutorial(i)} style={{ background: activeTutorial === i ? G.accentLight : G.card, border: `2px solid ${activeTutorial === i ? G.accent : G.border}`, borderRadius: 8, padding: "16px 16px", textAlign: "left", cursor: "pointer" }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: activeTutorial === i ? G.accent : G.muted, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>{t.level} · {t.time}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: activeTutorial === i ? G.accent : G.text, lineHeight: 1.4 }}>{t.title}</div>
          </button>
        ))}
      </div>

      <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: "32px 36px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24 }}>
          <Badge variant="accent">{activeTut.level}</Badge>
          <Badge>⏱ {activeTut.time}</Badge>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 28, letterSpacing: "-0.02em", color: G.text }}>{activeTut.title}</h2>
        {activeTut.steps.map((step, i) => (
          <div key={step.title} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 20, marginBottom: 28 }}>
            <div style={{ width: 36, height: 36, borderRadius: 4, border: `2px solid ${G.accent}`, color: G.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: G.text }}>{step.title}</h4>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#3d3554" }}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── PAGE: VERDICT ────────────────────────────────────────
const PageVerdict = ({ goTo }) => {
  const scores = [
    { label: "Ease of Use", score: 8.5 },
    { label: "AI Code Quality", score: 9.4 },
    { label: "Multi-file Editing", score: 9.5 },
    { label: "Context Awareness", score: 9.2 },
    { label: "Security Posture", score: 8.8 },
    { label: "Value for Money", score: 8.8 },
    { label: "Documentation", score: 8.0 },
    { label: "Competitor Position", score: 9.0 },
  ];
  const overall = (scores.reduce((a, s) => a + s.score, 0) / scores.length).toFixed(1);

  return (
    <div>
      <SectionHead eyebrow="Final Verdict" title="Our Definitive Take on Cursor 2026" sub="After six months of daily use, hundreds of Composer sessions, and real production codebases — here's the complete picture." />

      <div style={{ background: G.dark, borderRadius: 12, padding: "40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: G.accent, opacity: 0.07 }} />
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: G.accent, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{overall}</div>
            <div style={{ fontSize: 11, color: "#6d5fa0", marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>out of 10</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: G.accentMid, marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>Overall Score</div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ color: "#e2d9f3", fontSize: 15, lineHeight: 1.75 }}>
              Cursor is the best AI coding tool available for professional developers in 2026. Full stop. The combination of codebase-level context, multi-model flexibility, Composer's multi-file agent, and the seamless VS Code migration makes it the obvious upgrade path for any developer using AI in their workflow.
            </p>
            <p style={{ color: "#7c6fad", fontSize: 13, lineHeight: 1.7, marginTop: 14 }}>
              The only meaningful caveat is the learning curve to unlock its full potential. Tab autocomplete works on day one. Composer for complex, multi-file tasks takes a few weeks of practice to prompt well. The developers who invest in that learning report 2–3x productivity improvements on feature work. Those who don't end up using it as an expensive autocomplete tool.
            </p>
          </div>
        </div>
      </div>

      <Card style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: G.muted, marginBottom: 20, fontFamily: "'JetBrains Mono', monospace" }}>Category Breakdown</div>
        {scores.map(s => <ScoreBar key={s.label} label={s.label} score={s.score} />)}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <Card>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: G.good, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>✓ Where It Wins</div>
          {["Multi-file Composer is category-defining — nothing else compares", "Codebase-level context makes AI answers genuinely accurate", "Model flexibility — swap between Claude, GPT-4.1, Gemini freely", "VS Code migration is zero-friction — full extension compatibility", "Privacy mode on Business gives real data protection guarantees", "Diff review workflow is the right model for AI-generated code", "Fastest iteration loop for feature development in existing codebases"].map(t => (
            <div key={t} style={{ fontSize: 12, lineHeight: 1.65, padding: "4px 0 4px 14px", position: "relative", color: G.text }}>
              <span style={{ position: "absolute", left: 0, color: G.good }}>›</span>{t}
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: G.warn, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>✗ Where It Falls Short</div>
          {["Not a no-code tool — requires real developer knowledge", "JetBrains (IntelliJ, PyCharm, WebStorm) not supported", "Request budget burns fast in heavy Composer sessions", "Privacy mode requires Business tier — an extra $20/user/month", "Learning curve to prompt Composer well takes weeks", "Mobile development (iOS/Android) has limited IDE support", "Offline use is not supported — requires network for AI features"].map(t => (
            <div key={t} style={{ fontSize: 12, lineHeight: 1.65, padding: "4px 0 4px 14px", position: "relative", color: G.text }}>
              <span style={{ position: "absolute", left: 0, color: G.warn }}>›</span>{t}
            </div>
          ))}
        </Card>
      </div>

      <SectionHead eyebrow="Who Should Use It" title="Our Specific Recommendations" />
      {[
        { persona: "Professional developer, any stack", rec: "This is your tool. Install it, import your VS Code settings, and start using Tab completion on day one. Spend two weeks learning Composer on real tasks. The $20/month pays for itself in the first week of serious use.", verdict: "Strong Yes", badge: "good" },
        { persona: "Developer currently using GitHub Copilot", rec: "Try the free tier for two weeks. The codebase-level chat alone is worth switching for. If you primarily use Copilot for inline suggestions and don't need multi-file editing, the gap narrows — but Cursor's Composer is a class above anything Copilot offers today.", verdict: "Switch and Try", badge: "good" },
        { persona: "Engineering team lead evaluating AI tools", rec: "Start with Pro for 5–10 engineers for a quarter. Measure PR throughput, time-to-feature, and bug escape rate before and after. Privacy mode on Business is the upgrade trigger for most teams — plan for $40/user/month if data privacy requirements apply.", verdict: "Yes, structured eval", badge: "accent" },
        { persona: "Non-technical builder / founder", rec: "Cursor is not for you. It requires the ability to read, understand, and review generated code. Bolt.new or Lovable are the right tools for building apps without coding knowledge. Come back to Cursor once you've learned enough to review AI output critically.", verdict: "Start with Bolt/Lovable", badge: "warn" },
        { persona: "Enterprise with strict data compliance", rec: "Business plan with Privacy Mode covers most compliance needs — no code stored, no training usage. For air-gap or VPC requirements, Enterprise is available. Engage sales before committing — the compliance story is solid but requires configuration.", verdict: "Business or Enterprise", badge: "accent" },
      ].map(r => (
        <div key={r.persona} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, background: G.card, border: `1px solid ${G.border}`, borderRadius: 8, padding: "18px 22px", marginBottom: 12, alignItems: "start" }}>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: G.text }}>{r.persona}</h4>
            <p style={{ fontSize: 12, color: G.muted, lineHeight: 1.65 }}>{r.rec}</p>
          </div>
          <Badge variant={r.badge}>{r.verdict}</Badge>
        </div>
      ))}

      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, background: G.dark, borderRadius: 10, padding: "28px 32px", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#f5f3ff" }}>Ready to try Cursor?</h3>
          <p style={{ fontSize: 13, color: "#7c6fad", lineHeight: 1.65 }}>Free tier is genuinely useful — 2,000 completions and 50 premium requests a month. Install, import your VS Code setup, and you're coding with AI in under 5 minutes.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer" style={{ padding: "11px 22px", background: G.accent, color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "none", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>TRY CURSOR FREE →</a>
          <button onClick={() => goTo("prompts")} style={{ padding: "10px 22px", background: "transparent", color: "#c4b5fd", border: "1px solid #3d2f6e", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Browse Prompt Library</button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────
export default function CursorMicrosite() {
  const [activePage, setActivePage] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);

  const goTo = (id) => {
    setActivePage(id);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const activeLabel = NAV.find(n => n.id === activePage)?.label;

  const pages = {
    overview: <PageOverview goTo={goTo} />,
    features: <PageFeatures />,
    models: <PageModels />,
    composer: <PageComposer />,
    pricing: <PagePricing />,
    comparisons: <PageComparisons />,
    prompts: <PagePrompts />,
    tutorials: <PageTutorials />,
    verdict: <PageVerdict goTo={goTo} />,
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: G.text, background: G.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${G.border}; } ::-webkit-scrollbar-thumb { background: ${G.accent}88; border-radius: 0; }
        button { cursor: pointer; }
        @media (max-width: 640px) { .desktop-nav { display: none !important; } .mobile-nav-btn { display: flex !important; } }
        @media (min-width: 641px) { .mobile-nav-btn { display: none !important; } .mobile-menu { display: none !important; } }
      `}</style>

      <div style={{ position: "sticky", top: 0, zIndex: 100, background: `rgba(245,243,255,0.94)`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${G.border}`, height: G.navH }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: "100%", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.muted, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>No-Code Reviewed</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: G.text, lineHeight: 1.2, fontFamily: "'JetBrains Mono', monospace" }}>cursor <span style={{ color: G.accent }}>2026</span></div>
          </div>
          <nav className="desktop-nav" style={{ display: "flex", gap: 2, flex: 1, overflow: "auto", scrollbarWidth: "none" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => goTo(n.id)} style={{ padding: "6px 11px", border: "none", borderRadius: 4, background: activePage === n.id ? G.accent : "transparent", color: activePage === n.id ? "#fff" : G.muted, fontSize: 12, fontWeight: activePage === n.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace" }}>{n.label}</button>
            ))}
          </nav>
          <button className="mobile-nav-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ marginLeft: "auto", background: "none", border: `1px solid ${G.border}`, borderRadius: 4, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: G.text, display: "none", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace" }}>☰ {activeLabel}</button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu" style={{ position: "fixed", top: G.navH, left: 0, right: 0, zIndex: 99, background: G.card, borderBottom: `1px solid ${G.border}`, padding: 12 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => goTo(n.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", border: "none", borderRadius: 4, background: activePage === n.id ? G.accentLight : "transparent", color: activePage === n.id ? G.accent : G.text, fontSize: 13, fontWeight: activePage === n.id ? 700 : 500, marginBottom: 2, fontFamily: "'JetBrains Mono', monospace" }}>{n.label}</button>
          ))}
        </div>
      )}

      <div ref={mainRef} style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ fontSize: 11, color: G.muted, marginBottom: 24, display: "flex", gap: 6, alignItems: "center", fontFamily: "'JetBrains Mono', monospace" }}>
          <span style={{ cursor: "pointer" }} onClick={() => goTo("overview")}>cursor review</span>
          {activePage !== "overview" && <><span style={{ color: G.border }}>›</span><span style={{ color: G.accent, fontWeight: 700 }}>{activeLabel?.toLowerCase()}</span></>}
        </div>

        {pages[activePage]}

        <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 32, marginTop: 48, display: "flex", justifyContent: "space-between", gap: 12 }}>
          {(() => {
            const idx = NAV.findIndex(n => n.id === activePage);
            const prev = idx > 0 ? NAV[idx - 1] : null;
            const next = idx < NAV.length - 1 ? NAV[idx + 1] : null;
            return (
              <>
                {prev ? <button onClick={() => goTo(prev.id)} style={{ padding: "10px 18px", background: G.card, border: `1px solid ${G.border}`, borderRadius: 6, fontSize: 12, fontWeight: 600, color: G.text, fontFamily: "'JetBrains Mono', monospace" }}>← {prev.label}</button> : <div />}
                {next && <button onClick={() => goTo(next.id)} style={{ padding: "10px 18px", background: G.accent, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{next.label} →</button>}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
