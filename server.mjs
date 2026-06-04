import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 5173);
const storePath = join(root, "data", "local-store.json");

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
  return false;
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
