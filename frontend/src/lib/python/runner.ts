// Main-thread client for the Pyodide worker.
export interface PyError { type: string; message: string; line: number | null }
export interface PyResult { stdout: string; images: string[]; error: PyError | null }

type Listener = (status: { ready: boolean; text: string }) => void;

let worker: Worker | null = null;
let ready = false;
let statusText = '';
let nextId = 1;
const listeners = new Set<Listener>();
const pending = new Map<number, { out: string[]; onOut: (s: string) => void; resolve: (r: PyResult) => void }>();

function emit() { listeners.forEach((l) => l({ ready, text: statusText })); }

function spawn() {
  ready = false;
  statusText = 'Starting Python…';
  worker = new Worker(new URL('./pyWorker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e) => {
    const d = e.data;
    if (d.type === 'ready') { ready = true; statusText = ''; emit(); return; }
    if (d.type === 'bootError') { statusText = 'Python could not load. Connect to the internet once — after that it works offline.'; emit(); return; }
    if (d.type === 'status') { statusText = d.text; emit(); return; }
    const p = pending.get(d.id);
    if (!p) return;
    if (d.type === 'stdout') { p.out.push(d.text); p.onOut(p.out.join('\n')); }
    if (d.type === 'done') {
      pending.delete(d.id);
      statusText = ''; emit();
      p.resolve({ stdout: p.out.join('\n'), images: d.images ?? [], error: d.error ?? null });
    }
  };
  emit();
}

/** Start loading Pyodide in the background (call when entering Python House). */
export function warmUpPython() { if (!worker) spawn(); }

export function onPythonStatus(l: Listener) {
  listeners.add(l);
  l({ ready, text: statusText });
  return () => { listeners.delete(l); };
}

export function runPython(code: string, stdin: string[], onOut: (s: string) => void = () => {}): Promise<PyResult> {
  warmUpPython();
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, { out: [], onOut, resolve });
    worker!.postMessage({ id, code, stdin });
  });
}

/** Kill a stuck program (e.g. infinite while loop) and restart Python. */
export function stopPython() {
  worker?.terminate();
  worker = null;
  for (const [, p] of pending) p.resolve({ stdout: p.out.join('\n'), images: [], error: { type: 'Stopped', message: '', line: null } });
  pending.clear();
  spawn();
}
