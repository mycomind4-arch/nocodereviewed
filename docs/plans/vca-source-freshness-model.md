# VibeCode Authority Source Freshness Model

## Principle

Claims expire. Evidence must be refreshed before rankings, pricing claims, production-readiness claims, or monetized CTAs can be trusted.

## Source Watch Rules

| Source | Cadence | Watch For | Refresh Action |
| --- | --- | --- | --- |
| Pricing pages | 7 days | Plan prices, credit limits, free tiers, workspace rules | Invalidate pricing claims, value claims, affiliate CTAs, and comparison tables |
| Official docs | 14 days | Export paths, auth/database features, deployment flows, APIs | Refresh review facts, production-readiness sections, and benchmark instructions |
| Changelog and release notes | 7 days | Model support, workflow changes, security launches, deprecations | Create refresh tasks for affected reviews, reports, and rankings |
| Terms, privacy, data policy | 30 days | Data retention, training-data language, ownership/export language | Block production-ready claims until legal/data notes are reviewed |
| Product UI and generated output | Per benchmark | Prompt behavior, app architecture, deploy path, default stack | Rerun benchmark and attach fresh artifacts |

## Invalidators

A page or claim should be refreshed when:

- Pricing changed or credit limits changed.
- Deployment/export features changed.
- A benchmark prompt no longer matches the current product workflow.
- A report uses evidence outside its stated evidence window.
- An affiliate CTA appears beside stale pricing or unsupported value claims.

## Freshness Gate

The current source freshness window is 7 days for pricing and high-impact source claims.

If source evidence is older than the freshness window:

1. Mark the related page provisional.
2. Block monetized CTAs near affected claims.
3. Refresh the source snapshot.
4. Re-run affected benchmark or QA checks if product behavior changed.
5. Update rankings only after new evidence is attached.

## Operating Rule

The site should prefer “unknown” or “needs refresh” over confident stale claims.
