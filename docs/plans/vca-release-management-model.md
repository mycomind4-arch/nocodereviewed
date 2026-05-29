# VibeCode Authority Release Management Model

## Principle

Production releases should not break evidence trust. Public pages, CMS publishing, API changes, worker jobs, analytics, and monetized CTAs need staged environments, release gates, and rollback triggers.

## Environments

| Environment | Purpose | Gate |
| --- | --- | --- |
| Local prototype | Iterate on information architecture, static panels, local JSON capture, and verifier coverage | Static app verifier, syntax checks, and local server response pass |
| Preview | Review public routes, CMS drafts, evidence joins, design consistency, and role permissions | No console errors, route smoke tests pass, and no blocked pages are publicly visible |
| Staging | Production-like test of database migrations, API contracts, jobs, analytics, and CMS publishing | Migration dry run, API contract checks, worker dry run, QA gates, and rollback plan pass |
| Production | Canonical public site, admin workflows, live evidence records, distribution assets, and revenue surfaces | Release approval, monitoring enabled, backup verified, and active blockers cleared |

## Release Gates

- Static verifier and syntax checks pass.
- No public page has blocked evidence, stale pricing, missing disclosure, or non-canonical URL state.
- Database migrations are reversible or backed up before deployment.
- API changes preserve public read contracts and admin write validation.
- Analytics events include evidence, disclosure, freshness, and page/tool context.
- Rollback path is documented before production release.

## Rollback Triggers

- Public routes return errors, blank pages, or broken navigation.
- Evidence badges, disclosures, or freshness states disappear from review/comparison pages.
- API writes corrupt or duplicate evidence records.
- CMS publishes draft, blocked, or non-canonical pages.
- Affiliate CTAs appear without disclosure readiness.
- Worker jobs mutate verdicts, rankings, or public pages without approval.

## Deployment Rules

- Ship schema changes before features that depend on them.
- Ship public route changes behind preview verification before distribution assets link to them.
- Do not deploy monetized CTAs in the same release as unverified disclosure or pricing changes.
- Release automation jobs in dry-run mode before allowing writes to evidence tables.
- Keep public pages cacheable but invalidate pages when evidence, pricing, corrections, or verdict state changes.

## Operating Outcome

This model keeps release velocity compatible with institutional trust. The site can move fast without letting broken routes, stale evidence, or unsafe monetization reach readers.
