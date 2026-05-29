from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import Flowable

# ── Colours ──────────────────────────────────────────────────────────────────
INK        = colors.HexColor('#0f0e0d')
ACCENT     = colors.HexColor('#1D9E75')
ACCENT_LT  = colors.HexColor('#E1F5EE')
ACCENT_DK  = colors.HexColor('#085041')
WARN       = colors.HexColor('#BA7517')
WARN_LT    = colors.HexColor('#FAEEDA')
BLUE       = colors.HexColor('#185FA5')
BLUE_LT    = colors.HexColor('#E6F1FB')
DANGER     = colors.HexColor('#A32D2D')
DANGER_LT  = colors.HexColor('#FCEBEB')
LIGHT_GREY = colors.HexColor('#F1EFE8')
MID_GREY   = colors.HexColor('#888780')
BORDER     = colors.HexColor('#D3D1C7')
WHITE      = colors.white

# ── Styles ────────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def S(name, **kw):
    return ParagraphStyle(name, **kw)

COVER_TITLE = S('CoverTitle', fontName='Helvetica-Bold', fontSize=34,
                textColor=WHITE, leading=42, spaceAfter=12, alignment=TA_LEFT)
COVER_SUB   = S('CoverSub', fontName='Helvetica', fontSize=15,
                textColor=colors.HexColor('#9FE1CB'), leading=22,
                spaceAfter=8, alignment=TA_LEFT)
COVER_LABEL = S('CoverLabel', fontName='Helvetica-Bold', fontSize=10,
                textColor=colors.HexColor('#5DCAA5'), leading=14,
                spaceAfter=4, alignment=TA_LEFT, letterSpacing=1.5)

H1 = S('H1', fontName='Helvetica-Bold', fontSize=22, textColor=INK,
        leading=28, spaceBefore=28, spaceAfter=10)
H2 = S('H2', fontName='Helvetica-Bold', fontSize=16, textColor=INK,
        leading=22, spaceBefore=22, spaceAfter=8)
H3 = S('H3', fontName='Helvetica-Bold', fontSize=13, textColor=INK,
        leading=18, spaceBefore=16, spaceAfter=6)
H4 = S('H4', fontName='Helvetica-Bold', fontSize=11, textColor=ACCENT_DK,
        leading=16, spaceBefore=12, spaceAfter=4)

BODY = S('Body', fontName='Helvetica', fontSize=10.5, textColor=INK,
         leading=17, spaceAfter=8, alignment=TA_JUSTIFY)
BODY_L = S('BodyL', fontName='Helvetica', fontSize=10.5, textColor=INK,
           leading=17, spaceAfter=8, alignment=TA_LEFT)
SMALL = S('Small', fontName='Helvetica', fontSize=9, textColor=MID_GREY,
          leading=13, spaceAfter=4)
MONO  = S('Mono', fontName='Courier', fontSize=9, textColor=INK,
          leading=14, spaceAfter=4, backColor=LIGHT_GREY)
MONO_BLOCK = S('MonoBlock', fontName='Courier', fontSize=8.5, textColor=INK,
               leading=13, spaceAfter=0, leftIndent=0)

LABEL_GREEN = S('LabelGreen', fontName='Helvetica-Bold', fontSize=8,
                textColor=ACCENT_DK, leading=11, letterSpacing=1.2)
LABEL_BLUE  = S('LabelBlue', fontName='Helvetica-Bold', fontSize=8,
                textColor=colors.HexColor('#0C447C'), leading=11, letterSpacing=1.2)
LABEL_WARN  = S('LabelWarn', fontName='Helvetica-Bold', fontSize=8,
                textColor=colors.HexColor('#633806'), leading=11, letterSpacing=1.2)
LABEL_RED   = S('LabelRed', fontName='Helvetica-Bold', fontSize=8,
                textColor=DANGER, leading=11, letterSpacing=1.2)

BULLET = S('Bullet', fontName='Helvetica', fontSize=10.5, textColor=INK,
           leading=17, spaceAfter=5, leftIndent=16, bulletIndent=0,
           bulletFontName='Helvetica', bulletFontSize=10.5)
STEP   = S('Step', fontName='Helvetica', fontSize=10.5, textColor=INK,
           leading=17, spaceAfter=5, leftIndent=20, bulletIndent=0)

TOC_ITEM = S('TocItem', fontName='Helvetica', fontSize=11, textColor=INK,
             leading=20, spaceAfter=2)
TOC_SUB  = S('TocSub', fontName='Helvetica', fontSize=10, textColor=MID_GREY,
             leading=17, spaceAfter=1, leftIndent=20)

PAGE_NUM = S('PageNum', fontName='Helvetica', fontSize=8, textColor=MID_GREY,
             leading=10, alignment=TA_CENTER)

PROMPT_LABEL = S('PromptLabel', fontName='Helvetica-Bold', fontSize=8,
                 textColor=MID_GREY, leading=11, letterSpacing=1.5, spaceAfter=4)
PROMPT_BODY  = S('PromptBody', fontName='Courier', fontSize=8.5, textColor=INK,
                 leading=14, spaceAfter=0)

# ── Helper Flowables ──────────────────────────────────────────────────────────

class ColorRect(Flowable):
    """A solid colour background rectangle."""
    def __init__(self, width, height, color, radius=4):
        super().__init__()
        self.width = width
        self.height = height
        self.color = color
        self.radius = radius
    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.roundRect(0, 0, self.width, self.height,
                            self.radius, fill=1, stroke=0)

class SectionDivider(Flowable):
    def __init__(self, width, color=ACCENT):
        super().__init__()
        self.width = width
        self.color = color
        self.height = 3
    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.rect(0, 0, self.width, self.height, fill=1, stroke=0)

def callout(text, style='green', width=6.5*inch):
    bg = {
        'green': ACCENT_LT, 'blue': BLUE_LT,
        'warn': WARN_LT, 'red': DANGER_LT
    }[style]
    border = {
        'green': ACCENT, 'blue': BLUE,
        'warn': WARN, 'red': DANGER
    }[style]
    label_style = {
        'green': LABEL_GREEN, 'blue': LABEL_BLUE,
        'warn': LABEL_WARN, 'red': LABEL_RED
    }[style]
    label_text = {
        'green': 'NOTE', 'blue': 'INFO',
        'warn': 'IMPORTANT', 'red': 'WARNING'
    }[style]
    data = [[
        Paragraph(label_text, label_style),
        ''
    ],[
        Paragraph(text, BODY_L),
        ''
    ]]
    t = Table(data, colWidths=[width - 0.18*inch, 0.18*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg),
        ('LINEBEFORE', (0,0), (0,-1), 3, border),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('ROUNDEDCORNERS', [0, 0, 4, 4]),
    ]))
    return t

def prompt_block(label, text, width=6.5*inch):
    rows = [
        [Paragraph(label.upper(), PROMPT_LABEL)],
        [Paragraph(text.replace('\n', '<br/>'), PROMPT_BODY)],
    ]
    t = Table(rows, colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_GREY),
        ('LINEALL', (0,0), (-1,-1), 0.5, BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    return t

def schema_table(rows, width=6.5*inch):
    data = [['Field', 'Type', 'Description']] + rows
    t = Table(data, colWidths=[1.6*inch, 0.9*inch, width - 2.5*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('LEADING', (0,0), (-1,-1), 13),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GREY]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('FONTNAME', (0,1), (0,-1), 'Courier'),
        ('FONTSIZE', (0,1), (0,-1), 8.5),
    ]))
    return t

def stat_row(items, width=6.5*inch):
    col_w = width / len(items)
    data = [[Paragraph(v, S('sv', fontName='Helvetica-Bold', fontSize=18,
                            textColor=ACCENT, leading=22, alignment=TA_CENTER)),
             ] for v, _ in items]
    data2= [[Paragraph(l, S('sl', fontName='Helvetica', fontSize=9,
                            textColor=MID_GREY, leading=12, alignment=TA_CENTER)),
             ] for _, l in items]
    combined = [[
        Table([[Paragraph(v, S('sv2', fontName='Helvetica-Bold', fontSize=18,
                              textColor=ACCENT, leading=22, alignment=TA_CENTER))],
               [Paragraph(l, S('sl2', fontName='Helvetica', fontSize=9,
                               textColor=MID_GREY, leading=12, alignment=TA_CENTER))]],
              colWidths=[col_w - 0.2*inch])
        for v, l in items
    ]]
    t = Table(combined, colWidths=[col_w]*len(items))
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_GREY),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER),
    ]))
    return t

