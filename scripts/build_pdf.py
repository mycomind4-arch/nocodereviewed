from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import Flowable
import re

# ── Colours ──────────────────────────────────────────────────────────────────
BLACK       = colors.HexColor("#0A0A0A")
DARK_GRAY   = colors.HexColor("#1A1A1A")
MID_GRAY    = colors.HexColor("#4A4A4A")
LIGHT_GRAY  = colors.HexColor("#F4F4F4")
RULE_GRAY   = colors.HexColor("#DDDDDD")
ACCENT      = colors.HexColor("#1A1A2E")   # deep navy — professional dark
ACCENT2     = colors.HexColor("#16213E")
INFO_BG     = colors.HexColor("#EEF2F7")
INFO_BORDER = colors.HexColor("#7A9CC4")
WARN_BG     = colors.HexColor("#FFF8EC")
WARN_BORDER = colors.HexColor("#E0A030")
CRIT_BG     = colors.HexColor("#FEF0EE")
CRIT_BORDER = colors.HexColor("#CC4433")
WHITE       = colors.white
TABLE_HEAD  = colors.HexColor("#1A1A2E")
TABLE_ALT   = colors.HexColor("#F7F9FC")
CODE_BG     = colors.HexColor("#1E1E2E")
CODE_FG     = colors.HexColor("#CDD6F4")

W = letter[0] - 1.5*inch   # content width (0.75" margins each side)

# ── Styles ────────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def S(name, **kw):
    return ParagraphStyle(name, **kw)

COVER_TITLE = S("CoverTitle",
    fontName="Helvetica-Bold", fontSize=38, leading=44,
    textColor=WHITE, alignment=TA_LEFT, spaceAfter=8)

COVER_SUB = S("CoverSub",
    fontName="Helvetica", fontSize=13, leading=18,
    textColor=colors.HexColor("#AABBCC"), alignment=TA_LEFT, spaceAfter=4)

COVER_META = S("CoverMeta",
    fontName="Helvetica", fontSize=9, leading=13,
    textColor=colors.HexColor("#8899AA"), alignment=TA_LEFT)

CONFIDENTIAL = S("Confidential",
    fontName="Helvetica-Bold", fontSize=7.5, leading=10,
    textColor=colors.HexColor("#667788"), alignment=TA_LEFT,
    spaceAfter=0, spaceBefore=0)

RUNNING_HEADER = S("RunningHeader",
    fontName="Helvetica", fontSize=7, leading=9,
    textColor=colors.HexColor("#888888"), alignment=TA_CENTER)

SECTION_NUM = S("SectionNum",
    fontName="Helvetica-Bold", fontSize=8, leading=10,
    textColor=INFO_BORDER, spaceBefore=28, spaceAfter=2)

H1 = S("H1",
    fontName="Helvetica-Bold", fontSize=18, leading=22,
    textColor=BLACK, spaceBefore=4, spaceAfter=10)

H2 = S("H2",
    fontName="Helvetica-Bold", fontSize=12, leading=15,
    textColor=BLACK, spaceBefore=16, spaceAfter=5)

H3 = S("H3",
    fontName="Helvetica-Bold", fontSize=10, leading=13,
    textColor=MID_GRAY, spaceBefore=12, spaceAfter=4)

BODY = S("Body",
    fontName="Helvetica", fontSize=9.5, leading=14.5,
    textColor=DARK_GRAY, spaceAfter=7, alignment=TA_JUSTIFY)

BODY_TIGHT = S("BodyTight",
    fontName="Helvetica", fontSize=9, leading=13,
    textColor=DARK_GRAY, spaceAfter=4)

BULLET = S("Bullet",
    fontName="Helvetica", fontSize=9.5, leading=14,
    textColor=DARK_GRAY, spaceAfter=3,
    leftIndent=18, firstLineIndent=0)

SUB_BULLET = S("SubBullet",
    fontName="Helvetica", fontSize=9, leading=13,
    textColor=MID_GRAY, spaceAfter=2,
    leftIndent=36, firstLineIndent=0)

LABEL = S("Label",
    fontName="Helvetica-Bold", fontSize=8, leading=11,
    textColor=colors.HexColor("#556677"), spaceAfter=2, spaceBefore=8)

INFO_BODY = S("InfoBody",
    fontName="Helvetica", fontSize=9, leading=13.5,
    textColor=colors.HexColor("#2A3A4A"), spaceAfter=0)

WARN_BODY = S("WarnBody",
    fontName="Helvetica", fontSize=9, leading=13.5,
    textColor=colors.HexColor("#5A3A00"), spaceAfter=0)

CRIT_BODY = S("CritBody",
    fontName="Helvetica", fontSize=9, leading=13.5,
    textColor=colors.HexColor("#5A1A0A"), spaceAfter=0)

CODE_STYLE = S("Code",
    fontName="Courier", fontSize=8, leading=12,
    textColor=CODE_FG, spaceAfter=0, leftIndent=0)

TOC_SECTION = S("TocSection",
    fontName="Helvetica-Bold", fontSize=9, leading=14,
    textColor=BLACK)

TOC_BODY = S("TocBody",
    fontName="Helvetica", fontSize=9, leading=14,
    textColor=MID_GRAY, leftIndent=12)

# ── Custom flowables ───────────────────────────────────────────────────────────

class ColoredBox(Flowable):
    """A full-width colored callout box."""
    def __init__(self, text, bg, border, label="INFO", style=None):
        super().__init__()
        self.text = text
        self.bg = bg
        self.border = border
        self.label = label
        self.style = style or INFO_BODY
        self.width = W
        self._para = None

    def _make_para(self):
        if not self._para:
            self._para = Paragraph(self.text, self.style)
        return self._para

    def wrap(self, availWidth, availHeight):
        inner_w = self.width - 0.35*inch
        _, ph = self._make_para().wrap(inner_w, availHeight)
        label_h = 12
        self.box_height = ph + label_h + 16
        return self.width, self.box_height

    def draw(self):
        c = self.canv
        bw = 3
        c.setFillColor(self.bg)
        c.setStrokeColor(self.border)
        c.setLineWidth(bw)
        c.roundRect(bw/2, bw/2, self.width - bw, self.box_height - bw, 4, fill=1, stroke=1)
        # Label
        c.setFont("Helvetica-Bold", 7.5)
        c.setFillColor(self.border)
        c.drawString(12, self.box_height - 16, self.label)
        # Body text
        p = self._make_para()
        p.wrap(self.width - 0.35*inch, self.box_height)
        p.drawOn(c, 12, self.box_height - 16 - p.height - 2)


class CodeBlock(Flowable):
    """Dark-background monospace code block."""
    def __init__(self, text):
        super().__init__()
        self.lines = text.split('\n')
        self.width = W

    def wrap(self, availWidth, availHeight):
        self.box_height = len(self.lines) * 12 + 20
        return self.width, self.box_height

    def draw(self):
        c = self.canv
        c.setFillColor(CODE_BG)
        c.setStrokeColor(colors.HexColor("#333355"))
        c.setLineWidth(1)
        c.roundRect(0, 0, self.width, self.box_height, 4, fill=1, stroke=1)
        c.setFont("Courier", 8)
        c.setFillColor(CODE_FG)
        y = self.box_height - 16
        for line in self.lines:
            c.drawString(12, y, line)
            y -= 12


