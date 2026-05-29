# VibeCode Authority Access Control Model

## Principle

Evidence records, drafts, job triggers, verdict changes, and monetized actions require role-based access. Public pages are read-only; admin, worker, and CMS operations must be separated.

## Roles

| Role | Allowed | Denied |
| --- | --- | --- |
| Public reader | Read published canonical pages, public reports, evidence badges, and disclosures | Draft pages, admin notes, vendor contacts, raw job logs, unpublished evidence |
| Research editor | Create/update source snapshots, taxonomy notes, vendor claim records, and tool classifications | Publishing final verdicts, launching affiliate CTAs, changing production recommendations alone |
| Benchmark lead | Create benchmark runs, attach artifacts, update deploy outcomes, propose score movement | Publishing rankings, sponsor placements, policy disclaimers alone |
| Editorial lead | Approve verdicts, rankings, comparison winners, best-of order, and report findings | Bypassing policy review for monetized, production, privacy, or security claims |
| Trust and policy reviewer | Approve disclosures, corrections, sensitive claims, affiliate surfaces, and sponsor labels | Changing benchmark evidence or source records without evidence owner review |
| Worker service | Create job logs, source-watch records, benchmark drafts, refresh tasks, and report packages | Publishing final pages, changing verdicts, launching monetized CTAs |

## Permission Matrix

| Action | Allowed roles | Approval condition |
| --- | --- | --- |
| Read public page | Public reader, research editor, benchmark lead, editorial lead, trust and policy reviewer | Published canonical page only |
| Create evidence record | Research editor, benchmark lead, worker service | Requires tool/page linkage and audit context |
| Approve final verdict | Editorial lead | Requires evidence gates and QA pass |
| Approve monetized CTA | Trust and policy reviewer, growth operator | Requires disclosure readiness and fresh pricing source |
| Trigger automation job | Research editor, benchmark lead, editorial lead, worker service | Job token or authenticated admin action required |
| Publish page | Editorial lead, trust and policy reviewer | Requires publish state Ready and no active blockers |

## Security Rules

- Use role-based access control instead of shared admin passwords.
- Separate human sessions from worker tokens and CMS webhooks.
- Log actor, role, action, target record, and timestamp for every mutating request.
- Require elevated approval for verdict changes, monetized CTAs, policy disclaimers, and page publication.
- Public pages must never expose draft records, admin comments, raw vendor contacts, or private job details.

## Token Boundaries

- Human session: admin and editorial actions with role-based permissions.
- Worker token: limited job execution with audit logs and no publish rights.
- Public request: read-only access to published canonical records.

## Operating Outcome

This model prevents operational shortcuts from damaging the evidence system. It keeps readers, editors, benchmark workers, CMS operations, and automation jobs inside separate permission boundaries.
