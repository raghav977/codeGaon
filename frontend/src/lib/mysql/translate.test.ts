// Run: npm run test:sql
import initSqlJs from 'sql.js';
import { MySQLEngine, SqlResult } from './engine';

let pass = 0, fail = 0;
function check(name: string, ok: boolean, info?: unknown) {
  if (ok) { pass++; } else { fail++; console.log('❌', name, JSON.stringify(info, null, 1)); }
}
const last = (r: SqlResult[]) => r[r.length - 1];
const isErr = (r: SqlResult[]) => last(r).kind === 'error';
const rows = (r: SqlResult[]) => { const l = last(r); return l.kind === 'table' ? l.rows : null; };
const text = (r: SqlResult[]) => { const l = last(r); return l.kind === 'error' ? l.text + ' | ' + (l.hint ?? '') : l.kind === 'message' ? l.text : ''; };

const SQL = await initSqlJs();
const e = new MySQLEngine(SQL);
console.log('SQLite version', (new SQL.Database()).exec('select sqlite_version()')[0].values[0][0]);

let r = e.run(`CREATE TABLE students (
  roll INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  gender CHAR(1),
  marks FLOAT DEFAULT 0,
  dob DATE,
  fee DECIMAL(8,2),
  email VARCHAR(50) UNIQUE
) ENGINE=InnoDB;`);
check('create', !isErr(r), r);
r = e.run(`INSERT INTO students (name, gender, marks, dob) VALUES ("Ram", 'M', 78, '2009-03-02'), ('Sita', 'F', 91, '2009-07-12'), ('Hari', 'M', 45, '2008-12-30');`);
check('insert 3 + autoinc', text(r).includes('3 rows'), r);
r = e.run(`SELECT roll, name FROM students WHERE name = 'ram';`);
check('case-insensitive compare like MySQL', rows(r)?.length === 1 && rows(r)![0][0] === 1, r);
r = e.run(`SELECT name FROM students WHERE name LIKE 'S%'; SELECT name FROM students WHERE name LIKE '_a%';`);
check('LIKE _', rows(r)?.length === 2, r);
r = e.run(`DESC students;`);
check('desc', rows(r)?.[0].join('|') === 'roll|int|NO|PRI|NULL|auto_increment', rows(r));
check('desc unique', rows(r)?.[6][3] === 'UNI', rows(r));
r = e.run(`SHOW TABLES;`);
check('show tables', rows(r)?.length === 1 && rows(r)![0][0] === 'students', r);

r = e.run(`ALTER TABLE students ADD phone VARCHAR(10) AFTER name;`);
check('add after', !isErr(r) && rows(e.run('DESC students'))![2][0] === 'phone', r);
r = e.run(`ALTER TABLE students MODIFY marks INT NOT NULL;`);
check('modify', !isErr(r) && rows(e.run('DESC students'))!.find((x) => x[0] === 'marks')![1] === 'int', r);
r = e.run(`ALTER TABLE students CHANGE gender sex VARCHAR(6);`);
check('change', !isErr(r) && rows(e.run(`SELECT sex FROM students WHERE roll=2`))![0][0] === 'F', r);
r = e.run(`ALTER TABLE students RENAME COLUMN sex TO gender;`);
check('rename column', !isErr(r), r);
r = e.run(`ALTER TABLE students DROP COLUMN phone;`);
check('drop column', !isErr(r) && !rows(e.run('DESC students'))!.some((x) => x[0] === 'phone'), r);
r = e.run(`ALTER TABLE students DROP dob;`);
check('drop without COLUMN keyword', !isErr(r), r);
r = e.run(`ALTER TABLE students RENAME TO pupils;`);
check('rename to', !isErr(r) && rows(e.run('SHOW TABLES'))![0][0] === 'pupils', r);
r = e.run(`RENAME TABLE pupils TO students;`);
check('rename table stmt', !isErr(r), r);
r = e.run(`INSERT INTO students (name, marks) VALUES ('Gita', 66);`);
check('autoinc still works after rebuild', rows(e.run(`SELECT roll FROM students WHERE name='Gita'`))![0][0] === 4, rows(e.run('select * from students')));
check('desc keeps auto_increment after rebuild', rows(e.run('DESC students'))![0][5] === 'auto_increment', rows(e.run('DESC students')));

