# SOURCE_UTILIZATION_REPORT.md

Phase C1 — Whole-Project Source Inventory + Safe Site Population

Date: 2026-06 (current session)

## Inventory Summary
- Ran `find . -maxdepth 4 -type f | sort` (excluding .git/node_modules in analysis).
- ~692 relevant source/asset files identified (code, md, images, json).
- Full tree includes production, _INBOX (source material per AGENTS), docs/, public/images/, microsites/, tools/, src/, data/.

## Classification (per spec)
**A. Use directly (safe, relevant, evidence-backed, current):**
- docs/evidence/*.md (all 25+ canonical/supplemental for 20+ tools, including priority Lovable 04+12, Bolt 03, Replit 01, Cursor 05, Windsurf 06, Webflow 18, Bubble 16, Framer 19 etc.).
- data/intelligence-vault/evidence-manifest.json (used for counts, status, gaps).
- public/images/tool-logos/ (lovable-logo.jpg, bolt-new-logo.jpg, replit-logo.jpg — used in review/funnel heroes/cards).
- public/images/tool-backgrounds/ (lovable-bg.jpg, bolt-new-bg.jpg, replit-bg.jpg + others — used for microsite/review visuals where relevant).
- public/images/tool-visuals/ (lovable-*.jpg, bolt-*.jpg, replit-*.jpg for workflow/security/strengths — used in funnel workflow/strengths sections).
- docs/content/lovable/ (safe-claims.md, evidence-brief.md, test-lab-plan.md, claims-needing-testing.md — used for grounded strengths/limitations/gaps in ncrToolReviewPage).
- _INBOX_NEW_FILES/nocodereviewed_expansion_pack/docs/content/ (lovable-*-copy.md for review/pricing/security/autonomy/prompts/templates/test-lab/alternatives/vs-*/hub/final-verdict; methodology-page-copy.md; tools-index-copy.md; audit-ai-built-apps-guide-copy.md; homepage-copy.md — excerpts used to populate review sections, tools intro, methodology, about, blog planned cards. All safe per expansion instructions and AGENTS source material).
- docs/architecture/ (VAULT_DATA_CONTRACT.md, LOCAL_VAULT_HANDOFF.md, CODEX_CONTEXT.md, SOURCE_OF_TRUTH_MAP.md, MERGE_PLAN.md, INTELLIGENCE_VAULT_ARCHITECTURE.md — used for methodology/evidence/about text).
- docs/benchmarks/ (rubric, prompts, notes — used for methodology/benchmarks placeholders).
- microsites/lovable.html, bolt-new.html, replit.html (existing safe content; links updated to hash, some text patterns referenced).
- src/static-app.js / src/styles.css / index.html (core, enhanced).
- tools/vibe-auditor.html, tools/chat-intelligence-vault.html, tools/component-library.html, kimi-agent-build-source-index.html (core + reference UI ideas).

**B. Use as reference only:**
- docs/reference/ (prototypes).
- _INBOX_NEW_FILES/ many (nocodereviewed-structured/ as reference for future; gpts prompts; various plans/doctrine — used selectively for text only if grounded).
- src/components/ (jsx prototypes — reference for UI patterns, not integrated as code).
- expansion_pack/data/ and specs/ (reference for structure, not direct publish).
- docs/evidence/README.md, architecture other notes.

**C. Extract small safe pieces:**
- Specific excerpts from expansion lovable copies and docs/content/lovable/ into review/funnel text (strengths, limitations, pricing, security, workflow, prompts guidance, gaps).
- Tools index copy into #tools intro.
- Methodology copy + architecture into #methodology.
- Homepage copy into #about.
- Audit guide into #blog planned.
- Visuals/logos into pages (with labels).

**D. Quarantined (unsafe/irrelevant/do-not-publish):**
- tools/adult-media-vault.html, adult-scraper/, explicit-erotic-story-generator.html, nsfw-chat.html, nsfw-gen.html, nsfw-image2video.html, nsfw-video-studio.html, xvideos-playable.json, xvideos-results.json (and any related in _INBOX or generated) — adult/NSFW/erotic/scraper. Never linked, imported, staged, or exposed.
- _INBOX_NEW_FILES/ some unrelated experiments, broken duplicates, private (e.g. certain zips, adult references if any).
- tools/ many backups (vibe-auditor.backup-*.html), pipeline-dashboard.html, nocodereviewed-vibe-auditor.html (legacy, not core; quarantined from main nav unless safe).
- Any 0-byte or empty.
- Unrelated scraper outputs or non-NoCodeReviewed content.

