import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const TILE_SIZE = 32;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

// Tile types
const TREE = 'T';
const DISCOVERY = 'D';

const gameMap = [
  'TTTTTTTTTTTTTTTTTTTT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGDTGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TGGGGGGGGGGGGGGGGGGGT',
  'TTTTTTTTTTTTTTTTTTTT',
];

const Player = ({ x, y }) => (
  <div
    style={{
      position: 'absolute',
      left: x * TILE_SIZE,
      top: y * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE,
      backgroundColor: 'blue',
      transition: 'all 0.2s linear',
    }}
  />
);

const Tile = ({ type }) => {
  let backgroundColor = '#34d399'; // Grass
  if (type === TREE) backgroundColor = '#166534';
  if (type === DISCOVERY) backgroundColor = '#f59e0b';

  return (
    <div
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor,
        border: '1px solid #10B981',
      }}
    />
  );
};

const TopDownGame = () => {
  const [playerPos, setPlayerPos] = useState({ x: 2, y: 2 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();
      setPlayerPos(prevPos => {
        let newX = prevPos.x;
        let newY = prevPos.y;

        if (e.key === 'ArrowUp') newY -= 1;
        if (e.key === 'ArrowDown') newY += 1;
        if (e.key === 'ArrowLeft') newX -= 1;
        if (e.key === 'ArrowRight') newX += 1;

        const targetTile = gameMap[newY]?.[newX];

        if (targetTile && targetTile !== TREE) {
          if (targetTile === DISCOVERY) {
            toast.success('You found a special spot!');
          }
          return { x: newX, y: newY };
        }
        return prevPos;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white p-4">
        <h1 className="text-3xl mb-4">Strain Collector</h1>
        <div
            style={{
            position: 'relative',
            width: MAP_WIDTH * TILE_SIZE,
            height: MAP_HEIGHT * TILE_SIZE,
            border: '4px solid #10B981',
            }}
        >
            {gameMap.map((row, y) =>
            row.split('').map((tile, x) => <Tile key={`${x}-${y}`} type={tile} />)
            )}
            <Player x={playerPos.x} y={playerPos.y} />
        </div>
        <div className="mt-4 text-center">
            <p>Use arrow keys to move.</p>
            <p>Find the special spots!</p>
        </div>
    </div>
  );
};

export default TopDownGame;