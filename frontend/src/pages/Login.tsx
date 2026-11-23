import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../lib/progress';

export default function Login() {
  const { login } = useProgress();
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const ok = name.trim().length >= 2 && roll.trim().length > 0;
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-sky-300 to-green-200">
      <motion.form initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card w-full max-w-sm text-center space-y-4"
        onSubmit={(e) => { e.preventDefault(); if (ok) login(name.trim(), roll.trim()); }}>
        <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-7xl">🏡</motion.div>
        <h1 className="text-3xl font-extrabold text-green-700">CodeGaon</h1>
        <p className="text-slate-600">Learn SEE Computer Science the fun way — Python & MySQL with momos, registers and games!</p>
        <input className="w-full rounded-2xl border-2 border-green-300 px-4 py-3 text-lg" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        <input className="w-full rounded-2xl border-2 border-green-300 px-4 py-3 text-lg" placeholder="Roll number" value={roll} onChange={(e) => setRoll(e.target.value)} inputMode="numeric" />
        <button className="btn-green w-full justify-center text-lg" disabled={!ok}>Enter the Gaon 🚪</button>
        <p className="text-xs text-slate-400">Your progress is saved on this device.</p>
      </motion.form>
    </div>
  );
}
