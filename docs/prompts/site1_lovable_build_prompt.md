# Lovable Agent Mode — Site 1: No-Code Platform Reviews
## Complete Single-Session Build Prompt

---

> **HOW TO USE THIS PROMPT**
> Paste everything from the horizontal rule below into Lovable's Agent Mode input field. Do not split it across multiple sessions. Agent Mode should be able to build the complete site without any clarification questions. All decisions have been pre-made. Where a value is marked `[ENV]`, Lovable should scaffold the environment variable but leave the value empty for manual entry post-build.

---

---

## MASTER BUILD PROMPT — PASTE BELOW THIS LINE

You are building **No-Code Platform Reviews**, a full-stack affiliate review site. This is Site 1 of a 10-site network. Build the entire application in a single agent session. Do not ask clarifying questions — all decisions are specified below. If a detail is ambiguous, choose the most SEO-friendly and conversion-optimized option and proceed.

**Stack:** React (Vite or Next.js 14 App Router — choose Next.js 14 App Router for SSR/SEO), TypeScript, Tailwind CSS, Supabase (database + auth + storage), Vercel (deployment), Resend (email). Use `shadcn/ui` for base components. Deploy target is Vercel.

---

## 1. DESIGN SYSTEM

Apply this design system globally across every component, page, and email template. Do not deviate.

### Colors
```css
:root {
  --color-bg:         #faf8f4;   /* off-white — page background */
  --color-ink:        #0f0e0d;   /* dark ink — primary text, headings */
  --color-accent:     #e8541a;   /* burnt orange — CTAs, badges, highlights */
  --color-accent-hover: #c94315; /* darker on hover */
  --color-muted:      #6b6560;   /* secondary text, captions */
  --color-border:     #e2ddd8;   /* card borders, dividers */
  --color-surface:    #ffffff;   /* card backgrounds */
  --color-surface-2:  #f3f0eb;   /* subtle section backgrounds */
  --color-success:    #16a34a;
  --color-warning:    #d97706;
  --color-error:      #dc2626;
}
```

### Typography
- **Headings (H1–H3):** `Instrument Serif` — import from Google Fonts. Italic style on H1 hero text only.
- **Body / UI text:** `DM Sans` — import from Google Fonts. Weights 400 and 500.
- **Monospace / code:** `JetBrains Mono` — import from Google Fonts.
- **Base font size:** 16px. Line height: 1.6 for body, 1.2 for headings.
- **H1:** 3rem / 600 weight — Instrument Serif
- **H2:** 2rem / 500 weight — Instrument Serif
- **H3:** 1.375rem / 500 weight — Instrument Serif
- **H4:** 1rem / 500 weight — DM Sans
- **Body:** 1rem / 400 weight — DM Sans
- **Small/caption:** 0.875rem / 400 weight — DM Sans

### Spacing & Layout
- Max content width: 1200px, centered with `mx-auto px-6`
- Article body max width: 740px
- Section vertical padding: `py-16` (desktop), `py-10` (mobile)
- Border radius: 8px (cards), 6px (buttons/inputs), 4px (badges)

### Component Tokens
- **Primary button:** `bg-[#e8541a] text-white px-5 py-2.5 rounded-md font-medium hover:bg-[#c94315] transition-colors`
- **Secondary button:** `border border-[#e2ddd8] bg-white text-[#0f0e0d] px-5 py-2.5 rounded-md font-medium hover:bg-[#f3f0eb]`
- **Card:** `bg-white border border-[#e2ddd8] rounded-lg p-5 shadow-sm`
- **Badge:** `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium`
- **Sponsored badge:** `bg-[#faf0e6] text-[#e8541a] border border-[#f5d9c8]` + text "Sponsored"
- **Rating star:** filled `#e8541a`, empty `#e2ddd8`
- **Input:** `border border-[#e2ddd8] rounded-md px-4 py-2.5 bg-white focus:ring-2 focus:ring-[#e8541a] focus:border-transparent outline-none w-full`

### Navigation
Sticky top nav. Left: site logo (wordmark "NoCode Reviews" in Instrument Serif + small orange square favicon). Center: nav links (Reviews, Compare, Best Lists, Categories). Right: Search icon + "Submit a Tool" button (accent). Mobile: hamburger → full-screen slide-in drawer. No dropdown megamenus — category pages handle navigation depth.

### Footer
Three-column grid. Column 1: logo + one-line description + newsletter signup form. Column 2: site map links (Reviews, Comparisons, Best-of Lists, Categories, Submit a Tool, Advertise, Newsletter). Column 3: disclosure text ("This site contains affiliate links. We may earn a commission when you click through and make a purchase. Our editorial process is independent of our commercial relationships.") + links (About, Methodology, Privacy Policy, Terms). Background `#0f0e0d`, text `#faf8f4`.

---

## 2. SUPABASE SCHEMA

Run all of the following SQL in the Supabase SQL editor. Create each table exactly as specified. Enable Row Level Security on all tables. Apply the RLS policies exactly as specified — do not add or remove policies.

