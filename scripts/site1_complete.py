from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Flowable

# ═══ PALETTE ══════════════════════════════════════════════════════════════════
INK      = colors.HexColor("#0f0e0d")
ACCENT   = colors.HexColor("#e8541a")
ACCENT2  = colors.HexColor("#f7a349")
LIGHT    = colors.HexColor("#faf8f4")
MID      = colors.HexColor("#f3ede4")
BORDER   = colors.HexColor("#e8e4dc")
MUTED    = colors.HexColor("#6a6560")
WHITE    = colors.white
CODE_BG  = colors.HexColor("#1e1e2e")
CODE_FG  = colors.HexColor("#cdd6f4")
WARN_BG  = colors.HexColor("#fff7ed")
WARN_FG  = colors.HexColor("#c2460a")
OK_BG    = colors.HexColor("#f0fdf4")
OK_FG    = colors.HexColor("#166534")
BLUE_BG  = colors.HexColor("#eff6ff")
BLUE_FG  = colors.HexColor("#1e40af")

W = letter[0] - 1.5*inch

# ═══ STYLE HELPERS ════════════════════════════════════════════════════════════
def S(name, **kw):
    return ParagraphStyle(name, **kw)

# Text styles
cov_h  = S("cov_h",  fontSize=44, leading=50, textColor=WHITE,   fontName="Helvetica-Bold")
cov_s  = S("cov_s",  fontSize=15, leading=22, textColor=ACCENT2, fontName="Helvetica")
cov_m  = S("cov_m",  fontSize=10, leading=15, textColor=colors.HexColor("#b8b3aa"), fontName="Helvetica")
h1     = S("h1",     fontSize=18, leading=24, textColor=ACCENT,  fontName="Helvetica-Bold",  spaceBefore=14, spaceAfter=5)
h2     = S("h2",     fontSize=13, leading=18, textColor=INK,     fontName="Helvetica-Bold",  spaceBefore=12, spaceAfter=4)
h3     = S("h3",     fontSize=11, leading=15, textColor=INK,     fontName="Helvetica-Bold",  spaceBefore=8,  spaceAfter=3)
body   = S("body",   fontSize=9.5,leading=15, textColor=INK,     fontName="Helvetica",       spaceBefore=2,  spaceAfter=3)
bm     = S("bm",     fontSize=9,  leading=14, textColor=MUTED,   fontName="Helvetica",       spaceBefore=2,  spaceAfter=2)
bul    = S("bul",    fontSize=9.5,leading=14, textColor=INK,     fontName="Helvetica",       leftIndent=14,  firstLineIndent=-10, spaceBefore=2, spaceAfter=2)
cod    = S("cod",    fontSize=8.5,leading=14, textColor=CODE_FG, fontName="Courier",         spaceBefore=0,  spaceAfter=0)
cod_lbl= S("cod_lbl",fontSize=8,  leading=11, textColor=ACCENT2, fontName="Helvetica-Bold",  spaceBefore=6,  spaceAfter=1)
sm     = S("sm",     fontSize=8.5,leading=12, textColor=MUTED,   fontName="Helvetica")
warn   = S("warn",   fontSize=9.5,leading=14, textColor=WARN_FG, fontName="Helvetica-Bold")

def sp(h=8):  return Spacer(1, h)
def rule(c=BORDER, t=0.75): return HRFlowable(width="100%", thickness=t, color=c, spaceAfter=5, spaceBefore=5)
def bp(txt):  return Paragraph(f"• {txt}", bul)

# ═══ TABLE BUILDERS ═══════════════════════════════════════════════════════════
def tbl(rows, headers=None, cw=None, hdr_bg=INK):
    if cw is None:
        n = len((headers or rows)[0])
        cw = [W/n]*n
    data = ([headers] if headers else []) + rows
    t = Table(data, colWidths=cw, repeatRows=(1 if headers else 0))
    st = [
        ("FONTSIZE",      (0,0),(-1,-1), 9),
        ("LEADING",       (0,0),(-1,-1), 13),
        ("LEFTPADDING",   (0,0),(-1,-1), 7),
        ("RIGHTPADDING",  (0,0),(-1,-1), 7),
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5),
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
        ("FONTNAME",      (0,0),(-1,-1), "Helvetica"),
        ("GRID",          (0,0),(-1,-1), 0.5, BORDER),
        ("ROWBACKGROUNDS",(0,1 if headers else 0),(-1,-1), [WHITE, LIGHT]),
    ]
    if headers:
        st += [
            ("BACKGROUND", (0,0),(-1,0), hdr_bg),
            ("TEXTCOLOR",  (0,0),(-1,0), WHITE),
            ("FONTNAME",   (0,0),(-1,0), "Helvetica-Bold"),
        ]
    t.setStyle(TableStyle(st))
    return t

def callout(title, body_text, accent=ACCENT, bg=MID):
    data = [
        [Paragraph(title, S("ct", fontSize=10, leading=14, fontName="Helvetica-Bold", textColor=accent))],
        [Paragraph(body_text, S("cb", fontSize=9.5, leading=14, fontName="Helvetica", textColor=INK))]
    ]
    t = Table(data, colWidths=[W-4])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), bg),
        ("LEFTPADDING",  (0,0),(-1,-1), 14),
        ("RIGHTPADDING", (0,0),(-1,-1), 14),
        ("TOPPADDING",   (0,0),(0,0),   10),
        ("TOPPADDING",   (0,1),(-1,-1), 4),
        ("BOTTOMPADDING",(0,-1),(-1,-1),10),
        ("BOTTOMPADDING",(0,0),(-1,-2), 3),
        ("LINEBEFORE",   (0,0),(0,-1),  3, accent),
    ]))
    return t

def code_block(code_str, label=""):
    rows = [[Paragraph(label, cod_lbl)]] if label else []
    rows.append([Paragraph(code_str.replace("\n","<br/>").replace("  ","&nbsp;&nbsp;").replace("\t","&nbsp;&nbsp;&nbsp;&nbsp;"), cod)])
    t = Table(rows, colWidths=[W-4])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), CODE_BG),
        ("LEFTPADDING",  (0,0),(-1,-1), 14),
        ("RIGHTPADDING", (0,0),(-1,-1), 14),
        ("TOPPADDING",   (0,0),(0,0),   10 if label else 10),
        ("BOTTOMPADDING",(0,-1),(-1,-1),10),
        ("TOPPADDING",   (0,1),(-1,-1), 2) if label else ("TOPPADDING",(0,0),(-1,-1),10),
    ]))
    return t

def section_banner(title, sub=""):
    data = [[
        Paragraph(f'<font color="white"><b>{title}</b></font>',
                  S("sb", fontSize=14, leading=18, fontName="Helvetica-Bold", textColor=WHITE)),
        Paragraph(f'<font color="#f7a349">{sub}</font>',
                  S("ss", fontSize=9, leading=13, fontName="Helvetica", textColor=ACCENT2, alignment=TA_RIGHT))
    ]]
    t = Table(data, colWidths=[W*0.72, W*0.28])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), INK),
        ("LEFTPADDING",  (0,0),(-1,-1), 14),
        ("RIGHTPADDING", (0,0),(-1,-1), 14),
        ("TOPPADDING",   (0,0),(-1,-1), 11),
        ("BOTTOMPADDING",(0,0),(-1,-1), 11),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
        ("ROUNDEDCORNERS",[4]),
    ]))
    return t

def sub_banner(title, accent=ACCENT):
    data = [[Paragraph(f'<font color="white"><b>{title}</b></font>',
                       S("sub", fontSize=10, leading=14, fontName="Helvetica-Bold", textColor=WHITE))]]
    t = Table(data, colWidths=[W])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), accent),
        ("LEFTPADDING",  (0,0),(-1,-1), 12),
        ("TOPPADDING",   (0,0),(-1,-1), 7),
        ("BOTTOMPADDING",(0,0),(-1,-1), 7),
    ]))
    return t

def note(text, kind="info"):
    bg  = {"info":BLUE_BG, "warn":WARN_BG, "ok":OK_BG}[kind]
    fg  = {"info":BLUE_FG, "warn":WARN_FG, "ok":OK_FG}[kind]
    pfx = {"info":"ℹ️  ", "warn":"⚠️  ", "ok":"✅  "}[kind]
    data = [[Paragraph(pfx + text, S("nt", fontSize=9.5, leading=14, fontName="Helvetica", textColor=fg))]]
    t = Table(data, colWidths=[W-4])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), bg),
        ("LEFTPADDING",  (0,0),(-1,-1), 12),
        ("RIGHTPADDING", (0,0),(-1,-1), 12),
        ("TOPPADDING",   (0,0),(-1,-1), 8),
        ("BOTTOMPADDING",(0,0),(-1,-1), 8),
        ("BOX",          (0,0),(-1,-1), 0.5, colors.HexColor("#cbd5e1")),
    ]))
    return t

# ═══════════════════════════════════════════════════════════════════════════════
story = []

# ─────────────────────────────────────────────────────────────────────────────
# COVER
# ─────────────────────────────────────────────────────────────────────────────
cover = Table([
    [Paragraph("Site 1 of 10", S("ey", fontSize=11, leading=14, textColor=ACCENT2, fontName="Helvetica-Bold"))],
    [Paragraph("No-Code Platform<br/>Reviews", cov_h)],
    [Paragraph("Complete Autonomous Site Build Specification", cov_s)],
    [sp(6)],
    [Paragraph("Every page · Every database table · Every automation · Every API call · Every webhook ·<br/>Every interactive tool · Full Lovable prompt · n8n workflows · Supabase schema · SEO config",
               S("cm2", fontSize=9.5, leading=15, textColor=colors.HexColor("#9a9590"), fontName="Helvetica"))],
    [sp(20)],
    [Paragraph("Prepared May 2026  ·  Confidential", cov_m)],
], colWidths=[W])
cover.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), INK),
    ("LEFTPADDING",  (0,0),(-1,-1), 36),
    ("RIGHTPADDING", (0,0),(-1,-1), 36),
    ("TOPPADDING",   (0,0),(0,0),   44),
    ("BOTTOMPADDING",(0,-1),(-1,-1),36),
    ("TOPPADDING",   (0,1),(-1,-1), 8),
    ("BOTTOMPADDING",(0,0),(-1,-2), 4),
    ("ROUNDEDCORNERS",[6]),
]))
story.append(cover)
story.append(sp(18))

stats = Table([
    ["12","8","4/day","6","3"],
    ["site pages","database tables","articles/day","agent systems","revenue streams"]
], colWidths=[W/5]*5)
stats.setStyle(TableStyle([
    ("FONTNAME",     (0,0),(-1,0), "Helvetica-Bold"),
    ("FONTSIZE",     (0,0),(-1,0), 20),
    ("TEXTCOLOR",    (0,0),(-1,0), ACCENT),
    ("FONTNAME",     (0,1),(-1,1), "Helvetica"),
    ("FONTSIZE",     (0,1),(-1,1), 9),
    ("TEXTCOLOR",    (0,1),(-1,1), MUTED),
    ("ALIGN",        (0,0),(-1,-1),"CENTER"),
    ("TOPPADDING",   (0,0),(-1,-1), 6),
    ("BOTTOMPADDING",(0,0),(-1,-1), 6),
    ("LINEABOVE",    (0,0),(-1,0),  1.5, ACCENT),
    ("LINEBELOW",    (0,1),(-1,1),  0.75, BORDER),
]))
story.append(stats)
story.append(sp(20))

# Intro
story.append(Paragraph("What this document contains", h1))
story.append(rule(ACCENT, 1.5))
story.append(Paragraph(
    "This is the complete build specification for the anchor site of the No-Code Empire network. "
    "It covers every single thing required to build, launch, and run the site autonomously — "
    "from the first Lovable prompt through to the n8n automation workflows, Supabase schema SQL, "
    "API integrations, webhook contracts, SEO configuration, and monetisation setup. "
    "A developer, an AI agent, or a no-code builder following this document should be able to "
    "produce a fully operational site with zero ambiguity.", body))
story.append(sp(8))
story.append(callout(
    "Build order within this document",
    "Follow sections in order: (1) Set up Supabase database first. (2) Paste the Lovable prompt. "
    "(3) Connect Supabase to Lovable. (4) Configure environment variables. (5) Set up n8n workflows. "
    "(6) Configure Resend email. (7) Connect affiliate programs. (8) Configure SEO. (9) Go live."
))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# TABLE OF CONTENTS
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("Contents", h1))
story.append(rule(ACCENT, 1.5))

toc_items = [
    ("1", "Site Overview & Strategy",         "Purpose, audience, positioning, domain strategy"),
    ("2", "Design System",                    "Colours, typography, spacing, component spec"),
    ("3", "Full Site Architecture",           "All 12 pages, URL structure, navigation"),
    ("4", "Supabase Database Schema",         "Every table, column, type, index, and RLS policy"),
    ("5", "Complete Lovable Build Prompt",    "Full prompt to paste into Lovable Agent Mode"),
    ("6", "Lovable Follow-Up Prompts",        "10 refinement prompts for post-build polish"),
    ("7", "Environment Variables",            "Every env var required, where to get each value"),
    ("8", "API Integrations",                 "Gemini, Resend, Google APIs, IndexNow — full specs"),
    ("9", "Webhook Contracts",                "Every endpoint: method, payload, auth, response"),
    ("10","n8n Automation Workflows",         "All 6 workflows with full node configurations"),
    ("11","Content Generation System",        "Gemini prompts, quality gateway, publishing pipeline"),
    ("12","Interactive Tools Specification",  "4 tools: inputs, logic, outputs, API calls"),
    ("13","SEO Configuration",                "Meta tags, schema markup, sitemap, IndexNow"),
    ("14","Email System",                     "Resend setup, all email templates, sequences"),
    ("15","Affiliate Program Setup",          "Programs, links, tracking, disclosure"),
    ("16","Admin Dashboard Specification",    "Every section, every data view, every action"),
    ("17","Monetisation Configuration",       "Sponsored slots, ad networks, pricing tiers"),
    ("18","Performance & Security",           "Caching, rate limits, auth, GDPR compliance"),
    ("19","Launch Checklist",                 "Pre-launch, launch day, post-launch actions"),
    ("20","Ongoing Operations",               "Weekly, monthly tasks — what the swarm handles vs you"),
]

for num, title, sub in toc_items:
    row = Table([[
        Paragraph(f"<b>{num}.</b>", S("tn", fontSize=10, leading=14, fontName="Helvetica-Bold", textColor=ACCENT)),
        Paragraph(title, S("tt", fontSize=10, leading=14, fontName="Helvetica-Bold", textColor=INK)),
        Paragraph(sub, S("ts", fontSize=9, leading=13, fontName="Helvetica", textColor=MUTED)),
    ]], colWidths=[W*0.06, W*0.32, W*0.62])
    row.setStyle(TableStyle([
        ("VALIGN",       (0,0),(-1,-1),"MIDDLE"),
        ("LEFTPADDING",  (0,0),(-1,-1),2),
        ("RIGHTPADDING", (0,0),(-1,-1),2),
        ("TOPPADDING",   (0,0),(-1,-1),6),
        ("BOTTOMPADDING",(0,0),(-1,-1),6),
        ("LINEBELOW",    (0,0),(-1,-1),0.5,BORDER),
    ]))
    story.append(row)

story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 1 — OVERVIEW
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("1. Site Overview & Strategy", "Anchor Site"))
story.append(sp(10))

story.append(tbl([
    ["Site name",        "No-Code Reviews (placeholder — choose final brand name)"],
    ["Domain strategy",  "Target: nocode-reviews.com / nocodereviews.io / bestnocodetools.com"],
    ["Purpose",          "The authoritative comparison hub for no-code building platforms. Primary affiliate revenue engine. Anchor of 10-site network."],
    ["Position",         "Honest, in-depth reviews with real ratings — not sponsored content disguised as reviews. Editorial independence is the brand."],
    ["Differentiator",   "Autonomous daily content at scale + genuinely useful interactive tools. Competitors publish 4–8 articles/month manually. This site publishes 120/month."],
    ["Network role",     "All 9 companion sites link back to this as the primary platform reference. It is the highest-authority domain in the network."],
    ["Monetisation",     "Affiliate links (primary), sponsored listings (3 slots), newsletter sponsorships, display ads (Mediavine at 50k sessions)"],
    ["Content volume",   "4 articles/day automated = 120/month = 1,440 in year one. Types: tool reviews, comparisons, tutorials, best-of lists."],
    ["Launch state",     "8 tools currently listed. Target: 50 tools within 60 days of launch. 200+ by month 6."],
], cw=[W*0.22, W*0.78]))
story.append(sp(10))

story.append(Paragraph("Target audience segments", h2))
story.append(tbl([
    ["First-time builders",    "Entrepreneurs and small business owners choosing a platform for the first time. High research intent. Will read 3–5 reviews before deciding. Highest affiliate conversion rate."],
    ["Platform switchers",     "Existing no-code users frustrated with their current tool. Read comparison content heavily. Searching 'X alternatives' and 'X vs Y'."],
    ["Agency owners",          "Evaluating tools for client work. Higher budget. Will click affiliate links for agency-plan pricing. Feeds companion Site 6."],
    ["Developer evaluators",   "Technical people considering no-code for speed/prototyping. High quality bar for content. Will catch errors. Trusted reviewers."],
    ["Students/learners",      "Top of funnel. Build email list. Convert to paying affiliate clicks over time via nurture sequence."],
], headers=["Segment","Description"], cw=[W*0.22, W*0.78]))
story.append(sp(10))

