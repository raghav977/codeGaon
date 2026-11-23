import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Step counter that auto-advances and loops. */
export function useSteps(count: number, ms = 1800) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % count), step === count - 1 ? ms * 1.8 : ms);
    return () => clearTimeout(t);
  }, [step, count, ms, paused]);
  return { step, setStep, paused, setPaused };
}

/** A framed stage with a caption for the current step and simple controls. */
export function Stage({ captions, step, setStep, paused, setPaused, children }: {
  captions: string[]; step: number; setStep: (n: number) => void; paused: boolean; setPaused: (b: boolean) => void; children: ReactNode;
}) {
  return (
    <div className="card bg-gradient-to-b from-sky-50 to-white overflow-hidden">
      <div className="min-h-[220px] flex items-center justify-center overflow-hidden">{children}</div>
      <AnimatePresence mode="wait">
        <motion.p key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-center text-lg font-bold text-slate-700 mt-3 min-h-[3.5rem]">
          {captions[step]}
        </motion.p>
      </AnimatePresence>
      <div className="flex justify-center items-center gap-2 mt-2">
        {captions.map((_, i) => (
          <button key={i} aria-label={`step ${i + 1}`} onClick={() => { setStep(i); setPaused(true); }}
            className={`w-3 h-3 rounded-full ${i === step ? 'bg-green-500' : 'bg-slate-300'}`} />
        ))}
        <button className="ml-3 text-sm btn-ghost !py-1" onClick={() => setPaused(!paused)}>{paused ? '▶ Play' : '⏸ Pause'}</button>
        <button className="text-sm btn-ghost !py-1" onClick={() => { setStep(0); setPaused(false); }}>↺ Replay</button>
      </div>
    </div>
  );
}

/** Convenience wrapper: give captions + a render function of the step. */
export function Anim({ captions, ms, children }: { captions: string[]; ms?: number; children: (step: number) => ReactNode }) {
  const s = useSteps(captions.length, ms);
  return <Stage captions={captions} {...s}>{children(s.step)}</Stage>;
}

export const pop = { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 } };

export function Code({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <code className={`font-mono bg-slate-800 text-amber-200 rounded-lg px-2 py-1 text-xs sm:text-sm whitespace-pre-wrap break-words max-w-full inline-block ${className}`}>{children}</code>;
}
