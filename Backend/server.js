require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const gameRoutes = require('./src/game.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'OPTIONS']
}));
app.use(express.json());

// Routes
app.use('/api/v1', gameRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    message: 'MindMaze API is operational'
  });
});

// Error Handling
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Server Startup with Endpoint Display
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🔗 Try these endpoints directly:`);
  console.log(`- GET  http://localhost:${PORT}/api/v1/settings`);
  console.log(`- POST http://localhost:${PORT}/api/v1/games/easy`);
  console.log(`- PUT  http://localhost:${PORT}/api/v1/games/123/reset`);
  
  console.log(`\n📌 Other available endpoints:`);
  console.log(`- GET    /api/v1/games/:gameId`);
  console.log(`- PATCH  /api/v1/games/:gameId/tiles/:tileId`);
  console.log(`- GET    /api/v1/games/:gameId/check`);
  console.log(`- GET    /api/v1/leaderboard`);
  console.log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});