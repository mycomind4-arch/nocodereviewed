import { useState } from "react";

const STACKS = [
  {
    month: "May 2025",
    title: "The $97/mo solo SaaS stack",
    useCase: "SaaS MVP",
    founder: "Solo founder",
    totalCost: 97,
    tools: [
      { name: "Bubble", role: "Frontend + backend", cost: 29, why: "Handles database, auth, and UI in one. The fastest way to ship a real SaaS." },
      { name: "Stripe", role: "Payments", cost: 0, why: "Pay-as-you-go. No monthly fee — just 2.9% + 30¢ per transaction." },
      { name: "Mailchimp", role: "Email marketing", cost: 13, why: "Free up to 500 contacts, then $13/mo. Automations + broadcasts covered." },
      { name: "Cloudflare", role: "DNS + CDN", cost: 0, why: "Free forever for DNS, basic DDoS protection, and SSL." },
      { name: "Loom", role: "Onboarding videos", cost: 15, why: "Record walkthrough videos for user onboarding. Way better than docs." },
      { name: "Crisp", role: "Live chat support", cost: 25, why: "Free plan for 2 agents. Upgrade to $25/mo for chatbot + more agents." },
      { name: "Notion", role: "Docs + roadmap", cost: 0, why: "Free forever for solo use. Public changelog keeps users engaged." },
      { name: "Plausible", role: "Analytics", cost: 9, why: "Privacy-first, no cookie banner needed. Simple and accurate." },
    ],
    pros: ["Ship in weeks not months", "Near-zero upfront cost", "Easy to update solo"],
    cons: ["Bubble has row limits on cheap plan", "Not ideal for >10K users"],
    affiliateNote: "Earn recurring commission on Bubble, Mailchimp, and Crisp referrals."
  },
  {
    month: "April 2025",
    title: "The membership site stack",
    useCase: "Membership / Community",
    founder: "Creator / coach",
    totalCost: 113,
    tools: [
      { name: "Webflow", role: "Website + CMS", cost: 23, why: "Best-looking sites in no-code. CMS plan lets you manage all your content." },
      { name: "Memberstack", role: "Member auth + gating", cost: 25, why: "The #1 Webflow add-on for membership sites. Handles tiers and paywalls." },
      { name: "Stripe", role: "Subscriptions", cost: 0, why: "Memberstack uses Stripe under the hood for recurring billing." },
      { name: "Circle", role: "Community forum", cost: 39, why: "Dedicated community platform. Much better than Discord for paid members." },
      { name: "ConvertKit", role: "Email sequences", cost: 9, why: "Free up to 1K subscribers. Best for creators doing email courses." },
      { name: "Loom", role: "Course content", cost: 15, why: "Embed Loom videos for course content. No video hosting fees." },
    ],
    pros: ["Polished, high-trust look", "Rock-solid auth with Memberstack", "Circle community is best-in-class"],
    cons: ["Multiple tools to manage", "Can get expensive at scale"],
    affiliateNote: "Webflow + Memberstack are both high-commission affiliate programs."
  },
  {
    month: "March 2025",
    title: "The internal ops stack",
    useCase: "Internal Tools",
    founder: "Ops team / startup",
    totalCost: 60,
    tools: [
      { name: "Retool", role: "Internal dashboards", cost: 10, why: "Per-user pricing. Build admin panels, CRMs, and ops tools fast." },
      { name: "Airtable", role: "Database + spreadsheet", cost: 20, why: "The backbone. Retool + Airtable is the most common internal stack." },
      { name: "Zapier", role: "Workflow automation", cost: 20, why: "Starter plan handles most automation needs. 750 tasks/mo." },
      { name: "Notion", role: "Docs + SOPs", cost: 0, why: "Free for small teams. Keep all your SOPs and runbooks here." },
      { name: "Slack", role: "Team comms + alerts", cost: 0, why: "Free forever for small teams. Zapier pipes Retool alerts to Slack." },
    ],
    pros: ["Built in days not months", "No dev resources needed", "Highly customizable"],
    cons: ["Retool per-user pricing adds up", "Zapier tasks can run out"],
    affiliateNote: "Retool and Airtable both have affiliate programs with recurring commission."
  }
];

export default function StackOfTheMonth() {
  const [selected, setSelected] = useState(0);
  const stack = STACKS[selected];

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {STACKS.map((s, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ padding: "7px 16px", borderRadius: 99, border: "0.5px solid", borderColor: selected === i ? "var(--color-border-info)" : "var(--color-border-secondary)", background: selected === i ? "var(--color-background-info)" : "var(--color-background-primary)", color: selected === i ? "var(--color-text-info)" : "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            {s.month}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ padding: "1.25rem", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>{stack.title}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 99, background: "var(--color-background-info)", color: "var(--color-text-info)" }}>{stack.useCase}</span>
                <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 99, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)" }}>{stack.founder}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 500, color: "var(--color-text-primary)" }}>${stack.totalCost}/mo</div>
              <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>total monthly cost</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "1rem 1.25rem" }}>
          {stack.tools.map((tool, i) => (
            <div key={tool.name} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < stack.tools.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
              <div style={{ minWidth: 100 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{tool.name}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{tool.role}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{tool.why}</div>
              </div>
              <div style={{ minWidth: 50, textAlign: "right" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: tool.cost === 0 ? "var(--color-text-success)" : "var(--color-text-primary)" }}>
                  {tool.cost === 0 ? "Free" : `$${tool.cost}/mo`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "var(--color-background-success)", border: "0.5px solid var(--color-border-success)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-success)", marginBottom: 6 }}>Pros</div>
          {stack.pros.map(p => <div key={p} style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 3 }}>✓ {p}</div>)}
        </div>
        <div style={{ background: "var(--color-background-warning)", border: "0.5px solid var(--color-border-warning)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-warning)", marginBottom: 6 }}>Watch out</div>
          {stack.cons.map(c => <div key={c} style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 3 }}>⚠ {c}</div>)}
        </div>
      </div>
    </div>
  );
}
