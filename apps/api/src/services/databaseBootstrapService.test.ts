const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

function restoreEnvValue(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

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

function createApplicationPoolWithManagedLogin(loginExists: boolean | (() => boolean)) {
  return {
    request: () => ({
      input: () => ({
        query: async () => ({
          recordset: [
            {
              loginExists: (typeof loginExists === "function" ? loginExists() : loginExists)
                ? 1
                : 0
            }
          ]
        })
      })
    })
  } as never;
}

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
        restoreEnvValue("SQLSERVER_BOOTSTRAP_USER", originalUser);
        restoreEnvValue("SQLSERVER_BOOTSTRAP_PASSWORD", originalPassword);
        restoreEnvValue("NODE_ENV", originalNodeEnv);
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
          getApplicationPool: async () => createApplicationPoolWithManagedLogin(false),
          getMigrationStatus: async () => degradedMigrationStatus,
          getBootstrapConfig: () => null,
          canUseIntegratedBootstrap: () => true,
          runIntegratedBootstrapProvisioning: async () => undefined,
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
          canApplyInApp: true,
          applyActionMessage: null,
          message:
            "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. Open Admin Mode and use Apply Required Upgrade so Sequel City can finish setup on this machine.",
          hasSchemaVersionTable: false,
          expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          currentMigrationKey: null,
          pendingMigrationKeys: [
            "2026-05-21-001-create-case-answer-key-table.sql",
            "2026-05-21-002-seed-case-answer-key-case-004.sql"
          ]
        });
      } finally {
        restoreEnvValue("SQLSERVER_BOOTSTRAP_MODE", originalMode);
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
          getApplicationPool: async () => createApplicationPoolWithManagedLogin(false),
          getMigrationStatus: async () => degradedMigrationStatus,
          getBootstrapConfig: () => ({}) as never,
          canUseIntegratedBootstrap: () => true,
          runIntegratedBootstrapProvisioning: async () => undefined,
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
          canApplyInApp: true,
          applyActionMessage: null,
          message: "The case database was upgraded successfully and is ready for suspect verification.",
          hasSchemaVersionTable: true,
          expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          pendingMigrationKeys: []
        });
      } finally {
        restoreEnvValue("SQLSERVER_BOOTSTRAP_MODE", originalMode);
      }
    }
  },
  {
    name: "ensureDatabaseBootstrapWithDependencies auto-applies in non-production when Sequel City's managed bootstrap login already exists",
    run: async () => {
      const bootstrapService =
        require("./databaseBootstrapService.ts") as typeof import("./databaseBootstrapService");

      const originalMode = process.env.SQLSERVER_BOOTSTRAP_MODE;
      const originalNodeEnv = process.env.NODE_ENV;
      delete process.env.SQLSERVER_BOOTSTRAP_MODE;
      process.env.NODE_ENV = "development";
      let applied = false;

      try {
        const result = await bootstrapService.ensureDatabaseBootstrapWithDependencies({
          getApplicationPool: async () => createApplicationPoolWithManagedLogin(true),
          getMigrationStatus: async () => degradedMigrationStatus,
          getBootstrapConfig: () => null,
          canUseIntegratedBootstrap: () => true,
          runIntegratedBootstrapProvisioning: async () => undefined,
          withBootstrapConnection: async (_config, action) => {
            applied = true;
            return action(({}) as never);
          },
          applyPendingMigrations: async () => baseMigrationStatus
        });

        assert.equal(applied, true);
        assert.equal(result.mode, "apply");
        assert.equal(result.migrated, true);
        assert.equal(result.isReady, true);
      } finally {
        restoreEnvValue("SQLSERVER_BOOTSTRAP_MODE", originalMode);
        restoreEnvValue("NODE_ENV", originalNodeEnv);
      }
    }
  },
  {
    name: "applyDatabaseBootstrapUpgradeWithDependencies reports unavailable when bootstrap credentials are missing",
    run: async () => {
      const bootstrapService =
        require("./databaseBootstrapService.ts") as typeof import("./databaseBootstrapService");

        const result = await bootstrapService.applyDatabaseBootstrapUpgradeWithDependencies({
          getApplicationPool: async () => createApplicationPoolWithManagedLogin(false),
          getMigrationStatus: async () => degradedMigrationStatus,
          getBootstrapConfig: () => null,
          canUseIntegratedBootstrap: () => false,
          runIntegratedBootstrapProvisioning: async () => {
            throw new Error("should not attempt integrated bootstrap when unavailable");
          },
          withBootstrapConnection: async () => {
            throw new Error("should not connect without bootstrap credentials");
          },
        applyPendingMigrations: async () => baseMigrationStatus
      });

      assert.deepEqual(result, {
        success: false,
        message:
          "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
        bootstrap: {
          mode: "apply",
          usedBootstrapCredentials: false,
          migrated: false,
          isReady: false,
          canApplyInApp: false,
          applyActionMessage:
            "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
          message:
            "The case database still needs a one-time upgrade before suspect checks and the latest guided case flow are available.",
          hasSchemaVersionTable: false,
          expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          currentMigrationKey: null,
          pendingMigrationKeys: [
            "2026-05-21-001-create-case-answer-key-table.sql",
            "2026-05-21-002-seed-case-answer-key-case-004.sql"
          ]
        }
      });
    }
  },
  {
    name: "applyDatabaseBootstrapUpgradeWithDependencies upgrades pending migrations when bootstrap credentials are available",
    run: async () => {
      const bootstrapService =
        require("./databaseBootstrapService.ts") as typeof import("./databaseBootstrapService");

        const result = await bootstrapService.applyDatabaseBootstrapUpgradeWithDependencies({
          getApplicationPool: async () => createApplicationPoolWithManagedLogin(false),
          getMigrationStatus: async () => degradedMigrationStatus,
          getBootstrapConfig: () => ({}) as never,
          canUseIntegratedBootstrap: () => true,
          runIntegratedBootstrapProvisioning: async () => undefined,
          withBootstrapConnection: async (_config, action) => action(({}) as never),
          applyPendingMigrations: async () => baseMigrationStatus
        });

      assert.deepEqual(result, {
        success: true,
        message:
          "Classroom database upgrade completed. Student Mode is ready for the latest guided case flow.",
        bootstrap: {
          mode: "apply",
          usedBootstrapCredentials: true,
          migrated: true,
          isReady: true,
          canApplyInApp: true,
          applyActionMessage: null,
          message: "The case database was upgraded successfully and is ready for suspect verification.",
          hasSchemaVersionTable: true,
          expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          pendingMigrationKeys: []
        }
      });
    }
  },
  {
    name: "applyDatabaseBootstrapUpgradeWithDependencies provisions Sequel City's managed accounts through Windows-integrated bootstrap when no bootstrap login exists yet",
    run: async () => {
      const bootstrapService =
        require("./databaseBootstrapService.ts") as typeof import("./databaseBootstrapService");

      let integratedProvisioningRuns = 0;
      let receivedConfig: { user?: string; password?: string } | null = null;
      let managedLoginExists = false;

      const result = await bootstrapService.applyDatabaseBootstrapUpgradeWithDependencies({
        getApplicationPool: async () =>
          createApplicationPoolWithManagedLogin(() => managedLoginExists),
        getMigrationStatus: async () => degradedMigrationStatus,
        getBootstrapConfig: () => null,
        canUseIntegratedBootstrap: () => true,
        runIntegratedBootstrapProvisioning: async () => {
          integratedProvisioningRuns += 1;
          managedLoginExists = true;
        },
        withBootstrapConnection: async (config, action) => {
          receivedConfig = {
            user: config.user,
            password: config.password
          };

          return action(({} as never));
        },
        applyPendingMigrations: async () => baseMigrationStatus
      });

      assert.equal(integratedProvisioningRuns, 1);
      assert.deepEqual(receivedConfig, {
        user: "sequel_bootstrap_user",
        password: "SQL-Bootstrap-PasSW0rd!"
      });
      assert.equal(result.success, true);
      assert.equal(result.bootstrap.usedBootstrapCredentials, true);
      assert.equal(result.bootstrap.isReady, true);
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

