// Test-only real API readiness against the current-only fresh bootstrap.
import assert from 'node:assert/strict';
import sql from 'mssql';
import identityModule from '../../apps/api/src/services/databaseIdentityService.ts';
const { validateCaseRuntimeReadiness } = identityModule;
import repositoryModule from '../../apps/api/src/repositories/caseRuntimeRepository.ts';
const { CaseRuntimeRepository } = repositoryModule;
assert.equal(process.env.SEQUEL_CITY_SINGLE_TEST_SESSION, 'active', 'Exclusive test session required');
const pool = await new sql.ConnectionPool({
  server: 'localhost', port: 1433, database: 'SequelCityRuntimeTest_Workspace',
  user: process.env.SC_BOOTSTRAP_REPOSITORY_USER,
  password: process.env.SC_BOOTSTRAP_REPOSITORY_PASSWORD,
  options: { trustServerCertificate: true, encrypt: false }
}).connect();
try {
  const repository = new CaseRuntimeRepository(async () => pool);
  assert.ok(await repository.loadReleasedContent('case-001', 3));
  assert.ok(await repository.loadReleasedContent('case-004', 2));
  const readiness = await validateCaseRuntimeReadiness(pool);
  assert.equal(readiness.isReady, true, JSON.stringify(readiness.missingFacts));
  console.log('PASS: real restricted repository/API readiness with only current case releases.');
} finally { await pool.close(); }