story.append(Paragraph("Expired domain strategy", h2))
story.append(body_para := Paragraph(
    "Before building, purchase an expired domain with DR 30+ in the no-code / software / tech space. "
    "This bypasses the Google sandbox (3–6 month new-domain penalty) and can compress ranking timelines "
    "from 6 months to 4–6 weeks. Check: ExpiredDomains.net (free, filter by DR + keyword relevance), "
    "ODYS Global ($2,000–5,000 pre-vetted), or GoDaddy Auctions. Requirements: DR 30+, backlinks from "
    "tech/software sites, no manual penalty history, Moz spam score under 5%, age 3+ years.", body))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 2 — DESIGN SYSTEM
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("2. Design System", "Colours · Typography · Spacing · Components"))
story.append(sp(10))

story.append(Paragraph("Colour palette", h2))
story.append(tbl([
    ["--color-ink",       "#0f0e0d", "Primary text, headings, dark backgrounds"],
    ["--color-ink-2",     "#4a4845", "Secondary text"],
    ["--color-ink-3",     "#9a9590", "Muted/placeholder text"],
    ["--color-cream",     "#faf8f4", "Page background"],
    ["--color-mid",       "#f3ede4", "Card backgrounds, callout boxes"],
    ["--color-border",    "#e8e4dc", "All borders, dividers"],
    ["--color-accent",    "#e8541a", "Primary accent — CTAs, links, highlights"],
    ["--color-accent-2",  "#f7a349", "Secondary accent — badges, warm highlights"],
    ["--color-white",     "#ffffff", "Card backgrounds, modal backgrounds"],
    ["--color-success",   "#166534", "Success states, positive badges"],
    ["--color-success-bg","#f0fdf4", "Success badge backgrounds"],
    ["--color-error",     "#dc2626", "Error states"],
    ["--color-code-bg",   "#1e1e2e", "Code block backgrounds"],
    ["--color-code-fg",   "#cdd6f4", "Code block text"],
], headers=["CSS Variable","Hex","Usage"], cw=[W*0.28, W*0.18, W*0.54]))
story.append(sp(10))

story.append(Paragraph("Typography", h2))
story.append(tbl([
    ["Display / Hero H1",  "Instrument Serif",  "Italic variant", "clamp(32px, 5vw, 52px)", "1.1",  "Hero headings only"],
    ["Section H1",         "DM Sans",           "Bold 700",       "28px",                    "1.2",  "Page-level headings"],
    ["Card/Content H2",    "DM Sans",           "SemiBold 600",   "20px",                    "1.3",  "Section headings"],
    ["H3",                 "DM Sans",           "SemiBold 600",   "16px",                    "1.4",  "Card titles, subsections"],
    ["Body",               "DM Sans",           "Regular 400",    "16px",                    "1.65", "All body copy"],
    ["Small / Caption",    "DM Sans",           "Regular 400",    "13px",                    "1.5",  "Labels, captions, badges"],
    ["Code",               "JetBrains Mono",    "Regular 400",    "13px",                    "1.6",  "Code snippets"],
], headers=["Role","Family","Weight","Size","Line-height","Use"], cw=[W*0.18,W*0.18,W*0.14,W*0.12,W*0.12,W*0.26]))
story.append(sp(6))
story.append(note("Import both fonts from Google Fonts. Instrument Serif: weights 400 italic. DM Sans: weights 400, 500, 600, 700. JetBrains Mono: weight 400.", "info"))
story.append(sp(10))

story.append(Paragraph("Spacing system (8px base)", h2))
story.append(tbl([
    ["--space-1","4px","Tight gaps (badge padding, icon margins)"],
    ["--space-2","8px","Small internal padding"],
    ["--space-3","12px","Button padding vertical, list item gaps"],
    ["--space-4","16px","Card padding, form field gaps"],
    ["--space-5","24px","Section sub-spacing"],
    ["--space-6","32px","Card grid gaps"],
    ["--space-7","48px","Section vertical padding"],
    ["--space-8","64px","Large section breaks"],
    ["--space-9","96px","Hero padding, page-level breathing room"],
], headers=["Variable","Value","Usage"], cw=[W*0.22, W*0.14, W*0.64]))
story.append(sp(10))

story.append(Paragraph("Border radius", h2))
story.append(tbl([
    ["--radius-sm","4px","Badges, chips, small buttons"],
    ["--radius-md","8px","Buttons, input fields"],
    ["--radius-lg","12px","Cards"],
    ["--radius-xl","16px","Modal dialogs, featured cards"],
    ["--radius-full","9999px","Pills, avatar circles"],
], headers=["Variable","Value","Usage"], cw=[W*0.22,W*0.14,W*0.64]))
story.append(sp(10))

story.append(Paragraph("Component specifications", h2))
story.append(tbl([
    ["Tool card",          "White background, 1.5px border (--color-border), --radius-lg, 20px padding. On hover: translateY(-2px), box-shadow 0 8px 24px rgba(0,0,0,0.08). Contains: 40px logo (--radius-md bg), tool name (H3), tagline (small muted), category badges (chips), star rating, affiliate CTA button."],
    ["Comparison card",    "Same as tool card but wider layout. Shows two tool logos side-by-side with 'vs' separator. Winner badge in top-right corner."],
    ["Affiliate CTA button","Background: --color-accent. White text. DM Sans SemiBold 14px. Padding: 10px 20px. --radius-md. Hover: darken 8%. Full width on mobile. Tracks click via /api/log-affiliate-click on click."],
    ["Category chip/badge","Background: --color-mid. DM Sans 11px. Padding: 3px 10px. --radius-full. Text: --color-ink-2."],
    ["Sponsored badge",    "Background: #fff7ed. Text: #c2460a. Border: 1px solid #fcd9b3. 'SPONSORED' label. Top-right corner of card. 10px font, bold, uppercase, letter-spacing 0.08em."],
    ["Star rating",        "5 stars rendered as SVG. Filled: --color-accent-2. Empty: --color-border. Shows numeric rating alongside (e.g. '4.7'). DM Sans 12px."],
    ["Newsletter signup",  "--color-ink background. White headline. Muted subtext. Email input (dark bg #2a2825, white text) + submit button (--color-accent). Full-width on mobile."],
    ["Navigation",         "Sticky top. White bg, 1px border-bottom (--color-border). Logo left. Nav links centre (desktop). CTA button right ('Get free guide' → email signup anchor). Hamburger on mobile."],
], headers=["Component","Specification"], cw=[W*0.20, W*0.80]))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 3 — SITE ARCHITECTURE
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("3. Full Site Architecture", "12 pages · URL structure · Navigation"))
story.append(sp(10))

story.append(Paragraph("Page inventory & URL structure", h2))
story.append(tbl([
    ["/",                                 "Homepage",                   "Static + dynamic (tool grid from DB, latest articles from DB)"],
    ["/tools",                            "All Tools Index",            "Paginated tool grid, filter by category, sort by rating/price/new"],
    ["/tools/[slug]",                     "Tool Review Page",           "Dynamic — generated from tools table"],
    ["/compare/[slug-vs-slug]",           "Comparison Page",            "Dynamic — generated from comparisons table or on-demand"],
    ["/category/[slug]",                  "Category Index",             "Dynamic — filtered tool grid for one category"],
    ["/best/[slug]",                      "Best-Of List Page",          "Dynamic — article from articles table with type='best-of'"],
    ["/blog",                             "Blog / Tutorials Index",     "Paginated article grid, filter by tag"],
    ["/blog/[slug]",                      "Article Page",               "Dynamic — generated from articles table"],
    ["/submit",                           "Submit a Tool",              "Static form — submissions stored in tool_submissions table"],
    ["/advertise",                        "Sponsored Listings Info",    "Static page with live slot availability from sponsored_slots table"],
    ["/newsletter",                       "Newsletter Archive",         "Dynamic — grid of all past newsletter issues"],
    ["/about",                            "About & Methodology",        "Static — editorial policy, affiliate disclosure, team"],
    ["/admin",                            "Admin Dashboard",            "Protected — Supabase Auth required"],
    ["/admin/*",                          "Admin sub-pages",            "Protected — all routes under /admin require auth"],
], headers=["URL","Page Name","Type & Notes"], cw=[W*0.30, W*0.25, W*0.45]))
story.append(sp(10))

story.append(Paragraph("Navigation structure", h2))
story.append(tbl([
    ["Primary nav (desktop)", "Logo | Tools | Compare | Categories ▾ | Blog | Submit a Tool || [Get Free Guide CTA]"],
    ["Categories dropdown",   "Website Builders / App Builders / Ecommerce / Automation / Database / AI Tools / Form Builders / No-Code CMS"],
    ["Footer col 1",          "Site logo + tagline + social links (Twitter/X, LinkedIn, YouTube)"],
    ["Footer col 2",          "Top Tools: [6 most-visited tools, dynamic from DB]"],
    ["Footer col 3",          "Popular Comparisons: [6 most-visited comparisons, dynamic]"],
    ["Footer col 4",          "Company: About · Methodology · Advertise · Submit a Tool · Privacy Policy · Affiliate Disclosure"],
    ["Mobile nav",            "Hamburger → full-screen overlay. Same links as desktop. Email signup at bottom of overlay."],
    ["Breadcrumbs",           "All tool, comparison, category, and article pages. Schema: Home > Category > Page Name. JSON-LD BreadcrumbList markup."],
], cw=[W*0.25, W*0.75]))
story.append(sp(10))

story.append(Paragraph("Homepage section layout (top to bottom)", h2))
story.append(tbl([
    ["1. Hero",                 "Dark background (--color-ink). Serif italic headline. Subheadline. Search bar (searches tools). Stats strip: [N]+ tools reviewed · [N]k monthly readers · Free forever."],
    ["2. Featured comparison",  "Horizontal card — 'Most compared this week' — pulled from DB by comparison_views. Links to compare page."],
    ["3. Category filter tabs", "8 category tabs. All | Website Builders | App Builders | Ecommerce | Automation | Database | AI Tools | Forms. Clicking filters the tool grid below without page reload."],
    ["4. Tool grid",            "12 cards per page. Default sorted by rating DESC. Load more button (fetches next 12 from Supabase). Sponsored card always in position 1 or 4 if active sponsored slot exists."],
    ["5. Trending comparisons", "Horizontal scroll strip. 6 comparison cards. Pulled from comparisons table ordered by views DESC."],
    ["6. Email signup",         "Full-width dark section. 'Get the weekly no-code digest' headline. Email input. Stores to subscribers table via POST /api/add-subscriber."],
    ["7. Latest articles",      "3-column grid of most recent articles. Pulled from articles table WHERE status='published' ORDER BY published_at DESC LIMIT 6."],
    ["8. Footer",               "4-column grid as spec'd above."],
], headers=["Section","Content"], cw=[W*0.22, W*0.78]))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 4 — DATABASE SCHEMA
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("4. Supabase Database Schema", "Every table · column · type · index · RLS policy"))
story.append(sp(10))
story.append(note("Create all tables in this exact order to satisfy foreign key dependencies. Run each SQL block in Supabase SQL Editor.", "warn"))
story.append(sp(8))

# tools table
story.append(Paragraph("Table: tools", h2))
story.append(code_block("""CREATE TABLE tools (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  tagline             TEXT,
  logo_url            TEXT,
  website_url         TEXT,
  affiliate_url       TEXT,
  category            TEXT[] NOT NULL DEFAULT '{}',
  rating_overall      NUMERIC(3,1) CHECK (rating_overall BETWEEN 1 AND 5),
  rating_ease         NUMERIC(3,1) CHECK (rating_ease BETWEEN 1 AND 5),
  rating_features     NUMERIC(3,1) CHECK (rating_features BETWEEN 1 AND 5),
  rating_pricing      NUMERIC(3,1) CHECK (rating_pricing BETWEEN 1 AND 5),
  rating_support      NUMERIC(3,1) CHECK (rating_support BETWEEN 1 AND 5),
  verdict             TEXT,
  review_body         TEXT,
  pros                TEXT[] DEFAULT '{}',
  cons                TEXT[] DEFAULT '{}',
  pricing_tiers       JSONB DEFAULT '[]',
  best_for            TEXT[] DEFAULT '{}',
  featured            BOOLEAN DEFAULT false,
  sponsored           BOOLEAN DEFAULT false,
  sponsored_until     DATE,
  meta_title          TEXT,
  meta_description    TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- pricing_tiers JSONB structure:
-- [{"name":"Free","price_monthly":0,"price_annual":0,"features":["feat1","feat2"]},
--  {"name":"Pro","price_monthly":29,"price_annual":290,"features":["feat1","feat2","feat3"]}]

CREATE INDEX idx_tools_slug       ON tools(slug);
CREATE INDEX idx_tools_category   ON tools USING GIN(category);
CREATE INDEX idx_tools_featured   ON tools(featured) WHERE featured = true;
CREATE INDEX idx_tools_sponsored  ON tools(sponsored, sponsored_until);
CREATE INDEX idx_tools_rating     ON tools(rating_overall DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON tools FOR SELECT USING (true);
CREATE POLICY "Admin write" ON tools FOR ALL USING (auth.role() = 'authenticated');""", "SQL — tools table"))
story.append(sp(8))

# articles table
story.append(Paragraph("Table: articles", h2))
story.append(code_block("""CREATE TABLE articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  body             TEXT NOT NULL,
  excerpt          TEXT,
  article_type     TEXT CHECK (article_type IN
                     ('review','comparison','tutorial','best-of','guide','news')),
  category         TEXT,
  tags             TEXT[] DEFAULT '{}',
  seo_title        TEXT,
  seo_description  TEXT,
  featured_image_url TEXT,
  author           TEXT DEFAULT 'Editorial Team',
  word_count       INTEGER,
  reading_time_mins INTEGER GENERATED ALWAYS AS (GREATEST(1, word_count / 200)) STORED,
  status           TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at     TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ DEFAULT now(),
  view_count       INTEGER DEFAULT 0,
  featured         BOOLEAN DEFAULT false
);

CREATE INDEX idx_articles_slug       ON articles(slug);
CREATE INDEX idx_articles_status     ON articles(status, published_at DESC);
CREATE INDEX idx_articles_category   ON articles(category);
CREATE INDEX idx_articles_tags       ON articles USING GIN(tags);
CREATE INDEX idx_articles_type       ON articles(article_type);

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published"
  ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Admin all"
  ON articles FOR ALL USING (auth.role() = 'authenticated');""", "SQL — articles table"))
story.append(sp(8))

# comparisons table
story.append(Paragraph("Table: comparisons", h2))
story.append(code_block("""CREATE TABLE comparisons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  tool_ids        UUID[] NOT NULL,
  body            TEXT,
  winner_overall  UUID REFERENCES tools(id),
  seo_title       TEXT,
  seo_description TEXT,
  view_count      INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comparisons_slug    ON comparisons(slug);
CREATE INDEX idx_comparisons_tools   ON comparisons USING GIN(tool_ids);
CREATE INDEX idx_comparisons_views   ON comparisons(view_count DESC);

CREATE TRIGGER comparisons_updated_at
  BEFORE UPDATE ON comparisons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published"
  ON comparisons FOR SELECT USING (status = 'published');
CREATE POLICY "Admin all"
  ON comparisons FOR ALL USING (auth.role() = 'authenticated');""", "SQL — comparisons table"))
story.append(sp(8))

# subscribers
story.append(Paragraph("Table: subscribers", h2))
story.append(code_block("""CREATE TABLE subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  confirmed       BOOLEAN DEFAULT false,
  confirm_token   TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  subscribed_at   TIMESTAMPTZ DEFAULT now(),
  confirmed_at    TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  active          BOOLEAN DEFAULT false,
  source          TEXT,
  tags            TEXT[] DEFAULT '{}'
);

CREATE INDEX idx_subscribers_email  ON subscribers(email);
CREATE INDEX idx_subscribers_active ON subscribers(active) WHERE active = true;

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public read" ON subscribers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Insert allowed"  ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all"       ON subscribers FOR ALL USING (auth.role() = 'authenticated');""", "SQL — subscribers table"))
story.append(sp(8))

# affiliate_clicks
story.append(Paragraph("Table: affiliate_clicks", h2))
story.append(code_block("""CREATE TABLE affiliate_clicks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id    UUID REFERENCES tools(id) ON DELETE SET NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  page_url   TEXT,
  clicked_at TIMESTAMPTZ DEFAULT now(),
  user_agent TEXT,
  referrer   TEXT
);

CREATE INDEX idx_affiliate_clicks_tool    ON affiliate_clicks(tool_id, clicked_at DESC);
CREATE INDEX idx_affiliate_clicks_article ON affiliate_clicks(article_id, clicked_at DESC);
CREATE INDEX idx_affiliate_clicks_date    ON affiliate_clicks(clicked_at DESC);

ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert only"  ON affiliate_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read"   ON affiliate_clicks FOR SELECT USING (auth.role() = 'authenticated');""", "SQL — affiliate_clicks table"))
story.append(sp(8))

# sponsored_slots
story.append(Paragraph("Table: sponsored_slots", h2))
story.append(code_block("""CREATE TABLE sponsored_slots (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id        UUID REFERENCES tools(id),
  slot_name      TEXT NOT NULL,
  slot_position  TEXT CHECK (slot_position IN ('homepage-1','homepage-4','category-top','sidebar','newsletter')),
  start_date     DATE NOT NULL,
  end_date       DATE NOT NULL,
  monthly_fee    NUMERIC(10,2),
  contact_name   TEXT,
  contact_email  TEXT,
  active         BOOLEAN DEFAULT true,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sponsored_active ON sponsored_slots(active, end_date);

ALTER TABLE sponsored_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active"
  ON sponsored_slots FOR SELECT USING (active = true AND end_date >= CURRENT_DATE);
CREATE POLICY "Admin all"
  ON sponsored_slots FOR ALL USING (auth.role() = 'authenticated');""", "SQL — sponsored_slots table"))
story.append(sp(8))