```sql
-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ============================================================
-- TABLE: tools
-- ============================================================
create table tools (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  tagline             text,
  description         text,
  website_url         text,
  affiliate_url       text,
  logo_url            text,
  screenshot_url      text,
  category            text not null,         -- e.g. 'website-builder', 'app-builder', 'automation'
  subcategory         text,
  tags                text[],
  pricing_model       text,                  -- 'free', 'freemium', 'paid', 'open-source'
  starting_price_mo   numeric,
  has_free_plan       boolean default false,
  pricing_tiers       jsonb,                 -- [{name, price_mo, price_yr, limits:{}}]
  rating_overall      numeric(3,2),          -- 0.00–5.00
  rating_ease         numeric(3,2),
  rating_features     numeric(3,2),
  rating_pricing      numeric(3,2),
  rating_support      numeric(3,2),
  review_count        integer default 0,
  is_featured         boolean default false,
  is_sponsored        boolean default false,
  sponsored_slot      text,                  -- 'homepage_hero', 'category_top', 'sidebar', null
  sponsored_until     timestamptz,
  affiliate_program   text,                  -- network name
  affiliate_commission text,                 -- e.g. '30% recurring'
  last_price_update   timestamptz,
  price_changed_flag  boolean default false,
  status              text default 'active', -- 'active', 'needs_review', 'inactive'
  meta_title          text,
  meta_description    text,
  og_image_url        text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index tools_category_idx on tools(category);
create index tools_slug_idx on tools(slug);
create index tools_rating_idx on tools(rating_overall desc);
create index tools_featured_idx on tools(is_featured) where is_featured = true;
create index tools_name_trgm on tools using gin(name gin_trgm_ops);
create index tools_tags_idx on tools using gin(tags);

alter table tools enable row level security;
create policy "tools_public_read" on tools for select using (status = 'active');
create policy "tools_admin_all" on tools for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: articles
-- ============================================================
create table articles (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  title               text not null,
  excerpt             text,
  content             text,                  -- markdown or HTML
  content_type        text not null,         -- 'review', 'comparison', 'best-of', 'tutorial', 'news'
  site                text default 'site1',
  tool_id             uuid references tools(id) on delete set null,
  tool_ids            uuid[],                -- for comparisons / best-of
  primary_keyword     text,
  secondary_keywords  text[],
  author_name         text default 'Editorial Team',
  author_slug         text default 'editorial-team',
  status              text default 'draft',  -- 'draft', 'published', 'needs_review', 'archived'
  word_count          integer,
  flesch_kincaid      numeric(5,2),
  affiliate_links_count integer default 0,
  internal_links_count  integer default 0,
  paa_coverage        integer default 0,     -- number of PAA questions answered
  quality_score       jsonb,                 -- full quality gateway result object
  last_verified_at    timestamptz,
  published_at        timestamptz,
  indexed_at          timestamptz,
  indexnow_pinged     boolean default false,
  meta_title          text,
  meta_description    text,
  og_image_url        text,
  canonical_url       text,
  schema_faq          jsonb,                 -- [{question, answer}] for FAQPage schema
  schema_how_to       jsonb,                 -- steps array for HowTo schema
  views_7d            integer default 0,
  views_30d           integer default 0,
  views_total         integer default 0,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index articles_slug_idx on articles(slug);
create index articles_type_idx on articles(content_type);
create index articles_status_idx on articles(status);
create index articles_tool_idx on articles(tool_id);
create index articles_published_idx on articles(published_at desc) where status = 'published';
create index articles_keyword_trgm on articles using gin(primary_keyword gin_trgm_ops);

alter table articles enable row level security;
create policy "articles_public_read" on articles for select using (status = 'published');
create policy "articles_admin_all" on articles for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: comparisons
-- ============================================================
create table comparisons (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  title               text not null,
  tool_a_id           uuid references tools(id) on delete cascade,
  tool_b_id           uuid references tools(id) on delete cascade,
  winner_id           uuid references tools(id) on delete set null,
  verdict             text,                  -- 1–2 sentence summary
  feature_matrix      jsonb,                 -- [{feature, tool_a, tool_b, winner}]
  article_id          uuid references articles(id) on delete cascade,
  views_total         integer default 0,
  status              text default 'published',
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table comparisons enable row level security;
create policy "comparisons_public_read" on comparisons for select using (status = 'published');
create policy "comparisons_admin_all" on comparisons for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: categories
-- ============================================================
create table categories (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  description         text,
  icon                text,                  -- Lucide icon name
  tool_count          integer default 0,
  meta_title          text,
  meta_description    text,
  sort_order          integer default 0,
  created_at          timestamptz default now()
);

alter table categories enable row level security;
create policy "categories_public_read" on categories for select using (true);
create policy "categories_admin_all" on categories for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: subscribers
-- ============================================================
create table subscribers (
  id                  uuid primary key default gen_random_uuid(),
  email               text unique not null,
  first_name          text,
  site                text default 'site1',
  source              text,                  -- 'footer', 'popup', 'tool-gate', 'submit-form'
  goal                text,                  -- 'website', 'app', 'ecommerce', 'income'
  status              text default 'pending', -- 'pending', 'confirmed', 'unsubscribed'
  confirm_token       text unique default encode(gen_random_bytes(32), 'hex'),
  sequence_step       integer default 0,
  sequence_completed  boolean default false,
  confirmed_at        timestamptz,
  unsubscribed_at     timestamptz,
  created_at          timestamptz default now()
);

alter table subscribers enable row level security;
create policy "subscribers_insert_public" on subscribers for insert with check (true);
create policy "subscribers_admin_all" on subscribers for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: affiliate_clicks
-- ============================================================
create table affiliate_clicks (
  id                  uuid primary key default gen_random_uuid(),
  tool_id             uuid references tools(id) on delete set null,
  article_id          uuid references articles(id) on delete set null,
  site                text default 'site1',
  session_id          text,
  cta_position        text,                  -- 'intro', 'pros-cons', 'verdict', 'sidebar', 'tool-card'
  cta_variant         text,                  -- 'A', 'B'
  referrer            text,
  user_agent          text,
  created_at          timestamptz default now()
);

create index aff_clicks_tool_idx on affiliate_clicks(tool_id);
create index aff_clicks_article_idx on affiliate_clicks(article_id);
create index aff_clicks_created_idx on affiliate_clicks(created_at desc);

alter table affiliate_clicks enable row level security;
create policy "aff_clicks_insert_public" on affiliate_clicks for insert with check (true);
create policy "aff_clicks_admin_all" on affiliate_clicks for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: sponsored_slots
-- ============================================================
create table sponsored_slots (
  id                  uuid primary key default gen_random_uuid(),
  tool_id             uuid references tools(id) on delete set null,
  site                text default 'site1',
  slot_position       text not null,         -- 'homepage_hero', 'category_top', 'sidebar', 'newsletter'
  start_date          date not null,
  end_date            date not null,
  monthly_fee         numeric,
  status              text default 'active', -- 'active', 'expired', 'pending', 'cancelled'
  contact_email       text,
  notes               text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table sponsored_slots enable row level security;
create policy "sponsored_slots_admin_all" on sponsored_slots for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: link_map
-- ============================================================
create table link_map (
  id                  uuid primary key default gen_random_uuid(),
  source_article_id   uuid references articles(id) on delete cascade,
  target_article_id   uuid references articles(id) on delete cascade,
  target_url          text not null,
  anchor_text         text,
  link_type           text default 'internal', -- 'internal', 'cross_site', 'affiliate'
  site_source         text,
  site_target         text,
  created_at          timestamptz default now()
);

alter table link_map enable row level security;
create policy "link_map_admin_all" on link_map for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: keyword_queue
-- ============================================================
create table keyword_queue (
  id                  uuid primary key default gen_random_uuid(),
  keyword             text not null,
  site                text default 'site1',
  priority_score      numeric(5,2),
  volume              integer,
  kd                  integer,
  intent              text,                  -- 'informational', 'commercial', 'transactional'
  current_position    integer,
  status              text default 'pending', -- 'pending', 'in_progress', 'published', 'skipped'
  assigned_article_id uuid references articles(id) on delete set null,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table keyword_queue enable row level security;
create policy "kw_queue_admin_all" on keyword_queue for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: rank_history
-- ============================================================
create table rank_history (
  id                  uuid primary key default gen_random_uuid(),
  keyword             text not null,
  site                text default 'site1',
  position            integer,
  impressions         integer,
  clicks              integer,
  date                date not null,
  created_at          timestamptz default now()
);

create index rank_history_keyword_date on rank_history(keyword, date desc);
create index rank_history_site_date on rank_history(site, date desc);

alter table rank_history enable row level security;
create policy "rank_history_admin_all" on rank_history for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: cta_tests (A/B testing)
-- ============================================================
create table cta_tests (
  id                  uuid primary key default gen_random_uuid(),
  session_id          text,
  variant             text,                  -- 'A', 'B'
  tool_id             uuid references tools(id) on delete set null,
  article_id          uuid references articles(id) on delete set null,
  event_type          text,                  -- 'view', 'click'
  created_at          timestamptz default now()
);

alter table cta_tests enable row level security;
create policy "cta_tests_insert_public" on cta_tests for insert with check (true);
create policy "cta_tests_admin_all" on cta_tests for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: tool_submissions
-- ============================================================
create table tool_submissions (
  id                  uuid primary key default gen_random_uuid(),
  tool_name           text not null,
  website_url         text,
  submitter_name      text,
  submitter_email     text,
  category            text,
  description         text,
  pricing_notes       text,
  affiliate_program   text,
  status              text default 'pending', -- 'pending', 'approved', 'rejected'
  admin_notes         text,
  created_at          timestamptz default now()
);

alter table tool_submissions enable row level security;
create policy "submissions_insert_public" on tool_submissions for insert with check (true);
create policy "submissions_admin_all" on tool_submissions for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: newsletter_issues
-- ============================================================
create table newsletter_issues (
  id                  uuid primary key default gen_random_uuid(),
  subject             text not null,
  preview_text        text,
  html_content        text,
  send_date           date,
  status              text default 'draft',  -- 'draft', 'scheduled', 'sent'
  recipient_count     integer,
  open_rate           numeric(5,2),
  click_rate          numeric(5,2),
  site                text default 'site1',
  created_at          timestamptz default now()
);

alter table newsletter_issues enable row level security;
create policy "newsletter_issues_admin_all" on newsletter_issues for all using (auth.role() = 'service_role');
create policy "newsletter_issues_public_read" on newsletter_issues for select using (status = 'sent');

-- ============================================================
-- TABLE: distribution_log (Agent 6)
-- ============================================================
create table distribution_log (
  id                  uuid primary key default gen_random_uuid(),
  article_id          uuid references articles(id) on delete cascade,
  channel             text,                  -- 'indexnow', 'reddit', 'twitter'
  status              text,                  -- 'success', 'failed', 'pending'
  response            jsonb,
  created_at          timestamptz default now()
);

alter table distribution_log enable row level security;
create policy "distribution_log_admin_all" on distribution_log for all using (auth.role() = 'service_role');

-- ============================================================
-- TABLE: site_voices (voice fingerprints for content agents)
-- ============================================================
create table site_voices (
  id                  uuid primary key default gen_random_uuid(),
  site                text unique not null,
  persona_name        text,
  persona_bio         text,
  writing_style       text,
  banned_phrases      text[],
  few_shot_examples   text[],
  updated_at          timestamptz default now()
);

alter table site_voices enable row level security;
create policy "site_voices_admin_all" on site_voices for all using (auth.role() = 'service_role');

-- ============================================================
-- SEED: categories
-- ============================================================
insert into categories (slug, name, description, icon, sort_order) values
  ('website-builders', 'Website Builders', 'Drag-and-drop platforms for building websites without code', 'Globe', 1),
  ('app-builders', 'App Builders', 'Visual development tools for web and mobile applications', 'Smartphone', 2),
  ('automation', 'Automation Tools', 'Workflow automation and no-code integration platforms', 'Zap', 3),
  ('ecommerce', 'Ecommerce Platforms', 'No-code solutions for selling online', 'ShoppingCart', 4),
  ('databases', 'Database Tools', 'No-code database and backend platforms', 'Database', 5),
  ('ai-tools', 'AI & Chatbot Builders', 'No-code AI integration and chatbot platforms', 'Bot', 6),
  ('cms', 'CMS Platforms', 'Content management systems for editors and developers', 'FileText', 7),
  ('forms', 'Form & Survey Tools', 'No-code form builders and survey platforms', 'ClipboardList', 8),
  ('analytics', 'Analytics Tools', 'No-code analytics and reporting platforms', 'BarChart2', 9),
  ('membership', 'Membership & Communities', 'Platforms for building member communities and courses', 'Users', 10);

-- ============================================================
-- SEED: site_voices (Site 1 persona)
-- ============================================================
insert into site_voices (site, persona_name, persona_bio, writing_style, banned_phrases, few_shot_examples) values (
  'site1',
  'Marcus Reeve',
  'Marcus has been building no-code products since 2017. He has launched 14 products using platforms he reviews — 3 of which he sold. He is blunt, technically informed, and has no patience for marketing copy masquerading as features. He cares about pricing honesty and is quick to call out hidden costs.',
  'Direct and opinionated. Lead with the verdict. No hedging. Use contractions. Short sentences for punch. Longer sentences for nuance. Never use passive voice for verdicts — always active. Compare prices numerically, never vaguely. Acknowledge limitations honestly.',
  ARRAY['in today''s digital landscape', 'it''s worth noting', 'dive into', 'delve into', 'seamlessly', 'game-changer', 'leverage', 'robust', 'empower', 'revolutionize', 'best-in-class', 'cutting-edge', 'unlock potential', 'comprehensive solution'],
  ARRAY[
    'Webflow is the best website builder for designers who want total control — if you''re willing to spend a week learning it. The editor is powerful but unforgiving. Squarespace does what Webflow does for most use cases, at half the price and a quarter of the frustration.',
    'The pricing here is deceptive. Bubble''s $29/month plan sounds reasonable until you realize that anything serious requires the $119/month plan — because the $29 plan throttles API calls to the point of uselessness for a real product.',
    'I''ve built three products on Glide. Two are still running. The third hit Glide''s row limits six months in and I had to migrate — which was painful. That ceiling is the biggest risk you need to understand before committing.'
  ]
);
```

---

## 3. ENVIRONMENT VARIABLES

Scaffold all of the following as Vercel environment variables. Leave the values empty — they will be filled manually after deployment. Use these exact key names throughout the codebase.

```
NEXT_PUBLIC_SUPABASE_URL          [ENV]
NEXT_PUBLIC_SUPABASE_ANON_KEY     [ENV]
SUPABASE_SERVICE_ROLE_KEY         [ENV]
WEBHOOK_SECRET                    [ENV]   # X-Webhook-Secret header for all POST endpoints
RESEND_API_KEY                    [ENV]
RESEND_FROM_EMAIL                 [ENV]   # e.g. hello@nocode-reviews.com
INDEXNOW_API_KEY                  [ENV]
NEXT_PUBLIC_GA_MEASUREMENT_ID     [ENV]
NEXT_PUBLIC_SITE_URL              [ENV]   # e.g. https://nocode-reviews.com
ADMIN_EMAIL                       [ENV]   # for admin notification emails
```

