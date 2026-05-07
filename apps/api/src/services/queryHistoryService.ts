import type {
  ClearQueryHistoryResponse,
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
  clearRecords: () => number;
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
    clearRecords(): number {
      const clearedCount = records.length;
      records.length = 0;
      nextId = 1;
      return clearedCount;
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

export function clearQueryHistoryResponse(): ClearQueryHistoryResponse {
  return {
    success: true,
    data: {
      clearedCount: queryHistoryService.clearRecords()
    }
  };
}

export function resetQueryHistoryForTests(): void {
  queryHistoryService.clearRecords();
}