# newsletter_issues
story.append(Paragraph("Table: newsletter_issues", h2))
story.append(code_block("""CREATE TABLE newsletter_issues (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_number     INTEGER UNIQUE NOT NULL,
  subject          TEXT NOT NULL,
  preview_text     TEXT,
  body_html        TEXT NOT NULL,
  sent_at          TIMESTAMPTZ,
  subscriber_count INTEGER,
  open_rate        NUMERIC(5,2),
  click_rate       NUMERIC(5,2)
);

CREATE INDEX idx_newsletter_number ON newsletter_issues(issue_number DESC);

ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sent"
  ON newsletter_issues FOR SELECT USING (sent_at IS NOT NULL);
CREATE POLICY "Admin all"
  ON newsletter_issues FOR ALL USING (auth.role() = 'authenticated');""", "SQL — newsletter_issues table"))
story.append(sp(8))

# user_ratings
story.append(Paragraph("Table: user_ratings", h2))
story.append(code_block("""CREATE TABLE user_ratings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id       UUID REFERENCES tools(id) ON DELETE CASCADE,
  rating        INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text   TEXT,
  reviewer_name TEXT,
  submitted_at  TIMESTAMPTZ DEFAULT now(),
  approved      BOOLEAN DEFAULT false
);

CREATE INDEX idx_user_ratings_tool     ON user_ratings(tool_id, approved);
CREATE INDEX idx_user_ratings_approved ON user_ratings(approved, submitted_at DESC);

ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read approved" ON user_ratings FOR SELECT USING (approved = true);
CREATE POLICY "Insert allowed" ON user_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all" ON user_ratings FOR ALL USING (auth.role() = 'authenticated');""", "SQL — user_ratings table"))
story.append(sp(8))

# keyword_queue + link_map
story.append(Paragraph("Tables: keyword_queue and link_map", h2))
story.append(code_block("""CREATE TABLE keyword_queue (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword      TEXT NOT NULL,
  search_volume INTEGER,
  difficulty   INTEGER,
  article_type TEXT CHECK (article_type IN ('review','comparison','tutorial','best-of','guide')),
  priority     INTEGER DEFAULT 5,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending','in-progress','done','skipped')),
  tool_slugs   TEXT[],
  created_at   TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_keyword_queue_status   ON keyword_queue(status, priority DESC);
CREATE INDEX idx_keyword_queue_priority ON keyword_queue(priority DESC) WHERE status = 'pending';

ALTER TABLE keyword_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin all" ON keyword_queue FOR ALL USING (auth.role() = 'authenticated');

-- ───────────────────────────────────────────────

CREATE TABLE link_map (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_article_id UUID REFERENCES articles(id),
  source_site      TEXT DEFAULT 'site-1',
  destination_url  TEXT NOT NULL,
  destination_site TEXT,
  anchor_text      TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_link_map_source ON link_map(source_site, created_at DESC);
CREATE INDEX idx_link_map_dest   ON link_map(destination_site, created_at DESC);

ALTER TABLE link_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin all" ON link_map FOR ALL USING (auth.role() = 'authenticated');""", "SQL — keyword_queue and link_map tables"))
story.append(sp(8))

story.append(Paragraph("Table: tool_submissions", h2))
story.append(code_block("""CREATE TABLE tool_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name       TEXT NOT NULL,
  tool_url        TEXT NOT NULL,
  category        TEXT,
  description     TEXT,
  pricing_info    TEXT,
  affiliate_url   TEXT,
  contact_email   TEXT,
  submitted_at    TIMESTAMPTZ DEFAULT now(),
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected'))
);

ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert allowed" ON tool_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all" ON tool_submissions FOR ALL USING (auth.role() = 'authenticated');""", "SQL — tool_submissions table"))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 5 — MAIN LOVABLE PROMPT
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("5. Complete Lovable Build Prompt", "Paste this into Lovable Agent Mode"))
story.append(sp(10))
story.append(callout(
    "How to use this prompt",
    "1. Open Lovable. 2. Start a new project. 3. Enable Agent Mode. 4. Connect your Supabase project "
    "(Project URL + Anon Key — get from Supabase Dashboard > Settings > API). "
    "5. Copy the entire prompt below and paste it as your first message. "
    "6. Replace [SITE NAME] and [SITE TAGLINE] with your actual brand name before pasting. "
    "Lovable will build the full site. Expect 3–5 minutes for Agent Mode to complete. "
    "Use the follow-up prompts in Section 6 to refine specific areas.",
    accent=ACCENT, bg=WARN_BG
))
story.append(sp(8))

main_prompt = """Build a no-code platform review and comparison website called [SITE NAME].
Tagline: [SITE TAGLINE]

━━━━━━━━━━━━ DESIGN SYSTEM ━━━━━━━━━━━━

Colors (apply as CSS variables in :root):
--color-ink: #0f0e0d
--color-ink-2: #4a4845
--color-ink-3: #9a9590
--color-cream: #faf8f4
--color-mid: #f3ede4
--color-border: #e8e4dc
--color-accent: #e8541a
--color-accent-2: #f7a349
--color-white: #ffffff
--color-code-bg: #1e1e2e

Typography (import from Google Fonts):
- Instrument Serif: 400, 400 italic (hero headings only)
- DM Sans: 400, 500, 600, 700 (all body + UI text)
- JetBrains Mono: 400 (code blocks)

Spacing: 8px base system. Generous white space. Never cramped.
Border radius: cards 12px, buttons 8px, badges 9999px.
Shadows: cards hover only — 0 8px 24px rgba(0,0,0,0.08).
Dark mode: yes, toggle in header, persists to localStorage.

━━━━━━━━━━━━ SUPABASE TABLES (already created) ━━━━━━━━━━━━

Connect to my Supabase project. Tables already exist:
tools, articles, comparisons, subscribers, affiliate_clicks,
sponsored_slots, newsletter_issues, user_ratings,
keyword_queue, link_map, tool_submissions

━━━━━━━━━━━━ PAGE 1: HOMEPAGE (/) ━━━━━━━━━━━━

HERO SECTION:
- Full-width dark background (#0f0e0d)
- Instrument Serif italic headline: "The honest guide to no-code platforms"
- Subheadline (DM Sans regular): "In-depth reviews, real ratings, and side-by-side
  comparisons — so you build on the right platform from day one."
- Search bar: searches tool names and review titles. Fetches from
  tools and articles tables. Shows typeahead results (max 8) as dropdown.
- Stats strip below search: pulls live counts from DB:
  [COUNT(tools)] tools reviewed · [COUNT(subscribers WHERE active=true)]k readers · Free forever

CATEGORY FILTER TABS (below hero):
Tabs: All | Website Builders | App Builders | Ecommerce |
      Automation | Database | AI Tools | Form Builders
Clicking a tab filters the tool grid WITHOUT page reload.
Active tab: accent underline + bold text.
Fetch: SELECT * FROM tools WHERE $category = ANY(category) ORDER BY rating_overall DESC

TOOL GRID:
- 12 cards per page in responsive grid (1 col mobile, 2 tablet, 3 desktop, 4 wide)
- Each card contains:
  * Tool logo (40x40, rounded-lg bg in --color-mid, fallback initials)
  * Tool name (H3, DM Sans 600)
  * Tagline (13px muted)
  * Category badges (chips, max 2 shown)
  * Star rating (5 stars, filled = accent-2 color) + numeric rating
  * "SPONSORED" badge (top-right, orange tint) if sponsored=true AND sponsored_until >= today
  * "Read Review" button (accent color, full width) → /tools/[slug]
  * Affiliate link icon (small external link icon) → affiliate_url, tracked via /api/log-affiliate-click
- Load More button below grid: fetches next 12 via Supabase pagination
- Sponsored slot: if active sponsored_slot exists for 'homepage-1', that tool card
  always renders in position 1 regardless of sort. Same for 'homepage-4' → position 4.

TRENDING COMPARISONS STRIP:
- Heading: "Most compared this week"
- Horizontal scroll on mobile, 3-col grid on desktop
- Fetch: SELECT * FROM comparisons WHERE status='published'
         ORDER BY view_count DESC LIMIT 6
- Each card: both tool logos with "vs" separator, comparison title,
  view count, "Compare" button → /compare/[slug]

EMAIL SIGNUP SECTION:
- Dark background section
- Headline: "Get the weekly no-code digest"
- Subtext: "New tool reviews, comparison breakdowns, and early access to our guides.
  Every Tuesday. Free forever."
- Email input + "Subscribe" button
- On submit: POST /api/add-subscriber with {email, source: "homepage"}
- Success state: "You're in! Check your inbox to confirm."
- Error state: "Something went wrong. Try again." (never show DB errors)

LATEST ARTICLES (below signup):
- 6 cards in 3-col grid (1 mobile, 2 tablet, 3 desktop)
- Fetch: SELECT * FROM articles WHERE status='published'
         ORDER BY published_at DESC LIMIT 6
- Each card: article type badge, title, excerpt (truncate 120 chars),
  category tag, reading time, published date, "Read" link

FOOTER:
4 columns on desktop, stacked on mobile:
Col 1: [SITE NAME] logo + tagline + social links (Twitter/X icon, LinkedIn icon)
Col 2: "Top Tools" — fetch top 6 tools by view count from tools table
Col 3: "Popular Comparisons" — fetch top 6 comparisons by view_count from comparisons table
Col 4: Company links: About · Methodology · Advertise · Submit a Tool · Privacy Policy · Affiliate Disclosure
Bottom bar: "© 2026 [SITE NAME] · All reviews are editorially independent ·
             Some links are affiliate links — see our disclosure"

━━━━━━━━━━━━ PAGE 2: ALL TOOLS (/tools) ━━━━━━━━━━━━

- Same category filter tabs as homepage
- Sort controls: Best Rated | Newest | Price: Low to High | Price: High to Low
- Fetch all tools with filters applied. 12 per page. Pagination.
- Same tool card layout as homepage grid.
- Sidebar (desktop only): filter checkboxes by category, free plan toggle,
  price range slider ($0–$500/month).

━━━━━━━━━━━━ PAGE 3: TOOL REVIEW PAGE (/tools/[slug]) ━━━━━━━━━━━━

Fetch tool by slug. If not found: 404 page.

HERO:
- Tool logo (80x80) + tool name (H1) + tagline
- Overall star rating (large, prominent) + numeric score + "(X reviews)"
- Category badges
- "Visit [Tool Name]" button (accent, large) → affiliate_url
  On click: POST /api/log-affiliate-click with {tool_id, page_url}
- "SPONSORED" label if sponsored

RATING BREAKDOWN (below hero):
5 individual ratings as progress bars:
Ease of Use | Features | Pricing | Support | Overall
Each shows: label, score (e.g. 4.2), filled progress bar (accent-2 color)

TABBED CONTENT (Overview | Pricing | Pros & Cons | Best For | Verdict):
Tab 1 - Overview:
  Full review_body rendered as markdown/rich text.
Tab 2 - Pricing:
  Render pricing_tiers JSONB as a pricing table.
  Each tier: name, monthly price, annual price (show savings %), feature checklist.
  Affiliate CTA button under each tier.
Tab 3 - Pros & Cons:
  Two columns: green checkmarks for pros[], red X for cons[].
Tab 4 - Best For:
  Render best_for[] as tagged badges with brief descriptions.
Tab 5 - Verdict:
  Verdict text + final star rating + prominent affiliate CTA.

STICKY SIDEBAR (desktop, fixed on scroll):
- Tool logo + name
- Overall rating
- "Visit [Tool Name]" affiliate button (prominent, full width)
- Quick specs: Free plan? | Starting price | Category

USER RATINGS SECTION (below tabs):
- Average rating from user_ratings WHERE tool_id = X AND approved = true
- List of approved user reviews (name, rating stars, text, date)
- "Submit your rating" form:
  Star selector (1-5, interactive), review text textarea,
  reviewer name input, submit button
  On submit: INSERT into user_ratings. Show: "Thanks! Your review is pending approval."

RELATED COMPARISONS:
- "Compare [Tool Name] with..." section
- Fetch comparisons WHERE tool_id = ANY(tool_ids) AND status='published' LIMIT 4

RELATED TOOLS (same category):
- 3 tool cards in horizontal row
- Fetch: SELECT * FROM tools WHERE category && $tool_category
         AND id != $tool_id LIMIT 3

SEO (auto-set on this page):
- <title>: {meta_title} OR "{Tool Name} Review 2026 — Is It Worth It? | [SITE NAME]"
- <meta description>: {meta_description} OR excerpt from review_body (160 chars)
- JSON-LD SoftwareApplication schema (see Section 13)
- Canonical: /tools/[slug]
- OG image: tool logo + site name on dark background

━━━━━━━━━━━━ PAGE 4: COMPARISON PAGE (/compare/[slug]) ━━━━━━━━━━━━

Fetch comparison by slug. Fetch both tools from tool_ids array.

HERO:
- Two tool logos side-by-side with large "VS" separator
- Page title: "[Tool A] vs [Tool B] — Full Comparison"
- Winner badge on winning tool logo (if winner_overall is set): "⭐ Winner"
- Subtitle: "Last updated [updated_at date]"

COMPARISON TABLE (full feature matrix):
Rows: Overall Rating | Ease of Use | Features | Pricing | Support |
      Free Plan | Starting Price | Best For | Our Pick
Each row: Tool A value | Row label | Tool B value
Winner cell highlighted in green tint.

PRICING COMPARISON TABLE:
Shows all tiers from both tools' pricing_tiers JSONB.
Columns: Plan Name | Tool A Price | Tool B Price | Key Differences

WRITTEN COMPARISON (body from comparisons.body):
Rendered as rich text with internal H2/H3 headings.
Includes: intro, feature-by-feature breakdown,
pricing analysis, who should choose which, final verdict.

AFFILIATE CTAs:
Both tools get prominent CTA buttons at end of each major section.
Track clicks via /api/log-affiliate-click.

RELATED COMPARISONS:
"Also compare:" — 4 other comparison cards involving either tool.

━━━━━━━━━━━━ PAGE 5: CATEGORY INDEX (/category/[slug]) ━━━━━━━━━━━━

- H1: "Best [Category Name] Tools — Reviewed & Ranked"
- Intro paragraph (2–3 sentences about the category)
- Tool grid: same as /tools but pre-filtered to this category
- Sort: default Best Rated. Controls for other sorts.
- SEO: H1 + intro text optimised for "[category] tools" keyword

━━━━━━━━━━━━ PAGE 6: BEST-OF LIST (/best/[slug]) ━━━━━━━━━━━━

Fetch article by slug WHERE article_type = 'best-of'.

- H1: article title
- Published date + last updated date
- Table of contents (auto-generated from H2 headings in body)
- Body rendered as rich text with numbered list sections
- Each tool mentioned: inline tool card (compact — logo, name, rating, affiliate CTA)
- Email signup CTA in the middle of the article (after item 3)
- "Full Review" link for each tool → /tools/[slug]

━━━━━━━━━━━━ PAGE 7: BLOG INDEX (/blog) ━━━━━━━━━━━━

- Search bar (searches article titles and tags)
- Filter by tag (tag cloud, fetched from all articles.tags)
- Filter by type: All | Reviews | Comparisons | Tutorials | Best-Of Lists
- Article cards grid: 3 cols desktop, 2 tablet, 1 mobile
- Each card: type badge, title, excerpt, tags (max 3), reading time, date
- Pagination: 12 per page

━━━━━━━━━━━━ PAGE 8: ARTICLE PAGE (/blog/[slug]) ━━━━━━━━━━━━

Fetch article by slug WHERE status = 'published'.

- Breadcrumb: Home > Blog > [Article Title]
- Article type badge (Review / Comparison / Tutorial / Best-Of)
- H1: article title
- Meta: author + published date + reading time + word count
- Reading progress bar (thin accent-colored line at top of viewport, fills on scroll)
- Table of contents (auto-generated from H2 headings, sticky on desktop)
- Body rendered as rich text
- Inline tool cards where tool names are mentioned (cross-reference tools table by name)
- Related articles (same category, 3 cards at bottom)
- Social share buttons: Twitter/X | LinkedIn | Copy link (fixed right side on desktop)

━━━━━━━━━━━━ PAGE 9: SUBMIT A TOOL (/submit) ━━━━━━━━━━━━

Form fields:
- Tool Name (text, required)
- Tool URL (url, required)
- Category (multi-select: the 8 categories)
- Short Description (textarea, max 200 chars, required)
- Pricing Info (textarea — describe all tiers)
- Do you have an affiliate program? (Yes/No toggle)
  If Yes: Affiliate URL (url input appears)
- Contact Email (email, required — for follow-up)
- How did you find us? (select: Google / Reddit / Twitter / Friend / Other)
- Submit button

On submit: INSERT into tool_submissions table.
Success: "Thanks! We review new tool submissions weekly.
          We'll email you at [email] if we decide to include it."

━━━━━━━━━━━━ PAGE 10: ADVERTISE (/advertise) ━━━━━━━━━━━━

Static page. Content:
- H1: "Reach [N] no-code builders every month"
- Traffic stats strip: Monthly Readers | Avg Time on Page | Newsletter Subscribers
  (static numbers, update manually every quarter)
- Slot availability: fetch from sponsored_slots table.
  Show 3 slot cards: Homepage Position 1 | Homepage Position 4 | Newsletter Sponsor
  Each card: slot name, description, traffic context, price, "Available" or "Booked until [date]" badge
- Pricing table: 3 tiers based on traffic milestones
- Contact form: Name, Company, Email, Website, Which slot (select), Message
  On submit: email via Resend to admin address

━━━━━━━━━━━━ PAGE 11: NEWSLETTER ARCHIVE (/newsletter) ━━━━━━━━━━━━

Fetch: SELECT * FROM newsletter_issues WHERE sent_at IS NOT NULL
       ORDER BY issue_number DESC

Grid of issue cards:
- Issue number + date
- Subject line (used as title)
- Preview text
- "Read Issue" button → /newsletter/[issue_number] (renders body_html)

━━━━━━━━━━━━ PAGE 12: ABOUT (/about) ━━━━━━━━━━━━

Static content page. Sections:
- Our mission (why honest no-code reviews matter)
- How we review tools (our methodology — 5 criteria explained)
- Editorial independence statement
- Affiliate disclosure (required by FTC — must be on this page AND in footer)
- Contact info

━━━━━━━━━━━━ ADMIN DASHBOARD (/admin) ━━━━━━━━━━━━

Protected by Supabase Auth. Redirect to /admin/login if not authenticated.

Login page (/admin/login):
- Email + password form
- Uses Supabase Auth signInWithPassword()
- On success: redirect to /admin

Dashboard home (/admin):
- Stats cards: Total Tools | Published Articles | Active Subscribers |
  Affiliate Clicks (30d) | Sponsored Revenue (active slots)
- Recent activity feed: last 10 articles published, last 5 subscribers, last 5 affiliate clicks
- Quick actions: "Add Tool" | "Publish Article" | "View Keyword Queue"

Article Management (/admin/articles):
- Table: title | type | status | published_at | word_count | view_count | actions
- Filter by status (draft/published/archived)
- Actions: Edit | Publish/Unpublish | Delete
- "Add Article" button → form with all article fields
- Status toggle updates articles.status in Supabase

Tool Management (/admin/tools):
- Table: logo | name | category | rating | featured | sponsored | updated_at | actions
- Actions: Edit | Toggle Featured | Toggle Sponsored | Delete
- "Add Tool" button → form with all tool fields
- Featured toggle updates tools.featured boolean
- Sponsored toggle + sponsored_until date picker

Keyword Queue (/admin/keywords):
- Table of all keywords with status, priority, article_type
- Filter by status (pending/in-progress/done/skipped)
- "Add Keyword" form
- Bulk actions: mark done, skip, change priority
- "Trigger Generation" button: sends top pending keyword to n8n webhook

Subscriber Management (/admin/subscribers):
- Count of active/pending/unsubscribed
- Table: email | subscribed_at | confirmed | active | source | tags
- Filter by active/pending
- "Export CSV" button: downloads all active subscribers
- Delete individual subscribers

Affiliate Analytics (/admin/analytics):
- Date range picker (default: last 30 days)
- Total clicks chart (line chart, daily)
- Top 10 tools by clicks (bar chart)
- Top 10 articles by clicks (bar chart)
- Click-through table: tool name | clicks | affiliate_url

Sponsored Slots (/admin/sponsored):
- Current slots table: slot | tool | start | end | fee | status
- Add/edit/delete slots
- Renewal alerts: highlight slots expiring within 7 days in yellow

User Ratings (/admin/ratings):
- Table: tool | reviewer | rating | text | submitted_at | approved
- Approve / reject buttons
- Filter: pending only (default view)

Tool Submissions (/admin/submissions):
- Table: tool_name | url | category | submitted_at | status
- Mark as accepted (creates tool draft) / rejected
- Quick view of submission details

━━━━━━━━━━━━ WEBHOOK API ENDPOINTS ━━━━━━━━━━━━

All endpoints require header: X-Webhook-Secret: [env: WEBHOOK_SECRET]
Return 401 if header missing or wrong. Return 200 on success, 400 on validation error.

POST /api/publish-article
Body: {title, slug, body, excerpt, article_type, category, tags[],
       seo_title, seo_description, featured_image_url, author}
Action: INSERT into articles with status='published', published_at=now()
        Update sitemap. Ping IndexNow.

POST /api/add-tool
Body: {name, slug, tagline, logo_url, website_url, affiliate_url,
       category[], verdict, review_body, pros[], cons[], pricing_tiers,
       rating_overall, rating_ease, rating_features, rating_pricing, rating_support}
Action: INSERT into tools table.

POST /api/update-tool
Body: {slug, fields: {field: value, ...}}
Action: UPDATE tools WHERE slug = $slug SET $fields, updated_at = now()

POST /api/add-subscriber
Body: {email, source}
Action: UPSERT into subscribers (ignore if email exists).
        If new: send confirmation email via Resend.
        Return: {status: "added"} or {status: "already_subscribed"}

POST /api/send-newsletter
Body: {subject, preview_text, body_html, issue_number}
Action: Get all subscribers WHERE active=true AND confirmed=true.
        Send via Resend batch. INSERT into newsletter_issues.

POST /api/log-affiliate-click
Body: {tool_id, article_id, page_url, user_agent, referrer}
Action: INSERT into affiliate_clicks. Non-blocking (respond 200 immediately, insert async).

GET /api/keyword-queue
Query params: limit (default 10), type (optional filter)
Action: SELECT from keyword_queue WHERE status='pending' ORDER BY priority DESC LIMIT $limit
Return: JSON array of keyword objects.

POST /api/update-keyword-status
Body: {keyword_id, status}
Action: UPDATE keyword_queue SET status=$status, processed_at=now() WHERE id=$keyword_id

POST /api/add-cross-link
Body: {source_article_id, source_site, destination_url, destination_site, anchor_text}
Action: INSERT into link_map.
        Check: SELECT COUNT(*) FROM link_map WHERE destination_site=$dest
               AND created_at > now() - interval '30 days'
        If count >= 3: return {status: "limit_reached"}, do not insert.

━━━━━━━━━━━━ INTERACTIVE TOOLS (React components) ━━━━━━━━━━━━

TOOL 1 — Platform Comparison Wizard (/tools/quiz):
Multi-step form (10 steps, progress bar at top):
Step 1: "What are you building?" (cards: Website / App / Online Store /
         Automation / Database / Something else)
Step 2: "What's your technical level?" (No coding / Basic HTML / Comfortable with code)
Step 3: "How big is your team?" (Just me / 2-5 people / 6-20 / 20+)
Step 4: "What's your monthly budget for tools?" (Free only / Under $50 / $50-200 / $200+)
Step 5: "Do you need a free plan to start?" (Yes definitely / Prefer free / Paid is fine)
Step 6: "Most important to you?" (Ease of use / Design quality / Features /
         Integrations / Price / Support)
Step 7: "Do you need ecommerce?" (Yes, selling products / Maybe later / No)
Step 8: "Do you need a mobile app?" (Yes, iOS/Android / Web only / Both would be nice)
Step 9: "Timeline to launch?" (This week / This month / 3+ months / Just exploring)
Step 10: "Any tools you've already tried?" (multi-select from tools table)

Result page:
- "Your top matches" heading
- Top 3 tools with: match score (%), why it matches (generated from answers), rating,
  "Read Full Review" link, "Visit [Tool]" affiliate CTA
- "See all tools" link to /tools

TOOL 2 — Pricing Calculator (/tools/pricing-calculator):
Inputs:
- Expected monthly active users (slider: 0 – 100,000)
- Team members needing access (slider: 1 – 50)
- Features needed (checkboxes): Custom domain / Ecommerce /
  API access / White label / Priority support / Unlimited pages
- Show tools (multi-select from tools WHERE pricing_tiers is not empty)
Real-time output:
- Table with columns: Tool | Recommended Plan | Monthly Cost | Annual Cost | Savings
- Pulls from pricing_tiers JSONB and applies logic to select cheapest fitting plan
- Cheapest overall highlighted in green
- "Visit [Tool]" affiliate CTA in each row

TOOL 3 — Feature Matrix Builder (/tools/compare):
- Dropdown to select 2-4 tools from tools table
- "Build Matrix" button
- Renders full feature comparison table from DB data
- Export as image button (html2canvas)
- "Full Comparison" link to /compare/[slug-vs-slug] if that comparison exists

TOOL 4 — Should I Switch? Tool (/tools/should-i-switch):
Step 1: "What tool are you currently using?" (select from tools table)
Step 2: "What's frustrating you?" (multi-select: Too expensive / Too complex /
         Missing features / Poor support / Scaling issues / Better option exists)
Step 3: "What matters most in a new tool?" (rank by drag-drop: Price / Ease /
         Features / Design / Support / Integrations)
Step 4: "What's your switch timeline?" (ASAP / Within 3 months / Just evaluating)

Result:
- "Stay or Switch?" verdict (generated from inputs)
- If switch: Top 3 alternatives with match score, review links, affiliate CTAs
- Migration difficulty badge (Easy / Medium / Hard) per alternative
- "Your full migration guide" article link (if relevant article exists in DB)

━━━━━━━━━━━━ SEO REQUIREMENTS ━━━━━━━━━━━━

Auto-generate on every page:
- <title> tag: page-specific formula (see Section 13)
- <meta name="description">: 150-160 chars
- <meta property="og:title">
- <meta property="og:description">
- <meta property="og:image">: 1200x630 generated card (tool logo + site name + dark bg)
- <meta property="og:url">
- <meta name="twitter:card">: summary_large_image
- Canonical URL tag
- JSON-LD structured data (type varies by page — see Section 13)

Sitemap: auto-regenerate at /sitemap.xml on every article/tool publish.
Robots.txt: allow all, disallow /admin.

━━━━━━━━━━━━ PERFORMANCE REQUIREMENTS ━━━━━━━━━━━━

- All images: lazy loading + explicit width/height attributes
- Tool grid: client-side pagination, no full-page reload on filter/sort
- Supabase queries: implement 5-minute cache on tool list queries
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms
- Mobile-first responsive: test at 375px, 768px, 1024px, 1440px breakpoints
- All interactive tools: loading states, error states, empty states

━━━━━━━━━━━━ ACCESSIBILITY ━━━━━━━━━━━━

- All images: alt text (tool name + "logo" or "screenshot")
- All interactive elements: keyboard navigable
- Color contrast: WCAG AA minimum on all text
- Form labels: properly associated with inputs
- ARIA labels on icon-only buttons
- Skip navigation link at top of page"""

