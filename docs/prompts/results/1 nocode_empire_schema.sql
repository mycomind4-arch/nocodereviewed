-- =============================================================================
-- NO-CODE EMPIRE — COMPLETE SUPABASE SCHEMA
-- Version 1.0 | Paste into Supabase SQL Editor and run in one shot.
-- Run order: extensions → enums → core tables → junction tables →
--            agent tables → indexes → RLS policies → helper functions
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";     -- gen_random_uuid()
create extension if not exists "pg_trgm";      -- trigram search on article titles
create extension if not exists "unaccent";     -- normalised text search


-- ---------------------------------------------------------------------------
-- 1. ENUMS
-- ---------------------------------------------------------------------------

create type site_id as enum (
  'site_1','site_2','site_3','site_4','site_5',
  'site_6','site_7','site_8','site_9','site_10'
);

create type article_type as enum (
  'review','comparison','tutorial','best_of','news','landing'
);

create type article_status as enum (
  'draft','quality_check','scheduled','published','archived'
);

create type keyword_intent as enum (
  'informational','navigational','commercial','transactional'
);

create type keyword_status as enum (
  'pending','in_progress','published','rejected'
);

create type affiliate_network as enum (
  'direct','shareasale','impact','partnerstack','cj_affiliate','berush','other'
);

create type affiliate_app_status as enum (
  'not_applied','applied','approved','rejected','waitlisted'
);

create type commission_type as enum (
  'flat_fee','percentage','recurring_percentage'
);

create type sponsored_slot_status as enum (
  'available','active','expired','reserved'
);

create type slot_position as enum (
  'homepage_featured','category_sponsor','sidebar','in_article','newsletter'
);

create type subscriber_goal as enum (
  'website','app','ecommerce','income','automation','learning'
);

create type subscriber_source as enum (
  'organic','quiz','lead_magnet','tool','newsletter_swap','sponsored'
);

create type distribution_channel as enum (
  'reddit','indexnow','twitter','linkedin','email_blast'
);

create type tool_status as enum (
  'active','deprecated','acquired','shutdown','needs_review'
);

create type ab_event_type as enum ('view','click','conversion');


-- ---------------------------------------------------------------------------
-- 2. CORE TABLES
-- ---------------------------------------------------------------------------

-- 2a. SITES ---------------------------------------------------------------
-- Lightweight registry so every table can FK to a site_id enum while still
-- storing human-readable metadata.

create table if not exists sites (
  id              site_id       primary key,
  name            text          not null,
  domain          text          unique,
  platform        text,                        -- 'Webflow', 'Astro', 'Lovable', 'Framer'
  anchor_affiliate text,
  ga4_property_id text,
  gsc_property_url text,
  launched_at     date,
  created_at      timestamptz   not null default now()
);

comment on table sites is '10-site network registry.';

insert into sites (id, name, platform, anchor_affiliate) values
  ('site_1',  'No-Code Platform Reviews',          'Webflow',         'Webflow 50%'),
  ('site_2',  'No-Code Automation & Workflows',    'Webflow/Astro',   'Make 20%'),
  ('site_3',  'No-Code Database & Backend',        'Lovable→Vercel',  'Supabase 20%'),
  ('site_4',  'No-Code for Ecommerce',             'Webflow',         'Shopify $150'),
  ('site_5',  'No-Code AI Integration',            'Lovable→Vercel',  'ElevenLabs 22%'),
  ('site_6',  'No-Code for Agencies',              'Webflow',         'Webflow 50%'),
  ('site_7',  'No-Code Analytics & SEO',           'Astro→Vercel',    'SEMrush $200'),
  ('site_8',  'No-Code for SaaS Founders',         'Lovable→Vercel',  'Bubble 30%'),
  ('site_9',  'No-Code Design & UI',               'Framer',          'Framer 20%'),
  ('site_10', 'No-Code for Solopreneurs',          'Webflow',         'Webflow 50%')
on conflict (id) do nothing;