class CoverPage(Flowable):
    """Full dark cover page."""
    def __init__(self, w, h):
        super().__init__()
        self.pw = w
        self.ph = h

    def wrap(self, aw, ah):
        return self.pw, self.ph

    def draw(self):
        c = self.canv
        # Background
        c.setFillColor(ACCENT2)
        c.rect(0, 0, self.pw, self.ph, fill=1, stroke=0)
        # Top accent bar
        c.setFillColor(colors.HexColor("#2A4A8A"))
        c.rect(0, self.ph - 0.18*inch, self.pw, 0.18*inch, fill=1, stroke=0)
        # Side accent
        c.setFillColor(colors.HexColor("#2A4A8A"))
        c.rect(0, 0, 0.22*inch, self.ph, fill=1, stroke=0)
        # Label
        c.setFont("Helvetica-Bold", 7.5)
        c.setFillColor(colors.HexColor("#7A9CC4"))
        c.drawString(0.5*inch, self.ph - 0.55*inch, "AUTONOMOUS CONTENT STACK")
        # Title
        c.setFont("Helvetica-Bold", 34)
        c.setFillColor(WHITE)
        c.drawString(0.5*inch, self.ph - 1.35*inch, "AUTONOMOUS")
        c.setFont("Helvetica-Bold", 28)
        c.setFillColor(colors.HexColor("#7AABDD"))
        c.drawString(0.5*inch, self.ph - 1.82*inch, "Monetization")
        c.setFont("Helvetica-Bold", 28)
        c.setFillColor(WHITE)
        c.drawString(0.5*inch, self.ph - 2.22*inch, "Engine")
        # Divider
        c.setStrokeColor(colors.HexColor("#2A4A8A"))
        c.setLineWidth(1.5)
        c.line(0.5*inch, self.ph - 2.55*inch, self.pw - 0.5*inch, self.ph - 2.55*inch)
        # Tagline
        c.setFont("Helvetica", 11)
        c.setFillColor(colors.HexColor("#9ABEDC"))
        c.drawString(0.5*inch, self.ph - 2.85*inch,
                     "Drop this into any Lovable project running the Content Engine.")
        c.drawString(0.5*inch, self.ph - 3.08*inch,
                     "It tracks every click, scores every offer, and tells you")
        c.drawString(0.5*inch, self.ph - 3.30*inch,
                     "exactly where the money is and where it should be.")
        # Stats row
        stats = [
            ("2–3", "Lovable credits"),
            ("0", "New API keys"),
            ("$0/mo", "New ongoing cost"),
            ("0", "Daily intervention"),
        ]
        sx = 0.5*inch
        sy = self.ph - 4.3*inch
        bw = (self.pw - 1.0*inch) / len(stats) - 0.12*inch
        for val, label in stats:
            c.setFillColor(colors.HexColor("#162030"))
            c.setStrokeColor(colors.HexColor("#2A4A8A"))
            c.setLineWidth(1)
            c.roundRect(sx, sy, bw, 0.75*inch, 5, fill=1, stroke=1)
            c.setFont("Helvetica-Bold", 20)
            c.setFillColor(colors.HexColor("#7AABDD"))
            c.drawCentredString(sx + bw/2, sy + 0.38*inch, val)
            c.setFont("Helvetica", 7.5)
            c.setFillColor(colors.HexColor("#7A8A9A"))
            c.drawCentredString(sx + bw/2, sy + 0.2*inch, label)
            sx += bw + 0.12*inch
        # Meta block
        meta_y = self.ph - 5.5*inch
        meta = [
            ("Version", "1.0 — Stupid People Edition"),
            ("Prepared", "May 2026"),
            ("Compatibility", "Any Lovable project with the Content Engine installed"),
            ("Pairs with", "Content Engine v2.0, pSEO Engine v1.0, Quality Gateway v1.0,"),
            ("", "Smart Admin Dashboard v1.1"),
            ("Classification", "Confidential"),
        ]
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(colors.HexColor("#556677"))
        c.drawString(0.5*inch, meta_y, "DOCUMENT DETAILS")
        c.setStrokeColor(colors.HexColor("#2A4A8A"))
        c.setLineWidth(0.5)
        c.line(0.5*inch, meta_y - 4, self.pw - 0.5*inch, meta_y - 4)
        my = meta_y - 18
        for key, val in meta:
            if key:
                c.setFont("Helvetica-Bold", 8)
                c.setFillColor(colors.HexColor("#7A9CC4"))
                c.drawString(0.5*inch, my, key)
            c.setFont("Helvetica", 8)
            c.setFillColor(colors.HexColor("#AABBCC"))
            c.drawString(1.4*inch, my, val)
            my -= 14
        # Footer
        c.setFont("Helvetica", 7)
        c.setFillColor(colors.HexColor("#445566"))
        footer = "AUTONOMOUS MONETIZATION ENGINE · STUPID PEOPLE EDITION · CONFIDENTIAL  ·  Drop this document into any Lovable project to activate revenue intelligence."
        c.drawCentredString(self.pw/2, 0.3*inch, footer)


# ── Table helpers ─────────────────────────────────────────────────────────────

def make_table(headers, rows, col_widths=None, zebra=True):
    data = [[Paragraph(f"<b>{h}</b>", S("TH", fontName="Helvetica-Bold", fontSize=8,
                        leading=11, textColor=WHITE)) for h in headers]]
    for i, row in enumerate(rows):
        data.append([Paragraph(str(cell), S(f"TD{i}", fontName="Helvetica",
                     fontSize=8.5, leading=12, textColor=DARK_GRAY)) for cell in row])

    if col_widths is None:
        col_widths = [W / len(headers)] * len(headers)

    style = [
        ("BACKGROUND", (0,0), (-1,0), TABLE_HEAD),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, TABLE_ALT] if zebra else [WHITE]),
        ("GRID", (0,0), (-1,-1), 0.5, RULE_GRAY),
        ("LEFTPADDING", (0,0), (-1,-1), 8),
        ("RIGHTPADDING", (0,0), (-1,-1), 8),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
    ]
    return Table(data, colWidths=col_widths, style=TableStyle(style), hAlign="LEFT")


def rule():
    return HRFlowable(width="100%", thickness=0.5, color=RULE_GRAY, spaceAfter=8, spaceBefore=4)

def sp(n=6):
    return Spacer(1, n)

def info(text):
    return KeepTogether([sp(4), ColoredBox(text, INFO_BG, INFO_BORDER, "INFO", INFO_BODY), sp(8)])

def warn(text):
    return KeepTogether([sp(4), ColoredBox(text, WARN_BG, WARN_BORDER, "IMPORTANT", WARN_BODY), sp(8)])

def crit(text):
    return KeepTogether([sp(4), ColoredBox(text, CRIT_BG, CRIT_BORDER, "CRITICAL", CRIT_BODY), sp(8)])

def code(text):
    return KeepTogether([sp(4), CodeBlock(text.strip()), sp(8)])

def h1(text):
    return Paragraph(text, H1)

def h2(text):
    return Paragraph(text, H2)

def h3(text):
    return Paragraph(text, H3)

def p(text):
    return Paragraph(text, BODY)

def bullet(text, sub=False):
    prefix = "•  " if not sub else "–  "
    return Paragraph(f"{prefix}{text}", SUB_BULLET if sub else BULLET)

def section(num, title):
    return KeepTogether([
        sp(8),
        Paragraph(f"SECTION {num:02d}", SECTION_NUM),
        Paragraph(title, H1),
        rule(),
        sp(4),
    ])


# ── Page template (header/footer) ─────────────────────────────────────────────

