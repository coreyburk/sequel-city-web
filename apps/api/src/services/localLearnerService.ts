import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { CaseRuntimeRepository } from "../repositories/caseRuntimeRepository.ts";
import { CaseRuntimeError } from "../types/caseRuntime.ts";

export function runtimeOrigins(): Set<string> {
  const origins = (process.env.CASE_RUNTIME_ALLOWED_ORIGINS ?? "http://localhost:5173,http://127.0.0.1:5173").split(",").map(s => s.trim()).filter(Boolean);
  for (const origin of origins) {
    const url = new URL(origin);
    if (url.origin !== origin || (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)))) {
      throw new Error("Case runtime origins must be exact HTTPS origins or explicit HTTP loopback origins.");
    }
  }
  return new Set(origins);
}
export function runtimeSecret(): Buffer {
  const configured = process.env.CASE_RUNTIME_SESSION_SECRET;
  if (!configured || Buffer.byteLength(configured) < 32) throw new Error("Configure a stable CASE_RUNTIME_SESSION_SECRET of at least 32 random bytes; no default is provided.");
  return Buffer.from(configured);
}
export function capabilityFromCookie(cookie?: string): string | null {
  const values = (cookie ?? "").split(";").map(s => s.trim()).filter(s => s.startsWith("sequel_owner="));
  const capability = values.length === 1 ? values[0].slice("sequel_owner=".length) : "";
  return /^[A-Za-z0-9_-]{43}$/.test(capability) ? capability : null;
}
export function csrfToken(capability: string): string {
  return createHmac("sha256", runtimeSecret()).update(`csrf:${capability}`).digest("base64url");
}
export function checkCsrf(capability: string, token: unknown): void {
  const expected = Buffer.from(csrfToken(capability));
  const actual = Buffer.from(typeof token === "string" ? token : "");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new CaseRuntimeError(403, "Session protection failed. Reload the case session.");
}
export class LocalLearnerService {
  constructor(repository = new CaseRuntimeRepository()) { this.repository = repository; }
  private readonly repository: CaseRuntimeRepository;
  async session(cookie?: string): Promise<{ ownerId: string; capability: string; csrfToken: string }> {
    const capability = capabilityFromCookie(cookie) ?? randomBytes(32).toString("base64url");
    const ownerId = await this.repository.findOrCreateOwner(createHash("sha256").update(capability).digest("hex"));
    return { ownerId, capability, csrfToken: csrfToken(capability) };
  }
  async owner(cookie?: string): Promise<string> {
    const capability = capabilityFromCookie(cookie);
    if (!capability) throw new CaseRuntimeError(401, "Open a case session first.");
    // Existing capability only: safe reads must not create owners or mutate progress.
    return this.repository.findOwner(createHash("sha256").update(capability).digest("hex"));
  }
}
