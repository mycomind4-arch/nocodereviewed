import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 5173);
const storePath = join(root, "data", "local-store.json");
const vibeAuditDir = join(root, "data", "vibe-audits");
const vibeAuditOrdersPath = join(vibeAuditDir, "orders.json");
const vibeAuditEventsPath = join(vibeAuditDir, "events.json");
const vibeAuditReportsDir = join(vibeAuditDir, "reports");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
  ".pdf": "application/pdf",
};

function resolvePath(url) {
  const clean = normalize(decodeURIComponent(url.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const requested = clean === "/" ? "index.html" : clean.replace(/^[/\\]/, "");
  if (requested.startsWith("data/vibe-audits/")) return join(root, "index.html");
  const full = join(root, requested);
  if (!full.startsWith(root)) return join(root, "index.html");
  if (existsSync(full) && statSync(full).isFile()) return full;

  const publicFull = join(root, "public", requested);
  if (publicFull.startsWith(join(root, "public")) && existsSync(publicFull) && statSync(publicFull).isFile()) {
    return publicFull;
  }

  return join(root, "index.html");
}

async function readStore() {
  try {
    const store = JSON.parse(await readFile(storePath, "utf8"));
    return {
      benchmarkRuns: store.benchmarkRuns || [],
      articleBriefs: store.articleBriefs || [],
      evidenceSnapshots: store.evidenceSnapshots || [],
      reviewRecords: store.reviewRecords || [],
      artifacts: store.artifacts || [],
      qualityChecks: store.qualityChecks || [],
    };
  } catch {
    return { benchmarkRuns: [], articleBriefs: [], evidenceSnapshots: [], reviewRecords: [], artifacts: [], qualityChecks: [] };
  }
}

async function writeStore(store) {
  await mkdir(join(root, "data"), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2) + "\n");
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function readJsonArray(path) {
  try {
    const parsed = JSON.parse(await readFile(path, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJsonArray(path, items) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(items, null, 2) + "\n");
}

async function appendVibeAuditEvent(event) {
  const events = await readJsonArray(vibeAuditEventsPath);
  events.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...event,
  });
  await writeJsonArray(vibeAuditEventsPath, events.slice(0, 500));
}

function normalizeToolStack(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "")
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function vibeAuditOrderFromBody(body) {
  const now = new Date().toISOString();
  const tier = String(body.requestedTier || body.tier || "starter").trim().toLowerCase();
  return {
    id: `audit_${now.slice(0, 10).replace(/-/g, "")}_${crypto.randomUUID().slice(0, 8)}`,
    createdAt: now,
    updatedAt: now,
    status: "intake_received",
    paymentStatus: "manual_pending",
    tier: ["starter", "standard", "premium"].includes(tier) ? tier : "starter",
    customer: {
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
    },
    project: {
      name: String(body.projectName || "").trim(),
      description: String(body.projectDescription || "").trim(),
      url: String(body.projectUrl || "").trim(),
      toolStack: normalizeToolStack(body.toolStack),
      buildPlatform: String(body.buildPlatform || "").trim(),
      launchGoal: String(body.launchGoal || "").trim(),
      currentStatus: String(body.currentStatus || "").trim(),
      biggestConcern: String(body.biggestConcern || "").trim(),
      privacyNotes: String(body.privacyNotes || "").trim(),
    },
    operator: {
      assignedTo: "",
      timeSpentMinutes: 0,
      humanApproved: false,
    },
    report: {
      draftPath: "",
      finalPath: "",
      deliveredAt: null,
    },
    notes: [],
  };
}

function validateVibeAuditOrder(order) {
  const required = [
    [order.customer.name, "name"],
    [order.customer.email, "email"],
    [order.project.name, "projectName"],
    [order.project.description, "projectDescription"],
    [order.project.url, "projectUrl"],
    [order.project.buildPlatform, "buildPlatform"],
    [order.project.launchGoal, "launchGoal"],
    [order.project.currentStatus, "currentStatus"],
    [order.project.biggestConcern, "biggestConcern"],
  ];
  const missing = required.filter(([value]) => !value).map(([, field]) => field);
  if (!order.project.toolStack.length) missing.push("toolStack");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.customer.email)) missing.push("validEmail");
  return missing;
}

