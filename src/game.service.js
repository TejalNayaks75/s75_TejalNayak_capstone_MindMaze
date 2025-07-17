const { v4: uuidv4 } = require('uuid');
const { generateMaze, checkPathCompletion } = require('./maze.utils');
const { TILE_TYPES, DIFFICULTY_SETTINGS } = require('./constants');

const games = new Map();
const leaderboard = [];

const getGameSettingsService = () => ({
  difficulties: Object.entries(DIFFICULTY_SETTINGS).map(([name, config]) => ({
    name,
    displayName: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    size: config.size,
    timeLimit: config.timeLimit
  })),
  tileTypes: Object.values(TILE_TYPES)
});

const startNewGameService = (difficulty) => {
  const config = DIFFICULTY_SETTINGS[difficulty];
  if (!config) throw new Error(`Invalid difficulty: ${difficulty}`);
  
  const gameId = uuidv4();
  const maze = generateMaze(config.size, config.complexity);
  
  const gameData = {
    id: gameId,
    difficulty,
    maze,
    timeRemaining: config.timeLimit,
    startTime: new Date(),
    isCompleted: false,
    isWon: false
  };
  
  games.set(gameId, gameData);
  
  return {
    gameId,
    difficulty,
    size: config.size,
    timeLimit: config.timeLimit,
    maze
  };
};

const getGameStateService = (gameId) => {
  const game = games.get(gameId);
  if (!game) throw new Error('Game not found');
  return game;
};

const rotateTileService = (gameId, tileId, rotations) => {
  const game = games.get(gameId);
  if (!game) throw new Error('Game not found');
  
  // Implementation would rotate the specified tile
  // This is a placeholder - implement actual tile rotation logic
  console.log(`Rotating tile ${tileId} in game ${gameId} by ${rotations} rotations`);
  
  return game; // Return updated game state
};

const checkGameCompletionService = (gameId) => {
  const game = games.get(gameId);
  if (!game) throw new Error('Game not found');

  const isComplete = checkPathCompletion(game.maze);
  if (isComplete) {
    game.isCompleted = true;
    game.isWon = true;
    game.endTime = new Date();
    
    const timeTaken = (game.endTime - game.startTime) / 1000;
    const score = calculateScore(game.difficulty, timeTaken, game.maze.length);
    
    leaderboard.push({
      gameId: game.id,
      difficulty: game.difficulty,
      score,
      timeTaken,
      date: game.endTime
    });
  }

  return {
    isComplete: game.isCompleted,
    isWon: game.isWon,
    maze: game.maze
  };
};

const resetGameService = (gameId) => {
  const game = games.get(gameId);
  if (!game) throw new Error('Game not found');
  
  // Reset game state but keep same configuration
  const newMaze = generateMaze(game.maze.length, DIFFICULTY_SETTINGS[game.difficulty].complexity);
  
  const resetGame = {
    ...game,
    maze: newMaze,
    timeRemaining: DIFFICULTY_SETTINGS[game.difficulty].timeLimit,
    startTime: new Date(),
    isCompleted: false,
    isWon: false
  };
  
  games.set(gameId, resetGame);
  
  return {
    gameId,
    difficulty: game.difficulty,
    maze: newMaze,
    timeRemaining: DIFFICULTY_SETTINGS[game.difficulty].timeLimit
  };
};

const getLeaderboardService = () => {
  return [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 10);
};

const calculateScore = (difficulty, timeTaken, size) => {
  const difficultyMultiplier = {
    easy: 1,
    medium: 2,
    hard: 3,
    very_hard: 4,
    lunatic: 5
  };
  return Math.floor(size * 10 * difficultyMultiplier[difficulty] + (DIFFICULTY_SETTINGS[difficulty].timeLimit - timeTaken) * 2);
};

module.exports = {
  getGameSettingsService,
  startNewGameService,
  getGameStateService,
  rotateTileService,
  checkGameCompletionService,
  getLeaderboardService,
  resetGameService
};