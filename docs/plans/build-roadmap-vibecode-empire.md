# VibeCode Empire Build Roadmap

This is the execution roadmap from current static prototype to full autonomous authority network.

## Current State

Built:

- Static anchor-site prototype.
- 28-tool vibe coding coverage map.
- Image prompt library.
- Benchmark rubric.
- Benchmark prompt suite.
- First 10 article briefs.
- Evidence and editorial database schema.
- Kimi full React scaffold extracted for reference.

## Phase 1: Anchor Site Foundation

Goal: convert the prototype into a proper data-backed authority site.

Build slices:

1. Tool database page.
2. Tool review page template.
3. Comparison page template.
4. Benchmark methodology page.
5. Production readiness checklist page.
6. Article brief dashboard.

Acceptance checks:

- Each tool page can show pricing status, benchmark status, evidence count, and verdict.
- Each comparison page can show side-by-side rubric scores.
- Methodology page explains the scoring system in public-facing language.
- No review page can show “recommended” unless it has benchmark evidence.

## Phase 2: Evidence Capture

Goal: make benchmark evidence easy to record.

Build slices:

1. Benchmark run form.
2. Artifact upload/reference form.
3. Pricing snapshot form.
4. Feature snapshot form.
5. Claim registry form.

Acceptance checks:

- A benchmark run can be entered for Lovable using the SaaS MVP prompt.
- A screenshot/artifact can be associated with that run.
- A review claim can point back to that evidence.
- Expired pricing claims can be queried.

## Phase 3: First Content Cluster

Goal: publish the first evidence-backed cluster.

Cluster:

1. Lovable review.
2. Bolt.new review.
3. Replit Agent review.
4. Lovable vs Bolt.
5. Lovable vs Replit.
6. Best AI app builders.
7. Vibe coding production readiness checklist.

Acceptance checks:

- Every article has a brief.
- Every review has at least one benchmark run.
- Every comparison uses the same benchmark prompt for both tools.
- Every pricing claim has a snapshot.
- Every article has internal links to at least two related pages.

## Phase 4: Autonomous Drafting

Goal: generate drafts from evidence, not from generic search summaries.

Build slices:

1. Article generation prompt template.
2. Evidence pack assembler.
3. Draft generator.
4. Quality scoring prompt.
5. Hard-fail detector.
6. Human review queue.

Acceptance checks:

- Draft generator receives only structured evidence and article brief.
- Quality score is stored in `article_quality_scores`.
- Drafts with missing evidence are rejected automatically.
- Drafts with stale pricing claims are rejected automatically.

## Phase 5: Source Watcher And Refresh

Goal: keep authority pages current.

Build slices:

1. Source watch list per tool.
2. Pricing page monitor.
3. Changelog monitor.
4. Refresh event creator.
5. Refresh queue dashboard.

Acceptance checks:

- Pricing snapshots expire after seven days.
- Expired claims create refresh events.
- Tool changelog events can trigger article refresh.
- Refresh status is visible in admin.

## Phase 6: Monetization

Goal: add affiliate tracking without corrupting editorial quality.

Build slices:

1. Affiliate program tracker.
2. Affiliate link table.
3. Click tracking endpoint.
4. Revenue attribution.
5. Monetization gap detector.

Acceptance checks:

- Affiliate links are disclosed.
- Editorial scores do not depend on affiliate status.
- Broken affiliate links are flagged.
- High-traffic unmonetized pages are surfaced.

## Phase 7: Network Expansion

Goal: expand only after Site 1 proves the system.

Expansion candidates:

1. Prompt-to-App Lab.
2. AI IDE Benchmarks.
3. Founder App Stacks.
4. Security and Production Readiness.

Expansion gate:

- 20 evidence-backed reviews.
- 50 benchmark runs.
- 10 published comparisons.
- Quality pass rate stable for 30 days.
- Refresh events are resolved within seven days.
- Site can run two weeks without emergency repair.

## Immediate Next Build Slice

Build the evidence capture admin locally:

1. Add a local JSON-backed prototype data store.
2. Add tools, benchmark prompts, and article briefs to the static app.
3. Add an admin tab for benchmark run entry.
4. Add evidence count and benchmark status to review cards.

This can be done before Supabase is connected.

