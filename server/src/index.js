// Phase 2 skeleton — wire up routes when the backend is built.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import teacherRoutes from './routes/teacher.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/teacher', teacherRoutes);

app.listen(process.env.PORT ?? 4000, () => console.log(`CodeGaon API on :${process.env.PORT ?? 4000}`));
