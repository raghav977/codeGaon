/**
 * MySQL-flavoured engine on top of sql.js (SQLite WASM).
 *
 * Students type real MySQL. We translate it to SQLite, run it, and turn every
 * SQLite error into a simple English hint. SQLite error text never reaches the UI.
 */
import type { Database, SqlJsStatic } from 'sql.js';
import { friendlyError, FriendlyError } from './errors';
import {
  splitStatements,
  splitTopLevel,
  findMatchingParen,
  mapOutsideStrings,
  unquote,
  closestWord,
  doubleToSingleQuotes,
} from './text';

export type SqlResult =
  | { kind: 'table'; sql: string; columns: string[]; rows: (string | number | null)[][] }
  | { kind: 'message'; sql: string; text: string }
  | { kind: 'error'; sql: string; text: string; hint?: string };

interface ColumnDef { kind: 'column'; name: string; rest: string }
interface ConstraintDef { kind: 'constraint'; raw: string }
type Def = ColumnDef | ConstraintDef;

const MYSQL_TYPES = [
  'INT', 'INTEGER', 'TINYINT', 'SMALLINT', 'MEDIUMINT', 'BIGINT', 'VARCHAR', 'CHAR', 'TEXT',
  'DATE', 'DATETIME', 'TIME', 'YEAR', 'TIMESTAMP', 'FLOAT', 'DOUBLE', 'DECIMAL', 'NUMERIC',
  'BOOLEAN', 'BOOL', 'ENUM', 'BLOB', 'REAL',
];
const TEXT_TYPES = ['VARCHAR', 'CHAR', 'TEXT', 'ENUM'];
const CONSTRAINT_START = /^(PRIMARY|FOREIGN|UNIQUE|CONSTRAINT|KEY|INDEX|CHECK)\b/i;
const STATEMENT_WORDS = [
  'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TRUNCATE',
  'DESC', 'DESCRIBE', 'SHOW', 'USE', 'RENAME', 'WITH',
];

export class MySQLEngine {
  private db: Database;
  private autoInc = new Map<string, Set<string>>(); // lower(table) -> columns
  private databases = new Set<string>(['school']);
  private currentDb = 'school';

