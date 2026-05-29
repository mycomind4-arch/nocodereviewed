# Evidence Schema Implementation Notes

Schema file:

`data/vibecode_authority_schema.sql`

## What This Schema Enables

The schema supports the core operating loop:

1. Track the AI app-builder tools.
2. Capture pricing and feature snapshots.
3. Run standardized benchmark prompts.
4. Store screenshots, exports, logs, and notes as artifacts.
5. Convert evidence into supported article claims.
6. Generate article drafts only from evidence-backed briefs.
7. Score drafts through quality gates.
8. Trigger refreshes when claims, pricing, evidence, or rankings become stale.

## Important Design Choice

The article generator should not query the public web directly and write from memory. It should query:

- `tools`
- `tool_pricing_snapshots`
- `tool_feature_snapshots`
- `benchmark_runs`
- `benchmark_artifacts`
- `review_evidence`
- `claim_registry`
- `article_briefs`

This keeps autonomous publishing grounded in evidence.

## Minimum Publish Query

Before an article can publish:

```sql
SELECT
  b.slug,
  b.title,
  COUNT(DISTINCT e.id) AS evidence_count,
  MAX(q.total_score) AS best_quality_score,
  BOOL_OR(q.pass) AS has_passing_score
FROM article_briefs b
JOIN article_drafts d ON d.article_brief_id = b.id
LEFT JOIN claim_registry c ON c.article_slug = b.slug
LEFT JOIN review_evidence e ON e.id = c.evidence_id
LEFT JOIN article_quality_scores q ON q.article_draft_id = d.id
WHERE b.slug = :article_slug
GROUP BY b.slug, b.title;
```

Required:

- `evidence_count >= 1` for guides.
- `evidence_count >= 3` for reviews and comparisons.
- `has_passing_score = true`.
- No active `claim_registry.status IN ('needs_review', 'invalidated', 'expired')`.

## Next Tables Later

Add these after the first benchmark workflow is working:

- `affiliate_programs`
- `affiliate_clicks`
- `source_watch_events`
- `tool_changelog_events`
- `newsletter_issues`
- `internal_links`
- `search_console_snapshots`

