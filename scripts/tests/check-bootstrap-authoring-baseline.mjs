// Compare current authored records without relying on SQL row/property ordering.
// The expected hashes come from executing the accepted pre-cleanup bootstrap.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const actual = JSON.parse(readFileSync(process.argv[2], 'utf8').replace(/^\uFEFF/, ''));
const expected = JSON.parse(readFileSync(fileURLToPath(new URL('./fixtures/bootstrap-current-authoring-baseline.json', import.meta.url)), 'utf8'));
for (const [table, baseline] of Object.entries(expected.tables)) {
  const rows = actual[table];
  assert.ok(Array.isArray(rows), `${table}: expected current authored rows`);
  const normalized = rows.map(row => JSON.stringify(Object.fromEntries(Object.entries(row).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)))).sort();
  const hash = createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
  assert.equal(rows.length, baseline.count, `${table}: current authored row count changed`);
  assert.equal(hash, baseline.sha256, `${table}: current authored values changed`);
}
console.log('PASS: all six current authoring tables match the original bootstrap values.');
