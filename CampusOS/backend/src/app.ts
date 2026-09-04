import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import schedulesRouter from './routes/schedules.routes';
import roomsRouter from './routes/rooms.routes';
import eventsRouter from './routes/events.routes';
import announcementsRouter from './routes/announcements.routes';
import assignmentsRouter from './routes/assignments.routes';
import agentRouter from './routes/agent.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/schedules', schedulesRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/agent', agentRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
