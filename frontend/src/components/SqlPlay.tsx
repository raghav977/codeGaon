import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import CodeEditor from './CodeEditor';
import { getSql } from '../lib/mysql/loadSql';
import { MySQLEngine, type SqlResult } from '../lib/mysql/engine';

export default function SqlPlay({ starter, setup = '' }: { starter: string; setup?: string }) {
  const [code, setCode] = useState(starter);
  const [results, setResults] = useState<SqlResult[]>([]);
  const [ready, setReady] = useState(false);
  const engine = useRef<MySQLEngine | null>(null);

  async function fresh() {
    const SQL = await getSql();
    engine.current?.close();
    engine.current = new MySQLEngine(SQL);
    if (setup) engine.current.setup(setup);
    setReady(true);
  }

  useEffect(() => { setCode(starter); setResults([]); fresh(); return () => engine.current?.close(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starter, setup]);

  function run() {
    if (!engine.current) return;
    setResults(engine.current.run(code));
  }

  return (
    <div className="space-y-3">
      {setup && (
        <p className="text-sm text-slate-500">📒 A practice register is already loaded for you. Try <code className="bg-amber-100 px-1 rounded">SHOW TABLES;</code></p>
      )}
      <CodeEditor value={code} lang="sql" onChange={setCode} onRun={run} />
      <div className="flex flex-wrap gap-2">
        <button className="btn-green" onClick={run} disabled={!ready}>{ready ? '▶ Run' : '⏳ Loading…'}</button>
        <button className="btn-ghost" onClick={() => { setCode(starter); setResults([]); fresh(); }}>↺ Reset register</button>
        <span className="text-xs text-slate-400 self-center hidden sm:inline">End each command with ; · Ctrl+Enter runs</span>
      </div>
      <div className="space-y-3">
        {results.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
            <p className="font-mono text-xs text-slate-400 truncate">mysql&gt; {r.sql}</p>
            {r.kind === 'table' && (
              r.rows.length === 0
                ? <p className="text-slate-600">Empty set — no rows found. <span className="text-xs">(Columns: {r.columns.join(', ')})</span></p>
                : <div className="overflow-x-auto">
                    <table className="result bg-white rounded">
                      <thead><tr>{r.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                      <tbody>{r.rows.map((row, j) => <tr key={j}>{row.map((v, k) => <td key={k}>{v === null ? <i className="text-slate-400">NULL</i> : String(v)}</td>)}</tr>)}</tbody>
                    </table>
                    <p className="text-xs text-slate-500">{r.rows.length} row{r.rows.length === 1 ? '' : 's'} in set</p>
                  </div>
            )}
            {r.kind === 'message' && <p className="text-green-700 font-bold whitespace-pre-line">{r.text}</p>}
            {r.kind === 'error' && (
              <div className="rounded-2xl bg-red-50 border-2 border-red-300 p-3">
                <p className="font-bold text-red-700">🙈 {r.text}</p>
                {r.hint && <p className="text-red-900">{r.hint}</p>}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