-- 2b. TOOLS ---------------------------------------------------------------
create table if not exists tools (
  id                  uuid          primary key default gen_random_uuid(),
  slug                text          not null unique,           -- 'webflow', 'bubble'
  name                text          not null,
  tagline             text,
  website_url         text,
  pricing_page_url    text,
  logo_url            text,
  category            text,                                    -- 'site-builder', 'database', etc.
  subcategory         text,
  status              tool_status   not null default 'active',

  -- Ratings (0.0–5.0)
  rating_ease_of_use  numeric(3,1)  check (rating_ease_of_use between 0 and 5),
  rating_features     numeric(3,1)  check (rating_features between 0 and 5),
  rating_pricing      numeric(3,1)  check (rating_pricing between 0 and 5),
  rating_support      numeric(3,1)  check (rating_support between 0 and 5),
  rating_overall      numeric(3,1)  check (rating_overall between 0 and 5),

  -- Pricing snapshot (kept in sync by Tool Data Refresh agent)
  has_free_plan       boolean       not null default false,
  pricing_tiers       jsonb,        -- [{name, monthly_usd, annual_usd, limits:{...}}]
  last_price_update   timestamptz,
  pricing_verified_at timestamptz,
  price_changed_flag  boolean       not null default false,

  -- Meta
  founded_year        smallint,
  hq_location         text,
  employee_count_band text,         -- '1-10', '11-50', etc.
  funding_stage       text,
  notes               text,

  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now()
);

comment on table tools is 'Master tool registry. pricing_tiers is JSONB to handle varied tier structures.';
comment on column tools.price_changed_flag is 'Set true by refresh agent; cleared after articles are re-verified.';

create index idx_tools_category    on tools (category);
create index idx_tools_status      on tools (status);
create index idx_tools_rating      on tools (rating_overall desc nulls last);
create index idx_tools_price_flag  on tools (price_changed_flag) where price_changed_flag = true;


-- 2c. ARTICLES ------------------------------------------------------------
create table if not exists articles (
  id                  uuid          primary key default gen_random_uuid(),
  site_id             site_id       not null references sites (id) on delete restrict,
  slug                text          not null,
  title               text          not null,
  meta_description    text,
  article_type        article_type  not null,
  status              article_status not null default 'draft',

  -- Content
  word_count          integer,
  flesch_kincaid_score numeric(5,1),
  banned_phrase_hits  smallint      default 0,
  paa_questions_count smallint      default 0,
  internal_link_count smallint      default 0,

  -- SEO
  target_keyword      text,
  keyword_intent      keyword_intent,
  serp_position       smallint,                 -- last known position
  serp_position_at    timestamptz,

  -- Affiliate
  primary_tool_id     uuid          references tools (id) on delete set null,
  affiliate_link_present boolean    not null default false,

  -- Quality gate flags
  last_verified_at    timestamptz,              -- timestamp shown to readers
  factual_check_at    timestamptz,              -- second Gemini call timestamp
  competitor_word_count integer,
  feature_coverage_pct numeric(5,2),           -- 0–100

  -- Timestamps
  published_at        timestamptz,
  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now(),

  unique (site_id, slug)
);

comment on table articles is 'One row per published (or in-flight) article across all 10 sites.';

create index idx_articles_site         on articles (site_id);
create index idx_articles_status       on articles (status);
create index idx_articles_type         on articles (article_type);
create index idx_articles_keyword      on articles using gin (to_tsvector('english', coalesce(target_keyword,'') || ' ' || coalesce(title,'')));
create index idx_articles_published    on articles (published_at desc) where status = 'published';
create index idx_articles_position     on articles (serp_position asc nulls last) where serp_position is not null;


-- 2d. COMPARISONS (separate from articles — structured head-to-head data) -
create table if not exists comparisons (
  id              uuid        primary key default gen_random_uuid(),
  article_id      uuid        not null unique references articles (id) on delete cascade,
  site_id         site_id     not null references sites (id) on delete restrict,
  tool_a_id       uuid        not null references tools (id) on delete cascade,
  tool_b_id       uuid        not null references tools (id) on delete cascade,
  verdict_tool_id uuid        references tools (id) on delete set null,  -- winner / recommended
  verdict_summary text,
  comparison_data jsonb,      -- structured feature matrix: [{feature, tool_a_val, tool_b_val}]
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  check (tool_a_id <> tool_b_id)
);

comment on table comparisons is 'Structured comparison data for head-to-head articles. Linked 1:1 to an article.';

create index idx_comparisons_tool_a on comparisons (tool_a_id);
create index idx_comparisons_tool_b on comparisons (tool_b_id);


