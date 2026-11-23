import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { houses, topicsByHouse } from '../content';
import { isDone, useProgress } from '../lib/progress';
import { warmUpPython } from '../lib/python/runner';

export default function HousePage() {
  const { houseId = '' } = useParams();
  const { p } = useProgress();
  const house = houses.find((h) => h.id === houseId);
  const topics = topicsByHouse[houseId];

  // Start downloading Python quietly while the student reads the menu.
  useEffect(() => { if (houseId === 'python') warmUpPython(); }, [houseId]);

  if (!house || !topics) return <Navigate to="/" />;
  const nextIdx = topics.findIndex((t) => !isDone(p, t.id));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to="/" className="text-green-700 font-bold">← Back to the Gaon</Link>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-5xl">{house.emoji}</span>
        <div>
          <h1 className="text-3xl font-extrabold">{house.name}</h1>
          <p className="text-slate-500">{house.tagline}</p>
        </div>
      </div>

      <ol className="mt-8 relative">
        <div className="absolute left-7 top-4 bottom-4 border-l-4 border-dashed border-amber-300" />
        {topics.map((t, i) => {
          const done = isDone(p, t.id);
          const next = i === nextIdx;
          return (
            <motion.li key={t.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }} className="relative mb-4">
              <Link to={`/topic/${t.id}`} className={`flex items-center gap-4 card !p-3 hover:shadow-lg transition ${done ? 'bg-green-50 border-2 border-green-400' : next ? 'border-2 border-orange-400' : ''}`}>
                <motion.span animate={next ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`relative z-10 w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-2xl ${done ? 'bg-green-500' : next ? 'bg-orange-300' : 'bg-slate-200'}`}>
                  {done ? '✅' : t.emoji}
                </motion.span>
                <div className="flex-1">
                  <div className="text-xs text-slate-400">Topic {i + 1}</div>
                  <div className="font-bold leading-tight">{t.title}</div>
                  {next && <div className="text-xs text-orange-600 font-bold">👉 Start here</div>}
                </div>
                {done && <span className="text-2xl" title={t.badge.name}>{t.badge.emoji}</span>}
              </Link>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
