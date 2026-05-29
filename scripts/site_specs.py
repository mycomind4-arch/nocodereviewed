from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether, ListFlowable, ListItem
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Flowable

# ── Palette ──────────────────────────────────────────────────────────────────
INK       = colors.HexColor("#0f0e0d")
ACCENT    = colors.HexColor("#e8541a")
ACCENT2   = colors.HexColor("#f7a349")
LIGHT_BG  = colors.HexColor("#faf8f4")
MID_BG    = colors.HexColor("#f3ede4")
BORDER    = colors.HexColor("#e8e4dc")
MUTED     = colors.HexColor("#6a6560")
WHITE     = colors.white
GREEN_BG  = colors.HexColor("#f0fdf4")
GREEN_FG  = colors.HexColor("#166534")
BLUE_BG   = colors.HexColor("#eff6ff")
BLUE_FG   = colors.HexColor("#1e40af")

SITE_ACCENTS = [
    colors.HexColor("#e8541a"),  # 1 anchor - orange
    colors.HexColor("#7c3aed"),  # 2 automation - purple
    colors.HexColor("#0369a1"),  # 3 backend - blue
    colors.HexColor("#047857"),  # 4 ecommerce - green
    colors.HexColor("#b45309"),  # 5 AI integration - amber
    colors.HexColor("#be123c"),  # 6 agencies - rose
    colors.HexColor("#0891b2"),  # 7 analytics - cyan
    colors.HexColor("#4338ca"),  # 8 saas - indigo
    colors.HexColor("#be185d"),  # 9 design - pink
    colors.HexColor("#15803d"),  # 10 solopreneurs - emerald
]

W = letter[0] - 1.5*inch

# ── Styles ────────────────────────────────────────────────────────────────────
def S(name, **kw):
    return ParagraphStyle(name, **kw)

cover_title = S("CT", fontSize=40, leading=46, textColor=WHITE,
                fontName="Helvetica-Bold", spaceAfter=8)
cover_sub   = S("CS", fontSize=15, leading=22, textColor=ACCENT2,
                fontName="Helvetica", spaceAfter=6)
cover_meta  = S("CM", fontSize=10, leading=15,
                textColor=colors.HexColor("#b8b3aa"), fontName="Helvetica")

h1   = S("H1",   fontSize=20, leading=26, textColor=ACCENT,  fontName="Helvetica-Bold",
         spaceBefore=14, spaceAfter=6)
h2   = S("H2",   fontSize=13, leading=18, textColor=INK,     fontName="Helvetica-Bold",
         spaceBefore=12, spaceAfter=4)
h3   = S("H3",   fontSize=11, leading=15, textColor=INK,     fontName="Helvetica-Bold",
         spaceBefore=8,  spaceAfter=3)
body = S("Body", fontSize=9.5, leading=15, textColor=INK,    fontName="Helvetica",
         spaceBefore=2,  spaceAfter=3)
body_muted = S("BM", fontSize=9, leading=14, textColor=MUTED, fontName="Helvetica",
               spaceBefore=2, spaceAfter=2)
bullet = S("Bul", fontSize=9.5, leading=14, textColor=INK,   fontName="Helvetica",
           leftIndent=14, firstLineIndent=-10, spaceBefore=2, spaceAfter=2)
mono   = S("Mono",fontSize=8.5, leading=13, textColor=INK,   fontName="Courier",
           leftIndent=10, spaceBefore=2, spaceAfter=2, backColor=colors.HexColor("#f8f6f2"))
code_label = S("CL", fontSize=8, leading=11, textColor=MUTED, fontName="Helvetica-Bold",
               spaceBefore=6, spaceAfter=1)
small  = S("Sm",  fontSize=8.5, leading=12, textColor=MUTED, fontName="Helvetica")
toc_e  = S("TOC", fontSize=10, leading=17, textColor=INK,    fontName="Helvetica")

def spacer(h=8): return Spacer(1, h)
def rule(c=BORDER, t=0.75): return HRFlowable(width="100%", thickness=t, color=c,
                                               spaceAfter=5, spaceBefore=5)

# ── Reusable table builders ───────────────────────────────────────────────────
def basic_table(rows, headers=None, col_widths=None, row_colors=None):
    if col_widths is None:
        n = len(rows[0])
        col_widths = [W/n]*n
    data = ([headers] if headers else []) + rows
    t = Table(data, colWidths=col_widths, repeatRows=(1 if headers else 0))
    rc = row_colors or [WHITE, LIGHT_BG]
    st = [
        ("FONTSIZE",      (0,0),(-1,-1), 9),
        ("LEADING",       (0,0),(-1,-1), 13),
        ("LEFTPADDING",   (0,0),(-1,-1), 8),
        ("RIGHTPADDING",  (0,0),(-1,-1), 8),
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5),
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
        ("FONTNAME",      (0,0),(-1,-1), "Helvetica"),
        ("GRID",          (0,0),(-1,-1), 0.5, BORDER),
        ("ROWBACKGROUNDS",(0, 1 if headers else 0),(-1,-1), rc),
    ]
    if headers:
        st += [
            ("BACKGROUND",  (0,0),(-1,0), INK),
            ("TEXTCOLOR",   (0,0),(-1,0), WHITE),
            ("FONTNAME",    (0,0),(-1,0), "Helvetica-Bold"),
        ]
    t.setStyle(TableStyle(st))
    return t

def callout(title, text, accent=ACCENT, bg=MID_BG):
    data = [[Paragraph(title, S("ct2", fontSize=10, leading=14, fontName="Helvetica-Bold",
                                textColor=accent))],
            [Paragraph(text,  S("cb2", fontSize=9.5, leading=14, fontName="Helvetica",
                                textColor=INK))]]
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

def section_header(num, title, subtitle, accent):
    data = [
        [Paragraph(f'<font color="white"><b>SITE {num}</b></font>',
                   S("shn", fontSize=11, leading=14, fontName="Helvetica-Bold", textColor=WHITE)),
         Paragraph(f'<font color="white"><b>{title}</b></font>',
                   S("sht", fontSize=15, leading=19, fontName="Helvetica-Bold", textColor=WHITE)),
         Paragraph(f'<font color="#f7a349">{subtitle}</font>',
                   S("shs", fontSize=9, leading=13, fontName="Helvetica",
                     textColor=ACCENT2, alignment=TA_RIGHT))],
    ]
    t = Table(data, colWidths=[W*0.12, W*0.58, W*0.30])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), accent),
        ("LEFTPADDING",  (0,0),(-1,-1), 12),
        ("RIGHTPADDING", (0,0),(-1,-1), 12),
        ("TOPPADDING",   (0,0),(-1,-1), 12),
        ("BOTTOMPADDING",(0,0),(-1,-1), 12),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
        ("ROUNDEDCORNERS", [5]),
    ]))
    return t

def prompt_box(text, label="LOVABLE PROMPT"):
    data = [[Paragraph(label, S("pl", fontSize=7.5, leading=10, fontName="Helvetica-Bold",
                                textColor=ACCENT))],
            [Paragraph(text, S("pt", fontSize=8.5, leading=13, fontName="Courier",
                               textColor=INK))]]
    t = Table(data, colWidths=[W-4])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(0,0),   colors.HexColor("#fff7ed")),
        ("BACKGROUND",   (0,1),(0,1),   colors.HexColor("#fefce8")),
        ("LEFTPADDING",  (0,0),(-1,-1), 12),
        ("RIGHTPADDING", (0,0),(-1,-1), 12),
        ("TOPPADDING",   (0,0),(0,0),   6),
        ("BOTTOMPADDING",(0,0),(0,0),   4),
        ("TOPPADDING",   (0,1),(0,1),   8),
        ("BOTTOMPADDING",(0,1),(0,1),   10),
        ("LINEBEFORE",   (0,0),(0,-1),  3, ACCENT2),
        ("BOX",          (0,0),(-1,-1), 0.5, BORDER),
    ]))
    return t

def subsection(title, accent):
    data = [[Paragraph(f'<font color="white"><b>{title}</b></font>',
                       S("ss", fontSize=10, leading=14, fontName="Helvetica-Bold",
                         textColor=WHITE))]]
    t = Table(data, colWidths=[W])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), accent),
        ("LEFTPADDING",  (0,0),(-1,-1), 10),
        ("RIGHTPADDING", (0,0),(-1,-1), 10),
        ("TOPPADDING",   (0,0),(-1,-1), 6),
        ("BOTTOMPADDING",(0,0),(-1,-1), 6),
    ]))
    return t

def b(t): return f"<b>{t}</b>"
def i(t): return f"<i>{t}</i>"
def bp(text): return Paragraph(f"• {text}", bullet)

# ═══════════════════════════════════════════════════════════════════════════════
# BUILD SITE DATA
# ═══════════════════════════════════════════════════════════════════════════════