story.append(code_block(main_prompt, "COMPLETE LOVABLE PROMPT — COPY EVERYTHING BELOW THIS LINE"))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 6 — FOLLOW-UP PROMPTS
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("6. Lovable Follow-Up Prompts", "Run these after the main build completes"))
story.append(sp(10))
story.append(Paragraph("Use these prompts in order after the main build. Each addresses a specific area.", body))
story.append(sp(8))

followups = [
    ("Polish mobile navigation",
     """The mobile hamburger menu needs improvement:
1. Slide in from left with 300ms ease transition
2. Dark overlay behind it (bg rgba(0,0,0,0.6)), clicking overlay closes menu
3. Menu items: 18px, 48px tap height minimum
4. Email signup form at bottom of mobile nav overlay
5. Close button (X) top-right of menu panel
6. Lock body scroll when menu is open"""),

    ("Add exit-intent email capture modal",
     """Add an email capture modal that triggers on exit intent:
1. Desktop: fires when mouse moves above viewport (mouseleave on document)
2. Mobile: fires after 60 seconds on page
3. Show maximum once per 7 days per device (store in localStorage)
4. Never show on /admin pages or /submit page
5. Modal design: dark overlay, centered white card, headline 'Before you go —
   get our free weekly no-code digest', email input + subscribe button
6. On submit: POST /api/add-subscriber with source='exit-intent'
7. Success: replace form with 'You are in! Check your inbox.' + close button"""),

    ("Add reading progress bar and social sharing",
     """Add to all article pages (/blog/[slug] and /tools/[slug]):
1. Reading progress bar: fixed 3px line at very top of viewport.
   Width = scrollY / (documentHeight - viewportHeight) * 100%.
   Color: --color-accent. Smooth transition.
2. Social share sidebar (desktop only): fixed right side, vertically centered.
   3 icons: Twitter/X (tweet with page title + URL), LinkedIn (share),
   Copy Link (copies URL to clipboard, shows 'Copied!' tooltip for 2s).
3. Share bar bottom (mobile only): fixed bottom strip with same 3 share options.
   Show/hide on scroll direction (hide on scroll down, show on scroll up)."""),

    ("Add comparison page dynamic generation",
     """If a user visits /compare/[tool-a-slug]-vs-[tool-b-slug] and no comparison
exists in the database for those two tools, dynamically generate one:
1. Fetch both tools from the tools table by their slugs
2. If either tool not found: show 404
3. If comparison exists in DB: render it normally
4. If no comparison in DB: render a live-generated comparison using the tools data
   Show both tools side-by-side with all available DB data (ratings, pricing, pros, cons)
   Add a banner: 'Full written comparison coming soon — subscribe for the alert'
   Do NOT make an API call to generate content on the fly for this page
5. Increment view_count on the comparisons record if it exists"""),

    ("Improve admin analytics dashboard",
     """Upgrade the /admin/analytics section:
1. Stats row: Total Affiliate Clicks (30d) | Top Tool by Clicks | Active Subscribers |
   Articles Published This Month (4 cards with trend arrows vs previous 30d)
2. Line chart: daily affiliate clicks for last 30 days. Use recharts library.
3. Bar chart: top 10 tools by affiliate clicks in date range.
4. Table: each tool row showing clicks, article that drove most clicks, affiliate URL
5. Date range picker: preset options (7d / 30d / 90d) + custom range
6. Export button: downloads the filtered data as CSV"""),

    ("Add JSON-LD structured data to all tool and article pages",
     """Add the following JSON-LD to the <head> of each page type:

Tool review pages (/tools/[slug]):
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[tool.name]",
  "url": "[tool.website_url]",
  "description": "[tool.tagline]",
  "applicationCategory": "WebApplication",
  "offers": { "@type": "Offer", "price": "[lowest tier price]", "priceCurrency": "USD" },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[tool.rating_overall]",
    "bestRating": "5", "worstRating": "1", "ratingCount": "[user_ratings count]"
  }
}

Article pages (/blog/[slug]):
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[article.title]",
  "datePublished": "[article.published_at]",
  "dateModified": "[article.updated_at]",
  "author": { "@type": "Organization", "name": "[SITE NAME]" },
  "publisher": { "@type": "Organization", "name": "[SITE NAME]" }
}

Homepage — add BreadcrumbList + WebSite with SearchAction for sitelinks searchbox."""),

    ("Add tool pricing update banner",
     """On tool review pages, if tools.updated_at is more than 90 days ago,
show a yellow banner below the hero:
'Heads up: this review was last updated [date]. Pricing and features may have changed.
 Check the latest on [Tool Name]'s website.' with a link to tools.website_url.
The banner should be dismissible (X button, hides for this session via sessionStorage).
Style: warning yellow background, dark text, rounded, full-width below hero."""),

    ("Add sitemap.xml auto-generation and IndexNow ping",
     """Create a dynamic /sitemap.xml endpoint that:
1. Fetches all published articles (slug, updated_at) from articles table
2. Fetches all tools (slug, updated_at) from tools table
3. Fetches all comparisons (slug, updated_at) from comparisons table
4. Generates a valid XML sitemap with all URLs
5. Includes: loc, lastmod, changefreq (weekly for tools/comparisons, daily for blog), priority
6. Static pages included: /, /tools, /blog, /about, /advertise, /newsletter, /submit

After any new article or tool is published (via webhook), call:
POST https://api.indexnow.org/IndexNow
Body: {
  "host": "[YOUR DOMAIN]",
  "key": "[INDEXNOW_KEY from env]",
  "keyLocation": "https://[YOUR DOMAIN]/[INDEXNOW_KEY].txt",
  "urlList": ["https://[YOUR DOMAIN]/[new-page-url]"]
}"""),

    ("Polish tool card hover and loading states",
     """Improve micro-interactions throughout:
1. Tool cards: on hover, show a subtle 'Compare' button that appears at bottom of card.
   Clicking it adds the tool to a comparison sidebar (max 3 tools).
   Comparison sidebar: fixed bottom bar on mobile, fixed right sidebar on desktop.
   'Compare X tools' button appears when 2+ tools selected → /tools/compare?tools=slug1,slug2,slug3
2. All affiliate CTA buttons: add a small external link icon after the text.
   Add 1 second 'redirecting...' state on click before opening new tab.
3. Star ratings: on tool card hover, show tooltip 'Based on our editorial review'
4. Add skeleton loading states for all Supabase fetches:
   Tool cards: animated grey placeholder cards while loading
   Articles: animated placeholder lines while loading"""),

    ("Add GDPR cookie consent and privacy infrastructure",
     """Add full GDPR compliance:
1. Cookie consent banner (bottom of page on first visit):
   'We use cookies for analytics and to improve your experience.
    Accept All | Manage Preferences | Reject Non-Essential'
   Store choice in localStorage. Persist for 365 days.
2. Only load Google Analytics if user accepted analytics cookies.
3. Privacy Policy page (/privacy): auto-generate from template covering:
   What data we collect (email for newsletter, click tracking),
   How it's used, Third party services (Supabase, Resend, Google Analytics),
   Cookie policy, User rights (GDPR), Contact information.
4. Affiliate Disclosure page (/disclosure): explain affiliate relationship.
5. Add 'Affiliate Disclosure' link to footer and to every article page header.
6. Unsubscribe page (/unsubscribe?token=[token]):
   Finds subscriber by confirm_token, sets active=false, unsubscribed_at=now()
   Shows: 'You have been unsubscribed. We are sorry to see you go.'"""),
]

for i, (title, prompt) in enumerate(followups, 1):
    story.append(KeepTogether([
        Paragraph(f"Follow-up #{i}: {title}", h3),
        sp(4),
        code_block(prompt, f"FOLLOW-UP PROMPT #{i}"),
        sp(10),
    ]))

story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 7 — ENVIRONMENT VARIABLES
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("7. Environment Variables", "Every variable required — where to get each"))
story.append(sp(10))
story.append(note("In Lovable: Settings > Environment Variables. In n8n: Settings > Variables. Never commit these to git.", "warn"))
story.append(sp(8))