r = e.run(`TRUNCATE TABLE students;`);
check('truncate', !isErr(r) && rows(e.run('SELECT COUNT(*) FROM students'))![0][0] === 0, r);
e.run(`INSERT INTO students (name, marks) VALUES ('New', 10);`);
check('truncate resets autoinc', rows(e.run('SELECT roll FROM students'))![0][0] === 1);

// relationships
r = e.run(`CREATE TABLE teachers (tid INT PRIMARY KEY, tname VARCHAR(30));
CREATE TABLE classes (cid INT PRIMARY KEY, tid INT, FOREIGN KEY (tid) REFERENCES teachers(tid));
INSERT INTO teachers VALUES (1, 'Kamala Miss');
INSERT INTO classes VALUES (10, 1);`);
check('fk ok', !isErr(r), r);
r = e.run(`INSERT INTO classes VALUES (11, 99);`);
check('fk fail friendly', isErr(r) && text(r).includes('FOREIGN KEY'), r);
check('desc fk MUL', rows(e.run('DESC classes'))![1][3] === 'MUL');

// friendly errors
r = e.run(`CREATE TABLE x (name VARCHAR(20) age INT);`);
check('missing comma create', text(r).includes('forgot the comma'), r);
r = e.run(`SELECT * FORM students;`);
check('FORM -> FROM', text(r).includes('FROM'), r);
r = e.run(`SELCT * FROM students;`);
check('SELCT', text(r).includes('SELECT'), r);
r = e.run(`SELECT * FROM studnts;`);
check('no such table', text(r).includes('studnts'), r);
r = e.run(`SELECT * FROM students WHERE name = Ram;`);
check('missing quotes', text(r).includes("'Ram'"), r);
r = e.run(`INSERT INTO teachers VALUES (1, 'Dup');`);
check('duplicate pk', text(r).includes('Duplicate'), r);
r = e.run(`INSERT INTO teachers VALUES (2);`);
check('value count', text(r).includes('1 values'), r);
r = e.run(`CREATE TABLE y (a VARCHR(10));`);
check('bad type', text(r).includes('VARCHAR'), r);
r = e.run(`CREATE TABLE y (a VARCHAR);`);
check('varchar size', text(r).includes('size'), r);
r = e.run(`SELECT * FROM students WHERE name = 'Ram`);
check('unclosed quote', isErr(r), r);
r = e.run(`INSERT INTO teachers VALUES (5 'Ram');`);
check('missing comma values', text(r).includes('comma'), r);
r = e.run(`CREATE TABLE z (a INT, );`);
check('trailing comma', text(r).includes('extra comma'), r);
check('no sqlite words leak', !JSON.stringify(e.run('SELECT FROM WHERE;')).toLowerCase().includes('sqlite'));

// functions & misc
r = e.run(`SELECT UCASE(tname), CONCAT(tname, '!'), YEAR('2024-05-01') FROM teachers;`);
check('functions', rows(r)?.[0][2] === 2024 && rows(r)?.[0][1] === 'Kamala Miss!', r);
r = e.run(`CREATE DATABASE school2; USE school2; SHOW DATABASES;`);
check('database sim', rows(r)?.length === 2, r);
r = e.run(`UPDATE students SET marks = 50 WHERE roll = 1;`);
check('update msg', text(r).includes('1 row updated'), r);
r = e.run(`DELETE FROM students WHERE roll = 1;`);
check('delete msg', text(r).includes('1 row deleted'), r);
r = e.run(`DROP TABLE classes;`);
check('drop', !isErr(r), r);
r = e.run(`CREATE TABLE g (id INT, gender ENUM('M','F')); INSERT INTO g VALUES (1,'X');`);
check('enum check', isErr(r), r);
r = e.run(`ALTER TABLE teachers ADD CONSTRAINT u UNIQUE (tname);`);
check('add constraint', !isErr(r) && rows(e.run('DESC teachers'))![1][3] === 'UNI', r);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
