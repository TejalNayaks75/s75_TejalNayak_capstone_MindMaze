module.exports = {
  TILE_TYPES: Object.freeze({
    STRAIGHT: { name: 'straight', rotations: 2, connections: ['left-right', 'top-bottom'] },
    ELBOW: { name: 'elbow', rotations: 4, connections: ['left-top', 'top-right', 'right-bottom', 'bottom-left'] },
    T_JUNCTION: { name: 't-junction', rotations: 4, connections: ['left-top-right', 'top-right-bottom', 'right-bottom-left', 'bottom-left-top'] },
    CROSS: { name: 'cross', rotations: 1, connections: ['left-top-right-bottom'] }
  }),
  
  DIFFICULTY_SETTINGS: Object.freeze({
    easy: { size: 6, timeLimit: 60, complexity: 0.2 },
    medium: { size: 8, timeLimit: 90, complexity: 0.4 },
    hard: { size: 10, timeLimit: 120, complexity: 0.6 },
    very_hard: { size: 12, timeLimit: 150, complexity: 0.8 },
    lunatic: { size: 15, timeLimit: 180, complexity: 1.0 }
  })
};