import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { houses, topicsByHouse } from '../content';
import { isDone, useProgress } from '../lib/progress';

export default function MapPage() {
  const { p } = useProgress();
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-48px)] bg-gradient-to-b from-sky-300 via-sky-100 to-green-300">
      {/* sky */}
      <motion.div className="absolute top-6 right-8 text-6xl" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}>☀️</motion.div>
      {[0, 1].map((i) => (
        <motion.div key={i} className="absolute text-5xl opacity-90" style={{ top: 30 + i * 50 }}
          initial={{ x: -120 }} animate={{ x: '110vw' }} transition={{ repeat: Infinity, duration: 50 + i * 20, delay: i * 12, ease: 'linear' }}>☁️</motion.div>
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-500 to-transparent" />
      <div className="absolute top-24 left-0 right-0 text-center text-5xl opacity-40 select-none">🏔️🏔️🏔️</div>

      <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900 drop-shadow">Namaste, {p.name.split(' ')[0]}! 🙏</h1>
        <p className="text-green-900 font-semibold">Welcome to the Gaon. Pick a house to start learning.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 mt-10">
          {houses.map((h, i) => {
            const topics = topicsByHouse[h.id] ?? [];
            const done = topics.filter((t) => isDone(p, t.id)).length;
            const inner = (
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                whileHover={h.unlocked ? { y: -8, scale: 1.04 } : {}} whileTap={h.unlocked ? { scale: 0.97 } : {}}
                className={`flex flex-col items-center ${h.unlocked ? 'cursor-pointer' : 'grayscale opacity-70'}`}>
                {/* roof */}
                <div className={`w-0 h-0 border-l-[70px] border-r-[70px] border-b-[50px] border-l-transparent border-r-transparent ${h.roof}`} />
                <div className={`w-[120px] h-[90px] ${h.color} rounded-b-lg shadow-lg flex flex-col items-center justify-center relative`}>
                  <span className="text-4xl -mt-6">{h.unlocked ? h.emoji : '🔒'}</span>
                  <div className="absolute bottom-0 w-6 h-8 bg-amber-800 rounded-t-md" />
                </div>
                <div className="mt-2 text-center bg-white/90 rounded-xl px-3 py-1 shadow">
                  <div className="font-extrabold">{h.name}</div>
                  <div className="text-xs text-slate-500">{h.unlocked ? h.tagline : 'Coming soon 🔒'}</div>
                  {h.unlocked && (
                    <div className="w-28 h-2 bg-slate-200 rounded-full mt-1 mx-auto overflow-hidden">
                      <motion.div className="h-full bg-green-500" initial={{ width: 0 }} animate={{ width: `${(done / topics.length) * 100}%` }} />
                    </div>
                  )}
                  {h.unlocked && <div className="text-xs">{done}/{topics.length} topics</div>}
                </div>
              </motion.div>
            );
            return h.unlocked ? <Link key={h.id} to={`/house/${h.id}`}>{inner}</Link> : <div key={h.id}>{inner}</div>;
          })}
          <div className="hidden sm:flex items-end justify-center text-6xl">🌳🐄</div>
        </div>
      </div>
    </div>
  );
}