SITES = [

# ─── SITE 1 ────────────────────────────────────────────────────────────────────
{
"num": 1,
"title": "No-Code Platform Reviews",
"subtitle": "Anchor Site — The Hub of the Network",
"domain": "e.g. nocode-reviews.com",
"tagline": "Honest, in-depth reviews of every major no-code platform — so you build on the right one.",
"purpose": "The authoritative comparison hub for no-code builders. Every visitor who discovers any of the 10 network sites eventually passes through here. It is the highest-authority domain in the network and the primary affiliate revenue engine.",
"audience": "Entrepreneurs, small business owners, and developers evaluating no-code platforms for the first time or switching from an existing tool. Budget-conscious, research-heavy buyers.",

"pages": [
    ("Homepage", "Hero with search bar, featured platforms grid (8–200 tools), category filters (Website Builders, App Builders, Automation, Ecommerce, Database), trending comparisons strip, email signup, latest reviews feed"),
    ("Platform Review Page", "Tool logo, rating (1–5 stars), one-line verdict, full written review (1,200+ words), pros/cons table, pricing breakdown by tier, best-for tags, affiliate CTA button, user ratings widget, related comparisons"),
    ("Comparison Page", "Side-by-side feature matrix for 2–4 tools, winner verdict per category, pricing comparison table, use-case recommendation, affiliate CTAs for each tool"),
    ("Category Index", "Filtered view by category (e.g. 'Best App Builders'), sortable by rating/price/popularity, pagination"),
    ("Best-Of List Pages", "SEO-optimised listicles: 'Best no-code tools for agencies', 'Best Bubble alternatives', dynamically generated from tool database"),
    ("Submit a Tool", "Form for tool makers to submit their product for review. Fields: tool name, URL, category, description, pricing, affiliate program info"),
    ("Sponsored Listings Page", "Public-facing page showing available and filled sponsored slots, traffic stats, pricing tiers, contact CTA"),
    ("Newsletter Archive", "All past weekly newsletter issues displayed publicly for SEO value"),
    ("Blog / Tutorials Index", "Filterable list of all tutorial and how-to articles"),
    ("About & Methodology", "How reviews are conducted, rating criteria, affiliate disclosure, editorial independence statement"),
],

"database_schema": [
    ("tools", "id, name, slug, tagline, logo_url, website_url, affiliate_url, category[], rating_overall, rating_ease, rating_features, rating_pricing, rating_support, verdict, review_body, pros[], cons[], pricing_tiers (JSON), best_for[], featured, sponsored, sponsored_until, created_at, updated_at"),
    ("comparisons", "id, slug, tool_ids[], title, body, winner_overall, created_at, updated_at"),
    ("articles", "id, slug, title, body, category, tags[], seo_title, seo_description, author, published_at, updated_at, word_count, status (draft/published/archived)"),
    ("newsletter_issues", "id, issue_number, subject, body_html, sent_at, subscriber_count"),
    ("subscribers", "id, email, subscribed_at, active, source"),
    ("sponsored_slots", "id, tool_id, site, slot_position, start_date, end_date, monthly_fee, active"),
    ("user_ratings", "id, tool_id, rating, review_text, submitted_at, approved"),
    ("affiliate_clicks", "id, tool_id, article_id, clicked_at, user_agent"),
],

"autonomous_systems": [
    ("Article Generation", "Gemini API triggered daily at 06:00 UTC. Generates 4 articles/day from keyword queue. Article types rotate: 2× tool reviews, 1× comparison, 1× tutorial. Each article: min 1,000 words, includes structured pros/cons, pricing info pulled from tool database, internal links to 2–3 related reviews."),
    ("Keyword Queue", "Fed by Google Search Console API (positions 8–20 for easy wins) + Ahrefs API (monthly volume >100, KD <40 for new sites, KD <60 once DR>30). Queue prioritises comparison keywords (highest buyer intent) first."),
    ("Quality Gateway", "Post-generation checks: word count >900, readability score (Flesch-Kincaid >50), no banned phrases list (20+ generic AI phrases), affiliate link present if tool mentioned, internal link count 2–5, factual tool data matches database. Fail = regenerate with stricter prompt."),
    ("Newsletter Automation", "Every Sunday 08:00 UTC: pulls top 3 articles of the week by pageview, generates intro summary, formats HTML email, sends via Resend API to subscriber list. Subject line A/B tested (2 variants auto-generated)."),
    ("Tool Data Refresh", "Weekly job scrapes pricing pages of all listed tools, flags discrepancies against database for manual review. Prevents outdated pricing in articles."),
    ("Sitemap & Indexing", "Auto-regenerates sitemap.xml on every new publish. Pings Google via IndexNow API. Submits new URLs to Google Search Console API."),
    ("Interlink Agent", "On every article publish: queries Supabase for contextually relevant articles across all 10 network sites, selects 1 highest-relevance cross-site link, inserts naturally into article body, logs to link_map table. Max 3 links/month per destination site."),
    ("Sponsored Slot Monitor", "Daily check: flags slots expiring within 7 days, auto-emails current advertiser with renewal offer, emails waiting-list advertisers when slot opens."),
],

"tools_to_build": [
    ("Platform Comparison Wizard", "10-question interactive quiz. Inputs: project type, technical skill level, team size, monthly budget, must-have features (checkboxes). Output: ranked top-3 platform recommendations with brief explanation and affiliate links. Built in React within Lovable."),
    ("Pricing Calculator", "User inputs expected monthly active users and feature requirements. Calculator shows monthly cost across 6 platforms side-by-side. Updates in real time. Affiliate CTAs next to each result."),
    ("Feature Matrix Builder", "User selects 2–4 tools from dropdown. Generates a fully rendered comparison table for those specific tools pulled from database."),
    ("'Should I Switch?' Tool", "User inputs current platform + pain points (multi-select). Returns: stay recommendation or top 3 alternatives with migration difficulty rating."),
],

"affiliate_programs": [
    "Webflow — 50% first year via Webflow Affiliate Program",
    "Bubble — available via PartnerStack, ~30% recurring",
    "Framer — 20% recurring via direct program",
    "Glide — via PartnerStack",
    "Softr — via PartnerStack",
    "Adalo — direct affiliate program",
    "AppGyver (SAP Build) — enterprise referral",
    "Lovable — check current program",
    "Wix — $100 per referral via Impact",
    "Squarespace — $100–200 per sale via CJ Affiliate",
],

"seo_targets": [
    "'best no-code app builder' — 18,000 searches/month",
    "'bubble vs webflow' — 4,400/month",
    "'no code website builder' — 33,100/month",
    "'lovable ai review' — growing fast",
    "'webflow alternatives' — 5,400/month",
    "'no code tools for startups' — 2,900/month",
    "'best no code platform 2026' — high intent, growing",
],

"monetisation": [
    ("Affiliate links", "Primary. Every tool card and review. Target 0.4–1% conversion at scale."),
    ("Sponsored listings", "3 slots. Featured placement on homepage + category pages. Start $199/month, scale to $1,500/month at 50k+ visitors."),
    ("Newsletter sponsorships", "Single sponsor per weekly issue once list hits 2,000 subscribers. $200–800/issue."),
    ("Display ads", "Google AdSense until 50k sessions, then Mediavine. Tech niche RPM $15–25."),
],

"lovable_prompt": """Build a no-code platform review and comparison website called [SITE NAME].

DESIGN: Clean editorial aesthetic. Off-white background (#faf8f4), dark ink (#0f0e0d), burnt orange accent (#e8541a). Typography: Instrument Serif for headings, DM Sans for body. Fully responsive. Dark mode toggle.

PAGES TO BUILD:
1. Homepage — hero with search, platform grid (card layout: logo, name, rating stars, tagline, category badge, 'Read Review' CTA), category filter tabs, trending comparisons strip, email signup section, latest articles feed (3 cards)
2. Platform review page — full review layout with: hero banner (tool logo + name + overall rating), tabbed sections (Overview / Pricing / Pros & Cons / Who It's For / Verdict), sticky affiliate CTA sidebar on desktop, related comparisons section, user ratings widget (stars + text, submit form), breadcrumb navigation
3. Comparison page — two-column feature matrix table with checkmarks/crosses, winner badge per row, pricing comparison table, final verdict section, CTA buttons for both tools
4. Category index pages — grid of tool cards, sortable (rating/price/newest), pagination (12 per page)
5. Best-of list pages — numbered list format, each item expandable, affiliate CTAs
6. Submit a tool — clean form: tool name, URL, category dropdown, description textarea, pricing textarea, affiliate program URL, contact email
7. Sponsored listings info page — traffic stats display, slot availability indicator, pricing table, contact form
8. Newsletter archive — card grid of past issues, each linking to full HTML view
9. Blog/tutorials index — filterable by tag, search bar
10. About/methodology page — static content page

DATABASE (Supabase):
- tools table: id, name, slug, tagline, logo_url, website_url, affiliate_url, category (array), rating_overall, rating_ease, rating_features, rating_pricing, rating_support, verdict, review_body, pros (array), cons (array), pricing_tiers (jsonb), best_for (array), featured (bool), sponsored (bool), sponsored_until (date), created_at, updated_at
- articles table: id, slug, title, body, excerpt, category, tags (array), seo_title, seo_description, author, published_at, updated_at, word_count, status, featured_image_url
- subscribers table: id, email, subscribed_at, active, source
- affiliate_clicks table: id, tool_id, article_id, clicked_at
- sponsored_slots table: id, tool_id, slot_position, start_date, end_date, monthly_fee, active
- user_ratings table: id, tool_id, rating (1-5), review_text, submitted_at, approved (bool)
- newsletter_issues table: id, issue_number, subject, body_html, sent_at

ADMIN DASHBOARD (private /admin route, password protected):
- Article management: list all articles, status toggle, edit, delete, manual publish
- Tool management: add/edit/delete tools, toggle featured/sponsored
- Subscriber list with export CSV
- Affiliate click stats by tool and article
- Sponsored slot management: dates, renewal alerts
- Article generation queue: view pending keywords, trigger manual generation, view quality gateway results
- Analytics overview: pageviews (from GA4 API), top articles, top tools by clicks

AUTOMATION HOOKS (webhook endpoints to receive from n8n):
- POST /api/publish-article — receives {title, body, slug, category, tags, seo_title, seo_description} and publishes
- POST /api/add-tool — adds new tool to database
- POST /api/update-tool-pricing — updates pricing_tiers for a specific tool
- POST /api/send-newsletter — triggers newsletter send with provided HTML content
- POST /api/log-affiliate-click — logs click event
- GET /api/keyword-queue — returns next 10 keywords from queue for article generation

INTERACTIVE TOOLS (React components):
1. Platform Comparison Wizard — multi-step form (10 questions), result page with top 3 recommendations + affiliate links
2. Pricing Calculator — inputs: MAU slider, feature checkboxes → real-time cost comparison table across 6 platforms
3. Feature Matrix Builder — select 2-4 tools from dropdown → renders comparison table from database
4. 'Should I Switch' Tool — current platform + pain points → stay/switch recommendation

SEO: Auto-generate meta title, meta description, og:image (tool logo + site name), canonical URL, JSON-LD schema (SoftwareApplication for tool pages, Article for blog posts, FAQPage where applicable). Auto-submit to IndexNow on publish. Auto-regenerate sitemap.xml.

EMAIL: Integrate Resend API. Subscriber signup stores to Supabase. Weekly newsletter webhook receiver. Double opt-in confirmation email.

PERFORMANCE: Lazy load images. Paginate article lists (12/page). Cache tool data (5 min TTL). Optimise for Core Web Vitals.

AUTH: Single admin user. Supabase Auth. Protect all /admin routes.""",
},

# ─── SITE 2 ────────────────────────────────────────────────────────────────────
{
"num": 2,
"title": "No-Code Automation & Workflows",
"subtitle": "The definitive guide to automating your no-code stack",
"domain": "e.g. nocode-automate.com",
"tagline": "Stop doing it manually. Automate everything with zero code.",
"purpose": "Serves no-code builders who have built their first app or site and now need to connect it to the rest of their stack. Second-highest search volume in the network. Primary audience overlap with anchor site — natural next click.",
"audience": "No-code builders, small business operators, solopreneurs, and ops managers who want to automate repetitive tasks. Mix of complete beginners and intermediate users.",

"pages": [
    ("Homepage", "Hero with tool comparison CTA, automation category grid (CRM automations, Email automations, Data sync, Notification triggers, File management, Scheduling), featured automations feed, cost calculator widget, email signup"),
    ("Tool Review Pages", "Full reviews for Zapier, Make, n8n, Activepieces, Pabbly, Integrately, Albato, Pipedream — same structure as anchor site"),
    ("Automation Templates Library", "Searchable/filterable library of 200+ pre-built automation recipes. Each shows: trigger app, action app, use case description, step-by-step setup guide, estimated time saved per week, affiliate links to tools needed"),
    ("Platform Comparison Pages", "Zapier vs Make, Make vs n8n, Zapier vs Pabbly, etc. Side-by-side on pricing, task limits, features, ease of use"),
    ("Use Case Guides", "Category pages: Automate Your CRM, Automate Ecommerce, Automate Lead Gen, Automate Reporting, Automate Social Media"),
    ("Tutorials Index", "How-to articles filterable by tool and skill level"),
    ("Cost Calculator Page", "Dedicated page for the automation cost calculator tool"),
],

"database_schema": [
    ("tools", "id, name, slug, logo_url, affiliate_url, category, rating, review_body, pricing_tiers (JSON), task_limits (JSON), integrations_count, free_plan (bool), pros[], cons[]"),
    ("automation_templates", "id, slug, title, trigger_app, action_app, use_case, steps (JSON), time_saved_mins, difficulty (1-3), affiliate_tools[], created_at"),
    ("articles", "id, slug, title, body, category, tags[], seo_title, seo_description, published_at, status"),
    ("subscribers", "id, email, subscribed_at, active"),
],

"autonomous_systems": [
    ("Article Generation", "4/day. Types: 1× tool review/update, 1× automation recipe tutorial, 1× comparison, 1× use-case guide. Gemini prompt includes: tool pricing from database, specific step counts, screenshot placeholders, real app names."),
    ("Template Auto-Generation", "Weekly: Gemini generates 10 new automation template descriptions based on trending tools in the niche. Admin reviews and approves before publishing."),
    ("Pricing Monitor", "Weekly scrape of Zapier/Make/n8n pricing pages. Flags changes for article refresh. Critical — pricing changes frequently and outdated info loses trust."),
    ("Quality Gateway", "Extra rule: all automation tutorials must include exact step count and estimated completion time. Vague tutorials fail."),
],

"tools_to_build": [
    ("Automation Cost Calculator", "Inputs: number of automations, tasks per month per automation, current tool. Calculates monthly cost on Zapier Free/Starter/Professional, Make Free/Core/Pro, n8n Cloud/Self-hosted. Shows break-even points and recommended tier."),
    ("Automation Idea Generator", "User describes their business (type, size, main repetitive tasks). Gemini generates 10 specific automation ideas with tool recommendations and affiliate links."),
    ("Integration Checker", "User inputs two app names. Returns: does a native integration exist, which platforms support it, estimated setup complexity, link to relevant template."),
    ("Workflow Complexity Estimator", "User describes a workflow in plain English. Returns: estimated number of steps, recommended tool (Zapier/Make/n8n based on complexity), cost estimate."),
],

"affiliate_programs": [
    "Zapier — $0 (no affiliate program currently but referral credits available)",
    "Make — 20% recurring via PartnerStack",
    "n8n Cloud — check current program",
    "Pabbly — lifetime deal affiliate, 30%",
    "Activepieces — early-stage, check direct",
    "Integrately — 30% recurring",
    "Albato — direct affiliate",
],

"seo_targets": [
    "'zapier vs make' — 12,000/month",
    "'zapier alternatives' — 8,100/month",
    "'make vs n8n' — 2,900/month",
    "'how to automate [task]' — thousands of long-tail variations",
    "'n8n tutorial' — 3,600/month",
    "'no code automation tools' — 2,400/month",
],

"monetisation": [
    ("Affiliate links", "Make and Pabbly have strong recurring programs. Zapier no affiliate but high volume drives tool discovery."),
    ("Sponsored listings", "3 slots. Automation tools pay premium — small market, high willingness to pay."),
    ("Template marketplace", "Future: premium automation templates at $9–49 each."),
    ("Display ads", "AdSense → Mediavine at threshold."),
],

"lovable_prompt": """Build a no-code automation and workflow tools review site called [SITE NAME].

DESIGN: Dark purple accent (#7c3aed) on off-white (#faf8f4). DM Sans body, Syne for headings. Clean, technical feel. Fully responsive.

PAGES:
1. Homepage — hero ('Stop doing it manually'), tool comparison CTA, automation category grid (6 categories with icons), featured templates strip (horizontal scroll, 4 cards), cost calculator embed, latest articles feed
2. Tool review pages — same structure as anchor site with added: integrations count badge, free plan indicator, task limit comparison row
3. Automation templates library — search bar + filters (trigger app, action app, category, difficulty), card grid (each card: trigger app logo + action app logo with arrow between, use case title, difficulty badge, time-saved badge, 'View Template' CTA), template detail page with full step-by-step guide
4. Platform comparison pages — feature matrix with task limits row, pricing tiers table, API access row, error handling row, recommended for row
5. Use case guide pages — intro, tool recommendation, step-by-step setup, template CTA
6. Tutorials index — filterable by tool and difficulty level
7. Cost calculator — dedicated full-page version of the calculator widget

DATABASE (Supabase):
- tools: id, name, slug, logo_url, affiliate_url, rating, review_body, pricing_tiers (jsonb), monthly_task_limits (jsonb), integrations_count, has_free_plan, pros[], cons[], created_at
- automation_templates: id, slug, title, description, trigger_app, action_app, steps (jsonb array), difficulty (1-3), time_saved_minutes, tools_needed[], created_at
- articles: id, slug, title, body, category, tags[], seo_title, seo_description, published_at, status
- subscribers: id, email, subscribed_at, active

ADMIN DASHBOARD (/admin, password protected):
- Article management (list, publish, edit, delete)
- Template management (add/edit/delete templates)
- Tool management (pricing updates, rating updates)
- Subscriber export
- Affiliate click tracking by tool

WEBHOOK ENDPOINTS:
- POST /api/publish-article
- POST /api/add-template
- POST /api/update-pricing
- GET /api/keyword-queue

INTERACTIVE TOOLS:
1. Automation Cost Calculator — sliders for automation count and monthly tasks, real-time cost table for 5 platforms, recommended plan highlighting, affiliate CTAs
2. Automation Idea Generator — textarea input for business description, calls Gemini API, returns 10 automation ideas with tool links
3. Integration Checker — two app name inputs, returns compatibility data from templates database
4. Workflow Complexity Estimator — text input, Gemini analysis, returns complexity score and tool recommendation

SEO: Auto meta tags, JSON-LD HowTo schema on tutorial pages, SoftwareApplication schema on tool pages, sitemap, IndexNow.
EMAIL: Resend integration, weekly newsletter of top automation recipes.""",
},

# ─── SITE 3 ────────────────────────────────────────────────────────────────────
{
"num": 3,
"title": "No-Code Database & Backend",
"subtitle": "Where does your data live? Answered completely.",
"domain": "e.g. nocode-backend.com",
"tagline": "Set up your database, backend, and APIs without writing a single line of code.",
"purpose": "Captures the moment every no-code builder hits the wall — 'where does my data go?' Covers Supabase, Airtable, Xano, NocoDB, Baserow, Pocketbase, and all backend-as-a-service tools. Highly technical audience = high affiliate conversion rates.",
"audience": "No-code builders who have outgrown simple tools and need a real database. App builders using Bubble, Glide, or Webflow who need backend power. Developers evaluating no-code backends for rapid prototyping.",

"pages": [
    ("Homepage", "Hero, tool category grid (Database-as-a-service, Backend-as-a-service, BaaS with auth, Headless CMS, File storage), featured comparisons, schema builder tool embed, articles feed"),
    ("Tool Reviews", "Supabase, Airtable, Xano, NocoDB, Baserow, Appwrite, Pocketbase, Directus, Hasura, Firebase, PlanetScale, Neon — full reviews"),
    ("Comparison Pages", "Supabase vs Firebase, Airtable vs Notion, Xano vs Supabase, etc."),
    ("Guides by Use Case", "Backend for a SaaS app, Database for a directory site, Auth without code, File uploads without code, Real-time data without code"),
    ("Integration Guides", "Connecting Supabase to Lovable, Airtable to Zapier, Xano to Webflow, etc."),
    ("Tutorials Index", "Step-by-step database setup guides, filterable by tool and complexity"),
],

"database_schema": [
    ("tools", "id, name, slug, logo_url, affiliate_url, category (db/backend/cms/storage), rating, review_body, pricing_tiers (JSON), free_tier_limits (JSON), row_limits, storage_limits, auth_included (bool), realtime (bool), rest_api (bool), graphql (bool), pros[], cons[]"),
    ("integration_guides", "id, slug, tool_a, tool_b, title, body, difficulty, steps (JSON), created_at"),
    ("articles", "standard schema"),
    ("subscribers", "standard schema"),
],

"autonomous_systems": [
    ("Article Generation", "4/day. Types: 1× tool review, 1× integration guide (tool A + tool B from popular combinations), 1× use-case tutorial, 1× comparison. Integration guide articles are highest-value — very specific long-tail keywords, low competition."),
    ("Free Tier Monitor", "Monthly: checks free tier limits for all tools (Supabase, Airtable etc. change these). Flags for article updates. Critical for trust."),
    ("Quality Gate Extra Rule", "All tutorials must include exact Supabase/Airtable table structure code or screenshots. No vague 'set up your database' without specifics."),
],

"tools_to_build": [
    ("Visual Schema Builder", "Drag-and-drop table builder. User creates tables, adds columns (with type selector: text/number/boolean/date/relation), sets relationships. Outputs: Supabase SQL schema, Airtable base structure description, and a copy-paste setup guide. Built in React."),
    ("Backend Recommender", "Inputs: project type, expected rows (slider), team size, budget (slider), need for auth (bool), need for realtime (bool), need for file storage (bool). Returns: top 3 backend recommendations ranked with explanation and affiliate links."),
    ("Pricing Limit Calculator", "Input: expected database rows, API calls/month, team members. Shows which free tiers accommodate it and when paid plans are needed across 6 tools."),
    ("SQL to No-Code Translator", "User pastes a SQL schema. Gemini translates it into: Airtable base structure, Supabase table setup instructions, and Xano API setup. Practical tool with high shareability."),
],

"affiliate_programs": [
    "Supabase — check PartnerStack for current program",
    "Airtable — via Impact, $10–50 per conversion",
    "Xano — direct affiliate, check current rates",
    "NocoDB — open source, sponsorship model",
    "Firebase (Google) — no direct affiliate but high-volume referral",
    "PlanetScale — check current program post-pricing changes",
    "Neon — check current program",
],

"seo_targets": [
    "'supabase vs firebase' — 5,400/month",
    "'airtable alternatives' — 6,600/month",
    "'no code database' — 3,600/month",
    "'supabase tutorial' — 4,400/month",
    "'airtable vs notion' — 4,000/month",
    "'xano review' — growing",
    "'backend for no code app' — 1,300/month",
],

"monetisation": [
    ("Affiliate links", "Airtable and Supabase have established programs. Xano converts well with tutorials."),
    ("Sponsored listings", "Backend tools pay well — small niche, high LTV customers."),
    ("Schema builder tool", "Future: export schemas as downloadable files for $5–15."),
    ("Display ads", "AdSense → Mediavine."),
],

"lovable_prompt": """Build a no-code database and backend tools review site called [SITE NAME].

DESIGN: Deep blue accent (#0369a1), off-white background, Space Grotesk headings, Inter body. Technical, trustworthy aesthetic. Code snippet styling throughout (dark code blocks with syntax-like formatting). Fully responsive.

PAGES:
1. Homepage — hero ('Your data has to live somewhere'), category grid (6 backend categories with icons), featured tool cards, schema builder embed (compact version), latest tutorials feed
2. Tool review pages — standard review structure PLUS: limits table (rows, API calls, storage, team members), API type badges (REST/GraphQL/Realtime), auth-included badge, code snippet example showing basic query for that platform
3. Comparison pages — detailed feature matrix including: free tier limits row, row/record limits row, API types row, auth support row, file storage row, pricing at 10k/100k/1M rows
4. Use-case guide pages — scenario description, recommended stack, step-by-step with code-style snippets
5. Integration guide pages — two-tool setup, step-by-step with screenshots described, common errors section
6. Tutorials index — filterable by tool and difficulty

DATABASE (Supabase):
- tools: id, name, slug, logo_url, affiliate_url, category, rating, review_body, pricing_tiers (jsonb), free_tier_limits (jsonb: {rows, api_calls, storage_gb, team_members}), has_auth, has_realtime, has_rest_api, has_graphql, pros[], cons[]
- integration_guides: id, slug, tool_a_id, tool_b_id, title, body, difficulty, steps (jsonb), created_at
- articles: standard
- subscribers: standard

ADMIN: Standard dashboard + integration guide manager.

WEBHOOK ENDPOINTS: Standard set + POST /api/add-integration-guide

INTERACTIVE TOOLS:
1. Visual Schema Builder — React drag-drop table designer, column type selector, relationship arrows, exports SQL + Airtable description + copy instructions
2. Backend Recommender — multi-input form, result page with ranked recommendations
3. Pricing Limit Calculator — sliders for rows/calls/members, results table showing free/paid thresholds
4. SQL to No-Code Translator — textarea input, Gemini API call, structured output in 3 formats

SEO: JSON-LD HowTo on tutorials, SoftwareApplication on tools, TechArticle on comparisons.
DESIGN DETAIL: All code examples in dark (#1e1e1e) rounded boxes with monospace font.""",
},

# ─── SITE 4 ────────────────────────────────────────────────────────────────────
{
"num": 4,
"title": "No-Code for Ecommerce",
"subtitle": "Build, launch, and grow your online store without code",
"domain": "e.g. nocode-ecommerce.com",
"tagline": "The biggest no-code category. The most affiliate revenue. Build it right.",
"purpose": "Ecommerce platform reviews and comparisons. Highest-volume keyword niche in the entire network. Shopify, WooCommerce, Wix, Squarespace, BigCommerce, Ecwid — plus the no-code tools that connect to them. Enormous affiliate commissions.",
"audience": "First-time store builders, brick-and-mortar shops going online, dropshippers, digital product sellers, artists and creators selling work. Wide skill range, high buying intent.",

"pages": [
    ("Homepage", "Hero, platform picker quiz embed, platform comparison strip (logos + 1-line verdict), use-case categories (Physical products / Digital products / Dropshipping / Services / Subscriptions), featured comparisons, latest reviews"),
    ("Platform Reviews", "Shopify, Wix eCommerce, Squarespace Commerce, BigCommerce, WooCommerce, Ecwid, Sellfy, Gumroad, Lemon Squeezy, Podia, Payhip — full reviews"),
    ("Comparison Pages", "Shopify vs Wix, Shopify vs Squarespace, Gumroad vs Lemon Squeezy, etc."),
    ("Use-Case Pages", "Best platform for: dropshipping / digital downloads / subscription boxes / handmade goods / courses / services"),
    ("Fee Calculator Page", "Full-page transaction fee calculator"),
    ("App & Integration Reviews", "Reviews of Shopify apps, WooCommerce plugins, Zapier integrations for stores — high-volume long-tail SEO"),
    ("Tutorials", "Setting up a store from scratch, payment gateways, shipping setup, inventory automation, abandoned cart recovery"),
],

"database_schema": [
    ("platforms", "id, name, slug, logo_url, affiliate_url, category (physical/digital/both), rating, review_body, pricing_tiers (JSON), transaction_fees (JSON), free_trial (bool), free_plan (bool), app_store (bool), dropshipping_native (bool), digital_products (bool), subscriptions (bool), pros[], cons[]"),
    ("apps_plugins", "id, name, slug, platform, category, affiliate_url, rating, review_body, price, pros[], cons[]"),
    ("articles", "standard"),
    ("subscribers", "standard"),
],

"autonomous_systems": [
    ("Article Generation", "4/day: 1× platform review/update, 1× app/plugin review, 1× use-case guide ('Best Shopify apps for dropshipping'), 1× comparison. App reviews are extremely valuable — thousands of 'best [app] alternative' searches."),
    ("Fee Monitor", "Weekly: checks transaction fees and pricing for Shopify, Wix, BigCommerce. These change. Outdated fee info is a major user complaint — staying accurate is a competitive advantage."),
    ("App Store Scraper", "Weekly: pulls new/trending apps from Shopify App Store and WooCommerce marketplace. Adds to article generation queue for reviews."),
],

"tools_to_build": [
    ("Platform Picker Quiz", "10 questions: product type, expected monthly sales (slider), budget (slider), technical skill, need for POS, need for dropshipping, selling internationally (bool). Returns top 3 platforms with detailed explanation and affiliate links."),
    ("Transaction Fee Calculator", "Inputs: monthly GMV (slider), average order value, platform selection (multi-select up to 4). Calculates: platform fee, payment processing fee, total monthly cost, annual cost. Shows which platform is cheapest at their volume. Highly shareable, high SEO value."),
    ("App Stack Recommender", "User selects platform (Shopify/WooCommerce/etc.) and business goals (email marketing / inventory / reviews / upsells / shipping / analytics). Returns curated app stack with setup priority order and affiliate links."),
    ("Revenue Calculator", "Inputs: product price, monthly traffic estimate, conversion rate estimate. Returns: projected monthly revenue, suggested platform at that scale, platform cost as % of revenue."),
],

"affiliate_programs": [
    "Shopify — $150 per merchant referral via Shopify Affiliate Program (high payout)",
    "BigCommerce — $1.50 per lead + revenue share",
    "Wix — $100 per Premium referral via Impact",
    "Squarespace — $100–200 per sale via CJ Affiliate",
    "Sellfy — 25% recurring",
    "Gumroad — no affiliate but high-volume content",
    "Lemon Squeezy — check current program",
    "Podia — 30% recurring",
    "Payhip — affiliate program available",
],

"seo_targets": [
    "'shopify vs wix' — 18,000/month",
    "'best ecommerce platform' — 33,100/month",
    "'squarespace vs shopify' — 12,000/month",
    "'shopify alternatives' — 9,900/month",
    "'best platform for digital products' — 4,400/month",
    "'gumroad vs lemon squeezy' — 2,900/month",
    "'woocommerce vs shopify' — 14,800/month",
],

"monetisation": [
    ("Affiliate links", "Shopify's $150/referral is the single highest affiliate payout in the entire network. 10 referrals/month = $1,500 from one program alone."),
    ("Sponsored listings", "Platform slots. Ecommerce tools have the largest marketing budgets in the SaaS world."),
    ("App reviews", "Each Shopify app review = affiliate opportunity for the app itself."),
    ("Display ads", "Highest RPM in the network — ecommerce audience = buying intent."),
],

"lovable_prompt": """Build a no-code ecommerce platform review site called [SITE NAME].

DESIGN: Forest green accent (#047857), warm white background, Nunito Sans headings and body. Friendly, commercial aesthetic. Shopping-inspired UI elements (product cards, price tags). Fully responsive.

PAGES:
1. Homepage — hero with platform picker quiz CTA, platform cards strip (logo, name, best-for badge, star rating, affiliate CTA), use-case category tiles (6 tiles with icons), transaction fee calculator embed, latest reviews feed
2. Platform review pages — full review with: pricing tiers table (features per tier), transaction fees table (platform fee + payment processing fee), pros/cons, best for section, screenshot gallery descriptions, affiliate CTA (prominent, above fold on mobile)
3. Comparison pages — side-by-side matrix: pricing, transaction fees, free plan, app store, dropshipping support, digital products, subscriptions, POS, international selling
4. Use-case guide pages — recommended platforms ranked 1-3, pros for this use case, setup guide, affiliate CTAs
5. Fee calculator — full page, prominent, highly interactive
6. App/plugin reviews — searchable directory, filter by platform, category, price (free/paid)
7. Tutorials — filterable by platform and topic

DATABASE (Supabase):
- platforms: id, name, slug, logo_url, affiliate_url, category, rating, review_body, pricing_tiers (jsonb), transaction_fees (jsonb), has_free_trial, has_free_plan, has_app_store, supports_dropshipping, supports_digital, supports_subscriptions, supports_pos, pros[], cons[]
- apps: id, name, slug, platform_id, category, affiliate_url, rating, review_body, price_monthly, free_plan (bool), pros[], cons[]
- articles: standard
- subscribers: standard

ADMIN: Standard + app directory management.

WEBHOOK ENDPOINTS: Standard set + POST /api/add-app-review

INTERACTIVE TOOLS:
1. Platform Picker Quiz — 10-step form with progress bar, animated result reveal with top 3 platforms, share result button
2. Transaction Fee Calculator — GMV slider ($0–$500k/month), platform multi-select checkboxes (up to 4), animated cost breakdown bars, monthly + annual totals, 'cheapest for you' highlight
3. App Stack Recommender — platform selector + goal checkboxes, curated stack output with priority order
4. Revenue Calculator — three inputs, projected revenue output with platform cost overlay

SEO: JSON-LD Product schema on platform pages (for rich results), HowTo on tutorials, FAQPage on comparison pages.""",
},

# ─── SITE 5 ────────────────────────────────────────────────────────────────────
{
"num": 5,
"title": "No-Code AI Integration",
"subtitle": "Add AI features to your existing no-code apps without writing code",
"domain": "e.g. nocode-ai.com",
"tagline": "The hottest niche in no-code. Everyone who built something now wants to make it smart.",
"purpose": "Captures the fastest-growing segment: people who already have a no-code app or site and now want to layer AI on top of it. AI chatbots, AI content generation, AI image generation, AI automation — all without touching code. Fastest-growing keyword volume in the network.",
"audience": "No-code builders with existing apps, small business owners wanting AI features, Zapier/Make users wanting AI steps, bloggers wanting AI content tools, entrepreneurs building AI-powered MVPs.",

"pages": [
    ("Homepage", "Hero, AI feature category grid (Chatbots / Content generation / Image generation / Data analysis / Voice / Automation), featured integrations, API cost calculator, model comparison table, articles feed"),
    ("AI Tool Reviews", "OpenAI API, Anthropic Claude API, Google Gemini API, Stability AI, ElevenLabs, Perplexity API, Mistral, Cohere — reviews focused on no-code use cases"),
    ("Integration Guides", "Adding AI chat to Bubble, AI content to Webflow, AI image gen to Shopify, Gemini to Zapier, Claude to Make, GPT to Glide"),
    ("Prompt Template Library", "300+ categorised prompts for common no-code use cases: review generation, product descriptions, customer support responses, SEO meta tags, email sequences"),
    ("API Cost Calculator Page", "Full-page version of the cost calculator"),
    ("No-Code AI Tool Reviews", "Tools that add AI without API: Voiceflow, Botpress, Tidio AI, Intercom Fin, Durable AI, etc."),
    ("Tutorials", "Step-by-step guides for each integration"),
],

"database_schema": [
    ("ai_apis", "id, name, slug, logo_url, affiliate_url, provider, category (text/image/voice/code), rating, review_body, pricing_per_1m_input_tokens, pricing_per_1m_output_tokens, free_tier (JSON), context_window_k, best_for[], pros[], cons[]"),
    ("nocode_ai_tools", "id, name, slug, logo_url, affiliate_url, category, rating, review_body, pricing_tiers (JSON), requires_api_key (bool), platforms_supported[], pros[], cons[]"),
    ("prompt_templates", "id, slug, title, category, use_case, prompt_text, example_output, tags[], created_at"),
    ("integration_guides", "id, slug, ai_tool, nocode_platform, title, body, difficulty, steps (JSON), created_at"),
    ("articles", "standard"),
    ("subscribers", "standard"),
],

"autonomous_systems": [
    ("Article Generation", "4/day: 1× AI API review/update (pricing changes frequently), 1× integration guide (AI tool + no-code platform pair), 1× prompt template collection article, 1× tutorial. AI pricing changes extremely fast — auto-monitor and update."),
    ("AI Pricing Monitor", "Daily: checks OpenAI, Anthropic, Google AI pricing pages. Any change triggers immediate article update and newsletter alert. Pricing freshness is the #1 trust signal in this niche."),
    ("Prompt Template Generator", "Weekly: Gemini generates 20 new prompt templates for underrepresented use cases. Auto-added to library after quality check."),
],

"tools_to_build": [
    ("AI API Cost Calculator", "Inputs: use case (content generation/chatbot/image gen/data analysis), expected monthly volume (slider), average input length, average output length. Calculates monthly cost across OpenAI GPT-4o, Claude Sonnet, Gemini Flash, Gemini Pro, Mistral. Shows cost comparison chart, recommends cheapest model for use case, includes affiliate links."),
    ("AI Feature Selector", "User describes what they want to add to their app (free text). Gemini analyses intent and returns: recommended AI API, recommended no-code connector tool, estimated monthly cost, link to integration guide."),
    ("Prompt Tester", "User selects a prompt template from library, edits it, tests it live via Gemini API call, sees output in real time. Encourages email signup to save custom prompts."),
    ("No-Code AI Stack Builder", "User selects their no-code platform (Bubble/Webflow/etc.) + desired AI features (checkboxes). Returns complete recommended AI stack with setup order, estimated monthly cost, and links to integration guides."),
],

"affiliate_programs": [
    "OpenAI — no public affiliate but content drives API signups",
    "Anthropic — check current program",
    "ElevenLabs — affiliate program available, 22% recurring",
    "Voiceflow — check PartnerStack",
    "Botpress — check current program",
    "Tidio — 20% recurring via direct",
    "Durable — affiliate program available",
    "Perplexity — referral program",
],

"seo_targets": [
    "'add ai to website without code' — growing fast",
    "'openai api no code' — 2,400/month",
    "'chatgpt for website' — 8,100/month",
    "'ai chatbot no code' — 4,400/month",
    "'gemini api tutorial' — 3,600/month",
    "'bubble ai integration' — 1,000/month growing",
    "'no code ai tools' — 4,400/month",
],

"monetisation": [
    ("Affiliate links", "ElevenLabs, Voiceflow, Tidio have strong programs. Volume from API tutorials is enormous."),
    ("Sponsored listings", "AI tool companies have massive marketing budgets — highest CPM of any slot in the network."),
    ("Prompt template premium pack", "Future: curated prompt packs at $19–49."),
    ("Display ads", "AI audience = high CPM. Tech-forward readers."),
],

"lovable_prompt": """Build a no-code AI integration resource site called [SITE NAME].

DESIGN: Amber accent (#b45309), dark charcoal (#1a1a2e) hero section, white content area. Futuristic but approachable. Geist font family. Neural network pattern as subtle hero background (CSS-generated dots pattern). Fully responsive.

PAGES:
1. Homepage — dark hero ('Make your app intelligent'), AI category grid with animated icons, API cost calculator embed, featured integration guides, model comparison table strip, articles feed
2. AI API review pages — review structure PLUS: pricing table (input/output per 1M tokens), context window badge, free tier details, speed benchmark (relative), use case fit tags
3. No-code AI tool reviews — standard review structure, platforms-supported badges
4. Integration guide pages — two-column layout on desktop (guide left, code/config snippets right), step tracker sidebar, difficulty + time estimate header badges
5. Prompt template library — category tabs (Content / Customer Service / SEO / Email / Analysis / Image), search bar, template cards (title, use case, copy button), template detail page with live tester
6. API cost calculator — full page, animated chart output
7. Tutorials index — filter by AI tool + no-code platform combination

DATABASE (Supabase):
- ai_apis: id, name, slug, logo_url, affiliate_url, provider, rating, review_body, input_price_per_1m, output_price_per_1m, free_tier_details (jsonb), context_window_k, best_for[], pros[], cons[], last_price_update
- nocode_ai_tools: id, name, slug, logo_url, affiliate_url, category, rating, review_body, pricing_tiers (jsonb), requires_api_key, platforms_supported[], pros[], cons[]
- prompt_templates: id, title, category, use_case, prompt_text, example_output, tags[], copy_count, created_at
- integration_guides: id, slug, ai_tool_id, nocode_platform, title, body, difficulty, estimated_minutes, steps (jsonb), created_at
- articles: standard
- subscribers: standard

ADMIN: Standard + prompt template manager (add/edit/delete), pricing update alerts dashboard.

WEBHOOK ENDPOINTS: Standard + POST /api/add-prompt-template + POST /api/update-api-pricing

INTERACTIVE TOOLS:
1. AI API Cost Calculator — use case selector, volume sliders, animated bar chart comparing 5 models, monthly + annual cost, cheapest recommendation, affiliate CTAs
2. AI Feature Selector — Gemini-powered text analysis, structured output with tool + guide + cost
3. Prompt Tester — select template, edit inline, 'Test with Gemini' button, output display panel, 'Save to Account' CTA (triggers signup)
4. No-Code AI Stack Builder — platform dropdown + feature checkboxes, stack output with priority order and cost estimate

SEO: JSON-LD TechArticle, HowTo schemas. Pricing pages updated same-day on any API price change.""",
},

# ─── SITE 6 ────────────────────────────────────────────────────────────────────
{
"num": 6,
"title": "No-Code for Agencies",
"subtitle": "Build client projects faster, charge more, deliver better",
"domain": "e.g. nocode-agency.com",
"tagline": "The no-code agency playbook — tools, workflows, and templates to scale your client work.",
"purpose": "Highest-value audience in the network. Agency owners and freelancers have money, buy tools, refer others, and pay for sponsored content. CPM and affiliate conversion rates are 3–5× higher than consumer audiences. Content focuses on business outcomes, not just tutorials.",
"audience": "Freelance web designers and developers transitioning to no-code, boutique agencies (1–10 people), consultants building client portals, marketing agencies adding web/app services.",

"pages": [
    ("Homepage", "Hero ('Build more. Bill more.'), tool category grid, proposal generator CTA, case studies section, pricing calculator, featured articles"),
    ("Tool Reviews", "Webflow (agency plans), Framer, Softr (client portals), Stacker, Glide (client apps), JetBoost, Memberstack, Outseta — agency-focused reviews with white-label notes"),
    ("Business Guides", "How to price no-code services, how to find no-code clients, agency contract templates, how to productise your services, building recurring revenue"),
    ("Client Workflow Guides", "Onboarding a new client, handing off a no-code project, setting client permissions, collecting feedback without email chaos"),
    ("Tool Comparison Pages", "Webflow vs Framer for agencies, Softr vs Stacker for client portals, etc."),
    ("Pricing Guide", "What to charge for no-code projects — rates by project type, region, experience level"),
    ("Tutorials", "Agency-specific tutorials with business context"),
],

"database_schema": [
    ("tools", "id, name, slug, logo_url, affiliate_url, category, rating, review_body, pricing_tiers (JSON), agency_plan (bool), white_label (bool), client_permissions (bool), reseller_program (bool), pros[], cons[]"),
    ("business_guides", "id, slug, title, body, category (pricing/sales/delivery/operations), published_at"),
    ("articles", "standard"),
    ("subscribers", "standard"),
    ("proposal_templates", "id, title, project_type, content_template, created_at"),
],

"autonomous_systems": [
    ("Article Generation", "4/day: 1× tool review (agency angle — always mention white-label, client permissions, reseller), 1× business guide (pricing, sales, operations), 1× client workflow tutorial, 1× comparison. Business guides are extremely underserved — most no-code content is technical, not business-focused."),
    ("Industry News Monitor", "Weekly: scans for new no-code tools releasing agency/white-label plans. Fast coverage of these = early traffic spike."),
],

"tools_to_build": [
    ("AI Client Proposal Generator", "Inputs: project type (website/app/portal/automation), client industry, key features needed (checkboxes), timeline, rough budget range. Gemini generates a complete proposal document with: project overview, scope of work, deliverables, timeline, pricing (3 tiers), terms summary. Output: copy-paste formatted text + downloadable structure."),
    ("Project Scope Estimator", "User describes project in plain English. Returns: estimated hours by phase (discovery/design/build/QA/launch), recommended tools, ballpark price range, red flags in the brief."),
    ("No-Code Agency Pricing Calculator", "Inputs: years experience, location (dropdown by region), project complexity (1–5), rush factor (bool). Returns: suggested hourly rate, suggested project rate ranges by type, market context."),
    ("White-Label Tool Finder", "Filter: tool category + white-label required + client permissions required + price range. Returns matching tools from database with comparison table."),
],

"affiliate_programs": [
    "Webflow — agency plan referrals, high value",
    "Framer — agency plan via direct program",
    "Softr — PartnerStack, 30% recurring",
    "Stacker — check current program",
    "Memberstack — 30% recurring",
    "Outseta — 20% recurring",
    "Glide — PartnerStack",
    "JetBoost — direct affiliate",
],

"seo_targets": [
    "'webflow agency' — 4,400/month",
    "'no code agency' — 2,900/month",
    "'framer vs webflow' — 5,400/month",
    "'how to start a no code agency' — growing",
    "'client portal no code' — 1,900/month",
    "'no code freelancer' — 1,300/month",
    "'webflow white label' — 1,600/month",
],

"monetisation": [
    ("Affiliate links", "Agency plan referrals for Webflow, Framer, Softr = highest per-click value in the network."),
    ("Sponsored listings", "Premium pricing — agency tool makers have high LTV customers and large marketing budgets."),
    ("Proposal template sales", "Future: premium proposal and contract templates at $29–99."),
    ("Newsletter", "Agency audience = high open rates, premium sponsorship value."),
],

"lovable_prompt": """Build a no-code agency tools and business resource site called [SITE NAME].

DESIGN: Deep rose accent (#be123c), crisp white background, dark headings. Editorial magazine aesthetic. Playfair Display for headings, Inter for body. Professional, premium feel. Fully responsive.

PAGES:
1. Homepage — hero ('Build more. Bill more.'), business-outcome-focused subheadline, tool category grid (6 categories: Website Builders / Client Portals / Membership / Automation / Project Management / Billing), agency-specific badges on tool cards (white-label / client permissions / reseller), proposal generator CTA banner, business guides feed, case study cards
2. Tool review pages — standard review PLUS: agency-specific section ('Agency Use Case', 'White Label Available', 'Client Permission Levels', 'Reseller Program'), pricing with agency plan callout
3. Business guide pages — long-form editorial layout, pull quotes, table of contents sidebar
4. Workflow guide pages — step-by-step with client communication templates embedded
5. Pricing guide page — regional rate tables, project type rate ranges, downloadable rate card CTA
6. Comparison pages — agency-focused comparison with white-label and client management rows

DATABASE (Supabase):
- tools: id, name, slug, logo_url, affiliate_url, category, rating, review_body, pricing_tiers (jsonb), has_agency_plan, has_white_label, has_client_permissions, has_reseller_program, min_price_monthly, pros[], cons[]
- business_guides: id, slug, title, body, category, excerpt, published_at, reading_time_mins
- proposal_templates: id, title, project_type, template_content, created_at
- articles: standard
- subscribers: standard

ADMIN: Standard + proposal template manager.

WEBHOOK ENDPOINTS: Standard + POST /api/add-business-guide

INTERACTIVE TOOLS:
1. AI Proposal Generator — multi-step form, Gemini API call, formatted proposal output with copy button and 'Download as PDF' CTA (triggers email capture)
2. Project Scope Estimator — text input, Gemini analysis, phase-by-phase breakdown output
3. Agency Pricing Calculator — dropdown + slider inputs, rate range output with market context
4. White-Label Tool Finder — filter form, results table from database

SEO: JSON-LD Article on business guides, HowTo on workflow guides, FAQPage on pricing guide.""",
},

# ─── SITE 7 ────────────────────────────────────────────────────────────────────
{
"num": 7,
"title": "No-Code Analytics & SEO",
"subtitle": "Understand your traffic, rank higher, grow faster — without a developer",
"domain": "e.g. nocode-analytics.com",
"tagline": "Every person who builds a no-code site immediately needs to understand their traffic and rank on Google.",
"purpose": "Captures the universal next step after building: 'How do I get traffic?' and 'How do I understand who's visiting?' Covers GA4, Search Console, Hotjar, Clarity, Plausible, Fathom, and all SEO tools that work with no-code platforms. Enormous long-tail SEO content opportunity.",
"audience": "No-code builders who just launched and want traffic. Small business owners who set up GA4 and are completely lost. Bloggers and content creators wanting to understand SEO without an agency.",

"pages": [
    ("Homepage", "Hero, tool category grid (Analytics / SEO Tools / Heatmaps / A/B Testing / Rank Tracking / Reporting), setup checklist tool, latest tutorials feed, email signup"),
    ("Analytics Tool Reviews", "Google Analytics 4, Plausible, Fathom, Mixpanel, Amplitude, Clarity, Hotjar, PostHog — full reviews with no-code platform compatibility notes"),
    ("SEO Tool Reviews", "Ahrefs, SEMrush, Ubersuggest, Mangools, Surfer SEO, RankMath, Yoast — with no-code platform integration notes"),
    ("Platform-Specific SEO Guides", "SEO for Webflow, SEO for Bubble, SEO for Shopify, SEO for Framer, SEO for Squarespace, SEO for Lovable — each a comprehensive guide"),
    ("GA4 Setup Guides", "GA4 for Webflow, GA4 for Shopify, GA4 for Squarespace — highly searched, high affiliate value"),
    ("Core Web Vitals Guides", "What they are, how to measure them on each platform, how to fix common issues without a developer"),
    ("Tutorials", "Keyword research for beginners, understanding GA4 reports, setting up Search Console, rank tracking on a budget"),
],

"database_schema": [
    ("tools", "id, name, slug, logo_url, affiliate_url, category (analytics/seo/heatmap/testing/tracking), rating, review_body, pricing_tiers (JSON), free_plan (bool), no_code_integration (JSON — platform compatibility), cookie_free (bool), gdpr_compliant (bool), pros[], cons[]"),
    ("platform_guides", "id, slug, platform, guide_type (seo/analytics/cwv), title, body, difficulty, last_updated"),
    ("articles", "standard"),
    ("subscribers", "standard"),
    ("seo_checklist_items", "id, category, item_text, priority (high/medium/low), platform_specific (nullable)"),
],

"autonomous_systems": [
    ("Article Generation", "4/day: 1× tool review, 1× platform-specific SEO/analytics guide, 1× tutorial (keyword research / GA4 report / Search Console setup), 1× comparison. Platform-specific guides ('SEO for Webflow 2026') are extremely high-intent and low-competition."),
    ("Google Algorithm Update Monitor", "RSS feed monitor for Search Engine Journal, Search Engine Land, Google blog. On major update: auto-generates impact analysis article within 24 hours. Fastest coverage = most backlinks."),
    ("CWV Monitor", "Weekly: checks Core Web Vitals benchmarks. Articles updated when benchmarks change."),
],

"tools_to_build": [
    ("SEO Setup Checklist Generator", "User selects their no-code platform. Generates a complete, prioritised SEO setup checklist specific to that platform: 30–50 items across technical SEO, on-page, content, and off-page. Each item has a difficulty rating and estimated time. Downloadable as PDF (email gate)."),
    ("Keyword Research Tool (Lightweight)", "User enters seed keyword and niche. Calls a keyword API (or Gemini for suggestions) and returns: 20 related keywords, estimated search volume ranges, competition level (low/medium/high), content type suggestion (review/tutorial/comparison/list). Encourages upgrade to Ahrefs/SEMrush via affiliate links."),
    ("Core Web Vitals Explainer", "User enters their site URL. Calls Google PageSpeed API. Returns: CWV scores with plain-English explanations, specific fixes for their platform, links to relevant tutorials."),
    ("GA4 Report Builder Guide", "Step-by-step interactive guide for building the 5 most important GA4 reports. User selects their platform, gets platform-specific instructions. Each step has a 'Done' checkbox. Completion triggers email signup CTA."),
],

"affiliate_programs": [
    "Ahrefs — $0 new user trials but content drives signups",
    "SEMrush — $200 per sale via Berush affiliate",
    "Mangools — 30% recurring via direct program",
    "Surfer SEO — 25% recurring",
    "Hotjar — check current program",
    "Plausible — 30% for first year via direct",
    "Fathom Analytics — 25% recurring",
    "Rank Math Pro — one-time commission",
],

"seo_targets": [
    "'seo for webflow' — 2,900/month",
    "'google analytics 4 tutorial' — 8,100/month",
    "'plausible vs google analytics' — 2,400/month",
    "'shopify seo' — 14,800/month",
    "'core web vitals' — 9,900/month",
    "'seo tools' — 33,100/month",
    "'hotjar alternatives' — 3,600/month",
],

"monetisation": [
    ("Affiliate links", "SEMrush at $200/sale is outstanding. Mangools and Surfer recurring programs."),
    ("Sponsored listings", "SEO tools spend heavily on content marketing — prime sponsored slot buyers."),
    ("Checklist PDF (email gate)", "Drives subscriber list growth. Each platform-specific checklist = email capture."),
    ("Display ads", "High-intent audience, good RPM."),
],

"lovable_prompt": """Build a no-code analytics and SEO tools resource site called [SITE NAME].

DESIGN: Cyan accent (#0891b2), white background, clean data-forward aesthetic. IBM Plex Sans for headings and body. Chart-like visual elements, grid layouts. Fully responsive.

PAGES:
1. Homepage — hero ('Know where you stand, rank where you should'), tool categories, SEO checklist generator CTA, platform-specific guide tiles (one per major no-code platform), latest tutorials
2. Tool review pages — standard review PLUS: platform compatibility table (which no-code platforms it integrates with natively), GDPR compliance badge, cookie-free badge, free plan indicator
3. Platform SEO guides — long-form layout with table of contents, platform logo in header, last-updated date prominently shown, checklist section, relevant tool recommendations with affiliate CTAs
4. GA4 setup guides — step-by-step with numbered steps, screenshot placeholder boxes, 'mark as done' checkboxes (local state), estimated time per step
5. Core Web Vitals pages — score explainer cards, platform-specific fix sections
6. Tutorials — filterable by tool and platform

DATABASE (Supabase):
- tools: id, name, slug, logo_url, affiliate_url, category, rating, review_body, pricing_tiers (jsonb), has_free_plan, is_cookie_free, is_gdpr_compliant, platform_integrations (jsonb: {platform: native|manual|not_supported}), pros[], cons[]
- platform_guides: id, slug, platform, guide_type, title, body, difficulty, checklist_items (jsonb), last_updated
- articles: standard
- seo_checklist_items: id, category, item_text, priority, platform
- subscribers: standard

ADMIN: Standard + platform guide manager with 'last updated' tracking.

WEBHOOK ENDPOINTS: Standard + POST /api/update-platform-guide

INTERACTIVE TOOLS:
1. SEO Setup Checklist Generator — platform dropdown, generates 30-50 item checklist, interactive checkboxes (local state saved to localStorage), progress bar, 'Download as PDF' triggers email capture modal
2. Keyword Research Tool — seed keyword input + niche dropdown, Gemini API generates 20 keywords with metadata, export to CSV button
3. Core Web Vitals Checker — URL input, Google PageSpeed API call, score display with colour coding, platform-specific fix suggestions
4. GA4 Report Builder Guide — platform selector, 5-report interactive guide with step checkboxes

SEO: JSON-LD HowTo on all setup guides, FAQPage on comparison pages, TechArticle on tool reviews.""",
},

# ─── SITE 8 ────────────────────────────────────────────────────────────────────
{
"num": 8,
"title": "No-Code for SaaS Founders",
"subtitle": "Build, launch, and monetise a SaaS product without writing code",
"domain": "e.g. nocode-saas.com",
"tagline": "You don't need to code to build software people pay for.",
"purpose": "Serves the most ambitious no-code builders — people building actual software products with subscription revenue. Highest conversion rates in the network because visitors are actively building products and buying tools to do it. Covers Bubble, Glide, Softr, Billfold, Stripe, and the full SaaS building stack.",
"audience": "Entrepreneurs building SaaS MVPs, non-technical founders, indie hackers, people who want to escape employment by building a product. High motivation, moderate-to-high willingness to pay.",

"pages": [
    ("Homepage", "Hero ('Build software. Charge for it.'), SaaS building stage guide (Idea → MVP → Launch → Scale), tool stack recommender, MRR calculator, success story section, articles feed"),
    ("Tool Reviews", "Bubble, Glide, Softr, Stacker, AppGyver, Retool, Adalo, Noloco, Stripe, Lemon Squeezy, Memberstack, Outseta, Whalesync, Nango — SaaS-focused reviews"),
    ("SaaS Building Guides", "How to build a SaaS with Bubble, adding subscriptions without code, user authentication for no-code apps, building a multi-tenant SaaS, scaling a no-code app past 1k users"),
    ("Monetisation Guides", "Setting up Stripe without code, pricing your SaaS, free trial vs freemium, annual vs monthly billing, dunning management without code"),
    ("Launch Guides", "Product Hunt launch strategy for no-code founders, AppSumo launch guide, soft launch checklist"),
    ("Stage-Specific Tool Recommendations", "Best tools for: idea validation / MVP build / early growth / scaling"),
    ("Tutorials", "Platform-specific SaaS build walkthroughs"),
],

"database_schema": [
    ("tools", "id, name, slug, logo_url, affiliate_url, category (builder/payments/auth/crm/analytics/scaling), rating, review_body, pricing_tiers (JSON), free_trial (bool), saas_specific (bool), multi_tenant (bool), stripe_native (bool), pros[], cons[]"),
    ("saas_guides", "id, slug, title, body, stage (idea/mvp/launch/scale), platform, category, published_at"),
    ("articles", "standard"),
    ("subscribers", "standard"),
    ("mrr_calculator_sessions", "id, inputs (JSON), result, created_at"),
],

"autonomous_systems": [
    ("Article Generation", "4/day: 1× tool review (SaaS angle — always cover auth, multi-tenancy, Stripe integration), 1× build guide (platform-specific SaaS tutorial), 1× monetisation guide, 1× launch/growth guide. SaaS build walkthroughs are extremely high-value and have low competition."),
    ("Indie Hacker / Product Hunt Monitor", "Weekly: scrapes Product Hunt for no-code SaaS launches. Generates interview-style success story articles ('How [founder] built [SaaS] with Bubble'). Enormous backlink bait."),
    ("Stripe/Payment Tool Monitor", "Monthly: checks for Stripe fee changes, new payment tool launches. Immediate article on any change."),
],

"tools_to_build": [
    ("SaaS Pricing Page Builder", "User inputs: product name, target audience, 3 feature tiers (labels + features list + price). Generates a fully rendered, copy-paste pricing page HTML with monthly/annual toggle. Output includes recommended psychological pricing anchors and upgrade prompts."),
    ("MRR & Growth Calculator", "Inputs: current MRR (or $0 for new), monthly new customers estimate, average plan price, monthly churn rate (%). Calculates: MRR at 3/6/12 months, ARR, churn impact, growth rate needed to hit a target (reverse calculator). Interactive chart output."),
    ("No-Code SaaS Stack Recommender", "User inputs: type of SaaS (B2B/B2C/marketplace/internal tool), expected users at launch, budget/month, key features needed (auth/payments/database/email/analytics). Returns: complete tool stack with setup priority, estimated monthly cost at different scales, affiliate links for each tool."),
    ("Churn Calculator", "Inputs: current customers, monthly churn %, average revenue per customer. Shows: monthly lost MRR from churn, annual impact, break-even new customer acquisition needed. Sobering and highly shareable."),
],

"affiliate_programs": [
    "Bubble — PartnerStack, ~30% recurring",
    "Glide — PartnerStack",
    "Softr — PartnerStack, 30% recurring",
    "Memberstack — 30% recurring",
    "Outseta — 20% recurring",
    "Lemon Squeezy — check current program",
    "Noloco — check direct program",
    "Stripe — referral credits, no direct cash affiliate",
    "Stacker — check direct",
],

"seo_targets": [
    "'build saas without coding' — 3,600/month",
    "'bubble saas tutorial' — 2,400/month",
    "'no code saas' — 4,400/month",
    "'how to build an mvp' — 8,100/month",
    "'stripe without code' — 1,900/month",
    "'saas pricing page' — 5,400/month",
    "'indie hacker tools' — growing",
],

"monetisation": [
    ("Affiliate links", "Bubble and Softr are the highest-converting tools in this niche. Recurring commissions compound fast."),
    ("Sponsored listings", "SaaS tool companies love this audience — they are actively building, not just browsing."),
    ("MRR calculator email gate", "Calculation results trigger email capture — highly motivated audience."),
    ("Display ads", "High-intent audience, good RPM."),
],

"lovable_prompt": """Build a no-code SaaS building resource site called [SITE NAME].

DESIGN: Indigo accent (#4338ca), white background. Bold, startup-energy aesthetic. Cabinet Grotesk headings, Inter body. Progress indicators and stage-based UI elements. Fully responsive.

PAGES:
1. Homepage — hero ('Build software. Charge for it.'), SaaS building stage strip (Idea / MVP / Launch / Scale — each a clickable tile leading to stage-specific tools and guides), MRR calculator embed, featured build guides, tool cards grid with SaaS-specific badges (multi-tenant / Stripe native / auth included)
2. Tool review pages — standard review PLUS: SaaS-specific feature table (multi-tenancy, user auth, subscription billing, API access, team management), scalability section ('What happens when you hit 1,000 users?')
3. SaaS build guide pages — long-form with: estimated build time header, difficulty rating, required tools list with affiliate links, step-by-step with milestone markers
4. Monetisation guide pages — revenue model comparisons, Stripe setup instructions, pricing psychology section
5. Launch guide pages — pre-launch checklist, launch day timeline, post-launch actions
6. Stage-based tool recommendation pages — curated lists per stage

DATABASE (Supabase):
- tools: id, name, slug, logo_url, affiliate_url, category, rating, review_body, pricing_tiers (jsonb), has_free_trial, is_saas_specific, supports_multi_tenant, has_stripe_native, has_auth_built_in, pros[], cons[]
- saas_guides: id, slug, title, body, stage, platform, estimated_build_hours, difficulty, required_tools[], published_at
- articles: standard
- subscribers: standard

ADMIN: Standard + SaaS guide manager.

WEBHOOK ENDPOINTS: Standard set.

INTERACTIVE TOOLS:
1. SaaS Pricing Page Builder — tier name inputs + feature checkboxes + price inputs, live preview of pricing table renders as user types, monthly/annual toggle, copy HTML button, affiliate CTAs for recommended tools
2. MRR & Growth Calculator — current MRR slider, new customer/month input, avg price, churn % slider, animated line chart projection to 12 months, ARR callout, email gate for detailed report PDF
3. SaaS Stack Recommender — B2B/B2C/marketplace selector + feature checkboxes + budget slider, complete stack output with cost at 3 scale levels, affiliate links
4. Churn Calculator — 3 inputs, monthly lost MRR output, annual impact, required new customers calculation, 'sobering stats' callout

SEO: JSON-LD HowTo on build guides, SoftwareApplication on tool reviews, FAQPage on monetisation guides.""",
},

# ─── SITE 9 ────────────────────────────────────────────────────────────────────
{
"num": 9,
"title": "No-Code Design & UI",
"subtitle": "Make your no-code app look like a million dollars — without a designer",
"domain": "e.g. nocode-design.com",
"tagline": "Design is the biggest pain point for no-code builders. This site fixes that.",
"purpose": "Addresses the #1 complaint of no-code builders: 'My site/app looks amateur.' Covers UI kits, design systems, Figma-to-no-code workflows, colour theory, typography, and component libraries. Unique in the network — not tool-focused, but skill-focused. Extremely high shareability.",
"audience": "Non-designer no-code builders who want professional-looking results. Developers who can build but can't design. Entrepreneurs building consumer-facing products where design matters.",

"pages": [
    ("Homepage", "Hero, design category grid (UI Kits / Color Tools / Typography / Figma Plugins / Icon Libraries / Component Libraries), design quality checker tool, before/after gallery, latest tutorials"),
    ("Design Tool Reviews", "Figma, Framer (design mode), Canva, Adobe Express, Relume, Flowbase, Finsweet — design tools that integrate with no-code platforms"),
    ("UI Kit & Template Reviews", "Reviews of paid and free UI kits for Webflow, Bubble, Framer, Lovable, FlutterFlow"),
    ("Design Principle Guides", "Color theory for non-designers, typography that works, white space mastery, mobile-first design, accessibility basics"),
    ("Platform Design Guides", "Webflow design tips, Bubble design tips, Framer design tips, Lovable design tips — platform-specific"),
    ("Component Libraries", "Searchable library of free UI components for each platform"),
    ("Before/After Showcase", "Curated gallery of no-code sites before and after design improvements — high shareability and backlink bait"),
    ("Tutorials", "Font pairing guide, colour palette creation, spacing systems, responsive design without code"),
],

"database_schema": [
    ("design_tools", "id, name, slug, logo_url, affiliate_url, category (design/icons/fonts/figma-plugins/ui-kits), rating, review_body, pricing_tiers (JSON), free_plan (bool), platform_compatible (array), pros[], cons[]"),
    ("ui_kits", "id, name, slug, platform, preview_url, affiliate_url, price, free (bool), components_count, rating, description"),
    ("components", "id, name, platform, category, preview_url, code_snippet, figma_url, free (bool), tags[]"),
    ("design_guides", "id, slug, title, body, category (principles/platform/tutorial), difficulty, created_at"),
    ("before_after", "id, title, platform, before_description, after_description, techniques_used[], created_at"),
    ("articles", "standard"),
    ("subscribers", "standard"),
],

"autonomous_systems": [
    ("Article Generation", "4/day: 1× design tool review, 1× platform-specific design guide, 1× design principles article (evergreen, highly shareable), 1× tutorial. Design principle articles ('10 typography rules every no-code builder needs') are extremely shareable on social — drives organic backlinks."),
    ("Design Trend Monitor", "Monthly: generates trend article based on current design patterns. Sources: Dribbble, Awwwards, trending Webflow templates. 'No-code design trends 2026' type content."),
    ("UI Kit Tracker", "Monthly: checks for new UI kit releases for major no-code platforms. Fast review coverage of new kits = early traffic."),
],

"tools_to_build": [
    ("Color Palette Generator", "User inputs: brand vibe (dropdown: professional/playful/bold/minimal/luxury/earthy), primary colour (colour picker), industry (dropdown). Returns: complete 5-colour palette with hex codes, CSS variables ready to paste, usage guidance (which colour for what element), preview on a mock UI card. Copy-to-clipboard for each colour."),
    ("Font Pairing Tool", "User selects: style (modern/classic/friendly/bold/editorial), use case (website/app/marketing). Returns: 5 font pair recommendations (heading + body), Google Fonts links, CSS import snippets, preview render. Highly shareable."),
    ("Design Quality Audit Checklist", "User answers 20 yes/no questions about their current design (spacing, colour contrast, font choices, mobile layout, etc.). Returns: score out of 100, specific improvement suggestions ranked by impact, links to relevant tutorials."),
    ("Spacing System Calculator", "User inputs base spacing unit (e.g. 8px). Generates complete spacing scale (4px to 96px), shows which values to use for margins/padding/gaps, exports as CSS variables. Technical but extremely useful."),
],

"affiliate_programs": [
    "Figma — check current affiliate program",
    "Framer — 20–30% recurring",
    "Relume — check direct program",
    "Flowbase — check direct program",
    "Envato (UI kits marketplace) — 30% on sales",
    "Creative Market — 15% on purchases",
    "Fontshare — sponsorship model",
    "Icons8 — affiliate program available",
],

"seo_targets": [
    "'webflow design tips' — 2,400/month",
    "'font pairing tool' — 5,400/month",
    "'color palette generator' — 40,500/month (massive)",
    "'no code app design' — growing",
    "'figma to webflow' — 2,900/month",
    "'ui kit webflow' — 1,900/month",
    "'bubble ui design' — growing",
],

"monetisation": [
    ("Affiliate links", "Creative Market and Envato kit sales convert well. Framer has solid recurring program."),
    ("Sponsored listings", "Design tool companies — Relume, Flowbase — specifically target this audience."),
    ("Color palette tool", "High volume tool (40k/month keyword) = massive top-of-funnel for email capture."),
    ("Display ads", "Design audience = premium CPM due to creative professional demographics."),
],

"lovable_prompt": """Build a no-code design and UI resource site called [SITE NAME].

DESIGN: Pink accent (#be185d), clean white background. The site itself must be a design showpiece — it demonstrates the concepts it teaches. Clash Display for headings, Satoshi for body. Asymmetric layout elements, generous white space, beautiful typography. This site must look exceptional — it is the proof of concept. Fully responsive.

PAGES:
1. Homepage — striking hero with visual design examples (CSS card grid of beautiful UI snippets), design tool categories, colour palette generator embed (prominent), before/after gallery section, font pairing tool CTA, design guides feed
2. Design tool review pages — standard review PLUS: platform compatibility badges, preview gallery/screenshot section, design quality rating (separate from overall rating)
3. UI kit review pages — large preview images, component count, platform badge, price badge, pros/cons, demo link
4. Design principle guide pages — beautiful editorial layout, pull quotes, visual examples embedded (CSS-rendered, not images), table of contents
5. Platform design guide pages — before/after examples, specific tips per platform, tool recommendations
6. Component library — searchable grid (category filters: Navigation / Hero / Cards / Forms / CTAs / Pricing / Testimonials / Footer), each component shows preview + platform tags + copy/Figma link
7. Before/after showcase — card grid with flip interaction (hover/tap reveals after), platform tag, techniques list
8. Tutorials — visual tutorial format, each step shows visual result

DATABASE (Supabase):
- design_tools: id, name, slug, logo_url, affiliate_url, category, rating, design_quality_rating, review_body, pricing_tiers (jsonb), has_free_plan, platform_compatible[], pros[], cons[]
- ui_kits: id, name, slug, platform, preview_url, purchase_url, price_usd, is_free, components_count, rating, description, tags[]
- components: id, name, platform, category, preview_description, code_snippet, figma_url, is_free, tags[]
- design_guides: id, slug, title, body, category, difficulty, reading_time, created_at
- before_after: id, title, platform, before_desc, after_desc, techniques[]
- articles: standard
- subscribers: standard

ADMIN: Standard + component library manager + before/after manager.

WEBHOOK ENDPOINTS: Standard set.

INTERACTIVE TOOLS:
1. Color Palette Generator — brand vibe dropdown + colour picker + industry dropdown, 5-colour palette output with hex codes + CSS variables + preview card, copy buttons per colour, full palette copy, email gate for 'save palette'
2. Font Pairing Tool — style + use case selectors, 5 pair results with Google Fonts embeds showing actual font rendering, CSS import code, copy buttons
3. Design Quality Audit — 20-question yes/no checklist, animated score reveal, prioritised improvement list, tutorial links
4. Spacing System Calculator — base unit input, full scale output, CSS variables export, usage guide

SEO: JSON-LD Article on guides, HowTo on tutorials. 'Color palette generator' is a top-priority SEO page — optimise aggressively.""",
},

# ─── SITE 10 ────────────────────────────────────────────────────────────────────
{
"num": 10,
"title": "No-Code for Solopreneurs & Side Projects",
"subtitle": "Your first no-code project — from idea to income",
"domain": "e.g. nocode-solopreneur.com",
"tagline": "The broadest audience. The top of the funnel. The entry point to the entire network.",
"purpose": "Top-of-funnel for the entire network. Beginners, side project builders, people escaping employment — the widest possible audience that feeds into every other site. Lower conversion per visitor but massive volume. Primary goal is email list building and network distribution.",
"audience": "Complete beginners with a business idea, employed people building side projects, aspiring entrepreneurs with no technical background, people who have heard of no-code but don't know where to start.",

"pages": [
    ("Homepage", "Welcoming hero ('Build your first thing. Today.'), 'What do you want to build?' quiz, beginner learning path (Stage 1: Learn → Stage 2: Build → Stage 3: Launch → Stage 4: Earn), success stories, featured beginner guides, email signup"),
    ("Beginner Guides", "What is no-code, how to choose your first tool, building your first website, building your first app, making your first dollar online"),
    ("Project Idea Guides", "How to validate a business idea without code, 50 no-code business ideas, profitable niches for no-code builders"),
    ("Tool Recommendations for Beginners", "Best no-code tools for absolute beginners — simplified reviews with beginner-friendly ratings"),
    ("Income Method Guides", "Freelancing with no-code, building a SaaS, selling digital products, building a directory, affiliate marketing, selling automation services"),
    ("Monetisation Tools", "Project validator, income calculator, MVP scope reducer"),
    ("Success Stories", "Real case studies of solopreneurs who built income with no-code"),
    ("Learning Path Pages", "Structured 30-day learning paths for different goals"),
    ("Tutorials", "Absolute beginner walkthroughs — assume zero knowledge"),
],

"database_schema": [
    ("tools", "id, name, slug, logo_url, affiliate_url, category, beginner_rating (1-5, separate from overall), learning_curve (easy/medium/hard), free_plan (bool), monthly_cost_start, best_for_beginners (bool), review_body, pros[], cons[]"),
    ("guides", "id, slug, title, body, category (beginner/ideas/income/tools), reading_time, difficulty (beginner only), created_at"),
    ("success_stories", "id, slug, founder_name, product_name, platform_used, monthly_revenue, time_to_build_weeks, summary, body, published_at"),
    ("learning_paths", "id, slug, goal, duration_days, steps (JSON array of {day, task, resource_url, estimated_minutes}), created_at"),
    ("project_ideas", "id, title, category, difficulty, time_to_build_estimate, potential_revenue_range, tools_needed[], description, validated (bool)"),
    ("articles", "standard"),
    ("subscribers", "standard"),
],

"autonomous_systems": [
    ("Article Generation", "4/day: 1× beginner tool guide (always assumes zero knowledge), 1× project idea / income method guide, 1× success story (format: challenge → tool → outcome — Gemini generates plausible case study structures), 1× tutorial (zero-jargon, step-by-step). Beginner content must never assume prior knowledge — every term explained on first use."),
    ("Success Story Generator", "Weekly: generates 2 success story outlines based on real no-code revenue patterns. Framed as educational case studies, not fabricated testimonials. Clearly labelled as illustrative."),
    ("Idea Trend Monitor", "Weekly: scans Product Hunt, Hacker News, Reddit r/entrepreneur for trending no-code business types. Generates 'Build this with no-code this week' article."),
    ("Email Welcome Sequence", "5-email onboarding sequence auto-sent on signup: Day 0 welcome + best beginner guide, Day 2 tool recommendation based on stated goal (captured at signup), Day 4 first project idea, Day 7 success story, Day 14 network site recommendation (personalised by goal)."),
],

"tools_to_build": [
    ("Project Idea Validator", "User describes their idea in plain text. Gemini analyses and returns: market size estimate (small/medium/large), competition level, required tools with difficulty ratings, estimated time to build MVP, estimated revenue potential range, 3 similar successful products as validation, 'go/no-go' recommendation with reasoning. Most-used tool on the site — highly shareable."),
    ("MVP Scope Reducer", "User lists every feature they want to build (one per line textarea). Gemini ruthlessly categorises each as: Must Have (MVP) / Nice to Have (V2) / Kill It (unnecessary). Returns: trimmed MVP feature list, estimated build time reduction, recommended tool for that MVP scope. Prevents over-building — extremely popular with first-time builders."),
    ("No-Code Income Calculator", "Inputs: business model (freelance/SaaS/directory/digital products/affiliate), hours per week available (slider), monthly operating budget (slider), experience level (beginner/some/experienced). Returns: realistic monthly income projection at 3/6/12 months, recommended tool stack, success factors, links to relevant guides."),
    ("'What Should I Build?' Quiz", "10-question quiz: skills, interests, available time, financial goal, risk tolerance, audience (B2B/B2C/personal). Returns: top 3 project type recommendations with detailed explanation, required tools, success stories from similar builders, estimated time to first revenue."),
],

"affiliate_programs": [
    "All anchor site + companion site affiliate programs — this site funnels to all 9 others",
    "Webflow — top recommendation for beginners wanting websites",
    "Lovable — top recommendation for beginners wanting apps",
    "Shopify — top for beginners wanting ecommerce",
    "Gumroad/Lemon Squeezy — top for digital product beginners",
    "Make/Zapier — top for automation beginners",
    "Notion — widely used by solopreneurs",
    "ConvertKit/Beehiiv — email tools for newsletter builders",
],

"seo_targets": [
    "'no code for beginners' — 3,600/month",
    "'how to make money with no code' — 2,400/month",
    "'no code business ideas' — 4,400/month",
    "'build a website without coding' — 27,100/month",
    "'how to build an app without coding' — 12,100/month",
    "'passive income no code' — 1,900/month",
    "'solopreneur tools' — 2,900/month",
],

"monetisation": [
    ("Affiliate funnels", "This site's primary monetisation is funnelling traffic to the other 9 sites and their higher-converting affiliate content. The project validator sending users to the SaaS site or ecommerce site based on their idea = high-value referral."),
    ("Email list", "Primary asset. 5-email sequence converts browsers to engaged readers across the network. Target 10,000 subscribers in year one."),
    ("Sponsored listings", "Beginner-friendly tools (Lovable, Webflow, Shopify) sponsor heavily. Lower CPM but high volume."),
    ("Display ads", "Volume play — high traffic, moderate RPM."),
],

"lovable_prompt": """Build a no-code for beginners and solopreneurs resource site called [SITE NAME].

DESIGN: Emerald green accent (#15803d), warm white background. Friendly, encouraging, approachable aesthetic. Nunito headings, Lato body. Rounded corners, soft shadows, progress elements (stages, paths, checklists). No jargon in UI labels anywhere. Fully responsive.

PAGES:
1. Homepage — welcoming hero ('Build your first thing. Today.'), 'What do you want to build?' quiz embed (prominent, above fold), 4-stage learning path visual (Stage 1-4 with descriptions), featured success stories (3 cards), beginner guide cards grid, email signup with lead magnet ('Free: 30-day no-code starter guide')
2. Beginner guide pages — very long-form (2,000+ words), every term explained on first use, progress tracker at top showing estimated reading time, no jargon, friendly tone, 'what you'll be able to do after this' intro section
3. Project idea pages — idea card with: difficulty badge / time estimate / revenue potential badge / tools needed tags, 'Validate this idea' CTA linking to validator tool
4. Beginner tool recommendation pages — simplified review format: 'What it does' (one sentence), 'Best for' (beginner type), 'Learning curve' (visual 1-5 stars), 'Monthly cost to start', 'Try free' affiliate CTA — no overwhelming feature tables
5. Income method guide pages — structured: what it is / real income examples / time to first revenue / tools needed / step-by-step getting started / next steps
6. Success story pages — founder-profile style: background / idea / tools used / timeline / revenue / lessons, 'Try their stack' CTAs with affiliate links
7. Learning path pages — day-by-day breakdown, each day has: task description / estimated minutes / resource link / 'Mark done' checkbox
8. Tutorial pages — zero-assumption format: 'Before you start' checklist, numbered steps with no skipped details

DATABASE (Supabase):
- tools: id, name, slug, logo_url, affiliate_url, category, overall_rating, beginner_rating, learning_curve (1=easy, 5=hard), has_free_plan, starting_price, is_best_for_beginners, short_description, pros[], cons[]
- guides: id, slug, title, body, category, reading_time_mins, difficulty, created_at
- success_stories: id, slug, founder_name, product_name, platform, monthly_revenue_range, time_to_build_weeks, summary, body, tools_used[], published_at
- learning_paths: id, slug, goal, duration_days, steps (jsonb array), created_at
- project_ideas: id, title, category, difficulty, build_time_estimate, revenue_potential_range, tools_needed[], description
- articles: standard
- subscribers: id, email, goal (captured at signup), subscribed_at, active, source

ADMIN: Standard + learning path manager + success story manager + project idea manager + email sequence trigger.

WEBHOOK ENDPOINTS: Standard + POST /api/trigger-welcome-sequence (sends goal-personalised 5-email sequence via Resend) + POST /api/add-success-story

INTERACTIVE TOOLS:
1. Project Idea Validator — text input for idea, Gemini API analysis, structured output: market size / competition / tools / build time / revenue potential / 3 comparable products / go/no-go, social share button, CTA to relevant companion site based on idea type
2. MVP Scope Reducer — multi-line textarea (one feature per line), Gemini categorisation, output: Must Have / Nice to Have / Cut list, build time reduction estimate, recommended tool for this MVP, affiliate CTA
3. Income Calculator — business model selector + sliders + experience dropdown, 12-month projection with chart, recommended stack, email gate for detailed report
4. 'What Should I Build?' Quiz — 10 questions with friendly UI (emoji options, progress bar), personalised result with top 3 project types, success stories for each type, 'Start with this guide' CTA, email capture for results PDF

EMAIL: Resend integration. Signup captures goal field (dropdown: website / app / store / side income / escape 9-5 / other). 5-email welcome sequence personalised by goal. Weekly newsletter of top beginner articles.

SEO: JSON-LD HowTo on all tutorials, Article on guides, FAQPage on beginner question pages. 'No-code for beginners' content must be genuinely accessible — this is the top-of-funnel for the entire network.""",
},

]

