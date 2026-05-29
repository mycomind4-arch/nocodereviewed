import { useState } from "react";

const FEATURE_OPTIONS = [
  { id: "auth", label: "User login / auth", hours: 8, complexity: 1, icon: "🔐" },
  { id: "payments", label: "Payments (Stripe)", hours: 12, complexity: 2, icon: "💳" },
  { id: "database", label: "Custom database", hours: 16, complexity: 2, icon: "🗃️" },
  { id: "dashboard", label: "User dashboard", hours: 20, complexity: 2, icon: "📊" },
  { id: "admin", label: "Admin panel", hours: 16, complexity: 2, icon: "⚙️" },
  { id: "api", label: "Third-party API", hours: 14, complexity: 3, icon: "🔌" },
  { id: "notifications", label: "Email notifications", hours: 6, complexity: 1, icon: "📧" },
  { id: "upload", label: "File uploads", hours: 8, complexity: 1, icon: "📂" },
  { id: "search", label: "Search & filters", hours: 12, complexity: 2, icon: "🔍" },
  { id: "mobile", label: "Mobile responsive", hours: 10, complexity: 1, icon: "📱" },
  { id: "chat", label: "Real-time chat", hours: 20, complexity: 3, icon: "💬" },
  { id: "ai", label: "AI / GPT features", hours: 18, complexity: 3, icon: "🤖" },
  { id: "landing", label: "Landing page", hours: 8, complexity: 1, icon: "🏠" },
  { id: "blog", label: "Blog / CMS", hours: 10, complexity: 1, icon: "📝" },
  { id: "analytics", label: "Analytics tracking", hours: 6, complexity: 1, icon: "📈" },
];

const TOOL_RECS = {
  low: { tools: ["Glide", "Softr", "Adalo"], label: "Beginner-friendly", color: "success" },
  medium: { tools: ["Webflow", "FlutterFlow", "WeWeb"], label: "Intermediate", color: "warning" },
  high: { tools: ["Bubble", "Retool", "WeWeb + Xano"], label: "Advanced", color: "danger" },
};

const SKILL_MULTIPLIER = { beginner: 2.2, intermediate: 1.4, experienced: 1.0 };
const SKILL_LABELS = { beginner: "Beginner (0–6 mo)", intermediate: "Intermediate (6–24 mo)", experienced: "Experienced (2+ yr)" };

export default function ProjectPlanner() {
  const [features, setFeatures] = useState(["auth", "landing"]);
  const [skill, setSkill] = useState("beginner");
  const [hourlyRate, setHourlyRate] = useState(50);

  function toggleFeature(id) {
    setFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }

  const selected = FEATURE_OPTIONS.filter(f => features.includes(f.id));
  const baseHours = selected.reduce((a, f) => a + f.hours, 0);
  const adjustedHours = Math.round(baseHours * SKILL_MULTIPLIER[skill]);
  const totalCost = adjustedHours * hourlyRate;
  const avgComplexity = selected.length > 0 ? selected.reduce((a, f) => a + f.complexity, 0) / selected.length : 0;
  const complexityTier = avgComplexity < 1.5 ? "low" : avgComplexity < 2.3 ? "medium" : "high";
  const rec = TOOL_RECS[complexityTier];

  const weeks = Math.ceil(adjustedHours / 20);

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, margin: "0 0 10px", color: "var(--color-text-secondary)" }}>Select your features</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
          {FEATURE_OPTIONS.map(feat => {
            const on = features.includes(feat.id);
            return (
              <button key={feat.id} onClick={() => toggleFeature(feat.id)} style={{ textAlign: "left", padding: "10px 12px", borderRadius: "var(--border-radius-md)", border: on ? "1.5px solid var(--color-border-info)" : "0.5px solid var(--color-border-tertiary)", background: on ? "var(--color-background-info)" : "var(--color-background-primary)", color: on ? "var(--color-text-info)" : "var(--color-text-primary)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8 }}>
                <span>{feat.icon}</span>
                <div>
                  <div style={{ fontWeight: on ? 500 : 400 }}>{feat.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>~{feat.hours}h</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.25rem" }}>
        <div>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Your experience level</label>
          <select value={skill} onChange={e => setSkill(e.target.value)} style={{ width: "100%", fontFamily: "var(--font-sans)" }}>
            {Object.entries(SKILL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Your hourly rate</label>
            <span style={{ fontSize: 13, fontWeight: 500 }}>${hourlyRate}/hr</span>
          </div>
          <input type="range" min={10} max={200} step={5} value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      </div>

      {selected.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-tertiary)", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", fontSize: 14 }}>
          Select features above to see your estimate
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: "1.25rem" }}>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Estimated hours</div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>{adjustedHours}h</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{baseHours}h base × {SKILL_MULTIPLIER[skill]}x</div>
            </div>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Build time</div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>{weeks} wk{weeks !== 1 ? "s" : ""}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>at 20 hrs/wk</div>
            </div>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Estimated cost</div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>${totalCost.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{adjustedHours}h @ ${hourlyRate}/hr</div>
            </div>
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Complexity</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: `var(--color-text-${rec.color})` }}>{rec.label}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{selected.length} features</div>
            </div>
          </div>

          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem" }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 10px" }}>Recommended tools</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {rec.tools.map(t => (
                <span key={t} style={{ padding: "6px 14px", background: "var(--color-background-secondary)", borderRadius: 99, fontSize: 13, color: "var(--color-text-primary)", border: "0.5px solid var(--color-border-tertiary)" }}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <h4 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 6px" }}>Selected features</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.map(f => (
                  <span key={f.id} style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                    {f.icon} {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
