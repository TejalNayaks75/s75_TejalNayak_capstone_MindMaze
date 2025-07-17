const express = require('express');
const router = express.Router();

// Verify controller loading
let gameController;
try {
  gameController = require('./game.controller');
  console.log('[✓] Controller loaded successfully');
} catch (err) {
  console.error('[×] Failed to load controller:', err);
  process.exit(1);
}

const API_PREFIX = '/v1';

// Game Configuration
router.get(`${API_PREFIX}/settings`, 
  (req, res, next) => {
    if (!gameController.getGameSettings) {
      return res.status(500).json({ error: 'Controller method missing' });
    }
    next();
  },
  gameController.getGameSettings
);

// Game Lifecycle
router.post(`${API_PREFIX}/games/:difficulty`, 
  (req, res, next) => {
    if (!gameController.startNewGame) {
      return res.status(500).json({ error: 'Controller method missing' });
    }
    next();
  },
  gameController.startNewGame
);

// Add similar validation for all other routes...

module.exports = router;