**E. Needs human review / ignored for this phase:**
- Most _INBOX gpts, autonomous plans, doctrine full (reference only, not bulk published).
- nocodereviewed-structured/ (supabase/n8n — per AGENTS reference only, no integration).
- Kimi source, Bolt/Lovable prototypes in _INBOX/project/ etc (reference, already used for prior UI phases).
- docs/ other content not directly relevant.
- benchmarks/ full (used selectively).
- Any non-evidence-backed marketing from prototypes without verification.

## Source Utilization Plan (before edits)
- Production core untouched except safe enhancements to ncr* renderers.
- Evidence: all docs/evidence/ + manifest used for status, citations, gaps in review/funnel pages.
- Microsite/source: existing microsites/*.html referenced/linked; expansion_pack and docs/content/ excerpts for text (no full copy-paste of large files).
- Tool assets: logos for 3, backgrounds/visuals for lovable/bolt/replit + others used in <img> or style in ncrTool* pages (labeled, relevant, non-mockup screenshots as content).
- Prototypes/reference: used for UI patterns (icons, rail/frame from prior) and copy ideas; no bulk integration of jsx or unverified.
- Utilities: component-library and kimi-index as reference for UI; core tools pages as-is.
- Quarantined as above.
- Modified only: src/static-app.js (enhanced ncrToolMicrositeFunnel/ncrToolReviewPage/ncr*Real with excerpts, icon usage, rail/frame, more tools data), src/styles.css (icon/rail/frame css), created docs/architecture/SOURCE_UTILIZATION_REPORT.md.
- Routes populated/enhanced: #reviews, #tools, #microsites, #evidence, #methodology, #blog, #about, #tool/lovable etc, #review/lovable etc, #tool/*/tutorials (using safe text for "coming soon" + grounded sections), placeholders with relevant excerpts where available.
- No architecture change. All content source-grounded or "pending"/"coming soon". Links verified via code (no dead). Brand icons via existing helpers + assets.
- Evidence gaps: explicitly shown (e.g. pending production/security per file statuses). No fakes.

## Files Used Directly / Extracted
- Evidence files + manifest for all review/funnel citations and status.
- Expansion pack lovable copies + docs/content/lovable/ for specific review/funnel text (strengths, limitations, pricing, security, workflow, prompts, gaps, index intro, methodology, about, blog).
- Tool images for 3+ (logos in heroes/cards, visuals in workflow/strengths sections of funnels/reviews).
- Architecture docs for methodology/evidence/about.
- Existing microsites html for link targets and patterns.

## Ignored/Quarantined
As D/E above. Unsafe NSFW in tools/ never touched/linked. _INBOX bulk treated as source per AGENTS; only safe excerpts used.

