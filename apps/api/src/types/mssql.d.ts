declare module "mssql" {
  export interface config {
    server: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    options?: {
      trustServerCertificate?: boolean;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  export interface IColumnMetadata {
    index?: number;
    type?: {
      declaration?: string;
      name?: string;
    };
    [key: string]: unknown;
  }

  export interface IRecordSet<T> extends Array<T> {
    columns?: Record<string, IColumnMetadata>;
  }

  export interface IResult<T> {
    recordset: IRecordSet<T>;
    recordsets?: Array<IRecordSet<T>>;
    rowsAffected?: number[];
    output?: Record<string, unknown>;
  }

  export interface Request {
    input(name: string, type: unknown, value?: unknown): Request;
    query<T = Record<string, unknown>>(command: string): Promise<IResult<T>>;
    batch(command: string): Promise<IResult<Record<string, unknown>>>;
    execute<T = Record<string, unknown>>(procedure: string): Promise<IResult<T>>;
  }

  export class ConnectionPool {
    constructor(config: config);
    connect(): Promise<ConnectionPool>;
    close(): Promise<void>;
    request(): Request;
    on(eventName: string, listener: (...args: unknown[]) => void): ConnectionPool;
  }

  export function NVarChar(length?: number): unknown;

  const sql: {
    ConnectionPool: typeof ConnectionPool;
    NVarChar: typeof NVarChar;
  };

  export default sql;
}
