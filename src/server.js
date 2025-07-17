require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const gameRoutes = require('./game.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// Enhanced Middleware Configuration
// =============================================

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// =============================================
// Route Verification
// =============================================

// Verify routes are properly loaded
try {
  if (typeof gameRoutes !== 'function') {
    throw new Error('Routes failed to load properly');
  }
  console.log('[✓] Routes successfully loaded');
} catch (err) {
  console.error('[×] Route loading error:', err);
  process.exit(1);
}

// =============================================
// API Routes
// =============================================
app.use('/api', gameRoutes);

// =============================================
// Health Check Endpoint
// =============================================
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    app: 'Mind Maze API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// =============================================
// Error Handling
// =============================================

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  console.error(`[${new Date().toISOString()}] Error ${errorId}:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    errorId,
    timestamp: new Date().toISOString()
  });
});

// =============================================
// Server Startup (Simplified Output)
// =============================================
// Update the server startup message to include the new PUT endpoint
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🔗 Try these endpoints directly:`);
  console.log(`- GET  http://localhost:${PORT}/api/v1/settings`);
  console.log(`- POST http://localhost:${PORT}/api/v1/games/easy`);
  console.log(`- PUT  http://localhost:${PORT}/api/v1/games/123/reset`); // Added PUT endpoint example
  
  console.log(`\n📌 Other available endpoints:`);
  console.log(`- GET    /api/v1/games/:gameId`);
  console.log(`- PATCH  /api/v1/games/:gameId/tiles/:tileId`);
  console.log(`- GET    /api/v1/games/:gameId/check`);
  console.log(`- GET    /api/v1/leaderboard`);
  console.log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}`);
});
// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});