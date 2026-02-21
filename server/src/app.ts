import express from 'express';
import cors from 'cors';
import { apiLimiter } from './middleware/rateLimiter';
import agentRoutes from './routes/agents';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

// Routes
app.use('/api/agents', agentRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