def bullet(text):
    return Paragraph(f'<bullet>\u2022</bullet> {text}', BULLET)

def step(n, text):
    return Paragraph(f'<bullet><b>{n}.</b></bullet> {text}', STEP)

def hr(width=6.5*inch, color=BORDER, thickness=0.5):
    return HRFlowable(width=width, thickness=thickness, color=color,
                      spaceAfter=6, spaceBefore=6)

def section_num(n, title):
    return [
        Spacer(1, 6),
        SectionDivider(6.5*inch, ACCENT),
        Spacer(1, 8),
        Paragraph(f'SECTION {n}', LABEL_GREEN),
        Paragraph(title, H1),
    ]

# ── Page template with header/footer ────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    w, h = letter
    # header bar
    canvas.setFillColor(INK)
    canvas.rect(0, h - 0.45*inch, w, 0.45*inch, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor('#5DCAA5'))
    canvas.setFont('Helvetica-Bold', 8)
    canvas.drawString(0.6*inch, h - 0.28*inch, 'AUTONOMOUS CONTENT ENGINE')
    canvas.setFillColor(colors.HexColor('#888780'))
    canvas.setFont('Helvetica', 8)
    canvas.drawRightString(w - 0.6*inch, h - 0.28*inch,
                           'STUPID PEOPLE EDITION  ·  CONFIDENTIAL')
    # footer
    canvas.setFillColor(BORDER)
    canvas.rect(0, 0, w, 0.35*inch, fill=1, stroke=0)
    canvas.setFillColor(MID_GREY)
    canvas.setFont('Helvetica', 7.5)
    canvas.drawString(0.6*inch, 0.13*inch,
                      'Drop this document into any Lovable project to activate autonomous content.')
    canvas.drawRightString(w - 0.6*inch, 0.13*inch, f'Page {doc.page}')
    canvas.restoreState()

def on_first_page(canvas, doc):
    canvas.saveState()
    w, h = letter
    # full dark cover background
    canvas.setFillColor(INK)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)
    # accent strip left
    canvas.setFillColor(ACCENT)
    canvas.rect(0, 0, 0.18*inch, h, fill=1, stroke=0)
    canvas.restoreState()