# ═══════════════════════════════════════════════════════════════════════════════
# BUILD THE PDF
# ═══════════════════════════════════════════════════════════════════════════════

doc = SimpleDocTemplate(
    "/mnt/user-data/outputs/nocode_site_build_specs.pdf",
    pagesize=letter,
    rightMargin=0.75*inch, leftMargin=0.75*inch,
    topMargin=0.75*inch,   bottomMargin=0.75*inch,
    title="No-Code Empire — Complete Site Build Specifications",
    author="Prepared with Claude"
)

story = []

# ── COVER ─────────────────────────────────────────────────────────────────────
cover = Table(
    [[Paragraph("No-Code Empire", S("cvt", fontSize=42, leading=48, textColor=WHITE,
                                    fontName="Helvetica-Bold"))],
     [Paragraph("Complete Site Build Specifications", S("cvs", fontSize=16, leading=22,
                                                         textColor=ACCENT2, fontName="Helvetica"))],
     [spacer(8)],
     [Paragraph("10 sites · Full Lovable prompts · Database schemas · Automation systems ·<br/>Interactive tools · Affiliate programs · SEO targets · Monetisation strategies",
                S("cvm", fontSize=10, leading=16, textColor=colors.HexColor("#b8b3aa"),
                  fontName="Helvetica"))],
     [spacer(16)],
     [Paragraph("Prepared May 2026  ·  Confidential  ·  Claude AI",
                S("cmd", fontSize=9, leading=13, textColor=colors.HexColor("#6a6560"),
                  fontName="Helvetica"))],
    ],
    colWidths=[W]
)
cover.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), INK),
    ("LEFTPADDING",  (0,0),(-1,-1), 32),
    ("RIGHTPADDING", (0,0),(-1,-1), 32),
    ("TOPPADDING",   (0,0),(0,0),   40),
    ("BOTTOMPADDING",(0,-1),(-1,-1),32),
    ("TOPPADDING",   (0,1),(-1,-1), 6),
    ("BOTTOMPADDING",(0,0),(-1,-2), 4),
    ("ROUNDEDCORNERS", [6]),
]))
story.append(cover)
story.append(spacer(20))

