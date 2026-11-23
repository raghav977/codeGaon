import { motion, AnimatePresence } from 'framer-motion';
import { Anim, Code, pop } from './kit';

export function PrintVars() {
  return (
    <Anim captions={[
      'A variable is a labelled box (dabba) 📦',
      'name = "Sita" puts "Sita" inside the box called name',
      'age = 15 → a number box. Text needs quotes, numbers don\'t',
      'print(name) opens the box and shows what is inside on the screen 🖥️',
      'input() asks the user. Whatever they type comes back as TEXT (str)',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            {[{ l: 'name', v: '"Sita"', t: 'str', at: 1 }, { l: 'age', v: '15', t: 'int', at: 2 }].map((b) => (
              <div key={b.l} className="flex flex-col items-center">
                <motion.div animate={{ rotate: s === 3 && b.l === 'name' ? [0, -8, 8, 0] : 0 }}
                  className="w-28 h-20 border-4 border-amber-600 bg-amber-200 rounded-xl flex items-center justify-center relative">
                  <AnimatePresence>{s >= b.at && <motion.span {...pop} className="font-mono font-bold text-lg">{b.v}</motion.span>}</AnimatePresence>
                </motion.div>
                <span className="font-mono font-bold mt-1">{b.l}</span>
                {s >= b.at && <span className="text-xs bg-sky-100 px-2 rounded-full">{b.t}</span>}
              </div>
            ))}
          </div>
          {s === 3 && <motion.div {...pop} className="bg-slate-900 text-green-300 font-mono px-4 py-2 rounded-xl">🖥️ Sita</motion.div>}
          {s === 4 && <motion.div {...pop} className="flex items-center gap-2"><Code>age = input("Age? ")</Code> → ⌨️ 15 → <span className="font-mono bg-amber-200 px-2 rounded">"15"</span> (text!)</motion.div>}
        </div>
      )}
    </Anim>
  );
}

export function FString() {
  const blanks = [{ k: 'name', v: 'Sita' }, { k: 'marks', v: '91' }];
  return (
    <Anim captions={[
      'An f-string is a fill-in-the-blank form 📝',
      'Put f before the quotes, and {curly brackets} where blanks are',
      'Python fills each blank with the variable\'s value ✍️',
      'Done! No + signs, no str() — it just works',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-4">
          <Code>{`name = "Sita";  marks = 91`}</Code>
          <div className="bg-white border-2 border-dashed border-slate-400 rounded-xl px-5 py-4 text-xl font-mono shadow">
            {s >= 1 && <motion.span {...pop} className="text-pink-600 font-bold">f</motion.span>}"Hello{' '}
            {blanks.map((b, i) => (
              <span key={b.k}>
                <motion.span layout className={`inline-block min-w-[70px] text-center border-b-4 ${s >= 2 ? 'border-green-500 bg-green-100' : 'border-slate-400'} mx-1 rounded`}>
                  {s >= 2 ? <motion.span initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.5 }}>{b.v}</motion.span> : s >= 1 ? `{${b.k}}` : '____'}
                </motion.span>
                {i === 0 ? ', you got ' : ''}
              </span>
            ))}"
          </div>
          {s === 3 && <motion.div {...pop} className="bg-slate-900 text-green-300 font-mono px-4 py-2 rounded-xl">Hello Sita, you got 91</motion.div>}
        </div>
      )}
    </Anim>
  );
}

export function TrafficLight() {
  const lights = ['bg-red-500', 'bg-yellow-400', 'bg-green-500'];
  const caps = [
    'if light == "red": → STOP 🛑 (Python checks the first condition)',
    'elif light == "yellow": → get ready (only checked if the first was False)',
    'else: → GO 🚗 (when nothing above was True)',
    'Only ONE block runs. Python stops checking after the first True',
  ];
  return (
    <Anim captions={caps}>
      {(s) => (
        <div className="flex items-center gap-8">
          <div className="bg-slate-800 p-3 rounded-2xl flex flex-col gap-2">
            {lights.map((c, i) => (
              <motion.div key={c} animate={{ opacity: s === i || (s === 3 && i === 0) ? 1 : 0.2, scale: s === i ? 1.1 : 1 }} className={`w-12 h-12 rounded-full ${c}`} />
            ))}
          </div>
          <div className="font-mono text-sm space-y-1">
            {['if light == "red":', '    print("Stop")', 'elif light == "yellow":', '    print("Ready")', 'else:', '    print("Go")'].map((l, i) => (
              <motion.div key={i} animate={{ backgroundColor: Math.floor(i / 2) === s || (s === 3 && i < 2) ? '#bbf7d0' : '#ffffff00' }} className="px-2 rounded whitespace-pre">{l}</motion.div>
            ))}
          </div>
          <motion.div key={s} {...pop} className="text-5xl">{['🛑', '⏳', '🚗', '1️⃣'][s]}</motion.div>
        </div>
      )}
    </Anim>
  );
}

