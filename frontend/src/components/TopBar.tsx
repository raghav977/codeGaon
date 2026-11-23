import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../lib/progress';
import { allTopics } from '../content';

export default function TopBar() {
  const { p, logout } = useProgress();
  const badgeEmojis = allTopics.filter((t) => p.badges.includes(t.badge.name)).map((t) => t.badge.emoji);
  return (
    <header className="sticky top-0 z-20 bg-green-600 text-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
        <Link to="/" className="font-extrabold text-xl flex items-center gap-1">🏡 <span className="hidden sm:inline">CodeGaon</span></Link>
        <div className="flex-1" />
        <motion.span key={p.xp} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="bg-yellow-300 text-yellow-900 rounded-full px-3 font-bold" title="Experience points">⭐ {p.xp} XP</motion.span>
        <span className="bg-orange-400 rounded-full px-3 font-bold" title="Days in a row">🔥 {p.streak}</span>
        <span className="bg-white/20 rounded-full px-3 font-bold max-w-[8rem] sm:max-w-xs truncate" title={badgeEmojis.length ? `${badgeEmojis.length} badges` : 'No badges yet'}>
          🏅 {badgeEmojis.length ? badgeEmojis.join('') : 0}
        </span>
        <button onClick={logout} className="hidden sm:block text-sm opacity-80 hover:opacity-100" title="Switch student (your progress stays saved)">
          👤 {p.name}
        </button>
      </div>
    </header>
  );
}
