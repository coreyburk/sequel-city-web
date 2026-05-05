import type {
  QueryHistoryRecord,
  QueryHistoryResponse
} from "../types/queryHistory.ts";

export type QueryHistoryRecordInput = Omit<
  QueryHistoryRecord,
  "id" | "timestamp"
>;

type TimestampFactory = () => string;

export interface QueryHistoryService {
  addRecord: (record: QueryHistoryRecordInput) => QueryHistoryRecord;
  getRecords: () => QueryHistoryRecord[];
  reset: () => void;
}

export function createQueryHistoryService(
  createTimestamp: TimestampFactory = () => new Date().toISOString()
): QueryHistoryService {
  const records: QueryHistoryRecord[] = [];
  let nextId = 1;

  return {
    addRecord(record: QueryHistoryRecordInput): QueryHistoryRecord {
      const createdRecord: QueryHistoryRecord = {
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
    getRecords(): QueryHistoryRecord[] {
      return [...records].reverse();
    },
    reset(): void {
      records.length = 0;
      nextId = 1;
    }
  };
}

const queryHistoryService = createQueryHistoryService();

export function addQueryHistoryRecord(
  record: QueryHistoryRecordInput
): QueryHistoryRecord {
  return queryHistoryService.addRecord(record);
}

export function getQueryHistoryRecords(): QueryHistoryRecord[] {
  return queryHistoryService.getRecords();
}

export function getQueryHistoryResponse(): QueryHistoryResponse {
  return {
    success: true,
    data: {
      records: getQueryHistoryRecords()
    }
  };
}

export function resetQueryHistoryForTests(): void {
  queryHistoryService.reset();
}
