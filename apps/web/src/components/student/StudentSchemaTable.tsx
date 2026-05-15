import type { SchemaTable } from "../../api/types";

type StudentSchemaTableProps = {
  table: SchemaTable;
};

export function StudentSchemaTable({ table }: StudentSchemaTableProps): JSX.Element {
  return (
    <div className="schema-compact" aria-label="Selected Table Schema">
      <p className="schema-compact__name">{table.fullName}</p>
      <div className="table-scroll">
        <table className="schema-compact__table">
          <thead>
            <tr>
              <th className="schema-compact__head-cell">Column</th>
              <th className="schema-compact__head-cell">Type</th>
              <th className="schema-compact__head-cell">PK</th>
              <th className="schema-compact__head-cell">FK</th>
            </tr>
          </thead>
          <tbody>
            {table.columns.map((column) => (
              <tr key={`${table.fullName}.${column.columnName}`}>
                <td>{column.columnName}</td>
                <td>{column.dataType}</td>
                <td>{column.isPrimaryKey ? "Y" : "-"}</td>
                <td>{column.isForeignKey ? "Y" : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
