-- ============================================================
-- VibeCode Authority — Evidence, Benchmark, and Editorial Schema
-- Purpose: support autonomous high-quality reviews for AI app builders.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TOOLS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  website_url TEXT,
  affiliate_url TEXT,
  affiliate_status TEXT NOT NULL DEFAULT 'researching'
    CHECK (affiliate_status IN ('none', 'researching', 'applied', 'approved', 'rejected')),
  short_description TEXT,
  best_for TEXT,
  primary_audience TEXT,
  production_positioning TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'watching', 'deprecated', 'removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tools_category_idx ON public.tools(category);
CREATE INDEX IF NOT EXISTS tools_status_idx ON public.tools(status);

-- ============================================================
-- PRICING AND FEATURE SNAPSHOTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tool_pricing_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_url TEXT NOT NULL,
  free_plan_available BOOLEAN,
  starting_price_usd NUMERIC(10, 2),
  pricing_summary TEXT NOT NULL,
  credit_or_usage_limits TEXT,
  notable_limits TEXT,
  raw_snapshot JSONB NOT NULL DEFAULT '{}',
  verified_by TEXT NOT NULL DEFAULT 'system',
  confidence INTEGER NOT NULL DEFAULT 80 CHECK (confidence BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS pricing_tool_date_idx ON public.tool_pricing_snapshots(tool_id, captured_at DESC);

CREATE TABLE IF NOT EXISTS public.tool_feature_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_url TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  feature_status TEXT NOT NULL
    CHECK (feature_status IN ('supported', 'partial', 'unsupported', 'unknown')),
  notes TEXT,
  raw_snapshot JSONB NOT NULL DEFAULT '{}',
  verified_by TEXT NOT NULL DEFAULT 'system',
  confidence INTEGER NOT NULL DEFAULT 80 CHECK (confidence BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS features_tool_date_idx ON public.tool_feature_snapshots(tool_id, captured_at DESC);

-- ============================================================
-- BENCHMARK DEFINITIONS AND RUNS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.benchmark_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  family TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  scoring_notes TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.benchmark_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  benchmark_prompt_id UUID NOT NULL REFERENCES public.benchmark_prompts(id),
  run_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tester TEXT NOT NULL DEFAULT 'system',
  tool_version_notes TEXT,
  input_prompt TEXT NOT NULL,
  output_url TEXT,
  artifact_root TEXT,
  time_to_first_output_minutes INTEGER,
  manual_fixes_required INTEGER NOT NULL DEFAULT 0,
  deploy_status TEXT NOT NULL DEFAULT 'not_tested'
    CHECK (deploy_status IN ('passed', 'failed', 'manual_repair_needed', 'not_supported', 'not_tested')),
  security_notes TEXT,
  dimension_scores JSONB NOT NULL DEFAULT '{}',
  final_score INTEGER CHECK (final_score BETWEEN 0 AND 100),
  verdict TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'complete', 'needs_review', 'invalidated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS benchmark_runs_tool_date_idx ON public.benchmark_runs(tool_id, run_date DESC);
CREATE INDEX IF NOT EXISTS benchmark_runs_prompt_idx ON public.benchmark_runs(benchmark_prompt_id);
CREATE INDEX IF NOT EXISTS benchmark_runs_status_idx ON public.benchmark_runs(status);

CREATE TABLE IF NOT EXISTS public.benchmark_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  benchmark_run_id UUID NOT NULL REFERENCES public.benchmark_runs(id) ON DELETE CASCADE,
  artifact_type TEXT NOT NULL
    CHECK (artifact_type IN ('screenshot', 'export', 'video', 'log', 'output_url', 'notes')),
  title TEXT NOT NULL,
  artifact_url TEXT,
  local_path TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS benchmark_artifacts_run_idx ON public.benchmark_artifacts(benchmark_run_id);

-- ============================================================
-- REVIEW EVIDENCE AND CLAIM REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS public.review_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  benchmark_run_id UUID REFERENCES public.benchmark_runs(id) ON DELETE SET NULL,
  evidence_type TEXT NOT NULL
    CHECK (evidence_type IN ('benchmark', 'pricing', 'feature', 'screenshot', 'security', 'deployment', 'handoff', 'manual_note')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT,
  artifact_url TEXT,
  local_path TEXT,
  evidence_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  confidence INTEGER NOT NULL DEFAULT 80 CHECK (confidence BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS review_evidence_tool_idx ON public.review_evidence(tool_id, evidence_date DESC);
CREATE INDEX IF NOT EXISTS review_evidence_expiry_idx ON public.review_evidence(expires_at);

CREATE TABLE IF NOT EXISTS public.claim_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  claim_text TEXT NOT NULL,
  claim_type TEXT NOT NULL
    CHECK (claim_type IN ('pricing', 'feature', 'benchmark', 'security', 'verdict', 'comparison', 'affiliate')),
  evidence_id UUID REFERENCES public.review_evidence(id) ON DELETE SET NULL,
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'needs_review', 'invalidated', 'expired')),
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS claim_registry_article_idx ON public.claim_registry(article_slug);
CREATE INDEX IF NOT EXISTS claim_registry_status_idx ON public.claim_registry(status);
CREATE INDEX IF NOT EXISTS claim_registry_expiry_idx ON public.claim_registry(expires_at);

-- ============================================================
-- ARTICLES AND QUALITY GATES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.article_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  target_keyword TEXT NOT NULL,
  search_intent TEXT NOT NULL
    CHECK (search_intent IN ('informational', 'commercial', 'transactional', 'comparison', 'navigational')),
  article_type TEXT NOT NULL
    CHECK (article_type IN ('review', 'comparison', 'best_of', 'benchmark_report', 'pricing_update', 'build_log', 'guide')),
  required_evidence JSONB NOT NULL DEFAULT '[]',
  angle TEXT NOT NULL,
  internal_links TEXT[] NOT NULL DEFAULT '{}',
  publish_gate TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'briefed'
    CHECK (status IN ('briefed', 'ready_for_generation', 'drafted', 'needs_evidence', 'approved', 'published', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.article_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_brief_id UUID NOT NULL REFERENCES public.article_briefs(id) ON DELETE CASCADE,
  draft_version INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  model_provider TEXT,
  model_name TEXT,
  prompt_version INTEGER NOT NULL DEFAULT 1,
  generation_metadata JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'quality_rejected', 'needs_human_review', 'approved', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS article_drafts_brief_idx ON public.article_drafts(article_brief_id, draft_version DESC);

CREATE TABLE IF NOT EXISTS public.article_quality_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_draft_id UUID NOT NULL REFERENCES public.article_drafts(id) ON DELETE CASCADE,
  scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  specificity INTEGER NOT NULL CHECK (specificity BETWEEN 0 AND 10),
  evidence_density INTEGER NOT NULL CHECK (evidence_density BETWEEN 0 AND 10),
  verdict_clarity INTEGER NOT NULL CHECK (verdict_clarity BETWEEN 0 AND 10),
  production_usefulness INTEGER NOT NULL CHECK (production_usefulness BETWEEN 0 AND 10),
  pricing_accuracy INTEGER NOT NULL CHECK (pricing_accuracy BETWEEN 0 AND 10),
  tool_fit_nuance INTEGER NOT NULL CHECK (tool_fit_nuance BETWEEN 0 AND 10),
  original_insight INTEGER NOT NULL CHECK (original_insight BETWEEN 0 AND 10),
  security_awareness INTEGER NOT NULL CHECK (security_awareness BETWEEN 0 AND 10),
  reader_decision_value INTEGER NOT NULL CHECK (reader_decision_value BETWEEN 0 AND 10),
  internal_linking INTEGER NOT NULL CHECK (internal_linking BETWEEN 0 AND 10),
  total_score INTEGER GENERATED ALWAYS AS (
    specificity + evidence_density + verdict_clarity + production_usefulness + pricing_accuracy +
    tool_fit_nuance + original_insight + security_awareness + reader_decision_value + internal_linking
  ) STORED,
  hard_fail_reasons TEXT[] NOT NULL DEFAULT '{}',
  dimension_notes JSONB NOT NULL DEFAULT '{}',
  pass BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS article_quality_scores_draft_idx ON public.article_quality_scores(article_draft_id, scored_at DESC);

-- ============================================================
-- REFRESH EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.refresh_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug TEXT,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL
    CHECK (event_type IN ('pricing_changed', 'feature_changed', 'evidence_expired', 'benchmark_invalidated', 'ranking_changed', 'affiliate_changed', 'manual')),
  severity TEXT NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  summary TEXT NOT NULL,
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'queued', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS refresh_events_status_idx ON public.refresh_events(status, severity);
CREATE INDEX IF NOT EXISTS refresh_events_tool_idx ON public.refresh_events(tool_id, created_at DESC);

-- ============================================================
-- SEED: CORE TOOLS
-- ============================================================

INSERT INTO public.tools (slug, name, category, website_url, affiliate_status, short_description, best_for, primary_audience, production_positioning)
VALUES
  ('lovable', 'Lovable', 'Prompt-to-app', 'https://lovable.dev', 'researching', 'Prompt-to-app builder for full-stack web app prototypes.', 'Fast product prototypes and founder MVPs.', 'Nontechnical and semi-technical founders.', 'Strong prototype tool; production readiness must be benchmarked.'),
  ('bolt-new', 'Bolt.new', 'Prompt-to-app', 'https://bolt.new', 'researching', 'Browser-based AI app builder with editable code workflow.', 'Fast app scaffolds with code visibility.', 'Founders and builders comfortable reviewing generated code.', 'Good for code-visible prototypes; deploy and security need testing.'),
  ('replit-agent', 'Replit Agent', 'Agentic IDE', 'https://replit.com/ai', 'researching', 'Agentic software builder inside Replit cloud development environment.', 'Build, debug, and deploy in one workspace.', 'Technical founders and operators.', 'Potentially stronger deploy/handoff path than pure prompt builders.'),
  ('v0', 'v0', 'UI generation', 'https://v0.dev', 'researching', 'AI UI generation for React-oriented front-end work.', 'Landing pages, components, and UI scaffolds.', 'Designers, founders, and front-end teams.', 'Excellent UI layer; backend pairing required for full apps.'),
  ('cursor', 'Cursor', 'AI IDE', 'https://cursor.com', 'researching', 'AI-native code editor for working in real codebases.', 'Maintaining and extending generated apps.', 'Developers and technical founders.', 'Important handoff and maintenance layer after vibe-coded prototypes.'),
  ('base44', 'Base44', 'Prompt-to-app', 'https://base44.com', 'researching', 'AI app builder for business apps and internal workflows.', 'Internal tools and business software prototypes.', 'Operators and business users.', 'Needs benchmark proof for data model quality and export path.'),
  ('windsurf', 'Windsurf', 'AI IDE', 'https://windsurf.com', 'researching', 'Agentic AI coding environment.', 'AI-assisted software development.', 'Developers and technical founders.', 'Cursor competitor; benchmark for repo comprehension and edits.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  website_url = EXCLUDED.website_url,
  updated_at = NOW();

-- ============================================================
-- SEED: BENCHMARK PROMPTS
-- ============================================================

INSERT INTO public.benchmark_prompts (slug, family, version, title, prompt_text)
VALUES
  ('saas-mvp-dashboard-v1', 'SaaS MVP', 1, 'SaaS MVP Dashboard', 'Build a responsive SaaS MVP for a product called LaunchPulse. The app helps founders track weekly startup progress. Include landing page, auth flow, protected dashboard, weekly metrics, CRUD experiments table, settings page, empty/loading/error states, responsive design, and deployment/env variable notes.'),
  ('directory-app-v1', 'Directory', 1, 'Directory App', 'Build a responsive directory app called StackScout. It lists AI app-building tools for founders. Include search, filters, listing cards, detail pages, submit-a-tool form, admin review queue, data model, 8 sample tools, states, responsiveness, and deployment notes.'),
  ('internal-tool-v1', 'Internal Tool', 1, 'Internal Operations Tool', 'Build an internal operations dashboard called OpsDesk for vendor renewals. Include protected dashboard, vendors table, add/edit form, renewal calendar, alerts, admin/viewer role model, audit log, states, and responsive tablet/desktop design.'),
  ('landing-page-v1', 'Landing Page', 1, 'High-Converting Landing Page', 'Build a high-converting landing page for PromptProof, a product that helps teams test AI-generated app builders. Include hero, social proof, problem/solution, features, benchmark preview, pricing, FAQ, newsletter, footer, and responsive design.'),
  ('ai-wrapper-v1', 'AI Wrapper', 1, 'AI Wrapper App', 'Build an AI wrapper app called BriefForge that turns meeting notes into project briefs. Include landing page, authenticated app page, server-side AI API call, response sections, saved history, detail page, delete action, settings, states, env docs, and responsive design.')
ON CONFLICT (slug) DO NOTHING;

