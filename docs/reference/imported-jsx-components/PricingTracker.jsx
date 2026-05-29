import { useState } from "react";

const PRICING_DATA = [
  {
    name: "Bubble",
    logo: "🫧",
    url: "https://bubble.io/pricing",
    affiliate: "https://bubble.io",
    category: "Web App Builder",
    lastChecked: "May 2025",
    plans: [
      { name: "Starter", price: 0, users: 1, notes: "Limited capacity" },
      { name: "Growth", price: 29, users: 1, notes: "2 app editors" },
      { name: "Team", price: 119, users: 5, notes: "5 app editors" },
      { name: "Production", price: 349, users: 15, notes: "15 editors" },
    ],
    recentChange: null,
    deal: "2 months free on annual",
  },
  {
    name: "Webflow",
    logo: "🌊",
    url: "https://webflow.com/pricing",
    affiliate: "https://webflow.com",
    category: "Website Builder",
    lastChecked: "May 2025",
    plans: [
      { name: "Starter", price: 0, users: 1, notes: "webflow.io subdomain" },
      { name: "Basic", price: 14, users: 1, notes: "Custom domain" },
      { name: "CMS", price: 23, users: 3, notes: "CMS + 3 editors" },
      { name: "Business", price: 39, users: 10, notes: "10 editors" },
    ],
    recentChange: "Price increase: CMS plan up from $16 → $23",
    deal: null,
  },
  {
    name: "Glide",
    logo: "✨",
    url: "https://www.glideapps.com/pricing",
    affiliate: "https://glideapps.com",
    category: "Mobile App Builder",
    lastChecked: "May 2025",
    plans: [
      { name: "Free", price: 0, users: 1, notes: "200 rows" },
      { name: "Maker", price: 49, users: 5, notes: "25K rows" },
      { name: "Team", price: 99, users: 10, notes: "100K rows" },
      { name: "Business", price: 249, users: 25, notes: "1M rows" },
    ],
    recentChange: null,
    deal: "20% off annual plan",
  },
  {
    name: "Shopify",
    logo: "🛍️",
    url: "https://www.shopify.com/pricing",
    affiliate: "https://shopify.com",
    category: "E-commerce",
    lastChecked: "May 2025",
    plans: [
      { name: "Basic", price: 29, users: 2, notes: "2% transaction fee" },
      { name: "Shopify", price: 79, users: 5, notes: "1% transaction fee" },
      { name: "Advanced", price: 299, users: 15, notes: "0.5% transaction fee" },
    ],
    recentChange: null,
    deal: "$1/mo first 3 months",
  },
  {
    name: "Retool",
    logo: "🔧",
    url: "https://retool.com/pricing",
    affiliate: "https://retool.com",
    category: "Internal Tools",
    lastChecked: "May 2025",
    plans: [
      { name: "Free", price: 0, users: 5, notes: "5 users, limited" },
      { name: "Team", price: 10, users: null, notes: "Per user/mo" },
      { name: "Business", price: 50, users: null, notes: "Per user/mo" },
    ],
    recentChange: null,
    deal: null,
  },
  {
    name: "FlutterFlow",
    logo: "📱",
    url: "https://flutterflow.io/pricing",
    affiliate: "https://flutterflow.io",
    category: "Mobile App Builder",
    lastChecked: "May 2025",
    plans: [
      { name: "Free", price: 0, users: 1, notes: "Limited features" },
      { name: "Standard", price: 30, users: 1, notes: "Code export" },
      { name: "Pro", price: 70, users: 1, notes: "Custom functions" },
    ],
    recentChange: "New Pro plan added with custom functions",
    deal: null,
  },
  {
    name: "Softr",
    logo: "🧱",
    url: "https://www.softr.io/pricing",
    affiliate: "https://softr.io",
    category: "Client Portal",
    lastChecked: "May 2025",
    plans: [
      { name: "Free", price: 0, users: 5, notes: "100 app users" },
      { name: "Basic", price: 49, users: 10, notes: "1K app users" },
      { name: "Professional", price: 99, users: 25, notes: "Unlimited app users" },
      { name: "Business", price: 199, users: 50, notes: "White-label" },
    ],
    recentChange: null,
    deal: "30% off annual",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRICING_DATA.map(t => t.category)))];

export default function PricingTracker() {
  const [category, setCategory] = useState("All");
  const [showDealsOnly, setShowDealsOnly] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const filtered = PRICING_DATA
    .filter(t => category === "All" || t.category === category)
    .filter(t => !showDealsOnly || t.deal);

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "0.75rem", alignItems: "center" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "5px 14px", borderRadius: 99, border: "0.5px solid", borderColor: category === cat ? "var(--color-border-info)" : "var(--color-border-secondary)", background: category === cat ? "var(--color-background-info)" : "var(--color-background-primary)", color: category === cat ? "var(--color-text-info)" : "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            {cat}
          </button>
        ))}
        <label style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-secondary)", cursor: "pointer" }}>
          <input type="checkbox" checked={showDealsOnly} onChange={e => setShowDealsOnly(e.target.checked)} />
          Deals only
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(tool => (
          <div key={tool.name} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setExpanded(expanded === tool.name ? null : tool.name)}>
              <span style={{ fontSize: 22 }}>{tool.logo}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>{tool.name}</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-secondary)", padding: "2px 8px", background: "var(--color-background-secondary)", borderRadius: 99 }}>{tool.category}</span>
                  {tool.deal && <span style={{ fontSize: 11, color: "var(--color-text-success)", padding: "2px 8px", background: "var(--color-background-success)", borderRadius: 99 }}>🎁 {tool.deal}</span>}
                  {tool.recentChange && <span style={{ fontSize: 11, color: "var(--color-text-warning)", padding: "2px 8px", background: "var(--color-background-warning)", borderRadius: 99 }}>⚠ Price changed</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                  From ${Math.min(...tool.plans.map(p => p.price))}/mo · Updated {tool.lastChecked}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <a href={tool.affiliate} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 12, color: "var(--color-text-info)", textDecoration: "none", padding: "6px 12px", border: "0.5px solid var(--color-border-info)", borderRadius: "var(--border-radius-md)", whiteSpace: "nowrap" }}>
                  Visit →
                </a>
                <span style={{ color: "var(--color-text-tertiary)", fontSize: 16 }}>{expanded === tool.name ? "▲" : "▼"}</span>
              </div>
            </div>

            {expanded === tool.name && (
              <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", padding: "14px 16px", background: "var(--color-background-secondary)" }}>
                {tool.recentChange && (
                  <div style={{ marginBottom: 12, padding: "8px 12px", background: "var(--color-background-warning)", borderRadius: "var(--border-radius-md)", fontSize: 13, color: "var(--color-text-warning)" }}>
                    ⚠ {tool.recentChange}
                  </div>
                )}
                {tool.deal && (
                  <div style={{ marginBottom: 12, padding: "8px 12px", background: "var(--color-background-success)", borderRadius: "var(--border-radius-md)", fontSize: 13, color: "var(--color-text-success)" }}>
                    🎁 Current deal: {tool.deal}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
                  {tool.plans.map(plan => (
                    <div key={plan.name} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>{plan.name}</div>
                      <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)" }}>
                        {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>{plan.notes}</div>
                    </div>
                  ))}
                </div>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 12, fontSize: 12, color: "var(--color-text-tertiary)", textDecoration: "none" }}>
                  View official pricing page ↗
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 12 }}>Pricing verified periodically. Always confirm on the tool's official pricing page before purchasing.</p>
    </div>
  );
}