function buildVibeAuditReportMarkdown(order) {
  const created = new Date().toISOString();
  const tools = order.project.toolStack.length ? order.project.toolStack.join(", ") : "Not provided";
  const customerName = order.customer.name || "Customer";
  const projectName = order.project.name || "Untitled Project";
  return `# Vibe Launch Audit Draft — ${projectName}

**Order:** ${order.id}  
**Tier:** ${order.tier}  
**Generated:** ${created}  
**Customer:** ${customerName} <${order.customer.email || ""}>  
**Status:** DRAFT — Human review required before any customer-facing delivery or recommendations.

---

## Summary

${customerName} requested a ${order.tier} launch readiness audit for ${projectName}.

- **Project URL/share link:** ${order.project.url || "Not provided"}
- **Build platform:** ${order.project.buildPlatform || "Not provided"}
- **Tool stack:** ${tools}
- **Current status:** ${order.project.currentStatus || "Not provided"}
- **Launch goal:** ${order.project.launchGoal || "Not provided"}
- **Biggest concern:** ${order.project.biggestConcern || "Not provided"}

Project description (excerpt): ${order.project.description ? order.project.description.slice(0, 400) : "Not provided"}${order.project.privacyNotes ? `\n\nPrivacy notes: ${order.project.privacyNotes}` : ""}

---

## Launch Readiness Score (Placeholder / Checklist)

**Draft score: ___ / 100** (to be finalized only after human review of all gates)

Use the existing NoCodeReviewed evidence gates + public Vibe Auditor as baseline. Score each area 0-10 then average. Mark any area without direct evidence or hands-on verification as "evidence pending".

- [ ] Authentication & private routes / data isolation
- [ ] Secrets, env vars, and client-side exposure
- [ ] Data model / ownership / export / deletion paths
- [ ] Core user flows complete and error-handled
- [ ] Deployment, rollback, and hosting production-readiness
- [ ] Mobile / accessibility / performance basics
- [ ] Evidence, claims, and credibility support (no invented pricing, security posture, or capabilities)
- [ ] Maintainability / handoff / future iteration path
- [ ] Overall production confidence for the stated launch goal

**Notes on scoring:** This is a draft checklist. Operator must run the free public Vibe Auditor on the project link where possible and cross-reference docs/evidence/ before assigning numbers or removing "pending" flags.

---

## Blockers

List the highest-risk issues that must be resolved before launch. Base only on submitted info + known tool behaviors from evidence. Flag anything unverified.

- [ ] 
- [ ] 
- [ ] 

(Operator: expand with concrete examples from the intake and any public share link. Cite tool/version where relevant.)

---

## Quick Wins

Immediate, low-effort improvements that increase launch confidence.

- [ ] 
- [ ] 
- [ ] 

---

## Evidence / Credibility Gaps

Items in the project description, claims, or stack that currently lack supporting evidence in the NoCodeReviewed corpus or the submitted materials.

- Claims needing source support or hands-on verification.
- Pricing, feature, or "production-ready" statements that need current confirmation.
- Screenshots, exports, or artifacts that should be captured before final report.

---

## Tool-Stack Notes

Review the declared stack (${tools}) against existing evidence files in docs/evidence/ and the public Vibe Auditor methodology. Note version-specific behaviors, common pitfalls, and production considerations observed in reviews. Do not invent capabilities or security claims. Mark any finding "evidence pending" if not directly supported.

---

## Recommended Next Steps

1. Operator runs the public Vibe Auditor (tools/vibe-auditor.html) against the project URL/share and exports key findings.
2. Cross-check intake against current tool evidence (docs/evidence/* and data/intelligence-vault/evidence-manifest.json).
3. Fill in the readiness checklist and populate concrete blockers/wins with citations where possible.
4. Human review: Shane or Casey must approve all customer-facing recommendations, remove unsupported claims, confirm payment/scope, and set humanApproved=true.
5. Generate final deliverable (copy the approved draft to a final path or export as PDF/Markdown for email).
6. Deliver only after human approval gate. Send via email + private link if implemented.
7. Log time spent and any follow-up offer.

---

## Human Review Required Notice

**THIS IS AN INTERNAL DRAFT ONLY.**

No part of this draft may be sent to the customer until:
- Scope and payment status are confirmed.
- A human (Shane or Casey) has reviewed every recommendation for accuracy against evidence.
- Unsupported claims, hype, or guarantees have been removed.
- The humanApproved flag is set in the order record.
- The final report is explicitly approved for delivery.

---

## Disclaimer

This audit provides practical, evidence-informed recommendations only. It is not legal, financial, security, compliance, ranking, revenue, or launch-outcome advice. No results are guaranteed. All findings are limited to the information submitted and publicly available evidence at the time of review. Always perform your own due diligence and testing before launch.

---

*End of draft. Operator: edit above sections with specific observations, then mark human approval in admin before delivery.*
`;
}

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

