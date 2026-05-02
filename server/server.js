

const express        = require('express');
const cors           = require('cors');
const metricsRoutes  = require('./routes/metricsRoutes');
const insightsRoutes = require('./routes/insightsRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;


app.use(cors(
    {
        origin: [
    "http://localhost:5173",
    "https://dev-productivity-server.vercel.app"
  ]
        
 }));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}]  ${req.method}  ${req.url}`);
  next();
});


app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.use('/api/metrics',  metricsRoutes);
app.use('/api/insights', insightsRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});


app.listen(PORT, () => {
  console.log(`\n✅  Server  →  http://localhost:${PORT}`);
  console.log(`📊  Metrics →  http://localhost:${PORT}/api/metrics`);
  console.log(`🧠  Insights→  http://localhost:${PORT}/api/insights\n`);
});