export function Indentation() {
  return (
    <Anim ms={2200} captions={[
      'The almirah 🗄️ holds the bag. The bag 🎒 holds the tiffin 🍱',
      'In Python, spaces at the start of a line decide which box it is in',
      'if marks > 40: opens a bag. Lines pushed in by 4 spaces go INSIDE',
      'Wrong spaces? The tiffin falls out! 💥 IndentationError',
    ]}>
      {(s) => (
        <div className="font-mono text-sm w-full max-w-md">
          <div className="border-4 border-amber-500 bg-amber-100 rounded-xl p-2">
            <div>🗄️ marks = 75</div>
            <div>if marks &gt; 40:</div>
            <motion.div animate={{ opacity: s >= 1 ? 1 : 0.4 }} className="border-4 border-sky-500 bg-sky-100 rounded-xl p-2 ml-6 relative">
              <div>🎒 print("Pass")</div>
              <div>if marks &gt; 80:</div>
              <div className="border-4 border-green-500 bg-green-100 rounded-xl p-2 ml-6">🍱 print("Distinction")</div>
              <motion.div animate={s === 3 ? { x: 70, y: 18, rotate: 15 } : { x: 0, y: 0, rotate: 0 }}
                className={`mt-1 rounded px-1 ${s === 3 ? 'bg-red-200 border-2 border-red-500' : ''}`}>
                {s === 3 ? '   print("Well done")  💥' : '🎒 print("Well done")'}
              </motion.div>
            </motion.div>
            <div>print("Bye")</div>
          </div>
          {s === 2 && <motion.p {...pop} className="text-center mt-2">4 spaces = 1 level deeper ➡️➡️➡️➡️</motion.p>}
        </div>
      )}
    </Anim>
  );
}

export function Loops() {
  const kids = ['Ram', 'Sita', 'Hari', 'Gita'];
  return (
    <Anim ms={1300} captions={[
      'for name in students: → give a chocolate to EVERY student on the roll list 🍫',
      'Ram gets one…', 'Sita gets one…', 'Hari gets one…', 'Gita gets one — the list ends, the loop stops ✅',
      'while momos > 0: → keep eating WHILE the plate is not empty 🥟',
      'Plate empty → condition is False → the loop stops',
    ]}>
      {(s) => s <= 4 ? (
        <div className="flex gap-3">
          {kids.map((k, i) => (
            <div key={k} className="flex flex-col items-center">
              <span className="text-4xl">🧒</span><span className="font-bold">{k}</span>
              <AnimatePresence>{s > i && <motion.span initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl">🍫</motion.span>}</AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Code>{'momos = 5\nwhile momos > 0:\n    momos = momos - 1'}</Code>
          <div className="text-4xl bg-white rounded-full px-6 py-3 border-4 border-slate-200 min-w-[220px] text-center">
            {s === 5 ? <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity }}>🥟🥟🥟🥟🥟</motion.span> : '🍽️ empty'}
          </div>
          <span className="font-mono">{s === 5 ? 'momos > 0 → True → eat!' : 'momos > 0 → False → stop'}</span>
        </div>
      )}
    </Anim>
  );
}

export function Collections() {
  return (
    <Anim ms={2200} captions={[
      'List [ ] = a train 🚃 — you can add, remove or change compartments',
      'trains.append("C") → a new compartment joins at the end',
      'Tuple ( ) = sealed citizenship card 🪪 — once made, it can\'t change',
      'Dictionary { } = phone contacts 📱 — name → number. Look up by name!',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-3">
          {s <= 1 && (
            <div className="flex items-end gap-1">
              <span className="text-4xl">🚂</span>
              {['A', 'B', ...(s === 1 ? ['C'] : [])].map((c, i) => (
                <motion.div key={c} initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-16 h-12 bg-red-400 border-4 border-red-700 rounded-lg text-white font-bold flex flex-col items-center justify-center">
                  <span className="text-[10px]">[{i}]</span>{c}
                </motion.div>
              ))}
            </div>
          )}
          {s === 2 && (
            <motion.div {...pop} className="bg-amber-100 border-4 border-amber-700 rounded-xl p-4 font-mono relative">
              🪪 ("Sita", 2009, "Kathmandu")
              <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute -top-4 -right-4 text-3xl">🔒</motion.span>
            </motion.div>
          )}
          {s === 3 && (
            <motion.div {...pop} className="bg-white border-4 border-slate-700 rounded-3xl p-4 w-60 font-mono text-sm space-y-1">
              {[['"Ama"', '98410…'], ['"Dai"', '98510…'], ['"Sir"', '98010…']].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-pink-600">{k}</span><span>→ {v}</span></div>
              ))}
            </motion.div>
          )}
          <Code>{['trains = ["A", "B"]', 'trains.append("C")', 'card = ("Sita", 2009, "Kathmandu")', 'contacts = {"Ama": "98410…"}'][s]}</Code>
        </div>
      )}
    </Anim>
  );
}