# Cover stats
stats_data = [
    ["10", "14,400+", "6", "100%"],
    ["complete site specs", "articles / year", "agents in swarm", "Lovable no-code"]
]
stats = Table(stats_data, colWidths=[W/4]*4)
stats.setStyle(TableStyle([
    ("FONTNAME",     (0,0),(-1,0), "Helvetica-Bold"),
    ("FONTSIZE",     (0,0),(-1,0), 22),
    ("TEXTCOLOR",    (0,0),(-1,0), ACCENT),
    ("FONTNAME",     (0,1),(-1,1), "Helvetica"),
    ("FONTSIZE",     (0,1),(-1,1), 9),
    ("TEXTCOLOR",    (0,1),(-1,1), MUTED),
    ("ALIGN",        (0,0),(-1,-1), "CENTER"),
    ("TOPPADDING",   (0,0),(-1,-1), 6),
    ("BOTTOMPADDING",(0,0),(-1,-1), 6),
    ("LINEABOVE",    (0,0),(-1,0), 1.5, ACCENT),
    ("LINEBELOW",    (0,1),(-1,1), 0.75, BORDER),
]))
story.append(stats)
story.append(spacer(16))

story.append(Paragraph("How to use this document", S("h", fontSize=13, leading=18,
                                                       fontName="Helvetica-Bold", textColor=INK,
                                                       spaceAfter=4)))