  constructor(SQL: SqlJsStatic) {
    this.db = new SQL.Database();
    this.db.run('PRAGMA foreign_keys = ON;');
    this.db.create_function('MOD', (a: number, b: number) => (b === 0 ? null : a % b));
    const part = (i: number) => (d: string | null) => {
      const m = d ? String(d).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/) : null;
      return m ? Number(m[i]) : null;
    };
    this.db.create_function('YEAR', part(1));
    this.db.create_function('MONTH', part(2));
    this.db.create_function('DAY', part(3));
  }

  /** Run one or many statements. Stops at the first error (like the mysql client). */
  run(input: string): SqlResult[] {
    const out: SqlResult[] = [];
    const statements = splitStatements(input);
    if (statements.length === 0) {
      return [{ kind: 'error', sql: '', text: 'The editor is empty. Type a MySQL command first 🙂' }];
    }
    for (const sql of statements) {
      try {
        out.push(...this.runOne(sql));
      } catch (e) {
        const fe = e instanceof FriendlyError ? e : friendlyError(String((e as Error).message ?? e), sql, this.knownNames());
        out.push({ kind: 'error', sql, text: fe.message, hint: fe.hint });
        break;
      }
    }
    return out;
  }

  /** Same as run() but throws on error. Used for hidden setup scripts. */
  setup(input: string) {
    const res = this.run(input);
    const err = res.find((r) => r.kind === 'error');
    if (err && err.kind === 'error') throw new Error(`Setup failed: ${err.text} in ${err.sql}`);
  }

  close() { this.db.close(); }

  // ───────────────────────────────────────────── dispatch

  private runOne(sql: string): SqlResult[] {
    const first = (sql.match(/^\s*(\w+)/)?.[1] ?? '').toUpperCase();
    if (!STATEMENT_WORDS.includes(first)) {
      const guess = closestWord(first, STATEMENT_WORDS);
      throw new FriendlyError(
        `I don't know the command "${sql.match(/^\s*(\S+)/)?.[1] ?? ''}".`,
        guess ? `Did you mean ${guess}? 🙂` : 'MySQL commands start with words like SELECT, INSERT, CREATE, UPDATE…',
      );
    }

    let m: RegExpMatchArray | null;
    if ((m = sql.match(/^\s*SHOW\s+TABLES\s*$/i))) return [this.showTables(sql)];
    if ((m = sql.match(/^\s*SHOW\s+DATABASES\s*$/i))) {
      return [{ kind: 'table', sql, columns: ['Database'], rows: [...this.databases].map((d) => [d]) }];
    }
    if ((m = sql.match(/^\s*(?:DESC|DESCRIBE)\s+(`?[\w]+`?)\s*$/i))) return [this.describe(sql, unquote(m[1]))];
    if ((m = sql.match(/^\s*SHOW\s+COLUMNS\s+FROM\s+(`?[\w]+`?)\s*$/i))) return [this.describe(sql, unquote(m[1]))];
    if ((m = sql.match(/^\s*CREATE\s+(?:DATABASE|SCHEMA)\s+(IF\s+NOT\s+EXISTS\s+)?(`?\w+`?)\s*$/i))) {
      const name = unquote(m[2]).toLowerCase();
      if (this.databases.has(name) && !m[1]) throw new FriendlyError(`A database called "${name}" already exists.`, 'Pick another name, or just USE it.');
      this.databases.add(name);
      return [{ kind: 'message', sql, text: `✅ Database "${name}" created. (A new almirah! Now type USE ${name};)` }];
    }
    if ((m = sql.match(/^\s*USE\s+(`?\w+`?)\s*$/i))) {
      const name = unquote(m[1]).toLowerCase();
      if (!this.databases.has(name)) throw new FriendlyError(`There is no database called "${name}".`, `Create it first: CREATE DATABASE ${name};`);
      this.currentDb = name;
      return [{ kind: 'message', sql, text: `✅ Now using database "${name}".` }];
    }
    if ((m = sql.match(/^\s*DROP\s+(?:DATABASE|SCHEMA)\s+(IF\s+EXISTS\s+)?(`?\w+`?)\s*$/i))) {
      const name = unquote(m[2]).toLowerCase();
      if (!this.databases.has(name)) {
        if (m[1]) return [{ kind: 'message', sql, text: 'Nothing to drop.' }];
        throw new FriendlyError(`There is no database called "${name}".`, 'Use SHOW DATABASES; to see them.');
      }
      if (name === this.currentDb) for (const t of this.tableNames()) this.exec(`DROP TABLE \`${t}\``);
      this.databases.delete(name);
      return [{ kind: 'message', sql, text: `🔥 Database "${name}" dropped — the whole almirah is gone.` }];
    }
    if ((m = sql.match(/^\s*TRUNCATE\s+(?:TABLE\s+)?(`?\w+`?)\s*$/i))) return [this.truncate(sql, unquote(m[1]))];
    if ((m = sql.match(/^\s*RENAME\s+TABLE\s+(`?\w+`?)\s+TO\s+(`?\w+`?)\s*$/i))) {
      this.renameTable(unquote(m[1]), unquote(m[2]));
      return [{ kind: 'message', sql, text: `✅ Table renamed to "${unquote(m[2])}".` }];
    }
    if (/^\s*CREATE\s+TABLE\b/i.test(sql)) return [this.createTable(sql)];
    if (/^\s*ALTER\s+TABLE\b/i.test(sql)) return [this.alterTable(sql)];
    if ((m = sql.match(/^\s*DROP\s+TABLE\s+(IF\s+EXISTS\s+)?([\w`,\s]+)$/i))) {
      const names = m[2].split(',').map((s) => unquote(s.trim()));
      for (const n of names) {
        if (!m[1]) this.assertTable(n);
        this.exec(`DROP TABLE IF EXISTS \`${n}\``);
        this.autoInc.delete(n.toLowerCase());
      }
      return [{ kind: 'message', sql, text: `🔥 Table ${names.map((n) => `"${n}"`).join(', ')} dropped — burnt completely (cover and all).` }];
    }
    return [this.generic(sql)];
  }

  // ───────────────────────────────────────────── generic DML / SELECT

  private generic(sql: string): SqlResult {
    const translated = translateExpressions(sql);
    const stmt = this.db.prepare(translated);
    try {
      const columns = stmt.getColumnNames();
      const rows: (string | number | null)[][] = [];
      while (stmt.step()) rows.push(stmt.get() as (string | number | null)[]);
      if (columns.length > 0) {
        return { kind: 'table', sql, columns, rows };
      }
      const n = this.db.getRowsModified();
      const verb = sql.trim().split(/\s+/)[0].toUpperCase();
      const word = n === 1 ? 'row' : 'rows';
      const text =
        verb === 'INSERT' ? `✅ ${n} ${word} inserted.`
        : verb === 'UPDATE' ? `✅ ${n} ${word} updated.${n === 0 ? ' (No row matched your WHERE.)' : ''}`
        : verb === 'DELETE' ? `🧽 ${n} ${word} deleted.${n === 0 ? ' (No row matched your WHERE.)' : ''}`
        : `✅ Query OK.`;
      return { kind: 'message', sql, text };
    } finally {
      stmt.free();
    }
  }

  // ───────────────────────────────────────────── SHOW / DESC / TRUNCATE

  private showTables(sql: string): SqlResult {
    return { kind: 'table', sql, columns: [`Tables_in_${this.currentDb}`], rows: this.tableNames().map((t) => [t]) };
  }

  private describe(sql: string, table: string): SqlResult {
    const real = this.assertTable(table);
    const info = this.query(`PRAGMA table_info(\`${real}\`)`);
    const fks = new Set(this.query(`PRAGMA foreign_key_list(\`${real}\`)`).map((r) => String(r[3]).toLowerCase()));
    const uniques = new Set<string>();
    for (const idx of this.query(`PRAGMA index_list(\`${real}\`)`)) {
      // seq, name, unique, origin, partial
      if (idx[2] === 1 && idx[3] === 'u') {
        const cols = this.query(`PRAGMA index_info(\`${idx[1]}\`)`);
        if (cols.length === 1) uniques.add(String(cols[0][2]).toLowerCase());
      }
    }
    const auto = this.autoInc.get(real.toLowerCase()) ?? new Set();
    const rows = info.map((r) => {
      const [, name, type, notnull, dflt, pk] = r as [number, string, string, number, string | null, number];
      const lname = name.toLowerCase();
      const isAuto = auto.has(lname);
      let t = (isAuto && /^INTEGER$/i.test(type) ? 'int' : type).toLowerCase();
      t = t.replace(/\s+/g, '');
      const key = pk ? 'PRI' : uniques.has(lname) ? 'UNI' : fks.has(lname) ? 'MUL' : '';
      return [name, t, notnull || pk ? 'NO' : 'YES', key, dflt === null ? 'NULL' : String(dflt).replace(/^'(.*)'$/, '$1'), isAuto ? 'auto_increment' : ''];
    });
    return { kind: 'table', sql, columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'], rows };
  }

  private truncate(sql: string, table: string): SqlResult {
    const real = this.assertTable(table);
    this.exec(`DELETE FROM \`${real}\``);
    try { this.exec(`DELETE FROM sqlite_sequence WHERE name = '${real}'`); } catch { /* no autoinc table yet */ }
    return { kind: 'message', sql, text: `📄 Table "${real}" truncated — all pages torn out, the cover (structure) is still there.` };
  }

  // ───────────────────────────────────────────── CREATE TABLE

  private createTable(sql: string): SqlResult {
    const head = sql.match(/^\s*CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?(`?\w+`?)\s*\(/i);
    if (!head) {
      if (/^\s*CREATE\s+TABLE\s+\S+\s*$/i.test(sql)) {
        throw new FriendlyError('Your table has no columns.', 'Add columns inside brackets: CREATE TABLE students (roll INT, name VARCHAR(30));');
      }
      throw new FriendlyError('The CREATE TABLE line looks broken.', 'Pattern: CREATE TABLE name ( column TYPE, column TYPE );');
    }
    const table = unquote(head[2]);
    const open = head[0].length - 1;
    const close = findMatchingParen(sql, open);
    if (close < 0) throw new FriendlyError('A bracket ( was opened but never closed.', 'Put a ) at the end of your column list.');
    const body = sql.slice(open + 1, close);
    const tail = sql.slice(close + 1).trim();
    if (tail && !/^(ENGINE|DEFAULT|CHARSET|COLLATE|AUTO_INCREMENT|COMMENT)\b/i.test(tail)) {
      throw new FriendlyError(`There is extra text after the closing bracket: "${tail}".`, 'Did you close the bracket too early?');
    }
    if (head[1] && this.realTableName(table)) {
      return { kind: 'message', sql, text: `Table "${table}" already exists, so nothing changed.` };
    }
    if (this.realTableName(table)) throw new FriendlyError(`A table called "${table}" already exists.`, 'Pick a new name, or DROP the old table first.');

    const pieces = splitTopLevel(body, ',').map((s) => s.trim());
    if (pieces.some((p) => p === '')) {
      throw new FriendlyError('There is an extra comma in your column list.', 'Remove the comma before the closing bracket ) 🙂');
    }
    const auto = new Set<string>();
    const defs: Def[] = pieces.map((p) => this.translateDef(p, auto, table));
    this.exec(buildCreate(table, defs));
    this.autoInc.set(table.toLowerCase(), auto);
    const cols = defs.filter((d) => d.kind === 'column').length;
    return { kind: 'message', sql, text: `✅ Table "${table}" created with ${cols} column${cols === 1 ? '' : 's'}. A new register is ready!` };
  }

  /** Translate one MySQL column / constraint definition into SQLite. */
  private translateDef(piece: string, auto: Set<string>, table: string): Def {
    if (CONSTRAINT_START.test(piece)) {
      if (/^(KEY|INDEX)\b/i.test(piece)) return { kind: 'constraint', raw: '' }; // plain MySQL index: ignore
      return { kind: 'constraint', raw: translateConstraint(piece) };
    }
    const m = piece.match(/^(`[^`]+`|"[^"]+"|\w+)\s*(.*)$/s);
    if (!m) throw new FriendlyError(`I can't understand "${piece}".`, 'Each column needs a name and a type, like: age INT');
    const name = unquote(m[1]);
    let rest = m[2].trim();
    if (!rest) throw new FriendlyError(`Column "${name}" has no data type.`, `Give it a type, like: ${name} VARCHAR(30) or ${name} INT`);

    const typeMatch = rest.match(/^(\w+)/);
    const type = (typeMatch?.[1] ?? '').toUpperCase();
    if (!MYSQL_TYPES.includes(type)) {
      const guess = closestWord(type, MYSQL_TYPES);
      throw new FriendlyError(
        `"${typeMatch?.[1] ?? rest}" is not a MySQL data type (column "${name}").`,
        guess ? `Did you mean ${guess}?` : 'Use types like INT, VARCHAR(30), CHAR(1), DATE, FLOAT, DECIMAL(5,2).',
      );
    }
    if ((type === 'VARCHAR') && !/^VARCHAR\s*\(\s*\d+\s*\)/i.test(rest)) {
      throw new FriendlyError(`VARCHAR needs a size (column "${name}").`, `Write it like ${name} VARCHAR(50) — the number is the max letters.`);
    }
    // Missing comma: "name VARCHAR(20) age INT"
    const afterType = rest.replace(/^\w+\s*(\([^)]*\))?/, '');
    const glued = afterType.match(/(`?\w+`?)\s+(INT|INTEGER|VARCHAR|CHAR|DATE|FLOAT|DECIMAL|DOUBLE|TEXT|BOOLEAN|DATETIME)\b/i);
    if (glued && !/^(NOT|NULL|DEFAULT|PRIMARY|KEY|UNIQUE|REFERENCES|CHECK|AUTO_INCREMENT|COMMENT)$/i.test(glued[1])) {
      throw new FriendlyError('You forgot the comma between columns 🙂', `Put a comma before "${glued[1]} ${glued[2]}".`);
    }

    // ENUM('a','b') -> VARCHAR(n) CHECK (col IN ('a','b'))
    rest = rest.replace(/^ENUM\s*\(([^)]*)\)/i, (_all, list: string) => `VARCHAR(50) CHECK (\`${name}\` IN (${list}))`);
    rest = rest.replace(/\bUNSIGNED\b/gi, '').replace(/\bCOMMENT\s+'[^']*'/gi, '');
    rest = rest.replace(/\bON\s+UPDATE\s+CURRENT_TIMESTAMP\b/gi, '');
    if (/\bAUTO_INCREMENT\b/i.test(rest)) {
      auto.add(name.toLowerCase());
      rest = rest.replace(/\bAUTO_INCREMENT\b/gi, '').replace(/^(INT|INTEGER|TINYINT|SMALLINT|MEDIUMINT|BIGINT)(\s*\(\s*\d+\s*\))?/i, 'INTEGER');
    }
    // MySQL compares text case-insensitively: "Ram" = "ram"
    if (TEXT_TYPES.includes(type) && !/\bCOLLATE\b/i.test(rest)) {
      rest = rest.replace(/^(\w+\s*(\([^)]*\))?)/, '$1 COLLATE NOCASE');
    }
    rest = rest.replace(/\bREFERENCES\s+(`?\w+`?)/i, (_a, t: string) => `REFERENCES \`${unquote(t)}\``);
    void table;
    return { kind: 'column', name, rest: rest.replace(/\s+/g, ' ').trim() };
  }

  // ───────────────────────────────────────────── ALTER TABLE

  private alterTable(sql: string): SqlResult {
    const head = sql.match(/^\s*ALTER\s+TABLE\s+(`?\w+`?)\s+(.*)$/is);
    if (!head) throw new FriendlyError('The ALTER TABLE line is incomplete.', 'Pattern: ALTER TABLE students ADD age INT;');
    const table = this.assertTable(unquote(head[1]));
    const specs = splitTopLevel(head[2], ',').map((s) => s.trim()).filter(Boolean);
    const messages: string[] = [];
    let current = table;
    for (const spec of specs) messages.push(this.alterOne(current, spec, (n) => (current = n)));
    return { kind: 'message', sql, text: messages.join('\n') };
  }

  private alterOne(table: string, spec: string, setName: (n: string) => void): string {
    let m: RegExpMatchArray | null;

    // RENAME TO / RENAME AS
    if ((m = spec.match(/^RENAME\s+(?:TO\s+|AS\s+)?(`?\w+`?)$/i)) && !/^RENAME\s+COLUMN\b/i.test(spec)) {
      const to = unquote(m[1]);
      this.renameTable(table, to);
      setName(to);
      return `✅ Register renamed: "${table}" → "${to}".`;
    }
    // RENAME COLUMN a TO b
    if ((m = spec.match(/^RENAME\s+COLUMN\s+(`?\w+`?)\s+TO\s+(`?\w+`?)$/i))) {
      const from = this.assertColumn(table, unquote(m[1]));
      const to = unquote(m[2]);
      this.exec(`ALTER TABLE \`${table}\` RENAME COLUMN \`${from}\` TO \`${to}\``);
      this.renameAuto(table, from, to);
      return `✅ Column renamed: "${from}" → "${to}".`;
    }
    // DROP PRIMARY KEY
    if (/^DROP\s+PRIMARY\s+KEY$/i.test(spec)) {
      const defs = this.readDefs(table)
        .filter((d) => !(d.kind === 'constraint' && /^\s*(CONSTRAINT\s+\S+\s+)?PRIMARY\s+KEY/i.test(d.raw)))
        .map((d) => (d.kind === 'column' ? { ...d, rest: d.rest.replace(/\bPRIMARY\s+KEY(\s+AUTOINCREMENT)?\b/gi, '') } : d));
      this.rebuild(table, defs);
      return '✅ Primary key removed.';
    }
    // DROP [COLUMN] col
    if ((m = spec.match(/^DROP\s+(?:COLUMN\s+)?(`?\w+`?)$/i))) {
      const col = this.assertColumn(table, unquote(m[1]));
      const defs = this.readDefs(table);
      const cols = defs.filter((d) => d.kind === 'column');
      if (cols.length === 1) throw new FriendlyError('You cannot drop the only column.', 'A table needs at least one column. Use DROP TABLE to remove the whole table.');
      const kept = defs.filter((d) =>
        d.kind === 'column' ? d.name.toLowerCase() !== col.toLowerCase() : !new RegExp(`\\b${col}\\b`, 'i').test(d.raw));
      this.rebuild(table, kept);
      this.autoInc.get(table.toLowerCase())?.delete(col.toLowerCase());
      return `✅ Column "${col}" removed from the register.`;
    }
    // MODIFY [COLUMN] col def
    if ((m = spec.match(/^MODIFY\s+(?:COLUMN\s+)?(`?\w+`?)\s+(.+)$/is))) {
      const col = this.assertColumn(table, unquote(m[1]));
      const auto = this.autoInc.get(table.toLowerCase()) ?? new Set<string>();
      auto.delete(col.toLowerCase());
      const nd = this.translateDef(`\`${col}\` ${m[2]}`, auto, table) as ColumnDef;
      this.autoInc.set(table.toLowerCase(), auto);
      const defs = this.readDefs(table).map((d) => (d.kind === 'column' && d.name.toLowerCase() === col.toLowerCase() ? nd : d));
      this.rebuild(table, defs);
      return `✅ Column "${col}" modified to ${m[2].trim()}.`;
    }
    // CHANGE [COLUMN] old new def
    if ((m = spec.match(/^CHANGE\s+(?:COLUMN\s+)?(`?\w+`?)\s+(`?\w+`?)\s+(.+)$/is))) {
      const from = this.assertColumn(table, unquote(m[1]));
      const to = unquote(m[2]);
      const auto = this.autoInc.get(table.toLowerCase()) ?? new Set<string>();
      auto.delete(from.toLowerCase());
      const nd = this.translateDef(`\`${to}\` ${m[3]}`, auto, table) as ColumnDef;
      this.autoInc.set(table.toLowerCase(), auto);
      const defs = this.readDefs(table).map((d) => {
        if (d.kind === 'column' && d.name.toLowerCase() === from.toLowerCase()) return nd;
        if (d.kind === 'constraint') return { ...d, raw: d.raw.replace(new RegExp(`\\b${from}\\b`, 'gi'), to) };
        return d;
      });
      this.rebuild(table, defs, new Map([[to.toLowerCase(), from]]));
      return `✅ Column "${from}" changed to "${to}" ${m[3].trim()}.`;
    }
    // ADD constraint
    if ((m = spec.match(/^ADD\s+((?:CONSTRAINT\s+\S+\s+)?(?:PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CHECK).*)$/is))) {
      const defs = this.readDefs(table);
      defs.push({ kind: 'constraint', raw: translateConstraint(m[1]) });
      this.rebuild(table, defs);
      return '✅ Rule (constraint) added.';
    }
    // ADD [COLUMN] (a INT, b INT)
    if ((m = spec.match(/^ADD\s+(?:COLUMN\s+)?\((.*)\)$/is))) {
      const parts = splitTopLevel(m[1], ',').map((s) => s.trim());
      return parts.map((p) => this.alterOne(table, `ADD ${p}`, setName)).join('\n');
    }
    // ADD [COLUMN] col def [FIRST | AFTER x]
    if ((m = spec.match(/^ADD\s+(?:COLUMN\s+)?(.+?)(?:\s+(FIRST)|\s+AFTER\s+(`?\w+`?))?$/is))) {
      const auto = this.autoInc.get(table.toLowerCase()) ?? new Set<string>();
      const nd = this.translateDef(m[1], auto, table);
      if (nd.kind !== 'column') throw new FriendlyError('I could not understand that ADD.', 'Pattern: ALTER TABLE students ADD phone VARCHAR(10);');
      if (this.columns(table).some((c) => c.toLowerCase() === nd.name.toLowerCase())) {
        throw new FriendlyError(`Column "${nd.name}" already exists.`, 'Pick a different column name.');
      }
      this.autoInc.set(table.toLowerCase(), auto);
      const defs = this.readDefs(table);
      if (m[2]) {
        defs.unshift(nd);
      } else if (m[3]) {
        const after = this.assertColumn(table, unquote(m[3]));
        const i = defs.findIndex((d) => d.kind === 'column' && d.name.toLowerCase() === after.toLowerCase());
        defs.splice(i + 1, 0, nd);
      } else {
        const firstConstraint = defs.findIndex((d) => d.kind === 'constraint');
        defs.splice(firstConstraint < 0 ? defs.length : firstConstraint, 0, nd);
      }
      this.rebuild(table, defs);
      return `✅ New column "${nd.name}" added to the register.`;
    }
    const word = spec.split(/\s+/)[0];
    const guess = closestWord(word.toUpperCase(), ['ADD', 'DROP', 'MODIFY', 'CHANGE', 'RENAME']);
    throw new FriendlyError(
      `ALTER TABLE doesn't understand "${word}".`,
      guess && guess !== word.toUpperCase() ? `Did you mean ${guess}?` : 'Use ADD, DROP COLUMN, MODIFY, CHANGE, RENAME COLUMN or RENAME TO.',
    );
  }

  /** Rebuild a table with new definitions, copying data across. `renames` maps newCol -> oldCol. */
  private rebuild(table: string, defs: Def[], renames = new Map<string, string>()) {
    const oldCols = new Set(this.columns(table).map((c) => c.toLowerCase()));
    const copy: [string, string][] = [];
    for (const d of defs) {
      if (d.kind !== 'column') continue;
      const src = renames.get(d.name.toLowerCase()) ?? d.name;
      if (oldCols.has(src.toLowerCase())) copy.push([d.name, src]);
    }
    const tmp = `__rebuild_${table}`;
    this.db.run('PRAGMA foreign_keys = OFF;');
    try {
      this.db.run('BEGIN;');
      this.exec(buildCreate(tmp, defs));
      if (copy.length) {
        this.exec(`INSERT INTO \`${tmp}\` (${copy.map((c) => `\`${c[0]}\``).join(', ')}) SELECT ${copy.map((c) => `\`${c[1]}\``).join(', ')} FROM \`${table}\``);
      }
      this.exec(`DROP TABLE \`${table}\``);
      this.exec(`ALTER TABLE \`${tmp}\` RENAME TO \`${table}\``);
      this.db.run('COMMIT;');
    } catch (e) {
      try { this.db.run('ROLLBACK;'); } catch { /* already rolled back */ }
      const msg = String((e as Error).message);
      if (/UNIQUE|PRIMARY/i.test(msg)) throw new FriendlyError('Cannot add this rule: some rows already have duplicate values.', 'Fix or delete the duplicate rows first, then try again.');
      if (/NOT NULL/i.test(msg)) throw new FriendlyError('Cannot make this column NOT NULL: some rows are empty (NULL) there.', 'Fill those empty cells with UPDATE first, or give a DEFAULT value.');
      throw e;
    } finally {
      this.db.run('PRAGMA foreign_keys = ON;');
    }
  }

  // ───────────────────────────────────────────── helpers

  private renameTable(from: string, to: string) {
    const real = this.assertTable(from);
    if (this.realTableName(to)) throw new FriendlyError(`A table called "${to}" already exists.`, 'Pick another name.');
    this.exec(`ALTER TABLE \`${real}\` RENAME TO \`${to}\``);
    const a = this.autoInc.get(real.toLowerCase());
    this.autoInc.delete(real.toLowerCase());
    if (a) this.autoInc.set(to.toLowerCase(), a);
  }

  private renameAuto(table: string, from: string, to: string) {
    const a = this.autoInc.get(table.toLowerCase());
    if (a?.delete(from.toLowerCase())) a.add(to.toLowerCase());
  }

  private readDefs(table: string): Def[] {
    const row = this.query(`SELECT sql FROM sqlite_master WHERE type='table' AND name = '${table}'`)[0];
    const sql = String(row[0]);
    const open = sql.indexOf('(');
    const close = findMatchingParen(sql, open);
    return splitTopLevel(sql.slice(open + 1, close), ',').map((p) => p.trim()).filter(Boolean).map((p): Def => {
      if (CONSTRAINT_START.test(p)) return { kind: 'constraint', raw: p };
      const m = p.match(/^(`[^`]+`|"[^"]+"|\[[^\]]+\]|\w+)\s*(.*)$/s)!;
      return { kind: 'column', name: unquote(m[1]), rest: m[2] };
    });
  }

  private exec(sql: string) { this.db.run(sql); }

  private query(sql: string): (string | number | null)[][] {
    const r = this.db.exec(sql);
    return (r[0]?.values ?? []) as (string | number | null)[][];
  }

  private tableNames(): string[] {
    return this.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__rebuild_%' ORDER BY name").map((r) => String(r[0]));
  }

  private realTableName(name: string): string | undefined {
    return this.tableNames().find((t) => t.toLowerCase() === name.toLowerCase());
  }

  private assertTable(name: string): string {
    const real = this.realTableName(name);
    if (!real) {
      const guess = closestWord(name, this.tableNames());
      throw new FriendlyError(
        `I can't find a table called "${name}".`,
        guess ? `Did you mean "${guess}"? Type SHOW TABLES; to see all tables.` : 'Check the spelling, or create it first with CREATE TABLE. Type SHOW TABLES; to see all tables.',
      );
    }
    return real;
  }

  private columns(table: string): string[] {
    return this.query(`PRAGMA table_info(\`${table}\`)`).map((r) => String(r[1]));
  }

  private assertColumn(table: string, col: string): string {
    const cols = this.columns(table);
    const real = cols.find((c) => c.toLowerCase() === col.toLowerCase());
    if (!real) {
      const guess = closestWord(col, cols);
      throw new FriendlyError(`Table "${table}" has no column called "${col}".`, guess ? `Did you mean "${guess}"? (Try DESC ${table};)` : `Type DESC ${table}; to see its columns.`);
    }
    return real;
  }

  private knownNames(): string[] {
    const names = this.tableNames();
    return [...names, ...names.flatMap((t) => this.columns(t))];
  }
}

