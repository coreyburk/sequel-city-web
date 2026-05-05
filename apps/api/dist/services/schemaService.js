"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaMetadata = getSchemaMetadata;
async function getSchemaMetadata(loadSchemaMetadata = loadSchemaMetadataFromDatabase) {
    const metadata = await loadSchemaMetadata();
    return {
        success: true,
        data: mapSchemaMetadata(metadata)
    };
}
async function loadSchemaMetadataFromDatabase() {
    const { getSqlServerPool } = await Promise.resolve().then(() => __importStar(require("../db/sqlServerPool.ts")));
    const pool = await getSqlServerPool();
    const [columnsResult, primaryKeysResult, relationshipsResult] = await Promise.all([
        pool.request().query(`
        SELECT
          ss.name AS schemaName,
          st.name AS tableName,
          sc.name AS columnName,
          sc.column_id AS ordinal,
          sty.name AS dataType,
          CONVERT(bit, sc.is_nullable) AS isNullable,
          CASE
            WHEN sty.name IN (
              'char', 'varchar', 'nchar', 'nvarchar',
              'binary', 'varbinary'
            )
            THEN CONVERT(int, sc.max_length)
            ELSE NULL
          END AS maxLength,
          CASE
            WHEN sty.name IN (
              'bigint', 'int', 'smallint', 'tinyint', 'bit',
              'decimal', 'numeric', 'money', 'smallmoney',
              'float', 'real'
            )
            THEN CONVERT(int, sc.precision)
            ELSE NULL
          END AS numericPrecision,
          CASE
            WHEN sty.name IN ('decimal', 'numeric')
            THEN CONVERT(int, sc.scale)
            ELSE NULL
          END AS numericScale
        FROM sys.tables AS st
        INNER JOIN sys.schemas AS ss
          ON ss.schema_id = st.schema_id
        INNER JOIN sys.columns AS sc
          ON sc.object_id = st.object_id
        INNER JOIN sys.types AS sty
          ON sty.user_type_id = sc.user_type_id
        WHERE st.is_ms_shipped = 0
        ORDER BY
          ss.name,
          st.name,
          sc.column_id
      `),
        pool.request().query(`
        SELECT
          ss.name AS schemaName,
          st.name AS tableName,
          skc.name AS constraintName,
          sc.name AS columnName,
          sic.key_ordinal AS keyOrdinal
        FROM sys.key_constraints AS skc
        INNER JOIN sys.tables AS st
          ON st.object_id = skc.parent_object_id
        INNER JOIN sys.schemas AS ss
          ON ss.schema_id = st.schema_id
        INNER JOIN sys.index_columns AS sic
          ON sic.object_id = skc.parent_object_id
          AND sic.index_id = skc.unique_index_id
        INNER JOIN sys.columns AS sc
          ON sc.object_id = sic.object_id
          AND sc.column_id = sic.column_id
        WHERE skc.type = 'PK'
          AND st.is_ms_shipped = 0
        ORDER BY
          ss.name,
          st.name,
          skc.name,
          sic.key_ordinal
      `),
        pool.request().query(`
        SELECT
          sfk.name AS constraintName,
          sourceSchema.name AS sourceSchema,
          sourceTable.name AS sourceTable,
          sourceColumn.name AS sourceColumn,
          targetSchema.name AS targetSchema,
          targetTable.name AS targetTable,
          targetColumn.name AS targetColumn
        FROM sys.foreign_keys AS sfk
        INNER JOIN sys.foreign_key_columns AS sfkc
          ON sfkc.constraint_object_id = sfk.object_id
        INNER JOIN sys.tables AS sourceTable
          ON sourceTable.object_id = sfkc.parent_object_id
        INNER JOIN sys.schemas AS sourceSchema
          ON sourceSchema.schema_id = sourceTable.schema_id
        INNER JOIN sys.columns AS sourceColumn
          ON sourceColumn.object_id = sfkc.parent_object_id
          AND sourceColumn.column_id = sfkc.parent_column_id
        INNER JOIN sys.tables AS targetTable
          ON targetTable.object_id = sfkc.referenced_object_id
        INNER JOIN sys.schemas AS targetSchema
          ON targetSchema.schema_id = targetTable.schema_id
        INNER JOIN sys.columns AS targetColumn
          ON targetColumn.object_id = sfkc.referenced_object_id
          AND targetColumn.column_id = sfkc.referenced_column_id
        WHERE sourceTable.is_ms_shipped = 0
          AND targetTable.is_ms_shipped = 0
        ORDER BY
          sfk.name,
          sourceTable.name,
          sourceColumn.name
      `)
    ]);
    return {
        columns: columnsResult.recordset,
        primaryKeys: primaryKeysResult.recordset,
        relationships: relationshipsResult.recordset
    };
}
function mapSchemaMetadata(metadata) {
    const primaryKeyMap = buildPrimaryKeyMap(metadata.primaryKeys);
    const foreignKeyColumns = new Set(metadata.relationships.map((relationship) => createColumnKey(relationship.sourceSchema, relationship.sourceTable, relationship.sourceColumn)));
    const primaryKeyColumns = new Set();
    for (const primaryKey of primaryKeyMap.values()) {
        for (const columnName of primaryKey.columns) {
            primaryKeyColumns.add(createColumnKey(primaryKey.schemaName, primaryKey.tableName, columnName));
        }
    }
    const tableMap = new Map();
    for (const row of metadata.columns) {
        const tableKey = createTableKey(row.schemaName, row.tableName);
        const table = tableMap.get(tableKey) ??
            createSchemaTable(row.schemaName, row.tableName, primaryKeyMap.get(tableKey) ?? null);
        const columnKey = createColumnKey(row.schemaName, row.tableName, row.columnName);
        table.columns.push({
            columnName: row.columnName,
            ordinal: row.ordinal,
            dataType: row.dataType,
            isNullable: row.isNullable,
            maxLength: row.maxLength,
            numericPrecision: row.numericPrecision,
            numericScale: row.numericScale,
            isPrimaryKey: primaryKeyColumns.has(columnKey),
            isForeignKey: foreignKeyColumns.has(columnKey)
        });
        tableMap.set(tableKey, table);
    }
    const tables = Array.from(tableMap.values()).sort(compareTables);
    for (const table of tables) {
        table.columns.sort((left, right) => left.ordinal - right.ordinal);
    }
    const relationships = [...metadata.relationships]
        .sort(compareRelationships)
        .map((relationship) => ({
        constraintName: relationship.constraintName,
        sourceSchema: relationship.sourceSchema,
        sourceTable: relationship.sourceTable,
        sourceColumn: relationship.sourceColumn,
        targetSchema: relationship.targetSchema,
        targetTable: relationship.targetTable,
        targetColumn: relationship.targetColumn
    }));
    return {
        tables,
        relationships
    };
}
function buildPrimaryKeyMap(rows) {
    const primaryKeyMap = new Map();
    const sortedRows = [...rows].sort((left, right) => {
        const tableComparison = compareTableKeys(left.schemaName, left.tableName, right.schemaName, right.tableName);
        if (tableComparison !== 0) {
            return tableComparison;
        }
        if (left.constraintName !== right.constraintName) {
            return left.constraintName.localeCompare(right.constraintName);
        }
        return left.keyOrdinal - right.keyOrdinal;
    });
    for (const row of sortedRows) {
        const tableKey = createTableKey(row.schemaName, row.tableName);
        const primaryKey = primaryKeyMap.get(tableKey) ?? {
            schemaName: row.schemaName,
            tableName: row.tableName,
            name: row.constraintName,
            columns: []
        };
        primaryKey.columns.push(row.columnName);
        primaryKeyMap.set(tableKey, primaryKey);
    }
    return primaryKeyMap;
}
function createSchemaTable(schemaName, tableName, primaryKey) {
    return {
        schemaName,
        tableName,
        fullName: `${schemaName}.${tableName}`,
        columns: [],
        primaryKey: primaryKey === null
            ? null
            : {
                name: primaryKey.name,
                columns: [...primaryKey.columns]
            }
    };
}
function compareTables(left, right) {
    return compareTableKeys(left.schemaName, left.tableName, right.schemaName, right.tableName);
}
function compareTableKeys(leftSchema, leftTable, rightSchema, rightTable) {
    if (leftSchema !== rightSchema) {
        return leftSchema.localeCompare(rightSchema);
    }
    return leftTable.localeCompare(rightTable);
}
function compareRelationships(left, right) {
    if (left.constraintName !== right.constraintName) {
        return left.constraintName.localeCompare(right.constraintName);
    }
    if (left.sourceTable !== right.sourceTable) {
        return left.sourceTable.localeCompare(right.sourceTable);
    }
    return left.sourceColumn.localeCompare(right.sourceColumn);
}
function createTableKey(schemaName, tableName) {
    return `${schemaName}.${tableName}`;
}
function createColumnKey(schemaName, tableName, columnName) {
    return `${schemaName}.${tableName}.${columnName}`;
}