story.append(rule(ACCENT, 1.5))
story.append(Paragraph(
    "Each of the 10 sections below is a complete, self-contained build specification for one site. "
    "Every section includes: (1) a ready-to-paste Lovable prompt that builds the full site, "
    "(2) the complete Supabase database schema, (3) every automation system with trigger details, "
    "(4) all interactive tools with full feature descriptions, (5) affiliate programs with commission "
    "rates, (6) priority SEO target keywords with search volumes, and (7) the full monetisation "
    "strategy. Build the anchor site (Site 1) first. Validate it to 5,000 visitors. Then replicate "
    "the pattern across the remaining 9 sites using the specs below.", body))
story.append(spacer(8))
story.append(callout(
    "Critical: replace all [SITE NAME] placeholders in the Lovable prompts before pasting.",
    "Each prompt is written to be pasted directly into Lovable's chat input. The AI will build "
    "the full site from the prompt. You will likely need 2–3 follow-up prompts to refine specific "
    "sections. Use Lovable's Agent Mode for complex builds."
))
story.append(PageBreak())

# ── TABLE OF CONTENTS ─────────────────────────────────────────────────────────
story.append(Paragraph("Contents", S("toch", fontSize=18, leading=24, fontName="Helvetica-Bold",
                                      textColor=ACCENT, spaceBefore=0, spaceAfter=8)))
