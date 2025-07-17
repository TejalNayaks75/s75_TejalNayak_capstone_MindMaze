const {
  getGameSettingsService,
  startNewGameService,
  getGameStateService,
  rotateTileService,
  checkGameCompletionService,
  getLeaderboardService,
  resetGameService
} = require('src/game.service');

const getGameSettings = async (req, res) => {
  try {
    const settings = await getGameSettingsService();
    res.json({ 
      success: true, 
      data: settings 
    });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get game settings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const startNewGame = async (req, res) => {
  try {
    const { difficulty } = req.params;
    const gameData = await startNewGameService(difficulty);
    res.status(201).json({
      success: true,
      data: gameData
    });
  } catch (error) {
    console.error('Game start error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getGameState = async (req, res) => {
  try {
    const { gameId } = req.params;
    const gameState = await getGameStateService(gameId);
    res.json({
      success: true,
      data: gameState
    });
  } catch (error) {
    console.error('Game state error:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

const rotateTile = async (req, res) => {
  try {
    const { gameId, tileId } = req.params;
    const { rotations = 1 } = req.body;
    const updatedGame = await rotateTileService(gameId, tileId, rotations);
    res.json({
      success: true,
      data: updatedGame
    });
  } catch (error) {
    console.error('Tile rotation error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const checkGameCompletion = async (req, res) => {
  try {
    const { gameId } = req.params;
    const result = await checkGameCompletionService(gameId);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Completion check error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await getLeaderboardService();
    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leaderboard'
    });
  }
};

const resetGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const result = await resetGameService(gameId);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Reset game error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getGameSettings,
  startNewGame,
  getGameState,
  rotateTile,
  checkGameCompletion,
  getLeaderboard,
  resetGame
};