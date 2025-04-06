import React, { useState, useEffect, useCallback } from 'react';

const Game2048 = () => {
  const [board, setBoard] = useState(Array(4).fill().map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  // Define handleKeyDown with useCallback to prevent recreation on each render
  const handleKeyDown = useCallback((e) => {
    if (gameOver) return;
    
    // Prevent scrolling when using arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }

    let moved = false;
    const newBoard = JSON.parse(JSON.stringify(board)); // Deep copy

    switch (e.key) {
      case 'ArrowUp':
        moved = moveUp(newBoard);
        break;
      case 'ArrowDown':
        moved = moveDown(newBoard);
        break;
      case 'ArrowLeft':
        moved = moveLeft(newBoard);
        break;
      case 'ArrowRight':
        moved = moveRight(newBoard);
        break;
      default:
        return;
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      
      // Check if game is over
      if (isGameOver(newBoard)) {
        setGameOver(true);
      }

      // Update score
      const calculatedScore = calculateScore(newBoard);
      setScore(calculatedScore);
      
      // Update best score if needed
      if (calculatedScore > bestScore) {
        setBestScore(calculatedScore);
        localStorage.setItem('bestScore', calculatedScore.toString());
      }
    }
  }, [board, gameOver, bestScore]);

  // Set up keyboard listener with a separate useEffect to properly handle dependencies
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const initializeGame = () => {
    // Create an empty board
    const newBoard = Array(4).fill().map(() => Array(4).fill(0));
    
    // Add two initial tiles
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    
    // Load best score from localStorage if available
    const savedBestScore = localStorage.getItem('bestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
  };

  const addRandomTile = (currentBoard) => {
    const emptyPositions = [];
    
    // Find all empty positions
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 0) {
          emptyPositions.push({ row: i, col: j });
        }
      }
    }
    
    // If there are empty positions, add a new tile (2 or 4)
    if (emptyPositions.length > 0) {
      const { row, col } = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
      currentBoard[row][col] = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% chance for 4
    }
  };

  const calculateScore = (currentBoard) => {
    let total = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] > 0) {
          total += currentBoard[i][j];
        }
      }
    }
    return total;
  };

  const moveUp = (currentBoard) => {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      let lastMergedRow = -1;
      
      for (let row = 1; row < 4; row++) {
        if (currentBoard[row][col] !== 0) {
          let currentRow = row;
          
          while (currentRow > 0) {
            // If the cell above is empty, move up
            if (currentBoard[currentRow - 1][col] === 0) {
              currentBoard[currentRow - 1][col] = currentBoard[currentRow][col];
              currentBoard[currentRow][col] = 0;
              currentRow--;
              moved = true;
            } 
            // If the cell above has the same value and hasn't been merged yet, merge
            else if (currentBoard[currentRow - 1][col] === currentBoard[currentRow][col] && currentRow - 1 > lastMergedRow) {
              currentBoard[currentRow - 1][col] *= 2;
              currentBoard[currentRow][col] = 0;
              lastMergedRow = currentRow - 1;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    return moved;
  };

  const moveDown = (currentBoard) => {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      let lastMergedRow = 4;
      
      for (let row = 2; row >= 0; row--) {
        if (currentBoard[row][col] !== 0) {
          let currentRow = row;
          
          while (currentRow < 3) {
            // If the cell below is empty, move down
            if (currentBoard[currentRow + 1][col] === 0) {
              currentBoard[currentRow + 1][col] = currentBoard[currentRow][col];
              currentBoard[currentRow][col] = 0;
              currentRow++;
              moved = true;
            } 
            // If the cell below has the same value and hasn't been merged yet, merge
            else if (currentBoard[currentRow + 1][col] === currentBoard[currentRow][col] && currentRow + 1 < lastMergedRow) {
              currentBoard[currentRow + 1][col] *= 2;
              currentBoard[currentRow][col] = 0;
              lastMergedRow = currentRow + 1;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    return moved;
  };

  const moveLeft = (currentBoard) => {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      let lastMergedCol = -1;
      
      for (let col = 1; col < 4; col++) {
        if (currentBoard[row][col] !== 0) {
          let currentCol = col;
          
          while (currentCol > 0) {
            // If the cell to the left is empty, move left
            if (currentBoard[row][currentCol - 1] === 0) {
              currentBoard[row][currentCol - 1] = currentBoard[row][currentCol];
              currentBoard[row][currentCol] = 0;
              currentCol--;
              moved = true;
            } 
            // If the cell to the left has the same value and hasn't been merged yet, merge
            else if (currentBoard[row][currentCol - 1] === currentBoard[row][currentCol] && currentCol - 1 > lastMergedCol) {
              currentBoard[row][currentCol - 1] *= 2;
              currentBoard[row][currentCol] = 0;
              lastMergedCol = currentCol - 1;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    return moved;
  };

  const moveRight = (currentBoard) => {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      let lastMergedCol = 4;
      
      for (let col = 2; col >= 0; col--) {
        if (currentBoard[row][col] !== 0) {
          let currentCol = col;
          
          while (currentCol < 3) {
            // If the cell to the right is empty, move right
            if (currentBoard[row][currentCol + 1] === 0) {
              currentBoard[row][currentCol + 1] = currentBoard[row][currentCol];
              currentBoard[row][currentCol] = 0;
              currentCol++;
              moved = true;
            } 
            // If the cell to the right has the same value and hasn't been merged yet, merge
            else if (currentBoard[row][currentCol + 1] === currentBoard[row][currentCol] && currentCol + 1 < lastMergedCol) {
              currentBoard[row][currentCol + 1] *= 2;
              currentBoard[row][currentCol] = 0;
              lastMergedCol = currentCol + 1;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    return moved;
  };

  const isGameOver = (currentBoard) => {
    // Check if the board is full
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 0) {
          return false;
        }
      }
    }
    
    // Check if any adjacent cells have the same value
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = currentBoard[row][col];
        
        // Check right
        if (col < 3 && currentBoard[row][col + 1] === value) {
          return false;
        }
        
        // Check down
        if (row < 3 && currentBoard[row + 1][col] === value) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Function to determine tile background color based on value - updated with vibrant colors
  const getTileColor = (value) => {
    const colors = {
      0: 'bg-gray-200', // Empty tile
      2: 'bg-yellow-100 text-gray-800', // Light yellow
      4: 'bg-yellow-200 text-gray-800', // Darker yellow
      8: 'bg-orange-400 text-white', // Vibrant orange
      16: 'bg-orange-500 text-white', // Darker orange
      32: 'bg-red-500 text-white', // Vibrant red
      64: 'bg-red-600 text-white', // Darker red
      128: 'bg-yellow-400 text-white', // Vibrant yellow
      256: 'bg-yellow-500 text-white', // Darker yellow
      512: 'bg-yellow-600 text-white', // Even darker yellow
      1024: 'bg-amber-600 text-white', // Amber
      2048: 'bg-amber-700 text-white', // Dark amber
    };
    
    return colors[value] || 'bg-purple-500 text-white'; // Purple for higher values
  };

  // Function to determine text size based on value
  const getTextSize = (value) => {
    if (value < 100) return 'text-4xl';
    if (value < 1000) return 'text-3xl';
    return 'text-2xl';
  };

  // Add tabIndex to make the game container focusable
  const focusGameContainer = (container) => {
    if (container) {
      container.focus();
    }
  };

  // Render component
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-gray-50">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-amber-50 bg-opacity-80 z-0"></div>

      {/* Decorative floating numbers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-amber-800 opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
              animation: `float ${Math.random() * 15 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {i % 4 === 0 ? '2' : i % 4 === 1 ? '0' : i % 4 === 2 ? '4' : '8'}
          </div>
        ))}
      </div>
      
      {/* Instructions box in top left */}
      <div className="absolute top-6 left-6 max-w-xs bg-white bg-opacity-80 p-4 rounded-lg shadow-lg z-20">
        <h3 className="font-bold text-gray-800 mb-2">HOW TO PLAY</h3>
        <p className="text-sm text-gray-700">
          Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!
        </p>
        <p className="text-xs text-orange-500 font-medium mt-2">
          Click on the game to activate keyboard controls
        </p>
      </div>

      {/* Game Container - Add tabIndex and ref for focus */}
      <div 
        className="flex flex-col items-center justify-center p-6 max-w-md mx-auto bg-white rounded-xl shadow-xl z-10"
        tabIndex="0"
        ref={focusGameContainer}
        onKeyDown={handleKeyDown}
      >
        <div className="w-full flex flex-col items-center mb-6">
          <h1 className="text-6xl font-bold text-gray-700 mb-2">2048</h1>
          <p className="text-gray-600 mb-4">Join the numbers and get to the 2048 tile!</p>
          
          <div className="flex justify-between w-full mb-4">
            <div className="flex flex-col items-center bg-gray-700 rounded p-2 w-24">
              <span className="text-gray-200 text-xs">SCORE</span>
              <span className="text-xl font-bold text-white">{score}</span>
            </div>
            
            <div className="flex flex-col items-center bg-gray-700 rounded p-2 w-24">
              <span className="text-gray-200 text-xs">BEST</span>
              <span className="text-xl font-bold text-white">{bestScore}</span>
            </div>
            
            <button 
              onClick={initializeGame}
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-md"
            >
              New Game
            </button>
          </div>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="grid grid-cols-4 gap-3">
            {board.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center ${getTileColor(cell)} rounded-lg shadow-md transition-all duration-100`}
                >
                  {cell !== 0 && (
                    <span className={`font-bold ${getTextSize(cell)}`}>
                      {cell}
                    </span>
                  )}
                </div>
              ))
            ))}
          </div>
        </div>

        {gameOver && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg font-medium text-center">
            Game Over! No more moves available.
          </div>
        )}
      </div>
      
      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(10deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Game2048;