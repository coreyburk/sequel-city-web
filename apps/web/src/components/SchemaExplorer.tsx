import { useEffect, useState } from "react";
import { getSchemaTables } from "../api/client";
import type { SchemaResponse, SchemaTable } from "../api/types";
import { SCHEMA_UNAVAILABLE_GUIDANCE } from "../guidance";

export function SchemaExplorer(): JSX.Element {
  const [schema, setSchema] = useState<SchemaResponse | null>(null);
  const [selectedTableName, setSelectedTableName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSchema(): Promise<void> {
      try {
        const response = await getSchemaTables();

        if (!active) {
          return;
        }

        setSchema(response);
        setSelectedTableName(response.data.tables[0]?.fullName ?? null);
        setError(null);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(SCHEMA_UNAVAILABLE_GUIDANCE);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSchema();

    return () => {
      active = false;
    };
  }, []);

  const selectedTable =
    schema?.data.tables.find((table) => table.fullName === selectedTableName) ?? null;

  return (
    <section className="panel panel--full" aria-labelledby="schema-explorer-title">
      <h2 id="schema-explorer-title">Schema Explorer</h2>
      {loading ? <p className="message-muted">Loading schema...</p> : null}
      {error ? <p className="message-error">{error || SCHEMA_UNAVAILABLE_GUIDANCE}</p> : null}
      {schema ? (
        <>
          <p className="message-muted">
            Tables: {schema.data.tables.length} | Relationships:{" "}
            {schema.data.relationships.length}
          </p>
          <ul className="table-list">
            {schema.data.tables.map((table) => (
              <li key={table.fullName}>
                <button
                  type="button"
                  onClick={() => setSelectedTableName(table.fullName)}
                  aria-pressed={selectedTableName === table.fullName}
                >
                  {table.fullName}
                </button>
              </li>
            ))}
          </ul>
          {selectedTable ? <SchemaTableDetails table={selectedTable} /> : null}
        </>
      ) : null}
    </section>
  );
}

function SchemaTableDetails({ table }: { table: SchemaTable }): JSX.Element {
  return (
    <div className="schema-columns">
      <h3>{table.fullName}</h3>
      <p className="table-caption">
        {table.primaryKey
          ? `Primary key: ${table.primaryKey.columns.join(", ")}`
          : "Primary key: none"}
      </p>
      <table>
        <thead>
          <tr>
            <th>Column</th>
            <th>Type</th>
            <th>Nullable</th>
            <th>PK</th>
            <th>FK</th>
          </tr>
        </thead>
        <tbody>
          {table.columns.map((column) => (
            <tr key={`${table.fullName}.${column.columnName}`}>
              <td>{column.columnName}</td>
              <td>{column.dataType}</td>
              <td>{column.isNullable ? "Yes" : "No"}</td>
              <td>{column.isPrimaryKey ? "Yes" : "No"}</td>
              <td>{column.isForeignKey ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