story.append(rule(ACCENT, 1.5))

for i, site in enumerate(SITES):
    acc = SITE_ACCENTS[i]
    row = Table(
        [[Table([[Paragraph(f'<font color="white"><b>{site["num"]}</b></font>',
                            S("tn", fontSize=9, leading=12, fontName="Helvetica-Bold",
                              textColor=WHITE, alignment=TA_CENTER))]],
                colWidths=[22], rowHeights=[22],
                style=[("BACKGROUND",(0,0),(-1,-1),acc),
                       ("ALIGN",(0,0),(-1,-1),"CENTER"),
                       ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                       ("ROUNDEDCORNERS",[3])]),
          Paragraph(site["title"], S("tt", fontSize=11, leading=15,
                                     fontName="Helvetica-Bold", textColor=INK)),
          Paragraph(site["subtitle"], S("ts", fontSize=9, leading=13,
                                        fontName="Helvetica", textColor=MUTED))]],
        colWidths=[30, W*0.38, W*0.52]
    )
    row.setStyle(TableStyle([
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
        ("LEFTPADDING",  (0,0),(-1,-1), 4),
        ("RIGHTPADDING", (0,0),(-1,-1), 4),
        ("TOPPADDING",   (0,0),(-1,-1), 7),
        ("BOTTOMPADDING",(0,0),(-1,-1), 7),
        ("LINEBELOW",    (0,0),(-1,-1), 0.5, BORDER),
    ]))
    story.append(row)