async function handleApi(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (url.pathname === "/api/benchmark-runs" && request.method === "GET") {
    sendJson(response, 200, (await readStore()).benchmarkRuns || []);
    return true;
  }
  if (url.pathname === "/api/benchmark-runs" && request.method === "POST") {
    const body = await readJsonBody(request);
    const run = {
      id: crypto.randomUUID(),
      tool: String(body.tool || "").trim(),
      benchmark: String(body.benchmark || "").trim(),
      deployStatus: String(body.deployStatus || "Not tested").trim(),
      finalScore: Number.isFinite(Number(body.finalScore)) ? Number(body.finalScore) : null,
      evidenceNotes: String(body.evidenceNotes || "").trim(),
      createdAt: new Date().toISOString(),
    };
    if (!run.tool || !run.benchmark || !run.evidenceNotes) {
      sendJson(response, 400, { error: "tool, benchmark, and evidenceNotes are required" });
      return true;
    }
    const store = await readStore();
    store.benchmarkRuns = [run, ...(store.benchmarkRuns || [])];
    await writeStore(store);
    sendJson(response, 201, run);
    return true;
  }
  if (url.pathname === "/api/article-briefs" && request.method === "GET") {
    sendJson(response, 200, (await readStore()).articleBriefs || []);
    return true;
  }
  if (url.pathname === "/api/article-briefs" && request.method === "POST") {
    const body = await readJsonBody(request);
    const brief = {
      id: crypto.randomUUID(),
      title: String(body.title || "").trim(),
      targetKeyword: String(body.targetKeyword || "").trim(),
      articleType: String(body.articleType || "").trim(),
      requiredEvidence: String(body.requiredEvidence || "").trim(),
      angle: String(body.angle || "").trim(),
      publishGate: String(body.publishGate || "").trim(),
      status: "Briefed",
      createdAt: new Date().toISOString(),
    };
    if (!brief.title || !brief.targetKeyword || !brief.articleType || !brief.requiredEvidence || !brief.angle || !brief.publishGate) {
      sendJson(response, 400, { error: "title, targetKeyword, articleType, requiredEvidence, angle, and publishGate are required" });
      return true;
    }
    const store = await readStore();
    store.articleBriefs = [brief, ...(store.articleBriefs || [])];
    await writeStore(store);
    sendJson(response, 201, brief);
    return true;
  }
  if (url.pathname === "/api/evidence-snapshots" && request.method === "GET") {
    sendJson(response, 200, (await readStore()).evidenceSnapshots || []);
    return true;
  }
  if (url.pathname === "/api/evidence-snapshots" && request.method === "POST") {
    const body = await readJsonBody(request);
    const snapshot = {
      id: crypto.randomUUID(),
      tool: String(body.tool || "").trim(),
      sourceType: String(body.sourceType || "").trim(),
      sourceUrl: String(body.sourceUrl || "").trim(),
      pricingSummary: String(body.pricingSummary || "").trim(),
      featureSummary: String(body.featureSummary || "").trim(),
      limitations: String(body.limitations || "").trim(),
      checkedAt: new Date().toISOString(),
    };
    if (!snapshot.tool || !snapshot.sourceType || !snapshot.sourceUrl || !snapshot.pricingSummary || !snapshot.featureSummary) {
      sendJson(response, 400, { error: "tool, sourceType, sourceUrl, pricingSummary, and featureSummary are required" });
      return true;
    }
    const store = await readStore();
    store.evidenceSnapshots = [snapshot, ...(store.evidenceSnapshots || [])];
    await writeStore(store);
    sendJson(response, 201, snapshot);
    return true;
  }
  if (url.pathname === "/api/review-records" && request.method === "GET") {
    sendJson(response, 200, (await readStore()).reviewRecords || []);
    return true;
  }
  if (url.pathname === "/api/review-records" && request.method === "POST") {
    const body = await readJsonBody(request);
    const score = Number(body.score);
    const record = {
      id: String(body.id || crypto.randomUUID()),
      tool: String(body.tool || "").trim(),
      status: String(body.status || "Draft").trim(),
      score: Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : null,
      verdict: String(body.verdict || "").trim(),
      pros: String(body.pros || "").trim(),
      cons: String(body.cons || "").trim(),
      affiliateUrl: String(body.affiliateUrl || "").trim(),
      publishNotes: String(body.publishNotes || "").trim(),
      updatedAt: new Date().toISOString(),
    };
    if (!record.tool || !record.status || !record.verdict || !record.pros || !record.cons) {
      sendJson(response, 400, { error: "tool, status, verdict, pros, and cons are required" });
      return true;
    }
    const store = await readStore();
    const existing = (store.reviewRecords || []).find((item) => item.tool === record.tool);
    if (existing) record.id = existing.id;
    store.reviewRecords = [record, ...(store.reviewRecords || []).filter((item) => item.tool !== record.tool)];
    await writeStore(store);
    sendJson(response, 201, record);
    return true;
  }
  if (url.pathname === "/api/artifacts" && request.method === "GET") {
    sendJson(response, 200, (await readStore()).artifacts || []);
    return true;
  }
  if (url.pathname === "/api/artifacts" && request.method === "POST") {
    const body = await readJsonBody(request);
    const artifact = {
      id: crypto.randomUUID(),
      tool: String(body.tool || "").trim(),
      artifactType: String(body.artifactType || "").trim(),
      title: String(body.title || "").trim(),
      url: String(body.url || "").trim(),
      notes: String(body.notes || "").trim(),
      createdAt: new Date().toISOString(),
    };
    if (!artifact.tool || !artifact.artifactType || !artifact.title || !artifact.url) {
      sendJson(response, 400, { error: "tool, artifactType, title, and url are required" });
      return true;
    }
    const store = await readStore();
    store.artifacts = [artifact, ...(store.artifacts || [])];
    await writeStore(store);
    sendJson(response, 201, artifact);
    return true;
  }
  if (url.pathname === "/api/quality-checks" && request.method === "GET") {
    sendJson(response, 200, (await readStore()).qualityChecks || []);
    return true;
  }
  if (url.pathname === "/api/quality-checks" && request.method === "POST") {
    const body = await readJsonBody(request);
    const evidenceScore = Number(body.evidenceScore);
    const factualityScore = Number(body.factualityScore);
    const originalityScore = Number(body.originalityScore);
    const seoScore = Number(body.seoScore);
    const check = {
      id: crypto.randomUUID(),
      tool: String(body.tool || "").trim(),
      evidenceScore: Number.isFinite(evidenceScore) ? Math.max(0, Math.min(100, evidenceScore)) : null,
      factualityScore: Number.isFinite(factualityScore) ? Math.max(0, Math.min(100, factualityScore)) : null,
      originalityScore: Number.isFinite(originalityScore) ? Math.max(0, Math.min(100, originalityScore)) : null,
      seoScore: Number.isFinite(seoScore) ? Math.max(0, Math.min(100, seoScore)) : null,
      disclosureReady: String(body.disclosureReady || "No").trim(),
      notes: String(body.notes || "").trim(),
      checkedAt: new Date().toISOString(),
    };
    if (!check.tool || check.evidenceScore === null || check.factualityScore === null || check.originalityScore === null || check.seoScore === null || !check.notes) {
      sendJson(response, 400, { error: "tool, all quality scores, and notes are required" });
      return true;
    }
    const store = await readStore();
    store.qualityChecks = [check, ...(store.qualityChecks || [])];
    await writeStore(store);
    sendJson(response, 201, check);
    return true;
  }
  if (url.pathname === "/api/vibe-audits/orders" && request.method === "GET") {
    sendJson(response, 200, await readJsonArray(vibeAuditOrdersPath));
    return true;
  }
  if (url.pathname === "/api/vibe-audits/events" && request.method === "GET") {
    sendJson(response, 200, await readJsonArray(vibeAuditEventsPath));
    return true;
  }
  if (url.pathname === "/api/vibe-audits/intake" && request.method === "POST") {
    const body = await readJsonBody(request);
    const order = vibeAuditOrderFromBody(body);
    const missing = validateVibeAuditOrder(order);
    if (missing.length) {
      await appendVibeAuditEvent({ type: "intake_validation_failed", field: "vibe_launch_audit", metadata: { missing } });
      sendJson(response, 400, { error: "Missing or invalid required fields", missing });
      return true;
    }
    const orders = await readJsonArray(vibeAuditOrdersPath);
    orders.unshift(order);
    await writeJsonArray(vibeAuditOrdersPath, orders);
    await appendVibeAuditEvent({ type: "intake_submitted", orderId: order.id, tier: order.tier });
    sendJson(response, 201, { order, payment: { status: "manual_pending", message: "Manual payment confirmation required before fulfillment. Stripe Checkout can be enabled later with environment keys." } });
    return true;
  }
  const vibeAuditOrderPatch = url.pathname.match(/^\/api\/vibe-audits\/orders\/([^/]+)$/);
  if (vibeAuditOrderPatch && request.method === "PATCH") {
    const orderId = vibeAuditOrderPatch[1];
    const body = await readJsonBody(request);
    const allowedStatuses = new Set(["intake_received", "needs_scope_review", "payment_pending", "ready_for_audit", "draft_generated", "human_review", "approved", "delivered", "follow_up_sent", "canceled"]);
    const allowedPaymentStatuses = new Set(["manual_pending", "payment_pending", "paid", "refunded", "canceled"]);
    const orders = await readJsonArray(vibeAuditOrdersPath);
    const index = orders.findIndex((order) => order.id === orderId);
    if (index === -1) {
      sendJson(response, 404, { error: "Order not found" });
      return true;
    }
    const order = orders[index];
    if (body.status && allowedStatuses.has(String(body.status))) order.status = String(body.status);
    if (body.paymentStatus && allowedPaymentStatuses.has(String(body.paymentStatus))) order.paymentStatus = String(body.paymentStatus);
    if (body.assignedTo !== undefined) order.operator.assignedTo = String(body.assignedTo || "").trim();
    if (body.timeSpentMinutes !== undefined) {
      const minutes = Number(body.timeSpentMinutes);
      if (Number.isFinite(minutes) && minutes >= 0) order.operator.timeSpentMinutes = Math.round(minutes);
    }
    if (body.humanApproved !== undefined) order.operator.humanApproved = Boolean(body.humanApproved);
    if (body.note) order.notes = [{ at: new Date().toISOString(), text: String(body.note).trim() }, ...(order.notes || [])].slice(0, 20);
    if (order.status === "delivered" && !order.report.deliveredAt) order.report.deliveredAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    orders[index] = order;
    await writeJsonArray(vibeAuditOrdersPath, orders);
    await appendVibeAuditEvent({ type: "order_updated", orderId: order.id, status: order.status, paymentStatus: order.paymentStatus });
    sendJson(response, 200, order);
    return true;
  }
  const vibeAuditDraftRoute = url.pathname.match(/^\/api\/vibe-audits\/orders\/([^/]+)\/report-draft$/);
  if (vibeAuditDraftRoute && request.method === "POST") {
    const orderId = vibeAuditDraftRoute[1];
    const orders = await readJsonArray(vibeAuditOrdersPath);
    const index = orders.findIndex((order) => order.id === orderId);
    if (index === -1) {
      sendJson(response, 404, { error: "Order not found" });
      return true;
    }
    const order = orders[index];
    const report = buildVibeAuditReportMarkdown(order);
    await mkdir(vibeAuditReportsDir, { recursive: true });
    const reportPath = join(vibeAuditReportsDir, `${order.id}-draft.md`);
    await writeFile(reportPath, report);
    order.status = "draft_generated";
    order.report.draftPath = `data/vibe-audits/reports/${order.id}-draft.md`;
    order.updatedAt = new Date().toISOString();
    orders[index] = order;
    await writeJsonArray(vibeAuditOrdersPath, orders);
    await appendVibeAuditEvent({ type: "draft_generated", orderId: order.id, draftPath: order.report.draftPath });
    sendJson(response, 201, { order, report });
    return true;
  }
  if (url.pathname === "/api/checkout/vibe-audit" && request.method === "POST") {
    await appendVibeAuditEvent({ type: "checkout_started", metadata: { mode: "manual_fallback" } });
    sendJson(response, 200, {
      status: "manual_fallback",
      message: "Stripe Checkout is not enabled in this MVP. Confirm scope, then send a manual payment link before fulfillment.",
    });
    return true;
  }
  // PHASE A3: Parser-backed admin site intelligence (raw audit -> parser -> dashboard-state)
  if (url.pathname === "/api/admin/run-universal-audit" && request.method === "POST") {
    try {
      const { runUniversalSiteAudit } = await import('./scripts/run-universal-site-audit.mjs');
      const auditResult = await runUniversalSiteAudit(); // writes raw + inbox copy, status queued initially

      const rootDir = fileURLToPath(new URL(".", import.meta.url));
      const rawAuditPath = join(rootDir, auditResult.auditResultPath || '');
      const inboxPath = join(rootDir, auditResult.parserInboxPath || '');
      const auditRunId = auditResult.auditRunId;
      const parserOutputRoot = join(rootDir, 'data', 'intelligence-vault');
      const parsedAdminDir = join(rootDir, 'data', 'intelligence-vault', 'parsed', 'admin-site-audits', auditRunId);

      let parserStatus = 'queued';
      let dashboardState = null;

      // Invoke parser on the inbox (uses the universal-site-audit adapter we added)
      try {
        const { exec } = await import('node:child_process');
        const { promisify } = await import('node:util');
        const execP = promisify(exec);
        const cmd = `cd "${join(rootDir, 'tools/internal/vault-ingestion-parser')}" && npm run ingest -- -i "${inboxPath}" -o "${parserOutputRoot}" --source site-audit --account admin-local`;
        await execP(cmd, { timeout: 120000 });
        parserStatus = 'parsed';
      } catch (pe) {
        // honest fallback
        parserStatus = 'queued';
        await appendLogSafe(join(parserOutputRoot, 'ingestion.log'), `Admin site-audit parser ingest failed or not run: ${pe.message || pe}`);
      }

      // Generate parser-backed dashboard state from the raw audit (all detailed sections) + parser status
      // This makes the admin panels come from "parser flow" while using the rich raw data for panels.
      try {
        const raw = JSON.parse(await readFile(rawAuditPath, 'utf8'));
        dashboardState = buildAdminDashboardState(raw, auditRunId, parserStatus, rawAuditPath, parsedAdminDir);

        await mkdir(parsedAdminDir, { recursive: true });
        await writeFile(join(parsedAdminDir, 'dashboard-state.json'), JSON.stringify(dashboardState, null, 2) + '\n');

        // Write categorized records from the raw sections (parser normalized the vault side)
        const sec = raw.sections || {};
        await writeFile(join(parsedAdminDir, 'review-completion-records.json'), JSON.stringify(sec.reviews || [], null, 2) + '\n');
        await writeFile(join(parsedAdminDir, 'evidence-coverage-records.json'), JSON.stringify(sec.evidence || {}, null, 2) + '\n');
        await writeFile(join(parsedAdminDir, 'microsite-completion-records.json'), JSON.stringify(sec.microsites || [], null, 2) + '\n');
        await writeFile(join(parsedAdminDir, 'unsafe-exposure-records.json'), JSON.stringify(sec.unsafeExposure || {}, null, 2) + '\n');
        await writeFile(join(parsedAdminDir, 'recommended-actions.json'), JSON.stringify(sec.recommendedActions || [], null, 2) + '\n');
        await writeFile(join(parsedAdminDir, 'parser-manifest.json'), JSON.stringify({ auditRunId, parserStatus, parsedAt: new Date().toISOString() }, null, 2) + '\n');

        // A4: sitemap graph for visual workspace
        if (raw.sections && raw.sections.sitemapGraph) {
          await writeFile(join(parsedAdminDir, 'sitemap-graph.json'), JSON.stringify(raw.sections.sitemapGraph, null, 2) + '\n');
        }

        // latest pointer
        const latestPath = join(rootDir, 'data', 'intelligence-vault', 'parsed', 'admin-site-audits', 'latest.json');
        await writeFile(latestPath, JSON.stringify({ latest: `data/intelligence-vault/parsed/admin-site-audits/${auditRunId}/dashboard-state.json`, auditRunId }, null, 2) + '\n');
      } catch (ge) {
        // if generation fails, still return the raw summary with queued
        parserStatus = parserStatus === 'parsed' ? 'parsed' : 'queued';
      }

      const responsePayload = {
        ...auditResult,
        parserStatus,
        parsedDashboardStatePath: parserStatus === 'parsed' ? `data/intelligence-vault/parsed/admin-site-audits/${auditRunId}/dashboard-state.json` : null,
        dashboardState
      };
      sendJson(response, 200, responsePayload);
    } catch (e) {
      sendJson(response, 500, { ok: false, error: 'Audit failed: ' + (e.message || e), parserStatus: 'error' });
    }
    return true;
  }

  if (url.pathname === "/api/admin/latest-dashboard-state" && request.method === "GET") {
    try {
      const rootDir = fileURLToPath(new URL(".", import.meta.url));
      const latestPath = join(rootDir, 'data', 'intelligence-vault', 'parsed', 'admin-site-audits', 'latest.json');
      if (existsSync(latestPath)) {
        const latest = JSON.parse(await readFile(latestPath, 'utf8'));
        const statePath = join(rootDir, latest.latest || '');
        if (existsSync(statePath)) {
          const state = JSON.parse(await readFile(statePath, 'utf8'));
          sendJson(response, 200, { ok: true, dashboardState: state });
          return true;
        }
      }
      sendJson(response, 200, { ok: true, noAudit: true });
    } catch (e) {
      sendJson(response, 200, { ok: true, noAudit: true });
    }
    return true;
  }

  if (url.pathname === "/api/admin/latest-sitemap-graph" && request.method === "GET") {
    try {
      const rootDir = fileURLToPath(new URL(".", import.meta.url));
      const latestPath = join(rootDir, 'data', 'intelligence-vault', 'parsed', 'admin-site-audits', 'latest.json');
      if (existsSync(latestPath)) {
        const latest = JSON.parse(await readFile(latestPath, 'utf8'));
        // prefer dedicated sitemap-graph.json next to the dashboard-state
        const graphPath = join(rootDir, latest.latest.replace('dashboard-state.json', 'sitemap-graph.json'));
        if (existsSync(graphPath)) {
          const graph = JSON.parse(await readFile(graphPath, 'utf8'));
          sendJson(response, 200, { ok: true, source: 'parser', graph });
          return true;
        }
        // fallback to raw audit which now contains sections.sitemapGraph
        const rawPath = join(rootDir, latest.latest.replace('parsed/admin-site-audits/' + latest.auditRunId + '/dashboard-state.json', 'audit-runs/' + latest.auditRunId + '/universal-site-audit.json'));
        if (existsSync(rawPath)) {
          const raw = JSON.parse(await readFile(rawPath, 'utf8'));
          if (raw.sections && raw.sections.sitemapGraph) {
            sendJson(response, 200, { ok: true, source: 'raw_audit', graph: raw.sections.sitemapGraph });
            return true;
          }
        }
      }
      // honest static fallback
      sendJson(response, 200, { ok: true, source: 'static_fallback', graph: buildStaticSitemapFallback() });
    } catch (e) {
      sendJson(response, 200, { ok: true, source: 'static_fallback', graph: buildStaticSitemapFallback(), error: e.message });
    }
    return true;
  }
  return false;
}

