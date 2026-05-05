"use strict";
const assert = require("node:assert/strict");
const testCases = [
    {
        name: "returns success true response shape with tables and relationships",
        run: async () => {
            const schemaService = require("./schemaService.ts");
            const result = await schemaService.getSchemaMetadata(async () => ({
                columns: [
                    {
                        schemaName: "dbo",
                        tableName: "Cases",
                        columnName: "CaseId",
                        ordinal: 1,
                        dataType: "int",
                        isNullable: false,
                        maxLength: null,
                        numericPrecision: 10,
                        numericScale: null
                    }
                ],
                primaryKeys: [
                    {
                        schemaName: "dbo",
                        tableName: "Cases",
                        constraintName: "PK_Cases",
                        columnName: "CaseId",
                        keyOrdinal: 1
                    }
                ],
                relationships: []
            }));
            assert.equal(result.success, true);
            assert.ok("data" in result);
            assert.ok(Array.isArray(result.data.tables));
            assert.ok(Array.isArray(result.data.relationships));
            assert.equal("recordset" in result.data, false);
        }
    },
    {
        name: "shapes tables columns primary keys and relationships deterministically",
        run: async () => {
            const schemaService = require("./schemaService.ts");
            const result = await schemaService.getSchemaMetadata(async () => ({
                columns: [
                    {
                        schemaName: "crime",
                        tableName: "Witnesses",
                        columnName: "CaseId",
                        ordinal: 2,
                        dataType: "int",
                        isNullable: false,
                        maxLength: null,
                        numericPrecision: 10,
                        numericScale: null
                    },
                    {
                        schemaName: "dbo",
                        tableName: "Cases",
                        columnName: "CaseCode",
                        ordinal: 2,
                        dataType: "nvarchar",
                        isNullable: false,
                        maxLength: 50,
                        numericPrecision: null,
                        numericScale: null
                    },
                    {
                        schemaName: "crime",
                        tableName: "Witnesses",
                        columnName: "WitnessId",
                        ordinal: 1,
                        dataType: "int",
                        isNullable: false,
                        maxLength: null,
                        numericPrecision: 10,
                        numericScale: null
                    },
                    {
                        schemaName: "dbo",
                        tableName: "Cases",
                        columnName: "CaseId",
                        ordinal: 1,
                        dataType: "int",
                        isNullable: false,
                        maxLength: null,
                        numericPrecision: 10,
                        numericScale: null
                    },
                    {
                        schemaName: "crime",
                        tableName: "Suspects",
                        columnName: "Alias",
                        ordinal: 2,
                        dataType: "nvarchar",
                        isNullable: true,
                        maxLength: 100,
                        numericPrecision: null,
                        numericScale: null
                    },
                    {
                        schemaName: "crime",
                        tableName: "Suspects",
                        columnName: "SuspectId",
                        ordinal: 1,
                        dataType: "uniqueidentifier",
                        isNullable: false,
                        maxLength: null,
                        numericPrecision: null,
                        numericScale: null
                    }
                ],
                primaryKeys: [
                    {
                        schemaName: "crime",
                        tableName: "Witnesses",
                        constraintName: "PK_Witnesses",
                        columnName: "WitnessId",
                        keyOrdinal: 1
                    },
                    {
                        schemaName: "dbo",
                        tableName: "Cases",
                        constraintName: "PK_Cases",
                        columnName: "CaseCode",
                        keyOrdinal: 2
                    },
                    {
                        schemaName: "dbo",
                        tableName: "Cases",
                        constraintName: "PK_Cases",
                        columnName: "CaseId",
                        keyOrdinal: 1
                    }
                ],
                relationships: [
                    {
                        constraintName: "FK_Witnesses_Cases",
                        sourceSchema: "crime",
                        sourceTable: "Witnesses",
                        sourceColumn: "CaseId",
                        targetSchema: "dbo",
                        targetTable: "Cases",
                        targetColumn: "CaseId"
                    },
                    {
                        constraintName: "FK_Aliases_Suspects",
                        sourceSchema: "crime",
                        sourceTable: "Aliases",
                        sourceColumn: "SuspectId",
                        targetSchema: "crime",
                        targetTable: "Suspects",
                        targetColumn: "SuspectId"
                    }
                ]
            }));
            assert.deepEqual(result.data.tables.map((table) => `${table.schemaName}.${table.tableName}`), ["crime.Suspects", "crime.Witnesses", "dbo.Cases"]);
            const casesTable = result.data.tables[2];
            assert.deepEqual(casesTable.columns.map((column) => column.columnName), ["CaseId", "CaseCode"]);
            assert.deepEqual(casesTable.primaryKey, {
                name: "PK_Cases",
                columns: ["CaseId", "CaseCode"]
            });
            assert.deepEqual(casesTable.columns[0], {
                columnName: "CaseId",
                ordinal: 1,
                dataType: "int",
                isNullable: false,
                maxLength: null,
                numericPrecision: 10,
                numericScale: null,
                isPrimaryKey: true,
                isForeignKey: false
            });
            assert.deepEqual(casesTable.columns[1], {
                columnName: "CaseCode",
                ordinal: 2,
                dataType: "nvarchar",
                isNullable: false,
                maxLength: 50,
                numericPrecision: null,
                numericScale: null,
                isPrimaryKey: true,
                isForeignKey: false
            });
            const suspectsTable = result.data.tables[0];
            assert.equal(suspectsTable.primaryKey, null);
            assert.deepEqual(suspectsTable.columns[1], {
                columnName: "Alias",
                ordinal: 2,
                dataType: "nvarchar",
                isNullable: true,
                maxLength: 100,
                numericPrecision: null,
                numericScale: null,
                isPrimaryKey: false,
                isForeignKey: false
            });
            const witnessesTable = result.data.tables[1];
            assert.equal(witnessesTable.columns[1]?.isForeignKey, true);
            assert.equal(witnessesTable.columns[1]?.isPrimaryKey, false);
            assert.deepEqual(result.data.relationships, [
                {
                    constraintName: "FK_Aliases_Suspects",
                    sourceSchema: "crime",
                    sourceTable: "Aliases",
                    sourceColumn: "SuspectId",
                    targetSchema: "crime",
                    targetTable: "Suspects",
                    targetColumn: "SuspectId"
                },
                {
                    constraintName: "FK_Witnesses_Cases",
                    sourceSchema: "crime",
                    sourceTable: "Witnesses",
                    sourceColumn: "CaseId",
                    targetSchema: "dbo",
                    targetTable: "Cases",
                    targetColumn: "CaseId"
                }
            ]);
        }
    },
    {
        name: "preserves null metadata fields when not applicable",
        run: async () => {
            const schemaService = require("./schemaService.ts");
            const result = await schemaService.getSchemaMetadata(async () => ({
                columns: [
                    {
                        schemaName: "dbo",
                        tableName: "Evidence",
                        columnName: "Payload",
                        ordinal: 1,
                        dataType: "xml",
                        isNullable: true,
                        maxLength: null,
                        numericPrecision: null,
                        numericScale: null
                    }
                ],
                primaryKeys: [],
                relationships: []
            }));
            assert.deepEqual(result.data.tables[0]?.columns[0], {
                columnName: "Payload",
                ordinal: 1,
                dataType: "xml",
                isNullable: true,
                maxLength: null,
                numericPrecision: null,
                numericScale: null,
                isPrimaryKey: false,
                isForeignKey: false
            });
            assert.deepEqual(result.data.relationships, []);
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
