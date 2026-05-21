const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const baseMigrationStatus = {
  hasSchemaVersionTable: true,
  expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
  currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
  appliedMigrationKeys: [
    "2026-05-21-001-create-case-answer-key-table.sql",
    "2026-05-21-002-seed-case-answer-key-case-004.sql",
    "2026-05-21-003-add-case-answer-key-foreign-key.sql",
    "2026-05-21-004-create-solution-verifier-user.sql",
    "2026-05-21-005-create-case-verification-objects.sql"
  ],
  pendingMigrationKeys: []
} as const;

const degradedMigrationStatus = {
  ...baseMigrationStatus,
  hasSchemaVersionTable: false,
  currentMigrationKey: null,
  appliedMigrationKeys: [],
  pendingMigrationKeys: [
    "2026-05-21-001-create-case-answer-key-table.sql",
    "2026-05-21-002-seed-case-answer-key-case-004.sql"
  ]
} as const;

const testCases: AsyncTestCase[] = [
  {
    name: "getDatabaseBootstrapMode defaults to verify",
    run: async () => {
      const bootstrapService =
        require("./databaseBootstrapService.ts") as typeof import("./databaseBootstrapService");

      assert.equal(bootstrapService.getDatabaseBootstrapMode(undefined), "verify");
      assert.equal(bootstrapService.getDatabaseBootstrapMode("VERIFY"), "verify");
      assert.equal(bootstrapService.getDatabaseBootstrapMode("apply"), "apply");
      assert.equal(bootstrapService.getDatabaseBootstrapMode("enforce"), "enforce");
      assert.equal(bootstrapService.getDatabaseBootstrapMode("unexpected"), "verify");
    }
  },
  {
    name: "getDatabaseBootstrapMode defaults to apply in non-production when bootstrap credentials exist",
    run: async () => {
      const bootstrapService =
        require("./databaseBootstrapService.ts") as typeof import("./databaseBootstrapService");
      const originalUser = process.env.SQLSERVER_BOOTSTRAP_USER;
      const originalPassword = process.env.SQLSERVER_BOOTSTRAP_PASSWORD;
      const originalNodeEnv = process.env.NODE_ENV;

      process.env.SQLSERVER_BOOTSTRAP_USER = "bootstrap_admin";
      process.env.SQLSERVER_BOOTSTRAP_PASSWORD = "top-secret";
      process.env.NODE_ENV = "development";

      try {
        assert.equal(bootstrapService.getDatabaseBootstrapMode(undefined), "apply");
      } finally {
        process.env.SQLSERVER_BOOTSTRAP_USER = originalUser;
        process.env.SQLSERVER_BOOTSTRAP_PASSWORD = originalPassword;
        process.env.NODE_ENV = originalNodeEnv;
      }
    }
  },
  {
    name: "ensureDatabaseBootstrapWithDependencies returns degraded verify-mode result when migrations are pending",
    run: async () => {
      const bootstrapService =
        require("./databaseBootstrapService.ts") as typeof import("./databaseBootstrapService");

      const originalMode = process.env.SQLSERVER_BOOTSTRAP_MODE;
      process.env.SQLSERVER_BOOTSTRAP_MODE = "verify";

      try {
        const result = await bootstrapService.ensureDatabaseBootstrapWithDependencies({
          getApplicationPool: async () => ({}) as never,
          getMigrationStatus: async () => degradedMigrationStatus,
          getBootstrapConfig: () => null,
          withBootstrapConnection: async () => {
            throw new Error("should not migrate in verify mode");
          },
          applyPendingMigrations: async () => baseMigrationStatus
        });

        assert.deepEqual(result, {
          mode: "verify",
          usedBootstrapCredentials: false,
          migrated: false,
          isReady: false,
          message:
            "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. Apply the latest database scripts, or restart with SQLSERVER_BOOTSTRAP_MODE=apply plus bootstrap admin credentials to finish setup automatically.",
          hasSchemaVersionTable: false,
          expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          currentMigrationKey: null,
          pendingMigrationKeys: [
            "2026-05-21-001-create-case-answer-key-table.sql",
            "2026-05-21-002-seed-case-answer-key-case-004.sql"
          ]
        });
      } finally {
        process.env.SQLSERVER_BOOTSTRAP_MODE = originalMode;
      }
    }
  },
  {
    name: "ensureDatabaseBootstrapWithDependencies applies pending migrations in apply mode",
    run: async () => {
      const bootstrapService =
        require("./databaseBootstrapService.ts") as typeof import("./databaseBootstrapService");

      const originalMode = process.env.SQLSERVER_BOOTSTRAP_MODE;
      process.env.SQLSERVER_BOOTSTRAP_MODE = "apply";
      let applied = false;

      try {
        const result = await bootstrapService.ensureDatabaseBootstrapWithDependencies({
          getApplicationPool: async () => ({}) as never,
          getMigrationStatus: async () => degradedMigrationStatus,
          getBootstrapConfig: () => ({}) as never,
          withBootstrapConnection: async (_config, action) => {
            applied = true;
            return action(({}) as never);
          },
          applyPendingMigrations: async () => baseMigrationStatus
        });

        assert.equal(applied, true);
        assert.deepEqual(result, {
          mode: "apply",
          usedBootstrapCredentials: true,
          migrated: true,
          isReady: true,
          message: "The case database was upgraded successfully and is ready for suspect verification.",
          hasSchemaVersionTable: true,
          expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          pendingMigrationKeys: []
        });
      } finally {
        process.env.SQLSERVER_BOOTSTRAP_MODE = originalMode;
      }
    }
  }
];

void runTests();

async function runTests(): Promise<void> {
  let failedCount = 0;

  for (const testCase of testCases) {
    try {
      await testCase.run();
      console.log(`PASS ${testCase.name}`);
    } catch (error) {
      failedCount += 1;
      console.error(`FAIL ${testCase.name}`);
      console.error(error);
    }
  }

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

