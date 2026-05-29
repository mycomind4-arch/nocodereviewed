import { useState } from "react";

const tools = [
  {
    name: "Bubble",
    logo: "🫧",
    tags: ["web app", "saas", "complex", "database", "no-code"],
    pricing: "From $29/mo",
    bestFor: "Complex web apps & SaaS",
    affiliate: "https://bubble.io",
    scores: { complexity: 5, budget: 3, speed: 3, mobile: 2, ecommerce: 2, internal: 5, beginner: 2 },
  },
  {
    name: "Webflow",
    logo: "🌊",
    tags: ["website", "cms", "marketing", "design"],
    pricing: "From $14/mo",
    bestFor: "Beautiful marketing sites & CMS",
    affiliate: "https://webflow.com",
    scores: { complexity: 3, budget: 4, speed: 4, mobile: 3, ecommerce: 3, internal: 2, beginner: 3 },
  },
  {
    name: "Glide",
    logo: "✨",
    tags: ["mobile", "internal tools", "sheets"],
    pricing: "From $0/mo",
    bestFor: "Mobile apps from spreadsheets",
    affiliate: "https://glideapps.com",
    scores: { complexity: 2, budget: 5, speed: 5, mobile: 5, ecommerce: 1, internal: 4, beginner: 5 },
  },
  {
    name: "Shopify",
    logo: "🛍️",
    tags: ["ecommerce", "store", "products"],
    pricing: "From $29/mo",
    bestFor: "E-commerce & online stores",
    affiliate: "https://shopify.com",
    scores: { complexity: 2, budget: 3, speed: 5, mobile: 5, ecommerce: 5, internal: 1, beginner: 4 },
  },
  {
    name: "Retool",
    logo: "🔧",
    tags: ["internal tools", "dashboard", "admin"],
    pricing: "From $10/mo",
    bestFor: "Internal tools & admin panels",
    affiliate: "https://retool.com",
    scores: { complexity: 4, budget: 3, speed: 4, mobile: 2, ecommerce: 1, internal: 5, beginner: 2 },
  },
  {
    name: "FlutterFlow",
    logo: "📱",
    tags: ["mobile", "ios", "android", "native"],
    pricing: "From $30/mo",
    bestFor: "Native iOS & Android apps",
    affiliate: "https://flutterflow.io",
    scores: { complexity: 4, budget: 3, speed: 3, mobile: 5, ecommerce: 2, internal: 3, beginner: 2 },
  },
  {
    name: "Softr",
    logo: "🧱",
    tags: ["airtable", "portal", "client", "beginner"],
    pricing: "From $0/mo",
    bestFor: "Client portals & simple apps",
    affiliate: "https://softr.io",
    scores: { complexity: 1, budget: 5, speed: 5, mobile: 3, ecommerce: 2, internal: 3, beginner: 5 },
  },
  {
    name: "Adalo",
    logo: "🎯",
    tags: ["mobile", "app", "beginner", "simple"],
    pricing: "From $36/mo",
    bestFor: "Simple mobile apps fast",
    affiliate: "https://adalo.com",
    scores: { complexity: 2, budget: 3, speed: 4, mobile: 4, ecommerce: 2, internal: 2, beginner: 4 },
  },
];

const questions = [
  {
    id: "projectType",
    question: "What are you building?",
    icon: "🏗️",
    options: [
      { label: "Web App / SaaS", value: "web", scoreKey: "complexity" },
      { label: "Marketing Website", value: "marketing", scoreKey: "speed" },
      { label: "Mobile App", value: "mobile", scoreKey: "mobile" },
      { label: "E-commerce Store", value: "ecommerce", scoreKey: "ecommerce" },
      { label: "Internal Tool / Dashboard", value: "internal", scoreKey: "internal" },
    ],
  },
  {
    id: "experience",
    question: "What's your no-code experience level?",
    icon: "🧠",
    options: [
      { label: "Complete beginner", value: "beginner", scoreKey: "beginner" },
      { label: "Some experience", value: "intermediate", scoreKey: null },
      { label: "Experienced builder", value: "advanced", scoreKey: "complexity" },
    ],
  },
  {
    id: "budget",
    question: "What's your monthly budget?",
    icon: "💰",
    options: [
      { label: "Free / Under $10", value: "free", scoreKey: "budget" },
      { label: "$10 – $50/mo", value: "mid", scoreKey: null },
      { label: "$50 – $200/mo", value: "high", scoreKey: "complexity" },
      { label: "$200+/mo (scaling)", value: "enterprise", scoreKey: "complexity" },
    ],
  },
  {
    id: "timeline",
    question: "How fast do you need to launch?",
    icon: "⚡",
    options: [
      { label: "This week!", value: "fast", scoreKey: "speed" },
      { label: "Within a month", value: "month", scoreKey: null },
      { label: "No rush, want quality", value: "slow", scoreKey: "complexity" },
    ],
  },
  {
    id: "mobile",
    question: "Does it need to work on mobile?",
    icon: "📱",
    options: [
      { label: "Yes, mobile-first", value: "yes", scoreKey: "mobile" },
      { label: "Nice to have", value: "maybe", scoreKey: null },
      { label: "Desktop only is fine", value: "no", scoreKey: null },
    ],
  },
];

