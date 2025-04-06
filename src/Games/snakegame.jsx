import React, { useState, useEffect, useCallback, useRef } from 'react';

const SnakeGame = () => {
  // Game board dimensions
  const boardSize = 20;
  const cellSize = 20;
  
  // Game states
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150); // milliseconds between moves
  
  // Prevent direction changes in same tick
  const directionRef = useRef(direction);
  
  // Game loop reference
  const gameLoopRef = useRef(null);

  // Generate new food position
  const generateFood = useCallback(() => {
    // Generate random position that's not on the snake
    const newFood = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
    
    // Check if food is on snake
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    if (isOnSnake) {
      return generateFood(); // Try again
    }
    
    return newFood;
  }, [snake, boardSize]);

  // Handle keyboard inputs
  const handleKeyDown = useCallback((e) => {
    // Prevent reverse direction
    switch (e.key) {
      case 'ArrowUp':
        if (directionRef.current !== 'DOWN') {
          directionRef.current = 'UP';
          setDirection('UP');
        }
        break;
      case 'ArrowDown':
        if (directionRef.current !== 'UP') {
          directionRef.current = 'DOWN';
          setDirection('DOWN');
        }
        break;
      case 'ArrowLeft':
        if (directionRef.current !== 'RIGHT') {
          directionRef.current = 'LEFT';
          setDirection('LEFT');
        }
        break;
      case 'ArrowRight':
        if (directionRef.current !== 'LEFT') {
          directionRef.current = 'RIGHT';
          setDirection('RIGHT');
        }
        break;
      case ' ':
        // Space bar to pause/resume
        setIsPaused(prev => !prev);
        break;
      case 'r':
        // R key to restart
        if (gameOver) {
          resetGame();
        }
        break;
      default:
        break;
    }
  }, [gameOver]);

  // Reset game to initial state
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 }); // Use fixed food position when resetting
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setSpeed(150);
    setIsPaused(false);
  };

  // Check for collision with walls or self
  const checkCollision = (head) => {
    // Wall collision
    if (
      head.x < 0 || 
      head.x >= boardSize || 
      head.y < 0 || 
      head.y >= boardSize
    ) {
      return true;
    }
    
    // Self collision (check all but the last segment, which is the tail that will move)
    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    
    return false;
  };

  // Move the snake
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;
    
    setSnake(prevSnake => {
      // Create new head based on direction
      const head = { ...prevSnake[0] };
      
      switch (directionRef.current) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }
      
      // Check for collision
      if (checkCollision(head)) {
        setGameOver(true);
        return prevSnake;
      }
      
      const newSnake = [head, ...prevSnake];
      
      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(prevScore => prevScore + 10);
        
        // Increase speed every 50 points
        if (score > 0 && score % 50 === 0) {
          setSpeed(prevSpeed => Math.max(prevSpeed - 10, 50));
        }
      } else {
        // Remove tail if no food eaten
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [food, gameOver, isPaused, generateFood, score, checkCollision]);

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Initialize the game
  useEffect(() => {
    // Initial setup - fixed food position
    setFood({ x: 5, y: 5 });
  }, []);

  // Game loop
  useEffect(() => {
    directionRef.current = direction;
    
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveSnake, gameOver, isPaused, speed, direction]);

  // Handle touch controls for mobile
  const handleTouchControl = (newDirection) => {
    if ((newDirection === 'UP' && directionRef.current !== 'DOWN') ||
        (newDirection === 'DOWN' && directionRef.current !== 'UP') ||
        (newDirection === 'LEFT' && directionRef.current !== 'RIGHT') ||
        (newDirection === 'RIGHT' && directionRef.current !== 'LEFT')) {
      directionRef.current = newDirection;
      setDirection(newDirection);
    }
  };

  // Get segment style based on position in snake - FIXED to use predefined Tailwind classes
  const getSegmentStyle = (index, total) => {
    if (index === 0) {
      // Head
      return "bg-emerald-600 rounded-md shadow-lg";
    } else if (index === total - 1) {
      // Tail
      return "bg-emerald-400 rounded-md shadow-md";
    } else {
      // Body segments - use predefined classes instead of dynamic string interpolation
      // Use different styles based on position to create a gradient effect
      if (index < total / 3) {
        return "bg-emerald-500 rounded-sm shadow-sm";
      } else if (index < total * 2 / 3) {
        return "bg-emerald-400 rounded-sm shadow-sm";
      } else {
        return "bg-emerald-300 rounded-sm shadow-sm";
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Floating Instructions Panel */}
      <div className="fixed top-4 right-4 text-sm text-gray-600 bg-gray-100 p-4 rounded-lg shadow-md max-w-xs z-10 opacity-80 hover:opacity-100 transition-opacity">
        <h3 className="font-bold text-center mb-2">How to Play</h3>
        <ul className="space-y-1">
          <li>• Use arrow keys or touch controls to move</li>
          <li>• Eat the food to grow longer</li>
          <li>• Avoid hitting walls or yourself</li>
          <li>• Space to pause/resume</li>
        </ul>
      </div>
      
      {/* Game title and score display */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-700 text-center mb-2">Snake Game</h2>
        <div className="text-xl font-bold bg-emerald-100 px-4 py-2 rounded-full shadow-md">
          Score: <span className="text-emerald-600">{score}</span>
        </div>
      </div>
      
      {/* Game board */}
      <div 
        className="border-4 border-emerald-700 bg-emerald-50 relative rounded-lg shadow-xl overflow-hidden"
        style={{ 
          width: `${boardSize * cellSize}px`, 
          height: `${boardSize * cellSize}px` 
        }}
      >
        {/* Background grid for visual effect */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20">
          {Array.from({ length: boardSize * boardSize }).map((_, i) => (
            <div 
              key={i} 
              className={`border border-emerald-100 ${(i + Math.floor(i / boardSize)) % 2 === 0 ? 'bg-emerald-50' : 'bg-emerald-100/30'}`}
            />
          ))}
        </div>
        
        {/* Render snake */}
        {snake.map((segment, index) => {
          // Eye positions for head
          const eyeStyle = "absolute w-1 h-1 bg-white rounded-full";
          const eyePosition = {
            'UP': [
              { top: '3px', left: '3px' },
              { top: '3px', right: '3px' }
            ],
            'DOWN': [
              { bottom: '3px', left: '3px' },
              { bottom: '3px', right: '3px' }
            ],
            'LEFT': [
              { top: '3px', left: '3px' },
              { bottom: '3px', left: '3px' }
            ],
            'RIGHT': [
              { top: '3px', right: '3px' },
              { bottom: '3px', right: '3px' }
            ]
          };
          
          return (
            <div
              key={index}
              className={`absolute ${getSegmentStyle(index, snake.length)}`}
              style={{
                width: `${cellSize - 2}px`,
                height: `${cellSize - 2}px`,
                left: `${segment.x * cellSize}px`,
                top: `${segment.y * cellSize}px`,
                transition: 'all 0.1s'
              }}
            >
              {/* Add eyes to head */}
              {index === 0 && (
                <>
                  <div className={eyeStyle} style={eyePosition[direction][0]}></div>
                  <div className={eyeStyle} style={eyePosition[direction][1]}></div>
                </>
              )}
            </div>
          );
        })}
        
        {/* Debug indicator to show number of segments */}
        <div className="absolute top-2 left-2 text-xs text-black bg-white bg-opacity-70 px-2 py-1 rounded-md">
          Length: {snake.length}
        </div>
        
        {/* Render food with shadow effect and pulse animation */}
        <div
          className="absolute bg-red-500 rounded-full shadow-lg animate-pulse"
          style={{
            width: `${cellSize - 4}px`,
            height: `${cellSize - 4}px`,
            left: `${food.x * cellSize + 2}px`,
            top: `${food.y * cellSize + 2}px`,
            boxShadow: '0 0 10px rgba(220, 38, 38, 0.7)'
          }}
        >
          {/* Food decoration */}
          <div className="absolute w-2 h-1 bg-green-500 rounded-full top-0 left-1/4"></div>
        </div>
        
        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white backdrop-blur-sm">
            <div className="text-3xl font-bold mb-4 text-red-500">Game Over!</div>
            <div className="text-2xl mb-6">Final Score: <span className="text-emerald-400">{score}</span></div>
            <button 
              onClick={resetGame}
              className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-full text-lg font-bold shadow-lg transition-all hover:scale-105"
            >
              Play Again
            </button>
          </div>
        )}
        
        {/* Pause overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white backdrop-blur-sm">
            <div className="text-3xl font-bold">Paused</div>
          </div>
        )}
      </div>
      
      {/* Game controls */}
      <div className="mt-8">
        <div className="flex justify-center mb-2">
          <button
            onClick={() => handleTouchControl('UP')}
            className="w-14 h-14 bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center rounded-full shadow-md text-2xl"
          >
            ↑
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => handleTouchControl('LEFT')}
            className="w-14 h-14 bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center rounded-full shadow-md mr-6 text-2xl"
          >
            ←
          </button>
          <button
            onClick={() => handleTouchControl('DOWN')}
            className="w-14 h-14 bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center rounded-full shadow-md text-2xl"
          >
            ↓
          </button>
          <button
            onClick={() => handleTouchControl('RIGHT')}
            className="w-14 h-14 bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center rounded-full shadow-md ml-6 text-2xl"
          >
            →
          </button>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md mr-4 font-bold"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-md font-bold"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;