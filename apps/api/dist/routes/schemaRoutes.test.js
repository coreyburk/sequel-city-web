"use strict";
const assert = require("node:assert/strict");
const testCases = [
    {
        name: "route handler delegates to schema service and returns the service result",
        run: async () => {
            const schemaRoutes = require("./schemaRoutes.ts");
            let callCount = 0;
            const handler = schemaRoutes.createSchemaTablesHandler(async () => {
                callCount += 1;
                return {
                    success: true,
                    data: {
                        tables: [
                            {
                                schemaName: "dbo",
                                tableName: "Cases",
                                fullName: "dbo.Cases",
                                columns: [],
                                primaryKey: null
                            }
                        ],
                        relationships: []
                    }
                };
            });
            const response = await handler();
            assert.equal(callCount, 1);
            assert.deepEqual(response, {
                success: true,
                data: {
                    tables: [
                        {
                            schemaName: "dbo",
                            tableName: "Cases",
                            fullName: "dbo.Cases",
                            columns: [],
                            primaryKey: null
                        }
                    ],
                    relationships: []
                }
            });
        }
    },
    {
        name: "route handler returns success false failure shape when schema service throws",
        run: async () => {
            const schemaRoutes = require("./schemaRoutes.ts");
            const handler = schemaRoutes.createSchemaTablesHandler(async () => {
                throw new Error("metadata unavailable");
            });
            const response = await handler();
            assert.deepEqual(response, {
                success: false,
                message: "metadata unavailable"
            });
        }
    },
    {
        name: "registered route stays thin and sets HTTP 500 for failures",
        run: async () => {
            const schemaRoutes = require("./schemaRoutes.ts");
            let routePath = "";
            let capturedHandler = null;
            let replyStatusCode = 200;
            await schemaRoutes.registerSchemaRoutes({
                get: (path, handler) => {
                    routePath = path;
                    capturedHandler = handler;
                }
            }, () => async () => ({
                success: false,
                message: "boom"
            }));
            assert.equal(routePath, "/api/schema/tables");
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