function ScoreBar({ score, max = 5 }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "var(--color-background-secondary)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--color-text-info)", borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 12, color: "var(--color-text-secondary)", minWidth: 24 }}>{score}/{max}</span>
    </div>
  );
}

export default function NoCodeRecommendationWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const currentQ = questions[step];
  const progress = ((step) / questions.length) * 100;

  function selectOption(questionId, option) {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 220);
    } else {
      computeResults(newAnswers);
    }
  }

  function computeResults(finalAnswers) {
    const scores = tools.map((tool) => {
      let score = 0;
      Object.values(finalAnswers).forEach((opt) => {
        if (opt.scoreKey && tool.scores[opt.scoreKey]) {
          score += tool.scores[opt.scoreKey];
        }
      });
      return { ...tool, totalScore: score };
    });
    scores.sort((a, b) => b.totalScore - a.totalScore);
    setResults(scores);
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setResults(null);
  }

  const topMatch = results?.[0];

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 640, margin: "0 auto", padding: "1.5rem 0" }}>
      {!results ? (
        <>
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Question {step + 1} of {questions.length}</span>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: 4, background: "var(--color-background-secondary)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "var(--color-text-info)", borderRadius: 99, transition: "width 0.4s ease" }} />
            </div>
          </div>

          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.75rem" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{currentQ.icon}</div>
            <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 1.5rem", color: "var(--color-text-primary)" }}>{currentQ.question}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id]?.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectOption(currentQ.id, opt)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 16px",
                      borderRadius: "var(--border-radius-md)",
                      border: isSelected ? "1.5px solid var(--color-border-info)" : "0.5px solid var(--color-border-secondary)",
                      background: isSelected ? "var(--color-background-info)" : "var(--color-background-primary)",
                      color: isSelected ? "var(--color-text-info)" : "var(--color-text-primary)",
                      fontSize: 15,
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{ marginTop: 12, background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: 14, cursor: "pointer", padding: "8px 0", fontFamily: "var(--font-sans)" }}>
              ← Back
            </button>
          )}
        </>
      ) : (
        <>
          <div style={{ background: "var(--color-background-info)", border: "0.5px solid var(--color-border-info)", borderRadius: "var(--border-radius-lg)", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: 13, color: "var(--color-text-info)", fontWeight: 500, marginBottom: 4 }}>Top recommendation</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 500, color: "var(--color-text-primary)" }}>{topMatch.logo} {topMatch.name}</div>
                <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 4 }}>{topMatch.bestFor}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>{topMatch.pricing}</div>
              </div>
              <a href={topMatch.affiliate} target="_blank" rel="noopener noreferrer" style={{ background: "var(--color-text-info)", color: "#fff", padding: "10px 20px", borderRadius: "var(--border-radius-md)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                Try {topMatch.name} →
              </a>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 0.75rem", color: "var(--color-text-secondary)" }}>All tool rankings</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {results.slice(0, 6).map((tool, i) => (
                <div key={tool.name} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18, minWidth: 28, color: "var(--color-text-secondary)", fontWeight: 500 }}>#{i + 1}</span>
                  <span style={{ fontSize: 20 }}>{tool.logo}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>{tool.name}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{tool.bestFor}</div>
                  </div>
                  <div style={{ minWidth: 120 }}>
                    <ScoreBar score={tool.totalScore} max={results[0].totalScore} />
                  </div>
                  <a href={tool.affiliate} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--color-text-info)", textDecoration: "none", whiteSpace: "nowrap" }}>
                    Visit →
                  </a>
                </div>
              ))}
            </div>
          </div>

          <button onClick={reset} style={{ marginTop: 8, background: "none", border: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-secondary)", padding: "10px 20px", borderRadius: "var(--border-radius-md)", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            ↺ Start over
          </button>
        </>
      )}
    </div>
  );
}