// ───────────────────────────────────────────── pure helpers

function buildCreate(table: string, defs: Def[]): string {
  const parts = defs
    .filter((d) => d.kind === 'column' || d.raw)
    .map((d) => (d.kind === 'column' ? `\`${d.name}\` ${d.rest}` : d.raw));
  return `CREATE TABLE \`${table}\` (${parts.join(', ')})`;
}

function translateConstraint(raw: string): string {
  return raw
    .replace(/\bREFERENCES\s+(`?\w+`?)/i, (_a, t: string) => `REFERENCES \`${unquote(t)}\``)
    .replace(/^((?:CONSTRAINT\s+\S+\s+)?FOREIGN\s+KEY)\s+`?\w+`?\s*\(/i, '$1 (') // MySQL allows an index name here
    .trim();
}

/** Rewrite MySQL-only functions/quotes inside SELECT/INSERT/UPDATE/DELETE. */
export function translateExpressions(sql: string): string {
  return mapOutsideStrings(doubleToSingleQuotes(sql), (code) =>
    code
      .replace(/\bNOW\s*\(\s*\)/gi, "datetime('now','localtime')")
      .replace(/\b(CURDATE|CURRENT_DATE)\s*\(\s*\)/gi, "date('now','localtime')")
      .replace(/\bUCASE\s*\(/gi, 'UPPER(')
      .replace(/\bLCASE\s*\(/gi, 'LOWER(')
      .replace(/\bIF\s*\(/gi, 'IIF('),
  );
}
