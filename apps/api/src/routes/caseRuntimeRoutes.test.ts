const assert = require("node:assert/strict");
const Fastify = require("fastify");
const { randomBytes, randomUUID } = require("node:crypto");
const { registerCaseRuntimeRoutes } = require("./caseRuntimeRoutes.ts");
const { csrfToken } = require("../services/localLearnerService.ts");
async function run() {
  const oldSecret = process.env.CASE_RUNTIME_SESSION_SECRET;
  process.env.CASE_RUNTIME_SESSION_SECRET = randomBytes(32).toString("base64url");
  const app = Fastify({ ajv: { customOptions: { removeAdditional: false } } });
  const capability = randomBytes(32).toString("base64url");
  let calls = 0;
  const learner = { session: async () => ({ capability, csrfToken: csrfToken(capability) }), owner: async () => "test-owner" };
  const attempts = { repository: {}, fresh: async () => { calls++; return { task: { stepKey: "crime-type" } }; }, dossiers: async () => [], snapshot: async () => ({ revision: "0" }) };
  try {
    await registerCaseRuntimeRoutes(app, attempts, learner, true);
    const origin = "http://127.0.0.1:5173";
    assert.equal((await app.inject({ url: "/api/session" })).statusCode, 403);
    assert.equal((await app.inject({ url: "/api/session?bootstrap=1" })).statusCode, 403);
    assert.equal((await app.inject({ url: "/api/session?bootstrap=1", headers: { origin: "https://untrusted.example" } })).statusCode, 403);
    assert.equal((await app.inject({ url: "/api/session", headers: { origin: "http://127.0.0.1:51730" } })).statusCode, 403);
    const session = await app.inject({ url: "/api/session", headers: { origin } });
    assert.equal(session.statusCode, 200); assert.equal(session.json().capability, undefined);
    assert.match(session.headers["set-cookie"], /HttpOnly; SameSite=Strict/);
    const headers = { origin, cookie: `sequel_owner=${capability}`, "x-csrf-token": csrfToken(capability) };
    const payload = { requestId: randomUUID(), expectedRevision: "0" };
    const url = "/api/cases/case-001/attempts";
    assert.equal((await app.inject({ method: "POST", url, headers: { origin, cookie: headers.cookie }, payload })).statusCode, 403);
    assert.equal((await app.inject({ method: "POST", url, headers, payload: { ...payload, completed: true } })).statusCode, 400);
    assert.equal(calls, 0);
    assert.equal((await app.inject({ method: "POST", url, headers, payload })).statusCode, 200); assert.equal(calls, 1);
    assert.equal((await app.inject({ method: "PATCH", url: `/api/attempts/${randomUUID()}/workspace`, headers, payload: { ...payload, workspace: { draftSql: "", notes: [], selectedView: "workbench", proofs: ["future"] } } })).statusCode, 400);
    console.log("PASS runtime route origin, cookie/CSRF, strict mutation/workspace schemas and no capability response leakage");
  } finally { await app.close(); if (oldSecret === undefined) delete process.env.CASE_RUNTIME_SESSION_SECRET; else process.env.CASE_RUNTIME_SESSION_SECRET = oldSecret; }
}
run().catch((error: Error) => { console.error(error); process.exitCode = 1; });
