# CodeGaon server (Phase 2 — structure only)

Nothing here runs yet. Phase 1 stores progress in the browser's localStorage.

## Planned endpoints
| Method | Path | Who | What |
|---|---|---|---|
| POST | /api/auth/register | student | name, roll, class join code, password |
| POST | /api/auth/login | all | returns JWT |
| GET  | /api/progress | student | my XP, streak, badges, topic scores |
| PUT  | /api/progress/:topicId | student | save quiz result (server recomputes XP) |
| POST | /api/progress/sync | student | upload existing localStorage progress once |
| GET  | /api/teacher/classes/:id | teacher | every student × topic grid |
| GET  | /api/teacher/classes/:id/weak-topics | teacher | topics with lowest average score |

## Setup (later)
```
cp .env.example .env
mysql -u root -p < src/db/schema.sql
npm install && npm run dev
```