def on_page(canvas, doc):
    if doc.page == 1:
        return   # cover has its own design
    canvas.saveState()
    pw, ph = letter
    # Header rule
    canvas.setStrokeColor(RULE_GRAY)
    canvas.setLineWidth(0.5)
    canvas.line(0.6*inch, ph - 0.5*inch, pw - 0.6*inch, ph - 0.5*inch)
    canvas.setFont("Helvetica", 6.5)
    canvas.setFillColor(colors.HexColor("#999999"))
    canvas.drawString(0.6*inch, ph - 0.42*inch, "AUTONOMOUS MONETIZATION ENGINE · STUPID PEOPLE EDITION · CONFIDENTIAL")
    canvas.drawRightString(pw - 0.6*inch, ph - 0.42*inch,
                           "Drop this document into any Lovable project to activate revenue intelligence.")
    # Footer
    canvas.line(0.6*inch, 0.5*inch, pw - 0.6*inch, 0.5*inch)
    canvas.drawCentredString(pw/2, 0.32*inch, f"Page {doc.page - 1}")
    canvas.restoreState()


# ── Build document ─────────────────────────────────────────────────────────────

OUTPUT = "/mnt/user-data/outputs/autonomous_monetization_engine_v1_0.pdf"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=0.6*inch,
    rightMargin=0.6*inch,
    topMargin=0.7*inch,
    bottomMargin=0.65*inch,
    title="Autonomous Monetization Engine v1.0",
    author="Stupid People Edition",
)

story = []

# ── COVER PAGE ────────────────────────────────────────────────────────────────
pw, ph = letter
story.append(CoverPage(pw, ph))
story.append(PageBreak())

# ── CONTENTS ──────────────────────────────────────────────────────────────────
story.append(sp(8))
story.append(Paragraph("Contents", H1))
story.append(rule())
story.append(sp(4))

toc_items = [
    ("01", "What This Is", "The revenue layer the other specs don't cover"),
    ("02", "Architecture Overview", "Four layers, two output streams"),
    ("03", "Layer 1 — Track", "Click attribution, revenue entry, offer monitoring"),
    ("04", "Layer 2 — Score", "Revenue Efficiency Score, gap detection"),
    ("05", "Layer 3 — Optimize", "Offer priority, keyword injection, sponsor pipeline"),
    ("06", "Layer 4 — Report", "Daily revenue brief, weekly summary"),
    ("07", "Admin Panel Additions", "Five-tab MONETIZATION section"),
    ("08", "Integration with Existing Specs", "All four integration points per engine"),
    ("09", "Database Schema", "All tables created or extended"),
    ("10", "Activation Prompt", "Copy, paste, walk away"),
    ("11", "Setup — Three Questions", "Target, model, sponsor readiness"),
    ("12", "Troubleshooting", "Common issues and fixes"),
]

for num, title, desc in toc_items:
    story.append(Paragraph(f"<b>{num}  {title}</b>", TOC_SECTION))
    story.append(Paragraph(desc, TOC_BODY))
    story.append(sp(2))

story.append(PageBreak())

# ── SECTION 01 ────────────────────────────────────────────────────────────────
story.append(section(1, "What This Is"))

story.append(p("The existing stack generates content, assembles SEO pages, enforces quality, and reports on its own health. None of it knows whether the content is making money — or why."))
story.append(p("The affiliate link system in the Content Engine is a table of URLs. It inserts links. It does not know which links are converting, which article types drive the most revenue, which offers are decaying, which tools have commission structures worth promoting more aggressively, or what the highest-leverage next action is on the monetization side of the operation."))
story.append(p("This engine closes that gap. It is the revenue layer of the stack."))

story.append(h2("What the other specs do not cover"))
for item in [
    "Tracking which specific articles and pSEO pages generate affiliate clicks and attributing revenue to them",
    "Monitoring affiliate program terms for commission changes, cookie window changes, or program shutdowns",
    "Scoring offers by effective revenue per visitor so the Content Engine can prioritise the right tools",
    "Detecting when a high-traffic article has no monetization and automatically surfacing it for action",
    "Managing sponsor placements, direct deals, and newsletter ad slots as a separate revenue stream",
    "Building the weekly revenue picture that tells you whether the operation is moving toward its financial targets",
]:
    story.append(bullet(item))

story.append(sp(6))
story.append(p("This engine adds all of that. It operates alongside the existing engines — it does not replace any existing component. The affiliate link table stays where it is. This engine reads it, extends it, and wraps it with intelligence."))

story.append(info("No new environment variables are required. No new API services. No new monthly costs. Everything runs on the same Gemini API key, the same Resend key, and the same Supabase instance already set up by the other specs."))

# ── SECTION 02 ────────────────────────────────────────────────────────────────
story.append(section(2, "Architecture Overview"))

story.append(p("Four layers. Two output streams. One revenue picture."))

story.append(make_table(
    ["Layer", "Name", "What it does", "When it runs"],
    [
        ["1", "Track", "Captures every affiliate click, correlates it to the article or pSEO page that generated it, and stores it against the content record.", "Real-time, on every click"],
        ["2", "Score", "Assigns every monetizable page a Revenue Efficiency Score (RES). Surfaces mismatches: high-traffic pages with weak monetization, decaying offers, content gaps.", "Weekly, Sunday 06:00 UTC"],
        ["3", "Optimize", "Acts on Score output. Adjusts affiliate link priority, injects keywords into the Content Engine queue, manages the sponsor pipeline.", "Weekly, Sunday 06:30 UTC"],
        ["4", "Report", "Produces the daily revenue brief (one number, two actions) and the weekly monetization summary.", "Daily 07:00 UTC + weekly Sunday 09:00 UTC"],
    ],
    col_widths=[0.45*inch, 0.9*inch, 3.8*inch, 1.5*inch]
))

story.append(sp(6))
story.append(h2("Output streams"))
story.append(make_table(
    ["Stream", "What it contains", "Where it goes"],
    [
        ["Email output", "Daily revenue brief + weekly monetization summary", "ALERT_EMAIL via existing Resend integration"],
        ["Dashboard output", "MONETIZATION section in Smart Admin Dashboard, homepage widgets, gap cards", "/admin — detected and activated automatically"],
    ],
    col_widths=[1.2*inch, 3.5*inch, 2.0*inch]
))

story.append(info("The Monetization Engine never generates content, never calls Gemini independently, and never creates its own scheduler. It piggybacks on the existing infrastructure — extending the Smart Suggestions call, extending the network_reports row, and extending the newsletter slot. It is additive by design."))

# ── SECTION 03 ────────────────────────────────────────────────────────────────
story.append(section(3, "Layer 1 — Track"))

story.append(h2("Click attribution"))
story.append(p("Every affiliate link click is captured and attributed to the specific page, article type, and tool. The click event fires client-side via a lightweight edge function call on click and stores in <b>monetization_clicks</b>."))

story.append(make_table(
    ["Field", "Type", "Description"],
    [
        ["click_id", "uuid", "Primary key"],
        ["affiliate_link_id", "uuid", "FK to affiliate_links table"],
        ["tool_slug", "text", "Which tool the link points to"],
        ["source_url", "text", "The page URL where the click happened"],
        ["source_type", "text", "article / pseo_page / newsletter / sidebar"],
        ["article_id", "uuid", "FK to articles table (null for pSEO pages)"],
        ["pseo_page_id", "uuid", "FK to pseo_pages table (null for articles)"],
        ["article_type", "text", "tool_review / comparison / tutorial / best_of_list / pseo type"],
        ["click_position", "text", "in_body / see_also / cta_button / sidebar"],
        ["session_id", "text", "Anonymous session ID for deduplication"],
        ["clicked_at", "timestamp", ""],
        ["site_id", "text", "Which site (for multi-site networks)"],
    ],
    col_widths=[1.5*inch, 0.9*inch, 4.3*inch]
))

story.append(info("Session deduplication: multiple clicks from the same session to the same affiliate URL within 30 minutes are counted as one click. This prevents inflated counts from multi-tab browsing."))

