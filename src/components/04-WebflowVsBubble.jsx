import { useState } from "react";

const s = {
  wrap: { fontFamily: "'DM Sans', sans-serif", maxWidth: 660, margin: "0 auto", padding: "2rem 1.5rem" },
  h1: { fontSize: 26, fontWeight: 700, color: "#0f0e0d", marginBottom: 4 },
  sub: { fontSize: 14, color: "#9a9590", marginBottom: 28 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: (picked) => ({ border: `2px solid ${picked ? "#e8541a" : "#e8e4dc"}`, borderRadius: 12, padding: "1.2rem", cursor: "pointer", background: picked ? "#fff7f4" : "#fff", transition: "all 0.15s" }),
  cTitle: (picked) => ({ fontSize: 16, fontWeight: 700, color: picked ? "#e8541a" : "#0f0e0d", marginBottom: 4 }),
  cSub: { fontSize: 13, color: "#9a9590" },
  section: { marginBottom: 24 },
  sLabel: { fontSize: 13, fontWeight: 600, color: "#4a4845", marginBottom: 10, display: "block" },
  verdict: { borderRadius: 12, padding: "1.5rem", marginTop: 8 },
  vName: { fontSize: 22, fontWeight: 700, marginBottom: 6 },
  vWhy: { fontSize: 14, lineHeight: 1.65 },
  pill: (c) => ({ display: "inline-block", background: c === "webflow" ? "#e8f4fd" : "#fff0eb", color: c === "webflow" ? "#1a6fa8" : "#c94010", fontSize: 11, padding: "3px 10px", borderRadius: 9999, marginRight: 6, marginTop: 8, fontWeight: 600 }),
};

const criteria = [
  { id: "design", label: "Primary goal", opts: [{ val: "webflow", label: "Beautiful marketing site" }, { val: "bubble", label: "Full web application" }] },
  { id: "logic", label: "App logic needed?", opts: [{ val: "webflow", label: "None / minimal" }, { val: "bubble", label: "Complex workflows & DB" }] },
  { id: "users", label: "User accounts?", opts: [{ val: "webflow", label: "Not needed / basic CMS" }, { val: "bubble", label: "Yes, full auth & roles" }] },
  { id: "speed", label: "Launch timeline?", opts: [{ val: "webflow", label: "Need it fast, design matters" }, { val: "bubble", label: "Taking time to build right" }] },
  { id: "budget", label: "Ongoing cost tolerance?", opts: [{ val: "webflow", label: "Keep it low" }, { val: "bubble", label: "Pay for scale / workload" }] },
];

export default function WebflowVsBubble() {
  const [picks, setPicks] = useState({});

  const pick = (id, val) => setPicks(p => ({ ...p, [id]: val }));
  const answered = Object.keys(picks).length;
  const wfScore = Object.values(picks).filter(v => v === "webflow").length;
  const bbScore = Object.values(picks).filter(v => v === "bubble").length;
  const winner = answered >= 3 ? (wfScore >= bbScore ? "webflow" : "bubble") : null;

  const verdicts = {
    webflow: { name: "Webflow", color: "#1a6fa8", bg: "#e8f4fd", why: "Your answers point clearly to Webflow. You need a design-forward site, not a full application. Webflow's visual CSS power and CMS are unmatched for this use case. Start on the Starter plan (free), upgrade when you need custom domains.", tags: ["webflow"] },
    bubble: { name: "Bubble", color: "#c94010", bg: "#fff0eb", why: "Your answers point to Bubble. You're building a real application with users, data, and logic — not just a website. Bubble can handle full-stack complexity. Expect a steeper learning curve but far more capability.", tags: ["bubble"] },
  };

  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>Webflow vs Bubble</h1>
      <p style={s.sub}>Answer 5 questions and we'll tell you which one to use.</p>
      {criteria.map(c => (
        <div key={c.id} style={s.section}>
          <span style={s.sLabel}>{c.label}</span>
          <div style={s.grid}>
            {c.opts.map(o => (
              <div key={o.val} style={s.card(picks[c.id] === o.val)} onClick={() => pick(c.id, o.val)}>
                <div style={s.cTitle(picks[c.id] === o.val)}>{o.val === "webflow" ? "Webflow" : "Bubble"}</div>
                <div style={s.cSub}>{o.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {winner && (
        <div style={{ ...s.verdict, background: verdicts[winner].bg, border: `2px solid ${verdicts[winner].color}` }}>
          <div style={{ ...s.vName, color: verdicts[winner].color }}>Use {verdicts[winner].name}</div>
          <div style={s.vWhy}>{verdicts[winner].why}</div>
          {verdicts[winner].tags.map(t => <span key={t} style={s.pill(t)}>{t.toUpperCase()}</span>)}
        </div>
      )}
    </div>
  );
}
