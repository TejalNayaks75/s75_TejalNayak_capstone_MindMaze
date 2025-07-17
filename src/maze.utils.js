const { TILE_TYPES } = require('./constants');

const generateMaze = (size, complexity) => {
  const maze = [];
  
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const rand = Math.random();
      let tileType;
      
      if (rand < complexity * 0.5) tileType = 'CROSS';
      else if (rand < complexity * 0.8) tileType = 'T_JUNCTION';
      else if (rand < complexity) tileType = 'ELBOW';
      else tileType = 'STRAIGHT';
      
      const tileConfig = TILE_TYPES[tileType];
      const rotation = Math.floor(Math.random() * tileConfig.rotations);
      
      row.push({
        type: tileType,
        rotation,
        connections: tileConfig.connections[rotation],
        position: { row: i, col: j }
      });
    }
    maze.push(row);
  }
  
  // Force openings at start and end
  maze[0][0].connections = 'right';
  maze[size-1][size-1].connections = 'left';
  
  return maze;
};

const checkPathCompletion = (maze) => {
  const size = maze.length;
  return (
    maze[0][0].connections.includes('right') && 
    maze[size-1][size-1].connections.includes('left')
  );
};

module.exports = { generateMaze, checkPathCompletion };