story.append(h2("Revenue entry"))
story.append(p("Affiliate programs do not share conversion data in real time. Revenue is entered in one of three ways:"))

story.append(make_table(
    ["Method", "How it works", "Best for"],
    [
        ["Manual entry", "Pull payout reports from affiliate dashboards monthly. Enter totals via admin form. Engine correlates payouts against click volume to estimate conversion rates.", "All programs"],
        ["CSV import", "Paste or upload CSV from any major network (Impact, ShareASale, PartnerStack, direct). Engine parses and matches by tool name or domain.", "High-volume programs"],
        ["Estimated revenue", "Where commission rate and historical conversion rate are known, the engine calculates projected monthly revenue per program automatically.", "Ongoing projection between payout reports"],
    ],
    col_widths=[1.2*inch, 3.5*inch, 2.0*inch]
))

story.append(h2("Offer monitoring"))
story.append(p("Every affiliate program registered in the system is tracked for changes. Offers must be manually confirmed every 30 days — the engine does not scrape program pages (which would violate most program terms). Instead it prompts the admin weekly and flags unconfirmed offers."))

story.append(make_table(
    ["Field", "Description"],
    [
        ["offer_id", "uuid primary key"],
        ["tool_slug", "FK to tools table"],
        ["program_name", "e.g. PartnerStack, Impact, ShareASale, Direct"],
        ["commission_type", "percentage / flat / recurring"],
        ["commission_rate", "Decimal 0.0–1.0 for percentage programs"],
        ["commission_flat", "Dollar amount for flat-fee programs"],
        ["cookie_window_days", "Attribution window in days — directly affects offer quality score"],
        ["recurring_months", "For recurring commission structures — how many months it pays out"],
        ["payout_threshold", "Minimum balance before payout is triggered"],
        ["status", "active / paused / terminated / unconfirmed"],
        ["last_confirmed_at", "When admin last confirmed terms are current"],
    ],
    col_widths=[1.8*inch, 4.9*inch]
))

story.append(warn("Status 'unconfirmed' for 30+ days triggers an amber alert in the admin panel. Status 'terminated' triggers a red alert and flags all affected affiliate links for replacement. Cookie window below 7 days flags the offer as weak-attribution and deprioritises it in scoring."))

# ── SECTION 04 ────────────────────────────────────────────────────────────────
story.append(section(4, "Layer 2 — Score"))

story.append(p("Runs weekly, Sundays at 06:00 UTC — before the newsletter send and before the Quality Gateway learn cycle."))

story.append(h2("Revenue Efficiency Score (RES)"))
story.append(p("Every article and pSEO page with at least one affiliate link receives a Revenue Efficiency Score. This is the primary signal the Optimize layer acts on."))

story.append(h3("RES formula"))
story.append(code("RES = (clicks_per_1000_visitors × offer_quality_score × content_authority_score) / 100"))

story.append(make_table(
    ["Input", "What it is", "How it's calculated"],
    [
        ["clicks_per_1000_visitors", "Affiliate click rate", "Clicks (28 days) ÷ sessions (28 days) × 1,000. If no traffic data: uses quality_score rank as proxy."],
        ["offer_quality_score (0–100)", "Composite offer value", "Commission rate 35pts + cookie window 20pts + recurring structure 25pts + program stability 20pts."],
        ["content_authority_score (0–100)", "Content quality signal", "gateway_scores.total scaled to 100 (÷1.06). A quality improvement directly improves RES."],
    ],
    col_widths=[1.8*inch, 1.5*inch, 3.4*inch]
))

story.append(h3("Offer quality score breakdown"))
story.append(make_table(
    ["Dimension", "Points", "What is scored"],
    [
        ["Commission rate", "35 pts", "Benchmarked against stored category averages. Top 25% = 35. Middle 50% = 20. Bottom 25% = 8."],
        ["Cookie window", "20 pts", "90+ days = 20, 30–89 days = 14, 7–29 days = 7, under 7 days = 0."],
        ["Recurring structure", "25 pts", "Monthly recurring = 25, annual recurring = 15, one-time = 0."],
        ["Program stability", "20 pts", "Confirmed active within 30 days = 20, 31–60 days = 10, 60+ days = 0."],
    ],
    col_widths=[1.5*inch, 0.7*inch, 4.5*inch]
))

story.append(h3("RES interpretation"))
story.append(make_table(
    ["RES range", "Classification", "Action"],
    [
        ["0–15", "Dead weight", "High traffic or quality but not converting. Flag for monetization audit."],
        ["16–35", "Underperforming", "Some conversion but below category average. Review offer fit and CTA placement."],
        ["36–65", "Healthy", "Operating in expected range. Monitor for decay."],
        ["66–85", "Strong", "Above average. Protect with content refresh. Replicate the pattern."],
        ["86–100", "Flagship", "Your best content. Most linked, most refreshed, most protected asset."],
    ],
    col_widths=[0.8*inch, 1.2*inch, 4.7*inch]
))

story.append(warn("The conversion_fit ceiling: articles that score 0 on the Quality Gateway's conversion_fit dimension are capped at RES 35 regardless of offer quality. This prevents high-commission tools from scoring well on content that does not actually sell."))

story.append(h2("Monetization gap detection"))
story.append(p("Beyond scoring existing content, the Score layer runs a gap analysis each week. Four gap types are detected:"))

story.append(make_table(
    ["Gap type", "Condition", "Action triggered"],
    [
        ["Type 1 — Unmonetized high performers", "Top 25% traffic pages with zero affiliate clicks in 28 days", "Flag in admin panel monetization gaps tab"],
        ["Type 2 — Strong offer, thin content", "Tools with offer_quality_score ≥ 70 and fewer than 3 published pages", "Inject '[tool] review' into keyword queue at priority 80"],
        ["Type 3 — Offer decay", "Pages with RES drop > 25 points vs 90 days ago", "Flag in admin panel for offer audit"],
        ["Type 4 — pSEO to article conversion", "pSEO pages with 500+ monthly impressions and no deep Content Engine article", "Inject '[tool] review' into keyword queue at priority 85"],
    ],
    col_widths=[1.8*inch, 2.2*inch, 2.7*inch]
))

# ── SECTION 05 ────────────────────────────────────────────────────────────────
story.append(section(5, "Layer 3 — Optimize"))

story.append(p("Acts on Score layer output. Runs weekly after Score completes — Sundays at 06:30 UTC."))

story.append(h2("Offer priority adjustment"))
story.append(p("The Monetization Engine adds a <b>monetization_priority</b> integer field to the affiliate_links table. The Content Engine and pSEO Engine read this field when selecting which affiliate CTAs to include in content that references multiple tools."))

story.append(make_table(
    ["Condition", "Priority set to", "Effect"],
    [
        ["RES ≥ 66 AND offer_quality_score ≥ 70", "90 (highest)", "Tool's CTA is preferred when article can include only 1–2 links"],
        ["Offer status = terminated", "0 (excluded)", "Tool excluded from new CTA insertions. Existing links flagged, not auto-removed."],
        ["offer_quality_score < 30", "–10 per week (floor: 20)", "Gradual deprioritisation of weak-commission programs"],
        ["New tool, no offer data", "50 (neutral)", "Held at neutral until an offer is registered and confirmed"],
    ],
    col_widths=[2.2*inch, 1.3*inch, 3.2*inch]
))

story.append(info("All priority changes are logged to monetization_priority_log with the reason. Admins can view and override any automated adjustment from the Offer Manager tab."))