-- 2e. SUBSCRIBERS ---------------------------------------------------------
create table if not exists subscribers (
  id              uuid              primary key default gen_random_uuid(),
  email           text              not null,
  site_id         site_id           not null references sites (id) on delete restrict,
  goal            subscriber_goal,
  source          subscriber_source,
  lead_magnet     text,                         -- which lead magnet triggered signup
  quiz_result     jsonb,                        -- raw quiz output (What Should I Build?, etc.)
  sequence_step   smallint          not null default 0,
  confirmed_at    timestamptz,                  -- double opt-in timestamp
  unsubscribed_at timestamptz,
  last_emailed_at timestamptz,
  created_at      timestamptz       not null default now(),

  unique (email, site_id)                       -- same person can sub to multiple sites
);

comment on table subscribers is 'Email subscribers per site. sequence_step drives n8n onboarding flow.';

create index idx_subscribers_site     on subscribers (site_id);
create index idx_subscribers_email    on subscribers (email);
create index idx_subscribers_sequence on subscribers (site_id, sequence_step) where unsubscribed_at is null;
create index idx_subscribers_active   on subscribers (site_id) where confirmed_at is not null and unsubscribed_at is null;


-- 2f. AFFILIATE_CLICKS ----------------------------------------------------
create table if not exists affiliate_clicks (
  id              uuid        primary key default gen_random_uuid(),
  article_id      uuid        references articles (id) on delete set null,
  tool_id         uuid        not null references tools (id) on delete cascade,
  site_id         site_id     not null references sites (id) on delete restrict,
  cta_position    text,                         -- 'intro','post_pros_cons','verdict','sidebar'
  variant         text,                         -- A/B variant label
  session_id      text,                         -- hashed — no PII
  referrer_url    text,
  user_agent_hash text,
  clicked_at      timestamptz not null default now()
);

comment on table affiliate_clicks is 'One row per affiliate link click. Used by Agent 5 Monetisation Optimizer.';

create index idx_aff_clicks_tool    on affiliate_clicks (tool_id);
create index idx_aff_clicks_article on affiliate_clicks (article_id);
create index idx_aff_clicks_site    on affiliate_clicks (site_id);
create index idx_aff_clicks_date    on affiliate_clicks (clicked_at desc);
-- Composite for CTR reports
create index idx_aff_clicks_report  on affiliate_clicks (site_id, tool_id, clicked_at desc);


-- 2g. SPONSORED_SLOTS -----------------------------------------------------
create table if not exists sponsored_slots (
  id              uuid                  primary key default gen_random_uuid(),
  tool_id         uuid                  references tools (id) on delete set null,
  site_id         site_id               not null references sites (id) on delete restrict,
  slot_position   slot_position         not null,
  start_date      date                  not null,
  end_date        date                  not null,
  monthly_fee_usd numeric(8,2)          not null,
  status          sponsored_slot_status not null default 'available',
  contact_email   text,
  contact_name    text,
  company_name    text,
  invoice_url     text,
  notes           text,
  created_at      timestamptz           not null default now(),
  updated_at      timestamptz           not null default now(),

  check (end_date > start_date)
);

comment on table sponsored_slots is 'Paid placements across the network. Agent 5 monitors expiry.';

create index idx_sponsored_site     on sponsored_slots (site_id);
create index idx_sponsored_status   on sponsored_slots (status);
create index idx_sponsored_expiry   on sponsored_slots (end_date) where status = 'active';


-- 2h. LINK_MAP ------------------------------------------------------------
create table if not exists link_map (
  id              uuid        primary key default gen_random_uuid(),
  from_article_id uuid        not null references articles (id) on delete cascade,
  to_article_id   uuid        not null references articles (id) on delete cascade,
  anchor_text     text,
  link_type       text        not null default 'internal'  -- 'internal','cross_site','external'
                              check (link_type in ('internal','cross_site','external')),
  created_at      timestamptz not null default now(),

  unique (from_article_id, to_article_id, anchor_text)    -- deduplicate per anchor
);

comment on table link_map is 'Every internal and cross-site link. Used by Agent 3 Interlink Architect.';

create index idx_link_map_from  on link_map (from_article_id);
create index idx_link_map_to    on link_map (to_article_id);
create index idx_link_map_type  on link_map (link_type);


-- ---------------------------------------------------------------------------
-- 3. JUNCTION TABLES
-- ---------------------------------------------------------------------------