story.append(tbl([
    ["NEXT_PUBLIC_SUPABASE_URL",     "Supabase Dashboard > Settings > API > Project URL",                                          "Public",   "Required"],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY","Supabase Dashboard > Settings > API > anon/public key",                                     "Public",   "Required"],
    ["SUPABASE_SERVICE_ROLE_KEY",    "Supabase Dashboard > Settings > API > service_role key — server-side only, never expose",   "Secret",   "Required"],
    ["WEBHOOK_SECRET",               "Generate: openssl rand -hex 32. Set the same value in n8n workflow headers.",                "Secret",   "Required"],
    ["RESEND_API_KEY",               "resend.com > API Keys > Create API Key",                                                     "Secret",   "Required"],
    ["RESEND_FROM_EMAIL",            "Your verified sending address in Resend (e.g. hello@yoursite.com)",                          "Public",   "Required"],
    ["RESEND_ADMIN_EMAIL",           "Your personal email for admin notifications (new submissions, expiring slots, errors)",      "Secret",   "Required"],
    ["GEMINI_API_KEY",               "Google AI Studio > Get API Key. Use a paid account for production.",                         "Secret",   "Required"],
    ["INDEXNOW_KEY",                 "Generate any random 32-char hex string. Also create /{key}.txt file on root with same value","Secret",   "Required"],
    ["NEXT_PUBLIC_GA_MEASUREMENT_ID","Google Analytics 4 > Data Streams > Measurement ID (starts with G-)",                       "Public",   "Recommended"],
    ["NEXT_PUBLIC_SITE_URL",         "Your full site URL (e.g. https://nocodereviews.com) — used for sitemap, og:url, IndexNow",  "Public",   "Required"],
    ["N8N_WEBHOOK_BASE_URL",         "Your n8n instance URL (e.g. https://yourn8n.app.n8n.cloud) — used by Lovable to call n8n", "Secret",   "Optional"],
    ["CRON_SECRET",                  "Generate: openssl rand -hex 32. Used to authenticate cron job calls.",                       "Secret",   "Optional"],
], headers=["Variable", "How to Get It", "Exposure", "Status"],
   cw=[W*0.30, W*0.46, W*0.10, W*0.14]))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 8 — API INTEGRATIONS
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("8. API Integrations", "Gemini · Resend · Google APIs · IndexNow"))
story.append(sp(10))

story.append(sub_banner("8.1  Google Gemini API (Content Generation)"))
story.append(sp(8))
story.append(tbl([
    ["Endpoint",    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"],
    ["Auth",        "API key in header: x-goog-api-key: {GEMINI_API_KEY}"],
    ["Model",       "gemini-2.0-flash (default — fast + cheap). gemini-2.5-pro for flagship content."],
    ["Max tokens",  "8192 output tokens per call (enough for 1,500-word article)"],
    ["Temperature", "0.7 for articles (creative but grounded). 0.3 for structured data extraction."],
    ["Rate limits", "Free tier: 15 req/min. Paid: 1,000 req/min. Production must use paid."],
], cw=[W*0.18, W*0.82]))
story.append(sp(6))
story.append(code_block("""// Gemini API call structure (used in n8n HTTP Request node)
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

Headers:
  x-goog-api-key: {{$env.GEMINI_API_KEY}}
  Content-Type: application/json

Body:
{
  "contents": [{
    "parts": [{
      "text": "{{$json.prompt}}"
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 8192,
    "responseMimeType": "text/plain"
  },
  "safetySettings": [
    {"category": "HARM_CATEGORY_HARASSMENT",        "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH",       "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
  ]
}

Response path to article text:
  response.candidates[0].content.parts[0].text""", "Gemini API — Request structure"))
story.append(sp(10))

story.append(sub_banner("8.2  Resend API (Email)"))
story.append(sp(8))
story.append(tbl([
    ["Endpoint",    "https://api.resend.com/emails (single) / https://api.resend.com/emails/batch (bulk)"],
    ["Auth",        "Authorization: Bearer {RESEND_API_KEY}"],
    ["Free tier",   "100 emails/day, 3,000/month. Paid from $20/month for 50k/month."],
    ["Batch limit", "100 recipients per batch call. Loop for larger lists."],
    ["From domain", "Must verify your sending domain in Resend (add DNS records). Use custom domain, not resend.dev in production."],
], cw=[W*0.18, W*0.82]))
story.append(sp(6))
story.append(code_block("""// Resend single email (confirmation, admin alert)
POST https://api.resend.com/emails
Authorization: Bearer {RESEND_API_KEY}
Content-Type: application/json

{
  "from": "No-Code Reviews <hello@yoursite.com>",
  "to": ["subscriber@email.com"],
  "subject": "Confirm your subscription",
  "html": "<html>...</html>",
  "text": "Plain text fallback..."
}

// Resend batch (newsletter send — loop in batches of 100)
POST https://api.resend.com/emails/batch
Authorization: Bearer {RESEND_API_KEY}

[
  {"from": "...", "to": ["email1@..."], "subject": "...", "html": "..."},
  {"from": "...", "to": ["email2@..."], "subject": "...", "html": "..."}
  // ... up to 100 per batch
]""", "Resend API — Email sending"))
story.append(sp(10))

story.append(sub_banner("8.3  Google Search Console API (Keyword Discovery)"))
story.append(sp(8))
story.append(code_block("""// GSC API — fetch queries ranking in positions 8-20 (easy wins)
// Set up: Google Cloud Console > Enable Search Console API > OAuth2 credentials

POST https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query
Authorization: Bearer {OAUTH_ACCESS_TOKEN}

{
  "startDate": "2026-04-18",
  "endDate": "2026-05-18",
  "dimensions": ["query", "page"],
  "dimensionFilterGroups": [{
    "filters": [{
      "dimension": "position",
      "operator": "greaterThan",
      "expression": "7"
    }, {
      "dimension": "position",
      "operator": "lessThan",
      "expression": "21"
    }]
  }],
  "rowLimit": 100,
  "orderBy": [{"fieldName": "clicks", "sortOrder": "DESCENDING"}]
}

// Response: rows[].keys[0] = query, rows[].position = avg position
// Filter: impressions > 50 (avoid zero-traffic queries)
// Add qualifying keywords to keyword_queue table via Supabase insert""", "Google Search Console API"))
story.append(sp(10))

story.append(sub_banner("8.4  IndexNow API (Instant Google Indexing)"))
story.append(sp(8))
story.append(code_block("""// IndexNow — ping on every new article/tool published
// Step 1: Create file at https://yoursite.com/{INDEXNOW_KEY}.txt
//         File contents: just the key string (no other text)

POST https://api.indexnow.org/IndexNow
Content-Type: application/json

{
  "host": "yoursite.com",
  "key": "{INDEXNOW_KEY}",
  "keyLocation": "https://yoursite.com/{INDEXNOW_KEY}.txt",
  "urlList": [
    "https://yoursite.com/blog/new-article-slug",
    "https://yoursite.com/tools/new-tool-slug"
  ]
}

// Max 10,000 URLs per request. Bing and Yandex also honor IndexNow.
// Call this from the /api/publish-article and /api/add-tool webhooks.""", "IndexNow API"))
story.append(sp(10))

story.append(sub_banner("8.5  Google PageSpeed Insights API (CWV Checker Tool)"))
story.append(sp(8))
story.append(code_block("""// Used by the Core Web Vitals Checker interactive tool
GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed
  ?url={USER_ENTERED_URL}
  &strategy=mobile
  &key={GOOGLE_API_KEY}

// Key response fields:
// lighthouseResult.categories.performance.score (multiply by 100 for score)
// lighthouseResult.audits.largest-contentful-paint.displayValue
// lighthouseResult.audits.cumulative-layout-shift.displayValue
// lighthouseResult.audits.total-blocking-time.displayValue

// Free tier: 25,000 queries/day
// Enable at: Google Cloud Console > PageSpeed Insights API""", "PageSpeed API"))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 9 — WEBHOOK CONTRACTS
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("9. Webhook Contracts", "Every endpoint fully specified"))
story.append(sp(10))
story.append(note("All endpoints require header X-Webhook-Secret matching WEBHOOK_SECRET env var. Return 401 if missing/wrong. All POST bodies are JSON. All responses are JSON.", "info"))
story.append(sp(8))

webhooks = [
    ("POST /api/publish-article", "Publishes a new article from the n8n content pipeline",
     """{
  "title": "string — required",
  "slug": "string — required, URL-safe, unique",
  "body": "string — required, markdown or HTML, min 800 chars",
  "excerpt": "string — optional, max 300 chars",
  "article_type": "string — review|comparison|tutorial|best-of|guide",
  "category": "string — e.g. 'app-builders'",
  "tags": ["string array"],
  "seo_title": "string — optional, max 60 chars",
  "seo_description": "string — optional, max 160 chars",
  "featured_image_url": "string — optional, full URL",
  "author": "string — optional, default 'Editorial Team'",
  "word_count": "integer — optional, auto-calculated if omitted"
}""",
     """{
  "status": "published",
  "article_id": "uuid",
  "slug": "string",
  "url": "https://yoursite.com/blog/[slug]"
}"""),

    ("POST /api/add-tool", "Adds a new tool to the database",
     """{
  "name": "string — required",
  "slug": "string — required",
  "tagline": "string",
  "logo_url": "string — URL",
  "website_url": "string — URL",
  "affiliate_url": "string — URL",
  "category": ["string array — e.g. ['app-builders','automation']"],
  "rating_overall": "number 1.0–5.0",
  "rating_ease": "number 1.0–5.0",
  "rating_features": "number 1.0–5.0",
  "rating_pricing": "number 1.0–5.0",
  "rating_support": "number 1.0–5.0",
  "verdict": "string — one sentence verdict",
  "review_body": "string — full review text",
  "pros": ["string array"],
  "cons": ["string array"],
  "pricing_tiers": "[{name, price_monthly, price_annual, features[]}]",
  "best_for": ["string array"]
}""",
     """{
  "status": "added",
  "tool_id": "uuid",
  "slug": "string"
}"""),

    ("POST /api/update-tool", "Updates specific fields on an existing tool",
     """{
  "slug": "string — required, identifies the tool",
  "fields": {
    "rating_overall": 4.5,
    "pricing_tiers": [...],
    "pros": [...],
    "any_tool_field": "new_value"
  }
}""",
     """{
  "status": "updated",
  "tool_id": "uuid",
  "updated_fields": ["field1", "field2"]
}"""),

    ("POST /api/add-subscriber", "Adds subscriber and triggers confirmation email",
     """{
  "email": "string — required, valid email format",
  "source": "string — e.g. 'homepage', 'exit-intent', 'article-signup'"
}""",
     """{
  "status": "added" | "already_subscribed",
  "subscriber_id": "uuid — only if newly added"
}"""),

    ("POST /api/send-newsletter", "Sends newsletter to all active confirmed subscribers",
     """{
  "subject": "string — required, email subject line",
  "preview_text": "string — preview shown in inbox",
  "body_html": "string — required, full HTML email body",
  "issue_number": "integer — required, sequential issue number"
}""",
     """{
  "status": "sent",
  "recipients": 1234,
  "issue_id": "uuid"
}"""),

    ("POST /api/log-affiliate-click", "Logs affiliate click (non-blocking)",
     """{
  "tool_id": "uuid — required",
  "article_id": "uuid — optional (null if clicked from tool card)",
  "page_url": "string — full URL where click occurred",
  "user_agent": "string — from request headers",
  "referrer": "string — from request headers"
}""",
     """{
  "status": "logged"
}"""),

    ("GET /api/keyword-queue", "Returns pending keywords for article generation",
     """Query params:
  limit: integer (default 10, max 50)
  type: string (optional filter: review|comparison|tutorial|best-of|guide)""",
     """{
  "keywords": [
    {
      "id": "uuid",
      "keyword": "string",
      "search_volume": 1200,
      "difficulty": 24,
      "article_type": "comparison",
      "priority": 8,
      "tool_slugs": ["bubble", "webflow"]
    }
  ],
  "total_pending": 47
}"""),

    ("POST /api/add-cross-link", "Logs a cross-site link to prevent over-linking",
     """{
  "source_article_id": "uuid — required",
  "source_site": "string — e.g. 'site-1'",
  "destination_url": "string — full URL of destination page",
  "destination_site": "string — e.g. 'site-2'",
  "anchor_text": "string — the link anchor text used"
}""",
     """{
  "status": "logged" | "limit_reached",
  "monthly_count": 3,
  "message": "Limit reached: max 3 cross-links/month to this destination"
}"""),
]

for endpoint, desc, request_body, response_body in webhooks:
    story.append(KeepTogether([
        Paragraph(f"<b>{endpoint}</b>", h3),
        Paragraph(desc, bm),
        sp(4),
        tbl([["Request Body", "Response Body"],
             [Paragraph(request_body.replace("\n","<br/>"), S("rb", fontSize=8.5, leading=13, fontName="Courier", textColor=INK)),
              Paragraph(response_body.replace("\n","<br/>"), S("rs", fontSize=8.5, leading=13, fontName="Courier", textColor=INK))]],
            cw=[W*0.52, W*0.48]),
        sp(10),
    ]))

story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 10 — n8n WORKFLOWS
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("10. n8n Automation Workflows", "6 workflows — full node configurations"))
story.append(sp(10))
story.append(callout(
    "n8n setup",
    "Use n8n Cloud (n8n.io/cloud, from $20/month) or self-host on a VPS. "
    "Set environment variables in n8n: Settings > Variables. "
    "Each workflow below lists every node in order with its exact configuration. "
    "Import workflows via n8n's JSON import feature using the configs below."
))
story.append(sp(10))

story.append(sub_banner("Workflow 1 — Daily Article Generation (runs 4× per day)"))
story.append(sp(6))
story.append(tbl([
    ["Node 1: Schedule Trigger",
     "Type: Schedule. Interval: Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC). "
     "This triggers 4 article generations per day."],
    ["Node 2: HTTP Request — Get Keyword",
     "Method: GET. URL: {{$env.SITE_URL}}/api/keyword-queue?limit=1. "
     "Headers: X-Webhook-Secret: {{$env.WEBHOOK_SECRET}}. "
     "Output: keyword object from queue."],
    ["Node 3: IF — Queue Empty?",
     "Condition: {{$json.keywords.length}} equals 0. "
     "True branch: Stop and Error node (log 'No keywords in queue'). "
     "False branch: continue to Node 4."],
    ["Node 4: Set — Build Article Brief",
     "Sets variables: keyword={{$json.keywords[0].keyword}}, "
     "article_type={{$json.keywords[0].article_type}}, "
     "keyword_id={{$json.keywords[0].id}}, "
     "tool_slugs={{$json.keywords[0].tool_slugs}}"],
    ["Node 5: HTTP Request — Fetch Tool Data",
     "Method: GET. URL: {{$env.SUPABASE_URL}}/rest/v1/tools?slug=in.({{$json.tool_slugs.join(',')}})&select=*. "
     "Headers: apikey: {{$env.SUPABASE_ANON_KEY}}, Authorization: Bearer {{$env.SUPABASE_ANON_KEY}}. "
     "Skip this node if tool_slugs is empty."],
    ["Node 6: Code — Build Gemini Prompt",
     "JavaScript function node. Assembles the full article prompt from keyword + tool data + article_type. "
     "See Section 11 for the exact prompt templates used in this node."],
    ["Node 7: HTTP Request — Call Gemini",
     "Method: POST. URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent. "
     "Headers: x-goog-api-key: {{$env.GEMINI_API_KEY}}, Content-Type: application/json. "
     "Body: see Section 8.1 for request structure. "
     "Response extraction: {{$json.candidates[0].content.parts[0].text}}"],
    ["Node 8: Code — Quality Gateway",
     "JavaScript function. Runs all quality checks on generated article. "
     "See Section 11 for the full quality gateway logic. "
     "Sets: pass=true/false, fail_reasons=['...'], word_count=N"],
    ["Node 9: IF — Passes Quality Check?",
     "Condition: {{$json.pass}} equals true. "
     "False branch: HTTP Request node to log failure to Supabase keyword_queue "
     "with status='failed' + fail_reasons, then Stop. "
     "True branch: continue to Node 10."],
    ["Node 10: Code — Build Article Payload",
     "Generates: slug (from keyword, URL-safe), excerpt (first 2 sentences), "
     "seo_title (keyword + site name, max 60 chars), "
     "seo_description (150-char summary), tags (extracted from article text), "
     "article_type (from keyword object), category (from keyword or tool category)"],
    ["Node 11: HTTP Request — Publish Article",
     "Method: POST. URL: {{$env.SITE_URL}}/api/publish-article. "
     "Headers: X-Webhook-Secret: {{$env.WEBHOOK_SECRET}}, Content-Type: application/json. "
     "Body: full article payload from Node 10."],
    ["Node 12: HTTP Request — Update Keyword Status",
     "Method: POST. URL: {{$env.SITE_URL}}/api/update-keyword-status. "
     "Headers: X-Webhook-Secret: {{$env.WEBHOOK_SECRET}}. "
     "Body: {keyword_id: {{$json.keyword_id}}, status: 'done'}"],
], headers=["Node","Configuration"], cw=[W*0.25, W*0.75]))
story.append(sp(10))

