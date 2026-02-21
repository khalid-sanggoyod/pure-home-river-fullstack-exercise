import express from 'express';
import cors from 'cors';
import agentRoutes from './routes/agents';
import propertyRoutes from './routes/properties';
import familyRoutes from './routes/families';
import tenantRoutes from './routes/tenants';
import noteRoutes from './routes/notes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/notes', noteRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