story.append(h2("Keyword queue injection"))
story.append(p("The Optimize layer adds keywords directly to the Content Engine's keyword_queue when monetization signals indicate a content gap. Injected keywords are distinguished by added_by = 'monetization_engine' and pre-classified as commercial intent."))

story.append(make_table(
    ["Trigger", "Keyword injected", "Priority"],
    [
        ["Gap type 2 (strong offer, thin content)", "[tool name] review", "80"],
        ["Gap type 4 (pSEO impressions, no deep review)", "[tool name] review", "85"],
        ["Tool with recurring commission and zero reviews", "[tool name] review", "75"],
        ["pSEO comparison page with 500+ impressions/mo and no article", "[tool A] vs [tool B]", "80"],
        ["Category RES average above 60, category has < 5 articles", "best [category] tools", "70"],
    ],
    col_widths=[2.8*inch, 1.8*inch, 0.7*inch]
))

story.append(h2("Sponsor pipeline manager"))
story.append(p("Direct sponsorships and sponsored placements are managed as a separate revenue stream from affiliate. The pipeline tracks opportunities from initial contact through to completed payment."))

story.append(make_table(
    ["Stage", "Description"],
    [
        ["Prospect", "Tool or brand identified as potential sponsor. Not yet contacted."],
        ["Contacted", "Outreach sent. Awaiting response."],
        ["Negotiating", "In discussion. Rate and placement agreed in principle."],
        ["Confirmed", "Deal signed or verbally agreed. Placement date scheduled."],
        ["Live", "Sponsored content or placement is currently active."],
        ["Completed", "Placement period ended. Invoice sent or payment received."],
        ["Declined", "Did not proceed. Reason logged for future reference."],
    ],
    col_widths=[1.2*inch, 5.5*inch]
))

story.append(h3("Disclosure compliance"))
story.append(p("Any sponsored content flagged in the pipeline automatically adds a disclosure flag to the corresponding article or pSEO page record. The Content Engine checks this flag and prepends the appropriate FTC/ASA disclosure text when the article is generated or refreshed. This removes the manual step and eliminates the risk of accidental non-disclosure."))

story.append(h2("Newsletter monetization slot"))
story.append(p("The weekly newsletter has one optional sponsor slot between article 1 and article 2. If a sponsor is in Live stage for that week, their placement text is inserted automatically. If no sponsor is booked, the slot is filled with the highest-RES tool's affiliate CTA — chosen by the Monetization Engine, not randomly. Newsletter CTA clicks are tracked separately as source_type = newsletter."))

# ── SECTION 06 ────────────────────────────────────────────────────────────────
story.append(section(6, "Layer 4 — Report"))

story.append(h2("Daily revenue brief"))
story.append(p("Sent every morning at 07:00 UTC. One email. Under 100 words. Three components:"))

story.append(make_table(
    ["Component", "What it contains"],
    [
        ["Yesterday's number", "Total estimated affiliate revenue for the previous day, based on click volume × estimated conversion rate × average commission. Trend indicator vs 7-day average."],
        ["One alert", "The single highest-priority monetization alert from the past 24 hours. Examples: terminated offer affecting 12 links; unmonetized page with 340 sessions."],
        ["One action", "A single recommended action from the Optimize layer. Examples: add keyword, confirm offer terms, review CTA placement on a flagged page."],
    ],
    col_widths=[1.5*inch, 5.2*inch]
))

story.append(info("The daily brief goes to ALERT_EMAIL via the same Resend integration as Content Engine failure alerts. No new API key or configuration is needed."))

story.append(h2("Weekly monetization summary"))
story.append(p("Every Sunday at 09:00 UTC, after Score and Optimize have run. The full picture."))

story.append(make_table(
    ["Section", "What it shows"],
    [
        ["Revenue by channel", "Estimated revenue from articles, pSEO pages, newsletter CTAs, and sponsor placements — broken out separately with % change vs prior 4-week average."],
        ["Revenue by tool", "Top 10 tools by estimated revenue: commission rate, click volume, estimated conversion rate, estimated revenue. Ordered by revenue descending."],
        ["Revenue by article type", "Which article types generate the most revenue. tool_review, comparison, tutorial, best_of_list, and each pSEO page type broken out."],
        ["Monetization health", "Average RES across all content, % of top-50 pages with active affiliate links, unconfirmed offer count, sponsor pipeline value."],
        ["30-day trajectory", "Projected monthly revenue at current trend vs monthly_revenue_target. Green = on track. Amber = within 20% below. Red = more than 20% below target."],
    ],
    col_widths=[1.5*inch, 5.2*inch]
))

# ── SECTION 07 ────────────────────────────────────────────────────────────────
story.append(section(7, "Admin Panel Additions"))

story.append(p("The Smart Admin Dashboard gains a <b>MONETIZATION</b> section in the sidebar navigation. It appears automatically when the Monetization Engine is detected (via presence of the monetization_clicks table). Placement: between QUALITY GATEWAY and NETWORK REPORTS."))
story.append(p("Two new widgets are added to the dashboard homepage:"))
for item in [
    "<b>Revenue pulse:</b> Yesterday's estimated revenue and a 7-day trend sparkline. Click to go to Revenue Overview tab.",
    "<b>Monetization alerts:</b> Count of active alerts with severity colour (red / amber / green). Click to go to Monetization Gaps tab.",
]:
    story.append(bullet(item))

story.append(h2("Five tabs in the MONETIZATION section"))

story.append(make_table(
    ["Tab", "What it contains"],
    [
        ["Revenue Overview", "Today / week / month estimates. 12-week revenue trend chart. Active alerts panel. Monthly revenue target input and trajectory indicator."],
        ["Top Performers", "Top 20 articles and top 20 pSEO pages by RES. Filter by tool, article type, date range. 'Protect this page' button (sets monetization_flag = protected). 'Replicate pattern' button (adds similar keyword to queue)."],
        ["Monetization Gaps", "All four gap types as actionable cards. Each card shows: page title, traffic, current RES, gap type, one-click action. Gaps are dismissible for 30 days."],
        ["Offer Manager", "Full list of registered offers with status, commission details, last confirmed date. Confirm terms button. Commission comparison view. Find-higher-commission note field per offer."],
        ["Sponsor Pipeline", "Kanban view of all sponsor opportunities across 7 stages. Add prospect, update stage, log outreach notes. Revenue tracker. Rate card builder. Disclosure status for all live placements."],
    ],
    col_widths=[1.4*inch, 5.3*inch]
))

# ── SECTION 08 ────────────────────────────────────────────────────────────────
story.append(section(8, "Integration with Existing Specs"))

story.append(h2("Content Engine v2.0 — 4 integration points"))

story.append(make_table(
    ["Integration", "What it does"],
    [
        ["monetization_priority field", "The Content Engine reads affiliate_links.monetization_priority when selecting which affiliate CTAs to include in articles referencing multiple tools. Higher priority tools are preferred when the article is at its maximum of 3 CTAs."],
        ["Keyword queue injection", "The Monetization Engine writes directly to keyword_queue with added_by = 'monetization_engine'. These keywords are treated identically to admin-added keywords. Intent is pre-classified as commercial at injection time."],
        ["Sponsored content disclosure", "Articles with sponsored = true in the sponsor pipeline receive disclosure_required = true on their keyword_queue row. The Content Engine prepends FTC/ASA disclosure text before the article body at publish time."],
        ["Revenue brief via Resend", "The daily revenue brief uses the same Resend integration as Content Engine failure alerts. Same ALERT_EMAIL. No additional configuration."],
    ],
    col_widths=[1.8*inch, 4.9*inch]
))

story.append(h2("Programmatic SEO Engine v1.0 — 3 integration points"))

