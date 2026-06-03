-- NoCodeReviewed Intelligence Vault - Supabase schema + RPC ingest function
-- Run this in Supabase SQL Editor before importing the n8n workflow.
-- Server-side automations should use the service role key only inside n8n or trusted backend code.

create extension if not exists pgcrypto;

-- =========================
-- CORE TOOL / EVIDENCE TABLES
-- =========================

create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  official_url text,
  affiliate_url text,
  status text not null default 'draft',
  quality_score numeric default 0,
  evidence_confidence numeric default 0,
  last_verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evidence_sources (
  id uuid primary key default gen_random_uuid(),
  tool_slug text not null references public.tools(slug) on update cascade on delete cascade,
  source_type text not null default 'unknown',
  source_url text,
  source_title text,
  publisher text,
  captured_at timestamptz not null default now(),
  last_checked_at timestamptz,
  source_quality_score numeric default 0,
  raw_text_excerpt text,
  source_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(tool_slug, source_url)
);

create table if not exists public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  tool_slug text not null references public.tools(slug) on update cascade on delete cascade,
  source_url text,
  evidence_type text not null default 'feature',
  extracted_claim text not null,
  raw_excerpt text,
  confidence_score numeric default 0,
  freshness_score numeric default 0,
  contradiction_status text default 'unchecked',
  public_visibility boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  tool_slug text not null references public.tools(slug) on update cascade on delete cascade,
  claim_category text not null default 'general',
  claim_text text not null,
  confidence_score numeric default 0,
  evidence_count integer default 0,
  approved_status text not null default 'needs_review',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(tool_slug, claim_text)
);

create table if not exists public.tool_scores (
  id uuid primary key default gen_random_uuid(),
  tool_slug text not null references public.tools(slug) on update cascade on delete cascade,
  dimension text not null,
  score numeric not null default 0,
  reason text,
  evidence_claims jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique(tool_slug, dimension)
);

create table if not exists public.pain_points (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  required_capabilities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tool_pain_point_matches (
  id uuid primary key default gen_random_uuid(),
  tool_slug text not null references public.tools(slug) on update cascade on delete cascade,
  pain_point_slug text not null,
  match_score numeric not null default 0,
  reason text,
  evidence_claims jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique(tool_slug, pain_point_slug)
);

-- =========================
-- AUDITS / CONTENT / MONETIZATION TABLES
-- =========================

create table if not exists public.project_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  project_name text,
  project_type text,
  source_type text,
  source_ref text,
  audit_score numeric default 0,
  launch_readiness numeric default 0,
  risks_json jsonb not null default '[]'::jsonb,
  recommendations_json jsonb not null default '[]'::jsonb,
  monetization_json jsonb not null default '[]'::jsonb,
  privacy_level text not null default 'private',
  created_at timestamptz not null default now()
);

