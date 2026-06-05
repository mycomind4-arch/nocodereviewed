# Vibe Launch Audit — Operations Guide (MVP)

This document describes the daily operation, policies, and workflow for the productized Vibe Launch Audit service inside the NoCodeReviewed project.

## Business Objective
Provide evidence-grounded, human-reviewed launch readiness audits for apps built with AI/no-code tools (Lovable, Bolt.new, Replit Agent, Cursor, v0, Bubble, Framer, Webflow, etc.). Deliver practical reports that help founders identify blockers, quick wins, and next steps before investing more time or launching to real users.

## Pricing (MVP)
- Starter: $49 — Basic app/page, launch blockers, quick wins, concise report.
- Standard: $149 — Up to three flows/pages, deeper readiness notes, prioritized next steps.
- Premium: $299 — Full audit + implementation checklist + optional review-call prep notes.

Prices are fixed-scope. No hourly billing in MVP. Tiers selected via the intake form.

## Core Principles (from project nucleus and AGENTS.md)
- Evidence-first. Never invent scores, capabilities, security claims, or outcomes.
- Human approval required before any customer-facing recommendation or delivery.
- Local-first file storage. No cloud customer data in MVP.
- Public free Vibe Auditor (tools/vibe-auditor.html) remains completely independent and untouched.
- Manual or semi-manual launch first. Automate only after validation.
- Clear scope boundaries and disclaimers at every step.
- No fake authority, testimonials, or guaranteed results.

## Statuses (order.status)
- intake_received
- needs_scope_review
- payment_pending
- ready_for_audit
- draft_generated
- human_review
- approved
- delivered
- follow_up_sent
- canceled

## Payment Statuses (order.paymentStatus)
- manual_pending
- payment_pending
- paid
- refunded
- canceled

Payment is manual-fallback in MVP. After intake, operator confirms scope via email/DM, then provides a manual payment method (Stripe invoice, bank, etc.). Only move to "ready_for_audit" after payment confirmation is logged.

## Data Locations (local-first)
- Orders: `data/vibe-audits/orders.json`
- Events/log: `data/vibe-audits/events.json`
- Draft reports: `data/vibe-audits/reports/{orderId}-draft.md`
- (Final delivered reports can be copied to a "final" path or exported manually by operator.)

Never commit real customer data or PII to git. .gitignore should cover data/vibe-audits/ (add if missing: `data/vibe-audits/` except a .gitkeep for the dir skeleton).

## Daily Operating Routine (low-stress, ~15-30 min/day at low volume)
1. Check `npm run dev` server is running (or the deployed preview).
2. Visit `#admin` (or directly the Vibe Launch Audit orders panel).
3. Review new intakes (status = intake_received or needs_scope_review).
4. For each:
   - Read full intake details.
   - If scope unclear → email customer for clarification (do not accept payment yet). Set status needs_scope_review + note.
   - Confirm or discuss tier.
   - Send manual payment instructions / link. Update paymentStatus and add operator note.
   - Once paid confirmed → status = ready_for_audit, assignedTo = "Shane" or "Casey".
5. When ready:
   - Click "Generate report draft" (calls server endpoint, creates Markdown draft using intake + template).
   - Open the draft file (path shown in admin).
   - Edit the draft: fill concrete observations, run the free public Vibe Auditor on the project URL if link is usable, cross-reference docs/evidence/ for the tools mentioned. Remove any unsupported claims. Add specific quotes or examples from intake.
   - Update timeSpentMinutes.
6. Human approval gate:
   - The second operator (or same person after a break) reviews the edited draft.
   - Only when satisfied: check "Human-approved for customer-facing delivery", set status = approved, add final note.
7. Delivery:
   - Export the approved draft (copy to final or convert to nice PDF/Markdown/HTML as needed).
   - Email customer the report + any private link.
   - Update status = delivered, set deliveredAt, log any follow-up offer.
8. End of day: note any bottlenecks in the order notes or a simple local log.

