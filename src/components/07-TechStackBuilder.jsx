import { useState } from "react";

const s = {
  wrap: { fontFamily: "'DM Sans', sans-serif", maxWidth: 680, margin: "0 auto", padding: "2rem 1.5rem" },
  h1: { fontSize: 26, fontWeight: 700, color: "#0f0e0d", marginBottom: 4 },
  sub: { fontSize: 14, color: "#9a9590", marginBottom: 28 },
  label: { fontSize: 13, fontWeight: 600, color: "#4a4845", marginBottom: 8, display: "block" },
  select: { width: "100%", padding: "10px 14px", border: "1.5px solid #e8e4dc", borderRadius: 8, fontSize: 14, color: "#0f0e0d", background: "#fff", marginBottom: 20, outline: "none" },
  stack: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 },
  layer: { background: "#faf8f4", border: "1.5px solid #e8e4dc", borderRadius: 12, padding: "1rem 1.2rem" },
  lCat: { fontSize: 11, fontWeight: 600, color: "#e8541a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  lTool: { fontSize: 16, fontWeight: 700, color: "#0f0e0d" },
  lDesc: { fontSize: 12, color: "#9a9590", marginTop: 4, lineHeight: 1.5 },
  cost: { background: "#0f0e0d", color: "#fff", borderRadius: 10, padding: "1rem 1.2rem", marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" },
  cLabel: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  cValue: { fontSize: 22, fontWeight: 700 },
};

const stacks = {
  "saas-mvp": {
    layers: [
      { cat: "Frontend", tool: "Webflow", desc: "Marketing site + landing pages", cost: 29 },
      { cat: "App builder", tool: "Bubble", desc: "Core app logic & database", cost: 32 },
      { cat: "Auth", tool: "Supabase Auth", desc: "User login & sessions", cost: 0 },
      { cat: "Payments", tool: "Stripe", desc: "Subscriptions & billing", cost: 0 },
      { cat: "Email", tool: "Resend", desc: "Transactional emails", cost: 20 },
      { cat: "Automation", tool: "Make", desc: "Workflow automation", cost: 9 },
    ],
  },
  "content-site": {
    layers: [
      { cat: "CMS + Frontend", tool: "Webflow", desc: "Site, CMS, blog, SEO", cost: 29 },
      { cat: "Newsletter", tool: "Beehiiv", desc: "Email newsletter platform", cost: 0 },
      { cat: "Analytics", tool: "Fathom", desc: "Privacy-first analytics", cost: 14 },
      { cat: "Forms", tool: "Tally", desc: "Lead capture forms", cost: 0 },
      { cat: "Automation", tool: "Zapier", desc: "Connect tools together", cost: 20 },
      { cat: "Scheduling", tool: "Cal.com", desc: "Meeting bookings", cost: 0 },
    ],
  },
  "ecommerce": {
    layers: [
      { cat: "Store", tool: "Shopify", desc: "Product listings & checkout", cost: 39 },
      { cat: "Email mktg", tool: "Klaviyo", desc: "Email flows & campaigns", cost: 20 },
      { cat: "Reviews", tool: "Judge.me", desc: "Product reviews", cost: 0 },
      { cat: "Analytics", tool: "Triple Whale", desc: "Ecommerce attribution", cost: 129 },
      { cat: "Automation", tool: "Make", desc: "Inventory & fulfillment", cost: 9 },
      { cat: "Support", tool: "Gorgias", desc: "Customer support", cost: 10 },
    ],
  },
  "internal-tool": {
    layers: [
      { cat: "App", tool: "Softr", desc: "Internal portal / dashboard", cost: 49 },
      { cat: "Database", tool: "Airtable", desc: "Structured data & CRM", cost: 20 },
      { cat: "Automation", tool: "n8n", desc: "Complex internal workflows", cost: 20 },
      { cat: "Docs", tool: "Notion", desc: "Team knowledge base", cost: 8 },
      { cat: "Auth", tool: "Supabase", desc: "SSO / team auth", cost: 0 },
      { cat: "Comms", tool: "Slack", desc: "Team notifications", cost: 0 },
    ],
  },
};

export default function TechStackBuilder() {
  const [type, setType] = useState("saas-mvp");
  const stack = stacks[type];
  const totalCost = stack.layers.reduce((s, l) => s + l.cost, 0);

  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>No-Code Tech Stack Builder</h1>
      <p style={s.sub}>Get a recommended tool stack for your project type.</p>
      <label style={s.label}>What are you building?</label>
      <select style={s.select} value={type} onChange={e => setType(e.target.value)}>
        <option value="saas-mvp">SaaS / Web app MVP</option>
        <option value="content-site">Content site / Blog</option>
        <option value="ecommerce">Ecommerce store</option>
        <option value="internal-tool">Internal tool / Dashboard</option>
      </select>
      <div style={s.stack}>
        {stack.layers.map(l => (
          <div key={l.cat} style={s.layer}>
            <div style={s.lCat}>{l.cat}</div>
            <div style={s.lTool}>{l.tool}</div>
            <div style={s.lDesc}>{l.desc}</div>
            <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600, color: l.cost === 0 ? "#166534" : "#0f0e0d" }}>{l.cost === 0 ? "Free" : `$${l.cost}/mo`}</div>
          </div>
        ))}
      </div>
      <div style={s.cost}>
        <div>
          <div style={s.cLabel}>Estimated monthly stack cost</div>
          <div style={s.cValue}>${totalCost}/mo</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={s.cLabel}>Annual</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#f7a349" }}>${(totalCost * 12).toLocaleString()}/yr</div>
        </div>
      </div>
    </div>
  );
}
