import { useState } from "react";

const s = {
  wrap: { fontFamily: "'DM Sans', sans-serif", maxWidth: 640, margin: "0 auto", padding: "2rem 1.5rem" },
  h1: { fontSize: 26, fontWeight: 700, color: "#0f0e0d", marginBottom: 4 },
  sub: { fontSize: 14, color: "#9a9590", marginBottom: 28 },
  label: { fontSize: 13, fontWeight: 600, color: "#4a4845", marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "10px 14px", border: "1.5px solid #e8e4dc", borderRadius: 8, fontSize: 15, color: "#0f0e0d", background: "#fff", boxSizing: "border-box", outline: "none" },
  row: { marginBottom: 20 },
  card: { background: "#faf8f4", border: "1.5px solid #e8e4dc", borderRadius: 12, padding: "1.5rem", marginTop: 28 },
  metric: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #e8e4dc" },
  mLabel: { fontSize: 14, color: "#4a4845" },
  mValue: { fontSize: 18, fontWeight: 700, color: "#0f0e0d" },
  highlight: { background: "#e8541a", borderRadius: 10, padding: "1.2rem 1.5rem", marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" },
  hlLabel: { fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500 },
  hlValue: { fontSize: 28, fontWeight: 700, color: "#fff" },
};

export default function ROICalculator() {
  const [hourlyRate, setHourlyRate] = useState(75);
  const [hoursSaved, setHoursSaved] = useState(10);
  const [toolCost, setToolCost] = useState(49);
  const [devCost, setDevCost] = useState(5000);

  const monthlySavings = hourlyRate * hoursSaved * 4.3;
  const annualSavings = monthlySavings * 12;
  const annualToolCost = toolCost * 12;
  const netAnnual = annualSavings - annualToolCost - devCost;
  const roiPercent = devCost > 0 ? Math.round((netAnnual / (annualToolCost + devCost)) * 100) : 0;
  const paybackMonths = netAnnual > 0 ? Math.max(1, Math.round((annualToolCost + devCost) / (monthlySavings - toolCost))) : "N/A";

  const fmt = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>No-Code ROI Calculator</h1>
      <p style={s.sub}>See how quickly a no-code platform pays for itself vs. hiring a developer.</p>

      <div style={s.row}>
        <label style={s.label}>Your hourly rate (or what you'd pay a freelancer) — ${hourlyRate}/hr</label>
        <input type="range" min={20} max={300} step={5} value={hourlyRate} onChange={e => setHourlyRate(+e.target.value)} style={{ width: "100%", accentColor: "#e8541a" }} />
      </div>
      <div style={s.row}>
        <label style={s.label}>Hours saved per week with no-code — {hoursSaved} hrs</label>
        <input type="range" min={1} max={40} value={hoursSaved} onChange={e => setHoursSaved(+e.target.value)} style={{ width: "100%", accentColor: "#e8541a" }} />
      </div>
      <div style={s.row}>
        <label style={s.label}>Monthly no-code tool cost ($)</label>
        <input type="number" style={s.input} value={toolCost} onChange={e => setToolCost(+e.target.value)} min={0} />
      </div>
      <div style={s.row}>
        <label style={s.label}>One-time setup / dev cost ($)</label>
        <input type="number" style={s.input} value={devCost} onChange={e => setDevCost(+e.target.value)} min={0} />
      </div>

      <div style={s.card}>
        <div style={s.metric}><span style={s.mLabel}>Monthly time savings</span><span style={s.mValue}>{fmt(monthlySavings)}</span></div>
        <div style={s.metric}><span style={s.mLabel}>Annual time savings</span><span style={s.mValue}>{fmt(annualSavings)}</span></div>
        <div style={s.metric}><span style={s.mLabel}>Annual tool cost</span><span style={s.mValue}>{fmt(annualToolCost)}</span></div>
        <div style={s.metric}><span style={s.mLabel}>Payback period</span><span style={s.mValue}>{typeof paybackMonths === "number" ? `${paybackMonths} months` : "N/A"}</span></div>
        <div style={s.highlight}>
          <span style={s.hlLabel}>First-year net ROI</span>
          <span style={s.hlValue}>{roiPercent > 0 ? `${roiPercent}%` : "Negative"}</span>
        </div>
      </div>
    </div>
  );
}
