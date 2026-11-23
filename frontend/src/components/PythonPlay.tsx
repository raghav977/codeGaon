import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CodeEditor from './CodeEditor';
import IndentBoxes from './IndentBoxes';
import PyLoader from './PyLoader';
import { onPythonStatus, runPython, stopPython, type PyResult } from '../lib/python/runner';
import { friendlyPyError } from '../lib/python/friendlyErrors';

export default function PythonPlay({ starter, stdin: stdinDefault = '', indentBoxes }: { starter: string; stdin?: string; indentBoxes?: boolean }) {
  const [code, setCode] = useState(starter);
  const [stdin, setStdin] = useState(stdinDefault);
  const [status, setStatus] = useState({ ready: false, text: '' });
  const [running, setRunning] = useState(false);
  const [live, setLive] = useState('');
  const [result, setResult] = useState<PyResult | null>(null);

  useEffect(() => onPythonStatus(setStatus), []);
  useEffect(() => { setCode(starter); setStdin(stdinDefault); setResult(null); }, [starter, stdinDefault]);

  const usesInput = /\binput\s*\(/.test(code);

  async function run() {
    if (running) return;
    setRunning(true); setResult(null); setLive('');
    const lines = stdin.split('\n').filter((l, i, a) => l !== '' || i < a.length - 1);
    const r = await runPython(code, lines, setLive);
    setResult(r); setRunning(false);
  }

  const err = result?.error ? friendlyPyError(result.error, code) : null;

  return (
    <div className="space-y-3">
      <CodeEditor value={code} lang="python" onChange={setCode} onRun={run} />
      {indentBoxes && <IndentBoxes code={code} />}
      {usesInput && (
        <label className="block">
          <span className="font-bold text-sm">⌨️ Input box — type one answer per line for each input():</span>
          <textarea value={stdin} onChange={(e) => setStdin(e.target.value)} rows={2}
            className="w-full mt-1 font-mono text-sm rounded-xl border-2 border-sky-200 p-2 bg-sky-50" />
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        <button className="btn-green" onClick={run} disabled={running}>{running ? '⏳ Running…' : '▶ Run'}</button>
        {running && <button className="btn-ghost" onClick={stopPython}>⏹ Stop</button>}
        <button className="btn-ghost" onClick={() => { setCode(starter); setResult(null); }}>↺ Reset code</button>
        <span className="text-xs text-slate-400 self-center hidden sm:inline">Tip: Ctrl+Enter also runs</span>
      </div>
      {!status.ready && (running || status.text) && <PyLoader text={status.text} />}
      {status.ready && status.text && running && <PyLoader text={status.text} />}
      {(live || (result && (result.stdout || result.images.length || !err))) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-slate-900 text-green-300 p-3 font-mono text-sm min-h-[60px]">
          <div className="text-slate-400 text-xs mb-1">OUTPUT</div>
          <pre className="whitespace-pre-wrap">{(result?.stdout ?? live) || (result && !err && !result.images.length ? '(Nothing printed. Use print() to see something!)' : '')}</pre>
          {result?.images.map((b64, i) => (
            <img key={i} src={`data:image/png;base64,${b64}`} alt="plot" className="mt-2 bg-white rounded-xl max-w-full" />
          ))}
        </motion.div>
      )}
      {err && (
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="rounded-2xl bg-red-50 border-2 border-red-300 p-3">
          <p className="font-bold text-red-700">{err.title}</p>
          {err.hint && <p className="text-red-900">{err.hint}</p>}
        </motion.div>
      )}
    </div>
  );
}
