# Vibe Coding Benchmark Rubric

This rubric defines how VibeCode Authority scores AI app builders and vibe coding tools. It exists to prevent generic reviews. Every review, comparison, and best-of page should cite benchmark evidence that maps back to this rubric.

## Scoring Model

Total score: 100 points.

| Dimension | Points | What It Measures |
| --- | ---: | --- |
| Prompt adherence | 10 | Did the tool build what was asked without omitting core requirements? |
| App completeness | 12 | Does the output include the needed pages, states, data structures, and flows? |
| UI quality | 10 | Is the generated interface usable, responsive, and visually coherent? |
| Data model quality | 10 | Are entities, fields, relationships, and state handling sensible? |
| Backend/auth readiness | 10 | Can the app support auth, database writes, permissions, and server-side logic? |
| Deployability | 8 | Can the output be deployed without major manual repair? |
| Maintainability | 8 | Is the resulting code/project understandable and editable? |
| Security posture | 8 | Does the tool avoid exposed secrets, weak auth assumptions, and unsafe database access? |
| Debug/failure recovery | 8 | How well does the tool explain and repair errors? |
| Handoff/export | 6 | Can a developer or operator take ownership after generation? |
| Speed to usable prototype | 5 | How quickly does it reach a working first version? |
| Pricing/value clarity | 5 | Are cost, credits, limits, and scaling tradeoffs clear? |

## Rating Bands

| Score | Band | Meaning |
| ---: | --- | --- |
| 90-100 | Category leader | Strong default recommendation for a specific user/use case. |
| 80-89 | Strong | Useful and credible, with clear caveats. |
| 70-79 | Situational | Good for narrow use cases, not a broad recommendation. |
| 60-69 | Experimental | Interesting, but not reliable enough for most readers. |
| Below 60 | Not recommended | Fails too many production or usability checks. |

## Required Evidence Per Review

Each review must include at least:

1. One benchmark run.
2. One pricing snapshot.
3. One generated output screenshot or artifact.
4. One production-readiness note.
5. One clear failure or limitation.
6. One final verdict by user type.

## Hard Fail Conditions

A tool cannot receive a score above 70 if any hard fail is present:

- Cannot produce a runnable output for the benchmark.
- Exposes secrets or encourages unsafe secret handling.
- Produces auth/database logic that is clearly unsafe.
- Cannot export or hand off the project in any usable form.
- Pricing/credit limits are too unclear to estimate real cost.

A tool cannot receive a score above 80 if:

- It requires substantial manual repair before first deploy.
- It lacks a reliable path for maintaining the app after generation.
- It cannot explain errors in a way a target user can act on.

## Benchmark Run Record

Each benchmark run should store:

| Field | Description |
| --- | --- |
| `benchmark_id` | Unique ID for this test. |
| `tool_slug` | Tool being tested. |
| `benchmark_family` | SaaS MVP, directory, internal tool, landing page, AI wrapper. |
| `prompt_version` | Version of the test prompt. |
| `run_date` | Date test was run. |
| `tester` | Person/system running the test. |
| `input_prompt` | Exact prompt submitted. |
| `output_url` | Published preview URL if available. |
| `artifact_path` | Local path to screenshots/export/files. |
| `time_to_first_output_minutes` | Time to first usable output. |
| `manual_fixes_required` | Count and description of required fixes. |
| `deploy_status` | Passed, failed, not supported, manual repair needed. |
| `security_notes` | Auth, secrets, permissions, database concerns. |
| `dimension_scores` | JSON object of rubric scores. |
| `final_score` | 0-100. |
| `verdict` | Short tester verdict. |

## Review Verdict Template

Use this structure in every review:

```md
## Verdict

[Tool] is best for [specific user/use case].

Use it if:
- [Condition 1]
- [Condition 2]
- [Condition 3]

Avoid it if:
- [Condition 1]
- [Condition 2]
- [Condition 3]

Benchmark result:
- Prompt family: [benchmark family]
- Final score: [score]/100
- Biggest strength: [strength]
- Biggest risk: [risk]
- Production readiness: [ready / needs review / not ready]
```

