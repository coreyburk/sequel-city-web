import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HealthStatus } from "./HealthStatus";
import { applyDatabaseUpgrade, getFullHealth } from "../api/client";
import { BACKEND_UNAVAILABLE_GUIDANCE } from "../guidance";

vi.mock("../api/client", () => ({
  applyDatabaseUpgrade: vi.fn(),
  getFullHealth: vi.fn()
}));

describe("HealthStatus", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders actionable backend unavailable guidance", async () => {
    vi.mocked(getFullHealth).mockRejectedValue(new Error(BACKEND_UNAVAILABLE_GUIDANCE));

    render(<HealthStatus />);

    await waitFor(() => {
      expect(screen.getByText(BACKEND_UNAVAILABLE_GUIDANCE)).toBeInTheDocument();
    });
  });

  it("shows an in-app upgrade action when bootstrap apply is available and refreshes on success", async () => {
    const onUpgradeApplied = vi.fn();

    vi.mocked(getFullHealth)
      .mockResolvedValueOnce({
        success: true,
        data: {
          api: "ok",
          database: {
            status: "ok",
            isConnected: true,
            databaseName: "SequelCityCrimesDB",
            serverName: "SEQUELCITY",
            message: "Database connection successful."
          },
          bootstrap: {
            mode: "verify",
            status: "degraded",
            migrated: false,
            usedBootstrapCredentials: false,
            canApplyInApp: true,
            applyActionMessage: null,
            message: "Upgrade required.",
            hasSchemaVersionTable: false,
            expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
            currentMigrationKey: null,
            pendingMigrationKeys: ["2026-05-21-001-create-case-answer-key-table.sql"]
          },
          schema: {
            status: "ok",
            tableCount: 10,
            relationshipCount: 8,
            message: "Schema metadata loaded successfully."
          }
        }
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          api: "ok",
          database: {
            status: "ok",
            isConnected: true,
            databaseName: "SequelCityCrimesDB",
            serverName: "SEQUELCITY",
            message: "Database connection successful."
          },
          bootstrap: {
            mode: "apply",
            status: "ready",
            migrated: true,
            usedBootstrapCredentials: true,
            canApplyInApp: true,
            applyActionMessage: null,
            message: "Ready.",
            hasSchemaVersionTable: true,
            expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
            currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
            pendingMigrationKeys: []
          },
          schema: {
            status: "ok",
            tableCount: 10,
            relationshipCount: 8,
            message: "Schema metadata loaded successfully."
          }
        }
      });

    vi.mocked(applyDatabaseUpgrade).mockResolvedValue({
      success: true,
      data: {
        bootstrap: {
          mode: "apply",
          status: "ready",
          migrated: true,
          usedBootstrapCredentials: true,
          canApplyInApp: true,
          applyActionMessage: null,
          message: "Ready.",
          hasSchemaVersionTable: true,
          expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          pendingMigrationKeys: []
        }
      },
      message: "Classroom database upgrade completed."
    });

    render(<HealthStatus onUpgradeApplied={onUpgradeApplied} />);

    fireEvent.click(await screen.findByRole("button", { name: "Apply Required Upgrade" }));

    await waitFor(() => {
      expect(applyDatabaseUpgrade).toHaveBeenCalledTimes(1);
      expect(applyDatabaseUpgrade).toHaveBeenCalledWith();
    });
    await waitFor(() => {
      expect(screen.getByText("Classroom database upgrade completed.")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(onUpgradeApplied).toHaveBeenCalledTimes(1);
    });
  });

  it("shows the Windows-integrated first-run upgrade guidance when Sequel Detective still needs to provision its own accounts", async () => {
    vi.mocked(getFullHealth)
      .mockResolvedValueOnce({
        success: true,
        data: {
          api: "ok",
          database: {
            status: "ok",
            isConnected: true,
            databaseName: "SequelCityCrimesDB",
            serverName: "SEQUELCITY",
            message: "Database connection successful."
          },
          bootstrap: {
            mode: "verify",
            status: "degraded",
            migrated: false,
            usedBootstrapCredentials: false,
            canApplyInApp: true,
            applyActionMessage: null,
            message: "Upgrade required.",
            hasSchemaVersionTable: false,
            expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
            currentMigrationKey: null,
            pendingMigrationKeys: ["2026-05-21-001-create-case-answer-key-table.sql"]
          },
          schema: {
            status: "ok",
            tableCount: 10,
            relationshipCount: 8,
            message: "Schema metadata loaded successfully."
          }
        }
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          api: "ok",
          database: {
            status: "ok",
            isConnected: true,
            databaseName: "SequelCityCrimesDB",
            serverName: "SEQUELCITY",
            message: "Database connection successful."
          },
          bootstrap: {
            mode: "apply",
            status: "ready",
            migrated: true,
            usedBootstrapCredentials: true,
            canApplyInApp: true,
            applyActionMessage: null,
            message: "Ready.",
            hasSchemaVersionTable: true,
            expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
            currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
            pendingMigrationKeys: []
          },
          schema: {
            status: "ok",
            tableCount: 10,
            relationshipCount: 8,
            message: "Schema metadata loaded successfully."
          }
        }
      });

    vi.mocked(applyDatabaseUpgrade).mockResolvedValue({
      success: true,
      data: {
        bootstrap: {
          mode: "apply",
          status: "ready",
          migrated: true,
          usedBootstrapCredentials: true,
          canApplyInApp: true,
          applyActionMessage: null,
          message: "Ready.",
          hasSchemaVersionTable: true,
          expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
          pendingMigrationKeys: []
        }
      },
      message: "Classroom database upgrade completed."
    });

    render(<HealthStatus />);

    expect(
      await screen.findByText(
        /it will use the local Windows administrator authority on this machine to create its own SQL accounts/i
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Apply Required Upgrade" }));

    await waitFor(() => {
      expect(applyDatabaseUpgrade).toHaveBeenCalledWith();
    });
    await waitFor(() => {
      expect(screen.getByText("Classroom database upgrade completed.")).toBeInTheDocument();
    });
  });
});
