import { useState } from "react";

/* ═══════════════════════════════════════════════════════════
   NO-CODE REVIEWED — HEAD-TO-HEAD COMPARISONS
   nocodereviewed.lovable.app/compare
   Design: matches anchor site — DM Sans + DM Mono, warm palette
═══════════════════════════════════════════════════════════ */

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
  warn: "#b83020",
  warnBg: "#fdf0ee",
  surface: "#ffffff",
};

/* ─────────────────────────────────────────────
   PLATFORM MASTER DATA
───────────────────────────────────────────── */
const P = {
  webflow: {
    id: "webflow", name: "Webflow", color: "#146EF5", emoji: "🌊",
    tagline: "Design-led visual web builder",
    url: "https://nocodereviewed.lovable.app/webflow",
    pricing: "Free → $14/mo",
    scores: {
      "Design freedom":    9.5,
      "Ease of use":       6.5,
      "AI capability":     6.5,
      "Build speed":       7.0,
      "App building":      5.0,
      "CMS & content":     8.0,
      "Ecommerce":         7.0,
      "SEO":               9.0,
      "Value for money":   7.0,
      "Hosting quality":   8.5,
    },
    overall: 8.6,
    bestFor: ["Design-led marketing sites", "Agency client work", "Content-heavy sites", "SEO-critical projects"],
    notFor: ["Web apps or SaaS", "Non-designers", "Heavy ecommerce", "Rapid prototyping"],
  },
  lovable: {
    id: "lovable", name: "Lovable", color: "#e8541a", emoji: "❤️",
    tagline: "AI-first full-stack app builder",
    url: "https://nocodereviewed.lovable.app",
    pricing: "Free → $20/mo",
    scores: {
      "Design freedom":    7.0,
      "Ease of use":       8.5,
      "AI capability":     9.0,
      "Build speed":       9.0,
      "App building":      9.0,
      "CMS & content":     6.5,
      "Ecommerce":         6.0,
      "SEO":               6.0,
      "Value for money":   8.5,
      "Hosting quality":   8.0,
    },
    overall: 8.8,
    bestFor: ["Full-stack web apps", "SaaS MVPs", "Non-technical founders", "Supabase-backed projects"],
    notFor: ["Pixel-perfect design work", "SEO-critical sites", "Heavy ecommerce", "Static marketing sites"],
  },
  bolt: {
    id: "bolt", name: "Bolt.new", color: "#00d4ff", emoji: "⚡",
    tagline: "Browser-native dev environment",
    url: "https://nocodereviewed.lovable.app/bolt",
    pricing: "Free → $20/mo",
    scores: {
      "Design freedom":    7.5,
      "Ease of use":       6.0,
      "AI capability":     8.5,
      "Build speed":       8.5,
      "App building":      9.5,
      "CMS & content":     5.0,
      "Ecommerce":         5.5,
      "SEO":               5.5,
      "Value for money":   7.9,
      "Hosting quality":   7.5,
    },
    overall: 8.3,
    bestFor: ["Developers building full-stack apps", "Projects needing real npm packages", "Technical founders", "API-heavy backends"],
    notFor: ["Non-coders", "Marketing sites", "Visual/design-led work", "CMS-driven content"],
  },
  v0: {
    id: "v0", name: "v0 by Vercel", color: "#0070f3", emoji: "▲",
    tagline: "AI component generator for developers",
    url: "https://nocodereviewed.lovable.app/v0",
    pricing: "Free → $20/mo",
    scores: {
      "Design freedom":    8.0,
      "Ease of use":       7.0,
      "AI capability":     9.0,
      "Build speed":       8.0,
      "App building":      7.5,
      "CMS & content":     4.5,
      "Ecommerce":         5.0,
      "SEO":               6.0,
      "Value for money":   8.5,
      "Hosting quality":   9.0,
    },
    overall: 8.1,
    bestFor: ["React component generation", "Developers integrating AI-gen UI", "Next.js + Vercel projects", "Designer-developer handoff"],
    notFor: ["Non-developers", "Full app generation", "CMS or content sites", "Non-React stacks"],
  },
  framer: {
    id: "framer", name: "Framer", color: "#0099ff", emoji: "🔷",
    tagline: "Motion-first website builder",
    url: "https://nocodereviewed.lovable.app/framer",
    pricing: "Free → $10/mo",
    scores: {
      "Design freedom":    8.5,
      "Ease of use":       8.0,
      "AI capability":     7.0,
      "Build speed":       8.5,
      "App building":      4.5,
      "CMS & content":     7.0,
      "Ecommerce":         5.0,
      "SEO":               7.5,
      "Value for money":   8.0,
      "Hosting quality":   8.5,
    },
    overall: 8.2,
    bestFor: ["Portfolios and personal sites", "Motion-heavy marketing sites", "Designers who find Webflow too complex", "Affordable agency sites"],
    notFor: ["Web apps", "Complex ecommerce", "Heavy CMS needs", "Non-designers"],
  },
  famous: {
    id: "famous", name: "Famous.ai", color: "#7C3AED", emoji: "🚀",
    tagline: "Prompt-to-native mobile app builder",
    url: "https://nocodereviewed.lovable.app/famous",
    pricing: "Free → $29/mo",
    scores: {
      "Design freedom":    6.5,
      "Ease of use":       9.4,
      "AI capability":     8.0,
      "Build speed":       9.1,
      "App building":      8.5,
      "CMS & content":     5.5,
      "Ecommerce":         5.0,
      "SEO":               4.0,
      "Value for money":   8.5,
      "Hosting quality":   7.0,
    },
    overall: 8.3,
    bestFor: ["Native iOS + Android apps", "Non-technical mobile founders", "Consumer app MVPs", "Agency mobile prototyping"],
    notFor: ["Web-only projects", "SEO-driven sites", "Complex backend logic", "Enterprise-scale apps"],
  },
};

