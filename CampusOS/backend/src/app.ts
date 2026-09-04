import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import schedulesRouter from './routes/schedules.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/schedules', schedulesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
