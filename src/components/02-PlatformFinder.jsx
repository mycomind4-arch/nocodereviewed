import { useState } from "react";

const s = {
  wrap: { fontFamily: "'DM Sans', sans-serif", maxWidth: 620, margin: "0 auto", padding: "2rem 1.5rem" },
  h1: { fontSize: 26, fontWeight: 700, color: "#0f0e0d", marginBottom: 4 },
  sub: { fontSize: 14, color: "#9a9590", marginBottom: 28 },
  progress: { height: 4, background: "#f3ede4", borderRadius: 9999, marginBottom: 28, overflow: "hidden" },
  bar: (pct) => ({ height: "100%", width: `${pct}%`, background: "#e8541a", borderRadius: 9999, transition: "width 0.4s" }),
  question: { fontSize: 18, fontWeight: 600, color: "#0f0e0d", marginBottom: 20 },
  optGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  opt: (sel) => ({ padding: "14px 16px", border: `2px solid ${sel ? "#e8541a" : "#e8e4dc"}`, borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: sel ? 600 : 400, color: sel ? "#e8541a" : "#4a4845", background: sel ? "#fff7f4" : "#fff", transition: "all 0.15s" }),
  btn: { marginTop: 24, padding: "12px 28px", background: "#e8541a", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  result: { background: "#faf8f4", border: "1.5px solid #e8e4dc", borderRadius: 12, padding: "1.5rem", marginTop: 8 },
  rName: { fontSize: 20, fontWeight: 700, color: "#0f0e0d" },
  rWhy: { fontSize: 14, color: "#4a4845", marginTop: 6, lineHeight: 1.6 },
  tag: { display: "inline-block", background: "#f3ede4", color: "#4a4845", fontSize: 11, padding: "3px 10px", borderRadius: 9999, marginRight: 6, marginTop: 10 },
};

const questions = [
  { q: "What are you building?", opts: ["Website / Landing page", "Web or mobile app", "Online store", "Internal tool / Dashboard"] },
  { q: "Technical comfort level?", opts: ["Complete beginner", "Some HTML knowledge", "Comfortable with code", "Developer exploring no-code"] },
  { q: "Team size?", opts: ["Just me", "2–5 people", "6–20 people", "20+ people"] },
  { q: "Monthly budget?", opts: ["Free only", "Under $50/mo", "$50–$200/mo", "$200+/mo"] },
  { q: "Most important factor?", opts: ["Ease of use", "Design quality", "Features & power", "Integrations"] },
];

const results = {
  "Website / Landing page,Complete beginner": { name: "Carrd", why: "The fastest way to get a beautiful one-page site live with zero learning curve.", tags: ["Free plan", "Simple", "Fast"] },
  "Website / Landing page,Some HTML knowledge": { name: "Webflow", why: "Visual CSS power with full design control. The best for pixel-perfect websites.", tags: ["Design freedom", "CMS", "Animations"] },
  "Web or mobile app,Complete beginner": { name: "Glide", why: "Turn a spreadsheet into a mobile app in minutes. Zero code needed.", tags: ["Mobile", "Free plan", "Fast"] },
  "Web or mobile app,Comfortable with code": { name: "Bubble", why: "The most powerful no-code app builder. Complex logic, databases, and APIs.", tags: ["Full-stack", "Scalable", "Database"] },
  "Online store,Complete beginner": { name: "Shopify", why: "The world's best ecommerce platform. Everything you need in one place.", tags: ["Ecommerce", "Payments", "Apps"] },
  "Internal tool / Dashboard,Just me": { name: "Softr", why: "Build client portals and internal tools on top of Airtable in hours.", tags: ["Internal tools", "Airtable", "Portal"] },
  default: { name: "Webflow", why: "A versatile platform that works for most use cases — design-forward and powerful.", tags: ["Popular", "Versatile", "Design"] },
};

export default function PlatformFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const select = (opt) => {
    const next = [...answers, opt];
    setAnswers(next);
    if (step < questions.length - 1) setStep(step + 1);
    else setDone(true);
  };

  const reset = () => { setStep(0); setAnswers([]); setDone(false); };

  const getResult = () => {
    const key = `${answers[0]},${answers[1]}`;
    return results[key] || results.default;
  };

  if (done) {
    const r = getResult();
    return (
      <div style={s.wrap}>
        <h1 style={s.h1}>Your best match</h1>
        <p style={s.sub}>Based on your answers, here's our top recommendation.</p>
        <div style={s.result}>
          <div style={s.rName}>{r.name}</div>
          <div style={s.rWhy}>{r.why}</div>
          <div>{r.tags.map(t => <span key={t} style={s.tag}>{t}</span>)}</div>
        </div>
        <button style={{ ...s.btn, marginTop: 20, background: "#f3ede4", color: "#0f0e0d" }} onClick={reset}>Start over</button>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>Find Your Platform</h1>
      <p style={s.sub}>5 questions to find the right no-code tool for you.</p>
      <div style={s.progress}><div style={s.bar((step / questions.length) * 100)} /></div>
      <div style={s.question}>Question {step + 1} of {questions.length}: {q.q}</div>
      <div style={s.optGrid}>
        {q.opts.map(o => (
          <div key={o} style={s.opt(false)} onClick={() => select(o)}>{o}</div>
        ))}
      </div>
    </div>
  );
}
