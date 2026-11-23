import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { sql, MySQL } from '@codemirror/lang-sql';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';

interface Props {
  value: string;
  lang: 'python' | 'sql';
  onChange: (v: string) => void;
  onRun?: () => void;
}

/** CodeMirror 6 with highlighting, 4-space indent and visible indentation guides. */
export default function CodeEditor({ value, lang, onChange, onRun }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const cb = useRef({ onChange, onRun });
  cb.current = { onChange, onRun };

  useEffect(() => {
    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        keymap.of([
          { key: 'Ctrl-Enter', mac: 'Cmd-Enter', run: () => { cb.current.onRun?.(); return true; } },
          indentWithTab,
        ]),
        indentUnit.of('    '),
        EditorState.tabSize.of(4),
        lang === 'python' ? python() : sql({ dialect: MySQL, upperCaseKeywords: true }),
        indentationMarkers({ thickness: 2, colors: { light: '#fbbf24', activeLight: '#f97316', dark: '#fbbf24', activeDark: '#f97316' } }),
        EditorView.updateListener.of((u) => { if (u.docChanged) cb.current.onChange(u.state.doc.toString()); }),
        EditorView.theme({ '&': { backgroundColor: '#fffbeb', minHeight: '180px' }, '.cm-gutters': { backgroundColor: '#fef3c7', border: 'none' } }),
      ],
    });
    view.current = new EditorView({ state, parent: host.current! });
    return () => view.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // external value change (e.g. Reset button)
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  return <div ref={host} className="border-2 border-amber-200 rounded-2xl overflow-hidden" />;
}