function buildStaticSitemapFallback() {
  // Minimal honest fallback - label as such in UI
  const nodes = [
    { id: 'home', label: 'Home', route: '#home', type: 'core', group: 'core', status: 'working' },
    { id: 'reviews', label: 'Reviews', route: '#reviews', type: 'core', group: 'core', status: 'working' },
    { id: 'admin', label: 'Admin', route: '#admin', type: 'admin', group: 'admin', status: 'working' },
    { id: 'sitemap', label: 'Sitemap', route: '#sitemap', type: 'admin', group: 'admin', status: 'working' },
    { id: 'review/lovable', label: 'Lovable Review', route: '#review/lovable', type: 'review', group: 'reviews', status: 'working' },
    { id: 'tool/lovable', label: 'Lovable', route: '#tool/lovable', type: 'microsite', group: 'microsites', status: 'working' },
    { id: 'vibe-auditor', label: 'Vibe Auditor', route: '/tools/vibe-auditor.html', type: 'standalone_tool', group: 'standalone', status: 'working' }
  ];
  const edges = [
    { id: 'home-reviews', source: 'home', target: 'reviews', href: '#reviews', status: 'working', type: 'internal_hash' },
    { id: 'admin-sitemap', source: 'admin', target: 'sitemap', href: '#sitemap', status: 'working', type: 'internal_hash' },
    { id: 'reviews-lovable', source: 'reviews', target: 'review/lovable', href: '#review/lovable', status: 'working', type: 'internal_hash' },
    { id: 'lovable-pair', source: 'tool/lovable', target: 'review/lovable', href: '#review/lovable', status: 'working', type: 'internal_hash' }
  ];
  return {
    id: 'static_fallback',
    schema_version: '1.0.0',
    record_type: 'admin_visual_sitemap_graph',
    source: 'static_fallback',
    summary: { nodes: nodes.length, edges: edges.length, workingLinks: edges.length, brokenLinks: 0, placeholderRoutes: 0 },
    nodes,
    edges
  };
}

