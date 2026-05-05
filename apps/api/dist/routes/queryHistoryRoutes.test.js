"use strict";
const assert = require("node:assert/strict");
const sampleRecords = [
    {
        id: 2,
        timestamp: "2026-05-05T10:00:01.000Z",
        queryText: "SELECT 2",
        outcome: "success",
        rowCount: 1,
        executionTimeMs: 11,
        errorMessage: null
    },
    {
        id: 1,
        timestamp: "2026-05-05T10:00:00.000Z",
        queryText: "DELETE FROM Cases",
        outcome: "blocked",
        rowCount: null,
        executionTimeMs: 2,
        errorMessage: "DELETE statements are not allowed."
    }
];
const testCases = [
    {
        name: "route handler delegates to query history service and returns the expected response shape",
        run: async () => {
            const queryHistoryRoutes = require("./queryHistoryRoutes.ts");
            let callCount = 0;
            const handler = queryHistoryRoutes.createQueryHistoryHandler(() => {
                callCount += 1;
                return {
                    success: true,
                    data: {
                        records: sampleRecords
                    }
                };
            });
            const response = await handler();
            assert.equal(callCount, 1);
            assert.deepEqual(response, {
                success: true,
                data: {
                    records: sampleRecords
                }
            });
        }
    },
    {
        name: "route handler returns success false failure shape when history loading throws",
        run: async () => {
            const queryHistoryRoutes = require("./queryHistoryRoutes.ts");
            const handler = queryHistoryRoutes.createQueryHistoryHandler(() => {
                throw new Error("history unavailable");
            });
            const response = await handler();
            assert.deepEqual(response, {
                success: false,
                message: "history unavailable"
            });
        }
    },
    {
        name: "registered route stays thin and sets HTTP 500 for failures",
        run: async () => {
            const queryHistoryRoutes = require("./queryHistoryRoutes.ts");
            let routePath = "";
            let capturedHandler = null;
            let replyStatusCode = 200;
            await queryHistoryRoutes.registerQueryHistoryRoutes({
                get: (path, handler) => {
                    routePath = path;
                    capturedHandler = handler;
                }
            }, () => async () => ({
                success: false,
                message: "boom"
            }));
            assert.equal(routePath, "/api/query/history");
            assert.notEqual(capturedHandler, null);
            const response = await capturedHandler?.({}, {
                code: (statusCode) => {
                    replyStatusCode = statusCode;
                }
            });
            assert.equal(replyStatusCode, 500);
            assert.deepEqual(response, {
                success: false,
                message: "boom"
            });
        }
    }
];
void runTests();
async function runTests() {
    let failedCount = 0;
    for (const testCase of testCases) {
        try {
            await testCase.run();
            console.log(`PASS ${testCase.name}`);
        }
        catch (error) {
            failedCount += 1;
            console.error(`FAIL ${testCase.name}`);
            console.error(error);
        }
    }
    if (failedCount > 0) {
        process.exitCode = 1;
    }
}