export function Functions() {
  return (
    <Anim ms={2000} captions={[
      'def makes a momo machine 🏭. Parameters are the ingredient slots',
      'Call the machine: make_momo("chicken", 10) — put ingredients in',
      'return → the machine HANDS you the momo. You can use it later 🤲',
      'print → you only SEE the momo through a window 🪟. You can\'t eat (use) it later!',
    ]}>
      {(s) => (
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            {['🍗 filling', '🔟 count'].map((x, i) => (
              <motion.div key={x} animate={{ x: s >= 1 ? 30 : 0, opacity: s >= 1 ? 0.3 : 1 }} transition={{ delay: i * 0.2 }} className="bg-yellow-100 border-2 border-yellow-500 rounded-lg px-2 text-sm">{x}</motion.div>
            ))}
          </div>
          <motion.div animate={{ rotate: s === 1 ? [0, -2, 2, 0] : 0 }} transition={{ repeat: s === 1 ? Infinity : 0, duration: 0.3 }}
            className="w-32 h-28 bg-slate-600 rounded-2xl text-white flex flex-col items-center justify-center relative">
            <span className="text-3xl">🏭</span><span className="text-xs font-mono">make_momo()</span>
            {s === 3 && <div className="absolute -top-3 right-2 bg-sky-200 text-black rounded px-1 text-xs">🪟 window</div>}
          </motion.div>
          <div className="w-28 text-center">
            {s === 2 && <motion.div initial={{ x: -60 }} animate={{ x: 0 }} className="text-4xl">🥟🤲</motion.div>}
            {s === 2 && <p className="text-xs font-mono">plate = make_momo(...)</p>}
            {s === 3 && <motion.div {...pop} className="text-4xl opacity-60">👀🥟</motion.div>}
            {s === 3 && <p className="text-xs">plate = None 😢</p>}
          </div>
        </div>
      )}
    </Anim>
  );
}

export function Arguments() {
  return (
    <Anim ms={2300} captions={[
      'Positional: students sit by roll number — 1st value goes to 1st slot 🪑',
      'Keyword: called by NAME — order doesn\'t matter (marks=90, name="Sita") 📣',
      'Default: tea comes with sugar ☕ unless you say sugar=False',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-4">
          {s === 0 && (
            <div className="flex gap-3">
              {[['name', '"Ram"'], ['marks', '80']].map(([slot, v], i) => (
                <div key={slot} className="flex flex-col items-center">
                  <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.5 }} className="font-mono bg-green-200 rounded px-2">{v}</motion.div>
                  <div className="text-3xl">🪑</div><span className="text-xs">seat {i + 1}: {slot}</span>
                </div>
              ))}
            </div>
          )}
          {s === 1 && (
            <div className="flex gap-3">
              {[['name', '"Sita"'], ['marks', '90']].map(([slot, v], i) => (
                <div key={slot} className="flex flex-col items-center">
                  <motion.div initial={{ x: i === 0 ? 80 : -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="font-mono bg-pink-200 rounded px-2">{slot}={v}</motion.div>
                  <div className="text-3xl">🪑</div><span className="text-xs">{slot}</span>
                </div>
              ))}
            </div>
          )}
          {s === 2 && (
            <div className="flex gap-8 text-center">
              <div><div className="text-4xl">☕🍬</div><Code>{'tea("Ram")'}</Code><p className="text-xs">sugar=True by default</p></div>
              <div><div className="text-4xl">☕🚫</div><Code>{'tea("Hari", sugar=False)'}</Code></div>
            </div>
          )}
          <Code>{['def report(name, marks):', 'report(marks=90, name="Sita")', 'def tea(name, sugar=True):'][s]}</Code>
        </div>
      )}
    </Anim>
  );
}

export function Modules() {
  return (
    <Anim ms={1800} captions={[
      'import random → open the dice & lottery box 🎲',
      'random.randint(1, 6) → roll a dice. Every run gives a surprise number',
      'import math → open the calculator 🧮',
      'math.sqrt(16) = 4.0 · math.pi = 3.14159… · math.ceil(4.2) = 5',
    ]}>
      {(s) => (
        <div className="flex items-center gap-10">
          <motion.div animate={s === 1 ? { rotate: [0, 360, 720], y: [0, -40, 0] } : {}} transition={{ duration: 1.2 }} className="text-7xl">
            {s <= 1 ? '🎲' : '🧮'}
          </motion.div>
          <div className="font-mono text-lg">
            {s === 1 && <motion.div {...pop} className="text-5xl font-bold text-pink-600">{[4, 2, 6, 1][Math.floor(Date.now() / 1000) % 4]}</motion.div>}
            {s === 3 && <div className="space-y-1">{['√16 → 4.0', 'π → 3.14159', '⌈4.2⌉ → 5'].map((x, i) => <motion.div key={x} {...pop} transition={{ delay: i * 0.3 }}>{x}</motion.div>)}</div>}
            {(s === 0 || s === 2) && <Code>{s === 0 ? 'import random' : 'import math'}</Code>}
          </div>
        </div>
      )}
    </Anim>
  );
}