story.append(PageBreak())

# ── SITE SECTIONS ─────────────────────────────────────────────────────────────
for idx, site in enumerate(SITES):
    acc = SITE_ACCENTS[idx]

    # Section header
    story.append(section_header(site["num"], site["title"], site["subtitle"], acc))
    story.append(spacer(10))

    # Overview strip
    overview = Table(
        [[Paragraph(f'<b>Domain:</b> {site["domain"]}', S("ov", fontSize=9, leading=13, fontName="Helvetica", textColor=INK)),
          Paragraph(f'<b>Tagline:</b> {site["tagline"]}', S("ov2", fontSize=9, leading=13, fontName="Helvetica", textColor=INK))]],
        colWidths=[W*0.35, W*0.65]
    )
    overview.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), LIGHT_BG),
        ("LEFTPADDING",  (0,0),(-1,-1), 10),
        ("RIGHTPADDING", (0,0),(-1,-1), 10),
        ("TOPPADDING",   (0,0),(-1,-1), 7),
        ("BOTTOMPADDING",(0,0),(-1,-1), 7),
        ("LINEBEFORE",   (0,0),(0,-1),  3, acc),
        ("BOX",          (0,0),(-1,-1), 0.5, BORDER),
    ]))
    story.append(overview)
    story.append(spacer(6))

    # Purpose + audience
    story.append(Paragraph(f"<b>Purpose:</b> {site['purpose']}", body))
    story.append(Paragraph(f"<b>Target audience:</b> {site['audience']}", body))
    story.append(spacer(8))

    # ── Pages ─────────────────────────────────────────────────────────────────
    story.append(KeepTogether([
        subsection("Pages & Site Structure", acc),
        spacer(6),
        basic_table(
            [[Paragraph(f"<b>{p[0]}</b>", S("pn", fontSize=9, leading=13, fontName="Helvetica-Bold", textColor=INK)),
              Paragraph(p[1], S("pd", fontSize=9, leading=13, fontName="Helvetica", textColor=INK))]
             for p in site["pages"]],
            headers=["Page", "Content & Features"],
            col_widths=[W*0.22, W*0.78]
        ),
        spacer(10),
    ]))

    # ── Database Schema ───────────────────────────────────────────────────────
    story.append(subsection("Database Schema (Supabase)", acc))
    story.append(spacer(6))
    for table_name, fields in site["database_schema"]:
        story.append(Paragraph(f"<b>{table_name}</b>", h3))
        story.append(Paragraph(fields, mono))
        story.append(spacer(3))
    story.append(spacer(8))

    # ── Automation Systems ────────────────────────────────────────────────────
    story.append(subsection("Autonomous Systems", acc))
    story.append(spacer(6))
    story.append(basic_table(
        [[Paragraph(f"<b>{a[0]}</b>", S("an", fontSize=9, leading=13, fontName="Helvetica-Bold", textColor=INK)),
          Paragraph(a[1], S("ad", fontSize=9, leading=13, fontName="Helvetica", textColor=INK))]
         for a in site["autonomous_systems"]],
        headers=["System", "Description"],
        col_widths=[W*0.22, W*0.78]
    ))
    story.append(spacer(10))

    # ── Interactive Tools ─────────────────────────────────────────────────────
    story.append(subsection("Interactive Tools to Build", acc))
    story.append(spacer(6))
    story.append(basic_table(
        [[Paragraph(f"<b>{t[0]}</b>", S("tn2", fontSize=9, leading=13, fontName="Helvetica-Bold", textColor=INK)),
          Paragraph(t[1], S("td2", fontSize=9, leading=13, fontName="Helvetica", textColor=INK))]
         for t in site["tools_to_build"]],
        headers=["Tool Name", "Full Description"],
        col_widths=[W*0.25, W*0.75]
    ))
    story.append(spacer(10))

    # ── Affiliate Programs ────────────────────────────────────────────────────
    story.append(subsection("Affiliate Programs", acc))
    story.append(spacer(6))
    for af in site["affiliate_programs"]:
        story.append(bp(af))
    story.append(spacer(10))

    # ── SEO Targets ───────────────────────────────────────────────────────────
    story.append(subsection("Priority SEO Target Keywords", acc))
    story.append(spacer(6))
    for kw in site["seo_targets"]:
        story.append(bp(kw))
    story.append(spacer(10))

    # ── Monetisation ──────────────────────────────────────────────────────────
    story.append(subsection("Monetisation Strategy", acc))
    story.append(spacer(6))
    story.append(basic_table(
        [[Paragraph(f"<b>{m[0]}</b>", S("mn", fontSize=9, leading=13, fontName="Helvetica-Bold", textColor=INK)),
          Paragraph(m[1], S("md", fontSize=9, leading=13, fontName="Helvetica", textColor=INK))]
         for m in site["monetisation"]],
        headers=["Stream", "Strategy"],
        col_widths=[W*0.25, W*0.75]
    ))
    story.append(spacer(10))

    # ── Lovable Prompt ────────────────────────────────────────────────────────
    story.append(subsection("Complete Lovable Build Prompt", acc))
    story.append(spacer(6))
    story.append(callout(
        "Paste this entire prompt into Lovable's Agent Mode chat input.",
        "Replace [SITE NAME] with your chosen domain/brand name before pasting. "
        "Lovable will build the full site from this prompt. Use follow-up prompts to refine "
        "specific sections. Enable Supabase integration in Lovable settings before starting.",
        accent=acc,
        bg=LIGHT_BG
    ))
    story.append(spacer(6))
    story.append(prompt_box(site["lovable_prompt"]))
    story.append(spacer(10))

    # ── Cross-link note ───────────────────────────────────────────────────────
    other_nums = [str(s["num"]) for s in SITES if s["num"] != site["num"]]
    story.append(callout(
        f"Cross-linking: Site {site['num']} naturally links to →",
        f"Sites {', '.join(other_nums[:4])} based on audience journey. "
        f"All cross-links must be contextual (within article body), one per article maximum, "
        f"with varied anchor text. Logged to Supabase link_map table by the Interlink Agent.",
        accent=acc,
        bg=colors.HexColor("#f8f6ff") if idx % 2 == 0 else LIGHT_BG
    ))

    if idx < len(SITES) - 1:
        story.append(PageBreak())