---

## 4. ALL PAGES — COMPLETE SPECIFICATION

Build every page listed below. Pages marked **[SSR]** must be server-side rendered (Next.js `generateStaticParams` + ISR with 1-hour revalidation for content pages, full SSR for search/dynamic pages). All pages must have full SEO meta tags (see Section 6).

---

### 4.1 Homepage `/`

**Layout:** Hero → Search bar → Featured Sponsored Tool → Category Grid → Top-Rated Tools → Recent Reviews → Comparison CTA strip → Newsletter Signup → Footer

**Hero section:**
- H1 (Instrument Serif, italic): "Find the right no-code platform. *Without the guesswork.*"
- Subtext (DM Sans): "Honest, in-depth reviews of 100+ no-code platforms. Updated weekly."
- Full-width search bar (see Search component spec below)
- Below search: trending searches as pill links: "Webflow vs Framer · Best app builders · Bubble review · Cheapest no-code tools"

**Search component:**
- Input: "Search 100+ no-code platforms..." placeholder
- Live search via Supabase `ilike` on `tools.name` + `tools.tags`, debounced 200ms
- Dropdown results: tool logo + name + category + rating. Max 6 results. "View all results →" link at bottom.
- On submit: navigate to `/search?q={query}`

**Featured Sponsored Tool section:**
- Only renders if there is an active `sponsored_slots` record with `slot_position = 'homepage_hero'`
- Display: large card with screenshot, tool name, tagline, feature highlights (3 bullet points from `pricing_tiers[0].limits`), rating, "Try [Tool] Free →" CTA button (accent), "Sponsored" badge (top-right corner)
- If no active sponsor: show the highest-rated tool in the database instead, without the Sponsored badge

**Category Grid:**
- Pull all categories from the `categories` table ordered by `sort_order`
- 5-column grid (desktop), 2-column (mobile)
- Each category card: icon (Lucide) + name + tool count badge
- Links to `/category/[slug]`

**Top-Rated Tools section:**
- Heading: "Highest-Rated Platforms This Month"
- Pull top 12 tools by `rating_overall desc` where `status = 'active'` and `is_featured = false` and `is_sponsored = false`
- Tool card component (reused everywhere): logo, name, category badge, star rating (numeric + visual), tagline, starting price, "Read Review →" link, affiliate CTA button "Try Free →"
- 4-column grid desktop, 2-column tablet, 1-column mobile

**Recent Reviews section:**
- Pull 6 most recently published articles where `content_type = 'review'`
- Article card: og_image, title, excerpt, "Last verified" timestamp, word count badge, "Read →" link

**Comparison CTA strip:**
- Full-width `#f3f0eb` background section
- Text: "Torn between two platforms? Our side-by-side comparisons answer the question."
- Two sample comparison pills (e.g. "Webflow vs Framer" and "Bubble vs FlutterFlow") → link to `/compare`
- "Browse All Comparisons →" button

**Newsletter signup:**
- Heading: "The no-code review digest. Every Tuesday."
- Subtext: "Platform updates, new reviews, and deal alerts. No spam. Unsubscribe any time."
- Email input + first name input + "Subscribe" button
- On submit: POST to `/api/add-subscriber` → show success state ("Check your inbox to confirm")
- Source = `'footer_homepage'`

---

### 4.2 Tool Review Page `/reviews/[slug]` [SSR]

**Layout:** Breadcrumb → Hero → Tab Navigation → Tab Content (sticky sidebar on desktop)

**Breadcrumb:** Home › Reviews › [Category] › [Tool Name]

**Hero block:**
- Tool logo (large, 80px) + tool name (H1) + tagline
- Star rating bar (5 stars, filled per `rating_overall`) + numeric score + review count
- Meta row: Category badge · Pricing model badge · "Last verified: [date]" · affiliate link icon
- "Visit [Tool] Website →" CTA button (accent) — this is the affiliate link, must include `?ref=nocodereviews` or the stored `affiliate_url`
- "Add to Compare" button (outline) — adds tool to a client-side comparison basket (localStorage, max 3 tools)
- Screenshot of tool (full-width, lazy loaded, from `screenshot_url`)

**Tab Navigation (sticky on scroll, desktop only):**
Tabs: Overview | Features | Pricing | Pros & Cons | Verdict | FAQ

**Tab: Overview**
- H2: "What is [Tool]?"
- Render `articles.content` (markdown → HTML) for the overview section
- Structured "Quick Facts" table: Founded · Headquarters · Users · Integrations count · Free plan · Mobile app

**Tab: Features**
- H2: "[Tool] Features Breakdown"
- Render features section of article content
- Feature matrix table: Feature Name | Available? | Notes — pull from `tools.pricing_tiers` JSONB
- Rating breakdown: 5 individual ratings (ease, features, pricing, support, overall) with visual bar chart

**Tab: Pricing**
- H2: "[Tool] Pricing (Updated [last_price_update])"
- Render pricing section of article content
- Pricing table: one column per tier from `pricing_tiers` JSONB — show tier name, monthly price, annual price (with savings %), top 5 limits
- "Is [Tool] worth the price?" subsection
- Affiliate CTA card (accent background): "[Tool] — Try free for 14 days. Plans from $[starting_price_mo]/mo." with CTA button

**Tab: Pros & Cons**
- Two-column layout
- Pros (green check): minimum 4 items, each a full sentence
- Cons (red cross): minimum 3 items, each a full sentence
- Pull from article content

**Tab: Verdict**
- H2: "Our Verdict on [Tool]"
- Score card: 5 categories with numeric scores and visual bars
- Overall verdict paragraph
- "Who [Tool] is best for" bullet list
- "Who should look elsewhere" bullet list
- Affiliate CTA (large, full-width): "Ready to try [Tool]? Get started free →" (accent button) + "or compare alternatives →" link

**Tab: FAQ**
- H2: "Frequently Asked Questions about [Tool]"
- Render as accordion from `articles.schema_faq` JSONB array
- Minimum 5 Q&A pairs

**Sticky Sidebar (desktop, 320px wide):**
Appears on all tabs except when tab content is active on mobile.
- Affiliate CTA card:
  - Tool logo + name
  - Star rating
  - "Best for: [tagline excerpt]"
  - Starting price
  - Feature bullets (top 3 from pricing_tiers)
  - Large CTA button: "Try [Tool] Free →" (accent)
  - "No credit card required" text (if `has_free_plan = true`)
  - Disclosure: "Affiliate link — we may earn a commission"
- Below CTA: "Compare with alternatives" — 3 related tools (same category, query by category, exclude current tool)
- Below that: "Related Reviews" — 3 articles from same category

**Affiliate click tracking:**
Every click on any affiliate link (in hero, sidebar, tabs, or inline article links) must fire `POST /api/log-affiliate-click` with the tool_id, article_id, cta_position, and cta_variant.

**A/B testing:**
The sidebar CTA button uses deterministic A/B assignment:
- Variant A: `"Try [Tool] Free →"` (price anchor below: "Plans from $X/mo")
- Variant B: `"Join [review_count]+ teams — Try [Tool] →"` (social proof)
Assignment: `sessionStorage.getItem('cta_variant') || (Math.random() < 0.5 ? 'A' : 'B')` — store in sessionStorage. Fire `cta_view` event on mount, `cta_click` on click.

---

### 4.3 Comparison Page `/compare/[tool-a]-vs-[tool-b]` [SSR]

**Layout:** Hero verdict → Feature Matrix → Detailed breakdown → Recommendation → FAQ

**Hero:**
- H1: "[Tool A] vs [Tool B]: Which is Better in [Year]?"
- Verdict summary (1–2 sentences from `comparisons.verdict`)
- Winner badge if `comparisons.winner_id` is set
- Two tool hero cards side by side: logo + name + overall rating + starting price + "Read Full Review →" link

**Feature Matrix (primary UI):**
- Full-width table — rows are features, columns are Tool A and Tool B
- Data from `comparisons.feature_matrix` JSONB: `[{feature: string, tool_a: string|boolean, tool_b: string|boolean, winner: 'a'|'b'|'tie'|null}]`
- Boolean values render as ✓ (green) or ✗ (red). String values render as text.
- Winner column highlights the winning cell with `#faf0e6` background + small trophy icon
- Table is sticky-header on scroll
- Category headers within the table (e.g. "Core Features", "Pricing", "Integrations", "Support")

**Detailed breakdown:**
- Render `articles.content` for comparison article — this is the long-form prose section
- Each H2 section header corresponds to a feature category in the matrix

**Recommendation section:**
- Card: "Our Recommendation"
- "Choose [Tool A] if..." (3 bullet points)
- "Choose [Tool B] if..." (3 bullet points)
- Affiliate CTA buttons for both tools side by side

**FAQ:**
- Accordion from `articles.schema_faq`

---

### 4.4 Comparison Index `/compare`

- H1: "No-Code Platform Comparisons"
- Subtext: "Side-by-side feature breakdowns to help you choose."
- Two-column comparison card grid — each card shows Tool A logo + "vs" + Tool B logo + view count + link
- Filter by category (dropdown)
- "Start your own comparison" CTA → Platform Comparison Wizard (Section 5.1)

---

### 4.5 Category Index `/category/[slug]` [SSR]

- H1: "[Category Name] — [Tool Count] Platforms Reviewed"
- Category description
- Sponsored tool slot (if active `sponsored_slots` record with matching category)
- Tool grid: all tools in category, sorted by `rating_overall desc` — same Tool Card component as homepage
- Sidebar: Best-of list links for this category, subcategory filters
- Sub-section: "Latest [Category] Reviews" — 6 recent articles
- JSON-LD: `ItemList` schema listing all tools

---

### 4.6 Category List `/categories`

Grid of all categories. Each category: icon + name + count + description + "Browse →" link.

---

### 4.7 Best-Of Lists `/best/[slug]` [SSR]

Used for articles with `content_type = 'best-of'`.

