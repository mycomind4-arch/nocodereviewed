# VISUAL_SITEMAP_WORKSPACE.md

Phase A4 — Visual Sitemap Workspace with Link Health Graph

## Purpose
Interactive n8n-style visual sitemap at #sitemap showing all major routes, review pages, microsites, admin surfaces, standalone tools, and link health (green working / red broken with alert / amber pending).

Built 100% vanilla (SVG + absolute div nodes + JS drag/click/pan/zoom simulation, filters, inspector, search).

## Data Sources (in priority)
1. /api/admin/latest-sitemap-graph (parser-created sitemap-graph.json if written during audit flow)
2. /api/admin/latest-dashboard-state (enriched from panels.routes + panels.links)
3. Raw audit JSON (sections.routes + sections.links + sections.sitemapGraph if present from enhanced audit script)
4. Honest static_fallback (labeled in UI)

The audit script (run-universal-site-audit.mjs) now emits sitemapGraph in the result and writes sitemap-graph.json alongside the raw bundle and into parser inbox/parsed.

## Node / Edge Schema (in sitemap-graph.json)
See buildSitemapGraph in the audit script for the exact structure used.

Nodes include: id, label, route, type, group, status, description.
Edges: id, source, target, href, status, type.

## UI / Interaction
- Toolbar: Refresh from latest, Run Audit + Rebuild (calls admin audit endpoint then reloads graph), Back to Admin.
- Workspace: SVG edges + absolutely positioned nodes (draggable), dotted grid.
- Status colors: green working, red broken+⚠, amber pending, blue standalone.
- Inspector (right): node or edge details + "Open Route" / "Follow Link" actions.
- Filters + search (by status or text).
- Basic pan (background drag) + zoom buttons + reset.

## Admin Integration
#admin now has direct "Open Visual Sitemap" button next to the main audit run button.
Summary data (node/edge counts, broken) can be shown from latest dashboard or sitemap summary when available.

## Server
GET /api/admin/latest-sitemap-graph — returns {source, graph} where source is "parser", "raw_audit" or "static_fallback".
The endpoint prefers parsed sitemap-graph.json next to the latest dashboard-state.

## Validation Notes
- #sitemap must render distinct from #reviews.
- Broken edges show red + alert icon.
- No faked verified health when using fallback.
- Public Vibe Auditor and other pages remain untouched.

See ADMIN_DASHBOARD_DATA_PIPELINE.md for how sitemap-graph fits the parser-backed admin flow.
