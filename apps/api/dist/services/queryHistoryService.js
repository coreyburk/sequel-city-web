"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryHistoryService = createQueryHistoryService;
exports.addQueryHistoryRecord = addQueryHistoryRecord;
exports.getQueryHistoryRecords = getQueryHistoryRecords;
exports.getQueryHistoryResponse = getQueryHistoryResponse;
exports.clearQueryHistoryResponse = clearQueryHistoryResponse;
exports.resetQueryHistoryForTests = resetQueryHistoryForTests;
function createQueryHistoryService(createTimestamp = () => new Date().toISOString()) {
    const records = [];
    let nextId = 1;
    return {
        addRecord(record) {
            const createdRecord = {
                id: nextId,
                timestamp: createTimestamp(),
                queryText: record.queryText,
                outcome: record.outcome,
                rowCount: record.rowCount,
                executionTimeMs: record.executionTimeMs,
                errorMessage: record.errorMessage
            };
            nextId += 1;
            records.push(createdRecord);
            return createdRecord;
        },
        getRecords() {
            return [...records].reverse();
        },
        clearRecords() {
            const clearedCount = records.length;
            records.length = 0;
            nextId = 1;
            return clearedCount;
        }
    };
}
const queryHistoryService = createQueryHistoryService();
function addQueryHistoryRecord(record) {
    return queryHistoryService.addRecord(record);
}
function getQueryHistoryRecords() {
    return queryHistoryService.getRecords();
}
function getQueryHistoryResponse() {
    return {
        success: true,
        data: {
            records: getQueryHistoryRecords()
        }
    };
}
function clearQueryHistoryResponse() {
    return {
        success: true,
        data: {
            clearedCount: queryHistoryService.clearRecords()
        }
    };
}
function resetQueryHistoryForTests() {
    queryHistoryService.clearRecords();
}
