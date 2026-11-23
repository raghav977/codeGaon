import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export interface Progress {
  name: string;
  roll: string;
  xp: number;
  streak: number;
  lastDay: string;
  /** topicId -> best quiz score (0-3) */
  done: Record<string, number>;
  badges: string[];
}

// Lab PCs are shared, so we keep one progress record per student (roll + name).
const KEY = 'codegaon-v1';
interface Store { current: string; students: Record<string, Progress> }
const empty: Progress = { name: '', roll: '', xp: 0, streak: 0, lastDay: '', done: {}, badges: [] };
const today = () => new Date().toISOString().slice(0, 10);
const keyOf = (name: string, roll: string) => `${roll.trim()}|${name.trim().toLowerCase()}`;

function readStore(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { current: '', students: {} };
  } catch {
    return { current: '', students: {} };
  }
}
function writeStore(s: Store) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked */ }
}
function load(): Progress {
  const s = readStore();
  return s.current && s.students[s.current] ? { ...empty, ...s.students[s.current] } : empty;
}

function bumpStreak(p: Progress): Progress {
  const t = today();
  if (p.lastDay === t) return p;
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return { ...p, lastDay: t, streak: p.lastDay === y ? p.streak + 1 : 1 };
}

interface Ctx {
  p: Progress;
  login: (name: string, roll: string) => void;
  logout: () => void;
  finishQuiz: (topicId: string, score: number, badge: string) => { xpGained: number; newBadge: boolean };
}

const ProgressCtx = createContext<Ctx>(null as unknown as Ctx);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Progress>(load);

  useEffect(() => {
    const s = readStore();
    if (p.name) { const k = keyOf(p.name, p.roll); s.students[k] = p; s.current = k; } else s.current = '';
    writeStore(s);
  }, [p]);

  useEffect(() => { if (p.name) setP((x) => bumpStreak(x)); }, [p.name]);

  const login = useCallback((name: string, roll: string) => {
    const saved = readStore().students[keyOf(name, roll)];
    setP(bumpStreak({ ...empty, ...saved, name, roll }));
  }, []);
  const logout = useCallback(() => setP(empty), []);

  const finishQuiz = useCallback((topicId: string, score: number, badge: string) => {
    const prev = p.done[topicId] ?? -1;
    const passed = score >= 2;
    // XP only for improvement, so replaying can't farm XP
    const xpGained = Math.max(0, score - Math.max(prev, 0)) * 10 + (passed && prev < 2 ? 20 : 0);
    const newBadge = passed && !p.badges.includes(badge);
    setP((x) => bumpStreak({
      ...x,
      xp: x.xp + xpGained,
      done: { ...x.done, [topicId]: Math.max(prev, score) },
      badges: newBadge ? [...x.badges, badge] : x.badges,
    }));
    return { xpGained, newBadge };
  }, [p]);

  return <ProgressCtx.Provider value={{ p, login, logout, finishQuiz }}>{children}</ProgressCtx.Provider>;
}

export const useProgress = () => useContext(ProgressCtx);
export const isDone = (p: Progress, id: string) => (p.done[id] ?? 0) >= 2;
