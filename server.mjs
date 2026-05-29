import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
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
};

function resolvePath(url) {
  const clean = normalize(decodeURIComponent(url.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const requested = clean === "/" ? "index.html" : clean.replace(/^[/\\]/, "");
  const full = join(root, requested);
  if (!full.startsWith(root)) return join(root, "index.html");
  if (existsSync(full) && statSync(full).isFile()) return full;
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
  return false;
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