/* ─────────────────────────────────────────────
   COMPARISON DATABASE
   All meaningful pairings with opinionated verdicts
───────────────────────────────────────────── */
const COMPARISONS = [
  {
    id: "webflow-vs-framer",
    a: "webflow", b: "framer",
    headline: "Webflow vs Framer",
    subhead: "Two design-led builders — one for mastery, one for speed",
    tldr: "Choose Webflow if you need production-grade CMS, SEO control, and are willing to invest time learning. Choose Framer if you want beautiful sites faster, with a gentler learning curve and better pricing.",
    winner: "a",
    winnerContext: "for most marketing sites",
    sections: [
      {
        title: "Design & visual control",
        verdict: "webflow",
        body: "Webflow gives you the full CSS box model visually — flexbox, grid, custom properties, pseudo-states, breakpoints. It's the most complete design environment in no-code by a significant margin. Framer is excellent and covers 90% of use cases, but it abstracts away some lower-level controls that power users will eventually want. If pixel-perfect fidelity is non-negotiable, Webflow wins.",
      },
      {
        title: "Ease of learning",
        verdict: "framer",
        body: "This isn't close. Framer's interface is immediately intuitive for anyone with Figma experience — the concepts map closely. Webflow requires understanding CSS layout principles to use effectively; without that background, you'll hit walls within the first hour. Webflow University is excellent, but you're still looking at 20–40 hours before you feel fluent. Framer is productive in a day.",
      },
      {
        title: "CMS & content",
        verdict: "webflow",
        body: "Webflow's CMS is a genuine product with relational content, dynamic filtering, and a clean editor for non-technical clients. Framer's CMS covers the basics — blog posts, team pages — but lacks the depth for serious content-heavy sites. For agencies managing client content, Webflow is the only choice.",
      },
      {
        title: "Animations & interactions",
        verdict: "draw",
        body: "Both are exceptional here for different reasons. Framer's motion system is built on Framer Motion (the industry-standard React animation library) and is genuinely beautiful out of the box. Webflow's Interactions panel gives you timeline-level scroll and trigger control. Framer is easier; Webflow is more precise. It's a genuine tie that depends on your workflow.",
      },
      {
        title: "SEO",
        verdict: "webflow",
        body: "Webflow gives you granular control over meta tags, Open Graph, canonical URLs, structured data, sitemaps, and redirects. Framer covers the essentials but doesn't match Webflow's depth. For any project where Google ranking is a primary KPI, Webflow is the clear choice.",
      },
      {
        title: "Pricing",
        verdict: "framer",
        body: "Framer starts at $10/month for a site with a custom domain. Webflow starts at $14/month for the site plan, but realistically you'll need a higher tier for CMS-driven projects. Framer is meaningfully cheaper for most use cases, and the free tier is more functional.",
      },
    ],
    useCaseMatrix: [
      { useCase: "Agency client marketing site", pick: "webflow", why: "Better CMS, cleaner client handoff" },
      { useCase: "Designer portfolio", pick: "framer", why: "Faster, cheaper, still beautiful" },
      { useCase: "Blog or content site", pick: "webflow", why: "CMS depth and SEO control" },
      { useCase: "Landing page", pick: "framer", why: "Done in hours, not days" },
      { useCase: "SaaS marketing site", pick: "webflow", why: "SEO + CMS combo is hard to beat" },
      { useCase: "First project, learning curve matters", pick: "framer", why: "Webflow is genuinely hard to start" },
    ],
  },
  {
    id: "lovable-vs-bolt",
    a: "lovable", b: "bolt",
    headline: "Lovable vs Bolt.new",
    subhead: "The two dominant AI app builders — polish vs power",
    tldr: "Lovable is the better default for most builders — more hand-holding, better UI output, simpler Supabase integration. Bolt.new is the better choice if you're technical and need real npm packages, a backend, or full codebase control.",
    winner: "a",
    winnerContext: "for non-technical and solo founders",
    sections: [
      {
        title: "Who can use it",
        verdict: "lovable",
        body: "Lovable is genuinely accessible to non-coders. Its AI anticipates what you mean, suggests fixes, and scaffolds Supabase in a guided way. Bolt.new expects you to understand what a package.json is, know the difference between a dev and production build, and be comfortable reading terminal output. Not impossible for non-coders, but notably harder.",
      },
      {
        title: "App quality & UI output",
        verdict: "lovable",
        body: "Lovable's default UI output is consistently more polished. Components look production-ready from the first generation — spacing, typography, and colour usage are handled well. Bolt.new produces functionally correct code that can look utilitarian without styling refinement. Lovable closes the gap between 'generated' and 'designed'.",
      },
      {
        title: "Backend & full-stack power",
        verdict: "bolt",
        body: "Bolt.new runs a real Node.js environment via WebContainers. You can install any npm package, build Express or Hono APIs, run background jobs, and write server logic that Lovable simply can't touch. For projects with complex backend requirements — custom webhooks, queue systems, database procedures — Bolt.new is in a different class.",
      },
      {
        title: "AI codebase understanding",
        verdict: "bolt",
        body: "Bolt.new's AI sees the entire project at once — every file, every import, every type definition — and can make coherent cross-file changes. Lovable's AI context is also strong but occasionally loses coherence on larger projects. For complex refactors, Bolt.new is more reliable.",
      },
      {
        title: "Supabase & database integration",
        verdict: "lovable",
        body: "Both integrate with Supabase, but Lovable's integration is more guided and less error-prone for non-technical users. Row-level security, schema setup, and auth flows are scaffolded with better defaults. Bolt.new's Supabase integration works but expects more developer knowledge to configure correctly.",
      },
      {
        title: "Cost transparency",
        verdict: "bolt",
        body: "Bolt.new shows you exactly how many tokens each operation consumes. Lovable's credit system is opaque — it's harder to predict how much a feature will cost before you build it. Power users strongly prefer Bolt's transparency for controlling spending.",
      },
    ],
    useCaseMatrix: [
      { useCase: "SaaS MVP, non-technical founder", pick: "lovable", why: "More hand-holding, better defaults" },
      { useCase: "Full-stack app, developer building", pick: "bolt", why: "Real npm, real backend, real control" },
      { useCase: "Internal tool with complex API logic", pick: "bolt", why: "Node.js backend is a genuine advantage" },
      { useCase: "Consumer app with Supabase backend", pick: "lovable", why: "Better guided integration" },
      { useCase: "Prototype in a weekend", pick: "lovable", why: "Faster to a usable, polished result" },
      { useCase: "Startup that will need developer later", pick: "bolt", why: "Cleaner, more portable codebase" },
    ],
  },
  {
    id: "webflow-vs-lovable",
    a: "webflow", b: "lovable",
    headline: "Webflow vs Lovable",
    subhead: "Visual design mastery vs AI-powered app building",
    tldr: "These tools don't really compete — they serve different jobs. Webflow builds websites; Lovable builds web applications. The confusion only happens if you're unclear on what you actually need.",
    winner: null,
    winnerContext: "depends entirely on your project type",
    sections: [
      {
        title: "The fundamental difference",
        verdict: "draw",
        body: "This is the most important thing to understand: Webflow is a website builder. Lovable is an application builder. A marketing site, a blog, a portfolio — Webflow. A tool users log into, interact with, and store data in — Lovable. Most confusion between these tools comes from not being clear on this distinction upfront.",
      },
      {
        title: "Design control",
        verdict: "webflow",
        body: "Webflow's visual design control is unmatched in no-code. If your project is visual — layouts, typography, pixel precision, responsive breakpoints — Webflow is the tool. Lovable's AI produces functional, reasonably attractive UI but it's not a design tool. You're directing an AI, not designing in a canvas.",
      },
      {
        title: "User accounts, auth & data",
        verdict: "lovable",
        body: "Lovable connects to Supabase and handles user authentication, row-level security, and real-time data out of the box. Webflow's Memberships product exists but is limited and expensive. If your site requires users to sign up, log in, and interact with their own data, Lovable is the only sensible choice between these two.",
      },
      {
        title: "SEO & content marketing",
        verdict: "webflow",
        body: "Webflow's CMS, SEO controls, and clean HTML output make it genuinely competitive with custom-coded sites on Google. Lovable is not built for SEO — it generates React SPAs, which require additional configuration to rank well. For any project where organic search is a meaningful channel, Webflow wins decisively.",
      },
      {
        title: "Speed to launch",
        verdict: "lovable",
        body: "Lovable can produce a working authenticated web application in hours from a plain-English description. Webflow requires real learning investment before you can build anything complex. For speed, it's not close — Lovable wins, but only for the things it's good at.",
      },
      {
        title: "Non-technical accessibility",
        verdict: "lovable",
        body: "Lovable is genuinely usable by non-technical founders and product people. Webflow, despite its no-code positioning, requires an understanding of CSS layout principles to use productively. The learning curve is steep enough that many non-technical users bounce off it.",
      },
    ],
    useCaseMatrix: [
      { useCase: "Company marketing website", pick: "webflow", why: "SEO, CMS, and design control" },
      { useCase: "SaaS product (the app itself)", pick: "lovable", why: "Auth, database, user accounts" },
      { useCase: "Blog or editorial site", pick: "webflow", why: "CMS and SEO built for it" },
      { useCase: "Startup needing both site + app", pick: "draw", why: "Use Webflow for marketing, Lovable for the product" },
      { useCase: "E-commerce store", pick: "webflow", why: "More mature, though neither is ideal" },
      { useCase: "Internal dashboard", pick: "lovable", why: "Data + auth is its core strength" },
    ],
  },
  {
    id: "lovable-vs-v0",
    a: "lovable", b: "v0",
    headline: "Lovable vs v0",
    subhead: "Complete app builder vs component generator",
    tldr: "Lovable builds entire applications end-to-end. v0 generates individual UI components for developers to integrate into their own codebase. They're complementary more than competing — unless you're a developer deciding where to start.",
    winner: "a",
    winnerContext: "for non-developers and full app projects",
    sections: [
      {
        title: "What each tool actually does",
        verdict: "draw",
        body: "v0 is a component generator — you describe UI, it produces React + Tailwind + shadcn/ui code you paste into your project. Lovable is a full-stack builder — it produces an entire application with routing, auth, database, and deployment. Using them in the same sentence is often a category error. Developers frequently use both: v0 for component polish, Lovable for architecture.",
      },
      {
        title: "Who can use it without coding",
        verdict: "lovable",
        body: "Lovable is genuinely accessible to non-coders — the output is a running app you can use and deploy. v0 generates code that needs to be integrated into an existing React project. Without developer knowledge, v0's output is a text file you can't do much with. Lovable's output is a live URL.",
      },
      {
        title: "UI component quality",
        verdict: "v0",
        body: "v0's component output is exceptional — the best in class for React/shadcn/ui. Components are clean, accessible, typed, and immediately usable in production codebases. Lovable's UI is good but noticeably more variable — some screens are great, others need refinement. If pure component quality is the metric, v0 wins.",
      },
      {
        title: "Full application output",
        verdict: "lovable",
        body: "Lovable builds complete applications: multiple pages, navigation, state management, database schema, authentication flows, and deployment. v0 generates components and can scaffold pages, but it's not designed to produce a complete working application with a backend.",
      },
      {
        title: "Vercel / Next.js integration",
        verdict: "v0",
        body: "v0 is built by Vercel and deploys to Vercel with one click. If your stack is Next.js on Vercel (a very common setup), v0's integration is seamless and unmatched. Component code is production-ready for this environment without modification.",
      },
      {
        title: "Value for money",
        verdict: "v0",
        body: "v0's free tier (200 credits/month) is genuinely useful for a working developer — enough to generate and refine several components per week. Both paid tiers are $20/month, but v0 delivers more value per credit for developers who know what they're doing.",
      },
    ],
    useCaseMatrix: [
      { useCase: "Non-developer building an app", pick: "lovable", why: "v0 requires a codebase to integrate into" },
      { useCase: "Developer needing polished React UI fast", pick: "v0", why: "Best-in-class component output" },
      { useCase: "Full SaaS product", pick: "lovable", why: "v0 doesn't do backend or auth" },
      { useCase: "Design system components", pick: "v0", why: "Made for exactly this" },
      { useCase: "Next.js project on Vercel", pick: "v0", why: "Native integration, zero friction" },
      { useCase: "MVP that needs to work end-to-end", pick: "lovable", why: "Complete stack from one tool" },
    ],
  },
  {
    id: "bolt-vs-v0",
    a: "bolt", b: "v0",
    headline: "Bolt.new vs v0",
    subhead: "Full-stack browser IDE vs UI component generator",
    tldr: "Bolt.new builds entire full-stack applications with a real Node.js backend. v0 generates beautiful UI components for React projects. Different tools for different moments — though both target developers.",
    winner: "a",
    winnerContext: "for complete project builds",
    sections: [
      {
        title: "Scope of output",
        verdict: "bolt",
        body: "Bolt.new produces complete full-stack projects — frontend, backend API routes, database integration, environment variables, build config. v0 produces UI components and pages, not complete applications. For anything requiring a backend, Bolt.new is in a different category.",
      },
      {
        title: "UI & component quality",
        verdict: "v0",
        body: "v0's component output is more polished and consistent than Bolt.new's. Bolt produces functionally correct code but the visual quality is more variable. v0's shadcn/ui output specifically is the best AI-generated React UI available.",
      },
      {
        title: "Backend capability",
        verdict: "bolt",
        body: "Bolt.new runs a real Node.js environment — Express, Hono, Prisma, tRPC, whatever you need. v0 is frontend-only. No contest for any project with meaningful server-side logic.",
      },
      {
        title: "Developer experience",
        verdict: "draw",
        body: "Both are excellent for developers. Bolt's in-browser terminal and full IDE feel is powerful for complex projects. v0's chat interface and one-click Vercel deploy is frictionless for component work. Which DX wins depends on what you're building.",
      },
      {
        title: "Integration into existing projects",
        verdict: "v0",
        body: "v0 generates drop-in React components with no friction — copy the code, paste into your project, done. Bolt.new is more of a standalone environment; exporting and integrating into an existing codebase requires more manual work.",
      },
      {
        title: "Cost control",
        verdict: "bolt",
        body: "Bolt.new's transparent token usage lets you understand and optimize spending in real time. v0's credit system is simpler but less granular. For cost-conscious heavy users, Bolt's visibility is a genuine advantage.",
      },
    ],
    useCaseMatrix: [
      { useCase: "Full-stack SaaS from scratch", pick: "bolt", why: "Real Node backend, complete project" },
      { useCase: "React component for existing project", pick: "v0", why: "Better output, easier integration" },
      { useCase: "Next.js project on Vercel", pick: "v0", why: "Native integration is unbeatable" },
      { useCase: "API-heavy internal tool", pick: "bolt", why: "Real backend logic capability" },
      { useCase: "UI design system work", pick: "v0", why: "Made for exactly this" },
      { useCase: "Full-stack prototype in a day", pick: "bolt", why: "Complete stack, deployed fast" },
    ],
  },
  {
    id: "webflow-vs-bolt",
    a: "webflow", b: "bolt",
    headline: "Webflow vs Bolt.new",
    subhead: "Visual website builder vs code-first AI dev environment",
    tldr: "These barely compete. Webflow is a visual design tool for websites. Bolt.new is a developer tool for building applications. The only overlap is 'I need something on the internet' — and the right choice depends entirely on whether it's a site or an app.",
    winner: null,
    winnerContext: "depends on site vs app",
    sections: [
      {
        title: "The core distinction",
        verdict: "draw",
        body: "Webflow is a design-led website builder for marketers, designers, and agencies. Bolt.new is a code-first AI development environment for technical builders. These tools do not compete on the same axis — choosing between them should be easy: if you're building a public-facing website with design as a priority, Webflow. If you're building an interactive application with a backend, Bolt.",
      },
      {
        title: "Who can actually use it",
        verdict: "webflow",
        body: "Webflow is accessible to designers and people with CSS knowledge, but not to complete non-coders. Bolt.new is for developers. Neither is truly beginner-friendly, but Webflow has a lower technical floor — you need design understanding, not programming knowledge.",
      },
      {
        title: "Design quality of output",
        verdict: "webflow",
        body: "Webflow's visual canvas produces design-precise output with control over every CSS property. Bolt.new generates functional code that may need significant styling work to look production-ready. For anything where aesthetics are a primary deliverable, Webflow is better by a wide margin.",
      },
      {
        title: "Application logic",
        verdict: "bolt",
        body: "Bolt.new can build real backends, process API requests, connect to databases, handle authentication, and run any npm package. Webflow has essentially no application logic capability — it's a static or CMS-driven site builder. If your project does anything a website doesn't do (user accounts, data, real-time features), Bolt is the only option of the two.",
      },
      {
        title: "SEO",
        verdict: "webflow",
        body: "Webflow generates clean semantic HTML with full SEO controls. Bolt.new generates React SPAs by default — single-page apps that require SSR configuration to rank well. For organic search, Webflow is dramatically better out of the box.",
      },
    ],
    useCaseMatrix: [
      { useCase: "Marketing website", pick: "webflow", why: "Design + SEO is its entire purpose" },
      { useCase: "Web application with user accounts", pick: "bolt", why: "Webflow can't do this" },
      { useCase: "Developer portfolio", pick: "webflow", why: "Better design output, good SEO" },
      { useCase: "Internal tool or dashboard", pick: "bolt", why: "Real backend, real data" },
      { useCase: "Agency client site", pick: "webflow", why: "CMS handoff is mature and clean" },
      { useCase: "REST API backend", pick: "bolt", why: "Webflow literally cannot build this" },
    ],
  },
  {
    id: "framer-vs-lovable",
    a: "framer", b: "lovable",
    headline: "Framer vs Lovable",
    subhead: "Beautiful websites vs functional applications",
    tldr: "Like Webflow vs Lovable, this comparison mostly resolves to 'site or app?' Framer is a best-in-class website builder. Lovable is a best-in-class app builder. Pick based on what you're building, not what you've heard.",
    winner: null,
    winnerContext: "depends on site vs app",
    sections: [
      {
        title: "Websites vs applications",
        verdict: "draw",
        body: "Framer is a website builder — public-facing, design-led, no user accounts or server logic. Lovable is an application builder — authentication, database, interactive features. The rare case where these overlap is a marketing site where you also want a simple app feature (waitlist signup, form submission) — and in that case, Lovable's simplicity often wins on speed.",
      },
      {
        title: "Animation & visual design",
        verdict: "framer",
        body: "Framer is built on Framer Motion, the best animation library in the React ecosystem. Its default motion design is genuinely beautiful — scroll-triggered reveals, smooth page transitions, hover states. Lovable produces functional UI that lacks the expressive motion design Framer handles effortlessly.",
      },
      {
        title: "Non-technical accessibility",
        verdict: "lovable",
        body: "Both are accessible to non-technical users, but Lovable edges ahead. Framer requires some understanding of how pages, components, and CMS work. Lovable accepts natural language descriptions and handles the architecture — you describe what you want, it figures out how to build it.",
      },
      {
        title: "Application features",
        verdict: "lovable",
        body: "Lovable handles authentication, user data, Supabase, real-time updates, and interactive features that Framer simply cannot build. If your project needs anything more than a static or CMS-driven website, Framer is the wrong tool.",
      },
      {
        title: "Speed to live site",
        verdict: "draw",
        body: "Both are fast. Framer lets you go from blank canvas to published site in an afternoon. Lovable generates working apps from a paragraph description in minutes. The speed comparison depends on what 'done' means — a visual site (Framer) or a functional app (Lovable).",
      },
      {
        title: "Pricing",
        verdict: "framer",
        body: "Framer starts at $10/month — the cheapest of any design-quality website builder. Lovable's free tier is limited; meaningful projects need the $20/month plan. For a pure website, Framer gives you more value per dollar.",
      },
    ],
    useCaseMatrix: [
      { useCase: "Portfolio site", pick: "framer", why: "Beautiful, cheap, fast" },
      { useCase: "SaaS product", pick: "lovable", why: "Framer can't build applications" },
      { useCase: "Landing page with waitlist", pick: "lovable", why: "Form + email handling built in" },
      { useCase: "Agency marketing site", pick: "framer", why: "Design quality + affordable" },
      { useCase: "Internal tool", pick: "lovable", why: "Framer has no data layer" },
      { useCase: "Blog or content site", pick: "framer", why: "CMS + motion design is its strength" },
    ],
  },
  {
    id: "lovable-vs-famous",
    a: "lovable", b: "famous",
    headline: "Lovable vs Famous.ai",
    subhead: "Web app builder vs native mobile app builder",
    tldr: "The platform choice here should start with one question: do you need a native mobile app (iOS/Android) or a web application? Famous.ai is the only tool in this network that produces real native apps. Lovable produces web apps.",
    winner: null,
    winnerContext: "depends on web vs mobile",
    sections: [
      {
        title: "Web vs native mobile",
        verdict: "draw",
        body: "This is the defining difference. Lovable produces web applications — they run in a browser, can be made mobile-responsive, but are not native apps. Famous.ai produces actual native iOS and Android applications published to the App Store and Google Play. If you need native, Famous.ai is your only option in this comparison.",
      },
      {
        title: "Ease of use for non-coders",
        verdict: "famous",
        body: "Famous.ai's premise — describe your app, get a native app — is the simplest value proposition in this space. The interface is conversational and the output is immediately understandable. Lovable is also accessible to non-coders but involves more concepts (Supabase, auth, database schemas) that require some mental model.",
      },
      {
        title: "App complexity ceiling",
        verdict: "lovable",
        body: "Lovable's ceiling is significantly higher for complex web applications. Its Supabase integration, full-stack architecture, and developer-friendly codebase mean you can build genuinely sophisticated products. Famous.ai is excellent for consumer-facing apps with standard features, but hits limits on complex business logic.",
      },
      {
        title: "Backend & data",
        verdict: "lovable",
        body: "Lovable's Supabase integration is comprehensive — real-time data, row-level security, complex queries. Famous.ai generates data models for your app but the backend infrastructure is more opaque and less customisable. Lovable gives you more control over your data layer.",
      },
      {
        title: "Time to working prototype",
        verdict: "famous",
        body: "For a mobile app specifically, Famous.ai is faster than anything else in the market. From prompt to reviewable native app in minutes is a genuine claim. Lovable is also fast for web apps, but the development lifecycle for mobile (simulator, testing, App Store submission) adds complexity Famous.ai handles for you.",
      },
      {
        title: "SEO & discoverability",
        verdict: "lovable",
        body: "Web apps can be found on Google. Native apps are found in app stores. Neither Lovable nor Famous.ai is built for SEO, but web apps at least have a path to organic search traffic. If user acquisition will include SEO, build on Lovable and add a web presence.",
      },
    ],
    useCaseMatrix: [
      { useCase: "iOS + Android app", pick: "famous", why: "Only tool that builds real native apps" },
      { useCase: "Web SaaS product", pick: "lovable", why: "Famous.ai is mobile-first" },
      { useCase: "Habit tracker or consumer app", pick: "famous", why: "Its exact sweet spot" },
      { useCase: "B2B tool or dashboard", pick: "lovable", why: "Web is right for this; more backend control" },
      { useCase: "Mobile MVP for app store validation", pick: "famous", why: "Fastest path to App Store" },
      { useCase: "Product with web + mobile needs", pick: "lovable", why: "Web app with mobile-responsive design, or use both" },
    ],
  },
];

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */
const Chip = ({ children, color }) => (
  <span style={{
    display: "inline-block", fontSize: 10, fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase",
    padding: "3px 10px", borderRadius: 99,
    background: color ? `${color}18` : G.accentBg,
    color: color || G.accent,
    border: `1px solid ${color ? `${color}40` : G.accentBorder}`,
    fontFamily: "'DM Mono', monospace",
  }}>{children}</span>
);

