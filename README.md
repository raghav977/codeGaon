# 🏡 CodeGaon

A fun, animated SEE Computer Science practice app for Class 10 students in Nepal.
Python is taught as **The Momo Factory**, MySQL as **The School Register**.

## Run it
```
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in frontend/dist (installable PWA)
npm run test:sql   # 42 tests for the MySQL → SQLite translator
```

## What's inside (Phase 1)
- **Village map**: 5 houses (Python and MySQL unlocked), XP, a daily streak, badges, and per-student progress in localStorage (several students can share one lab PC).
- **22 topics** (12 Python, 10 MySQL). Each one follows STORY → WATCH (Framer Motion animation) → PLAY (live editor) → PROVE (3-question quiz), plus a 3-level 💡 Hint, a ⚠️ Common Mistake box and a 📝 SEE Tip.
- **Python in the browser**: Pyodide runs in a Web Worker. pandas and matplotlib load on demand, seaborn installs via micropip, and each `plt.show()` becomes an image. `input()` reads from an Input box. A Stop button ends infinite loops. Errors are rewritten in simple English.
- **MySQL in the browser**: sql.js plus a translation layer (`frontend/src/lib/mysql/`) that supports TRUNCATE, ALTER … ADD/DROP/MODIFY/CHANGE/RENAME, DESC, SHOW TABLES/DATABASES, CREATE/USE DATABASE, AUTO_INCREMENT, ENUM and MySQL-style case-insensitive text. SQLite error text is never shown.
- **Indentation chapter**: code is drawn live as nested coloured boxes (almirah → bag → tiffin), and a mis-indented line sticks out of its box.
- **Offline**: the app shell and sql.js are precached. Pyodide and its packages are cached the first time they load.

## Where things live
```
frontend/src/content/        lesson text, quizzes, starter code  ← teachers edit here
frontend/src/animations/     WATCH animations
frontend/src/lib/mysql/      MySQL translator + friendly errors + tests
frontend/src/lib/python/     Pyodide worker + friendly errors
server/                      Phase 2 skeleton (Express + MySQL), not built yet
```
