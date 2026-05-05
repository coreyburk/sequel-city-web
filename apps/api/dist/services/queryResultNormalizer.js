"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeQueryResult = normalizeQueryResult;
function normalizeQueryResult(rawRowsOrRecordset) {
    const recordset = rawRowsOrRecordset;
    const rawRows = Array.from(rawRowsOrRecordset, (row) => ({ ...row }));
    const columnNames = getColumnNames(recordset, rawRows);
    const columns = columnNames.map((columnName, ordinal) => ({
        name: columnName,
        ordinal,
        dataType: detectColumnType(rawRows, columnName)
    }));
    const rows = rawRows.map((rawRow) => normalizeRow(rawRow, columnNames));
    return {
        columns,
        rows,
        rowCount: rows.length
    };
}
function getColumnNames(recordset, rawRows) {
    if (recordset.columns) {
        return Object.entries(recordset.columns).map(([columnName, column]) => (column.name ?? columnName));
    }
    const firstRow = rawRows[0];
    if (!firstRow) {
        return [];
    }
    return Object.keys(firstRow);
}
function detectColumnType(rawRows, columnName) {
    for (const rawRow of rawRows) {
        const value = rawRow[columnName];
        if (value === null || value === undefined) {
            continue;
        }
        if (typeof value === "string") {
            return "string";
        }
        if (typeof value === "number") {
            return "number";
        }
        if (typeof value === "boolean") {
            return "boolean";
        }
        if (value instanceof Date) {
            return "date";
        }
        return "unknown";
    }
    return "null";
}
function normalizeRow(rawRow, columnNames) {
    const values = {};
    const displayValues = {};
    for (const columnName of columnNames) {
        const rawValue = rawRow[columnName];
        values[columnName] = normalizeValue(rawValue);
        displayValues[columnName] = normalizeDisplayValue(rawValue);
    }
    return {
        values,
        displayValues
    };
}
function normalizeValue(value) {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return value;
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    return null;
}
function normalizeDisplayValue(value) {
    if (value === null || value === undefined) {
        return "";
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    try {
        return String(value);
    }
    catch {
        return Object.prototype.toString.call(value);
    }
}