const ScoreCell = ({ score, color, isWinner }) => (
  <div style={{
    textAlign: "center", padding: "10px 8px",
    background: isWinner ? `${color}12` : "transparent",
    borderRadius: 6,
  }}>
    <div style={{ fontSize: 20, fontWeight: 700, color: isWinner ? color : G.muted, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{score.toFixed(1)}</div>
    {isWinner && <div style={{ fontSize: 9, color, marginTop: 3, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>WINS</div>}
  </div>
);

const VerdictBadge = ({ verdict, aId, bId }) => {
  if (verdict === "draw") return <Chip color={G.soft}>Tie</Chip>;
  if (verdict === aId) return <Chip color={G.good}>← Wins</Chip>;
  if (verdict === bId) return <Chip color="#0099ff">Wins →</Chip>;
  return null;
};

const UseCaseRow = ({ useCase, pick, why, pA, pB }) => {
  const isA = pick === pA.id;
  const isB = pick === pB.id;
  const isDraw = pick === "draw";
  const winner = isDraw ? null : (isA ? pA : pB);
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr",
      gap: 12, padding: "14px 0",
      borderBottom: `1px solid ${G.border}`, alignItems: "center",
    }}>
      <div style={{ fontSize: 13, color: G.text, fontWeight: 500 }}>{useCase}</div>
      <div style={{ textAlign: "center", minWidth: 100 }}>
        {isDraw
          ? <span style={{ fontSize: 11, color: G.soft, fontFamily: "'DM Mono', monospace" }}>Either works</span>
          : <span style={{
              fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99,
              background: `${winner.color}15`, color: winner.color,
              fontFamily: "'DM Mono', monospace",
            }}>{winner.name}</span>
        }
      </div>
      <div style={{ fontSize: 12, color: G.muted, textAlign: "right" }}>{why}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   COMPARISON VIEW
───────────────────────────────────────────── */
const ComparisonView = ({ comp, onBack }) => {
  const pA = P[comp.a];
  const pB = P[comp.b];
  const allKeys = Object.keys(pA.scores);

  return (
    <div>
      {/* Back */}
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        fontSize: 13, color: G.muted, display: "flex", alignItems: "center", gap: 6,
        marginBottom: 24, fontFamily: "'DM Sans', sans-serif",
      }}>← All comparisons</button>

      {/* Hero */}
      <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 16, padding: "28px 28px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: G.soft, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>No-Code Reviewed</span>
          <span style={{ color: G.border2 }}>·</span>
          <span style={{ fontSize: 11, color: G.soft, fontFamily: "'DM Mono', monospace" }}>Head-to-head · Updated May 2026</span>
        </div>
        <h1 style={{ fontSize: "clamp(22px, 5vw, 36px)", fontWeight: 700, color: G.text, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 6 }}>{comp.headline}</h1>
        <p style={{ fontSize: 14, color: G.muted, marginBottom: 20 }}>{comp.subhead}</p>

        {/* Platform comparison bar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
          <div style={{ background: `${pA.color}10`, border: `1.5px solid ${pA.color}40`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", align: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{pA.emoji}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: G.text }}>{pA.name}</span>
            </div>
            <div style={{ fontSize: 12, color: G.muted, marginBottom: 10 }}>{pA.tagline}</div>
            <div style={{ fontSize: 11, color: G.soft, fontFamily: "'DM Mono', monospace" }}>{pA.pricing}</div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: G.soft }}>vs</div>
          </div>

          <div style={{ background: `${pB.color}10`, border: `1.5px solid ${pB.color}40`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", align: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{pB.emoji}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: G.text }}>{pB.name}</span>
            </div>
            <div style={{ fontSize: 12, color: G.muted, marginBottom: 10 }}>{pB.tagline}</div>
            <div style={{ fontSize: 11, color: G.soft, fontFamily: "'DM Mono', monospace" }}>{pB.pricing}</div>
          </div>
        </div>
      </div>

      {/* TL;DR */}
      <div style={{
        background: G.accentBg, border: `1px solid ${G.accentBorder}`,
        borderLeft: `3px solid ${G.accent}`,
        borderRadius: "0 10px 10px 0", padding: "16px 20px", marginBottom: 20,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.accent, marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>TL;DR</div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: G.text }}>{comp.tldr}</p>
        {comp.winner && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: G.muted }}>Overall edge:</span>
            <Chip color={P[comp.winner].color}>{P[comp.winner].name} {comp.winnerContext}</Chip>
          </div>
        )}
        {!comp.winner && (
          <div style={{ marginTop: 12 }}>
            <Chip color={G.soft}>No universal winner · {comp.winnerContext}</Chip>
          </div>
        )}
      </div>

      {/* Score table */}
      <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.soft, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>Score comparison</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: 0 }}>
          <div />
          <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: pA.color, marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>{pA.name}</div>
          <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: pB.color, marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>{pB.name}</div>

          {allKeys.map(key => {
            const sA = pA.scores[key];
            const sB = pB.scores[key];
            const aWins = sA > sB;
            const bWins = sB > sA;
            return [
              <div key={`${key}-label`} style={{ fontSize: 13, color: G.muted, display: "flex", alignItems: "center", padding: "2px 0", borderBottom: `1px solid ${G.border}` }}>{key}</div>,
              <div key={`${key}-a`} style={{ borderBottom: `1px solid ${G.border}` }}>
                <ScoreCell score={sA} color={pA.color} isWinner={aWins} />
              </div>,
              <div key={`${key}-b`} style={{ borderBottom: `1px solid ${G.border}` }}>
                <ScoreCell score={sB} color={pB.color} isWinner={bWins} />
              </div>,
            ];
          })}

          <div style={{ fontSize: 13, fontWeight: 700, color: G.text, paddingTop: 12 }}>Overall rating</div>
          <div><ScoreCell score={pA.overall} color={pA.color} isWinner={pA.overall > pB.overall} /></div>
          <div><ScoreCell score={pB.overall} color={pB.color} isWinner={pB.overall > pA.overall} /></div>
        </div>
      </div>

      {/* Section verdicts */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.soft, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>Category breakdown</div>
        {comp.sections.map((sec, i) => (
          <div key={i} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: G.text }}>{sec.title}</span>
              <VerdictBadge verdict={sec.verdict} aId={comp.a} bId={comp.b} />
            </div>
            <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.75, margin: 0 }}>{sec.body}</p>
          </div>
        ))}
      </div>

      {/* Use case matrix */}
      <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: G.soft, marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>Use-case guide</div>
        <div style={{ display: "grid", gridTemplateColumns: "auto auto auto", gap: 0, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: G.soft, padding: "8px 0", borderBottom: `1px solid ${G.border}`, fontFamily: "'DM Mono', monospace" }}>YOUR SITUATION</div>
          <div style={{ fontSize: 11, color: G.soft, padding: "8px 0", borderBottom: `1px solid ${G.border}`, textAlign: "center", fontFamily: "'DM Mono', monospace" }}>USE THIS</div>
          <div style={{ fontSize: 11, color: G.soft, padding: "8px 0", borderBottom: `1px solid ${G.border}`, textAlign: "right", fontFamily: "'DM Mono', monospace" }}>BECAUSE</div>
        </div>
        {comp.useCaseMatrix.map((row, i) => (
          <UseCaseRow key={i} {...row} pA={pA} pB={pB} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[pA, pB].map(pl => (
          <a key={pl.id} href={pl.url} target="_blank" rel="noopener noreferrer" style={{
            display: "block", padding: "16px 20px",
            background: `${pl.color}12`, border: `1.5px solid ${pl.color}40`,
            borderRadius: 12, textDecoration: "none", textAlign: "center",
            transition: "border-color 0.15s",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: pl.color, marginBottom: 4 }}>{pl.name} full review →</div>
            <div style={{ fontSize: 11, color: G.muted }}>Scores · pricing · deep-dive</div>
          </a>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   INDEX VIEW
───────────────────────────────────────────── */
const IndexView = ({ onSelect, activeSearch, setActiveSearch }) => {
  const filtered = activeSearch
    ? COMPARISONS.filter(c =>
        [c.headline, c.tldr, P[c.a].name, P[c.b].name]
          .some(s => s.toLowerCase().includes(activeSearch.toLowerCase()))
      )
    : COMPARISONS;

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Filter by platform or use case..."
          value={activeSearch}
          onChange={e => setActiveSearch(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px",
            background: G.surface, border: `1px solid ${G.border2}`,
            borderRadius: 10, fontSize: 14, color: G.text,
            outline: "none", fontFamily: "'DM Sans', sans-serif",
            boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = G.accent}
          onBlur={e => e.target.style.borderColor = G.border2}
        />
      </div>

      {/* Platform quick-nav */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {Object.values(P).map(pl => (
          <button key={pl.id} onClick={() => setActiveSearch(pl.name)} style={{
            padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
            background: activeSearch === pl.name ? `${pl.color}18` : G.surface,
            color: activeSearch === pl.name ? pl.color : G.muted,
            border: `1px solid ${activeSearch === pl.name ? `${pl.color}50` : G.border}`,
            cursor: "pointer", fontFamily: "'DM Mono', monospace",
            transition: "all 0.12s",
          }}>{pl.name}</button>
        ))}
        {activeSearch && (
          <button onClick={() => setActiveSearch("")} style={{
            padding: "5px 14px", borderRadius: 99, fontSize: 12,
            background: "transparent", color: G.soft,
            border: `1px solid ${G.border}`, cursor: "pointer",
          }}>Clear ×</button>
        )}
      </div>

      {/* Comparison cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(comp => {
          const pA = P[comp.a];
          const pB = P[comp.b];
          return (
            <button key={comp.id} onClick={() => onSelect(comp.id)} style={{
              background: G.surface, border: `1px solid ${G.border}`,
              borderRadius: 14, padding: "20px 22px",
              cursor: "pointer", textAlign: "left", width: "100%",
              transition: "border-color 0.15s, box-shadow 0.15s",
              fontFamily: "'DM Sans', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G.border2; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  {/* Platform logos */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: pA.color }}>{pA.name}</span>
                    <span style={{ fontSize: 12, color: G.soft }}>vs</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: pB.color }}>{pB.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: G.muted, lineHeight: 1.65, maxWidth: 480 }}>{comp.subhead}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
                  {comp.winner
                    ? <Chip color={P[comp.winner].color}>Edge: {P[comp.winner].name}</Chip>
                    : <Chip color={G.soft}>Context-dependent</Chip>
                  }
                  <span style={{ fontSize: 11, color: G.soft }}>
                    {comp.sections.length} sections · {comp.useCaseMatrix.length} use cases
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: G.muted }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14 }}>No comparisons match "{activeSearch}"</div>
          <button onClick={() => setActiveSearch("")} style={{ marginTop: 12, fontSize: 13, color: G.accent, background: "none", border: "none", cursor: "pointer" }}>Clear filter</button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function NCRComparisons() {
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");

  const activeComp = COMPARISONS.find(c => c.id === activeId);

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: G.bg, minHeight: "100vh",
      padding: "36px 20px 80px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0ede7; }
      `}</style>

      <div style={{ maxWidth: 740, margin: "0 auto" }}>

        {/* Site header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <a href="https://nocodereviewed.lovable.app" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: G.soft, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>No-Code Reviewed</div>
            </a>
            <h1 style={{ fontSize: activeComp ? 15 : 26, fontWeight: 700, color: G.text, letterSpacing: "-0.015em", transition: "font-size 0.2s" }}>
              {activeComp ? "Head-to-head comparisons" : "Head-to-head comparisons"}
            </h1>
          </div>
          {!activeComp && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Chip>{COMPARISONS.length} comparisons</Chip>
              <Chip>{Object.keys(P).length} platforms</Chip>
            </div>
          )}
        </div>

        {/* Subhead — index only */}
        {!activeComp && (
          <p style={{ fontSize: 14, color: G.muted, lineHeight: 1.75, marginBottom: 28, maxWidth: 560 }}>
            We reviewed every major no-code platform in depth. These comparisons use the same scoring data — no affiliate agenda, just honest verdicts based on what each tool actually does well.
          </p>
        )}

        {/* Content */}
        {activeComp
          ? <ComparisonView comp={activeComp} onBack={() => setActiveId(null)} />
          : <IndexView onSelect={setActiveId} activeSearch={search} setActiveSearch={setSearch} />
        }
      </div>
    </div>
  );
}