story.append(make_table(
    ["Integration", "What it does"],
    [
        ["RES on pSEO pages", "The Score layer reads pseo_pages.search_impressions and search_clicks (populated by the GSC integration) to calculate traffic-based RES. pSEO pages without GSC data fall back to quality_score."],
        ["Affiliate CTA priority on pSEO templates", "pSEO templates include up to 2 affiliate CTAs. The monetization_priority field is read by the template engine when selecting which CTAs to render."],
        ["pSEO impression threshold injection", "When a pSEO page crosses 500 monthly impressions with no corresponding Content Engine article, the Monetization Engine triggers a Gap Type 4 keyword injection. This is the primary mechanism for converting pSEO surface area into high-value deep content."],
    ],
    col_widths=[1.8*inch, 4.9*inch]
))

story.append(h2("Quality Gateway v1.0 — 2 integration points"))

story.append(make_table(
    ["Integration", "What it does"],
    [
        ["content_authority_score", "The Monetization Engine reads gateway_scores.total to calculate content_authority_score. A content quality improvement — e.g. a targeted retry that raises the gateway score — directly improves the page's RES."],
        ["conversion_fit ceiling", "The Quality Gateway already scores conversion_fit as one of its 10 dimensions. The Monetization Engine reads this dimension separately. An article that scores 0 on conversion_fit cannot score above RES 35 regardless of offer quality."],
    ],
    col_widths=[1.8*inch, 4.9*inch]
))

story.append(h2("Smart Admin Dashboard v1.1 — 3 integration points"))

story.append(make_table(
    ["Integration", "What it does"],
    [
        ["MONETIZATION sidebar section", "The dashboard detection engine scans for monetization_clicks table on login. If found, activates MONETIZATION in the sidebar between QUALITY GATEWAY and NETWORK REPORTS."],
        ["Homepage widgets", "Revenue pulse widget (yesterday's revenue + sparkline) and Monetization alerts widget (alert count with severity colour) are added to the command center homepage."],
        ["Smart Suggestions extension", "The daily Gemini Smart Suggestions call is extended with monetization context: high-offer tools with no articles, unmonetized traffic pages, unconfirmed offers, revenue trajectory. One monetization recommendation is included in daily output."],
    ],
    col_widths=[1.8*inch, 4.9*inch]
))

story.append(h2("Network Backlink Manager — 1 integration point"))
story.append(p("Pages with RES above 60 are treated as link-receiving priority targets within the network. The Backlink Manager deprioritises these pages as link <i>sources</i> (no point sending authority away from your highest-converting pages) and prioritises them as link <i>targets</i> (sending authority toward your most valuable pages compounds their performance)."))

# ── SECTION 09 ────────────────────────────────────────────────────────────────
story.append(section(9, "Database Schema"))

story.append(h2("New tables"))

story.append(h3("monetization_clicks"))
story.append(make_table(
    ["Field", "Type", "Description"],
    [
        ["id", "uuid", "Primary key"],
        ["affiliate_link_id", "uuid", "FK to affiliate_links"],
        ["tool_slug", "text", "Tool the link points to"],
        ["source_url", "text", "Page that generated the click"],
        ["source_type", "text", "article / pseo_page / newsletter / sidebar"],
        ["article_id", "uuid", "FK to articles (null for pSEO)"],
        ["pseo_page_id", "uuid", "FK to pseo_pages (null for articles)"],
        ["article_type", "text", "Type of content that generated the click"],
        ["click_position", "text", "in_body / see_also / cta_button / sidebar"],
        ["session_id", "text", "Anonymous session for deduplication"],
        ["clicked_at", "timestamp", ""],
        ["site_id", "text", ""],
    ],
    col_widths=[1.5*inch, 0.9*inch, 4.3*inch]
))

story.append(h3("monetization_offers"))
story.append(make_table(
    ["Field", "Type", "Description"],
    [
        ["id", "uuid", "Primary key"],
        ["tool_slug", "text", "FK to tools"],
        ["program_name", "text", "Name of affiliate program"],
        ["commission_type", "text", "percentage / flat / recurring"],
        ["commission_rate", "decimal", "0.0–1.0 for percentage programs"],
        ["commission_flat", "decimal", "Dollar amount for flat programs"],
        ["cookie_window_days", "integer", "Attribution window"],
        ["recurring_months", "integer", "Null for non-recurring"],
        ["offer_quality_score", "integer", "0–100, calculated weekly by Score layer"],
        ["status", "text", "active / paused / terminated / unconfirmed"],
        ["last_confirmed_at", "timestamp", ""],
        ["notes", "text", "Free text for unusual program terms"],
    ],
    col_widths=[1.7*inch, 0.9*inch, 4.1*inch]
))

story.append(h3("monetization_res_scores"))
story.append(make_table(
    ["Field", "Type", "Description"],
    [
        ["id", "uuid", "Primary key"],
        ["source_id", "uuid", "FK to articles.id or pseo_pages.id"],
        ["source_type", "text", "article / pseo_page"],
        ["res_score", "decimal", "0–100"],
        ["clicks_per_1000", "decimal", "Click rate input"],
        ["offer_quality_score", "integer", "Best offer on this page at scoring time"],
        ["content_authority_score", "integer", "Scaled from gateway_scores.total"],
        ["conversion_fit_score", "integer", "From gateway_scores conversion_fit dimension"],
        ["scored_at", "timestamp", ""],
        ["site_id", "text", ""],
    ],
    col_widths=[1.7*inch, 0.9*inch, 4.1*inch]
))

story.append(h3("monetization_gaps"))
story.append(make_table(
    ["Field", "Type", "Description"],
    [
        ["id", "uuid", "Primary key"],
        ["gap_type", "integer", "1 / 2 / 3 / 4 — see Layer 2"],
        ["source_id", "uuid", "Page or tool this gap relates to"],
        ["source_type", "text", "article / pseo_page / tool"],
        ["description", "text", "Human-readable description of the gap"],
        ["recommended_action", "text", "What the engine recommends"],
        ["keyword_injected", "text", "If a keyword was added to queue, which one"],
        ["status", "text", "active / dismissed / resolved"],
        ["detected_at", "timestamp", ""],
        ["resolved_at", "timestamp", ""],
    ],
    col_widths=[1.7*inch, 0.9*inch, 4.1*inch]
))

story.append(h3("monetization_sponsors"))
story.append(make_table(
    ["Field", "Type", "Description"],
    [
        ["id", "uuid", "Primary key"],
        ["brand_name", "text", "Sponsor company name"],
        ["placement_type", "text", "newsletter / article / pseo_page / sidebar / featured_listing"],
        ["placement_target_id", "uuid", "FK to article or pseo_page (null for newsletter)"],
        ["stage", "text", "prospect / contacted / negotiating / confirmed / live / completed / declined"],
        ["rate_agreed", "decimal", "Dollar amount agreed"],
        ["period_start", "date", "When placement begins"],
        ["period_end", "date", "When placement ends"],
        ["disclosure_active", "boolean", "Whether disclosure flag is set on the article"],
        ["invoice_sent_at", "timestamp", ""],
        ["payment_received_at", "timestamp", ""],
    ],
    col_widths=[1.7*inch, 0.9*inch, 4.1*inch]
))

