import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f5f3ef;
    color: #0f0e0d;
  }

  :root {
    --accent: #e8541a;
    --text: #0f0e0d;
    --card: #faf8f4;
    --muted: #6b6560;
    --border: #e4e0da;
    --warn: #c0392b;
    --good: #1a7a4a;
  }

  .page { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; }

  /* Header */
  .review-header {
    border-bottom: 2px solid var(--border);
    padding-bottom: 32px;
    margin-bottom: 40px;
  }
  .site-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
  }
  .site-label span { color: var(--accent); }
  .review-title {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }
  .review-subtitle {
    font-size: 17px;
    color: var(--muted);
    font-weight: 400;
    line-height: 1.5;
    max-width: 620px;
    margin-bottom: 24px;
  }
  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    font-size: 13px;
    color: var(--muted);
  }
  .meta-row strong { color: var(--text); }
  .meta-dot { color: var(--border); }

  /* Verdict Card */
  .verdict-card {
    background: var(--text);
    color: var(--card);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
  }
  .verdict-card::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    background: var(--accent);
    border-radius: 50%;
    opacity: 0.15;
  }
  .verdict-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 12px;
  }
  .verdict-text {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.55;
    max-width: 680px;
    opacity: 0.92;
  }
  .score-row {
    display: flex;
    gap: 24px;
    margin-top: 28px;
    flex-wrap: wrap;
  }
  .score-item { text-align: center; }
  .score-num {
    font-size: 32px;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
  }
  .score-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    opacity: 0.6;
    margin-top: 4px;
  }

  /* Ratings bar */
  .ratings-grid {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 32px;
    margin-bottom: 40px;
  }
  .ratings-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
  }
  .rating-row {
    display: grid;
    grid-template-columns: 160px 1fr 36px;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  .rating-name { font-size: 14px; font-weight: 500; }
  .rating-bar-track {
    height: 6px;
    background: var(--border);
    border-radius: 99px;
    overflow: hidden;
  }
  .rating-bar-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 99px;
    transition: width 0.6s ease;
  }
  .rating-val { font-size: 14px; font-weight: 600; text-align: right; }

  /* Section layout */
  .section { margin-bottom: 48px; }
  .section-heading {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-bottom: 6px;
  }
  .section-intro {
    font-size: 15px;
    color: var(--muted);
    margin-bottom: 24px;
    line-height: 1.6;
  }

  /* Prose */
  .prose p {
    font-size: 15px;
    line-height: 1.75;
    color: #2a2825;
    margin-bottom: 16px;
  }

  /* Feature cards */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .feature-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
  }
  .feature-icon {
    font-size: 22px;
    margin-bottom: 10px;
  }
  .feature-card h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .feature-card p {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.55;
  }

  /* Alert boxes */
  .alert {
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 20px;
    border-left: 4px solid;
  }
  .alert-warn {
    background: #fff5f4;
    border-color: var(--warn);
  }
  .alert-good {
    background: #f0faf5;
    border-color: var(--good);
  }
  .alert-neutral {
    background: #faf8f4;
    border-color: var(--border);
  }
  .alert-title {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }
  .alert-warn .alert-title { color: var(--warn); }
  .alert-good .alert-title { color: var(--good); }
  .alert-neutral .alert-title { color: var(--muted); }
  .alert p { font-size: 14px; line-height: 1.6; }

  /* Incident timeline */
  .incident-list { list-style: none; }
  .incident-item {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }
  .incident-item:last-child { border-bottom: none; }
  .incident-date {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    padding-top: 2px;
  }
  .incident-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .incident-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.55;
  }
  .badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 99px;
    margin-left: 8px;
    vertical-align: middle;
  }
  .badge-critical { background: #fde8e8; color: var(--warn); }
  .badge-moderate { background: #fff3e0; color: #c67c00; }

  /* Pricing table */
  .pricing-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .pricing-table th {
    background: var(--text);
    color: var(--card);
    font-size: 13px;
    font-weight: 600;
    padding: 12px 16px;
    text-align: left;
  }
  .pricing-table th:first-child { border-radius: 8px 0 0 0; }
  .pricing-table th:last-child { border-radius: 0 8px 0 0; }
  .pricing-table td {
    padding: 12px 16px;
    font-size: 13px;
    border-bottom: 1px solid var(--border);
    background: var(--card);
  }
  .pricing-table tr:last-child td:first-child { border-radius: 0 0 0 8px; }
  .pricing-table tr:last-child td:last-child { border-radius: 0 0 8px 0; }
  .pricing-table td:first-child { font-weight: 600; }

  /* Pros / Cons */
  .pros-cons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  @media (max-width: 540px) {
    .pros-cons { grid-template-columns: 1fr; }
    .rating-row { grid-template-columns: 120px 1fr 32px; }
    .incident-item { grid-template-columns: 1fr; gap: 4px; }
  }
  .pros-cons-col {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
  }
  .pros-cons-col h4 {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 14px;
  }
  .pros-col h4 { color: var(--good); }
  .cons-col h4 { color: var(--warn); }
  .pros-cons-col ul { list-style: none; }
  .pros-cons-col li {
    font-size: 13px;
    line-height: 1.5;
    padding: 5px 0;
    padding-left: 18px;
    position: relative;
    color: #2a2825;
  }
  .pros-cons-col li::before {
    position: absolute;
    left: 0;
    font-size: 12px;
  }
  .pros-col li::before { content: '✓'; color: var(--good); font-weight: 700; }
  .cons-col li::before { content: '✗'; color: var(--warn); font-weight: 700; }

  /* Tab nav */
  .tab-nav {
    display: flex;
    gap: 4px;
    margin-bottom: 32px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 4px;
    flex-wrap: wrap;
  }
  .tab-btn {
    flex: 1;
    min-width: 120px;
    padding: 9px 14px;
    border: none;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    background: transparent;
    color: var(--muted);
    transition: all 0.15s;
  }
  .tab-btn.active {
    background: var(--accent);
    color: white;
    font-weight: 600;
  }
  .tab-btn:hover:not(.active) { background: var(--border); color: var(--text); }

  /* Divider */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 40px 0;
  }

  /* CTA */
  .cta-bar {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }
  .cta-bar p {
    font-size: 15px;
    font-weight: 500;
    max-width: 460px;
    line-height: 1.5;
  }
  .cta-btn {
    display: inline-block;
    padding: 12px 24px;
    background: var(--accent);
    color: white;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }
  .cta-btn:hover { opacity: 0.9; }

  /* Stat callout */
  .stat-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .stat-card {
    flex: 1;
    min-width: 140px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px 20px;
    text-align: center;
  }
  .stat-num {
    font-size: 26px;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 4px;
  }
  .stat-desc { font-size: 12px; color: var(--muted); line-height: 1.4; }
`;

const ratings = [
  { name: "Ease of Use", score: 9.2 },
  { name: "App Quality", score: 7.8 },
  { name: "Autonomous Build", score: 8.5 },
  { name: "Content Generation", score: 5.5 },
  { name: "Security", score: 5.0 },
  { name: "Value for Money", score: 7.4 },
];

const tabs = ["Overview", "Autonomous & AI", "Security Deep-Dive", "Pricing", "Verdict"];

const incidents = [
  {
    date: "Early 2026",
    title: "BOLA Vulnerability — 48 Days Open",
    badge: "critical",
    desc: "A Broken Object Level Authorization flaw was reported via HackerOne but the bug report was closed without escalation. The vulnerability remained open for 48 days, exposing source code, database credentials, and user records.",
  },
  {
    date: "Feb 2026",
    title: "Permission Regression Re-enables Public Chat Access",
    badge: "critical",
    desc: "During a backend unification, Lovable accidentally re-enabled access to chat histories on public projects — including sensitive info like live Supabase keys and business logic.",
  },
  {
    date: "Mar 2026",
    title: "16 Vulnerabilities in a Single Hosted App",
    badge: "moderate",
    desc: "Security researcher Taimur Khan found 6 critical vulnerabilities in a Lovable-hosted app with 100k+ views. A malformed auth function blocked legit users while allowing unauthorized access to PII from institutions including UC Berkeley.",
  },
];

export default function LovableReview() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        {/* Header */}
        <div className="review-header">
          <div className="site-label">
            <span>No-Code Reviewed</span> · In-Depth Platform Review
          </div>
          <h1 className="review-title">Lovable Review 2026</h1>
          <p className="review-subtitle">
            The AI app builder that's reshaping how non-coders ship software — and making headlines for the wrong reasons too. A deep dive into what it can really do autonomously, and whether you can trust it with production data.
          </p>
          <div className="meta-row">
            <span>Updated <strong>May 2026</strong></span>
            <span className="meta-dot">·</span>
            <span>Category: <strong>AI App Builders</strong></span>
            <span className="meta-dot">·</span>
            <span>Tested by <strong>No-Code Reviewed</strong></span>
          </div>
        </div>

        {/* Verdict */}
        <div className="verdict-card">
          <div className="verdict-label">Our Verdict</div>
          <p className="verdict-text">
            Lovable is genuinely impressive for going from idea to deployed app in hours. But it has serious security baggage that no honest review should gloss over — three documented incidents in 2026 alone. If you're prototyping or validating an idea, it's one of the best tools available. If you're building anything that touches real user data, proceed with extreme caution and a very explicit security checklist.
          </p>
          <div className="score-row">
            <div className="score-item">
              <div className="score-num">7.6</div>
              <div className="score-label">Overall Score</div>
            </div>
            <div className="score-item">
              <div className="score-num">8.5</div>
              <div className="score-label">Autonomy</div>
            </div>
            <div className="score-item">
              <div className="score-num">5.0</div>
              <div className="score-label">Security</div>
            </div>
            <div className="score-item">
              <div className="score-num">9.2</div>
              <div className="score-label">Ease of Use</div>
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="ratings-grid">
          <div className="ratings-title">Category Scores</div>
          {ratings.map((r) => (
            <div className="rating-row" key={r.name}>
              <div className="rating-name">{r.name}</div>
              <div className="rating-bar-track">
                <div
                  className="rating-bar-fill"
                  style={{ width: `${r.score * 10}%` }}
                />
              </div>
              <div className="rating-val">{r.score}</div>
            </div>
          ))}
        </div>

        {/* Tab Nav */}
        <div className="tab-nav">
          {tabs.map((t) => (
            <button
              key={t}
              className={`tab-btn${activeTab === t ? " active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          <div className="section">
            <h2 className="section-heading">What Is Lovable?</h2>
            <p className="section-intro">From a £0 side project to a $6.6B platform — here's how Lovable built its foothold.</p>

            <div className="stat-row">
              <div className="stat-card">
                <div className="stat-num">$6.6B</div>
                <div className="stat-desc">Valuation after Series B (late 2025)</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">8M+</div>
                <div className="stat-desc">Registered users as of 2026</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">$200M+</div>
                <div className="stat-desc">Annual Recurring Revenue</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">60%</div>
                <div className="stat-desc">Of all new code projected to be AI-generated by end of 2026</div>
              </div>
            </div>

            <div className="prose">
              <p>
                Lovable (formerly GPT Engineer) is an AI-powered full-stack app builder. You describe what you want to build in plain English, and the platform generates a working web application — frontend, backend, database, and deployment — without you writing a single line of code. It uses React for the interface, Tailwind CSS for styling, and Supabase for authentication, storage, and database services.
              </p>
              <p>
                What differentiates it from traditional no-code tools is that Lovable generates real, editable code. You're not locked into a visual drag-and-drop editor that spits out proprietary markup. If you outgrow the platform, you can export the repo to GitHub and hand it to a developer. That positioning as an "AI full-stack engineer" rather than a simple visual builder is what attracted enterprise-adjacent users from companies like Nvidia, Microsoft, Uber, and Spotify — something that became a security liability when incidents emerged in early 2026.
              </p>
              <p>
                Collins English Dictionary named "vibe coding" — the practice of describing an app and having AI build it — Word of the Year for 2025. Lovable is the most prominent platform in that category.
              </p>
            </div>

            <div className="feature-grid">
              {[
                { icon: "⚡", title: "Prompt-to-App", desc: "Describe your app in plain English. Lovable generates pages, routes, components, and logic instantly." },
                { icon: "🗄️", title: "Supabase Integration", desc: "Auth, database, and storage all wired automatically. No config needed to get a backend running." },
                { icon: "🎨", title: "Visual Editor", desc: "Point-and-click editing on top of the generated code — unique vs most competitors." },
                { icon: "🔗", title: "Figma Import", desc: "Bring in your design mockups and Lovable will attempt to match the layout and styles." },
                { icon: "🚀", title: "One-Click Deploy", desc: "Apps hosted on lovable.app domains by default, with custom domain support on paid plans." },
                { icon: "💻", title: "GitHub Export", desc: "Full access to your generated code. You're never locked in — hand the repo to a dev team anytime." },
              ].map((f) => (
                <div className="feature-card" key={f.title}>
                  <div className="feature-icon">{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="pros-cons">
              <div className="pros-cons-col pros-col">
                <h4>Strengths</h4>
                <ul>
                  <li>Fastest path from idea to deployed app</li>
                  <li>Generates real, exportable React code</li>
                  <li>Clean, contemporary default UI — not "obviously AI"</li>
                  <li>Persistent context and improved iteration speed in 2026</li>
                  <li>CRUD apps and dashboards handled exceptionally well</li>
                  <li>Visual editor + Figma import are unique advantages</li>
                  <li>Generous free plan with no credit card required</li>
                </ul>
              </div>
              <div className="pros-cons-col cons-col">
                <h4>Weaknesses</h4>
                <ul>
                  <li>Three documented security incidents in 2026</li>
                  <li>40–62% of AI-generated code contains vulnerabilities</li>
                  <li>Complex business logic still trips up the AI</li>
                  <li>Credit costs hard to predict — burns fast when iterating</li>
                  <li>Not suitable for enterprise production without audit</li>
                  <li>Content generation is an afterthought, not a feature</li>
                  <li>Lovable badge on free plan, public projects only</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── AUTONOMOUS & AI ── */}
        {activeTab === "Autonomous & AI" && (
          <div className="section">
            <h2 className="section-heading">Autonomous Capabilities & Content Generation</h2>
            <p className="section-intro">
              How much can Lovable actually do on its own — and how does it handle the content layer?
            </p>

            <div className="alert alert-good">
              <div className="alert-title">Strong Autonomous App Building</div>
              <p>Lovable excels at building complete, multi-page applications from a single prompt. It autonomously handles route structure, component creation, database schema, authentication flows, and deployment — all without intervention.</p>
            </div>

            <div className="prose">
              <p>
                Lovable's core autonomous loop is its standout capability. You submit a prompt — "Build a lead management CRM with contacts, pipeline stages, and analytics" — and within minutes you have a working app with navigation, data tables, a Supabase-connected backend, and hosted URL. The iteration loop is where the autonomy really shows: describe a bug or a change and the AI modifies the correct files without you specifying which components to touch.
              </p>
              <p>
                The 2026 version improved substantially on earlier releases. Persistent context means the AI remembers design decisions, component structure, and your naming conventions across sessions. Earlier versions would "forget" your app's architecture after a few hours of work, creating drift in newly generated components.
              </p>
            </div>

            <div className="feature-grid">
              {[
                { icon: "🤖", title: "Code Agent Mode", desc: "Paid plans unlock direct code editing. The AI debugs and refactors across multiple files simultaneously." },
                { icon: "🔄", title: "Iterative Refinement", desc: "Describe what's wrong in plain English. Lovable identifies the root cause and applies targeted fixes." },
                { icon: "📐", title: "Full-Stack Generation", desc: "Frontend, backend, routes, auth, and DB schema generated in one go — not just a UI skeleton." },
                { icon: "🧠", title: "Persistent Context", desc: "The AI maintains architectural memory across sessions — a major improvement over 2025 versions." },
              ].map((f) => (
                <div className="feature-card" key={f.title}>
                  <div className="feature-icon">{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="divider" />

            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Content Generation: The Honest Picture</h3>
            <p className="section-intro">
              Lovable builds apps. It does not produce content. Here's the important distinction for site builders.
            </p>

            <div className="alert alert-warn">
              <div className="alert-title">Not a Content Platform</div>
              <p>Lovable has no built-in blog writing, SEO tooling, keyword research, or autonomous publishing features. If content generation is a priority — SEO articles, product descriptions, review templates — you'll need to integrate external tools. Lovable can build the CMS interface; it won't populate it.</p>
            </div>

            <div className="prose">
              <p>
                What Lovable <em>can</em> do autonomously in the content space: it can scaffold a complete content management system — an admin panel for managing articles, a public-facing blog with category filtering, an editor UI, and reading time estimators. The structure is built; the content is not.
              </p>
              <p>
                The platform supports MCP (Model Context Protocol) integrations, which means you can wire up third-party tools like Frase.io to work alongside Lovable for content pipelines. Frase confirmed in their 2026 documentation that Claude, Cursor, Lovable, and Replit can all connect to their read-write MCP endpoint — meaning an AI agent running inside your Lovable environment can theoretically trigger brief creation, content drafts, and SEO audits through that bridge.
              </p>
              <p>
                But this is an integration story, not a native feature. Lovable isn't competing with Jasper, Surfer, or Writesonic in the content generation space. It's a development platform that can host and manage content — very different from generating it autonomously at scale.
              </p>
            </div>

            <div className="alert alert-neutral">
              <div className="alert-title">What Lovable Builds vs What It Doesn't Generate</div>
              <p><strong>Builds autonomously:</strong> Blog CMS, article editor UI, tag/category system, author profiles, RSS feeds, SEO metadata fields, reading progress bars, comment sections, newsletter signups.</p>
              <br />
              <p><strong>Does not generate:</strong> Article drafts, keyword clusters, meta descriptions, internal linking suggestions, content calendars, or any form of autonomous publishing.</p>
            </div>
          </div>
        )}

        {/* ── SECURITY ── */}
        {activeTab === "Security Deep-Dive" && (
          <div className="section">
            <h2 className="section-heading">Security Deep-Dive</h2>
            <p className="section-intro">
              This is where the review gets uncomfortable — and where you need to read carefully before putting real data anywhere near Lovable.
            </p>

            <div className="alert alert-warn">
              <div className="alert-title">⚠ Critical Reading: Three Security Incidents in 2026</div>
              <p>Lovable experienced three documented security incidents in the first half of 2026, including a BOLA vulnerability left open for 48 days after a bug report was closed without escalation, and a permission regression that re-exposed the chat histories of all projects created before November 2025. Source code, database credentials, and user PII were affected.</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, marginTop: 24 }}>Incident Timeline</h3>
            <ul className="incident-list">
              {incidents.map((inc) => (
                <li className="incident-item" key={inc.title}>
                  <div className="incident-date">{inc.date}</div>
                  <div>
                    <div className="incident-title">
                      {inc.title}
                      <span className={`badge badge-${inc.badge}`}>
                        {inc.badge === "critical" ? "Critical" : "Moderate"}
                      </span>
                    </div>
                    <div className="incident-desc">{inc.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="divider" />

            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>The Structural Problem with Vibe Coding Security</h3>

            <div className="stat-row">
              <div className="stat-card">
                <div className="stat-num">40–62%</div>
                <div className="stat-desc">Of AI-generated code contains security vulnerabilities (multiple 2026 studies)</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">91.5%</div>
                <div className="stat-desc">Of vibe-coded apps had at least one AI hallucination-related flaw in Q1 2026</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">48 days</div>
                <div className="stat-desc">BOLA vulnerability was live after bug report was closed without action</div>
              </div>
            </div>

            <div className="prose">
              <p>
                The security issues at Lovable are not just bugs — they represent a structural challenge baked into the vibe coding model. When you describe an app and AI generates all the code, nobody reviews it. Most users can't review it even if they wanted to. The platform's entire value proposition is removing the need to understand the code — which also removes the ability to audit it.
              </p>
              <p>
                Lovable is "representatively insecure" — not uniquely so. The data across the entire AI-generated code category is consistent. Between 40 and 62% of AI-written code contains security vulnerabilities depending on the study. The market's incentive structure rewards growth and ease of use over security hardening. Lovable grew to 8 million users faster than its security practices could keep pace.
              </p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Built-In Security Features (What Lovable Does Offer)</h3>

            <div className="alert alert-good">
              <div className="alert-title">What's Actually There</div>
              <p>To be fair, Lovable has built-in security tooling. It detects exposed API keys automatically, integrates with Supabase row-level security, provides encrypted connections for AI integrations, and has a built-in scanner that flags common vulnerabilities before publishing — including disabled RLS and exposed credentials.</p>
            </div>

            <div className="feature-grid">
              {[
                { icon: "🔑", title: "API Key Detection", desc: "Automatically detects when API keys are exposed in generated code before you publish." },
                { icon: "🛡️", title: "RLS Prompting", desc: "Flags when Supabase row-level security is not configured on tables with user data." },
                { icon: "🔐", title: "Supabase Auth", desc: "Built-in authentication flows with secure sign-up, login, and session handling." },
                { icon: "🔒", title: "SSO (Business+)", title2: "Data Training Opt-Out", desc: "Enterprise plans include SSO and opt-out from having your code used to train Lovable's AI models." },
              ].map((f) => (
                <div className="feature-card" key={f.title}>
                  <div className="feature-icon">{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="alert alert-warn">
              <div className="alert-title">If You Were Using Lovable Before November 2025</div>
              <p>Rotate all credentials immediately: API keys, Supabase access tokens, and any third-party integration tokens connected to Lovable projects. Chat histories were exposed and may have contained live credentials, database structures, and business logic.</p>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 24 }}>Security Checklist for Lovable Users</h3>
            <div className="pros-cons-col" style={{ marginBottom: 0 }}>
              <ul>
                {[
                  "Enable Supabase Row-Level Security on every table that contains user data",
                  "Never paste live API keys into Lovable's chat — use environment variables",
                  "Audit generated authentication functions before launch — don't trust them blindly",
                  "If on Business plan, enable the data training opt-out to protect proprietary logic",
                  "Use GitHub export and run a static analysis tool (e.g. Semgrep) on the output",
                  "For any app with real users, have a developer review the Supabase policies before go-live",
                  "Treat Lovable-hosted apps as prototypes until a security audit is completed",
                ].map((item) => (
                  <li key={item} style={{ paddingLeft: 20, position: 'relative', fontSize: 13, lineHeight: 1.6, padding: '5px 0 5px 20px' }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── PRICING ── */}
        {activeTab === "Pricing" && (
          <div className="section">
            <h2 className="section-heading">Pricing Breakdown</h2>
            <p className="section-intro">
              Lovable uses a credit-based model. The free plan is genuinely useful; the costs get harder to predict as you scale.
            </p>

            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Price</th>
                  <th>Credits</th>
                  <th>Key Features</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { plan: "Free", price: "$0/mo", credits: "5/day (30/mo cap)", features: "Public projects, GitHub integration, 20 collaborators. No private projects, no custom domain. Lovable badge shown." },
                  { plan: "Starter", price: "~$21/mo (annual)", credits: "More daily credits", features: "Private projects, custom domains, code editing mode, credit rollover." },
                  { plan: "Pro", price: "~$42/mo (annual)", credits: "Substantially more", features: "All Starter features + priority support, higher credit limits, team collaboration." },
                  { plan: "Business", price: "$50+/mo", credits: "Per-user limits configurable", features: "SSO, data training opt-out, restricted projects, reusable design templates, admin credit caps." },
                  { plan: "Enterprise", price: "Custom", credits: "Custom", features: "Custom API connections, dedicated support, professional onboarding, group-based access controls, custom design systems." },
                ].map((row) => (
                  <tr key={row.plan}>
                    <td>{row.plan}</td>
                    <td>{row.price}</td>
                    <td>{row.credits}</td>
                    <td style={{ fontWeight: 400, color: '#2a2825' }}>{row.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="alert alert-warn">
              <div className="alert-title">The Hidden Cost Problem</div>
              <p>Credits are tied to prompt complexity, not just volume. A "build this landing page" prompt might use ~2 credits. But iterative UI refinements, debugging sessions, and complex feature additions can drain credits unpredictably. There's no published pay-as-you-go rate for overages — you must upgrade tiers. Monthly billing runs ~20% higher than annual pricing.</p>
            </div>

            <div className="prose">
              <p>
                The most important pricing consideration: the data training opt-out is only available on Business plan and above. If you're building anything with proprietary logic, client work, or sensitive architecture, you need to be on at minimum the Business plan to prevent your prompts and code from being used to train Lovable's models. This isn't clearly surfaced during onboarding.
              </p>
              <p>
                The free plan is genuinely one of the better free tiers in the AI app builder space — no credit card required, unlimited public projects, and GitHub integration. It's enough to build a functional MVP prototype. The constraint is the 5-credit daily limit, which refreshes at midnight UTC and creates a slow, day-by-day build cadence for complex apps.
              </p>
            </div>
          </div>
        )}

        {/* ── VERDICT ── */}
        {activeTab === "Verdict" && (
          <div className="section">
            <h2 className="section-heading">Final Verdict</h2>
            <p className="section-intro">Who should use Lovable, who should be cautious, and what the 2026 landscape means for no-coders.</p>

            <div className="pros-cons">
              <div className="pros-cons-col pros-col">
                <h4>Best For</h4>
                <ul>
                  <li>Non-technical founders validating MVPs fast</li>
                  <li>Designers who want to bring Figma designs to life</li>
                  <li>Internal tools for small teams</li>
                  <li>Students learning full-stack development concepts</li>
                  <li>Agencies prototyping before handing off to devs</li>
                  <li>Anyone who needs a working demo in hours, not weeks</li>
                </ul>
              </div>
              <div className="pros-cons-col cons-col">
                <h4>Not Ideal For</h4>
                <ul>
                  <li>Apps collecting sensitive user PII without a security audit</li>
                  <li>Enterprise production systems at scale</li>
                  <li>Complex multi-step business logic workflows</li>
                  <li>Teams that need autonomous content generation</li>
                  <li>High-traffic applications (hosting is basic)</li>
                  <li>Regulated industries without a dev review layer</li>
                </ul>
              </div>
            </div>

            <div className="alert alert-neutral">
              <div className="alert-title">The Right Mental Model</div>
              <p>Think of Lovable as the fastest way to build a working prototype and validate an idea. Once validated, treat the GitHub export as a starting point — not a finished product — and involve a developer for security review before you take on real users. The platform does what it says. Speed is real. The security risks are also real.</p>
            </div>

            <div className="prose">
              <p>
                Lovable is not uniquely insecure — it's representatively insecure in a category where the entire industry is figuring out how to make AI-generated code safe at scale. Gartner forecasts 60% of all new code will be AI-generated by end of 2026. The security infrastructure to match that output doesn't yet exist across any platform in this space. Lovable is the largest target, which is why its incidents get the most coverage.
              </p>
              <p>
                The growth metrics are hard to argue with: $330M Series B, $6.6B valuation, $200M+ ARR, 8 million users. Nvidia, Microsoft, Uber, and Spotify teams use it. The product is real and the demand is real. The question isn't whether to use it — it's how to use it appropriately.
              </p>
              <p>
                For a no-code review and comparison site like this one, Lovable earns a strong recommendation for the MVP and prototype use case with a clear security asterisk. It's the tool we'd recommend first to anyone who wants to go from concept to something clickable in an afternoon. We'd strongly advise against treating a Lovable-generated app as production-ready without a proper security review — especially if it connects to a database with real user data.
              </p>
            </div>

            <div className="ratings-grid" style={{ marginBottom: 32 }}>
              <div className="ratings-title">Final Scores</div>
              {ratings.map((r) => (
                <div className="rating-row" key={r.name}>
                  <div className="rating-name">{r.name}</div>
                  <div className="rating-bar-track">
                    <div className="rating-bar-fill" style={{ width: `${r.score * 10}%` }} />
                  </div>
                  <div className="rating-val">{r.score}</div>
                </div>
              ))}
            </div>

            <div className="cta-bar">
              <p>Ready to try Lovable? Start on the free plan — no credit card needed. Build your first prototype and see how far you get before hitting the credit wall.</p>
              <a className="cta-btn" href="https://lovable.dev" target="_blank" rel="noopener noreferrer">
                Try Lovable Free →
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
