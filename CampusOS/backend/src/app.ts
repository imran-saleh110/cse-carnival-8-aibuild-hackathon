import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import schedulesRouter from './routes/schedules.routes';
import roomsRouter from './routes/rooms.routes';
import eventsRouter from './routes/events.routes';
import announcementsRouter from './routes/announcements.routes';
import assignmentsRouter from './routes/assignments.routes';
import authRouter from './routes/auth.routes';
import studentsRouter from './routes/students.routes';
import coursesRouter from './routes/courses.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/schedules', schedulesRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
