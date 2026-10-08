const assert = require("node:assert/strict");
const { randomBytes } = require("node:crypto");
const { runtimeOrigins, runtimeSecret, capabilityFromCookie, csrfToken, checkCsrf } = require("./localLearnerService.ts");
const oldSecret = process.env.CASE_RUNTIME_SESSION_SECRET;
const oldOrigins = process.env.CASE_RUNTIME_ALLOWED_ORIGINS;
try {
  delete process.env.CASE_RUNTIME_SESSION_SECRET; assert.throws(runtimeSecret);
  process.env.CASE_RUNTIME_SESSION_SECRET = randomBytes(32).toString("base64url");
  const cap = randomBytes(32).toString("base64url");
  assert.equal(capabilityFromCookie(`other=x; sequel_owner=${cap}`), cap);
  assert.equal(capabilityFromCookie(`sequel_owner=${cap}; sequel_owner=${cap}`), null);
  assert.equal(capabilityFromCookie("sequel_owner=bad"), null);
  checkCsrf(cap, csrfToken(cap));
  assert.throws(() => checkCsrf(randomBytes(32).toString("base64url"), csrfToken(cap)));
  assert.throws(() => checkCsrf(cap, "wrong"));
  process.env.CASE_RUNTIME_ALLOWED_ORIGINS = "http://127.0.0.1:5173";
  assert.equal(runtimeOrigins().has("http://127.0.0.1:51730"), false);
  for (const origin of ["http://example.com", "http://127.0.0.1:5173/", "https://example.com/path"]) {
    process.env.CASE_RUNTIME_ALLOWED_ORIGINS = origin; assert.throws(runtimeOrigins);
  }
  console.log("PASS owner cookie, bound constant-time CSRF, mandatory secret and exact trusted origins");
} finally {
  for (const [key, value] of [["CASE_RUNTIME_SESSION_SECRET", oldSecret], ["CASE_RUNTIME_ALLOWED_ORIGINS", oldOrigins]]) { if (value === undefined) delete process.env[key!]; else process.env[key!] = value; }
}
