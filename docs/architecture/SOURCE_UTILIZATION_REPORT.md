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