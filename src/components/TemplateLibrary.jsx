import { useState } from "react";

const TEMPLATES = [
  { id: 1, name: "SaaS Dashboard", platform: "Bubble", category: "SaaS", difficulty: "Intermediate", price: "Free", description: "Full SaaS app with auth, billing (Stripe), user dashboard, and admin panel.", tags: ["auth", "stripe", "dashboard"], cloneUrl: "https://bubble.io", preview: "📊" },
  { id: 2, name: "Membership Site", platform: "Webflow + Memberstack", category: "Membership", difficulty: "Beginner", price: "Free", description: "Gated content site with member login, multiple tiers, and paywall.", tags: ["membership", "paywall", "login"], cloneUrl: "https://webflow.com", preview: "🔐" },
  { id: 3, name: "Mobile Directory App", platform: "Glide", category: "Mobile App", difficulty: "Beginner", price: "Free", description: "Searchable directory app built from Google Sheets. Great for listings, guides.", tags: ["directory", "search", "sheets"], cloneUrl: "https://glideapps.com", preview: "📱" },
  { id: 4, name: "E-commerce Store", platform: "Shopify", category: "E-commerce", difficulty: "Beginner", price: "Free", description: "Full product store with cart, checkout, inventory management, and email flows.", tags: ["products", "cart", "checkout"], cloneUrl: "https://shopify.com", preview: "🛍️" },
  { id: 5, name: "Internal CRM", platform: "Retool", category: "Internal Tools", difficulty: "Intermediate", price: "Free", description: "Customer relationship manager with pipeline stages, notes, and task tracking.", tags: ["crm", "pipeline", "tasks"], cloneUrl: "https://retool.com", preview: "👥" },
  { id: 6, name: "Native Fitness App", platform: "FlutterFlow", category: "Mobile App", difficulty: "Advanced", price: "Premium", description: "iOS & Android workout tracker with plans, progress charts, and push notifications.", tags: ["fitness", "tracking", "ios", "android"], cloneUrl: "https://flutterflow.io", preview: "💪" },
  { id: 7, name: "Client Portal", platform: "Softr", category: "Client Portal", difficulty: "Beginner", price: "Free", description: "White-label portal for clients to view deliverables, invoices, and project status.", tags: ["portal", "invoices", "white-label"], cloneUrl: "https://softr.io", preview: "🏢" },
  { id: 8, name: "Job Board", platform: "Bubble", category: "Marketplace", difficulty: "Intermediate", price: "Free", description: "Full job listing platform with company profiles, applications, and filtering.", tags: ["jobs", "listings", "apply"], cloneUrl: "https://bubble.io", preview: "💼" },
  { id: 9, name: "Booking Platform", platform: "Bubble", category: "Marketplace", difficulty: "Advanced", price: "Premium", description: "Two-sided marketplace with calendar booking, payments, and reviews.", tags: ["booking", "calendar", "payments"], cloneUrl: "https://bubble.io", preview: "📅" },
  { id: 10, name: "Landing Page + Waitlist", platform: "Webflow", category: "Marketing", difficulty: "Beginner", price: "Free", description: "High-converting landing page with email capture, countdown timer, and social proof.", tags: ["landing", "waitlist", "email"], cloneUrl: "https://webflow.com", preview: "🚀" },
  { id: 11, name: "Admin Dashboard", platform: "Retool", category: "Internal Tools", difficulty: "Beginner", price: "Free", description: "Database management dashboard with tables, search, edit forms, and charts.", tags: ["admin", "database", "charts"], cloneUrl: "https://retool.com", preview: "⚙️" },
  { id: 12, name: "Delivery Tracker App", platform: "Adalo", category: "Mobile App", difficulty: "Intermediate", price: "Free", description: "Real-time delivery status tracker with push notifications and map integration.", tags: ["delivery", "tracking", "maps"], cloneUrl: "https://adalo.com", preview: "🚚" },
];

const CATEGORIES = ["All", ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
const PLATFORMS = ["All platforms", ...Array.from(new Set(TEMPLATES.map(t => t.platform)))];
const DIFFICULTIES = ["All levels", "Beginner", "Intermediate", "Advanced"];

const DIFFICULTY_COLORS = { Beginner: "success", Intermediate: "warning", Advanced: "danger" };

export default function TemplateLibrary() {
  const [category, setCategory] = useState("All");
  const [platform, setPlatform] = useState("All platforms");
  const [difficulty, setDifficulty] = useState("All levels");
  const [search, setSearch] = useState("");

  const filtered = TEMPLATES.filter(t => {
    const matchCat = category === "All" || t.category === category;
    const matchPlat = platform === "All platforms" || t.platform === platform;
    const matchDiff = difficulty === "All levels" || t.difficulty === difficulty;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.includes(search.toLowerCase()));
    return matchCat && matchPlat && matchDiff && matchSearch;
  });

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: "1 1 180px", fontFamily: "var(--font-sans)", minWidth: 0 }}
        />
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ fontFamily: "var(--font-sans)" }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ fontFamily: "var(--font-sans)" }}>
          {PLATFORMS.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ fontFamily: "var(--font-sans)" }}>
          {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "0.75rem" }}>
        {filtered.length} template{filtered.length !== 1 ? "s" : ""} found
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {filtered.map(tmpl => (
          <div key={tmpl.id} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "1.25rem 1.25rem 0.75rem", flex: 1 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{tmpl.preview}</div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                <h3 style={{ fontSize: 15, fontWeight: 500, margin: 0, color: "var(--color-text-primary)" }}>{tmpl.name}</h3>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: tmpl.price === "Free" ? "var(--color-background-success)" : "var(--color-background-warning)", color: tmpl.price === "Free" ? "var(--color-text-success)" : "var(--color-text-warning)", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {tmpl.price}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "var(--color-background-info)", color: "var(--color-text-info)" }}>{tmpl.platform}</span>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: `var(--color-background-${DIFFICULTY_COLORS[tmpl.difficulty]})`, color: `var(--color-text-${DIFFICULTY_COLORS[tmpl.difficulty]})` }}>{tmpl.difficulty}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 8px", lineHeight: 1.5 }}>{tmpl.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {tmpl.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 11, color: "var(--color-text-tertiary)", padding: "2px 6px", background: "var(--color-background-secondary)", borderRadius: 4 }}>#{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 1.25rem", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 8 }}>
              <a href={tmpl.cloneUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", padding: "8px", background: "var(--color-background-info)", color: "var(--color-text-info)", borderRadius: "var(--border-radius-md)", textDecoration: "none", fontSize: 13, fontWeight: 500, border: "none" }}>
                Clone template →
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 14 }}>
          No templates found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}