story.append(sub_banner("Workflow 2 — Weekly Newsletter (runs every Sunday 08:00 UTC)"))
story.append(sp(6))
story.append(tbl([
    ["Node 1: Schedule Trigger",    "Type: Schedule. Day: Sunday. Time: 08:00 UTC."],
    ["Node 2: Supabase — Top Articles",
     "HTTP GET: {{$env.SUPABASE_URL}}/rest/v1/articles?status=eq.published"
     "&order=view_count.desc&limit=3&published_at=gte.{{last_7_days_ISO}}. "
     "Gets top 3 articles by view count from the past 7 days."],
    ["Node 3: Supabase — Top Tools",
     "HTTP GET: affiliate_clicks table grouped by tool_id, last 7 days, top 3. "
     "Joins to tools table for name and logo."],
    ["Node 4: Supabase — Issue Number",
     "HTTP GET: newsletter_issues ordered by issue_number DESC limit 1. "
     "new_issue_number = last_issue_number + 1"],
    ["Node 5: Code — Build Newsletter Prompt",
     "Constructs Gemini prompt: 'Write a weekly newsletter intro (150 words max) that "
     "highlights these 3 articles: [titles+excerpts]. "
     "Tone: informative, friendly, no fluff. End with a call to read the top article.'"],
    ["Node 6: HTTP Request — Call Gemini",
     "Same as Workflow 1 Node 7. Temperature: 0.8 (warmer tone for newsletter)."],
    ["Node 7: Code — Build Newsletter HTML",
     "JavaScript. Assembles full newsletter HTML from: Gemini intro + "
     "3 article cards (title, excerpt, 'Read Now' link) + "
     "top tool picks section + unsubscribe link footer. "
     "Unsubscribe URL: https://yoursite.com/unsubscribe?token={{subscriber.confirm_token}}"],
    ["Node 8: HTTP Request — Send Newsletter",
     "POST /api/send-newsletter with {subject, preview_text, body_html, issue_number}"],
], headers=["Node","Configuration"], cw=[W*0.22, W*0.78]))
story.append(sp(10))

story.append(sub_banner("Workflow 3 — Keyword Scout (runs daily 04:00 UTC)"))
story.append(sp(6))
story.append(tbl([
    ["Node 1: Schedule Trigger",         "Daily at 04:00 UTC."],
    ["Node 2: HTTP Request — GSC API",   "Fetches queries at positions 8-20 from Google Search Console API. See Section 8.3 for exact request. Returns up to 100 rows."],
    ["Node 3: Code — Filter Keywords",   "Filters: impressions > 50, not already in keyword_queue (check against DB), not already published (check articles table by keyword match). Scores each keyword: priority = (100 - position) + (impressions/100)."],
    ["Node 4: Supabase — Insert Keywords","Batch INSERT filtered keywords into keyword_queue with status='pending', calculated priority, and guessed article_type (comparison if 'vs' in keyword, review if tool name detected, tutorial if 'how to' in keyword, else guide)."],
    ["Node 5: Code — Log Summary",       "Logs: X new keywords added to queue. Total pending: Y. Sends summary to Resend admin email if new keywords found."],
], headers=["Node","Configuration"], cw=[W*0.22, W*0.78]))
story.append(sp(10))

story.append(sub_banner("Workflow 4 — Tool Pricing Monitor (runs weekly, Monday 06:00 UTC)"))
story.append(sp(6))
story.append(tbl([
    ["Node 1: Schedule Trigger",      "Weekly, Monday 06:00 UTC."],
    ["Node 2: Supabase — All Tools",  "Fetch all tools with website_url and updated_at. Filter: updated_at < 30 days ago (needs refresh check)."],
    ["Node 3: Loop Over Tools",       "n8n Split In Batches node. Process 5 tools at a time (rate limiting)."],
    ["Node 4: HTTP Request — Fetch Tool Website",
     "GET {{$json.website_url}}/pricing. "
     "Set timeout: 10 seconds. Ignore errors (some sites block scrapers). "
     "Extract page title and any price mentions via regex in next node."],
    ["Node 5: Code — Compare Pricing", "Simple check: does fetched page content contain the same prices as in our DB? "
     "If obvious discrepancy detected (e.g. DB says $29, page shows $49): flag for review."],
    ["Node 6: Supabase — Flag Tool",   "If discrepancy found: INSERT into keyword_queue with keyword='update pricing: [tool name]', "
     "article_type='review', priority=9 (high — pricing updates are urgent)."],
    ["Node 7: Resend — Summary Email", "Send admin email: 'Pricing check complete. X tools flagged for review: [tool list]'"],
], headers=["Node","Configuration"], cw=[W*0.22, W*0.78]))
story.append(sp(10))

story.append(sub_banner("Workflow 5 — Interlink Agent (triggered by webhook on each publish)"))
story.append(sp(6))
story.append(tbl([
    ["Node 1: Webhook Trigger",        "Receives POST from /api/publish-article after every new article. Payload: {article_id, title, body, tags, category}"],
    ["Node 2: Code — Extract Keywords","Extract top 10 meaningful noun phrases from article title + tags + first 200 words of body. These are used to find contextually relevant pages on other network sites."],
    ["Node 3: HTTP Request — GSC Search",
     "For each keyword, query Google Custom Search API (limited free use) OR use a simple "
     "Supabase full-text search across all articles for matching content on other sites. "
     "Return top 3 most relevant pages."],
    ["Node 4: Code — Score Relevance",
     "Score each candidate link: keyword overlap score + category match bonus. "
     "Select the single highest-scoring candidate that has not been linked to in last 30 days."],
    ["Node 5: Check Link Limit",       "POST /api/add-cross-link. If response is 'limit_reached': stop workflow. If 'logged': continue."],
    ["Node 6: Supabase — Insert Link into Article",
     "UPDATE articles SET body = REPLACE(body, first_occurrence_of_anchor_phrase, "
     "<a href='destination_url'>anchor_phrase</a>) WHERE id = article_id. "
     "Note: this modifies the article body to insert the contextual link."],
], headers=["Node","Configuration"], cw=[W*0.22, W*0.78]))
story.append(sp(10))

story.append(sub_banner("Workflow 6 — Sponsored Slot Monitor (runs daily 09:00 UTC)"))
story.append(sp(6))
story.append(tbl([
    ["Node 1: Schedule Trigger",         "Daily at 09:00 UTC."],
    ["Node 2: Supabase — Expiring Slots","SELECT * FROM sponsored_slots WHERE active=true AND end_date BETWEEN today AND today+7days."],
    ["Node 3: IF — Any Expiring?",       "If count > 0: send renewal email to contact_email of each expiring slot. If count = 0: stop."],
    ["Node 4: Resend — Renewal Email",   "Send to slot.contact_email: 'Your sponsored listing on [SITE NAME] expires in [X] days. Reply to this email to renew.' CC admin email. Use template from Section 14."],
    ["Node 5: Supabase — Expired Slots", "SELECT * FROM sponsored_slots WHERE active=true AND end_date < today. Mark active=false, UPDATE tools.sponsored=false for expired tools."],
], headers=["Node","Configuration"], cw=[W*0.22, W*0.78]))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 11 — CONTENT GENERATION SYSTEM
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("11. Content Generation System", "Gemini prompts · Quality gateway · Voice"))
story.append(sp(10))

story.append(Paragraph("Article type prompts for Gemini", h2))
story.append(body)
story.append(sp(4))

story.append(code_block("""// PROMPT TYPE 1: Tool Review Article
// Used when article_type = 'review'

You are a senior technology writer for a no-code platform review site.
Write a comprehensive, honest review of ${toolName}.

TOOL DATA:
Name: ${tool.name}
Website: ${tool.website_url}
Category: ${tool.category.join(', ')}
Pricing tiers: ${JSON.stringify(tool.pricing_tiers)}
Known pros: ${tool.pros.join(', ')}
Known cons: ${tool.cons.join(', ')}
Current rating: ${tool.rating_overall}/5

REQUIREMENTS:
- Length: 1,200–1,600 words
- Structure with H2 headings: Overview | Key Features | Pricing | Pros & Cons |
  Who It's For | Verdict
- Tone: Honest, direct, helpful. Not promotional. Not overly negative.
  Like a trusted friend who knows no-code tools well.
- Include: specific use cases, who should NOT use it, how it compares to the
  obvious alternative (do not name another specific tool, say 'compared to alternatives')
- End with a clear verdict: 'Best for X. Not ideal for Y. Overall rating: N/5'
- DO NOT include: vague filler ('In today's digital landscape'),
  excessive superlatives, unverifiable claims
- MUST include: at least 3 specific features with their actual names as
  they appear in the product UI
- Format as clean HTML with <h2>, <h3>, <p>, <ul>, <li> tags only.
  No inline styles. No divs. No classes.

SEO TARGET KEYWORD: ${keyword}
Use this keyword naturally in: H1/title, first paragraph, one H2 heading, conclusion.
Keyword density: 1-2% (do not force it).""", "Gemini prompt — Tool Review"))
story.append(sp(8))

story.append(code_block("""// PROMPT TYPE 2: Comparison Article
// Used when article_type = 'comparison', tool_slugs has 2 entries

You are a senior technology writer for a no-code platform review site.
Write a detailed, fair comparison of ${tool1.name} vs ${tool2.name}.

TOOL 1 DATA: ${JSON.stringify(tool1_summary)}
TOOL 2 DATA: ${JSON.stringify(tool2_summary)}

REQUIREMENTS:
- Length: 1,400–1,800 words
- Structure with H2 headings: Quick Comparison | ${tool1.name} Overview |
  ${tool2.name} Overview | Feature Comparison | Pricing Comparison |
  Which Should You Choose | Verdict
- Include a markdown table for feature comparison (convert to HTML)
- Be genuinely opinionated — give a clear winner for specific use cases
  e.g. 'If you're building a SaaS, choose X. If you're a beginner, choose Y.'
- Tone: fair, balanced, direct. Neither tool should feel attacked.
- DO NOT: pick a winner overall. DO: give clear situational recommendations.
- End section 'Which Should You Choose': 3-4 specific scenarios with a
  clear recommendation for each.

SEO TARGET KEYWORD: ${keyword} (e.g. 'bubble vs webflow')
Use keyword in: H1, first paragraph, one H2, meta description suggestion at end.

OUTPUT FORMAT: Clean HTML only. Include at the end:
<meta-seo>
SUGGESTED TITLE: [max 60 chars]
SUGGESTED DESCRIPTION: [max 160 chars]
</meta-seo>""", "Gemini prompt — Comparison Article"))
story.append(sp(8))

story.append(code_block("""// PROMPT TYPE 3: Tutorial Article
// Used when article_type = 'tutorial'

You are a technical writer for a no-code platform review site.
Write a step-by-step tutorial on: "${keyword}"

REQUIREMENTS:
- Length: 1,000–1,400 words
- Assume reader is: a non-technical person who has heard of no-code tools
  but may be using the specific tool for the first time
- Structure: Introduction (what they'll learn + estimated time) |
  Before You Start (prerequisites — keep minimal) |
  Step 1: [action] | Step 2: [action] | ... (6-10 steps) |
  Troubleshooting (2-3 common issues + solutions) | Next Steps
- Each step: single clear action, explain WHY not just HOW,
  describe what the user should see on screen after completing the step
- Tone: patient, encouraging, never condescending
- NEVER say 'simply' or 'just' — these words make frustrated users feel stupid
- Include 'Pro tip:' callout boxes (use <blockquote class="pro-tip">) for 2-3 tips
- Format: Clean HTML with semantic tags

SEO KEYWORD: ${keyword}""", "Gemini prompt — Tutorial Article"))
story.append(sp(8))

story.append(code_block("""// PROMPT TYPE 4: Best-Of List Article
// Used when article_type = 'best-of'

You are a senior technology writer for a no-code platform review site.
Write a best-of list article: "${keyword}"

TOOLS IN OUR DATABASE (include only relevant ones, max 8):
${tools_list_summary}

REQUIREMENTS:
- Length: 1,600–2,000 words
- Structure: Introduction (what we're comparing, our methodology) |
  Quick Picks (summary table) | [Tool 1: detailed entry] × N | How We Chose |
  Bottom Line
- Each tool entry (H2 heading): 150-200 words covering best use case, standout feature,
  pricing summary, who it's NOT for, our rating
- Be specific about who each tool is best for — avoid generic descriptions
- Include a comparison table early in the article (HTML table)
- Verdict at end: clear recommendation for 3 types of readers
  (beginner / growing business / advanced user)
- Format: Clean HTML

SEO KEYWORD: ${keyword}
Last updated date to include: ${current_date}""", "Gemini prompt — Best-Of List"))
story.append(sp(10))

story.append(Paragraph("Quality gateway — JavaScript logic (n8n Code node)", h2))
story.append(code_block("""// Quality Gateway — runs on every generated article in Workflow 1 Node 8
// Returns: {pass: bool, fail_reasons: [], word_count: int}

const article = $input.first().json.article_text;
const keyword = $input.first().json.keyword;
const failReasons = [];

// 1. WORD COUNT CHECK
const wordCount = article.split(/\\s+/).filter(w => w.length > 0).length;
if (wordCount < 900) {
  failReasons.push(`Word count too low: ${wordCount} words (minimum 900)`);
}

// 2. BANNED PHRASES (generic AI filler)
const bannedPhrases = [
  "in today's digital landscape",
  "in the ever-evolving world of",
  "it's worth noting that",
  "as we can see",
  "in conclusion, it's clear that",
  "a comprehensive solution",
  "seamlessly integrates",
  "leverage the power of",
  "in this day and age",
  "needless to say",
  "game-changer",
  "at the end of the day",
  "moving forward",
  "it goes without saying",
  "when it comes to",
  "having said that",
  "in the realm of",
  "dive deep into",
  "unlock the potential",
  "take your [X] to the next level"
];

const lowerArticle = article.toLowerCase();
bannedPhrases.forEach(phrase => {
  if (lowerArticle.includes(phrase.toLowerCase())) {
    failReasons.push(`Banned phrase found: "${phrase}"`);
  }
});

// 3. KEYWORD PRESENCE
if (!lowerArticle.includes(keyword.toLowerCase())) {
  failReasons.push(`Target keyword not found in article: "${keyword}"`);
}

// 4. H2 HEADINGS PRESENT
const h2Count = (article.match(/<h2/gi) || []).length;
if (h2Count < 3) {
  failReasons.push(`Too few H2 headings: ${h2Count} (minimum 3)`);
}

// 5. MINIMUM PARAGRAPH LENGTH — no micro-paragraphs
const paragraphs = article.match(/<p>(.*?)<\\/p>/gi) || [];
const shortParas = paragraphs.filter(p => {
  const text = p.replace(/<[^>]+>/g, '');
  return text.split(' ').length < 20;
});
if (shortParas.length > 3) {
  failReasons.push(`Too many short paragraphs (under 20 words): ${shortParas.length}`);
}

// 6. HTML STRUCTURE VALID
if (!article.includes('<h2') || !article.includes('<p>')) {
  failReasons.push('Article lacks basic HTML structure (missing <h2> or <p> tags)');
}

// 7. NO PLACEHOLDER TEXT
const placeholders = ['[TOOL NAME]', '[INSERT', '[ADD', 'PLACEHOLDER', 'TODO:'];
placeholders.forEach(p => {
  if (article.toUpperCase().includes(p)) {
    failReasons.push(`Placeholder text found: "${p}"`);
  }
});

// 8. VERDICT/CONCLUSION PRESENT (reviews and comparisons)
if (['review', 'comparison'].includes($input.first().json.article_type)) {
  if (!lowerArticle.includes('verdict') && !lowerArticle.includes('bottom line') &&
      !lowerArticle.includes('conclusion')) {
    failReasons.push('Review/comparison article missing verdict or conclusion section');
  }
}

return [{
  json: {
    pass: failReasons.length === 0,
    fail_reasons: failReasons,
    word_count: wordCount,
    article_text: article,
    keyword: keyword
  }
}];""", "Quality Gateway JavaScript — n8n Code Node"))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 12 — INTERACTIVE TOOLS
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("12. Interactive Tools Specification", "4 tools — inputs, logic, outputs"))
story.append(sp(10))

story.append(sub_banner("Tool 1 — Platform Comparison Wizard"))
story.append(sp(6))
story.append(tbl([
    ["URL",           "/tools/quiz"],
    ["Purpose",       "Guides users to the right no-code platform based on their specific needs. Highest-converting page on the site."],
    ["State management","React useState. All answers stored in local state. No DB writes until result is shown (then optionally capture email)."],
    ["Steps",         "10 steps with progress bar (shows step X of 10). Back button on each step."],
    ["Scoring logic", "Each answer sets weights for: ease_required, feature_depth, ecommerce_need, budget_max, team_size. Score each tool in DB against weights. Top 3 by score = results."],
    ["Result display", "3 tool cards: match % (calculated score), 'Why it matches' (3-bullet list generated from their answers), rating, 'Read Review' link, 'Try Free' affiliate CTA."],
    ["Email capture",  "After results: 'Save your results — get our weekly tool digest' email input. Optional. POST /api/add-subscriber source='quiz-results'."],
    ["Affiliate tracking","Each 'Try Free' button click: POST /api/log-affiliate-click with article_id=null, page_url='/tools/quiz'."],
], cw=[W*0.20, W*0.80]))
story.append(sp(10))