-- article ↔ tools (many-to-many — an article can mention multiple tools)
create table if not exists article_tools (
  article_id      uuid        not null references articles (id) on delete cascade,
  tool_id         uuid        not null references tools (id) on delete cascade,
  is_primary      boolean     not null default false,
  has_affiliate   boolean     not null default false,
  affiliate_url   text,
  primary key (article_id, tool_id)
);

create index idx_article_tools_tool on article_tools (tool_id);


-- tools ↔ sites (which sites cover which tools)
create table if not exists site_tools (
  site_id         site_id     not null references sites (id) on delete cascade,
  tool_id         uuid        not null references tools (id) on delete cascade,
  priority        smallint    not null default 5,  -- 1=anchor, 10=peripheral
  primary key (site_id, tool_id)
);


-- ---------------------------------------------------------------------------
-- 4. AGENT TABLES
-- ---------------------------------------------------------------------------

-- 4a. KEYWORD_QUEUE (Agent 1 — Keyword Scout) ---------------------------
create table if not exists keyword_queue (
  id              uuid            primary key default gen_random_uuid(),
  keyword         text            not null,
  site_id         site_id         not null references sites (id) on delete restrict,
  priority_score  numeric(6,3),               -- weighted composite score
  volume          integer,
  kd              smallint,                   -- keyword difficulty 0–100
  intent          keyword_intent,
  existing_position smallint,                 -- current SERP position if ranked
  status          keyword_status  not null default 'pending',
  article_id      uuid            references articles (id) on delete set null,
  added_by        text            not null default 'agent_1',
  created_at      timestamptz     not null default now(),
  updated_at      timestamptz     not null default now(),

  unique (keyword, site_id)
);

create index idx_kw_queue_site     on keyword_queue (site_id, status);
create index idx_kw_queue_priority on keyword_queue (priority_score desc) where status = 'pending';
create index idx_kw_queue_position on keyword_queue (existing_position) where existing_position between 8 and 20;


-- 4b. RANK_HISTORY (Agent 4 — Rank Monitor) -----------------------------
create table if not exists rank_history (
  id              uuid        primary key default gen_random_uuid(),
  article_id      uuid        not null references articles (id) on delete cascade,
  site_id         site_id     not null references sites (id) on delete restrict,
  keyword         text        not null,
  position        smallint    not null,
  previous_position smallint,
  position_delta  smallint                    -- computed: previous - position (positive = gained)
                  generated always as (coalesce(previous_position, position) - position) stored,
  impressions     integer,
  clicks          integer,
  ctr             numeric(6,4),
  recorded_at     timestamptz not null default now()
);

comment on table rank_history is 'Daily snapshot from GSC. Agent 4 alerts on position_delta < -5.';

create index idx_rank_site_date    on rank_history (site_id, recorded_at desc);
create index idx_rank_article      on rank_history (article_id, recorded_at desc);
create index idx_rank_drops        on rank_history (position_delta) where position_delta < -5;


-- 4c. DISTRIBUTION_LOG (Agent 6 — Distribution Agent) -------------------
create table if not exists distribution_log (
  id              uuid                  primary key default gen_random_uuid(),
  article_id      uuid                  not null references articles (id) on delete cascade,
  site_id         site_id               not null references sites (id) on delete restrict,
  channel         distribution_channel  not null,
  target          text,                         -- subreddit name, twitter handle, etc.
  post_url        text,
  indexed_at      timestamptz,                  -- when Google confirmed indexing
  index_checked_at timestamptz,
  status          text                  not null default 'sent'
                  check (status in ('sent','indexed','failed','pending_check')),
  distributed_at  timestamptz           not null default now()
);

create index idx_dist_article     on distribution_log (article_id);
create index idx_dist_status      on distribution_log (status) where status = 'pending_check';
create index idx_dist_date        on distribution_log (distributed_at desc);


-- 4d. CTA_TESTS (Agent 5 — Monetisation Optimizer) ----------------------
create table if not exists cta_tests (
  id              uuid        primary key default gen_random_uuid(),
  article_id      uuid        not null references articles (id) on delete cascade,
  tool_id         uuid        not null references tools (id) on delete cascade,
  site_id         site_id     not null references sites (id) on delete restrict,
  variant_a_copy  text        not null,
  variant_b_copy  text        not null,
  winner_variant  text                          check (winner_variant in ('A','B')),
  impressions_a   integer     not null default 0,
  impressions_b   integer     not null default 0,
  clicks_a        integer     not null default 0,
  clicks_b        integer     not null default 0,
  is_significant  boolean     not null default false,
  started_at      timestamptz not null default now(),
  concluded_at    timestamptz
);

