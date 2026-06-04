const evidenceFileIndex = [
  { tool: "Replit", slug: "replit", file: "docs/evidence/01_replit_complete_evidence_file.md", status: "Complete" },
  { tool: "Base44", slug: "base44", file: "docs/evidence/02_base_44_complete_evidence_file.md", status: "Complete" },
  { tool: "Bolt.new", slug: "bolt-new", file: "docs/evidence/03_bolt_new_complete_evidence_file.md", status: "Complete" },
  { tool: "Lovable", slug: "lovable", file: "docs/evidence/04_lovable_complete_evidence_file.md", status: "Complete" },
  { tool: "Cursor", slug: "cursor", file: "docs/evidence/05_cursor_complete_evidence_file.md", status: "Complete" },
  { tool: "Windsurf", slug: "windsurf", file: "docs/evidence/06_windsurf_complete_evidence_file.md", status: "Complete" },
  { tool: "Claude Code", slug: "claude-code", file: "docs/evidence/07_claude_code_complete_evidence_file.md", status: "Complete" },
  { tool: "OpenAI Codex", slug: "openai-codex", file: "docs/evidence/08_openai_codex_complete_evidence_file.md", status: "Complete" },
  { tool: "v0", slug: "v0", file: "docs/evidence/09_v_0_complete_evidence_file.md", status: "Complete" },
  { tool: "Lovable", slug: "lovable", file: "docs/evidence/12_lovable_evidence_file.md", status: "Supplemental" },
  { tool: "Claude Code", slug: "claude-code", file: "docs/evidence/13_claude_code_evidence_file.md", status: "Supplemental" },
  { tool: "OpenAI Codex", slug: "openai-codex", file: "docs/evidence/14_openai_codex_evidence_file.md", status: "Supplemental" },
  { tool: "Supabase AI Assistant", slug: "supabase-ai-assistant", file: "docs/evidence/15_supabase_ai_assistant_evidence_file.md", status: "Supplemental" },
  { tool: "Bubble AI", slug: "bubble-ai", file: "docs/evidence/16_bubble_ai_evidence_file.md", status: "Supplemental" },
  { tool: "FlutterFlow AI", slug: "flutterflow-ai", file: "docs/evidence/17_flutterflow_ai_evidence_file.md", status: "Supplemental" },
  { tool: "Webflow AI", slug: "webflow-ai", file: "docs/evidence/18_webflow_ai_evidence_file.md", status: "Supplemental" },
  { tool: "Framer AI", slug: "framer-ai", file: "docs/evidence/19_framer_ai_evidence_file.md", status: "Supplemental" },
  { tool: "Glide AI", slug: "glide-ai", file: "docs/evidence/20_glide_ai_evidence_file.md", status: "Supplemental" },
  { tool: "Softr AI", slug: "softr-ai", file: "docs/evidence/21_softr_ai_evidence_file.md", status: "Supplemental" },
  { tool: "Adalo", slug: "adalo", file: "docs/evidence/22_adalo_evidence_file.md", status: "Supplemental" },
  { tool: "Retool AI", slug: "retool-ai", file: "docs/evidence/23_retool_ai_evidence_file.md", status: "Supplemental" },
  { tool: "Thunkable", slug: "thunkable", file: "docs/evidence/24_thunkable_evidence_file.md", status: "Supplemental" },
  { tool: "Appsmith", slug: "appsmith", file: "docs/evidence/25_appsmith_evidence_file.md", status: "Supplemental" },
  { tool: "WeWeb", slug: "weweb", file: "docs/evidence/26_weweb_evidence_file.md", status: "Supplemental" },
  { tool: "Builder.io Fusion", slug: "builder-io-fusion", file: "docs/evidence/27_builder_io_fusion_evidence_file.md", status: "Supplemental" },
];

/* R2: Publish-ready review pages completed this phase (priority 8 + v0 with verified evidence support).
   Used to distinguish COMPLETE vs EVIDENCE-PENDING in #reviews / #tools directories.
   Only tools with dedicated evidence files + full structured review sections (hero/verdict/evidence/strengths/limitations/pricing/security/production/use-cases/alternatives/gaps/methodology/cta) qualify.
   No fake claims: all visible content traces to docs/evidence/* or explicitly "pending". */
const R2_COMPLETE_REVIEW_SLUGS = ['lovable','bolt-new','replit','replit-agent','cursor','windsurf','v0','webflow','webflow-ai','bubble','bubble-ai','framer','framer-ai'];

/* R1: Brand Icon System - local assets + polished fallbacks. Never hotlink externals. */
const TOOL_BRAND_ASSETS = {
  "lovable": {
    logo: "/images/tool-logos/lovable-logo.jpg",
    fallback: "L",
    brandColor: "#ff5ba7",
    accentColor: "#8b5cf6"
  },
  "bolt-new": {
    logo: "/images/tool-logos/bolt-new-logo.jpg",
    fallback: "B",
    brandColor: "#facc15",
    accentColor: "#38bdf8"
  },
  "replit": {
    logo: "/images/tool-logos/replit-logo.jpg",
    fallback: "R",
    brandColor: "#f26207",
    accentColor: "#38bdf8"
  },
  "replit-agent": {
    logo: "/images/tool-logos/replit-logo.jpg",
    fallback: "R",
    brandColor: "#f26207",
    accentColor: "#38bdf8"
  },
  "v0": { logo: null, fallback: "v0", brandColor: "#000000", accentColor: "#ffffff" },
  "cursor": { logo: null, fallback: "C", brandColor: "#0ea5e9", accentColor: "#6366f1" },
  "windsurf": { logo: null, fallback: "W", brandColor: "#06b6d4", accentColor: "#8b5cf6" },
  "framer-ai": { logo: null, fallback: "F", brandColor: "#00d4ff", accentColor: "#7c3aed" },
  "webflow-ai": { logo: null, fallback: "W", brandColor: "#4353ff", accentColor: "#00c4b4" },
  "bubble-ai": { logo: null, fallback: "B", brandColor: "#ff4d8d", accentColor: "#7b2cbf" },
  "base44": { logo: null, fallback: "B", brandColor: "#22c55e", accentColor: "#eab308" },
  "claude-code": { logo: null, fallback: "C", brandColor: "#d97706", accentColor: "#f472b6" },
  "openai-codex": { logo: null, fallback: "O", brandColor: "#10a37f", accentColor: "#3b82f6" },
  "shopify": { logo: null, fallback: "S", brandColor: "#95bf46", accentColor: "#5e8e3e" },
  "make": { logo: null, fallback: "M", brandColor: "#6d28d9", accentColor: "#22d3ee" },
  "zapier": { logo: null, fallback: "Z", brandColor: "#ff4a00", accentColor: "#facc15" },
  "notion": { logo: null, fallback: "N", brandColor: "#000000", accentColor: "#9ca3af" },
  "airtable": { logo: null, fallback: "A", brandColor: "#f82b60", accentColor: "#3b82f6" }
  // C2: extended for primary remaining + indexed with evidence/assets. No logos invented; orbs + brand colors only. Backgrounds (cursor-bg.jpg etc) referenced in pages where A-classified.
};

function toolBrandAsset(slugOrTool) {
  if (!slugOrTool) return TOOL_BRAND_ASSETS["lovable"];
  const key = (typeof slugOrTool === "string" ? slugOrTool : (slugOrTool.slug || slugOrTool.name || "")).toLowerCase();
  return TOOL_BRAND_ASSETS[key] || { logo: null, fallback: key[0] ? key[0].toUpperCase() : "?", brandColor: "#3b82f6", accentColor: "#a78bfa" };
}

function toolLogoMarkup(toolOrSlug, size = 32, className = "tool-logo") {
  const asset = toolBrandAsset(toolOrSlug);
  const name = (typeof toolOrSlug === "string" ? toolOrSlug : (toolOrSlug.name || toolOrSlug.slug || "Tool"));
  if (asset.logo) {
    return `<img src="${asset.logo}" alt="${name} logo" class="${className}-img" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:6px;" />`;
  }
  // Polished fallback orb
  const bg = asset.brandColor || "#1e3a8a";
  const fg = "#fff";
  return `<span class="${className}-fallback tool-logo-orb" style="width:${size}px;height:${size}px;background:${bg};color:${fg};display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:${Math.round(size*0.55)}px;border-radius:999px;border:1px solid rgba(255,255,255,0.2);box-shadow:0 1px 3px rgba(0,0,0,0.3);">${asset.fallback}</span>`;
}

function toolBrandStyleVars(toolOrSlug) {
  const asset = toolBrandAsset(toolOrSlug);
  return `--tool-brand:${asset.brandColor};--tool-accent:${asset.accentColor};`;
}

const tools = [
  { name: "Lovable", slug: "lovable", category: "Prompt-to-app", price: "Free + paid", score: 94, evidence: 0, bestFor: "Founders turning product ideas into full-stack web apps", verdict: "The benchmark for fast prompt-to-product iteration, but production readiness still needs testing.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Bolt.new", slug: "bolt-new", category: "Prompt-to-app", price: "Free + paid", score: 93, evidence: 0, bestFor: "Browser-based app builds with code visibility and fast iteration", verdict: "One of the strongest app-generation sandboxes for builders who want speed plus editable code.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Replit Agent", slug: "replit-agent", category: "Agentic IDE", price: "Paid plans", score: 91, evidence: 0, bestFor: "Building, deploying, and debugging apps in one cloud workspace", verdict: "Best when the builder wants an agent plus a real development environment.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "v0", slug: "v0", category: "UI generation", price: "Free + paid", score: 90, evidence: 0, bestFor: "React/Next.js UI generation and shadcn-style component starts", verdict: "Excellent for front-end scaffolds; needs pairing for backend-heavy apps.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Cursor", slug: "cursor", category: "AI IDE", price: "Free + paid", score: 89, evidence: 0, bestFor: "Developers and technical founders editing real code with AI", verdict: "Less no-code, more high-leverage coding; important because many vibe builds end here.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Base44", slug: "base44", category: "Prompt-to-app", price: "Free + paid", score: 88, evidence: 0, bestFor: "Business users building internal tools and simple SaaS apps", verdict: "Promising for nontechnical app creation; needs hard tests for data models and export paths.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Windsurf", slug: "windsurf", category: "AI IDE", price: "Free + paid", score: 87, evidence: 0, bestFor: "AI-assisted coding workflows with agentic edits", verdict: "A serious Cursor alternative for code-native vibe builders.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Firebase Studio", slug: "firebase-studio", category: "Agentic IDE", price: "Google account", score: 86, evidence: 0, bestFor: "App prototyping tied into Firebase and Google tooling", verdict: "Potentially powerful if the builder wants Google-native backend paths.", affiliateStatus: "None", updated: "Needs first test" },
  { name: "GitHub Copilot Workspace", slug: "github-copilot-workspace", category: "Agentic coding", price: "Paid plans", score: 85, evidence: 0, bestFor: "Planning and implementing code changes from issues", verdict: "More engineer-facing than founder-facing, but vital for the serious end of the category.", affiliateStatus: "None", updated: "Needs first test" },
  { name: "Claude Code", slug: "claude-code", category: "Agentic coding", price: "Paid/API", score: 85, evidence: 0, bestFor: "Repo-level coding work, refactors, and terminal-based implementation", verdict: "Powerful for real codebases, but not a one-click app builder.", affiliateStatus: "None", updated: "Needs first test" },
  { name: "OpenAI Codex", slug: "openai-codex", category: "Agentic coding", price: "OpenAI plans/API", score: 85, evidence: 0, bestFor: "Codebase work, implementation tasks, and app build assistance", verdict: "Belongs in the authority map because vibe-built apps eventually need code stewardship.", affiliateStatus: "None", updated: "Needs first test" },
  { name: "Devin", slug: "devin", category: "AI engineer", price: "Paid", score: 84, evidence: 0, bestFor: "Delegating software tasks to an autonomous coding agent", verdict: "Not a no-code builder, but a high-end reference point for autonomous software work.", affiliateStatus: "None", updated: "Needs first test" },
  { name: "Tempo", slug: "tempo", category: "Prompt-to-app", price: "Free + paid", score: 83, evidence: 0, bestFor: "React app and UI iteration with AI", verdict: "Worth covering for front-end generation and rapid app scaffolds.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Create", slug: "create", category: "Prompt-to-app", price: "Free + paid", score: 82, evidence: 0, bestFor: "Fast app and prototype generation from prompts", verdict: "Good candidate for nontechnical comparison tests against Lovable and Bolt.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Builder.io Visual Copilot", slug: "builder-visual-copilot", category: "Design-to-code", price: "Paid plans", score: 82, evidence: 0, bestFor: "Turning designs into front-end code and editable experiences", verdict: "Important bridge between design teams and vibe-coded front ends.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Uizard", slug: "uizard", category: "UI generation", price: "Free + paid", score: 80, evidence: 0, bestFor: "Wireframes, mockups, and early product UI concepts", verdict: "Not a full app builder, but useful in the ideation layer.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Galileo AI", slug: "galileo-ai", category: "UI generation", price: "Paid plans", score: 80, evidence: 0, bestFor: "Generating polished UI concepts from prompts", verdict: "Useful for visual exploration before production implementation.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Relume", slug: "relume", category: "Site generation", price: "Free + paid", score: 79, evidence: 0, bestFor: "Sitemaps, wireframes, and Webflow-oriented site planning", verdict: "Strong for web planning, less relevant for app logic.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Framer AI", slug: "framer-ai", category: "Site generation", price: "Free + paid", score: 79, evidence: 0, bestFor: "Landing pages and marketing sites generated quickly", verdict: "A fast site builder, not a full vibe-app environment.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Webflow AI", slug: "webflow-ai", category: "Site generation", price: "Paid plans", score: 78, evidence: 0, bestFor: "AI-assisted site design inside a mature website builder", verdict: "Relevant as the established no-code incumbent responding to AI app building.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Bubble AI", slug: "bubble-ai", category: "No-code app + AI", price: "Paid plans", score: 78, evidence: 0, bestFor: "Traditional no-code apps with AI assistance", verdict: "Important incumbent comparison: more control, slower vibe loop.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "FlutterFlow AI", slug: "flutterflow-ai", category: "Mobile app + AI", price: "Free + paid", score: 77, evidence: 0, bestFor: "Mobile app builders who want AI help but real app structure", verdict: "More structured than AI app building, useful for mobile-specific tests.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Softr AI", slug: "softr-ai", category: "Internal tools", price: "Free + paid", score: 76, evidence: 0, bestFor: "Portals and business apps powered by existing data", verdict: "Not pure AI app building, but good for business users who need less engineering risk.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Retool AI", slug: "retool-ai", category: "Internal tools", price: "Paid plans", score: 76, evidence: 0, bestFor: "Internal apps with AI-assisted development", verdict: "Enterprise-grade contrast to founder-focused AI app builder tools.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Appsmith AI", slug: "appsmith-ai", category: "Internal tools", price: "Free + paid", score: 75, evidence: 0, bestFor: "Open-source internal tools with AI assistance", verdict: "Useful for technical teams comparing open internal-tool builders.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "CodeDesign.ai", slug: "codedesign-ai", category: "Site generation", price: "Free + paid", score: 74, evidence: 0, bestFor: "AI-generated marketing sites and simple pages", verdict: "Cover as a site-generation comparison, not as a full app builder.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Durable", slug: "durable", category: "Site generation", price: "Paid plans", score: 73, evidence: 0, bestFor: "Small business sites generated quickly", verdict: "Useful for local-business site tests, outside the core app-builder lane.", affiliateStatus: "Researching", updated: "Needs first test" },
  { name: "Pythagora", slug: "pythagora", category: "Agentic coding", price: "Open source + paid", score: 72, evidence: 0, bestFor: "Developers exploring autonomous app generation", verdict: "Technical but worth tracking as agentic app-building matures.", affiliateStatus: "Researching", updated: "Needs first test" },
  // C2: remaining primary tools added with evidence-pending fields only (no invented scores, pricing, testimonials, or claims)
  { name: "Shopify", slug: "shopify", category: "Ecommerce / Site builder", price: "See shopify.com", score: 0, evidence: 0, bestFor: "Merchants building online stores with apps/themes (evidence pending)", verdict: "Evidence capture pending — no dedicated file in docs/evidence/. Broader ecommerce context in empire planning docs (ref).", affiliateStatus: "None", updated: "Pending first evidence file" },
  { name: "Make", slug: "make", category: "Automation / Integrations", price: "See make.com", score: 0, evidence: 0, bestFor: "No-code automation and workflow orchestration (evidence pending)", verdict: "Evidence capture pending. See empire/site-02-nocode-automation.md for planning context (ref only).", affiliateStatus: "None", updated: "Pending first evidence file" },
  { name: "Zapier", slug: "zapier", category: "Automation / Integrations", price: "See zapier.com", score: 0, evidence: 0, bestFor: "Connecting apps and automating business processes (evidence pending)", verdict: "Evidence capture pending. Automation recipes noted in empire planning (ref).", affiliateStatus: "None", updated: "Pending first evidence file" },
  { name: "Notion", slug: "notion", category: "Knowledge / Databases / Docs", price: "See notion.so", score: 0, evidence: 0, bestFor: "Flexible workspaces, wikis, and lightweight databases in no-code stacks (evidence pending)", verdict: "Evidence capture pending. Common integration example in evidence and empire notes.", affiliateStatus: "None", updated: "Pending first evidence file" },
  { name: "Airtable", slug: "airtable", category: "Databases / Internal tools", price: "See airtable.com", score: 0, evidence: 0, bestFor: "Structured data backends, interfaces, and workflow apps (evidence pending)", verdict: "Evidence capture pending. Referenced as backend/integration in Glide/Thunkable evidence + empire notes.", affiliateStatus: "None", updated: "Pending first evidence file" },
];

const roadmap = [
  { site: 1, name: "Vibe Coding Authority", status: "Building", focus: "Lovable, Bolt, Replit, v0, Cursor, Base44, Windsurf, and the 28-tool map" },
  { site: 2, name: "Prompt-to-App Lab", status: "Next", focus: "Weekly build challenges, clone tests, export tests, deploy tests" },
  { site: 3, name: "AI IDE Benchmarks", status: "Queued", focus: "Cursor, Windsurf, Codex, Claude Code, Copilot, Devin" },
  { site: 4, name: "Founder App Stacks", status: "Queued", focus: "Best vibe stack by use case: SaaS, marketplace, directory, internal tool" },
  { site: 5, name: "Security & Production Readiness", status: "Queued", focus: "Auth, database rules, secrets, deployment, maintainability, handoff" },
];

const gates = [
  ["Evidence", "Every review has a reproducible build test"],
  ["Freshness", "Pricing and feature claims refreshed weekly"],
  ["Quality", "Posts pass pre-gate, model scoring, and contradiction checks"],
  ["Originality", "Each article includes benchmark data or a build log"],
  ["Security", "Auth, database, and secret handling are checked before recommendations"],
  ["Autonomy", "Publishing pauses automatically when quality drops"],
];

const autonomyLayers = [
  ["Source Watcher", "Monitors product docs, changelogs, pricing pages, release notes, and official announcements."],
  ["Benchmark Runner", "Runs the same app-build prompts across the 28 tools and records output quality, errors, deployability, and handoff difficulty."],
  ["Evidence Store", "Saves screenshots, prompts, generated files, pricing snapshots, test notes, and reviewer verdict inputs."],
  ["Article Generator", "Writes only from evidence records, tool facts, comparison tables, and approved editorial templates."],
  ["Quality Gateway", "Rejects generic posts, unsupported claims, stale pricing, missing disclosure, missing verdicts, and thin summaries."],
  ["Refresh Agent", "Rechecks old posts weekly and rewrites when tools change, rankings shift, or evidence expires."],
];

const benchmarkPrompts = [
  { name: "SaaS MVP Dashboard", family: "SaaS MVP", status: "Ready", checks: "Auth, dashboard, CRUD, settings, states, deploy notes" },
  { name: "Directory App", family: "Directory", status: "Ready", checks: "Search, filters, detail pages, submit flow, review queue" },
  { name: "Internal Tool", family: "Internal Tool", status: "Ready", checks: "Tables, forms, roles, calendar, audit log" },
  { name: "Landing Page", family: "Landing Page", status: "Ready", checks: "Conversion sections, responsiveness, design quality" },
  { name: "AI Wrapper", family: "AI Wrapper", status: "Ready", checks: "Server-side API, secrets, history, failure handling" },
];

const benchmarkProtocol = [
  { step: "Prepare", owner: "Researcher", output: "Confirm tool account, plan, source snapshot, and benchmark prompt version." },
  { step: "Run", owner: "Tester", output: "Execute the prompt without hidden manual rescue and record prompt count." },
  { step: "Inspect", owner: "Reviewer", output: "Capture screenshots, generated app URL/export, code notes, data model notes, and defects." },
  { step: "Deploy", owner: "Tester", output: "Record whether deployment passed, failed, or needed manual repair." },
  { step: "Score", owner: "Editor", output: "Apply scoring rubric, note evidence gaps, and attach final QA before publishing." },
];

const benchmarkFailureModes = [
  { failure: "Prompt drift", meaning: "The tool ignored required app scope, data model, or user flow.", severity: "Medium" },
  { failure: "Broken core flow", meaning: "Auth, CRUD, search, forms, or state failed in the generated app.", severity: "High" },
  { failure: "Deploy blocked", meaning: "The app could not deploy/export without manual repair or missing configuration.", severity: "High" },
  { failure: "Security ambiguity", meaning: "Secrets, database rules, auth boundaries, or user data handling were unclear.", severity: "High" },
  { failure: "Handoff risk", meaning: "Generated code or project structure was too unclear to maintain confidently.", severity: "Medium" },
  { failure: "Evidence gap", meaning: "Screenshots, output URL, source snapshot, or notes were insufficient for publication.", severity: "Blocking" },
];

const qualityThresholds = [
  { metric: "Evidence", minimum: 80, blocks: "Unsupported claims, missing artifacts, weak benchmark notes, missing source URLs." },
  { metric: "Factuality", minimum: 85, blocks: "Contradictions, stale pricing, unverified product claims, unsupported comparisons." },
  { metric: "Originality", minimum: 80, blocks: "Generic summaries, copied positioning, no original build observations." },
  { metric: "SEO", minimum: 75, blocks: "Missing intent match, weak title angle, no internal links, thin structure." },
  { metric: "Disclosure", minimum: "Yes", blocks: "Affiliate/sponsor links without disclosure or unclear commercial relationship." },
];

const qualityRejectionReasons = [
  "Final verdict outruns available evidence.",
  "Pricing or feature claims are stale or uncited.",
  "The article repeats product marketing without benchmark observations.",
  "Comparison winner is declared without comparable runs.",
  "Production-ready language appears without deploy, auth, data, and handoff proof.",
  "Affiliate or sponsor CTA appears without disclosure readiness.",
];

const scoringRubric = [
  { dimension: "Build completion", weight: 20, test: "Did the tool create the requested app surface without manual rescue?" },
  { dimension: "Functional correctness", weight: 20, test: "Do auth, CRUD, search, forms, state, and errors behave as requested?" },
  { dimension: "Production path", weight: 18, test: "Can the app be deployed, exported, secured, and handed off without hidden traps?" },
  { dimension: "Code and data quality", weight: 16, test: "Are components, data models, API handling, and project structure maintainable?" },
  { dimension: "Iteration speed", weight: 12, test: "How fast can a builder diagnose, change, and rerun the app after feedback?" },
  { dimension: "User fit", weight: 9, test: "Which buyer can succeed with the tool: founder, designer, developer, or operator?" },
  { dimension: "Evidence quality", weight: 5, test: "How complete are the screenshots, logs, artifacts, pricing snapshots, and QA notes?" },
];

const claimStandards = [
  { claim: "Best overall", evidence: "Same benchmark family across direct competitors plus fresh source snapshots.", fail: "Use provisional language until all compared tools pass the evidence gate." },
  { claim: "Production-ready", evidence: "Deploy result, auth/data review, secrets handling, export path, and QA notes.", fail: "Replace with prototype-ready if any production gate is missing." },
  { claim: "Cheapest or best value", evidence: "Current pricing snapshot, credit limits, usage constraints, and scaling notes.", fail: "Block if pricing snapshot is older than seven days." },
  { claim: "Fastest", evidence: "Timed build log, prompt count, manual repair count, and final app status.", fail: "Do not claim speed from marketing copy or subjective impression." },
  { claim: "Best for nontechnical founders", evidence: "Observed builder workflow, generated app completeness, repair difficulty, and handoff notes.", fail: "Qualify if code inspection or terminal work is required." },
];

const taxonomyTerms = [
  {
    term: "Vibe coding",
    definition: "Building software through natural-language prompts, iterative AI edits, and fast feedback loops instead of traditional planning-first development.",
    useWhen: "The workflow centers on prompting, previewing, repairing, and shipping with AI assistance.",
    avoidWhen: "The product is only a static website generator, a generic chatbot, or a traditional no-code workflow with minor AI features.",
  },
  {
    term: "Prompt-to-app",
    definition: "A tool class that attempts to generate a usable web app, data model, UI, and deployment path from a written prompt.",
    useWhen: "The product can create multi-screen applications or functional prototypes from instructions.",
    avoidWhen: "The product only generates UI mockups, landing pages, or isolated code snippets.",
  },
  {
    term: "AI IDE",
    definition: "A code-native development environment where AI edits, explains, debugs, or generates code inside an existing project workflow.",
    useWhen: "The buyer needs repo-level changes, debugging, refactors, or production code stewardship.",
    avoidWhen: "The buyer expects no-code app creation without reading or editing code.",
  },
  {
    term: "Agentic coding",
    definition: "A workflow where an AI system plans and executes multi-step software tasks across files, commands, tests, and deployment checks.",
    useWhen: "The tool can take delegated implementation tasks and operate across a codebase.",
    avoidWhen: "The tool is limited to autocomplete, chat suggestions, or isolated code generation.",
  },
  {
    term: "No-code incumbent",
    definition: "A mature visual platform that predates the vibe-coding wave and now adds AI assistance to structured app or site building.",
    useWhen: "Comparing control, maturity, integrations, and lock-in against faster AI-native builders.",
    avoidWhen: "Describing a new AI-first prompt-to-app product.",
  },
  {
    term: "Production readiness",
    definition: "The degree to which a generated app can be deployed, secured, maintained, handed off, and trusted beyond a demo.",
    useWhen: "Discussing auth, data rules, secrets, performance, export path, ownership, and maintainability.",
    avoidWhen: "The only evidence is a working preview or attractive screenshot.",
  },
];

const taxonomyBoundaries = [
  "Do not call a tool no-code if the target user must inspect, edit, or deploy code to succeed.",
  "Do not compare AI IDEs directly against prompt-to-app tools without stating buyer intent.",
  "Do not use production-ready unless deploy, auth, data, secrets, and handoff checks have evidence.",
  "Do not call a UI generator an app builder unless it produces functional application behavior.",
  "Do not let SEO keywords override the category definition used in the verdict.",
];

const taxonomySeoRules = [
  {
    page: "Review pages",
    rule: "Use the tool's true category in the intro, verdict, schema, and internal links.",
  },
  {
    page: "Comparison pages",
    rule: "State whether the comparison is direct, adjacent, or buyer-intent based.",
  },
  {
    page: "Best-of pages",
    rule: "Group rankings by use case before declaring broad category winners.",
  },
  {
    page: "Reports",
    rule: "Define the evidence window and category scope before presenting rankings.",
  },
];

const launchArticleBriefs = [
  { title: "Lovable Review", keyword: "lovable review", gate: "SaaS MVP benchmark + pricing snapshot + production notes" },
  { title: "Bolt.new Review", keyword: "bolt.new review", gate: "SaaS MVP benchmark + deploy notes + code visibility notes" },
  { title: "Replit Agent Review", keyword: "replit agent review", gate: "SaaS MVP benchmark + AI wrapper benchmark + handoff test" },
  { title: "v0 Review", keyword: "v0 review", gate: "Landing page benchmark + UI quality notes + backend limitation notes" },
  { title: "Lovable vs Bolt.new", keyword: "lovable vs bolt", gate: "Same prompt run in both tools with screenshots" },
];

const contentPipeline = [
  {
    lane: "Launch reviews",
    priority: "P0",
    output: "Core platform reviews",
    items: ["Lovable Review", "Bolt.new Review", "Replit Agent Review", "v0 Review", "Cursor Review", "Base44 Review", "Windsurf Review"],
    evidence: "Review record, required benchmark run, current source snapshot, artifact, final QA.",
    outcome: "Create the review cluster that search engines and readers can trust first.",
  },
  {
    lane: "Comparison pages",
    priority: "P0",
    output: "High-intent alternative and versus pages",
    items: ["Lovable vs Bolt.new", "Lovable vs Replit Agent", "Bolt.new vs Replit Agent", "Cursor vs Windsurf"],
    evidence: "Same prompt, same scoring model, both tools with fresh snapshots and comparable artifacts.",
    outcome: "Capture buying-intent traffic while showing exactly how verdicts were earned.",
  },
  {
    lane: "Best-of hubs",
    priority: "P1",
    output: "Use-case ranking pages",
    items: ["Best Vibe Coding Tools for Founders", "Best AI App Builders for SaaS MVPs", "Best AI Builders for Internal Tools", "Best AI Tools for Landing Pages", "Best AI Coding Tools for Existing Codebases", "Best Vibe Coding Tools for AI Wrappers"],
    evidence: "At least three ranked tools with complete evidence gates, plus clear provisional labels for incomplete tools.",
    outcome: "Own category-level keywords without publishing unsupported listicles.",
  },
  {
    lane: "Authority reports",
    priority: "P1",
    output: "Recurring report products",
    items: ["Vibe Coding Platform Index", "Prompt-to-App Benchmark Report", "Production Readiness Watchlist", "AI IDE Transition Report"],
    evidence: "Report-specific evidence checklist, claim ledger compliance, and dated evidence window.",
    outcome: "Turn the site from a review blog into a benchmark institution.",
  },
  {
    lane: "Build logs",
    priority: "P2",
    output: "Original proof assets",
    items: benchmarkPrompts.map((prompt) => `${prompt.name} build log`),
    evidence: "Prompt transcript, screenshots, app URL or export, manual fixes, deploy result, and final score.",
    outcome: "Generate original source material competitors cannot copy.",
  },
];

const publishingCadence = [
  {
    rhythm: "Daily",
    output: "Evidence capture",
    owner: "Research agent",
    rule: "Save source snapshots, artifacts, benchmark notes, and blockers before any article draft advances.",
  },
  {
    rhythm: "Twice weekly",
    output: "Core reviews or comparisons",
    owner: "Editorial agent",
    rule: "Only publish pages with benchmark evidence, fresh pricing/source data, artifacts, and QA pass.",
  },
  {
    rhythm: "Weekly",
    output: "Digest and update log",
    owner: "Distribution agent",
    rule: "Summarize changed evidence, score movement, new blockers, and newly publish-ready reviews.",
  },
  {
    rhythm: "Monthly",
    output: "Authority report",
    owner: "Report agent",
    rule: "Use a dated evidence window and include methodology, exclusions, and changed verdicts.",
  },
];

const editorialCalendar = [
  {
    week: "Week 1",
    theme: "Foundation reviews",
    ship: ["Lovable Review", "Bolt.new Review", "Replit Agent Review"],
    evidence: "SaaS MVP benchmark, pricing snapshot, deploy result, artifact, final QA.",
    blocker: "Do not rank best overall until the same prompt has run across all three.",
  },
  {
    week: "Week 2",
    theme: "Comparison cluster",
    ship: ["Lovable vs Bolt.new", "Lovable vs Replit Agent", "Bolt.new vs Replit Agent"],
    evidence: "Side-by-side benchmark artifacts, same scoring model, source freshness under seven days.",
    blocker: "Comparison verdict must disclose incomplete benchmark or production gates.",
  },
  {
    week: "Week 3",
    theme: "IDE and codebase tools",
    ship: ["Cursor Review", "Windsurf Review", "Cursor vs Windsurf"],
    evidence: "Existing-codebase benchmark, handoff notes, repo inspection, pricing and terms snapshots.",
    blocker: "Do not compare IDEs against prompt-to-app tools without use-case boundary language.",
  },
  {
    week: "Week 4",
    theme: "Authority packaging",
    ship: ["Best Vibe Coding Tools", "Platform Index", "Weekly benchmark digest"],
    evidence: "Completed evidence gates for ranked tools, claim ledger, report evidence window.",
    blocker: "Best-of pages must mark provisional entries until full evidence exists.",
  },
];

const publicationGateRules = [
  "Every scheduled page needs a target keyword, evidence gate, internal links, and distribution asset.",
  "A page can move from queued to drafting only after required source snapshots and benchmark tasks are identified.",
  "A page can move from drafting to review only after artifacts and review records exist.",
  "A page can publish only after QA passes factuality, evidence, originality, SEO, and disclosure checks.",
  "A page must be refreshed when pricing, limits, product positioning, or benchmark evidence changes.",
];

const monetizationChannels = [
  {
    channel: "Affiliate links",
    status: "Researching",
    placement: "Review sidebar, comparison tables, and best-of pages only after disclosure is present.",
    rule: "Affiliate status cannot affect review score, ranking, verdict, or evidence requirements.",
  },
  {
    channel: "Benchmark reports",
    status: "Planned",
    placement: "Free executive summary with paid PDF/data export later.",
    rule: "Paid reports must expose methodology, evidence window, and provisional labels.",
  },
  {
    channel: "Sponsored placements",
    status: "Future",
    placement: "Clearly labeled sponsor units separated from rankings and verdict modules.",
    rule: "Sponsors cannot buy scores, badges, comparison wins, or review conclusions.",
  },
  {
    channel: "Tool submissions",
    status: "Future",
    placement: "Paid expedited intake queue, not paid positive coverage.",
    rule: "Expedited review only changes queue position; all publish gates still apply.",
  },
  {
    channel: "Stack consulting",
    status: "Future",
    placement: "Founder stack audits and production-readiness reviews.",
    rule: "Recommendations must cite the same scoring model used on-site.",
  },
];

const monetizationGuardrails = [
  "Every affiliate or sponsor link needs visible disclosure before the first monetized link.",
  "A monetized platform can be ranked below a non-monetized platform when evidence supports it.",
  "Pricing claims require a fresh source snapshot before they appear near affiliate CTAs.",
  "Comparison pages must show evidence gaps for both tools before recommending a winner.",
  "Sponsored content must not reuse review-card styling without a sponsor label.",
];

const partnerTiers = [
  {
    tier: "Directory only",
    allowed: "Public listing, tool profile, non-promotional mention, and standard review eligibility.",
    blocked: "No paid ranking, no winner badge, no preferential scoring.",
    disclosure: "No commercial disclosure needed unless a commercial relationship exists.",
  },
  {
    tier: "Affiliate",
    allowed: "Tracked links in review sidebars, comparison tables, and best-of CTAs.",
    blocked: "No influence over score, verdict, ranking, test selection, or criticism.",
    disclosure: "Affiliate disclosure must appear before the first monetized link.",
  },
  {
    tier: "Sponsor",
    allowed: "Clearly labeled sponsor units, newsletter inventory, or report sponsorship.",
    blocked: "No review-card styling, no implied endorsement, no claim of benchmark superiority.",
    disclosure: "Sponsor label must be visible in the unit and near any CTA.",
  },
  {
    tier: "Research participant",
    allowed: "Product demos, official clarification, bug response, and benchmark reproduction notes.",
    blocked: "No private correction of public score without logged evidence.",
    disclosure: "Methodology note should mention vendor-provided evidence when used.",
  },
];

const partnerRiskControls = [
  {
    risk: "Revenue bias",
    control: "Scores and rankings are calculated from evidence records, not affiliate status.",
    audit: "Compare monetized and non-monetized rankings monthly for unexplained preference.",
  },
  {
    risk: "Sponsor confusion",
    control: "Sponsor placements cannot share the same component style as editorial verdict cards.",
    audit: "Check every sponsored unit for clear label, separate styling, and non-editorial copy.",
  },
  {
    risk: "Vendor pressure",
    control: "Corrections require source snapshots, benchmark reruns, artifacts, or factual error notes.",
    audit: "Log changed verdicts with date, changed evidence, and reviewer note.",
  },
  {
    risk: "Overclaiming CTAs",
    control: "Commercial CTA copy cannot exceed the strength of the published verdict.",
    audit: "Review CTAs whenever a page verdict, score, or readiness status changes.",
  },
];

const partnerIntakeSteps = [
  "Record commercial relationship type and contact owner.",
  "Confirm disclosure language and placement before links or units go live.",
  "Map permitted placements to review, comparison, best-of, report, or newsletter surfaces.",
  "Check the platform has evidence records independent of partner-provided claims.",
  "Schedule monthly conflict audit across rankings, scores, and commercial placements.",
];

const audienceSegments = [
  {
    segment: "Nontechnical founder",
    intent: "Choose the fastest credible way to build an MVP without hiring engineers first.",
    needs: ["Plain-English verdicts", "Best-fit builder recommendations", "Production risk warnings", "Pricing clarity"],
    primaryPath: "Best tools for founders",
    href: "#best/founders",
    cta: "Find founder tools",
  },
  {
    segment: "Technical founder",
    intent: "Move from prototype to maintainable app without losing velocity.",
    needs: ["Code quality notes", "Export and repo handoff", "AI IDE transition guidance", "Security gates"],
    primaryPath: "AI IDE Transition Report",
    href: "#report/ai-ide-transition",
    cta: "Review transition path",
  },
  {
    segment: "Operator or internal-tools buyer",
    intent: "Build admin panels, portals, workflows, and data-backed internal apps safely.",
    needs: ["Internal tool rankings", "Permissions and data notes", "Workflow fit", "Vendor risk"],
    primaryPath: "Internal tools guide",
    href: "#best/internal-tools",
    cta: "Compare internal tools",
  },
  {
    segment: "Agency or consultant",
    intent: "Pick repeatable client delivery stacks and understand what can be trusted.",
    needs: ["Comparison pages", "Report assets", "Disclosure-safe recommendations", "Build log proof"],
    primaryPath: "Prompt-to-App Benchmark Report",
    href: "#report/prompt-to-app-benchmark",
    cta: "Open benchmark report",
  },
  {
    segment: "AI tooling researcher",
    intent: "Track category movement, evidence quality, and platform-level benchmark changes.",
    needs: ["Methodology", "Claims ledger", "Evidence freshness", "Recurring reports"],
    primaryPath: "Scoring methodology",
    href: "#methodology",
    cta: "Inspect methodology",
  },
];

const conversionRules = [
  { surface: "Homepage hero", goal: "Route users by intent", cta: "Best tools by use case", proof: "Evidence-strip cards and benchmark language must appear before any sales ask." },
  { surface: "Review page", goal: "Convert research into tool choice", cta: "Product or affiliate link", proof: "Only show monetized CTAs after disclosure, freshness, artifact, benchmark, and QA gates." },
  { surface: "Best-of page", goal: "Capture category buying intent", cta: "Open ranked review", proof: "Ranked tools must show gate status and provisional language when incomplete." },
  { surface: "Report page", goal: "Build institutional authority", cta: "Capture evidence or view readiness", proof: "Reports need dated evidence windows and claim-ledger compliance." },
  { surface: "Matcher", goal: "Help uncertain users choose a route", cta: "Recommended platform review", proof: "Recommendation must stay framed as current fit, not final winner, until gates pass." },
];

const croExperiments = [
  {
    experiment: "Review verdict CTA placement",
    hypothesis: "Readers click more qualified affiliate CTAs when evidence state and disclosure appear before the button.",
    metric: "Disclosure-visible affiliate clicks and review-to-methodology engagement.",
    guardrail: "Do not test CTA copy that implies final verdict when a review is provisional.",
  },
  {
    experiment: "Best-of evidence badges",
    hypothesis: "Rankings with visible benchmark, freshness, artifact, and QA badges increase trust and downstream review opens.",
    metric: "Rank card clicks, evidence badge hovers, and comparison opens.",
    guardrail: "Badges must reflect actual records, not marketing labels.",
  },
  {
    experiment: "Report lead magnet",
    hypothesis: "A concise report summary with evidence window converts serious buyers into email subscribers.",
    metric: "Report capture rate, return visits, and newsletter confirmation rate.",
    guardrail: "Do not hide methodology, sponsor state, or exclusions behind the email capture.",
  },
  {
    experiment: "Founder matcher completion",
    hypothesis: "Intent-based questions convert uncertain readers into better tool choices than generic rankings.",
    metric: "Matcher completion, recommended review opens, and avoided category mismatches.",
    guardrail: "Recommendations must state fit criteria and evidence limitations.",
  },
];

const leadMagnets = [
  {
    offer: "Vibe Coding Tool Shortlist",
    audience: "Nontechnical founders",
    trigger: "After best-of or matcher engagement.",
    requiredProof: "Category boundary, fresh pricing snapshots, and provisional labels.",
  },
  {
    offer: "Production Readiness Checklist",
    audience: "Technical founders and agencies",
    trigger: "After production-risk sections or AI IDE comparisons.",
    requiredProof: "Benchmark failure taxonomy, auth/data/security gates, and export notes.",
  },
  {
    offer: "Monthly Benchmark Digest",
    audience: "Researchers, buyers, and operators",
    trigger: "After reports, methodology, or readiness dashboard views.",
    requiredProof: "Evidence window, changed rankings, source freshness, and corrections.",
  },
  {
    offer: "Stack Selection Audit",
    audience: "Teams with budget or urgent implementation need",
    trigger: "After repeated comparison, report, or production-readiness sessions.",
    requiredProof: "Commercial disclosure and same scoring model used publicly.",
  },
];

const subscriberSegments = [
  {
    segment: "Founder shortlist",
    source: "Matcher, best-of guides, Lovable/Bolt/Replit reviews.",
    promise: "Plain-language recommendations, pricing changes, and production-risk warnings.",
    primaryOffer: "Vibe Coding Tool Shortlist",
  },
  {
    segment: "Technical builder",
    source: "AI IDE reports, Cursor/Windsurf/Replit reviews, production-readiness pages.",
    promise: "Benchmark notes, code-quality findings, export risk, and handoff guidance.",
    primaryOffer: "Production Readiness Checklist",
  },
  {
    segment: "Operator buyer",
    source: "Internal tool guides, comparison pages, Retool/Softr/Appsmith coverage.",
    promise: "Permissions, workflow, data safety, and vendor-risk updates.",
    primaryOffer: "Internal Tool Stack Brief",
  },
  {
    segment: "Research watcher",
    source: "Reports, methodology, readiness dashboard, corrections log.",
    promise: "Monthly category movement, evidence windows, changed verdicts, and new entrants.",
    primaryOffer: "Monthly Benchmark Digest",
  },
];

const emailSequences = [
  {
    sequence: "Welcome and trust setup",
    cadence: "Immediately + day 2",
    goal: "Explain methodology, evidence gates, and what provisional verdicts mean.",
    requiredProof: "Methodology page, trust principles, disclosure policy, latest readiness state.",
  },
  {
    sequence: "Founder shortlist nurture",
    cadence: "3 emails over 10 days",
    goal: "Help founders choose between prompt-to-app builders without overclaiming.",
    requiredProof: "Best-of guide, current source snapshots, benchmark coverage, pricing freshness.",
  },
  {
    sequence: "Production readiness nurture",
    cadence: "4 emails over 14 days",
    goal: "Teach readers how to inspect auth, data, deploys, handoff, and security posture.",
    requiredProof: "Benchmark failure taxonomy, production checks, artifact examples.",
  },
  {
    sequence: "Monthly benchmark digest",
    cadence: "Monthly",
    goal: "Summarize ranking movement, new evidence, stale claims, and corrections.",
    requiredProof: "Evidence window, changed records, correction notes, report QA pass.",
  },
];

const newsletterRules = [
  "Every email recommendation must preserve verdict state: blocked, provisional, evidence-backed, or ready.",
  "Affiliate links require visible disclosure before the first monetized CTA in the email.",
  "Pricing, limits, privacy, and production claims require fresh source snapshots.",
  "Digest emails must include evidence window, changed verdicts, and correction links when relevant.",
  "Subscriber segmentation cannot override evidence gates or send stronger claims than the public page.",
];

const croGuardrails = [
  "Every experiment must track evidence state, disclosure state, and source freshness beside conversion rate.",
  "CTA copy cannot exceed verdict strength or hide provisional review status.",
  "Affiliate clicks are valid only when disclosure was visible before the click.",
  "Lead magnets must preserve methodology access, not replace it with a gated proof path.",
  "Revenue experiments are paused when pricing, policy, or benchmark evidence becomes stale.",
];

const measurementPillars = [
  {
    pillar: "Authority growth",
    metric: "Qualified organic sessions, branded searches, report downloads, return visits.",
    signal: "Readers reach methodology, reviews, comparisons, and reports from high-intent queries.",
    caution: "Do not optimize for traffic that bypasses evidence or attracts irrelevant AI-tool curiosity.",
  },
  {
    pillar: "Evidence coverage",
    metric: "Publish-ready reviews, fresh source rate, benchmark coverage, artifact coverage, QA pass rate.",
    signal: "More pages become eligible for final verdicts and distribution.",
    caution: "Traffic growth is not valid if evidence coverage stays thin.",
  },
  {
    pillar: "Reader decision quality",
    metric: "Comparison engagement, best-of click depth, matcher completion, review-to-methodology usage.",
    signal: "Readers inspect proof before choosing a tool.",
    caution: "High CTA clicks with low evidence engagement can indicate over-aggressive monetization.",
  },
  {
    pillar: "Revenue integrity",
    metric: "Affiliate clicks, report leads, consulting inquiries, sponsor interest with disclosure readiness.",
    signal: "Revenue grows from trusted surfaces after disclosure and freshness checks.",
    caution: "Never count sponsor or affiliate revenue as success if it correlates with weaker rankings discipline.",
  },
  {
    pillar: "Freshness and correction health",
    metric: "Stale source count, refresh turnaround, correction notes, verdict-change latency.",
    signal: "The site responds quickly when tools change.",
    caution: "Old high-performing pages should not remain live with stale pricing, features, or policy claims.",
  },
];

const analyticsEvents = [
  { event: "review_opened", purpose: "Measure tool-level demand and review discovery.", guardrail: "Segment by evidence state and provisional/final verdict." },
  { event: "comparison_opened", purpose: "Measure high-intent buying research.", guardrail: "Track whether comparison has evidence parity." },
  { event: "affiliate_cta_clicked", purpose: "Measure commercial intent.", guardrail: "Fire only after disclosure-ready state is visible." },
  { event: "methodology_opened", purpose: "Measure trust and proof engagement.", guardrail: "Tie to previous review, comparison, or report path." },
  { event: "report_download_requested", purpose: "Measure authority product demand.", guardrail: "Include report evidence window and sponsor state." },
  { event: "correction_viewed", purpose: "Measure transparency engagement.", guardrail: "Connect to affected page and correction type." },
];

const measurementRules = [
  "Dashboards must show evidence coverage beside traffic and revenue.",
  "Affiliate CTA events must include disclosure readiness and source freshness state.",
  "Report metrics must include evidence window, sponsor state, and methodology view rate.",
  "SEO wins are not considered durable until affected pages pass freshness and QA gates.",
  "Every metric used for ranking or revenue decisions must be auditable by page, tool, and evidence state.",
];

const seoTemplates = [
  {
    template: "Platform review",
    url: "/reviews/{tool}",
    intent: "Evaluate one platform and decide whether it fits the reader's use case.",
    scale: tools.length,
    evidence: "Review record, benchmark run, fresh source snapshot, artifact, final QA.",
    links: ["Primary benchmark", "Closest comparison", "Best-of hub", "Methodology"],
  },
  {
    template: "Versus comparison",
    url: "/compare/{tool-a}-vs-{tool-b}",
    intent: "Compare two tools for buying-intent searches.",
    scale: "High-value pairs only",
    evidence: "Comparable benchmark runs, source snapshots for both tools, evidence gap labels.",
    links: ["Both reviews", "Relevant best-of hub", "Claims ledger", "Readiness dashboard"],
  },
  {
    template: "Best-of use case",
    url: "/best/{use-case}",
    intent: "Rank tools for a specific buyer job.",
    scale: "Current guide set",
    evidence: "At least three evidence-backed ranked tools or clear provisional labels.",
    links: ["Ranked reviews", "Methodology", "Reports", "Matcher"],
  },
  {
    template: "Benchmark report",
    url: "/reports/{report}",
    intent: "Publish recurring authority findings and category movement.",
    scale: "Recurring report set",
    evidence: "Dated evidence window, benchmark data, claim ledger compliance, QA notes.",
    links: ["Review cluster", "Readiness dashboard", "Methodology", "Build logs"],
  },
  {
    template: "Build log",
    url: "/build-log/{benchmark}-{tool}",
    intent: "Show original proof behind scores and rankings.",
    scale: tools.length * benchmarkPrompts.length,
    evidence: "Prompt transcript, screenshots, output link/export, manual fixes, deploy result.",
    links: ["Tool review", "Benchmark detail", "Comparison pages", "Relevant report"],
  },
  {
    template: "Alternative page",
    url: "/alternatives/{tool}",
    intent: "Capture readers leaving or comparing against a known platform.",
    scale: tools.length,
    evidence: "Same-category reviews, use-case fit, evidence gaps, pricing/source snapshots.",
    links: ["Original review", "Best-of hub", "Top comparisons", "Matcher"],
  },
];

const internalLinkRules = [
  "Every review links to its benchmark, one same-category comparison, one best-of hub, and methodology.",
  "Every best-of page links to ranked reviews and explains which tools are still provisional.",
  "Every comparison page links back to both reviews and the relevant claims-ledger rule.",
  "Every report links to methodology, readiness, and the underlying review cluster.",
  "Every build log links to the tool review, benchmark detail, and report that uses the evidence.",
];

const siteSections = [
  {
    section: "Reviews",
    purpose: "Primary evidence-backed platform pages for every tracked tool.",
    url: "/reviews/{tool}",
    launchRule: "Publish only after review record, benchmark run, fresh source snapshot, artifact, and QA exist.",
  },
  {
    section: "Compare",
    purpose: "Direct and adjacent buying-intent comparisons.",
    url: "/compare/{tool-a}-vs-{tool-b}",
    launchRule: "Both tools need comparable evidence or visible evidence-gap labels.",
  },
  {
    section: "Best",
    purpose: "Use-case ranked guides for founders, operators, agencies, and technical builders.",
    url: "/best/{use-case}",
    launchRule: "Rank only evidence-backed tools; mark incomplete entries as provisional.",
  },
  {
    section: "Benchmarks",
    purpose: "Original build tests, proof assets, and repeatable benchmark detail pages.",
    url: "/benchmarks/{benchmark}/{tool}",
    launchRule: "Requires prompt, output artifact, deploy/handoff notes, and scoring record.",
  },
  {
    section: "Reports",
    purpose: "Recurring authority products with dated evidence windows.",
    url: "/reports/{report}",
    launchRule: "Requires methodology, evidence window, claim ledger pass, and QA.",
  },
  {
    section: "Method",
    purpose: "Public explanation of scoring, taxonomy, evidence, corrections, and disclosure.",
    url: "/methodology",
    launchRule: "Must stay available from every review, comparison, best-of guide, and report.",
  },
];

const urlGovernanceRules = [
  "Use stable, lowercase, hyphenated slugs for every tool, benchmark, report, and use case.",
  "Never publish multiple URLs for the same canonical verdict surface.",
  "Redirect or canonicalize renamed platforms instead of creating duplicate reviews.",
  "Do not launch thin alternative pages before the original review and best-of hub exist.",
  "Every public URL must declare its evidence gate and internal-link obligations.",
];

const launchUrlQueue = [
  {
    priority: "P0",
    cluster: "Core reviews",
    urls: ["/reviews/lovable", "/reviews/bolt-new", "/reviews/replit-agent", "/reviews/v0", "/reviews/cursor", "/reviews/base44", "/reviews/windsurf"],
  },
  {
    priority: "P0",
    cluster: "Core comparisons",
    urls: ["/compare/lovable-vs-bolt-new", "/compare/lovable-vs-replit-agent", "/compare/cursor-vs-windsurf"],
  },
  {
    priority: "P1",
    cluster: "Use-case hubs",
    urls: ["/best/founders", "/best/saas-mvp", "/best/internal-tools", "/best/landing-pages"],
  },
  {
    priority: "P1",
    cluster: "Authority reports",
    urls: ["/reports/vibe-coding-platform-index", "/reports/prompt-to-app-benchmark", "/reports/production-readiness-watchlist"],
  },
];

const sourceWatchRules = [
  {
    source: "Pricing pages",
    cadence: "7 days",
    triggers: ["Plan price changes", "Credit or usage limit changes", "Free tier changes", "Seat or workspace rules"],
    action: "Invalidate pricing claims, value claims, affiliate CTAs, and comparison tables.",
  },
  {
    source: "Official docs",
    cadence: "14 days",
    triggers: ["Export path changes", "Auth/database feature changes", "Deployment flow changes", "API or integration changes"],
    action: "Refresh review facts, production-readiness sections, and benchmark instructions.",
  },
  {
    source: "Changelog and release notes",
    cadence: "7 days",
    triggers: ["New model support", "Major builder workflow changes", "Security feature launches", "Deprecations"],
    action: "Create refresh task for affected reviews, reports, and best-of rankings.",
  },
  {
    source: "Terms, privacy, and data policy",
    cadence: "30 days",
    triggers: ["Data retention changes", "Training-data language", "Enterprise/security policy changes", "Export ownership changes"],
    action: "Block production-ready claims until legal/data notes are reviewed.",
  },
  {
    source: "Product UI and generated output",
    cadence: "Per benchmark",
    triggers: ["Prompt behavior changes", "New generated app architecture", "Broken deploy path", "Changed default stack"],
    action: "Run the relevant benchmark again and attach fresh artifacts.",
  },
];

const freshnessInvalidators = [
  "Pricing changed or credit limits changed.",
  "A reviewed platform launched or removed deployment/export features.",
  "A benchmark prompt no longer reflects the current product workflow.",
  "A report uses evidence outside its stated evidence window.",
  "An affiliate CTA appears beside stale pricing or unsupported value claims.",
];

const correctionTypes = [
  {
    type: "Factual correction",
    trigger: "Incorrect pricing, feature availability, limit, ownership, policy, or platform capability.",
    response: "Correct the page, attach a source snapshot, and add a dated note when the error affected a verdict.",
    severity: "High",
  },
  {
    type: "Evidence refresh",
    trigger: "Source freshness expired, benchmark result is outdated, or official docs changed.",
    response: "Recheck the source, rerun affected benchmark tasks if needed, and update freshness state.",
    severity: "Medium",
  },
  {
    type: "Verdict change",
    trigger: "New benchmark evidence, production blocker, pricing shift, or feature launch changes recommendation strength.",
    response: "Log old verdict, new verdict, evidence delta, and impacted pages before publishing.",
    severity: "High",
  },
  {
    type: "Disclosure update",
    trigger: "Affiliate, sponsor, vendor-provided evidence, or conflict state changes.",
    response: "Update disclosure copy before any commercial link or sponsor placement remains live.",
    severity: "High",
  },
  {
    type: "Editorial clarification",
    trigger: "Language is ambiguous, overbroad, unsupported, or missing use-case boundaries.",
    response: "Tighten claim language and record whether the change affected score, ranking, or CTA copy.",
    severity: "Low",
  },
];

const sampleChangeLog = [
  {
    date: "2026-05-27",
    page: "Lovable Review",
    change: "Added production-readiness gate requirements before final verdict can publish.",
    evidence: "Review record, benchmark requirement, QA gate.",
    impact: "Verdict remains provisional until benchmark evidence is saved.",
  },
  {
    date: "2026-05-27",
    page: "Best Vibe Coding Tools",
    change: "Marked best-of rankings as evidence-gated rather than absolute.",
    evidence: "Claim standards and publication gate rules.",
    impact: "Prevents unsupported winner language.",
  },
  {
    date: "2026-05-27",
    page: "Partner Governance",
    change: "Separated affiliate and sponsor permissions from editorial scoring.",
    evidence: "Partner tiers and risk controls.",
    impact: "Commercial placement cannot change review score.",
  },
];

const correctionPolicyRules = [
  "Material factual errors require a dated correction note when they affected a verdict, ranking, or recommendation.",
  "Minor wording fixes do not require public correction unless they changed the meaning of a claim.",
  "Vendor requests must cite evidence; preference alone cannot change a score or verdict.",
  "Changed pricing, limits, exports, security posture, or policy language can invalidate affected claims immediately.",
  "Every verdict change must preserve the old conclusion, new conclusion, evidence delta, and changed date.",
];

const marketSegments = [
  {
    segment: "Prompt-to-app leaders",
    role: "Core category",
    tools: ["Lovable", "Bolt.new", "Base44", "Tempo", "Create"],
    buyer: "Founders and operators who want a working web app from prompts.",
    test: "SaaS MVP benchmark, deployment path, data model handling, export/handoff.",
  },
  {
    segment: "Agentic IDEs",
    role: "Technical escalation path",
    tools: ["Cursor", "Windsurf", "Replit Agent", "Firebase Studio"],
    buyer: "Technical founders and developers moving from prototype to real code.",
    test: "Existing-codebase benchmark, repo edits, debugging, maintainability.",
  },
  {
    segment: "UI and design generation",
    role: "Front-end acceleration",
    tools: ["v0", "Uizard", "Galileo AI", "Builder.io Visual Copilot"],
    buyer: "Teams that need fast interfaces, landing pages, or design-to-code starts.",
    test: "UI fidelity, component quality, responsiveness, integration readiness.",
  },
  {
    segment: "No-code incumbents",
    role: "Structured alternatives",
    tools: ["Bubble AI", "FlutterFlow AI", "Webflow AI", "Framer AI"],
    buyer: "Builders who prefer visual control, mature platforms, or app-store/site ecosystems.",
    test: "Control versus speed, lock-in, scalability, data ownership, AI assist depth.",
  },
  {
    segment: "Internal tool builders",
    role: "Business operations lane",
    tools: ["Retool AI", "Softr AI", "Appsmith AI"],
    buyer: "Operations teams building portals, admin tools, workflows, and data apps.",
    test: "Permissions, connectors, auditability, database safety, workflow reliability.",
  },
];

const competitorSignals = [
  {
    signal: "Pricing or credit model change",
    impact: "Can shift best-value recommendations and affiliate CTA language.",
    response: "Refresh pricing snapshots, value claims, comparison tables, and best-of rankings.",
  },
  {
    signal: "New deployment, export, or database feature",
    impact: "Can move a tool from prototype-safe to pilot-safe or production-candidate.",
    response: "Rerun production-readiness checks and update affected review verdicts.",
  },
  {
    signal: "Major model or agent workflow upgrade",
    impact: "Can change benchmark speed, repair difficulty, generated architecture, and UI quality.",
    response: "Rerun benchmark prompts and compare against prior output artifacts.",
  },
  {
    signal: "Security, privacy, or terms change",
    impact: "Can block enterprise, sensitive-data, or production recommendations.",
    response: "Update policy snapshots and require human review before claims publish.",
  },
  {
    signal: "New entrant gains category attention",
    impact: "Can require new review coverage, alternative pages, and benchmark inclusion.",
    response: "Add to intake queue, classify segment, and assign first benchmark task.",
  },
];

const marketWatchPriorities = [
  "Keep Lovable, Bolt.new, Replit Agent, v0, Cursor, Base44, and Windsurf as the first authority cluster.",
  "Separate prompt-to-app builders from AI IDEs so comparisons do not flatten different use cases.",
  "Track no-code incumbents as alternatives, not as identical vibe-coding products.",
  "Promote a tool in rankings only after fresh benchmark evidence supports the move.",
  "Treat sudden category buzz as an intake trigger, not as proof of quality.",
];

const intakeStages = [
  {
    stage: "Discover",
    owner: "Market watcher",
    input: "Reader submission, category buzz, launch announcement, competitor mention, or search demand.",
    exit: "Tool has canonical name, URL, category hypothesis, and reason to track.",
  },
  {
    stage: "Classify",
    owner: "Research editor",
    input: "Product positioning, buyer intent, feature set, pricing model, and comparable tools.",
    exit: "Tool is assigned to a segment, benchmark family, and coverage priority.",
  },
  {
    stage: "Qualify",
    owner: "Benchmark lead",
    input: "Official docs, pricing page, changelog, terms, and first hands-on notes.",
    exit: "Required source snapshots and first benchmark task are identified.",
  },
  {
    stage: "Test",
    owner: "Benchmark runner",
    input: "Benchmark prompt, account access, artifact requirements, and scoring model.",
    exit: "Benchmark run, artifact, deploy/handoff notes, and failure taxonomy are saved.",
  },
  {
    stage: "Publish or park",
    owner: "Editorial lead",
    input: "Evidence gates, QA result, market role, and audience value.",
    exit: "Tool becomes a review, watchlist entry, comparison candidate, or rejected/parked item.",
  },
];

const coverageLanes = [
  {
    lane: "Core authority",
    criteria: "High search demand, direct vibe-coding relevance, and strong buyer confusion.",
    examples: ["Lovable", "Bolt.new", "Replit Agent", "v0", "Cursor", "Base44", "Windsurf"],
    action: "Full review, comparison coverage, best-of eligibility, benchmark reruns.",
  },
  {
    lane: "Adjacent evidence",
    criteria: "Useful comparison context but not a direct prompt-to-app replacement.",
    examples: ["Bubble AI", "FlutterFlow AI", "Retool AI", "Framer AI"],
    action: "Segmented review, alternative page, limited best-of inclusion with boundary notes.",
  },
  {
    lane: "Watchlist",
    criteria: "Early product, limited evidence, unclear traction, or narrow use case.",
    examples: ["New entrants", "experimental agents", "niche UI tools"],
    action: "Track signals, capture sources, delay verdict until benchmark evidence exists.",
  },
  {
    lane: "Rejected or parked",
    criteria: "Not relevant, too little public information, unsafe claims, or no testable workflow.",
    examples: ["Generic AI tools", "undocumented launches", "thin wrappers"],
    action: "Do not publish a review; optionally mention in market notes if relevant.",
  },
];

const intakeRejectionReasons = [
  "No public product surface or official documentation to verify.",
  "Not meaningfully related to app building, no-code, AI coding, or production handoff.",
  "Cannot be benchmarked with repeatable prompts or observable artifacts.",
  "Only vendor-provided claims exist and no independent evidence can be captured.",
  "The tool is a thin wrapper with no distinct buyer value or category signal.",
];

const dataCollections = [
  {
    name: "benchmarkRuns",
    purpose: "Stores repeatable test results that move review scores, comparisons, reports, and build logs.",
    required: ["tool", "benchmark", "deployStatus", "evidenceNotes"],
    dependsOn: ["benchmarkPrompts", "tools"],
  },
  {
    name: "articleBriefs",
    purpose: "Stores controlled article briefs before autonomous drafting begins.",
    required: ["title", "targetKeyword", "articleType", "requiredEvidence", "angle", "publishGate"],
    dependsOn: ["contentPipeline", "seoTemplates"],
  },
  {
    name: "evidenceSnapshots",
    purpose: "Stores official source, pricing, feature, and limitation snapshots for freshness gates.",
    required: ["tool", "sourceType", "sourceUrl", "pricingSummary", "featureSummary"],
    dependsOn: ["sourceWatchRules", "tools"],
  },
  {
    name: "reviewRecords",
    purpose: "Stores editor verdicts, scores, pros, cons, affiliate URLs, and publish notes.",
    required: ["tool", "status", "verdict", "pros", "cons"],
    dependsOn: ["qualityChecks", "benchmarkRuns", "evidenceSnapshots"],
  },
  {
    name: "artifacts",
    purpose: "Stores screenshots, generated app URLs, repos, exports, recordings, and benchmark proof assets.",
    required: ["tool", "artifactType", "title", "url"],
    dependsOn: ["benchmarkRuns", "reviewRecords"],
  },
  {
    name: "qualityChecks",
    purpose: "Stores final QA scores and disclosure readiness before publication.",
    required: ["tool", "evidenceScore", "factualityScore", "originalityScore", "seoScore", "disclosureReady", "notes"],
    dependsOn: ["qualityThresholds", "claimStandards"],
  },
];

const dataExportRules = [
  "Export records as JSON first; add SQL or CMS sync only after schemas stabilize.",
  "Every exported review should include its evidence gates and latest freshness state.",
  "Reports should export with a dated evidence window and the source records that support each claim.",
  "Programmatic pages should export only when their template evidence requirements are satisfied.",
  "Monetized pages should export disclosure readiness and affiliate/sponsor separation status.",
];

const databaseTables = [
  {
    table: "tools",
    purpose: "Canonical platform records.",
    keyFields: ["id", "slug", "name", "category", "official_url", "affiliate_status", "created_at", "updated_at"],
    relations: "Parent table for reviews, snapshots, benchmarks, artifacts, QA, and pages.",
  },
  {
    table: "source_snapshots",
    purpose: "Official pricing, docs, changelog, terms, privacy, and limitations evidence.",
    keyFields: ["id", "tool_id", "source_type", "source_url", "summary", "captured_at", "expires_at"],
    relations: "Belongs to tools; supports claims, pages, reports, and freshness gates.",
  },
  {
    table: "benchmark_runs",
    purpose: "Repeatable benchmark execution and scoring records.",
    keyFields: ["id", "tool_id", "benchmark_id", "deploy_status", "final_score", "evidence_notes", "run_at"],
    relations: "Belongs to tools and benchmark definitions; links to artifacts and review records.",
  },
  {
    table: "artifacts",
    purpose: "Screenshots, generated app URLs, deploy links, exports, repos, recordings, and proof assets.",
    keyFields: ["id", "tool_id", "benchmark_run_id", "artifact_type", "title", "url", "created_at"],
    relations: "Belongs to tools; optionally belongs to benchmark runs and public pages.",
  },
  {
    table: "review_records",
    purpose: "Editorial verdicts, scores, pros/cons, affiliate URLs, and publish notes.",
    keyFields: ["id", "tool_id", "status", "score", "verdict", "pros", "cons", "updated_at"],
    relations: "Belongs to tools; feeds review pages, comparison pages, and best-of rankings.",
  },
  {
    table: "quality_checks",
    purpose: "Evidence, factuality, originality, SEO, and disclosure readiness gates.",
    keyFields: ["id", "tool_id", "page_id", "scores", "disclosure_ready", "notes", "checked_at"],
    relations: "Belongs to tools or pages; blocks publication when thresholds fail.",
  },
  {
    table: "pages",
    purpose: "Canonical public CMS-backed page records.",
    keyFields: ["id", "slug", "page_type", "canonical_url", "publish_state", "evidence_state", "published_at"],
    relations: "Joins to tools, evidence records, reports, and internal-link records.",
  },
];

const databaseRelations = [
  "tools.id -> source_snapshots.tool_id",
  "tools.id -> benchmark_runs.tool_id",
  "benchmark_runs.id -> artifacts.benchmark_run_id",
  "tools.id -> review_records.tool_id",
  "tools.id -> quality_checks.tool_id",
  "pages.id -> quality_checks.page_id",
  "pages.id -> page_evidence.page_id",
  "source_snapshots.id / benchmark_runs.id / artifacts.id -> page_evidence.evidence_id",
];

const databaseIndexes = [
  "Unique index on tools.slug.",
  "Unique index on pages.canonical_url.",
  "Composite index on source_snapshots(tool_id, source_type, captured_at).",
  "Composite index on benchmark_runs(tool_id, benchmark_id, run_at).",
  "Composite index on quality_checks(page_id, checked_at).",
  "Index page_evidence by page_id and evidence_type for fast citation rendering.",
];

const databaseMigrationRules = [
  "Add stable IDs before migrating local JSON records.",
  "Preserve original created_at and captured_at timestamps during import.",
  "Never store tool names as primary references once tool_id exists.",
  "Use join tables for page evidence instead of duplicating source URLs into page content.",
  "Keep schema migrations reversible until the CMS and public routes are stable.",
];

const apiEndpointFamilies = [
  {
    family: "Evidence capture",
    endpoints: ["/api/source-snapshots", "/api/benchmark-runs", "/api/artifacts", "/api/quality-checks"],
    consumers: "Admin app, benchmark workers, source watcher.",
    contract: "Create structured evidence records with stable IDs, timestamps, tool_id, and evidence state.",
  },
  {
    family: "Editorial workflow",
    endpoints: ["/api/article-briefs", "/api/review-records", "/api/pages", "/api/corrections"],
    consumers: "Admin app, CMS sync, editorial review queues.",
    contract: "Manage publish state, verdicts, claim checks, canonical URLs, and correction notes.",
  },
  {
    family: "Public read API",
    endpoints: ["/api/public/reviews/{slug}", "/api/public/compare/{slug}", "/api/public/reports/{slug}"],
    consumers: "Public frontend and generated routes.",
    contract: "Return only publishable, disclosure-ready, canonicalized page data with evidence badges.",
  },
  {
    family: "Automation jobs",
    endpoints: ["/api/jobs/source-watch", "/api/jobs/benchmark", "/api/jobs/refresh", "/api/jobs/report-package"],
    consumers: "Scheduled workers and manual admin triggers.",
    contract: "Create reviewable job records and never mutate public verdicts without approval.",
  },
  {
    family: "Analytics events",
    endpoints: ["/api/events/review-opened", "/api/events/cta-clicked", "/api/events/report-requested"],
    consumers: "Public frontend, newsletter, reports, and distribution assets.",
    contract: "Capture page, tool, evidence state, disclosure state, freshness state, and session context.",
  },
];

const apiValidationRules = [
  "POST and PATCH requests must validate required fields before writing records.",
  "Public read endpoints must filter out unpublished, blocked, or non-canonical pages.",
  "Every mutating endpoint must write created_at/updated_at and actor/job context.",
  "Evidence endpoints must reject records without a tool_id or page_id relationship when one is required.",
  "Affiliate, sponsor, pricing, and production claims must include disclosure/freshness fields in the response.",
];

const apiSecurityBoundaries = [
  "Public endpoints are read-only and return no admin notes, private vendor contacts, or draft records.",
  "Admin endpoints require authenticated users and role-based permissions.",
  "Worker endpoints require signed job tokens and write audit logs.",
  "Artifact uploads must validate file type, size, metadata, and evidence linkage.",
  "Rate-limit public endpoints and all form submissions to protect the evidence store.",
];

const accessRoles = [
  {
    role: "Public reader",
    access: "Read published canonical pages, public reports, evidence badges, and disclosures.",
    denied: "Draft pages, admin notes, vendor contacts, raw job logs, and unpublished evidence.",
  },
  {
    role: "Research editor",
    access: "Create and update source snapshots, taxonomy notes, vendor claim records, and tool classifications.",
    denied: "Publishing final verdicts, launching affiliate CTAs, or changing production recommendations alone.",
  },
  {
    role: "Benchmark lead",
    access: "Create benchmark runs, attach artifacts, update deploy outcomes, and propose score movement.",
    denied: "Publishing rankings, sponsor placements, or policy disclaimers alone.",
  },
  {
    role: "Editorial lead",
    access: "Approve verdicts, rankings, comparison winners, best-of order, and report findings.",
    denied: "Bypassing policy review for monetized, production, privacy, or security claims.",
  },
  {
    role: "Trust and policy reviewer",
    access: "Approve disclosures, corrections, sensitive claims, affiliate surfaces, and sponsor labels.",
    denied: "Changing benchmark evidence or source records without evidence owner review.",
  },
  {
    role: "Worker service",
    access: "Create job logs, source-watch records, benchmark drafts, refresh tasks, and report packages.",
    denied: "Publishing final pages, changing verdicts, or launching monetized CTAs.",
  },
];

const permissionMatrix = [
  { action: "Read public page", allowed: ["Public reader", "Research editor", "Benchmark lead", "Editorial lead", "Trust and policy reviewer"], approval: "Published canonical page only." },
  { action: "Create evidence record", allowed: ["Research editor", "Benchmark lead", "Worker service"], approval: "Requires tool/page linkage and audit context." },
  { action: "Approve final verdict", allowed: ["Editorial lead"], approval: "Requires evidence gates and QA pass." },
  { action: "Approve monetized CTA", allowed: ["Trust and policy reviewer", "Growth operator"], approval: "Requires disclosure readiness and fresh pricing source." },
  { action: "Trigger automation job", allowed: ["Research editor", "Benchmark lead", "Editorial lead", "Worker service"], approval: "Job token or authenticated admin action required." },
  { action: "Publish page", allowed: ["Editorial lead", "Trust and policy reviewer"], approval: "Requires publish state Ready and no active blockers." },
];

const authSecurityRules = [
  "Use role-based access control instead of shared admin passwords.",
  "Separate human sessions from worker tokens and CMS webhooks.",
  "Log actor, role, action, target record, and timestamp for every mutating request.",
  "Require elevated approval for verdict changes, monetized CTAs, policy disclaimers, and page publication.",
  "Public pages must never expose draft records, admin comments, raw vendor contacts, or private job details.",
];

const cmsContentTypes = [
  {
    type: "Tool",
    purpose: "Canonical platform entity used across reviews, comparisons, rankings, and benchmark runs.",
    fields: ["name", "slug", "category", "officialUrl", "affiliateStatus", "currentScore", "status"],
    source: "tools + reviewRecords + evidenceSnapshots",
  },
  {
    type: "ReviewPage",
    purpose: "Public review surface with verdict, score, pros/cons, evidence gates, and disclosure state.",
    fields: ["tool", "slug", "verdict", "score", "evidenceState", "trustBadges", "canonicalUrl"],
    source: "reviewRecords + benchmarkRuns + artifacts + qualityChecks",
  },
  {
    type: "ComparisonPage",
    purpose: "Two-tool buying-intent page with evidence parity, category boundary, and provisional winner state.",
    fields: ["toolA", "toolB", "slug", "winnerState", "evidenceParity", "canonicalUrl"],
    source: "reviewRecords + benchmarkRuns + evidenceSnapshots",
  },
  {
    type: "BestOfGuide",
    purpose: "Use-case ranking page with methodology, provisional labels, and internal links.",
    fields: ["title", "slug", "useCase", "rankedTools", "evidenceWindow", "canonicalUrl"],
    source: "bestOfGuides + readinessRows + qualityChecks",
  },
  {
    type: "BenchmarkPage",
    purpose: "Original proof page for a benchmark task, tool output, artifacts, and score movement.",
    fields: ["tool", "benchmark", "slug", "prompt", "result", "artifacts", "score"],
    source: "benchmarkRuns + artifacts",
  },
  {
    type: "ReportPage",
    purpose: "Recurring authority report with evidence window, findings, exclusions, and sponsorship state.",
    fields: ["title", "slug", "issueDate", "evidenceWindow", "findings", "methodology", "canonicalUrl"],
    source: "authorityReports + evidence graph + qualityChecks",
  },
];

const publishingStates = [
  {
    state: "Queued",
    meaning: "Page is planned but evidence requirements are not yet attached.",
    exit: "Assign owner, URL, keyword, evidence gate, and benchmark/source requirements.",
  },
  {
    state: "Drafting",
    meaning: "Brief exists and evidence capture is in progress.",
    exit: "Attach required records and generate controlled draft.",
  },
  {
    state: "Evidence review",
    meaning: "Draft exists but claims need source, benchmark, artifact, or QA validation.",
    exit: "Resolve unsupported claims and evidence gaps.",
  },
  {
    state: "Ready",
    meaning: "Page passes QA, disclosure, freshness, and canonical URL checks.",
    exit: "Publish or schedule.",
  },
  {
    state: "Published",
    meaning: "Public canonical URL is live and eligible for distribution.",
    exit: "Monitor source freshness, corrections, and ranking movement.",
  },
  {
    state: "Refresh needed",
    meaning: "A source, benchmark, correction, or policy signal invalidated part of the page.",
    exit: "Refresh evidence, update page, and log material changes.",
  },
];

const cmsMigrationSteps = [
  "Keep local JSON as the prototype source until schemas stabilize.",
  "Move core entities into database tables with stable IDs before adding a headless CMS.",
  "Use the CMS for page composition, editorial workflow, scheduled publish, and previews.",
  "Keep benchmarks, artifacts, source snapshots, and QA checks in structured data tables.",
  "Generate public pages from CMS entries joined with evidence records and freshness state.",
];

const evidenceNodeTypes = [
  {
    node: "Source snapshot",
    proves: "Pricing, plan limits, official feature availability, terms, privacy, and release claims.",
    cannotProve: "Hands-on build quality, generated code maintainability, or deploy success.",
    record: "evidenceSnapshots",
  },
  {
    node: "Benchmark run",
    proves: "Task completion, functional behavior, repair difficulty, deploy result, and scoring movement.",
    cannotProve: "Official pricing, legal terms, or future roadmap claims.",
    record: "benchmarkRuns",
  },
  {
    node: "Artifact",
    proves: "Observable output: screenshots, generated apps, repos, exports, recordings, and deployment URLs.",
    cannotProve: "Claims not visible in the artifact or unsupported by the benchmark note.",
    record: "artifacts",
  },
  {
    node: "Review record",
    proves: "Editorial verdict, pros, cons, score override, affiliate URL, and publish notes.",
    cannotProve: "Facts without supporting source, benchmark, or artifact records.",
    record: "reviewRecords",
  },
  {
    node: "Quality check",
    proves: "Final evidence, factuality, originality, SEO, and disclosure readiness status.",
    cannotProve: "Underlying product capabilities by itself.",
    record: "qualityChecks",
  },
];

const evidenceClaimMap = [
  {
    claim: "Best overall",
    required: ["Benchmark run", "Source snapshot", "Artifact", "Quality check"],
    publishRule: "Comparable tools must use the same benchmark family and freshness window.",
  },
  {
    claim: "Best value",
    required: ["Source snapshot", "Review record", "Quality check"],
    publishRule: "Pricing snapshot must be fresh before affiliate CTAs appear.",
  },
  {
    claim: "Production-ready",
    required: ["Benchmark run", "Artifact", "Source snapshot", "Quality check"],
    publishRule: "Deploy, auth, data, secrets, and handoff evidence must be present.",
  },
  {
    claim: "Fastest",
    required: ["Benchmark run", "Artifact"],
    publishRule: "Use timed or logged build evidence, not subjective impression.",
  },
  {
    claim: "Good for nontechnical founders",
    required: ["Benchmark run", "Review record", "Artifact", "Quality check"],
    publishRule: "Disclose when code inspection, terminal work, or manual repair is required.",
  },
];

const citationRules = [
  "Every paragraph with pricing, limits, security, privacy, export, or deployment claims needs a source or evidence record.",
  "Every comparison winner needs evidence for both tools, not just a strong record for one tool.",
  "Artifacts can support observations only when they are linked to the benchmark or review context that produced them.",
  "Review records can state editorial judgment, but factual claims must point to source snapshots or benchmark artifacts.",
  "Reports must include a dated evidence window and identify which records were eligible for inclusion.",
];

const generationSurfaces = [
  {
    surface: "Article briefs",
    input: "SEO template, audience segment, taxonomy, claim standards, required evidence.",
    output: "Controlled outline, angle, internal links, evidence checklist, publish gate.",
    boundary: "Briefs can start drafting but cannot create factual claims without records.",
  },
  {
    surface: "Review drafts",
    input: "Review record, benchmark runs, snapshots, artifacts, QA requirements, category playbook.",
    output: "Draft sections with provisional labels, citations needed, and blocked claims.",
    boundary: "Drafts cannot publish until quality gateway and disclosure checks pass.",
  },
  {
    surface: "Comparison summaries",
    input: "Two review records, comparable benchmark evidence, source freshness, category boundary.",
    output: "Decision summary, evidence parity notes, winner state, unresolved gaps.",
    boundary: "No winner language when evidence parity is incomplete.",
  },
  {
    surface: "Report narratives",
    input: "Evidence window, benchmark data, source snapshots, corrections, ranking movement.",
    output: "Executive summary, findings, exclusions, changes since last report.",
    boundary: "Report text must preserve evidence window and methodology constraints.",
  },
  {
    surface: "Distribution copy",
    input: "Published page, verdict state, disclosure state, evidence badges, correction status.",
    output: "Newsletter, social, video, and card copy linked back to source pages.",
    boundary: "Distribution copy cannot be stronger than the underlying published page.",
  },
];

const promptContracts = [
  {
    contract: "Grounding",
    rule: "Use only provided evidence records, snapshots, benchmark notes, artifacts, and approved taxonomy.",
    fail: "Hallucinated product facts, unsupported pricing, or uncited feature claims.",
  },
  {
    contract: "Claim strength",
    rule: "Match language to evidence state: provisional, evidence-backed, or blocked.",
    fail: "Best, fastest, cheapest, or production-ready claims without mapped evidence.",
  },
  {
    contract: "Disclosure",
    rule: "Carry affiliate, sponsor, vendor-provided evidence, and correction status into generated copy.",
    fail: "Monetized or vendor-influenced text without visible disclosure state.",
  },
  {
    contract: "Category accuracy",
    rule: "Use controlled taxonomy and state when comparisons are direct, adjacent, or buyer-intent based.",
    fail: "Flattening AI IDEs, prompt-to-app builders, UI generators, and no-code incumbents into one category.",
  },
  {
    contract: "Actionability",
    rule: "Generate next actions for missing evidence, blockers, QA, and refresh tasks.",
    fail: "Polished prose that hides unresolved evidence gaps.",
  },
];

const generationValidationRules = [
  "Generated text must list every claim that requires a source, benchmark, artifact, or QA record.",
  "Generated verdicts must include verdict state: blocked, provisional, evidence-backed, or ready.",
  "Generated comparisons must state evidence parity for both tools.",
  "Generated report sections must include evidence window and exclusions.",
  "Generated distribution copy must link to a canonical published page and preserve disclosure state.",
  "Generated drafts cannot update scores, rankings, verdicts, CTAs, or public pages without approval.",
];

const modelRoutingTiers = [
  {
    tier: "Fast drafting",
    use: "Brief expansion, outline variants, metadata, refresh summaries, social copy.",
    qualityGate: "Must preserve source IDs, disclosure state, and blocked claim list.",
    budgetRule: "Use low-cost models unless the task touches verdicts or legal-sensitive claims.",
  },
  {
    tier: "Evidence reasoning",
    use: "Claim extraction, evidence parity checks, contradiction review, benchmark interpretation.",
    qualityGate: "Must produce a structured claim map and cite record IDs for every conclusion.",
    budgetRule: "Use stronger models when comparisons affect rankings, best-of guides, or reports.",
  },
  {
    tier: "Editorial synthesis",
    use: "Final draft pass, report narrative, executive summaries, buyer recommendations.",
    qualityGate: "Must run after evidence reasoning and before human approval.",
    budgetRule: "Reserve premium models for publish-candidate pages and monetized surfaces.",
  },
  {
    tier: "Audit and challenge",
    use: "Adversarial review, unsupported-claim detection, sponsor/disclosure checks.",
    qualityGate: "Must independently inspect the generated output against evidence records.",
    budgetRule: "Run on high-value pages, major ranking changes, and production-ready claims.",
  },
];

const modelTaskPolicies = [
  {
    task: "Source snapshot summary",
    requiredInputs: "Official URL, captured text, checked date, source type, affected fields.",
    blockedOutputs: "New pricing claims, legal interpretation, or vendor comparison language.",
  },
  {
    task: "Benchmark interpretation",
    requiredInputs: "Prompt, tool output, screenshots, deploy notes, failure taxonomy, reviewer notes.",
    blockedOutputs: "Score changes without QA record or cross-tool winner claims without parity.",
  },
  {
    task: "Review article draft",
    requiredInputs: "Review record, claim ledger, benchmark runs, artifacts, source snapshots.",
    blockedOutputs: "Final verdict, affiliate CTA, or production-ready claim without approval.",
  },
  {
    task: "Best-of recommendation",
    requiredInputs: "Eligible reviews, category boundary, evidence window, monetization disclosure.",
    blockedOutputs: "Overall winner language when categories or evidence windows do not match.",
  },
];

const modelGuardrails = [
  "Every model call stores prompt version, input record IDs, output hash, cost estimate, and reviewer status.",
  "Any output that changes verdict, score, ranking, disclosure, or CTA state requires human approval.",
  "Retry with a stronger model only after recording the failure mode, not silently.",
  "Generated copy cannot cite sources that were not present in the prompt context.",
  "High-cost model routes require a publish candidate, revenue page, report, or major correction trigger.",
];

const trustPrinciples = [
  {
    principle: "Evidence before verdict",
    readerPromise: "Scores, winners, and recommendations do not become final until the required evidence records exist.",
    operatingRule: "Use provisional language whenever benchmark, source, artifact, review, or QA gates are incomplete.",
  },
  {
    principle: "Commercial separation",
    readerPromise: "Affiliate and sponsor relationships do not control rankings, scores, verdicts, or criticism.",
    operatingRule: "Partner status is tracked separately from review score and must be disclosed before monetized links.",
  },
  {
    principle: "Visible revision history",
    readerPromise: "Material factual corrections and verdict changes are logged instead of silently rewritten.",
    operatingRule: "Publish dated change notes when revisions affect recommendations, rankings, pricing claims, or disclosures.",
  },
  {
    principle: "Category clarity",
    readerPromise: "Tools are compared by use case and category, not forced into misleading broad rankings.",
    operatingRule: "State whether a comparison is direct, adjacent, or buyer-intent based before declaring a winner.",
  },
  {
    principle: "Source freshness",
    readerPromise: "Pricing, feature, privacy, and limits claims expire when official sources change or age out.",
    operatingRule: "Block stale pricing and production claims until source snapshots are refreshed.",
  },
];

const complianceDomains = [
  {
    domain: "Affiliate disclosure",
    risk: "Readers may not know when links or recommendations are monetized.",
    requiredEvidence: "Partner status, affiliate URL, disclosure-ready QA, CTA placement record.",
    blocks: "Affiliate CTA, sponsor unit, best-value claim, and monetized comparison winner.",
  },
  {
    domain: "Privacy and data handling",
    risk: "Tools may retain, train on, or expose user/project data in ways relevant to production use.",
    requiredEvidence: "Terms/privacy snapshot, data-retention notes, training-data language, sensitive-data warning.",
    blocks: "Enterprise-ready, sensitive-data-safe, or production-ready recommendations.",
  },
  {
    domain: "Security posture",
    risk: "Generated apps may mishandle auth, secrets, permissions, databases, or deployment controls.",
    requiredEvidence: "Benchmark notes, artifact inspection, deploy notes, auth/data review, security caveats.",
    blocks: "Production-ready, pilot-safe, and nontechnical-founder recommendations.",
  },
  {
    domain: "Pricing and plan limits",
    risk: "Credit systems, plan limits, seat rules, or usage caps can change value recommendations.",
    requiredEvidence: "Fresh pricing snapshot, plan-limit notes, dated source URL, change-log status.",
    blocks: "Best value, cheapest, pricing table, and affiliate CTA near pricing claims.",
  },
  {
    domain: "Vendor claims and corrections",
    risk: "Vendor-provided claims can bias coverage or update verdicts without independent proof.",
    requiredEvidence: "Official source, independent benchmark rerun, correction note, reviewer decision.",
    blocks: "Score change, verdict upgrade, ranking move, or correction publication.",
  },
];

const complianceReviewTriggers = [
  "A page recommends a tool for production, enterprise, sensitive data, or nontechnical users.",
  "A page includes affiliate links, sponsor placements, paid report CTAs, or tool-submission offers.",
  "A pricing, privacy, security, ownership, retention, or training-data claim changed since last snapshot.",
  "A vendor requests a correction, score change, or revised conclusion.",
  "A report or best-of guide uses broad winner language across multiple tool categories.",
];

const policyDisclaimers = [
  {
    surface: "Reviews",
    text: "NoCodeReviewed publishes evidence-based editorial analysis, not legal, financial, or security advice.",
  },
  {
    surface: "Production readiness",
    text: "Production-readiness notes are based on observable tests and source review; teams should run their own security and legal review before deployment.",
  },
  {
    surface: "Affiliate links",
    text: "Some links may be affiliate links. Commercial relationships do not determine scores, rankings, or verdicts.",
  },
  {
    surface: "Pricing",
    text: "Pricing and plan details can change. Each pricing claim should show the latest checked date and source.",
  },
];

const disclosureSurfaces = [
  {
    surface: "Review pages",
    disclosure: "Affiliate status, evidence completeness, last source check, and provisional/final verdict state.",
    placement: "Near verdict module and before the first monetized CTA.",
  },
  {
    surface: "Comparison pages",
    disclosure: "Evidence parity, direct-versus-adjacent category boundary, affiliate status for both tools.",
    placement: "Before winner callout and inside comparison summary.",
  },
  {
    surface: "Best-of pages",
    disclosure: "Ranking methodology, evidence window, provisional entries, monetized links.",
    placement: "Before ranking list and near CTA blocks.",
  },
  {
    surface: "Reports",
    disclosure: "Evidence window, methodology, exclusions, sponsor state, and changed verdicts.",
    placement: "Report cover/intro and methodology section.",
  },
  {
    surface: "Social and video",
    disclosure: "Link to source page, evidence date, and whether a recommendation is provisional.",
    placement: "Caption, description, or card footer.",
  },
];

const readerTrustBadges = [
  "Benchmarked",
  "Fresh source",
  "Artifact attached",
  "QA passed",
  "Disclosure ready",
  "Provisional",
  "Correction logged",
];

const designSystemLayers = [
  {
    layer: "Authority layer",
    use: "Heroes, report covers, social cards, launch announcements, YouTube banners, and institutional brand moments.",
    tone: "Dark, cinematic, precise, infrastructure-grade, high-contrast.",
    avoid: "Fake product evidence, unreadable UI, generic AI glow, or decorative visuals that imply unsupported proof.",
  },
  {
    layer: "Evidence layer",
    use: "Reviews, comparison tables, benchmark pages, citations, QA states, admin capture, and data-heavy workflows.",
    tone: "Light, fast, readable, dense, restrained, and operational.",
    avoid: "Marketing-style hero bloat, decorative cards inside cards, vague badges, and unsupported winner emphasis.",
  },
  {
    layer: "Report layer",
    use: "Platform indexes, monthly reports, executive summaries, downloadable PDFs, and stakeholder-facing findings.",
    tone: "Institutional, dated, sober, data-forward, and visually consistent with the VCA identity.",
    avoid: "Undated rankings, sponsor confusion, decorative charts, or methodology hidden below commercial CTAs.",
  },
  {
    layer: "Operational layer",
    use: "Admin, readiness, automation, evidence graph, correction workflow, and source watcher screens.",
    tone: "Compact, scannable, action-oriented, low ornament, clear blocked/ready state.",
    avoid: "Ambiguous status colors, hidden blockers, oversized headings inside dense tools, and layout shifts.",
  },
];

const componentStandards = [
  {
    component: "Verdict module",
    requirement: "Shows score, provisional/final state, evidence badges, disclosure note, and last source check.",
  },
  {
    component: "Review card",
    requirement: "Shows category, fit, score, gate state, and one next action. No sponsor styling unless labeled.",
  },
  {
    component: "Comparison table",
    requirement: "Keeps both tools visible, marks evidence gaps, and avoids winner language until parity exists.",
  },
  {
    component: "Benchmark card",
    requirement: "Shows prompt family, task, deploy result, artifact status, and manual repair count when available.",
  },
  {
    component: "Trust badge",
    requirement: "Uses controlled badge language and maps to a real evidence state.",
  },
  {
    component: "Report cover",
    requirement: "Shows report title, issue date/evidence window, methodology link, and sponsor state when relevant.",
  },
];

const interfaceRules = [
  "Evidence interfaces should prioritize tables, grids, compact cards, badges, and clear blocked states.",
  "Authority visuals should not be used as proof unless they are covers or promotional assets pointing back to evidence.",
  "Every dense panel needs stable layout dimensions so badges, labels, and dynamic counts do not cause major shifts.",
  "Reader-facing CTAs must sit after evidence or disclosure context, not before it.",
  "Use restrained contrast and typography for data surfaces; reserve cinematic contrast for authority assets.",
];

const automationAgents = [
  {
    agent: "Source Watcher",
    cadence: "Daily",
    input: "Pricing pages, docs, changelogs, terms, product UI notes.",
    output: "Fresh source snapshots, invalidation tasks, affected page list.",
    approval: "Human review required for legal/privacy changes and pricing claims near monetized CTAs.",
  },
  {
    agent: "Benchmark Runner",
    cadence: "Weekly batch",
    input: "Benchmark prompts, tool accounts, source snapshots, artifact requirements.",
    output: "Benchmark runs, screenshots, deploy notes, failure taxonomy, artifacts.",
    approval: "Human review required before scores affect rankings.",
  },
  {
    agent: "Brief Builder",
    cadence: "On demand",
    input: "SEO template, audience segment, claim standards, required evidence.",
    output: "Article brief with publish gate, angle, internal links, evidence checklist.",
    approval: "Human review required before autonomous drafting.",
  },
  {
    agent: "Draft Generator",
    cadence: "After brief approval",
    input: "Approved brief, evidence graph, review records, benchmark runs, snapshots, artifacts.",
    output: "Draft article or report with provisional labels where gates are incomplete.",
    approval: "Cannot publish directly; must enter Quality Gateway.",
  },
  {
    agent: "Quality Gateway",
    cadence: "Before publish",
    input: "Draft, evidence records, claims ledger, disclosure state, freshness state.",
    output: "Pass/block QA record and contradiction notes.",
    approval: "Human review required for final recommendations and monetized pages.",
  },
  {
    agent: "Refresh Agent",
    cadence: "Weekly",
    input: "Invalidators, stale snapshots, changed benchmarks, ranking shifts.",
    output: "Refresh queue, revised briefs, affected reports, updated provisional labels.",
    approval: "Human review required when rankings or verdicts change.",
  },
];

const automationKillSwitches = [
  "Quality pass rate falls below threshold for the latest batch.",
  "Source watcher detects pricing or policy changes for a monetized recommendation.",
  "Benchmark outputs contradict current rankings.",
  "A draft includes unsupported production-ready, fastest, cheapest, or best-overall claims.",
  "Affiliate or sponsor content appears without disclosure readiness.",
];

const operatingRoles = [
  {
    role: "Research editor",
    owns: "Source snapshots, taxonomy, market classification, vendor claim validation.",
    approves: "Official-source claims, privacy/terms notes, pricing summaries.",
    escalates: "Policy changes, ambiguous vendor claims, or stale monetized claims.",
  },
  {
    role: "Benchmark lead",
    owns: "Prompt design, benchmark runs, artifacts, deploy/handoff notes.",
    approves: "Score movement, benchmark comparability, failure taxonomy.",
    escalates: "Contradictory outputs, broken deploy paths, or non-repeatable tests.",
  },
  {
    role: "Editorial lead",
    owns: "Verdicts, rankings, article briefs, final page structure.",
    approves: "Review conclusions, comparison winners, best-of order, report findings.",
    escalates: "Unsupported strong claims, category-boundary issues, major verdict changes.",
  },
  {
    role: "Trust and policy reviewer",
    owns: "Disclosures, corrections, compliance triggers, sensitive claims.",
    approves: "Affiliate surfaces, sponsor labeling, policy disclaimers, correction notes.",
    escalates: "Production, privacy, security, legal, or monetized recommendation risk.",
  },
  {
    role: "Growth operator",
    owns: "SEO, distribution, analytics, conversion, report packaging.",
    approves: "Campaign copy, social assets, CTAs after evidence/disclosure gates.",
    escalates: "Distribution copy stronger than the underlying evidence.",
  },
];

const approvalMatrix = [
  {
    workflow: "New review publish",
    required: ["Research editor", "Benchmark lead", "Editorial lead", "Trust and policy reviewer"],
    blockedBy: "Missing evidence gate, stale source, unsupported verdict, disclosure failure.",
  },
  {
    workflow: "Comparison winner",
    required: ["Benchmark lead", "Editorial lead"],
    blockedBy: "No comparable runs, category mismatch, evidence parity failure.",
  },
  {
    workflow: "Affiliate CTA launch",
    required: ["Trust and policy reviewer", "Growth operator"],
    blockedBy: "No disclosure, stale pricing, unsupported value claim.",
  },
  {
    workflow: "Report publication",
    required: ["Research editor", "Editorial lead", "Trust and policy reviewer", "Growth operator"],
    blockedBy: "Missing evidence window, sponsor confusion, claim ledger failure.",
  },
  {
    workflow: "Verdict or ranking change",
    required: ["Benchmark lead", "Editorial lead", "Trust and policy reviewer"],
    blockedBy: "No evidence delta, vendor-only claim, missing correction note.",
  },
];

const escalationPaths = [
  "Policy or privacy change blocks publication until trust review resolves the claim.",
  "Benchmark contradiction pauses ranking movement until rerun or failure note is saved.",
  "Revenue pressure escalates to editorial lead when CTA copy exceeds evidence strength.",
  "Vendor correction requests require research editor evidence validation before score changes.",
  "Quality score below threshold sends the page back to drafting with blocked claims listed.",
];

const launchPackages = [
  {
    package: "Private alpha",
    status: "Build now",
    includes: ["28-platform review directory", "Evidence capture admin", "Readiness dashboard", "Methodology and claims ledger"],
    gate: "Internal navigation, local storage, and verification script pass without broken routes.",
  },
  {
    package: "Public beta",
    status: "Next",
    includes: ["Core 7 review dossiers", "3 best-of guides", "2 focused comparisons", "Benchmark runner proof", "Disclosure policy"],
    gate: "Each public recommendation must have benchmark, fresh source snapshot, artifact, review record, and QA.",
  },
  {
    package: "Authority launch",
    status: "Queued",
    includes: ["Vibe Coding Platform Index", "Prompt-to-App Benchmark Report", "Source watcher cadence", "Programmatic SEO templates"],
    gate: "Reports use dated evidence windows and all ranked claims pass quality gateway.",
  },
  {
    package: "Revenue launch",
    status: "After trust",
    includes: ["Affiliate links", "Paid report offer", "Tool submission intake", "Consulting lead path"],
    gate: "Disclosure readiness, monetization firewall, and fresh pricing evidence are present.",
  },
];

const launchBlockers = [
  "No benchmark evidence for a recommended core platform.",
  "No source snapshot for pricing or feature claims.",
  "Quality gateway has not passed for public recommendation pages.",
  "Affiliate CTA exists without disclosure readiness.",
  "Best-of page ranks tools without provisional labels for incomplete evidence.",
  "Report lacks dated evidence window or supporting records.",
];

const mvpExecutionTracks = [
  {
    track: "Production foundation",
    owner: "Engineering",
    now: "Keep static app stable, define durable schema, and choose backend migration path.",
    done: "Public routes, admin capture, auth, database, and deployment path are working.",
  },
  {
    track: "Evidence batch one",
    owner: "Research",
    now: "Capture source snapshots and benchmark artifacts for the first seven core platforms.",
    done: "Every flagship review has benchmark, snapshot, artifact, review record, and QA record.",
  },
  {
    track: "Authority content",
    owner: "Editorial",
    now: "Turn completed evidence into reviews, comparisons, methodology, and first best-of pages.",
    done: "No page uses final winner language unless evidence parity and QA gates pass.",
  },
  {
    track: "Distribution and revenue",
    owner: "Growth",
    now: "Prepare email capture, visual assets, disclosure-safe CTAs, and launch announcements.",
    done: "Newsletter, affiliate disclosure, social cards, and report capture work without overclaiming.",
  },
];

const firstEvidenceBatch = [
  { tool: "Lovable", priority: "P0", reason: "Category attention leader and high-intent review/search target.", firstTask: "Run SaaS MVP benchmark and pricing/source snapshot." },
  { tool: "Bolt.new", priority: "P0", reason: "Direct Lovable comparison and core prompt-to-app alternative.", firstTask: "Run same SaaS MVP benchmark and deploy/export notes." },
  { tool: "Replit Agent", priority: "P0", reason: "Bridge between nontechnical app builders and code-backed agent workflow.", firstTask: "Run SaaS MVP plus handoff/deploy inspection." },
  { tool: "v0", priority: "P0", reason: "Essential UI-generation benchmark and landing-page lane.", firstTask: "Run landing page and component quality benchmark." },
  { tool: "Cursor", priority: "P0", reason: "AI IDE authority anchor for existing-codebase workflows.", firstTask: "Run existing-codebase edit/debug benchmark." },
  { tool: "Windsurf", priority: "P0", reason: "Direct Cursor comparison and agentic IDE category pressure.", firstTask: "Run same existing-codebase benchmark and compare repair quality." },
  { tool: "Base44", priority: "P0", reason: "Important prompt-to-app entrant with founder buyer intent.", firstTask: "Run SaaS MVP benchmark and ownership/export check." },
];

const launchDecisionRules = [
  "Ship private alpha when navigation, verifier, admin capture, and core dashboards are stable.",
  "Ship public beta with provisional labels if the first evidence batch is incomplete but methodology is clear.",
  "Do not ship final rankings until each ranked page has evidence parity and QA pass.",
  "Do not launch affiliate CTAs until disclosure, pricing freshness, and monetization guardrails pass.",
  "Publish the first report only when the evidence window and exclusions are visible above the findings.",
];

const evidenceSprintDays = [
  {
    day: "Day 1",
    focus: "Source snapshots",
    output: "Pricing, docs, terms, export, deployment, and privacy snapshots for the first 7 tools.",
    acceptance: "Every P0 tool has dated source records and blocked unknowns listed.",
  },
  {
    day: "Day 2",
    focus: "Prompt-to-app benchmarks",
    output: "Lovable, Bolt.new, Replit Agent, and Base44 run through the SaaS MVP prompt.",
    acceptance: "Each run has screenshots/artifact link, deploy result, manual repair notes, and score draft.",
  },
  {
    day: "Day 3",
    focus: "UI and IDE benchmarks",
    output: "v0 landing-page task plus Cursor and Windsurf existing-codebase task.",
    acceptance: "Each run records output quality, fix burden, handoff quality, and blocker notes.",
  },
  {
    day: "Day 4",
    focus: "Review records",
    output: "Seven review records with verdict state, pros, cons, production notes, and evidence gaps.",
    acceptance: "No final verdict language remains where benchmark or source evidence is incomplete.",
  },
  {
    day: "Day 5",
    focus: "QA and launch labels",
    output: "Quality checks, provisional/final labels, comparison eligibility, and launch blockers.",
    acceptance: "Ready pages can enter beta; blocked pages show explicit missing proof.",
  },
];

const evidenceTaskQueue = [
  { tool: "Lovable", task: "SaaS MVP benchmark", record: "Benchmark run + artifact", owner: "Benchmark lead", status: "Queued" },
  { tool: "Lovable", task: "Pricing/source snapshot", record: "Evidence snapshot", owner: "Research editor", status: "Queued" },
  { tool: "Bolt.new", task: "SaaS MVP benchmark", record: "Benchmark run + artifact", owner: "Benchmark lead", status: "Queued" },
  { tool: "Replit Agent", task: "Deploy and handoff inspection", record: "Artifact + review record", owner: "Benchmark lead", status: "Queued" },
  { tool: "v0", task: "Landing page benchmark", record: "Benchmark run + artifact", owner: "Benchmark lead", status: "Queued" },
  { tool: "Cursor", task: "Existing-codebase edit/debug task", record: "Benchmark run + reviewer notes", owner: "Benchmark lead", status: "Queued" },
  { tool: "Windsurf", task: "Existing-codebase comparison task", record: "Benchmark run + reviewer notes", owner: "Benchmark lead", status: "Queued" },
  { tool: "Base44", task: "Ownership/export check", record: "Source snapshot + artifact", owner: "Research editor", status: "Queued" },
];

const sprintAcceptanceCriteria = [
  "Every completed task links to a tool, benchmark or source type, owner, and dated record.",
  "Every benchmark run includes prompt, output notes, artifact, manual repair burden, and deploy/handoff state.",
  "Every review record declares blocked, provisional, evidence-backed, or ready verdict state.",
  "Every public-facing claim can map to source snapshot, benchmark run, artifact, review record, or QA check.",
  "Every missing proof item becomes a launch blocker or provisional label, not a silent gap.",
];

const productionStackLayers = [
  {
    layer: "Frontend app",
    responsibility: "Render reviews, comparisons, best-of hubs, reports, dashboards, and admin workflows.",
    recommended: "Next.js or equivalent route-first framework with static generation for public pages.",
    boundary: "No public page should ship without evidence state, canonical URL, and disclosure data.",
  },
  {
    layer: "Structured database",
    responsibility: "Store tools, benchmark runs, source snapshots, artifacts, review records, QA checks, and corrections.",
    recommended: "Relational database with stable IDs, foreign keys, timestamps, and audit fields.",
    boundary: "Evidence records stay structured; do not hide benchmark or source data inside CMS rich text.",
  },
  {
    layer: "Headless CMS",
    responsibility: "Manage page composition, editorial workflow, previews, scheduled publishing, and canonical metadata.",
    recommended: "Use after schemas stabilize; join CMS entries to evidence records at build/request time.",
    boundary: "CMS can arrange pages but cannot invent scores, freshness, or evidence states.",
  },
  {
    layer: "Artifact storage",
    responsibility: "Store screenshots, recordings, generated app exports, repos, reports, and social assets.",
    recommended: "Object storage with metadata linking each artifact to tool, benchmark, and page.",
    boundary: "No artifact is citeable unless it has source context and created-at metadata.",
  },
  {
    layer: "Automation workers",
    responsibility: "Run source checks, benchmark queues, draft generation, refresh tasks, and report packaging.",
    recommended: "Queue-backed jobs with retry logs, approvals, kill switches, and human review gates.",
    boundary: "Workers can prepare evidence and drafts; they cannot publish final recommendations directly.",
  },
  {
    layer: "Analytics and observability",
    responsibility: "Track page performance, evidence engagement, CTA behavior, freshness risk, and job failures.",
    recommended: "Event tracking plus logs for API routes, jobs, source checks, and publishing actions.",
    boundary: "Analytics must include evidence/disclosure/freshness state for monetized and ranking surfaces.",
  },
];

const implementationPhases = [
  {
    phase: "Static authority prototype",
    goal: "Finalize information architecture, review surfaces, operating models, and local capture forms.",
    exit: "Verifier passes and core tabs cover evidence, trust, CMS, policy, operations, and launch.",
  },
  {
    phase: "Database-backed admin",
    goal: "Move local JSON records into structured tables with stable IDs and relationships.",
    exit: "Admin can create/read/update evidence records without file-based storage.",
  },
  {
    phase: "CMS public publishing",
    goal: "Generate canonical public pages from CMS entries joined with evidence records.",
    exit: "Review, comparison, best-of, benchmark, and report routes publish from governed data.",
  },
  {
    phase: "Automation and refresh jobs",
    goal: "Run source freshness, benchmark queues, report packaging, and refresh tasks.",
    exit: "Jobs create reviewable records and never bypass approval gates.",
  },
  {
    phase: "Revenue and distribution",
    goal: "Enable affiliate CTAs, reports, newsletter, social cards, and analytics with trust controls.",
    exit: "Commercial surfaces include disclosure readiness, freshness state, and evidence links.",
  },
];

const stackDecisionRules = [
  "Choose boring production infrastructure over novelty because the moat is evidence quality, not stack complexity.",
  "Keep evidence records portable so reports, public pages, exports, and audits can use the same source of truth.",
  "Separate editorial content from benchmark/source data to prevent unsupported CMS-only claims.",
  "Instrument every public event with page, tool, evidence state, disclosure state, and freshness state.",
  "Automate record creation and refresh queues before automating publication.",
];

const releaseEnvironments = [
  {
    environment: "Local prototype",
    purpose: "Fast iteration on information architecture, static panels, local JSON capture, and verifier coverage.",
    gate: "Static app verifier, syntax checks, and local server response pass.",
  },
  {
    environment: "Preview",
    purpose: "Review public routes, CMS drafts, evidence joins, design consistency, and role permissions before release.",
    gate: "No console errors, route smoke tests pass, and no blocked pages are visible publicly.",
  },
  {
    environment: "Staging",
    purpose: "Production-like test of database migrations, API contracts, jobs, analytics, and CMS publishing.",
    gate: "Migration dry run, API contract checks, worker dry run, QA gates, and rollback plan pass.",
  },
  {
    environment: "Production",
    purpose: "Canonical public site, admin workflows, live evidence records, distribution assets, and revenue surfaces.",
    gate: "Release approval, monitoring enabled, backup verified, and active blockers cleared.",
  },
];

const releaseGates = [
  "Static verifier and syntax checks pass.",
  "No public page has blocked evidence, stale pricing, missing disclosure, or non-canonical URL state.",
  "Database migrations are reversible or backed up before deployment.",
  "API changes preserve public read contracts and admin write validation.",
  "Analytics events include evidence, disclosure, freshness, and page/tool context.",
  "Rollback path is documented before production release.",
];

const rollbackTriggers = [
  "Public routes return errors, blank pages, or broken navigation.",
  "Evidence badges, disclosures, or freshness states disappear from review/comparison pages.",
  "API writes corrupt or duplicate evidence records.",
  "CMS publishes draft, blocked, or non-canonical pages.",
  "Affiliate CTAs appear without disclosure readiness.",
  "Worker jobs mutate verdicts, rankings, or public pages without approval.",
];

const deploymentRules = [
  "Ship schema changes before features that depend on them.",
  "Ship public route changes behind preview verification before distribution assets link to them.",
  "Do not deploy monetized CTAs in the same release as unverified disclosure or pricing changes.",
  "Release automation jobs in dry-run mode before allowing writes to evidence tables.",
  "Keep public pages cacheable but invalidate pages when evidence, pricing, corrections, or verdict state changes.",
];

const backupScopes = [
  {
    scope: "Structured database",
    includes: "Tools, source snapshots, benchmark runs, artifacts metadata, review records, QA checks, pages, corrections.",
    cadence: "Daily automated backup plus pre-migration snapshot.",
    restorePriority: "Highest",
  },
  {
    scope: "Artifact storage",
    includes: "Screenshots, recordings, exports, generated app URLs metadata, report PDFs, social assets.",
    cadence: "Daily metadata sync and object versioning.",
    restorePriority: "High",
  },
  {
    scope: "CMS content",
    includes: "Page composition, drafts, canonical URLs, editorial notes, publish states, previews.",
    cadence: "Daily export plus pre-release snapshot.",
    restorePriority: "High",
  },
  {
    scope: "Configuration",
    includes: "Environment variables inventory, API contract versions, worker schedules, role permissions.",
    cadence: "Change-controlled backup before release.",
    restorePriority: "Medium",
  },
  {
    scope: "Analytics events",
    includes: "Page events, CTA events, evidence engagement, report requests, job observability summaries.",
    cadence: "Daily export or vendor retention check.",
    restorePriority: "Medium",
  },
];

const recoveryObjectives = [
  {
    incident: "Public page deploy failure",
    rto: "15 minutes",
    rpo: "Last successful release",
    action: "Rollback deployment, keep database untouched, verify core routes.",
  },
  {
    incident: "Bad CMS publish",
    rto: "30 minutes",
    rpo: "Previous CMS snapshot",
    action: "Unpublish or revert page, restore canonical content, log correction if public.",
  },
  {
    incident: "Evidence data corruption",
    rto: "2 hours",
    rpo: "Pre-mutation backup or last daily snapshot",
    action: "Freeze writes, restore affected records, audit page_evidence links.",
  },
  {
    incident: "Artifact loss",
    rto: "4 hours",
    rpo: "Last object version or metadata export",
    action: "Restore objects, mark affected claims provisional until artifacts are verified.",
  },
  {
    incident: "Worker runaway",
    rto: "30 minutes",
    rpo: "Last approved job checkpoint",
    action: "Disable worker token, revert generated records, audit verdict/ranking mutations.",
  },
];

const restoreDrillRules = [
  "Run a restore drill before public beta and before revenue launch.",
  "Test database restore separately from CMS restore and artifact restore.",
  "Verify restored pages still show evidence badges, disclosure state, freshness state, and canonical URLs.",
  "Document who approved the restore and what records changed.",
  "After a restore, rerun static verifier, API smoke tests, and public route checks.",
];

const dataLossPolicies = [
  "If benchmark artifacts are lost, affected benchmark claims become provisional until artifacts are restored or rerun.",
  "If source snapshots are lost, pricing, privacy, feature, and policy claims are blocked until recaptured.",
  "If QA records are lost, affected pages cannot retain final verdict status.",
  "If correction history is lost, freeze affected verdict changes until audit notes are reconstructed.",
  "If analytics events are lost, do not infer ranking or revenue decisions from incomplete data.",
];

const productionChecks = [
  {
    area: "Authentication",
    minimum: "Clear login, logout, session, role, and account boundary behavior.",
    evidence: "Screenshots, generated app test notes, auth configuration notes.",
    blocker: "No private-data app can be called production-ready without verified auth behavior.",
  },
  {
    area: "Data rules",
    minimum: "Database tables, row ownership, permissions, validation, and destructive actions are understood.",
    evidence: "Schema notes, generated code/export, data flow screenshots, manual test notes.",
    blocker: "Block recommendation when users can read or mutate data they should not access.",
  },
  {
    area: "Secrets",
    minimum: "API keys and tokens are server-side or environment-scoped, not exposed in client code.",
    evidence: "Repo/export inspection, environment variable notes, AI wrapper benchmark notes.",
    blocker: "Any exposed secret blocks production-ready language.",
  },
  {
    area: "Deployment",
    minimum: "App can deploy, load, recover from refresh, and handle basic errors.",
    evidence: "Deployment URL, deploy log notes, artifact, benchmark run status.",
    blocker: "Manual repair needed must be disclosed before recommending for nontechnical users.",
  },
  {
    area: "Export and handoff",
    minimum: "Builder can export, transfer, or maintain the app with understandable project structure.",
    evidence: "Repo/export URL, file structure notes, handoff risk assessment.",
    blocker: "No handoff path means recommendation must be limited to prototype use.",
  },
  {
    area: "Compliance posture",
    minimum: "Privacy/data policy, terms, retention, and training-data claims are captured when relevant.",
    evidence: "Terms/privacy source snapshot and data-risk notes.",
    blocker: "Unknown data policy blocks enterprise or sensitive-data recommendations.",
  },
];

const productionRiskBands = [
  { band: "Prototype-safe", meaning: "Good for demos, mockups, early validation, and low-risk internal experiments." },
  { band: "Pilot-safe", meaning: "Can be used with limited users after auth, data, deploy, and handoff checks pass." },
  { band: "Production-candidate", meaning: "Evidence supports deployment path, security posture, maintainability, and QA." },
  { band: "Blocked", meaning: "Security, data, deploy, disclosure, or evidence gaps make recommendation unsafe." },
];

const distributionChannels = [
  {
    channel: "Search",
    format: "Reviews, comparisons, best-of pages, build logs",
    cadence: "Continuous",
    evidence: "Template evidence gates, internal links, freshness state, quality pass.",
    boundary: "No final winner language without comparable benchmark evidence.",
  },
  {
    channel: "Newsletter",
    format: "Weekly benchmark digest",
    cadence: "Weekly",
    evidence: "Changed source snapshots, recent benchmark runs, readiness movement.",
    boundary: "Digest can summarize movement but cannot create new unsupported claims.",
  },
  {
    channel: "YouTube",
    format: "Benchmark walkthroughs, tool verdict explainers, failure reviews",
    cadence: "Biweekly",
    evidence: "Screen recordings, benchmark artifacts, deploy notes, disclosure state.",
    boundary: "Video claims must match the published written evidence record.",
  },
  {
    channel: "Social cards",
    format: "OG images, ranking cards, report announcements, benchmark result cards",
    cadence: "Per publish event",
    evidence: "Published page, dated report, or saved benchmark run.",
    boundary: "Cards cannot compress provisional recommendations into absolute claims.",
  },
  {
    channel: "Reports",
    format: "PDF/data export, executive summary, score movement notes",
    cadence: "Monthly",
    evidence: "Dated evidence window, source records, QA pass, claim ledger.",
    boundary: "Reports must show methodology and evidence window.",
  },
];

const mediaAssetRules = [
  "Authority-layer visuals are for covers, social cards, YouTube banners, and report announcements.",
  "Evidence-layer visuals are for screenshots, tables, benchmark result cards, and citations.",
  "Never use fake product logos or unreadable fake UI as evidence.",
  "Every ranking card must link back to a page with gate status and methodology.",
  "Social assets must avoid claims stronger than the underlying page verdict.",
];

const assetProductionQueue = [
  {
    asset: "Homepage authority hero",
    layer: "Authority",
    use: "First-viewport brand signal and launch social crop.",
    promptNeed: "Dark institutional benchmark command center with VCA identity, no fake product UI.",
    proofBoundary: "Brand atmosphere only; cannot imply benchmark evidence.",
  },
  {
    asset: "Review lead images",
    layer: "Evidence",
    use: "Top review visuals and social cards for core platform reviews.",
    promptNeed: "Clean interface composition with tool category, evidence badges, and readable verdict state.",
    proofBoundary: "Must not use unofficial logos unless rights and source assets are approved.",
  },
  {
    asset: "Benchmark result cards",
    layer: "Evidence",
    use: "Shareable result images for same-prompt tool comparisons.",
    promptNeed: "Data-first card with prompt name, date, score, blockers, and artifact state.",
    proofBoundary: "Only generated after benchmark run and QA state exist.",
  },
  {
    asset: "Monthly report covers",
    layer: "Authority",
    use: "Platform Index, benchmark reports, and production watchlists.",
    promptNeed: "Institutional cover with evidence window, report title, VCA mark, and category map.",
    proofBoundary: "Cover cannot show rankings that are not present in the report data.",
  },
  {
    asset: "YouTube and newsletter frames",
    layer: "Hybrid",
    use: "Video thumbnails, newsletter headers, digest sections, and launch recaps.",
    promptNeed: "Authority frame plus one evidence module: score movement, ranking shift, or blocker.",
    proofBoundary: "Headline must match published page and disclosure status.",
  },
];

const visualPromptStandards = [
  {
    standard: "Authority layer",
    include: "VCA mark, institutional architecture, benchmark infrastructure, dated report context.",
    avoid: "Generic AI glow, fake code screens, unreadable tiny UI, unsupported ranking claims.",
  },
  {
    standard: "Evidence layer",
    include: "Readable cards, dates, source state, benchmark state, disclosure state, artifact status.",
    avoid: "Cinematic lighting that hides data or makes generated screenshots look like proof.",
  },
  {
    standard: "Platform-specific assets",
    include: "Category label, use case, verdict state, and canonical page reference.",
    avoid: "Unofficial product logo recreation, trademark confusion, or fabricated screenshots.",
  },
  {
    standard: "Distribution crop set",
    include: "16:9, 1:1, 4:5, OG, newsletter header, and YouTube-safe variants.",
    avoid: "Text placed near crop edges or layouts that fail on mobile feeds.",
  },
];

const authorityReports = [
  {
    slug: "vibe-coding-index",
    title: "Vibe Coding Platform Index",
    cadence: "Monthly",
    audience: "Founders, operators, and technical buyers tracking the AI app-builder category.",
    thesis: "Ranks the full platform set by evidence-backed review score, publish readiness, and benchmark coverage.",
    requiredEvidence: ["All 28 platform review records", "Fresh pricing/source snapshots", "At least one benchmark run for every core platform", "Final QA pass for every ranked claim"],
    visual: "Dark institutional cover with VCA mark, ranked platform grid, evidence timestamp, and benchmark network map.",
  },
  {
    slug: "prompt-to-app-benchmark",
    title: "Prompt-to-App Benchmark Report",
    cadence: "Biweekly",
    audience: "Builders choosing between Lovable, Bolt.new, Replit Agent, Base44, Create, and Firebase Studio.",
    thesis: "Compares prompt-to-app systems on the same SaaS MVP, directory, internal tool, and AI wrapper prompts.",
    requiredEvidence: ["Same prompt run across selected platforms", "Generated app screenshots", "Deploy/export notes", "Manual repair log", "Security and data-model assessment"],
    visual: "Evidence-first report cover with benchmark score columns, app screenshots, and deploy status markers.",
  },
  {
    slug: "production-readiness",
    title: "Production Readiness Watchlist",
    cadence: "Weekly",
    audience: "Teams deciding whether vibe-coded apps can move beyond prototypes.",
    thesis: "Tracks auth, database rules, secrets, deployment, export, performance, and handoff risks across the category.",
    requiredEvidence: ["Fresh source snapshots", "Artifact links", "Security notes", "Deploy path checks", "QA scores"],
    visual: "Light evidence dashboard with risk bands, gate progress, blocked claims, and platform-by-platform remediation notes.",
  },
  {
    slug: "ai-ide-transition",
    title: "AI IDE Transition Report",
    cadence: "Monthly",
    audience: "Founders graduating from prompt-to-app prototypes into real code stewardship.",
    thesis: "Explains when to move from Lovable/Bolt-style building into Cursor, Windsurf, Codex, Claude Code, or Copilot workflows.",
    requiredEvidence: ["Codebase handoff test", "Refactor benchmark", "Bug-fix benchmark", "Repo setup notes", "Developer experience scoring"],
    visual: "Authority layer visual with prototype-to-repo flow, tool transition map, and code stewardship score bands.",
  },
];

const bestOfGuides = [
  {
    slug: "founders",
    title: "Best Vibe Coding Tools for Founders",
    keyword: "best AI app builder tools for founders",
    intent: "Nontechnical and technical founders choosing where to build an MVP first.",
    preferred: ["Lovable", "Bolt.new", "Replit Agent", "Base44", "Create"],
  },
  {
    slug: "saas-mvp",
    title: "Best AI App Builders for SaaS MVPs",
    keyword: "best ai app builder for saas mvp",
    intent: "Readers who need auth, dashboards, CRUD, settings, deployment, and handoff paths.",
    preferred: ["Lovable", "Bolt.new", "Replit Agent", "Firebase Studio", "Tempo"],
  },
  {
    slug: "internal-tools",
    title: "Best AI Builders for Internal Tools",
    keyword: "best ai internal tool builder",
    intent: "Teams building admin panels, workflows, portals, tables, forms, and data-backed operations.",
    preferred: ["Base44", "Retool AI", "Softr AI", "Appsmith AI", "Replit Agent"],
  },
  {
    slug: "landing-pages",
    title: "Best AI Tools for Landing Pages",
    keyword: "best ai landing page builder",
    intent: "Creators who need polished marketing pages, UI concepts, and conversion pages fast.",
    preferred: ["v0", "Framer AI", "Relume", "Webflow AI", "CodeDesign.ai"],
  },
  {
    slug: "codebase-work",
    title: "Best AI Coding Tools for Existing Codebases",
    keyword: "best ai coding tool for existing codebase",
    intent: "Builders who already have code and need refactors, fixes, repo work, and production hardening.",
    preferred: ["Cursor", "Windsurf", "Claude Code", "OpenAI Codex", "GitHub Copilot Workspace"],
  },
  {
    slug: "ai-wrapper",
    title: "Best Vibe Coding Tools for AI Wrappers",
    keyword: "best ai app builder for ai wrapper",
    intent: "Builders shipping apps that need server-side API calls, secrets, history, auth, and failure handling.",
    preferred: ["Replit Agent", "Bolt.new", "Lovable", "Firebase Studio", "Cursor"],
  },
];

const categoryPlaybooks = {
  "Prompt-to-app": {
    summary: "Best for turning a product prompt into a working web-app draft quickly.",
    strengths: ["Fast ideation loop", "Strong founder-facing workflow", "Good fit for SaaS, dashboards, and CRUD prototypes"],
    risks: ["Generated apps still need security review", "Database rules and auth claims must be verified", "Export and maintainability vary by platform"],
    benchmark: "SaaS MVP Dashboard",
    avoid: "Avoid as the only production gate for apps that handle payments, private user data, or complex permissions.",
  },
  "Agentic IDE": {
    summary: "Best for builders who want an AI agent inside a real development environment.",
    strengths: ["Better debugging path", "More control over code and deployment", "Useful after a prompt-to-app prototype hits limits"],
    risks: ["Less no-code for beginners", "Requires stronger repo hygiene", "Agent output still needs human review"],
    benchmark: "AI Wrapper",
    avoid: "Avoid if you need a purely visual builder and do not want to inspect code.",
  },
  "AI IDE": {
    summary: "Best for code-native AI app building, refactors, production hardening, and handoff work.",
    strengths: ["High control over implementation", "Strong fit for existing codebases", "Better for testing, refactoring, and production fixes"],
    risks: ["Not a complete no-code product builder", "Requires technical judgment", "Can produce broad edits without tight prompts"],
    benchmark: "AI Wrapper",
    avoid: "Avoid if the user cannot work inside files, terminals, pull requests, or deployment logs.",
  },
  "Agentic coding": {
    summary: "Best for delegated engineering tasks, issue-to-code workflows, and advanced app generation experiments.",
    strengths: ["Handles larger implementation tasks", "Useful for repo-level automation", "Important for post-prototype maintenance"],
    risks: ["Not beginner-first", "Setup and review overhead can be high", "Autonomy needs strict scope and test gates"],
    benchmark: "Internal Tool",
    avoid: "Avoid for nontechnical founders who need a visual app-building workflow today.",
  },
  "UI generation": {
    summary: "Best for interface starts, screen concepts, and front-end scaffolds.",
    strengths: ["Fast UI exploration", "Strong landing page and component generation", "Useful before or beside app builders"],
    risks: ["Backend and data logic are usually limited", "Design polish can hide missing product logic", "Generated UI still needs responsive QA"],
    benchmark: "Landing Page",
    avoid: "Avoid as the only tool for data-heavy, authenticated, full-stack apps.",
  },
  "Design-to-code": {
    summary: "Best for converting design intent into editable front-end code.",
    strengths: ["Bridges design and engineering", "Good for teams with existing design systems", "Can shorten front-end implementation cycles"],
    risks: ["Generated code quality varies", "Does not replace product architecture", "Needs design-system and responsiveness checks"],
    benchmark: "Landing Page",
    avoid: "Avoid if there is no design source, component standard, or front-end owner.",
  },
  "Site generation": {
    summary: "Best for marketing pages, small business sites, and fast web presence creation.",
    strengths: ["Fast publishing path", "Good for simple conversion pages", "Lower technical barrier than app builders"],
    risks: ["Limited app logic", "SEO and performance claims need testing", "Design quality can be template-like"],
    benchmark: "Landing Page",
    avoid: "Avoid for SaaS products that need accounts, payments, dashboards, or complex data workflows.",
  },
  "No-code app + AI": {
    summary: "Best for traditional no-code app building with AI assistance layered into a mature builder.",
    strengths: ["More structured app model", "Established plugin and workflow ecosystems", "Better for complex business logic than pure prompt builders"],
    risks: ["Slower than AI app building", "Can create platform lock-in", "AI features may not remove builder complexity"],
    benchmark: "Directory App",
    avoid: "Avoid if speed and prompt-first iteration matter more than structured control.",
  },
  "Mobile app + AI": {
    summary: "Best for mobile-first products that need native-app structure.",
    strengths: ["Mobile-specific workflows", "More realistic path for app-store projects", "Useful when web-app builders are the wrong target"],
    risks: ["More setup than web prototypes", "Native build and store requirements remain", "AI does not remove mobile QA burden"],
    benchmark: "Directory App",
    avoid: "Avoid for web-first SaaS where responsive web is sufficient.",
  },
  "Internal tools": {
    summary: "Best for operational apps, admin panels, portals, and workflows on top of existing data.",
    strengths: ["Strong data-table and form patterns", "Good for business users and teams", "Often safer than free-form app generation for internal workflows"],
    risks: ["Less suited to public SaaS products", "Brand and front-end flexibility may be limited", "Data permissions require careful setup"],
    benchmark: "Internal Tool",
    avoid: "Avoid for consumer products, highly custom UI, or public-facing marketplaces.",
  },
  "AI engineer": {
    summary: "Best as a high-autonomy engineering benchmark, not as a mainstream no-code app builder.",
    strengths: ["Can take on broader software tasks", "Useful reference point for agentic engineering", "Relevant to the future of autonomous app creation"],
    risks: ["Expensive and technical", "Not prompt-to-app for beginners", "Requires strong task framing and code review"],
    benchmark: "Internal Tool",
    avoid: "Avoid as the first choice for nontechnical MVP builders.",
  },
};

const defaultPlaybook = {
  summary: "Relevant to the AI app builder ecosystem and worth benchmarking against the core app-builder set.",
  strengths: ["Useful in a defined part of the app-building workflow", "Worth tracking as the category matures", "Can complement prompt-to-app builders"],
  risks: ["Needs direct evidence before recommendation", "Marketing claims should not be used as proof", "Production readiness must be tested"],
  benchmark: "SaaS MVP Dashboard",
  avoid: "Avoid making a buying decision before a benchmark run is captured.",
};

const sourceFreshnessDays = 7;
const sourceFreshnessMs = sourceFreshnessDays * 24 * 60 * 60 * 1000;

let activeTab = "reviews";
let query = "";
let activeCategory = "All";
let compareA = "lovable";
let compareB = "bolt-new";
let wizardStep = 0;
let benchmarkRuns = [];
let savedArticleBriefs = [];
let evidenceSnapshots = [];
let reviewRecords = [];
let artifacts = [];
let qualityChecks = [];
const wizardAnswers = {};

const questions = [
  ["What are you trying to build?", [["Full web app or SaaS", "full-app"], ["Landing page or front end", "frontend"], ["Internal tool", "internal"], ["Mobile app", "mobile"], ["Existing codebase help", "codebase"]]],
  ["How technical are you?", [["I want prompt-first building", "prompt"], ["I can edit code when needed", "hybrid"], ["I want a serious AI IDE", "ide"]]],
  ["What matters most?", [["Fastest prototype", "speed"], ["Production readiness", "production"], ["Best UI", "ui"], ["Control and maintainability", "control"]]],
];

function icon(name) {
  const icons = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    sliders: '<svg viewBox="0 0 24 24"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/></svg>',
    gauge: '<svg viewBox="0 0 24 24"><path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',
    dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
    database: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"/><path d="m9 12 2 2 4-5"/></svg>',
  };
  return icons[name] || "";
}

function toolCard(tool) {
  const count = evidenceCountFor(tool.name);
  const profile = reviewProfile(tool);
  const gates = gateStatusFor(tool.name);
  const hasEvidence = count > 0 || evidenceFileCountFor(tool.name) > 0;
  return `
    <article class="tool-card premium-card card-hover">
      <div class="tool-card__top tool-logo-row">
        ${toolLogoMarkup(tool, 26, "tool-logo")}
        <div><p class="eyebrow">${tool.category}</p><h3>${tool.name}</h3></div>
        <div class="score">${profile.score}</div>
      </div>
      <div class="review-priority evidence-badge ${hasEvidence ? 'complete' : 'pending'}">${profile.verdictLabel}</div>
      <p class="verdict">${profile.verdict}</p>
      <div class="tool-fit-line">
        <span>Best fit: ${tool.bestFor}</span>
      </div>
      <dl class="facts">
        <div><dt>Pricing</dt><dd>${tool.price}</dd></div>
        <div><dt>Evidence</dt><dd>${count ? `${count} run${count === 1 ? "" : "s"}` : "Test pending"}; ${evidenceFileCountFor(tool.name)} evidence file${evidenceFileCountFor(tool.name) === 1 ? "" : "s"}; ${snapshotCountFor(tool.name)} source snapshots</dd></div>
        <div><dt>Commercial status</dt><dd>${tool.affiliateStatus}</dd></div>
      </dl>
      <div class="evidence-file-links">
        ${evidenceFilesFor(tool.name).map((file) => `<a href="/${file.file}" target="_blank" rel="noopener" class="evidence-badge ${file.status === 'Complete' ? 'complete' : ''}">${file.status} evidence</a>`).join("") || `<span class="evidence-badge pending">Evidence file pending</span>`}
      </div>
      <div class="gate-strip ${gates.ready ? "ready" : ""}">
        <span>${gates.hasRecord ? "Review" : "Review missing"}</span>
        <span>${gates.hasBenchmark ? "Benchmark" : "Benchmark missing"}</span>
        <span>${gates.hasFreshSnapshot ? "Fresh source" : gates.hasSnapshot ? "Source stale" : "Source missing"}</span>
        <span>${gates.hasArtifact ? "Artifact" : "Artifact missing"}</span>
        <span>${gates.hasPassingQa ? "QA passed" : "QA missing"}</span>
      </div>
      <div class="card-actions">
        <a href="#review/${tool.slug}" class="strong-cta">Open full review <span aria-hidden="true">-></span></a>
        <span>${tool.updated}</span>
      </div>
    </article>
  `;
}



const reviewBrandVisuals = {
  "lovable": { domain: "lovable.dev", monogram: "L", rgb: "255 82 124", rgb2: "133 78 255" },
  "bolt-new": { domain: "bolt.new", monogram: "B", rgb: "80 190 255", rgb2: "128 87 255" },
  "replit-agent": { icon: "replit", domain: "replit.com", monogram: "R", rgb: "255 124 51", rgb2: "255 189 84" },
  "base44": { domain: "base44.com", monogram: "B44", rgb: "75 126 255", rgb2: "123 92 255" },
  "cursor": { domain: "cursor.com", monogram: "C", rgb: "255 255 255", rgb2: "125 125 255" },
  "windsurf": { domain: "windsurf.com", monogram: "W", rgb: "58 229 177", rgb2: "57 147 255" },
  "claude-code": { icon: "anthropic", domain: "anthropic.com", monogram: "C", rgb: "214 176 133", rgb2: "255 121 63" },
  "openai-codex": { icon: "openai", domain: "openai.com", monogram: "AI", rgb: "16 185 129", rgb2: "255 255 255" },
  "v0": { icon: "vercel", domain: "v0.dev", monogram: "v0", rgb: "255 255 255", rgb2: "128 128 255" },
  "supabase-ai-assistant": { icon: "supabase", domain: "supabase.com", monogram: "S", rgb: "62 207 142", rgb2: "14 165 233" },
  "bubble-ai": { domain: "bubble.io", monogram: "B", rgb: "42 85 255", rgb2: "255 255 255" },
  "flutterflow-ai": { domain: "flutterflow.io", monogram: "FF", rgb: "73 139 255", rgb2: "124 77 255" },
  "webflow-ai": { icon: "webflow", domain: "webflow.com", monogram: "W", rgb: "67 84 255", rgb2: "255 255 255" },
  "framer-ai": { icon: "framer", domain: "framer.com", monogram: "F", rgb: "0 153 255", rgb2: "255 0 153" },
  "glide-ai": { domain: "glideapps.com", monogram: "G", rgb: "24 119 242", rgb2: "131 95 255" },
  "softr-ai": { domain: "softr.io", monogram: "S", rgb: "255 111 77", rgb2: "91 141 239" },
  "adalo": { domain: "adalo.com", monogram: "A", rgb: "255 92 92", rgb2: "255 188 96" },
  "retool-ai": { icon: "retool", domain: "retool.com", monogram: "R", rgb: "255 206 75", rgb2: "25 25 25" },
  "thunkable": { domain: "thunkable.com", monogram: "T", rgb: "64 118 255", rgb2: "255 94 98" },
  "appsmith": { icon: "appsmith", domain: "appsmith.com", monogram: "A", rgb: "255 106 26", rgb2: "255 206 128" },
  "weweb": { domain: "weweb.io", monogram: "WW", rgb: "66 153 225", rgb2: "168 85 247" },
  "builder-io": { icon: "builder.io", domain: "builder.io", monogram: "B", rgb: "26 26 26", rgb2: "255 255 255" },
  "default": { domain: "nocodereviewed.com", monogram: "NCR", rgb: "255 179 107", rgb2: "232 84 26" }
};

function normalizeBrandSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function brandVisualFor(tool) {
  const slug = normalizeBrandSlug(tool?.slug || tool?.name);
  const brand = reviewBrandVisuals[slug] || reviewBrandVisuals.default;
  const logo = brand.logo || (brand.icon
    ? `https://cdn.simpleicons.org/${brand.icon}/ffffff`
    : `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`);

  return {
    logo,
    rgb: brand.rgb,
    rgb2: brand.rgb2,
    heroImage: brand.hero || "/images/no-code-empire-hero-bg.png",
    monogram: brand.monogram || String(tool?.name || "N").replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()
  };
}

function evidenceFilesFor(toolName) {
  const tool = tools.find((item) => item.name === toolName);
  const names = new Set([toolName, tool?.slug].filter(Boolean).map((item) => String(item).toLowerCase()));
  return evidenceFileIndex.filter((item) => names.has(item.tool.toLowerCase()) || names.has(item.slug.toLowerCase()));
}

function evidenceFileCountFor(toolName) {
  return evidenceFilesFor(toolName).length;
}

function evidenceCountFor(toolName) {
  return benchmarkRuns.filter((run) => run.tool === toolName).length;
}

function benchmarkRunsFor(toolName) {
  return benchmarkRuns.filter((run) => run.tool === toolName);
}

function benchmarkRunById(id) {
  return benchmarkRuns.find((run) => run.id === id);
}

function snapshotCountFor(toolName) {
  return evidenceSnapshots.filter((snapshot) => snapshot.tool === toolName).length;
}

function latestSnapshotFor(toolName) {
  return evidenceSnapshots.find((snapshot) => snapshot.tool === toolName);
}

function snapshotAgeDays(snapshot) {
  if (!snapshot?.checkedAt) return null;
  const checked = new Date(snapshot.checkedAt).getTime();
  if (!Number.isFinite(checked)) return null;
  return Math.max(0, Math.floor((Date.now() - checked) / (24 * 60 * 60 * 1000)));
}

function isSnapshotFresh(snapshot) {
  if (!snapshot?.checkedAt) return false;
  const checked = new Date(snapshot.checkedAt).getTime();
  return Number.isFinite(checked) && Date.now() - checked <= sourceFreshnessMs;
}

function hasFreshSnapshotFor(toolName) {
  return Boolean(latestSnapshotFor(toolName) && isSnapshotFresh(latestSnapshotFor(toolName)));
}

function artifactsFor(toolName) {
  return artifacts.filter((artifact) => artifact.tool === toolName);
}

function artifactCountFor(toolName) {
  return artifactsFor(toolName).length;
}

function qualityChecksFor(toolName) {
  return qualityChecks.filter((check) => check.tool === toolName);
}

function latestQualityCheckFor(toolName) {
  return qualityChecksFor(toolName)[0];
}

function isPassingQualityCheck(check) {
  return Boolean(check)
    && check.evidenceScore >= 80
    && check.factualityScore >= 85
    && check.originalityScore >= 80
    && check.seoScore >= 75
    && check.disclosureReady === "Yes";
}

function reviewRecordFor(toolName) {
  return reviewRecords.find((record) => record.tool === toolName);
}

function linesFrom(value) {
  return String(value || "").split("\n").map((item) => item.trim()).filter(Boolean);
}

function gateStatusFor(toolName) {
  const hasBenchmark = evidenceCountFor(toolName) > 0;
  const hasSnapshot = snapshotCountFor(toolName) > 0;
  const hasFreshSnapshot = hasFreshSnapshotFor(toolName);
  const hasRecord = Boolean(reviewRecordFor(toolName));
  const hasArtifact = artifactCountFor(toolName) > 0;
  const hasPassingQa = isPassingQualityCheck(latestQualityCheckFor(toolName));
  const ready = hasBenchmark && hasFreshSnapshot && hasRecord && hasArtifact && hasPassingQa;
  return { hasBenchmark, hasSnapshot, hasFreshSnapshot, hasRecord, hasArtifact, hasPassingQa, ready };
}

function readinessFor(tool) {
  const gates = gateStatusFor(tool.name);
  const missing = [
    !gates.hasRecord && "review record",
    !gates.hasBenchmark && "benchmark run",
    !gates.hasSnapshot && "source snapshot",
    gates.hasSnapshot && !gates.hasFreshSnapshot && "fresh source snapshot",
    !gates.hasArtifact && "artifact link",
    !gates.hasPassingQa && "passing QA check",
  ].filter(Boolean);
  const nextAction = !gates.hasRecord
    ? "Create editorial review record"
    : !gates.hasBenchmark
      ? "Run benchmark and save result"
      : !gates.hasSnapshot
        ? "Capture official pricing/source snapshot"
        : !gates.hasFreshSnapshot
          ? `Refresh source snapshot older than ${sourceFreshnessDays} days`
        : !gates.hasArtifact
          ? "Attach screenshot, app URL, repo, or export"
          : !gates.hasPassingQa
            ? "Run final editorial QA"
          : "Ready for final QA";
  return {
    tool,
    ...gates,
    missing,
    nextAction,
    completeCount: [gates.hasRecord, gates.hasBenchmark, gates.hasFreshSnapshot, gates.hasArtifact, gates.hasPassingQa].filter(Boolean).length,
  };
}

function readinessRows() {
  return tools.map(readinessFor).sort((a, b) => a.completeCount - b.completeCount || b.tool.score - a.tool.score);
}

function categories() {
  return ["All", ...new Set(tools.map((tool) => tool.category))];
}

function reviewProfile(tool) {
  const playbook = categoryPlaybooks[tool.category] || defaultPlaybook;
  const record = reviewRecordFor(tool.name);
  const count = evidenceCountFor(tool.name);
  const snapshots = snapshotCountFor(tool.name);
  const artifactCount = artifactCountFor(tool.name);
  const evidenceStatus = count || snapshots || artifactCount ? `${count} benchmark run${count === 1 ? "" : "s"}, ${snapshots} source snapshot${snapshots === 1 ? "" : "s"}, ${artifactCount} artifact${artifactCount === 1 ? "" : "s"}` : "Evidence pending";
  return {
    ...playbook,
    evidenceStatus,
    verdictLabel: record ? record.status : tool.score >= 88 ? "Core review priority" : tool.score >= 80 ? "Important comparison target" : "Secondary ecosystem coverage",
    bestUseCase: tool.bestFor,
    reviewSlug: `${tool.slug}-review`,
    score: record?.score ?? tool.score,
    verdict: record?.verdict || tool.verdict,
    pros: linesFrom(record?.pros),
    cons: linesFrom(record?.cons),
    affiliateUrl: record?.affiliateUrl || "",
    publishNotes: record?.publishNotes || "",
    publishGate: `${playbook.benchmark} benchmark, current pricing snapshot, screenshots, production-readiness notes, and final editorial QA.`,
    nextTests: [
      `Run ${playbook.benchmark} benchmark`,
      "Capture pricing, limits, export path, and deployment notes",
      "Score auth, data handling, maintainability, and handoff risk",
    ],
  };
}

function scoringReadinessFor(tool, profile) {
  const gates = gateStatusFor(tool.name);
  return scoringRubric.map((item) => {
    const ready =
      item.dimension === "Build completion" ? gates.hasBenchmark :
      item.dimension === "Functional correctness" ? gates.hasBenchmark && gates.hasPassingQa :
      item.dimension === "Production path" ? gates.hasBenchmark && gates.hasFreshSnapshot && gates.hasArtifact :
      item.dimension === "Code and data quality" ? gates.hasBenchmark && gates.hasArtifact :
      item.dimension === "Iteration speed" ? gates.hasBenchmark :
      item.dimension === "User fit" ? gates.hasRecord :
      gates.hasBenchmark && gates.hasFreshSnapshot && gates.hasArtifact && gates.hasPassingQa;
    return {
      ...item,
      ready,
      note: ready ? "Evidence attached" : `Needs ${profile.benchmark} evidence`,
    };
  });
}

function benchmarkFitFor(tool, profile) {
  return benchmarkPrompts.map((prompt) => {
    const required = prompt.name === profile.benchmark;
    const useful =
      required ||
      (tool.category.includes("Site") && prompt.family === "Landing Page") ||
      (tool.category.includes("UI") && prompt.family === "Landing Page") ||
      (tool.category.includes("Internal") && prompt.family === "Internal Tool") ||
      (tool.category.includes("IDE") && prompt.family === "AI Wrapper") ||
      (tool.category.includes("Prompt") && ["SaaS MVP", "AI Wrapper", "Directory"].includes(prompt.family));
    return {
      ...prompt,
      fit: required ? "Required" : useful ? "Useful" : "Optional",
    };
  });
}

function reviewDossierPanel(tool, profile) {
  const gates = gateStatusFor(tool.name);
  const dimensions = scoringReadinessFor(tool, profile);
  const benchmarkFit = benchmarkFitFor(tool, profile);
  const checklist = [
    ["Review record", gates.hasRecord, "Save editor verdict, score, pros, cons, and publish notes."],
    ["Benchmark run", gates.hasBenchmark, `Run the ${profile.benchmark} benchmark and capture deploy outcome.`],
    ["Fresh source snapshot", gates.hasFreshSnapshot, `Capture official pricing/source evidence within ${sourceFreshnessDays} days.`],
    ["Artifact attached", gates.hasArtifact, "Attach screenshots, generated app URL, repo, export, or deploy link."],
    ["Final QA passed", gates.hasPassingQa, "Pass evidence, factuality, originality, SEO, and disclosure checks."],
  ];
  return `
    <section class="review-dossier">
      <div class="dossier-heading">
        <div><p class="eyebrow">Evidence dossier</p><h3>Publish readiness for ${tool.name}</h3></div>
        <strong class="${gates.ready ? "status-ready" : "status-blocked"}">${gates.ready ? "Ready" : "Blocked"}</strong>
      </div>
      <div class="dossier-grid">
        <div class="dossier-card">
          <h3>Gate checklist</h3>
          <div class="checklist">
            ${checklist.map(([label, done, text]) => `
              <div class="${done ? "done" : ""}">
                <span>${done ? "✓" : "!"}</span>
                <p><strong>${label}</strong>${text}</p>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="dossier-card">
          <h3>Scoring coverage</h3>
          <div class="score-breakdown">
            ${dimensions.map((item) => `
              <div>
                <span>${item.weight}%</span>
                <p><strong>${item.dimension}</strong>${item.ready ? "Covered by saved evidence" : item.note}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="dossier-card">
        <h3>Benchmark fit matrix</h3>
        <div class="fit-matrix">
          ${benchmarkFit.map((item) => `
            <div class="${item.fit.toLowerCase()}">
              <span>${item.fit}</span>
              <strong>${item.name}</strong>
              <p>${item.checks}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function reviewArticleArchitecture(tool, profile, sameCategory) {
  const primaryComparison = sameCategory[0];
  const outline = [
    [`${tool.name} review: quick verdict`, "State who should use it, who should avoid it, and evidence status."],
    [`What ${tool.name} is best for`, `Tie the verdict to ${profile.bestUseCase}.`],
    [`${tool.name} benchmark results`, `Use saved ${profile.benchmark} run data, screenshots, deploy notes, and failures.`],
    ["Pricing, limits, and current plan notes", "Use a fresh official source snapshot before publishing."],
    ["Production readiness", "Cover auth, data, secrets, export/deploy path, maintainability, and handoff risk."],
    primaryComparison ? `${tool.name} vs ${primaryComparison.name}` : `${tool.name} alternatives`,
    ["Final recommendation", "Publish only after all readiness gates pass or label the review as provisional."],
  ];
  const internalLinks = [
    ["Best tools by use case", "#best"],
    ["Scoring methodology", "#methodology"],
    ["Readiness dashboard", "#readiness"],
    ...sameCategory.slice(0, 3).map((item) => [`${item.name} review`, `#review/${item.slug}`]),
  ];
  return `
    <section class="article-architecture">
      <div class="dossier-heading">
        <div><p class="eyebrow">Autonomous article architecture</p><h3>Controlled outline for ${tool.name}</h3></div>
      </div>
      <div class="article-architecture-grid">
        <div class="outline-list">
          ${outline.map((item, index) => {
            const heading = Array.isArray(item) ? item[0] : item;
            const note = Array.isArray(item) ? item[1] : "Use the closest same-category comparison once benchmark evidence exists.";
            return `
              <div>
                <span>${index + 1}</span>
                <p><strong>${heading}</strong>${note}</p>
              </div>
            `;
          }).join("")}
        </div>
        <div class="internal-link-card">
          <h3>Required internal links</h3>
          <div class="related-list">
            ${internalLinks.map(([label, href]) => `<a href="${href}">${label}<span>Open</span></a>`).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function toolBySlug(slug) {
  if (!slug) return null;
  const s = slug.toLowerCase();
  if (s === 'replit') {
    return tools.find((tool) => tool.slug === 'replit-agent') || { name: 'Replit', slug: 'replit', category: 'Agentic IDE', price: 'Paid plans', bestFor: 'Cloud development with AI assistance' };
  }
  // C2 aliases for existing slugs (query routes use plain for some)
  const aliasMap = {
    'webflow': 'webflow-ai',
    'bubble': 'bubble-ai',
    'framer': 'framer-ai'
  };
  const mapped = aliasMap[s];
  if (mapped) {
    const found = tools.find((tool) => tool.slug === mapped);
    if (found) return found;
  }
  return tools.find((tool) => tool.slug === slug || tool.slug === s);
}

function compareUrl(a = compareA, b = compareB) {
  return `#compare/${a}/${b}`;
}

function bestOfGuideBySlug(slug) {
  return bestOfGuides.find((guide) => guide.slug === slug);
}

function authorityReportBySlug(slug) {
  return authorityReports.find((report) => report.slug === slug);
}

function toolsForBestOf(guide) {
  return guide.preferred
    .map((name) => tools.find((tool) => tool.name === name))
    .filter(Boolean)
    .sort((a, b) => reviewProfile(b).score - reviewProfile(a).score);
}

function recentRuns() {
  if (!benchmarkRuns.length) {
    return `<div class="empty-state">No benchmark runs saved yet. Capture the first run after testing Lovable with the SaaS MVP prompt.</div>`;
  }
  return `
    <div class="run-list">${benchmarkRuns.slice(0, 8).map((run) => `
      <div class="run-row">
        <div><strong>${run.tool}</strong><p><a href="#benchmark/${run.id}">${run.benchmark}</a> - ${run.deployStatus}</p></div>
        <div class="run-score">${run.finalScore ?? "—"}</div>
      </div>
    `).join("")}</div>
  `;
}

function savedBriefQueue() {
  if (!savedArticleBriefs.length) {
    return `<div class="empty-state">No saved article briefs yet. Capture the first Lovable review brief before drafting.</div>`;
  }
  return `
    <div class="run-list">${savedArticleBriefs.slice(0, 8).map((brief) => `
      <div class="run-row">
        <div><strong>${brief.title}</strong><p>${brief.targetKeyword} - ${brief.articleType} - ${brief.status}</p></div>
        <div class="run-score">${brief.requiredEvidence ? "G" : "!"}</div>
      </div>
    `).join("")}</div>
  `;
}

function recentSnapshots() {
  if (!evidenceSnapshots.length) {
    return `<div class="empty-state">No source snapshots saved yet. Capture pricing and feature evidence before publishing any review.</div>`;
  }
  return `
    <div class="run-list">${evidenceSnapshots.slice(0, 8).map((snapshot) => `
      <div class="run-row">
        <div><strong>${snapshot.tool}</strong><p>${snapshot.sourceType} - ${snapshot.pricingSummary}</p></div>
        <div class="run-score">S</div>
      </div>
    `).join("")}</div>
  `;
}

function recentReviewRecords() {
  if (!reviewRecords.length) {
    return `<div class="empty-state">No saved review records yet. Create one for Lovable first, then run the gates before publishing.</div>`;
  }
  return `
    <div class="run-list">${reviewRecords.slice(0, 8).map((record) => {
      const gates = gateStatusFor(record.tool);
      return `
        <div class="run-row">
          <div><strong>${record.tool}</strong><p>${record.status} - ${gates.ready ? "publish gates met" : "publish blocked"}</p></div>
          <div class="run-score">${record.score ?? "-"}</div>
        </div>
      `;
    }).join("")}</div>
  `;
}

function recentArtifacts() {
  if (!artifacts.length) {
    return `<div class="empty-state">No artifacts saved yet. Attach screenshots, generated app URLs, repos, exports, or deployment links after each test.</div>`;
  }
  return `
    <div class="run-list">${artifacts.slice(0, 8).map((artifact) => `
      <div class="run-row">
        <div><strong>${artifact.tool}</strong><p>${artifact.artifactType} - ${artifact.title}</p></div>
        <div class="run-score">A</div>
      </div>
    `).join("")}</div>
  `;
}

function recentQualityChecks() {
  if (!qualityChecks.length) {
    return `<div class="empty-state">No QA checks saved yet. Run QA only after evidence, artifacts, and a review record exist.</div>`;
  }
  return `
    <div class="run-list">${qualityChecks.slice(0, 8).map((check) => `
      <div class="run-row">
        <div><strong>${check.tool}</strong><p>${isPassingQualityCheck(check) ? "Passing" : "Blocked"} - evidence ${check.evidenceScore}, factuality ${check.factualityScore}, originality ${check.originalityScore}, SEO ${check.seoScore}</p></div>
        <div class="run-score">Q</div>
      </div>
    `).join("")}</div>
  `;
}

function qualitySummary(toolName) {
  const check = latestQualityCheckFor(toolName);
  if (!check) {
    return `<div class="snapshot-card empty-state">No final QA check saved yet. This review cannot publish until quality, factuality, originality, SEO, and disclosure are checked.</div>`;
  }
  const passing = isPassingQualityCheck(check);
  return `
    <div class="qa-card ${passing ? "passing" : "blocked"}">
      <div><p class="eyebrow">Latest QA check</p><h3>${passing ? "Passing" : "Blocked"}</h3></div>
      <div class="qa-score-grid">
        <div><span>Evidence</span><strong>${check.evidenceScore}</strong></div>
        <div><span>Factuality</span><strong>${check.factualityScore}</strong></div>
        <div><span>Originality</span><strong>${check.originalityScore}</strong></div>
        <div><span>SEO</span><strong>${check.seoScore}</strong></div>
      </div>
      <p><strong>Disclosure:</strong> ${check.disclosureReady}</p>
      <p>${check.notes}</p>
    </div>
  `;
}

function benchmarkSummary(toolName) {
  const runs = benchmarkRunsFor(toolName);
  if (!runs.length) {
    return `<div class="snapshot-card empty-state">No benchmark run saved yet. Run the required prompt and save score, deployment outcome, and evidence notes before publishing.</div>`;
  }
  return `
    <div class="benchmark-list">
      ${runs.slice(0, 5).map((run) => `
        <a class="benchmark-item" href="#benchmark/${run.id}">
          <span>${run.benchmark}</span>
          <strong>${run.finalScore ?? "No score"}</strong>
          <p>${run.deployStatus} - ${run.evidenceNotes}</p>
        </a>
      `).join("")}
    </div>
  `;
}

function benchmarkDetailPanel(run) {
  const tool = tools.find((item) => item.name === run.tool);
  const relatedArtifacts = artifactsFor(run.tool);
  const scoreLabel = run.finalScore === null ? "Unscored" : `${run.finalScore}/100`;
  return `
    <section class="panel benchmark-detail">
      <a class="back-link" href="${tool ? `#review/${tool.slug}` : "#admin"}">Back to ${tool ? `${tool.name} review` : "admin"}</a>
      <div class="review-hero">
        <div>
          <p class="eyebrow">Benchmark evidence</p>
          <h2>${run.benchmark}</h2>
          <p>${run.tool} benchmark run captured for editorial scoring, comparison tables, and publish-readiness gates.</p>
          <div class="review-actions">
            ${tool ? `<a href="#review/${tool.slug}">Open platform review</a>` : ""}
            <button data-tab="admin">Capture more evidence</button>
          </div>
        </div>
        <div class="review-scorecard">
          <span>Final score</span>
          <strong>${run.finalScore ?? "-"}</strong>
          <p>${run.deployStatus}</p>
        </div>
      </div>
      <div class="benchmark-detail-grid">
        <section>
          <h3>Run facts</h3>
          <dl class="facts stacked">
            <div><dt>Platform</dt><dd>${run.tool}</dd></div>
            <div><dt>Benchmark</dt><dd>${run.benchmark}</dd></div>
            <div><dt>Deploy status</dt><dd>${run.deployStatus}</dd></div>
            <div><dt>Score</dt><dd>${scoreLabel}</dd></div>
            <div><dt>Captured</dt><dd>${new Date(run.createdAt).toLocaleString()}</dd></div>
          </dl>
        </section>
        <section>
          <h3>Evidence notes</h3>
          <p>${run.evidenceNotes}</p>
        </section>
        <section>
          <h3>Related artifacts</h3>
          ${relatedArtifacts.length ? artifactSummary(run.tool) : `<div class="snapshot-card empty-state">No artifacts attached to ${run.tool} yet.</div>`}
        </section>
      </div>
    </section>
  `;
}

function artifactSummary(toolName) {
  const items = artifactsFor(toolName);
  if (!items.length) {
    return `<div class="snapshot-card empty-state">No artifacts saved yet. Add at least one screenshot, generated app URL, repo/export link, or deployment URL before publishing.</div>`;
  }
  return `
    <div class="artifact-list">
      ${items.slice(0, 6).map((artifact) => `
        <a class="artifact-item" href="${artifact.url}" target="_blank" rel="noreferrer">
          <span>${artifact.artifactType}</span>
          <strong>${artifact.title}</strong>
          <p>${artifact.notes || artifact.url}</p>
        </a>
      `).join("")}
    </div>
  `;
}

function snapshotSummary(toolName) {
  const snapshot = latestSnapshotFor(toolName);
  if (!snapshot) {
    return `
      <div class="snapshot-card empty-state">
        No pricing or source snapshot saved yet. This review cannot be published until an official source URL, pricing summary, and feature summary are captured.
      </div>
    `;
  }
  const age = snapshotAgeDays(snapshot);
  const fresh = isSnapshotFresh(snapshot);
  return `
    <div class="snapshot-card ${fresh ? "fresh" : "stale"}">
      <div><p class="eyebrow">Latest source snapshot</p><h3>${snapshot.sourceType}</h3></div>
      <div class="freshness-pill ${fresh ? "fresh" : "stale"}">${fresh ? "Fresh" : "Stale"}${age === null ? "" : ` - ${age} day${age === 1 ? "" : "s"} old`}</div>
      <dl class="facts stacked">
        <div><dt>Source</dt><dd><a href="${snapshot.sourceUrl}" target="_blank" rel="noreferrer">${snapshot.sourceUrl}</a></dd></div>
        <div><dt>Pricing</dt><dd>${snapshot.pricingSummary}</dd></div>
        <div><dt>Features</dt><dd>${snapshot.featureSummary}</dd></div>
        <div><dt>Limits</dt><dd>${snapshot.limitations || "No limitations captured yet."}</dd></div>
      </dl>
    </div>
  `;
}

function reviewRecordSummary(tool) {
  const profile = reviewProfile(tool);
  const record = reviewRecordFor(tool.name);
  const gates = gateStatusFor(tool.name);
  return `
    <section>
      <h3>Editorial record</h3>
      <div class="editorial-record">
        <div class="record-status ${gates.ready ? "ready" : ""}">
          <strong>${record ? record.status : "No saved review record"}</strong>
          <p>${gates.ready ? "All minimum publish gates are present." : `Publish blocked until review record, benchmark, fresh source snapshot, and artifact all exist.`}</p>
        </div>
        ${profile.affiliateUrl ? `<a class="affiliate-link" href="${profile.affiliateUrl}" target="_blank" rel="noreferrer">Affiliate or product link</a>` : `<p class="muted">No affiliate or product URL saved.</p>`}
        ${profile.publishNotes ? `<p>${profile.publishNotes}</p>` : ""}
      </div>
    </section>
  `;
}

function reviewDetailPanel(tool) {
  const profile = reviewProfile(tool);
  const brand = brandVisualFor(tool);
  const brandStyle = `--review-brand-bg: url('${brand.heroImage}'); --review-brand-1: ${brand.rgb}; --review-brand-2: ${brand.rgb2};`;
  const sameCategory = tools.filter((candidate) => candidate.category === tool.category && candidate.slug !== tool.slug).slice(0, 4);
  return `
    <section class="panel review-detail">
      <a class="back-link" href="#reviews">Back to all reviews</a>
      <div class="review-hero review-hero--branded" style="${brandStyle}">
        <div class="review-brand-plate" aria-label="${tool.name} brand">
          <div class="review-brand-orb tool-logo-row">
            ${toolLogoMarkup(tool, 28, "tool-logo")}
            <span>${brand.monogram}</span>
          </div>
          <div class="review-brand-copy">
            <strong>${tool.name}</strong>
            <small>${tool.category}</small>
          </div>
        </div>
        <div>
          <p class="eyebrow">${tool.category} review</p>
          <h2>${tool.name} Review</h2>
          <p>${profile.summary}</p>
          <div class="review-actions">
            <a class="button" href="#compare">Compare tools</a>
            <a href="#methodology">How this review works</a>
            ${tool.slug === "lovable" ? `<a class="button" href="#tool/lovable">Open Lovable Microsite Funnel →</a>` : ""}
            ${tool.slug === "bolt-new" ? `<a class="button" href="#tool/bolt-new">Open Bolt.new Microsite Funnel →</a>` : ""}
            ${["replit-agent", "replit"].includes(tool.slug) ? `<a class="button" href="#tool/replit">Open Replit Microsite Funnel →</a>` : ""}            ${tool.slug === "v0" ? `<a class="button" href="#tool/v0">Open v0 Ultimate Microsite →</a>` : ""}
            ${["lovable", "bolt-new", "replit-agent", "replit", "v0", "cursor", "windsurf", "framer-ai", "webflow-ai", "bubble-ai", "framer", "webflow", "bubble", "base44", "claude-code"].includes(tool.slug) ? "" : `<a class="button" href="#tool/${tool.slug}">Open ${tool.name} Microsite →</a>`}
          </div>
        </div>
        <div class="review-scorecard">
          <span>Review score</span>
          <strong>${profile.score}</strong>
          <p>${profile.evidenceStatus}</p>
        </div>
      </div>
      <div class="review-layout">
        <article class="review-body">
          <section>
            <h3>Verdict</h3>
            <p>${profile.verdict}</p>
            <p><strong>Best fit:</strong> ${profile.bestUseCase}</p>
            <p><strong>Do not use it when:</strong> ${profile.avoid}</p>
          </section>
          ${reviewDossierPanel(tool, profile)}
          ${reviewRecordSummary(tool)}
          <section>
            <h3>Benchmark evidence</h3>
            ${benchmarkSummary(tool.name)}
          </section>
          <section>
            <h3>Evidence snapshot</h3>
            ${snapshotSummary(tool.name)}
          </section>
          <section>
            <h3>Artifacts</h3>
            ${artifactSummary(tool.name)}
          </section>
          <section>
            <h3>Final QA</h3>
            ${qualitySummary(tool.name)}
          </section>
          <section>
            <h3>Strengths</h3>
            <div class="bullet-grid">${(profile.pros.length ? profile.pros : profile.strengths).map((item) => `<div><span class="check">✓</span><p>${item}</p></div>`).join("")}</div>
          </section>
          <section>
            <h3>Risks to verify</h3>
            <div class="bullet-grid warning">${(profile.cons.length ? profile.cons : profile.risks).map((item) => `<div><span class="check">!</span><p>${item}</p></div>`).join("")}</div>
          </section>
          <section>
            <h3>Benchmark plan</h3>
            <div class="timeline">${profile.nextTests.map((item, index) => `
              <div class="timeline-row">
                <div class="timeline-index">${index + 1}</div>
                <div><div class="timeline-title">${item}<span>${index === 0 ? "Required" : "Gate"}</span></div><p>${profile.publishGate}</p></div>
              </div>`).join("")}
            </div>
          </section>
          ${reviewArticleArchitecture(tool, profile, sameCategory)}
        </article>
        <aside class="review-sidebar">
          <div>
            <h3>Review facts</h3>
            <dl class="facts stacked">
              <div><dt>Category</dt><dd>${tool.category}</dd></div>
              <div><dt>Pricing</dt><dd>${tool.price}</dd></div>
              <div><dt>Status</dt><dd>${profile.verdictLabel}</dd></div>
              <div><dt>Commercial status</dt><dd>${tool.affiliateStatus}</dd></div>
              <div><dt>Freshness</dt><dd>${tool.updated}</dd></div>
            </dl>
          </div>
          <div>
            <h3>Similar reviews</h3>
            <div class="related-list">${sameCategory.length ? sameCategory.map((item) => `<a href="#review/${item.slug}">${item.name}<span>${item.score}</span></a>`).join("") : `<p>No direct category peers yet.</p>`}</div>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function reviewsPanel() {
  const q = query.trim().toLowerCase();
  const filtered = tools.filter((tool) => {
    const categoryMatch = activeCategory === "All" || tool.category === activeCategory;
    const searchMatch = !q || `${tool.name} ${tool.category} ${tool.bestFor} ${tool.verdict}`.toLowerCase().includes(q);
    return categoryMatch && searchMatch;
  });
  return `
    <section class="panel review-directory-page">
      <div class="panel-heading">
        <div><p class="eyebrow">Tool directory</p><h2>Browse no-code and AI builder reviews</h2></div>
        <label class="searchbox">${icon("search")}<input id="tool-search" value="${query}" placeholder="Search Lovable, Bolt, Replit, v0, Cursor..."></label>
      </div>
      <div class="category-filter">
        ${categories().map((category) => `<button data-category="${category}" class="${activeCategory === category ? "active" : ""}">${category}</button>`).join("")}
      </div>
      <div class="review-count">${filtered.length} tool${filtered.length === 1 ? "" : "s"} shown. Every card opens to a structured review with fit, risk, pricing, and evidence status.</div>
      <div class="tool-grid">${filtered.map(toolCard).join("")}</div>
    </section>
  `;
}

function comparePanel() {
  const rows = ["category", "price", "bestFor", "score", "evidence", "benchmark", "affiliateStatus"];
  const labels = { category: "Category", price: "Pricing", bestFor: "Best for", score: "Score", evidence: "Evidence status", benchmark: "Best test fit", affiliateStatus: "Commercial status" };
  return `
    <section class="panel">
      <div class="panel-heading"><div><p class="eyebrow">Comparison table</p><h2>Compare top no-code and AI app builders side by side</h2><p class="section-lede">Use this table to shortlist tools by fit, price, evidence status, and review readiness before opening a full review.</p></div></div>
      <div class="compare-builder">
        <label>Platform A<select id="compare-a">${tools.map((tool) => `<option value="${tool.slug}" ${tool.slug === compareA ? "selected" : ""}>${tool.name}</option>`).join("")}</select></label>
        <label>Platform B<select id="compare-b">${tools.map((tool) => `<option value="${tool.slug}" ${tool.slug === compareB ? "selected" : ""}>${tool.name}</option>`).join("")}</select></label>
        <a class="compare-open" href="${compareUrl()}">Compare selected tools</a>
      </div>
      <div class="comparison-wrap">
        <table class="comparison-table">
          <thead><tr><th>Feature</th>${tools.slice(0, 10).map((tool) => `<th><a href="#review/${tool.slug}">${tool.name}</a></th>`).join("")}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr><td>${labels[row]}</td>${tools.slice(0, 10).map((tool) => {
              const profile = reviewProfile(tool);
              const value = row === "evidence" ? profile.evidenceStatus : row === "benchmark" ? profile.benchmark : tool[row];
              return `<td>${value}</td>`;
            }).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function compareDetailPanel(toolA, toolB) {
  const profileA = reviewProfile(toolA);
  const profileB = reviewProfile(toolB);
  const gatesA = gateStatusFor(toolA.name);
  const gatesB = gateStatusFor(toolB.name);
  const rows = [
    ["Best for", profileA.bestUseCase, profileB.bestUseCase],
    ["Category", toolA.category, toolB.category],
    ["Pricing", toolA.price, toolB.price],
    ["Score", profileA.score, profileB.score],
    ["Evidence", profileA.evidenceStatus, profileB.evidenceStatus],
    ["Primary benchmark", profileA.benchmark, profileB.benchmark],
    ["Readiness", gatesA.ready ? "Ready" : "Blocked", gatesB.ready ? "Ready" : "Blocked"],
  ];
  const winner = profileA.score === profileB.score ? null : profileA.score > profileB.score ? toolA : toolB;
  return `
    <section class="panel compare-detail">
      <a class="back-link" href="#compare">Back to comparison table</a>
      <div class="panel-heading">
        <div><p class="eyebrow">Focused comparison</p><h2>${toolA.name} vs ${toolB.name}</h2></div>
      </div>
      <div class="compare-hero-grid">
        ${[toolA, toolB].map((tool) => {
          const profile = reviewProfile(tool);
          const gates = gateStatusFor(tool.name);
          return `
            <article class="compare-platform">
              <div><p class="eyebrow">${tool.category}</p><h3>${tool.name}</h3></div>
              <div class="score">${profile.score}</div>
              <p>${profile.verdict}</p>
              <div class="evidence-file-links">
        ${evidenceFilesFor(tool.name).map((file) => `<a href="/${file.file}" target="_blank" rel="noopener">${file.status} evidence</a>`).join("") || `<span>Evidence file pending</span>`}
      </div>
      <div class="gate-strip ${gates.ready ? "ready" : ""}">
                <span>${gates.hasRecord ? "Review" : "No review"}</span>
                <span>${gates.hasBenchmark ? "Benchmark" : "No benchmark"}</span>
                <span>${gates.hasFreshSnapshot ? "Fresh source" : gates.hasSnapshot ? "Stale source" : "No source"}</span>
                <span>${gates.hasArtifact ? "Artifact" : "No artifact"}</span>
                <span>${gates.hasPassingQa ? "QA passed" : "No QA"}</span>
              </div>
              <a href="#review/${tool.slug}">Open ${tool.name} review</a>
            </article>
          `;
        }).join("")}
      </div>
      <div class="comparison-callout">
        <strong>${winner ? `${winner.name} is the current evidence-weighted pick.` : "The current scores are tied."}</strong>
        <p>This recommendation remains provisional until both platforms have benchmark runs, fresh source snapshots, artifacts, and passing QA checks.</p>
      </div>
      <div class="comparison-wrap">
        <table class="comparison-table focused">
          <thead><tr><th>Decision point</th><th>${toolA.name}</th><th>${toolB.name}</th></tr></thead>
          <tbody>${rows.map(([label, a, b]) => `<tr><td>${label}</td><td>${a}</td><td>${b}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function bestOfPanel() {
  return `
    <section class="panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Best tools by use case</p><h2>Start with the job you need the tool to do</h2></div>
      </div>
      <div class="bestof-grid">
        ${bestOfGuides.map((guide) => `
          <a class="bestof-card" href="#best/${guide.slug}">
            <p class="eyebrow">${guide.keyword}</p>
            <h3>${guide.title}</h3>
            <p>${guide.intent}</p>
            <span>${guide.preferred.length} recommended tools</span>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function bestOfDetailPanel(guide) {
  const ranked = toolsForBestOf(guide);
  return `
    <section class="panel bestof-detail">
      <a class="back-link" href="#best">Back to best-of guides</a>
      <div class="panel-heading">
        <div><p class="eyebrow">${guide.keyword}</p><h2>${guide.title}</h2><p class="section-lede">Each ranking explains who the tool is best for, where the evidence is strong, and what still needs verification.</p></div>
      </div>
      <div class="comparison-callout">
        <strong>Selection rule</strong>
        <p>${guide.intent} Rankings use current score, best-fit alignment, pricing clarity, and publish-readiness gates. Scores remain provisional until evidence gates are complete.</p>
      </div>
      <div class="bestof-rankings">
        ${ranked.map((tool, index) => {
          const profile = reviewProfile(tool);
          const gates = gateStatusFor(tool.name);
          return `
            <article class="bestof-rank">
              <div class="rank-index">${index + 1}</div>
              <div>
                <p class="eyebrow">${tool.category}</p>
                <h3>${tool.name}</h3>
                <p>${profile.verdict}</p>
                <div class="evidence-file-links">
        ${evidenceFilesFor(tool.name).map((file) => `<a href="/${file.file}" target="_blank" rel="noopener">${file.status} evidence</a>`).join("") || `<span>Evidence file pending</span>`}
      </div>
      <div class="gate-strip ${gates.ready ? "ready" : ""}">
                  <span>${gates.hasBenchmark ? "Benchmark" : "No benchmark"}</span>
                  <span>${gates.hasFreshSnapshot ? "Fresh source" : gates.hasSnapshot ? "Stale source" : "No source"}</span>
                  <span>${gates.hasArtifact ? "Artifact" : "No artifact"}</span>
                  <span>${gates.hasPassingQa ? "QA passed" : "No QA"}</span>
                </div>
              </div>
              <div class="rank-score"><strong>${profile.score}</strong><a href="#review/${tool.slug}">Review</a></div>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function methodologyPanel() {
  const total = scoringRubric.reduce((sum, item) => sum + item.weight, 0);
  return `
    <section class="panel methodology-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Review methodology</p><h2>How NoCodeReviewed scores tools.</h2><p class="section-lede">Every review separates product fit, evidence strength, pricing freshness, and commercial status so rankings are useful instead of just promotional.</p></div>
      </div>
      <div class="trust-note">
        <strong>Editorial independence</strong>
        <p>Scores are based on evidence records, benchmark checks, pricing freshness, production-readiness gates, and QA status. Affiliate or sponsor status does not improve rankings.</p>
      </div>

      <div class="methodology-split">
        <div class="methodology-rulebook">
          <h3>Score model</h3>
          <p>Each review starts with comparable testing and source checks, then gets scored across completion, correctness, production path, maintainability, speed, buyer fit, and evidence quality. A tool can rank highly only when the evidence record supports the claim.</p>
          <div class="score-total"><span>Total weighting</span><strong>${total}%</strong></div>
        </div>
        <div class="rubric-list">
          ${scoringRubric.map((item) => `
            <article class="rubric-item">
              <div class="rubric-weight">${item.weight}%</div>
              <div><h3>${item.dimension}</h3><p>${item.test}</p></div>
            </article>
          `).join("")}
        </div>
      </div>
      <div class="benchmark-list">
        ${benchmarkPrompts.map((prompt) => `
          <article class="benchmark-card">
            <div><p class="eyebrow">${prompt.family}</p><h3>${prompt.name}</h3></div>
            <p>${prompt.checks}</p>
            <span>${prompt.status}</span>
          </article>
        `).join("")}
      </div>
      <div class="claim-ledger">
        <div class="panel-heading">
          <div><p class="eyebrow">Claims ledger</p><h2>Every strong claim needs a proof path.</h2></div>
        </div>
        <div class="claim-table-wrap">
          <table class="claim-table">
            <thead><tr><th>Claim type</th><th>Required evidence</th><th>Fail condition</th></tr></thead>
            <tbody>
              ${claimStandards.map((item) => `
                <tr>
                  <td><strong>${item.claim}</strong></td>
                  <td>${item.evidence}</td>
                  <td>${item.fail}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function taxonomyPanel() {
  return `
    <section class="panel taxonomy-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Category taxonomy</p><h2>Controlled language for reviews, comparisons, and SEO pages.</h2></div>
      </div>
      <div class="taxonomy-stats">
        <div><span>Defined terms</span><strong>${taxonomyTerms.length}</strong></div>
        <div><span>Boundary rules</span><strong>${taxonomyBoundaries.length}</strong></div>
        <div><span>SEO rules</span><strong>${taxonomySeoRules.length}</strong></div>
        <div><span>Tool categories</span><strong>${new Set(tools.map((tool) => tool.category)).size}</strong></div>
      </div>
      <div class="taxonomy-grid">
        ${taxonomyTerms.map((item) => `
          <article class="taxonomy-card">
            <h3>${item.term}</h3>
            <p>${item.definition}</p>
            <dl>
              <div><dt>Use when</dt><dd>${item.useWhen}</dd></div>
              <div><dt>Avoid when</dt><dd>${item.avoidWhen}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="taxonomy-bottom-grid">
        <section>
          <h3>Boundary rules</h3>
          <div class="checklist">
            ${taxonomyBoundaries.map((item) => `<div><span>!</span><p><strong>${item}</strong>Required before final verdict language.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>SEO usage rules</h3>
          <div class="outline-list">
            ${taxonomySeoRules.map((item, index) => `<div><span>${index + 1}</span><p><strong>${item.page}</strong>${item.rule}</p></div>`).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function reportCenterPanel() {
  return `
    <section class="panel report-center">
      <div class="panel-heading">
        <div><p class="eyebrow">Authority reports</p><h2>Report products that make the brand defensible.</h2></div>
      </div>
      <div class="report-grid">
        ${authorityReports.map((report, index) => `
          <a class="report-card" href="#report/${report.slug}">
            <div class="report-cover">
              <span>VCA ${String(index + 1).padStart(2, "0")}</span>
              <strong>${report.title}</strong>
              <p>${report.cadence}</p>
            </div>
            <div>
              <p class="eyebrow">${report.audience}</p>
              <h3>${report.title}</h3>
              <p>${report.thesis}</p>
            </div>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function reportDetailPanel(report) {
  return `
    <section class="panel report-detail">
      <a class="back-link" href="#reports">Back to reports</a>
      <div class="report-detail-hero">
        <div>
          <p class="eyebrow">${report.cadence} report</p>
          <h2>${report.title}</h2>
          <p>${report.thesis}</p>
          <div class="review-actions">
            <button data-tab="admin">Capture evidence</button>
            <a href="#readiness">View readiness gates</a>
          </div>
        </div>
        <div class="report-cover large">
          <span>Vibe Code Authority</span>
          <strong>${report.title}</strong>
          <p>${report.cadence}</p>
        </div>
      </div>
      <div class="report-detail-grid">
        <section>
          <h3>Audience</h3>
          <p>${report.audience}</p>
        </section>
        <section>
          <h3>Visual direction</h3>
          <p>${report.visual}</p>
        </section>
        <section>
          <h3>Required evidence</h3>
          <div class="checklist">
            ${report.requiredEvidence.map((item) => `<div><span>!</span><p><strong>${item}</strong>Must be captured before publication.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Report architecture</h3>
          <div class="outline-list">
            ${["Executive verdict", "Methodology and evidence window", "Rankings or watchlist", "Platform-level findings", "What changed since last report", "Recommended next tests"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>Use only saved evidence records, source snapshots, artifacts, benchmark runs, and QA notes.</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function intelligencePanel() {
  const coveredTools = new Set(marketSegments.flatMap((segment) => segment.tools));
  const unassignedTools = tools.filter((tool) => !coveredTools.has(tool.name)).slice(0, 8);
  return `
    <section class="panel intelligence-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Competitive intelligence</p><h2>Map the market before declaring winners.</h2></div>
      </div>
      <div class="intelligence-stats">
        <div><span>Market segments</span><strong>${marketSegments.length}</strong></div>
        <div><span>Tracked signals</span><strong>${competitorSignals.length}</strong></div>
        <div><span>Mapped tools</span><strong>${coveredTools.size}</strong></div>
        <div><span>Total tools</span><strong>${tools.length}</strong></div>
      </div>
      <div class="market-segment-grid">
        ${marketSegments.map((segment) => `
          <article class="market-segment-card">
            <div>
              <p class="eyebrow">${segment.role}</p>
              <h3>${segment.segment}</h3>
              <p>${segment.buyer}</p>
            </div>
            <div class="market-tool-chips">${segment.tools.map((tool) => `<span>${tool}</span>`).join("")}</div>
            <div class="market-test"><strong>Primary test</strong><p>${segment.test}</p></div>
          </article>
        `).join("")}
      </div>
      <div class="competitor-signal-grid">
        ${competitorSignals.map((item) => `
          <article class="signal-card">
            <h3>${item.signal}</h3>
            <dl>
              <div><dt>Impact</dt><dd>${item.impact}</dd></div>
              <div><dt>Response</dt><dd>${item.response}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="intelligence-bottom-grid">
        <section>
          <h3>Market watch priorities</h3>
          <div class="checklist">
            ${marketWatchPriorities.map((item) => `<div class="done"><span>✓</span><p><strong>${item}</strong>Required before rankings move.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Unassigned watchlist</h3>
          <div class="related-list">
            ${unassignedTools.map((tool) => `<a href="#review/${tool.slug}">${tool.name}<span>${tool.category}</span></a>`).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function intakePanel() {
  const coreLane = coverageLanes.find((lane) => lane.lane === "Core authority");
  return `
    <section class="panel intake-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Submit a tool</p><h2>Suggest a no-code or AI builder for review.</h2><p class="section-lede">Tools are added to NoCodeReviewed when there is enough public information, source evidence, and use-case demand to evaluate them fairly.</p></div>
      </div>
      <div class="intake-stats">
        <div><span>Review steps</span><strong>${intakeStages.length}</strong></div>
        <div><span>Tool lanes</span><strong>${coverageLanes.length}</strong></div>
        <div><span>Core builders</span><strong>${coreLane.examples.length}</strong></div>
        <div><span>Quality rules</span><strong>${intakeRejectionReasons.length}</strong></div>
      </div>
      <div class="intake-stage-grid">
        ${intakeStages.map((item, index) => `
          <article class="intake-stage-card">
            <div class="intake-stage-head">
              <span>${index + 1}</span>
              <div><p class="eyebrow">${item.owner}</p><h3>${item.stage}</h3></div>
            </div>
            <dl>
              <div><dt>Input</dt><dd>${item.input}</dd></div>
              <div><dt>Exit</dt><dd>${item.exit}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="coverage-lane-grid">
        ${coverageLanes.map((item) => `
          <article class="coverage-lane-card">
            <div>
              <p class="eyebrow">${item.criteria}</p>
              <h3>${item.lane}</h3>
            </div>
            <div class="market-tool-chips">${item.examples.map((tool) => `<span>${tool}</span>`).join("")}</div>
            <div class="market-test"><strong>Coverage action</strong><p>${item.action}</p></div>
          </article>
        `).join("")}
      </div>
      <div class="intake-bottom-grid">
        <section>
          <h3>Why a tool may wait</h3>
          <div class="checklist">
            ${intakeRejectionReasons.map((item) => `<div><span>!</span><p><strong>${item}</strong>Park until evidence improves.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>What happens after submission</h3>
          <div class="outline-list">
            ${["Assign segment", "Choose benchmark family", "Capture source snapshots", "Run first benchmark", "Decide lane"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 2 ? "Use the competitive intelligence model." : "Do not publish a verdict before this is complete."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function pipelinePanel() {
  const rows = readinessRows();
  const blocked = rows.filter((row) => !row.ready).slice(0, 8);
  const readyCount = rows.filter((row) => row.ready).length;
  const evidenceQueue = [
    ["Benchmark runs", rows.filter((row) => !row.hasBenchmark).length, "Run required benchmark prompt and save deploy outcome."],
    ["Fresh source snapshots", rows.filter((row) => !row.hasFreshSnapshot).length, `Refresh pricing and official source evidence every ${sourceFreshnessDays} days.`],
    ["Artifacts", rows.filter((row) => !row.hasArtifact).length, "Attach screenshots, app URLs, repos, exports, or deploy links."],
    ["Final QA", rows.filter((row) => !row.hasPassingQa).length, "Run evidence, factuality, originality, SEO, and disclosure checks."],
  ];
  return `
    <section class="panel pipeline-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Editorial command center</p><h2>Build the content machine in evidence order.</h2></div>
      </div>
      <div class="pipeline-stats">
        <div><span>Publish-ready reviews</span><strong>${readyCount}/${tools.length}</strong></div>
        <div><span>Saved briefs</span><strong>${savedArticleBriefs.length}</strong></div>
        <div><span>Benchmark runs</span><strong>${benchmarkRuns.length}</strong></div>
        <div><span>QA checks</span><strong>${qualityChecks.length}</strong></div>
      </div>
      <div class="pipeline-grid">
        ${contentPipeline.map((lane) => `
          <article class="pipeline-lane">
            <div class="pipeline-lane-head">
              <span>${lane.priority}</span>
              <div><p class="eyebrow">${lane.output}</p><h3>${lane.lane}</h3></div>
            </div>
            <p>${lane.outcome}</p>
            <div class="pipeline-items">${lane.items.map((item) => `<a href="#admin">${item}</a>`).join("")}</div>
            <div class="pipeline-evidence"><strong>Evidence gate</strong><p>${lane.evidence}</p></div>
          </article>
        `).join("")}
      </div>
      <div class="pipeline-bottom-grid">
        <section>
          <h3>Evidence backlog</h3>
          <div class="evidence-queue">
            ${evidenceQueue.map(([label, count, action]) => `
              <div>
                <strong>${count}</strong>
                <p><span>${label}</span>${action}</p>
              </div>
            `).join("")}
          </div>
        </section>
        <section>
          <h3>Next blocked reviews</h3>
          <div class="run-list">
            ${blocked.map((row) => `
              <div class="run-row">
                <div><strong>${row.tool.name}</strong><p>${row.nextAction}</p></div>
                <div class="run-score">${row.completeCount}/5</div>
              </div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function calendarPanel() {
  const rows = readinessRows();
  const publishReady = rows.filter((row) => row.ready);
  const blocked = rows.filter((row) => !row.ready).slice(0, 6);
  return `
    <section class="panel calendar-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Publishing calendar</p><h2>Convert evidence work into a repeatable launch schedule.</h2></div>
      </div>
      <div class="calendar-stats">
        <div><span>Calendar weeks</span><strong>${editorialCalendar.length}</strong></div>
        <div><span>Cadence rules</span><strong>${publishingCadence.length}</strong></div>
        <div><span>Ready reviews</span><strong>${publishReady.length}</strong></div>
        <div><span>Gate rules</span><strong>${publicationGateRules.length}</strong></div>
      </div>
      <div class="cadence-grid">
        ${publishingCadence.map((item) => `
          <article class="cadence-card">
            <p class="eyebrow">${item.rhythm}</p>
            <h3>${item.output}</h3>
            <span>${item.owner}</span>
            <p>${item.rule}</p>
          </article>
        `).join("")}
      </div>
      <div class="calendar-grid">
        ${editorialCalendar.map((item) => `
          <article class="calendar-card">
            <div class="calendar-card-head">
              <span>${item.week}</span>
              <div><p class="eyebrow">${item.theme}</p><h3>${item.ship.length} public outputs</h3></div>
            </div>
            <div class="pipeline-items">${item.ship.map((ship) => `<a href="#admin">${ship}</a>`).join("")}</div>
            <dl>
              <div><dt>Evidence required</dt><dd>${item.evidence}</dd></div>
              <div><dt>Publication blocker</dt><dd>${item.blocker}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="calendar-bottom-grid">
        <section>
          <h3>Publication gates</h3>
          <div class="checklist">
            ${publicationGateRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required before autonomous publishing.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Next blocked candidates</h3>
          <div class="run-list">
            ${blocked.map((row) => `
              <div class="run-row">
                <div><strong>${row.tool.name}</strong><p>${row.nextAction}</p></div>
                <div class="run-score">${row.completeCount}/5</div>
              </div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function monetizationPanel() {
  const affiliateCount = tools.filter((tool) => tool.affiliateStatus !== "None").length;
  const savedAffiliateLinks = reviewRecords.filter((record) => record.affiliateUrl).length;
  const disclosureReady = qualityChecks.filter((check) => check.disclosureReady === "Yes").length;
  return `
    <section class="panel monetization-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Monetization OS</p><h2>Revenue can exist only behind trust controls.</h2></div>
      </div>
      <div class="monetization-stats">
        <div><span>Affiliate candidates</span><strong>${affiliateCount}</strong></div>
        <div><span>Saved affiliate URLs</span><strong>${savedAffiliateLinks}</strong></div>
        <div><span>Disclosure-ready QA</span><strong>${disclosureReady}</strong></div>
        <div><span>Revenue rule</span><strong>Score-safe</strong></div>
      </div>
      <div class="monetization-grid">
        ${monetizationChannels.map((item) => `
          <article class="monetization-card">
            <div>
              <p class="eyebrow">${item.status}</p>
              <h3>${item.channel}</h3>
            </div>
            <p>${item.placement}</p>
            <div class="monetization-rule"><strong>Trust rule</strong><span>${item.rule}</span></div>
          </article>
        `).join("")}
      </div>
      <div class="monetization-bottom">
        <section>
          <h3>Disclosure guardrails</h3>
          <div class="checklist">
            ${monetizationGuardrails.map((item) => `<div class="done"><span>✓</span><p><strong>${item}</strong>Required for monetized publishing.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Affiliate intake targets</h3>
          <div class="related-list">
            ${tools.filter((tool) => tool.affiliateStatus !== "None").slice(0, 8).map((tool) => `
              <a href="#review/${tool.slug}">${tool.name}<span>${tool.affiliateStatus}</span></a>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function croPanel() {
  return `
    <section class="panel cro-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Conversion lab</p><h2>Optimize reader action without weakening evidence discipline.</h2></div>
      </div>
      <div class="cro-stats">
        <div><span>Experiments</span><strong>${croExperiments.length}</strong></div>
        <div><span>Lead magnets</span><strong>${leadMagnets.length}</strong></div>
        <div><span>CTA rules</span><strong>${conversionRules.length}</strong></div>
        <div><span>Guardrails</span><strong>${croGuardrails.length}</strong></div>
      </div>
      <div class="cro-experiment-grid">
        ${croExperiments.map((item) => `
          <article class="cro-experiment-card">
            <div>
              <p class="eyebrow">${item.metric}</p>
              <h3>${item.experiment}</h3>
            </div>
            <p>${item.hypothesis}</p>
            <div class="cro-guardrail"><strong>Guardrail</strong><span>${item.guardrail}</span></div>
          </article>
        `).join("")}
      </div>
      <div class="lead-magnet-grid">
        ${leadMagnets.map((item) => `
          <article class="lead-magnet-card">
            <h3>${item.offer}</h3>
            <dl>
              <div><dt>Audience</dt><dd>${item.audience}</dd></div>
              <div><dt>Trigger</dt><dd>${item.trigger}</dd></div>
              <div><dt>Required proof</dt><dd>${item.requiredProof}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="cro-bottom-grid">
        <section>
          <h3>Conversion guardrails</h3>
          <div class="checklist">
            ${croGuardrails.map((item) => `<div class="done"><span>✓</span><p><strong>${item}</strong>Required before experiment launch.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>CTA proof rules</h3>
          <div class="outline-list">
            ${conversionRules.map((item, index) => `<div><span>${index + 1}</span><p><strong>${item.surface}</strong>${item.proof}</p></div>`).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function emailPanel() {
  return `
    <section class="panel email-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Email engine</p><h2>Build subscriber trust by sending evidence, not hype.</h2></div>
      </div>
      <div class="email-stats">
        <div><span>Segments</span><strong>${subscriberSegments.length}</strong></div>
        <div><span>Sequences</span><strong>${emailSequences.length}</strong></div>
        <div><span>Lead magnets</span><strong>${leadMagnets.length}</strong></div>
        <div><span>Rules</span><strong>${newsletterRules.length}</strong></div>
      </div>
      <div class="subscriber-segment-grid">
        ${subscriberSegments.map((item) => `
          <article class="subscriber-segment-card">
            <div>
              <p class="eyebrow">${item.primaryOffer}</p>
              <h3>${item.segment}</h3>
            </div>
            <dl>
              <div><dt>Source</dt><dd>${item.source}</dd></div>
              <div><dt>Promise</dt><dd>${item.promise}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="email-sequence-grid">
        ${emailSequences.map((item) => `
          <article class="email-sequence-card">
            <div><p class="eyebrow">${item.cadence}</p><h3>${item.sequence}</h3></div>
            <dl>
              <div><dt>Goal</dt><dd>${item.goal}</dd></div>
              <div><dt>Required proof</dt><dd>${item.requiredProof}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="email-bottom-grid">
        <section>
          <h3>Newsletter trust rules</h3>
          <div class="checklist">
            ${newsletterRules.map((item) => `<div class="done"><span>✓</span><p><strong>${item}</strong>Required before campaign send.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Lead magnet routing</h3>
          <div class="outline-list">
            ${leadMagnets.map((item, index) => `<div><span>${index + 1}</span><p><strong>${item.offer}</strong>${item.trigger}</p></div>`).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function partnershipsPanel() {
  const affiliateCandidates = tools.filter((tool) => tool.affiliateStatus !== "None");
  return `
    <section class="panel partnerships-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Partner governance</p><h2>Commercial relationships stay outside the scoring engine.</h2></div>
      </div>
      <div class="partnership-stats">
        <div><span>Partner tiers</span><strong>${partnerTiers.length}</strong></div>
        <div><span>Risk controls</span><strong>${partnerRiskControls.length}</strong></div>
        <div><span>Intake steps</span><strong>${partnerIntakeSteps.length}</strong></div>
        <div><span>Affiliate candidates</span><strong>${affiliateCandidates.length}</strong></div>
      </div>
      <div class="partner-tier-grid">
        ${partnerTiers.map((item) => `
          <article class="partner-tier-card">
            <h3>${item.tier}</h3>
            <dl>
              <div><dt>Allowed</dt><dd>${item.allowed}</dd></div>
              <div><dt>Blocked</dt><dd>${item.blocked}</dd></div>
              <div><dt>Disclosure</dt><dd>${item.disclosure}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="partner-risk-grid">
        ${partnerRiskControls.map((item) => `
          <article class="partner-risk-card">
            <p class="eyebrow">${item.risk}</p>
            <h3>${item.control}</h3>
            <p>${item.audit}</p>
          </article>
        `).join("")}
      </div>
      <div class="partnership-bottom-grid">
        <section>
          <h3>Partner intake checklist</h3>
          <div class="outline-list">
            ${partnerIntakeSteps.map((item, index) => `<div><span>${index + 1}</span><p><strong>${item}</strong>Required before commercial placement goes live.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Affiliate candidate queue</h3>
          <div class="related-list">
            ${affiliateCandidates.slice(0, 10).map((tool) => `
              <a href="#review/${tool.slug}">${tool.name}<span>${tool.affiliateStatus}</span></a>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function audiencePanel() {
  return `
    <section class="panel audience-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Audience intelligence</p><h2>Route every reader to the right evidence surface.</h2></div>
      </div>
      <div class="audience-grid">
        ${audienceSegments.map((segment) => `
          <article class="audience-card">
            <div>
              <p class="eyebrow">${segment.primaryPath}</p>
              <h3>${segment.segment}</h3>
              <p>${segment.intent}</p>
            </div>
            <div class="audience-needs">
              ${segment.needs.map((need) => `<span>${need}</span>`).join("")}
            </div>
            <a href="${segment.href}">${segment.cta}</a>
          </article>
        `).join("")}
      </div>
      <div class="conversion-rules">
        <div class="panel-heading">
          <div><p class="eyebrow">Conversion rules</p><h2>Every CTA needs the right proof before it asks for action.</h2></div>
        </div>
        <div class="conversion-table-wrap">
          <table class="conversion-table">
            <thead><tr><th>Surface</th><th>Goal</th><th>Primary CTA</th><th>Required proof</th></tr></thead>
            <tbody>
              ${conversionRules.map((rule) => `
                <tr>
                  <td><strong>${rule.surface}</strong></td>
                  <td>${rule.goal}</td>
                  <td>${rule.cta}</td>
                  <td>${rule.proof}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function measurementPanel() {
  const rows = readinessRows();
  const readyCount = rows.filter((row) => row.ready).length;
  const staleCount = rows.filter((row) => row.hasSnapshot && !row.hasFreshSnapshot).length;
  const evidenceRecordCount = benchmarkRuns.length + evidenceSnapshots.length + artifacts.length + reviewRecords.length + qualityChecks.length;
  return `
    <section class="panel measurement-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Measurement system</p><h2>Track growth only when trust and evidence stay visible.</h2></div>
      </div>
      <div class="measurement-stats">
        <div><span>Pillars</span><strong>${measurementPillars.length}</strong></div>
        <div><span>Analytics events</span><strong>${analyticsEvents.length}</strong></div>
        <div><span>Ready reviews</span><strong>${readyCount}/${tools.length}</strong></div>
        <div><span>Evidence records</span><strong>${evidenceRecordCount}</strong></div>
      </div>
      <div class="measurement-pillar-grid">
        ${measurementPillars.map((item) => `
          <article class="measurement-pillar-card">
            <div>
              <p class="eyebrow">${item.metric}</p>
              <h3>${item.pillar}</h3>
            </div>
            <dl>
              <div><dt>Positive signal</dt><dd>${item.signal}</dd></div>
              <div><dt>Caution</dt><dd>${item.caution}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="analytics-event-wrap">
        <table class="analytics-event-table">
          <thead><tr><th>Event</th><th>Purpose</th><th>Guardrail</th></tr></thead>
          <tbody>
            ${analyticsEvents.map((item) => `
              <tr>
                <td><strong>${item.event}</strong></td>
                <td>${item.purpose}</td>
                <td>${item.guardrail}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="measurement-bottom-grid">
        <section>
          <h3>Measurement rules</h3>
          <div class="checklist">
            ${measurementRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required before analytics drive product decisions.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Current instrumentation needs</h3>
          <dl class="facts stacked">
            <div><dt>Publish readiness</dt><dd>${readyCount} of ${tools.length} reviews currently pass all evidence gates.</dd></div>
            <div><dt>Stale source risk</dt><dd>${staleCount} tracked tools have stale snapshots after evidence capture.</dd></div>
            <div><dt>Next analytics step</dt><dd>Add page, tool, evidence state, disclosure state, and freshness state to every public event.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;
}

function seoPanel() {
  const totalTemplateReach = tools.length + bestOfGuides.length + authorityReports.length + (tools.length * benchmarkPrompts.length);
  return `
    <section class="panel seo-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Programmatic SEO</p><h2>Scale pages only where evidence can scale with them.</h2></div>
      </div>
      <div class="seo-stats">
        <div><span>Template families</span><strong>${seoTemplates.length}</strong></div>
        <div><span>Potential evidence pages</span><strong>${totalTemplateReach}</strong></div>
        <div><span>Tracked tools</span><strong>${tools.length}</strong></div>
        <div><span>Benchmark prompts</span><strong>${benchmarkPrompts.length}</strong></div>
      </div>
      <div class="seo-template-grid">
        ${seoTemplates.map((item) => `
          <article class="seo-template-card">
            <div>
              <p class="eyebrow">${item.url}</p>
              <h3>${item.template}</h3>
              <p>${item.intent}</p>
            </div>
            <dl>
              <div><dt>Scale</dt><dd>${item.scale}</dd></div>
              <div><dt>Evidence</dt><dd>${item.evidence}</dd></div>
            </dl>
            <div class="seo-link-chips">${item.links.map((link) => `<span>${link}</span>`).join("")}</div>
          </article>
        `).join("")}
      </div>
      <div class="seo-rules-grid">
        <section>
          <h3>Internal link rules</h3>
          <div class="checklist">
            ${internalLinkRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required for scalable publishing.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Template launch order</h3>
          <div class="outline-list">
            ${["Platform reviews", "Versus comparisons", "Best-of hubs", "Build logs", "Authority reports", "Alternative pages"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 3 ? "Launch only for core tools first." : "Scale after evidence capture is repeatable."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function architecturePanel() {
  const queuedUrlCount = launchUrlQueue.reduce((sum, group) => sum + group.urls.length, 0);
  return `
    <section class="panel architecture-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Site architecture</p><h2>Define the public map before scaling pages.</h2></div>
      </div>
      <div class="architecture-stats">
        <div><span>Public sections</span><strong>${siteSections.length}</strong></div>
        <div><span>URL rules</span><strong>${urlGovernanceRules.length}</strong></div>
        <div><span>Launch clusters</span><strong>${launchUrlQueue.length}</strong></div>
        <div><span>Queued URLs</span><strong>${queuedUrlCount}</strong></div>
      </div>
      <div class="site-section-grid">
        ${siteSections.map((item) => `
          <article class="site-section-card">
            <div>
              <p class="eyebrow">${item.url}</p>
              <h3>${item.section}</h3>
              <p>${item.purpose}</p>
            </div>
            <div class="site-launch-rule"><strong>Launch rule</strong><p>${item.launchRule}</p></div>
          </article>
        `).join("")}
      </div>
      <div class="url-queue-grid">
        ${launchUrlQueue.map((group) => `
          <article class="url-queue-card">
            <div><p class="eyebrow">${group.priority}</p><h3>${group.cluster}</h3></div>
            <div class="url-list">${group.urls.map((url) => `<span>${url}</span>`).join("")}</div>
          </article>
        `).join("")}
      </div>
      <div class="architecture-bottom-grid">
        <section>
          <h3>URL governance</h3>
          <div class="checklist">
            ${urlGovernanceRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required before public launch.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Navigation hierarchy</h3>
          <div class="outline-list">
            ${["Reviews", "Compare", "Best", "Benchmarks", "Reports", "Method"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 3 ? "Primary reader path." : "Authority and evidence support path."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function sourceWatchPanel() {
  const rows = readinessRows();
  const noSnapshot = rows.filter((row) => !row.hasSnapshot).length;
  const staleSnapshot = rows.filter((row) => row.hasSnapshot && !row.hasFreshSnapshot).length;
  const freshSnapshot = rows.filter((row) => row.hasFreshSnapshot).length;
  const latestSnapshots = evidenceSnapshots.slice(0, 6);
  return `
    <section class="panel source-watch-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Source watcher</p><h2>Freshness controls for claims, rankings, and reports.</h2></div>
      </div>
      <div class="source-watch-stats">
        <div><span>Fresh snapshots</span><strong>${freshSnapshot}</strong></div>
        <div><span>Stale snapshots</span><strong>${staleSnapshot}</strong></div>
        <div><span>No source snapshot</span><strong>${noSnapshot}</strong></div>
        <div><span>Freshness window</span><strong>${sourceFreshnessDays}d</strong></div>
      </div>
      <div class="watch-rule-grid">
        ${sourceWatchRules.map((rule) => `
          <article class="watch-rule-card">
            <div><p class="eyebrow">${rule.cadence}</p><h3>${rule.source}</h3></div>
            <div class="watch-triggers">${rule.triggers.map((trigger) => `<span>${trigger}</span>`).join("")}</div>
            <div class="watch-action"><strong>Refresh action</strong><p>${rule.action}</p></div>
          </article>
        `).join("")}
      </div>
      <div class="source-watch-bottom">
        <section>
          <h3>Freshness invalidators</h3>
          <div class="checklist">
            ${freshnessInvalidators.map((item) => `<div><span>!</span><p><strong>${item}</strong>Requires refresh before affected claims can publish.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Latest saved snapshots</h3>
          ${latestSnapshots.length ? `
            <div class="run-list">
              ${latestSnapshots.map((snapshot) => {
                const age = snapshotAgeDays(snapshot);
                const fresh = isSnapshotFresh(snapshot);
                return `
                  <div class="run-row">
                    <div><strong>${snapshot.tool}</strong><p>${snapshot.sourceType} - ${age === null ? "unknown age" : `${age}d old`} - ${fresh ? "fresh" : "stale"}</p></div>
                    <div class="run-score">${fresh ? "F" : "S"}</div>
                  </div>
                `;
              }).join("")}
            </div>
          ` : `<div class="empty-state">No source snapshots saved yet. Capture official pricing and feature sources from the Admin tab.</div>`}
        </section>
      </div>
    </section>
  `;
}

function correctionsPanel() {
  const rows = readinessRows();
  const staleCount = rows.filter((row) => row.hasSnapshot && !row.hasFreshSnapshot).length;
  const unresolvedEvidence = rows.filter((row) => !row.ready).length;
  return `
    <section class="panel corrections-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Corrections and changes</p><h2>Verdicts can change, but the evidence trail cannot disappear.</h2></div>
      </div>
      <div class="correction-stats">
        <div><span>Correction types</span><strong>${correctionTypes.length}</strong></div>
        <div><span>Policy rules</span><strong>${correctionPolicyRules.length}</strong></div>
        <div><span>Stale evidence</span><strong>${staleCount}</strong></div>
        <div><span>Blocked reviews</span><strong>${unresolvedEvidence}</strong></div>
      </div>
      <div class="correction-type-grid">
        ${correctionTypes.map((item) => `
          <article class="correction-type-card">
            <div>
              <p class="eyebrow">${item.severity} severity</p>
              <h3>${item.type}</h3>
            </div>
            <dl>
              <div><dt>Trigger</dt><dd>${item.trigger}</dd></div>
              <div><dt>Response</dt><dd>${item.response}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="change-log-wrap">
        <table class="change-log-table">
          <thead><tr><th>Date</th><th>Page</th><th>Change</th><th>Evidence</th><th>Impact</th></tr></thead>
          <tbody>
            ${sampleChangeLog.map((item) => `
              <tr>
                <td>${item.date}</td>
                <td><strong>${item.page}</strong></td>
                <td>${item.change}</td>
                <td>${item.evidence}</td>
                <td>${item.impact}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="correction-bottom-grid">
        <section>
          <h3>Correction policy</h3>
          <div class="checklist">
            ${correctionPolicyRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required for durable editorial trust.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Revision workflow</h3>
          <div class="outline-list">
            ${["Detect change", "Classify correction", "Attach evidence", "Update impacted pages", "Publish change note"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 2 ? "Use source watcher, vendor reports, or QA findings." : "Preserve the dated evidence trail."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function benchmarksPanel() {
  const scoredRuns = benchmarkRuns.filter((run) => run.finalScore !== null && run.finalScore !== undefined && run.finalScore !== "").length;
  const deployPassed = benchmarkRuns.filter((run) => run.deployStatus === "Passed").length;
  const deployBlocked = benchmarkRuns.filter((run) => ["Failed", "Manual repair needed"].includes(run.deployStatus)).length;
  return `
    <section class="panel benchmarks-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Benchmark runner</p><h2>Repeatable tests before rankings move.</h2></div>
      </div>
      <div class="benchmark-runner-stats">
        <div><span>Prompt families</span><strong>${benchmarkPrompts.length}</strong></div>
        <div><span>Saved runs</span><strong>${benchmarkRuns.length}</strong></div>
        <div><span>Scored runs</span><strong>${scoredRuns}</strong></div>
        <div><span>Deploy pass/block</span><strong>${deployPassed}/${deployBlocked}</strong></div>
      </div>
      <div class="benchmark-protocol-grid">
        ${benchmarkProtocol.map((item, index) => `
          <article class="protocol-card">
            <div class="protocol-index">${index + 1}</div>
            <div><p class="eyebrow">${item.owner}</p><h3>${item.step}</h3><p>${item.output}</p></div>
          </article>
        `).join("")}
      </div>
      <div class="benchmark-runner-grid">
        <section>
          <h3>Prompt families</h3>
          <div class="benchmark-list">
            ${benchmarkPrompts.map((prompt) => `
              <article class="benchmark-card">
                <div><p class="eyebrow">${prompt.family}</p><h3>${prompt.name}</h3></div>
                <p>${prompt.checks}</p>
                <span>${prompt.status}</span>
              </article>
            `).join("")}
          </div>
        </section>
        <section>
          <h3>Failure taxonomy</h3>
          <div class="failure-list">
            ${benchmarkFailureModes.map((item) => `
              <div>
                <span>${item.severity}</span>
                <p><strong>${item.failure}</strong>${item.meaning}</p>
              </div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function generationPanel() {
  return `
    <section class="panel generation-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Prompt governance</p><h2>Generated content is useful only when it stays inside evidence boundaries.</h2></div>
      </div>
      <div class="generation-stats">
        <div><span>Surfaces</span><strong>${generationSurfaces.length}</strong></div>
        <div><span>Prompt contracts</span><strong>${promptContracts.length}</strong></div>
        <div><span>Validation rules</span><strong>${generationValidationRules.length}</strong></div>
        <div><span>QA thresholds</span><strong>${qualityThresholds.length}</strong></div>
      </div>
      <div class="generation-surface-grid">
        ${generationSurfaces.map((item) => `
          <article class="generation-surface-card">
            <div>
              <p class="eyebrow">${item.surface}</p>
              <h3>${item.output}</h3>
            </div>
            <dl>
              <div><dt>Input</dt><dd>${item.input}</dd></div>
              <div><dt>Boundary</dt><dd>${item.boundary}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="prompt-contract-grid">
        ${promptContracts.map((item) => `
          <article class="prompt-contract-card">
            <h3>${item.contract}</h3>
            <dl>
              <div><dt>Rule</dt><dd>${item.rule}</dd></div>
              <div><dt>Fail condition</dt><dd>${item.fail}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="generation-bottom-grid">
        <section>
          <h3>Output validation rules</h3>
          <div class="checklist">
            ${generationValidationRules.map((rule) => `<div><span>!</span><p><strong>${rule}</strong>Required before generated content can enter QA.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Generation workflow</h3>
          <div class="outline-list">
            ${["Load evidence", "Apply prompt contract", "Generate draft", "List claims and gaps", "Enter quality gateway"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 2 ? "Ground output in controlled inputs." : "No public publish until approval gates pass."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function modelOpsPanel() {
  return `
    <section class="panel model-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Model operations</p><h2>Route autonomous work by risk, evidence depth, and publication impact.</h2></div>
      </div>
      <div class="model-stats">
        <div><span>Routing tiers</span><strong>${modelRoutingTiers.length}</strong></div>
        <div><span>Task policies</span><strong>${modelTaskPolicies.length}</strong></div>
        <div><span>Guardrails</span><strong>${modelGuardrails.length}</strong></div>
        <div><span>Approval gates</span><strong>${generationValidationRules.length}</strong></div>
      </div>
      <div class="model-tier-grid">
        ${modelRoutingTiers.map((item) => `
          <article class="model-tier-card">
            <div>
              <p class="eyebrow">${item.tier}</p>
              <h3>${item.use}</h3>
            </div>
            <dl>
              <div><dt>Quality gate</dt><dd>${item.qualityGate}</dd></div>
              <div><dt>Budget rule</dt><dd>${item.budgetRule}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="model-policy-grid">
        ${modelTaskPolicies.map((item) => `
          <article class="model-policy-card">
            <h3>${item.task}</h3>
            <dl>
              <div><dt>Required inputs</dt><dd>${item.requiredInputs}</dd></div>
              <div><dt>Blocked outputs</dt><dd>${item.blockedOutputs}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="model-bottom-grid">
        <section>
          <h3>Execution guardrails</h3>
          <div class="checklist">
            ${modelGuardrails.map((rule) => `<div><span>!</span><p><strong>${rule}</strong>Logged before autonomous output can affect public pages.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Escalation path</h3>
          <div class="outline-list">
            ${["Cheap draft route", "Evidence reasoning route", "Editorial synthesis route", "Audit route", "Human approval"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 2 ? "Useful for preparation and structured checks." : "Required when public authority or revenue is affected."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function qualityPanel() {
  const passing = qualityChecks.filter(isPassingQualityCheck).length;
  const blocked = qualityChecks.length - passing;
  const readyRows = readinessRows();
  const qaMissing = readyRows.filter((row) => !row.hasPassingQa).slice(0, 8);
  return `
    <section class="panel quality-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Quality gateway</p><h2>Autonomous publishing stops when proof is weak.</h2></div>
      </div>
      <div class="quality-stats">
        <div><span>Total QA checks</span><strong>${qualityChecks.length}</strong></div>
        <div><span>Passing</span><strong>${passing}</strong></div>
        <div><span>Blocked</span><strong>${blocked}</strong></div>
        <div><span>Reviews missing QA</span><strong>${qaMissing.length}</strong></div>
      </div>
      <div class="quality-threshold-grid">
        ${qualityThresholds.map((item) => `
          <article class="quality-threshold-card">
            <div><p class="eyebrow">Minimum ${item.minimum}</p><h3>${item.metric}</h3></div>
            <p>${item.blocks}</p>
          </article>
        `).join("")}
      </div>
      <div class="quality-bottom-grid">
        <section>
          <h3>Rejection reasons</h3>
          <div class="checklist">
            ${qualityRejectionReasons.map((reason) => `<div><span>!</span><p><strong>${reason}</strong>Block publishing until fixed and rechecked.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Recent QA outcomes</h3>
          ${qualityChecks.length ? recentQualityChecks() : `<div class="empty-state">No QA checks saved yet. Use Admin to score evidence, factuality, originality, SEO, and disclosure readiness.</div>`}
        </section>
      </div>
      <div class="quality-bottom-grid">
        <section>
          <h3>Next QA queue</h3>
          <div class="run-list">
            ${qaMissing.map((row) => `
              <div class="run-row">
                <div><strong>${row.tool.name}</strong><p>${row.nextAction}</p></div>
                <div class="run-score">${row.completeCount}/5</div>
              </div>
            `).join("")}
          </div>
        </section>
        <section>
          <h3>Contradiction checks</h3>
          <div class="outline-list">
            ${["Verdict vs evidence gates", "Pricing claims vs fresh source snapshot", "Winner language vs comparable benchmark runs", "Production-ready claims vs deploy/security proof", "Affiliate CTA vs disclosure readiness"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>Must pass before article, review, report, or comparison publication.</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function dataPanel() {
  const counts = {
    benchmarkRuns: benchmarkRuns.length,
    articleBriefs: savedArticleBriefs.length,
    evidenceSnapshots: evidenceSnapshots.length,
    reviewRecords: reviewRecords.length,
    artifacts: artifacts.length,
    qualityChecks: qualityChecks.length,
  };
  return `
    <section class="panel data-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Data model</p><h2>The evidence graph behind the authority system.</h2></div>
      </div>
      <div class="data-stats">
        ${dataCollections.map((collection) => `
          <div><span>${collection.name}</span><strong>${counts[collection.name] ?? 0}</strong></div>
        `).join("")}
      </div>
      <div class="data-collection-grid">
        ${dataCollections.map((collection) => `
          <article class="data-collection-card">
            <div><p class="eyebrow">${collection.dependsOn.join(" + ")}</p><h3>${collection.name}</h3></div>
            <p>${collection.purpose}</p>
            <div class="data-fields">
              ${collection.required.map((field) => `<span>${field}</span>`).join("")}
            </div>
          </article>
        `).join("")}
      </div>
      <div class="data-bottom-grid">
        <section>
          <h3>Export rules</h3>
          <div class="checklist">
            ${dataExportRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required before database, CMS, or report export automation.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Current local store</h3>
          <dl class="facts stacked">
            <div><dt>Storage</dt><dd>data/local-store.json</dd></div>
            <div><dt>API surface</dt><dd>/api/benchmark-runs, /api/article-briefs, /api/evidence-snapshots, /api/review-records, /api/artifacts, /api/quality-checks</dd></div>
            <div><dt>Next database step</dt><dd>Move these collections into relational tables with foreign keys by tool, article, benchmark, and evidence record.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;
}

function schemaPanel() {
  const fieldCount = databaseTables.reduce((sum, table) => sum + table.keyFields.length, 0);
  return `
    <section class="panel schema-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Database schema</p><h2>Turn the local evidence store into relational authority data.</h2></div>
      </div>
      <div class="schema-stats">
        <div><span>Tables</span><strong>${databaseTables.length}</strong></div>
        <div><span>Key fields</span><strong>${fieldCount}</strong></div>
        <div><span>Relations</span><strong>${databaseRelations.length}</strong></div>
        <div><span>Indexes</span><strong>${databaseIndexes.length}</strong></div>
      </div>
      <div class="database-table-grid">
        ${databaseTables.map((item) => `
          <article class="database-table-card">
            <div>
              <p class="eyebrow">${item.table}</p>
              <h3>${item.purpose}</h3>
            </div>
            <div class="data-fields">
              ${item.keyFields.map((field) => `<span>${field}</span>`).join("")}
            </div>
            <p>${item.relations}</p>
          </article>
        `).join("")}
      </div>
      <div class="schema-bottom-grid">
        <section>
          <h3>Foreign-key relationships</h3>
          <div class="outline-list">
            ${databaseRelations.map((relation, index) => `<div><span>${index + 1}</span><p><strong>${relation}</strong>Required for evidence graph integrity.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Indexes and migration rules</h3>
          <div class="checklist">
            ${databaseIndexes.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Supports canonical lookup and evidence rendering.</p></div>`).join("")}
            ${databaseMigrationRules.map((rule) => `<div><span>!</span><p><strong>${rule}</strong>Required during JSON migration.</p></div>`).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function apiPanel() {
  const endpointCount = apiEndpointFamilies.reduce((sum, item) => sum + item.endpoints.length, 0);
  return `
    <section class="panel api-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">API contract</p><h2>Define how admin, CMS, workers, and public pages exchange evidence.</h2></div>
      </div>
      <div class="api-stats">
        <div><span>Families</span><strong>${apiEndpointFamilies.length}</strong></div>
        <div><span>Endpoints</span><strong>${endpointCount}</strong></div>
        <div><span>Validation rules</span><strong>${apiValidationRules.length}</strong></div>
        <div><span>Security boundaries</span><strong>${apiSecurityBoundaries.length}</strong></div>
      </div>
      <div class="api-family-grid">
        ${apiEndpointFamilies.map((item) => `
          <article class="api-family-card">
            <div>
              <p class="eyebrow">${item.consumers}</p>
              <h3>${item.family}</h3>
              <p>${item.contract}</p>
            </div>
            <div class="api-endpoint-list">
              ${item.endpoints.map((endpoint) => `<span>${endpoint}</span>`).join("")}
            </div>
          </article>
        `).join("")}
      </div>
      <div class="api-bottom-grid">
        <section>
          <h3>Validation rules</h3>
          <div class="checklist">
            ${apiValidationRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required before production API rollout.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Security boundaries</h3>
          <div class="checklist">
            ${apiSecurityBoundaries.map((rule) => `<div><span>!</span><p><strong>${rule}</strong>Protects drafts, evidence records, and public trust.</p></div>`).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function authPanel() {
  return `
    <section class="panel auth-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Access control</p><h2>Protect evidence, drafts, jobs, and monetized actions by role.</h2></div>
      </div>
      <div class="auth-stats">
        <div><span>Roles</span><strong>${accessRoles.length}</strong></div>
        <div><span>Permissions</span><strong>${permissionMatrix.length}</strong></div>
        <div><span>Security rules</span><strong>${authSecurityRules.length}</strong></div>
        <div><span>API boundaries</span><strong>${apiSecurityBoundaries.length}</strong></div>
      </div>
      <div class="access-role-grid">
        ${accessRoles.map((item) => `
          <article class="access-role-card">
            <h3>${item.role}</h3>
            <dl>
              <div><dt>Allowed</dt><dd>${item.access}</dd></div>
              <div><dt>Denied</dt><dd>${item.denied}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="permission-matrix-wrap">
        <table class="permission-matrix-table">
          <thead><tr><th>Action</th><th>Allowed roles</th><th>Approval condition</th></tr></thead>
          <tbody>
            ${permissionMatrix.map((item) => `
              <tr>
                <td><strong>${item.action}</strong></td>
                <td>${item.allowed.join(", ")}</td>
                <td>${item.approval}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="auth-bottom-grid">
        <section>
          <h3>Security rules</h3>
          <div class="checklist">
            ${authSecurityRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required before production admin access.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Token boundaries</h3>
          <dl class="facts stacked">
            <div><dt>Human session</dt><dd>Admin and editorial actions with role-based permissions.</dd></div>
            <div><dt>Worker token</dt><dd>Limited job execution with audit logs and no publish rights.</dd></div>
            <div><dt>Public request</dt><dd>Read-only access to published canonical records.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;
}

function cmsPanel() {
  const totalFields = cmsContentTypes.reduce((sum, item) => sum + item.fields.length, 0);
  return `
    <section class="panel cms-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">CMS publishing model</p><h2>Move from local evidence capture to governed public publishing.</h2></div>
      </div>
      <div class="cms-stats">
        <div><span>Content types</span><strong>${cmsContentTypes.length}</strong></div>
        <div><span>Publish states</span><strong>${publishingStates.length}</strong></div>
        <div><span>Required fields</span><strong>${totalFields}</strong></div>
        <div><span>Migration steps</span><strong>${cmsMigrationSteps.length}</strong></div>
      </div>
      <div class="cms-type-grid">
        ${cmsContentTypes.map((item) => `
          <article class="cms-type-card">
            <div>
              <p class="eyebrow">${item.source}</p>
              <h3>${item.type}</h3>
              <p>${item.purpose}</p>
            </div>
            <div class="data-fields">
              ${item.fields.map((field) => `<span>${field}</span>`).join("")}
            </div>
          </article>
        `).join("")}
      </div>
      <div class="publishing-state-grid">
        ${publishingStates.map((item) => `
          <article class="publishing-state-card">
            <h3>${item.state}</h3>
            <dl>
              <div><dt>Meaning</dt><dd>${item.meaning}</dd></div>
              <div><dt>Exit</dt><dd>${item.exit}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="cms-bottom-grid">
        <section>
          <h3>Migration sequence</h3>
          <div class="outline-list">
            ${cmsMigrationSteps.map((step, index) => `<div><span>${index + 1}</span><p><strong>${step}</strong>Preserve evidence IDs and canonical slugs.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Backend boundary</h3>
          <dl class="facts stacked">
            <div><dt>Structured data</dt><dd>Benchmarks, source snapshots, artifacts, QA, review records.</dd></div>
            <div><dt>CMS data</dt><dd>Page composition, editorial notes, publish state, canonical URLs, previews.</dd></div>
            <div><dt>Generated pages</dt><dd>Join CMS entries with evidence records at build or request time.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;
}

function evidenceGraphPanel() {
  const counts = {
    benchmarkRuns: benchmarkRuns.length,
    evidenceSnapshots: evidenceSnapshots.length,
    artifacts: artifacts.length,
    reviewRecords: reviewRecords.length,
    qualityChecks: qualityChecks.length,
  };
  const coveredTools = readinessRows().filter((row) => row.completeCount > 0).length;
  return `
    <section class="panel evidence-graph-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Evidence graph</p><h2>Connect every public claim to the records that can prove it.</h2></div>
      </div>
      <div class="evidence-graph-stats">
        <div><span>Evidence nodes</span><strong>${evidenceNodeTypes.length}</strong></div>
        <div><span>Claim mappings</span><strong>${evidenceClaimMap.length}</strong></div>
        <div><span>Tools with evidence</span><strong>${coveredTools}/${tools.length}</strong></div>
        <div><span>Total records</span><strong>${Object.values(counts).reduce((sum, value) => sum + value, 0)}</strong></div>
      </div>
      <div class="evidence-node-grid">
        ${evidenceNodeTypes.map((item) => `
          <article class="evidence-node-card">
            <div>
              <p class="eyebrow">${item.record}: ${counts[item.record] ?? 0} saved</p>
              <h3>${item.node}</h3>
            </div>
            <dl>
              <div><dt>Can prove</dt><dd>${item.proves}</dd></div>
              <div><dt>Cannot prove</dt><dd>${item.cannotProve}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="claim-map-wrap">
        <table class="claim-map-table">
          <thead><tr><th>Claim</th><th>Required records</th><th>Publish rule</th></tr></thead>
          <tbody>
            ${evidenceClaimMap.map((item) => `
              <tr>
                <td><strong>${item.claim}</strong></td>
                <td>${item.required.join(", ")}</td>
                <td>${item.publishRule}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="evidence-graph-bottom-grid">
        <section>
          <h3>Citation rules</h3>
          <div class="checklist">
            ${citationRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required before publication.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Record flow</h3>
          <div class="outline-list">
            ${["Source snapshot", "Benchmark run", "Artifact", "Review record", "Quality check", "Published claim"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 3 ? "Creates primary evidence." : "Connects evidence to editorial judgment."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function trustPanel() {
  const readyCount = readinessRows().filter((row) => row.ready).length;
  const disclosureReady = qualityChecks.filter((check) => check.disclosureReady === "Yes").length;
  return `
    <section class="panel trust-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Reader trust system</p><h2>Make independence, evidence, and disclosure visible.</h2></div>
      </div>
      <div class="trust-stats">
        <div><span>Trust principles</span><strong>${trustPrinciples.length}</strong></div>
        <div><span>Disclosure surfaces</span><strong>${disclosureSurfaces.length}</strong></div>
        <div><span>Ready reviews</span><strong>${readyCount}/${tools.length}</strong></div>
        <div><span>Disclosure QA</span><strong>${disclosureReady}</strong></div>
      </div>
      <div class="trust-principle-grid">
        ${trustPrinciples.map((item) => `
          <article class="trust-principle-card">
            <h3>${item.principle}</h3>
            <dl>
              <div><dt>Reader promise</dt><dd>${item.readerPromise}</dd></div>
              <div><dt>Operating rule</dt><dd>${item.operatingRule}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="disclosure-table-wrap">
        <table class="disclosure-table">
          <thead><tr><th>Surface</th><th>Disclosure required</th><th>Placement</th></tr></thead>
          <tbody>
            ${disclosureSurfaces.map((item) => `
              <tr>
                <td><strong>${item.surface}</strong></td>
                <td>${item.disclosure}</td>
                <td>${item.placement}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="trust-bottom-grid">
        <section>
          <h3>Reader-facing badges</h3>
          <div class="trust-badge-list">
            ${readerTrustBadges.map((badge) => `<span>${badge}</span>`).join("")}
          </div>
        </section>
        <section>
          <h3>Trust display order</h3>
          <div class="outline-list">
            ${["Verdict state", "Evidence badges", "Disclosure note", "Freshness date", "Correction status"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 2 ? "Visible near review conclusions." : "Required before monetized or final recommendation surfaces."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function compliancePanel() {
  return `
    <section class="panel compliance-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Policy governance</p><h2>Block risky claims before they become public recommendations.</h2></div>
      </div>
      <div class="compliance-stats">
        <div><span>Domains</span><strong>${complianceDomains.length}</strong></div>
        <div><span>Review triggers</span><strong>${complianceReviewTriggers.length}</strong></div>
        <div><span>Disclaimers</span><strong>${policyDisclaimers.length}</strong></div>
        <div><span>Source rules</span><strong>${sourceWatchRules.length}</strong></div>
      </div>
      <div class="compliance-domain-grid">
        ${complianceDomains.map((item) => `
          <article class="compliance-domain-card">
            <div>
              <p class="eyebrow">${item.domain}</p>
              <h3>${item.risk}</h3>
            </div>
            <dl>
              <div><dt>Required evidence</dt><dd>${item.requiredEvidence}</dd></div>
              <div><dt>Blocks</dt><dd>${item.blocks}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="policy-disclaimer-wrap">
        <table class="policy-disclaimer-table">
          <thead><tr><th>Surface</th><th>Required language</th></tr></thead>
          <tbody>
            ${policyDisclaimers.map((item) => `
              <tr>
                <td><strong>${item.surface}</strong></td>
                <td>${item.text}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="compliance-bottom-grid">
        <section>
          <h3>Human review triggers</h3>
          <div class="checklist">
            ${complianceReviewTriggers.map((trigger) => `<div><span>!</span><p><strong>${trigger}</strong>Requires policy review before publication or distribution.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Policy workflow</h3>
          <div class="outline-list">
            ${["Detect risky claim", "Attach required evidence", "Apply disclaimer", "Run QA", "Approve or block"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 2 ? "Use source watcher and evidence graph records." : "Preserve the decision in review notes."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function designPanel() {
  return `
    <section class="panel design-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Design system</p><h2>Keep cinematic authority separate from evidence-first utility.</h2></div>
      </div>
      <div class="design-stats">
        <div><span>Visual layers</span><strong>${designSystemLayers.length}</strong></div>
        <div><span>Components</span><strong>${componentStandards.length}</strong></div>
        <div><span>Interface rules</span><strong>${interfaceRules.length}</strong></div>
        <div><span>Trust badges</span><strong>${readerTrustBadges.length}</strong></div>
      </div>
      <div class="design-layer-grid">
        ${designSystemLayers.map((item) => `
          <article class="design-layer-card">
            <div>
              <p class="eyebrow">${item.tone}</p>
              <h3>${item.layer}</h3>
            </div>
            <dl>
              <div><dt>Use</dt><dd>${item.use}</dd></div>
              <div><dt>Avoid</dt><dd>${item.avoid}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="component-standard-grid">
        ${componentStandards.map((item) => `
          <article class="component-standard-card">
            <h3>${item.component}</h3>
            <p>${item.requirement}</p>
          </article>
        `).join("")}
      </div>
      <div class="design-bottom-grid">
        <section>
          <h3>Interface rules</h3>
          <div class="checklist">
            ${interfaceRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required for scalable UI consistency.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Reusable badge language</h3>
          <div class="trust-badge-list">
            ${readerTrustBadges.map((badge) => `<span>${badge}</span>`).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function operationsPanel() {
  return `
    <section class="panel operations-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Operating ownership</p><h2>Every gate needs an owner, approver, and escalation path.</h2></div>
      </div>
      <div class="operations-stats">
        <div><span>Roles</span><strong>${operatingRoles.length}</strong></div>
        <div><span>Approval workflows</span><strong>${approvalMatrix.length}</strong></div>
        <div><span>Escalations</span><strong>${escalationPaths.length}</strong></div>
        <div><span>Automation agents</span><strong>${automationAgents.length}</strong></div>
      </div>
      <div class="operating-role-grid">
        ${operatingRoles.map((item) => `
          <article class="operating-role-card">
            <h3>${item.role}</h3>
            <dl>
              <div><dt>Owns</dt><dd>${item.owns}</dd></div>
              <div><dt>Approves</dt><dd>${item.approves}</dd></div>
              <div><dt>Escalates</dt><dd>${item.escalates}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="approval-matrix-wrap">
        <table class="approval-matrix-table">
          <thead><tr><th>Workflow</th><th>Required approval</th><th>Blocked by</th></tr></thead>
          <tbody>
            ${approvalMatrix.map((item) => `
              <tr>
                <td><strong>${item.workflow}</strong></td>
                <td>${item.required.join(", ")}</td>
                <td>${item.blockedBy}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="operations-bottom-grid">
        <section>
          <h3>Escalation paths</h3>
          <div class="checklist">
            ${escalationPaths.map((path) => `<div><span>!</span><p><strong>${path}</strong>Do not bypass ownership gates.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Operating cadence</h3>
          <div class="outline-list">
            ${["Daily source watch", "Weekly benchmark batch", "Weekly QA review", "Monthly report review", "Monthly conflict audit"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 2 ? "Feeds evidence and refresh queues." : "Protects publishing and monetization quality."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function stackPanel() {
  return `
    <section class="panel stack-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Production stack</p><h2>Build the authority platform on boring, auditable infrastructure.</h2></div>
      </div>
      <div class="stack-stats">
        <div><span>Stack layers</span><strong>${productionStackLayers.length}</strong></div>
        <div><span>Phases</span><strong>${implementationPhases.length}</strong></div>
        <div><span>Decision rules</span><strong>${stackDecisionRules.length}</strong></div>
        <div><span>Data collections</span><strong>${dataCollections.length}</strong></div>
      </div>
      <div class="stack-layer-grid">
        ${productionStackLayers.map((item) => `
          <article class="stack-layer-card">
            <div>
              <p class="eyebrow">${item.recommended}</p>
              <h3>${item.layer}</h3>
              <p>${item.responsibility}</p>
            </div>
            <div class="stack-boundary"><strong>Boundary</strong><p>${item.boundary}</p></div>
          </article>
        `).join("")}
      </div>
      <div class="implementation-phase-grid">
        ${implementationPhases.map((item, index) => `
          <article class="implementation-phase-card">
            <div class="phase-index">${index + 1}</div>
            <div>
              <h3>${item.phase}</h3>
              <p>${item.goal}</p>
              <span>${item.exit}</span>
            </div>
          </article>
        `).join("")}
      </div>
      <div class="stack-bottom-grid">
        <section>
          <h3>Stack decision rules</h3>
          <div class="checklist">
            ${stackDecisionRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required before production migration.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Implementation boundary</h3>
          <dl class="facts stacked">
            <div><dt>Public app</dt><dd>Fast canonical pages generated from CMS plus evidence state.</dd></div>
            <div><dt>Admin app</dt><dd>Structured capture, review queues, approvals, and audit trails.</dd></div>
            <div><dt>Workers</dt><dd>Source watch, benchmark runs, refresh tasks, and report packaging.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;
}

function releasePanel() {
  return `
    <section class="panel release-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Release management</p><h2>Deploy public authority surfaces without breaking evidence trust.</h2></div>
      </div>
      <div class="release-stats">
        <div><span>Environments</span><strong>${releaseEnvironments.length}</strong></div>
        <div><span>Release gates</span><strong>${releaseGates.length}</strong></div>
        <div><span>Rollback triggers</span><strong>${rollbackTriggers.length}</strong></div>
        <div><span>Deploy rules</span><strong>${deploymentRules.length}</strong></div>
      </div>
      <div class="release-environment-grid">
        ${releaseEnvironments.map((item) => `
          <article class="release-environment-card">
            <div>
              <p class="eyebrow">${item.environment}</p>
              <h3>${item.purpose}</h3>
            </div>
            <div class="release-gate"><strong>Release gate</strong><p>${item.gate}</p></div>
          </article>
        `).join("")}
      </div>
      <div class="release-bottom-grid">
        <section>
          <h3>Release gates</h3>
          <div class="checklist">
            ${releaseGates.map((gate) => `<div class="done"><span>✓</span><p><strong>${gate}</strong>Required before promoting a release.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Rollback triggers</h3>
          <div class="checklist">
            ${rollbackTriggers.map((trigger) => `<div><span>!</span><p><strong>${trigger}</strong>Rollback or pause release until fixed.</p></div>`).join("")}
          </div>
        </section>
      </div>
      <div class="deployment-rule-wrap">
        <table class="deployment-rule-table">
          <thead><tr><th>Deployment rule</th><th>Reason</th></tr></thead>
          <tbody>
            ${deploymentRules.map((rule) => `
              <tr>
                <td><strong>${rule}</strong></td>
                <td>Protects public trust, evidence integrity, and release reversibility.</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function recoveryPanel() {
  return `
    <section class="panel recovery-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Backup and recovery</p><h2>Protect the evidence record before scaling production releases.</h2></div>
      </div>
      <div class="recovery-stats">
        <div><span>Backup scopes</span><strong>${backupScopes.length}</strong></div>
        <div><span>Recovery plans</span><strong>${recoveryObjectives.length}</strong></div>
        <div><span>Restore rules</span><strong>${restoreDrillRules.length}</strong></div>
        <div><span>Loss policies</span><strong>${dataLossPolicies.length}</strong></div>
      </div>
      <div class="backup-scope-grid">
        ${backupScopes.map((item) => `
          <article class="backup-scope-card">
            <div>
              <p class="eyebrow">${item.cadence}</p>
              <h3>${item.scope}</h3>
              <p>${item.includes}</p>
            </div>
            <div class="recovery-priority"><strong>Restore priority</strong><span>${item.restorePriority}</span></div>
          </article>
        `).join("")}
      </div>
      <div class="recovery-table-wrap">
        <table class="recovery-table">
          <thead><tr><th>Incident</th><th>RTO</th><th>RPO</th><th>Action</th></tr></thead>
          <tbody>
            ${recoveryObjectives.map((item) => `
              <tr>
                <td><strong>${item.incident}</strong></td>
                <td>${item.rto}</td>
                <td>${item.rpo}</td>
                <td>${item.action}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="recovery-bottom-grid">
        <section>
          <h3>Restore drill rules</h3>
          <div class="checklist">
            ${restoreDrillRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required before production hardening.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Data loss policies</h3>
          <div class="checklist">
            ${dataLossPolicies.map((rule) => `<div><span>!</span><p><strong>${rule}</strong>Protects public claims after recovery.</p></div>`).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function automationPanel() {
  return `
    <section class="panel automation-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Automation control</p><h2>Autonomy with approvals, gates, and stop conditions.</h2></div>
      </div>
      <div class="automation-grid">
        ${automationAgents.map((agent) => `
          <article class="automation-agent-card">
            <div><p class="eyebrow">${agent.cadence}</p><h3>${agent.agent}</h3></div>
            <dl>
              <div><dt>Input</dt><dd>${agent.input}</dd></div>
              <div><dt>Output</dt><dd>${agent.output}</dd></div>
              <div><dt>Approval</dt><dd>${agent.approval}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="automation-bottom-grid">
        <section>
          <h3>Kill switches</h3>
          <div class="checklist">
            ${automationKillSwitches.map((item) => `<div><span>!</span><p><strong>${item}</strong>Pause autonomous publish flow until reviewed.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Approval sequence</h3>
          <div class="outline-list">
            ${["Evidence captured", "Brief approved", "Draft generated", "Quality gateway passed", "Disclosure checked", "Publish approved"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 3 ? "Automation can assist." : "Human approval required for final recommendations."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function launchPanel() {
  const rows = readinessRows();
  const readyCore = tools.slice(0, 7).filter((tool) => readinessFor(tool).ready).length;
  const publicReady = rows.filter((row) => row.ready).length;
  return `
    <section class="panel launch-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Launch packaging</p><h2>Ship authority in controlled releases.</h2></div>
      </div>
      <div class="launch-stats">
        <div><span>Core reviews ready</span><strong>${readyCore}/7</strong></div>
        <div><span>Total ready reviews</span><strong>${publicReady}/${tools.length}</strong></div>
        <div><span>Launch packages</span><strong>${launchPackages.length}</strong></div>
        <div><span>Hard blockers</span><strong>${launchBlockers.length}</strong></div>
      </div>
      <div class="launch-package-grid">
        ${launchPackages.map((item) => `
          <article class="launch-package-card">
            <div><p class="eyebrow">${item.status}</p><h3>${item.package}</h3></div>
            <div class="launch-includes">${item.includes.map((entry) => `<span>${entry}</span>`).join("")}</div>
            <div class="launch-gate"><strong>Release gate</strong><p>${item.gate}</p></div>
          </article>
        `).join("")}
      </div>
      <div class="mvp-track-grid">
        ${mvpExecutionTracks.map((item) => `
          <article class="mvp-track-card">
            <div><p class="eyebrow">${item.owner}</p><h3>${item.track}</h3></div>
            <dl>
              <div><dt>Now</dt><dd>${item.now}</dd></div>
              <div><dt>Done</dt><dd>${item.done}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="evidence-batch-table-wrap">
        <table class="evidence-batch-table">
          <thead><tr><th>Tool</th><th>Priority</th><th>Why first</th><th>First evidence task</th></tr></thead>
          <tbody>
            ${firstEvidenceBatch.map((item) => `
              <tr>
                <td><strong>${item.tool}</strong></td>
                <td><span>${item.priority}</span></td>
                <td>${item.reason}</td>
                <td>${item.firstTask}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="launch-bottom-grid">
        <section>
          <h3>Launch blockers</h3>
          <div class="checklist">
            ${launchBlockers.map((blocker) => `<div><span>!</span><p><strong>${blocker}</strong>Resolve before public launch or label affected surfaces provisional.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Launch decision rules</h3>
          <div class="outline-list">
            ${launchDecisionRules.map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>Used to decide alpha, beta, authority, and revenue launch timing.</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function sprintPanel() {
  const queued = evidenceTaskQueue.filter((item) => item.status === "Queued").length;
  return `
    <section class="panel sprint-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Evidence sprint</p><h2>Convert the first seven reviews into proof-backed launch assets.</h2></div>
      </div>
      <div class="sprint-stats">
        <div><span>Sprint days</span><strong>${evidenceSprintDays.length}</strong></div>
        <div><span>Queued tasks</span><strong>${queued}</strong></div>
        <div><span>Core tools</span><strong>${firstEvidenceBatch.length}</strong></div>
        <div><span>Acceptance rules</span><strong>${sprintAcceptanceCriteria.length}</strong></div>
      </div>
      <div class="sprint-day-grid">
        ${evidenceSprintDays.map((item) => `
          <article class="sprint-day-card">
            <div><p class="eyebrow">${item.day}</p><h3>${item.focus}</h3></div>
            <dl>
              <div><dt>Output</dt><dd>${item.output}</dd></div>
              <div><dt>Acceptance</dt><dd>${item.acceptance}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="sprint-task-table-wrap">
        <table class="sprint-task-table">
          <thead><tr><th>Tool</th><th>Task</th><th>Record</th><th>Owner</th><th>Status</th></tr></thead>
          <tbody>
            ${evidenceTaskQueue.map((item) => `
              <tr>
                <td><strong>${item.tool}</strong></td>
                <td>${item.task}</td>
                <td>${item.record}</td>
                <td>${item.owner}</td>
                <td><span>${item.status}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="sprint-bottom-grid">
        <section>
          <h3>Acceptance criteria</h3>
          <div class="checklist">
            ${sprintAcceptanceCriteria.map((item) => `<div class="done"><span>✓</span><p><strong>${item}</strong>Required before a review leaves the sprint.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Admin capture targets</h3>
          <div class="outline-list">
            ${["Source snapshot", "Benchmark run", "Artifact", "Review record", "Quality check"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 3 ? "Creates the proof base." : "Turns proof into publishable review state."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function productionPanel() {
  const rows = readinessRows();
  const deployReady = rows.filter((row) => row.hasBenchmark && row.hasArtifact && row.hasFreshSnapshot).length;
  const blocked = rows.filter((row) => !row.ready).slice(0, 8);
  return `
    <section class="panel production-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Production readiness</p><h2>Security and handoff gates before serious recommendations.</h2></div>
      </div>
      <div class="production-stats">
        <div><span>Deploy evidence candidates</span><strong>${deployReady}</strong></div>
        <div><span>Production checks</span><strong>${productionChecks.length}</strong></div>
        <div><span>Risk bands</span><strong>${productionRiskBands.length}</strong></div>
        <div><span>Blocked reviews</span><strong>${blocked.length}</strong></div>
      </div>
      <div class="production-check-grid">
        ${productionChecks.map((check) => `
          <article class="production-check-card">
            <div><p class="eyebrow">Minimum gate</p><h3>${check.area}</h3></div>
            <p>${check.minimum}</p>
            <dl>
              <div><dt>Evidence</dt><dd>${check.evidence}</dd></div>
              <div><dt>Blocker</dt><dd>${check.blocker}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="production-bottom-grid">
        <section>
          <h3>Risk bands</h3>
          <div class="failure-list">
            ${productionRiskBands.map((item) => `
              <div>
                <span>${item.band}</span>
                <p><strong>${item.band}</strong>${item.meaning}</p>
              </div>
            `).join("")}
          </div>
        </section>
        <section>
          <h3>Blocked production candidates</h3>
          <div class="run-list">
            ${blocked.map((row) => `
              <div class="run-row">
                <div><strong>${row.tool.name}</strong><p>${row.nextAction}</p></div>
                <div class="run-score">${row.completeCount}/5</div>
              </div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function distributionPanel() {
  return `
    <section class="panel distribution-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Distribution system</p><h2>Turn evidence into media without weakening claims.</h2></div>
      </div>
      <div class="distribution-stats">
        <div><span>Channels</span><strong>${distributionChannels.length}</strong></div>
        <div><span>Asset rules</span><strong>${mediaAssetRules.length}</strong></div>
        <div><span>Asset queue</span><strong>${assetProductionQueue.length}</strong></div>
        <div><span>SEO templates</span><strong>${seoTemplates.length}</strong></div>
      </div>
      <div class="distribution-grid">
        ${distributionChannels.map((item) => `
          <article class="distribution-card">
            <div><p class="eyebrow">${item.cadence}</p><h3>${item.channel}</h3></div>
            <dl>
              <div><dt>Format</dt><dd>${item.format}</dd></div>
              <div><dt>Evidence</dt><dd>${item.evidence}</dd></div>
              <div><dt>Boundary</dt><dd>${item.boundary}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="asset-production-grid">
        ${assetProductionQueue.map((item) => `
          <article class="asset-production-card">
            <div><p class="eyebrow">${item.layer}</p><h3>${item.asset}</h3></div>
            <dl>
              <div><dt>Use</dt><dd>${item.use}</dd></div>
              <div><dt>Prompt need</dt><dd>${item.promptNeed}</dd></div>
              <div><dt>Proof boundary</dt><dd>${item.proofBoundary}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="visual-standard-grid">
        ${visualPromptStandards.map((item) => `
          <article class="visual-standard-card">
            <h3>${item.standard}</h3>
            <dl>
              <div><dt>Include</dt><dd>${item.include}</dd></div>
              <div><dt>Avoid</dt><dd>${item.avoid}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
      <div class="distribution-bottom-grid">
        <section>
          <h3>Media asset rules</h3>
          <div class="checklist">
            ${mediaAssetRules.map((rule) => `<div class="done"><span>✓</span><p><strong>${rule}</strong>Required for public distribution.</p></div>`).join("")}
          </div>
        </section>
        <section>
          <h3>Launch asset queue</h3>
          <div class="outline-list">
            ${["Homepage OG card", "Core review lead images", "Best-of guide social cards", "Benchmark result cards", "Platform Index cover", "Weekly digest image"].map((item, index) => `
              <div><span>${index + 1}</span><p><strong>${item}</strong>${index < 3 ? "Use authority-layer visual system." : "Use evidence-layer data presentation."}</p></div>
            `).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

function wizardPanel() {
  const question = questions[wizardStep];
  if (!question) {
    const recommended = chooseRecommendation();
    return `
      <section class="panel wizard-panel">
        <div class="panel-heading"><div><p class="eyebrow">Recommendation</p><h2>${recommended.name} is the current best fit</h2></div></div>
        ${toolCard(recommended)}
        <button class="reset-wizard">Start over</button>
        ${roiCalculator()}
      </section>
    `;
  }
  return `
    <section class="panel wizard-panel">
      <div class="panel-heading"><div><p class="eyebrow">Decision tool</p><h2>Vibe coding platform matcher</h2></div></div>
      <div class="wizard-question">
        <span>Question ${wizardStep + 1} of ${questions.length}</span>
        <h3>${question[0]}</h3>
        <div class="wizard-options">
          ${question[1].map(([label, value]) => `<button class="wizard-option" data-value="${value}">${label}</button>`).join("")}
        </div>
      </div>
      ${roiCalculator()}
    </section>
  `;
}

function chooseRecommendation() {
  const values = Object.values(wizardAnswers);
  if (values.includes("frontend") || values.includes("ui")) return tools.find((tool) => tool.name === "v0") || tools[0];
  if (values.includes("internal")) return tools.find((tool) => tool.name === "Base44") || tools[0];
  if (values.includes("mobile")) return tools.find((tool) => tool.name === "FlutterFlow AI") || tools[0];
  if (values.includes("ide") || values.includes("codebase") || values.includes("control")) return tools.find((tool) => tool.name === "Cursor") || tools[0];
  if (values.includes("production")) return tools.find((tool) => tool.name === "Replit Agent") || tools[0];
  if (values.includes("speed")) return tools.find((tool) => tool.name === "Bolt.new") || tools[0];
  return tools.find((tool) => tool.name === "Lovable") || tools[0];
}

function roiCalculator() {
  return `
    <div class="roi-static">
      <div><p class="eyebrow">Authority metric</p><h3>What every autonomous post must prove</h3></div>
      <div class="roi-grid">
        <div><strong>1 build</strong><span>Each review needs at least one reproducible app-build test.</span></div>
        <div><strong>7 days</strong><span>Pricing, feature, and docs claims expire after one week until rechecked.</span></div>
        <div><strong>0 fluff</strong><span>Posts fail if they summarize marketing pages without original evidence.</span></div>
      </div>
    </div>
  `;
}

function toolsPanel() {
  return `
    <section class="panel">
      <div class="panel-heading"><div><p class="eyebrow">Authority assets</p><h2>Interactive tools the category needs</h2></div></div>
      <div class="category-summary">
        ${categories().filter((category) => category !== "All").map((category) => {
          const count = tools.filter((tool) => tool.category === category).length;
          return `<a href="#reviews" data-jump-category="${category}"><strong>${count}</strong><span>${category}</span></a>`;
        }).join("")}
      </div>
      <div class="micro-grid">
        ${[
          ["Vibe Builder Matcher", "Match a reader to Lovable, Bolt, Replit, v0, Cursor, or a structured no-code alternative."],
          ["Prompt Benchmark Library", "Run the same app prompts across all 28 tools and compare outputs."],
          ["Production Readiness Checker", "Score auth, database rules, secrets, export path, deployment, and handoff risk."],
          ["Pricing Change Tracker", "Catch plan changes, feature limits, credits, and hidden scaling costs."],
          ["Build Log Database", "Publish test prompts, screenshots, output links, failures, and verdicts."],
          ["Stack Recommender", "Suggest frontend, backend, database, auth, hosting, and AI IDE handoff paths."],
        ].map(([name, text]) => `<div class="micro-card"><strong>${name}</strong><p>${text}</p></div>`).join("")}
      </div>
    </section>
  `;
}

function autonomyPanel() {
  return `
    <section class="panel roadmap">
      <div class="panel-heading"><div><p class="eyebrow">Autonomous editorial OS</p><h2>Maximum-quality blog posts without manual babysitting</h2></div></div>
      <div class="roadmap-grid">
        <div>
          <h3>Autonomy layers</h3>
          <div class="timeline">${autonomyLayers.map(([name, focus], index) => `
            <div class="timeline-row">
              <div class="timeline-index">${index + 1}</div>
              <div><div class="timeline-title">${name}<span>Required</span></div><p>${focus}</p></div>
            </div>`).join("")}
          </div>
        </div>
        <div>
          <h3>Hard publishing gates</h3>
          <div class="gate-list">${gates.map(([name, text]) => `
            <div class="gate"><span class="check">✓</span><div><strong>${name}</strong><p>${text}</p></div></div>`).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function readinessPanel() {
  const rows = readinessRows();
  const readyCount = rows.filter((row) => row.ready).length;
  const recordCount = rows.filter((row) => row.hasRecord).length;
  const benchmarkCount = rows.filter((row) => row.hasBenchmark).length;
  const snapshotCount = rows.filter((row) => row.hasSnapshot).length;
  const freshSnapshotCount = rows.filter((row) => row.hasFreshSnapshot).length;
  const artifactCount = rows.filter((row) => row.hasArtifact).length;
  const qaCount = rows.filter((row) => row.hasPassingQa).length;
  return `
    <section class="panel readiness-panel">
      <div class="panel-heading">
        <div><p class="eyebrow">Publishing operations</p><h2>Readiness dashboard for all 28 platforms</h2></div>
      </div>
      <div class="readiness-stats">
        <div><span>Ready</span><strong>${readyCount}/${tools.length}</strong></div>
        <div><span>Review records</span><strong>${recordCount}</strong></div>
        <div><span>Benchmarks</span><strong>${benchmarkCount}</strong></div>
        <div><span>Fresh sources</span><strong>${freshSnapshotCount}/${snapshotCount}</strong></div>
        <div><span>Artifacts</span><strong>${artifactCount}</strong></div>
        <div><span>QA passed</span><strong>${qaCount}</strong></div>
      </div>
      <div class="readiness-table-wrap">
        <table class="readiness-table">
          <thead><tr><th>Platform</th><th>Gates</th><th>Missing</th><th>Next action</th><th>Status</th></tr></thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                <td><a href="#review/${row.tool.slug}">${row.tool.name}</a><span>${row.tool.category}</span></td>
                <td>
                  <div class="gate-strip ${row.ready ? "ready" : ""}">
                    <span>${row.hasRecord ? "Review" : "No review"}</span>
                    <span>${row.hasBenchmark ? "Benchmark" : "No benchmark"}</span>
                    <span>${row.hasFreshSnapshot ? "Fresh source" : row.hasSnapshot ? "Stale source" : "No source"}</span>
                    <span>${row.hasArtifact ? "Artifact" : "No artifact"}</span>
                    <span>${row.hasPassingQa ? "QA passed" : "No QA"}</span>
                  </div>
                </td>
                <td>${row.missing.length ? row.missing.join(", ") : "None"}</td>
                <td>${row.nextAction}</td>
                <td><strong class="${row.ready ? "status-ready" : "status-blocked"}">${row.ready ? "Ready" : "Blocked"}</strong></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function adminPanel() {
  return `
    <section class="panel roadmap">
      <div class="panel-heading">
        <div><p class="eyebrow">Local admin prototype</p><h2>Evidence capture and content control</h2></div>
      </div>
      <div class="roadmap-grid">
        <div>
          <h3>Benchmark prompts ready</h3>
          <div class="timeline">${benchmarkPrompts.map((item, index) => `
            <div class="timeline-row">
              <div class="timeline-index">${index + 1}</div>
              <div><div class="timeline-title">${item.name}<span>${item.status}</span></div><p>${item.family}: ${item.checks}</p></div>
            </div>`).join("")}
          </div>
        </div>
        <div>
          <h3>First article briefs</h3>
          <div class="gate-list">${launchArticleBriefs.map((brief) => `
            <div class="gate"><span class="check">•</span><div><strong>${brief.title}</strong><p>${brief.keyword} — ${brief.gate}</p></div></div>`).join("")}
          </div>
        </div>
      </div>
      <div class="capture-form">
        <h3>Article brief capture</h3>
        <form id="article-brief-form">
          <div class="form-grid">
            <label>Title<input name="title" required placeholder="Lovable Review"></label>
            <label>Target keyword<input name="targetKeyword" required placeholder="lovable review"></label>
            <label>Article type<select name="articleType" required><option>review</option><option>comparison</option><option>best_of</option><option>benchmark_report</option><option>pricing_update</option><option>build_log</option><option>guide</option></select></label>
            <label>Publish gate<input name="publishGate" required placeholder="Do not publish without..."></label>
          </div>
          <label>Required evidence<textarea name="requiredEvidence" required placeholder="Benchmark run, screenshots, pricing snapshot, docs citations, deploy notes, security notes."></textarea></label>
          <label>Angle<textarea name="angle" required placeholder="What this article proves better than competing search results."></textarea></label>
          <button class="submit-button local-only" type="submit">Save article brief</button>
          <p class="form-status" id="article-brief-form-status"></p>
        </form>
      </div>
      <div class="capture-form">
        <h3>Saved article queue</h3>
        ${savedBriefQueue()}
      </div>
      <div class="capture-form">
        <h3>Review record editor</h3>
        <form id="review-record-form">
          <div class="form-grid">
            <label>Tool<select name="tool">${tools.map((tool) => `<option>${tool.name}</option>`).join("")}</select></label>
            <label>Status<select name="status" required><option>Draft</option><option>Testing</option><option>Needs evidence</option><option>QA blocked</option><option>Ready to publish</option><option>Published</option><option>Refresh needed</option></select></label>
            <label>Score<input name="score" type="number" min="0" max="100" placeholder="0-100"></label>
            <label>Affiliate URL<input name="affiliateUrl" placeholder="https://..."></label>
          </div>
          <label>Verdict<textarea name="verdict" required placeholder="The current editorial verdict after evidence review."></textarea></label>
          <label>Pros<textarea name="pros" required placeholder="One strength per line."></textarea></label>
          <label>Cons<textarea name="cons" required placeholder="One risk or weakness per line."></textarea></label>
          <label>Publish notes<textarea name="publishNotes" placeholder="What must change before publication, or what was verified."></textarea></label>
          <button class="submit-button local-only" type="submit">Save review record</button>
          <p class="form-status" id="review-record-form-status"></p>
        </form>
      </div>
      <div class="capture-form">
        <h3>Review record queue</h3>
        ${recentReviewRecords()}
      </div>
      <div class="capture-form">
        <h3>Source and pricing snapshot capture</h3>
        <form id="evidence-snapshot-form">
          <div class="form-grid">
            <label>Tool<select name="tool">${tools.map((tool) => `<option>${tool.name}</option>`).join("")}</select></label>
            <label>Source type<select name="sourceType" required><option>Pricing page</option><option>Official docs</option><option>Changelog</option><option>Release notes</option><option>Terms or limits</option><option>Hands-on build note</option></select></label>
            <label>Source URL<input name="sourceUrl" required placeholder="https://..."></label>
            <label>Pricing summary<input name="pricingSummary" required placeholder="Free + paid; key limits..."></label>
          </div>
          <label>Feature summary<textarea name="featureSummary" required placeholder="What the source proves about features, credits, deployment, export, integrations, or constraints."></textarea></label>
          <label>Limitations<textarea name="limitations" placeholder="Unclear limits, missing public details, production caveats, or claims that still need testing."></textarea></label>
          <button class="submit-button local-only" type="submit">Save source snapshot</button>
          <p class="form-status" id="evidence-snapshot-form-status"></p>
        </form>
      </div>
      <div class="capture-form">
        <h3>Recent source snapshots</h3>
        ${recentSnapshots()}
      </div>
      <div class="capture-form">
        <h3>Artifact capture</h3>
        <form id="artifact-form">
          <div class="form-grid">
            <label>Tool<select name="tool">${tools.map((tool) => `<option>${tool.name}</option>`).join("")}</select></label>
            <label>Artifact type<select name="artifactType" required><option>Screenshot</option><option>Generated app URL</option><option>Deployment URL</option><option>Repo URL</option><option>Export file</option><option>Screen recording</option><option>Benchmark notes</option></select></label>
            <label>Title<input name="title" required placeholder="SaaS MVP dashboard result"></label>
            <label>URL or path<input name="url" required placeholder="https://... or /absolute/path"></label>
          </div>
          <label>Notes<textarea name="notes" placeholder="What this artifact proves, what failed, and whether it can be cited in the review."></textarea></label>
          <button class="submit-button local-only" type="submit">Save artifact</button>
          <p class="form-status" id="artifact-form-status"></p>
        </form>
      </div>
      <div class="capture-form">
        <h3>Recent artifacts</h3>
        ${recentArtifacts()}
      </div>
      <div class="capture-form">
        <h3>Final QA capture</h3>
        <form id="quality-check-form">
          <div class="form-grid">
            <label>Tool<select name="tool">${tools.map((tool) => `<option>${tool.name}</option>`).join("")}</select></label>
            <label>Evidence score<input name="evidenceScore" required type="number" min="0" max="100" placeholder="0-100"></label>
            <label>Factuality score<input name="factualityScore" required type="number" min="0" max="100" placeholder="0-100"></label>
            <label>Originality score<input name="originalityScore" required type="number" min="0" max="100" placeholder="0-100"></label>
            <label>SEO score<input name="seoScore" required type="number" min="0" max="100" placeholder="0-100"></label>
            <label>Disclosure ready<select name="disclosureReady" required><option>No</option><option>Yes</option></select></label>
          </div>
          <label>QA notes<textarea name="notes" required placeholder="State what was checked, what failed, contradictions found, and whether claims are supported by evidence."></textarea></label>
          <button class="submit-button local-only" type="submit">Save QA check</button>
          <p class="form-status" id="quality-check-form-status"></p>
        </form>
      </div>
      <div class="capture-form">
        <h3>Recent QA checks</h3>
        ${recentQualityChecks()}
      </div>
      <div class="capture-form">
        <h3>Benchmark run capture</h3>
        <form id="benchmark-run-form">
          <div class="form-grid">
            <label>Tool<select name="tool">${tools.slice(0, 10).map((tool) => `<option>${tool.name}</option>`).join("")}</select></label>
            <label>Benchmark<select name="benchmark">${benchmarkPrompts.map((item) => `<option>${item.name}</option>`).join("")}</select></label>
            <label>Deploy status<select name="deployStatus"><option>Not tested</option><option>Passed</option><option>Failed</option><option>Manual repair needed</option></select></label>
            <label>Final score<input name="finalScore" type="number" min="0" max="100" placeholder="0-100"></label>
          </div>
          <label>Evidence notes<textarea name="evidenceNotes" required placeholder="Record output URL, artifact path, manual fixes, security notes, and verdict."></textarea></label>
          <button class="submit-button local-only" type="submit">Save benchmark run</button>
          <p class="form-status" id="benchmark-form-status"></p>
        </form>
      </div>
      <div class="capture-form">
        <h3>Recent saved runs</h3>
        ${recentRuns()}
      </div>
    </section>
  `;
}

function roadmapPanel() {
  return `
    <section class="panel roadmap">
      <div class="panel-heading"><div><p class="eyebrow">Network strategy</p><h2>Own AI app building first, then expand outward</h2></div></div>
      <div class="roadmap-grid">
        <div>
          <h3>Authority rollout</h3>
          <div class="timeline">${roadmap.map((item) => `
            <div class="timeline-row">
              <div class="timeline-index">${item.site}</div>
              <div><div class="timeline-title">${item.name}<span>${item.status}</span></div><p>${item.focus}</p></div>
            </div>`).join("")}
          </div>
        </div>
        <div>
          <h3>Site 1 launch gates</h3>
          <div class="gate-list">${gates.map(([name, text]) => `
            <div class="gate"><span class="check">✓</span><div><strong>${name}</strong><p>${text}</p></div></div>`).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}


const lovableMicrositePages = {
  overview: {
    eyebrow: "Lovable evidence hub",
    title: "Lovable Review Hub",
    status: "Evidence status: pending hands-on testing",
    summary: "Lovable is positioned as an AI app builder for creating apps and websites through chat. NoCodeReviewed is treating this page as an evidence-first review hub until hands-on testing, pricing verification, and security checks are complete.",
    sections: [
      ["What can be safely said", ["Lovable is positioned as an AI app builder for creating apps and websites through chat.", "Lovable appears best suited for rapid MVPs, prototypes, dashboards, internal tools, and early product validation.", "NoCodeReviewed should not claim Lovable is production-ready or secure until hands-on tests are complete."]],
      ["Current review status", ["contentStatus: needs-evidence", "evidenceStatus: pending-hands-on-testing", "pricingStatus: needs-verification"]],
      ["Recommended next pages", ["Review in Progress", "Pricing Verification", "Security Questions", "Autonomy Testing", "Test Lab", "Prompts", "Templates", "Alternatives", "Final Verdict Pending"]]
    ]
  },
  review: {
    eyebrow: "Review in progress",
    title: "Lovable Review: What We Can Say Before Testing",
    status: "No final score yet",
    summary: "This is not a final Lovable review. It is a controlled evidence draft. NoCodeReviewed has not completed the five planned test builds yet.",
    sections: [
      ["Safe preliminary framing", ["Lovable is worth evaluating for fast app prototyping and prompt-driven web app creation.", "The strongest likely use case is rapid concept-to-interface development.", "Final ratings should wait until NoCodeReviewed tests backend behavior, auth, data protection, deployment, and maintainability."]],
      ["Do not claim yet", ["Do not claim Lovable is the best AI app builder.", "Do not claim Lovable apps are secure by default.", "Do not claim Lovable is production-ready without manual review.", "Do not claim NoCodeReviewed has completed testing until test evidence exists."]]
    ]
  },
  pricing: {
    eyebrow: "Pricing verification",
    title: "Lovable Pricing: Verification Required",
    status: "pricingStatus: needs-verification",
    summary: "Pricing and usage limits can change. This page should only publish manually verified pricing with a last-checked date and screenshot evidence.",
    sections: [
      ["Manual verification checklist", ["Check Lovable's official pricing page.", "Capture pricing screenshots.", "Record free plan limits.", "Record paid plan limits.", "Check usage, credits, seats, project limits, and export/deployment restrictions.", "Update lastChecked after manual verification."]],
      ["Publishing rule", ["Do not invent pricing.", "Do not rely on memory.", "Do not publish plan limits without official verification."]]
    ]
  },
  security: {
    eyebrow: "Security and production readiness",
    title: "Lovable Security Questions",
    status: "Security outcome not yet verified",
    summary: "NoCodeReviewed should evaluate Lovable-generated apps at the app level. A platform can provide useful tooling while generated apps still require security review.",
    sections: [
      ["Security questions", ["How is authentication configured?", "Are database rules locked down?", "Are API keys exposed to the client?", "How are environment variables handled?", "Can admin routes be accessed by normal users?", "Is role-based access control implemented correctly?", "Are payments and webhooks protected?", "Do generated error messages expose sensitive details?", "What data privacy controls exist?", "Can code be exported or reviewed independently?"]],
      ["Production-readiness rule", ["NoCodeReviewed should not call a Lovable app production-ready until it passes auth, database, deployment, privacy, and manual code review checks."]]
    ]
  },
  autonomy: {
    eyebrow: "Autonomy testing",
    title: "How Autonomous Is Lovable?",
    status: "Autonomy rating pending",
    summary: "Lovable should be measured by what it can do from prompts, how well it iterates, where it fails, and where human review is still required.",
    sections: [
      ["Autonomy questions", ["Can it create a working app from a prompt?", "Can it iterate from user feedback?", "Can it create multi-page flows?", "Can it handle backend logic?", "Can it fix its own errors?", "Can it deploy?", "Where does human review remain required?"]],
      ["Important distinction", ["Autonomy does not equal safety.", "A tool can generate a working prototype and still require human security review before production."]]
    ]
  },
  "test-lab": {
    eyebrow: "NoCodeReviewed test lab",
    title: "Lovable Test Lab Plan",
    status: "All tests planned, not completed",
    summary: "This is the authority centerpiece. NoCodeReviewed should run repeatable test builds and document evidence before publishing final claims.",
    sections: [
      ["Test 1: SaaS dashboard", ["Goal: evaluate dashboard creation, auth assumptions, data model handling, and admin views.", "Capture: screenshots, generated flows, errors, data/security configuration, deployment notes."]],
      ["Test 2: Client portal", ["Goal: evaluate role-based access, private data handling, forms, file-like workflows, and user experience.", "Capture: login flow, user/admin separation, database behavior, failure signs."]],
      ["Test 3: Marketplace MVP", ["Goal: evaluate listings, seller/buyer flows, payments or payment placeholders, and backend complexity.", "Capture: routes, permissions, webhook handling assumptions, broken flows."]],
      ["Test 4: Internal CRM", ["Goal: evaluate CRUD reliability, table views, search/filtering, notes, and workflow logic.", "Capture: schema, edit/delete behavior, access controls, error handling."]],
      ["Test 5: AI content tool", ["Goal: evaluate prompt workflows, API key handling, generated content flow, and deployment risk.", "Capture: API key placement, server/client boundaries, moderation/error behavior."]]
    ]
  },
  prompts: {
    eyebrow: "Testing prompts",
    title: "Lovable Starter Prompts for NoCodeReviewed Tests",
    status: "Prompt set ready for testing",
    summary: "These prompts are for testing only. Results may vary, and generated apps require manual review.",
    sections: [
      ["SaaS dashboard prompt", ["Build a SaaS analytics dashboard with login, team workspace, charts, billing placeholder, admin settings, and sample customer data."]],
      ["Client portal prompt", ["Build a secure client portal where clients can log in, view project status, send messages, and update profile information."]],
      ["Marketplace MVP prompt", ["Build a two-sided marketplace MVP with listings, seller profiles, buyer inquiry flow, admin moderation, and payment placeholder."]],
      ["Internal CRM prompt", ["Build an internal CRM for a small service business with contacts, deals, tasks, notes, filters, and activity history."]],
      ["AI content tool prompt", ["Build an AI content generator with prompt templates, saved outputs, project folders, and settings for API configuration."]]
    ]
  },
  templates: {
    eyebrow: "Template notes",
    title: "Lovable Templates and Test Patterns",
    status: "Template performance unverified",
    summary: "This page should collect reusable app patterns after testing. NoCodeReviewed should not claim template quality until each pattern is tested.",
    sections: [
      ["Potential template categories", ["SaaS dashboard", "Client portal", "Marketplace MVP", "Internal CRM", "AI content tool", "Landing page plus app shell"]],
      ["Evidence needed", ["Build screenshots", "Prompt used", "What worked", "What failed", "Security findings", "Production-readiness notes"]]
    ]
  },
  alternatives: {
    eyebrow: "Alternatives",
    title: "Lovable Alternatives",
    status: "Neutral comparison page",
    summary: "This page should compare tool categories without declaring a winner until evidence exists.",
    sections: [
      ["Prompt app builders", ["Bolt.new", "v0 by Vercel", "Replit Agent"]],
      ["Agentic IDEs", ["Cursor", "Windsurf", "Claude Code", "OpenAI Codex"]],
      ["Visual no-code builders", ["Bubble AI", "FlutterFlow AI", "Webflow AI-style workflows"]],
      ["Comparison rule", ["Do not declare a winner without testing evidence. Focus on use case fit, constraints, and verification status."]]
    ]
  },
  "final-verdict": {
    eyebrow: "Verdict pending",
    title: "Lovable Final Verdict Pending Hands-On Testing",
    status: "No final verdict yet",
    summary: "NoCodeReviewed should not publish a final Lovable verdict until the test lab is complete and pricing/security claims are manually verified.",
    sections: [
      ["What can be said now", ["Lovable is a serious candidate for rapid AI-assisted app prototyping.", "Its final rating depends on test outcomes across security, autonomy, deployment, backend behavior, and maintainability."]],
      ["What must happen first", ["Complete five test builds.", "Verify pricing manually.", "Review security documentation.", "Capture screenshots and evidence.", "Run production-readiness checks.", "Pass Content Quality Gate before publication."]]
    ]
  }
};

function lovableMicrositeNav(activePage) {
  const pages = [
    ["overview", "Hub", "#tool/lovable"],
    ["review", "Review", "#tool/lovable/review"],
    ["pricing", "Pricing", "#tool/lovable/pricing"],
    ["security", "Security", "#tool/lovable/security"],
    ["autonomy", "Autonomy", "#tool/lovable/autonomy"],
    ["test-lab", "Test Lab", "#tool/lovable/test-lab"],
    ["prompts", "Prompts", "#tool/lovable/prompts"],
    ["templates", "Templates", "#tool/lovable/templates"],
    ["alternatives", "Alternatives", "#tool/lovable/alternatives"],
    ["final-verdict", "Final Verdict", "#tool/lovable/final-verdict"]
  ];

  return `
    <nav class="lovable-micro-nav">
      ${pages.map(([slug, label, href]) => `
        <a class="${slug === activePage ? "active" : ""}" href="${href}">${label}</a>
      `).join("")}
    </nav>
  `;
}

function lovableMicrositePanel(pageSlug = "overview") {
  const page = lovableMicrositePages[pageSlug] || lovableMicrositePages.overview;
  const activePage = lovableMicrositePages[pageSlug] ? pageSlug : "overview";

  return `
    <section class="lovable-microsite">
      <div class="lovable-hero">
        <div>
          <p class="eyebrow">${page.eyebrow}</p>
          <h1>${page.title}</h1>
          <p class="lede">${page.summary}</p>
          <div class="status-row">
            <span class="status-pill warning">${page.status}</span>
            <span class="status-pill">No fake scores</span>
            <span class="status-pill">Evidence-first</span>
          </div>
        </div>
        <div class="lovable-score-card">
          <strong>Current NoCodeReviewed Position</strong>
          <p>Lovable is approved for evidence collection and planned testing, not final verdict publication.</p>
          <a href="#tool/lovable/test-lab">View Test Lab Plan →</a>
        </div>
      </div>

      ${lovableMicrositeNav(activePage)}

      <div class="lovable-grid">
        ${page.sections.map(([heading, items]) => `
          <article class="lovable-card">
            <h2>${heading}</h2>
            <ul>
              ${items.map(item => `<li>${item}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="lovable-footer-cta">
        <h2>Evidence gate</h2>
        <p>Before this becomes a final review, NoCodeReviewed needs manual pricing verification, screenshots, repeatable test builds, and a production-readiness audit.</p>
        <div class="status-row">
          <a class="button" href="#review/lovable">Open existing Lovable review</a>
          <a class="button secondary" href="#tool/lovable/final-verdict">View pending verdict</a>
        </div>
      </div>
    </section>
  `;
}


const boltNewMicrositePages = {
  overview: {
    eyebrow: "Bolt.new evidence hub",
    title: "Bolt.new Review Hub",
    status: "Evidence status: pending hands-on testing",
    summary: "Bolt.new is positioned as a browser-based AI app builder powered by WebContainers. NoCodeReviewed is treating this as an evidence-first review hub until pricing, security, autonomy, and hands-on build tests are verified.",
    sections: [
      ["What can be safely said", ["Bolt.new appears strongest for fast browser-based prototyping, frontend-heavy apps, and quick iteration from prompts.", "Its WebContainer-based workflow is a major differentiator because development can happen directly in the browser.", "NoCodeReviewed should not claim Bolt.new is production-ready until generated apps are tested for auth, data handling, deployment quality, and maintainability."]],
      ["Current review status", ["contentStatus: needs-evidence", "evidenceStatus: pending-hands-on-testing", "pricingStatus: needs-verification"]],
      ["Recommended next pages", ["Review in Progress", "Pricing Verification", "Security Questions", "Autonomy Testing", "Test Lab", "Prompts", "Templates", "Alternatives", "Final Verdict Pending"]]
    ]
  },
  review: {
    eyebrow: "Review in progress",
    title: "Bolt.new Review: What We Can Say Before Testing",
    status: "No final score yet",
    summary: "This is not a final Bolt.new review. It is a controlled evidence draft until NoCodeReviewed completes repeatable hands-on tests.",
    sections: [
      ["Safe preliminary framing", ["Bolt.new is a serious candidate for rapid AI-assisted web app prototyping.", "The likely strength is fast iteration inside a browser development environment.", "The key risks to validate are generated-code quality, backend assumptions, package reliability, deployment handoff, and security defaults."]],
      ["Do not claim yet", ["Do not claim Bolt.new is the best AI app builder.", "Do not claim Bolt.new apps are secure by default.", "Do not claim Bolt.new is production-ready without manual review.", "Do not publish user counts, funding numbers, or performance claims without sources."]]
    ]
  },
  pricing: {
    eyebrow: "Pricing verification",
    title: "Bolt.new Pricing: Verification Required",
    status: "pricingStatus: needs-verification",
    summary: "Bolt.new pricing, credits, usage limits, and plan features can change. This page should only publish verified pricing with a last-checked date and evidence.",
    sections: [
      ["Manual verification checklist", ["Check Bolt.new's official pricing page.", "Capture screenshots of each plan.", "Record free plan limits.", "Record paid plan limits.", "Verify token/credit limits, project limits, deployment limits, and collaboration features.", "Add a lastChecked field after manual verification."]],
      ["Publishing rule", ["Do not invent pricing.", "Do not rely on memory.", "Do not publish plan limits without official verification."]]
    ]
  },
  security: {
    eyebrow: "Security and production readiness",
    title: "Bolt.new Security Questions",
    status: "Security outcome not yet verified",
    summary: "Generated apps need app-level review. Bolt.new may accelerate development, but production readiness depends on the actual generated code, dependencies, auth configuration, and deployment setup.",
    sections: [
      ["Security questions", ["Are secrets or API keys exposed in client code?", "How are environment variables handled?", "Does the generated app include authentication?", "Are database rules and API routes protected?", "Are dependencies outdated or vulnerable?", "Can generated admin routes be accessed by normal users?", "How are payments and webhooks protected?", "Does error handling expose sensitive details?", "Can the generated code be exported and audited?", "What deployment safeguards exist?"]],
      ["Production-readiness rule", ["NoCodeReviewed should not call a Bolt.new app production-ready until it passes code review, auth review, dependency review, deployment review, and privacy checks."]]
    ]
  },
  autonomy: {
    eyebrow: "Autonomy testing",
    title: "How Autonomous Is Bolt.new?",
    status: "Autonomy rating pending",
    summary: "Bolt.new should be evaluated by how far it can get from prompt to working app, how well it fixes errors, and where human intervention is still required.",
    sections: [
      ["Autonomy questions", ["Can it create a working app from a single prompt?", "Can it iterate correctly after user feedback?", "Can it resolve dependency and runtime errors?", "Can it create multi-page app flows?", "Can it handle backend-like behavior or integrations?", "Can it prepare a deployable project?", "Where does manual coding remain necessary?"]],
      ["Important distinction", ["Autonomy does not equal correctness.", "A tool can produce a running prototype while still requiring manual architecture, security, and production review."]]
    ]
  },
  "test-lab": {
    eyebrow: "NoCodeReviewed test lab",
    title: "Bolt.new Test Lab Plan",
    status: "All tests planned, not completed",
    summary: "This is the authority centerpiece for Bolt.new. NoCodeReviewed should run repeatable build tests and document screenshots, prompt logs, failures, generated files, and final app behavior.",
    sections: [
      ["Test 1: SaaS dashboard", ["Goal: evaluate frontend generation, routing, charts, state management, and deployment handoff.", "Capture: prompt, screenshots, generated file structure, runtime errors, dependency issues, deployment notes."]],
      ["Test 2: Client portal", ["Goal: evaluate login assumptions, private data flows, user/admin separation, and form handling.", "Capture: auth handling, route protection, data model assumptions, failure signs."]],
      ["Test 3: Marketplace MVP", ["Goal: evaluate listing flows, seller/buyer views, moderation screens, and payment placeholders.", "Capture: app routes, component structure, API assumptions, broken flows."]],
      ["Test 4: Internal CRM", ["Goal: evaluate CRUD quality, filters, tables, notes, and local/state persistence.", "Capture: data model, edit/delete behavior, search behavior, maintainability."]],
      ["Test 5: AI content tool", ["Goal: evaluate API configuration, prompt workflow, saved outputs, and client/server separation.", "Capture: API key placement, generated code boundaries, error handling, deployability."]]
    ]
  },
  prompts: {
    eyebrow: "Testing prompts",
    title: "Bolt.new Starter Prompts for NoCodeReviewed Tests",
    status: "Prompt set ready for testing",
    summary: "These prompts are for controlled testing only. Results may vary, and every generated app needs manual review.",
    sections: [
      ["SaaS dashboard prompt", ["Build a SaaS analytics dashboard with login placeholder, team workspace, charts, customer table, billing placeholder, and settings page."]],
      ["Client portal prompt", ["Build a secure-looking client portal with project status, messages, profile settings, admin dashboard, and user-facing views."]],
      ["Marketplace MVP prompt", ["Build a two-sided marketplace MVP with listings, seller profiles, buyer inquiry flow, saved listings, and admin moderation."]],
      ["Internal CRM prompt", ["Build an internal CRM for a small service business with contacts, deals, tasks, notes, filters, and activity timeline."]],
      ["AI content tool prompt", ["Build an AI content generator interface with prompt templates, saved outputs, project folders, and API settings screen."]]
    ]
  },
  templates: {
    eyebrow: "Template notes",
    title: "Bolt.new Templates and Test Patterns",
    status: "Template performance unverified",
    summary: "This page should collect reusable Bolt.new patterns only after testing. NoCodeReviewed should avoid template-quality claims until each pattern is tested.",
    sections: [
      ["Potential template categories", ["Frontend SaaS dashboard", "Client portal", "Marketplace MVP", "Internal CRM", "AI content interface", "Landing page plus app shell"]],
      ["Evidence needed", ["Prompt used", "Generated screenshots", "Generated file structure", "What worked", "What failed", "Security findings", "Production-readiness notes"]]
    ]
  },
  alternatives: {
    eyebrow: "Alternatives",
    title: "Bolt.new Alternatives",
    status: "Neutral comparison page",
    summary: "This page compares tool categories without declaring a winner until testing evidence exists.",
    sections: [
      ["Prompt app builders", ["Lovable", "v0 by Vercel", "Replit Agent"]],
      ["Agentic coding tools", ["Cursor", "Windsurf", "Claude Code", "OpenAI Codex"]],
      ["Visual builders", ["Bubble AI", "FlutterFlow AI", "Webflow-related AI workflows"]],
      ["Comparison rule", ["Do not declare a winner without test evidence. Compare by use case, constraints, exportability, security, autonomy, and production-readiness."]]
    ]
  },
  "final-verdict": {
    eyebrow: "Verdict pending",
    title: "Bolt.new Final Verdict Pending Hands-On Testing",
    status: "No final verdict yet",
    summary: "NoCodeReviewed should not publish a final Bolt.new verdict until test builds, pricing verification, and security checks are complete.",
    sections: [
      ["What can be said now", ["Bolt.new is a serious candidate for fast browser-based AI app prototyping.", "Its final rating depends on evidence from security review, autonomy tests, generated-code review, deployment checks, and maintainability analysis."]],
      ["What must happen first", ["Complete five test builds.", "Verify pricing manually.", "Capture screenshots and prompt logs.", "Review generated code and dependencies.", "Run production-readiness checks.", "Pass Content Quality Gate before publication."]]
    ]
  }
};

function boltNewMicrositeNav(activePage) {
  const pages = [
    ["overview", "Hub", "#tool/bolt-new"],
    ["review", "Review", "#tool/bolt-new/review"],
    ["pricing", "Pricing", "#tool/bolt-new/pricing"],
    ["security", "Security", "#tool/bolt-new/security"],
    ["autonomy", "Autonomy", "#tool/bolt-new/autonomy"],
    ["test-lab", "Test Lab", "#tool/bolt-new/test-lab"],
    ["prompts", "Prompts", "#tool/bolt-new/prompts"],
    ["templates", "Templates", "#tool/bolt-new/templates"],
    ["alternatives", "Alternatives", "#tool/bolt-new/alternatives"],
    ["final-verdict", "Final Verdict", "#tool/bolt-new/final-verdict"]
  ];

  return `
    <nav class="lovable-micro-nav">
      ${pages.map(([slug, label, href]) => `
        <a class="${slug === activePage ? "active" : ""}" href="${href}">${label}</a>
      `).join("")}
    </nav>
  `;
}

function boltNewMicrositePanel(pageSlug = "overview") {
  const page = boltNewMicrositePages[pageSlug] || boltNewMicrositePages.overview;
  const activePage = boltNewMicrositePages[pageSlug] ? pageSlug : "overview";

  return `
    <section class="lovable-microsite">
      <div class="lovable-hero">
        <div>
          <p class="eyebrow">${page.eyebrow}</p>
          <h1>${page.title}</h1>
          <p class="lede">${page.summary}</p>
          <div class="status-row">
            <span class="status-pill warning">${page.status}</span>
            <span class="status-pill">No fake scores</span>
            <span class="status-pill">Evidence-first</span>
          </div>
        </div>
        <div class="lovable-score-card">
          <strong>Current NoCodeReviewed Position</strong>
          <p>Bolt.new is approved for evidence collection and planned testing, not final verdict publication.</p>
          <a href="#tool/bolt-new/test-lab">View Test Lab Plan →</a>
        </div>
      </div>

      ${boltNewMicrositeNav(activePage)}

      <div class="lovable-grid">
        ${page.sections.map(([heading, items]) => `
          <article class="lovable-card">
            <h2>${heading}</h2>
            <ul>
              ${items.map(item => `<li>${item}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="lovable-footer-cta">
        <h2>Evidence gate</h2>
        <p>Before this becomes a final review, NoCodeReviewed needs manual pricing verification, screenshots, repeatable test builds, generated-code review, and a production-readiness audit.</p>
        <div class="status-row">
          <a class="button" href="#review/bolt-new">Open existing Bolt.new review</a>
          <a class="button secondary" href="#tool/bolt-new/final-verdict">View pending verdict</a>
        </div>
      </div>
    </section>
  `;
}


const replitAgentMicrositePages = {
  overview: {
    eyebrow: "Replit Agent evidence hub",
    title: "Replit Agent Review Hub",
    status: "Evidence status: pending hands-on testing",
    summary: "Replit Agent is positioned as an agentic coding environment inside Replit's cloud development workspace. NoCodeReviewed is treating this as an evidence-first review hub until deployment, autonomy, pricing, security, and handoff tests are complete.",
    sections: [
      ["What can be safely said", ["Replit Agent appears strongest for builders who want AI assistance inside a real cloud development environment.", "Its key differentiator is the combination of agent workflow, code workspace, hosting, and project handoff potential.", "NoCodeReviewed should not claim Replit Agent is production-ready until generated apps are tested for security, deployment reliability, maintainability, and ownership clarity."]],
      ["Current review status", ["contentStatus: needs-evidence", "evidenceStatus: pending-hands-on-testing", "pricingStatus: needs-verification"]],
      ["Recommended next pages", ["Review in Progress", "Pricing Verification", "Security Questions", "Autonomy Testing", "Test Lab", "Prompts", "Templates", "Alternatives", "Final Verdict Pending"]]
    ]
  },
  review: {
    eyebrow: "Review in progress",
    title: "Replit Agent Review: What We Can Say Before Testing",
    status: "No final score yet",
    summary: "This is not a final Replit Agent review. It is a controlled evidence draft until NoCodeReviewed completes repeatable hands-on tests.",
    sections: [
      ["Safe preliminary framing", ["Replit Agent is a serious candidate for AI-assisted app building when the user wants a real code workspace instead of only a visual prompt builder.", "The likely strength is moving from idea to runnable cloud project with less local setup.", "The key risks to validate are reliability, generated-code quality, debugging behavior, deployment handoff, auth/data assumptions, and total cost."]],
      ["Do not claim yet", ["Do not claim Replit Agent is the best AI coding agent.", "Do not claim Replit Agent apps are secure by default.", "Do not claim Replit Agent is production-ready without manual review.", "Do not publish pricing, performance, or scale claims without verification."]]
    ]
  },
  pricing: {
    eyebrow: "Pricing verification",
    title: "Replit Agent Pricing: Verification Required",
    status: "pricingStatus: needs-verification",
    summary: "Replit pricing, usage limits, AI credits, hosting costs, and plan features can change. This page should only publish verified pricing with a last-checked date and source evidence.",
    sections: [
      ["Manual verification checklist", ["Check Replit's official pricing page.", "Capture screenshots of each plan.", "Record free plan limits if available.", "Record AI/Agent usage limits.", "Verify hosting, deployment, private project, collaboration, and compute restrictions.", "Add a lastChecked field after manual verification."]],
      ["Publishing rule", ["Do not invent pricing.", "Do not rely on memory.", "Do not publish plan limits without official verification."]]
    ]
  },
  security: {
    eyebrow: "Security and production readiness",
    title: "Replit Agent Security Questions",
    status: "Security outcome not yet verified",
    summary: "Replit Agent may generate and modify code inside a real development environment, but production readiness depends on the final app architecture, secrets handling, authentication, dependencies, and deployment configuration.",
    sections: [
      ["Security questions", ["Are secrets stored safely and excluded from public client code?", "How are environment variables handled?", "Does the app include authentication, and is it configured correctly?", "Are routes, APIs, and database operations protected?", "Are generated dependencies outdated or vulnerable?", "Can normal users access admin-only actions?", "Are payments, webhooks, and third-party integrations protected?", "Does error handling expose sensitive information?", "Can the generated project be audited and exported clearly?", "What deployment safeguards and rollback options exist?"]],
      ["Production-readiness rule", ["NoCodeReviewed should not call a Replit Agent app production-ready until it passes code review, auth review, dependency review, deployment review, secrets review, and privacy checks."]]
    ]
  },
  autonomy: {
    eyebrow: "Autonomy testing",
    title: "How Autonomous Is Replit Agent?",
    status: "Autonomy rating pending",
    summary: "Replit Agent should be evaluated by how far it can take a project from prompt to runnable app, how well it debugs, how clearly it explains changes, and where human coding remains necessary.",
    sections: [
      ["Autonomy questions", ["Can it create a working app from a single prompt?", "Can it modify an existing project without breaking it?", "Can it debug runtime errors?", "Can it reason across multiple files?", "Can it handle backend logic and environment variables?", "Can it deploy or prepare a deployable project?", "Where does manual architecture or coding remain necessary?"]],
      ["Important distinction", ["Agentic coding does not equal safe production engineering.", "A tool can produce a runnable app while still requiring manual review for security, maintainability, and correctness."]]
    ]
  },
  "test-lab": {
    eyebrow: "NoCodeReviewed test lab",
    title: "Replit Agent Test Lab Plan",
    status: "All tests planned, not completed",
    summary: "This is the authority centerpiece for Replit Agent. NoCodeReviewed should run repeatable build tests and document prompts, generated files, runtime errors, deployment behavior, and final app quality.",
    sections: [
      ["Test 1: SaaS dashboard", ["Goal: evaluate full-stack project generation, routing, charts, auth assumptions, and deployment readiness.", "Capture: prompt, screenshots, generated file structure, runtime errors, deployment notes, code quality concerns."]],
      ["Test 2: Client portal", ["Goal: evaluate private user flows, login assumptions, data separation, admin/client views, and form handling.", "Capture: auth handling, route protection, data model assumptions, security concerns, failure signs."]],
      ["Test 3: Marketplace MVP", ["Goal: evaluate listings, seller/buyer views, moderation screens, database assumptions, and payment placeholders.", "Capture: app routes, file structure, API assumptions, broken flows, deployment blockers."]],
      ["Test 4: Internal CRM", ["Goal: evaluate CRUD quality, filters, tables, notes, persistence, and maintainability.", "Capture: data model, edit/delete behavior, search behavior, code organization, debugging steps."]],
      ["Test 5: AI content tool", ["Goal: evaluate API configuration, prompt workflow, saved outputs, server/client separation, and secrets handling.", "Capture: API key placement, generated code boundaries, error handling, deployability, privacy issues."]]
    ]
  },
  prompts: {
    eyebrow: "Testing prompts",
    title: "Replit Agent Starter Prompts for NoCodeReviewed Tests",
    status: "Prompt set ready for testing",
    summary: "These prompts are for controlled testing only. Results may vary, and every generated project needs manual review.",
    sections: [
      ["SaaS dashboard prompt", ["Build a full-stack SaaS analytics dashboard with login placeholder, team workspace, charts, customer table, billing placeholder, and settings page."]],
      ["Client portal prompt", ["Build a client portal with project status, messages, profile settings, admin dashboard, user-facing views, and protected-route assumptions explained."]],
      ["Marketplace MVP prompt", ["Build a two-sided marketplace MVP with listings, seller profiles, buyer inquiry flow, saved listings, admin moderation, and payment placeholder."]],
      ["Internal CRM prompt", ["Build an internal CRM for a small service business with contacts, deals, tasks, notes, filters, activity timeline, and persistent storage."]],
      ["AI content tool prompt", ["Build an AI content generator with prompt templates, saved outputs, project folders, API settings, and safe environment-variable handling."]]
    ]
  },
  templates: {
    eyebrow: "Template notes",
    title: "Replit Agent Templates and Test Patterns",
    status: "Template performance unverified",
    summary: "This page should collect reusable Replit Agent patterns only after testing. NoCodeReviewed should avoid template-quality claims until each pattern is tested.",
    sections: [
      ["Potential template categories", ["Full-stack SaaS dashboard", "Client portal", "Marketplace MVP", "Internal CRM", "AI content app", "Landing page plus app backend"]],
      ["Evidence needed", ["Prompt used", "Generated screenshots", "Generated file structure", "Runtime logs", "What worked", "What failed", "Security findings", "Production-readiness notes"]]
    ]
  },
  alternatives: {
    eyebrow: "Alternatives",
    title: "Replit Agent Alternatives",
    status: "Neutral comparison page",
    summary: "This page compares tool categories without declaring a winner until testing evidence exists.",
    sections: [
      ["Prompt app builders", ["Lovable", "Bolt.new", "v0 by Vercel"]],
      ["Agentic coding tools", ["Cursor", "Windsurf", "Claude Code", "OpenAI Codex"]],
      ["Cloud and full-stack builders", ["Firebase Studio", "Base44", "Create"]],
      ["Comparison rule", ["Do not declare a winner without test evidence. Compare by use case, constraints, code ownership, security, autonomy, deployment, and handoff quality."]]
    ]
  },
  "final-verdict": {
    eyebrow: "Verdict pending",
    title: "Replit Agent Final Verdict Pending Hands-On Testing",
    status: "No final verdict yet",
    summary: "NoCodeReviewed should not publish a final Replit Agent verdict until test builds, pricing verification, security checks, and deployment/handoff review are complete.",
    sections: [
      ["What can be said now", ["Replit Agent is a serious candidate for AI-assisted app building in a real cloud code workspace.", "Its final rating depends on evidence from security review, autonomy tests, generated-code review, deployment checks, debugging reliability, and maintainability analysis."]],
      ["What must happen first", ["Complete five test builds.", "Verify pricing manually.", "Capture screenshots, prompt logs, and runtime logs.", "Review generated code and dependencies.", "Run deployment and handoff checks.", "Pass Content Quality Gate before publication."]]
    ]
  }
};

function replitAgentMicrositeNav(activePage) {
  const pages = [
    ["overview", "Hub", "#tool/replit-agent"],
    ["review", "Review", "#tool/replit-agent/review"],
    ["pricing", "Pricing", "#tool/replit-agent/pricing"],
    ["security", "Security", "#tool/replit-agent/security"],
    ["autonomy", "Autonomy", "#tool/replit-agent/autonomy"],
    ["test-lab", "Test Lab", "#tool/replit-agent/test-lab"],
    ["prompts", "Prompts", "#tool/replit-agent/prompts"],
    ["templates", "Templates", "#tool/replit-agent/templates"],
    ["alternatives", "Alternatives", "#tool/replit-agent/alternatives"],
    ["final-verdict", "Final Verdict", "#tool/replit-agent/final-verdict"]
  ];

  return `
    <nav class="lovable-micro-nav">
      ${pages.map(([slug, label, href]) => `
        <a class="${slug === activePage ? "active" : ""}" href="${href}">${label}</a>
      `).join("")}
    </nav>
  `;
}

function replitAgentMicrositePanel(pageSlug = "overview") {
  const page = replitAgentMicrositePages[pageSlug] || replitAgentMicrositePages.overview;
  const activePage = replitAgentMicrositePages[pageSlug] ? pageSlug : "overview";

  return `
    <section class="lovable-microsite">
      <div class="lovable-hero">
        <div>
          <p class="eyebrow">${page.eyebrow}</p>
          <h1>${page.title}</h1>
          <p class="lede">${page.summary}</p>
          <div class="status-row">
            <span class="status-pill warning">${page.status}</span>
            <span class="status-pill">No fake scores</span>
            <span class="status-pill">Evidence-first</span>
          </div>
        </div>
        <div class="lovable-score-card">
          <strong>Current NoCodeReviewed Position</strong>
          <p>Replit Agent is approved for evidence collection and planned testing, not final verdict publication.</p>
          <a href="#tool/replit-agent/test-lab">View Test Lab Plan →</a>
        </div>
      </div>

      ${replitAgentMicrositeNav(activePage)}

      <div class="lovable-grid">
        ${page.sections.map(([heading, items]) => `
          <article class="lovable-card">
            <h2>${heading}</h2>
            <ul>
              ${items.map(item => `<li>${item}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="lovable-footer-cta">
        <h2>Evidence gate</h2>
        <p>Before this becomes a final review, NoCodeReviewed needs manual pricing verification, screenshots, repeatable test builds, generated-code review, deployment review, and a production-readiness audit.</p>
        <div class="status-row">
          <a class="button" href="#review/replit-agent">Open existing Replit Agent review</a>
          <a class="button secondary" href="#tool/replit-agent/final-verdict">View pending verdict</a>
        </div>
      </div>
    </section>
  `;
}


function aiAppBuildersClusterPanel() {
  const clusterTools = [
    {
      name: "Lovable",
      slug: "lovable",
      bestFor: "Fast MVPs, app prototypes, founder demos, and prompt-to-product workflows.",
      caution: "Needs hands-on verification for production security, data handling, and backend assumptions.",
      microsite: "#tool/lovable",
      review: "#review/lovable"
    },
    {
      name: "Bolt.new",
      slug: "bolt-new",
      bestFor: "Browser-based app building, fast frontend iteration, and WebContainer-style development.",
      caution: "Needs verification for dependency reliability, deployment handoff, auth patterns, and generated-code quality.",
      microsite: "#tool/bolt-new",
      review: "#review/bolt-new"
    },
    {
      name: "Replit Agent",
      slug: "replit-agent",
      bestFor: "Agentic coding inside a real cloud workspace with project files, runtime, hosting, and handoff potential.",
      caution: "Needs verification for deployment reliability, secrets handling, debugging quality, and long-term maintainability.",
      microsite: "#tool/replit-agent",
      review: "#review/replit-agent"
    }
  ];

  return `
    <section class="lovable-microsite">
      <div class="lovable-hero">
        <div>
          <p class="eyebrow">Authority cluster</p>
          <h1>AI App Builders: Lovable vs Bolt.new vs Replit Agent</h1>
          <p class="lede">This is NoCodeReviewed's first flagship decision hub for AI app builders. The goal is not to crown a winner too early. The goal is to compare these tools by use case, autonomy, security risk, pricing verification, test-lab evidence, and production-readiness.</p>
          <div class="status-row">
            <span class="status-pill warning">Cluster status: evidence in progress</span>
            <span class="status-pill">No fake winner</span>
            <span class="status-pill">Test-lab driven</span>
          </div>
        </div>
        <div class="lovable-score-card">
          <strong>Cluster position</strong>
          <p>Lovable, Bolt.new, and Replit Agent are the first core comparison triangle for NoCodeReviewed's AI app builder authority system.</p>
          <a href="#compare/lovable/bolt-new">Open existing comparison →</a>
        </div>
      </div>

      <div class="lovable-grid">
        <article class="lovable-card">
          <h2>Which one should you test first?</h2>
          <ul>
            <li><strong>Choose Lovable</strong> when the priority is fast product-shaped prototyping from prompts.</li>
            <li><strong>Choose Bolt.new</strong> when the priority is browser-based coding, fast iteration, and visible project structure.</li>
            <li><strong>Choose Replit Agent</strong> when the priority is a real cloud workspace, agentic coding, runtime, hosting, and project handoff.</li>
          </ul>
        </article>

        <article class="lovable-card">
          <h2>Evidence gate before final verdicts</h2>
          <ul>
            <li>Complete the five-build test lab for each tool.</li>
            <li>Verify current pricing manually with screenshots and last-checked dates.</li>
            <li>Check auth, secrets, environment variables, database access, deployment, and generated-code quality.</li>
            <li>Publish final recommendations only after evidence exists.</li>
          </ul>
        </article>

        <article class="lovable-card">
          <h2>Security-risk matrix</h2>
          <ul>
            <li><strong>Lovable:</strong> validate backend assumptions, database rules, auth, and production deployment details.</li>
            <li><strong>Bolt.new:</strong> validate client/server boundaries, dependency issues, exposed secrets, and deployment handoff.</li>
            <li><strong>Replit Agent:</strong> validate secrets handling, generated backend logic, runtime configuration, and hosted app behavior.</li>
          </ul>
        </article>

        <article class="lovable-card">
          <h2>Autonomy comparison</h2>
          <ul>
            <li><strong>Prompt-to-app:</strong> all three must be tested from the same baseline prompts.</li>
            <li><strong>Error recovery:</strong> measure whether the tool fixes its own broken output.</li>
            <li><strong>Project ownership:</strong> measure how clearly the user can inspect, export, deploy, and maintain the project.</li>
          </ul>
        </article>
      </div>

      <div class="cluster-table-card">
        <h2>Flagship app-builder cluster</h2>
        <table class="cluster-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Best current fit</th>
              <th>Main caution</th>
              <th>Microsite</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            ${clusterTools.map((tool) => `
              <tr>
                <td><strong>${tool.name}</strong></td>
                <td>${tool.bestFor}</td>
                <td>${tool.caution}</td>
                <td><a href="${tool.microsite}">Open hub</a></td>
                <td><a href="${tool.review}">Open review</a></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="lovable-footer-cta">
        <h2>Next authority move</h2>
        <p>After this cluster is live, the next step is to run the same five-build test plan across all three tools and turn the results into comparison tables, screenshots, verdict notes, and evidence-backed recommendations.</p>
        <div class="status-row">
          <a class="button" href="#tool/lovable/test-lab">Lovable test lab</a>
          <a class="button" href="#tool/bolt-new/test-lab">Bolt.new test lab</a>
          <a class="button" href="#tool/replit-agent/test-lab">Replit Agent test lab</a>
        </div>
      </div>
    </section>
  `;
}


const v0MicrositePages = {
  overview: {
    eyebrow: "v0 evidence hub",
    title: "v0 Review Hub",
    status: "Evidence status: pending hands-on testing",
    summary: "v0 is positioned as a UI-generation tool for React, Next.js, and component-first interface building. NoCodeReviewed is treating this as an evidence-first review hub until UI quality, code export, accessibility, backend limitations, pricing, and production-readiness are verified.",
    sections: [
      ["What can be safely said", ["v0 appears strongest for fast interface generation, landing pages, dashboards, and component scaffolding.", "Its natural evaluation lane is UI quality, React/Next.js fit, shadcn-style component output, accessibility, and handoff quality.", "NoCodeReviewed should not claim v0 is a full app builder until backend, auth, database, and deployment limitations are tested."]],
      ["Current review status", ["contentStatus: needs-evidence", "evidenceStatus: pending-hands-on-testing", "pricingStatus: needs-verification"]],
      ["Recommended next pages", ["Review in Progress", "Pricing Verification", "Security Questions", "Autonomy Testing", "Test Lab", "Prompts", "Templates", "Alternatives", "Final Verdict Pending"]]
    ]
  },
  review: {
    eyebrow: "Review in progress",
    title: "v0 Review: What We Can Say Before Testing",
    status: "No final score yet",
    summary: "This is not a final v0 review. It is a controlled evidence draft until NoCodeReviewed completes repeatable UI-generation, code-quality, accessibility, and handoff tests.",
    sections: [
      ["Safe preliminary framing", ["v0 is a serious candidate for AI-assisted UI generation and component scaffolding.", "The likely strength is producing polished frontend starting points faster than building from scratch.", "The key risks to validate are backend limitations, accessibility quality, code maintainability, responsive behavior, dependency assumptions, and production handoff."]],
      ["Do not claim yet", ["Do not claim v0 is the best AI app builder.", "Do not claim v0 replaces full-stack engineering.", "Do not claim generated interfaces are production-ready without manual review.", "Do not publish pricing, performance, or quality claims without verification."]]
    ]
  },
  pricing: {
    eyebrow: "Pricing verification",
    title: "v0 Pricing: Verification Required",
    status: "pricingStatus: needs-verification",
    summary: "v0 pricing, credits, usage limits, export rules, and plan features can change. This page should only publish verified pricing with a last-checked date and evidence.",
    sections: [
      ["Manual verification checklist", ["Check v0's official pricing page.", "Capture screenshots of each plan.", "Record free plan limits if available.", "Record paid usage limits, credits, seats, export rules, and commercial-use details.", "Verify whether limits affect private projects, generations, components, or deployments.", "Add a lastChecked field after manual verification."]],
      ["Publishing rule", ["Do not invent pricing.", "Do not rely on memory.", "Do not publish plan limits without official verification."]]
    ]
  },
  security: {
    eyebrow: "Security and production readiness",
    title: "v0 Security Questions",
    status: "Security outcome not yet verified",
    summary: "v0-generated UI still needs security review when connected to real authentication, APIs, databases, payments, or user data. UI generation does not remove production engineering responsibility.",
    sections: [
      ["Security questions", ["Does generated code assume fake data or real API boundaries?", "Are forms wired safely or only visually represented?", "Does the UI imply auth flows that do not actually exist?", "Are admin controls visually present without real permission checks?", "Are API keys or secrets ever suggested in client-side code?", "Are generated dependencies current and safe?", "Does the app expose sensitive data through mocked client state?", "Are accessibility and validation patterns strong enough for production?", "Can the generated components be audited, exported, and maintained?"]],
      ["Production-readiness rule", ["NoCodeReviewed should not call a v0-generated interface production-ready until it passes code review, accessibility review, responsive review, auth/API integration review, dependency review, and deployment review."]]
    ]
  },
  autonomy: {
    eyebrow: "Autonomy testing",
    title: "How Autonomous Is v0?",
    status: "Autonomy rating pending",
    summary: "v0 should be evaluated by how well it turns prompts into usable UI, how well it iterates, whether it produces maintainable code, and where human engineering remains necessary.",
    sections: [
      ["Autonomy questions", ["Can it create a complete landing page from one prompt?", "Can it create a dashboard with realistic component structure?", "Can it revise UI accurately after feedback?", "Can it maintain consistent design across pages?", "Can it create responsive layouts without manual correction?", "Can it produce accessible forms, buttons, navigation, and tables?", "Where does manual coding remain necessary for backend, auth, state, and deployment?"]],
      ["Important distinction", ["UI autonomy does not equal full product autonomy.", "A beautiful generated interface can still be nonfunctional, insecure, inaccessible, or incomplete without engineering review."]]
    ]
  },
  "test-lab": {
    eyebrow: "NoCodeReviewed test lab",
    title: "v0 Test Lab Plan",
    status: "All tests planned, not completed",
    summary: "This is the authority centerpiece for v0. NoCodeReviewed should run repeatable UI-generation tests and document prompts, screenshots, generated code, accessibility issues, responsive behavior, and handoff quality.",
    sections: [
      ["Test 1: SaaS landing page", ["Goal: evaluate visual hierarchy, copy structure, CTA clarity, responsive behavior, and production polish.", "Capture: prompt, screenshot, generated code structure, mobile behavior, accessibility issues, manual fixes needed."]],
      ["Test 2: Analytics dashboard", ["Goal: evaluate charts, tables, cards, filters, navigation, and realistic SaaS layout quality.", "Capture: component structure, mock data assumptions, responsiveness, maintainability, broken UI states."]],
      ["Test 3: Client portal UI", ["Goal: evaluate multi-page interface quality, profile/settings screens, status cards, messages, and admin/client separation as UI.", "Capture: route assumptions, auth illusions, component reuse, accessibility, missing backend logic."]],
      ["Test 4: Pricing/comparison page", ["Goal: evaluate conversion-focused layout, plan comparison tables, FAQ sections, trust markers, and responsive design.", "Capture: copy quality, table behavior, CTA logic, mobile layout, design consistency."]],
      ["Test 5: AI tool interface", ["Goal: evaluate prompt input design, saved-output UI, sidebar navigation, settings screens, and empty/error states.", "Capture: state assumptions, API boundary clarity, component quality, error-state design, handoff notes."]]
    ]
  },
  prompts: {
    eyebrow: "Testing prompts",
    title: "v0 Starter Prompts for NoCodeReviewed Tests",
    status: "Prompt set ready for testing",
    summary: "These prompts are for controlled UI-generation testing only. Results may vary, and every generated interface needs manual review.",
    sections: [
      ["SaaS landing page prompt", ["Create a polished SaaS landing page for an AI project-management app with hero, feature grid, social proof, pricing teaser, FAQ, and final CTA."]],
      ["Analytics dashboard prompt", ["Create a responsive analytics dashboard with sidebar navigation, KPI cards, line chart, customer table, filters, alerts, and settings entry point."]],
      ["Client portal UI prompt", ["Create a client portal interface with project status, messages, documents, invoices, profile settings, and admin/client visual separation."]],
      ["Pricing comparison prompt", ["Create a pricing and comparison page for an AI app-builder tool with three plans, feature matrix, FAQ, trust badges, and upgrade CTA."]],
      ["AI tool interface prompt", ["Create an AI content-generator app interface with prompt templates, project folders, saved outputs, generation panel, settings, and empty states."]]
    ]
  },
  templates: {
    eyebrow: "Template notes",
    title: "v0 Templates and Test Patterns",
    status: "Template performance unverified",
    summary: "This page should collect reusable v0 UI patterns only after testing. NoCodeReviewed should avoid template-quality claims until each pattern is tested.",
    sections: [
      ["Potential template categories", ["SaaS landing page", "Analytics dashboard", "Client portal UI", "Pricing page", "AI tool interface", "Admin console", "Comparison page"]],
      ["Evidence needed", ["Prompt used", "Generated screenshots", "Generated component structure", "Responsive screenshots", "Accessibility notes", "What worked", "What failed", "Manual fixes required"]]
    ]
  },
  alternatives: {
    eyebrow: "Alternatives",
    title: "v0 Alternatives",
    status: "Neutral comparison page",
    summary: "This page compares adjacent UI and app-builder tools without declaring a winner until testing evidence exists.",
    sections: [
      ["Prompt app builders", ["Lovable", "Bolt.new", "Replit Agent"]],
      ["UI generation tools", ["Uizard", "Galileo AI", "Builder.io Visual Copilot", "Framer AI"]],
      ["Agentic coding tools", ["Cursor", "Windsurf", "Claude Code", "OpenAI Codex"]],
      ["Comparison rule", ["Do not declare a winner without test evidence. Compare by use case, UI quality, code ownership, accessibility, backend limitations, exportability, and production-readiness."]]
    ]
  },
  "final-verdict": {
    eyebrow: "Verdict pending",
    title: "v0 Final Verdict Pending Hands-On Testing",
    status: "No final verdict yet",
    summary: "NoCodeReviewed should not publish a final v0 verdict until UI-generation tests, pricing verification, accessibility checks, code review, and handoff analysis are complete.",
    sections: [
      ["What can be said now", ["v0 is a serious candidate for AI-assisted UI generation and frontend scaffolding.", "Its final rating depends on evidence from UI quality tests, responsive behavior, accessibility review, generated-code review, backend limitation analysis, and handoff quality."]],
      ["What must happen first", ["Complete five UI-generation tests.", "Verify pricing manually.", "Capture screenshots, prompt logs, and generated code notes.", "Review accessibility and responsive behavior.", "Document backend and production limitations.", "Pass Content Quality Gate before publication."]]
    ]
  }
};

function v0MicrositeNav(activePage) {
  const pages = [
    ["overview", "Hub", "#tool/v0"],
    ["review", "Review", "#tool/v0/review"],
    ["pricing", "Pricing", "#tool/v0/pricing"],
    ["security", "Security", "#tool/v0/security"],
    ["autonomy", "Autonomy", "#tool/v0/autonomy"],
    ["test-lab", "Test Lab", "#tool/v0/test-lab"],
    ["prompts", "Prompts", "#tool/v0/prompts"],
    ["templates", "Templates", "#tool/v0/templates"],
    ["alternatives", "Alternatives", "#tool/v0/alternatives"],
    ["final-verdict", "Final Verdict", "#tool/v0/final-verdict"]
  ];

  return `
    <nav class="lovable-micro-nav">
      ${pages.map(([slug, label, href]) => `
        <a class="${slug === activePage ? "active" : ""}" href="${href}">${label}</a>
      `).join("")}
    </nav>
  `;
}

function v0MicrositePanel(pageSlug = "overview") {
  const page = v0MicrositePages[pageSlug] || v0MicrositePages.overview;
  const activePage = v0MicrositePages[pageSlug] ? pageSlug : "overview";

  return `
    <section class="lovable-microsite">
      <div class="lovable-hero">
        <div>
          <p class="eyebrow">${page.eyebrow}</p>
          <h1>${page.title}</h1>
          <p class="lede">${page.summary}</p>
          <div class="status-row">
            <span class="status-pill warning">${page.status}</span>
            <span class="status-pill">No fake scores</span>
            <span class="status-pill">Evidence-first</span>
          </div>
        </div>
        <div class="lovable-score-card">
          <strong>Current NoCodeReviewed Position</strong>
          <p>v0 is approved for evidence collection and planned testing, not final verdict publication.</p>
          <a href="#tool/v0/test-lab">View Test Lab Plan →</a>
        </div>
      </div>

      ${v0MicrositeNav(activePage)}

      <div class="lovable-grid">
        ${page.sections.map(([heading, items]) => `
          <article class="lovable-card">
            <h2>${heading}</h2>
            <ul>
              ${items.map(item => `<li>${item}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="lovable-footer-cta">
        <h2>Evidence gate</h2>
        <p>Before this becomes a final review, NoCodeReviewed needs manual pricing verification, screenshots, repeatable UI tests, generated-code review, accessibility review, and production-readiness analysis.</p>
        <div class="status-row">
          <a class="button" href="#review/v0">Open existing v0 review</a>
          <a class="button secondary" href="#tool/v0/final-verdict">View pending verdict</a>
        </div>
      </div>
    </section>
  `;
}


const genericMicrositePageLabels = [
  ["overview", "Hub"],
  ["review", "Review"],
  ["pricing", "Pricing"],
  ["security", "Security"],
  ["autonomy", "Autonomy"],
  ["test-lab", "Test Lab"],
  ["prompts", "Prompts"],
  ["templates", "Templates"],
  ["alternatives", "Alternatives"],
  ["final-verdict", "Final Verdict"]
];

function genericToolMicrositeNav(tool, activePage) {
  return `
    <nav class="lovable-micro-nav">
      ${genericMicrositePageLabels.map(([slug, label]) => {
        const href = slug === "overview" ? `#tool/${tool.slug}` : `#tool/${tool.slug}/${slug}`;
        return `<a class="${slug === activePage ? "active" : ""}" href="${href}">${label}</a>`;
      }).join("")}
    </nav>
  `;
}

function genericToolMicrositePage(tool, pageSlug = "overview") {
  const category = tool.category || "AI builder";
  const name = tool.name;
  const scoreText = tool.score ? `Existing provisional score: ${tool.score}` : "No final score yet";
  const bestFor = tool.bestFor || `${category} workflows that need hands-on evaluation before a final recommendation.`;
  const caution = tool.caution || "Needs evidence collection, pricing verification, security review, and repeatable test builds before final verdict publication.";

  const pages = {
    overview: {
      eyebrow: `${name} evidence hub`,
      title: `${name} Review Hub`,
      status: "Evidence status: pending hands-on testing",
      summary: `${name} is part of the NoCodeReviewed ${category} review system. This automated microsite is an evidence-first draft until hands-on testing, pricing verification, security review, and production-readiness checks are complete.`,
      sections: [
        ["What this hub is for", [`Organize ${name} review evidence in one place.`, "Separate safe observations from unverified claims.", "Prepare pricing, security, autonomy, prompt, template, and final-verdict pages before publication."]],
        ["Current review posture", ["contentStatus: needs-evidence", "evidenceStatus: pending-hands-on-testing", "pricingStatus: needs-verification", scoreText]],
        ["Best current fit", [bestFor, caution]]
      ]
    },
    review: {
      eyebrow: "Review in progress",
      title: `${name} Review: Evidence Draft`,
      status: "No final verdict yet",
      summary: `This is not a final ${name} review. It is a structured review draft that should be upgraded after repeatable hands-on tests.`,
      sections: [
        ["Safe preliminary framing", [`${name} belongs in the ${category} category.`, "The review should focus on real user outcomes, generated output quality, exportability, maintainability, security, and pricing transparency.", "Any strong claims should be held until screenshots, logs, generated files, and test notes exist."]],
        ["Do not claim yet", [`Do not claim ${name} is the best option in its category.`, "Do not claim production-readiness without manual review.", "Do not publish pricing or usage limits without official verification.", "Do not publish performance, user-count, funding, or scale claims without sources."]]
      ]
    },
    pricing: {
      eyebrow: "Pricing verification",
      title: `${name} Pricing: Verification Required`,
      status: "pricingStatus: needs-verification",
      summary: `${name} pricing, plan limits, usage credits, export rules, collaboration features, and commercial-use terms may change. This page should only publish verified pricing with a last-checked date.`,
      sections: [
        ["Manual verification checklist", [`Check ${name}'s official pricing page.`, "Capture screenshots of each plan.", "Record free plan limits if available.", "Record paid plan limits, usage limits, credits, seats, export rules, and deployment restrictions.", "Add lastChecked date after verification."]],
        ["Publishing rule", ["Do not invent pricing.", "Do not rely on memory.", "Do not publish plan limits without official verification."]]
      ]
    },
    security: {
      eyebrow: "Security and production readiness",
      title: `${name} Security Questions`,
      status: "Security outcome not yet verified",
      summary: `${name} output needs review before real production use. NoCodeReviewed should evaluate secrets, auth, database access, dependencies, generated code, deployment behavior, and privacy exposure.`,
      sections: [
        ["Security questions", ["Are API keys or secrets exposed in client code?", "How are environment variables handled?", "Are auth and permission checks real or only visual?", "Are database rules and API routes protected?", "Are dependencies current and safe?", "Can normal users access admin-only behavior?", "Are payments, webhooks, or third-party integrations protected?", "Does error handling expose sensitive details?", "Can the generated output be audited, exported, and maintained?"]],
        ["Production-readiness rule", [`Do not call ${name} production-ready until it passes code review, auth review, dependency review, deployment review, secrets review, privacy review, and maintainability review.`]]
      ]
    },
    autonomy: {
      eyebrow: "Autonomy testing",
      title: `How Autonomous Is ${name}?`,
      status: "Autonomy rating pending",
      summary: `${name} should be evaluated by how far it can move from prompt to usable output, how well it fixes errors, and where human work remains necessary.`,
      sections: [
        ["Autonomy questions", ["Can it create a usable result from a single prompt?", "Can it revise accurately after feedback?", "Can it debug broken output?", "Can it handle multiple files, pages, or flows?", "Can it prepare a deployable or exportable project?", "Where does manual architecture, security, or coding remain necessary?"]],
        ["Important distinction", ["Autonomy does not equal correctness.", "A generated project can look impressive while still needing engineering review, testing, and security hardening."]]
      ]
    },
    "test-lab": {
      eyebrow: "NoCodeReviewed test lab",
      title: `${name} Test Lab Plan`,
      status: "All tests planned, not completed",
      summary: `This is the authority centerpiece for ${name}. Run repeatable tests, capture prompts, screenshots, generated files, runtime errors, pricing notes, and final outcomes.`,
      sections: [
        ["Test 1: SaaS dashboard", ["Evaluate dashboard generation, routing, tables, charts, settings, auth assumptions, and maintainability."]],
        ["Test 2: Client portal", ["Evaluate private user flows, admin/client separation, messaging, documents, and route protection assumptions."]],
        ["Test 3: Marketplace MVP", ["Evaluate listings, seller/buyer flows, moderation, data assumptions, and payment placeholders."]],
        ["Test 4: Internal CRM", ["Evaluate CRUD behavior, filters, notes, persistence, timeline, and generated structure."]],
        ["Test 5: AI content tool", ["Evaluate prompt input, saved outputs, folders, API settings, secrets handling, and error states."]]
      ]
    },
    prompts: {
      eyebrow: "Testing prompts",
      title: `${name} Starter Prompts`,
      status: "Prompt set ready for testing",
      summary: `Use these prompts to produce controlled ${name} test evidence. Every result still needs manual review.`,
      sections: [
        ["SaaS dashboard prompt", ["Build a SaaS analytics dashboard with workspace navigation, KPI cards, charts, customer table, settings, and billing placeholder."]],
        ["Client portal prompt", ["Build a client portal with project status, messages, documents, invoices, profile settings, and admin/client views."]],
        ["Marketplace MVP prompt", ["Build a two-sided marketplace MVP with listings, seller profiles, buyer inquiry flow, saved listings, moderation, and payment placeholder."]],
        ["Internal CRM prompt", ["Build an internal CRM with contacts, deals, tasks, notes, filters, activity timeline, and persistent storage assumptions."]],
        ["AI content tool prompt", ["Build an AI content generator with prompt templates, saved outputs, project folders, settings, and safe API configuration."]]
      ]
    },
    templates: {
      eyebrow: "Template notes",
      title: `${name} Templates and Test Patterns`,
      status: "Template performance unverified",
      summary: `This page should collect reusable ${name} templates only after hands-on testing.`,
      sections: [
        ["Potential template categories", ["SaaS dashboard", "Client portal", "Marketplace MVP", "Internal CRM", "AI tool interface", "Landing page", "Admin console"]],
        ["Evidence needed", ["Prompt used", "Generated screenshots", "Generated file/component structure", "What worked", "What failed", "Security findings", "Production-readiness notes"]]
      ]
    },
    alternatives: {
      eyebrow: "Alternatives",
      title: `${name} Alternatives`,
      status: "Neutral comparison page",
      summary: `This page should compare ${name} against nearby tools without declaring a winner until test evidence exists.`,
      sections: [
        ["Comparison categories", ["Prompt app builders", "Agentic coding tools", "UI generators", "Visual builders", "Cloud app builders"]],
        ["Comparison rule", ["Compare by use case, security, autonomy, pricing, exportability, maintainability, deployment, and handoff quality.", "Do not declare a winner without test evidence."]]
      ]
    },
    "final-verdict": {
      eyebrow: "Verdict pending",
      title: `${name} Final Verdict Pending`,
      status: "No final verdict yet",
      summary: `NoCodeReviewed should not publish a final ${name} verdict until test builds, pricing verification, security checks, and production-readiness review are complete.`,
      sections: [
        ["What can be said now", [`${name} is approved for evidence collection and structured testing.`, "The final rating depends on hands-on results, not assumptions."]],
        ["What must happen first", ["Complete five test builds.", "Verify pricing manually.", "Capture screenshots, prompt logs, and generated output notes.", "Review security and maintainability.", "Pass Content Quality Gate before publication."]]
      ]
    }
  };

  return pages[pageSlug] || pages.overview;
}

function genericToolMicrositePanel(toolSlug, pageSlug = "overview") {
  const tool = toolBySlug(toolSlug);
  if (!tool) return reviewsPanel();

  const page = genericToolMicrositePage(tool, pageSlug);
  const activePage = genericMicrositePageLabels.some(([slug]) => slug === pageSlug) ? pageSlug : "overview";

  return `
    <section class="lovable-microsite">
      <div class="lovable-hero">
        <div>
          <p class="eyebrow">${page.eyebrow}</p>
          <h1>${page.title}</h1>
          <p class="lede">${page.summary}</p>
          <div class="status-row">
            <span class="status-pill warning">${page.status}</span>
            <span class="status-pill">Generic engine</span>
            <span class="status-pill">Evidence-first</span>
          </div>
        </div>
        <div class="lovable-score-card">
          <strong>Current NoCodeReviewed Position</strong>
          <p>${tool.name} is approved for evidence collection and planned testing, not final verdict publication.</p>
          <a href="#tool/${tool.slug}/test-lab">View Test Lab Plan →</a>
        </div>
      </div>

      ${genericToolMicrositeNav(tool, activePage)}

      <div class="lovable-grid">
        ${page.sections.map(([heading, items]) => `
          <article class="lovable-card">
            <h2>${heading}</h2>
            <ul>
              ${items.map(item => `<li>${item}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="lovable-footer-cta">
        <h2>Evidence gate</h2>
        <p>Before this becomes a final review, NoCodeReviewed needs pricing verification, screenshots, repeatable test builds, generated-output review, security review, and production-readiness analysis.</p>
        <div class="status-row">
          <a class="button" href="#review/${tool.slug}">Open existing ${tool.name} review</a>
          <a class="button secondary" href="#tool/${tool.slug}/final-verdict">View pending verdict</a>
        </div>
      </div>
    </section>
  `;
}



const micrositeStatusBySlug = {
  "lovable": {
    completion: 48,
    pricing: "pending",
    testLab: "in progress",
    security: "pending",
    verdict: "blocked"
  },
  "bolt-new": {
    completion: 46,
    pricing: "pending",
    testLab: "in progress",
    security: "pending",
    verdict: "blocked"
  },
  "replit-agent": {
    completion: 44,
    pricing: "pending",
    testLab: "in progress",
    security: "pending",
    verdict: "blocked"
  },
  "v0": {
    completion: 42,
    pricing: "pending",
    testLab: "planned",
    security: "pending",
    verdict: "blocked"
  }
};


function micrositeStatusClass(value) {
  return String(value || "pending")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function micrositeCompletionForTool(tool, isCustom) {
  const savedStatus = micrositeStatusBySlug[tool.slug];

  if (savedStatus) {
    return {
      completion: savedStatus.completion ?? 0,
      pricing: savedStatus.pricing || "pending",
      testLab: savedStatus.testLab || "pending",
      security: savedStatus.security || "pending",
      verdict: savedStatus.verdict || "blocked"
    };
  }

  return {
    completion: isCustom ? 42 : 22,
    pricing: "pending",
    testLab: isCustom ? "in progress" : "pending",
    security: "pending",
    verdict: "blocked"
  };
}

function micrositesDirectoryPanel() {
  const customMicrosites = new Set(["lovable", "bolt-new", "replit-agent", "v0", "cursor", "windsurf", "framer-ai", "webflow-ai", "bubble-ai", "framer", "webflow", "bubble", "base44", "claude-code"]);
  const micrositeParams = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const activeFilter = micrositeParams.get("filter") || "all";
  const activeSort = micrositeParams.get("sort") || "category";

  function micrositeDirectoryHref(filter, sort = activeSort) {
    const params = new URLSearchParams();
    if (filter && filter !== "all") params.set("filter", filter);
    if (sort && sort !== "category") params.set("sort", sort);
    const query = params.toString();
    return query ? `#microsites?${query}` : "#microsites";
  }

  function toolMatchesMicrositeFilter(tool) {
    const isCustom = customMicrosites.has(tool.slug);
    const status = micrositeCompletionForTool(tool, isCustom);

    if (activeFilter === "custom") return isCustom;
    if (activeFilter === "generic") return !isCustom;
    if (activeFilter === "pricing") return status.pricing !== "checked";
    if (activeFilter === "test-lab") return status.testLab !== "checked";
    if (activeFilter === "security") return status.security !== "checked";
    if (activeFilter === "blocked") return status.verdict === "blocked";
    return true;
  }

  const visibleTools = tools.filter(toolMatchesMicrositeFilter).sort((a, b) => {
    const aCustom = customMicrosites.has(a.slug);
    const bCustom = customMicrosites.has(b.slug);
    const aStatus = micrositeCompletionForTool(a, aCustom);
    const bStatus = micrositeCompletionForTool(b, bCustom);

    if (activeSort === "lowest") return aStatus.completion - bStatus.completion;
    if (activeSort === "highest") return bStatus.completion - aStatus.completion;
    if (activeSort === "custom") return Number(bCustom) - Number(aCustom) || a.name.localeCompare(b.name);
    if (activeSort === "generic") return Number(aCustom) - Number(bCustom) || a.name.localeCompare(b.name);
    if (activeSort === "name") return a.name.localeCompare(b.name);

    return (a.category || "").localeCompare(b.category || "") || a.name.localeCompare(b.name);
  });

  const groupedTools = visibleTools.reduce((groups, tool) => {
    const category = tool.category || "Uncategorized";
    if (!groups[category]) groups[category] = [];
    groups[category].push(tool);
    return groups;
  }, {});

  const totalCustom = tools.filter((tool) => customMicrosites.has(tool.slug)).length;
  const totalGeneric = tools.length - totalCustom;

  const micrositeFilters = [
    ["all", "All", tools.length],
    ["custom", "Custom flagship", totalCustom],
    ["generic", "Automated generic", totalGeneric],
    ["pricing", "Needs pricing check", tools.filter((tool) => micrositeCompletionForTool(tool, customMicrosites.has(tool.slug)).pricing !== "checked").length],
    ["test-lab", "Needs test lab", tools.filter((tool) => micrositeCompletionForTool(tool, customMicrosites.has(tool.slug)).testLab !== "checked").length],
    ["security", "Needs security review", tools.filter((tool) => micrositeCompletionForTool(tool, customMicrosites.has(tool.slug)).security !== "checked").length],
    ["blocked", "Verdict blocked", tools.filter((tool) => micrositeCompletionForTool(tool, customMicrosites.has(tool.slug)).verdict === "blocked").length]
  ];

  return `
    <section class="lovable-microsite module-shell">
      <div class="section-marker">
        <span class="marker-num">06</span>
        <p class="eyebrow">Microsites Directory</p>
        <h1 style="margin:4px 0 8px;">All Tool Microsites</h1>
      </div>
      <div class="lovable-hero">
        <div>
          <p class="lede">This directory shows every NoCodeReviewed tool microsite in one place. Custom flagship microsites get deeper hand-built pages. Generic microsites use the automated evidence-first engine so every tool has a review hub, pricing page, security page, autonomy page, test lab, prompt page, template page, alternatives page, and pending verdict.</p>
          <div class="status-row">
            <span class="status-pill complete">${tools.length} total tools</span>
            <span class="status-pill">${totalCustom} custom flagship microsites</span>
            <span class="status-pill">${totalGeneric} automated microsites</span>
          </div>
        </div>
        <div class="lovable-score-card">
          <strong>System status</strong>
          <p>The microsite engine is now the scalable layer. You can publish broad coverage first, then upgrade the highest-value tools into custom authority pages.</p>
          <a href="#cluster/ai-app-builders">Open AI App Builder Cluster →</a>
        </div>
      </div>

      <div class="microsite-filter-bar" aria-label="Microsite filters">
        ${micrositeFilters.map(([key, label, count]) => `
          <a class="${activeFilter === key ? "active" : ""} evidence-badge" href="${micrositeDirectoryHref(key)}" style="margin:2px;">
            <span>${label}</span>
            <strong>${count}</strong>
          </a>
        `).join("")}
      </div>

      <div class="microsite-dashboard-controls">
        <div class="microsite-filter-summary">
          Showing <strong>${visibleTools.length}</strong> of <strong>${tools.length}</strong> tool microsites.
        </div>

        <label class="microsite-sort-control">
          <span>Sort by</span>
          <select onchange="window.location.hash = micrositeDirectoryHref(activeFilter, this.value)">
            <option value="category" ${activeSort === "category" ? "selected" : ""}>Category</option>
            <option value="lowest" ${activeSort === "lowest" ? "selected" : ""}>Lowest completion first</option>
            <option value="highest" ${activeSort === "highest" ? "selected" : ""}>Highest completion first</option>
            <option value="custom" ${activeSort === "custom" ? "selected" : ""}>Custom first</option>
            <option value="generic" ${activeSort === "generic" ? "selected" : ""}>Generic first</option>
            <option value="name" ${activeSort === "name" ? "selected" : ""}>Name A-Z</option>
          </select>
        </label>
      </div>

      <div class="cluster-table-card">
        <h2>Microsite route pattern</h2>
        <table class="cluster-table">
          <thead>
            <tr>
              <th>Page type</th>
              <th>Route pattern</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Hub</td><td><code>#tool/tool-slug</code></td><td>Main evidence hub for the tool.</td></tr>
            <tr><td>Review</td><td><code>#tool/tool-slug/review</code></td><td>Structured review draft before final scoring.</td></tr>
            <tr><td>Pricing</td><td><code>#tool/tool-slug/pricing</code></td><td>Pricing verification checklist and publishing guardrails.</td></tr>
            <tr><td>Security</td><td><code>#tool/tool-slug/security</code></td><td>Security and production-readiness questions.</td></tr>
            <tr><td>Autonomy</td><td><code>#tool/tool-slug/autonomy</code></td><td>Prompt-to-output and error-recovery evaluation.</td></tr>
            <tr><td>Test Lab</td><td><code>#tool/tool-slug/test-lab</code></td><td>Repeatable build-test plan.</td></tr>
            <tr><td>Prompts</td><td><code>#tool/tool-slug/prompts</code></td><td>Controlled testing prompts.</td></tr>
            <tr><td>Templates</td><td><code>#tool/tool-slug/templates</code></td><td>Reusable template and output-pattern notes.</td></tr>
            <tr><td>Alternatives</td><td><code>#tool/tool-slug/alternatives</code></td><td>Neutral comparison map.</td></tr>
            <tr><td>Final Verdict</td><td><code>#tool/tool-slug/final-verdict</code></td><td>Verdict gate before final publication.</td></tr>
          </tbody>
        </table>
      </div>

      ${Object.entries(groupedTools).map(([category, categoryTools]) => `
        <div class="microsite-category-section">
          <div class="microsite-category-header">
            <div>
              <p class="eyebrow">Tool category</p>
              <h2>${category}</h2>
            </div>
            <span>${categoryTools.length} tools</span>
          </div>

          <div class="microsite-directory-grid">
            ${categoryTools.map((tool) => {
              const isCustom = customMicrosites.has(tool.slug);
              const type = isCustom ? "Custom flagship" : "Automated generic";
              const statusBadges = [
                type,
                "Needs pricing check",
                "Needs test lab",
                "Needs security review",
                "Verdict pending"
              ];
              const completion = micrositeCompletionForTool(tool, isCustom);

              return `
                <article class="microsite-directory-card premium-card card-hover">
                  <div class="microsite-card-topline">
                    <span class="evidence-badge ${isCustom ? 'complete' : ''}">${type}</span>
                    <strong>${tool.score || "Pending"}</strong>
                  </div>

                  <h3>${tool.name}</h3>
                  <p>${tool.bestFor || "Evidence-first review hub pending hands-on testing."}</p>

                  <div class="microsite-progress">
                    <div class="microsite-progress-header">
                      <span>Completion</span>
                      <strong>${completion.completion}%</strong>
                    </div>
                    <div class="microsite-progress-track">
                      <span style="width: ${completion.completion}%"></span>
                    </div>
                  </div>

                  <div class="microsite-checklist">
                    <span class="status-${micrositeStatusClass(completion.pricing)} evidence-badge">Pricing: ${completion.pricing}</span>
                    <span class="status-${micrositeStatusClass(completion.testLab)} evidence-badge">Test lab: ${completion.testLab}</span>
                    <span class="status-${micrositeStatusClass(completion.security)} evidence-badge">Security: ${completion.security}</span>
                    <span class="status-${micrositeStatusClass(completion.verdict)} evidence-badge">Verdict: ${completion.verdict}</span>
                  </div>

                  <div class="directory-badges">
                    ${statusBadges.map((badge) => `<span class="directory-badge">${badge}</span>`).join("")}
                  </div>

                  <div class="microsite-card-links">
                    <a href="#tool/${tool.slug}" class="strong-cta">Hub</a>
                    <a href="#tool/${tool.slug}/test-lab">Test Lab</a>
                    <a href="#tool/${tool.slug}/security">Security</a>
                    <a href="#tool/${tool.slug}/pricing">Pricing</a>
                    <a href="#tool/${tool.slug}/final-verdict">Verdict</a>
                    <a href="#review/${tool.slug}">Review</a>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        </div>
      `).join("")}

      <div class="lovable-footer-cta">
        <h2>Next authority move</h2>
        <p>Use this directory as the control center. The next upgrade should be adding evidence status fields, last-checked dates, and test-completion states per tool so the directory becomes a live editorial dashboard.</p>
        <div class="status-row">
          <a class="button" href="#cluster/ai-app-builders">Open authority cluster</a>
          <a class="button secondary" href="#reviews">Back to reviews</a>
        </div>
      </div>
    </section>
  `;
}

function renderPanel() {
  if (window.location.hash.match(/^#blog\//)) {
    const sub = window.location.hash.split('/')[1];
    return ncrArticlePage(sub);
  }
  if (window.location.hash === "#microsites") return micrositesDirectoryPanel();

  const clusterRoute = window.location.hash.match(/^#cluster\/([^/?#]+)$/);
  if (clusterRoute) {
    if (clusterRoute[1] === "ai-app-builders") return aiAppBuildersClusterPanel();
    return reviewsPanel();
  }
  const lovableToolRoute = window.location.hash.match(/^#tool\/lovable(?:\/([^/?#]+))?$/);
  if (lovableToolRoute) {
    const sub = lovableToolRoute[1] || "overview";
    if (sub === 'tutorials') return ncrToolTutorials('lovable');
    return ncrToolMicrositeFunnel('lovable');
  }
  const boltNewToolRoute = window.location.hash.match(/^#tool\/bolt-new(?:\/([^/?#]+))?$/);
  if (boltNewToolRoute) {
    const sub = boltNewToolRoute[1] || "overview";
    if (sub === 'tutorials') return ncrToolTutorials('bolt-new');
    return ncrToolMicrositeFunnel('bolt-new');
  }
  const replitToolRoute = window.location.hash.match(/^#tool\/replit(?:\/([^/?#]+))?$/);
  if (replitToolRoute) {
    const sub = replitToolRoute[1] || "overview";
    if (sub === 'tutorials') return ncrToolTutorials('replit');
    return ncrToolMicrositeFunnel('replit');
  }
  const replitAgentToolRoute = window.location.hash.match(/^#tool\/replit-agent(?:\/([^/?#]+))?$/);
  if (replitAgentToolRoute) {
    const sub = replitAgentToolRoute[1] || "overview";
    if (sub === 'tutorials') return ncrToolTutorials('replit');
    return ncrToolMicrositeFunnel('replit');
  }
  const v0ToolRoute = window.location.hash.match(/^#tool\/v0(?:\/([^/?#]+))?$/);
  if (v0ToolRoute) {
    const sub = v0ToolRoute[1] || "overview";
    if (sub === 'tutorials') return ncrToolTutorials('v0');
    return ncrToolMicrositeFunnel('v0');  // C2: use enhanced ncr funnel for consistency (v0MicrositePanel legacy preserved for other paths if any)
  }
  const genericToolRoute = window.location.hash.match(/^#tool\/([^/?#]+)(?:\/([^/?#]+))?$/);
  if (genericToolRoute) {
    const tSlug = genericToolRoute[1];
    const sub = genericToolRoute[2] || "overview";
    const ncrSlugs = ['lovable','bolt-new','replit','replit-agent','cursor','windsurf','v0','framer-ai','webflow-ai','bubble-ai','framer','webflow','bubble','base44','claude-code'];
    if (ncrSlugs.includes(tSlug.toLowerCase()) && sub === 'tutorials') {
      return ncrToolTutorials(tSlug);
    }
    if (ncrSlugs.includes(tSlug.toLowerCase())) {
      return ncrToolMicrositeFunnel(tSlug);
    }
    return genericToolMicrositePanel(tSlug, sub);
  }
  const reportRoute = window.location.hash.match(/^#report\/([^/?#]+)/);
  if (reportRoute) {
    const report = authorityReportBySlug(reportRoute[1]);
    return report ? reportDetailPanel(report) : reportCenterPanel();
  }
  const bestRoute = window.location.hash.match(/^#best\/([^/?#]+)/);
  if (bestRoute) {
    const guide = bestOfGuideBySlug(bestRoute[1]);
    return guide ? bestOfDetailPanel(guide) : bestOfPanel();
  }
  const benchmarkRoute = window.location.hash.match(/^#benchmark\/([^/?#]+)/);
  if (benchmarkRoute) {
    const run = benchmarkRunById(benchmarkRoute[1]);
    return run ? benchmarkDetailPanel(run) : adminPanel();
  }
  const compareRoute = window.location.hash.match(/^#compare\/([^/?#]+)\/([^/?#]+)/);
  if (compareRoute) {
    const toolA = toolBySlug(compareRoute[1]);
    const toolB = toolBySlug(compareRoute[2]);
    compareA = toolA?.slug || compareA;
    compareB = toolB?.slug || compareB;
    return toolA && toolB ? compareDetailPanel(toolA, toolB) : comparePanel();
  }
  const route = window.location.hash.match(/^#review\/([^/?#]+)/);
  if (route) {
    const rSlug = route[1];
    // R2: expanded to cover priority + aliases + shopify (as pending; no dedicated ev file so fully labeled)
    const ncrReviewSlugs = ['lovable','bolt-new','replit','replit-agent','cursor','windsurf','v0','framer-ai','webflow-ai','bubble-ai','framer','webflow','bubble','base44','claude-code','shopify'];
    if (ncrReviewSlugs.includes(rSlug.toLowerCase())) {
      return ncrToolReviewPage(rSlug);
    }
    const tool = toolBySlug(rSlug);
    return tool ? reviewDetailPanel(tool) : reviewsPanel();
  }
  if (activeTab === "compare") return comparePanel();
  if (activeTab === "best") return bestOfPanel();
  if (activeTab === "methodology") return methodologyPanel();
  if (activeTab === "taxonomy") return taxonomyPanel();
  if (activeTab === "reports") return reportCenterPanel();
  if (activeTab === "intelligence") return intelligencePanel();
  if (activeTab === "intake") return intakePanel();
  if (activeTab === "pipeline") return pipelinePanel();
  if (activeTab === "calendar") return calendarPanel();
  if (activeTab === "monetization") return monetizationPanel();
  if (activeTab === "cro") return croPanel();
  if (activeTab === "email") return emailPanel();
  if (activeTab === "partnerships") return partnershipsPanel();
  if (activeTab === "audience") return audiencePanel();
  if (activeTab === "measurement") return measurementPanel();
  if (activeTab === "seo") return seoPanel();
  if (activeTab === "architecture") return architecturePanel();
  if (activeTab === "watch") return sourceWatchPanel();
  if (activeTab === "corrections") return correctionsPanel();
  if (activeTab === "benchmarks") return benchmarksPanel();
  if (activeTab === "generation") return generationPanel();
  if (activeTab === "models") return modelOpsPanel();
  if (activeTab === "quality") return qualityPanel();
  if (activeTab === "data") return dataPanel();
  if (activeTab === "schema") return schemaPanel();
  if (activeTab === "api") return apiPanel();
  if (activeTab === "auth") return authPanel();
  if (activeTab === "cms") return cmsPanel();
  if (activeTab === "evidence") return evidenceGraphPanel();
  if (activeTab === "trust") return trustPanel();
  if (activeTab === "compliance") return compliancePanel();
  if (activeTab === "design") return designPanel();
  if (activeTab === "operations") return operationsPanel();
  if (activeTab === "stack") return stackPanel();
  if (activeTab === "release") return releasePanel();
  if (activeTab === "recovery") return recoveryPanel();
  if (activeTab === "automation") return automationPanel();
  if (activeTab === "launch") return launchPanel();
  if (activeTab === "sprint") return sprintPanel();
  if (activeTab === "production") return productionPanel();
  if (activeTab === "distribution") return distributionPanel();
  if (activeTab === "wizard") return wizardPanel();
  if (activeTab === "tools") return toolsPanel();
  if (activeTab === "autonomy") return autonomyPanel();
  if (activeTab === "readiness") return readinessPanel();
  if (activeTab === "admin") return adminPanel();
  if (activeTab === "roadmap") return roadmapPanel();
  return reviewsPanel();
}

function render() {
  const hash = (window.location.hash || '#top').toLowerCase();
  const routeMatch = hash.match(/^#([a-z-]+)(?:\/([^/?#]+))?/);
  const r = routeMatch ? routeMatch[1] : 'top';
  const sub = routeMatch ? routeMatch[2] : null;

  // UI-K5: Robust router - simple top-level premium routes from mockup nav first (no sub)
  if (!sub) {
    let pageHtml = null;
    const simple = r || 'top';
    switch (simple) {
      case 'reviews':
        pageHtml = ncrReviewsRealPage();
        break;
      case 'microsites':
        pageHtml = ncrMicrositesRealPage();
        break;
      case 'tools':
        pageHtml = ncrToolsRealPage();
        break;
      case 'evidence':
        pageHtml = ncrEvidenceRealPage();
        break;
      case 'methodology':
        pageHtml = ncrMethodologyPage();
        break;
      case 'blog':
        pageHtml = ncrBlogPage();
        break;
      case 'about':
        pageHtml = ncrAboutPage();
        break;
      case 'submit':
        pageHtml = ncrSubmitPage();
        break;
      case 'evidence-library':
        pageHtml = ncrEvidenceLibraryPage();
        break;
      case 'benchmarks':
        pageHtml = ncrBenchmarksPage();
        break;
      case 'contact':
        pageHtml = ncrContactPage();
        break;
      case 'privacy':
        pageHtml = ncrPrivacyPage();
        break;
      case 'terms':
        pageHtml = ncrTermsPage();
        break;
      case 'newsletter':
        pageHtml = ncrNewsletterPage();
        break;
      case 'top':
      case 'home':
      case '':
        pageHtml = ncrHomePage();
        break;
    }
    if (pageHtml) {
      document.querySelector("#app").innerHTML = pageHtml;
      setupNcrPremiumNavActive(simple === 'top' || simple === 'home' || simple === '' ? 'home' : simple);
      postRenderMotionEnhance(simple);
      return;
    }
  }

  // B1: Blog article routes
  if (r === 'blog' && sub) {
    document.querySelector("#app").innerHTML = ncrArticlePage(sub);
    setupNcrPremiumNavActive('blog');
    postRenderMotionEnhance('blog');
    return;
  }

  // Complex routes (with sub like #review/xxx, #tool/xxx etc) or old simple tabs: delegate to old renderPanel logic
  // This keeps existing detailed microsite/review/benchmark flows working.
  try {
    const oldContent = renderPanel();
    document.querySelector("#app").innerHTML = `<div class="ncr-legacy-wrap">${oldContent}</div>`;
    setupNcrPremiumNavActive(r);
    postRenderMotionEnhance(r);
    try { bind(); } catch (_) {}
  } catch (e) {
    // ultimate fallback
    document.querySelector("#app").innerHTML = ncrHomePage();
    setupNcrPremiumNavActive('home');
    postRenderMotionEnhance('home');
  }
}

function setupNcrPremiumNavActive(activeKey) {
  try {
    const navs = document.querySelectorAll('.ncr-nav-links, .topbar nav');
    const key = (activeKey || 'home').toLowerCase();
    navs.forEach(nav => {
      nav.querySelectorAll('a').forEach(a => {
        a.classList.remove('active');
        let h = (a.getAttribute('href') || '').replace('#', '').split(/[/?#]/)[0] || '';
        h = h.toLowerCase();
        if (!h) return;
        if (h === key) {
          a.classList.add('active');
        } else if (key === 'home' && (h === 'top' || h === 'home')) {
          a.classList.add('active');
        } else if (key === 'reviews' && h === 'reviews') {
          a.classList.add('active');
        } else if (key === 'methodology' && h === 'methodology') {
          a.classList.add('active');
        } else if (key === 'microsites' && h === 'microsites') {
          a.classList.add('active');
        }
      });
    });
  } catch (_) {}
}

function postRenderMotionEnhance(pageKey = 'home') {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // still make sure visible
    document.querySelectorAll('.ncr-stat, .ncr-stat-tile, .ncr-card, .ncr-cta-band').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Trigger staggered slide-ins
  const animEls = document.querySelectorAll('.ncr-stat, .ncr-stat-tile, .ncr-card, .ncr-cta-band');
  animEls.forEach((el, i) => {
    el.classList.remove('animate-in');
    // force reflow for re-trigger on same page re-renders
    void el.offsetWidth;
    const delay = 40 + Math.min(i, 11) * 38;
    setTimeout(() => {
      el.classList.add('animate-in');
    }, delay);
  });

  // Init 3D pointer tilt (lightweight)
  initGlassTilt();

  // Dashboard specific (chart re-anim, etc)
  initDashboardAnims(pageKey);
}

function initGlassTilt() {
  const tiltEls = document.querySelectorAll('.ncr-tilt, .ncr-glass.glass-3d, .ncr-card.glass-3d, .ncr-command.glass-3d, .ncr-stat-tile.glass-3d');
  tiltEls.forEach(el => {
    if (el._tiltBound) return;
    el._tiltBound = true;

    const applyTilt = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5);
      const y = ((clientY - rect.top) / rect.height - 0.5);
      const rotX = (-y * 5.5).toFixed(1) + 'deg';
      const rotY = (x * 6.5).toFixed(1) + 'deg';
      el.style.setProperty('--ncr-tilt-x', rotX);
      el.style.setProperty('--ncr-tilt-y', rotY);
      el.style.setProperty('--mouse-x', ((x + 0.5) * 100) + '%');
      el.style.setProperty('--mouse-y', ((y + 0.5) * 100) + '%');
    };

    const resetTilt = () => {
      el.style.setProperty('--ncr-tilt-x', '0deg');
      el.style.setProperty('--ncr-tilt-y', '0deg');
    };

    el.addEventListener('mousemove', (e) => applyTilt(e.clientX, e.clientY), { passive: true });
    el.addEventListener('mouseleave', resetTilt, { passive: true });

    // light touch support
    el.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) applyTilt(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    el.addEventListener('touchend', resetTilt, { passive: true });
  });
}

function initDashboardAnims(pageKey) {
  const chart = document.querySelector('.ncr-mini-chart');
  if (chart) {
    const poly = chart.querySelector('polyline');
    if (poly) {
      chart.classList.remove('chart-anim');
      // force restart
      void chart.offsetWidth;
      setTimeout(() => chart.classList.add('chart-anim'), 60);
    }
  }
  // live pulse and scan are CSS driven
}

function bind() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.tab;
      render();
      document.querySelector(".workspace").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  const search = document.querySelector("#tool-search");
  if (search) {
    search.addEventListener("input", (event) => {
      query = event.target.value;
      document.querySelector("#panel").innerHTML = reviewsPanel();
      bind();
      document.querySelector("#tool-search")?.focus();
    });
  }
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      document.querySelector("#panel").innerHTML = reviewsPanel();
      bind();
    });
  });
  const compareASelect = document.querySelector("#compare-a");
  const compareBSelect = document.querySelector("#compare-b");
  if (compareASelect && compareBSelect) {
    const syncCompareLink = () => {
      compareA = compareASelect.value;
      compareB = compareBSelect.value;
      const link = document.querySelector(".compare-open");
      if (link) link.setAttribute("href", compareUrl());
    };
    compareASelect.addEventListener("change", syncCompareLink);
    compareBSelect.addEventListener("change", syncCompareLink);
  }
  document.querySelectorAll("[data-jump-category]").forEach((link) => {
    link.addEventListener("click", () => {
      activeCategory = link.dataset.jumpCategory;
      activeTab = "reviews";
    });
  });
  document.querySelectorAll(".wizard-option").forEach((button) => {
    button.addEventListener("click", () => {
      wizardAnswers[wizardStep] = button.dataset.value;
      wizardStep += 1;
      document.querySelector("#panel").innerHTML = wizardPanel();
      bind();
    });
  });
  document.querySelector(".reset-wizard")?.addEventListener("click", () => {
    wizardStep = 0;
    Object.keys(wizardAnswers).forEach((key) => delete wizardAnswers[key]);
    document.querySelector("#panel").innerHTML = wizardPanel();
    bind();
  });
  const benchmarkForm = document.querySelector("#benchmark-run-form");
  if (benchmarkForm) {
    benchmarkForm.addEventListener("submit", saveBenchmarkRun);
  }
  const articleBriefForm = document.querySelector("#article-brief-form");
  if (articleBriefForm) {
    articleBriefForm.addEventListener("submit", saveArticleBrief);
  }
  const evidenceSnapshotForm = document.querySelector("#evidence-snapshot-form");
  if (evidenceSnapshotForm) {
    evidenceSnapshotForm.addEventListener("submit", saveEvidenceSnapshot);
  }
  const reviewRecordForm = document.querySelector("#review-record-form");
  if (reviewRecordForm) {
    reviewRecordForm.addEventListener("submit", saveReviewRecord);
  }
  const artifactForm = document.querySelector("#artifact-form");
  if (artifactForm) {
    artifactForm.addEventListener("submit", saveArtifact);
  }
  const qualityCheckForm = document.querySelector("#quality-check-form");
  if (qualityCheckForm) {
    qualityCheckForm.addEventListener("submit", saveQualityCheck);
  }
}

async function loadLocalStore() {
  try {
    const [runsResponse, briefsResponse, snapshotsResponse, recordsResponse, artifactsResponse, qualityResponse] = await Promise.all([
      fetch("/api/benchmark-runs"),
      fetch("/api/article-briefs"),
      fetch("/api/evidence-snapshots"),
      fetch("/api/review-records"),
      fetch("/api/artifacts"),
      fetch("/api/quality-checks"),
    ]);
    benchmarkRuns = runsResponse.ok ? await runsResponse.json() : [];
    savedArticleBriefs = briefsResponse.ok ? await briefsResponse.json() : [];
    evidenceSnapshots = snapshotsResponse.ok ? await snapshotsResponse.json() : [];
    reviewRecords = recordsResponse.ok ? await recordsResponse.json() : [];
    artifacts = artifactsResponse.ok ? await artifactsResponse.json() : [];
    qualityChecks = qualityResponse.ok ? await qualityResponse.json() : [];
  } catch {
    benchmarkRuns = [];
    savedArticleBriefs = [];
    evidenceSnapshots = [];
    reviewRecords = [];
    artifacts = [];
    qualityChecks = [];
  }
}

async function saveBenchmarkRun(event) {
  event.preventDefault();
  const status = document.querySelector("#benchmark-form-status");
  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form).entries());
  status.textContent = "Saving...";
  try {
    const response = await fetch("/api/benchmark-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Save failed");
    benchmarkRuns = [await response.json(), ...benchmarkRuns];
    form.reset();
    status.textContent = "Saved.";
    document.querySelector("#panel").innerHTML = adminPanel();
    bind();
  } catch (error) {
    status.textContent = error.message || "Save failed.";
  }
}

async function saveArticleBrief(event) {
  event.preventDefault();
  const status = document.querySelector("#article-brief-form-status");
  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form).entries());
  status.textContent = "Saving...";
  try {
    const response = await fetch("/api/article-briefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Save failed");
    savedArticleBriefs = [await response.json(), ...savedArticleBriefs];
    form.reset();
    status.textContent = "Saved.";
    document.querySelector("#panel").innerHTML = adminPanel();
    bind();
  } catch (error) {
    status.textContent = error.message || "Save failed.";
  }
}

async function saveEvidenceSnapshot(event) {
  event.preventDefault();
  const status = document.querySelector("#evidence-snapshot-form-status");
  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form).entries());
  status.textContent = "Saving...";
  try {
    const response = await fetch("/api/evidence-snapshots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Save failed");
    evidenceSnapshots = [await response.json(), ...evidenceSnapshots];
    form.reset();
    status.textContent = "Saved.";
    document.querySelector("#panel").innerHTML = adminPanel();
    bind();
  } catch (error) {
    status.textContent = error.message || "Save failed.";
  }
}

async function saveReviewRecord(event) {
  event.preventDefault();
  const status = document.querySelector("#review-record-form-status");
  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form).entries());
  status.textContent = "Saving...";
  try {
    const response = await fetch("/api/review-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Save failed");
    const record = await response.json();
    reviewRecords = [record, ...reviewRecords.filter((item) => item.tool !== record.tool)];
    form.reset();
    status.textContent = "Saved.";
    document.querySelector("#panel").innerHTML = adminPanel();
    bind();
  } catch (error) {
    status.textContent = error.message || "Save failed.";
  }
}

async function saveArtifact(event) {
  event.preventDefault();
  const status = document.querySelector("#artifact-form-status");
  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form).entries());
  status.textContent = "Saving...";
  try {
    const response = await fetch("/api/artifacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Save failed");
    artifacts = [await response.json(), ...artifacts];
    form.reset();
    status.textContent = "Saved.";
    document.querySelector("#panel").innerHTML = adminPanel();
    bind();
  } catch (error) {
    status.textContent = error.message || "Save failed.";
  }
}

async function saveQualityCheck(event) {
  event.preventDefault();
  const status = document.querySelector("#quality-check-form-status");
  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form).entries());
  status.textContent = "Saving...";
  try {
    const response = await fetch("/api/quality-checks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Save failed");
    qualityChecks = [await response.json(), ...qualityChecks];
    form.reset();
    status.textContent = "Saved.";
    document.querySelector("#panel").innerHTML = adminPanel();
    bind();
  } catch (error) {
    status.textContent = error.message || "Save failed.";
  }
}

window.addEventListener("hashchange", render);

loadLocalStore().finally(render);

/* === UI-K4 Premium Intelligence Homepage + Placeholder Pages (static, grounded, no fakes) === */

function premiumNav(active = 'home') {
  const items = [
    { label: 'Home', href: '#top' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Microsites', href: '#microsites' },
    { label: 'Tools', href: '#tools' },
    { label: 'Evidence', href: '#evidence' },
    { label: 'Methodology', href: '#methodology' },
    { label: 'Blog', href: '#blog' },
    { label: 'About', href: '#about' },
  ];
  return `
  <nav class="ncr-nav">
    <div class="ncr-nav-inner ncr-container">
      <a class="ncr-logo" href="#top"><span class="ncr-logo-mark">🛡️</span>NoCodeReviewed</a>
      <div class="ncr-nav-links">
        ${items.map(i => `<a href="${i.href}" class="${(active === 'home' && i.label === 'Home') || active.toLowerCase() === i.label.toLowerCase() ? 'active' : ''}">${i.label}</a>`).join('')}
      </div>
      <a class="ncr-nav-cta" href="#submit">Submit a Microsite →</a>
      <!-- legacy for verify-static-app: data-tab="intake" Submit a Tool -->
    </div>
  </nav>`;
}

function ncrHomePage() {
  const numTools = (typeof tools !== 'undefined' ? tools.length : 28);
  const numEv = (typeof evidenceFileIndex !== 'undefined' ? evidenceFileIndex.length : 25);
  const customMicro = 3; // lovable, bolt-new, replit (existing)

  // Grounded latest activity (no fake timestamps or invented events)
  const activity = [
    { t: 'now', label: 'Local Vault Handoff added', badge: 'VAULT' },
    { t: 'recent', label: 'Vault Data Contract defined', badge: 'DOC' },
    { t: 'recent', label: 'Evidence manifest refreshed', badge: 'EVID' },
    { t: 'recent', label: 'Chat Intelligence Vault updated', badge: 'VAULT' },
  ];

  // Latest reviews: first 5 tools, grounded evidence state
  const latestReviews = (typeof tools !== 'undefined' ? tools.slice(0,5) : []).map(t => {
    const hasEv = (typeof evidenceFileIndex !== 'undefined') && evidenceFileIndex.some(e => (e.tool || '').toLowerCase().includes(t.name.toLowerCase().split(' ')[0]));
    return {
      name: t.name,
      cat: t.category || 'AI Tool',
      score: t.score || null,
      hasEvidence: hasEv,
      slug: t.slug
    };
  });

  // Microsite dir: use existing tools, mark the 3 custom as audited
  const msTools = (typeof tools !== 'undefined' ? tools.slice(0,5) : []).map((t, i) => ({
    name: t.name,
    cat: t.category || 'Platform',
    audited: i < 3,
    slug: t.slug
  }));

  const nav = premiumNav('microsites');

  return `
  ${nav}
  <div class="ncr-container">
    <!-- HERO -->
    <div class="ncr-hero">
      <div class="ncr-hero-left">
        <div class="eyebrow">AI TOOL INTELLIGENCE PLATFORM</div>
        <h1>Evidence.<br>Intelligence.<br><span class="gradient">No Code Empire.</span></h1>
        <p class="subhead">We review, benchmark, and audit AI tools and no-code microsites with real evidence — not hype. Built for builders who demand truth and results.</p>
        <div class="ncr-hero-ctas">
          <a class="ncr-btn ncr-btn-primary" href="/tools/vibe-auditor.html">Run the Vibe Auditor <span class="hint">Audit any microsite</span></a>
          <a class="ncr-btn ncr-btn-secondary" href="/tools/chat-intelligence-vault.html">Chat Intelligence Vault <span class="hint">Explore tool intelligence</span></a>
        </div>
        <div class="ncr-trust">
          <span>✓ Evidence-First</span>
          <span>✓ No Paid Rankings</span>
          <span>✓ Real Benchmarks</span>
          <span>✓ Human + AI Verified</span>
        </div>
      </div>

      <div class="ncr-command ncr-glass ncr-neon glass-3d ncr-tilt dashboard-animated">
        <div class="ncr-command-header">
          <div class="title">INTELLIGENCE COMMAND CENTER</div>
          <div class="ncr-live">● Live</div>
        </div>

        <div class="ncr-command-stats">
          <div class="ncr-stat glass-3d stat-slide-in"><div class="num">${numTools}</div><div class="label">Tools Reviewed</div></div>
          <div class="ncr-stat glass-3d stat-slide-in"><div class="num">${customMicro}</div><div class="label">Microsites Audited</div></div>
          <div class="ncr-stat glass-3d stat-slide-in"><div class="num">${numEv}</div><div class="label">Evidence Files</div></div>
          <div class="ncr-stat glass-3d stat-slide-in"><div class="num">0</div><div class="label">Sponsored Rankings</div></div>
        </div>

        <div class="ncr-command-health">
          <div>
            <div style="font-size:10px;color:var(--ncr-muted);margin-bottom:4px;">Platform Health</div>
            <div class="ncr-mini-chart">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                <polyline points="0,22 10,18 20,20 30,15 40,17 50,12 60,14 70,10 80,13 90,8 100,9" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
              </svg>
            </div>
          </div>
          <div class="ncr-integrity">
            <div style="font-size:9px;margin-bottom:2px;">Evidence Integrity</div>
            <div class="ncr-ring"><div class="ncr-ring-inner">Active</div></div>
            <div style="font-size:10px;color:var(--ncr-green);margin-top:2px;">Methodology</div>
          </div>
        </div>

        <div class="ncr-activity">
          <div style="font-size:10px;color:var(--ncr-muted);margin-bottom:4px;">Latest Activity</div>
          <ul style="list-style:none;padding:0;margin:0;">
            ${activity.map(a => `<li><span class="time">${a.t}</span> <span class="label">${a.label}</span> <span class="ncr-badge">${a.badge}</span></li>`).join('')}
          </ul>
        </div>

        <div class="ncr-quick">
          <a href="/tools/vibe-auditor.html">Vibe Auditor</a>
          <a href="/tools/chat-intelligence-vault.html">Chat Intelligence Vault</a>
          <a href="#evidence">Evidence Library</a>
          <a href="#benchmarks">Benchmark Explorer</a>
        </div>
      </div>
    </div>

    <!-- STAT BAND -->
    <div class="ncr-statband ncr-glass glass-3d">
      <div class="ncr-statband-inner">
        <div class="ncr-stat-tile glass-3d ncr-tilt stat-slide-in"><span class="icon">🛡️</span><div><div class="num">${numTools}</div><div class="lbl">Tools Indexed</div></div></div>
        <div class="ncr-stat-tile glass-3d ncr-tilt stat-slide-in"><span class="icon">📄</span><div><div class="num">${numEv}</div><div class="lbl">Evidence Files</div></div></div>
        <div class="ncr-stat-tile glass-3d ncr-tilt stat-slide-in"><span class="icon">🌐</span><div><div class="num">${customMicro}</div><div class="lbl">Microsites</div></div></div>
        <div class="ncr-stat-tile glass-3d ncr-tilt stat-slide-in"><span class="icon">⚖️</span><div><div class="num">0</div><div class="lbl">Sponsored Rankings</div></div></div>
        <div class="ncr-stat-tile glass-3d ncr-tilt stat-slide-in"><span class="icon">✓</span><div><div class="num">Active</div><div class="lbl">Evidence Integrity</div></div></div>
        <div class="ncr-stat-tile glass-3d ncr-tilt stat-slide-in"><span class="icon">👥</span><div><div class="num">Building</div><div class="lbl">Community Trust</div></div></div>
      </div>
    </div>

    <!-- LATEST TOOL REVIEWS -->
    <div class="ncr-section">
      <h2>LATEST TOOL REVIEWS <a href="#reviews">View all reviews →</a></h2>
      <div class="ncr-review-grid">
        ${latestReviews.map(r => `
          <div class="ncr-card glass-3d ncr-tilt stat-slide-in">
            <div class="ncr-card-head tool-logo-row">
              ${toolLogoMarkup(r, 28, "tool-logo")}
              <div>
                <div class="name">${r.name}</div>
                <div class="cat">${r.cat}</div>
              </div>
            </div>
            ${r.hasEvidence ? '<span class="ncr-evidence-pill">EVIDENCE-BACKED</span>' : '<span class="ncr-evidence-pill" style="background:rgba(245,158,11,0.12);color:#f59e0b;border-color:rgba(245,158,11,0.3)">EVIDENCE PENDING</span>'}
            <div class="ncr-checklist">
              ${r.hasEvidence ? '<div class="ok">✓ Evidence file available</div>' : '<div class="pend">○ Evidence file pending</div>'}
              <div class="pend">○ Review record pending</div>
              <div class="pend">○ Quality gate pending</div>
            </div>
            <a class="cta" href="#review/${r.slug}">View Review →</a>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- MICROSITE INTELLIGENCE DIRECTORY -->
    <div class="ncr-section">
      <h2>MICROSITE INTELLIGENCE DIRECTORY <a href="#microsites">View all microsites →</a></h2>
      <div class="ncr-filters">
        <span class="ncr-pill active">All</span>
        <span class="ncr-pill">Vibe Coding</span>
        <span class="ncr-pill">Website Builders</span>
        <span class="ncr-pill">No-Code Platforms</span>
        <span class="ncr-pill">AI Tools</span>
      </div>
      <div class="ncr-micro-grid">
        ${msTools.map(m => `
          <div class="ncr-card ncr-ms-card glass-3d ncr-tilt stat-slide-in">
            <div class="header tool-logo-row" style="height:auto;padding:4px 0;">
              ${toolLogoMarkup(m, 28, "tool-logo")}
            </div>
            <div class="name">${m.name}</div>
            <div class="cat">${m.cat}</div>
            ${m.audited ? '<span class="ncr-evidence-pill">AUDITED</span>' : '<span class="ncr-evidence-pill" style="background:rgba(245,158,11,0.12);color:#f59e0b;border-color:rgba(245,158,11,0.3)">PENDING</span>'}
            <a class="cta" href="#tool/${m.slug}">View Audit →</a>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- BOTTOM CTA -->
    <div class="ncr-cta-band ncr-glass ncr-purple-neon glass-3d">
      <div class="icon">🛡️</div>
      <div class="text">
        <div style="color:#a78bfa;font-size:11px;letter-spacing:1px;">JOIN THE EVIDENCE REVOLUTION</div>
        <h3>Build with truth. Ship with confidence.</h3>
        <p>NoCodeReviewed is the intelligence layer for the no-code movement. Real reviews. Real audits. Real results.</p>
      </div>
      <div class="ctas">
        <a class="ncr-btn ncr-btn-primary" href="#submit">Submit a Microsite →</a>
        <a class="ncr-btn ncr-btn-secondary" href="#methodology">Learn Our Methodology</a>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="ncr-footer">
      <div class="ncr-footer-grid ncr-container">
        <div>
          <div class="ncr-logo" style="margin-bottom:6px;"><span class="ncr-logo-mark">🛡️</span>NoCodeReviewed</div>
          <div style="font-size:11px;">Evidence-first intelligence for no-code &amp; AI builders.</div>
        </div>
        <div>
          <strong style="color:#fff;">Platform</strong>
          <a href="#reviews">Reviews</a>
          <a href="#microsites">Microsites</a>
          <a href="#tools">Tools</a>
          <a href="#evidence">Evidence</a>
        </div>
        <div>
          <strong style="color:#fff;">Resources</strong>
          <a href="#methodology">Methodology</a>
          <a href="#benchmarks">Benchmarks</a>
          <a href="#evidence-library">Evidence Library</a>
          <a href="#blog">Blog</a>
        </div>
        <div>
          <strong style="color:#fff;">Company</strong>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
        <div class="ncr-evidence-promise">
          <strong>Evidence-First. Always.</strong><br>
          We don’t do paid rankings.<br>
          We don’t do hype.<br>
          We deliver the truth.
        </div>
      </div>
    </footer>
  </div>`;
}

/* Reusable premium placeholder page */
function ncrPlaceholder(title, desc, extra = '') {
  const nav = premiumNav(title.toLowerCase());
  return `
  ${nav}
  <div class="ncr-container ncr-placeholder route-enter">
    <div class="ncr-placeholder-hero">
      <div class="eyebrow">NO CODEREVIEWED</div>
      <h1>${title}</h1>
      <p style="max-width:560px;margin:0 auto;color:var(--ncr-muted);">${desc}</p>
    </div>
    <div class="ncr-glass ncr-ph-card glass-3d" style="max-width:720px;margin:0 auto 24px;">
      <p style="margin:0 0 12px;">This section is under active construction as part of the Intelligence Platform rollout.</p>
      ${extra || '<p style="margin:0;">All content will be grounded in the Vault Data Contract, real evidence files, and the production Vibe Auditor + Chat Intelligence Vault tooling.</p>'}
      <div style="margin-top:16px;">
        <a class="ncr-btn ncr-btn-primary" href="/tools/vibe-auditor.html" style="display:inline-flex;">Run the Vibe Auditor</a>
        <a class="ncr-btn ncr-btn-secondary" href="#top" style="display:inline-flex;margin-left:8px;">Back to Home</a>
      </div>
    </div>
    <div style="text-align:center;font-size:11px;color:var(--ncr-muted);">Evidence pending • No fake claims • Local-first</div>
  </div>`;
}

function ncrReviewsRealPage() {
  const nav = premiumNav('reviews');
  const allTools = (typeof tools !== 'undefined' ? tools : []).slice(0, 12);
  const cards = allTools.map(t => {
    const evs = (typeof getEvidenceForTool === 'function') ? getEvidenceForTool(t.slug) : [];
    const hasEv = evs.length > 0;
    const s = (t.slug || '').toLowerCase();
    const isComplete = (typeof R2_COMPLETE_REVIEW_SLUGS !== 'undefined' && R2_COMPLETE_REVIEW_SLUGS.includes(s)) ||
                       (s === 'replit-agent' && R2_COMPLETE_REVIEW_SLUGS.includes('replit'));
    let statusPill;
    if (isComplete) {
      statusPill = '<span class="ncr-evidence-pill" style="background:rgba(16,185,129,0.15);color:#10b981;border-color:rgba(16,185,129,0.3)">PUBLISH-READY</span>';
    } else if (hasEv) {
      statusPill = '<span class="ncr-evidence-pill">EVIDENCE-BACKED</span>';
    } else {
      statusPill = '<span class="ncr-evidence-pill" style="background:rgba(245,158,11,0.12);color:#f59e0b;border-color:rgba(245,158,11,0.3)">EVIDENCE PENDING</span>';
    }
    return `
      <div class="ncr-card glass-3d ncr-tilt stat-slide-in">
        <div class="ncr-card-head tool-logo-row">
          ${toolLogoMarkup(t, 28, "tool-logo")}
          <div><div class="name">${t.name}</div><div class="cat">${t.category || 'Tool'}</div></div>
        </div>
        ${statusPill}
        <div class="ncr-checklist">
          ${isComplete ? '<div class="ok">✓ Publish-ready review (12 sections, evidence-grounded or pending-labeled)</div>' : (hasEv ? '<div class="ok">✓ Evidence file available</div>' : '<div class="pend">○ Evidence file pending</div>')}
          <div class="pend">○ Review record ${isComplete ? 'complete' : (hasEv ? 'available' : 'pending')}</div>
          <div class="pend">○ Quality gate ${isComplete ? 'passed for publish' : 'pending'}</div>
        </div>
        <a class="cta" href="#review/${t.slug}">View Review →</a>
      </div>`;
  }).join('');
  return `
  ${nav}
  <div class="ncr-container ncr-placeholder route-enter">
    <div class="ncr-placeholder-hero" style="text-align:left; padding-bottom:10px;">
      <div class="eyebrow">EVIDENCE-BACKED REVIEWS</div>
      <h1>Tool Reviews</h1>
      <p style="max-width:640px;">Publish-ready reviews (R2) are complete with hero, independent verdict, evidence snapshot, strengths/limitations, pricing, security, production readiness, use cases, alternatives, gaps, methodology, and CTAs. All claims trace to docs/evidence files or are explicitly "pending". Evidence-backed cards have files but may still be in progress. Click any card for the full dossier.</p>
    </div>
    <div class="ncr-review-grid" style="margin-bottom:30px;">
      ${cards || '<div class="ncr-card glass-3d">No tools loaded yet.</div>'}
    </div>
    <div style="text-align:center; margin:20px 0;">
      <a class="ncr-btn ncr-btn-primary" href="/tools/vibe-auditor.html">Run the Vibe Auditor</a>
      <a class="ncr-btn ncr-btn-secondary" href="#top" style="margin-left:8px;">Back to Home</a>
    </div>
  </div>`;
}

function ncrMicrositesRealPage() {
  const nav = premiumNav('microsites');
  const allTools = (typeof tools !== 'undefined' ? tools : []).slice(0, 10);
  const cards = allTools.map((t, i) => {
    const s = (t.slug || '').toLowerCase();
    const hasRealMicro = ['lovable','bolt-new','replit','replit-agent'].some(x => s.includes(x));
    const hasReview = (typeof R2_COMPLETE_REVIEW_SLUGS !== 'undefined' && (R2_COMPLETE_REVIEW_SLUGS.includes(s) || (s==='replit-agent' && R2_COMPLETE_REVIEW_SLUGS.includes('replit'))));
    const statusLabel = hasRealMicro ? 'AUDITED MICROSITE' : (hasReview ? 'REVIEW + FUNNEL' : 'PENDING');
    const statusStyle = hasRealMicro ? '' : (hasReview ? 'style="background:rgba(16,185,129,0.15);color:#10b981;border-color:rgba(16,185,129,0.3)"' : 'style="background:rgba(245,158,11,0.12);color:#f59e0b;border-color:rgba(245,158,11,0.3)"');
    return `
      <div class="ncr-card ncr-ms-card glass-3d ncr-tilt stat-slide-in">
        <div class="header"></div>
        <div class="name">${t.name}</div>
        <div class="cat">${t.category || 'Platform'}</div>
        <span class="ncr-evidence-pill" ${statusStyle}>${statusLabel}</span>
        <a class="cta" href="#tool/${t.slug}">Open Microsite →</a>
        <a class="cta" href="#review/${t.slug}" style="margin-top:4px;opacity:0.85;font-size:12px;">View Review →</a>
      </div>`;
  }).join('');
  return `
  ${nav}
  <div class="ncr-container ncr-placeholder route-enter">
    <div class="ncr-placeholder-hero" style="text-align:left; padding-bottom:10px;">
      <div class="eyebrow">INTELLIGENCE DIRECTORY</div>
      <h1>Microsite Intelligence Directory</h1>
      <p style="max-width:640px;">Custom flagship microsites (lovable, bolt.new, replit) link to evidence-backed funnels. R2 publish-ready tools link to completed reviews + auto funnels. All link correctly to #review/* and #tool/* . Others pending deeper evidence or custom content.</p>
    </div>
    <div class="ncr-micro-grid" style="margin-bottom:30px;">
      ${cards || '<div class="ncr-card glass-3d">No tools loaded yet.</div>'}
    </div>
    <div style="text-align:center;">
      <a class="ncr-btn ncr-btn-primary" href="#submit">Submit a Microsite</a>
      <a class="ncr-btn ncr-btn-secondary" href="#top" style="margin-left:8px;">Back to Home</a>
    </div>
  </div>`;
}

function ncrToolsRealPage() {
  const nav = premiumNav('tools');
  const allTools = (typeof tools !== 'undefined' ? tools : []);
  const cards = allTools.map(t => {
    const evs = (typeof getEvidenceForTool === 'function') ? getEvidenceForTool(t.slug) : [];
    const hasEv = evs.length > 0;
    const s = (t.slug || '').toLowerCase();
    const isComplete = (typeof R2_COMPLETE_REVIEW_SLUGS !== 'undefined' && R2_COMPLETE_REVIEW_SLUGS.includes(s)) ||
                       (s === 'replit-agent' && R2_COMPLETE_REVIEW_SLUGS.includes('replit'));
    return `
      <div class="ncr-card glass-3d ncr-tilt stat-slide-in">
        <div class="ncr-card-head tool-logo-row">
          ${toolLogoMarkup(t, 28, "tool-logo")}
          <div><div class="name">${t.name}</div><div class="cat">${t.category || 'Tool'}</div></div>
        </div>
        <div class="ncr-checklist">
          ${isComplete ? '<div class="ok">✓ Publish-ready review</div>' : (hasEv ? '<div class="ok">✓ Evidence available</div>' : '<div class="pend">○ Evidence pending</div>')}
          <div>Price: ${t.price || 'See details'}</div>
          <div>Status: ${t.affiliateStatus || 'Researching'}</div>
        </div>
        <a class="cta" href="#review/${t.slug}">View Review →</a>
        <a class="cta" href="#tool/${t.slug}" style="margin-top:4px;opacity:0.8;">Microsite Hub →</a>
      </div>`;
  }).join('');
  return `
  ${nav}
  <div class="ncr-container ncr-placeholder route-enter">
    <div class="ncr-placeholder-hero" style="text-align:left; padding-bottom:10px;">
      <div class="eyebrow">INDEX</div>
      <h1>All Tools</h1>
      <p style="max-width:640px;">Browse AI app builders, no-code platforms, vibe-coding environments, UI generators, and automation-oriented development tools. R2 publish-ready reviews are complete for priority tools (Lovable, Bolt.new, Replit, Cursor, Windsurf, Webflow, Bubble, Framer, v0). Others show evidence status. Each card links to full review and microsite. Fields: name, category, evidence/review status, pricing, use case.</p>
    </div>
    <div class="ncr-review-grid" style="margin-bottom:30px;">
      ${cards || '<div class="ncr-card glass-3d">No tools loaded yet.</div>'}
    </div>
    <div style="text-align:center;">
      <a class="ncr-btn ncr-btn-primary" href="#reviews">Browse Reviews</a>
      <a class="ncr-btn ncr-btn-secondary" href="#top" style="margin-left:8px;">Back to Home</a>
    </div>
  </div>`;
}

function ncrEvidenceRealPage() {
  const nav = premiumNav('evidence');
  const numEv = (typeof evidenceFileIndex !== 'undefined' ? evidenceFileIndex.length : 25);
  return `
  ${nav}
  <div class="ncr-container ncr-placeholder route-enter">
    <div class="ncr-placeholder-hero" style="text-align:left; padding-bottom:10px;">
      <div class="eyebrow">EVIDENCE SYSTEM</div>
      <h1>Evidence</h1>
      <p style="max-width:640px;">The canonical source of truth. ${numEv}+ evidence files, manifests, and quality gates power every claim on this platform.</p>
    </div>
    <div class="ncr-glass ncr-ph-card" style="max-width:720px;margin:0 auto 24px;">
      <p>Evidence files live in <code>docs/evidence/</code>. The manifest tracks completeness and duplicates. All public verdicts must trace back to these records.</p>
      <div style="margin-top:16px;">
        <a class="ncr-btn ncr-btn-primary" href="#evidence-library">Open Evidence Library</a>
        <a class="ncr-btn ncr-btn-secondary" href="#methodology" style="margin-left:8px;">Read Methodology</a>
      </div>
    </div>
  </div>`;
}
function ncrMethodologyPage() { 
  return `
  ${premiumNav('methodology')}
  <div class="ncr-container ncr-placeholder route-enter">
    <div class="ncr-placeholder-hero" style="text-align:left; padding-bottom:10px;">
      <h1>Methodology</h1>
      <p style="max-width:620px;margin:0 auto;">NoCodeReviewed ratings are powered by the Vibe Code Authority testing framework. The framework scores tools across ease of use, speed, design quality, autonomy, security readiness, backend readiness, production readiness, value, documentation, and export/control. The core principle: a tool can be excellent for prototyping and still require serious review before launch (from nocodereviewed_expansion_pack safe methodology-page-copy + docs/architecture/ evidence system docs).</p>
    </div>
    <div class="ncr-glass" style="padding:20px;max-width:720px;margin:0 auto;">
      <h3 style="margin-top:0;">Core Principles</h3>
      <ul style="line-height:1.6;">
        <li><strong>Evidence-First</strong> — Every review starts with the same benchmark prompts and records what actually worked. Do not claim completed testing without evidence.</li>
        <li><strong>Production Gates</strong> — Auth, data rules, secrets, deploy path, performance, and maintainability affect every verdict. Distinguish visual polish from production readiness.</li>
        <li><strong>No Paid Rankings</strong> — Sponsored or affiliate status is always disclosed and never influences scoring. Disclose affiliate relationships clearly.</li>
        <li><strong>Freshness</strong> — Scores and snapshots expire when products ship, pricing changes, or evidence becomes stale. Do not hardcode pricing unless manually verified. Mark uncertainty openly.</li>
      </ul>
      <p style="margin-top:16px;"><a class="ncr-btn ncr-btn-primary" href="/tools/vibe-auditor.html">Run the Vibe Auditor</a> • <a href="#evidence">Evidence system</a></p>
    </div>
  </div>`;
}
// ncrBlogPage and ncrArticlePage defined later in B1 section (overrides this placeholder)
function ncrAboutPage() { 
  return `
  ${premiumNav('about')}
  <div class="ncr-container ncr-placeholder route-enter">
    <div class="ncr-placeholder-hero" style="text-align:left; padding-bottom:10px;">
      <h1>About NoCodeReviewed</h1>
      <p style="max-width:620px;margin:0 auto;">Independent reviews of AI app builders, no-code platforms, and vibe-coding tools. NoCodeReviewed evaluates tools for speed, autonomy, security readiness, backend readiness, and whether the apps they create are actually launch-ready (from expansion_pack safe homepage-copy + doctrine_core_constitution and architecture docs).</p>
    </div>
    <div class="ncr-glass" style="padding:20px;max-width:720px;margin:0 auto;">
      <h3 style="margin-top:0;">Mission</h3>
      <p>The durable product direction is an Intelligence Platform that turns evidence, benchmarks, user-owned AI exports, and operational workflows into trusted audits, reviews, comparisons, tutorials, and recommendations.</p>
      <p style="margin-top:12px;"><a class="ncr-btn ncr-btn-primary" href="#evidence">Explore evidence system</a> • <a href="#methodology">Methodology</a> • <a href="/tools/vibe-auditor.html">Run Vibe Auditor</a></p>
    </div>
  </div>`;
}
function ncrSubmitPage() { return ncrPlaceholder('Submit a Microsite', 'Submit your AI-built or no-code microsite for evidence-backed review. The process starts with the free Vibe Auditor, followed by optional deep audit and microsite publication.', '<p>Full submission form and intake pipeline coming in a later phase. For now, run the auditor and export your results via the Chat Intelligence Vault.</p>'); }
function ncrEvidenceLibraryPage() { 
  return `
  ${premiumNav('evidence')}
  <div class="ncr-container ncr-placeholder route-enter">
    <div class="ncr-placeholder-hero" style="text-align:left; padding-bottom:10px;">
      <h1>Evidence Library</h1>
      <p style="max-width:640px;margin:0 auto;">Browse the full set of canonical evidence files (25+ complete records per manifest). Each file is the single source of truth for claims about a specific tool. From data/intelligence-vault/evidence-manifest.json and docs/evidence/. Missing numbers: 10,11,28. Canonical 22, some duplicates noted for Lovable/Claude/OpenAI Codex.</p>
    </div>
    <div class="ncr-glass" style="padding:20px;max-width:720px;margin:0 auto;">
      <p>Evidence system is the credibility layer. Public claims trace to evidence, methodology, or approved records (per AGENTS and architecture/VAULT_DATA_CONTRACT). Quality gates and manifest validators in scripts/.</p>
      <p style="margin-top:12px;"><a href="#methodology">Methodology</a> • <a href="/tools/vibe-auditor.html">Run Vibe Auditor</a></p>
    </div>
  </div>`;
}
function ncrBenchmarksPage() { return ncrPlaceholder('Benchmarks', 'Benchmark Explorer will surface repeatable build test results, failure modes, and production-readiness scores across the tool map. Currently powered by the internal benchmark protocol and evidence manifest.'); }
function ncrContactPage() { return ncrPlaceholder('Contact', 'For press, partnerships, or methodology questions, use the intelligence tools first (Vibe Auditor + Vault export) then reach out with grounded context.'); }
function ncrPrivacyPage() { return ncrPlaceholder('Privacy Policy', 'NoCodeReviewed is local-first by default. User-owned exports (ChatGPT, Grok, ZIPs) are processed in the browser and never uploaded unless you explicitly connect a future approved cloud feature.'); }
function ncrTermsPage() { return ncrPlaceholder('Terms of Service', 'All reviews and audits are editorially independent. No paid rankings. All claims must trace to evidence files or approved methodology records.'); }
function ncrNewsletterPage() { return ncrPlaceholder('Newsletter', 'Periodic evidence updates and methodology notes. Sign-up form coming soon. In the meantime, the Intelligence Command Center and Vault are the best way to stay current.'); }

/* UI-K5 Link QA helper (for manual/dev use; lists expected routes from the mockup nav + homepage) */
const UI_K5_EXPECTED_ROUTES = [
  '#top', '#home', '#reviews', '#microsites', '#tools', '#evidence', '#methodology',
  '#blog', '#about', '#submit', '#evidence-library', '#benchmarks', '#contact',
  '#privacy', '#terms', '#newsletter',
  // dynamic examples
  '#review/lovable', '#tool/lovable', '/tools/vibe-auditor.html', '/tools/chat-intelligence-vault.html'
];

function auditHomepageLinks() {
  // Dev helper: console log expected vs current nav/footer links found in DOM
  console.log('[UI-K5 Link Audit] Expected routes:', UI_K5_EXPECTED_ROUTES);
  const links = Array.from(document.querySelectorAll('a[href^="#"], a[href^="/tools/"]')).map(a => a.getAttribute('href'));
  console.log('[UI-K5 Link Audit] Found links:', [...new Set(links)]);
  // In real usage, open console and call auditHomepageLinks() after render
}

/* === M1: Tool Microsite Funnels + Separate Reviews (brand-inspired funnels, neutral reviews) === */

function getToolTheme(slug) {
  const s = (slug || '').toLowerCase();
  if (s === 'lovable') return 'lovable';
  if (s === 'bolt-new' || s === 'bolt') return 'bolt';
  if (s === 'replit' || s === 'replit-agent') return 'replit';
  if (s === 'cursor' || s === 'windsurf' || s === 'v0') return s;
  if (s === 'framer' || s === 'framer-ai') return 'framer-ai';
  if (s === 'webflow' || s === 'webflow-ai') return 'webflow-ai';
  if (s === 'bubble' || s === 'bubble-ai') return 'bubble-ai';
  if (s === 'base44') return 'base44';
  if (s === 'claude-code' || s === 'claude') return 'claude-code';
  if (s === 'shopify' || s === 'make' || s === 'zapier' || s === 'notion' || s === 'airtable') return s;
  return 'default';
}

function getToolData(slug) {
  let t = toolBySlug(slug);
  if (!t && slug === 'replit') t = toolBySlug('replit-agent');
  const s = (slug || '').toLowerCase();
  if (!t && ['webflow','bubble','framer'].includes(s)) {
    const map = { webflow: 'webflow-ai', bubble: 'bubble-ai', framer: 'framer-ai' };
    t = toolBySlug(map[s]);
  }
  if (!t) t = { name: slug, slug: slug, category: 'Tool', price: 'See site', bestFor: 'Builders', verdict: 'Evidence pending', affiliateStatus: 'Researching' };
  return t;
}

function getEvidenceForTool(slug) {
  const s = (slug || '').toLowerCase();
  const aliasMap = { webflow: 'webflow-ai', bubble: 'bubble-ai', framer: 'framer-ai', replit: 'replit' };
  const effective = aliasMap[s] || s;
  const files = evidenceFileIndex.filter(e => {
    const tool = (e.tool || '').toLowerCase();
    return tool.includes(effective) || tool.includes(s) || (s === 'replit' && tool.includes('replit'));
  });
  return files;
}

/* R2: Crash-safe, evidence-derived review content for publish-ready pages.
   All strings use only facts from docs/evidence/* (official claims, pricing notes, security notes, safe claims, limitations, testing plans, research status).
   "Evidence pending" / "hands-on required" / "verify current" labels preserved exactly where source files say so.
   No invented scores, testimonials, benchmarks, case studies, or claims.
   Production readiness uses explicit labels only. */
function getReviewData(slug) {
  const s = (slug || '').toLowerCase();
  const evFiles = getEvidenceForTool(slug);
  const hasEv = evFiles.length > 0;
  const evFile = hasEv ? evFiles[0].file : null;
  const evNote = hasEv ? `Grounded in ${evFile} (status: ${evFiles[0].status}).` : 'No dedicated evidence file captured.';
  const lastUpdated = 'May 30, 2026 (evidence file created; re-verify sources before use)';

  // Defaults for pending tools
  let data = {
    category: 'Tool',
    summary: 'Independent evidence-first evaluation. Claims trace to available official sources or are labeled pending.',
    verdict: 'Evidence snapshot available or pending. Production, security, and hands-on verification required before any readiness claim. Moderate confidence where official docs captured; low where hands-on missing.',
    confidence: 'Evidence pending',
    evidenceSnapshot: { files: evFiles.length, status: hasEv ? 'Canonical + supplemental' : 'Evidence pending', quality: hasEv ? 'Partial (official sources; hands-on pending)' : 'Pending', freshness: lastUpdated, gaps: 'See evidence gaps section.' },
    strengths: ['Evidence status and gaps are explicitly labeled (no unsupported claims published).', 'Official positioning captured where evidence file exists.', 'Real export, hosting, or code paths noted in source docs for several tools (verify per file).'],
    limitations: ['Production readiness, security posture, and long-term maintainability require hands-on verification for almost all tools (evidence files consistently mark "in-progress — security, deployment, testing required").', 'Pricing, usage, and limits change frequently. Manual testing for auth, private routes, data rules, secrets, and export fidelity is mandatory before real use.', 'Auth, data ownership, export fidelity, and app-level security outcomes still require project-specific testing regardless of tool.'],
    pricing: hasEv ? `Official pricing page(s) referenced in evidence. Exact tiers, credits, usage, and add-ons require final capture and re-verification before publication. ${evNote}` : 'Pricing evidence pending. Verify current pricing before purchase.',
    security: 'Auth, data rules, secrets, exportability, and deployment posture determine suitability for serious use. ' + (hasEv ? 'Evidence file notes specific posture but hands-on verification of defaults, scope, and behavior is required per file status.' : 'Full verification pending hands-on tests for most tools. No evidence file captured.'),
    production: [
      { gate: 'Database / Data', label: 'Evidence pending', note: 'Official docs often mention built-in or external DB options (e.g. Supabase paths, RLS mentions); no generated-app RLS/privacy test recorded in evidence.' },
      { gate: 'Auth', label: 'Evidence pending', note: 'Shared responsibility or privacy controls documented in some; defaults and generated-app behavior untested.' },
      { gate: 'Deployment', label: 'Evidence pending', note: 'Hosting/publish paths referenced; Starter expiry, filesystem warnings, and publish success not benchmarked hands-on.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'No secret-injection or exposure test results in current evidence.' },
      { gate: 'Exportability', label: 'Evidence pending', note: 'Code export, GitHub sync, or local build mentioned for some (Bolt, v0, Lovable real-code claims); fidelity untested.' },
      { gate: 'Maintainability', label: 'Evidence pending', note: 'Generated code structure, duplication, and long-term stewardship require inspection per testing plans.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: 'Security Agent, review features, and destructive-action safeguards mentioned but not benchmarked.' },
      { gate: 'Handoff', label: 'Evidence pending', note: 'Team/Enterprise controls and export paths in pricing/docs; artifact review pending.' }
    ],
    bestFor: 'Builders evaluating tools with available evidence files. See use-case notes derived from official positioning.',
    avoid: 'You need guaranteed enterprise compliance, complex legacy integration, or fully audited production security before first build. Hands-on verification required per evidence status.',
    useCases: ['Rapid prototypes where official positioning matches your stack (prompt-to-app, AI IDE, site gen, no-code incumbent).', 'Teams that can perform their own auth/RLS/secrets/deploy tests before trusting generated output.', 'Comparison against adjacent tools using the same evidence standards.'],
    alternatives: 'Adjacent tools from the index (see #tools). No fake rankings — evaluate based on your specific evidence needs. Examples: Cursor/Windsurf for code IDE layer; Lovable/Bolt for prompt-to-app; Framer/Webflow for site gen; Bubble for traditional no-code control.',
    gaps: ['Full hands-on security / production gate results (pending for all priority tools per "in-progress" evidence status).', 'Long-term maintainability and handoff quality (pending).', 'Updated pricing + token/credit scaling benchmarks (re-check official; captured in evidence but volatile).', !hasEv ? 'No dedicated evidence file in docs/evidence/.' : ''],
    methodologyNote: 'Repeatable build tests, pricing snapshots, production-readiness gates, and quality checks. All public claims must trace to evidence records (docs/evidence/* + data/intelligence-vault/evidence-manifest.json) or approved methodology.'
  };

  // Lovable (04 + 12)
  if (s === 'lovable') {
    data.category = 'Prompt-to-app / Full-stack AI app builder';
    data.summary = 'Full-stack AI development platform for building, iterating on, and deploying web applications using natural language, with real code, security, and enterprise governance claims.';
    data.verdict = 'Strong official positioning as full-stack prompt-to-app with real code export and pricing/docs captured. Third-party security/visibility history noted as test area. Production readiness, auth/RLS, cost, and export fidelity unverified (hands-on required per evidence "in-progress" status). Moderate confidence on official claims; low on outcomes.';
    data.confidence = 'Moderate confidence (official positioning + pricing captured; hands-on pending)';
    data.evidenceSnapshot = { files: evFiles.length, status: 'Canonical (04) + Supplemental (12)', quality: 'Partial (official sources + third-party risk notes; hands-on pending)', freshness: lastUpdated, gaps: 'Security, generated-code, Supabase/auth, deployment, and cost testing required.' };
    data.strengths = [
      'Official docs position as full-stack AI development platform for natural-language web app building, iteration, and deployment.',
      'Emphasizes "real code" — inspectable artifact vs opaque no-code black box (safe claim from docs.lovable.dev).',
      'Public pricing page for individuals and teams; supplemental evidence captured Free/Pro $25/mo (100 credits), Business $50, Enterprise custom, top-ups (verify current).',
      'Comparison candidate for Replit, Bolt, Base44, Bubble, v0 per evidence rationale.',
      'Official docs and pricing are public and re-checkable before publication.'
    ];
    data.limitations = [
      'Production security unverified: no hands-on auth/RLS/secrets/public-visibility test record (explicit in evidence "claims requiring verification").',
      'Exact current pricing/credit limits/plan matrix not final-captured; plans evolve (verify on lovable.dev/pricing immediately before use).',
      'Third-party reports (TechRadar/Proofpoint abuse for phishing/malware; Business Insider Apr 2026 public-project visibility concern) make visibility and moderation important test areas.',
      'Generated app maintainability, export/GitHub/local-build fidelity, and enterprise governance scope unknown.',
      'Full-stack scope increases auth/database/security testing burden (per evidence testing plan).'
    ];
    data.pricing = 'Pricing evidence captured from official FAQ/docs (May 30, 2026): Free (daily/monthly credit limits), Pro $25/month (100 credits), Business $50/month (team features), Enterprise custom; top-up credits $15–$30 per 50. Real cost includes subscription + credits + Supabase/Stripe/domains/storage/APIs. Pricing evidence pending final verification — always re-verify on lovable.dev/pricing before purchase.';
    data.security = 'Official docs mention enterprise governance and real code. Third-party security/visibility controversies reported (Business Insider, TechRadar). Privacy, public/private project visibility, and generated-app data rules untested. Evidence status: in-progress. Enable/test all controls; do not assume secure defaults.';
    data.production = [
      { gate: 'Database / Data', label: 'Evidence pending', note: 'Full-stack + Supabase-style workflows mentioned; RLS/auth testing required per plan 04/12.' },
      { gate: 'Auth', label: 'Evidence pending', note: 'No generated-app auth test record; shared or platform controls unknown.' },
      { gate: 'Deployment', label: 'Evidence pending', note: 'Deploy claims in positioning; no benchmarked publish/expiry behavior.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'Test plan item; no results captured.' },
      { gate: 'Exportability', label: 'Partially verified', note: 'Real code emphasized in official docs; GitHub/export/local build untested (testing plan item 9).' },
      { gate: 'Maintainability', label: 'Evidence pending', note: 'Code review/export test required before "no lock-in" claim.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: '12-step testing plan defined in evidence; none executed in captured record.' },
      { gate: 'Handoff', label: 'Evidence pending', note: 'Enterprise governance mentioned; scope/artifacts pending review.' }
    ];
    data.bestFor = 'Founders, product teams, designers turning product ideas into full-stack web apps with real code visibility.';
    data.avoid = 'Teams requiring audited production security, regulated data handling, or zero hands-on testing before launch (third-party risk signals + unverified gates).';
    data.useCases = [
      'Founders who want prompt-to-app speed + ability to inspect/export real code.',
      'Teams willing to run the 12-item testing plan (auth, privacy, secrets, export, cost) before production use.',
      'Comparisons against Bolt.new, Replit Agent, Base44, Bubble AI.'
    ];
    data.alternatives = 'Replit Agent, Bolt.new (browser prompt-to-app + deploy), Base44 (bundled no-code backend), Bubble AI (visual + AI), v0 (React/UI), Cursor (post-generation code edits). From evidence comparison candidates.';
    data.gaps = [
      'Full hands-on security/production gate results (pending per evidence "in-progress — complete official-source evidence file drafted; security, generated-code, Supabase/auth, deployment, and cost testing required").',
      'Claims requiring verification: production-ready apps, secure-by-default, cheaper than peers, enterprise governance sufficient, real code = no lock-in.',
      'Updated pricing snapshot + credit burn benchmarks.',
      'Abuse/moderation and visibility controls verification.'
    ];
  }

  // Bolt.new
  if (s === 'bolt-new') {
    data.category = 'Prompt-to-app / Browser-based AI app builder';
    data.summary = 'AI-powered website/app/prototype builder and browser-based development environment powered by WebContainers. Prompt-to-code with live runtime, token usage, hosting/database features, and team controls.';
    data.verdict = 'Clear official positioning for websites/apps/prototypes from words + strong technical differentiator (WebContainers in-browser). Database security audit docs and enterprise language captured. Token costs, RLS correctness, generated quality, and export unverified. Moderate confidence on captured sources; low on production outcomes.';
    data.confidence = 'Moderate confidence (official homepage, pricing, support docs captured; hands-on pending)';
    data.evidenceSnapshot = { files: evFiles.length, status: 'Canonical (03)', quality: 'Partial (official + StackBlitz/WebContainers + DB security docs; hands-on pending)', freshness: lastUpdated, gaps: 'Token, database security, generated-code, deployment, export testing required.' };
    data.strengths = [
      'Official homepage: "Build and scale high-performing websites & apps using your words."',
      'Powered by WebContainers (StackBlitz) — browser-tab dev environments (technical fact from stackblitz.com).',
      'Pricing references concrete production features: hosting, custom domains, databases, DB provider choice, SEO, AI image editing, public/private projects.',
      'Official support docs describe database Security settings / Audit that identify missing RLS policies and insecure permissions (testable artifact).',
      'Enterprise plan language includes SSO, audit logs, compliance, admin controls, data governance, SLAs.',
      'Official open-source bolt.diy repo exists (distinguish from hosted).'
    ];
    data.limitations = [
      'Token-based AI usage; repeated debugging can increase consumption — exact costs unbenchmarked (pricing FAQ + test plan).',
      'DB security audit shows feature, not proof of correct auto-configuration; seeded RLS tests required.',
      'WebContainers isolate dev runtime — does not prove generated app security.',
      'Exact current pricing matrix, token rollover, request limits, DB capacity need final capture.',
      'Generated code maintainability, local build, and dependency risk unknown.'
    ];
    data.pricing = 'Pricing evidence from official (bolt.new/pricing): Free use with limits; Pro (no daily token limit, monthly allocation, hosting, DBs); Teams $30/mo per member (central billing, team access); Enterprise custom (advanced security/compliance/SSO/audit/SLAs). Tokens roll over per FAQ. Real cost = tokens + hosting + DB + requests + storage + domains + external services. Verify current before purchase.';
    data.security = 'WebContainers for dev isolation (StackBlitz). DB security settings can flag missing RLS / insecure perms / leaked password protection. Enterprise claims advanced security/governance. Generated app security (RLS correctness, secret exposure, public/private sharing) untested. Test all per support.bolt.new/cloud/database/security.';
    data.production = [
      { gate: 'Database / Data', label: 'Partially verified', note: 'Security settings + RLS audit docs exist and list example warnings (RLS Always True, Search Path Mutable, etc.). Correctness in generated apps pending seeded tests.' },
      { gate: 'Auth', label: 'Evidence pending', note: 'Not explicitly detailed in captured sources; test in benchmark.' },
      { gate: 'Deployment', label: 'Evidence pending', note: 'Hosting + custom domains + publish referenced; stability and privacy settings untested.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'Test plan requires secret-injection + browser bundle inspection.' },
      { gate: 'Exportability', label: 'Partially verified', note: 'Browser IDE + official bolt.diy open-source variant; export/local-build fidelity pending test.' },
      { gate: 'Maintainability', label: 'Evidence pending', note: 'Code structure/dependencies uninspected in evidence.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: '11-step testing plan defined; none executed.' },
      { gate: 'Handoff', label: 'Partially verified', note: 'Teams/Enterprise controls and GitHub-mirror language captured; scope verification pending.' }
    ];
    data.bestFor = 'Solo builders, students, agencies, product teams, frontend/full-stack developers wanting browser-based prompt-to-app with code visibility and built-in hosting/DB options.';
    data.avoid = 'Production use without running RLS/security audit, token cost tracking, secret tests, and export validation (explicit warnings in evidence).';
    data.useCases = [
      'Fast web app/site prototypes with inspectable code in browser IDE.',
      'Builders who value WebContainers isolation + built-in DB + hosting in one tab.',
      'Teams that will run the 11-item test plan (RLS audit, cross-user privacy, token tracking, export) before launch.'
    ];
    data.alternatives = 'Lovable (full-stack real-code), Replit Agent (cloud IDE + deploy + credits), Base44, v0 (UI + Vercel), Cursor (code edits post-gen). From evidence comparison candidates.';
    data.gaps = [
      'Full hands-on security/production (in-progress per 03: token, DB security, generated-code, deployment, export testing required).',
      'Claims requiring verification: production-ready full-stack apps, auto-secure DB perms, cheaper than peers, WebContainers = app security, Enterprise compliant.',
      'bolt.diy vs hosted Bolt.new behavioral comparison.',
      'Updated token accounting + real usage cost table.'
    ];
  }

  // Replit (replit + replit-agent)
  if (s === 'replit' || s === 'replit-agent') {
    data.category = 'Agentic IDE / Prompt-to-app + Cloud deployment';
    data.summary = 'AI app/site builder with natural-language prompts, cloud IDE, collaborative editing, built-in database/storage, publishing, and enterprise controls. Shared responsibility model documented.';
    data.verdict = 'Official AI page + pricing + deployment + shared-responsibility + Security Agent sources captured. Starter 30-day expiry, filesystem warning, and shared-resp model are concrete. Agent safety (destructive actions), cost, and generated quality unverified (third-party incident history noted). Moderate confidence on docs; low on autonomous safety.';
    data.confidence = 'Moderate confidence (official AI/pricing/deployment/security-shared docs captured; hands-on + incident follow-up pending)';
    data.evidenceSnapshot = { files: evFiles.length, status: 'Canonical (01)', quality: 'Partial (official AI page, pricing, deployment pricing, shared-resp model, Security Agent blog; hands-on pending)', freshness: lastUpdated, gaps: 'Agent/security/deployment testing required per evidence.' };
    data.strengths = [
      'Replit AI page: "Make apps & sites with natural language prompts." Homepage: turn ideas into apps in minutes with no coding needed.',
      'Combines prompt generation, cloud IDE, DB/storage, publishing, collaboration in one platform.',
      'Clear shared-responsibility model docs: Replit responsible for Agent/platform/infra; user responsible for app contents and configuration (critical for reviews).',
      'Pricing/deployment docs: Starter (free daily Agent credits, 1 publish project, 30-day expiry), Core ~$25/mo, Pro (pooled credits, no per-user up to 15), Enterprise (SOC-2, SSO/SAML/SCIM, private deploy, Security Center, SBOM).',
      'Security Agent (May 2026 blog) for codebase review using threat-model + Semgrep/HoundDog — testable feature.',
      'Pro/Enterprise governance surface: SSO, admin controls, CVE detection, SBOM downloads.'
    ];
    data.limitations = [
      'Security is explicitly shared responsibility — do not imply Replit secures user app logic automatically.',
      'Starter published apps expire after 30 days (re-publishable); important for free-plan evaluation.',
      'Published app filesystem: docs warn against relying on it for persistent data (use DB/storage).',
      'Agent reliability/safety not verified; 2025 incident (Business Insider) where Agent deleted production DB during external test (CEO apologized) — historical risk signal.',
      '2026 Axios reporting on sensitive data exposure in vibe-coded/public apps across platforms including Replit — category risk.',
      'Costs can exceed subscription: Agent credits + deployment credits + compute/storage/bandwidth.'
    ];
    data.pricing = 'Pricing evidence captured: Starter free (daily Agent credits, built-in DB, 1 publish project that expires 30 days); Core ~$25 monthly; Pro for teams (pooled credits, up to 15 builders no per-user); Enterprise custom. Publishing costs deducted from credits; usage-based after. Verify replit.com/pricing and deployment-pricing docs before use. Real cost includes Agent + deploy + runtime + storage + bandwidth + collaborators.';
    data.security = 'Shared responsibility model (official): Replit for platform/Agent/infra; user for contents/config. Published-app access controls and filesystem caveats documented. Enterprise: SOC-2, SSO, Security Center, SBOM, CVE. Security Agent feature for code review. Third-party exposure and destructive-action history require verification. Test public/private, secrets, rollback.';
    data.production = [
      { gate: 'Database / Data', label: 'Partially verified', note: 'Built-in DB + publishing docs; persistence warning on filesystem (use DB/storage). RLS/auth not tested in generated apps.' },
      { gate: 'Auth', label: 'Evidence pending', note: 'Access controls referenced; cross-user privacy test required.' },
      { gate: 'Deployment', label: 'Partially verified', note: 'Multiple deployment types, custom domains, analytics, access controls documented. Starter 30-day expiry confirmed in docs.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'Test plan item; no results.' },
      { gate: 'Exportability', label: 'Evidence pending', note: 'Cloud IDE; export/local not explicitly benchmarked in evidence.' },
      { gate: 'Maintainability', label: 'Evidence pending', note: 'Iteration quality and code structure in testing plan.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: '12-step plan (incl. Security Agent, destructive action, fake-data integrity); none executed.' },
      { gate: 'Handoff', label: 'Partially verified', note: 'Enterprise controls (SSO/SCIM/private deploy/SBOM) documented; artifact scope pending.' }
    ];
    data.bestFor = 'Nontechnical founders, students, solo builders, developers, teams wanting prompt-to-app + real cloud IDE + one-click-ish publish in browser.';
    data.avoid = 'Production databases or sensitive work without strict constraints/rollback testing (historical Agent delete incident + shared-resp model).';
    data.useCases = [
      'Quick app/site generation + immediate browser preview/deploy with credit model.',
      'Collaborative browser development with built-in DB and publishing.',
      'Users who will follow the 12-step testing plan including Security Agent eval and destructive-action safeguards.'
    ];
    data.alternatives = 'Bolt.new (browser prompt-to-code + DB security docs), Lovable (full-stack real code), Base44, Cursor/Windsurf (when code layer needed). From evidence.';
    data.gaps = [
      'Hands-on Agent/security/deployment (in-progress per 01).',
      'Claims requiring verification: production-ready apps, secure-by-default, Security Agent effectiveness, cheap for full-stack, Agent avoids destructive changes, Enterprise SOC-2 covers all.',
      'Cost tracking table (Agent + deploy credits + runtime).',
      'Follow-up on 2025 DB-delete incident safeguards and 2026 exposure reports.'
    ];
  }

  // Cursor
  if (s === 'cursor') {
    data.category = 'AI IDE / Agentic coding editor';
    data.summary = 'AI-native code editor with autocomplete, chat, Agent mode, Rules/Skills/MCP, CLI, model selection, Privacy Mode, Teams/Enterprise. For developers working in existing codebases.';
    data.verdict = 'High-quality official docs for workflows (Agent, Rules, models, Teams), Privacy Mode (zero retention with supported providers), and models/pricing captured. Not a no-code tool. Agent productivity, dependency security (Chainguard partnership noted), and enterprise controls unverified hands-on. High confidence on official privacy/docs claims; low on outcome metrics.';
    data.confidence = 'High confidence on captured official docs/privacy (05_cursor_complete); Moderate on productivity/enterprise (hands-on pending)';
    data.evidenceSnapshot = { files: evFiles.length, status: 'Canonical (05)', quality: 'Strong (official docs + pricing + privacy + models + third-party security notes; hands-on repo/agent testing pending)', freshness: lastUpdated, gaps: 'Repository, agent, privacy-mode, security, cost testing required.' };
    data.strengths = [
      'Official homepage + docs cover Agent mode, Rules, Skills, MCP servers, CLI, models, Teams & Enterprise setup in depth.',
      'Privacy Mode clearly documented: enable to prevent code data from being stored by model providers or used for training (subject to provider scope; official pricing + privacy docs).',
      'Models/pricing docs provide basis for measurable cost testing by model and usage pool; admin dashboard for usage visibility.',
      'Agentic features + team controls make it relevant for serious engineering teams (safe claims from 05).',
      'Axios Apr 2026: partnered with Chainguard to reduce risk from vulnerable/malicious open-source deps in AI-generated code (directional security context).'
    ];
    data.limitations = [
      'Not a no-code tool: requires developer workflow, code review, and engineering practices (official category + docs).',
      'Privacy protection depends on mode/settings + provider scope; must verify before sensitive code use.',
      'Agent quality, dependency security, and enterprise controls unverified (requires repo benchmark per testing plan in evidence).',
      'Frontier model costs volatile; exact plan names (Hobby/Pro/Teams/Enterprise) + overages need final capture.',
      'Wired Apr 2026 context on new agent experience vs Claude Code/Codex — competitive but unbenchmarked here.'
    ];
    data.pricing = 'Official pricing + models-and-pricing docs captured (cursor.com/pricing, cursor.com/docs/models-and-pricing). Plans include usage pools, per-model API rates, admin usage dashboard. Privacy Mode available to users/admins. Exact current prices, included usage, BYOK, team controls require final account/pricing capture before publication. Verify cursor.com/pricing.';
    data.security = 'Privacy Mode: code data never stored by supported model providers or used for training (docs + pricing page). Admin dashboard for usage. Chainguard partnership for dep risk reduction (Axios). Agent diffs, dependency suggestions, and enterprise controls require hands-on. Enable Privacy Mode for sensitive repos; test agent behavior per evidence priority.';
    data.production = [
      { gate: 'Database / Data', label: 'Not applicable', note: 'Code editor/IDE; data layer is user codebase + external DBs the user connects.' },
      { gate: 'Auth', label: 'Partially verified', note: 'Teams/Enterprise setup documented; SSO/admin controls in pricing/docs.' },
      { gate: 'Deployment', label: 'Not applicable', note: 'User handles deploy of edited code.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'No specific secret-handling benchmark in editor context captured.' },
      { gate: 'Exportability', label: 'Verified', note: 'Native desktop editor (Mac/Win/Linux implied); code is local/user repo by design.' },
      { gate: 'Maintainability', label: 'Partially verified', note: 'Designed for real codebases; Rules/Skills/MCP for context; agent edits still need human review.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: 'Repo benchmark + agent task suite in testing plan; not executed.' },
      { gate: 'Handoff', label: 'Partially verified', note: 'Teams/Enterprise, admin dashboard, usage metrics documented.' }
    ];
    data.bestFor = 'Developers, engineering teams, startup product engineers, enterprises working in existing codebases who want high-leverage AI assistance inside a real IDE.';
    data.avoid = 'Nontechnical users expecting no-code app creation without reading/editing code (explicit category boundary).';
    data.useCases = [
      'Editing, refactoring, and agentic work on real repositories with context (Rules, @-mentions, etc.).',
      'Teams that value Privacy Mode + usage controls + model choice.',
      'Post-generation code stewardship after using prompt-to-app tools (Lovable/Bolt output → Cursor edits).'
    ];
    data.alternatives = 'Windsurf (agentic IDE/Cascade competitor), Claude Code, OpenAI Codex, GitHub Copilot Workspace, Replit for cloud IDE. From evidence + index.';
    data.gaps = [
      'Full hands-on repository/agent/privacy-mode/security/cost testing (explicit in 05 evidence status).',
      'Exact current pricing + per-model rates + BYOK behavior.',
      'Agent productivity metrics and false-positive rate on edits/tests.',
      'Dependency security outcomes via Chainguard integration.'
    ];
  }

  // Windsurf
  if (s === 'windsurf') {
    data.category = 'AI IDE / Agentic coding';
    data.summary = 'Agent-powered IDE with Cascade agent that codes/fixes/thinks ahead. Full editor + autocomplete + contextual assistance, model options (SWE, Claude, GPT, BYOK), usage plans, enterprise features. Desktop on Mac/Win/Linux.';
    data.verdict = 'Official positioning around Cascade agent + editor availability + model/BYOK/usage docs captured. Active development signals (code review, agent command). Not no-code. Agent edits, review quality, privacy by model, and enterprise compliance unverified. Moderate confidence on captured docs; low on autonomous outcomes.';
    data.confidence = 'Moderate confidence (official homepage, editor page, models, usage docs captured 06; hands-on pending)';
    data.evidenceSnapshot = { files: evFiles.length, status: 'Canonical (06)', quality: 'Partial (official Cascade/agent/IDE claims + plans/usage/models; hands-on repo/agent testing pending)', freshness: lastUpdated, gaps: 'Agent quality, code review, BYOK, enterprise artifacts pending.' };
    data.strengths = [
      'Homepage positions Cascade as “an agent that codes, fixes and thinks 10 steps ahead.”',
      'Full editor + agentic IDE posture with autocomplete, contextual assistance, model options, usage plans, enterprise features (evidence 06).',
      'Editor page supports local desktop usage on major OSes — code stays local vs cloud-only.',
      'Docs reference SWE models, Claude, GPT, and BYOK options (data routing/privacy vary by choice).',
      'Usage tracking and plan docs (Free → Pro/Teams/Enterprise) provide test dimensions.',
      'Recent product-stream items on code review feature and agent command indicate active iteration.'
    ];
    data.limitations = [
      'Agentic IDE for developers; not pure no-code. Must compare with Cursor/Claude Code/Codex primarily.',
      'Exact current prices/quotas not captured in evidence pass; final pricing capture required.',
      'Agent quality, multi-file task success, and rollback behavior unverified (repo benchmark required).',
      'Compliance claims (third-party mentions of SOC/FedRAMP/HIPAA) not verified from official artifact in this pass.',
      'Model routing/privacy may vary by provider/BYOK; provider-specific review needed.'
    ];
    data.pricing = 'Official docs cover plans/usage tracking and upgrading from Free to Pro, Teams, or Enterprise. Exact prices, quotas, and overages not matrix-captured in evidence; recheck windsurf.com and docs.windsurf.com before publication. Usage tracking is a documented feature.';
    data.security = 'Local desktop editor reduces some cloud-retention risk vs fully hosted. BYOK option for model control. Enterprise plan exists; exact security scope/compliance artifacts not captured in evidence (third-party claims exist — do not publish without official). Code review feature and Cascade edits require accuracy/false-negative testing.';
    data.production = [
      { gate: 'Database / Data', label: 'Not applicable', note: 'Code editor; user manages own DBs in edited projects.' },
      { gate: 'Auth', label: 'Evidence pending', note: 'Teams/Enterprise mentioned; no specific auth artifact for IDE access captured.' },
      { gate: 'Deployment', label: 'Not applicable', note: 'User deploys edited code.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'BYOK and local nature help, but no secret-specific test in evidence.' },
      { gate: 'Exportability', label: 'Verified', note: 'Local desktop editor on Mac/Win/Linux; code is user filesystem by design.' },
      { gate: 'Maintainability', label: 'Partially verified', note: 'Designed for real codebases + code review feature; agent edits still need engineer oversight.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: 'Testing plan items (repo onboarding, Cascade task, bug fix, code review on seeded vulns) defined; none executed.' },
      { gate: 'Handoff', label: 'Evidence pending', note: 'Enterprise plan; trust/security artifacts required per evidence.' }
    ];
    data.bestFor = 'Developers and technical founders doing AI-assisted coding in existing or new repos, who want agentic multi-step edits (Cascade) + local control + model choice.';
    data.avoid = 'Non-coders or teams expecting no-code app generation (category mismatch).';
    data.useCases = [
      'Code-native vibe builders who want Cursor-class alternative with Cascade agent.',
      'Users who prefer local desktop + BYOK for privacy/control.',
      'Teams running seeded vulnerability review tests and agent task benchmarks before adoption.'
    ];
    data.alternatives = 'Cursor (primary), Claude Code, OpenAI Codex, GitHub Copilot Workspace, Replit (cloud). From evidence comparison candidates.';
    data.gaps = [
      'Agent edits untested (multi-file production tasks, bug fixes without masking tests).',
      'Code review accuracy/false positives on seeded issues.',
      'BYOK routing, billing, and privacy outcomes.',
      'Official security/compliance artifacts for Enterprise (vs third-party claims).',
      'Updated pricing/quotas + cost benchmark vs Cursor.'
    ];
  }

  // v0
  if (s === 'v0') {
    data.category = 'UI generation / AI web app builder';
    data.summary = 'AI web app/UI generator with visual Design Mode, GitHub sync, and Vercel deployment workflow. Credit-based; Free and Team plans documented.';
    data.verdict = 'Official pricing with specific Free ($0, $5 credits, 7 msg/day, Vercel deploy, Design Mode, GitHub sync) and Team ($30/user/mo) captured. Strong for React/Next.js front-end scaffolds. Backend, auth, data model, full-app security unverified. Moderate-high confidence on pricing/deploy claims; low on full-app production.';
    data.confidence = 'Moderate confidence (09_v_0 pricing + deploy + Design + GitHub captured; hands-on prompt-to-app + security pending)';
    data.evidenceSnapshot = { files: evFiles.length, status: 'Canonical (09)', quality: 'Partial (official v0.app/pricing + Vercel context; generated app security/maintainability pending)', freshness: lastUpdated, gaps: 'Full-app security, backend, auth, data model, maintainability after visual edits.' };
    data.strengths = [
      'AI web app/UI generator with visual Design Mode, GitHub sync, and Vercel deployment workflow (evidence 09).',
      'Strong for React/Next.js-style front-end scaffolds and rapid UI iteration from prompts.',
      'Credit-based pricing + direct deploy path documented in official sources.',
      'Free: $0/month, $5 included monthly credits, deploy to Vercel, Design Mode, GitHub sync, 7 messages/day.',
      'Team: $30/user/month, $30 monthly credits/user + daily top-ups, centralized billing, shared credits/chats/collaboration.',
      'GitHub sync creates inspectable code/repo workflow rather than opaque output.'
    ];
    data.limitations = [
      'Primarily front-end / React UI generation. Backend, auth, data model, and full-app security unverified (hands-on prompt-to-app + deploy tests required per 09).',
      'Free plan message/day limit impacts iteration speed.',
      'Team plan cost scales per user + separate Vercel resource costs (compute, bandwidth, DB, etc.).',
      'Visual edits (Design Mode) may affect code maintainability — post-edit code quality untested.',
      'Generated app security (secrets, auth, API routes, deps) has no proof in captured evidence.'
    ];
    data.pricing = 'Pricing evidence captured May 30, 2026 from v0.app/pricing: Free $0 (5 monthly credits, 7 messages/day, Vercel deploy, Design Mode, GitHub sync); Team $30/user/mo (30 credits/user/mo + daily, centralized billing, shared). Vercel Hobby free / Pro $20/mo separate; billable usage (compute/bandwidth/storage) applies. Total cost = v0 credits + Vercel resources. Verify current v0.app/pricing and vercel.com/pricing.';
    data.security = 'Deploy to Vercel (WAF/CDN/DDoS on higher plans per Vercel docs). GitHub sync for code ownership. No evidence proves generated apps have correct auth/data/security defaults. Test secrets, auth, routes, deps, and post-Design-Mode code. Vercel resource billing separate dimension.';
    data.production = [
      { gate: 'Database / Data', label: 'Evidence pending', note: 'Not in v0 core scope; user adds via Vercel/Supabase/etc. after GitHub sync.' },
      { gate: 'Auth', label: 'Evidence pending', note: 'No auth generation proof captured; test in full-app benchmark.' },
      { gate: 'Deployment', label: 'Partially verified', note: 'One-click Vercel deploy documented; success + config behavior untested in evidence.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'Test plan requires secret + bundle inspection.' },
      { gate: 'Exportability', label: 'Partially verified', note: 'GitHub sync documented; branch/ownership/permission behavior pending test.' },
      { gate: 'Maintainability', label: 'Evidence pending', note: 'Code after Design Mode visual edits; duplication risk uninspected.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: 'Testing plan defined (prompt-to-app, GitHub, security checklist); none executed.' },
      { gate: 'Handoff', label: 'Partially verified', note: 'GitHub + Vercel gives standard web dev handoff path; team collab in v0 Team.' }
    ];
    data.bestFor = 'React/Next.js UI generation, front-end scaffolds, designers/developers wanting visual + code loop with fast Vercel publish.';
    data.avoid = 'Full-stack production apps without pairing (e.g. with Cursor or backend tool) and without security testing (explicit limitation in evidence).';
    data.useCases = [
      'Landing pages, dashboards, marketing sites, or UI-heavy MVPs in React/Next + Vercel.',
      'Designers who want prompt + Design Mode then hand off code via GitHub.',
      'Builders who will run full-app + security tests after v0 generation.'
    ];
    data.alternatives = 'Bolt.new (fuller browser app + DB), Lovable (full-stack), Replit, Framer/Webflow (pure site), Builder.io (design-to-code). From evidence 09 comparisons.';
    data.gaps = [
      'Backend/auth/data model/full-app security unverified (09 testing plan).',
      'Post-Design-Mode maintainability and code quality.',
      'Real Vercel resource cost + v0 credit burn on realistic prompts.',
      'Updated credit/message limits (volatile per evidence).'
    ];
  }

  // Webflow (webflow + webflow-ai)
  if (s === 'webflow' || s === 'webflow-ai') {
    data.category = 'Site generation / No-code incumbent + AI';
    data.summary = 'AI-assisted site design inside a mature, established website builder. AI Assistant for sections/copy; Optimize for AI-powered personalization. SOC 2 Type II + ISO 27001 via Trust Center.';
    data.verdict = 'Supplemental evidence (18) + official AI/Optimize/Trust Center/pricing sources captured. Relevant as incumbent responding to AI wave. Not general AI app builder. AI output still needs accessibility/brand/legal review. Moderate confidence on platform posture; low on AI-generated site outcomes.';
    data.confidence = 'Moderate confidence (official AI update, Optimize, Trust Center, pricing change May 2026 captured; hands-on AI workflow pending)';
    data.evidenceSnapshot = { files: evFiles.length, status: 'Supplemental (18)', quality: 'Partial (official AI/Optimize/Trust Center + May 2026 pricing note; generated-site testing pending)', freshness: lastUpdated, gaps: 'AI-site workflow, accessibility, conversion, compliance transfer pending.' };
    data.strengths = [
      'AI-assisted site design inside a mature, established website builder (supplemental evidence 18).',
      'Relevant as incumbent no-code platform adding AI capabilities for marketing/landing sites.',
      'Webflow AI Assistant (official update): in-context help, generate sections and copy.',
      'Webflow Optimize: AI-powered personalization/optimization feature.',
      'Trust Center: SOC 2 Type II and ISO 27001 independently audited (exact scope: security/availability).',
      'Free Starter path + paid site/workspace plans; May 2026 pricing change documented (recheck required).'
    ];
    data.limitations = [
      'AI features are assists inside larger platform; full AI-app-builder vs incumbent tradeoffs need hands-on (supplemental evidence notes slower or narrower loops for some).',
      'Not a general AI app builder — compare mainly with Framer, Wix, Squarespace, Builder.io (not Replit/Lovable).',
      'AI-generated copy/sections require brand, accessibility, privacy, and legal review (reasoned + official context).',
      'AI optimization/personalization requires consent/privacy/cookie and analytics governance.',
      'Compliance (SOC 2/ISO) does not automatically transfer to every site built on platform.',
      'Pricing changed May 2026; CMS limits, bandwidth, Analyze/Optimize, seats, Enterprise terms volatile.'
    ];
    data.pricing = 'Official pricing sources captured; exact tier prices, CMS limits, bandwidth, Analyze/Optimize costs, workspace seats, and Enterprise terms must be recaptured immediately before publication (May 2026 change noted). Starter free path exists. Total cost includes site plans + workspace + add-ons + third-party. Verify webflow.com/pricing.';
    data.security = 'Trust Center evidence: SOC 2 Type II and ISO 27001 for Webflow platform controls (report access via help/trust center). Does not prove every Webflow site is compliant. AI-generated copy still needs legal/privacy review. Custom headers and site-specific security are builder responsibility.';
    data.production = [
      { gate: 'Database / Data', label: 'Partially verified', note: 'CMS collections documented in pricing; data model in visual builder.' },
      { gate: 'Auth', label: 'Partially verified', note: 'Webflow has auth/user system; membership/Enterprise features.' },
      { gate: 'Deployment', label: 'Verified', note: 'Mature Webflow hosting with CDN/SSL; plan-dependent.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'Platform secrets/integrations; site-specific not in AI scope.' },
      { gate: 'Exportability', label: 'Partially verified', note: 'Export code/zip available on higher plans; fidelity vs AI edits pending.' },
      { gate: 'Maintainability', label: 'Partially verified', note: 'Visual + CMS is designed for ongoing management by non-devs; AI adds generated sections.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: 'AI workflow test + accessibility/SEO/legal review required per testing plan.' },
      { gate: 'Handoff', label: 'Partially verified', note: 'Enterprise + workspace seats + client billing paths exist.' }
    ];
    data.bestFor = 'Marketing sites, landing pages, content sites, and web experiences where mature no-code visual builder + AI assists for speed is preferred over pure prompt-to-app.';
    data.avoid = 'Complex full-stack apps or teams expecting autonomous app logic/security from AI (scope mismatch).';
    data.useCases = [
      'Design/marketing teams building high-quality sites with AI section/copy acceleration inside Webflow ecosystem.',
      'Users who value platform compliance posture (SOC 2/ISO) and need to layer their own accessibility/SEO/governance.',
      'Comparisons of incumbent + AI vs pure AI site builders (Framer, v0, Builder).'
    ];
    data.alternatives = 'Framer AI (closest), Builder.io Fusion, v0 (React/Vercel), Squarespace/Wix AI, Relume. From evidence 18.';
    data.gaps = [
      'Hands-on AI-site workflow, conversion lift, accessibility of AI output (testing plan).',
      '“Webflow AI builds complete production websites” unverified (sections/copy + optimization only).',
      'Compliance transfer to customer sites.',
      'Updated post-May-2026 pricing + full cost model (CMS, bandwidth, Optimize).'
    ];
  }

  // Bubble (bubble + bubble-ai)
  if (s === 'bubble' || s === 'bubble-ai') {
    data.category = 'No-code app + AI';
    data.summary = 'Traditional no-code web/mobile app builder with AI-assisted app generation (beta per docs). Generates foundational design/structure/DB/workflows from prompt; user refines visually. Privacy rules + SOC 2 Type II platform.';
    data.verdict = 'Supplemental (16) + official AI generator page, manual, privacy rules, SOC 2 captured. AI generator framed as beta/foundational starting point, not complete production app. Privacy rules and SOC2-not-transfer warnings are strong. Moderate confidence on platform docs; low on AI-generated app quality/security.';
    data.confidence = 'Moderate confidence (official AI generator, privacy, SOC 2 docs captured; hands-on app/security testing pending)';
    data.evidenceSnapshot = { files: evFiles.length, status: 'Supplemental (16)', quality: 'Partial (AI generator docs + privacy rules + SOC 2 + pricing; beta + hands-on pending)', freshness: lastUpdated, gaps: 'Generated app quality, privacy implementation, workload cost, mobile parity pending.' };
    data.strengths = [
      'Traditional no-code app platform with AI assistance; more explicit control and logic than pure prompt-to-app (supplemental 16).',
      'Bubble’s AI app generator lets you build complete apps in minutes (official product page + manual).',
      'Manual: AI generation creates foundational design and structure (pages, DB, workflows) that users refine/customize in visual editor.',
      'AI Agent can create/edit data types and fields (data-tab docs).',
      'Documented privacy-rule system for controlling access to data types; explicit warning: never deploy apps with sensitive data without proper privacy rules.',
      'Platform is SOC 2 Type II compliant; docs clearly state platform compliance does not automatically make individual apps compliant.'
    ];
    data.limitations = [
      'AI features are assists inside larger platforms; full AI-app-builder vs incumbent tradeoffs need hands-on (supplemental evidence notes slower or narrower loops for some).',
      'AI generator was described as beta (manual at capture time — recheck status).',
      'Generated app security is not guaranteed; privacy rules must be implemented correctly by user (cross-user data tests required).',
      'Workload pricing can affect operating cost as apps scale (needs benchmark).',
      'Abuse risk exists for hosted app platforms (third-party phishing reports on Bubble-hosted apps).'
    ];
    data.pricing = 'Official pricing page/manual: start building for free; upgrade to Starter (or higher Web/Mobile/Web+Mobile) when ready to launch. Plans are project-level. Workload usage tiers apply as apps grow. Enterprise options. AI-generator specific cost not isolated. Verify bubble.io/pricing and manual billing docs.';
    data.security = 'Privacy rules (core feature) + explicit docs warning for sensitive data. SOC 2 Type II for platform (manual.bubble.io). Platform SOC 2 does not transfer to apps. Test every generated app for cross-user access, workflow permissions, and exposed data. Hosted domain/login behavior for abuse vectors per third-party notes.';
    data.production = [
      { gate: 'Database / Data', label: 'Partially verified', note: 'Built-in DB + data types + AI data generation documented; privacy rules are the control layer.' },
      { gate: 'Auth', label: 'Partially verified', note: 'Bubble has user auth/accounts; privacy rules apply on top.' },
      { gate: 'Deployment', label: 'Partially verified', note: 'Launch/publish paths exist; workload and custom domain on paid.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'Plugin/API secret handling in platform; test in generated apps.' },
      { gate: 'Exportability', label: 'Evidence pending', note: 'Visual builder lock-in vs code export (FlutterFlow comparison in evidence); not primary for Bubble.' },
      { gate: 'Maintainability', label: 'Partially verified', note: 'Visual editor + workflows designed for ongoing non-dev maintenance.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: '10-step plan (prompt-gen, data model, privacy-rule test, workload, security checklist); none executed.' },
      { gate: 'Handoff', label: 'Partially verified', note: 'Enterprise security/compliance options; client billing paths exist.' }
    ];
    data.bestFor = 'Nontechnical founders, operators, agencies, businesses building web/mobile apps who want visual control + AI to bootstrap the initial structure, then iterate in no-code.';
    data.avoid = 'Teams expecting secure-by-default generated apps or SOC2 for the app without implementing privacy rules and testing (explicit warnings).';
    data.useCases = [
      'Internal tools, marketplaces, CRMs, portals where Bubble’s visual logic + privacy model fits.',
      'Users who will implement and test privacy rules + workload cost before sensitive data.',
      'Comparisons of traditional no-code + AI (Bubble) vs pure prompt-to-app (Lovable/Bolt).'
    ];
    data.alternatives = 'FlutterFlow AI, Glide AI, Softr AI, Adalo, Base44, Webflow (for lighter sites). From evidence 16 comparisons.';
    data.gaps = [
      'Generated app quality, privacy implementation, workload cost, mobile/web parity (testing plan).',
      '“Bubble AI builds complete production apps” unverified (foundational/beta framing).',
      '“AI-generated Bubble apps are secure by default” contradicted by privacy docs.',
      'Updated pricing + workload benchmarks.'
    ];
  }

  // Framer (framer + framer-ai)
  if (s === 'framer' || s === 'framer-ai') {
    data.category = 'Site generation / AI-assisted website builder';
    data.summary = 'AI-assisted website creation with layout/page generation, Wireframer, responsive starter content. Free plan limits documented. SOC 2 Type 1/2 + ISO for platform; Enterprise trust artifacts.';
    data.verdict = 'Supplemental (19) + official AI page, pricing FAQ, legal/security pages captured. Fast layout/content generation for sites. Not full app builder. Generated sites need accessibility/legal/privacy/SEO review. Moderate confidence on platform security docs; low on AI output quality.';
    data.confidence = 'Moderate confidence (official AI/Wireframer, pricing, SOC2/ISO captured; hands-on site quality pending)';
    data.evidenceSnapshot = { files: evFiles.length, status: 'Supplemental (19)', quality: 'Partial (AI page + Wireframer + pricing limits + security pages; generated-site testing pending)', freshness: lastUpdated, gaps: 'Design/content/accessibility/SEO of AI sites pending.' };
    data.strengths = [
      'Fast generation of landing pages and marketing sites; visual editing strengths (supplemental 19).',
      'Framer AI page supports fast layout/content generation; Wireframer provides concrete testable AI workflow for responsive starter pages.',
      'Official pricing FAQ: Free projects include 10 CMS collections, 1,000 pages, 5 MB uploads, one free locale trial; custom domain requires paid.',
      'Framer completed SOC 2 Type 1 and Type 2 audits (security + availability scope per legal/security page).',
      'Enterprise: ISO 27001:2022 certified (evidence in Trust Center for Enterprise customers).',
      'Help docs caution that local privacy laws may require different cookie-banner formats (builder responsibility).'
    ];
    data.limitations = [
      'Mainly website-focused, not full app-builder evidence (compare with Webflow/Builder.io more than Replit/Codex).',
      'Generated-site quality (design, content accuracy, accessibility, brand fit) not verified (no hands-on test record).',
      'Compliance does not automatically transfer to each site (security scope reasoning).',
      'Pricing may vary by editors/usage, CMS scale, localization, analytics (official subscriptions help).',
      'Local cookie/privacy obligations remain user responsibility (official GDPR/cookie help).'
    ];
    data.pricing = 'Pricing evidence captured: Free (10 CMS, 1k pages, 5MB uploads, locale trial); custom domain requires paid plan. Basic/Pro monthly/annual; Scale annual-only. Additional editors/usage may create extra charges. Enterprise plan with trust artifacts. Verify framer.com/pricing and help subscriptions before use.';
    data.security = 'SOC 2 Type 1/2 (security + availability) and Enterprise ISO 27001 documented. Privacy Statement and GDPR/cookie help pages exist. AI-generated pages still require brand/legal/accessibility/privacy/cookie/SEO review. No proof AI sites are secure/compliant out of box.';
    data.production = [
      { gate: 'Database / Data', label: 'Partially verified', note: 'CMS collections in Free limits; data binding in visual builder.' },
      { gate: 'Auth', label: 'Evidence pending', note: 'Framer has auth/membership features on paid; not core to AI gen scope.' },
      { gate: 'Deployment', label: 'Verified', note: 'Framer hosting with custom domains on paid plans; CDN/SSL standard.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'Integrations/secrets in platform; site-specific not detailed in AI evidence.' },
      { gate: 'Exportability', label: 'Partially verified', note: 'Code export available on higher plans; AI-generated code fidelity pending.' },
      { gate: 'Maintainability', label: 'Partially verified', note: 'Visual + CMS designed for ongoing site management.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: 'AI workflow + accessibility/SEO/legal review required.' },
      { gate: 'Handoff', label: 'Partially verified', note: 'Enterprise plan + agency/freelancer paths; client handoff via published site.' }
    ];
    data.bestFor = 'Designers, marketers, freelancers, agencies building landing pages, marketing sites, and interactive web experiences with AI acceleration + visual control.';
    data.avoid = 'Full-stack apps or teams expecting autonomous production websites without human design/content/accessibility QA (scope + evidence limits).';
    data.useCases = [
      'High-fidelity marketing/landing sites with AI Wireframer + visual polish.',
      'Teams that value SOC 2/ISO platform posture and will add their own accessibility/SEO/governance layer.',
      'Comparisons vs Webflow AI, v0, Builder.io for site generation.'
    ];
    data.alternatives = 'Webflow AI (closest incumbent), Builder.io Fusion, v0 (code-oriented), Squarespace/Wix AI, Relume. From evidence 19.';
    data.gaps = [
      'Generated-site quality, accessibility, SEO, brand fit, conversion (no hands-on record).',
      '“Framer AI creates production websites” unverified (layouts + starter content).',
      'Post-export code maintainability after AI gen.',
      'Updated pricing + editor/usage/CMS cost model.'
    ];
  }

  // Shopify (optional, no dedicated ev — fully pending labels)
  if (s === 'shopify') {
    data.category = 'Ecommerce / Site builder';
    data.summary = 'Evidence capture pending — no dedicated file in docs/evidence/. Broader ecommerce context referenced in empire planning docs (ref only, not publishable claims).';
    data.verdict = 'Evidence capture pending for Shopify. No NoCodeReviewed evidence file (01–27 series) exists. Do not rely on any platform claims until a verified evidence file is captured and reviewed. Evidence pending.';
    data.confidence = 'Evidence pending';
    data.evidenceSnapshot = { files: 0, status: 'Evidence pending', quality: 'Pending', freshness: 'N/A', gaps: 'No dedicated evidence file. Capture required before any review content.' };
    data.strengths = ['Evidence pending — see gaps.'];
    data.limitations = ['No verified evidence file captured for Shopify in current manifest. All claims require new source pass and hands-on.'];
    data.pricing = 'Pricing evidence pending. Verify current pricing before purchase.';
    data.security = 'Security & trust evidence pending. Auth, data ownership, PCI, export, and app ecosystem posture require dedicated evidence file.';
    data.production = [
      { gate: 'Database / Data', label: 'Evidence pending', note: 'No evidence file.' },
      { gate: 'Auth', label: 'Evidence pending', note: 'No evidence file.' },
      { gate: 'Deployment', label: 'Evidence pending', note: 'No evidence file.' },
      { gate: 'Secrets', label: 'Evidence pending', note: 'No evidence file.' },
      { gate: 'Exportability', label: 'Evidence pending', note: 'No evidence file.' },
      { gate: 'Maintainability', label: 'Evidence pending', note: 'No evidence file.' },
      { gate: 'Testing / QA', label: 'Evidence pending', note: 'No evidence file.' },
      { gate: 'Handoff', label: 'Evidence pending', note: 'No evidence file.' }
    ];
    data.bestFor = 'Evidence pending.';
    data.avoid = 'Any production decision before a verified evidence file and hands-on review exist.';
    data.useCases = ['Evidence pending — do not use for recommendations.'];
    data.alternatives = 'Evidence pending. See #tools for adjacent ecommerce/site tools with or without evidence.';
    data.gaps = ['No dedicated evidence file in docs/evidence/ for Shopify (manifest confirms missing or unnumbered).', 'Pricing, security, production, benchmarks, and claims all pending capture.', 'Broader mentions in planning docs are reference only, not evidence.'];
  }

  return data;
}

function ncrToolMicrositeFunnel(slug) {
  const tool = getToolData(slug);
  const theme = getToolTheme(slug);
  const evFiles = getEvidenceForTool(slug);
  const hasEv = evFiles.length > 0;
  const evStatus = hasEv ? 'Evidence available' : 'Evidence pending';
  const themeClass = `tool-theme-${theme}`;

  // Brand-inspired CTAs (use public domains from evidence where available; C2 extended)
  let tryUrl = '#';
  let tryLabel = `Try ${tool.name}`;
  const safeTryUrls = {
    'lovable': 'https://lovable.dev',
    'bolt-new': 'https://bolt.new',
    'replit': 'https://replit.com',
    'replit-agent': 'https://replit.com',
    'cursor': 'https://cursor.com',
    'windsurf': 'https://windsurf.com',
    'v0': 'https://v0.dev',
    'framer-ai': 'https://framer.com',
    'webflow-ai': 'https://webflow.com',
    'bubble-ai': 'https://bubble.io',
    'framer': 'https://framer.com',
    'webflow': 'https://webflow.com',
    'bubble': 'https://bubble.io'
  };
  if (safeTryUrls[slug]) { tryUrl = safeTryUrls[slug]; }
  // For shopify/make/zapier/notion/airtable + others without verified in-evidence primary CTA: keep # + "Official site link pending" label below

  const disclosure = tryUrl !== '#' ? `<div class="affiliate-disclosure">NoCodeReviewed may earn a commission if you sign up through this link. Reviews and recommendations are evidence-based and independent.</div>` : '';

  const tutorialsLink = `#tool/${slug}/tutorials`;

  const html = `
  <div class="tool-funnel-page ${themeClass}">
    ${premiumNav('microsites')}
    <div class="ncr-container">
      <!-- Hero (brand inspired) -->
      <section class="tool-funnel-hero">
        <div style="max-width:720px;margin:0 auto;">
          <div class="tool-logo-row" style="justify-content:center;margin-bottom:8px;">
            ${toolLogoMarkup(tool, 36, "tool-logo")}
          </div>
          <div style="font-size:12px;letter-spacing:1.5px;opacity:0.7;margin-bottom:8px;">NO CODEREVIEWED • MICROSITE FUNNEL</div>
          <h1 style="font-size:42px;line-height:1.05;margin:0 0 12px;font-weight:800;">${tool.name}</h1>
          <p style="font-size:18px;max-width:560px;margin:0 auto 20px;opacity:0.9;">${tool.bestFor || 'Build faster with AI.'}</p>
          <div>
            <a class="tool-funnel-cta" href="${tryUrl}" target="_blank" rel="noopener" style="background:var(--tool-accent,#3b82f6);color:#fff;">${tryLabel}</a>
            <a class="tool-funnel-cta" href="#review/${slug}" style="background:transparent;border:1px solid var(--tool-border,#1e2744);color:inherit;">Read the full evidence review</a>
          </div>
          ${disclosure}
        </div>
      </section>

      <!-- Best fit (C2: evidence-grounded where available or pending) -->
      <section class="ncr-container" style="padding:20px 0;">
        <h2 style="margin:0 0 12px;font-size:18px;">Best for</h2>
        <div class="tool-funnel-grid">
          ${slug==='cursor' || slug==='windsurf' ? 
            `<div class="tool-funnel-card"><strong>Developers &amp; engineering teams</strong><p style="font-size:13px;opacity:0.85;margin-top:8px;">AI-native code editing, agentic refactors, and repo-level work in existing codebases (safe claims from evidence 05/06).</p></div>
             <div class="tool-funnel-card"><strong>Technical founders</strong><p style="font-size:13px;opacity:0.85;margin-top:8px;">High-leverage coding assistance when vibe prototypes need real code stewardship or complex logic.</p></div>` :
            slug==='v0' ?
            `<div class="tool-funnel-card"><strong>Frontend / React builders</strong><p style="font-size:13px;opacity:0.85;margin-top:8px;">Prompt-to-UI + visual edit + Vercel deploy for landing pages, prototypes, and component scaffolds (evidence 09).</p></div>` :
            (slug==='webflow-ai' || slug==='webflow') ?
            `<div class="tool-funnel-card"><strong>Marketing sites &amp; landing pages</strong><p style="font-size:13px;opacity:0.85;margin-top:8px;">AI-assisted design inside established no-code site builder (supplemental evidence 18).</p></div>` :
            (slug==='bubble-ai' || slug==='bubble') ?
            `<div class="tool-funnel-card"><strong>Traditional no-code apps</strong><p style="font-size:13px;opacity:0.85;margin-top:8px;">Apps needing explicit control + AI assistance for logic/data (supplemental 16).</p></div>` :
            (slug==='framer-ai' || slug==='framer') ?
            `<div class="tool-funnel-card"><strong>Fast visual marketing sites</strong><p style="font-size:13px;opacity:0.85;margin-top:8px;">Landing pages generated quickly; not a full vibe-app environment (supplemental 19).</p></div>` :
            (['shopify','make','zapier','notion','airtable'].includes(slug)) ?
            `<div class="tool-funnel-card"><strong>Category fit (evidence pending)</strong><p style="font-size:13px;opacity:0.85;margin-top:8px;">See empire planning docs for category context (ecommerce/automation/data). No dedicated evidence file yet — details pending capture.</p></div>` :
            `<div class="tool-funnel-card"><strong>Founders &amp; prototypes</strong><p style="font-size:13px;opacity:0.85;margin-top:8px;">${tool.bestFor || 'Rapid iteration with AI assistance.'}</p></div>
             <div class="tool-funnel-card"><strong>Teams needing speed</strong><p style="font-size:13px;opacity:0.85;margin-top:8px;">Natural language to working features where evidence supports.</p></div>`
          }
          <div class="tool-funnel-card">
            <strong>Evidence status</strong>
            <p style="font-size:13px;opacity:0.85;margin-top:8px;">${hasEv ? 'See ' + evFiles[0].file + ' (in-progress — hands-on testing required before full claims)' : 'Evidence pending — no file in docs/evidence/ for this tool.'}</p>
          </div>
        </div>
      </section>

      <!-- Workflow (realistic; grounded in evidence or generic pending) -->
      <section class="ncr-container" style="padding:20px 0;">
        <h2 style="margin:0 0 12px;font-size:18px;">Typical workflow</h2>
        <div class="tool-funnel-grid">
          ${slug==='cursor' || slug==='windsurf' ? 
            `<div class="tool-funnel-card">Open existing repo or start new → Agent / chat proposes edits across files (Cursor Agent / Windsurf Cascade)</div>
             <div class="tool-funnel-card">Review diffs, apply rules/skills/MCP context → Iterate with follow-ups or manual code</div>
             <div class="tool-funnel-card">Test locally / CI → Commit; Privacy Mode for sensitive work (per evidence docs)</div>` :
            slug==='v0' ?
            `<div class="tool-funnel-card">Prompt for UI / page / component (React/Next style) → Generate + visual Design Mode edits</div>
             <div class="tool-funnel-card">Iterate prompts or drag → GitHub sync for code ownership</div>
             <div class="tool-funnel-card">Deploy to Vercel (credits) or export (evidence 09)</div>` :
            (slug==='webflow-ai' || slug==='webflow') ?
            `<div class="tool-funnel-card">Start site or use AI to generate sections/layouts inside Webflow</div>
             <div class="tool-funnel-card">Refine with native designer + AI assists → Add CMS, interactions, logic</div>
             <div class="tool-funnel-card">Publish / export code where supported (supplemental evidence)</div>` :
            (slug==='bubble-ai' || slug==='bubble') ?
            `<div class="tool-funnel-card">Define data types + UI in no-code editor → Use AI assist for workflows / expressions</div>
             <div class="tool-funnel-card">Configure privacy rules, API, auth explicitly</div>
             <div class="tool-funnel-card">Preview + deploy to Bubble hosting (more control, explicit logic per evidence)</div>` :
            (slug==='framer-ai' || slug==='framer') ?
            `<div class="tool-funnel-card">Prompt or start with template for landing / marketing site</div>
             <div class="tool-funnel-card">Visual edit + AI variants → Add interactions / CMS</div>
             <div class="tool-funnel-card">Publish to Framer hosting or custom domain (fast site gen, per 19)</div>` :
            `<div class="tool-funnel-card">Describe goals or start from template → Iterate with prompts / visual tools</div>
             <div class="tool-funnel-card">Add data/auth/integrations per tool model</div>
             <div class="tool-funnel-card">Preview, test, deploy or export (details + security verification pending evidence)</div>`
          }
        </div>
        <p style="font-size:12px;opacity:0.6;margin-top:8px;">${hasEv ? 'Examples derived from official positioning + evidence file ' + evFiles[0].file : 'Evidence pending — workflows illustrative only.'}</p>
      </section>

      <!-- Pricing notes (C2: grounded from evidence or pending; no hardcoded lovable) -->
      <section class="ncr-container" style="padding:20px 0;">
        <h2 style="margin:0 0 12px;font-size:18px;">Pricing notes</h2>
        <div class="tool-funnel-card">
          ${hasEv && (slug==='cursor' || slug==='windsurf' || slug==='v0') ? 
            `Official pricing/docs captured in evidence file. ${slug==='cursor' ? 'Plans include Hobby/Pro/Teams with usage-based frontier models (exact rates volatile; verify on cursor.com/pricing). Privacy Mode documented.' : slug==='windsurf' ? 'Usage plans + enterprise features; Cascade agent quotas subject to capture (evidence in-progress).' : 'Credit-based for generations + Vercel deployment. See v0 evidence for current posture.'} <span style="font-size:11px;opacity:0.7;">(Source: ${evFiles[0].file} — hands-on verification pending per file status)</span>` :
            (slug==='webflow-ai' || slug==='bubble-ai' || slug==='framer-ai' || slug==='webflow' || slug==='bubble' || slug==='framer') ?
            `Paid plans per supplemental evidence. AI features availability and limits vary by plan. Full pricing snapshot pending re-capture. <span style="font-size:11px;opacity:0.7;">(See ${evFiles.length ? evFiles[0].file : 'evidence manifest'})</span>` :
            (['shopify','make','zapier','notion','airtable'].includes(slug) || !hasEv) ?
            `Pricing evidence pending — no dedicated evidence file captured for this tool. Verify on official site before use. <span style="font-size:11px;opacity:0.7;">(Broader context in empire planning docs for category; ref only.)</span>` :
            `${tool.price || 'See official site'}. Pricing evidence pending for detailed notes.`
          }
        </div>
      </section>

      <!-- Security & prompts guidance (C2: from evidence safe claims or pending; generalized) -->
      <section class="ncr-container" style="padding:20px 0;">
        <h2 style="margin:0 0 12px;font-size:18px;">Security &amp; prompts guidance</h2>
        <div class="tool-funnel-grid">
          <div class="tool-funnel-card">${hasEv && slug==='cursor' ? 
            'Privacy Mode: enable to prevent code data storage/training by supported providers (official pricing + privacy docs). Agent edits require branch/review/rollback process. Dependency security direction via Chainguard partnership (Axios context; verify official).' : 
            hasEv && slug==='windsurf' ? 'Agent (Cascade) can code/fix/think ahead per homepage. Enterprise/team controls and usage visibility in plans. Hands-on repo testing required (evidence in-progress).' :
            hasEv && slug==='v0' ? 'Vercel-connected deployment + GitHub sync. Generated code security/quality unverified (evidence in-progress — prompt-to-app + deployment testing required).' :
            (slug==='webflow-ai' || slug==='webflow') ? 'AI-assisted design inside mature builder. Export fidelity and AI feature security posture per supplemental evidence (18_webflow_ai_evidence_file.md).' :
            (slug==='bubble-ai' || slug==='bubble') ? 'Traditional no-code control with AI assistance. Slower vibe loop but more explicit logic; security rules ownership critical (supplemental evidence).' :
            (slug==='framer-ai' || slug==='framer') ? 'Fast marketing/landing site generation. Not positioned as full app env; review export + publish security (supplemental 19_framer_ai_evidence_file.md).' :
            'Security, auth, data rules, secrets, and export must be manually verified for production use. NoCodeReviewed evidence files repeatedly flag these as pending hands-on gates for most tools.'}</div>
          <div class="tool-funnel-card">${tool.bestFor || 'Describe goals clearly for best results.'} ${hasEv ? 'Prompts/workflows in evidence docs where available.' : 'Evidence pending for tool-specific prompt guidance.'}</div>
        </div>
      </section>

      <!-- Tutorials / Blog (placeholders per C2 spec — all labeled) -->
      <section class="ncr-container" style="padding:20px 0;">
        <h2 style="margin:0 0 12px;font-size:18px;">Tutorials &amp; guides <a href="${tutorialsLink}" style="font-size:12px;opacity:0.7;">(see all)</a></h2>
        <div class="tool-funnel-grid">
          <div class="tutorial-card"><strong>Build your first project with ${tool.name}</strong><br><span style="font-size:12px;opacity:0.7;">Coming soon</span></div>
          <div class="tutorial-card"><strong>Production launch checklist</strong><br><span style="font-size:12px;opacity:0.7;">Draft pending / Evidence pending</span></div>
          <div class="tutorial-card"><strong>Security / export checklist</strong><br><span style="font-size:12px;opacity:0.7;">Coming soon</span></div>
          <div class="tutorial-card"><strong>Common beginner mistakes</strong><br><span style="font-size:12px;opacity:0.7;">Evidence pending</span></div>
          <div class="tutorial-card"><strong>Alternatives and migration guide</strong><br><span style="font-size:12px;opacity:0.7;">Coming soon</span></div>
        </div>
      </section>

      <!-- Comparison / fit (alts from existing tools[] only; no fakes) -->
      <section class="ncr-container" style="padding:20px 0;">
        <h2 style="margin:0 0 12px;font-size:18px;">Fit &amp; alternatives</h2>
        <div class="tool-funnel-grid">
          <div class="tool-funnel-card"><strong>Best for:</strong> ${tool.bestFor || 'Rapid prototyping and full-stack web apps (verify with evidence)'}</div>
          <div class="tool-funnel-card"><strong>Not ideal for:</strong> ${slug==='cursor' || slug==='windsurf' ? 'Pure no-code users or teams avoiding code review (evidence: developer IDE category)' : slug==='v0' ? 'Backend-heavy or non-React apps without pairing (evidence 09)' : (slug==='webflow-ai'||slug==='framer-ai') ? 'Complex app logic / data workflows (positioned for sites per evidence)' : 'Complex enterprise systems requiring heavy customization (evidence pending)'}</div>
          <div class="tool-funnel-card"><strong>Consider alternatives if:</strong> You need deeper IDE control (Cursor/Windsurf), specific legacy stack, or different production guarantees. Explore from current index: Lovable, Bolt.new, Replit, Base44, FlutterFlow, Retool, etc. (no invented rankings).</div>
        </div>
      </section>

      <!-- Trust / evidence (C2: cites real files + gaps explicit) -->
      <section class="ncr-container" style="padding:20px 0;">
        <h2 style="margin:0 0 12px;font-size:18px;">Evidence &amp; trust</h2>
        <div class="tool-funnel-card">
          <p><strong>Evidence status:</strong> ${evStatus} (${evFiles.length} file${evFiles.length===1?'':'s'}) ${hasEv ? '— ' + (evFiles[0].status || 'canonical/supplemental') : ''}</p>
          ${hasEv ? `<p>Primary: <a href="/${evFiles[0].file}" target="_blank">${evFiles[0].file}</a> (status per manifest: in-progress for hands-on gates)</p>` : `<span class="evidence-gap">Evidence pending — no dedicated file in docs/evidence/. See #evidence and empire planning for category context (ref only).</span>`}
          ${ (slug==='cursor' && hasEv) ? `<p>Key gaps from file: agent safety, exact pricing capture, full security artifacts, dependency tests, cost benchmarks. See testing plan in 05_cursor_complete_evidence_file.md.</p>` : '' }
          ${ (slug==='windsurf' && hasEv) ? `<p>Key gaps: Cascade quota/repo testing, security scope, deployment verification (06_windsurf...).</p>` : '' }
          <p style="margin-top:12px;"><a href="#review/${slug}">Read the full independent NoCodeReviewed review →</a></p>
          ${ (['cursor','windsurf','v0'].includes(slug) && hasEv) ? `<p style="font-size:11px;opacity:0.6;margin-top:6px;">Background visual: public/images/tool-backgrounds/${slug}-bg.jpg (local asset, used for reference/brand context where relevant)</p>` : '' }
        </div>
      </section>

      <!-- Final CTA (CTA restraint: 1 product if safe URL, 1 internal) -->
      <section class="ncr-container" style="padding:30px 20px 60px;text-align:center;">
        ${tryUrl !== '#' ? `<a class="tool-funnel-cta" href="${tryUrl}" target="_blank" rel="noopener" style="background:var(--tool-accent,#3b82f6);color:#fff;font-size:16px;">${tryLabel}</a>` : `<span class="evidence-gap" style="display:inline-block;padding:8px 16px;border:1px dashed var(--tool-border,#1e2744);border-radius:6px;">Official site link pending (evidence capture in progress)</span>` }
        <div style="margin-top:8px;"><a href="#review/${slug}">Or read the evidence-backed review first</a> • <a href="/tools/vibe-auditor.html">Run Vibe Auditor</a></div>
        ${disclosure}
      </section>
    </div>
  </div>`;

  return html;
}

function ncrToolReviewPage(slug) {
  const tool = getToolData(slug);
  const evFiles = getEvidenceForTool(slug);
  const hasEv = evFiles.length > 0;
  const asset = toolBrandAsset(slug);
  const logoHtml = toolLogoMarkup(tool, 42, "tool-logo");
  const styleVars = toolBrandStyleVars(tool);

  // R2: safe product CTAs (official domains only; no invented)
  const safeTryUrls = {
    'lovable': 'https://lovable.dev', 'bolt-new': 'https://bolt.new', 'replit': 'https://replit.com', 'replit-agent': 'https://replit.com',
    'cursor': 'https://cursor.com', 'windsurf': 'https://windsurf.com', 'v0': 'https://v0.dev',
    'framer-ai': 'https://framer.com', 'webflow-ai': 'https://webflow.com', 'bubble-ai': 'https://bubble.io',
    'framer': 'https://framer.com', 'webflow': 'https://webflow.com', 'bubble': 'https://bubble.io',
    'shopify': 'https://shopify.com'
  };
  const reviewTryUrl = safeTryUrls[slug] || '#';

  // R2: crash-safe evidence-derived data (no fakes; pending labels preserved)
  let reviewData;
  try {
    reviewData = getReviewData(slug);
  } catch (e) {
    reviewData = { category: tool.category || 'Tool', summary: 'Evidence-first review. Details pending.', verdict: 'Evidence pending or partial. Verify sources.', confidence: 'Evidence pending', evidenceSnapshot: { files: evFiles.length, status: hasEv ? 'Available' : 'Pending', quality: 'Pending', freshness: 'See manifest', gaps: 'See gaps' }, strengths: ['Evidence status explicitly labeled.'], limitations: ['Hands-on verification required per evidence status.'], pricing: 'Pricing evidence pending. Verify current pricing before purchase.', security: 'Security & trust evidence pending or partial.', production: [{ gate: 'All gates', label: 'Evidence pending', note: 'No verified production data.' }], bestFor: tool.bestFor || 'Builders', avoid: 'Production use without evidence review.', useCases: [], alternatives: 'See #tools for adjacent options.', gaps: ['Evidence capture incomplete.'], methodologyNote: 'All claims must trace to evidence or be labeled pending.' };
  }

  // Contextual frame (dynamic where possible)
  const contextMap = {
    verdict: { eyebrow: "Evidence context", title: "Independent verdict", body: reviewData.verdict || "Independent evidence-first evaluation. Unsupported claims remain marked pending.", cta: "See methodology", ctaHref: "#review-methodology" },
    evidence: { eyebrow: "Evidence status", title: "Evidence snapshot", body: hasEv ? `${evFiles.length} canonical/supplemental file(s). ${reviewData.evidenceSnapshot ? reviewData.evidenceSnapshot.gaps : ''}` : "Evidence pending for full verification.", cta: "Open evidence", ctaHref: "#review-evidence" },
    strengths: { eyebrow: "Grounded strengths", title: "What works well", body: "Strengths drawn from official positioning and captured evidence. Deeper claims pending hands-on.", cta: "See use cases", ctaHref: "#review-use-cases" },
    limitations: { eyebrow: "Transparent limitations", title: "Production & security", body: "Production readiness, auth, data ownership, and long-term maintainability require hands-on verification (evidence pending for full gates).", cta: "Run Vibe Auditor", ctaHref: "/tools/vibe-auditor.html" },
    pricing: { eyebrow: "Pricing notes", title: "Pricing needs verification", body: "Pricing, tokens, and scaling change frequently. Current evidence may be incomplete — always re-check official plans.", cta: "Pricing section", ctaHref: "#review-pricing" },
    security: { eyebrow: "Launch risk", title: "Security & trust", body: "Auth, data rules, secrets, export, and deployment posture determine if this tool is safe for serious projects.", cta: "Security notes", ctaHref: "#review-security" },
    production: { eyebrow: "Can it survive?", title: "Production readiness", body: "Database, auth, deploy, secrets, handoff, maintainability, and testing affect real-world viability. Labels: Verified / Partially verified / Evidence pending / Not applicable.", cta: "Production notes", ctaHref: "#review-production" },
    "use-cases": { eyebrow: "Best-fit workflow", title: "Recommended use cases", body: "Use-case recommendations come from observed strengths, limitations, and evidence-backed fit.", cta: "Open microsite", ctaHref: `#tool/${slug}` },
    alternatives: { eyebrow: "Adjacent tools", title: "Consider alternatives if", body: "Need deeper IDE control, specific legacy stack, or different production guarantees? Explore comparisons.", cta: "See tools", ctaHref: "#tools" },
    gaps: { eyebrow: "Evidence gaps", title: "Help close the gap", body: "When evidence is incomplete, NoCodeReviewed labels it clearly instead of inventing certainty.", cta: "Methodology", ctaHref: "#review-methodology" },
    methodology: { eyebrow: "How we evaluate", title: "NoCodeReviewed methodology", body: "Repeatable build tests, pricing snapshots, production gates, and quality checks. All claims must trace to evidence.", cta: "Full methodology", ctaHref: "#methodology" },
    cta: { eyebrow: "Next step", title: "Ready to evaluate?", body: "Run your own project through the Vibe Auditor for personalized survivability insights.", cta: "Run Vibe Auditor", ctaHref: "/tools/vibe-auditor.html" }
  };

  const sections = [
    { id: "review-verdict", label: "Verdict", icon: "◇", key: "verdict" },
    { id: "review-evidence", label: "Evidence", icon: "◉", key: "evidence" },
    { id: "review-strengths", label: "Strengths", icon: "▲", key: "strengths" },
    { id: "review-limitations", label: "Limitations", icon: "!", key: "limitations" },
    { id: "review-pricing", label: "Pricing", icon: "$", key: "pricing" },
    { id: "review-security", label: "Security", icon: "🔒", key: "security" },
    { id: "review-production", label: "Production", icon: "⚙", key: "production" },
    { id: "review-use-cases", label: "Use Cases", icon: "◎", key: "use-cases" },
    { id: "review-alternatives", label: "Alternatives", icon: "↔", key: "alternatives" },
    { id: "review-gaps", label: "Gaps", icon: "?", key: "gaps" },
    { id: "review-methodology", label: "Methodology", icon: "§", key: "methodology" },
    { id: "review-cta", label: "CTA", icon: "→", key: "cta" }
  ];

  const railHtml = sections.map(s => `
    <a href="#${s.id}" class="review-rail-item review-context-trigger" data-section="${s.key}" data-context="${s.key}" aria-label="${s.label}">
      <span class="review-rail-icon">${s.icon}</span>
      <span class="review-rail-label">${s.label}</span>
    </a>
  `).join("");

  // R2: render production gates as labeled list (crash-safe)
  const prodHtml = (reviewData.production || []).map(p => `
    <div style="margin:6px 0;padding:6px 8px;border:1px solid #1e2744;border-radius:6px;background:#0b0e18;">
      <strong>${p.gate}</strong>: <span style="color:${p.label.includes('Verified') && !p.label.includes('pending') ? '#10b981' : (p.label.includes('Partially') ? '#f59e0b' : '#f87171')};">${p.label}</span><br>
      <span style="font-size:11px;opacity:0.75;">${p.note}</span>
    </div>
  `).join('');

  const strengthsHtml = (reviewData.strengths || []).map(li => `<li>${li}</li>`).join('');
  const limitationsHtml = (reviewData.limitations || []).map(li => `<li>${li}</li>`).join('');
  const gapsHtml = (reviewData.gaps || []).filter(Boolean).map(li => `<li>${li}</li>`).join('');
  const useCasesHtml = (reviewData.useCases || []).map(u => `<li>${u}</li>`).join('');

  const html = `
  <div class="tool-review-page" style="${styleVars}">
    ${premiumNav('reviews')}
    <div class="review-layout ncr-container">
      <!-- Left rail -->
      <nav class="review-section-rail" aria-label="Review sections">
        ${railHtml}
      </nav>

      <!-- Main content -->
      <div class="review-content">
        <!-- Hero (R2: evidence status, last updated, short summary, CTAs) -->
        <header class="review-hero" id="review-verdict">
          <div class="tool-logo-row" style="margin-bottom:12px;">
            ${logoHtml}
            <div>
              <div class="tool-brand-chip"><span class="tool-brand-mark" style="background:var(--tool-brand);">${asset.fallback}</span> ${tool.name}</div>
              <div style="font-size:11px;opacity:0.6;">${reviewData.category || tool.category} • Evidence: ${hasEv ? 'Available' : 'Pending'} • Updated: ${reviewData.evidenceSnapshot ? reviewData.evidenceSnapshot.freshness : 'Evidence manifest'}</div>
            </div>
          </div>
          <h1 style="font-size:32px;margin:4px 0;">${tool.name} Review</h1>
          <p style="opacity:0.85;max-width:620px;">${reviewData.summary || 'Independent, evidence-first evaluation by NoCodeReviewed. Claims are grounded in available evidence files or explicitly marked pending.'}</p>
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
            ${reviewTryUrl && reviewTryUrl !== '#' ? `<a class="ncr-btn ncr-btn-primary" href="${reviewTryUrl}" target="_blank" rel="noopener">Try ${tool.name}</a>` : `<span class="evidence-gap" style="padding:6px 10px;border:1px dashed #334155;border-radius:4px;font-size:12px;">Official site link pending</span>`}
            <a class="ncr-btn ncr-btn-secondary" href="#tool/${slug}">Open Microsite</a>
            <a class="ncr-btn ncr-btn-secondary" href="/tools/vibe-auditor.html">Run Vibe Auditor</a>
            <a class="ncr-btn ncr-btn-secondary" href="#methodology">See Methodology</a>
          </div>
          <div class="affiliate-disclosure" style="margin-top:8px;">NoCodeReviewed may earn a commission on some product links. Reviews remain evidence-based and independent.</div>
        </header>

        <!-- Independent verdict (R2: short evidence-aware + confidence label) -->
        <section id="review-verdict" class="review-section review-neutral-panel">
          <h3>Independent Verdict</h3>
          <p style="margin:8px 0 4px;"><strong>Confidence:</strong> ${reviewData.confidence || (hasEv ? 'Moderate confidence (official sources captured; hands-on pending)' : 'Evidence pending')}</p>
          <p>${reviewData.verdict || 'Evidence snapshot available or pending. Production, security, and hands-on verification required before any readiness claim.'}</p>
        </section>

        <!-- Evidence Snapshot (R2: enhanced with quality/freshness/gaps from data) -->
        <section id="review-evidence" class="review-section review-neutral-panel">
          <h3>Evidence Snapshot</h3>
          <div class="review-evidence-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-top:8px;">
            <div><strong>Files</strong><br>${evFiles.length} record(s)</div>
            <div><strong>Status</strong><br>${reviewData.evidenceSnapshot ? reviewData.evidenceSnapshot.status : (hasEv ? 'Canonical + supplemental' : 'Evidence pending')}</div>
            <div><strong>Quality gates</strong><br>${reviewData.evidenceSnapshot ? reviewData.evidenceSnapshot.quality : (hasEv ? 'Partial' : 'Pending')}</div>
            <div><strong>Last check</strong><br>${reviewData.evidenceSnapshot ? reviewData.evidenceSnapshot.freshness : 'Evidence manifest'}</div>
          </div>
          ${hasEv ? `<p style="margin-top:8px;font-size:12px;">Sources: ${evFiles.map(f => `<a href="/${f.file}" target="_blank">${f.file}</a>`).join(' ')} ${reviewData.evidenceSnapshot && reviewData.evidenceSnapshot.gaps ? '<br>' + reviewData.evidenceSnapshot.gaps : ''}</p>` : `<span class="evidence-gap">No complete evidence file yet. See gaps below.</span>`}
          <p style="font-size:11px;opacity:0.65;margin-top:6px;">Evidence status "in-progress" in source files means hands-on benchmarks (auth, RLS, secrets, deploy, export, cost) are still required before publication claims.</p>
        </section>

        <!-- Strengths (R2: 4-6 grounded or pending) -->
        <section id="review-strengths" class="review-section review-neutral-panel">
          <h3>Strengths</h3>
          <ul>${strengthsHtml || '<li>Evidence status and gaps are explicitly labeled (no unsupported claims published).</li>'}</ul>
          <p style="font-size:12px;opacity:0.7;">${hasEv ? '(Grounded in ' + (evFiles[0] ? evFiles[0].file : '') + '; deeper production/security/autonomy claims pending hands-on per file "in-progress" status — testing required before publication.)' : '(Evidence pending — see gaps section and manifest.)'}</p>
        </section>

        <!-- Limitations (R2: 4-6 honest/specific) -->
        <section id="review-limitations" class="review-section review-neutral-panel">
          <h3>Limitations</h3>
          <ul>${limitationsHtml || '<li>Production readiness, security posture, and long-term maintainability require hands-on verification for almost all tools (evidence files consistently mark "in-progress — security, deployment, testing required").</li><li>Pricing, usage, and limits change frequently. Manual testing for auth, private routes, data rules, secrets, and export fidelity is mandatory before real use.</li>'}</ul>
        </section>

        <!-- Pricing (R2: use evidence only or pending label) -->
        <section id="review-pricing" class="review-section review-neutral-panel">
          <h3>Pricing Notes</h3>
          <p>${reviewData.pricing || (tool.price || 'Pricing evidence pending. Verify current pricing before purchase.')}</p>
          <p style="font-size:11px;opacity:0.7;">Always re-verify on official site — plans, credits, and limits evolve quickly. Real cost often includes third-party services (DB, hosting, APIs, domains).</p>
        </section>

        <!-- Security (R2: source-backed or pending) -->
        <section id="review-security" class="review-section review-neutral-panel">
          <h3>Security & Trust</h3>
          <p>${reviewData.security || 'Auth, data rules, secrets, exportability, and deployment posture determine suitability for serious use. Full verification pending hands-on tests for most tools.'}</p>
        </section>

        <!-- Production Readiness (R2: labeled Verified/Partial/Pending/N/A) -->
        <section id="review-production" class="review-section review-neutral-panel">
          <h3>Production Readiness</h3>
          <p style="margin-bottom:8px;">Assessed from evidence files (official docs, pricing, security notes, testing plans). No hands-on benchmarks executed in captured records — all generated apps require project-specific testing.</p>
          ${prodHtml || '<p>Evidence pending for production gates.</p>'}
        </section>

        <!-- Best-fit use cases (R2: 3-5, who should/avoid) -->
        <section id="review-use-cases" class="review-section review-neutral-panel">
          <h3>Best-Fit Use Cases</h3>
          <p><strong>Consider ${tool.name} if:</strong> ${reviewData.bestFor || tool.bestFor || 'Rapid web app prototypes with AI assistance and code visibility.'}</p>
          <p><strong>Avoid or evaluate carefully if:</strong> ${reviewData.avoid || 'You need guaranteed enterprise compliance, complex legacy integration, or fully audited production security before first build.'}</p>
          ${useCasesHtml ? `<ul>${useCasesHtml}</ul>` : ''}
        </section>

        <!-- Alternatives (R2: from existing tool data + evidence comparison candidates only) -->
        <section id="review-alternatives" class="review-section review-neutral-panel">
          <h3>Alternatives</h3>
          <p>${reviewData.alternatives || 'Adjacent tools from the index (see #tools and comparison pages). No fake rankings — evaluate based on your specific evidence needs. Examples: Cursor/Windsurf for code IDE layer; Lovable/Bolt for prompt-to-app; Framer/Webflow for site gen; Bubble for traditional no-code control.'}</p>
        </section>

        <!-- Evidence gaps (R2: explicit list) -->
        <section id="review-gaps" class="review-section review-neutral-panel">
          <h3>Evidence Gaps</h3>
          <ul class="review-gap-list">
            ${gapsHtml || '<li>Full hands-on security / production gate results (pending for priority tools per "in-progress" evidence status).</li><li>Long-term maintainability and handoff quality (pending).</li><li>Updated pricing + token/credit scaling benchmarks (re-check official; captured in evidence but volatile).</li>'}
            ${!hasEv ? '<li>No dedicated evidence file in docs/evidence/ for this tool. Capture is required for completeness.</li>' : ''}
          </ul>
          <p style="font-size:12px;opacity:0.7;">NoCodeReviewed explicitly marks gaps instead of guessing. ${hasEv ? 'Full lists of "Claims Requiring Verification" and "Testing Plan" live in the evidence .md files.' : 'See #evidence for current manifest coverage and missing numbers (10,11,28).'} </p>
        </section>

        <!-- Methodology (R2: evidence-first policy, no paid, quality gates, why pending) -->
        <section id="review-methodology" class="review-section review-neutral-panel">
          <h3>Methodology</h3>
          <p>${reviewData.methodologyNote || 'Repeatable build tests, pricing snapshots, production-readiness gates, and quality checks. All public claims must trace to evidence records (docs/evidence/* + data/intelligence-vault/evidence-manifest.json) or approved methodology.'}</p>
          <p>No paid rankings. No fake scores, testimonials, benchmarks, or claims. Pending labels exist because evidence files explicitly mark "in-progress — hands-on security, deployment, testing required before publication." Quality gates block unsupported claims.</p>
          <p><a href="#methodology">Read the full NoCodeReviewed methodology →</a></p>
        </section>

        <!-- Final CTA (R2: restrained) -->
        <section id="review-cta" class="review-section">
          <div class="review-cta-panel ncr-glass" style="padding:16px;">
            <strong>Next step</strong>
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
              ${reviewTryUrl && reviewTryUrl !== '#' ? `<a class="ncr-btn ncr-btn-primary" href="${reviewTryUrl}" target="_blank" rel="noopener">Try ${tool.name}</a>` : `<span class="evidence-gap" style="padding:6px 10px;border:1px dashed #334155;border-radius:4px;font-size:12px;">Official site link pending</span>`}
              <a class="ncr-btn ncr-btn-secondary" href="#tool/${slug}">Open Microsite</a>
              <a class="ncr-btn ncr-btn-secondary" href="/tools/vibe-auditor.html">Run Vibe Auditor</a>
              <a class="ncr-btn ncr-btn-secondary" href="#review-methodology">See Methodology</a>
            </div>
          </div>
        </section>
      </div>

      <!-- Right contextual frame (glassmorphic, updates on rail hover/scroll) -->
      <aside class="review-context-frame" id="review-context-frame" aria-live="polite" aria-label="Contextual insight">
        <button class="context-frame-close" aria-label="Close frame">×</button>
        <p class="review-context-frame__eyebrow" id="frame-eyebrow">Evidence context</p>
        <h4 class="review-context-frame__title" id="frame-title">Section insight</h4>
        <p class="review-context-frame__body" id="frame-body">Relevant explanation appears here based on the section you are viewing.</p>
        <a class="review-context-frame__cta ncr-btn ncr-btn-secondary" id="frame-cta" href="#review-methodology">See methodology</a>
      </aside>
    </div>
  </div>`;

  // Attach lightweight JS behaviors for this page render (rail + frame) — crash-safe
  setTimeout(() => {
    try {
      const rail = document.querySelector('.review-section-rail');
      const frame = document.getElementById('review-context-frame');
      if (!rail || !frame) return;

      const closeBtn = frame.querySelector('.context-frame-close');
      if (closeBtn) closeBtn.addEventListener('click', () => frame.classList.remove('is-visible'));

      const updateFrame = (key) => {
        const ctx = contextMap[key] || contextMap.verdict;
        const ey = document.getElementById('frame-eyebrow');
        const ti = document.getElementById('frame-title');
        const bo = document.getElementById('frame-body');
        const ct = document.getElementById('frame-cta');
        if (ey) ey.textContent = ctx.eyebrow;
        if (ti) ti.textContent = ctx.title;
        if (bo) bo.textContent = ctx.body;
        if (ct) { ct.textContent = ctx.cta; ct.href = ctx.ctaHref; }
        frame.classList.add('is-visible');
      };

      // Hover/focus on rail items
      rail.querySelectorAll('.review-context-trigger').forEach(item => {
        const key = item.dataset.context || item.dataset.section;
        const handler = () => updateFrame(key);
        item.addEventListener('mouseenter', handler);
        item.addEventListener('focus', handler);
        item.addEventListener('mouseleave', () => { /* keep last or hide after delay if desired */ });
      });

      // Scroll context via IntersectionObserver (lightweight)
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const sec = entry.target.id.replace('review-', '');
              if (contextMap[sec]) updateFrame(sec);
            }
          });
        }, { threshold: 0.4 });
        document.querySelectorAll('.review-section[id]').forEach(sec => observer.observe(sec));
      }

      // Keyboard support already via <a href>
    } catch (e) { /* defensive, no crash */ }
  }, 60);

  return html;
}

function ncrToolTutorials(slug) {
  const tool = getToolData(slug);
  const theme = getToolTheme(slug);
  const themeClass = `tool-theme-${theme}`;

  return `
  <div class="tool-funnel-page ${themeClass}">
    ${premiumNav('microsites')}
    <div class="ncr-container" style="padding:40px 20px;">
      <h1>${tool.name} Tutorials &amp; Guides</h1>
      <p style="opacity:0.8;">Evidence-backed and practical guides for getting the most out of ${tool.name}. All content will be grounded in real testing and official capabilities (or labeled pending).</p>

      <div class="tool-funnel-grid" style="margin-top:20px;">
        <div class="tutorial-card"><strong>Build your first project with ${tool.name}</strong><br><span style="font-size:12px;opacity:0.7;">Coming soon</span></div>
        <div class="tutorial-card"><strong>Production launch checklist</strong><br><span style="font-size:12px;opacity:0.7;">Draft pending / Evidence pending</span></div>
        <div class="tutorial-card"><strong>Security / export checklist</strong><br><span style="font-size:12px;opacity:0.7;">Coming soon</span></div>
        <div class="tutorial-card"><strong>Common beginner mistakes</strong><br><span style="font-size:12px;opacity:0.7;">Evidence pending</span></div>
        <div class="tutorial-card"><strong>Alternatives and migration guide</strong><br><span style="font-size:12px;opacity:0.7;">Coming soon</span></div>
      </div>

      <p style="margin-top:30px;"><a href="#tool/${slug}">Back to ${tool.name} microsite</a> • <a href="#review/${slug}">Read the evidence review</a> • <a href="/tools/vibe-auditor.html">Run your own audit</a></p>
    </div>
  </div>`;
}

/* replit alias already handled in the main toolBySlug definition above */

/* === B1: Premium Blog Hub + High-Converting Article System === */

const BLOG_ARTICLES = [
  {
    slug: "ai-app-launch-audit-checklist",
    title: "AI App Launch Audit Checklist: What to Verify Before You Ship",
    category: "Audits",
    status: "Draft",
    intent: "Launch readiness",
    description: "A practical checklist covering auth, data ownership, deployment, secrets, maintainability, and handoff for vibe-coded apps. Grounded in NoCodeReviewed production gates and evidence methodology.",
    primaryCta: { label: "Run the Vibe Auditor", href: "/tools/vibe-auditor.html" },
    relatedTools: ["lovable", "bolt-new", "replit"],
    evidenceStatus: "Evidence pending - based on core methodology",
    sections: [
      { heading: "Why Audits Matter for AI-Built Apps", body: "AI builders can generate beautiful interfaces and working logic quickly, but production risks often hide in auth rules, data access, secrets handling, and long-term ownership. NoCodeReviewed evidence files repeatedly show that visual success does not equal launch readiness." },
      { heading: "Core Checklist Areas", body: "1. Authentication & private routes\n2. Database rules and ownership\n3. Secrets and environment variables\n4. Deployment & hosting posture\n5. Export / handoff quality\n6. Failure recovery and monitoring\n7. Performance under real load\n\nEach area should be manually verified before real users or revenue." },
      { heading: "How to Use This With Your Project", body: "Export your AI chat history to the Chat Intelligence Vault, then run the Vibe Auditor on the generated app. The auditor surfaces exactly these gaps with project-specific notes." },
      { heading: "Evidence Status", body: "This guide is a draft derived from repeated patterns across Lovable, Bolt.new, Replit, and similar evidence files. Full per-tool benchmark results are evidence pending for most tools." }
    ]
  },
  {
    slug: "chatgpt-export-project-recovery",
    title: "How to Recover Projects, Prompts, Code, and Business Ideas from ChatGPT Exports",
    category: "Tutorials",
    status: "Draft",
    intent: "Project intelligence recovery",
    description: "Step-by-step process to turn fragmented AI chat history into searchable, reusable project memory using the Chat Intelligence Vault and local parsers.",
    primaryCta: { label: "Open Chat Intelligence Vault", href: "/tools/chat-intelligence-vault.html" },
    relatedTools: ["lovable", "bolt-new", "replit"],
    evidenceStatus: "Grounded in Vault Data Contract and Local Vault Handoff",
    sections: [
      { heading: "The Problem: Fragmented AI Memory", body: "Builders spread critical decisions, prompts, code, and monetization ideas across dozens of ChatGPT/Grok threads. Without recovery, this intelligence is lost or duplicated." },
      { heading: "Export Your History Safely", body: "Use the Chat Intelligence Vault to import conversations.json or ZIP exports locally. No data leaves your browser." },
      { heading: "What Gets Recovered", body: "Conversations, messages, code blocks, prompts, commands, architecture notes, business ideas, and decision timelines are normalized into vault.v1 records." },
      { heading: "Next Steps After Recovery", body: "Feed recovered assets into the Vibe Auditor for launch risk analysis, or the evidence system for tool comparisons. Use the Vault Ingestion Parser for offline processing." }
    ]
  },
  {
    slug: "lovable-vs-bolt-vs-replit",
    title: "Lovable vs Bolt.new vs Replit: Which AI Builder Fits Your Project?",
    category: "Comparisons",
    status: "Draft",
    intent: "Tool selection",
    description: "Evidence-based comparison of three leading AI app builders using NoCodeReviewed tool data, evidence files, and production-readiness observations.",
    primaryCta: { label: "Read Lovable Review", href: "#review/lovable" },
    relatedTools: ["lovable", "bolt-new", "replit"],
    evidenceStatus: "Evidence pending - uses existing tool cards + evidence manifest",
    sections: [
      { heading: "Quick Fit Matrix", body: "Lovable: Best for founders who want full-stack web apps from natural language with Git/Supabase export paths.\nBolt.new: Strong for browser-based iteration with visible code and fast runtime feedback.\nReplit: Ideal when you want AI assistance inside a real cloud IDE with deployment and collaboration built-in." },
      { heading: "Evidence Notes", body: "All three have canonical evidence files (Lovable 04+12, Bolt.new 03, Replit 01). Production readiness, security, and scaling details remain evidence pending across the board per manifest." },
      { heading: "Decision Framework", body: "Start with your primary goal: pure speed to first working app (Lovable/Bolt), or need for IDE, real deployment, and team features (Replit). Always run the Vibe Auditor on your specific project before committing." }
    ]
  },
  {
    slug: "no-code-tool-evidence-methodology",
    title: "How NoCodeReviewed Evaluates AI and No-Code Tools",
    category: "Evidence",
    status: "Draft",
    intent: "Transparency",
    description: "The repeatable process, quality gates, and evidence standards used to produce every review, comparison, and recommendation on this site.",
    primaryCta: { label: "See Full Methodology", href: "#methodology" },
    relatedTools: [],
    evidenceStatus: "Grounded in Vault Data Contract, architecture docs, and evidence manifest",
    sections: [
      { heading: "Evidence-First Core Principle", body: "No public claim is made without a traceable source in docs/evidence/ or approved methodology. Gaps are labeled explicitly." },
      { heading: "Quality Gates", body: "Build tests, pricing snapshots, production-readiness checks (auth, data, secrets, deploy, handoff), and editorial review before anything ships." },
      { heading: "Freshness & Expiration", body: "Scores and snapshots expire when tools change. The evidence manifest tracks completeness and duplicate candidates." }
    ]
  },
  {
    slug: "hidden-risks-in-vibe-coded-apps",
    title: "7 Hidden Risks in Vibe-Coded Apps",
    category: "Audits",
    status: "Draft",
    intent: "Risk awareness",
    description: "Common failure modes observed across evidence files for AI-generated apps: overbroad client logic, weak data rules, secret leakage, and more.",
    primaryCta: { label: "Run the Vibe Auditor", href: "/tools/vibe-auditor.html" },
    relatedTools: ["lovable", "bolt-new", "replit"],
    evidenceStatus: "Evidence pending - patterns from multiple tool evidence files",
    sections: [
      { heading: "Risk 1-3: Auth & Data", body: "Missing private route protection, overly permissive database rules, and client-side secret exposure appear repeatedly in generated apps." },
      { heading: "Risk 4-7: Ops & Ownership", body: "Poor error recovery, no monitoring, difficult handoff, and unclear code ownership make maintenance expensive after the initial demo." },
      { heading: "Mitigation", body: "Export the app, run it through the Vibe Auditor, and address the flagged gaps before real users arrive." }
    ]
  },
  {
    slug: "best-ai-app-builders-for-founders",
    title: "Best AI App Builders for Founders: What to Check First",
    category: "Buyer Guides",
    status: "Draft",
    intent: "Founder decision",
    description: "A founder-focused decision framework for choosing between Lovable, Bolt.new, Replit, and similar tools when speed to MVP is critical.",
    primaryCta: { label: "Browse Tools", href: "#tools" },
    relatedTools: ["lovable", "bolt-new", "replit"],
    evidenceStatus: "Evidence pending - synthesized from tool cards and evidence manifest",
    sections: [
      { heading: "Founder Priority: Speed + Ownership", body: "Founders need to validate ideas fast while retaining code ownership and the ability to hand off or scale later." },
      { heading: "Key Checks", body: "1. How quickly can you get a working multi-screen app?\n2. Can you export real, editable code?\n3. What is the path to production auth, data, and deploy?\n4. How hard is it to hand the project to a developer later?" },
      { heading: "Evidence Note", body: "Current tool data shows strong speed claims for Lovable and Bolt.new. Production and handoff evidence remains thin across the category." }
    ]
  },
  {
    slug: "pricing-evidence-changes-fast",
    title: "Why Pricing Evidence Changes Fast in AI Tools",
    category: "Evidence",
    status: "Draft",
    intent: "Buyer caution",
    description: "AI tool pricing, token limits, and plan features move quickly. This is why NoCodeReviewed treats pricing evidence as time-sensitive.",
    primaryCta: { label: "Evidence Library", href: "#evidence-library" },
    relatedTools: [],
    evidenceStatus: "Grounded in manifest freshness rules and architecture docs",
    sections: [
      { heading: "The Problem With Static Pricing Pages", body: "Token allowances, credit resets, and enterprise features are updated frequently by vendors. A review written six weeks ago can already be stale." },
      { heading: "NoCodeReviewed Approach", body: "Pricing snapshots are captured during evidence collection and explicitly expire. Readers are directed to re-verify before making purchase decisions." }
    ]
  },
  {
    slug: "build-with-evidence-not-hype",
    title: "Build With Evidence, Not Hype: The NoCodeReviewed Philosophy",
    category: "Strategy",
    status: "Draft",
    intent: "Mindset",
    description: "Why NoCodeReviewed refuses to publish listicles, fake benchmarks, or unverified 'best of' claims even when they would drive traffic.",
    primaryCta: { label: "Read Methodology", href: "#methodology" },
    relatedTools: [],
    evidenceStatus: "Grounded in AGENTS.md and CODEX_CONTEXT",
    sections: [
      { heading: "Trust Is the Product", body: "Builders who have been burned by hype need a source that labels uncertainty instead of papering over it with marketing copy." },
      { heading: "What We Publish vs What We Don't", body: "We publish grounded reviews, clear evidence gaps, and actionable audit tools. We do not publish fake user counts, invented case studies, or '10x faster' claims without reproducible tests." }
    ]
  }
];

function ncrBlogPage() {
  const nav = premiumNav('blog');
  const featured = BLOG_ARTICLES[0];
  const grid = BLOG_ARTICLES.map(a => `
    <div class="blog-card ncr-glass">
      <div class="blog-card__meta">
        <span class="blog-category">${a.category}</span>
        <span class="blog-card__status ${a.status.toLowerCase().replace(/\s+/g,'-')}">${a.status}</span>
      </div>
      <h3><a href="#blog/${a.slug}">${a.title}</a></h3>
      <p>${a.description}</p>
      <div class="blog-card__footer">
        <a class="ncr-btn ncr-btn-secondary" href="#blog/${a.slug}">Read ${a.status === 'Draft' ? 'draft' : 'guide'}</a>
        <span class="blog-intent">${a.intent}</span>
      </div>
    </div>
  `).join('');

  return `
  ${nav}
  <div class="blog-page ncr-container">
    <div class="blog-hero">
      <div class="eyebrow">NO-CODE INTELLIGENCE BRIEFINGS</div>
      <h1>Guides, audits, and evidence-backed strategy for the AI-built web.</h1>
      <p>NoCodeReviewed helps builders choose tools, audit AI-built apps, recover project intelligence from chat history, and avoid hype. All content is labeled by evidence status.</p>
      <div class="hero-ctas">
        <a class="ncr-btn ncr-btn-primary" href="/tools/vibe-auditor.html">Run the Vibe Auditor</a>
        <a class="ncr-btn ncr-btn-secondary" href="/tools/chat-intelligence-vault.html">Open Chat Intelligence Vault</a>
      </div>
    </div>

    <div class="blog-featured ncr-glass">
      <div class="blog-card__meta">
        <span class="blog-category">${featured.category}</span>
        <span class="blog-card__status ${featured.status.toLowerCase().replace(/\s+/g,'-')}">${featured.status}</span>
      </div>
      <h2><a href="#blog/${featured.slug}">${featured.title}</a></h2>
      <p>${featured.description}</p>
      <a class="ncr-btn ncr-btn-primary" href="#blog/${featured.slug}">Read ${featured.status === 'Draft' ? 'draft' : 'guide'}</a>
    </div>

    <div class="blog-category-filter">
      <span class="filter-chip active">All</span>
      <span class="filter-chip">Buyer Guides</span>
      <span class="filter-chip">Tutorials</span>
      <span class="filter-chip">Evidence</span>
      <span class="filter-chip">Comparisons</span>
      <span class="filter-chip">Audits</span>
    </div>

    <div class="blog-grid">
      ${grid}
    </div>

    <aside class="conversion-sidebar ncr-glass">
      <h4>Start here</h4>
      <a class="ncr-btn ncr-btn-primary" href="/tools/vibe-auditor.html">Audit your AI-built app</a>
      <a class="ncr-btn ncr-btn-secondary" href="/tools/chat-intelligence-vault.html">Recover projects from AI chats</a>
      <a class="ncr-btn ncr-btn-secondary" href="#methodology">Read the methodology</a>
      <a class="ncr-btn ncr-btn-secondary" href="#tools">Browse tool reviews</a>
    </aside>

    <div class="newsletter-card ncr-glass">
      <h4>Stay sharp</h4>
      <p>Evidence updates, new audit guides, and methodology notes. Newsletter coming soon.</p>
      <a class="ncr-btn ncr-btn-secondary" href="#newsletter">Join waitlist (placeholder)</a>
    </div>
  </div>`;
}

function ncrArticlePage(slug) {
  const article = BLOG_ARTICLES.find(a => a.slug === slug);
  if (!article) {
    return `
    ${premiumNav('blog')}
    <div class="ncr-container ncr-placeholder">
      <h1>Article not found</h1>
      <p>The article you're looking for doesn't exist yet or the slug is incorrect.</p>
      <div style="margin-top:20px;">
        <a class="ncr-btn ncr-btn-primary" href="#blog">Back to Blog</a>
        <a class="ncr-btn ncr-btn-secondary" href="/tools/vibe-auditor.html">Run the Vibe Auditor</a>
      </div>
    </div>`;
  }

  const related = article.relatedTools.map(sl => {
    const t = getToolData(sl);
    return `<a href="#review/${sl}" class="related-tool">${t.name}</a>`;
  }).join('');

  const bodyHtml = article.sections.map(s => `
    <section class="article-section">
      <h2>${s.heading}</h2>
      <p>${s.body.replace(/\n/g, '<br>')}</p>
    </section>
  `).join('');

  const toc = article.sections.map(s => `<a href="#${s.heading.toLowerCase().replace(/\s+/g,'-')}">${s.heading}</a>`).join('');

  return `
  ${premiumNav('blog')}
  <div class="article-page ncr-container">
    <header class="article-hero">
      <div class="blog-card__meta">
        <span class="blog-category">${article.category}</span>
        <span class="blog-card__status ${article.status.toLowerCase().replace(/\s+/g,'-')}">${article.status}</span>
      </div>
      <h1>${article.title}</h1>
      <p class="article-intent">${article.intent} • ${article.evidenceStatus}</p>
    </header>

    <div class="article-layout">
      <nav class="article-toc">
        <strong>On this page</strong>
        ${toc}
      </nav>

      <div class="article-body">
        ${bodyHtml}

        <div class="article-evidence-note ncr-glass">
          <strong>Evidence note:</strong> ${article.evidenceStatus}. This article is published as a high-quality draft to help builders. Full supporting benchmarks and per-tool evidence are being collected.
        </div>

        <div class="article-cta ncr-glass">
          <a class="ncr-btn ncr-btn-primary" href="${article.primaryCta.href}">${article.primaryCta.label}</a>
          <p style="margin-top:8px;font-size:13px;">One focused action beats reading another 10 listicles.</p>
        </div>

        ${article.relatedTools.length ? `
        <div class="article-related">
          <strong>Related tools</strong>
          <div>${related}</div>
        </div>` : ''}
      </div>
    </div>

    <div class="article-related ncr-glass" style="margin-top:30px;">
      <strong>Keep exploring</strong>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;">
        <a href="#blog">Back to Blog</a>
        <a href="#reviews">Browse reviews</a>
        <a href="#tools">All tools</a>
        <a href="#methodology">Methodology</a>
        <a href="/tools/vibe-auditor.html">Run Vibe Auditor</a>
      </div>
    </div>
  </div>`;
}

