import { useState } from "react";

const TOOLS = [
  "Bubble", "Webflow", "Glide", "Shopify", "Retool",
  "FlutterFlow", "Softr", "Adalo", "Airtable", "Stripe",
  "Zapier", "Make", "Xano", "Supabase", "Memberstack",
  "Notion", "Google Sheets", "Mailchimp", "Twilio", "SendGrid"
];

const INTEGRATIONS = {
  "Bubble-Stripe": { native: true, complexity: "low", notes: "Built-in Stripe plugin, handles subscriptions & one-time payments" },
  "Bubble-Airtable": { native: false, complexity: "medium", notes: "Use Zapier or Make, or Airtable API via Bubble's API connector" },
  "Bubble-Xano": { native: true, complexity: "medium", notes: "Xano is a popular Bubble backend replacement via REST API" },
  "Bubble-Memberstack": { native: false, complexity: "high", notes: "Limited — Bubble has its own auth. Use Memberstack only for Webflow." },
  "Bubble-Supabase": { native: false, complexity: "medium", notes: "Via API connector. Supabase provides REST and realtime endpoints." },
  "Bubble-Mailchimp": { native: true, complexity: "low", notes: "Official Bubble-Mailchimp plugin available in plugin marketplace" },
  "Bubble-Google Sheets": { native: false, complexity: "medium", notes: "Use Zapier, Make, or Google Sheets API connector" },
  "Webflow-Memberstack": { native: true, complexity: "low", notes: "Purpose-built integration. The go-to membership combo." },
  "Webflow-Stripe": { native: true, complexity: "low", notes: "Webflow Commerce has native Stripe. For memberships use Memberstack." },
  "Webflow-Airtable": { native: false, complexity: "medium", notes: "Use Whalesync for 2-way sync, or Zapier for basic workflows" },
  "Webflow-Mailchimp": { native: true, complexity: "low", notes: "Native form integration. Add Mailchimp field to Webflow forms." },
  "Glide-Google Sheets": { native: true, complexity: "low", notes: "Core feature — Glide is built around Google Sheets data" },
  "Glide-Airtable": { native: true, complexity: "low", notes: "Native Airtable data source, works out of the box" },
  "Glide-Stripe": { native: true, complexity: "low", notes: "Glide has native payment support via Stripe" },
  "Shopify-Mailchimp": { native: true, complexity: "low", notes: "Official Shopify-Mailchimp app in the Shopify App Store" },
  "Shopify-Google Sheets": { native: false, complexity: "medium", notes: "Use Zapier or a third-party app like Ablestar" },
  "Airtable-Zapier": { native: true, complexity: "low", notes: "Airtable + Zapier is one of the most reliable combos" },
  "Airtable-Make": { native: true, complexity: "low", notes: "Make (Integromat) has deep Airtable support" },
  "Stripe-Zapier": { native: true, complexity: "low", notes: "Stripe Zapier integration covers payments, customers, invoices" },
  "Xano-Webflow": { native: false, complexity: "medium", notes: "Connect via Xano REST API + Webflow custom JS or Wized" },
};

function getIntegration(a, b) {
  const key1 = `${a}-${b}`;
  const key2 = `${b}-${a}`;
  return INTEGRATIONS[key1] || INTEGRATIONS[key2] || null;
}

const COMPLEXITY_STYLE = {
  low: { bg: "var(--color-background-success)", text: "var(--color-text-success)", label: "Native / easy" },
  medium: { bg: "var(--color-background-warning)", text: "var(--color-text-warning)", label: "Middleware needed" },
  high: { bg: "var(--color-background-danger)", text: "var(--color-text-danger)", label: "Complex / limited" },
};

export default function IntegrationChecker() {
  const [selected, setSelected] = useState(["Bubble", "Stripe", "Mailchimp"]);
  const [search, setSearch] = useState("");

  function toggleTool(tool) {
    if (selected.includes(tool)) {
      if (selected.length > 1) setSelected(selected.filter(t => t !== tool));
    } else {
      setSelected([...selected, tool]);
    }
  }

  const filtered = TOOLS.filter(t => !search || t.toLowerCase().includes(search.toLowerCase()));

  const pairs = [];
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      pairs.push([selected[i], selected[j]]);
    }
  }

  const results = pairs.map(([a, b]) => ({ a, b, info: getIntegration(a, b) }));
  const nativeCount = results.filter(r => r.info?.native).length;
  const middlewareCount = results.filter(r => r.info && !r.info.native).length;
  const unknownCount = results.filter(r => !r.info).length;

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <input
          type="text"
          placeholder="Search tools to add..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", marginBottom: 10, fontFamily: "var(--font-sans)" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {filtered.map(tool => {
            const on = selected.includes(tool);
            return (
              <button key={tool} onClick={() => toggleTool(tool)} style={{ padding: "5px 12px", borderRadius: 99, border: "0.5px solid", borderColor: on ? "var(--color-border-success)" : "var(--color-border-tertiary)", background: on ? "var(--color-background-success)" : "var(--color-background-primary)", color: on ? "var(--color-text-success)" : "var(--color-text-primary)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.15s" }}>
                {on ? "✓ " : "+ "}{tool}
              </button>
            );
          })}
        </div>
      </div>

      {selected.length >= 2 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.25rem" }}>
            {[
              { label: "Native integrations", count: nativeCount, style: "success" },
              { label: "Need middleware", count: middlewareCount, style: "warning" },
              { label: "Unknown / manual", count: unknownCount, style: "secondary" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
                <div style={{ fontSize: 22, fontWeight: 500, color: s.style !== "secondary" ? `var(--color-text-${s.style})` : "var(--color-text-primary)" }}>{s.count}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {results.map(({ a, b, info }) => {
              const style = info ? COMPLEXITY_STYLE[info.complexity] : null;
              return (
                <div key={`${a}-${b}`} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: info ? 6 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{a}</span>
                      <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>↔</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{b}</span>
                    </div>
                    {info ? (
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: style.bg, color: style.text, fontWeight: 500 }}>
                        {style.label}
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "var(--color-background-secondary)", color: "var(--color-text-tertiary)" }}>
                        Not documented
                      </span>
                    )}
                  </div>
                  {info && (
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                      {info.native ? "✓ " : "⚠ "}{info.notes}
                    </div>
                  )}
                  {!info && (
                    <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                      No documented integration found. Check Zapier, Make, or use REST APIs.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {selected.length < 2 && (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-tertiary)", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", fontSize: 14 }}>
          Select at least 2 tools above to check compatibility
        </div>
      )}
    </div>
  );
}