create index idx_cta_tests_article on cta_tests (article_id);
create index idx_cta_tests_active  on cta_tests (site_id) where concluded_at is null;


-- 4e. AB_TEST_RESULTS (client-side events feeding Agent 5) ---------------
create table if not exists ab_test_results (
  id              uuid          primary key default gen_random_uuid(),
  session_id      text          not null,       -- deterministic hash, no PII
  variant         text          not null        check (variant in ('A','B')),
  tool_id         uuid          not null references tools (id) on delete cascade,
  article_id      uuid          references articles (id) on delete set null,
  site_id         site_id       not null references sites (id) on delete restrict,
  event_type      ab_event_type not null,
  occurred_at     timestamptz   not null default now()
);

create index idx_ab_results_tool    on ab_test_results (tool_id, variant);
create index idx_ab_results_article on ab_test_results (article_id);
create index idx_ab_results_date    on ab_test_results (occurred_at desc);


-- 4f. AFFILIATE_PROGRAMS (Ops tracker — 25+ programs) -------------------
create table if not exists affiliate_programs (
  id                  uuid                  primary key default gen_random_uuid(),
  program_name        text                  not null,
  company             text                  not null,
  tool_id             uuid                  references tools (id) on delete set null,
  network             affiliate_network     not null,
  application_url     text,
  commission_type     commission_type       not null,
  commission_value    numeric(8,2),         -- USD for flat_fee; percent for others
  payment_threshold   numeric(8,2),
  payment_schedule    text,                 -- 'monthly', 'net-30', etc.
  cookie_days         smallint,
  status              affiliate_app_status  not null default 'not_applied',
  applied_at          date,
  approved_at         date,
  notes               text,
  created_at          timestamptz           not null default now(),
  updated_at          timestamptz           not null default now()
);

create index idx_aff_programs_status  on affiliate_programs (status);
create index idx_aff_programs_network on affiliate_programs (network);
-- Surfaces stale applications (>30 days)
create index idx_aff_programs_stale   on affiliate_programs (applied_at)
  where status = 'applied';


-- affiliate_programs ↔ sites (which programs apply to which sites)
create table if not exists affiliate_program_sites (
  program_id  uuid      not null references affiliate_programs (id) on delete cascade,
  site_id     site_id   not null references sites (id) on delete cascade,
  primary key (program_id, site_id)
);


-- 4g. CONTENT_CALENDAR (Agent 1 writes; publishing pipeline reads) -------
create table if not exists content_calendar (
  id              uuid            primary key default gen_random_uuid(),
  site_id         site_id         not null references sites (id) on delete restrict,
  article_id      uuid            references articles (id) on delete set null,
  keyword_id      uuid            references keyword_queue (id) on delete set null,
  title           text            not null,
  target_keyword  text,
  content_type    article_type    not null,
  target_word_count integer,
  primary_affiliate text,
  scheduled_date  date,
  publish_order   integer,        -- within-site sequence for pillar-before-detail ordering
  status          text            not null default 'planned'
                  check (status in ('planned','briefed','generating','review','scheduled','published')),
  created_at      timestamptz     not null default now(),
  updated_at      timestamptz     not null default now()
);

create index idx_cal_site_date    on content_calendar (site_id, scheduled_date);
create index idx_cal_status       on content_calendar (status);


-- 4h. MONETISATION_REPORTS (Agent 5 monthly output) ---------------------
create table if not exists monetisation_reports (
  id                      uuid        primary key default gen_random_uuid(),
  site_id                 site_id     not null references sites (id) on delete restrict,
  report_month            date        not null,   -- first day of the month
  total_affiliate_clicks  integer     not null default 0,
  estimated_revenue_usd   numeric(10,2),
  top_articles            jsonb,      -- [{article_id, title, revenue_est, clicks}]
  underperforming_articles jsonb,     -- [{article_id, views, ctr}]
  recommended_actions     jsonb,      -- [{action, priority, reason}]
  created_at              timestamptz not null default now(),

  unique (site_id, report_month)
);

create index idx_mon_reports_site on monetisation_reports (site_id, report_month desc);