story.append(sub_banner("Tool 2 — Pricing Calculator"))
story.append(sp(6))
story.append(code_block("""// Pricing Calculator Logic (React component)
// File: components/PricingCalculator.jsx

// INPUTS:
// - monthlyUsers: number (slider 0 – 100,000, step 1000)
// - teamMembers: number (slider 1 – 50)
// - features: string[] (checkboxes: ecommerce|api_access|white_label|
//                        custom_domain|priority_support|unlimited_pages)
// - selectedTools: string[] (tool slugs, multi-select, fetched from Supabase)

// LOGIC (runs on every input change — real-time):
function calculateCost(tool, monthlyUsers, teamMembers, selectedFeatures) {
  const tiers = tool.pricing_tiers; // from Supabase
  // Find cheapest tier that satisfies all selected features
  for (const tier of tiers.sort((a,b) => a.price_monthly - b.price_monthly)) {
    const tierFeatures = tier.features.map(f => f.toLowerCase());
    const hasAllFeatures = selectedFeatures.every(f =>
      tierFeatures.some(tf => tf.includes(f.replace('_',' ')))
    );
    // Also check user limits if present in tier
    const userLimit = tier.user_limit || Infinity;
    if (hasAllFeatures && userLimit >= monthlyUsers) {
      return {
        tool: tool.name,
        slug: tool.slug,
        affiliate_url: tool.affiliate_url,
        recommended_tier: tier.name,
        monthly_cost: tier.price_monthly,
        annual_cost: tier.price_annual || tier.price_monthly * 10,
        annual_savings: tier.price_monthly * 12 - (tier.price_annual || tier.price_monthly * 10)
      };
    }
  }
  // No matching tier found — return enterprise/custom
  return { tool: tool.name, recommended_tier: 'Custom/Enterprise', monthly_cost: null };
}

// OUTPUT TABLE:
// Columns: Tool | Recommended Plan | Monthly | Annual | Annual Savings | CTA
// Sort by monthly_cost ASC (cheapest first)
// Cheapest row: green background highlight + 'Best value' badge
// Null cost rows: show 'Contact sales' instead of price""",
    "Pricing Calculator — React logic"))
story.append(sp(10))

story.append(sub_banner("Tool 3 — Feature Matrix Builder"))
story.append(sp(6))
story.append(tbl([
    ["URL",          "/tools/compare"],
    ["Input",        "Multi-select dropdown (searchable). Fetches all tools from Supabase on mount. Allows selecting 2–4 tools."],
    ["Build action", "'Build Matrix' button. Disabled until 2+ tools selected."],
    ["Matrix rows",  "Overall Rating | Ease of Use | Features Score | Pricing Score | Support Score | "
                     "Free Plan | Starting Price | Best For | Ecommerce Support | API Access | "
                     "White Label | Team Collaboration | Integrations Count"],
    ["Data source",  "All data from tools table in Supabase. No external API calls."],
    ["Winner logic", "For each scored row, highlight the cell with the highest value in green. "
                     "For price rows: highlight lowest price in green."],
    ["Export",       "'Download as PNG' button. Uses html2canvas library to capture the table element. "
                     "Filename: 'nocode-comparison-[date].png'."],
    ["Deep link",    "URL updates to /tools/compare?tools=slug1,slug2,slug3 as tools are selected. "
                     "This URL can be shared and will pre-populate the comparison."],
    ["CTA",          "Below matrix: 'Read the full [Tool A] vs [Tool B] comparison' → /compare/[a-vs-b] "
                     "(if that comparison exists in DB, otherwise link to /tools/[a] and /tools/[b] respectively)"],
], cw=[W*0.18, W*0.82]))
story.append(sp(10))

story.append(sub_banner("Tool 4 — Should I Switch?"))
story.append(sp(6))
story.append(tbl([
    ["URL",          "/tools/should-i-switch"],
    ["Step 1",       "Current tool: searchable select from tools table. 'My tool isn't listed' option → text input."],
    ["Step 2",       "Pain points: multi-select checkboxes. Options: Too expensive | Missing [feature] | "
                     "Too complex to use | Poor customer support | Performance/scaling issues | "
                     "Sunsetting/shutting down | Just curious what else is out there"],
    ["Step 3",       "Priority ranking: drag-and-drop 5 items. Items: Price | Ease of use | Features | "
                     "Design quality | Customer support | Integrations. "
                     "Uses @dnd-kit/core for drag-and-drop. Top 3 ranked items get higher weight in scoring."],
    ["Step 4",       "Timeline: radio buttons. Options: I need to switch now | Within 3 months | "
                     "Just exploring my options | Not switching, just checking"],
    ["Scoring",      "For each tool in DB (excluding current tool): score based on how well it addresses "
                     "stated pain points + matches priority ranking. Weight: pain point match = 40%, "
                     "priority ranking match = 40%, overall rating = 20%."],
    ["Stay verdict", "If no tool scores >60% vs current tool's own scores on their priorities: "
                     "show 'Consider staying' verdict with reasons."],
    ["Switch verdict","Top 3 alternatives with: match score %, why it solves their pain points (1-2 sentences), "
                     "migration difficulty badge (Easy/Medium/Hard based on category similarity), "
                     "rating, 'Try free' affiliate CTA."],
    ["Migration guide link","If an article exists in DB with tags containing 'migrate-from-[current-tool-slug]': "
                     "show 'Read our full migration guide' link."],
], cw=[W*0.18, W*0.82]))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 13 — SEO CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("13. SEO Configuration", "Meta tags · Schema markup · Sitemap · IndexNow"))
story.append(sp(10))

story.append(Paragraph("Meta title formulas by page type", h2))
story.append(tbl([
    ["Homepage",         "{SITE NAME} — No-Code Platform Reviews, Comparisons & Rankings"],
    ["Tool Review",      "{Tool Name} Review 2026: Is It Worth It? ({Rating}/5) | {SITE NAME}"],
    ["Comparison",       "{Tool A} vs {Tool B} ({Year}): Which Is Better? | {SITE NAME}"],
    ["Category Index",   "Best {Category Name} Tools {Year} — Reviewed & Ranked | {SITE NAME}"],
    ["Best-Of List",     "{Article Title} ({Year}) | {SITE NAME}"],
    ["Blog Article",     "{Article Title} | {SITE NAME}"],
    ["Tools Index",      "All No-Code Tools — Complete Directory | {SITE NAME}"],
    ["Advertise",        "Advertise on {SITE NAME} — Reach {N} No-Code Builders"],
], headers=["Page","Title Formula"], cw=[W*0.25, W*0.75]))
story.append(sp(6))
story.append(note("All titles auto-truncated at 60 characters. If tool name + formula exceeds 60 chars, truncate tool name. Never truncate site name.", "info"))
story.append(sp(10))

story.append(Paragraph("JSON-LD Schema markup templates", h2))
story.append(code_block("""// SCHEMA 1: Tool Review Page — SoftwareApplication
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "${tool.name}",
  "url": "${tool.website_url}",
  "description": "${tool.tagline}",
  "applicationCategory": "WebApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "${lowest_paid_tier_price || 0}",
    "highPrice": "${highest_tier_price}",
    "priceCurrency": "USD",
    "offerCount": "${pricing_tiers.length}"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "${tool.rating_overall}",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "${approved_user_ratings_count}",
    "reviewCount": "${approved_user_ratings_count}"
  },
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "${tool.rating_overall}",
      "bestRating": "5"
    },
    "author": {
      "@type": "Organization",
      "name": "${SITE_NAME}"
    },
    "reviewBody": "${tool.verdict}"
  }
}""", "JSON-LD — SoftwareApplication (tool review pages)"))
story.append(sp(8))

story.append(code_block("""// SCHEMA 2: Article / Blog Post
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${article.title}",
  "description": "${article.seo_description || article.excerpt}",
  "url": "https://${SITE_URL}/blog/${article.slug}",
  "datePublished": "${article.published_at}",
  "dateModified": "${article.updated_at}",
  "author": {
    "@type": "Organization",
    "name": "${SITE_NAME}",
    "url": "https://${SITE_URL}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "${SITE_NAME}",
    "logo": {
      "@type": "ImageObject",
      "url": "https://${SITE_URL}/logo.png"
    }
  },
  "image": "${article.featured_image_url || SITE_DEFAULT_OG_IMAGE}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://${SITE_URL}/blog/${article.slug}"
  }
}

// SCHEMA 3: BreadcrumbList (all pages except homepage)
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home",      "item": "https://${SITE_URL}"},
    {"@type": "ListItem", "position": 2, "name": "${category}","item": "https://${SITE_URL}/category/${cat_slug}"},
    {"@type": "ListItem", "position": 3, "name": "${page_title}","item": "https://${SITE_URL}/${page_path}"}
  ]
}

// SCHEMA 4: FAQPage (comparison pages — add if article body has FAQ section)
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is ${tool_a} better than ${tool_b}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${comparison.winner_summary}"
      }
    }
  ]
}""", "JSON-LD — Article, Breadcrumb, FAQ schemas"))
story.append(sp(8))

story.append(Paragraph("Sitemap.xml structure", h2))
story.append(code_block("""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Static pages -->
  <url><loc>https://{SITE_URL}/</loc>
       <changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://{SITE_URL}/tools</loc>
       <changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://{SITE_URL}/blog</loc>
       <changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://{SITE_URL}/about</loc>
       <changefreq>monthly</changefreq><priority>0.3</priority></url>

  <!-- Dynamic: tool review pages — one entry per tool -->
  <!-- SELECT slug, updated_at FROM tools -->
  <url><loc>https://{SITE_URL}/tools/{slug}</loc>
       <lastmod>{updated_at}</lastmod>
       <changefreq>weekly</changefreq><priority>0.9</priority></url>

  <!-- Dynamic: comparison pages -->
  <!-- SELECT slug, updated_at FROM comparisons WHERE status='published' -->
  <url><loc>https://{SITE_URL}/compare/{slug}</loc>
       <lastmod>{updated_at}</lastmod>
       <changefreq>monthly</changefreq><priority>0.8</priority></url>

  <!-- Dynamic: article pages -->
  <!-- SELECT slug, updated_at FROM articles WHERE status='published' -->
  <url><loc>https://{SITE_URL}/blog/{slug}</loc>
       <lastmod>{updated_at}</lastmod>
       <changefreq>weekly</changefreq><priority>0.7</priority></url>

</urlset>

// Auto-regenerate this file on every:
// - New tool added (via /api/add-tool webhook)
// - New article published (via /api/publish-article webhook)
// - New comparison published (via admin dashboard publish action)""", "Sitemap.xml structure"))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 14 — EMAIL SYSTEM
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("14. Email System", "Resend setup · All templates · Sequences"))
story.append(sp(10))

story.append(Paragraph("Resend account setup", h2))
story.append(tbl([
    ["1. Create account",    "resend.com → Sign up → Verify email"],
    ["2. Add domain",        "Settings > Domains > Add Domain → enter your domain → add the 3 DNS records shown (SPF, DKIM, DMARC) in your domain registrar"],
    ["3. Verify domain",     "Wait 10–60 minutes for DNS propagation → click Verify in Resend dashboard"],
    ["4. Create API key",    "API Keys > Create API Key → name: 'Production' → copy key → add to RESEND_API_KEY env var"],
    ["5. Set from address",  "Verified domain allows any @yourdomain.com from address. Use: hello@yourdomain.com"],
    ["6. Test",              "Send a test email from Resend dashboard to confirm delivery"],
], cw=[W*0.22, W*0.78]))
story.append(sp(10))

story.append(Paragraph("Email templates", h2))
story.append(sp(4))

emails = [
    ("Double opt-in confirmation", "Sent immediately when user subscribes (before they are active)",
     """Subject: Confirm your subscription to [SITE NAME]
Preview: One click to get the weekly no-code digest

Hi there,

You signed up for the [SITE NAME] weekly digest — the no-code tool
reviews, comparisons, and guides that actually help you decide.

Click below to confirm your email address and get your first issue
this Sunday:

[CONFIRM MY SUBSCRIPTION] → https://yoursite.com/confirm?token={token}

This link expires in 48 hours.

If you didn't sign up, you can safely ignore this email.

— The [SITE NAME] Team

---
[SITE NAME] · yoursite.com · Privacy Policy · Unsubscribe"""),

    ("Welcome email (sent after confirmation)", "Sent when user clicks confirmation link",
     """Subject: Welcome to [SITE NAME] — here's your starter guide
Preview: The 5 no-code tools our readers use most

Welcome to [SITE NAME]!

You'll get our weekly digest every Sunday — no-code tool reviews,
comparison breakdowns, and practical guides.

While you wait for your first issue, here are 3 resources
our readers found most helpful this month:

1. [Most popular comparison article title]
   → yoursite.com/compare/[slug]

2. [Most popular tool review title]
   → yoursite.com/tools/[slug]

3. [Most popular tutorial title]
   → yoursite.com/blog/[slug]

[Browse all tools] → yoursite.com/tools

See you Sunday,
The [SITE NAME] Team

---
Manage preferences · Unsubscribe · Privacy Policy"""),

    ("Weekly newsletter template", "Sent every Sunday via n8n Workflow 2",
     """Subject: [This week's subject line — generated by Gemini]
Preview: [preview_text from newsletter_issues table]

━━━━━━━━━━━━━━━━━━━━━━━━━
[SITE NAME] Weekly Digest
Issue #{issue_number} · {date}
━━━━━━━━━━━━━━━━━━━━━━━━━

[INTRO — 100-150 words, generated by Gemini]

━━━ THIS WEEK'S TOP READS ━━━

📖 [Article 1 Title]
[Excerpt — 2 sentences]
[Read now →] yoursite.com/blog/[slug]

📖 [Article 2 Title]
[Excerpt — 2 sentences]
[Read now →] yoursite.com/blog/[slug]

📖 [Article 3 Title]
[Excerpt — 2 sentences]
[Read now →] yoursite.com/blog/[slug]

━━━ TOOL OF THE WEEK ━━━

⭐ [Top tool by affiliate clicks this week]
[One-sentence description]
[Read the review →] yoursite.com/tools/[slug]

━━━━━━━━━━━━━━━━━━━━━━━━━
[SITE NAME] · yoursite.com
You're getting this because you subscribed at [source].
Unsubscribe → yoursite.com/unsubscribe?token={token}"""),

    ("Sponsored slot renewal", "Sent 7 days before slot expiry via Workflow 6",
     """Subject: Your [SITE NAME] sponsored listing expires in 7 days
Preview: Renew to keep your placement

Hi {contact_name},

Your sponsored listing on [SITE NAME] is set to expire on {end_date}.

Your slot: {slot_position}
Current monthly fee: ${monthly_fee}
Readers reached this month: [N] (from analytics)

To renew for another month, simply reply to this email with 'RENEW'
and we'll send you a renewal invoice.

Alternatively, visit yoursite.com/advertise for current availability
and updated pricing.

Thanks for advertising with us,
[SITE NAME] Team

---
[SITE NAME] · yoursite.com · Unsubscribe from sponsor notifications"""),

    ("Admin alert — new tool submission", "Sent to RESEND_ADMIN_EMAIL when form submitted",
     """Subject: New tool submission: {tool_name}
Preview: Submitted by {contact_email}

New tool submission received:

Tool Name: {tool_name}
URL: {tool_url}
Category: {category}
Has affiliate program: {yes/no}
Affiliate URL: {affiliate_url}
Contact: {contact_email}

Description:
{description}

Pricing info:
{pricing_info}

Review in admin: yoursite.com/admin/submissions"""),
]

for title, trigger, template_text in emails:
    story.append(KeepTogether([
        Paragraph(title, h3),
        Paragraph(f"<i>Trigger: {trigger}</i>", bm),
        sp(4),
        code_block(template_text, "EMAIL TEMPLATE"),
        sp(10),
    ]))

story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 15 — AFFILIATE PROGRAMS
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("15. Affiliate Program Setup", "Programs · Links · Tracking · Disclosure"))
story.append(sp(10))
story.append(note("Apply to all programs before launch. Some (ShareASale, Impact) take 1–3 weeks to approve. Do not wait for approval to build the site — use placeholder links, swap in real affiliate links when approved.", "warn"))
story.append(sp(8))

story.append(tbl([
    ["Webflow",       "Webflow Affiliate Program (affiliates.webflow.com)", "50% of first year's subscription. ~$108–$216 per referral.", "High"],
    ["Shopify",       "Shopify Affiliate Program (shopify.com/affiliates)",  "$150 per merchant referral (flat). Apply via affiliate portal.", "Very High"],
    ["Wix",           "Impact (impact.com) — search 'Wix'",                 "$100 per Premium plan referral.", "Medium"],
    ["Squarespace",   "CJ Affiliate (cj.com) — search 'Squarespace'",       "$100–$200 per sale depending on plan.", "Medium"],
    ["Bubble",        "PartnerStack (partnerstack.com) — search 'Bubble'",  "~30% recurring. ~$30–$120/month per active referral.", "High"],
    ["Framer",        "Framer Affiliate (framer.com/affiliate)",             "20–30% recurring. Apply via their website.", "High"],
    ["Softr",         "PartnerStack — search 'Softr'",                      "30% recurring for 12 months.", "High"],
    ["Glide",         "PartnerStack — search 'Glide'",                      "Check current rates at signup.", "Medium"],
    ["Adalo",         "Impact — search 'Adalo'",                            "Direct affiliate program. Check rates.", "Medium"],
    ["Make (fmr Integromat)","PartnerStack — search 'Make'",               "20% recurring commission.", "High"],
    ["Airtable",      "Impact — search 'Airtable'",                        "Check current program rates.", "Medium"],
    ["Notion",        "Notion Affiliate (notion.so/affiliates)",            "Program availability varies. Check website.", "Low-Med"],
], headers=["Tool","Network & Link","Commission","Priority"], cw=[W*0.15,W*0.32,W*0.35,W*0.18]))
story.append(sp(10))

story.append(Paragraph("Affiliate link implementation", h2))
story.append(tbl([
    ["Storage",         "All affiliate URLs stored in tools.affiliate_url column in Supabase. Never hard-coded in templates."],
    ["Link format",     "All affiliate links open in new tab (target='_blank' rel='noopener noreferrer nofollow'). The nofollow attribute is required by FTC and SEO best practice."],
    ["Disclosure",      "All pages with affiliate links must show: 'Some links on this page are affiliate links. If you click through and make a purchase, we may earn a commission at no extra cost to you.' Display as a banner above the first affiliate link on each page, AND in page footer."],
    ["Click tracking",  "Every affiliate link click fires: POST /api/log-affiliate-click. Implemented as an onClick handler in React. Does not block navigation — fire and forget."],
    ["Link cloaking",   "Optional: use /go/[tool-slug] redirects that log click before redirecting to affiliate URL. Cleaner URLs, better tracking. Set up in Lovable as dynamic route that reads affiliate_url from DB and redirects."],
    ["UTM parameters",  "Append to all affiliate URLs: ?utm_source=nocodereviews&utm_medium=review&utm_campaign=[tool-slug]. Allows tracking in affiliate dashboards."],
    ["FTC compliance",  "Required by US law. Affiliate disclosure must be: (1) clear and conspicuous, (2) close to affiliate links, (3) on every page with affiliate links, (4) in plain language ('We earn a commission if you buy')."],
], cw=[W*0.20, W*0.80]))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 16 — ADMIN DASHBOARD
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("16. Admin Dashboard Specification", "Every section · Every action"))
story.append(sp(10))

