/** Small text utilities for the MySQL translator. All of them respect '…', "…" and `…` quoting. */

/** Split a script into statements on ';' (ignoring ; inside quotes) and strip comments. */
export function splitStatements(input: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q: string | null = null;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    const n = input[i + 1];
    if (q) {
      cur += c;
      if (c === '\\' && q !== '`') { cur += n ?? ''; i++; continue; }
      if (c === q) q = null;
      continue;
    }
    if (c === '-' && n === '-') { while (i < input.length && input[i] !== '\n') i++; cur += '\n'; continue; }
    if (c === '#') { while (i < input.length && input[i] !== '\n') i++; cur += '\n'; continue; }
    if (c === '/' && n === '*') { const end = input.indexOf('*/', i + 2); i = end < 0 ? input.length : end + 1; cur += ' '; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; cur += c; continue; }
    if (c === ';') { if (cur.trim()) out.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Split on a separator at bracket depth 0 and outside quotes. */
export function splitTopLevel(s: string, sep: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let q: string | null = null;
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; cur += c; continue; }
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === sep && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

/** Index of the ')' matching the '(' at `open`, or -1. */
export function findMatchingParen(s: string, open: number): number {
  let depth = 0;
  let q: string | null = null;
  for (let i = open; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; continue; }
    if (c === '(') depth++;
    if (c === ')') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

/** Apply fn only to the parts of sql that are not string literals. */
export function mapOutsideStrings(sql: string, fn: (code: string) => string): string {
  let out = '';
  let buf = '';
  let q: string | null = null;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    if (q) {
      out += c;
      if (c === q) { if (sql[i + 1] === q) { out += sql[++i]; continue; } q = null; }
      continue;
    }
    if (c === "'") { out += fn(buf); buf = ''; q = c; out += c; continue; }
    buf += c;
  }
  return out + fn(buf);
}

/** MySQL treats "Ram" as a string. SQLite treats it as a column name. Convert to 'Ram'. */
export function doubleToSingleQuotes(sql: string): string {
  let out = '';
  let q: string | null = null;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    if (q === '"') {
      if (c === '"') { out += "'"; q = null; }
      else if (c === "'") out += "''";
      else out += c;
      continue;
    }
    if (q) { out += c; if (c === q) q = null; continue; }
    if (c === '"') { q = '"'; out += "'"; continue; }
    if (c === "'" || c === '`') q = c;
    out += c;
  }
  return out;
}

export function unquote(s: string): string {
  return s.trim().replace(/^[`"[](.*)[`"\]]$/, '$1');
}

function distance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
    {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
    }
  return dp[a.length][b.length];
}

/** Closest word within edit distance 2 (case-insensitive), or undefined. */
export function closestWord(word: string, options: string[]): string | undefined {
  if (!word) return undefined;
  let best: string | undefined;
  let bestD = 3;
  for (const o of options) {
    const d = distance(word.toUpperCase(), o.toUpperCase());
    if (d < bestD && d <= Math.max(1, Math.floor(o.length / 3))) { best = o; bestD = d; }
  }
  return best;
}