- H1: from `articles.title`
- "Last updated: [published_at]" + "Last verified: [last_verified_at]"
- Quick-jump table of contents: numbered list of all H2s in article
- Article content renders with embedded Tool Cards at each H2 section
- Each tool entry: Tool Card component + affiliate CTA inline
- Bottom: "Methodology" accordion explaining selection criteria
- FAQ section from `schema_faq`

---

### 4.8 Search Results `/search`

- URL param: `?q={query}`
- H1: "Results for '{query}'"
- Tabbed results: All | Reviews | Comparisons | Best-of Lists | Tools
- Tool results: Tool Card grid
- Article results: Article Card list
- Empty state: "No results for '{query}'. Try: [3 suggested searches]"
- Supabase full-text search using `pg_trgm` on tools.name, articles.title, articles.primary_keyword

---

### 4.9 Submit a Tool `/submit`

**Purpose:** User-submitted tool suggestions. Feeds `tool_submissions` table.

**Form fields:**
- Tool Name (required, text)
- Tool Website URL (required, url)
- Your Name (optional, text)
- Your Email (optional, email)
- Category (required, select — pull from categories table)
- Short Description (required, textarea, 50–300 chars)
- Pricing Notes (optional, textarea, e.g. "Free plan available, paid from $15/mo")
- Affiliate Program (optional, text, e.g. "ShareASale #12345")
- "I confirm this is not my own tool" checkbox (required)

**On submit:** POST to Supabase `tool_submissions` table directly via Supabase client (not webhook). Show success: "Thanks! We review submissions within 5 business days."

No CAPTCHA — use Supabase's built-in rate limiting via RLS.

---

### 4.10 Advertise / Sponsored Listings `/advertise`

**Purpose:** Sales page for sponsored placements.

**Sections:**
1. Hero: "Reach 50,000+ no-code builders every month" (H1) + "Get your platform in front of the buyers already looking for it." (sub)
2. Audience stats grid: Monthly visitors · Email subscribers · Avg. session duration · % commercial-intent traffic (all pulled from ENV or hardcoded as targets initially)
3. Placement options — 3 cards:
   - **Homepage Hero** ($499/mo): Large above-fold feature slot. Screenshot + description + CTA. Estimated impressions/month.
   - **Category Sponsor** ($299/mo): Top-of-category placement across all reviews in your category. Badge on tool card + sticky sidebar mention.
   - **Newsletter Sponsor** ($199/issue): Logo + 50-word description in weekly digest to [subscriber count] subscribers.
4. Disclosure statement
5. "Get a media kit" form — name + email + company + monthly budget (select) → POST `/api/add-subscriber` with `source = 'advertise_page'` + send notification email to ADMIN_EMAIL via Resend

**Do not render current prices as live Supabase data** — hardcode the advertise page pricing so it can be edited as copy without DB changes.

---

### 4.11 Newsletter Archive `/newsletter`

- Grid of all sent newsletter issues from `newsletter_issues` where `status = 'sent'`
- Each issue card: subject, preview_text, send_date, open_rate if available
- Link to full HTML preview at `/newsletter/[id]`
- Newsletter signup CTA (same component as homepage footer)

### 4.12 Newsletter Issue `/newsletter/[id]` [SSR]

- Render `newsletter_issues.html_content` in a centered content container (max-width 600px)
- "Subscribe to future issues" CTA below

---

### 4.13 About & Methodology `/about`

**Sections:**
1. Our Mission: "We test and review every platform we recommend. Affiliate commissions fund the site — they do not influence our ratings."
2. How We Rate Tools: Explain the 5 rating dimensions (ease, features, pricing, support, overall) and the 0–5 scoring scale. Explain what each score means numerically (e.g. 4.5–5.0 = exceptional, 3.5–4.4 = solid, below 3.0 = not recommended).
3. Our Review Process: Step-by-step methodology — (1) we create a free/trial account, (2) we build a test project, (3) we evaluate on 5 dimensions over 2 weeks, (4) we fact-check all pricing against the official pricing page, (5) we re-verify pricing monthly.
4. Affiliate Disclosure: Clear, prominent disclosure that the site earns commissions. Confirm that commissions do not affect ratings or rankings.
5. Meet the Team: Author persona for Marcus Reeve (from site_voices) + author schema.
6. Last Updated: date

---

### 4.14 Admin Dashboard `/admin` (auth-protected)

Access: Supabase Auth email/password for the admin email only. The `/admin` route must check for a valid Supabase session server-side and redirect to `/admin/login` if unauthenticated.

**Admin Layout:** Sidebar navigation + main content area. Sidebar links: Overview · Tools · Articles · Comparisons · Submissions · Sponsored · Affiliates · Subscribers · Newsletter · Keywords · Settings

**Admin Login `/admin/login`:**
Simple email + password form using Supabase Auth. Redirect to `/admin` on success.

**Admin: Overview `/admin`**
Stats grid: Total tools · Published articles · Monthly affiliate clicks · Active sponsored slots · Subscribers (confirmed) · Articles needing re-verification (`last_verified_at < now() - interval '30 days'`)

Charts (use Recharts):
- Line chart: daily affiliate clicks (last 30 days)
- Bar chart: articles published per week (last 8 weeks)
- Pie chart: revenue by source (affiliate / sponsored / newsletter)

**Admin: Tools `/admin/tools`**
- Searchable, sortable data table: Name · Category · Rating · Affiliate URL (truncated) · Last Price Update · Status · Price Changed Flag
- Row actions: Edit (opens slide-over panel) · Delete · "Mark as Reviewed"
- Edit panel: all fields from the `tools` table as a form. Save via Supabase client using service role.
- "Add Tool" button → same form, blank
- Filter by: status, category, price_changed_flag = true, has_free_plan

**Admin: Articles `/admin/articles`**
- Table: Title · Type · Status · Word Count · Published At · Last Verified · Views (30d)
- Row actions: Edit (opens in new tab to editor) · Change Status · Delete
- Filter by: status, content_type, site
- "New Article" button → blank article form

**Admin: Comparisons `/admin/comparisons`**
- Table: Tool A · Tool B · Winner · Status · Views
- Row actions: Edit · Delete
- "New Comparison" button

**Admin: Submissions `/admin/submissions`**
- Table: Tool Name · Submitted By · Date · Status
- Row actions: Approve (creates draft tool record) · Reject · View details
- On Approve: prefill a new tool record in the tools table with submitted data, set status = 'draft', send confirmation email to submitter

**Admin: Sponsored `/admin/sponsored`**
- Table: Tool · Site · Slot Position · Start · End · Monthly Fee · Status
- Status badges: Active (green) / Expiring Soon (orange, <14 days) / Expired (red)
- Revenue total: sum of monthly_fee for all active slots
- "New Slot" button → form to create sponsored_slots record
- On slot expiry (<14 days): show alert banner at top of page

**Admin: Affiliates `/admin/affiliates`**
- Table of affiliate programs. Pre-populate with these 20 programs:

| Program | Network | Commission | Status |
|---|---|---|---|
| Webflow | Direct | 50% first year | pending |
| Bubble | Direct | 20% recurring | pending |
| Framer | Direct | 30% first year | pending |
| Squarespace | Impact | $100/sale | pending |
| Wix | Impact | $100/sale | pending |
| Shopify | Direct (Affiliates) | $58/sale avg | pending |
| Notion | Direct | $10 first sale | pending |
| Airtable | PartnerStack | 20% recurring | pending |
| Zapier | ShareASale | $14 CPA | pending |
| Make (Integromat) | PartnerStack | 20% recurring | pending |
| Monday.com | Impact | $100+ CPA | pending |
| ClickUp | PartnerStack | 20% first year | pending |
| Kajabi | Direct | 30% recurring | pending |
| Memberstack | PartnerStack | 30% recurring | pending |
| Glide | Direct | 20% recurring | pending |
| Softr | Direct | 20% recurring | pending |
| Stacker | Direct | 20% recurring | pending |
| AppGyver (SAP) | Direct | n/a | pending |
| Adalo | Direct | 20% recurring | pending |
| FlutterFlow | Direct | 20% recurring | pending |

For each program, track: program_name, company, network, affiliate_url, applied_date, status (not applied / applied / approved / rejected / waitlisted), approval_date, commission_structure, payment_threshold, notes.

Columns: Program · Network · Commission · Status · Applied · Days Since Applied (red badge at 30+) · Action
"Generate follow-up email" button per row: calls Anthropic API (claude-sonnet-4-20250514) to draft a polite follow-up email to the affiliate manager. Pre-fill the Resend compose panel with the result.

**Admin: Subscribers `/admin/subscribers`**
- Table: Email · First Name · Source · Goal · Status · Confirmed At · Sequence Step
- Filter by: status, source, site
- Subscriber count by source (bar chart)

**Admin: Newsletter `/admin/newsletter`**
- List of newsletter issues with status
- "New Issue" button → form to create newsletter_issues record
- "Send Test" button → sends to ADMIN_EMAIL via Resend
- "Schedule" button → set send_date

**Admin: Keywords `/admin/keywords`**
- Table: Keyword · Priority Score · Volume · KD · Intent · Status · Assigned Article
- Filter by: status, intent
- "Add Keyword" button

**Admin: Settings `/admin/settings`**
- Site name, site URL
- Default author name
- IndexNow key
- Webhook secret (masked)
- "Test webhook" buttons for each endpoint

---

## 5. INTERACTIVE TOOLS

Build all 4 tools as standalone React components embedded at their respective routes. Each tool must be fully client-side (no external API calls). Each must work without JavaScript disabled gracefully (show a static fallback).

---

### 5.1 Platform Comparison Wizard `/tools/platform-wizard`

**Component name:** `PlatformComparisonWizard`

**Purpose:** 10-question quiz → top 3 platform recommendations with affiliate links.

**Question flow (stepper UI, one question per screen, back/next buttons, progress bar):**