story.append(h3("monetization_weekly_reports"))
story.append(make_table(
    ["Field", "Type", "Description"],
    [
        ["id", "uuid", "Primary key"],
        ["report_date", "date", "Sunday of the reporting week"],
        ["revenue_affiliate_articles", "decimal", "Estimated from article clicks"],
        ["revenue_affiliate_pseo", "decimal", "Estimated from pSEO clicks"],
        ["revenue_affiliate_newsletter", "decimal", "Estimated from newsletter clicks"],
        ["revenue_sponsored", "decimal", "Confirmed sponsor revenue"],
        ["revenue_total_estimated", "decimal", "Sum of all channels"],
        ["avg_res_score", "decimal", "Average RES across all scored content"],
        ["pct_pages_monetized", "decimal", "Fraction of top-50 pages with active links"],
        ["unconfirmed_offers_count", "integer", ""],
        ["monthly_target", "decimal", "Target stored at report time"],
        ["trajectory_status", "text", "on_track / warning / off_track"],
        ["site_id", "text", ""],
    ],
    col_widths=[1.9*inch, 0.9*inch, 3.9*inch]
))

story.append(h2("Extended tables (existing — columns added only)"))

story.append(make_table(
    ["Table", "Columns added"],
    [
        ["affiliate_links", "monetization_priority (int, default 50), offer_id (uuid FK to monetization_offers), click_count_lifetime (int), last_clicked_at (timestamp)"],
        ["articles", "res_score (decimal), monetization_flag (text: null / unmonetized_gap / offer_terminated / protected), disclosure_required (boolean)"],
        ["pseo_pages", "res_score (decimal), monetization_flag (text — same values as articles)"],
        ["network_reports", "estimated_revenue_weekly (decimal), avg_res_score (decimal), active_sponsor_count (int)"],
        ["site_settings", "monthly_revenue_target (decimal) — your 90-day revenue target for trajectory tracking"],
    ],
    col_widths=[1.5*inch, 5.2*inch]
))

# ── SECTION 10 ────────────────────────────────────────────────────────────────
story.append(section(10, "Activation Prompt"))

story.append(p("Paste this entire block into your Lovable project that already has the Content Engine, pSEO Engine, and Smart Admin Dashboard installed. The prompt detects what exists and adds only what is missing."))

story.append(warn("This prompt uses approximately 2–3 Lovable credits. It detects your existing installation and extends it. It will not overwrite any existing tables, routes, or components."))

# Split code into two blocks — activation prompt is long
activation_1 = """Build and activate the Autonomous Monetization Engine v1.0 for this Lovable project.

Before building anything, audit for: (1) affiliate_links table, (2) articles table,
(3) pseo_pages table, (4) generation_log table, (5) site_settings table,
(6) existing /admin route from the Smart Admin Dashboard.

For each found: extend with new columns only. Do not overwrite existing data.
For each missing: build foundational version.

1. CLICK TRACKING
   Add edge function at /api/affiliate-click accepting:
   affiliate_link_id, source_url, source_type, article_id (nullable),
   pseo_page_id (nullable), session_id.
   Update all affiliate CTAs to call this endpoint on click before redirecting.
   Redirect still happens — tracking is non-blocking.
   Deduplicate: same session_id + affiliate_link_id within 30 minutes = one click.
   Store in monetization_clicks. Update affiliate_links.click_count_lifetime.

2. OFFER REGISTRY
   Create monetization_offers table. Build offer entry form in admin panel.
   Calculate offer_quality_score weekly:
   Commission rate: top 25% = 35pts, middle 50% = 20pts, bottom 25% = 8pts.
   Cookie window: 90+ days = 20, 30-89 = 14, 7-29 = 7, <7 days = 0.
   Recurring: monthly = 25, annual = 15, one-time = 0.
   Stability: confirmed <30 days = 20, 31-60 = 10, >60 days = 0.
   New offers default to status = 'unconfirmed'.
   Add monetization_priority (int, default 50) to affiliate_links.
   Add offer_id FK to affiliate_links."""

activation_2 = """3. REVENUE EFFICIENCY SCORING (Sundays 06:00 UTC)
   For every article and pseo_page with at least one affiliate link:
   A. clicks_per_1000 = (clicks 28 days / sessions 28 days) * 1000.
      No traffic data: use quality_score rank as proxy.
   B. offer_quality_score = best monetization_offers record for tools on this page.
   C. content_authority_score = gateway_scores.total / 1.06 (scaled to 100).
   D. If gateway_scores.conversion_fit = 0, cap RES at 35.
   E. RES = (clicks_per_1000 * offer_quality_score * content_authority_score) / 100.
   F. Write to monetization_res_scores. Update articles.res_score, pseo_pages.res_score.

4. GAP DETECTION (runs after scoring)
   Type 1: top 25% traffic pages with 0 clicks in 28 days — create gap record.
   Type 2: tools with offer_quality_score >= 70 and < 3 published pages —
     create gap, inject '[tool] review' to keyword_queue priority 80,
     added_by='monetization_engine', intent='commercial'.
   Type 3: pages with res_score drop >25 pts vs 90 days ago — create gap.
   Type 4: pseo_pages with search_impressions > 500/mo and no CE article —
     create gap, inject '[tool] review' to keyword_queue priority 85.

5. OFFER PRIORITY ADJUSTMENT (Sundays 06:30 UTC)
   RES >= 66 AND offer_quality_score >= 70: monetization_priority = 90.
   Status = 'terminated': monetization_priority = 0,
     set articles.monetization_flag = 'offer_terminated' for affected articles.
   offer_quality_score < 30: decrement priority by 10 (floor: 20).
   Log all changes to monetization_priority_log with reason.

6. SPONSOR PIPELINE
   Create monetization_sponsors table. Add Sponsor Pipeline tab to MONETIZATION
   section with kanban view (7 stages: prospect/contacted/negotiating/confirmed/
   live/completed/declined).
   When sponsor moves to 'live': if placement_target_id set, flag article
   disclosure_required = true. If newsletter type, flag newsletter agent to
   include sponsor slot for weeks within period_start to period_end.
   Newsletter slot: check for live sponsor on generation. If found, insert their
   text between article 1 and 2. If not found, insert highest-RES tool CTA.
   Track newsletter clicks as source_type = 'newsletter'.

7. REVENUE ENTRY
   Add revenue entry form to admin: period, tool, program, clicks, conversions, payout.
   Store to monetization_revenue with source='manual'.
   Add CSV import: accept pasted CSV, match to tools by program_name,
   store with source='csv_import'.
   Estimated revenue: clicks_28_days * 0.02 * (avg_tool_price * commission_rate).
   Store as source='estimated'. Show in amber until actuals entered.

8. DAILY REVENUE BRIEF (07:00 UTC via Resend to ALERT_EMAIL)
   Subject: "[Site name] Revenue Brief — [date]"
   Under 100 words: yesterday's estimated revenue + trend vs 7-day average,
   highest priority active alert, one recommended action from Optimize output.

9. WEEKLY SUMMARY (Sundays 09:00 UTC via Resend)
   Revenue by channel, top 10 tools by estimated revenue, revenue by article type,
   monetization health indicators, 30-day trajectory vs site_settings.monthly_revenue_target.
   Store to monetization_weekly_reports.

10. ADMIN PANEL — MONETIZATION SECTION
    Add to Smart Admin Dashboard sidebar between QUALITY GATEWAY and NETWORK REPORTS.
    Five tabs: Revenue Overview, Top Performers, Monetization Gaps, Offer Manager,
    Sponsor Pipeline (see spec Section 07 for full tab descriptions).
    Add to dashboard homepage: Revenue pulse widget + Monetization alerts widget.

11. SMART SUGGESTIONS EXTENSION
    Extend daily Gemini Smart Suggestions call with: top 3 high-offer tools with
    no CE articles, unmonetized top-traffic pages, unconfirmed offers >21 days,
    revenue trajectory vs target. Include one monetization recommendation in output.

12. DATABASE TABLES
    Create: monetization_clicks, monetization_offers, monetization_res_scores,
    monetization_gaps, monetization_revenue, monetization_sponsors,
    monetization_weekly_reports, monetization_priority_log.
    Extend: affiliate_links, articles, pseo_pages, network_reports, site_settings.

AFTER BUILDING: list every table created/extended, every admin section added,
and the click tracking endpoint URL. Confirm affiliate CTAs are wired to tracker."""

