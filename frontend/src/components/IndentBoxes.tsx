import { motion } from 'framer-motion';

const LEVELS = [
  { name: 'Almirah', emoji: '🗄️', bg: 'bg-amber-100', border: 'border-amber-500' },
  { name: 'Bag', emoji: '🎒', bg: 'bg-sky-100', border: 'border-sky-500' },
  { name: 'Tiffin', emoji: '🍱', bg: 'bg-green-100', border: 'border-green-500' },
  { name: 'Momo', emoji: '🥟', bg: 'bg-pink-100', border: 'border-pink-500' },
  { name: 'Plate', emoji: '🍽️', bg: 'bg-violet-100', border: 'border-violet-500' },
];

interface Line { text: string; depth: number; bad?: string; blank?: boolean }

export function analyseIndent(code: string): Line[] {
  const stack = [0];
  let expectOpen = false;
  return code.split('\n').map((raw) => {
    const text = raw.replace(/\t/g, '    ');
    if (!text.trim()) return { text: '', depth: stack.length - 1, blank: true };
    const ind = text.length - text.trimStart().length;
    let bad: string | undefined;
    const top = stack[stack.length - 1];
    if (expectOpen) {
      expectOpen = false;
      if (ind > top) stack.push(ind);
      else {
        // Recover: pretend the box opened at top+4 so later correct lines aren't flagged too.
        const depth = stack.length - 1;
        stack.push(top + 4);
        return { text: text.trimStart(), depth, bad: 'Tiffin fell out! This line should be inside the box above (add 4 spaces).' };
      }
    } else if (ind > top) {
      bad = 'Sticking out! Extra spaces — this line has no box to live in.';
    } else if (ind < top) {
      while (stack.length > 1 && stack[stack.length - 1] > ind) stack.pop();
      if (stack[stack.length - 1] !== ind) bad = "Spaces don't match any box. Line it up exactly.";
    }
    if (!bad && /:\s*(#.*)?$/.test(text.trim())) expectOpen = true;
    return { text: text.trimStart(), depth: stack.length - 1, bad };
  });
}

/** Live view: code as nested coloured boxes. A mis-indented line visibly sticks out. */
export default function IndentBoxes({ code }: { code: string }) {
  const lines = analyseIndent(code);
  return (
    <div className="card !p-3">
      <div className="flex flex-wrap gap-2 text-xs mb-2">
        {LEVELS.slice(0, 4).map((l, i) => (
          <span key={l.name} className={`px-2 py-0.5 rounded-full border ${l.bg} ${l.border}`}>{l.emoji} level {i}: {l.name}</span>
        ))}
      </div>
      <div className="font-mono text-sm space-y-0.5">
        {lines.map((l, i) => (
          <div key={i} className="flex items-stretch min-h-[1.5rem]">
            <span className="w-6 text-right pr-1 text-slate-400 text-xs leading-6">{i + 1}</span>
            {Array.from({ length: l.depth + 1 }).map((_, d) => (
              <div key={d} className={`border-l-4 ${LEVELS[d % 5].border} ${LEVELS[d % 5].bg} ${d === l.depth ? 'flex-1' : 'w-5'} ${d === l.depth ? 'pl-2' : ''}`}>
                {d === l.depth && !l.blank && (
                  <motion.div
                    animate={l.bad ? { x: [0, 28, 22, 28], rotate: [0, -3, 2, -3] } : { x: 0, rotate: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`leading-6 whitespace-pre ${l.bad ? 'bg-red-200 border-2 border-red-500 rounded px-1 inline-block' : ''}`}
                  >
                    {l.text}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {lines.filter((l) => l.bad).slice(0, 1).map((l) => (
        <p key="bad" className="mt-2 text-red-600 font-bold">⚠️ Line {lines.indexOf(l) + 1}: {l.bad}</p>
      ))}
      {!lines.some((l) => l.bad) && <p className="mt-2 text-green-700 font-bold">✅ Every line is safely inside its box!</p>}
    </div>
  );
}