const register = [['Ram', 78], ['Sita', 91], ['Hari', 35], ['Gita', 66]] as const;

export function PandasSeries() {
  return (
    <Anim ms={2200} captions={[
      'A DataFrame is the whole attendance register / Excel sheet 📒',
      'A Series is ONE column of that register (with row numbers = index)',
      'df["marks"] pulls out the marks column — a Series',
      'Series can do maths: df["marks"].mean() → class average 📊',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-3">
          <table className="result bg-white">
            <thead><tr><th>index</th><th>name</th><motion.th animate={{ backgroundColor: s >= 1 ? '#fde047' : '#dcfce7' }}>marks</motion.th></tr></thead>
            <tbody>{register.map(([n, m], i) => (
              <tr key={n}><td className="text-slate-400">{i}</td><td>{n}</td>
                <motion.td animate={{ backgroundColor: s >= 1 ? '#fef9c3' : '#fff', x: s === 2 ? 40 : 0 }} transition={{ delay: i * 0.1 }}>{m}</motion.td></tr>
            ))}</tbody>
          </table>
          {s === 3 && <motion.div {...pop} className="font-bold">mean = (78+91+35+66)/4 = <span className="text-pink-600">67.5</span></motion.div>}
          <Code>{['df = pd.DataFrame(data)', 'marks = df["marks"]  # Series', 'df["marks"]', 'df["marks"].mean()'][s]}</Code>
        </div>
      )}
    </Anim>
  );
}

export function PandasMask() {
  return (
    <Anim ms={2000} captions={[
      'Boolean masking = a chhalni (sieve) 🥣',
      'df["marks"] > 40 asks every row: True or False?',
      'The sieve keeps only the True rows. Hari (35) falls through ⬇️',
      'df[df["marks"] > 40] → the passed students only ✅',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center gap-2">
          <div className="space-y-1">
            {register.map(([n, m], i) => {
              const ok = m > 40;
              return (
                <motion.div key={n} className="flex items-center gap-2"
                  animate={s >= 2 && !ok ? { y: 120, opacity: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: i * 0.1 }}>
                  <span className="bg-white border rounded px-2 w-28">{n} – {m}</span>
                  {s >= 1 && <motion.span {...pop} className={`font-mono text-sm font-bold ${ok ? 'text-green-600' : 'text-red-500'}`}>{String(ok ? 'True' : 'False')}</motion.span>}
                </motion.div>
              );
            })}
          </div>
          <div className="text-5xl">🥣</div>
          <Code>{s < 3 ? 'df["marks"] > 40' : 'df[df["marks"] > 40]'}</Code>
        </div>
      )}
    </Anim>
  );
}

export function Plotting() {
  const data = [78, 91, 35, 66];
  return (
    <Anim ms={2000} captions={[
      'matplotlib = drawing on graph paper 📈',
      'plt.bar(names, marks) draws one bar per student',
      'Add labels and a title so everyone understands',
      'seaborn = matplotlib with makeup 💄 — prettier colours with less code',
    ]}>
      {(s) => (
        <div className="flex flex-col items-center">
          {s >= 2 && <motion.p {...pop} className="font-bold">Class 10 Marks</motion.p>}
          <div className="relative w-72 h-40 border-l-2 border-b-2 border-slate-600"
            style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '18px 18px' }}>
            <div className="absolute inset-0 flex items-end justify-around px-2">
              {data.map((d, i) => (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: s >= 1 ? `${d}%` : 0 }} transition={{ delay: i * 0.2 }}
                  className={`w-10 rounded-t ${s === 3 ? ['bg-pink-400', 'bg-violet-400', 'bg-sky-400', 'bg-emerald-400'][i] : 'bg-blue-600'}`} />
              ))}
            </div>
          </div>
          <div className="flex justify-around w-72 text-xs">{register.map(([n]) => <span key={n}>{n}</span>)}</div>
          {s >= 2 && <span className="text-xs">x: Students · y: Marks</span>}
          {s === 3 && <motion.span {...pop} className="text-3xl absolute">💄</motion.span>}
        </div>
      )}
    </Anim>
  );
}
