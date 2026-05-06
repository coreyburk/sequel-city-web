import type { QueryExecutionSuccessResponse } from "../api/types";

interface QueryResultsTableProps {
  result: QueryExecutionSuccessResponse["data"];
}

export function QueryResultsTable({
  result
}: QueryResultsTableProps): JSX.Element {
  return (
    <section className="query-results panel panel--subtle" aria-labelledby="query-results-title">
      <div className="section-heading section-heading--compact">
        <h3 id="query-results-title">Query Results</h3>
        <p className="message-muted">Rows returned: {result.rowCount}</p>
      </div>
      {result.rowCount === 0 ? (
        <p>No rows returned.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {result.columns.map((column) => (
                  <th key={column.name}>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {result.columns.map((column) => (
                    <td key={`${rowIndex}-${column.name}`}>
                      {row.displayValues[column.name] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