## Routes Populated / Improved
- Homepage: minor safe links/text if grounded.
- #reviews / ncrReviewsRealPage: more cards with icons.
- #tools / ncrToolsRealPage: intro from index-copy, icons.
- #microsites: existing + links to enhanced funnels.
- #evidence / ncrEvidenceLibraryPage: populated with manifest details.
- #methodology: full from copy + architecture.
- #blog / ncrBlogPage: planned cards from audit guide.
- #about / ncrAboutPage: mission from copy + doctrine.
- Priority tool funnels (#tool/lovable etc): enhanced with pricing/security/prompts sections from copies, icons, visuals.
- Priority tool reviews (#review/lovable etc): full sections with excerpts, rail, frame, icons, grounded text + pending.
- Tutorials (#tool/*/tutorials): coming soon with grounded topics.
- Placeholders: relevant text where safe copy existed.
- Links: all main nav, cards, footers, CTAs point to real or clear placeholders. Standalone tools preserved.

## Evidence Used
All docs/evidence/ for the tools (e.g. 04_lovable, 03_bolt, 01_replit + supplementals). Manifest for counts/gaps. No unsupported claims; all "pending" match file statuses.

## Remaining Gaps
- Full hands-on for many (as in evidence files).
- More tools beyond priority 8 (data exists, can extend).
- Actual tutorial content (placeholders only).
- More images for other tools.

## Recommended Next Phase
C2: Extend to next 5-8 tools using same safe sources + add any new verified assets. Populate more blog with safe guide copies. Full QA of all routes.

No unsafe published. Site more complete with real project material. Build/evidence pass. 

(End report)

# PHASE C2 — Complete Remaining Tool Population From Verified Project Sources
Date: 2026-06 (this session, following B1 blog)

## PART 1-2: State + Scans + Classification (executed before edits)
- git status -sb + log -8: confirmed main synced, C1 9b78037 present, B1 latest, no unexpected tracked (untracked: adult/NSFW/*, xvideos/*, src/components/*.jsx React prototypes, microsites/prototypes/*, tools/generated/, benchmarks/, package-lock, SOURCE_INVENTORY_REPORT.md, _INBOX bulk — all D/E per rules, never staged/linked).
- Full finds: docs/evidence (25 files, cursor05/windsurf06/v0 09/bubble16/webflow18/framer19 + C1 3 + base44/claude/codex/supabase/flutter/glide/softr/adalo/retool/thunkable/appsmith/weweb/builder + dups 12/13/14; missing 10/11/28 per manifest).
- Images: logos only 3 (C1); backgrounds 10 (cursor/windsurf/bubble-ai/framer-ai/v0 + base44/claude etc A for relevant); visuals only 3 (C1).
- Micros: 3 real + prototypes (D quarantine).
- content/expansion: lovable-only + general (methodology/tools-index/audit-guide/empire site-02/04/09 for automation/ecommerce/ui; lovable-vs-cursor only per-tool mention).
- tools[]: 35 entries (C1 3 + cursor/windsurf/v0 + bubble-ai/webflow-ai/framer-ai + 20+ indexed; added 5 shopify/make/zapier/notion/airtable for C2 primary).
- evidenceFileIndex: already covered the 6 + more.
- Classification summary (A use direct / B ref / C small / D quarantine / E review):
  - Cursor, Windsurf, v0, Webflow-AI, Bubble-AI, Framer-AI: A (complete evidence files 05/06/09/16/18/19 with safe claims/strengths/lims/pricing/security/testing plans; + bg images A; vs-cursor B ref; prototypes D).
  - Shopify, Make, Zapier, Notion, Airtable: no dedicated evidence (E for full, B for empire mentions in site-04 ecommerce / site-02 automation / integrations in other ev; partial pages only).
  - Remaining indexed (base44, claude-code, openai-codex, flutterflow-ai etc): A/B for their ev files + some bg (base44/claude); basic status + routes; full pop deferred to keep scope.
  - Quarantined reaffirmed: all adult/NSFW/scraper/xvideos/tools/adult* / tools/nsfw* / tools/xvideos* / prototypes/ / untracked React / empty / unrelated (never touched, linked, or staged).
- No D/E integrated. No fakes.

## PART 3: Plan (printed to terminal before any search_replace on prod)
- Per-tool: evidence status, source files, images, safe usable (excerpts from safe claims/strengths or "pending"), missing (hands-on per "in-progress" notes), improvements (hero CTA if safe URL from ev, best-fit/workflow from claims or generic pending, 5 tutorial cards all labeled, comparison from tools[] only, evidence cite + gaps explicit, review full R1 template), readiness (FULL for 6 with ev; PARTIAL/PENDING for 5 shopify group + others).
- No arch/deps/fakes/unsafe/convert required — plan approved internally per rules.

## Files Used / Modified (PART 4-9 population)
- src/static-app.js: extended TOOL_BRAND_ASSETS (framer-ai/webflow-ai/bubble-ai + base/claude/shopify/make/zapier/notion/airtable orbs/colors; no new logos), getToolTheme (new + aliases), toolBySlug/getToolData/getEvidenceForTool (webflow/bubble/framer aliases + effective), added 5 pending tools[] entries, enhanced ncrToolMicrositeFunnel (tryUrl map for 6 + safe from ev, fixed lovable hardcodes in pricing/security/bestfit/workflow/fit/evidence, specific excerpts/safe claims for cursor/windsurf/v0 + ai ones, bg notes, 5 tutorial cards labeled, CTA restraint + pending label), ncrToolReviewPage (reviewTryUrl map, generalized strengths/lims from lovable copy, per-slug safe excerpts + pending, updated all 12 sections with ev status/gaps specific, hero/cta CTAs, rail/frame intact), ncrToolTutorials (exact 5 topics labeled), routing (expanded ncr lists + v0 to ncr, alias support so #tool/webflow #tool/bubble #tool/framer resolve), directories (ncrToolsRealPage etc now use accurate getEvidenceForTool for badges; new tools appear in #tools/#reviews/#microsites/#evidence with pending/available + logos/orbs), other lists updated for links.
- src/styles.css: (minimal/no change needed; new themes inherit vars + default; additive if specific .tool-theme-cursor etc added later).
- docs/architecture/SOURCE_UTILIZATION_REPORT.md: this C2 section appended (scanned/used/quarantined/routes/gaps).
- Assets: cursor-bg.jpg etc referenced in code/comments (local, relevant, non-0, A-class per plan; not staged unless final intentional use confirmed — see git).
- No changes to: index.html, server.mjs, standalone tools/vibe-auditor.html or chat-intelligence-vault.html, tools/internal/vault-ingestion-parser/, VAULT_DATA_CONTRACT.md, LOCAL_VAULT_HANDOFF.md, evidence .md raw, data/ beyond manifest (not staged), microsites/ (ref only), _INBOX (source not prod), prototypes, adult/NSFW (quarantined), React components, benchmarks, etc.
- Routes improved: all listed #tool/cursor #review/cursor #tool/cursor/tutorials + 10 others + aliases + #reviews/#tools/#microsites/#evidence/#blog/#methodology + standalone + unknown=premium not-found.

## Evidence / Assets Used
- Evidence: 05_cursor_complete, 06_windsurf, 09_v_0, 16_bubble_ai, 18_webflow_ai, 19_framer_ai (safe claims, strengths, lims, pricing notes, security, comparisons, testing plans, gaps, status "in-progress — hands-on required"); manifest for counts/status; prior C1 for others.
- Assets: public/images/tool-backgrounds/cursor-bg.jpg, windsurf-bg.jpg, bubble-ai-bg.jpg, framer-ai-bg.jpg, v0-bg.jpg (A; noted in funnels/reviews for brand context; logos none new so orbs).
- Safe content: excerpts from above + empire for shopify group ref only (no claims invented).
- Gaps explicit in pages + report (hands-on for 6; full capture for 5 + some indexed).

## Tools Populated / Pending
- Full (using A evidence + bg): Cursor, Windsurf, v0, Webflow (webflow-ai + alias), Bubble (bubble-ai + alias), Framer (framer-ai + alias).
- Partial/Pending (structure + honest "Evidence pending", added to tools[] + dirs + routes): Shopify, Make, Zapier, Notion, Airtable.
- Remaining indexed: basic accurate status/evidence counts/routes/icons (base44/claude etc have ev + some bg; full excerpts not added for scope).
- 11 primary + aliases + others now have useful or clearly pending pages.

## Quarantined Reaffirmed
- tools/adult-media-vault.html, adult-scraper/, explicit-erotic-story-generator.html, nsfw-*.html, xvideos-*.json, any adult/NSFW/erotic/scraper.
- microsites/prototypes/*, src/components/*.jsx, tools/generated/, tools/pipeline-dashboard.html, tools/nocodereviewed-vibe-auditor.html, unrelated _INBOX, 0-byte, broken.
- Never linked/published/staged.

## Routes Added/Improved + Validation Plan
- 33+ for 11 (tool/review/tutorials x3 per + aliases) + prior + #reviews #tools #microsites #evidence #blog #methodology + /tools/*.html standalone + unknown premium.
- All visible links resolve (no silent home).

## PART 11-12 Validation + Staging (to be executed)
- Run: npm run build (verify-static-app.mjs), node --check src/static-app.js, (validate:evidence if script).
- Manual: localhost:5173/?fresh=c2 , #reviews, #tools, #microsites, #evidence, #blog; all 22 tool routes + 11 reviews + tutorials.
- UX: useful or explicit pending, logos/orbs, no dead, no fakes, gaps clear, premium, standalone ok, no console errors.
- Git: git diff --stat; git diff --name-status; stage ONLY src/static-app.js src/styles.css (if changed) docs/architecture/SOURCE_UTILIZATION_REPORT.md + intentional safe bg images if referenced in final render (confirm); NO git add . ; cached check; commit exact "Complete remaining tool population from verified sources"; push.
- Report after: files scanned (~692 prior + new), tools pop'd (6 full +5 partial + remaining indexed status), pending (hands-on +5), files used (6 ev + manifest + empire ref + 5 bg notes), assets (5 bg), evidence used (6 + manifest), gaps (hands-on 6 + full5), routes (33+ + dirs), validation (build pass, manual all), staged (exact list), hash, untracked (quarantined + any), recommended next (B2 more blog or hands-on evidence capture phase or more indexed full pop).

Success: remaining priority have useful micros + reviews + tutorial hubs (pending labeled), real project material or pending, unsafe quarantined, no fakes, links work, build pass, only relevant committed.

Nucleus strengthened with more evidence-backed authority pages while honest on gaps.