-- 4i. TOOL_REFRESH_LOG (Tool Data Refresh system) -----------------------
create table if not exists tool_refresh_log (
  id              uuid        primary key default gen_random_uuid(),
  tool_id         uuid        not null references tools (id) on delete cascade,
  checked_at      timestamptz not null default now(),
  price_changed   boolean     not null default false,
  old_pricing     jsonb,
  new_pricing     jsonb,
  http_status     smallint,   -- 404 triggers needs_review
  error_message   text
);

create index idx_refresh_tool   on tool_refresh_log (tool_id, checked_at desc);
create index idx_refresh_errors on tool_refresh_log (http_status) where http_status <> 200;


-- ---------------------------------------------------------------------------
-- 5. ADDITIONAL UTILITY TABLES (referenced across agents and microtools)
-- ---------------------------------------------------------------------------

-- 5a. SIMILARITY_AUDIT (monthly cross-site voice check) -----------------
create table if not exists similarity_audits (
  id              uuid        primary key default gen_random_uuid(),
  site_a          site_id     not null references sites (id),
  site_b          site_id     not null references sites (id),
  cosine_score    numeric(6,4) not null check (cosine_score between 0 and 1),
  sample_size     smallint    not null,    -- number of articles compared
  flagged         boolean     generated always as (cosine_score > 0.6) stored,
  audited_at      timestamptz not null default now(),

  check (site_a < site_b)   -- prevent (A,B) and (B,A) duplicates
);

create index idx_similarity_flagged on similarity_audits (flagged) where flagged = true;


-- 5b. REVENUE_TRACKING (P&L — exit documentation) -----------------------
create table if not exists revenue_tracking (
  id                          uuid        primary key default gen_random_uuid(),
  site_id                     site_id     not null references sites (id),
  month                       date        not null,   -- first of month
  affiliate_revenue_usd       numeric(10,2) not null default 0,
  sponsored_revenue_usd       numeric(10,2) not null default 0,
  display_ad_revenue_usd      numeric(10,2) not null default 0,
  research_report_revenue_usd numeric(10,2) not null default 0,
  newsletter_sponsor_usd      numeric(10,2) not null default 0,
  total_revenue_usd           numeric(10,2)
    generated always as (
      affiliate_revenue_usd + sponsored_revenue_usd + display_ad_revenue_usd +
      research_report_revenue_usd + newsletter_sponsor_usd
    ) stored,
  hosting_cost_usd            numeric(10,2) not null default 0,
  tool_cost_usd               numeric(10,2) not null default 0,
  net_profit_usd              numeric(10,2)
    generated always as (
      affiliate_revenue_usd + sponsored_revenue_usd + display_ad_revenue_usd +
      research_report_revenue_usd + newsletter_sponsor_usd -
      hosting_cost_usd - tool_cost_usd
    ) stored,
  monthly_visitors            integer,
  notes                       text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),

  unique (site_id, month)
);

create index idx_revenue_site_month on revenue_tracking (site_id, month desc);


-- ---------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------------
-- Policy model:
--   • Public (anon) role: read-only on safe tables.
--   • Authenticated (service_role key from your agents / admin UI): full access.
--   • The affiliate_clicks, ab_test_results, subscribers tables allow
--     anon INSERT so client-side JS can write events without exposing the
--     service key.  All other write operations require service_role.
-- ---------------------------------------------------------------------------

alter table sites               enable row level security;
alter table tools               enable row level security;
alter table articles            enable row level security;
alter table comparisons         enable row level security;
alter table subscribers         enable row level security;
alter table affiliate_clicks    enable row level security;
alter table sponsored_slots     enable row level security;
alter table link_map            enable row level security;
alter table article_tools       enable row level security;
alter table site_tools          enable row level security;
alter table keyword_queue       enable row level security;
alter table rank_history        enable row level security;
alter table distribution_log    enable row level security;
alter table cta_tests           enable row level security;
alter table ab_test_results     enable row level security;
alter table affiliate_programs  enable row level security;
alter table affiliate_program_sites enable row level security;
alter table content_calendar    enable row level security;
alter table monetisation_reports enable row level security;
alter table tool_refresh_log    enable row level security;
alter table similarity_audits   enable row level security;
alter table revenue_tracking    enable row level security;

-- ── Public READ on non-sensitive tables ─────────────────────────────────────

