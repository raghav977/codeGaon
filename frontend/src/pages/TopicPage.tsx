import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { findTopic, topicsByHouse } from '../content';
import { animations } from '../animations/registry';
import Quiz from '../components/Quiz';
import { HintBox, MistakeBox, SeeTipBox } from '../components/HelpBoxes';
import { isDone, useProgress } from '../lib/progress';
import { warmUpPython } from '../lib/python/runner';

// Editors are heavy — load them only when the PLAY step opens.
const PythonPlay = lazy(() => import('../components/PythonPlay'));
const SqlPlay = lazy(() => import('../components/SqlPlay'));

const STEPS = [
  { key: 'story', label: 'Story', emoji: '📖' },
  { key: 'watch', label: 'Watch', emoji: '🎬' },
  { key: 'play', label: 'Play', emoji: '🎮' },
  { key: 'prove', label: 'Prove', emoji: '🏆' },
] as const;

export default function TopicPage() {
  const { topicId = '' } = useParams();
  const topic = findTopic(topicId);
  const { p } = useProgress();
  const nav = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => { setStep(0); window.scrollTo(0, 0); }, [topicId]);
  useEffect(() => { if (topic?.house === 'python') warmUpPython(); }, [topic]);

  if (!topic) return <Navigate to="/" />;
  const list = topicsByHouse[topic.house];
  const idx = list.findIndex((t) => t.id === topic.id);
  const next = list[idx + 1];
  const Animation = animations[topic.animation];

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      <Link to={`/house/${topic.house}`} className="text-green-700 font-bold">← {topic.house === 'python' ? 'Python House' : 'MySQL House'}</Link>
      <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 flex items-center gap-2">
        <span>{topic.emoji}</span> {topic.title} {isDone(p, topic.id) && <span title="Completed">✅</span>}
      </h1>

      {/* step tabs */}
      <nav className="grid grid-cols-4 gap-2 mt-4">
        {STEPS.map((s, i) => (
          <button key={s.key} onClick={() => setStep(i)}
            className={`rounded-2xl py-2 font-bold text-sm sm:text-base transition ${i === step ? 'bg-green-500 text-white shadow-lg scale-105' : i < step ? 'bg-green-100 text-green-800' : 'bg-white text-slate-500'}`}>
            <span className="text-lg sm:text-xl">{s.emoji}</span><br className="sm:hidden" /> <span>{i + 1}. {s.label}</span>
          </button>
        ))}
      </nav>

      <div className="grid lg:grid-cols-[1fr_300px] gap-5 mt-5">
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.section key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              {step === 0 && (
                <div className="card space-y-3">
                  <div className="flex justify-center gap-4 text-6xl">
                    {topic.story.pictures.map((e, i) => (
                      <motion.span key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.2, type: 'spring' }}>{e}</motion.span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-extrabold text-center">{topic.story.title}</h2>
                  <ul className="space-y-2 text-lg">
                    {topic.story.lines.map((l, i) => (
                      <motion.li key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.15 }} className="flex gap-2">
                        <span>👉</span><span>{l}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              {step === 1 && (Animation ? <Animation /> : <p>Animation coming soon.</p>)}
              {step === 2 && (
                <div className="card space-y-3">
                  <p className="text-lg"><b>🎯 Your task:</b> {topic.play.task}</p>
                  <Suspense fallback={<p>Opening the editor… ⏳</p>}>
                    {topic.house === 'python'
                      ? <PythonPlay starter={topic.play.starter} stdin={topic.play.stdin} indentBoxes={topic.play.indentBoxes} />
                      : <SqlPlay starter={topic.play.starter} setup={topic.play.setup} />}
                  </Suspense>
                </div>
              )}
              {step === 3 && <Quiz key={topic.id} topic={topic} onFinish={() => nav(next ? `/topic/${next.id}` : `/house/${topic.house}`)} />}
            </motion.section>
          </AnimatePresence>

          {step < 3 && (
            <div className="flex justify-between mt-4">
              <button className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
              <button className="btn-green" onClick={() => setStep(step + 1)}>Next: {STEPS[step + 1].emoji} {STEPS[step + 1].label} →</button>
            </div>
          )}
        </main>

        <aside className="space-y-4 min-w-0">
          <HintBox key={topic.id} hints={topic.hints} />
          <MistakeBox mistake={topic.mistake} />
          <SeeTipBox tip={topic.seeTip} />
        </aside>
      </div>
    </div>
  );
}
