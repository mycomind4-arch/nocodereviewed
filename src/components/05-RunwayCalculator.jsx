import { useState } from "react";

const s = {
  wrap: { fontFamily: "'DM Sans', sans-serif", maxWidth: 640, margin: "0 auto", padding: "2rem 1.5rem" },
  h1: { fontSize: 26, fontWeight: 700, color: "#0f0e0d", marginBottom: 4 },
  sub: { fontSize: 14, color: "#9a9590", marginBottom: 28 },
  row: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: 600, color: "#4a4845", marginBottom: 6, display: "block" },
  input: { width: "100%", padding: "10px 14px", border: "1.5px solid #e8e4dc", borderRadius: 8, fontSize: 15, color: "#0f0e0d", background: "#fff", boxSizing: "border-box", outline: "none" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 },
  metric: { background: "#faf8f4", border: "1.5px solid #e8e4dc", borderRadius: 12, padding: "1.2rem", textAlign: "center" },
  mNum: { fontSize: 28, fontWeight: 700, color: "#0f0e0d" },
  mLabel: { fontSize: 12, color: "#9a9590", marginTop: 4 },
  warn: (ok) => ({ background: ok ? "#f0fdf4" : "#fff7ed", border: `1.5px solid ${ok ? "#166534" : "#f7a349"}`, borderRadius: 10, padding: "1rem 1.2rem", marginTop: 16, fontSize: 14, color: ok ? "#166534" : "#92400e", fontWeight: 500 }),
};

export default function RunwayCalculator() {
  const [mrr, setMrr] = useState(2500);
  const [growth, setGrowth] = useState(15);
  const [burn, setBurn] = useState(8000);
  const [cash, setCash] = useState(50000);

  const monthlyNet = mrr - burn;
  const runwayMonths = monthlyNet >= 0 ? Infinity : Math.floor(cash / Math.abs(monthlyNet));
  const breakEvenMonths = mrr >= burn ? 0 : Math.ceil(Math.log(burn / mrr) / Math.log(1 + growth / 100));
  const mrrAtBreakEven = Math.round(mrr * Math.pow(1 + growth / 100, breakEvenMonths));

  const safe = runwayMonths === Infinity || runwayMonths > 12;
  const fmt = n => n === Infinity ? "∞" : n.toLocaleString();
  const fmtCurr = n => `$${n.toLocaleString()}`;

  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>SaaS Runway Calculator</h1>
      <p style={s.sub}>How long can your no-code SaaS survive at current burn and growth?</p>

      <div style={s.row}><label style={s.label}>Current MRR ($)</label><input style={s.input} type="number" value={mrr} onChange={e => setMrr(+e.target.value)} min={0} /></div>
      <div style={s.row}><label style={s.label}>Monthly MRR growth rate ({growth}%)</label><input type="range" min={0} max={50} value={growth} onChange={e => setGrowth(+e.target.value)} style={{ width: "100%", accentColor: "#e8541a" }} /></div>
      <div style={s.row}><label style={s.label}>Monthly burn rate ($)</label><input style={s.input} type="number" value={burn} onChange={e => setBurn(+e.target.value)} min={0} /></div>
      <div style={s.row}><label style={s.label}>Cash in bank ($)</label><input style={s.input} type="number" value={cash} onChange={e => setCash(+e.target.value)} min={0} /></div>

      <div style={s.grid}>
        <div style={s.metric}><div style={s.mNum}>{runwayMonths === Infinity ? "∞" : `${runwayMonths}mo`}</div><div style={s.mLabel}>Runway</div></div>
        <div style={s.metric}><div style={s.mNum}>{fmtCurr(Math.abs(monthlyNet))}</div><div style={s.mLabel}>{monthlyNet >= 0 ? "Monthly surplus" : "Monthly deficit"}</div></div>
        <div style={s.metric}><div style={s.mNum}>{breakEvenMonths === 0 ? "Now" : `${breakEvenMonths}mo`}</div><div style={s.mLabel}>Break-even timeline</div></div>
        <div style={s.metric}><div style={s.mNum}>{fmtCurr(mrrAtBreakEven)}</div><div style={s.mLabel}>MRR at break-even</div></div>
      </div>
      <div style={s.warn(safe)}>
        {safe ? `✓ You have ${runwayMonths === Infinity ? "unlimited" : runwayMonths + " months of"} runway. Focus on growth.` : `⚠ Only ${runwayMonths} months of runway. Reduce burn or accelerate revenue now.`}
      </div>
    </div>
  );
}