1. "What are you building?" → Website / Web Application / Ecommerce Store / Internal Tool / Mobile App / Not sure yet
2. "What's your technical background?" → No code experience / Some basic skills / Comfortable with HTML/CSS / Developer
3. "What's your monthly budget for tools?" → Free only / Under $30/mo / $30–$100/mo / $100–$300/mo / No limit
4. "Do you need a native mobile app (iOS/Android)?" → Yes, native is required / Web app is fine / Not sure
5. "What's your team size?" → Just me / 2–5 people / 6–20 people / 20+ people
6. "Do you need to accept payments?" → Yes, payments are core / Occasionally / No
7. "Do you need a blog or CMS?" → Yes, content is important / Maybe later / No
8. "What matters most?" → Speed to launch / Long-term scalability / Design control / Lowest cost
9. "What existing tools do you use?" (multi-select) → Notion / Airtable / Google Sheets / Zapier / None of these
10. "What's your timeline?" → This week / This month / Next 3 months / Just exploring

**Scoring matrix (hardcode these weights — do not call any API):**

Score each tool against each answer. Tools in matrix: Webflow, Framer, Bubble, Glide, Adalo, FlutterFlow, Squarespace, Wix, Shopify, Softr, Stacker, AppGyver.

Key scoring rules (apply all, sum scores):
- Q1 Website → +3 Webflow, +3 Framer, +2 Squarespace, +2 Wix
- Q1 Web App → +3 Bubble, +3 Softr, +2 Stacker, +2 Glide
- Q1 Ecommerce → +3 Shopify, +2 Wix, +1 Squarespace
- Q1 Mobile App → +3 Adalo, +3 FlutterFlow, +2 Glide
- Q2 No code → +2 Glide, +2 Softr, +2 Squarespace, +1 Wix, -1 Bubble, -2 FlutterFlow
- Q2 Developer → +2 Webflow, +2 Bubble, +2 FlutterFlow, -1 Squarespace
- Q3 Free only → +2 Glide (free tier), +2 Softr (free tier), -2 Bubble
- Q3 Under $30 → +2 Glide, +2 Softr, +1 Squarespace, -1 Bubble
- Q4 Native required → +3 Adalo, +3 FlutterFlow, -3 Webflow, -3 Framer, -3 Softr
- Q7 CMS important → +3 Webflow, +2 Framer, +1 Squarespace
- Q8 Speed to launch → +3 Glide, +2 Softr, +2 Squarespace, -1 FlutterFlow
- Q8 Scalability → +3 Bubble, +2 FlutterFlow, +1 Webflow
- Q8 Design control → +3 Webflow, +3 Framer, -1 Glide
- Q8 Lowest cost → +2 Glide, +2 Softr, +1 Squarespace

After scoring: sort by total score descending. Show top 3.

**Results screen:**
For each recommended tool, show:
- Tool logo + name
- Match score: `{score}/{maxPossibleScore}` as a percentage bar
- "Why this fits you" — dynamically generate 3 bullet reasons based on which questions drove the score (build a reason map in the component)
- CTA button: "Read our [Tool] review →" linking to `/reviews/[tool-slug]`
- "Try [Tool] free →" linking to the tool's affiliate URL (hardcode these in the component)
- "Start over" link

Affiliate URLs to hardcode in the wizard:
- Webflow: `https://webflow.com?via=nocodereviews`
- Framer: `https://framer.com?via=nocodereviews`
- Bubble: `https://bubble.io?via=nocodereviews`
- Glide: `https://glide.page?via=nocodereviews`
- Adalo: `https://adalo.com?via=nocodereviews`
- FlutterFlow: `https://flutterflow.io?via=nocodereviews`
- Squarespace: `https://squarespace.com?via=nocodereviews`
- Wix: `https://wix.com?via=nocodereviews`
- Shopify: `https://shopify.com?via=nocodereviews`
- Softr: `https://softr.io?via=nocodereviews`

On results view: fire `POST /api/log-affiliate-click` with `{tool_id: null, article_id: null, cta_position: 'wizard_result', cta_variant: 'wizard'}` for each CTA click.

---

### 5.2 Pricing Calculator `/tools/pricing-calculator`

**Component name:** `PricingCalculator`

**Purpose:** User inputs their usage parameters → see ranked monthly cost across platforms.

**Inputs:**
- Number of pages/items (slider: 1–10,000)
- Team members who need editor access (slider: 1–50)
- Monthly bandwidth needed (select: <10GB / 10–100GB / 100GB–1TB / >1TB)
- Need custom domain? (yes/no toggle)
- CMS items needed (slider: 0–100,000)
- Priority: cheapest / best value / most features (radio)
- Platforms to compare (multi-select checkboxes): Webflow / Framer / Squarespace / Wix / Bubble / Ghost / Shopify / Wordpress.com

**Pricing data (hardcode 2025 pricing):**

```javascript
const PRICING_DATA = {
  webflow: {
    plans: [
      { name: 'Starter', price: 0, pages: 2, bandwidth: '1GB', cms: 50, editors: 1, domain: false },
      { name: 'Basic', price: 14, pages: 150, bandwidth: '50GB', cms: 0, editors: 1, domain: true },
      { name: 'CMS', price: 23, pages: 150, bandwidth: '200GB', cms: 2000, editors: 3, domain: true },
      { name: 'Business', price: 39, pages: 300, bandwidth: '400GB', cms: 10000, editors: 10, domain: true },
    ]
  },
  framer: {
    plans: [
      { name: 'Free', price: 0, pages: 1, bandwidth: '1GB', cms: 0, editors: 1, domain: false },
      { name: 'Mini', price: 5, pages: 1, bandwidth: '1GB', cms: 0, editors: 1, domain: true },
      { name: 'Basic', price: 15, pages: 100, bandwidth: '100GB', cms: 1000, editors: 1, domain: true },
      { name: 'Pro', price: 30, pages: 'unlimited', bandwidth: '200GB', cms: 10000, editors: 1, domain: true },
    ]
  },
  squarespace: {
    plans: [
      { name: 'Personal', price: 16, pages: 'unlimited', bandwidth: 'unlimited', cms: 'unlimited', editors: 1, domain: true },
      { name: 'Business', price: 23, pages: 'unlimited', bandwidth: 'unlimited', cms: 'unlimited', editors: 2, domain: true },
      { name: 'Commerce Basic', price: 27, pages: 'unlimited', bandwidth: 'unlimited', cms: 'unlimited', editors: 2, domain: true },
    ]
  },
  wix: {
    plans: [
      { name: 'Free', price: 0, pages: 'unlimited', bandwidth: '500MB', cms: 50, editors: 1, domain: false },
      { name: 'Light', price: 16, pages: 'unlimited', bandwidth: '2GB', cms: 'unlimited', editors: 1, domain: true },
      { name: 'Core', price: 27, pages: 'unlimited', bandwidth: '50GB', cms: 'unlimited', editors: 5, domain: true },
      { name: 'Business', price: 32, pages: 'unlimited', bandwidth: '100GB', cms: 'unlimited', editors: 10, domain: true },
    ]
  },
  bubble: {
    plans: [
      { name: 'Free', price: 0, pages: 'unlimited', bandwidth: '1GB', cms: 'unlimited', editors: 1, domain: false },
      { name: 'Starter', price: 29, pages: 'unlimited', bandwidth: '10GB', cms: 'unlimited', editors: 2, domain: true },
      { name: 'Growth', price: 119, pages: 'unlimited', bandwidth: '20GB', cms: 'unlimited', editors: 5, domain: true },
      { name: 'Team', price: 349, pages: 'unlimited', bandwidth: '50GB', cms: 'unlimited', editors: 15, domain: true },
    ]
  }
  // Ghost, Shopify, WordPress to be added similarly
};
```

**Output:**
For each selected platform: find the cheapest plan that meets ALL user inputs. Display as ranked table (cheapest first):
- Platform name + logo
- Recommended plan name
- Monthly price (highlighted if cheapest: green badge "Best Value")
- Annual equivalent
- Key limits for chosen plan
- "Read full review →" link
- "Try [Platform] free →" affiliate link

Also show: "Why plans were eliminated" — for any platform with no plan that meets requirements, show a red note explaining why (e.g. "Webflow Basic doesn't support enough CMS items for your needs").

---

### 5.3 Feature Matrix Builder `/tools/feature-matrix`

**Component name:** `FeatureMatrixBuilder`

**Purpose:** User selects 2–4 platforms → live feature comparison table.

**Platform selector:** Multi-select pill buttons. Min 2, max 4. Options: the 20 tools in the affiliate table. Show logo + name per pill.

**Feature categories to compare (hardcode this data for the top 10 tools):**

Categories: Core Editor · Templates · CMS · Ecommerce · Integrations · Collaboration · Performance · SEO Tools · Support · Pricing Model

Each category: 5–8 specific features, each with a value per platform (true/false/string).

**Table display:**
- Rows: feature names
- Columns: selected platforms
- Cell: ✓ (green) / ✗ (red) / text value (gray)
- Category rows are collapsible (click to expand/collapse)
- "Highlight differences" toggle: grays out all rows where all selected platforms have the same value, showing only rows where platforms differ
- "Export as image" button: uses `html2canvas` to capture the table and download as PNG

**Below table:** CTA for the Platform Comparison Wizard + affiliate CTAs for all selected tools

---

### 5.4 Should I Switch? `/tools/should-i-switch`

**Component name:** `ShouldISwitchTool`

**Purpose:** User describes their current platform + pain points → AI-powered recommendation.

**Step 1 — Current situation form:**
- Current platform (select from tool list)
- How long have you been using it? (select: <3 months / 3–12 months / 1–3 years / 3+ years)
- Monthly cost (number input, $)
- Main use case (text input, 60 chars max)
- What's working well (textarea, optional)
- What's frustrating you (textarea, required — this drives the AI recommendation)
- Biggest constraint (select: cost / features / performance / scalability / design / support)
- What's your switching timeline? (select: ASAP / Within 3 months / Just evaluating / Not seriously considering)

**Step 2 — Process:**
On submit, call Anthropic API (`claude-sonnet-4-20250514`, max_tokens 800) with this system prompt:

```
You are a no-code platform advisor. A user has described their current situation. 
Your job is to give them an honest, direct recommendation.

Return ONLY a JSON object with this exact shape:
{
  "verdict": "switch" | "stay" | "evaluate",
  "verdict_reason": "2-sentence explanation of the verdict",
  "switch_cost_estimate": "string estimate of time + money to switch",
  "top_alternatives": [
    {
      "tool_name": "exact name matching our database",
      "tool_slug": "url slug",
      "match_reason": "1 sentence why",
      "biggest_difference": "1 sentence what they'd gain",
      "watch_out": "1 sentence potential downside"
    }
  ],
  "stay_advice": "If staying, what 1 thing should they do to address their frustration",
  "questions_to_ask": ["3 questions the user should research before deciding"]
}

top_alternatives should have 2–3 items. Only recommend tools from this list:
Webflow, Framer, Bubble, Glide, Adalo, FlutterFlow, Squarespace, Wix, Shopify, Softr, Stacker.
```

**Step 3 — Results display:**
- Large verdict card: SWITCH (orange) / STAY (green) / EVALUATE (blue) badge + verdict_reason
- Switching cost estimate
- Alternatives cards: for each alternative, show tool card style with match_reason, biggest_difference, watch_out, + affiliate CTA
- "Before you decide" accordion with the 3 questions
- If verdict = 'stay': show stay_advice as a green callout box
- "Compare your top 2 options →" button prefills Feature Matrix Builder with current platform + top alternative

**Loading state:** Animated progress bar with text: "Analyzing your situation..." → "Checking alternatives..." → "Building your recommendation..."

**API call:** Use the Anthropic API endpoint: `POST https://api.anthropic.com/v1/messages` — do NOT include an API key in client-side code. Create a Next.js API route at `/api/should-i-switch` that makes the Anthropic API call server-side using `ANTHROPIC_API_KEY` from env. Add `ANTHROPIC_API_KEY` to the environment variables list.

Add `ANTHROPIC_API_KEY` to the env variables section.

---

## 6. SEO REQUIREMENTS

Apply all of the following to every page. This is non-negotiable for the site's core purpose.

### 6.1 Meta Tags

Every page must export a `generateMetadata()` function (Next.js App Router). Rules:

**`<title>`:**
- Review pages: `[Tool Name] Review ([Year]) — Pros, Cons & Pricing | NoCode Reviews`
- Comparison pages: `[Tool A] vs [Tool B] ([Year]) — Which is Better? | NoCode Reviews`
- Best-of: `[Article Title] | NoCode Reviews`
- Category: `Best [Category Name] Platforms ([Year]) — [Count] Reviewed | NoCode Reviews`
- Homepage: `No-Code Platform Reviews — Find Your Perfect Tool | NoCode Reviews`

**`<meta name="description">`:**
- Review: Pull from `tools.meta_description`. Fallback: `"In-depth [Tool Name] review: pricing, features, pros and cons. Last verified [date]."`
- Comparison: `"[Tool A] vs [Tool B]: side-by-side feature comparison, pricing breakdown, and our verdict on which is better in [year]."`
- Max 160 characters. Truncate with ellipsis if needed.

**`<link rel="canonical">`:** Always present. Use absolute URL with `NEXT_PUBLIC_SITE_URL`.

**`<meta name="robots">`:** `index, follow` for all published pages. `noindex, nofollow` for `/admin/*`, `/search` (with empty query), and draft articles.

### 6.2 Open Graph Tags

```html
<meta property="og:title" content="[page title]" />
<meta property="og:description" content="[meta description]" />
<meta property="og:image" content="[og_image_url or generated OG image]" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="[canonical url]" />
<meta property="og:type" content="article" /> <!-- or "website" for homepage/category -->
<meta property="og:site_name" content="NoCode Reviews" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@nocode_reviews" />
```

**OG Image generation:** For review and comparison pages without a stored `og_image_url`, generate an OG image dynamically at `/api/og?slug=[slug]` using `@vercel/og`. Template: dark `#0f0e0d` background, tool logo top-left, title in Instrument Serif white, site logo bottom-right, category badge, rating stars.

### 6.3 JSON-LD Structured Data

Inject all relevant schemas as `<script type="application/ld+json">` in the page `<head>`.

**Review pages — inject ALL THREE:**

```json
// Schema 1: SoftwareApplication
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[tool.name]",
  "description": "[tool.description]",
  "url": "[tool.website_url]",
  "applicationCategory": "WebApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "[tool.starting_price_mo]",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "[tool.starting_price_mo]",
      "priceCurrency": "USD",
      "unitText": "MONTH"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[tool.rating_overall]",
    "reviewCount": "[tool.review_count]",
    "bestRating": "5",
    "worstRating": "1"
  }
}

// Schema 2: Article (Review)
{
  "@context": "https://schema.org",
  "@type": "Review",
  "name": "[article.title]",
  "reviewBody": "[article.excerpt]",
  "datePublished": "[article.published_at]",
  "dateModified": "[article.updated_at]",
  "author": {
    "@type": "Person",
    "name": "[article.author_name]",
    "url": "[SITE_URL]/author/[article.author_slug]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "NoCode Reviews",
    "url": "[SITE_URL]"
  },
  "itemReviewed": {
    "@type": "SoftwareApplication",
    "name": "[tool.name]"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "[tool.rating_overall]",
    "bestRating": "5"
  }
}

// Schema 3: FAQPage
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    // map articles.schema_faq array:
    {
      "@type": "Question",
      "name": "[question]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[answer]"
      }
    }
    // ...
  ]
}
```

**Best-of and category pages:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "[page title]",
  "numberOfItems": "[count]",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "[tool.name]",
      "url": "[SITE_URL]/reviews/[tool.slug]"
    }
    // ...
  ]
}
```

**Article/comparison pages:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[article.title]",
  "datePublished": "[published_at]",
  "dateModified": "[updated_at]",
  "author": { "@type": "Person", "name": "[author_name]" },
  "publisher": { "@type": "Organization", "name": "NoCode Reviews" },
  "image": "[og_image_url]",
  "mainEntityOfPage": "[canonical_url]"
}
```

**Homepage:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "NoCode Reviews",
  "url": "[SITE_URL]",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "[SITE_URL]/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 6.4 IndexNow

After every successful article publish (via `/api/publish-article`), ping IndexNow:

```
POST https://api.indexnow.org/indexnow
Content-Type: application/json

{
  "host": "nocode-reviews.com",
  "key": "[INDEXNOW_API_KEY]",
  "urlList": ["[SITE_URL]/reviews/[article.slug]"]
}
```

Also serve the IndexNow key file at `GET /[INDEXNOW_API_KEY].txt` returning the key as plain text.

Update the `articles.indexnow_pinged = true` and log to `distribution_log` after a successful ping.

### 6.5 Sitemap

Auto-generate sitemap at `/sitemap.xml` using Next.js `app/sitemap.ts`. Include:
- All published articles (changefreq: weekly, priority: 0.8)
- All active tools as review pages (changefreq: monthly, priority: 0.9)
- All category pages (changefreq: weekly, priority: 0.7)
- All comparison pages (changefreq: monthly, priority: 0.8)
- Static pages: homepage (1.0), /compare (0.6), /categories (0.6), /about (0.4), /submit (0.4)

Regenerate sitemap on every new article publish by triggering ISR revalidation of `/sitemap.xml`.