async function appendLogSafe(logPath, message) {
  try {
    const { appendFile, mkdir } = await import('node:fs/promises');
    await mkdir(dirname(logPath), { recursive: true });
    await appendFile(logPath, new Date().toISOString() + ' ' + message + '\n');
  } catch {}
}

function buildAdminDashboardState(rawAudit, auditRunId, parserStatus, rawPath, parsedDir) {
  const sections = rawAudit.sections || {};
  const summary = rawAudit.summary || {};
  const now = new Date().toISOString();

  const panels = {
    siteHealth: {
      filesScanned: summary.filesScanned || 0,
      routesChecked: summary.routesChecked || 0,
      linksChecked: summary.linksChecked || 0,
      evidenceFiles: summary.evidenceFiles || 0,
      reviewPagesChecked: summary.reviewPagesChecked || 0,
      micrositesChecked: summary.micrositesChecked || 0,
      unsafeExposureIssues: summary.unsafeExposureIssues || 0,
      criticalIssues: summary.criticalIssues || 0,
      recommendedActions: summary.recommendedActions || 0
    },
    routes: (sections.routes && sections.routes.missing ? sections.routes.missing.map(r => ({ route: r, status: 'missing' })) : []),
    links: (sections.links && sections.links.suspiciousUnsafeLinks ? sections.links.suspiciousUnsafeLinks.map(h => ({ href: h, status: 'suspicious' })) : []),
    evidenceCoverage: sections.evidence || {},
    reviewCompletion: sections.reviews || [],
    micrositeCompletion: sections.microsites || [],
    vibeAuditorGate: sections.vibeAuditorGate || { status: 'detected', note: 'Public Vibe Auditor preserved as standalone' },
    assetIntegrity: sections.assets || {},
    unsafeExposure: sections.unsafeExposure || {},
    parserHandoff: sections.parserHandoff || { status: parserStatus },
    recommendedActions: sections.recommendedActions || [],
    timeline: [
      { step: 'audit-started', at: rawAudit.created_at },
      { step: 'parser-' + parserStatus, at: now }
    ]
  };

  return {
    id: `dashboard_state_${auditRunId}`,
    schema_version: '1.0.0',
    record_type: 'admin_dashboard_state',
    source_audit_id: auditRunId,
    created_at: now,
    source_application: 'vault-ingestion-parser',
    privacy_level: 'local_private',
    parser_status: parserStatus,
    raw_audit_path: rawPath.replace ? rawPath.replace(process.cwd() + '/', '') : rawPath,
    parsed_output_path: parsedDir.replace ? parsedDir.replace(process.cwd() + '/', '') : parsedDir,
    summary,
    panels
  };
}

createServer(async (request, response) => {
  if ((request.url || "").startsWith("/api/")) {
    try {
      if (await handleApi(request, response)) return;
    } catch (error) {
      sendJson(response, 500, { error: error.message || "API error" });
      return;
    }
  }
  const file = resolvePath(request.url || "/");
  response.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
  createReadStream(file)
    .on("error", () => {
      response.statusCode = 500;
      response.end("Server error");
    })
    .pipe(response);
}).listen(port, "0.0.0.0", () => {
  console.log(`NoCode Reviews running at http://localhost:${port}`);
});
