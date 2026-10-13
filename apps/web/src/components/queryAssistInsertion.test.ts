import { insertQueryAssist } from "./queryAssistInsertion";

describe("query assistance insertion", () => {
  it("extends a terminated starter with a clause and proved condition", () => {
    const first = insertQueryAssist("SELECT * FROM CrimeSceneReport;", "WHERE");
    expect(first.sql).toBe("SELECT * FROM CrimeSceneReport WHERE;");
    const second = insertQueryAssist(first.sql, "CrimeID = 1080", first.caret);
    expect(second.sql).toBe("SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080;");
    expect(second.caret).toBe(second.sql.indexOf(";"));
  });
  it.each([
    "SELECT 'a;b''c' AS Value;",
    'SELECT "a;""b" FROM Records;',
    "SELECT [a]];b] FROM Records;",
    "SELECT * FROM Records; -- a; comment",
    "SELECT * FROM Records; /* outer; /* inner; */ text */  \n"
  ])("preserves literals, identifiers and trailing comments: %s", sql => {
    const semicolon = sql.indexOf(";", sql.includes("FROM Records") ? sql.indexOf("FROM Records") : sql.indexOf("AS Value"));
    const result = insertQueryAssist(sql, "WHERE", sql.length);
    expect(result.sql).toBe(sql.slice(0, semicolon) + " WHERE" + sql.slice(semicolon));
  });
  it("retains trailing whitespace", () => {
    expect(insertQueryAssist("SELECT * FROM T;  \n", "WHERE").sql).toBe("SELECT * FROM T WHERE;  \n");
  });
  it("replaces an explicit selection without relocating it", () => {
    const sql = "SELECT CrimeID FROM CrimeType;";
    expect(insertQueryAssist(sql, "*", 7, 14).sql).toBe("SELECT * FROM CrimeType;");
  });
  it("respects a caret inside the statement", () => {
    const sql = "SELECT FROM CrimeType;";
    expect(insertQueryAssist(sql, "*", 7).sql).toBe("SELECT * FROM CrimeType;");
  });
  it.each(["SELECT ';'", "SELECT [;]", "SELECT 1; SELECT 2;", "SELECT 1; /* incomplete", "SELECT 'unfinished;"])("does not relocate ambiguous insertion: %s", sql => {
    const result = insertQueryAssist(sql, "WHERE");
    expect(result.sql.startsWith(sql)).toBe(true);
  });
  it("preserves inserted whitespace while respecting the terminator", () => {
    expect(insertQueryAssist("SELECT 1;", "\n", 9, 9, { preserveSpacing: true }).sql).toBe("SELECT 1\n;");
  });
});