### 6.6 Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: [NEXT_PUBLIC_SITE_URL]/sitemap.xml
```

### 6.7 Canonical URLs

Every page must set a canonical URL. For paginated category pages (`/category/[slug]?page=2`), the canonical points to the first page.

---

## 7. WEBHOOK ENDPOINTS

All 7 endpoints must be implemented as Next.js API routes under `app/api/`. All POST endpoints must validate the `X-Webhook-Secret` header against the `WEBHOOK_SECRET` environment variable before processing. Return `401 { error: 'Unauthorized' }` on mismatch.

### 7.1 `POST /api/publish-article`

Triggered by the n8n content pipeline when an article passes the quality gateway.

**Request payload:**
```typescript
{
  webhook_secret: string;          // redundant with header — validate both
  site: string;                    // 'site1'
  title: string;
  slug: string;
  content: string;                 // markdown or HTML
  excerpt: string;
  content_type: 'review' | 'comparison' | 'best-of' | 'tutorial' | 'news';
  primary_keyword: string;
  secondary_keywords: string[];
  tool_id?: string;               // UUID if review or comparison
  tool_ids?: string[];            // UUID array for best-of
  author_name: string;
  author_slug: string;
  word_count: number;
  flesch_kincaid: number;
  affiliate_links_count: number;
  internal_links_count: number;
  paa_coverage: number;
  quality_score: object;
  schema_faq: Array<{ question: string; answer: string }>;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
}
```

**Actions:**
1. Validate `X-Webhook-Secret` header
2. Upsert article record to Supabase `articles` table (insert if slug doesn't exist, update if it does)
3. Set `status = 'published'`, `published_at = now()`, `last_verified_at = now()`
4. Ping IndexNow with the article URL
5. Log to `distribution_log`
6. Trigger ISR revalidation for the new article page, homepage, sitemap
7. If `content_type = 'review'` and `tool_id` provided: update `tools.updated_at` for that tool

**Response:** `200 { success: true, article_id: string, slug: string }`

---

### 7.2 `POST /api/add-subscriber`

Triggered by newsletter signup forms across the site.

**Request payload:**
```typescript
{
  email: string;
  first_name?: string;
  site: string;           // 'site1'
  source: string;         // 'footer_homepage' | 'popup' | 'tool-gate' | 'advertise_page' | 'submit-form'
  goal?: string;          // 'website' | 'app' | 'ecommerce' | 'income'
}
```

**Actions:**
1. Validate webhook secret
2. Check if email already exists in `subscribers` table
3. If new: insert with `status = 'pending'`, generate `confirm_token`
4. Send double opt-in confirmation email via Resend to the subscriber's email:
   - Subject: "Confirm your NoCode Reviews subscription"
   - Body: "Click here to confirm your subscription: [SITE_URL]/confirm?token=[confirm_token]"
5. If already exists and `status = 'unsubscribed'`: return `409 { error: 'Previously unsubscribed' }`
6. If already exists and `status = 'pending'` or `'confirmed'`: return `200 { success: true, status: 'already_exists' }`

**Response:** `200 { success: true, status: 'pending_confirmation' }`

---

### 7.3 `GET /confirm`

Email confirmation endpoint — linked in the confirmation email.

**Query params:** `?token=[confirm_token]`

**Actions:**
1. Look up subscriber by `confirm_token`
2. Update `status = 'confirmed'`, `confirmed_at = now()`
3. Clear `confirm_token` (set to null)
4. Send welcome email via Resend:
   - Subject: "Welcome to NoCode Reviews"
   - Body: HTML email with Instrument Serif heading, DM Sans body, burnt orange CTA button
   - Body copy: "You're in. Every Tuesday we send the best no-code platform news, reviews, and deals. Here's what to read first: [3 featured articles]"
5. Redirect to homepage with `?subscribed=1` query param (show success toast)

---

### 7.4 `POST /api/log-affiliate-click`

Fired on every affiliate link click across the site.

**Request payload:**
```typescript
{
  tool_id?: string;          // UUID or null (null for wizard result clicks)
  article_id?: string;       // UUID or null
  site: string;              // 'site1'
  session_id: string;        // from sessionStorage
  cta_position: string;      // 'hero' | 'sidebar' | 'intro' | 'pros-cons' | 'verdict' | 'tool-card' | 'wizard_result' | 'pricing_calculator'
  cta_variant: string;       // 'A' | 'B' | 'wizard' | 'calculator'
  referrer?: string;
}
```

**Actions:**
1. Validate webhook secret (or accept from client-side without secret — see note)
2. Insert record into `affiliate_clicks`

**Note on security:** This endpoint is called client-side from the browser on every affiliate link click. It does NOT require the `X-Webhook-Secret` header (since it's client-initiated). Instead, validate that the `site` field matches an expected value and apply Supabase rate limiting via RLS.

**Response:** `200 { success: true }`

---

### 7.5 `POST /api/update-tool`

Triggered by the n8n Tool Data Refresh agent when pricing changes are detected.

**Request payload:**
```typescript
{
  tool_id: string;           // UUID
  pricing_tiers?: object;    // updated pricing_tiers JSONB
  starting_price_mo?: number;
  has_free_plan?: boolean;
  status?: string;           // 'active' | 'needs_review' | 'inactive'
  price_changed_flag?: boolean;
  last_price_update?: string; // ISO datetime
}
```

**Actions:**
1. Validate `X-Webhook-Secret`
2. Update the `tools` record with the provided fields
3. Set `updated_at = now()`
4. Trigger ISR revalidation of `/reviews/[tool.slug]`
5. If `price_changed_flag = true`: send Slack notification (if `SLACK_WEBHOOK_URL` env var present)

**Response:** `200 { success: true, tool_id: string }`

---

### 7.6 `POST /api/add-cross-link`

Triggered by Agent 3 (Interlink Architect) to add internal and cross-site links.

**Request payload:**
```typescript
{
  source_article_id: string;   // UUID
  target_article_id?: string;  // UUID (null for cross-site links)
  target_url: string;
  anchor_text: string;
  link_type: 'internal' | 'cross_site' | 'affiliate';
  site_source: string;
  site_target: string;
}
```

**Actions:**
1. Validate `X-Webhook-Secret`
2. Insert into `link_map`
3. Increment `articles.internal_links_count` on the source article

**Response:** `200 { success: true }`

---

### 7.7 `GET /api/keyword-queue`

Called by the n8n content pipeline to fetch the next keyword to write about.

**Query params:**
- `site`: (optional, default 'site1')
- `count`: (optional, default 1, max 10)
- `intent`: (optional filter: 'informational' | 'commercial' | 'transactional')

**Actions:**
1. Validate `X-Webhook-Secret` header (yes, even GET requests from n8n include the secret)
2. Query `keyword_queue` where `status = 'pending'` and `site = [site]` + optional intent filter
3. Order by `priority_score desc`
4. Return the top `count` keywords
5. Update returned keywords to `status = 'in_progress'`

**Response:**
```typescript
{
  keywords: Array<{
    id: string;
    keyword: string;
    volume: number;
    kd: number;
    intent: string;
    priority_score: number;
  }>
}
```

---

## 8. GA4 EVENT TRACKING

Fire these GA4 custom events throughout the site using `gtag('event', ...)`. The `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var must be loaded in the root layout.

```javascript
// On every affiliate link click:
gtag('event', 'affiliate_click', {
  tool_name: string,
  cta_position: string,
  cta_variant: string,
  page_location: window.location.href
});

// On newsletter signup form submission (before API call):
gtag('event', 'newsletter_signup', {
  source: string,
  site: 'site1'
});

// On newsletter confirmation (on /confirm success):
gtag('event', 'newsletter_confirmed', { site: 'site1' });

// On tool card view (Intersection Observer, fires once per tool per page load):
gtag('event', 'tool_impression', {
  tool_name: string,
  position: number,  // 1-indexed position in list
  list_type: string  // 'homepage_grid' | 'category_page' | 'search_results'
});

// On comparison tab view (fires when user reaches comparison page):
gtag('event', 'comparison_view', {
  tool_a: string,
  tool_b: string
});

// On wizard result view:
gtag('event', 'wizard_completion', {
  top_recommendation: string
});

// On should-i-switch result:
gtag('event', 'switch_analysis', {
  current_tool: string,
  verdict: string  // 'switch' | 'stay' | 'evaluate'
});
```

---

## 9. PERFORMANCE TARGETS

Build to achieve these Core Web Vitals targets. Architectural decisions should be made with these targets in mind.

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| First load JS bundle | < 150kB gzipped |
| Lighthouse Performance score | ≥ 90 (desktop), ≥ 80 (mobile) |
| TTFB (Time to First Byte) | < 400ms (Vercel Edge) |

**Implementation requirements to hit these targets:**
- All images: use Next.js `<Image>` with `width`, `height`, and `loading="lazy"` on below-fold images. `priority={true}` only on above-fold hero images.
- Tool logos: serve from Supabase Storage with explicit width/height. Max 80x80px rendered.
- No layout shift on fonts: use `font-display: swap` on all Google Font imports. Preconnect to `fonts.gstatic.com`.
- No layout shift on ratings: pre-render star ratings server-side. Never render client-only.
- Defer all analytics scripts: load GA4 with `strategy="afterInteractive"` via `next/script`.
- Interactive tools (Section 5): use dynamic import with `loading` fallback component. Do not block page render.
- Article content: stream via React Suspense where content is loaded async.
- Admin dashboard: all admin routes must use `dynamic(() => import(...), { ssr: false })` for heavy chart components.

---

## 10. ADDITIONAL REQUIREMENTS

### Affiliate Disclosure
A disclosure statement must appear:
- At the top of every review page, above the hero: small yellow/amber callout: "This review contains affiliate links. If you click through and purchase, we may earn a commission at no extra cost to you. This does not affect our ratings."
- In the footer globally (already specified)
- On the `/about` page

### "Last Verified" Timestamps
Every review page must display the `last_verified_at` date prominently near the page title in the format "Last verified: Month DD, YYYY". If `last_verified_at` is older than 30 days, show an amber warning: "Pricing and features may have changed. We're reviewing this article."

### Breadcrumbs
All content pages must have `<nav aria-label="breadcrumb">` with structured BreadcrumbList JSON-LD.

### Pagination
Category pages, search results, and best-of lists: paginate at 24 items per page. Use URL params (`?page=2`). Render page links as `<a>` tags (not JS-only navigation) for SEO.

### 404 Page
Custom 404: "We couldn't find that page. Try searching for what you need." + search bar + 6 popular review links.

### Error Handling
All API routes: return `{ error: string, code: string }` on failure. Log errors to Supabase `error_log` table (create this table: `id uuid, route text, error text, payload jsonb, created_at timestamptz`). Never expose stack traces in production responses.

### Mobile Responsiveness
All pages must be fully functional on 375px viewport width. Sticky sidebar on review pages collapses to a bottom-fixed CTA bar on mobile (shows tool name + "Try Free →" button).

### Accessibility
- All images: `alt` text required (use tool name + " screenshot" or " logo" as fallback)
- All form inputs: associated `<label>` elements
- Color contrast: all text must meet WCAG AA (4.5:1 for body text, 3:1 for large text)
- Skip-to-content link at top of every page
- Tab navigation must be fully keyboard-accessible across all interactive tools

### Cookie / GDPR
Implement a minimal cookie consent banner (bottom of page, dismissable, remembers choice in localStorage):
- Text: "We use cookies for analytics. See our Privacy Policy."
- "Accept" and "Decline" buttons
- If declined: do not load GA4

---

## 11. FILE STRUCTURE

Scaffold the project with this directory structure:

```
app/
  (site)/
    page.tsx                    # Homepage
    search/page.tsx
    reviews/[slug]/page.tsx
    compare/page.tsx
    compare/[slugs]/page.tsx    # [tool-a]-vs-[tool-b] pattern
    category/[slug]/page.tsx
    categories/page.tsx
    best/[slug]/page.tsx
    tools/
      platform-wizard/page.tsx
      pricing-calculator/page.tsx
      feature-matrix/page.tsx
      should-i-switch/page.tsx
    submit/page.tsx
    advertise/page.tsx
    newsletter/page.tsx
    newsletter/[id]/page.tsx
    about/page.tsx
    confirm/page.tsx
  admin/
    login/page.tsx
    page.tsx                    # Overview dashboard
    tools/page.tsx
    articles/page.tsx
    comparisons/page.tsx
    submissions/page.tsx
    sponsored/page.tsx
    affiliates/page.tsx
    subscribers/page.tsx
    newsletter/page.tsx
    keywords/page.tsx
    settings/page.tsx
  api/
    publish-article/route.ts
    add-subscriber/route.ts
    log-affiliate-click/route.ts
    update-tool/route.ts
    add-cross-link/route.ts
    keyword-queue/route.ts
    should-i-switch/route.ts
    og/route.tsx                # Dynamic OG image generation
  confirm/page.tsx
  sitemap.ts
  robots.ts
  layout.tsx                    # Root layout with fonts, GA4, cookie banner
  not-found.tsx

components/
  ui/                           # shadcn/ui base components
  layout/
    Header.tsx
    Footer.tsx
    Breadcrumb.tsx
    AdminSidebar.tsx
  tools/
    ToolCard.tsx                # Reusable tool card (used in grid, search, etc.)
    ArticleCard.tsx
    StarRating.tsx
    AffiliateCTA.tsx            # Sticky sidebar CTA
    SponsoredBadge.tsx
  pages/
    ReviewTabs.tsx
    FeatureMatrix.tsx           # Comparison table component
    PricingTable.tsx
  interactive/
    PlatformComparisonWizard.tsx
    PricingCalculator.tsx
    FeatureMatrixBuilder.tsx
    ShouldISwitchTool.tsx
  seo/
    JsonLD.tsx                  # JSON-LD injection component
    OpenGraph.tsx
  forms/
    NewsletterSignup.tsx
    SearchBar.tsx
    SubmitToolForm.tsx

lib/
  supabase/
    client.ts                   # Browser client
    server.ts                   # Server client (service role)
  utils.ts
  seo.ts                        # generateMetadata helpers
  indexnow.ts                   # IndexNow ping function
  analytics.ts                  # gtag event helpers
  webhook.ts                    # validateWebhookSecret middleware

types/
  database.ts                   # Generated Supabase types
  tools.ts
  articles.ts
```

