import type { QueryExecutionSuccessResponse } from "../api/types";

interface QueryResultsTableProps {
  result: QueryExecutionSuccessResponse["data"];
}

export function QueryResultsTable({
  result
}: QueryResultsTableProps): JSX.Element {
  return (
    <section aria-labelledby="query-results-title">
      <h3 id="query-results-title">Query Results</h3>
      <p className="message-muted">Rows returned: {result.rowCount}</p>
      {result.rowCount === 0 ? (
        <p>No rows returned.</p>
      ) : (
        <div className="schema-columns">
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
