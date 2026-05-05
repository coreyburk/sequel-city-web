"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryHistoryService = createQueryHistoryService;
exports.addQueryHistoryRecord = addQueryHistoryRecord;
exports.getQueryHistoryRecords = getQueryHistoryRecords;
exports.getQueryHistoryResponse = getQueryHistoryResponse;
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
        reset() {
            records.length = 0;
            nextId = 1;
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
function resetQueryHistoryForTests() {
    queryHistoryService.reset();
}