# ── Build ─────────────────────────────────────────────────────────────────────
def build():
    doc = SimpleDocTemplate(
        '/mnt/user-data/outputs/autonomous_content_engine_stupid_people.pdf',
        pagesize=letter,
        leftMargin=0.65*inch, rightMargin=0.65*inch,
        topMargin=0.75*inch, bottomMargin=0.6*inch,
        title='Autonomous Content Engine — Stupid People Edition',
        author='nocodereviewed',
    )

    story = []
    W = 6.5 * inch

    # ── COVER PAGE ─────────────────────────────────────────────────────────
    story.append(Spacer(1, 1.4*inch))
    story.append(Paragraph('AUTONOMOUS', COVER_LABEL))
    story.append(Paragraph('Content Engine', COVER_TITLE))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph(
        'Drop this document into any Lovable project.\nAnswer three questions. Walk away.',
        COVER_SUB))
    story.append(Spacer(1, 0.5*inch))

    # stat strip on cover
    cover_stats = Table([[
        Table([[Paragraph('2–3', S('cs', fontName='Helvetica-Bold', fontSize=28,
                                   textColor=ACCENT, leading=32, alignment=TA_CENTER))],
               [Paragraph('Lovable credits', S('cl', fontName='Helvetica', fontSize=9,
                          textColor=colors.HexColor('#9FE1CB'), leading=12,
                          alignment=TA_CENTER))]],
              colWidths=[1.5*inch]),
        Table([[Paragraph('4/day', S('cs2', fontName='Helvetica-Bold', fontSize=28,
                                     textColor=ACCENT, leading=32, alignment=TA_CENTER))],
               [Paragraph('Articles published', S('cl2', fontName='Helvetica', fontSize=9,
                          textColor=colors.HexColor('#9FE1CB'), leading=12,
                          alignment=TA_CENTER))]],
              colWidths=[1.5*inch]),
        Table([[Paragraph('$0/mo', S('cs3', fontName='Helvetica-Bold', fontSize=28,
                                     textColor=ACCENT, leading=32, alignment=TA_CENTER))],
               [Paragraph('Content cost (Gemini free tier)', S('cl3', fontName='Helvetica',
                          fontSize=9, textColor=colors.HexColor('#9FE1CB'), leading=12,
                          alignment=TA_CENTER))]],
              colWidths=[2*inch]),
        Table([[Paragraph('0', S('cs4', fontName='Helvetica-Bold', fontSize=28,
                                  textColor=ACCENT, leading=32, alignment=TA_CENTER))],
               [Paragraph('Daily intervention needed', S('cl4', fontName='Helvetica',
                          fontSize=9, textColor=colors.HexColor('#9FE1CB'), leading=12,
                          alignment=TA_CENTER))]],
              colWidths=[1.5*inch]),
    ]], colWidths=[1.5*inch, 1.5*inch, 2*inch, 1.5*inch])
    cover_stats.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(cover_stats)
    story.append(Spacer(1, 0.6*inch))

    cover_desc = Paragraph(
        'This document is a universal content engine specification. Upload it to any '
        'Lovable project — new or existing — and it builds a complete autonomous content '
        'system with a quality gateway, admin control panel, affiliate link management, '
        'multi-site reporting, newsletter automation, and content refresh. '
        'You provide the API key. It does everything else.',
        S('cd', fontName='Helvetica', fontSize=11, textColor=colors.HexColor('#D3D1C7'),
          leading=18, alignment=TA_LEFT))
    story.append(cover_desc)
    story.append(Spacer(1, 0.5*inch))

    cover_meta = [
        ['Version', '1.0 — Stupid People Edition'],
        ['Prepared', 'May 2026'],
        ['Compatibility', 'Any Lovable project with Supabase enabled'],
        ['Gemini model', 'Gemini 2.5 Flash (default) / 2.5 Pro (optional)'],
        ['Classification', 'Confidential'],
    ]
    mt = Table(cover_meta, colWidths=[1.4*inch, 5.1*inch])
    mt.setStyle(TableStyle([
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('TEXTCOLOR', (0,0), (0,-1), colors.HexColor('#5DCAA5')),
        ('TEXTCOLOR', (1,0), (1,-1), colors.HexColor('#B4B2A9')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, colors.HexColor('#2C2C2A')),
    ]))
    story.append(mt)
    story.append(PageBreak())

    # ── TABLE OF CONTENTS ──────────────────────────────────────────────────
    story.append(Paragraph('Contents', H1))
    story.append(hr())
    story.append(Spacer(1, 8))

    toc_items = [
        ('01', 'How to use this document', [
            'What this builds', 'What you need before starting', 'Detection mode explained']),
        ('02', 'Setup — Three questions', [
            'Question 1: Your Gemini API key', 'Question 2: Your site identity',
            'Question 3: Your publishing schedule']),
        ('03', 'The Lovable activation prompt', [
            'The full prompt — copy and paste', 'What Lovable will build',
            'Follow-up prompts if needed']),
        ('04', 'The admin control panel', [
            'Panel overview', 'Content settings', 'Quality gateway controls',
            'Affiliate link manager', 'Keyword queue manager',
            'Schedule settings', 'Site identity editor', 'Failure log']),
        ('05', 'The quality gateway', [
            'How it works', 'The six scoring dimensions',
            'Pass threshold and what happens on fail', 'Banned phrases list',
            'Customising the gateway in the admin panel']),
        ('06', 'The generation prompt system', [
            'The master generation prompt', 'The site identity block',
            'Article type rotation', 'The Lovable-specific article rule',
            'Editing prompts in the admin panel']),
        ('07', 'Affiliate link system', [
            'How links are inserted', 'The affiliate table',
            'Default fallback links', 'Link frequency rules']),
        ('08', 'The keyword queue', [
            '10 starter keywords', 'Adding keywords manually',
            'Auto-replenishment with Search Console', 'Keyword priority system']),
        ('09', 'Content refresh system', [
            'Three refresh triggers', 'The refresh prompt',
            'Freshness date stamps', 'Manual refresh flag']),
        ('10', 'Newsletter automation', [
            'Early stage mode', 'Growth stage mode',
            'Sunday send schedule', 'Subject line A/B testing']),
        ('11', 'Failure handling and alerts', [
            'Three-strike retry system', 'Email alerts via Resend',
            'The failure log in admin panel', 'Daily request ceiling']),
        ('12', 'Multi-site reporting dashboard', [
            'What it reports', 'How to build the master dashboard',
            'The Lovable prompt for the dashboard']),
        ('13', 'Replicating to additional sites', [
            'The 10-minute replication prompt', 'What changes per site',
            'API key management across sites']),
        ('14', 'Database schema', [
            'All tables created by this spec', 'Field definitions']),
        ('15', 'Troubleshooting', [
            'Common issues and fixes', 'How to test the pipeline manually']),
    ]

    for num, title, subs in toc_items:
        row = Table([[
            Paragraph(f'<font color="#1D9E75"><b>{num}</b></font>', 
                      S('tn', fontName='Helvetica-Bold', fontSize=11,
                        textColor=ACCENT, leading=16)),
            Paragraph(title, TOC_ITEM),
        ]], colWidths=[0.45*inch, W - 0.45*inch])
        row.setStyle(TableStyle([
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, BORDER),
        ]))
        story.append(row)
        for sub in subs:
            story.append(Paragraph(f'\u00a0\u00a0\u00a0\u00a0· {sub}', TOC_SUB))
        story.append(Spacer(1, 2))

    story.append(PageBreak())

    # ── SECTION 01 ─────────────────────────────────────────────────────────
    story += section_num('01', 'How to Use This Document')
    story.append(Paragraph(
        'This document is designed to be uploaded directly to Lovable\'s chat input. '
        'Lovable reads the spec and builds everything described. You do not need to '
        'understand the technical details — you need to answer three questions and paste '
        'one prompt. Everything else is handled automatically.', BODY))

    story.append(Spacer(1, 6))
    story.append(Paragraph('What this builds', H2))
    builds = [
        ('Content generation engine', 'Calls Gemini API daily, writes articles to your '
         'keyword queue, publishes them to real indexable URLs on your site.'),
        ('Quality gateway', 'Scores every article on 6 dimensions before it publishes. '
         'Thin, generic, or factually suspect content never reaches your readers.'),
        ('Admin control panel', 'A private dashboard at /content-admin where you control '
         'everything — prompts, schedule, keywords, affiliate links, quality threshold.'),
        ('Affiliate link system', 'A table of tool names and affiliate URLs. The engine '
         'inserts links naturally into relevant articles automatically.'),
        ('Keyword queue', 'A database of topics to write about, with priority ordering '
         'and auto-replenishment from Google Search Console.'),
        ('Content refresh agent', 'Weekly scan for stale or declining articles. '
         'Rewrites them automatically with updated information and a fresh timestamp.'),
        ('Newsletter automation', 'Weekly email to your subscriber list featuring the '
         'best articles of the week. Fully automated including subject line.'),
        ('Failure handling', 'Three-strike retry on API failures, email alerts via '
         'Resend, failure log in the admin panel, hard daily request ceiling.'),
        ('Multi-site reporting hooks', 'Reports stats to a central Supabase table '
         'so a master dashboard can monitor all your sites in one place.'),
    ]
    for title, desc in builds:
        story.append(KeepTogether([
            Paragraph(f'<b>{title}</b>', BODY_L),
            Paragraph(desc, S('bd', fontName='Helvetica', fontSize=10.5, textColor=MID_GREY,
                              leading=16, spaceAfter=8, leftIndent=12)),
        ]))

    story.append(Spacer(1, 8))
    story.append(Paragraph('What you need before starting', H2))
    prereqs = [
        'A Lovable project with Supabase integration enabled (required for the database)',
        'A Gemini API key from aistudio.google.com (free, takes 2 minutes to get)',
        'A Resend API key from resend.com (free tier is sufficient, for email alerts)',
        '2–3 Lovable credits available in your account',
        'Your affiliate links for any tools your site reviews (you can add these later)',
    ]
    for p in prereqs:
        story.append(bullet(p))

    story.append(Spacer(1, 10))
    story.append(callout(
        'If your Lovable project already has some of these systems partially built from '
        'a previous spec, the activation prompt in Section 03 includes detection logic. '
        'It audits what exists, skips anything already working, and only builds what is '
        'missing. It will not overwrite or break anything already in your project.',
        'blue'))

    story.append(Spacer(1, 10))
    story.append(Paragraph('Detection mode explained', H2))
    story.append(Paragraph(
        'The activation prompt checks for five things before building anything: the Gemini '
        'API integration, the scheduler, the quality gateway, the webhook endpoints, and '
        'the keyword queue table. For each one it finds already built and working, it skips '
        'that component and logs "found existing — skipped" in its build report. '
        'For anything missing or incomplete, it builds from scratch. '
        'You get a build report at the end listing exactly what was built, what was skipped, '
        'and what (if anything) needs your attention.', BODY))

    story.append(PageBreak())

    # ── SECTION 02 ─────────────────────────────────────────────────────────
    story += section_num('02', 'Setup — Three Questions')
    story.append(Paragraph(
        'Before pasting the activation prompt, answer these three questions. '
        'Your answers get inserted into the prompt where indicated. '
        'This personalises the entire content engine to your specific site.', BODY))

    story.append(Spacer(1, 10))
    story.append(Paragraph('Question 1 — Your Gemini API key', H2))
    story.append(Paragraph(
        'Get your free Gemini API key from Google AI Studio:', BODY_L))
    steps_q1 = [
        'Go to aistudio.google.com and sign in with your Google account',
        'Click "Get API key" in the left sidebar',
        'Click "Create API key in new project"',
        'Copy the key — it starts with "AIza..."',
        'In your Lovable project, go to Settings → Environment Variables',
        'Add a new variable named exactly: GEMINI_API_KEY',
        'Paste your key as the value and save',
    ]
    for i, s in enumerate(steps_q1, 1):
        story.append(step(i, s))

    story.append(Spacer(1, 8))
    story.append(callout(
        'Add a second variable named RESEND_API_KEY with your Resend API key. '
        'Get it free at resend.com. This powers the email failure alerts and newsletter. '
        'If you skip this, the content engine still works but you will not receive '
        'failure notifications by email.', 'warn'))

    story.append(Spacer(1, 12))
    story.append(Paragraph('Question 2 — Your site identity block', H2))
    story.append(Paragraph(
        'The site identity block tells Gemini who your site is, who it writes for, '
        'and what makes it different. Every article generated by the engine starts with '
        'this context. It is the single most important factor in preventing generic content '
        'and ensuring each site in your network has a distinct voice.', BODY))
    story.append(Spacer(1, 6))
    story.append(Paragraph('Write five sentences answering these prompts:', BODY_L))
    identity_prompts = [
        'This site is about: [what topics/tools do you review?]',
        'Our primary reader is: [who are they, what do they want to accomplish?]',
        'Our perspective is: [what angle do you take — honest, experienced, opinionated?]',
        'Our tone is: [direct? friendly? technical? encouraging?]',
        'What makes us different: [one thing that sets your reviews apart]',
    ]
    for p in identity_prompts:
        story.append(bullet(p))

    story.append(Spacer(1, 8))
    story.append(prompt_block(
        'EXAMPLE SITE IDENTITY BLOCK — NO-CODE REVIEW SITE',
        'This site reviews no-code and AI app building platforms for founders, '
        'solopreneurs, and operators who want to build without hiring developers. '
        'Our primary reader is a non-technical entrepreneur evaluating which platform '
        'to commit to for their next project. Our perspective is that of a builder '
        'who has actually used these tools to ship real products — not a journalist '
        'summarising vendor claims. Our tone is direct and opinionated: we give clear '
        'verdicts and do not hedge. What makes us different is that we test every platform '
        'by rebuilding the same project on each one, so our comparisons reflect real '
        'build experience, not feature lists.'
    ))

    story.append(Spacer(1, 12))
    story.append(Paragraph('Question 3 — Your publishing schedule', H2))
    story.append(Paragraph(
        'Choose how many articles per day and what time the engine fires. '
        'The default is 4 articles at 06:00 UTC. Adjust based on your keyword queue '
        'depth and how fast you want to build content volume.', BODY))

    sched_data = [
        ['Articles/day', 'Keywords/month', 'Best for'],
        ['1', '~30', 'New sites, conservative approach, tight keyword lists'],
        ['2', '~60', 'Growing sites, moderate volume, good for most use cases'],
        ['4 (default)', '~120', 'Established sites, competitive niches, large keyword queues'],
        ['8', '~240', 'Aggressive scaling, multiple categories, large Gemini quota'],
    ]
    st = Table(sched_data, colWidths=[1.1*inch, 1.1*inch, W - 2.2*inch])
    st.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('LEADING', (0,0), (-1,-1), 13),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GREY]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('BACKGROUND', (0,3), (-1,3), colors.HexColor('#E1F5EE')),
        ('FONTNAME', (0,3), (-1,3), 'Helvetica-Bold'),
    ]))
    story.append(st)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        'Time: 06:00 UTC is the default. This means approximately 10pm PST / 1am EST / '
        '6am London / 4pm AEST. Articles are ready for morning readers in each timezone. '
        'Change this to any UTC time that makes sense for your primary audience.',
        SMALL))

    story.append(PageBreak())

    # ── SECTION 03 ─────────────────────────────────────────────────────────
    story += section_num('03', 'The Lovable Activation Prompt')
    story.append(Paragraph(
        'This is the prompt you paste into Lovable\'s chat input. Replace the three '
        '[BRACKETED] sections with your answers from Section 02. Then paste the entire '
        'thing as a single message. Do not break it into multiple messages — Lovable '
        'performs best when given the complete spec at once.', BODY))
    story.append(Spacer(1, 8))
    story.append(callout(
        'This prompt uses approximately 2 Lovable credits. On the free plan with 5 daily '
        'credits, use this as your main prompt for the day. Save your remaining credits '
        'for the test trigger in Section 03 and any fixes needed.', 'warn'))
    story.append(Spacer(1, 10))

    activation_prompt = (
        'Build and activate a complete autonomous content generation system for this '
        'Lovable project. Before building anything, audit the existing codebase for: '
        '(1) Gemini API integration, (2) a content scheduler, (3) quality gateway logic, '
        '(4) webhook endpoints for article publishing, (5) keyword_queue table in Supabase. '
        'For each component found working: skip it and log "found existing". '
        'For each component missing or incomplete: build it from scratch.\n\n'
        'SITE IDENTITY BLOCK (prepend to every generation prompt):\n'
        '[PASTE YOUR FIVE-SENTENCE SITE IDENTITY BLOCK HERE]\n\n'
        'PUBLISHING SCHEDULE:\n'
        '[YOUR ARTICLES PER DAY] articles per day at [YOUR UTC TIME] UTC\n\n'
        'BUILD THE FOLLOWING COMPLETE SYSTEM:\n\n'
        '1. GEMINI API INTEGRATION\n'
        'Connect to Gemini 2.5 Flash using the GEMINI_API_KEY environment variable. '
        'Hard limit: maximum 50 API calls per day regardless of schedule settings. '
        'If this limit is hit, stop generation and send a failure alert email.\n\n'
        '2. DAILY SCHEDULER\n'
        'Fire at the specified UTC time daily. On each fire: pull the next N keywords '
        'from keyword_queue where status = pending, ordered by priority DESC then '
        'created_at ASC. Generate one article per keyword. Rotate article types in order: '
        'tool_review, comparison, tutorial, best_of_list. Log each run to generation_log.\n\n'
        '3. GENERATION PROMPT SYSTEM\n'
        'Every generation call uses this structure:\n'
        'SYSTEM: [Site identity block]. You are an expert no-code software reviewer. '
        'Write honest, opinionated articles. Always give a clear verdict. Always include '
        'genuine limitations. Never use these banned phrases: "In today\'s digital '
        'landscape", "As we can see", "It\'s worth noting", "game-changer", "seamlessly", '
        '"cutting-edge", "robust solution", "In conclusion". Write minimum 1000 words. '
        'Include a "Last verified: [current month year]" stamp on the first line. '
        'Format in clean markdown with H2 subheadings.\n'
        'USER: Write a [article_type] article for this keyword: [keyword]. '
        'Relevant tools in our database: [pull top 5 tools by category match]. '
        'Their affiliate URLs: [pull from affiliate_links table]. '
        'Insert affiliate links naturally — maximum 3 per article, minimum 1 per article '
        'if the tool is mentioned. For any tool not in the affiliate_links table, '
        'use the default_affiliate_url from the site_settings table.\n\n'
        '4. QUALITY GATEWAY\n'
        'Score every article before publishing on these 6 dimensions (max points each):\n'
        '- Specificity (20pts): Names specific use cases, not generic benefits\n'
        '- Verdict clarity (20pts): Clear recommendation with reasoning present\n'
        '- Original angle (15pts): Non-obvious perspective beyond vendor marketing\n'
        '- Limitations (15pts): Genuine cons acknowledged, not softened\n'
        '- Structure (15pts): Logical flow, scannable headers, each section earns its place\n'
        '- No banned phrases (15pts): Zero instances of banned phrase list\n'
        'Pass threshold: 72/100. If score >= 72: publish. If score < 72: mark status = '
        'rejected, store rejection_reason and improvement_notes, trigger one automatic '
        'retry with the improvement_notes injected into the prompt. If retry also fails: '
        'mark status = failed, send failure alert email, move to next keyword.\n\n'
        '5. ADMIN CONTROL PANEL\n'
        'Build a private dashboard at /content-admin protected by Supabase Auth. '
        'Include these sections:\n'
        '- OVERVIEW: articles published today/this week/total, quality gateway pass rate, '
        'keywords remaining in queue, last run timestamp, next run timestamp\n'
        '- CONTENT SETTINGS: site identity block editor (large textarea), '
        'master generation prompt editor, article type rotation toggles\n'
        '- QUALITY GATEWAY: pass threshold slider (60-90), banned phrases list editor, '
        'dimension weight adjusters, view recent gateway scores\n'
        '- AFFILIATE LINKS: table of tool_name / affiliate_url / active toggle. '
        'Add/edit/delete rows. Default fallback URL field at top.\n'
        '- KEYWORD QUEUE: view all keywords with status/priority. Add keywords manually. '
        'Bulk import (paste list). Reorder by drag. Mark failed keywords for retry.\n'
        '- SCHEDULE: articles per day slider (1-8), time picker (UTC), pause/resume toggle\n'
        '- FAILURE LOG: table of all failures with timestamp, keyword, error reason, '
        'retry button per row\n'
        '- REFRESH SETTINGS: enable/disable refresh agent, threshold selectors for '
        'all three refresh triggers, view articles flagged for refresh\n\n'
        '6. CONTENT REFRESH AGENT\n'
        'Run weekly on Mondays at 07:00 UTC. Check all published articles for:\n'
        '- Trigger A: dropped >5 Search Console positions in 30 days → expand and update\n'
        '- Trigger B: live >90 days with zero Search Console impressions → full rewrite\n'
        '- Trigger C: CTR below 2% with impressions present → rewrite title and meta only\n'
        'Requires GOOGLE_SEARCH_CONSOLE_TOKEN environment variable. If not present: '
        'run Trigger B only (90-day check) using published_at date from database.\n\n'
        '7. NEWSLETTER AUTOMATION\n'
        'Every Sunday at 08:00 UTC: select top 3 articles of the week by quality_score '
        '(early stage) or Search Console CTR (growth stage, when GSC data available). '
        'Generate two subject line variants with Gemini. Send newsletter via Resend API '
        'using RESEND_API_KEY to all active subscribers. Log to newsletter_issues table.\n\n'
        '8. FAILURE HANDLING\n'
        'Three-strike retry on all Gemini API failures (10 minute wait between retries). '
        'After 3 failures on same keyword: mark failed, send email alert via Resend to '
        'ALERT_EMAIL environment variable. Hard ceiling of 50 Gemini calls per day — '
        'alert and stop if reached. All failures logged to generation_log with full error.\n\n'
        '9. MULTI-SITE REPORTING\n'
        'After each generation run, write a summary row to a Supabase table called '
        'network_reports with fields: site_id (from SITE_ID env variable), run_date, '
        'articles_published, articles_failed, gateway_pass_rate, keywords_remaining. '
        'Add SITE_ID as a required environment variable with instructions in the build report.\n\n'
        '10. DATABASE TABLES REQUIRED\n'
        'Create if not existing: keyword_queue, articles (add quality_score, '
        'gateway_scores jsonb, rejection_reason, article_type, last_verified_date, '
        'refresh_trigger columns if not present), affiliate_links, generation_log, '
        'site_settings, network_reports. Seed keyword_queue with the 10 starter keywords '
        'from Section 08 of the spec document.\n\n'
        'AFTER BUILDING: Provide a build report listing every component — built/skipped/'
        'needs attention. Include the URL of the admin panel and instructions for the '
        '3 additional environment variables needed: RESEND_API_KEY, ALERT_EMAIL, SITE_ID.'
    )

    story.append(prompt_block('ACTIVATION PROMPT — COPY THIS ENTIRE BLOCK INTO LOVABLE',
                              activation_prompt))

    story.append(Spacer(1, 12))
    story.append(Paragraph('Follow-up prompts if needed', H2))
    story.append(Paragraph(
        'After the activation prompt, Lovable will provide a build report. '
        'Use these follow-up prompts only if the report flags specific issues:', BODY))
    story.append(Spacer(1, 6))

    followups = [
        ('If the scheduler is not working',
         'The scheduler is not triggering as expected. Debug the cron job implementation '
         'and confirm it will fire at [YOUR TIME] UTC daily. Test by triggering it '
         'manually right now and showing me the output.'),
        ('If the admin panel is not accessible',
         'The /content-admin route is not loading. Fix the routing and ensure it is '
         'protected by Supabase Auth. Confirm the URL and test that an unauthenticated '
         'request redirects to login.'),
        ('If Gemini connection is failing',
         'The Gemini API connection is returning errors. Verify the GEMINI_API_KEY '
         'environment variable is being read correctly and the API call is formatted '
         'for Gemini 2.5 Flash. Show me the error and fix it.'),
    ]
    for title, prompt_text in followups:
        story.append(Paragraph(f'<b>{title}</b>', BODY_L))
        story.append(prompt_block('FOLLOW-UP PROMPT', prompt_text))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # ── SECTION 04 ─────────────────────────────────────────────────────────
    story += section_num('04', 'The Admin Control Panel')
    story.append(Paragraph(
        'The admin panel lives at /content-admin and is accessible only to authenticated '
        'users. It is your single interface for controlling everything about the content '
        'engine without touching Lovable or the database directly.', BODY))

    panel_sections = [
        ('Overview dashboard',
         'At-a-glance stats: articles published today, this week, and total. '
         'Quality gateway pass rate as a percentage. Keywords remaining in the queue. '
         'Last run timestamp and next scheduled run. Any active failures shown in red.'),
        ('Content settings',
         'The site identity block — a large text area showing your five-sentence site '
         'context. Edit it here and the change applies to the next generation run. '
         'The master generation prompt — shows the full prompt template with your identity '
         'block inserted. Edit with caution. A reset button restores the default. '
         'Article type rotation toggles — turn off any article type you don\'t want.'),
        ('Quality gateway controls',
         'Pass threshold slider — drag between 60 and 90. Default is 72. '
         'Higher means stricter quality but more failures and retries. '
         'Banned phrases list — add or remove phrases that cause articles to fail. '
         'Recent gateway scores — a table of the last 20 articles with their dimension '
         'scores so you can see where content is consistently weak.'),
        ('Affiliate link manager',
         'A table with three columns: tool name, affiliate URL, active toggle. '
         'Add a row for every tool your site reviews. When the engine writes about '
         'a tool, it pulls the URL from this table. Default fallback URL at the top — '
         'this is used when a mentioned tool has no specific affiliate link in the table. '
         'Set this to your highest-converting affiliate link.'),
        ('Keyword queue manager',
         'View all keywords with their status (pending / generating / published / failed). '
         'Priority shown as a number — higher numbers generate first. '
         'Add keywords one at a time or bulk import by pasting a list. '
         'Failed keywords show the failure reason with a retry button. '
         'Drag to reorder priority.'),
        ('Schedule settings',
         'Articles per day slider (1 to 8). Generation time in UTC. '
         'Pause toggle — stops all generation without deleting anything. '
         'A manual trigger button — runs the pipeline right now regardless of schedule. '
         'Useful for testing and for when you add a high-priority keyword.'),
        ('Failure log',
         'Every API failure, quality gateway failure, and scheduler error is logged here '
         'with timestamp, keyword, error type, and full error message. '
         'Retry button per row. Clear log button. '
         'Email alert status shown — confirms whether the failure alert was sent.'),
    ]

    for title, desc in panel_sections:
        story.append(KeepTogether([
            Paragraph(title, H3),
            Paragraph(desc, BODY),
        ]))

    story.append(PageBreak())

    # ── SECTION 05 ─────────────────────────────────────────────────────────
    story += section_num('05', 'The Quality Gateway')
    story.append(Paragraph(
        'The quality gateway is the most important component in the entire system. '
        'It is the difference between a content network that Google rewards and one '
        'that Google penalises. Every article passes through it before publishing. '
        'No exceptions.', BODY))

    story.append(Spacer(1, 8))
    story.append(Paragraph('The six scoring dimensions', H2))

    dimensions = [
        ('Specificity', '20 pts',
         'Does the article name specific use cases, specific types of users, specific '
         'scenarios? Generic benefits ("it saves you time") score zero. Specific context '
         '("ideal for solopreneurs who need a client portal without hiring a developer") '
         'scores full marks.'),
        ('Verdict clarity', '20 pts',
         'Is there a clear recommendation? Does the article say who this is best for '
         'and who should avoid it? A "it depends" conclusion scores zero. '
         '"Make is the better choice for anyone running more than 10 automations per month '
         'who doesn\'t mind a steeper learning curve" scores full marks.'),
        ('Original angle', '15 pts',
         'Does the article surface something non-obvious? Is there a perspective that '
         'goes beyond the tool\'s own marketing claims? Content that simply restates '
         'the vendor\'s feature list scores zero.'),
        ('Limitations', '15 pts',
         'Are genuine cons or limitations acknowledged? Are they substantive rather than '
         'softened? "The pricing can feel a little high for some users" scores low. '
         '"The free plan caps you at 1,000 rows which is hit within weeks on any real '
         'project, forcing an upgrade most users weren\'t expecting" scores full marks.'),
        ('Structure', '15 pts',
         'Does the article have a logical flow? Are the subheadings scannable? '
         'Does each section earn its place or is there obvious padding? '
         'Word count above 1,000 is necessary but not sufficient — 1,200 words of '
         'padded filler scores lower than 1,000 words of tight, useful content.'),
        ('No banned phrases', '15 pts',
         'Zero instances of any phrase on the banned list. One banned phrase = 8 points '
         'deducted. Two or more = this dimension scores zero. The banned list is editable '
         'in the admin panel and grows over time as new AI-filler patterns emerge.'),
    ]

    for dim, pts, desc in dimensions:
        story.append(KeepTogether([
            Table([[
                Paragraph(dim, S('dh', fontName='Helvetica-Bold', fontSize=11,
                                 textColor=INK, leading=15)),
                Paragraph(pts, S('dp', fontName='Helvetica-Bold', fontSize=11,
                                 textColor=ACCENT, leading=15, alignment=TA_CENTER)),
            ]], colWidths=[W - 0.9*inch, 0.9*inch],
            style=TableStyle([
                ('TOPPADDING', (0,0), (-1,-1), 6),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LINEBELOW', (0,0), (-1,-1), 0.5, BORDER),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
            ])),
            Paragraph(desc, S('dd', fontName='Helvetica', fontSize=10, textColor=MID_GREY,
                              leading=15, spaceAfter=10, leftIndent=0)),
        ]))

    story.append(Spacer(1, 8))
    story.append(callout(
        'Start with the default threshold of 72. After 30 published articles, review '
        'the quality of what got through. If you see thin content slipping past, '
        'raise the threshold to 76 or 78. If almost nothing is publishing because the '
        'gateway is too strict, lower to 68. Tune based on real output, not theory.', 'blue'))

    story.append(Spacer(1, 10))
    story.append(Paragraph('Default banned phrases list', H2))
    banned = [
        'In today\'s digital landscape', 'As we can see', 'It\'s worth noting',
        'game-changer', 'seamlessly', 'cutting-edge', 'robust solution',
        'In conclusion', 'To summarize', 'At the end of the day',
        'It goes without saying', 'Needless to say', 'In the world of',
        'In the realm of', 'transformative', 'revolutionary', 'leverage',
        'utilize', 'synergy', 'empower', 'unlock your potential',
        'take your [X] to the next level', 'delve into', 'navigate the complexities',
    ]
    banned_cols = [banned[:8], banned[8:16], banned[16:]]
    for group in banned_cols:
        for phrase in group:
            story.append(bullet(f'"{phrase}"'))

    story.append(PageBreak())

    # ── SECTION 06 ─────────────────────────────────────────────────────────
    story += section_num('06', 'The Generation Prompt System')
    story.append(Paragraph(
        'The generation prompt is what Gemini receives every time it writes an article. '
        'Getting this right is what separates content that ranks from content that gets '
        'ignored. The prompt is editable in the admin panel — you do not need Lovable '
        'credits to change it.', BODY))

    story.append(Spacer(1, 8))
    story.append(Paragraph('Article type rotation', H2))
    types_data = [
        ['Article type', 'Keyword pattern', 'Why it matters'],
        ['Tool review', '"[tool name] review"', 'Highest affiliate conversion — reader is evaluating'],
        ['Comparison', '"[tool A] vs [tool B]"', 'Highest buyer intent — reader is about to choose'],
        ['Tutorial', '"how to [do X] with [tool]"', 'Long-tail traffic, low competition, builds trust'],
        ['Best-of list', '"best [tools] for [use case]"', 'High volume, captures broad intent'],
    ]
    tt = Table(types_data, colWidths=[1.1*inch, 1.8*inch, W - 2.9*inch])
    tt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('LEADING', (0,0), (-1,-1), 13),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GREY]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
    ]))
    story.append(tt)

    story.append(Spacer(1, 12))
    story.append(Paragraph('The Lovable-specific article rule', H2))
    story.append(Paragraph(
        'If your site was built with Lovable and your keyword queue includes a Lovable '
        'review or comparison, the generation prompt automatically adds this instruction:', BODY))
    story.append(prompt_block(
        'LOVABLE-SPECIFIC PROMPT ADDITION',
        'This site was built using Lovable. Write this article from the perspective '
        'of a real user with genuine hands-on experience. Include specific things that '
        'worked well in the actual build process, specific limitations encountered, '
        'and an honest overall verdict. Do not soften limitations out of familiarity '
        'with the tool. Real experience expressed honestly is more valuable than a '
        'balanced summary from someone who has never built with it.'
    ))

    story.append(PageBreak())

    # ── SECTION 07 ─────────────────────────────────────────────────────────
    story += section_num('07', 'Affiliate Link System')
    story.append(Paragraph(
        'The affiliate system automatically inserts monetisation into every article '
        'without you having to manually edit content. Set it up once in the admin panel '
        'and it runs forever.', BODY))

    story.append(Paragraph('How links are inserted', H2))
    link_rules = [
        'Maximum 3 affiliate links per article — more than this reads as promotional',
        'Minimum 1 affiliate link per article if any reviewed tool has an entry in the table',
        'Links are inserted naturally within sentences — never as bare URLs or button-style CTAs',
        'The same tool is never linked more than once per article',
        'Links always use descriptive anchor text — never "click here" or the raw URL',
        'If a tool is mentioned but has no affiliate link, the default fallback URL is used',
    ]
    for r in link_rules:
        story.append(bullet(r))

    story.append(Spacer(1, 10))
    story.append(Paragraph('The affiliate table', H2))
    story.append(schema_table([
        ['tool_name', 'text', 'Exact tool name as it appears in articles'],
        ['affiliate_url', 'text', 'Your full affiliate URL including tracking parameters'],
        ['active', 'boolean', 'Toggle off to stop using this link without deleting it'],
        ['commission_note', 'text', 'Optional — your notes on commission rate/type'],
        ['default_fallback', 'boolean', 'Mark one row as the default for unmatched tools'],
    ]))

    story.append(Spacer(1, 10))
    story.append(callout(
        'The default fallback URL is used whenever the engine mentions a tool that is '
        'not in your affiliate table. Set this to your highest-converting affiliate '
        'program — ideally one that is relevant to any tool in your niche. '
        'For a no-code review site this might be your Lovable or Webflow affiliate link '
        'since those are relevant regardless of which specific tool an article covers.', 'warn'))

    story.append(PageBreak())

    # ── SECTION 08 ─────────────────────────────────────────────────────────
    story += section_num('08', 'The Keyword Queue')
    story.append(Paragraph(
        'The keyword queue is the list of topics the engine works through. '
        'It is the editorial calendar of your autonomous content operation. '
        'Managing it well determines the quality of traffic you attract.', BODY))

    story.append(Paragraph('10 starter keywords (seeded automatically)', H2))
    story.append(Paragraph(
        'The activation prompt seeds these keywords automatically. They cover the '
        'highest-volume topics in the no-code niche to generate early traffic. '
        'Replace or supplement with your own niche-specific keywords:', BODY_L))

    starters = [
        ('best no-code app builder 2026', 'best_of_list', 'high', '18,000/mo'),
        ('webflow vs framer', 'comparison', 'high', '9,900/mo'),
        ('bubble review', 'tool_review', 'high', '4,400/mo'),
        ('zapier alternatives', 'comparison', 'high', '8,100/mo'),
        ('best no-code tools for agencies', 'best_of_list', 'high', '3,600/mo'),
        ('lovable review', 'tool_review', 'high', 'growing fast'),
        ('airtable vs notion', 'comparison', 'medium', '4,000/mo'),
        ('shopify vs webflow', 'comparison', 'medium', '8,520/mo'),
        ('no-code for beginners', 'tutorial', 'medium', '3,600/mo'),
        ('make vs zapier', 'comparison', 'medium', '12,000/mo'),
    ]
    sk_data = [['Keyword', 'Article type', 'Priority', 'Search vol.']] + \
              [[k, t, p, v] for k, t, p, v in starters]
    sk = Table(sk_data, colWidths=[2.4*inch, 1.1*inch, 0.8*inch, 1.0*inch])
    sk.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8.5),
        ('LEADING', (0,0), (-1,-1), 12),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GREY]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(sk)

    story.append(PageBreak())

    # ── SECTION 09 ─────────────────────────────────────────────────────────
    story += section_num('09', 'Content Refresh System')
    story.append(Paragraph(
        'Content decays. Pricing changes. Tools launch new features. Competitors overtake '
        'your articles in search rankings. The refresh system handles all of this '
        'automatically — turning content maintenance from a chore into a background process.', BODY))

    triggers = [
        ('Trigger A — Ranking drop',
         'Condition: article dropped more than 5 Search Console positions in 30 days.\n'
         'Action: expand the article with updated information, check all pricing and '
         'feature claims against the current tool database, add new sections covering '
         'recent updates, update the Last Verified date.\n'
         'Requires: GOOGLE_SEARCH_CONSOLE_TOKEN environment variable.'),
        ('Trigger B — Zero impressions after 90 days',
         'Condition: article has been published for more than 90 days with zero Search '
         'Console impressions — meaning Google has not indexed or ranked it at all.\n'
         'Action: complete rewrite with a stronger angle, different keyword targeting, '
         'and an improved title. The original is archived, not deleted.\n'
         'Requires: Nothing beyond published_at date in the database. '
         'This trigger works even without Search Console connected.'),
        ('Trigger C — Low click-through rate',
         'Condition: article has Search Console impressions but CTR below 2%.\n'
         'Action: rewrite the title and meta description only — the body content '
         'is not touched. Generates 3 title variants, picks the strongest, updates '
         'only the seo_title and seo_description fields.\n'
         'Requires: GOOGLE_SEARCH_CONSOLE_TOKEN environment variable.'),
    ]

    for title, desc in triggers:
        story.append(KeepTogether([
            Paragraph(title, H3),
            Paragraph(desc.replace('\n', '<br/>'), BODY),
            Spacer(1, 6),
        ]))

    story.append(callout(
        'The Last Verified date stamp appears at the top of every article and updates '
        'automatically on every refresh. A reader landing on a 6-month-old article that '
        'shows "Last verified: this month" sees a trustworthy, maintained resource. '
        'This is a credibility signal most review sites miss entirely.', 'green'))

    story.append(PageBreak())

    # ── SECTION 10 ─────────────────────────────────────────────────────────
    story += section_num('10', 'Newsletter Automation')
    story.append(Paragraph(
        'A weekly newsletter keeps your audience engaged between site visits, '
        'drives repeat traffic to new articles, and builds an email list that has '
        'value independent of your search rankings.', BODY))

    story.append(Paragraph('How it works', H2))
    nl_steps = [
        'Every Sunday at 08:00 UTC the newsletter agent runs',
        'It selects the top 3 articles published that week',
        'In early stage (no GSC data): ranked by quality gateway score',
        'In growth stage (GSC connected): ranked by click-through rate',
        'Gemini writes a two-sentence summary of each article',
        'Gemini generates two subject line variants for A/B testing',
        'The newsletter is sent via Resend to all active subscribers',
        'Send stats and subject line winner are logged to newsletter_issues table',
    ]
    for i, s in enumerate(nl_steps, 1):
        story.append(step(i, s))

    story.append(Spacer(1, 10))
    story.append(callout(
        'The newsletter is fully automatic but you can override it. '
        'In the admin panel, a "Preview this week\'s newsletter" button shows you '
        'what will go out before it sends. An "Override articles" option lets you '
        'manually select which three articles feature that week. '
        'A "Pause this week" toggle skips the send without disabling future sends.', 'blue'))

    story.append(PageBreak())

    # ── SECTION 11 ─────────────────────────────────────────────────────────
    story += section_num('11', 'Failure Handling and Alerts')
    story.append(Paragraph(
        'Things break. APIs go down. Gemini returns garbage. The scheduler misfires. '
        'The failure handling system means these events are logged, retried, '
        'and reported — not silently swallowed.', BODY))

    failure_items = [
        ('Three-strike retry',
         'Every Gemini API failure triggers a 10-minute wait and retry. '
         'After three consecutive failures on the same keyword, the keyword is '
         'marked as failed and the engine moves to the next one. '
         'A failure alert email is sent via Resend to your ALERT_EMAIL address.'),
        ('Email alerts',
         'Sent via Resend on: three-strike failure, daily request ceiling hit, '
         'scheduler missed fire (if no run detected within 2 hours of scheduled time), '
         'keyword queue empty (below 5 keywords remaining). '
         'Email includes: site name, failure type, keyword, error message, '
         'link to admin panel failure log.'),
        ('Daily request ceiling',
         '50 Gemini API calls per day hard maximum. If this ceiling is hit, '
         'generation stops for the day, an alert is sent, and a note appears '
         'in the admin panel overview. The ceiling resets at midnight UTC. '
         'Adjust in admin panel if you upgrade to a paid Gemini tier.'),
        ('Failure log',
         'Every failure is written to generation_log with: timestamp, keyword, '
         'failure type (API / quality gateway / scheduler), error message, '
         'retry count, final status. Viewable and searchable in the admin panel. '
         'Retry button on each row. Clear log option for resolved failures.'),
    ]

    for title, desc in failure_items:
        story.append(KeepTogether([
            Paragraph(title, H3),
            Paragraph(desc, BODY),
        ]))

    story.append(PageBreak())

    # ── SECTION 12 ─────────────────────────────────────────────────────────
    story += section_num('12', 'Multi-Site Reporting Dashboard')
    story.append(Paragraph(
        'If you run multiple sites using this content engine, managing them through '
        '10 separate admin panels becomes impractical. The multi-site reporting system '
        'solves this by having each site report its stats to a shared Supabase table, '
        'which a single master dashboard reads.', BODY))

    story.append(Paragraph('What each site reports after every run', H2))
    story.append(schema_table([
        ['site_id', 'text', 'Unique identifier for each site — set via SITE_ID env variable'],
        ['run_date', 'timestamp', 'When the generation run completed'],
        ['articles_published', 'integer', 'Articles that passed the gateway and went live'],
        ['articles_failed', 'integer', 'Articles that failed after retry'],
        ['gateway_pass_rate', 'decimal', 'Percentage of articles that passed quality check'],
        ['keywords_remaining', 'integer', 'Keywords left in the queue at time of report'],
        ['affiliate_clicks', 'integer', 'Clicks tracked since last report'],
        ['next_run_scheduled', 'timestamp', 'When the next generation run is due'],
    ]))

    story.append(Spacer(1, 10))
    story.append(Paragraph('Building the master dashboard', H2))
    story.append(Paragraph(
        'Create a new Lovable project for the master dashboard. '
        'Connect it to the same Supabase instance (or a central Supabase project '
        'that all 10 sites report to). Use this prompt:', BODY))
    story.append(prompt_block(
        'MASTER DASHBOARD LOVABLE PROMPT',
        'Build a private operations dashboard at / (the root — this is the entire site). '
        'Connect to Supabase and read from the network_reports table. '
        'Display: a card per site showing site_id, today\'s articles published, '
        'gateway pass rate, keywords remaining, last run time, next run time. '
        'Highlight any site with keywords_remaining below 10 in amber. '
        'Highlight any site with articles_failed > 0 today in red. '
        'Include a 7-day chart per site showing articles_published and gateway_pass_rate. '
        'Include a network totals row: total articles published today across all sites, '
        'total affiliate clicks today, lowest keyword queue across the network. '
        'Protect with Supabase Auth. No public access.'
    ))

    story.append(PageBreak())

    # ── SECTION 13 ─────────────────────────────────────────────────────────
    story += section_num('13', 'Replicating to Additional Sites')
    story.append(Paragraph(
        'Once the content engine is running on your anchor site, replicating it to '
        'any additional site takes approximately 10 minutes and 2 Lovable credits.', BODY))

    story.append(Paragraph('The 10-minute replication process', H2))
    rep_steps = [
        'Create a new Lovable project for the new site (or open an existing one)',
        'Add GEMINI_API_KEY (new key from Google AI Studio — separate per site)',
        'Add RESEND_API_KEY (same key is fine — or create a new one)',
        'Add ALERT_EMAIL with your email address',
        'Add SITE_ID with a short unique name for this site (e.g. "nocode-agency")',
        'Upload this document to Lovable\'s chat',
        'Write your new site identity block (5 sentences about this specific site)',
        'Paste the activation prompt from Section 03 with your new identity block inserted',
        'Let Lovable build — it detects what exists and only adds what\'s missing',
        'Add your site-specific keywords to the queue in the admin panel',
    ]
    for i, s in enumerate(rep_steps, 1):
        story.append(step(i, s))

    story.append(Spacer(1, 10))
    story.append(callout(
        'The only thing that changes between sites is: the site identity block, '
        'the SITE_ID environment variable, the Gemini API key, and the keyword queue. '
        'Everything else — the quality gateway, the admin panel, the affiliate system, '
        'the newsletter, the failure handling — is identical across all sites. '
        'That is what makes this a scalable system rather than a one-off build.', 'green'))

    story.append(PageBreak())

    # ── SECTION 14 ─────────────────────────────────────────────────────────
    story += section_num('14', 'Database Schema')
    story.append(Paragraph(
        'The activation prompt creates these tables automatically if they do not exist. '
        'If they already exist from a previous build, it adds missing columns only.', BODY))

    tables_schema = [
        ('keyword_queue', [
            ['id', 'uuid', 'Primary key'],
            ['keyword', 'text', 'The topic or search phrase to write about'],
            ['article_type', 'text', 'tool_review / comparison / tutorial / best_of_list'],
            ['priority', 'integer', 'Higher number = generates first. Default 50.'],
            ['status', 'text', 'pending / generating / published / failed / retry'],
            ['failure_reason', 'text', 'Populated on failure — explains what went wrong'],
            ['created_at', 'timestamp', 'When added to queue'],
            ['generated_at', 'timestamp', 'When generation completed'],
        ]),
        ('generation_log', [
            ['id', 'uuid', 'Primary key'],
            ['keyword_id', 'uuid', 'Foreign key to keyword_queue'],
            ['run_at', 'timestamp', 'When this generation attempt ran'],
            ['status', 'text', 'success / failed / gateway_rejected'],
            ['gateway_score', 'integer', 'Total quality score (0-100)'],
            ['gateway_scores', 'jsonb', 'Per-dimension scores as JSON object'],
            ['rejection_reason', 'text', 'Why the gateway rejected it if applicable'],
            ['retry_count', 'integer', 'Number of retry attempts (0-3)'],
            ['error_message', 'text', 'Full error text on API failures'],
            ['gemini_calls_used', 'integer', 'API calls consumed by this run'],
        ]),
        ('affiliate_links', [
            ['id', 'uuid', 'Primary key'],
            ['tool_name', 'text', 'Exact tool name as appears in articles'],
            ['affiliate_url', 'text', 'Full affiliate URL with tracking parameters'],
            ['active', 'boolean', 'Whether to use this link in generation'],
            ['is_default_fallback', 'boolean', 'One row marked true as the fallback link'],
            ['commission_note', 'text', 'Optional notes on commission structure'],
            ['clicks_tracked', 'integer', 'Running total of tracked clicks'],
        ]),
        ('site_settings', [
            ['id', 'uuid', 'Primary key (single row table)'],
            ['site_identity_block', 'text', 'The five-sentence site context for generation'],
            ['master_generation_prompt', 'text', 'Full prompt template — editable in admin'],
            ['banned_phrases', 'text[]', 'Array of phrases that cause gateway failure'],
            ['gateway_pass_threshold', 'integer', 'Minimum score to publish. Default 72.'],
            ['articles_per_day', 'integer', 'Daily generation volume. Default 4.'],
            ['generation_time_utc', 'text', 'Cron time string for scheduler'],
            ['daily_api_ceiling', 'integer', 'Max Gemini calls per day. Default 50.'],
            ['alert_email', 'text', 'Where failure alerts are sent'],
            ['gemini_model', 'text', 'Default: gemini-2.5-flash'],
        ]),
        ('network_reports', [
            ['id', 'uuid', 'Primary key'],
            ['site_id', 'text', 'Identifier from SITE_ID environment variable'],
            ['run_date', 'timestamp', 'When the generation run completed'],
            ['articles_published', 'integer', 'Count of articles published this run'],
            ['articles_failed', 'integer', 'Count of articles that failed after retry'],
            ['gateway_pass_rate', 'decimal', 'Pass rate as a decimal (0.0 to 1.0)'],
            ['keywords_remaining', 'integer', 'Queue depth at time of report'],
            ['affiliate_clicks', 'integer', 'Clicks since last report'],
            ['next_run_scheduled', 'timestamp', 'Next scheduled generation time'],
        ]),
    ]

    for table_name, fields in tables_schema:
        story.append(Paragraph(table_name, H3))
        story.append(schema_table(fields))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # ── SECTION 15 ─────────────────────────────────────────────────────────
    story += section_num('15', 'Troubleshooting')
    story.append(Paragraph(
        'Most issues fall into one of five categories. Work through these before '
        'spending a Lovable credit on a fix prompt.', BODY))

    issues = [
        ('Articles are not generating',
         [
             'Check the admin panel overview — is the scheduler showing a next run time?',
             'Check the failure log — are there API errors? This usually means the GEMINI_API_KEY is not set correctly in environment variables',
             'Verify the keyword queue has keywords with status = pending',
             'Check if the daily API ceiling has been hit (shown in overview)',
             'Use the manual trigger button in schedule settings to test immediately',
         ]),
        ('Articles are generating but not publishing',
         [
             'Check the gateway scores in generation_log — what dimension is failing?',
             'If specificity or verdict clarity are consistently low, the site identity block needs strengthening',
             'Lower the gateway threshold temporarily to 65 to see what gets through, then raise it again',
             'Check the banned phrases list — are common words in your niche accidentally on the list?',
         ]),
        ('Affiliate links are not appearing in articles',
         [
             'Check the affiliate_links table in the admin panel — are entries marked active?',
             'Verify the tool names in the table exactly match how the tool is mentioned in articles',
             'Check that the default fallback is set — at least one row should have is_default_fallback = true',
         ]),
        ('Email alerts are not arriving',
         [
             'Verify RESEND_API_KEY is set in environment variables',
             'Verify ALERT_EMAIL is set with a valid email address',
             'Check your spam folder',
             'In the admin panel failure log, check if "alert sent" shows true or false on failed items',
         ]),
        ('How to manually test the full pipeline',
         [
             'Go to admin panel → Schedule settings',
             'Click the "Manual trigger" button',
             'Watch the generation_log table in Supabase for a new row appearing',
             'Check the articles table for a new row with the generated content',
             'Navigate to /blog/[the-slug] to confirm the article page renders',
             'If the article is not at /blog/[slug], the routing is not set up correctly — use the follow-up prompt from Section 03',
         ]),
    ]

    for title, steps_list in issues:
        story.append(KeepTogether([
            Paragraph(title, H3),
        ] + [bullet(s) for s in steps_list] + [Spacer(1, 8)]))

    # ── BACK COVER ────────────────────────────────────────────────────────
    story.append(PageBreak())
    story.append(Spacer(1, 2.5*inch))
    story.append(Paragraph('Environment Variables Checklist', H2))
    story.append(Paragraph(
        'Add all of these to your Lovable project before pasting the activation prompt:', BODY))
    story.append(Spacer(1, 8))

    env_data = [
        ['Variable name', 'Where to get it', 'Required?'],
        ['GEMINI_API_KEY', 'aistudio.google.com → Get API key', 'YES'],
        ['RESEND_API_KEY', 'resend.com → API Keys', 'Recommended'],
        ['ALERT_EMAIL', 'Your email address', 'Recommended'],
        ['SITE_ID', 'Make up a short unique name: e.g. "nocode-reviews"', 'YES (multi-site)'],
        ['GOOGLE_SEARCH_CONSOLE_TOKEN', 'Google Search Console API', 'Optional'],
    ]
    et = Table(env_data, colWidths=[1.9*inch, 3.0*inch, 1.0*inch])
    et.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), INK),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('LEADING', (0,0), (-1,-1), 13),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GREY]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('FONTNAME', (0,1), (0,-1), 'Courier'),
        ('FONTSIZE', (0,1), (0,-1), 8),
        ('BACKGROUND', (2,1), (2,1), colors.HexColor('#E1F5EE')),
        ('TEXTCOLOR', (2,1), (2,1), ACCENT_DK),
        ('FONTNAME', (2,1), (2,1), 'Helvetica-Bold'),
        ('BACKGROUND', (2,2), (2,2), colors.HexColor('#E1F5EE')),
        ('TEXTCOLOR', (2,2), (2,2), ACCENT_DK),
        ('FONTNAME', (2,2), (2,2), 'Helvetica-Bold'),
    ]))
    story.append(et)

    story.append(Spacer(1, 0.5*inch))
    story.append(hr(color=ACCENT, thickness=1.5))
    story.append(Spacer(1, 12))
    story.append(Paragraph(
        'Upload this document to any Lovable project. Answer three questions. '
        'Paste one prompt. Walk away.',
        S('final', fontName='Helvetica-Bold', fontSize=13, textColor=INK,
          leading=20, alignment=TA_CENTER)))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        'Autonomous Content Engine — Stupid People Edition · v1.0 · May 2026',
        S('fin2', fontName='Helvetica', fontSize=9, textColor=MID_GREY,
          leading=13, alignment=TA_CENTER)))

    # ── Build PDF ────────────────────────────────────────────────────────
    doc.build(story,
              onFirstPage=on_first_page,
              onLaterPages=on_page)
    print("PDF built successfully.")

build()
