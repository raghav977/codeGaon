import type { Topic } from './types';

/** Hidden practice register loaded before the student's code. */
export const STUDENTS_SETUP = `
CREATE TABLE students (
  roll INT PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  gender CHAR(1),
  class VARCHAR(5),
  marks INT,
  district VARCHAR(20)
);
INSERT INTO students VALUES
 (1, 'Aarav Shrestha', 'M', '10A', 78, 'Kathmandu'),
 (2, 'Sita Gurung', 'F', '10B', 91, 'Kaski'),
 (3, 'Hari Thapa', 'M', '10A', 35, 'Chitwan'),
 (4, 'Gita Rai', 'F', '10B', 66, 'Ilam'),
 (5, 'Bikash Tamang', 'M', '10A', 49, 'Kathmandu'),
 (6, 'Puja Karki', 'F', '10A', 84, 'Lalitpur'),
 (7, 'Nima Sherpa', 'M', '10B', 72, 'Solukhumbu'),
 (8, 'Rita Magar', 'F', '10B', 28, 'Palpa');
`;

export const mysqlTopics: Topic[] = [
  {
    id: 'sql-register',
    house: 'mysql',
    title: 'What is a database? (The School Register)',
    emoji: '🗄️',
    story: {
      title: 'The School Register',
      pictures: ['🗄️', '📒', '🧑‍🎓'],
      lines: [
        'Your school office has an almirah full of registers. That almirah is a DATABASE.',
        'Each register is a TABLE — one for students, one for teachers, one for fees.',
        'Each heading (roll, name, marks) is a COLUMN (also called a field or attribute).',
        'Each line about one student is a ROW (also called a record or tuple).',
        'MySQL is the office helper (a DBMS) who reads and writes these registers when you give orders.',
      ],
    },
    animation: 'register',
    play: {
      task: 'A practice register is ready. Run the commands one by one: see all tables, see the columns, and see the data.',
      setup: STUDENTS_SETUP,
      starter: `SHOW TABLES;
DESC students;
SELECT * FROM students;
`,
    },
    hints: [
      'Every MySQL command ends with a semicolon ;',
      'DESC students; shows the columns and their data types.',
      'SELECT * means "show all columns".',
    ],
    mistake: {
      wrong: 'SELECT * FROM students',
      right: 'SELECT * FROM students;',
      why: 'In the real MySQL screen, a command without ; does not run — it waits for more. Always end with ;',
    },
    seeTip: 'Definitions are easy marks: Database = organised collection of related data. DBMS = software to manage a database (e.g. MySQL). Field = column, Record = row.',
    quiz: [
      { q: 'In the register analogy, a TABLE is…', options: ['The almirah', 'One register', 'One student line', 'A heading'], answer: 1, explain: 'Database = almirah, Table = register, Row = student, Column = heading.' },
      { q: 'A row is also called…', options: ['Field', 'Record', 'Key', 'Database'], answer: 1, explain: 'A row = record (or tuple). A column = field (or attribute).' },
      { q: 'MySQL is an example of…', options: ['Operating system', 'DBMS', 'Programming language', 'Browser'], answer: 1, explain: 'MySQL is a Database Management System (RDBMS).' },
    ],
    badge: { emoji: '🗄️', name: 'Register Keeper' },
  },
  {
    id: 'sql-create',
    house: 'mysql',
    title: 'DDL vs DML · CREATE TABLE & data types',
    emoji: '🔨',
    story: {
      title: 'Building a new register',
      pictures: ['🔨', '📒', '✏️'],
      lines: [
        'DDL (Data Definition Language) = building or changing the register itself: CREATE, ALTER, DROP, TRUNCATE.',
        'DML (Data Manipulation Language) = writing inside it: INSERT, UPDATE, DELETE, SELECT.',
        'CREATE DATABASE school; makes a new almirah. USE school; opens it.',
        'CREATE TABLE draws columns. Each column needs a data type: INT (whole number), VARCHAR(30) (text up to 30 letters), CHAR(1), DATE (\'2025-04-14\'), FLOAT, DECIMAL(5,2).',
        'Rules (constraints): PRIMARY KEY (unique roll number), NOT NULL (cannot be empty), UNIQUE, DEFAULT, AUTO_INCREMENT (numbers itself 1, 2, 3…).',
      ],
    },
    animation: 'ddlDml',
    play: {
      task: 'Create a teachers table with tid (auto number, primary key), name (required), subject, salary (decimal) and join_date (DATE). Then DESC it.',
      starter: `CREATE DATABASE school;
USE school;

CREATE TABLE books (
  book_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  price DECIMAL(6,2) DEFAULT 0,
  published DATE
);
DESC books;

-- Your turn: CREATE TABLE teachers ( ... );
`,
    },
    hints: [
      'Pattern: CREATE TABLE teachers ( column TYPE rules, column TYPE rules );',
      'Put a comma after every column except the last one.',
      'tid INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(40) NOT NULL, subject VARCHAR(20), salary DECIMAL(8,2), join_date DATE',
    ],
    mistake: {
      wrong: 'CREATE TABLE t (\n  name VARCHAR(20)\n  age INT\n);',
      right: 'CREATE TABLE t (\n  name VARCHAR(20),\n  age INT\n);',
      why: 'Every column must be separated by a comma. And there is NO comma after the last column.',
    },
    seeTip: 'Classify commands: CREATE, ALTER, DROP, TRUNCATE = DDL. INSERT, UPDATE, DELETE, SELECT = DML. This is asked almost every year!',
    quiz: [
      { q: 'Which is a DDL command?', options: ['INSERT', 'SELECT', 'CREATE', 'UPDATE'], answer: 2, explain: 'CREATE builds the structure, so it is DDL.' },
      { q: 'Best data type for a student\'s name?', options: ['INT', 'DATE', 'VARCHAR(40)', 'FLOAT'], answer: 2, explain: 'Names are text of different lengths → VARCHAR.' },
      { q: 'Which constraint stops two students having the same roll number?', options: ['NOT NULL', 'DEFAULT', 'PRIMARY KEY', 'DATE'], answer: 2, explain: 'A PRIMARY KEY must be unique and not empty.' },
    ],
    badge: { emoji: '🔨', name: 'Register Builder' },
  },
  {
    id: 'sql-insert',
    house: 'mysql',
    title: 'INSERT — writing new rows',
    emoji: '✍️',
    story: {
      title: 'Admission day',
      pictures: ['✍️', '🧑‍🎓', '📒'],
      lines: [
        'A new student joins. The office writes a new line in the register. That is INSERT.',
        "INSERT INTO students VALUES (9, 'Anu', 'F', '10A', 80, 'Jhapa'); — give a value for EVERY column, in order.",
        "Or name the columns: INSERT INTO students (roll, name) VALUES (10, 'Ram'); — the rest become NULL (empty).",
        'Text and dates go inside single quotes. Numbers do not.',
        'You can insert many rows at once: VALUES (…), (…), (…);',
      ],
    },
    animation: 'insert',
    play: {
      task: 'Admit yourself and two friends into the students register, then SELECT to check.',
      setup: STUDENTS_SETUP,
      starter: `INSERT INTO students VALUES (9, 'Anu Yadav', 'F', '10A', 80, 'Jhapa');

INSERT INTO students (roll, name, class)
VALUES (10, 'Ram Bahadur', '10B');

SELECT * FROM students;
`,
    },
    hints: [
      'Each new student needs a new roll number (it is the PRIMARY KEY).',
      "Text needs single quotes: 'Kathmandu'",
      "Many rows: INSERT INTO students VALUES (11, 'A', 'M', '10A', 50, 'Dang'), (12, 'B', 'F', '10B', 60, 'Bara');",
    ],
    mistake: {
      wrong: "INSERT INTO students VALUES (11, Ram, 'M', '10A', 50, 'Dang');",
      right: "INSERT INTO students VALUES (11, 'Ram', 'M', '10A', 50, 'Dang');",
      why: 'Without quotes, MySQL thinks Ram is a column name. Text must be in quotes.',
    },
    seeTip: 'If the question gives a table and says "insert a record", write the values in the same order as the columns. Dates are written as \'YYYY-MM-DD\'.',
    quiz: [
      { q: 'Which keyword comes before the list of values?', options: ['DATA', 'VALUES', 'SET', 'ROWS'], answer: 1, explain: 'INSERT INTO table VALUES (…);' },
      { q: 'How should a date be written?', options: ['14/04/2025', "'2025-04-14'", '2025-04-14', 'April 14'], answer: 1, explain: "MySQL dates are 'YYYY-MM-DD' inside quotes." },
      { q: 'INSERT belongs to…', options: ['DDL', 'DML', 'DCL', 'None'], answer: 1, explain: 'INSERT writes data inside the table → DML.' },
    ],
    badge: { emoji: '✍️', name: 'Admission Officer' },
  },
  {
    id: 'sql-select',
    house: 'mysql',
    title: 'SELECT & WHERE',
    emoji: '🔍',
    story: {
      title: 'Asking the register questions',
      pictures: ['🔍', '📒', '🙋'],
      lines: [
        'SELECT is how you ASK the register: "Show me…".',
        'SELECT * FROM students; → all columns, all rows.',
        'SELECT name, marks FROM students; → only those columns.',
        'WHERE adds a condition: WHERE marks > 60, WHERE district = \'Kathmandu\'.',
        'Join conditions with AND (both true), OR (any one true), NOT. Operators: =  <>  >  <  >=  <=',
      ],
    },
    animation: 'selectWhere',
    play: {
      task: 'Show names of girls (gender F) who scored more than 60. Then show everyone from Kathmandu.',
      setup: STUDENTS_SETUP,
      starter: `SELECT name, marks FROM students;

SELECT * FROM students WHERE marks > 60;

SELECT name FROM students WHERE class = '10A' AND marks >= 50;
`,
    },
    hints: [
      "Girls: WHERE gender = 'F'",
      "Two conditions: WHERE gender = 'F' AND marks > 60",
      "Kathmandu: SELECT * FROM students WHERE district = 'Kathmandu';",
    ],
    mistake: {
      wrong: 'SELECT name marks FROM students;',
      right: 'SELECT name, marks FROM students;',
      why: 'Column names must be separated by commas.',
    },
    seeTip: 'Read the question carefully: "display name and marks" means SELECT name, marks — not SELECT *. Examiners check the exact columns.',
    quiz: [
      { q: 'What does * mean in SELECT * ?', options: ['Multiply', 'All columns', 'All tables', 'Nothing'], answer: 1, explain: '* is short for "every column".' },
      { q: 'Which shows students with marks between 40 and 60 (inclusive)?', options: ['WHERE marks > 40 OR marks < 60', 'WHERE marks >= 40 AND marks <= 60', 'WHERE 40 < marks', 'WHERE marks = 40-60'], answer: 1, explain: 'Both conditions must be true, so use AND.' },
      { q: 'Which operator means "not equal" in MySQL?', options: ['!==', '<>', '=/=', '><'], answer: 1, explain: '<> (or !=) means not equal.' },
    ],
    badge: { emoji: '🔍', name: 'Question Master' },
  },
  {
    id: 'sql-like',
    house: 'mysql',
    title: 'LIKE with % and _',
    emoji: '🃏',
    story: {
      title: 'The joker cards',
      pictures: ['🃏', '🔤', '🎯'],
      lines: [
        'Sometimes you remember only PART of a name. LIKE helps you search with jokers.',
        '% is a joker that can be ANY number of letters (even zero).',
        "_ (underscore) is exactly ONE letter.",
        "'S%' → starts with S.  '%a' → ends with a.  '%sh%' → has 'sh' anywhere.  '_i%' → second letter is i.  '____' → exactly 4 letters.",
      ],
    },
    animation: 'like',
    play: {
      task: 'Run the examples. Then find: names starting with "R", names containing "ar", and districts with exactly 4 letters.',
      setup: STUDENTS_SETUP,
      starter: `SELECT name FROM students WHERE name LIKE 'S%';

SELECT name FROM students WHERE name LIKE '%Rai';

SELECT name FROM students WHERE name LIKE '_i%';

SELECT district FROM students WHERE district LIKE '____';
`,
    },
    hints: [
      "Starts with R: LIKE 'R%'",
      "Contains ar: LIKE '%ar%'",
      'Exactly 4 letters: four underscores ____',
    ],
    mistake: {
      wrong: "SELECT * FROM students WHERE name = 'S%';",
      right: "SELECT * FROM students WHERE name LIKE 'S%';",
      why: 'The jokers % and _ only work with LIKE. With = MySQL looks for the exact text "S%".',
    },
    seeTip: 'Questions like "display names starting with A" or "ending with n" are very common. Write LIKE \'A%\' and LIKE \'%n\'. Do not forget the quotes!',
    quiz: [
      { q: "Which pattern finds names that END with 'n'?", options: ["'n%'", "'%n'", "'_n'", "'%n%'"], answer: 1, explain: '% before n means anything can come first; n must be last.' },
      { q: "What does '_a%' match?", options: ['Names starting with a', 'Second letter is a', 'Exactly 2 letters', 'Names with no a'], answer: 1, explain: '_ is one letter, then a, then anything.' },
      { q: "Does 'Ram' match LIKE 'R__'?", options: ['Yes', 'No'], answer: 0, explain: 'R followed by exactly two letters (a, m). Yes!' },
    ],
    badge: { emoji: '🃏', name: 'Joker Hunter' },
  },
  {
    id: 'sql-order',
    house: 'mysql',
    title: 'ORDER BY, BETWEEN, IN, DISTINCT',
    emoji: '🥇',
    story: {
      title: 'Making the result sheet',
      pictures: ['🥇', '🥈', '🥉'],
      lines: [
        'ORDER BY sorts rows. ASC = small to big (default). DESC = big to small (like a result sheet).',
        'BETWEEN 60 AND 80 → inside a range; both 60 and 80 are included.',
        "IN ('Kathmandu', 'Lalitpur') → matches any value in the list. Shorter than many ORs!",
        'DISTINCT removes repeated values: SELECT DISTINCT district …',
        'Bonus: COUNT(*), MAX(), MIN(), AVG(), SUM() give one answer for many rows.',
      ],
    },
    animation: 'orderBy',
    play: {
      task: 'Make a merit list: names and marks, highest first. Then count how many students are in 10A.',
      setup: STUDENTS_SETUP,
      starter: `SELECT name, marks FROM students ORDER BY marks DESC;

SELECT name, marks FROM students WHERE marks BETWEEN 60 AND 80;

SELECT name, district FROM students WHERE district IN ('Kathmandu', 'Lalitpur');

SELECT DISTINCT district FROM students;

SELECT COUNT(*), AVG(marks), MAX(marks) FROM students;
`,
    },
    hints: [
      'ORDER BY comes at the END of the query.',
      'Highest first: ORDER BY marks DESC',
      "Count 10A: SELECT COUNT(*) FROM students WHERE class = '10A';",
    ],
    mistake: {
      wrong: 'SELECT * FROM students ORDER BY marks DESC WHERE marks > 50;',
      right: 'SELECT * FROM students WHERE marks > 50 ORDER BY marks DESC;',
      why: 'Order of words matters: SELECT → FROM → WHERE → ORDER BY.',
    },
    seeTip: 'If the question says "in descending order", write DESC. If it says nothing or "ascending", ASC is the default — but writing ASC shows you know it.',
    quiz: [
      { q: 'Default order of ORDER BY is…', options: ['DESC', 'ASC', 'Random', 'By roll'], answer: 1, explain: 'If you do not say, MySQL sorts ascending (small → big).' },
      { q: 'Is 80 included in BETWEEN 60 AND 80?', options: ['Yes', 'No'], answer: 0, explain: 'BETWEEN includes both ends.' },
      { q: 'Which removes repeated values?', options: ['UNIQUE', 'DISTINCT', 'ONLY', 'SINGLE'], answer: 1, explain: 'SELECT DISTINCT column shows each value once.' },
    ],
    badge: { emoji: '🥇', name: 'Merit Maker' },
  },
  {
    id: 'sql-update',
    house: 'mysql',
    title: 'UPDATE & DELETE',
    emoji: '✏️',
    story: {
      title: 'Correcting the register',
      pictures: ['✏️', '🧽', '⚠️'],
      lines: [
        'UPDATE = correcting a mistake with a pen. UPDATE students SET marks = 40 WHERE roll = 3;',
        'You can change many columns: SET marks = 40, class = \'10B\'',
        'DELETE = erasing a line with an eraser. DELETE FROM students WHERE roll = 8;',
        '⚠️ DANGER: if you forget WHERE, EVERY row is changed or erased!',
      ],
    },
    animation: 'updateDelete',
    play: {
      task: "Hari (roll 3) got grace marks: set his marks to 40. Then delete Rita (roll 8), who left the school. Check with SELECT.",
      setup: STUDENTS_SETUP,
      starter: `UPDATE students SET marks = marks + 5 WHERE class = '10A';
SELECT name, class, marks FROM students;

-- Your turn: UPDATE … and DELETE …
`,
    },
    hints: [
      'Pattern: UPDATE table SET column = value WHERE condition;',
      'UPDATE students SET marks = 40 WHERE roll = 3;',
      'DELETE FROM students WHERE roll = 8;',
    ],
    mistake: {
      wrong: 'UPDATE students SET marks = 40;',
      right: 'UPDATE students SET marks = 40 WHERE roll = 3;',
      why: 'Without WHERE, every student gets 40 marks! Always think: which rows?',
    },
    seeTip: 'UPDATE uses SET. DELETE does not use * — write DELETE FROM students WHERE …, never DELETE * FROM.',
    quiz: [
      { q: 'Which keyword gives the new value in UPDATE?', options: ['VALUES', 'SET', 'TO', 'NEW'], answer: 1, explain: 'UPDATE table SET column = value' },
      { q: 'What does DELETE FROM students; do?', options: ['Deletes the table', 'Deletes all rows', 'Nothing', 'Error'], answer: 1, explain: 'No WHERE → every row is erased, but the table structure stays.' },
      { q: 'UPDATE and DELETE belong to…', options: ['DDL', 'DML'], answer: 1, explain: 'They change the data inside → DML.' },
    ],
    badge: { emoji: '✏️', name: 'Careful Corrector' },
  },
  {
    id: 'sql-truncate',
    house: 'mysql',
    title: 'DELETE vs TRUNCATE vs DROP',
    emoji: '🔥',
    story: {
      title: 'Eraser, tearing, fire',
      pictures: ['🧽', '📄', '🔥'],
      lines: [
        'DELETE = erase SOME names with an eraser. You can choose rows with WHERE. (DML)',
        'TRUNCATE = tear out ALL the pages but keep the cover. The table (columns) stays, all data is gone. (DDL)',
        'DROP = burn the whole register. Data AND structure are gone forever. (DDL)',
        'After TRUNCATE you can still INSERT. After DROP you must CREATE the table again!',
      ],
    },
    animation: 'eraserTearBurn',
    play: {
      task: 'Run each block one at a time and watch the difference. After DROP, try SELECT — what happens? Use DESC to check if the structure is still there.',
      setup: STUDENTS_SETUP + `
CREATE TABLE fees (roll INT, amount INT);
INSERT INTO fees VALUES (1, 5000), (2, 4500), (3, 5000);
CREATE TABLE library (book VARCHAR(30));
INSERT INTO library VALUES ('Muna Madan'), ('Palpasa Cafe');`,
      starter: `-- 🧽 DELETE: erase some rows
DELETE FROM students WHERE marks < 40;
SELECT * FROM students;

-- 📄 TRUNCATE: all pages gone, cover stays
TRUNCATE TABLE fees;
DESC fees;
SELECT * FROM fees;

-- 🔥 DROP: the whole register is burnt
DROP TABLE library;
SHOW TABLES;
`,
    },
    hints: [
      'After TRUNCATE, DESC fees; still works — the structure is there.',
      'After DROP, SELECT * FROM library; gives an error — the table is gone.',
      'Only DELETE can use WHERE.',
    ],
    mistake: {
      wrong: 'TRUNCATE TABLE students WHERE marks < 40;',
      right: 'DELETE FROM students WHERE marks < 40;',
      why: 'TRUNCATE removes ALL rows — it cannot take WHERE. Use DELETE for some rows.',
    },
    seeTip: '"Differentiate DELETE and DROP" / "DELETE and TRUNCATE" is a favourite question. Write 3 points: DML vs DDL, WHERE allowed or not, structure kept or not.',
    quiz: [
      { q: 'Which removes the table structure too?', options: ['DELETE', 'TRUNCATE', 'DROP', 'UPDATE'], answer: 2, explain: 'DROP burns the whole register — data and structure.' },
      { q: 'Which can remove only SOME rows?', options: ['DELETE', 'TRUNCATE', 'DROP', 'All'], answer: 0, explain: 'Only DELETE accepts WHERE.' },
      { q: 'TRUNCATE is a…', options: ['DML command', 'DDL command'], answer: 1, explain: 'TRUNCATE is DDL (even though it removes data).' },
    ],
    badge: { emoji: '🔥', name: 'Fire Marshal' },
  },
  {
    id: 'sql-alter',
    house: 'mysql',
    title: 'ALTER TABLE — renovating the register',
    emoji: '🏗️',
    story: {
      title: 'Renovating the register',
      pictures: ['🏗️', '📒', '🖊️'],
      lines: [
        'ALTER changes the STRUCTURE of a table without throwing it away. It is DDL.',
        'ADD → new column: ALTER TABLE students ADD phone VARCHAR(10);',
        'DROP COLUMN → remove a column: ALTER TABLE students DROP COLUMN phone;',
        'MODIFY → change type: ALTER TABLE students MODIFY marks FLOAT;',
        'CHANGE → rename + new type: ALTER TABLE students CHANGE marks score INT;  RENAME COLUMN a TO b;  RENAME TO newname;',
      ],
    },
    animation: 'alter',
    play: {
      task: 'Add an email column, change marks to FLOAT, rename district to address, and finally rename the table to pupils. Use DESC after each step.',
      setup: STUDENTS_SETUP,
      starter: `ALTER TABLE students ADD phone VARCHAR(10);
DESC students;

ALTER TABLE students MODIFY marks FLOAT;
ALTER TABLE students CHANGE gender sex CHAR(1);
DESC students;

-- Your turn:
-- ALTER TABLE students ADD email VARCHAR(50);
-- ALTER TABLE students RENAME COLUMN district TO address;
-- ALTER TABLE students RENAME TO pupils;
`,
    },
    hints: [
      'All renovations start with: ALTER TABLE students …',
      'ADD needs a name and a type: ADD email VARCHAR(50)',
      'Rename the whole table: ALTER TABLE students RENAME TO pupils;',
    ],
    mistake: {
      wrong: 'ALTER TABLE students ADD email;',
      right: 'ALTER TABLE students ADD email VARCHAR(50);',
      why: 'A new column always needs a data type.',
    },
    seeTip: 'Know which word does what: ADD (new column), DROP COLUMN (remove), MODIFY (change type), CHANGE (rename + type), RENAME TO (table name). Write one example for each.',
    quiz: [
      { q: 'Which adds a new column?', options: ['ALTER TABLE t INSERT c INT;', 'ALTER TABLE t ADD c INT;', 'UPDATE t ADD c;', 'CREATE COLUMN c;'], answer: 1, explain: 'ALTER TABLE … ADD column type;' },
      { q: 'Which changes only the data type of a column?', options: ['RENAME', 'MODIFY', 'DROP', 'SET'], answer: 1, explain: 'MODIFY column newtype' },
      { q: 'ALTER is…', options: ['DML', 'DDL'], answer: 1, explain: 'It changes the structure → DDL.' },
    ],
    badge: { emoji: '🏗️', name: 'Renovator' },
  },
  {
    id: 'sql-relations',
    house: 'mysql',
    title: 'Keys & relationships',
    emoji: '🔗',
    story: {
      title: 'Class teacher, students and subjects',
      pictures: ['👩‍🏫', '🧑‍🎓', '📘'],
      lines: [
        'PRIMARY KEY = a column that is unique for every row, like a roll number or citizenship number.',
        'FOREIGN KEY = a column that points to the primary key of ANOTHER table. It links registers.',
        'One-to-many: ONE class teacher has MANY students. Many-to-one is the same thing seen from the students\' side.',
        'Many-to-many: students ↔ subjects. One student studies many subjects and one subject has many students.',
        'For many-to-many we need a bridge table (marksheet / enrollment) with two foreign keys.',
      ],
    },
    animation: 'relations',
    play: {
      task: 'Build the bridge! Create a marksheet table that links students and subjects, insert some marks, and see who studies what.',
      starter: `CREATE TABLE teachers (
  tid INT PRIMARY KEY,
  tname VARCHAR(30)
);
CREATE TABLE students (
  roll INT PRIMARY KEY,
  name VARCHAR(30),
  tid INT,
  FOREIGN KEY (tid) REFERENCES teachers(tid)
);
INSERT INTO teachers VALUES (1, 'Kamala Miss'), (2, 'Ramesh Sir');
INSERT INTO students VALUES (1, 'Aarav', 1), (2, 'Sita', 1), (3, 'Hari', 2);

-- one-to-many: Kamala Miss has many students
SELECT name FROM students WHERE tid = 1;

-- Many-to-many bridge
CREATE TABLE subjects (sid INT PRIMARY KEY, sname VARCHAR(20));
INSERT INTO subjects VALUES (1, 'Maths'), (2, 'Computer');
CREATE TABLE marksheet (
  roll INT,
  sid INT,
  marks INT,
  PRIMARY KEY (roll, sid),
  FOREIGN KEY (roll) REFERENCES students(roll),
  FOREIGN KEY (sid) REFERENCES subjects(sid)
);
INSERT INTO marksheet VALUES (1, 1, 80), (1, 2, 92), (2, 2, 88);
SELECT * FROM marksheet;

-- Try this: it breaks the FOREIGN KEY rule (student 99 does not exist)
-- INSERT INTO marksheet VALUES (99, 1, 50);
`,
    },
    hints: [
      'A FOREIGN KEY value must already exist in the parent table.',
      'The bridge table has two foreign keys: roll → students, sid → subjects.',
      'Try the commented INSERT to see the friendly FOREIGN KEY error.',
    ],
    mistake: {
      wrong: 'INSERT INTO students VALUES (4, \'Gita\', 5);  -- teacher 5 does not exist',
      right: 'INSERT INTO teachers VALUES (5, \'Sunita Miss\');\nINSERT INTO students VALUES (4, \'Gita\', 5);',
      why: 'A foreign key must point to a row that exists. Add the parent (teacher) first.',
    },
    seeTip: 'Draw small diagrams in the exam: teacher —< students (one-to-many). For many-to-many, draw the bridge table in the middle. Diagrams earn full marks quickly.',
    quiz: [
      { q: 'A FOREIGN KEY…', options: ['Must be unique in its own table', 'Points to a primary key in another table', 'Is always a name', 'Cannot be a number'], answer: 1, explain: 'It links to the primary key of another (parent) table.' },
      { q: 'Students ↔ subjects is which relationship?', options: ['One-to-one', 'One-to-many', 'Many-to-many', 'None'], answer: 2, explain: 'Many students take many subjects.' },
      { q: 'What do we need for a many-to-many relationship?', options: ['A bigger table', 'A bridge table', 'No keys', 'DISTINCT'], answer: 1, explain: 'A bridge (junction) table like marksheet with two foreign keys.' },
    ],
    badge: { emoji: '🔗', name: 'Bridge Builder' },
  },
];
