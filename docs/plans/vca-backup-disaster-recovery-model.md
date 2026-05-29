# VibeCode Authority Backup And Disaster Recovery Model

## Principle

The evidence record is the asset. Backups and recovery plans must protect structured evidence, artifacts, CMS pages, configuration, analytics, and correction history before the site scales.

## Backup Scopes

| Scope | Includes | Cadence | Priority |
| --- | --- | --- | --- |
| Structured database | Tools, source snapshots, benchmark runs, artifacts metadata, review records, QA checks, pages, corrections | Daily automated backup plus pre-migration snapshot | Highest |
| Artifact storage | Screenshots, recordings, exports, generated app URLs metadata, report PDFs, social assets | Daily metadata sync and object versioning | High |
| CMS content | Page composition, drafts, canonical URLs, editorial notes, publish states, previews | Daily export plus pre-release snapshot | High |
| Configuration | Environment variables inventory, API contract versions, worker schedules, role permissions | Change-controlled backup before release | Medium |
| Analytics events | Page events, CTA events, evidence engagement, report requests, job summaries | Daily export or vendor retention check | Medium |

## Recovery Objectives

| Incident | RTO | RPO | Action |
| --- | --- | --- | --- |
| Public page deploy failure | 15 minutes | Last successful release | Roll back deployment, keep database untouched, verify core routes |
| Bad CMS publish | 30 minutes | Previous CMS snapshot | Unpublish or revert page, restore canonical content, log correction if public |
| Evidence data corruption | 2 hours | Pre-mutation backup or last daily snapshot | Freeze writes, restore affected records, audit page_evidence links |
| Artifact loss | 4 hours | Last object version or metadata export | Restore objects, mark affected claims provisional until artifacts are verified |
| Worker runaway | 30 minutes | Last approved job checkpoint | Disable worker token, revert generated records, audit verdict/ranking mutations |

## Restore Drill Rules

- Run a restore drill before public beta and before revenue launch.
- Test database restore separately from CMS restore and artifact restore.
- Verify restored pages still show evidence badges, disclosure state, freshness state, and canonical URLs.
- Document who approved the restore and what records changed.
- After a restore, rerun static verifier, API smoke tests, and public route checks.

## Data Loss Policies

- If benchmark artifacts are lost, affected benchmark claims become provisional until artifacts are restored or rerun.
- If source snapshots are lost, pricing, privacy, feature, and policy claims are blocked until recaptured.
- If QA records are lost, affected pages cannot retain final verdict status.
- If correction history is lost, freeze affected verdict changes until audit notes are reconstructed.
- If analytics events are lost, do not infer ranking or revenue decisions from incomplete data.

## Operating Outcome

This model makes recovery part of the authority system. A restore is not complete until public claims, citations, disclosures, and evidence states are trustworthy again.