create policy "public_read_sites"    on sites    for select using (true);
create policy "public_read_tools"    on tools    for select using (status = 'active');
create policy "public_read_articles" on articles for select using (status = 'published');
create policy "public_read_comparisons" on comparisons for select using (true);
create policy "public_read_article_tools" on article_tools for select using (true);
create policy "public_read_sponsored" on sponsored_slots for select using (status = 'active');

-- ── Anonymous INSERT (client-side event logging) ─────────────────────────────

create policy "anon_insert_clicks"  on affiliate_clicks for insert with check (true);
create policy "anon_insert_ab"      on ab_test_results  for insert with check (true);

-- Subscribers: anon can insert (signup form), but CANNOT read other rows.
create policy "anon_insert_subscribers" on subscribers for insert with check (true);

-- ── Service role gets full access on everything ───────────────────────────────
-- (Supabase service_role bypasses RLS by default — these explicit policies
--  are added for clarity and for any tools that set row_security = on.)

do $$
declare
  t text;
  tables text[] := array[
    'sites','tools','articles','comparisons','subscribers',
    'affiliate_clicks','sponsored_slots','link_map',
    'article_tools','site_tools','keyword_queue','rank_history',
    'distribution_log','cta_tests','ab_test_results',
    'affiliate_programs','affiliate_program_sites','content_calendar',
    'monetisation_reports','tool_refresh_log','similarity_audits',
    'revenue_tracking'
  ];
begin
  foreach t in array tables loop
    execute format(
      'create policy "service_role_all_%s" on %I
         using (auth.role() = ''service_role'')
         with check (auth.role() = ''service_role'');',
      t, t
    );
  end loop;
end $$;


-- ---------------------------------------------------------------------------
-- 7. HELPER FUNCTIONS & TRIGGERS
-- ---------------------------------------------------------------------------

-- Auto-update updated_at on any table that has the column.
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Apply the trigger to every table that has updated_at.
do $$
declare
  t text;
  tables_with_updated_at text[] := array[
    'tools','articles','comparisons','keyword_queue',
    'sponsored_slots','cta_tests','affiliate_programs',
    'content_calendar','monetisation_reports','revenue_tracking'
  ];
begin
  foreach t in array tables_with_updated_at loop
    execute format(
      'create trigger trg_set_updated_at_%s
         before update on %I
         for each row execute function set_updated_at();',
      t, t
    );
  end loop;
end $$;


-- Convenience view: articles needing re-verification after a price change.
create or replace view articles_needing_reverification as
select
  a.id,
  a.site_id,
  a.slug,
  a.title,
  a.last_verified_at,
  t.name  as tool_name,
  t.slug  as tool_slug
from articles a
join article_tools at2 on at2.article_id = a.id
join tools t           on t.id = at2.tool_id
where t.price_changed_flag = true
  and a.status = 'published'
order by a.site_id, a.published_at desc;

comment on view articles_needing_reverification is
  'Fed to the Tool Data Refresh n8n workflow. Clear price_changed_flag on tools after re-verification.';


-- Convenience view: rank drops > 5 positions in the last 7 days.
create or replace view rank_drops_alert as
select
  rh.article_id,
  a.title,
  a.site_id,
  rh.keyword,
  rh.position,
  rh.previous_position,
  rh.position_delta,
  rh.recorded_at
from rank_history rh
join articles a on a.id = rh.article_id
where rh.position_delta < -5
  and rh.recorded_at > now() - interval '7 days'
order by rh.position_delta asc;

comment on view rank_drops_alert is 'Agent 4 Rank Monitor reads this view for Slack alerts.';


-- Convenience view: affiliate program dashboard (Ops tracker).
create or replace view affiliate_program_dashboard as
select
  ap.id,
  ap.program_name,
  ap.company,
  ap.network,
  ap.commission_type,
  ap.commission_value,
  ap.status,
  ap.applied_at,
  ap.approved_at,
  (current_date - ap.applied_at)::int          as days_since_applied,
  (current_date - ap.applied_at) > 30          as needs_followup,
  ap.notes
from affiliate_programs ap
order by
  case ap.status
    when 'not_applied' then 1
    when 'applied'     then 2
    when 'approved'    then 3
    when 'waitlisted'  then 4
    when 'rejected'    then 5
  end,
  ap.applied_at desc nulls last;

