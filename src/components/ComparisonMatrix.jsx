import { useState } from "react";

const ALL_TOOLS = [
  { name: "Bubble", category: "Web App", pricing: "$29–$349/mo", freeplan: false, aiFeatures: true, mobileApp: false, ecommerce: true, templates: true, apiAccess: true, learningCurve: "Steep", scalability: 5, support: "Community + Paid", bestFor: "Complex SaaS" },
  { name: "Webflow", category: "Website", pricing: "$14–$212/mo", freeplan: true, aiFeatures: true, mobileApp: false, ecommerce: true, templates: true, apiAccess: true, learningCurve: "Moderate", scalability: 4, support: "Email + Community", bestFor: "Marketing sites" },
  { name: "Glide", category: "Mobile App", pricing: "$0–$99/mo", freeplan: true, aiFeatures: true, mobileApp: true, ecommerce: false, templates: true, apiAccess: true, learningCurve: "Easy", scalability: 3, support: "Email", bestFor: "Spreadsheet apps" },
  { name: "Shopify", category: "E-commerce", pricing: "$29–$299/mo", freeplan: false, aiFeatures: true, mobileApp: true, ecommerce: true, templates: true, apiAccess: true, learningCurve: "Easy", scalability: 5, support: "24/7 Chat", bestFor: "Online stores" },
  { name: "Retool", category: "Internal Tools", pricing: "$10–$50/user/mo", freeplan: true, aiFeatures: true, mobileApp: true, ecommerce: false, templates: true, apiAccess: true, learningCurve: "Moderate", scalability: 5, support: "Email + Slack", bestFor: "Admin dashboards" },
  { name: "FlutterFlow", category: "Mobile App", pricing: "$0–$70/mo", freeplan: true, aiFeatures: false, mobileApp: true, ecommerce: false, templates: true, apiAccess: true, learningCurve: "Moderate", scalability: 4, support: "Community", bestFor: "Native mobile" },
  { name: "Softr", category: "Client Portal", pricing: "$0–$199/mo", freeplan: true, aiFeatures: false, mobileApp: true, ecommerce: false, templates: true, apiAccess: false, learningCurve: "Easy", scalability: 3, support: "Email", bestFor: "Client portals" },
  { name: "Adalo", category: "Mobile App", pricing: "$36–$200/mo", freeplan: false, aiFeatures: false, mobileApp: true, ecommerce: true, templates: true, apiAccess: true, learningCurve: "Easy", scalability: 3, support: "Email", bestFor: "Simple mobile apps" },
  { name: "WeWeb", category: "Web App", pricing: "$0–$99/mo", freeplan: true, aiFeatures: false, mobileApp: false, ecommerce: false, templates: true, apiAccess: true, learningCurve: "Moderate", scalability: 5, support: "Community + Chat", bestFor: "Frontend builder" },
  { name: "Memberstack", category: "Membership", pricing: "$25–$199/mo", freeplan: false, aiFeatures: false, mobileApp: false, ecommerce: true, templates: false, apiAccess: true, learningCurve: "Easy", scalability: 4, support: "Email + Docs", bestFor: "Membership sites" },
];

const FEATURES = [
  { key: "category", label: "Category", type: "text" },
  { key: "pricing", label: "Pricing", type: "text" },
  { key: "freeplan", label: "Free plan", type: "bool" },
  { key: "aiFeatures", label: "AI features", type: "bool" },
  { key: "mobileApp", label: "Mobile app", type: "bool" },
  { key: "ecommerce", label: "E-commerce", type: "bool" },
  { key: "templates", label: "Templates", type: "bool" },
  { key: "apiAccess", label: "API access", type: "bool" },
  { key: "learningCurve", label: "Learning curve", type: "text" },
  { key: "scalability", label: "Scalability", type: "score" },
  { key: "support", label: "Support", type: "text" },
  { key: "bestFor", label: "Best for", type: "text" },
];

const CURVE_COLOR = { Easy: "success", Moderate: "warning", Steep: "danger" };

