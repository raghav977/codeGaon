import { motion, AnimatePresence } from 'framer-motion';
import { Anim, Code, pop } from './kit';

const kids = [
  { roll: 1, name: 'Ram', marks: 78, cls: '10A' },
  { roll: 2, name: 'Sita', marks: 91, cls: '10B' },
  { roll: 3, name: 'Hari', marks: 35, cls: '10A' },
  { roll: 4, name: 'Shyam', marks: 66, cls: '10B' },
];

function Register({ rows, highlight, cols = ['roll', 'name', 'marks'], fade }: {
  rows: typeof kids; highlight?: (r: (typeof kids)[0]) => boolean; cols?: string[]; fade?: (r: (typeof kids)[0]) => boolean;
}) {
  return (
    <div className="bg-amber-50 border-4 border-amber-800 rounded-r-2xl rounded-l-md shadow-lg p-2 relative">
      <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around">{[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 rounded-full bg-amber-800" />)}</div>
      <table className="result ml-3">
        <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          <AnimatePresence>
            {rows.map((r) => (
              <motion.tr key={r.roll} layout initial={{ opacity: 0, x: 40 }} exit={{ opacity: 0, x: -60 }}
                animate={{ opacity: fade?.(r) ? 0.25 : 1, x: 0, backgroundColor: highlight?.(r) ? '#bbf7d0' : '#ffffff' }}>
                {cols.map((c) => <td key={c}>{String((r as Record<string, unknown>)[c] ?? '')}</td>)}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

export function SchoolRegister() {
  return (
    <Anim ms={2200} captions={[
      'Database = the school almirah 🗄️ that keeps many registers',
      'Table = one register 📒 (students, teachers, fees…)',
      'Column = a heading: roll, name, marks ⬇️',
      'Row = one student\'s full line ➡️ (also called a record / tuple)',
    ]}>
      {(s) => (
        <div className="flex items-center gap-6">
          <motion.div animate={{ scale: s === 0 ? 1.15 : 0.8 }} className="flex flex-col items-center">
            <div className="text-6xl">🗄️</div><span className="font-bold">school</span>
            <div className="flex gap-1 mt-1">{['students', 'teachers', 'fees'].map((t, i) => <motion.span key={t} animate={{ backgroundColor: s >= 1 && i === 0 ? '#fde047' : '#fef3c7' }} className="text-[10px] px-1 rounded border">{t}</motion.span>)}</div>
          </motion.div>
          {s >= 1 && (
            <motion.div {...pop}>
              <Register rows={kids.slice(0, 3)} highlight={(r) => s === 3 && r.roll === 2} />
              {s === 2 && <motion.p {...pop} className="text-center text-sm">⬆️ columns ⬆️</motion.p>}
            </motion.div>
          )}
        </div>
      )}
    </Anim>
  );
}

export function DdlDml() {
  return (
    <Anim ms={2300} captions={[
      'DDL = building or changing the REGISTER itself 🔨 (CREATE, ALTER, DROP, TRUNCATE)',
      'CREATE TABLE draws the columns. Each column gets a data type: INT, VARCHAR(30), DATE…',
      'DML = WRITING inside the register ✏️ (INSERT, UPDATE, DELETE, SELECT)',
      'Easy trick: DDL = Design, DML = Manipulate the data',
    ]}>
      {(s) => (
        <div className="flex items-center gap-8">
          <motion.div animate={{ scale: s < 2 ? 1.1 : 0.85, opacity: s < 2 || s === 3 ? 1 : 0.4 }} className="text-center">
            <div className="text-6xl">🔨📒</div><div className="font-bold">DDL</div>
            {s === 1 && (
              <motion.div {...pop} className="flex gap-1 mt-2">
                {['roll INT', 'name VARCHAR(30)', 'dob DATE'].map((c, i) => (
                  <motion.span key={c} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.3 }} className="bg-green-100 border-2 border-green-600 rounded px-1 text-xs font-mono">{c}</motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>
          <motion.div animate={{ scale: s >= 2 ? 1.1 : 0.85, opacity: s >= 2 ? 1 : 0.4 }} className="text-center">
            <div className="text-6xl">✏️📝</div><div className="font-bold">DML</div>
            {s === 2 && <motion.div {...pop}><Register rows={kids.slice(0, 2)} /></motion.div>}
          </motion.div>
        </div>
      )}
    </Anim>
  );
}

export function Insert() {
  return (
    <Anim ms={1800} captions={[
      'The register has columns but is empty',
      'INSERT INTO students VALUES (1, \'Ram\', 78); → a new line is written',
      'One more INSERT → one more row',
      'Text goes in quotes \'Ram\'. Numbers don\'t need quotes',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-3">
          <Register rows={kids.slice(0, Math.min(s, 2) + (s === 3 ? 1 : 0))} />
          <Code>{s === 0 ? 'CREATE TABLE students (...);' : `INSERT INTO students VALUES (${kids[Math.min(s - 1, 2)].roll}, '${kids[Math.min(s - 1, 2)].name}', ${kids[Math.min(s - 1, 2)].marks});`}</Code>
        </div>
      )}
    </Anim>
  );
}

export function SelectWhere() {
  return (
    <Anim ms={2000} captions={[
      'SELECT * FROM students; → show every row and every column',
      'SELECT name, marks → show only the columns you name',
      'WHERE marks > 60 → keep only rows where the condition is TRUE',
      'Together: SELECT name FROM students WHERE marks > 60;',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-3">
          <Register rows={kids} cols={s === 0 || s === 2 ? ['roll', 'name', 'marks'] : s === 1 ? ['name', 'marks'] : ['name']}
            highlight={(r) => s >= 2 && r.marks > 60} fade={(r) => s >= 2 && r.marks <= 60} />
          <Code>{['SELECT * FROM students;', 'SELECT name, marks FROM students;', 'SELECT * FROM students WHERE marks > 60;', 'SELECT name FROM students WHERE marks > 60;'][s]}</Code>
        </div>
      )}
    </Anim>
  );
}

export function Like() {
  const names = ['Ram', 'Rita', 'Sita', 'Shyam', 'Rajesh', 'Hari'];
  const tests: [string, (n: string) => boolean][] = [
    ["LIKE 'R%'", (n) => n.startsWith('R')],
    ["LIKE '%a'", (n) => n.endsWith('a')],
    ["LIKE '_a%'", (n) => n[1] === 'a'],
    ["LIKE '%ya%'", (n) => n.includes('ya')],
  ];
  return (
    <Anim ms={2300} captions={[
      '% is a joker 🃏 = ANY number of letters (even zero). R% → starts with R',
      '%a → ends with a',
      '_ is exactly ONE letter. _a% → second letter is a',
      '%ya% → "ya" anywhere inside',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {names.map((n) => (
              <motion.span key={n} animate={{ scale: tests[s][1](n) ? 1.15 : 0.9, opacity: tests[s][1](n) ? 1 : 0.3 }}
                className={`px-3 py-1 rounded-full font-bold ${tests[s][1](n) ? 'bg-green-300' : 'bg-slate-200'}`}>{n}</motion.span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-2xl">🃏 <Code>{`WHERE name ${tests[s][0]}`}</Code></div>
        </div>
      )}
    </Anim>
  );
}

export function OrderBy() {
  const sorted = [...kids].sort((a, b) => b.marks - a.marks);
  return (
    <Anim ms={2000} captions={[
      'Rows are in the order they were written',
      'ORDER BY marks DESC → highest first 🥇 (like a result sheet)',
      'BETWEEN 60 AND 80 → inside a range (both ends included)',
      "IN ('10A') → matches any value in the list",
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-3">
          <Register rows={s === 0 ? kids : sorted} cols={['roll', 'name', 'marks', 'cls']}
            highlight={(r) => (s === 2 && r.marks >= 60 && r.marks <= 80) || (s === 3 && r.cls === '10A')} />
          <Code>{['SELECT * FROM students;', 'ORDER BY marks DESC;', 'WHERE marks BETWEEN 60 AND 80', "WHERE cls IN ('10A')"][s]}</Code>
        </div>
      )}
    </Anim>
  );
}

export function UpdateDelete() {
  return (
    <Anim ms={2200} captions={[
      'UPDATE = correct a mark with a pen ✏️. SET marks = 40 WHERE roll = 3',
      'Hari\'s marks change from 35 → 40',
      'DELETE FROM students WHERE roll = 4 → erase one line 🧽',
      '⚠️ Forget WHERE and EVERY row is changed / deleted!',
    ]}>
      {(s) => {
        const rows = kids.map((k) => (k.roll === 3 && s >= 1 ? { ...k, marks: 40 } : k)).filter((k) => !(k.roll === 4 && s >= 2) && !(s === 3));
        return (
          <div className="flex flex-col items-center gap-3">
            <Register rows={s === 3 ? [] : rows} highlight={(r) => r.roll === 3 && s <= 1} />
            {s === 3 && <motion.div {...pop} className="text-5xl">😱</motion.div>}
            <Code>{['UPDATE students SET marks = 40 WHERE roll = 3;', 'UPDATE students SET marks = 40 WHERE roll = 3;', 'DELETE FROM students WHERE roll = 4;', 'DELETE FROM students;   -- no WHERE!'][s]}</Code>
          </div>
        );
      }}
    </Anim>
  );
}

export function EraserTearBurn() {
  return (
    <Anim ms={2600} captions={[
      'Three registers. Three ways to remove things…',
      'DELETE 🧽 = erase SOME names with an eraser (use WHERE). Register stays',
      'TRUNCATE 📄 = tear out ALL pages but keep the cover. Structure stays, data gone',
      'DROP 🔥 = burn the whole register. Data AND structure are gone',
    ]}>
      {(s) => (
        <div className="flex gap-4 sm:gap-8 items-end">
          {(['DELETE', 'TRUNCATE', 'DROP'] as const).map((k, i) => {
            const active = s === i + 1;
            const gone = s >= i + 1;
            return (
              <div key={k} className="flex flex-col items-center w-24 sm:w-28">
                <div className="h-36 flex items-end justify-center relative">
                  <AnimatePresence>
                    {!(k === 'DROP' && gone) && (
                      <motion.div exit={{ scale: 0.2, opacity: 0, rotate: 20 }} transition={{ duration: 0.8 }}
                        className="w-20 sm:w-24 h-32 bg-amber-100 border-4 border-amber-800 rounded-r-xl p-1 text-[9px] font-mono overflow-hidden">
                        <div className="font-bold text-center border-b border-amber-800">roll|name</div>
                        {kids.map((r) => (
                          <AnimatePresence key={r.roll}>
                            {!(gone && k === 'TRUNCATE') && !(gone && k === 'DELETE' && r.roll === 3) && (
                              <motion.div exit={k === 'TRUNCATE' ? { y: -80, rotate: -30, opacity: 0 } : { opacity: 0, scaleX: 0 }} transition={{ duration: 0.7 }}>
                                {r.roll} | {r.name}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {active && <motion.span {...pop} className="absolute -top-2 text-4xl">{['🧽', '📄', '🔥'][i]}</motion.span>}
                  {k === 'DROP' && gone && <motion.span initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity }} className="text-5xl">🔥</motion.span>}
                </div>
                <span className={`font-bold mt-1 ${active ? 'text-pink-600' : ''}`}>{k}</span>
                <span className="text-[10px] text-center">{['DML · can use WHERE', 'DDL · all rows', 'DDL · whole table'][i]}</span>
              </div>
            );
          })}
        </div>
      )}
    </Anim>
  );
}

export function Alter() {
  const steps = [
    { cols: ['roll', 'name', 'marks'], code: 'Our register before renovation 🏚️' },
    { cols: ['roll', 'name', 'marks', 'phone'], code: 'ALTER TABLE students ADD phone VARCHAR(10);' },
    { cols: ['roll', 'name', 'marks', 'phone'], code: 'ALTER TABLE students MODIFY marks FLOAT;' },
    { cols: ['roll', 'full_name', 'marks', 'phone'], code: 'ALTER TABLE students RENAME COLUMN name TO full_name;' },
    { cols: ['roll', 'full_name', 'marks'], code: 'ALTER TABLE students DROP COLUMN phone;' },
  ];
  return (
    <Anim ms={2200} captions={[
      'ALTER = renovating the register 🏗️ without throwing it away',
      'ADD → a new column is drawn',
      'MODIFY → change a column\'s type (marks can now have decimals: 78.5)',
      'RENAME COLUMN (or CHANGE) → give a column a new name',
      'DROP COLUMN → remove a column completely',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1">
            <AnimatePresence>
              {steps[s].cols.map((c) => (
                <motion.div key={c} layout initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} exit={{ scaleY: 0, opacity: 0 }}
                  className={`border-2 rounded px-2 py-6 font-mono text-sm ${(s === 1 && c === 'phone') || (s === 2 && c === 'marks') || (s === 3 && c === 'full_name') ? 'bg-yellow-200 border-yellow-600' : 'bg-white border-slate-400'}`}>
                  {c}{s === 2 && c === 'marks' ? <div className="text-[10px]">FLOAT</div> : null}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <Code>{steps[s].code}</Code>
        </div>
      )}
    </Anim>
  );
}

export function Relations() {
  return (
    <Anim ms={2600} captions={[
      'One-to-many: ONE class teacher 👩‍🏫 has MANY students',
      'Many-to-one: the same thing seen from the students\' side — many students → one teacher',
      'Many-to-many: students ↔ subjects. One student takes many subjects, one subject has many students',
      'We need a bridge table: marksheet (student_id, subject_id) 🌉',
    ]}>
      {(s) => (
        <div className="flex items-center gap-2 sm:gap-6 text-sm sm:text-base">
          {s <= 1 ? (
            <>
              <motion.div animate={{ scale: s === 0 ? 1.2 : 1 }} className="text-center"><div className="text-5xl">👩‍🏫</div><div className="text-xs">Kamala Miss</div></motion.div>
              <svg width="60" height="140">{[20, 55, 90, 125].map((y) => <motion.line key={y} x1={s === 0 ? 0 : 60} y1={70} x2={s === 0 ? 60 : 0} y2={y} stroke="#16a34a" strokeWidth={3} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />)}</svg>
              <div className="space-y-1">{['Ram', 'Sita', 'Hari', 'Gita'].map((n) => <motion.div key={n} animate={{ scale: s === 1 ? 1.1 : 1 }} className="bg-sky-100 rounded px-2">🧒 {n}</motion.div>)}</div>
            </>
          ) : (
            <>
              <div className="space-y-2">{['Ram', 'Sita'].map((n) => <div key={n} className="bg-sky-100 rounded px-2">🧒 {n}</div>)}</div>
              {s === 3 ? (
                <motion.div {...pop} className="bg-amber-100 border-4 border-amber-700 rounded-xl p-2 text-xs font-mono">
                  <div className="font-bold text-center">🌉 marksheet</div>
                  {[['Ram', 'Math'], ['Ram', 'CS'], ['Sita', 'CS'], ['Sita', 'Science']].map(([a, b]) => <div key={a + b}>{a} | {b}</div>)}
                </motion.div>
              ) : (
                <svg width="80" height="90">{[[15, 10], [15, 45], [15, 80], [60, 45], [60, 80], [60, 10]].map(([y1, y2], i) => <motion.line key={i} x1={0} y1={y1} x2={80} y2={y2} stroke="#db2777" strokeWidth={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} />)}</svg>
              )}
              <div className="space-y-2">{['Math', 'CS', 'Science'].map((n) => <div key={n} className="bg-pink-100 rounded px-2">📘 {n}</div>)}</div>
            </>
          )}
        </div>
      )}
    </Anim>
  );
}
