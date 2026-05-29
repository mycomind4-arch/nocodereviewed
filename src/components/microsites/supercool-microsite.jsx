import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   SUPERCOOL.COM — MICROSITE
   Design: Bebas Neue + Instrument Serif + JetBrains Mono
   Palette: #0A0A0A bg, #F5F0E8 cream text, #FF3B00 acid orange
   Aesthetic: brutalist editorial meets underground zine
═══════════════════════════════════════════════════════════ */

const G = {
  bg: "#0A0A0A",
  surface: "#111111",
  surface2: "#1A1A1A",
  border: "#252525",
  border2: "#333333",
  text: "#F5F0E8",
  textSoft: "#A8A29E",
  textMute: "#57534E",
  accent: "#FF3B00",
  accentDim: "rgba(255,59,0,0.15)",
  accentBright: "#FF6B47",
  lime: "#C8FF00",
  limeDim: "rgba(200,255,0,0.12)",
  cyan: "#00E5FF",
  navH: 60,
};

/* ─── Shared components ─── */
const Badge = ({ children, variant = "neutral" }) => {
  const colors = {
    neutral: { bg: G.surface2, color: G.textSoft, border: G.border2 },
    hot:     { bg: "rgba(255,59,0,0.12)", color: G.accent, border: "rgba(255,59,0,0.4)" },
    lime:    { bg: G.limeDim, color: G.lime, border: "rgba(200,255,0,0.35)" },
    cyan:    { bg: "rgba(0,229,255,0.1)", color: G.cyan, border: "rgba(0,229,255,0.3)" },
    dark:    { bg: "#000", color: G.textSoft, border: G.border },
  };
  const c = colors[variant] || colors.neutral;
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.12em", textTransform: "uppercase",
      padding: "4px 12px", borderRadius: 3,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      fontFamily: "'JetBrains Mono', monospace",
    }}>{children}</span>
  );
};

const Tag = ({ children }) => (
  <span style={{
    display: "inline-block", fontSize: 9, fontWeight: 700,
    letterSpacing: "0.14em", textTransform: "uppercase",
    padding: "3px 8px", background: G.surface2, color: G.textMute,
    border: `1px solid ${G.border}`, fontFamily: "'JetBrains Mono', monospace",
    marginRight: 6, marginBottom: 6,
  }}>{children}</span>
);

const Divider = ({ style = {} }) => (
  <div style={{ height: 1, background: G.border, ...style }} />
);

const Rule = () => (
  <div style={{ height: 2, background: G.accent, margin: "0 0 32px" }} />
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase",
    color: G.textMute, fontFamily: "'JetBrains Mono', monospace", marginBottom: 20,
  }}>{children}</div>
);

const Card = ({ children, style = {}, accent = false }) => (
  <div style={{
    background: G.surface,
    border: `1px solid ${accent ? G.accent : G.border}`,
    padding: "24px 26px",
    ...(accent ? { boxShadow: `0 0 0 0px ${G.accent}` } : {}),
    ...style,
  }}>{children}</div>
);

const ProseBlock = ({ children }) => (
  <p style={{ fontSize: 15, lineHeight: 1.85, color: G.textSoft, marginBottom: 18, maxWidth: 680 }}>{children}</p>
);