story.append(tbl([
    ["/admin",                  "Dashboard home. Stats overview, recent activity feed, quick action buttons."],
    ["/admin/articles",         "Article management. Table view, filter by status/type, publish/unpublish/delete, edit form."],
    ["/admin/tools",            "Tool management. Table view, add/edit/delete, toggle featured/sponsored, upload logo."],
    ["/admin/keywords",         "Keyword queue. View pending/done/skipped, add keywords manually, set priorities, trigger generation."],
    ["/admin/subscribers",      "Subscriber list. Count stats, table view, filter active/pending, export CSV, delete."],
    ["/admin/analytics",        "Affiliate click analytics. Date range picker, charts, per-tool breakdown, export."],
    ["/admin/sponsored",        "Sponsored slot management. Current slots, add/edit, renewal alerts (yellow highlight <7 days)."],
    ["/admin/ratings",          "User rating moderation. Pending queue, approve/reject, view approved per tool."],
    ["/admin/submissions",      "Tool submission inbox. Review submissions, accept (creates tool draft), reject."],
    ["/admin/comparisons",      "Comparison management. Add/edit/delete comparisons, set winner, publish/unpublish."],
    ["/admin/newsletter",       "Newsletter management. View past issues, compose new issue, preview, send."],
], headers=["Route","Description"], cw=[W*0.28, W*0.72]))
story.append(sp(10))

story.append(Paragraph("Dashboard home (/admin) — stats cards", h2))
story.append(tbl([
    ["Total tools published",  "COUNT(*) FROM tools WHERE updated_at > 1970-01-01. Live count from DB."],
    ["Articles published",     "COUNT(*) FROM articles WHERE status='published'. With sub-count this month."],
    ["Active subscribers",     "COUNT(*) FROM subscribers WHERE active=true AND confirmed=true."],
    ["Affiliate clicks (30d)", "COUNT(*) FROM affiliate_clicks WHERE clicked_at > now()-30days. With trend vs prior 30d."],
    ["Keyword queue depth",    "COUNT(*) FROM keyword_queue WHERE status='pending'. With 'Generate next' button."],
    ["Sponsored revenue",      "SUM(monthly_fee) FROM sponsored_slots WHERE active=true AND end_date >= today."],
], cw=[W*0.30, W*0.70]))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 17 — MONETISATION CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("17. Monetisation Configuration", "Sponsored slots · Ads · Pricing tiers"))
story.append(sp(10))

story.append(Paragraph("Sponsored listing slot configuration", h2))
story.append(tbl([
    ["homepage-1",    "Tool card in position 1 of homepage grid. Most visible. Labelled 'SPONSORED'."],
    ["homepage-4",    "Tool card in position 4 of homepage grid. Above the fold on most screens."],
    ["category-top",  "Top card in any category index page. Rotates to relevant category."],
    ["sidebar",       "Sticky sidebar unit on tool review pages (desktop only). Tool logo + tagline + CTA."],
    ["newsletter",    "Single sponsor mention in weekly newsletter. Logo + 1-sentence description + link."],
], headers=["Slot ID","Description & Placement"], cw=[W*0.22, W*0.78]))
story.append(sp(6))

story.append(Paragraph("Sponsored slot pricing tiers", h2))
story.append(tbl([
    ["0–2,000 visitors/month",   "$99–199 /slot/month"],
    ["2,000–10,000/month",       "$199–499 /slot/month"],
    ["10,000–50,000/month",      "$499–999 /slot/month"],
    ["50,000–200,000/month",     "$999–2,000 /slot/month"],
    ["200,000+/month",           "$2,000–5,000 /slot/month"],
    ["Newsletter sponsorship",   "Flat $200–800 /issue (scales with subscriber count)"],
    ["Network-wide package",     "Custom pricing — all 10 sites, contact for rates"],
], headers=["Traffic Level","Price Range"], cw=[W*0.35, W*0.65]))
story.append(sp(10))

story.append(Paragraph("Display ad network setup", h2))
story.append(tbl([
    ["Google AdSense",  "Apply at adsense.google.com. Requires: 6+ months old domain (or established content), original content, privacy policy page. Approval: 1–4 weeks. RPM: $2–8. Use on launch until threshold for premium networks. Place: after article paragraph 3, sidebar, footer above."],
    ["Mediavine",       "Apply at mediavine.com/get-started. Minimum: 50,000 sessions/month (last 30 days, verified via GA4). Apply as soon as you hit the threshold. RPM: $15–25 in tech niche. Replace AdSense on approval."],
    ["Raptive",         "Apply at raptive.com. Minimum: 100,000 pageviews/month. RPM: $20–35 in tech niche. Premium option once traffic scales."],
    ["Ad placement rules","Never more than 1 ad per screen height. No ads on /admin pages. No ads on interactive tool pages (damages UX). Ads on: article pages, tool review pages, blog index, category pages."],
], headers=["Network","Setup & Notes"], cw=[W*0.18, W*0.82]))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 18 — PERFORMANCE & SECURITY
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("18. Performance & Security", "Caching · Rate limits · Auth · GDPR"))
story.append(sp(10))

story.append(tbl([
    ["Tool list caching",    "Cache Supabase tool list queries for 5 minutes. Bust cache on any tool add/update via webhook. Implement in Lovable using React Query or SWR with staleTime: 300000."],
    ["Image optimisation",   "All tool logos: WebP format, max 80x80px for cards, 160x160 for review pages. Use Supabase Storage for logo hosting. Serve via CDN. Add explicit width + height attributes to all img tags to prevent CLS."],
    ["Lazy loading",         "All images below the fold: loading='lazy'. Tool grid: load first 12 eagerly, rest lazily. Newsletter images: all lazy."],
    ["Database query limits","Never fetch unbounded queries. Always add LIMIT clause. Max 100 rows in any single query. Paginate all list views."],
    ["Rate limiting",        "API endpoints: max 20 requests/minute per IP. Webhook endpoints: only accept from known n8n IP ranges (or rely on secret header). Email signup: 1 submission per email per 24h."],
    ["Webhook authentication","Every webhook endpoint validates: (1) X-Webhook-Secret header matches env var, (2) Content-Type is application/json, (3) Body is valid JSON. Return 401 on auth fail, 400 on invalid body."],
    ["Supabase RLS",         "Row Level Security enabled on all tables. Public can only SELECT published content. Only authenticated admin can INSERT/UPDATE/DELETE. Service role key used only in server-side webhook handlers, never in client code."],
    ["Admin auth",           "Supabase Auth. Email + password. No social login. Session expires 24 hours. Protect all /admin routes with auth middleware. Redirect to /admin/login if no session."],
    ["GDPR compliance",      "Privacy policy page at /privacy. Cookie consent banner on first visit. GA4 only loads after consent. Subscriber data: email, subscribed_at only — no PII beyond email. Right to erasure: delete subscriber endpoint in admin. Data processing disclosure in privacy policy."],
    ["HTTPS",                "Lovable provides HTTPS by default on custom domains. Ensure HTTP→HTTPS redirect is active. Set HSTS header."],
], headers=["Area","Specification"], cw=[W*0.22, W*0.78]))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 19 — LAUNCH CHECKLIST
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("19. Launch Checklist", "Pre-launch · Launch day · Post-launch"))
story.append(sp(10))

story.append(sub_banner("Pre-launch (complete before going live)"))
story.append(sp(6))
pre_launch = [
    "Purchase and configure expired domain (DR 30+ recommended)",
    "Create Supabase project, run all SQL from Section 4",
    "Set all environment variables in Lovable (Section 7)",
    "Run main Lovable prompt (Section 5) — verify all 12 pages build correctly",
    "Run all 10 follow-up prompts (Section 6) in order",
    "Connect Supabase to Lovable — verify tool grid loads from DB",
    "Add initial 8+ tools to Supabase tools table manually (or via /admin/tools)",
    "Add initial 20+ keywords to keyword_queue table for article generation bootstrap",
    "Set up Resend account, verify domain, configure RESEND_API_KEY",
    "Test all 5 email templates via Resend test send",
    "Create n8n account, configure all 6 workflows from Section 10",
    "Test Workflow 1 manually: trigger article generation, verify quality gateway, verify publish",
    "Test /api/publish-article webhook with Postman/Hoppscotch",
    "Test /api/add-subscriber webhook — verify confirmation email sends",
    "Test /api/log-affiliate-click webhook — verify DB insert",
    "Apply to all affiliate programs from Section 15",
    "Add affiliate_url to all 8+ initial tools (use placeholder /advertise link if not yet approved)",
    "Configure Google Analytics 4: create property, get Measurement ID, add to env vars",
    "Add site to Google Search Console, submit sitemap.xml",
    "Create robots.txt: allow all, disallow /admin",
    "Create IndexNow key file at /{INDEXNOW_KEY}.txt",
    "Verify all 4 interactive tools work: quiz, pricing calc, matrix builder, should-i-switch",
    "Test mobile navigation on real device (iPhone + Android)",
    "Run Lighthouse audit: target 90+ on Performance, 100 on SEO, 90+ on Accessibility",
    "Test dark mode toggle — verify persists to localStorage",
    "Verify admin dashboard: login, article management, tool management all functional",
    "Add privacy policy content to /privacy page",
    "Add affiliate disclosure content to /about and /disclosure pages",
    "Verify cookie consent banner appears on first visit, GA4 only loads after acceptance",
    "Set up Supabase backups: enable Point-in-Time Recovery in Supabase dashboard",
]
for item in pre_launch:
    story.append(Paragraph(f"☐  {item}", S("cl", fontSize=9.5, leading=14, fontName="Helvetica",
                                             textColor=INK, leftIndent=6, spaceBefore=2, spaceAfter=2)))
story.append(sp(10))

story.append(sub_banner("Launch day"))
story.append(sp(6))
launch = [
    "Point domain DNS to Lovable hosting (follow Lovable's custom domain guide)",
    "Wait for DNS propagation (10 min – 48 hours). Test at dnschecker.org",
    "Verify HTTPS is active and HTTP redirects to HTTPS",
    "Submit sitemap to Google Search Console: Search Console > Sitemaps > Add sitemap",
    "Ping IndexNow for all existing tool and article URLs",
    "Enable n8n workflows — set all 6 to Active",
    "Post in r/nocode, r/SideProject, r/entrepreneur: 'I built an honest no-code tool review site — looking for feedback'",
    "Post to Twitter/X, LinkedIn with site link",
    "Submit to Product Hunt (schedule for a Tuesday or Wednesday, 12:01 AM PST)",
    "Submit to These Are Things (newsletter), Sidebar.io, and relevant no-code communities",
    "Email 5–10 no-code tool companies offering sponsored listing slots ($99–199/month at launch traffic)",
    "Verify article generation is running: check articles table for new entries after 6 hours",
    "Monitor Supabase logs for any errors in the first 24 hours",
]
for item in launch:
    story.append(Paragraph(f"☐  {item}", S("ld", fontSize=9.5, leading=14, fontName="Helvetica",
                                             textColor=INK, leftIndent=6, spaceBefore=2, spaceAfter=2)))
story.append(sp(10))

story.append(sub_banner("Post-launch (ongoing first 30 days)"))
story.append(sp(6))
post = [
    "Check Google Search Console weekly: verify pages are being indexed, no coverage errors",
    "Monitor article quality weekly: read 5 random generated articles for quality gate drift",
    "Expand tool database: add 5+ new tools per week until reaching 50 tools",
    "Apply to remaining affiliate programs as they approve applications",
    "Swap placeholder affiliate links with real approved links as programs approve",
    "When first subscriber signs up, verify entire email sequence fires correctly",
    "Set up Mediavine application reminder for when site hits 50,000 sessions/month",
    "Run competitor analysis: check rankings for target keywords from Section 13 monthly",
    "Review keyword queue weekly: add new keywords based on what's working",
    "Build first 3 comparison pages manually (highest-value keyword comparisons)",
]
for item in post:
    story.append(Paragraph(f"☐  {item}", S("pl2", fontSize=9.5, leading=14, fontName="Helvetica",
                                             textColor=INK, leftIndent=6, spaceBefore=2, spaceAfter=2)))
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 20 — ONGOING OPERATIONS
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_banner("20. Ongoing Operations", "What the swarm handles vs what you handle"))
story.append(sp(10))

story.append(Paragraph("What runs automatically (zero manual effort)", h2))
story.append(tbl([
    ["Daily",   "Article generation (4 articles). Keyword queue refresh from GSC. Affiliate click logging. Sponsored slot expiry checks."],
    ["Weekly",  "Newsletter send (Sunday). Pricing monitor (Monday). Subscriber count update. Sitemap regeneration."],
    ["On-event","IndexNow ping on publish. Interlink agent on publish. Confirmation email on signup. Renewal email 7 days before slot expiry. Admin alert on new tool submission."],
], headers=["Frequency","Automated Task"], cw=[W*0.15, W*0.85]))
story.append(sp(10))

story.append(Paragraph("Your weekly tasks (estimated 5–10 hours/week)", h2))
story.append(tbl([
    ["Quality audit",          "Read 10 randomly selected generated articles. Flag any that passed the quality gateway but feel thin or off-brand. Add new banned phrases to the quality gateway list as patterns emerge. Time: 45 min."],
    ["Tool database expansion","Add 3–5 new tools per week. Use /admin/tools form. Prioritise tools with: existing search volume, affiliate programs, high relevance to site audience. Time: 60 min."],
    ["Keyword queue curation", "Review keyword_queue in admin. Add manually discovered keywords. Adjust priorities based on what's ranking. Remove irrelevant auto-added keywords. Time: 30 min."],
    ["Affiliate link updates",  "Check for newly approved affiliate programs. Update tools.affiliate_url in admin. Check existing links haven't expired or changed. Time: 20 min."],
    ["Outreach",               "Cold email 3–5 no-code tool companies per week offering sponsored listings. Template: 'We are [SITE NAME], a growing no-code tool review site reaching [N] builders/month. We have a sponsored listing slot open at $[X]/month. Interested?' Time: 30 min."],
    ["Backlink building",      "Find 2–3 no-code bloggers or newsletter authors per week. Offer guest post or mention swap. Even 1 quality backlink/week = massive long-term value. Time: 60 min."],
    ["Analytics review",       "Check GSC weekly: any new rankings, any pages losing position? Check /admin/analytics: which tools are getting clicks, which articles drive most affiliate revenue? Time: 30 min."],
], headers=["Task","Description"], cw=[W*0.22, W*0.78]))
story.append(sp(10))

story.append(Paragraph("Monthly tasks (estimated 3–4 hours)", h2))
story.append(tbl([
    ["Gemini voice audit",      "Pull 20 articles from the last month. Check for voice drift — do they all sound different from each other? If patterns detected, update Gemini system prompts with new banned patterns."],
    ["Pricing accuracy check",  "Manually verify pricing for top 10 most-viewed tool reviews against actual pricing pages. Update any that are wrong immediately — outdated pricing destroys trust."],
    ["Competitor gap analysis", "Check top 5 competitor sites' newest content. Identify any topic gaps — are they covering something you haven't? Add to keyword queue."],
    ["Revenue review",          "Total affiliate earnings by program. Total sponsored revenue. Display ad RPM trends. Identify which tools/articles drive most revenue and prioritise similar content."],
    ["Update site stats",       "Update traffic stats on /advertise page. More accurate numbers = higher sponsored slot conversion. Update subscriber count, monthly readers count."],
], headers=["Task","Description"], cw=[W*0.22, W*0.78]))
story.append(sp(12))

# Final statement
final = Table([[
    Paragraph(
        '<font color="white"><b>This document is complete.</b> Every element required to build, '
        'launch, and run Site 1 autonomously is contained in these 20 sections. '
        'Follow the build order in Section 1. '
        'When Site 1 reaches 5,000 monthly visitors, the same framework repeats for Sites 2–10.</font>',
        S("fin", fontSize=10, leading=16, fontName="Helvetica", textColor=WHITE))
]], colWidths=[W])
final.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), INK),
    ("LEFTPADDING",  (0,0),(-1,-1), 24),
    ("RIGHTPADDING", (0,0),(-1,-1), 24),
    ("TOPPADDING",   (0,0),(-1,-1), 16),
    ("BOTTOMPADDING",(0,0),(-1,-1), 16),
    ("ROUNDEDCORNERS",[5]),
]))
story.append(final)

# ─────────────────────────────────────────────────────────────────────────────
# BUILD
# ─────────────────────────────────────────────────────────────────────────────
def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(0.75*inch, 0.40*inch, "Site 1 — No-Code Platform Reviews — Complete Build Specification")
    canvas.drawRightString(letter[0]-0.75*inch, 0.40*inch, f"Page {doc.page}")
    canvas.restoreState()

out = "/mnt/user-data/outputs/site1_complete_build_spec.pdf"
doc = SimpleDocTemplate(
    out, pagesize=letter,
    rightMargin=0.75*inch, leftMargin=0.75*inch,
    topMargin=0.75*inch,   bottomMargin=0.75*inch,
    title="Site 1 — No-Code Platform Reviews — Complete Build Specification"
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(f"Done → {out}")
