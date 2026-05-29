import { useState } from "react";

const GRAVEYARD = [
  { name: "Draftbit", status: "acquired", date: "2023", category: "Mobile App Builder", acquiredBy: "Expo", risk: "medium", summary: "React Native visual builder acquired by Expo. Some features absorbed, roadmap uncertain.", migration: "FlutterFlow, Adalo, or raw React Native with Expo", lesson: "Mobile no-code tools have thin margins — acquisitions are common." },
  { name: "Glitch", status: "pivoted", date: "2023", category: "Web App Platform", acquiredBy: null, risk: "low", summary: "Pivoted away from no-code toward developer tools. Community features heavily reduced.", migration: "Replit, CodeSandbox, or Railway", lesson: "Developer-facing no-code tools often drift toward pure dev." },
  { name: "AppGyver", status: "acquired", date: "2022", category: "Mobile App Builder", acquiredBy: "SAP", risk: "high", summary: "Acquired by SAP and rebranded as SAP Build Apps. Enterprise-only focus, free plan removed.", migration: "FlutterFlow, Bubble, or Adalo", lesson: "SAP acquisitions rarely end well for indie builders." },
  { name: "Thunkable Classic", status: "sunsetted", date: "2021", category: "Mobile App Builder", acquiredBy: null, risk: "high", summary: "Legacy version sunsetted. Users forced to migrate to Thunkable X with breaking changes.", migration: "Glide, Adalo, or FlutterFlow", lesson: "Platform version migrations can break production apps." },
  { name: "Zeroqode (Bravado)", status: "pivoted", date: "2022", category: "Template Marketplace", acquiredBy: null, risk: "low", summary: "Rebranded and shifted focus. Many Bubble templates abandoned without updates.", migration: "Buy direct from Bubble template marketplace", lesson: "Template ecosystems are fragile — always check last update dates." },
  { name: "Bubble (self-host)", status: "deprecated", date: "2023", category: "Web App Builder", acquiredBy: null, risk: "medium", summary: "Bubble removed its self-hosted offering. Apps must run on Bubble's infrastructure.", migration: "WeWeb + Xano for more infrastructure control", lesson: "Self-hosting options can disappear — read the fine print." },
  { name: "Mendix Free Tier", status: "sunsetted", date: "2022", category: "Enterprise Low-Code", acquiredBy: null, risk: "medium", summary: "Mendix removed its free community tier, forcing small projects to pay enterprise pricing.", migration: "OutSystems, Retool, or Bubble for small projects", lesson: "Enterprise low-code tools can pull free tiers without warning." },
  { name: "Voiceflow (free hosting)", status: "changed", date: "2023", category: "Conversational AI Builder", acquiredBy: null, risk: "low", summary: "Removed free hosted chatbot publishing. Projects need paid plan to stay live.", migration: "Botpress (open source) or Landbot", lesson: "Free tiers on VC-backed tools are temporary." },
];

const STATUS_STYLE = {
  acquired: { bg: "var(--color-background-warning)", text: "var(--color-text-warning)", label: "Acquired", icon: "🏦" },
  sunsetted: { bg: "var(--color-background-danger)", text: "var(--color-text-danger)", label: "Sunsetted", icon: "⚰️" },
  pivoted: { bg: "var(--color-background-info)", text: "var(--color-text-info)", label: "Pivoted", icon: "↩️" },
  deprecated: { bg: "var(--color-background-warning)", text: "var(--color-text-warning)", label: "Deprecated", icon: "📦" },
  changed: { bg: "var(--color-background-secondary)", text: "var(--color-text-secondary)", label: "Pricing changed", icon: "💸" },
};

const RISK_STYLE = {
  low: { text: "var(--color-text-success)", label: "Low disruption" },
  medium: { text: "var(--color-text-warning)", label: "Medium disruption" },
  high: { text: "var(--color-text-danger)", label: "High disruption" },
};

export default function ToolGraveyard() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filters = [
    { key: "all", label: "All" },
    { key: "acquired", label: "Acquired" },
    { key: "sunsetted", label: "Sunsetted" },
    { key: "pivoted", label: "Pivoted" },
    { key: "deprecated", label: "Deprecated" },
  ];

  const filtered = filter === "all" ? GRAVEYARD : GRAVEYARD.filter(t => t.status === filter);

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0" }}>
      <div style={{ padding: "12px 16px", background: "var(--color-background-warning)", borderRadius: "var(--border-radius-md)", marginBottom: "1.25rem", fontSize: 13, color: "var(--color-text-warning)" }}>
        ⚠ These tools have shut down, pivoted, or significantly changed. If you or your clients use any of these, check your migration options.
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: "5px 14px", borderRadius: 99, border: "0.5px solid", borderColor: filter === f.key ? "var(--color-border-info)" : "var(--color-border-secondary)", background: filter === f.key ? "var(--color-background-info)" : "var(--color-background-primary)", color: filter === f.key ? "var(--color-text-info)" : "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(tool => {
          const statusStyle = STATUS_STYLE[tool.status];
          const riskStyle = RISK_STYLE[tool.risk];
          const isOpen = expanded === tool.name;
          return (
            <div key={tool.name} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }} onClick={() => setExpanded(isOpen ? null : tool.name)}>
                <span style={{ fontSize: 20 }}>{statusStyle.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", textDecoration: "line-through", opacity: 0.7 }}>{tool.name}</span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: statusStyle.bg, color: statusStyle.text }}>{statusStyle.label} {tool.date}</span>
                    <span style={{ fontSize: 11, color: riskStyle.text }}>{riskStyle.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 2 }}>{tool.category}{tool.acquiredBy ? ` · Acquired by ${tool.acquiredBy}` : ""}</div>
                </div>
                <span style={{ color: "var(--color-text-tertiary)", fontSize: 14 }}>{isOpen ? "▲" : "▼"}</span>
              </div>

              {isOpen && (
                <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", padding: "14px 16px", background: "var(--color-background-secondary)" }}>
                  <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 12px" }}>{tool.summary}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 4, fontWeight: 500 }}>MIGRATION OPTIONS</div>
                      <div style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{tool.migration}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 4, fontWeight: 500 }}>LESSON LEARNED</div>
                      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", fontStyle: "italic" }}>"{tool.lesson}"</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 12 }}>Updated periodically. Know a tool that should be here? The list grows.</p>
    </div>
  );
}