const StatBlock = ({ num, label, color }) => (
  <div style={{ borderLeft: `2px solid ${color || G.accent}`, paddingLeft: 18 }}>
    <div style={{
      fontSize: 42, fontWeight: 400, lineHeight: 1, color: color || G.accent,
      fontFamily: "'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.02em",
    }}>{num}</div>
    <div style={{ fontSize: 11, color: G.textMute, marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
  </div>
);

const Pill = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: `1px solid ${G.border}`, marginBottom: 8 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ fontSize: 13, color: G.textSoft, fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
    </div>
    <span style={{ fontSize: 13, fontWeight: 700, color: G.text, fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
  </div>
);

const BarScore = ({ label, score, max = 10, color }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: G.textSoft, letterSpacing: "0.04em" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: color || G.accent, fontFamily: "'JetBrains Mono', monospace" }}>{score}<span style={{ color: G.textMute }}>/{max}</span></span>
    </div>
    <div style={{ height: 2, background: G.border2 }}>
      <div style={{ height: "100%", width: `${(score / max) * 100}%`, background: color || G.accent, transition: "width 0.6s ease" }} />
    </div>
  </div>
);

const Marquee = ({ items }) => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let raf;
    let last = null;
    const step = (ts) => {
      if (last !== null) setOffset(o => (o + (ts - last) * 0.035) % (items.join(" · ").length * 7.5));
      last = ts;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const text = items.join("  ·  ");
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}`, padding: "10px 0", background: G.surface }}>
      <div style={{ whiteSpace: "nowrap", transform: `translateX(-${offset}px)`, display: "inline-block" }}>
        {[text, "  ·  ", text, "  ·  ", text].map((t, i) => (
          <span key={i} style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: G.textMute, fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   NAV CONFIG
═══════════════════════════════════════════════════════════ */
const NAV = [
  { id: "about",    label: "About" },
  { id: "work",     label: "Work" },
  { id: "studio",   label: "Studio" },
  { id: "clients",  label: "Clients" },
  { id: "services", label: "Services" },
  { id: "contact",  label: "Contact" },
];

/* ═══════════════════════════════════════════════════════════
   PAGES
═══════════════════════════════════════════════════════════ */

/* ── ABOUT ── */
const PageAbout = ({ goTo }) => (
  <div>
    {/* Hero */}
    <div style={{ marginBottom: 64 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: G.accent, fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>Est. 2019 · San Francisco</div>
          <h1 style={{
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: "clamp(72px, 12vw, 120px)",
            lineHeight: 0.92, letterSpacing: "0.01em",
            color: G.text, marginBottom: 0,
            fontWeight: 400,
          }}>
            WE MAKE<br />
            <span style={{ color: G.accent }}>COOL</span><br />
            THINGS
          </h1>
        </div>
        <div style={{ maxWidth: 300, paddingTop: 12 }}>
          <div style={{ fontSize: 11, color: G.textMute, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", marginBottom: 14, textTransform: "uppercase" }}>↓ Scroll for the goods</div>
          <ProseBlock>
            Supercool is an independent creative studio. We build brands, products, and campaigns for the kind of companies that actually move culture forward.
          </ProseBlock>
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            <button onClick={() => goTo("work")} style={{
              padding: "14px 28px", background: G.accent, color: "#fff",
              border: "none", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            }}>See Our Work</button>
            <button onClick={() => goTo("contact")} style={{
              padding: "14px 28px", background: "transparent", color: G.text,
              border: `1px solid ${G.border2}`, fontSize: 12, fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}>Get In Touch</button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <Divider style={{ marginBottom: 36 }} />
      <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
        <StatBlock num="120+" label="Projects Shipped" />
        <StatBlock num="6" label="Years Running" color={G.lime} />
        <StatBlock num="40+" label="Clients Worldwide" color={G.cyan} />
        <StatBlock num="3" label="Cannes Lions" />
      </div>
    </div>

    {/* Manifesto */}
    <div style={{ marginBottom: 56 }}>
      <SectionLabel>§ 01 — What We Believe</SectionLabel>
      <Rule />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {[
          ["Weird is a strategy.", "Safe brands get ignored. We push hard in the direction of strange, specific, and singular. If it's been done before, we don't want to do it."],
          ["Craft is not optional.", "Every pixel, every word, every interaction is intentional. We're obsessive about quality because the details are what separate good from unforgettable."],
          ["Speed is a feature.", "We move fast without sacrificing craft. Short timelines sharpen the mind. We've shipped full brand systems in 72 hours."],
          ["Culture is the brief.", "We study what's happening in music, art, film, sports, and tech to make sure our work is speaking the language of right now."],
        ].map(([title, body]) => (
          <Card key={title}>
            <div style={{ fontSize: 13, fontWeight: 700, color: G.text, marginBottom: 10, letterSpacing: "-0.01em" }}>{title}</div>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: G.textSoft }}>{body}</p>
          </Card>
        ))}
      </div>
    </div>

    {/* Team */}
    <div>
      <SectionLabel>§ 02 — Who We Are</SectionLabel>
      <Rule />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: G.border }}>
        {[
          { name: "Mia Nakamura", role: "Creative Director", tags: ["Brand", "Art Direction"] },
          { name: "Dev Okafor", role: "Design Lead", tags: ["UI/UX", "Motion"] },
          { name: "Sofía Reyes", role: "Strategy", tags: ["Positioning", "Copy"] },
          { name: "Kai Lindqvist", role: "Tech Lead", tags: ["Dev", "Webflow"] },
        ].map(p => (
          <div key={p.name} style={{ background: G.bg, padding: "24px 22px" }}>
            <div style={{ width: 44, height: 44, background: G.surface2, border: `1px solid ${G.border}`, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16, fontFamily: "'Bebas Neue', sans-serif", color: G.accent, letterSpacing: "0.05em" }}>{p.name.split(" ").map(w => w[0]).join("")}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: G.text, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: G.accent, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>{p.role}</div>
            <div>{p.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── WORK ── */
const PageWork = () => {
  const projects = [
    { id: "01", name: "Fracture", category: "Brand Identity", client: "Music Tech Startup", year: "2024", tags: ["Branding", "Web", "Motion"], color: G.accent, desc: "Full rebrand for a spatial audio company — sonic identity, visual system, and launch campaign that hit 2M impressions in week one." },
    { id: "02", name: "Drift", category: "Campaign", client: "EV Manufacturer", year: "2024", tags: ["Campaign", "OOH", "Social"], color: G.lime, desc: "An outdoor and digital campaign that positioned an electric SUV as the anti-commuter vehicle. Won a regional Cannes Bronze." },
    { id: "03", name: "Meridian", category: "Product Design", client: "Fintech (NDA)", year: "2023", tags: ["UI/UX", "Design System"], color: G.cyan, desc: "A ground-up design system and app redesign for a challenger bank. Reduced time-on-task by 38% in usability testing." },
    { id: "04", name: "Ghost Market", category: "Digital Experience", client: "Luxury Resale Platform", year: "2023", tags: ["Web", "Interaction"], color: G.accent, desc: "An immersive e-commerce experience for rare streetwear. Sold 3,000 units in 4 minutes on launch day." },
    { id: "05", name: "Plume", category: "Brand + Packaging", client: "Wellness Brand", year: "2022", tags: ["Branding", "Packaging", "Print"], color: G.lime, desc: "Premium supplement brand built to compete with the DTC giants. Won a D&AD merit for packaging design." },
    { id: "06", name: "NOVA", category: "Website", client: "Architecture Firm", year: "2022", tags: ["Web", "3D", "Scroll"], color: G.cyan, desc: "A brutalist portfolio site with custom WebGL scroll effects. Featured in Awwwards SOTD." },
  ];

  return (
    <div>
      <SectionLabel>§ Selected Projects</SectionLabel>
      <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          fontSize: "clamp(52px, 8vw, 80px)",
          fontWeight: 400, letterSpacing: "0.01em", color: G.text, lineHeight: 0.9,
        }}>OUR WORK</h2>
        <Badge variant="hot">2022–2024</Badge>
      </div>
      <Divider style={{ marginBottom: 0 }} />

      {projects.map((p, i) => (
        <div key={p.id}>
          <div style={{
            display: "grid", gridTemplateColumns: "56px 1fr auto",
            gap: 24, padding: "28px 0", alignItems: "start",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: G.textMute, paddingTop: 4, letterSpacing: "0.06em" }}>{p.id}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 28, fontWeight: 400, letterSpacing: "0.03em",
                  color: G.text, lineHeight: 1,
                }}>{p.name}</span>
                <span style={{ fontSize: 11, color: G.textMute, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>— {p.category}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: G.textSoft, maxWidth: 560, marginBottom: 14 }}>{p.desc}</p>
              <div>{p.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
            </div>
            <div style={{ textAlign: "right", paddingTop: 4 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.color, letterSpacing: "0.06em", marginBottom: 4 }}>{p.year}</div>
              <div style={{ fontSize: 11, color: G.textMute, letterSpacing: "0.04em" }}>{p.client}</div>
            </div>
          </div>
          <Divider />
        </div>
      ))}
    </div>
  );
};

/* ── STUDIO ── */
const PageStudio = () => (
  <div>
    <SectionLabel>§ How We Work</SectionLabel>
    <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 40 }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        fontSize: "clamp(52px, 8vw, 80px)",
        fontWeight: 400, letterSpacing: "0.01em", color: G.text, lineHeight: 0.9,
      }}>THE STUDIO</h2>
    </div>

    {/* Process */}
    <div style={{ marginBottom: 56 }}>
      <Rule />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: G.border }}>
        {[
          { num: "01", title: "Immersion", body: "We spend the first week becoming obsessed with your world — competitors, culture, audience, and blindspots." },
          { num: "02", title: "Territory", body: "We map out where you can own territory that no one else is claiming. Brand positioning as competitive moat." },
          { num: "03", title: "Build", body: "We work in rapid cycles, shipping real work fast and iterating based on feedback rather than guessing games." },
          { num: "04", title: "Launch", body: "We stay close through launch — not just delivery. We track what works, cut what doesn't, and double down." },
        ].map(step => (
          <div key={step.num} style={{ background: G.bg, padding: "28px 22px" }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 52, color: G.accent, lineHeight: 1, marginBottom: 14, fontWeight: 400,
            }}>{step.num}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 10 }}>{step.title}</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: G.textSoft }}>{step.body}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Our setup */}
    <div style={{ marginBottom: 56 }}>
      <SectionLabel>§ The Setup</SectionLabel>
      <Rule />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: G.text, marginBottom: 18, letterSpacing: "-0.01em" }}>Tools we use</div>
          {[
            ["Figma", "Primary design environment"],
            ["Webflow", "No-code web production"],
            ["After Effects", "Motion & animation"],
            ["Midjourney + Custom", "AI-assisted concepts"],
            ["Notion", "Project management"],
            ["Loom", "Async review cycles"],
          ].map(([tool, desc]) => (
            <div key={tool} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${G.border}` }}>
              <span style={{ fontSize: 13, color: G.text, fontFamily: "'JetBrains Mono', monospace" }}>{tool}</span>
              <span style={{ fontSize: 11, color: G.textMute, letterSpacing: "0.04em" }}>{desc}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: G.text, marginBottom: 18, letterSpacing: "-0.01em" }}>How we engage</div>
          {[
            { label: "Project-based", desc: "Fixed scope, fixed fee. Best for defined deliverables.", color: G.accent },
            { label: "Retainer", desc: "Monthly creative partnership. Ongoing strategy + execution.", color: G.lime },
            { label: "Sprint", desc: "72-hour blitz. Intense, focused, limited slots per quarter.", color: G.cyan },
          ].map(({ label, desc, color }) => (
            <Card key={label} style={{ marginBottom: 10, borderLeft: `3px solid ${color}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: G.text, marginBottom: 6 }}>{label}</div>
              <p style={{ fontSize: 12, color: G.textSoft, lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>

    {/* Culture */}
    <div>
      <SectionLabel>§ Our Operating Principles</SectionLabel>
      <Rule />
      <div style={{ columns: 2, columnGap: 40 }}>
        {[
          "No decks that could belong to anyone else.",
          "Never miss a deadline. Ever.",
          "Feedback within 24 hours, always.",
          "We don't take on work we can't be proud of.",
          "Honesty over comfort — we'll tell you when something isn't working.",
          "Small team means direct access to senior talent.",
          "We kill our darlings before you have to.",
          "One revision round is enough if we listen properly.",
        ].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, breakInside: "avoid" }}>
            <span style={{ color: G.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, paddingTop: 2, flexShrink: 0 }}>→</span>
            <p style={{ fontSize: 13, color: G.textSoft, lineHeight: 1.7, margin: 0 }}>{p}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── CLIENTS ── */
const PageClients = () => (
  <div>
    <SectionLabel>§ Who We've Worked With</SectionLabel>
    <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 40 }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        fontSize: "clamp(52px, 8vw, 80px)",
        fontWeight: 400, letterSpacing: "0.01em", color: G.text, lineHeight: 0.9,
      }}>CLIENTS</h2>
    </div>

    {/* Industry breakdown */}
    <Rule />
    <div style={{ marginBottom: 48 }}>
      {[
        { sector: "Tech & Startups", color: G.accent, clients: ["Fracture (music tech)", "Meridian (fintech)", "Nova Systems", "Layer", "Stackr"] },
        { sector: "Consumer Brands", color: G.lime, clients: ["Plume (wellness)", "Ghost Market (fashion)", "Luma Coffee", "Nord Athletics"] },
        { sector: "Entertainment & Culture", color: G.cyan, clients: ["Drift Campaign (automotive)", "Arena (live events)", "Parallax Studio", "Signal Records"] },
        { sector: "Architecture & Real Estate", color: G.textSoft, clients: ["NOVA Architecture", "Bastion Developments", "Meridian Living"] },
      ].map(({ sector, color, clients }) => (
        <div key={sector} style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 32, padding: "22px 0", borderBottom: `1px solid ${G.border}`, alignItems: "start" }}>
          <div>
            <div style={{ width: 3, height: 14, background: color, display: "inline-block", marginRight: 10, verticalAlign: "middle" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: G.text, letterSpacing: "0.02em" }}>{sector}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {clients.map(c => <Tag key={c}>{c}</Tag>)}
          </div>
        </div>
      ))}
    </div>

    {/* Testimonials */}
    <SectionLabel>§ What They Say</SectionLabel>
    <Rule />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {[
        { q: "They completely changed how we think about our brand. Not just what we look like — what we stand for.", who: "CEO, Fracture", label: "Brand" },
        { q: "Shipped a full design system in 6 weeks. Other agencies quoted us 6 months. The quality blew us away.", who: "CPO, Meridian", label: "Product" },
        { q: "Our Drift campaign exceeded every KPI we set. They found an angle we'd never have found ourselves.", who: "Head of Marketing, Drift", label: "Campaign" },
        { q: "The Ghost Market site is still the most talked-about thing in our space. Customers send it to each other.", who: "Founder, Ghost Market", label: "Web" },
      ].map(({ q, who, label }) => (
        <Card key={who}>
          <div style={{ marginBottom: 16 }}>
            <Badge variant="dark">{label}</Badge>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: G.text, marginBottom: 16, fontStyle: "italic" }}>&ldquo;{q}&rdquo;</p>
          <div style={{ fontSize: 11, color: G.accent, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>— {who}</div>
        </Card>
      ))}
    </div>
  </div>
);

/* ── SERVICES ── */
const PageServices = () => (
  <div>
    <SectionLabel>§ What We Do</SectionLabel>
    <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 40 }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        fontSize: "clamp(52px, 8vw, 80px)",
        fontWeight: 400, letterSpacing: "0.01em", color: G.text, lineHeight: 0.9,
      }}>SERVICES</h2>
    </div>
    <Rule />

    {[
      {
        id: "01", name: "Brand Identity", color: G.accent,
        desc: "We build brands that are specific, ownable, and built to last. Not just logos — complete visual and verbal systems.",
        includes: ["Logo & visual identity", "Brand strategy & positioning", "Typography system", "Color language", "Brand guidelines", "Verbal identity & tone of voice"],
        scores: [["Strategy", 9], ["Craft", 10], ["Speed", 8]],
      },
      {
        id: "02", name: "Web Design & Build", color: G.lime,
        desc: "We design and build websites that win awards and convert customers. From portfolio sites to full e-commerce.",
        includes: ["Figma design", "Webflow build", "CMS setup", "Motion & interactions", "SEO structure", "Performance optimization"],
        scores: [["Design Quality", 10], ["Tech Depth", 8], ["Speed", 9]],
      },
      {
        id: "03", name: "Campaign & Content", color: G.cyan,
        desc: "Campaign strategy, creative direction, and production for brands with something to say.",
        includes: ["Campaign concepting", "Creative direction", "OOH & digital ads", "Social content systems", "Video & motion", "Copywriting"],
        scores: [["Creativity", 10], ["Strategy", 9], ["Production", 8]],
      },
      {
        id: "04", name: "Product Design", color: G.accent,
        desc: "UI/UX design for startups and scale-ups. From 0→1 products to design system overhauls.",
        includes: ["User research", "Wireframing", "UI design", "Design systems", "Prototyping", "Dev handoff"],
        scores: [["Research depth", 8], ["UI craft", 10], ["Systems thinking", 9]],
      },
    ].map(svc => (
      <div key={svc.id} style={{ marginBottom: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: G.textMute, paddingTop: 6 }}>{svc.id}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, fontWeight: 400, color: G.text, letterSpacing: "0.03em" }}>{svc.name}</h3>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: svc.color, flexShrink: 0 }} />
            </div>
            <ProseBlock>{svc.desc}</ProseBlock>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.14em", color: G.textMute, textTransform: "uppercase", marginBottom: 12 }}>What's included</div>
                {svc.includes.map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: svc.color, fontSize: 10, paddingTop: 2, flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: 13, color: G.textSoft }}>{item}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.14em", color: G.textMute, textTransform: "uppercase", marginBottom: 16 }}>Our strength</div>
                {svc.scores.map(([label, score]) => (
                  <BarScore key={label} label={label} score={score} color={svc.color} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Divider style={{ marginTop: 28 }} />
      </div>
    ))}
  </div>
);

/* ── CONTACT ── */
const PageContact = () => {
  const [form, setForm] = useState({ name: "", email: "", budget: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div>
      <SectionLabel>§ Start a Project</SectionLabel>
      <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 40 }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          fontSize: "clamp(52px, 8vw, 80px)",
          fontWeight: 400, letterSpacing: "0.01em", color: G.text, lineHeight: 0.9,
        }}>CONTACT</h2>
      </div>
      <Rule />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "start" }}>
        {/* Form */}
        <div>
          {sent ? (
            <div style={{ padding: "48px 0" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: G.lime, letterSpacing: "0.02em", marginBottom: 12 }}>GOT IT.</div>
              <p style={{ fontSize: 15, color: G.textSoft, lineHeight: 1.8 }}>We'll be in touch within one business day. Check your inbox.</p>
            </div>
          ) : (
            <div>
              {[
                { key: "name", label: "Your Name", placeholder: "Full name", type: "text" },
                { key: "email", label: "Email", placeholder: "you@company.com", type: "email" },
                { key: "budget", label: "Approximate Budget", placeholder: "e.g. $25,000–$50,000", type: "text" },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.14em", textTransform: "uppercase", color: G.textMute, marginBottom: 8 }}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{
                      width: "100%", padding: "13px 16px",
                      background: G.surface, border: `1px solid ${G.border2}`,
                      color: G.text, fontSize: 14, outline: "none",
                      fontFamily: "inherit", boxSizing: "border-box",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={e => e.target.style.borderColor = G.accent}
                    onBlur={e => e.target.style.borderColor = G.border2}
                  />
                </div>
              ))}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.14em", textTransform: "uppercase", color: G.textMute, marginBottom: 8 }}>Tell Us About Your Project</label>
                <textarea
                  placeholder="What are you working on? What's the problem you're trying to solve?"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  style={{
                    width: "100%", padding: "13px 16px",
                    background: G.surface, border: `1px solid ${G.border2}`,
                    color: G.text, fontSize: 14, outline: "none",
                    fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = G.accent}
                  onBlur={e => e.target.style.borderColor = G.border2}
                />
              </div>
              <button onClick={() => setSent(true)} style={{
                padding: "16px 40px", background: G.accent, color: "#fff",
                border: "none", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              }}>Send It →</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.14em", color: G.textMute, textTransform: "uppercase", marginBottom: 16 }}>Direct Lines</div>
            {[
              ["Email", "hello@supercool.com", G.accent],
              ["New Business", "biz@supercool.com", G.lime],
              ["Press", "press@supercool.com", G.cyan],
            ].map(([label, email, color]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: G.textMute, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
                <div style={{ fontSize: 13, color, fontFamily: "'JetBrains Mono', monospace" }}>{email}</div>
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.14em", color: G.textMute, textTransform: "uppercase", marginBottom: 16 }}>Project Availability</div>
            <Pill icon="🟢" label="Q3 2025" value="Open" />
            <Pill icon="🟡" label="Q4 2025" value="2 Slots" />
            <Pill icon="🔴" label="Q1 2026" value="Waitlist" />
            <p style={{ fontSize: 12, color: G.textMute, lineHeight: 1.65, marginTop: 16 }}>We cap our intake to maintain quality. Apply early to secure a slot.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function SupercoolMicrosite() {
  const [activePage, setActivePage] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const topRef = useRef(null);

  const goTo = (id) => {
    setActivePage(id);
    setMenuOpen(false);
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = {
    about:    <PageAbout goTo={goTo} />,
    work:     <PageWork />,
    studio:   <PageStudio />,
    clients:  <PageClients />,
    services: <PageServices />,
    contact:  <PageContact />,
  };

  const activeLabel = NAV.find(n => n.id === activePage)?.label;

  return (
    <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: G.text, background: G.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0A; }
        ::selection { background: rgba(255,59,0,0.35); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #FF3B00; }
        button { font-family: 'Instrument Serif', Georgia, serif; }
        input, textarea { font-family: 'Instrument Serif', Georgia, serif; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-btn { display: flex !important; }
        }
        @media (min-width: 641px) {
          .mobile-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      {/* Top nav */}
      <div ref={topRef} style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${G.border}`, height: G.navH,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center", gap: 16 }}>
          {/* Logo */}
          <div style={{ flexShrink: 0, cursor: "pointer" }} onClick={() => goTo("about")}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.06em", lineHeight: 1, color: G.text }}>
              SUPER<span style={{ color: G.accent }}>COOL</span>
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", color: G.textMute, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.2 }}>Creative Studio</div>
          </div>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: "flex", flex: 1, justifyContent: "center", gap: 4 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => goTo(n.id)} style={{
                padding: "6px 14px", border: "none",
                background: activePage === n.id ? G.accentDim : "transparent",
                color: activePage === n.id ? G.accent : G.textMute,
                fontSize: 11, fontWeight: 600, cursor: "pointer", letterSpacing: "0.1em",
                textTransform: "uppercase", transition: "all 0.12s",
                fontFamily: "'JetBrains Mono', monospace",
                outline: activePage === n.id ? `1px solid rgba(255,59,0,0.3)` : "none",
              }}>{n.label}</button>
            ))}
          </nav>

          {/* CTA */}
          <button onClick={() => goTo("contact")} className="desktop-nav" style={{
            padding: "8px 20px", background: G.accent, color: "#fff",
            border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            display: "block",
          }}>Hire Us</button>

          {/* Mobile */}
          <button className="mobile-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            marginLeft: "auto", background: "none", border: `1px solid ${G.border2}`,
            padding: "7px 14px", cursor: "pointer", fontSize: 11,
            fontWeight: 700, color: G.text, display: "none", alignItems: "center",
            gap: 6, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace",
          }}>{menuOpen ? "CLOSE" : "MENU"}</button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position: "fixed", top: G.navH, left: 0, right: 0, zIndex: 99,
          background: "#0D0D0D", borderBottom: `1px solid ${G.border}`, padding: 16,
        }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => goTo(n.id)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "14px 12px", border: "none",
              background: activePage === n.id ? G.accentDim : "transparent",
              color: activePage === n.id ? G.accent : G.text,
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2,
              fontFamily: "'JetBrains Mono', monospace",
            }}>{n.label}</button>
          ))}
        </div>
      )}

      {/* Marquee */}
      <Marquee items={["Brand Identity", "Web Design", "Campaigns", "Product Design", "Motion", "Strategy", "Supercool.com", "Est. 2019", "SF + Remote"]} />

      {/* Main content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "52px 24px 100px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 10, color: G.textMute, marginBottom: 36, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ cursor: "pointer", color: G.textMute }} onClick={() => goTo("about")}>Supercool</span>
          {activePage !== "about" && <>
            <span style={{ color: G.border2 }}>/</span>
            <span style={{ color: G.accent }}>{activeLabel}</span>
          </>}
        </div>

        {pages[activePage]}

        {/* Prev / Next */}
        <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 36, marginTop: 64, display: "flex", justifyContent: "space-between", gap: 16 }}>
          {(() => {
            const idx = NAV.findIndex(n => n.id === activePage);
            const prev = idx > 0 ? NAV[idx - 1] : null;
            const next = idx < NAV.length - 1 ? NAV[idx + 1] : null;
            return (
              <>
                {prev ? (
                  <button onClick={() => goTo(prev.id)} style={{
                    padding: "10px 20px", background: "transparent",
                    border: `1px solid ${G.border2}`, color: G.textSoft,
                    fontSize: 10, fontWeight: 700, cursor: "pointer",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>← {prev.label}</button>
                ) : <div />}
                {next && (
                  <button onClick={() => goTo(next.id)} style={{
                    padding: "10px 20px", background: G.accent, color: "#fff",
                    border: "none", fontSize: 10, fontWeight: 700, cursor: "pointer",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{next.label} →</button>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${G.border}`, background: G.surface }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.06em", color: G.textMute }}>
            SUPER<span style={{ color: G.accent }}>COOL</span>
          </div>
          <div style={{ fontSize: 10, color: G.textMute, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
            © 2025 Supercool LLC · San Francisco, CA · All rights reserved
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Instagram", "Twitter", "LinkedIn"].map(s => (
              <span key={s} style={{ fontSize: 10, color: G.textMute, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", transition: "color 0.15s" }}
                onMouseEnter={e => e.target.style.color = G.accent}
                onMouseLeave={e => e.target.style.color = G.textMute}
              >{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
