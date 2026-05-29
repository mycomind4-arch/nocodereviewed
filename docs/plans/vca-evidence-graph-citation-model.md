# VibeCode Authority Evidence Graph And Citation Model

## Principle

Every public claim should map to the record type that can actually prove it. Source snapshots, benchmark runs, artifacts, review records, and quality checks each support different kinds of claims.

## Evidence Node Types

| Node | Can prove | Cannot prove |
| --- | --- | --- |
| Source snapshot | Pricing, plan limits, official feature availability, terms, privacy, and release claims | Hands-on build quality, generated code maintainability, or deploy success |
| Benchmark run | Task completion, functional behavior, repair difficulty, deploy result, and scoring movement | Official pricing, legal terms, or future roadmap claims |
| Artifact | Observable output: screenshots, generated apps, repos, exports, recordings, and deployment URLs | Claims not visible in the artifact or unsupported by benchmark notes |
| Review record | Editorial verdict, pros, cons, score override, affiliate URL, and publish notes | Facts without supporting source, benchmark, or artifact records |
| Quality check | Final evidence, factuality, originality, SEO, and disclosure readiness status | Underlying product capabilities by itself |

## Claim Map

| Claim | Required records | Publish rule |
| --- | --- | --- |
| Best overall | Benchmark run, source snapshot, artifact, quality check | Comparable tools must use the same benchmark family and freshness window |
| Best value | Source snapshot, review record, quality check | Pricing snapshot must be fresh before affiliate CTAs appear |
| Production-ready | Benchmark run, artifact, source snapshot, quality check | Deploy, auth, data, secrets, and handoff evidence must be present |
| Fastest | Benchmark run, artifact | Use timed or logged build evidence, not subjective impression |
| Good for nontechnical founders | Benchmark run, review record, artifact, quality check | Disclose when code inspection, terminal work, or manual repair is required |

## Citation Rules

- Every paragraph with pricing, limits, security, privacy, export, or deployment claims needs a source or evidence record.
- Every comparison winner needs evidence for both tools, not just a strong record for one tool.
- Artifacts can support observations only when linked to the benchmark or review context that produced them.
- Review records can state editorial judgment, but factual claims must point to source snapshots or benchmark artifacts.
- Reports must include a dated evidence window and identify which records were eligible for inclusion.

## Record Flow

1. Source snapshot creates official-source evidence.
2. Benchmark run creates test evidence.
3. Artifact creates observable-output evidence.
4. Review record connects evidence to editorial judgment.
5. Quality check validates factuality, evidence, originality, SEO, and disclosure.
6. Published claim cites the eligible evidence chain.

## Operating Outcome

This model prevents unsupported authority language. The site can publish confident verdicts only when the evidence graph contains the right record types for the claim being made.
