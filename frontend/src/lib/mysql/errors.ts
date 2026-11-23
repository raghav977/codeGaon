/** Turn raw SQLite errors into simple English hints for beginners. */
import { closestWord } from './text';

export class FriendlyError extends Error {
  constructor(message: string, public hint?: string) { super(message); }
}

const KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'ORDER', 'BY',
  'GROUP', 'HAVING', 'LIKE', 'BETWEEN', 'AND', 'OR', 'NOT', 'NULL', 'DISTINCT', 'LIMIT', 'TABLE', 'CREATE', 'ASC', 'DESC'];

export function friendlyError(raw: string, sql: string, known: string[] = []): FriendlyError {
  const msg = raw.replace(/^Error:\s*/, '');
  let m: RegExpMatchArray | null;

  if ((m = msg.match(/no such table: (?:main\.)?(\S+)/))) {
    return new FriendlyError(`I can't find a table called "${m[1]}".`, 'Check the spelling, or create it first. Type SHOW TABLES; to see all tables.');
  }
  if ((m = msg.match(/no such column: (\S+)/))) {
    const col = m[1];
    const looksLikeValue = new RegExp(`(=|<|>|IN\\s*\\(|VALUES\\s*\\([^)]*)\\s*${escapeRe(col)}`, 'i').test(sql);
    const guess = closestWord(col, known);
    return new FriendlyError(
      `There is no column called "${col}".`,
      looksLikeValue
        ? `If ${col} is text, put it inside quotes: '${col}' 🙂`
        : guess ? `Did you mean "${guess}"?` : 'Check the spelling. Type DESC tablename; to see the columns.',
    );
  }
  if ((m = msg.match(/table (\S+) already exists/))) {
    return new FriendlyError(`A table called ${m[1]} already exists.`, 'Pick a new name, or DROP the old table first.');
  }
  if ((m = msg.match(/UNIQUE constraint failed: \w+\.(\w+)/))) {
    return new FriendlyError(`Duplicate value in "${m[1]}"!`, `"${m[1]}" is a PRIMARY KEY or UNIQUE column, so two rows cannot have the same value — like two students cannot share one roll number.`);
  }
  if ((m = msg.match(/NOT NULL constraint failed: \w+\.(\w+)/))) {
    return new FriendlyError(`Column "${m[1]}" cannot be empty.`, `It is NOT NULL (or a PRIMARY KEY), so you must give it a value.`);
  }
  if (/FOREIGN KEY constraint failed/.test(msg)) {
    return new FriendlyError('This breaks a FOREIGN KEY rule.', 'You are pointing to a row that does not exist in the parent table (or deleting a parent that still has children). Add the parent row first.');
  }
  if (/CHECK constraint failed/.test(msg)) {
    return new FriendlyError('That value is not allowed in this column.', 'The column has a CHECK / ENUM rule. Use one of the allowed values.');
  }
  if ((m = msg.match(/table \S+ has (\d+) columns but (\d+) values were supplied/))) {
    return new FriendlyError(`You gave ${m[2]} values, but the table has ${m[1]} columns.`, 'Give one value for every column, or name the columns: INSERT INTO t (col1, col2) VALUES (…);');
  }
  if ((m = msg.match(/(\d+) values for (\d+) columns/))) {
    return new FriendlyError(`You listed ${m[2]} columns but gave ${m[1]} values.`, 'The number of columns and values must match — one value per column.');
  }
  if (/all VALUES must have the same number of terms/.test(msg)) {
    return new FriendlyError('Your rows have different numbers of values.', 'Every ( … ) group in VALUES must have the same count.');
  }
  if (/incomplete input/.test(msg)) {
    return new FriendlyError('Your command is not complete.', 'Did you forget a closing bracket ) or a closing quote \' ?');
  }
  if (/unrecognized token/.test(msg)) {
    return new FriendlyError('You opened a quote but never closed it.', "Text must be inside a pair of quotes, like 'Sita'.");
  }
  if ((m = msg.match(/ambiguous column name: (\S+)/))) {
    return new FriendlyError(`"${m[1]}" is in more than one table.`, `Say which table: students.${m[1].split('.').pop()}`);
  }
  if (/misuse of aggregate/.test(msg)) {
    return new FriendlyError('COUNT/SUM/AVG cannot be used in WHERE.', 'Use HAVING after GROUP BY for conditions on COUNT/SUM/AVG.');
  }
  if ((m = msg.match(/no such function: (\w+)/))) {
    return new FriendlyError(`MySQL function "${m[1]}" is not available here.`, 'Try COUNT, SUM, AVG, MAX, MIN, UPPER, LOWER, LENGTH, ROUND, CONCAT.');
  }
  if ((m = msg.match(/near "([^"]*)": syntax error/))) {
    return syntaxHint(m[1], sql, known);
  }
  if (/syntax error/.test(msg)) {
    return new FriendlyError('MySQL could not understand this command.', 'Check commas, brackets and spelling 🙂');
  }
  return new FriendlyError('Hmm, MySQL did not like that command.', 'Check spelling, commas, brackets and quotes. Compare with the example above 🙂');
}

function syntaxHint(near: string, sql: string, known: string[]): FriendlyError {
  const knownUp = new Set(known.map((k) => k.toUpperCase()));
  // 1. Misspelled keyword anywhere?
  const words = sql.match(/[A-Za-z_]+/g) ?? [];
  for (const w of words) {
    const up = w.toUpperCase();
    if (KEYWORDS.includes(up) || knownUp.has(up)) continue;
    const g = closestWord(up, KEYWORDS);
    if (g && w.length >= 3) return new FriendlyError(`Spelling mistake near "${w}".`, `Did you mean ${g}? 🙂`);
  }
  // 2. Missing comma: two values/words side by side
  const idx = sql.indexOf(near);
  if (idx > 0) {
    const before = sql.slice(0, idx).trimEnd();
    const prev = before[before.length - 1];
    if (prev && /[\w')"`]/.test(prev) && /^[\w'"`]/.test(near)) {
      return new FriendlyError(`Something is missing before "${near}".`, 'You probably forgot a comma , between two items 🙂');
    }
  }
  if (near === ')' ) return new FriendlyError('There is a problem just before the closing bracket ).', 'Maybe an extra comma before ) or a missing value?');
  if (near === ',') return new FriendlyError('There is a problem near a comma.', 'Maybe two commas in a row, or a comma in the wrong place?');
  if (near === '') return new FriendlyError('Your command stops too early.', 'Something is missing at the end. Compare with the example.');
  return new FriendlyError(`MySQL got confused near "${near}".`, 'Check spelling, commas and brackets around that word 🙂');
}

function escapeRe(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