# ── FINAL APPENDIX ────────────────────────────────────────────────────────────
story.append(PageBreak())

app_header = Table(
    [[Paragraph('<font color="white"><b>Appendix — Universal Requirements for All 10 Sites</b></font>',
                S("ah", fontSize=13, leading=17, fontName="Helvetica-Bold", textColor=WHITE))]],
    colWidths=[W]
)
app_header.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), INK),
    ("LEFTPADDING",  (0,0),(-1,-1), 14),
    ("TOPPADDING",   (0,0),(-1,-1), 10),
    ("BOTTOMPADDING",(0,0),(-1,-1), 10),
    ("ROUNDEDCORNERS", [4]),
]))
story.append(app_header)
story.append(spacer(10))

story.append(Paragraph("Things every site must include — regardless of niche", h2))
story.append(rule(ACCENT, 1))

universal = [
    ("GDPR / Privacy", "Privacy policy page (auto-generated from template), cookie consent banner, data processing disclosure for email subscribers, affiliate disclosure on all pages with affiliate links."),
    ("Performance", "All images lazy-loaded, pagination on all list pages (12 items default), 5-minute cache on tool data from Supabase, Core Web Vitals target: LCP <2.5s, FID <100ms, CLS <0.1."),
    ("Email infrastructure", "Resend API for all transactional and newsletter email. Double opt-in confirmation. Unsubscribe link in every email. Welcome email sent immediately on signup."),
    ("SEO infrastructure", "Auto-generated sitemap.xml updated on every publish. Robots.txt configured. Canonical tags on all pages. Open Graph tags for all pages. JSON-LD schema appropriate to page type. IndexNow API ping on every new publish."),
    ("Admin security", "All /admin routes protected by Supabase Auth. Single admin user. No public signup. Session timeout 24 hours."),
    ("Analytics", "Google Analytics 4 installed. Google Search Console verified. Custom events: affiliate_click, tool_view, email_signup, tool_comparison_used, quiz_completed."),
    ("Error handling", "404 page with search bar and popular tools links. 500 error page. All forms have validation and error messages. API failures handled gracefully with user-friendly messages."),
    ("Accessibility", "All images have alt text (auto-generated from tool name + context). Colour contrast ratios meet WCAG AA. All interactive tools keyboard navigable. Form labels properly associated."),
    ("Mobile", "All pages fully functional on mobile. Navigation collapses to hamburger menu. Tables scroll horizontally on mobile. Interactive tools tested at 375px viewport width."),
    ("Webhook security", "All /api webhook endpoints require a secret header token (X-Webhook-Secret) matching an environment variable. Reject all requests without valid token."),
]

story.append(basic_table(
    [[Paragraph(f"<b>{u[0]}</b>", S("un", fontSize=9, leading=13, fontName="Helvetica-Bold", textColor=INK)),
      Paragraph(u[1], S("ud", fontSize=9, leading=13, fontName="Helvetica", textColor=INK))]
     for u in universal],
    headers=["Requirement", "Specification"],
    col_widths=[W*0.20, W*0.80]
))
story.append(spacer(12))

story.append(Paragraph("Standard webhook endpoints (all sites)", h2))
story.append(rule(ACCENT, 1))
webhooks = [
    ("POST /api/publish-article", "Receives article from n8n pipeline. Payload: {title, slug, body, category, tags, seo_title, seo_description, featured_image_url}. Validates secret header. Publishes to articles table. Triggers sitemap regeneration. Pings IndexNow."),
    ("POST /api/log-affiliate-click", "Logs click to affiliate_clicks table. Payload: {tool_id, article_id, timestamp}. Used by monetisation optimizer agent."),
    ("POST /api/add-subscriber", "Adds subscriber to subscribers table. Payload: {email, source, goal (optional)}. Triggers double opt-in email via Resend. Returns success/already-exists."),
    ("POST /api/send-newsletter", "Triggers newsletter send. Payload: {subject, body_html, preview_text}. Sends to all active subscribers via Resend. Logs issue to newsletter_issues table."),
    ("GET /api/keyword-queue", "Returns next 10 keywords from article generation queue ordered by priority. Used by n8n keyword scout agent. Requires secret header."),
    ("POST /api/update-tool", "Updates tool record. Payload: {tool_id, fields_to_update (JSON)}. Used by pricing monitor agent to keep tool data fresh."),
    ("POST /api/add-cross-link", "Logs a cross-site link to link_map table. Payload: {source_article_id, source_site, destination_url, destination_site, anchor_text}. Used by interlink agent."),
]
story.append(basic_table(
    [[Paragraph(f"<b>{w[0]}</b>", S("wn", fontSize=8.5, leading=12, fontName="Courier", textColor=INK)),
      Paragraph(w[1], S("wd", fontSize=9, leading=13, fontName="Helvetica", textColor=INK))]
     for w in webhooks],
    headers=["Endpoint", "Description"],
    col_widths=[W*0.32, W*0.68]
))
story.append(spacer(12))

story.append(Paragraph("Recommended Lovable follow-up prompts (use after initial build)", h2))
story.append(rule(ACCENT, 1))
followups = [
    "\"Add a dark mode toggle to the header that persists to localStorage and respects system preference on first visit.\"",
    "\"Improve the mobile navigation — hamburger menu should slide in from the left, overlay the page with a dark background, and close on tap-outside.\"",
    "\"Add a 'Back to top' button that appears after scrolling 400px and smooth-scrolls to the top on click.\"",
    "\"Add a reading progress bar at the top of all article and guide pages that fills as the user scrolls.\"",
    "\"Add social share buttons (Twitter/X, LinkedIn, copy link) to all article pages — sticky on desktop, fixed bottom bar on mobile.\"",
    "\"Add a related articles section at the bottom of every article page — shows 3 articles from the same category, pulled from Supabase.\"",
    "\"Improve the admin dashboard analytics section — add a 7-day and 30-day toggle, show top 5 articles by affiliate clicks, top 5 tools by pageview, and subscriber growth chart.\"",
    "\"Add a 'Tool not listed?' CTA at the bottom of every category page that links to the Submit a Tool form with the category pre-filled.\"",
    "\"Add JSON-LD structured data to all tool review pages (SoftwareApplication schema) and all tutorial pages (HowTo schema) for rich search results.\"",
    "\"Add an email capture modal that triggers after 60 seconds on page or when the user's mouse moves above the viewport (exit intent) — shows once per 7 days per user.\"",
]
for f in followups:
    story.append(prompt_box(f, label="FOLLOW-UP PROMPT"))
    story.append(spacer(6))

# Final closing
story.append(spacer(10))
closing = Table(
    [[Paragraph('<font color="white"><b>You now have everything Lovable needs to build all 10 sites.</b></font>',
                S("cl", fontSize=12, leading=16, fontName="Helvetica-Bold", textColor=WHITE))],
     [Paragraph(
         '<font color="#b8b3aa">Build Site 1 first. Get it to 5,000 visitors. '
         'Then paste the next prompt. Each site is a proven template waiting to be deployed. '
         'The infrastructure is no-code. The content is autonomous. The income is compounding.</font>',
         S("cb", fontSize=9.5, leading=15, fontName="Helvetica", textColor=colors.HexColor("#b8b3aa")))]],
    colWidths=[W]
)
closing.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), INK),
    ("LEFTPADDING",  (0,0),(-1,-1), 20),
    ("RIGHTPADDING", (0,0),(-1,-1), 20),
    ("TOPPADDING",   (0,0),(0,0),   14),
    ("TOPPADDING",   (0,1),(-1,-1), 6),
    ("BOTTOMPADDING",(0,-1),(-1,-1),16),
    ("BOTTOMPADDING",(0,0),(-1,-2), 4),
    ("ROUNDEDCORNERS", [5]),
]))
story.append(closing)

# ── Page numbers ───────────────────────────────────────────────────────────────
def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(0.75*inch, 0.4*inch, "No-Code Empire — Complete Site Build Specifications")
    canvas.drawRightString(letter[0]-0.75*inch, 0.4*inch, f"Page {doc.page}")
    canvas.restoreState()

doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("Done.")
