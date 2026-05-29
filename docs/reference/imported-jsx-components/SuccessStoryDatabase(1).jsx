import { useState } from "react";

const STORIES = [
  { id: 1, company: "Comet", founder: "Jean-Baptiste Coste", tool: "Bubble", category: "Marketplace", revenue: "$10M ARR", timeToLaunch: "4 months", teamSize: "2 founders", buildCost: "$0 in dev", summary: "French freelance platform built entirely on Bubble. Raised Series A without a single line of custom code.", roi: "Saved $800K in dev costs", tags: ["marketplace", "saas", "europe"], emoji: "☄️" },
  { id: 2, company: "Qoins", founder: "Chris Healer", tool: "Bubble", category: "FinTech", revenue: "$2M raised", timeToLaunch: "3 months", teamSize: "1 founder", buildCost: "$300", summary: "Debt-payoff app built on Bubble as MVP. Used it to raise $2M seed round before rebuilding in native code.", roi: "$2M raised on $300 build", tags: ["fintech", "mobile", "mvp"], emoji: "💰" },
  { id: 3, company: "YC Startup (anon)", founder: "Anonymous", tool: "Webflow + Memberstack", category: "SaaS", revenue: "$50K MRR", timeToLaunch: "6 weeks", teamSize: "Solo founder", buildCost: "$500/yr", summary: "B2B content platform using Webflow CMS + Memberstack for gated content. Reached $50K MRR before hiring first dev.", roi: "6 weeks to $50K MRR", tags: ["content", "b2b", "membership"], emoji: "📚" },
  { id: 4, company: "Landbot", founder: "Cristian Villamizar", tool: "Bubble", category: "SaaS", revenue: "$5M ARR", timeToLaunch: "8 months", teamSize: "3 people", buildCost: "$2,000", summary: "Conversational marketing platform initially built in Bubble. Now serves thousands of clients globally.", roi: "From $2K to $5M ARR", tags: ["chatbot", "saas", "b2b"], emoji: "🤖" },
  { id: 5, company: "Taskhuman", founder: "Randhir Vieira", tool: "FlutterFlow", category: "Mobile App", revenue: "$3M raised", timeToLaunch: "5 months", teamSize: "2 founders", buildCost: "$0 dev", summary: "1:1 coaching marketplace app shipped on iOS and Android using FlutterFlow. Raised $3M Series A.", roi: "Raised $3M without native devs", tags: ["marketplace", "mobile", "coaching"], emoji: "🧠" },
  { id: 6, company: "Shoprocket", founder: "Gary Siu", tool: "Bubble", category: "E-commerce", revenue: "$1M ARR", timeToLaunch: "6 months", teamSize: "Solo founder", buildCost: "$100/mo", summary: "Embeddable ecommerce widget platform built end-to-end on Bubble. $1M ARR as a solo operator.", roi: "$1M ARR, solo founder", tags: ["ecommerce", "saas", "solo"], emoji: "🛒" },
  { id: 7, company: "Dividend Finance", founder: "Various", tool: "Retool", category: "Internal Tools", revenue: "$100M+ portfolio", timeToLaunch: "2 weeks", teamSize: "Ops team", buildCost: "$500/mo", summary: "Solar financing company uses Retool for their entire loan origination workflow, replacing 3 legacy tools.", roi: "3 tools → 1 Retool app", tags: ["fintech", "ops", "enterprise"], emoji: "☀️" },
  { id: 8, company: "Placeit", founder: "Manny Hernandez", tool: "Webflow", category: "Marketing Site", revenue: "Acquired $100M+", timeToLaunch: "3 weeks", teamSize: "Marketing team", buildCost: "$200/mo", summary: "Design mockup tool rebuilt their entire marketing site on Webflow — reducing developer dependency by 90%.", roi: "90% fewer dev tickets", tags: ["design", "marketing", "cms"], emoji: "🎨" },
];

const CATEGORIES = ["All", ...Array.from(new Set(STORIES.map(s => s.category)))];
const TOOLS = ["All tools", ...Array.from(new Set(STORIES.map(s => s.tool)))];

export default function SuccessStoryDatabase() {
  const [category, setCategory] = useState("All");
  const [toolFilter, setToolFilter] = useState("All tools");
  const [expanded, setExpanded] = useState(null);

  const filtered = STORIES.filter(s => {
    const matchCat = category === "All" || s.category === category;
    const matchTool = toolFilter === "All tools" || s.tool === toolFilter;
    return matchCat && matchTool;
  });

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.25rem", alignItems: "center" }}>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ fontFamily: "var(--font-sans)" }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={toolFilter} onChange={e => setToolFilter(e.target.value)} style={{ fontFamily: "var(--font-sans)" }}>
          {TOOLS.map(t => <option key={t}>{t}</option>)}
        </select>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--color-text-secondary)" }}>{filtered.length} case studies</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {filtered.map(story => (
          <div key={story.id} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem", cursor: "pointer" }} onClick={() => setExpanded(expanded === story.id ? null : story.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", align: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{story.emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>{story.company}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{story.founder}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "var(--color-background-info)", color: "var(--color-text-info)", whiteSpace: "nowrap" }}>{story.tool}</span>
              </div>

              <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px", marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>💡 {story.roi}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: "var(--color-text-tertiary)" }}>Revenue</span>
                  <div style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{story.revenue}</div>
                </div>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: "var(--color-text-tertiary)" }}>Time to launch</span>
                  <div style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{story.timeToLaunch}</div>
                </div>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: "var(--color-text-tertiary)" }}>Build cost</span>
                  <div style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{story.buildCost}</div>
                </div>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: "var(--color-text-tertiary)" }}>Team</span>
                  <div style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{story.teamSize}</div>
                </div>
              </div>

              {expanded === story.id && (
                <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 12, marginTop: 4 }}>
                  <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 10px" }}>{story.summary}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {story.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 11, color: "var(--color-text-tertiary)", padding: "2px 6px", background: "var(--color-background-secondary)", borderRadius: 4 }}>#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <button style={{ width: "100%", textAlign: "center", marginTop: 10, background: "none", border: "none", color: "var(--color-text-tertiary)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                {expanded === story.id ? "Show less ▲" : "Read more ▼"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