story.append(code(activation_1))
story.append(code(activation_2))

# ── SECTION 11 ────────────────────────────────────────────────────────────────
story.append(section(11, "Setup — Three Questions"))

story.append(p("Before pasting the activation prompt, answer these three questions. Your answers configure the revenue targets and commission benchmarks used throughout the engine."))

story.append(h2("Question 1 — Monthly revenue target"))
story.append(p("What is your monthly revenue target for this site? This number appears in the weekly summary's trajectory calculation and in the Smart Admin Dashboard revenue health indicator. Set a realistic target for where you want to be in 90 days."))
story.append(info("Add to site_settings.monthly_revenue_target before or during the activation prompt run. The admin panel Revenue Overview tab includes a target input field where you can update this at any time — you do not have to get this right on day one."))

story.append(h2("Question 2 — Your primary affiliate model"))
story.append(p("Which commission structure is most common in your niche? This seeds the category benchmarks used by offer_quality_score calculations."))

story.append(make_table(
    ["Model", "Select", "Typical niches"],
    [
        ["Monthly recurring SaaS commissions", "saas_recurring", "No-code tools, marketing software, project management"],
        ["SaaS one-time or annual payout", "saas_onetime", "Design tools, certain developer tools"],
        ["High-ticket flat fee programs", "high_ticket_flat", "Enterprise software, financial tools"],
        ["E-commerce percentage commissions", "ecommerce_pct", "Physical products, marketplace platforms"],
        ["Mixed or unclear", "mixed", "Multiple categories or early-stage sites"],
    ],
    col_widths=[2.2*inch, 1.2*inch, 3.3*inch]
))

story.append(h2("Question 3 — Sponsor readiness"))

story.append(make_table(
    ["Status", "Select", "What activates"],
    [
        ["Not ready — traffic too low for direct deals", "pipeline_only", "Sponsor pipeline is built but rate card and outreach tools are disabled until you enable them manually."],
        ["Ready — traffic established", "active", "Full sponsor pipeline activated from day one, including rate card builder and outreach tracking."],
        ["Already have sponsors", "active", "Select active, then add existing sponsors manually in the Sponsor Pipeline tab after setup."],
    ],
    col_widths=[2.2*inch, 1.0*inch, 3.5*inch]
))

# ── SECTION 12 ────────────────────────────────────────────────────────────────
story.append(section(12, "Troubleshooting"))

story.append(warn("Before spending a Lovable credit on a fix prompt, always check Supabase directly. The monetization_priority_log and monetization_gaps tables contain more specific diagnostic information than what appears in the admin UI. Most issues can be diagnosed and fixed with a targeted follow-up prompt of under 20 words once you know the exact error."))

story.append(h2("Click tracking not recording"))
for item in [
    "Check that the /api/affiliate-click edge function was created — verify in Lovable's edge functions list",
    "Verify all affiliate CTAs in the frontend are calling this endpoint on click (check the build report)",
    "Open Supabase and check monetization_clicks — if empty after known clicks, the edge function call is failing",
    "Check Supabase edge function logs for error messages",
    "The click redirect still happens even if tracking fails — tracking is non-blocking by design",
]:
    story.append(bullet(item))

story.append(h2("RES scores not appearing"))
for item in [
    "RES scoring runs Sundays at 06:00 UTC — check the Supabase cron log for a successful run",
    "If no traffic data is available (no GSC token), scores still calculate using quality_score as proxy — check that articles have gateway_scores entries",
    "Offers must be in active status for offer_quality_score to contribute — confirm your offers in the Offer Manager tab",
    "Use the 'Run scoring now' button in the Offer Manager tab to force a manual score calculation outside the Sunday schedule",
]:
    story.append(bullet(item))

story.append(h2("Revenue estimates diverge from actuals"))
for item in [
    "Estimated revenue uses a 2% default conversion rate until actuals are entered — this is a rough proxy and will diverge from reality for most programs",
    "Enter at least one month of actual payout data via the Revenue Entry form — the engine calibrates its conversion rate estimate to your site's real rate",
    "For programs with high ticket values and low conversion rates (enterprise software), the 2% default significantly overestimates revenue — enter actuals as soon as your first payout arrives",
]:
    story.append(bullet(item))

story.append(h2("Sponsor disclosure not appearing on articles"))
for item in [
    "Check that the sponsor is in live stage and period_start is today or earlier in Supabase",
    "Verify disclosure_required = true is set on the articles record in Supabase",
    "The disclosure text is prepended at the next Content Refresh Agent run — force a refresh of the specific article to apply it immediately",
    "Check the Content Engine build report confirms the refresh agent reads the disclosure_required field",
]:
    story.append(bullet(item))

story.append(h2("Smart Suggestions not including monetization recommendations"))
for item in [
    "Smart Suggestions requires GEMINI_API_KEY and runs once per day at midnight UTC",
    "Check smart_actions_log in Supabase for error messages from the extended prompt",
    "Monetization context is only included if monetization_clicks table exists and has data — the extension is skipped silently if the table is empty or missing",
]:
    story.append(bullet(item))

# ── ENVIRONMENT VARIABLES ──────────────────────────────────────────────────────
story.append(sp(16))
story.append(rule())
story.append(h2("Environment variables — no new keys required"))

story.append(make_table(
    ["Variable", "Set by", "Used for"],
    [
        ["GEMINI_API_KEY", "Content Engine", "Daily revenue brief Smart Suggestions extension"],
        ["RESEND_API_KEY", "Content Engine", "Daily revenue brief and weekly summary emails"],
        ["ALERT_EMAIL", "Content Engine", "All monetization email output"],
        ["SITE_ID", "Content Engine", "Multi-site revenue attribution in network_reports"],
        ["SUPABASE_URL", "Prior specs", "All database operations"],
        ["SUPABASE_ANON_KEY", "Prior specs", "All database operations"],
    ],
    col_widths=[1.7*inch, 1.4*inch, 3.6*inch]
))

# ── FINAL PAGE ────────────────────────────────────────────────────────────────
story.append(PageBreak())

# Closing statement block
story.append(sp(80))

closing_data = [[
    Paragraph(
        "<b>No new API keys. No new monthly costs.</b><br/><br/>"
        "Drop this into any Lovable project running the Content Engine. "
        "Answer three questions. Paste one prompt. Walk away.",
        S("Closing", fontName="Helvetica", fontSize=13, leading=20,
          textColor=WHITE, alignment=TA_CENTER)
    )
]]
closing_table = Table(closing_data, colWidths=[W])
closing_table.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), ACCENT2),
    ("LEFTPADDING", (0,0), (-1,-1), 32),
    ("RIGHTPADDING", (0,0), (-1,-1), 32),
    ("TOPPADDING", (0,0), (-1,-1), 28),
    ("BOTTOMPADDING", (0,0), (-1,-1), 28),
    ("ROUNDEDCORNERS", [6]),
]))
story.append(closing_table)

story.append(sp(20))
story.append(Paragraph(
    "Autonomous Monetization Engine — Revenue Intelligence Spec v1.0 · Stupid People Edition · May 2026",
    S("Footer", fontName="Helvetica", fontSize=8, textColor=MID_GRAY, alignment=TA_CENTER)
))

# ── BUILD ─────────────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print(f"Built: {OUTPUT}")