create table if not exists public.quality_gate_results (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_slug text not null,
  score numeric not null default 0,
  status text not null default 'needs_review',
  issues_json jsonb not null default '[]'::jsonb,
  checked_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  page_type text not null,
  slug text not null unique,
  title text not null,
  status text not null default 'draft',
  content_json jsonb not null default '{}'::jsonb,
  source_data_hash text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recommendation_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null default 'tool_recommendation',
  project_audit_id uuid,
  tool_slug text references public.tools(slug) on update cascade on delete set null,
  pain_points jsonb not null default '[]'::jsonb,
  recommendation_reason text,
  monetization_channel text,
  affiliate_url text,
  disclosure_shown boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_name text not null,
  run_type text not null default 'evidence_intake',
  target_slug text,
  status text not null default 'started',
  metrics_json jsonb not null default '{}'::jsonb,
  errors_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

-- Useful indexes for scale.
create index if not exists idx_evidence_items_tool_slug on public.evidence_items(tool_slug);
create index if not exists idx_evidence_items_type on public.evidence_items(evidence_type);
create index if not exists idx_claims_tool_slug on public.claims(tool_slug);
create index if not exists idx_scores_tool_slug on public.tool_scores(tool_slug);
create index if not exists idx_content_pages_type_status on public.content_pages(page_type, status);
create index if not exists idx_quality_gate_target on public.quality_gate_results(target_type, target_slug);

-- Public, transparency-safe view. Do not expose private project audits here.
create or replace view public.public_evidence_vault as
select
  t.slug as tool_slug,
  t.name as tool_name,
  t.category,
  t.official_url,
  t.status as tool_status,
  t.quality_score,
  t.evidence_confidence,
  t.last_verified_at,
  es.source_type,
  es.source_url,
  es.source_title,
  es.publisher,
  es.captured_at as source_captured_at,
  ei.evidence_type,
  ei.extracted_claim,
  ei.raw_excerpt,
  ei.confidence_score,
  ei.freshness_score,
  ei.contradiction_status,
  ei.captured_at as evidence_captured_at
from public.tools t
join public.evidence_items ei on ei.tool_slug = t.slug
left join public.evidence_sources es on es.tool_slug = ei.tool_slug and es.source_url is not distinct from ei.source_url
where ei.public_visibility = true;

-- =========================
-- RPC INGEST FUNCTION
-- =========================

create or replace function public.ingest_evidence_bundle(bundle jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tool jsonb := coalesce(bundle->'tool', '{}'::jsonb);
  v_tool_slug text := lower(regexp_replace(coalesce(bundle->'tool'->>'slug', bundle->>'tool_slug', bundle->'tool'->>'name', 'unknown-tool'), '[^a-zA-Z0-9]+', '-', 'g'));
  v_tool_name text := coalesce(bundle->'tool'->>'name', initcap(replace(v_tool_slug, '-', ' ')));
  v_quality jsonb := coalesce(bundle->'quality_gate', '{}'::jsonb);
  v_score numeric := coalesce((v_quality->>'score')::numeric, 0);
  v_status text := coalesce(v_quality->>'status', 'needs_review');
  item jsonb;
  inserted_sources int := 0;
  inserted_evidence int := 0;
  inserted_claims int := 0;
  inserted_scores int := 0;
  inserted_pages int := 0;
  v_hash text := encode(digest(bundle::text, 'sha256'), 'hex');
begin
  if v_tool_slug is null or length(v_tool_slug) < 2 then
    raise exception 'Missing valid tool slug in bundle';
  end if;

  insert into public.tools (
    slug,
    name,
    category,
    official_url,
    affiliate_url,
    status,
    quality_score,
    evidence_confidence,
    last_verified_at,
    metadata,
    updated_at
  ) values (
    v_tool_slug,
    v_tool_name,
    v_tool->>'category',
    coalesce(v_tool->>'official_url', v_tool->>'website_url'),
    v_tool->>'affiliate_url',
    case when v_status in ('ready_for_publish','approved') then 'verified_draft' else 'needs_evidence' end,
    v_score,
    coalesce((bundle->>'evidence_confidence')::numeric, v_score),
    now(),
    coalesce(v_tool->'metadata', '{}'::jsonb),
    now()
  )
  on conflict (slug) do update set
    name = excluded.name,
    category = coalesce(excluded.category, tools.category),
    official_url = coalesce(excluded.official_url, tools.official_url),
    affiliate_url = coalesce(excluded.affiliate_url, tools.affiliate_url),
    status = excluded.status,
    quality_score = excluded.quality_score,
    evidence_confidence = excluded.evidence_confidence,
    last_verified_at = excluded.last_verified_at,
    metadata = tools.metadata || excluded.metadata,
    updated_at = now();

  for item in select * from jsonb_array_elements(coalesce(bundle->'sources', '[]'::jsonb)) loop
    insert into public.evidence_sources (
      tool_slug,
      source_type,
      source_url,
      source_title,
      publisher,
      captured_at,
      last_checked_at,
      source_quality_score,
      raw_text_excerpt,
      source_hash,
      metadata,
      updated_at
    ) values (
      v_tool_slug,
      coalesce(item->>'source_type', 'unknown'),
      nullif(item->>'source_url', ''),
      item->>'source_title',
      item->>'publisher',
      now(),
      now(),
      coalesce((item->>'source_quality_score')::numeric, 50),
      left(coalesce(item->>'raw_text_excerpt', item->>'excerpt', ''), 3000),
      encode(digest(coalesce(item->>'source_url','') || coalesce(item->>'source_title','') || coalesce(item->>'raw_text_excerpt',''), 'sha256'), 'hex'),
      coalesce(item->'metadata', '{}'::jsonb),
      now()
    )
    on conflict (tool_slug, source_url) do update set
      source_type = excluded.source_type,
      source_title = coalesce(excluded.source_title, evidence_sources.source_title),
      publisher = coalesce(excluded.publisher, evidence_sources.publisher),
      last_checked_at = now(),
      source_quality_score = excluded.source_quality_score,
      raw_text_excerpt = coalesce(excluded.raw_text_excerpt, evidence_sources.raw_text_excerpt),
      source_hash = excluded.source_hash,
      metadata = evidence_sources.metadata || excluded.metadata,
      updated_at = now();
    inserted_sources := inserted_sources + 1;
  end loop;

  for item in select * from jsonb_array_elements(coalesce(bundle->'evidence_items', '[]'::jsonb)) loop
    insert into public.evidence_items (
      tool_slug,
      source_url,
      evidence_type,
      extracted_claim,
      raw_excerpt,
      confidence_score,
      freshness_score,
      contradiction_status,
      public_visibility,
      metadata
    ) values (
      v_tool_slug,
      nullif(item->>'source_url', ''),
      coalesce(item->>'evidence_type', item->>'claim_type', 'feature'),
      coalesce(item->>'extracted_claim', item->>'claim', 'Unlabeled claim'),
      left(coalesce(item->>'raw_excerpt', item->>'excerpt', ''), 3000),
      coalesce((item->>'confidence_score')::numeric, 50),
      coalesce((item->>'freshness_score')::numeric, 50),
      coalesce(item->>'contradiction_status', 'unchecked'),
      coalesce((item->>'public_visibility')::boolean, true),
      coalesce(item->'metadata', '{}'::jsonb)
    );
    inserted_evidence := inserted_evidence + 1;
  end loop;

  for item in select * from jsonb_array_elements(coalesce(bundle->'claims', '[]'::jsonb)) loop
    insert into public.claims (
      tool_slug,
      claim_category,
      claim_text,
      confidence_score,
      evidence_count,
      approved_status,
      metadata,
      updated_at
    ) values (
      v_tool_slug,
      coalesce(item->>'claim_category', item->>'category', 'general'),
      coalesce(item->>'claim_text', item->>'text', 'Unlabeled claim'),
      coalesce((item->>'confidence_score')::numeric, 50),
      coalesce((item->>'evidence_count')::integer, 1),
      case when v_score >= 85 then 'approved' else 'needs_review' end,
      coalesce(item->'metadata', '{}'::jsonb),
      now()
    )
    on conflict (tool_slug, claim_text) do update set
      claim_category = excluded.claim_category,
      confidence_score = greatest(public.claims.confidence_score, excluded.confidence_score),
      evidence_count = greatest(public.claims.evidence_count, excluded.evidence_count),
      approved_status = excluded.approved_status,
      metadata = public.claims.metadata || excluded.metadata,
      updated_at = now();
    inserted_claims := inserted_claims + 1;
  end loop;

  for item in select * from jsonb_array_elements(coalesce(bundle->'scores', '[]'::jsonb)) loop
    insert into public.tool_scores (
      tool_slug,
      dimension,
      score,
      reason,
      evidence_claims,
      updated_at
    ) values (
      v_tool_slug,
      coalesce(item->>'dimension', 'overall'),
      coalesce((item->>'score')::numeric, 0),
      item->>'reason',
      coalesce(item->'evidence_claims', '[]'::jsonb),
      now()
    )
    on conflict (tool_slug, dimension) do update set
      score = excluded.score,
      reason = excluded.reason,
      evidence_claims = excluded.evidence_claims,
      updated_at = now();
    inserted_scores := inserted_scores + 1;
  end loop;

  for item in select * from jsonb_array_elements(coalesce(bundle->'pain_point_matches', '[]'::jsonb)) loop
    insert into public.tool_pain_point_matches (
      tool_slug,
      pain_point_slug,
      match_score,
      reason,
      evidence_claims
    ) values (
      v_tool_slug,
      lower(regexp_replace(coalesce(item->>'pain_point_slug', item->>'name', 'general'), '[^a-zA-Z0-9]+', '-', 'g')),
      coalesce((item->>'match_score')::numeric, 0),
      item->>'reason',
      coalesce(item->'evidence_claims', '[]'::jsonb)
    )
    on conflict (tool_slug, pain_point_slug) do update set
      match_score = excluded.match_score,
      reason = excluded.reason,
      evidence_claims = excluded.evidence_claims;
  end loop;

  insert into public.quality_gate_results (
    target_type,
    target_slug,
    score,
    status,
    issues_json,
    metadata
  ) values (
    coalesce(v_quality->>'target_type', 'tool_review'),
    v_tool_slug,
    v_score,
    v_status,
    coalesce(v_quality->'issues', '[]'::jsonb),
    coalesce(v_quality->'metadata', '{}'::jsonb)
  );

  for item in select * from jsonb_array_elements(coalesce(bundle->'content_pages', '[]'::jsonb)) loop
    insert into public.content_pages (
      page_type,
      slug,
      title,
      status,
      content_json,
      source_data_hash,
      updated_at
    ) values (
      coalesce(item->>'page_type', 'tool_review'),
      coalesce(item->>'slug', '/tools/' || v_tool_slug),
      coalesce(item->>'title', v_tool_name || ' Review'),
      coalesce(item->>'status', case when v_score >= 85 then 'ready_for_publish' else 'needs_review' end),
      coalesce(item->'content_json', item - 'page_type' - 'slug' - 'title' - 'status'),
      v_hash,
      now()
    )
    on conflict (slug) do update set
      page_type = excluded.page_type,
      title = excluded.title,
      status = excluded.status,
      content_json = excluded.content_json,
      source_data_hash = excluded.source_data_hash,
      updated_at = now();
    inserted_pages := inserted_pages + 1;
  end loop;

  insert into public.automation_runs (
    workflow_name,
    run_type,
    target_slug,
    status,
    metrics_json,
    finished_at
  ) values (
    coalesce(bundle->>'workflow_name', 'NCR Intelligence Vault Evidence Pipeline'),
    coalesce(bundle->>'run_type', 'evidence_intake'),
    v_tool_slug,
    'finished',
    jsonb_build_object(
      'sources', inserted_sources,
      'evidence_items', inserted_evidence,
      'claims', inserted_claims,
      'scores', inserted_scores,
      'content_pages', inserted_pages,
      'quality_score', v_score,
      'quality_status', v_status
    ),
    now()
  );

  return jsonb_build_object(
    'ok', true,
    'tool_slug', v_tool_slug,
    'quality_score', v_score,
    'quality_status', v_status,
    'inserted', jsonb_build_object(
      'sources', inserted_sources,
      'evidence_items', inserted_evidence,
      'claims', inserted_claims,
      'scores', inserted_scores,
      'content_pages', inserted_pages
    ),
    'public_evidence_path', '/evidence/' || v_tool_slug,
    'review_path', '/tools/' || v_tool_slug
  );
end;
$$;

-- RLS baseline. Service role bypasses RLS. Public users can read transparency-safe records only.
alter table public.tools enable row level security;
alter table public.evidence_sources enable row level security;
alter table public.evidence_items enable row level security;
alter table public.claims enable row level security;
alter table public.tool_scores enable row level security;
alter table public.content_pages enable row level security;
alter table public.quality_gate_results enable row level security;
alter table public.project_audits enable row level security;
alter table public.recommendation_events enable row level security;
alter table public.automation_runs enable row level security;

-- Drop/recreate simple public read policies to make reruns safe.
do $$
begin
  perform 1;
  drop policy if exists "Public read verified tools" on public.tools;
  drop policy if exists "Public read visible evidence sources" on public.evidence_sources;
  drop policy if exists "Public read visible evidence items" on public.evidence_items;
  drop policy if exists "Public read approved claims" on public.claims;
  drop policy if exists "Public read tool scores" on public.tool_scores;
  drop policy if exists "Public read publishable pages" on public.content_pages;
exception when undefined_object then
  null;
end $$;

create policy "Public read verified tools" on public.tools
for select to anon, authenticated
using (status in ('verified_draft','published','active','needs_evidence'));

create policy "Public read visible evidence sources" on public.evidence_sources
for select to anon, authenticated
using (true);

create policy "Public read visible evidence items" on public.evidence_items
for select to anon, authenticated
using (public_visibility = true);

create policy "Public read approved claims" on public.claims
for select to anon, authenticated
using (approved_status in ('approved','needs_review'));

create policy "Public read tool scores" on public.tool_scores
for select to anon, authenticated
using (true);

create policy "Public read publishable pages" on public.content_pages
for select to anon, authenticated
using (status in ('ready_for_publish','published','needs_review'));

-- These remain private by default: project_audits, recommendation_events, automation_runs.