Fallback: If automation (draft gen) fails, operator can manually create the Markdown from the template in the server code and save to the reports/ folder, then update the order JSON manually (or via the PATCH form).

## Refund / Scope Policy (plain language for operators and customers)
- Audits are fixed-scope reviews of the submitted project state at time of intake.
- No refunds after work has begun on the draft (status moved past ready_for_audit), except in cases of clear operator error or duplicate submission.
- If customer provides incomplete/wrong links or scope changes materially after payment, operator may move to canceled + partial credit or re-scope as new order.
- The report is recommendations and observations only. It carries no guarantee of launch success, revenue, security certification, compliance, or ranking.
- Always disclose: "This is not legal, financial, security, or compliance advice."

Include the disclaimer in every report and on the offer page.

## Report Contents (must be present in every delivered report)
- Summary (intake facts + context)
- Launch readiness score (placeholder + checklist, finalized only by human)
- Blockers (critical issues)
- Quick wins
- Evidence/credibility gaps
- Tool-stack notes (grounded where possible in existing evidence)
- Recommended next steps (actionable, with human review gate)
- Human review required notice + disclaimer

The server `buildVibeAuditReportMarkdown` produces a strong starting draft. Operator must customize it.

## Human Approval Gate (enforced)
- UI checkbox "Human-approved for customer-facing delivery" in admin order form.
- Server PATCH accepts humanApproved.
- Draft generation sets status to draft_generated but does NOT deliver.
- Only after humanApproved=true + status=approved should the operator send anything to the customer.
- Never bypass for speed. Reputation and legal safety come first.

## Adding New Orders Manually (fallback)
If the web intake is down, operator can add a record directly to orders.json following the exact schema in the task. Then use the admin UI to update.

## Events Log
`data/vibe-audits/events.json` captures intake_submitted, validation failures, order_updated, draft_generated, etc. Useful for debugging and simple audit trail. Trimmed to last 500.

## Testing the MVP (manual)
1. From home or nav, go to #vibe-launch-audit.
2. Click a tier link → should land on intake with tier preselected.
3. Fill all required fields (use realistic but fake data for test). Submit.
4. Confirm success message + order appears in admin (#admin).
5. In admin: view details, update status/payment/assigned/time, add note, check humanApproved.
6. Click "Generate report draft" → confirm draft file created under data/vibe-audits/reports/, status moves to draft_generated, path shown.
7. Open the .md, edit it, then update the order with approval.
8. Verify mobile: form and cards usable on small screens.
9. Confirm no public page leaks order data (the orders API is admin-only in practice; the intake page does not list orders).
10. Confirm tools/vibe-auditor.html loads unchanged and is linked as the free entry point.

## Integration with Existing Nucleus
- Leverages the public Vibe Auditor as the free top-of-funnel.
- Reuses NoCodeReviewed methodology, evidence files, and audit gates in the report template.
- Admin panel lives inside the existing #admin glass UI.
- All storage is local-first file JSON (consistent with vault and parser patterns).
- Does not modify or depend on the standalone Vibe Auditor HTML.
- Future: could map approved customer project artifacts into internal VaultAuditHandoff records (after contract review), but not in this MVP.

## What Not to Do (MVP boundaries)
- Do not enable real Stripe Checkout keys without a later explicit phase + security review.
- Do not auto-deliver reports or send emails from the server in MVP (manual operator step).
- Do not store customer projects in the intelligence-vault without explicit mapping and privacy review.
- Do not claim the audit is "AI-only" or fully automated.
- Do not add CRMs, queues, auth, or external services.

## Next After Validation
Once real paid orders have been processed manually:
- Improve report template with more reusable partials.
- Add simple email notification on intake (e.g. via existing server or manual).
- Consider a "final" vs "draft" path and one-click export helper.
- Only then evaluate lightweight automation for draft pre-population using the existing parser/auditor logic.

This MVP turns existing authority and tooling into a clear, billable offer with human oversight at the critical points.

---

Maintained per the project AGENTS.md and architecture contracts. Update this doc when the workflow or policy changes.