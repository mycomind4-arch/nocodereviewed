import { useState } from "react";

const MICROTOOLS = [
  { id: 1, name: "No-Code Recommendation Wizard", description: "Answer 5 questions and get your perfect no-code stack matched to your project.", icon: "🧭", category: "Discovery", tags: ["quiz", "recommend", "compare"], component: "NoCodeRecommendationWizard", popular: true },
  { id: 2, name: "Tool Comparison Matrix", description: "Select any 2–6 tools and compare features, pricing, and support side-by-side.", icon: "⚖️", category: "Comparison", tags: ["compare", "features", "pricing"], component: "ComparisonMatrix", popular: true },
  { id: 3, name: "TCO Calculator", description: "Calculate true 12-month cost of any no-code platform including build time.", icon: "💰", category: "Calculators", tags: ["cost", "calculator", "budget"], component: "TCOCalculator", popular: true },
  { id: 4, name: "Project Planner & Estimator", description: "Select your features and get a build-time estimate, tool recommendation, and cost.", icon: "📐", category: "Planning", tags: ["plan", "estimate", "time"], component: "ProjectPlanner", popular: false },
  { id: 5, name: "Pricing Tracker", description: "Live-updated pricing for all major no-code tools, with deal alerts.", icon: "📊", category: "Research", tags: ["pricing", "deals", "compare"], component: "PricingTracker", popular: false },
  { id: 6, name: "Template Library", description: "Clone-ready starter templates for Bubble, Webflow, Glide, Shopify, and more.", icon: "📂", category: "Templates", tags: ["templates", "clone", "starter"], component: "TemplateLibrary", popular: true },
  { id: 7, name: "Success Story Database", description: "Real case studies: revenue, build costs, and timelines from no-code founders.", icon: "🏆", category: "Research", tags: ["case-studies", "roi", "inspiration"], component: "SuccessStoryDatabase", popular: false },
  { id: 8, name: "Stack Compatibility Checker", description: "Check if your chosen tools integrate natively — no Zapier required.", icon: "🔌", category: "Planning", tags: ["integrations", "compatibility", "stack"], component: "StackChecker", popular: false, comingSoon: true },
  { id: 9, name: "No-Code vs Custom Dev Calculator", description: "Compare total cost of building no-code vs hiring developers long-term.", icon: "⚡", category: "Calculators", tags: ["custom-dev", "cost", "compare"], component: "DevCalc", popular: false, comingSoon: true },
  { id: 10, name: "Migration Cost Estimator", description: "Estimate the effort and cost of migrating from one no-code platform to another.", icon: "🚚", category: "Planning", tags: ["migration", "bubble", "webflow"], component: "MigrationCalc", popular: false, comingSoon: true },
  { id: 11, name: "AI Prompt Library", description: "The best prompts for building with Lovable, v0, Cursor on no-code projects.", icon: "🤖", category: "Resources", tags: ["prompts", "ai", "lovable"], component: "PromptLibrary", popular: false, comingSoon: true },
  { id: 12, name: "Feature Prioritizer", description: "Rank your MVP features by impact and effort using an interactive matrix.", icon: "🎯", category: "Planning", tags: ["mvp", "prioritize", "effort"], component: "FeaturePrioritizer", popular: false, comingSoon: true },
];

const CATEGORIES = ["All", ...Array.from(new Set(MICROTOOLS.map(t => t.category)))];

export default function MicrotoolDirectory() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showPopular, setShowPopular] = useState(false);

  const filtered = MICROTOOLS.filter(t => {
    const matchCat = category === "All" || t.category === category;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.includes(search.toLowerCase()));
    const matchPopular = !showPopular || t.popular;
    return matchCat && matchSearch && matchPopular;
  });

  const available = filtered.filter(t => !t.comingSoon);
  const upcoming = filtered.filter(t => t.comingSoon);

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: "1 1 200px", fontFamily: "var(--font-sans)", minWidth: 0 }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-secondary)", cursor: "pointer", whiteSpace: "nowrap" }}>
          <input type="checkbox" checked={showPopular} onChange={e => setShowPopular(e.target.checked)} />
          Popular only
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "5px 14px", borderRadius: 99, border: "0.5px solid", borderColor: category === cat ? "var(--color-border-info)" : "var(--color-border-secondary)", background: category === cat ? "var(--color-background-info)" : "var(--color-background-primary)", color: category === cat ? "var(--color-text-info)" : "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            {cat}
          </button>
        ))}
      </div>

      {available.length > 0 && (
        <>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 10px" }}>
            Available now · {available.length} tool{available.length !== 1 ? "s" : ""}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
            {available.map(tool => (
              <div key={tool.id} style={{ background: "var(--color-background-primary)", border: tool.popular ? "1.5px solid var(--color-border-info)" : "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.1rem", position: "relative" }}>
                {tool.popular && (
                  <div style={{ position: "absolute", top: 12, right: 12, fontSize: 10, padding: "2px 8px", background: "var(--color-background-info)", color: "var(--color-text-info)", borderRadius: 99, fontWeight: 500 }}>
                    Popular
                  </div>
                )}
                <div style={{ fontSize: 28, marginBottom: 8 }}>{tool.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>{tool.name}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 10 }}>{tool.description}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                  {tool.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, color: "var(--color-text-tertiary)", padding: "2px 6px", background: "var(--color-background-secondary)", borderRadius: 4 }}>#{tag}</span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)" }}>{tool.category}</span>
                  <button
                    onClick={() => window.sendPrompt?.(`Open the ${tool.name} tool`)}
                    style={{ fontSize: 12, color: "var(--color-text-info)", background: "none", border: "0.5px solid var(--color-border-info)", borderRadius: "var(--border-radius-md)", padding: "5px 12px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
                  >
                    Use tool →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 10px" }}>
            Coming soon · {upcoming.length} tool{upcoming.length !== 1 ? "s" : ""}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {upcoming.map(tool => (
              <div key={tool.id} style={{ background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.1rem", opacity: 0.7 }}>
                <div style={{ fontSize: 28, marginBottom: 8, filter: "grayscale(50%)" }}>{tool.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>{tool.name}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 8 }}>{tool.description}</div>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "var(--color-background-warning)", color: "var(--color-text-warning)" }}>Coming soon</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
