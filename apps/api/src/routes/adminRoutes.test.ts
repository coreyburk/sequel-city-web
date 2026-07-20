const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const testCases: AsyncTestCase[] = [
  {
    name: "admin bootstrap apply handler returns success payload when the upgrade succeeds",
    run: async () => {
      const adminRoutes = require("./adminRoutes.ts") as typeof import("./adminRoutes");

      const handler = adminRoutes.createAdminBootstrapApplyHandler(async () => ({
        success: true,
        message:
          "Classroom database upgrade completed. Student Mode is ready for the latest guided case flow.",
        bootstrap: {
          mode: "apply",
          usedBootstrapCredentials: true,
          migrated: true,
          isReady: true,
          identity: {
            status: "ready",
            message: "The case database identity is valid and up to date.",
            missingFacts: [],
            checkedFacts: ["table:dbo.PersonsOfInterest"]
          },
          canApplyInApp: true,
          applyActionMessage: null,
          message: "The case database was upgraded successfully and is ready for suspect verification.",
          hasSchemaVersionTable: true,
          expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          pendingMigrationKeys: []
        }
      }));

      const response = await handler();

      assert.deepEqual(response, {
        success: true,
        data: {
          bootstrap: {
            mode: "apply",
            status: "ready",
            identity: {
              status: "ready",
              message: "The case database identity is valid and up to date.",
              missingFacts: []
            },
            migrated: true,
            usedBootstrapCredentials: true,
            canApplyInApp: true,
            applyActionMessage: null,
            message: "The case database was upgraded successfully and is ready for suspect verification.",
            hasSchemaVersionTable: true,
            expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
            currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
            pendingMigrationKeys: []
          }
        },
        message:
          "Classroom database upgrade completed. Student Mode is ready for the latest guided case flow."
      });
    }
  },
  {
    name: "admin bootstrap apply handler returns failure payload when in-app upgrade is unavailable",
    run: async () => {
      const adminRoutes = require("./adminRoutes.ts") as typeof import("./adminRoutes");

      const handler = adminRoutes.createAdminBootstrapApplyHandler(async () => ({
        success: false,
        message:
          "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
        bootstrap: {
          mode: "apply",
          usedBootstrapCredentials: false,
          migrated: false,
          isReady: false,
          identity: {
            status: "stale",
            message:
              "The case database identity is valid, but required non-destructive migrations are pending.",
            missingFacts: [],
            checkedFacts: ["table:dbo.PersonsOfInterest"]
          },
          canApplyInApp: false,
          applyActionMessage:
            "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
          message:
            "The case database still needs a one-time upgrade before suspect checks and the latest guided case flow are available.",
          hasSchemaVersionTable: false,
          expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          currentMigrationKey: null,
          pendingMigrationKeys: ["2026-05-21-001-create-case-answer-key-table.sql"]
        }
      }));

      const response = await handler();

      assert.deepEqual(response, {
        success: false,
        data: {
          bootstrap: {
            mode: "apply",
            status: "degraded",
            identity: {
              status: "stale",
              message:
                "The case database identity is valid, but required non-destructive migrations are pending.",
              missingFacts: []
            },
            migrated: false,
            usedBootstrapCredentials: false,
            canApplyInApp: false,
            applyActionMessage:
              "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
            message:
              "The case database still needs a one-time upgrade before suspect checks and the latest guided case flow are available.",
            hasSchemaVersionTable: false,
            expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
            currentMigrationKey: null,
            pendingMigrationKeys: ["2026-05-21-001-create-case-answer-key-table.sql"]
          }
        },
        message:
          "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue."
      });
    }
  },
  {
    name: "registered admin route sets HTTP 409 when the in-app upgrade is unavailable",
    run: async () => {
      const adminRoutes = require("./adminRoutes.ts") as typeof import("./adminRoutes");

      let routePath = "";
      let replyStatusCode = 200;
      let routeHandler:
        | ((request: unknown, reply: { code: (statusCode: number) => void }) => Promise<unknown>)
        | undefined;

      await adminRoutes.registerAdminRoutes(
        {
          post: (
            path: string,
            handler: (request: unknown, reply: { code: (statusCode: number) => void }) => Promise<unknown>
          ) => {
            routePath = path;
            routeHandler = handler;
          }
        } as never,
        () =>
          adminRoutes.createAdminBootstrapApplyHandler(async () => ({
            success: false,
            message:
              "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
            bootstrap: {
              mode: "apply",
              usedBootstrapCredentials: false,
              migrated: false,
              isReady: false,
              identity: {
                status: "stale",
                message:
                  "The case database identity is valid, but required non-destructive migrations are pending.",
                missingFacts: [],
                checkedFacts: ["table:dbo.PersonsOfInterest"]
              },
              canApplyInApp: false,
              applyActionMessage:
                "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
              message:
                "The case database still needs a one-time upgrade before suspect checks and the latest guided case flow are available.",
              hasSchemaVersionTable: false,
              expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
              currentMigrationKey: null,
              pendingMigrationKeys: ["2026-05-21-001-create-case-answer-key-table.sql"]
            }
          }))
      );

      assert.equal(routePath, "/api/admin/bootstrap/apply");

      const response = await routeHandler?.(
        {},
        {
          code: (statusCode: number) => {
            replyStatusCode = statusCode;
          }
        }
      );

      assert.equal(replyStatusCode, 409);
      assert.equal((response as { success: false }).success, false);
      assert.deepEqual(
        (response as { data: { bootstrap: { identity: { status: string } } } }).data
          .bootstrap.identity.status,
        "stale"
      );
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