comment on view affiliate_program_dashboard is
  'Powers the /admin/affiliates UI. needs_followup turns red at 30+ days.';


-- ---------------------------------------------------------------------------
-- 8. SEED: affiliate programs (25 programs from the spec)
-- ---------------------------------------------------------------------------
insert into affiliate_programs
  (program_name, company, network, commission_type, commission_value, payment_schedule, status)
values
  ('Webflow Affiliate',         'Webflow',       'direct',       'recurring_percentage', 50,   'monthly',  'not_applied'),
  ('Bubble Affiliate',          'Bubble',        'direct',       'recurring_percentage', 30,   'monthly',  'not_applied'),
  ('Softr Affiliate',           'Softr',         'direct',       'recurring_percentage', 30,   'monthly',  'not_applied'),
  ('Memberstack Affiliate',     'Memberstack',   'direct',       'recurring_percentage', 30,   'monthly',  'not_applied'),
  ('Pabbly Connect',            'Pabbly',        'direct',       'recurring_percentage', 30,   'monthly',  'not_applied'),
  ('Make (formerly Integromat)','Make',           'partnerstack', 'recurring_percentage', 20,   'net-30',   'not_applied'),
  ('n8n Partner',               'n8n',           'partnerstack', 'recurring_percentage', 20,   'net-30',   'not_applied'),
  ('Supabase Affiliate',        'Supabase',      'direct',       'recurring_percentage', 20,   'monthly',  'not_applied'),
  ('Xano Affiliate',            'Xano',          'direct',       'recurring_percentage', 20,   'monthly',  'not_applied'),
  ('Airtable Affiliate',        'Airtable',      'impact',       'flat_fee',             10,   'net-30',   'not_applied'),
  ('Shopify Affiliate',         'Shopify',       'impact',       'flat_fee',             150,  'net-30',   'not_applied'),
  ('BigCommerce Affiliate',     'BigCommerce',   'impact',       'flat_fee',             40,   'net-30',   'not_applied'),
  ('Sellfy Affiliate',          'Sellfy',        'partnerstack', 'recurring_percentage', 25,   'monthly',  'not_applied'),
  ('Podia Affiliate',           'Podia',         'direct',       'recurring_percentage', 30,   'monthly',  'not_applied'),
  ('Lemon Squeezy',             'Lemon Squeezy', 'direct',       'flat_fee',             50,   'monthly',  'not_applied'),
  ('ElevenLabs Affiliate',      'ElevenLabs',    'partnerstack', 'recurring_percentage', 22,   'monthly',  'not_applied'),
  ('SEMrush (Berush)',          'SEMrush',       'berush',       'flat_fee',             200,  'monthly',  'not_applied'),
  ('Mangools Affiliate',        'Mangools',      'direct',       'recurring_percentage', 30,   'monthly',  'not_applied'),
  ('Plausible Affiliate',       'Plausible',     'direct',       'recurring_percentage', 33,   'monthly',  'not_applied'),
  ('Framer Affiliate',          'Framer',        'direct',       'recurring_percentage', 20,   'monthly',  'not_applied'),
  ('Outseta Affiliate',         'Outseta',       'direct',       'recurring_percentage', 20,   'monthly',  'not_applied'),
  ('Activepieces',              'Activepieces',  'direct',       'recurring_percentage', 20,   'monthly',  'not_applied'),
  ('Lovable Affiliate',         'Lovable',       'direct',       'recurring_percentage', 20,   'monthly',  'not_applied'),
  ('Resend Affiliate',          'Resend',        'direct',       'recurring_percentage', 20,   'monthly',  'not_applied'),
  ('Zapier Affiliate',          'Zapier',        'cj_affiliate', 'flat_fee',             25,   'net-30',   'not_applied')
on conflict do nothing;


-- =============================================================================
-- SCHEMA COMPLETE
-- Tables: sites, tools, articles, comparisons, subscribers, affiliate_clicks,
--         sponsored_slots, link_map, article_tools, site_tools,
--         keyword_queue, rank_history, distribution_log, cta_tests,
--         ab_test_results, affiliate_programs, affiliate_program_sites,
--         content_calendar, monetisation_reports, tool_refresh_log,
--         similarity_audits, revenue_tracking
-- Views:  articles_needing_reverification, rank_drops_alert,
--         affiliate_program_dashboard
-- =============================================================================
