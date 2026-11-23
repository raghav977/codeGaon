import initSqlJs, { type SqlJsStatic } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let p: Promise<SqlJsStatic> | null = null;
/** Load sql.js once. The .wasm is bundled locally and precached by the PWA. */
export const getSql = () => (p ??= initSqlJs({ locateFile: () => wasmUrl }));
