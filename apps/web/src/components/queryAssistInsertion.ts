export type QueryAssistOptions = { appendTrailingSpace?: boolean; preserveSpacing?: boolean };

// Only recognize a single statement's terminal semicolon outside SQL text/comments.
function terminalSemicolon(sql: string): number | null {
  let last = -1, terminator = -1, count = 0;
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i], next = sql[i + 1];
    if (/\s/.test(char)) continue;
    if (char === "-" && next === "-") {
      while (i < sql.length && sql[i] !== "\n" && sql[i] !== "\r") i++;
      continue;
    }
    if (char === "/" && next === "*") {
      let depth = 1; i += 2;
      for (; i < sql.length && depth; i++) {
        if (sql[i] === "/" && sql[i + 1] === "*") { depth++; i++; }
        else if (sql[i] === "*" && sql[i + 1] === "/") { depth--; i++; }
      }
      if (depth) return null;
      i--; continue;
    }
    last = i;
    if (char === "'" || char === '"' || char === "[") {
      const close = char === "[" ? "]" : char;
      let closed = false;
      for (i++; i < sql.length; i++) {
        if (sql[i] === close) {
          if (sql[i + 1] === close) { i++; continue; }
          closed = true; break;
        }
      }
      if (!closed) return null;
    } else if (char === ";") { terminator = i; count++; }
  }
  return count === 1 && last === terminator ? terminator : null;
}

export function insertQueryAssist(sql: string, text: string, start = sql.length, end = start, options: QueryAssistOptions = {}): { sql: string; caret: number } {
  const terminal = terminalSemicolon(sql);
  if (start === end && terminal !== null && start > terminal) start = end = terminal;
  const prefixNeedsSpace = start > 0 && !/\s/.test(sql[start - 1]) && sql[start - 1] !== "(";
  const suffixNeedsSpace = end < sql.length && !/\s/.test(sql[end]) && sql[end] !== ")" && sql[end] !== ";";
  const trailing = suffixNeedsSpace || (options.appendTrailingSpace && sql[end] !== ";");
  const insertion = options.preserveSpacing ? text : `${prefixNeedsSpace ? " " : ""}${text}${trailing ? " " : ""}`;
  return { sql: sql.slice(0, start) + insertion + sql.slice(end), caret: start + insertion.length };
}