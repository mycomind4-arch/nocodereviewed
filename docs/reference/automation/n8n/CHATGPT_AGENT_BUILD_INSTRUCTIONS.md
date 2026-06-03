# ChatGPT Agent Build Instructions: NoCodeReviewed Intelligence Vault + Vibe Auditor Automation

You are building the flagship NoCodeReviewed product: a free Vibe Auditor combined with an Intelligence Vault backend. The system must scale from 28 microsites to hundreds of tool reviews, comparisons, tutorials, public evidence files, and project-specific recommendations.

## Mission

Build a trustworthy, automated evidence engine that powers:

- A free Vibe Auditor flagship product.
- A public Intelligence Vault of evidence files.
- Tool review microsites.
- Comparison pages.
- Tutorial pages.
- Project-specific recommendations.
- Monetization through affiliate links, implementation services, reports, sponsorships, and API/licensing later.

The core principle: every review claim and recommendation must be backed by stored evidence. Do not create unsupported marketing content.

## Architecture to implement

### Backend

Use Supabase as the source of truth.

Required tables are provided in `supabase_intelligence_vault_schema.sql`:

- `tools`
- `evidence_sources`
- `evidence_items`
- `claims`
- `tool_scores`
- `pain_points`
- `tool_pain_point_matches`
- `project_audits`
- `quality_gate_results`
- `content_pages`
- `recommendation_events`
- `automation_runs`

Use the `public_evidence_vault` view for transparency pages.

Use the `ingest_evidence_bundle(bundle jsonb)` RPC as the write gateway for n8n. Do not write directly to many tables from n8n unless necessary.

### Automation

Import `n8n_nocodereviewed_intelligence_vault_pipeline.json` into n8n.

The first workflow is an evidence intake pipeline:

1. Webhook receives a tool evidence payload.
2. Code node normalizes intake.
3. Gemini extracts evidence into structured JSON.
4. Code node runs the quality gate.
5. Supabase RPC stores the bundle.
6. Webhook responds with quality status and paths.

### Frontend

Make the Intelligence Vault the main site experience. Reviews are secondary outputs of the vault.

Primary routes:

- `/` — premium, calm homepage that positions NoCodeReviewed as the evidence engine for choosing and auditing no-code/AI tools.
- `/auditor` — free flagship Vibe Auditor.
- `/vault` — searchable evidence vault.
- `/evidence/[toolSlug]` — public evidence file.
- `/tools/[toolSlug]` — review microsite.
- `/compare` — comparison hub.
- `/compare/[slug]` — pairwise or category comparison page.
- `/tutorials` — project-path tutorials.
- `/admin` — private quality gate dashboard.

Design style:

- Premium, intelligent, sophisticated, helpful.
- Hide the machinery; do not make it cyberpunk or overwhelming.
- Use glassmorphism sparingly in navigation and cards.
- Dynamic layout: onboarding path changes based on user intent.
- The vault should feel like a calm command center, not a cluttered database.

## Product flows

### Flow 1: User has no project yet

Ask:

1. What are you trying to build?
2. How technical are you?
3. Do you need a mobile app, web app, automation, marketplace, AI chatbot, internal dashboard, e-commerce, or content site?
4. How much control do you need over code/export/database?
5. What matters most: speed, ownership, cost, design quality, automation, security, integrations, scalability?

Output:

- Recommended platform.
- Runner-up options.
- Why each recommendation fits.
- Evidence links.
- Risks and avoid-if conditions.
- Optional affiliate-tracked CTA with disclosure.

### Flow 2: User already has a project

Allow:

- ZIP upload.
- GitHub URL.
- ChatGPT export.
- Grok export.
- Lovable/Replit/Bolt project notes.

Audit:

- Launch readiness.
- Broken navigation/routes.
- Missing data persistence.
- Missing auth/security basics.
- Missing monetization path.
- SEO and content gaps.
- Accessibility/usability issues.
- Technical debt and hallucinated code.

Output:

- Free useful audit.
- Evidence-backed repair plan.
- Recommended tools from the Intelligence Vault.
- Optional paid report, repair service, or implementation handoff.

### Flow 3: Public research user

Let users search evidence files by:

- Tool.
- Category.
- Pain point.
- Pricing model.
- Best for.
- Avoid if.
- Security posture.
- Export/code ownership.
- Integration needs.

Every public review claim links back to evidence.

## Quality Gate Rules

A page can only become `ready_for_publish` when:

- It has at least two sources.
- It has at least one official/docs/pricing/GitHub source.
- It has at least eight evidence items.
- It has pricing or plan limitation evidence if pricing is discussed.
- It has no unsupported hype claims.
- It has clear best-for and avoid-if claims.
- It includes disclosure if monetized.

Thin outputs must be `needs_review` or `blocked`, not published.

## Monetization rules

Monetization is high priority, but recommendations must not be secretly biased.

Allowed monetization:

- Affiliate links with disclosure.
- Sponsored slots clearly labeled.
- Paid expanded reports.
- Done-for-you project repair.
- Launch readiness consulting.
- Agency referrals.
- Premium API/data access later.

Do not hide paid influence inside supposedly objective rankings. The system should make users trust the recommendations even more because the evidence is public.

## First implementation checklist

1. Run the Supabase SQL schema.
2. Import the n8n workflow.
3. Set n8n environment variables.
4. Test with `test_payload.json`.
5. Build `/vault` reading from `public_evidence_vault`.
6. Build `/evidence/[toolSlug]` from `public_evidence_vault` and `quality_gate_results`.
7. Build `/tools/[toolSlug]` from `content_pages`, `tools`, `claims`, and `tool_scores`.
8. Build `/auditor` onboarding and project-intake UI.
9. Store project audits privately in `project_audits`.
10. Show tool recommendations from evidence-backed `tool_pain_point_matches` and `tool_scores`.
11. Add affiliate URL management in `/admin`.
12. Add manual approval controls before publishing.

## Second implementation checklist

1. Scheduled official-docs/pricing refresh workflow.
2. Comparison generator workflow.
3. Tutorial generator workflow.
4. Contradiction detection workflow.
5. GitHub repo audit workflow.
6. ChatGPT/Grok export parser workflow.
7. Admin dashboard queue: blocked, needs review, ready, published.
8. Analytics for recommendation clicks, affiliate clicks, audit completions, and paid-service intent.

## Non-negotiables

- Never expose Supabase service role key in frontend code.
- Never auto-publish thin content.
- Never recommend tools only because they monetize well.
- Keep public evidence transparent.
- Keep project audits private by default.
- Use the Intelligence Vault as the source of truth for reviews, recommendations, comparisons, and tutorials.
