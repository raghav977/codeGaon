import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Topic } from '../content/types';
import { useProgress } from '../lib/progress';

function Confetti() {
  const bits = ['🎉', '⭐', '🥟', '🎊', '✨', '🏅'];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span key={i} className="absolute text-3xl" style={{ left: `${(i * 37) % 100}%`, top: -40 }}
          animate={{ y: '110vh', rotate: 360 * (i % 2 ? 1 : -1) }} transition={{ duration: 2 + (i % 5) * 0.4, delay: (i % 6) * 0.1 }}>
          {bits[i % bits.length]}
        </motion.span>
      ))}
    </div>
  );
}

export default function Quiz({ topic, onFinish }: { topic: Topic; onFinish: () => void }) {
  const { finishQuiz } = useProgress();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ score: number; xp: number; badge: boolean } | null>(null);
  const q = topic.quiz[i];

  function pick(n: number) {
    if (picked !== null) return;
    setPicked(n);
    if (n === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (i < 2) { setI(i + 1); setPicked(null); return; }
    const r = finishQuiz(topic.id, score, topic.badge.name);
    setResult({ score, xp: r.xpGained, badge: r.newBadge });
  }

  function retry() { setI(0); setPicked(null); setScore(0); setResult(null); }

  if (result) {
    const passed = result.score >= 2;
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card text-center space-y-3">
        {passed && <Confetti />}
        <div className="text-6xl">{passed ? (result.score === 3 ? '🏆' : '🎉') : '💪'}</div>
        <h3 className="text-2xl font-extrabold">{result.score} / 3 correct</h3>
        {passed ? (
          <>
            <p className="text-green-700 font-bold">Topic complete! It is now green on the map ✅</p>
            {result.xp > 0 && <p className="text-lg">+{result.xp} XP ⭐</p>}
            {result.badge && (
              <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
                className="inline-block bg-yellow-100 border-4 border-yellow-400 rounded-3xl px-6 py-3">
                <div className="text-5xl">{topic.badge.emoji}</div>
                <div className="font-bold">New badge: {topic.badge.name}</div>
              </motion.div>
            )}
          </>
        ) : (
          <p>You need 2 out of 3 to finish this topic. Look at the story again and try once more — you can do it!</p>
        )}
        <div className="flex justify-center gap-2">
          <button className="btn-ghost" onClick={retry}>↺ Try again</button>
          {passed && <button className="btn-green" onClick={onFinish}>Next topic →</button>}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="card space-y-4">
      <div className="flex justify-between text-sm text-slate-500"><span>Question {i + 1} of 3</span><span>✅ {score}</span></div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} className="space-y-3">
          <p className="text-xl font-bold">{q.q}</p>
          {q.code && <pre className="bg-slate-900 text-amber-200 rounded-xl p-3 font-mono text-sm overflow-x-auto">{q.code}</pre>}
          <div className="grid gap-2">
            {q.options.map((o, n) => {
              const state = picked === null ? '' : n === q.answer ? 'bg-green-200 border-green-500' : n === picked ? 'bg-red-200 border-red-500' : 'opacity-60';
              return (
                <motion.button key={n} whileTap={{ scale: 0.97 }} onClick={() => pick(n)}
                  animate={picked === n && n !== q.answer ? { x: [0, -8, 8, -4, 0] } : {}}
                  className={`text-left rounded-2xl border-2 border-slate-200 px-4 py-3 font-mono ${state} ${picked === null ? 'hover:bg-amber-50' : ''}`}>
                  {String.fromCharCode(65 + n)}. {o}
                </motion.button>
              );
            })}
          </div>
          {picked !== null && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-3 ${picked === q.answer ? 'bg-green-50' : 'bg-orange-50'}`}>
              <b>{picked === q.answer ? '🎉 Correct!' : '🙂 Not quite.'}</b> {q.explain}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      {picked !== null && <button className="btn-green" onClick={next}>{i < 2 ? 'Next question →' : 'See my score 🏁'}</button>}
    </div>
  );
}