---

## 12. SEED DATA

After creating the schema, insert seed data for at least these 10 tools so the site renders correctly from day one:

```sql
insert into tools (slug, name, tagline, category, pricing_model, starting_price_mo, has_free_plan, rating_overall, rating_ease, rating_features, rating_pricing, rating_support, review_count, is_featured, affiliate_url, website_url, pricing_tiers) values
('webflow', 'Webflow', 'The professional visual web platform', 'website-builders', 'freemium', 14, true, 4.4, 3.8, 4.8, 4.0, 4.2, 1247, true,
 'https://webflow.com?via=nocodereviews', 'https://webflow.com',
 '[{"name":"Free","price_mo":0,"price_yr":0,"limits":{"pages":2,"bandwidth":"1GB","cms_items":50}},{"name":"Basic","price_mo":14,"price_yr":12,"limits":{"pages":150,"bandwidth":"50GB","cms_items":0}},{"name":"CMS","price_mo":23,"price_yr":19,"limits":{"pages":150,"bandwidth":"200GB","cms_items":2000}},{"name":"Business","price_mo":39,"price_yr":32,"limits":{"pages":300,"bandwidth":"400GB","cms_items":10000}}]'),

('framer', 'Framer', 'Design and publish websites with AI', 'website-builders', 'freemium', 5, true, 4.3, 4.2, 4.5, 4.4, 3.8, 892, true,
 'https://framer.com?via=nocodereviews', 'https://framer.com',
 '[{"name":"Free","price_mo":0,"price_yr":0,"limits":{"sites":1,"bandwidth":"1GB"}},{"name":"Mini","price_mo":5,"price_yr":4,"limits":{"sites":1,"bandwidth":"1GB","domain":true}},{"name":"Basic","price_mo":15,"price_yr":12,"limits":{"sites":100,"bandwidth":"100GB","domain":true}},{"name":"Pro","price_mo":30,"price_yr":24,"limits":{"sites":"unlimited","bandwidth":"200GB","domain":true}}]'),

('bubble', 'Bubble', 'Build production-ready apps without code', 'app-builders', 'freemium', 29, true, 4.1, 3.2, 4.9, 3.6, 3.9, 2134, true,
 'https://bubble.io?via=nocodereviews', 'https://bubble.io',
 '[{"name":"Free","price_mo":0,"price_yr":0,"limits":{"api_calls":200,"storage":"1GB"}},{"name":"Starter","price_mo":29,"price_yr":25,"limits":{"api_calls":5000,"storage":"10GB"}},{"name":"Growth","price_mo":119,"price_yr":99,"limits":{"api_calls":25000,"storage":"20GB"}},{"name":"Team","price_mo":349,"price_yr":299,"limits":{"api_calls":"unlimited","storage":"50GB"}}]'),

('glide', 'Glide', 'Turn spreadsheets into apps in minutes', 'app-builders', 'freemium', 49, true, 4.0, 4.6, 3.8, 3.9, 4.1, 678, false,
 'https://glide.page?via=nocodereviews', 'https://glide.page',
 '[{"name":"Free","price_mo":0,"price_yr":0,"limits":{"rows":500,"editors":1}},{"name":"Maker","price_mo":49,"price_yr":40,"limits":{"rows":25000,"editors":5}},{"name":"Team","price_mo":99,"price_yr":80,"limits":{"rows":500000,"editors":20}}]'),

('adalo', 'Adalo', 'Build native mobile and web apps without code', 'app-builders', 'freemium', 36, true, 3.8, 4.0, 3.9, 3.8, 3.7, 445, false,
 'https://adalo.com?via=nocodereviews', 'https://adalo.com',
 '[{"name":"Free","price_mo":0,"price_yr":0,"limits":{"apps":1,"records":200}},{"name":"Starter","price_mo":36,"price_yr":29,"limits":{"apps":1,"records":1000}},{"name":"Professional","price_mo":52,"price_yr":44,"limits":{"apps":5,"records":5000}}]'),

('squarespace', 'Squarespace', 'All-in-one website builder for creatives', 'website-builders', 'paid', 16, false, 4.2, 4.5, 3.9, 4.1, 4.3, 1893, false,
 'https://squarespace.com?via=nocodereviews', 'https://squarespace.com',
 '[{"name":"Personal","price_mo":16,"price_yr":13,"limits":{"pages":"unlimited","bandwidth":"unlimited"}},{"name":"Business","price_mo":23,"price_yr":18,"limits":{"pages":"unlimited","ecommerce":true}},{"name":"Commerce Basic","price_mo":27,"price_yr":22,"limits":{"pages":"unlimited","ecommerce":true,"abandoned_cart":true}}]'),

('wix', 'Wix', 'Create a website you are proud of', 'website-builders', 'freemium', 16, true, 3.9, 4.7, 3.7, 3.8, 3.9, 2567, false,
 'https://wix.com?via=nocodereviews', 'https://wix.com',
 '[{"name":"Free","price_mo":0,"price_yr":0,"limits":{"bandwidth":"500MB","storage":"500MB"}},{"name":"Light","price_mo":16,"price_yr":13,"limits":{"bandwidth":"2GB","storage":"2GB"}},{"name":"Core","price_mo":27,"price_yr":22,"limits":{"bandwidth":"unlimited","storage":"50GB"}}]'),

('notion', 'Notion', 'The all-in-one workspace', 'databases', 'freemium', 10, true, 4.3, 4.4, 4.3, 4.5, 3.6, 3456, false,
 'https://notion.so?via=nocodereviews', 'https://notion.so',
 '[{"name":"Free","price_mo":0,"price_yr":0,"limits":{"blocks":"unlimited","file_uploads":"5MB"}},{"name":"Plus","price_mo":10,"price_yr":8,"limits":{"blocks":"unlimited","file_uploads":"unlimited"}},{"name":"Business","price_mo":18,"price_yr":15,"limits":{"blocks":"unlimited","saml":true}}]'),

('airtable', 'Airtable', 'The platform to build next-gen apps', 'databases', 'freemium', 20, true, 4.2, 4.3, 4.4, 3.9, 4.0, 1678, false,
 'https://airtable.com?via=nocodereviews', 'https://airtable.com',
 '[{"name":"Free","price_mo":0,"price_yr":0,"limits":{"records":1000,"attachments":"1GB"}},{"name":"Team","price_mo":20,"price_yr":18,"limits":{"records":50000,"attachments":"25GB"}},{"name":"Business","price_mo":45,"price_yr":40,"limits":{"records":125000,"attachments":"100GB"}}]'),

('zapier', 'Zapier', 'Automate your work across 5000+ apps', 'automation', 'freemium', 19.99, true, 4.1, 4.5, 4.0, 3.7, 3.8, 2890, false,
 'https://zapier.com?via=nocodereviews', 'https://zapier.com',
 '[{"name":"Free","price_mo":0,"price_yr":0,"limits":{"zaps":5,"tasks":100}},{"name":"Starter","price_mo":19.99,"price_yr":16.99,"limits":{"zaps":20,"tasks":750}},{"name":"Professional","price_mo":49,"price_yr":40,"limits":{"zaps":"unlimited","tasks":2000}}]');
```

---

## 13. BUILD CHECKLIST

When the build is complete, verify every item on this checklist is working:

- [ ] Homepage renders with tool grid, search, category links, newsletter form
- [ ] Search returns live results from Supabase
- [ ] `/reviews/webflow` renders with all 6 tabs, sticky sidebar, affiliate CTAs
- [ ] `/compare/webflow-vs-framer` renders feature matrix
- [ ] `/category/website-builders` renders tool grid
- [ ] Platform Comparison Wizard completes a full 10-question flow and shows results
- [ ] Pricing Calculator produces a ranked output table
- [ ] Feature Matrix Builder renders comparison table for 2 selected tools
- [ ] Should I Switch submits to AI and renders a verdict
- [ ] Newsletter signup form POSTs to `/api/add-subscriber` and shows success state
- [ ] `/submit` form saves to `tool_submissions` table
- [ ] All 7 API endpoints respond correctly (test with sample payloads)
- [ ] JSON-LD schemas render in page source on review pages
- [ ] Sitemap at `/sitemap.xml` lists tools and articles
- [ ] `/admin` redirects to `/admin/login` if unauthenticated
- [ ] Admin tools table renders seeded data
- [ ] Admin sponsored page shows empty state (no active slots)
- [ ] OG images generate at `/api/og?slug=webflow`
- [ ] GA4 script loads on production (after consent)
- [ ] Mobile layout at 375px: no horizontal overflow, sticky bottom CTA on review pages
- [ ] IndexNow key file served at `/[key].txt`
- [ ] `robots.txt` disallows `/admin/` and `/api/`

---

**END OF BUILD PROMPT**

Build the complete site as specified above. Do not omit any section. Do not ask clarifying questions. Make sensible defaults for any edge cases not covered. The site should be deployable to Vercel as a production application at the end of the agent session.