function BoolCell({ value }) {
  return value
    ? <span style={{ color: "var(--color-text-success)", fontSize: 16 }}>✓</span>
    : <span style={{ color: "var(--color-text-tertiary)", fontSize: 16 }}>—</span>;
}

function ScoreCell({ value }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i <= value ? "var(--color-text-info)" : "var(--color-background-secondary)" }} />
      ))}
    </div>
  );
}

export default function ComparisonMatrix() {
  const [selected, setSelected] = useState(["Bubble", "Webflow", "Glide", "Shopify"]);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(ALL_TOOLS.map(t => t.category)))];
  const filteredTools = filter === "All" ? ALL_TOOLS : ALL_TOOLS.filter(t => t.category === filter);

  function toggleTool(name) {
    if (selected.includes(name)) {
      if (selected.length > 2) setSelected(selected.filter(s => s !== name));
    } else {
      if (selected.length < 6) setSelected([...selected, name]);
    }
  }

  const comparing = ALL_TOOLS.filter(t => selected.includes(t.name));

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{ padding: "5px 14px", borderRadius: 99, border: "0.5px solid", borderColor: filter === cat ? "var(--color-border-info)" : "var(--color-border-secondary)", background: filter === cat ? "var(--color-background-info)" : "var(--color-background-primary)", color: filter === cat ? "var(--color-text-info)" : "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {filteredTools.map(tool => (
            <button key={tool.name} onClick={() => toggleTool(tool.name)} style={{ padding: "5px 14px", borderRadius: 99, border: "0.5px solid", borderColor: selected.includes(tool.name) ? "var(--color-border-success)" : "var(--color-border-tertiary)", background: selected.includes(tool.name) ? "var(--color-background-success)" : "var(--color-background-primary)", color: selected.includes(tool.name) ? "var(--color-text-success)" : "var(--color-text-primary)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.15s" }}>
              {selected.includes(tool.name) ? "✓ " : "+ "}{tool.name}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}>Select 2–6 tools to compare</p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 12px", background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", fontWeight: 500, borderRadius: "var(--border-radius-md) 0 0 0", position: "sticky", left: 0, width: 110 }}>Feature</th>
              {comparing.map((tool, i) => (
                <th key={tool.name} style={{ textAlign: "center", padding: "8px 12px", background: i === 0 ? "var(--color-background-info)" : "var(--color-background-secondary)", color: i === 0 ? "var(--color-text-info)" : "var(--color-text-primary)", fontWeight: 500, minWidth: 110 }}>
                  {tool.name}
                  {i === 0 && <div style={{ fontSize: 10, fontWeight: 400, opacity: 0.8 }}>top pick</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((feat, fi) => (
              <tr key={feat.key} style={{ background: fi % 2 === 0 ? "var(--color-background-primary)" : "var(--color-background-secondary)" }}>
                <td style={{ padding: "9px 12px", color: "var(--color-text-secondary)", fontWeight: 500, position: "sticky", left: 0, background: fi % 2 === 0 ? "var(--color-background-primary)" : "var(--color-background-secondary)" }}>
                  {feat.label}
                </td>
                {comparing.map(tool => (
                  <td key={tool.name} style={{ textAlign: "center", padding: "9px 12px" }}>
                    {feat.type === "bool" && <BoolCell value={tool[feat.key]} />}
                    {feat.type === "score" && <ScoreCell value={tool[feat.key]} />}
                    {feat.type === "text" && (
                      <span style={{
                        color: feat.key === "learningCurve"
                          ? `var(--color-text-${CURVE_COLOR[tool[feat.key]] || "primary"})`
                          : "var(--color-text-primary)",
                        fontSize: 12
                      }}>
                        {tool[feat.key]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={{ padding: "10px 12px", background: "var(--color-background-secondary)", fontWeight: 500, color: "var(--color-text-secondary)" }}>Try it</td>
              {comparing.map(tool => (
                <td key={tool.name} style={{ textAlign: "center", padding: "10px 12px", background: "var(--color-background-secondary)" }}>
                  <a href={`https://${tool.name.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--color-text-info)", textDecoration: "none" }}>
                    {tool.name} →
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
