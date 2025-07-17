const express = require('express');
const router = express.Router();
const gameController = require('src/game.controller');

// API versioning prefix
const API_PREFIX = '/v1';

// Game Configuration
router.get(`${API_PREFIX}/settings`, gameController.getGameSettings);

// Game Lifecycle
router.post(`${API_PREFIX}/games/:difficulty`, gameController.startNewGame);
router.get(`${API_PREFIX}/games/:gameId`, gameController.getGameState);
router.patch(`${API_PREFIX}/games/:gameId/tiles/:tileId`, gameController.rotateTile);
router.get(`${API_PREFIX}/games/:gameId/check`, gameController.checkGameCompletion);
router.put(`${API_PREFIX}/games/:gameId/reset`, gameController.resetGame); // Fixed: changed resetGame to gameController.resetGame

// Leaderboard
router.get(`${API_PREFIX}/leaderboard`, gameController.getLeaderboard);

module.exports = router;