/// <reference lib="webworker" />
// Runs Pyodide off the main thread so slow lab PCs don't freeze.
export const PYODIDE_VERSION = '0.26.4';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodide: any = null;
const loaded = new Set<string>();

const post = (msg: unknown) => (self as unknown as Worker).postMessage(msg);

async function boot() {
  post({ type: 'status', text: 'Heating the momo steamer… (downloading Python)' });
  const mod = await import(/* @vite-ignore */ `${INDEX_URL}pyodide.mjs`);
  pyodide = await mod.loadPyodide({ indexURL: INDEX_URL });
  await pyodide.runPythonAsync(`
import builtins, sys
__stdin_lines = []
def __codegaon_input(prompt=''):
    if not __stdin_lines:
        raise EOFError('no more input')
    v = __stdin_lines.pop(0)
    print(f"{prompt}{v}")
    return v
builtins.input = __codegaon_input
`);
  post({ type: 'ready' });
}
const booting = boot().catch((e) => post({ type: 'bootError', text: String(e) }));

const PKG_FOR: Record<string, string[]> = {
  pandas: ['pandas'],
  numpy: ['numpy'],
  matplotlib: ['matplotlib'],
  seaborn: ['pandas', 'matplotlib', 'micropip'],
};

self.onmessage = async (e: MessageEvent) => {
  const { id, code, stdin } = e.data as { id: number; code: string; stdin: string[] };
  await booting;
  if (!pyodide) return post({ id, type: 'done', error: { type: 'BootError', message: 'Python could not load. Check the internet once, then it works offline.', line: null } });

  try {
    // 1. Load needed packages (first time only; cached by the service worker afterwards)
    const imports = new Set<string>();
    for (const m of code.matchAll(/^\s*(?:import|from)\s+(\w+)/gm)) imports.add(m[1]);
    const needed = [...imports].flatMap((i) => PKG_FOR[i] ?? []).filter((p) => !loaded.has(p));
    if (needed.length) {
      post({ id, type: 'status', text: `Bringing ingredients: ${needed.filter((n) => n !== 'micropip').join(', ')}… (first time is slow, next time fast)` });
      await pyodide.loadPackage([...new Set(needed)]);
      needed.forEach((n) => loaded.add(n));
    }
    if (imports.has('seaborn') && !loaded.has('seaborn')) {
      post({ id, type: 'status', text: 'Putting makeup on matplotlib… (installing seaborn)' });
      const micropip = pyodide.pyimport('micropip');
      await micropip.install('seaborn');
      loaded.add('seaborn');
    }
    const usesPlot = imports.has('matplotlib') || imports.has('seaborn');
    if (usesPlot) {
      await pyodide.runPythonAsync(`
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io, base64, warnings
warnings.filterwarnings('ignore', category=UserWarning)
__codegaon_imgs = []
def __codegaon_show(*a, **k):
    # Each plt.show() saves the open figures as pictures, then starts a fresh sheet of graph paper.
    for n in plt.get_fignums():
        b = io.BytesIO()
        plt.figure(n).savefig(b, format='png', dpi=90, bbox_inches='tight')
        __codegaon_imgs.append(base64.b64encode(b.getvalue()).decode())
    plt.close('all')
plt.show = __codegaon_show
plt.close('all')
`);
    }

    // 2. Run the student's code in a fresh namespace
    pyodide.setStdout({ batched: (s: string) => post({ id, type: 'stdout', text: s }) });
    pyodide.setStderr({ batched: (s: string) => post({ id, type: 'stdout', text: s }) });
    pyodide.globals.get('__stdin_lines').clear();
    for (const line of stdin) pyodide.globals.get('__stdin_lines').append(line);
    const ns = pyodide.globals.get('dict')();
    let error = null;
    try {
      await pyodide.runPythonAsync(code, { globals: ns, filename: '<main>' });
    } catch (err) {
      error = parseError(String((err as Error).message ?? err));
    }

    // 3. Collect plots as PNG images
    let images: string[] = [];
    if (usesPlot) {
      const res = await pyodide.runPythonAsync(`
plt.show()   # collect any figures the student forgot to show
__imgs = list(__codegaon_imgs)
__codegaon_imgs.clear()
__imgs
`);
      images = res.toJs();
      res.destroy?.();
    }
    ns.destroy?.();
    post({ id, type: 'done', error, images });
  } catch (err) {
    post({ id, type: 'done', error: parseError(String((err as Error).message ?? err)) });
  }
};

/** Pull the useful bits out of a Python traceback. */
function parseError(tb: string) {
  const lines = tb.trim().split('\n');
  let line: number | null = null;
  for (const l of lines) {
    const m = l.match(/File "<main>", line (\d+)/);
    if (m) line = Number(m[1]);
  }
  const last = [...lines].reverse().find((l) => /^\w+(Error|Exception|Interrupt)\b/.test(l.trim())) ?? lines[lines.length - 1];
  const m = last.trim().match(/^(\w+):?\s*(.*)$/);
  return { type: m?.[1] ?? 'Error', message: m?.[2] ?? last, line };
}
