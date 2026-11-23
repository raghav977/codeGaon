import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Topic } from '../content/types';

export function HintBox({ hints }: { hints: Topic['hints'] }) {
  const [level, setLevel] = useState(0);
  return (
    <div className="card !p-4 bg-yellow-50 border-2 border-yellow-300">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold">💡 Hint</h3>
        {level < 3 && <button className="btn-ghost !py-1 text-sm" onClick={() => setLevel(level + 1)}>{level === 0 ? 'Show hint' : `Hint ${level + 1} of 3`}</button>}
      </div>
      <AnimatePresence>
        {hints.slice(0, level).map((h, i) => (
          <motion.p key={i} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-2 text-sm">
            <b>{i + 1}.</b> {h}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function MistakeBox({ mistake }: { mistake: Topic['mistake'] }) {
  return (
    <div className="card !p-4 bg-red-50 border-2 border-red-200">
      <h3 className="font-extrabold">⚠️ Common Mistake</h3>
      <div className="space-y-2 mt-2 text-sm">
        <div><span className="text-red-600 font-bold">❌ Wrong</span><pre className="bg-white rounded-lg p-2 font-mono text-xs whitespace-pre-wrap break-words">{mistake.wrong}</pre></div>
        <div><span className="text-green-700 font-bold">✅ Right</span><pre className="bg-white rounded-lg p-2 font-mono text-xs whitespace-pre-wrap break-words">{mistake.right}</pre></div>
        <p>{mistake.why}</p>
      </div>
    </div>
  );
}

export function SeeTipBox({ tip }: { tip: string }) {
  return (
    <div className="card !p-4 bg-sky-50 border-2 border-sky-200">
      <h3 className="font-extrabold">📝 SEE Tip</h3>
      <p className="text-sm mt-1">{tip}</p>
    </div>
  );
}
