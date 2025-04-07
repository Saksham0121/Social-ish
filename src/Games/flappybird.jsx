import React, { useState, useEffect, useRef } from 'react';
import MovingCloudBackground from '../components/MovingCloudBackground';
import MovingCloudsBackground from '../components/MovingCloudBackground';

const FlappyBird = () => {
  // Game settings
  const gameWidth = 320;
  const gameHeight = 480;
  const gravity = 0.25;
  const jumpStrength = 7;
  const pipeWidth = 52;
  const pipeGap = 160;
  const pipeSpeed = 1.5;
  const pipeSpawnInterval = 2200;
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameFrozen, setGameFrozen] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Bird state
  const [birdPosition, setBirdPosition] = useState(gameHeight / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  
  // Pipes state
  const [pipes, setPipes] = useState([]);
  
  // Refs for animation
  const animationFrameId = useRef();
  const lastPipeTime = useRef(0);
  const gameAreaRef = useRef(null);
  const dayNightCycleRef = useRef(0);
  
  // Start the game
  const startGame = () => {
    if (gameOver) {
      setPipes([]);
      setBirdPosition(gameHeight / 2);
      setBirdVelocity(0);
      setScore(0);
      setGameOver(false);
      setGameFrozen(false);
    }
    setGameStarted(true);
  };
  
  // Handle jump
  const handleJump = () => {
    if (!gameStarted) {
      startGame();
      return;
    }
    
    if (!gameOver && !gameFrozen) {
      setBirdVelocity(-jumpStrength);
    }
  };
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        handleJump();
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, gameFrozen]);
  
  // Day/night cycle effect
  useEffect(() => {
    if (!gameStarted || gameFrozen) return;
    
    const interval = setInterval(() => {
      dayNightCycleRef.current = (dayNightCycleRef.current + 0.1) % 100;
    }, 300);
    
    return () => clearInterval(interval);
  }, [gameStarted, gameFrozen]);
  
  // Generate a new pipe
  const generatePipe = () => {
    const pipeHeight = Math.floor(Math.random() * (gameHeight - pipeGap - 140)) + 70;
    
    return {
      id: Date.now(),
      x: gameWidth,
      topHeight: pipeHeight,
      bottomY: pipeHeight + pipeGap,
      passed: false,
    };
  };
  
  // Function to check collisions and freeze game if collision detected
  const checkCollisions = (birdPos, allPipes) => {
    const birdLeft = gameWidth / 2 - 12;
    const birdRight = gameWidth / 2 + 12;
    const birdTop = birdPos;
    const birdBottom = birdPos + 24;
    
    for (const pipe of allPipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + pipeWidth;
      
      // Check if bird is horizontally aligned with pipe
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check if bird hits top pipe
        if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
          setGameFrozen(true);
          setTimeout(() => {
            setGameOver(true);
          }, 1000);
          return true;
        }
      }
    }
    return false;
  };
  
  // Game loop
  useEffect(() => {
    if (!gameStarted || gameFrozen) return;
    
    const updateGameState = (timestamp) => {
      if (!lastPipeTime.current) lastPipeTime.current = timestamp;
      
      // Update bird position
      setBirdPosition((prevPosition) => {
        const newPosition = prevPosition + birdVelocity;
        
        // Check boundaries
        if (newPosition < 0 || newPosition > gameHeight - 24) {
          setGameFrozen(true);
          setTimeout(() => {
            setGameOver(true);
          }, 1000);
          return prevPosition;
        }
        
        return newPosition;
      });
      
      // Update bird velocity (gravity)
      setBirdVelocity((prevVelocity) => prevVelocity + gravity);
      
      // Update pipe positions
      setPipes((prevPipes) => {
        return prevPipes
          .map((pipe) => {
            // Move pipe to the left
            const newX = pipe.x - pipeSpeed;
            
            // Check if bird passed the pipe
            if (!pipe.passed && newX + pipeWidth < gameWidth / 2 - 12) {
              setScore((prevScore) => {
                const newScore = prevScore + 1;
                if (newScore > highScore) {
                  setHighScore(newScore);
                }
                return newScore;
              });
              return { ...pipe, x: newX, passed: true };
            }
            
            return { ...pipe, x: newX };
          })
          .filter((pipe) => pipe.x + pipeWidth > 0);
      });
      
      // Generate new pipes
      if (timestamp - lastPipeTime.current > pipeSpawnInterval) {
        setPipes((prevPipes) => [...prevPipes, generatePipe()]);
        lastPipeTime.current = timestamp;
      }
      
      // Check for collisions
      const hasCollision = checkCollisions(birdPosition, pipes);
      
      // Continue the animation if game is still on and no collision
      if (!gameOver && !hasCollision) {
        animationFrameId.current = requestAnimationFrame(updateGameState);
      }
    };
    
    animationFrameId.current = requestAnimationFrame(updateGameState);
    
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameStarted, gameOver, birdVelocity, pipes, birdPosition, gameFrozen]);
  
  // Render the pipe
  const renderPipe = (pipe, position) => {
    const isTop = position === 'top';
    const height = isTop ? pipe.topHeight : gameHeight - pipe.bottomY;
    const pipeY = isTop ? 0 : pipe.bottomY;
    
    return (
      <div 
        className="absolute"
        style={{
          left: `${pipe.x}px`,
          top: `${pipeY}px`,
          width: `${pipeWidth}px`,
          height: `${height}px`,
        }}
      >
        {/* Main Pipe Body */}
        <div className="absolute w-full h-full bg-green-500"></div>
        
        {/* Lighter vertical stripes */}
        <div className="absolute h-full w-3 left-4 bg-green-300"></div>
        <div className="absolute h-full w-1 left-9 bg-green-300"></div>
        
        {/* Pipe lip/border */}
        <div 
          className={`absolute left-0 w-full bg-gray-800 ${isTop ? 'bottom-0' : 'top-0'}`}
          style={{ height: '20px' }}
        >
          {/* Inner pipe lip */}
          <div 
            className="absolute left-2 w-full bg-green-500" 
            style={{ top: '4px', height: '12px', width: 'calc(100% - 4px)' }}
          >
            {/* Lighter vertical stripes in lip */}
            <div className="absolute h-full w-3 left-2 bg-green-300"></div>
            <div className="absolute h-full w-1 left-7 bg-green-300"></div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render more realistic cloud
  const renderCloud = (left, top, scale = 1, speed = 0) => {
    const adjustedLeft = ((Number(left.replace('px', '')) - (speed * 0.2)) % (gameWidth + 100)) - 50;
    
    return (
      <div className="absolute" style={{ left: `${adjustedLeft}px`, top }}>
        {/* Main cloud body */}
        <div 
          className="bg-white rounded-full" 
          style={{ 
            width: `${60 * scale}px`, 
            height: `${30 * scale}px`,
            opacity: 0.9
          }}
        ></div>
        
        {/* Cloud puffs */}
        <div 
          className="absolute bg-white rounded-full" 
          style={{ 
            width: `${35 * scale}px`, 
            height: `${35 * scale}px`, 
            left: `${10 * scale}px`, 
            top: `${-15 * scale}px`,
            opacity: 0.9
          }}
        ></div>
        
        <div 
          className="absolute bg-white rounded-full" 
          style={{ 
            width: `${25 * scale}px`, 
            height: `${25 * scale}px`, 
            left: `${35 * scale}px`, 
            top: `${-10 * scale}px`,
            opacity: 0.9
          }}
        ></div>
        
        <div 
          className="absolute bg-white rounded-full" 
          style={{ 
            width: `${30 * scale}px`, 
            height: `${30 * scale}px`, 
            left: `${30 * scale}px`, 
            top: `${-5 * scale}px`,
            opacity: 0.9
          }}
        ></div>
      </div>
    );
  };
  
  // Render a star for night sky
  const renderStar = (left, top, size = 1, blink = false) => {
    const opacity = blink ? (Math.sin(Date.now() / 1000) + 1) / 2 * 0.8 + 0.2 : 0.8;
    
    return (
      <div 
        className="absolute bg-white rounded-full" 
        style={{ 
          left, 
          top, 
          width: `${size}px`, 
          height: `${size}px`,
          opacity
        }}
      ></div>
    );
  };
  
  // Render sun or moon
  const renderCelestial = (dayProgress) => {
    // Determine if it's day or night (0-50 is day, 50-100 is night)
    const isDaytime = dayProgress < 50;
    const progress = isDaytime ? dayProgress * 2 : (dayProgress - 50) * 2;
    
    // Calculate position along arc
    const angle = progress * Math.PI;
    const radius = gameHeight * 0.8;
    const centerX = gameWidth / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = gameHeight - Math.sin(angle) * radius;
    
    if (isDaytime) {
      // Render sun
      return (
        <div 
          className="absolute bg-yellow-300 rounded-full shadow-lg"
          style={{
            left: `${x - 20}px`,
            top: `${y - 20}px`,
            width: '40px',
            height: '40px',
            boxShadow: '0 0 20px 10px rgba(255, 255, 0, 0.3)'
          }}
        ></div>
      );
    } else {
      // Render moon
      return (
        <div 
          className="absolute bg-gray-100 rounded-full"
          style={{
            left: `${x - 15}px`,
            top: `${y - 15}px`,
            width: '30px',
            height: '30px'
          }}
        >
          {/* Moon crater details */}
          <div className="absolute bg-gray-200 rounded-full w-2 h-2 top-2 left-4"></div>
          <div className="absolute bg-gray-200 rounded-full w-3 h-3 top-5 left-2"></div>
          <div className="absolute bg-gray-200 rounded-full w-2 h-2 top-6 left-6"></div>
        </div>
      );
    }
  };
  
  // Calculate background color based on day/night cycle
  const getBackgroundStyle = () => {
    const dayProgress = dayNightCycleRef.current;
    let skyColor;
    
    if (dayProgress < 40) {
      // Day: bright blue
      skyColor = '#4AC0CF';
    } else if (dayProgress < 50) {
      // Sunset: orange-pink gradient
      skyColor = 'linear-gradient(to bottom, #FF9966, #FF5E62, #4AC0CF)';
    } else if (dayProgress < 90) {
      // Night: dark blue
      skyColor = '#0A2342';
    } else {
      // Dawn: purple-orange gradient
      skyColor = 'linear-gradient(to bottom, #7B68EE, #FF9966, #4AC0CF)';
    }
    
    return {
      width: `${gameWidth}px`,
      height: `${gameHeight}px`,
      background: skyColor,
      imageRendering: 'pixelated',
      transition: 'background 2s ease'
    };
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <MovingCloudsBackground />
      <div 
        ref={gameAreaRef}
        className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
        style={getBackgroundStyle()}
        onClick={handleJump}
        onTouchStart={handleJump}
      >
        {/* Sun or Moon */}
        {renderCelestial(dayNightCycleRef.current)}
        
        {/* Stars (only visible at night) */}
        {dayNightCycleRef.current >= 50 && dayNightCycleRef.current < 90 && (
          <>
            {renderStar('50px', '30px', 2, true)}
            {renderStar('100px', '60px', 3)}
            {renderStar('150px', '20px', 2)}
            {renderStar('200px', '40px', 3, true)}
            {renderStar('250px', '70px', 2)}
            {renderStar('70px', '80px', 2, true)}
            {renderStar('170px', '100px', 2)}
            {renderStar('270px', '30px', 2, true)}
          </>
        )}
        
        {/* Clouds with movement */}
        {dayNightCycleRef.current < 50 || dayNightCycleRef.current >= 90 ? (
          <>
            {renderCloud('20px', '40px', 1.2, score)}
            {renderCloud('120px', '60px', 1, score)}
            {renderCloud('220px', '30px', 1.5, score)}
            {renderCloud('320px', '50px', 1.3, score)}
          </>
        ) : (
          // Fewer clouds at night with lower opacity
          <>
            {renderCloud('50px', '70px', 1, score)}
            {renderCloud('200px', '40px', 1.2, score)}
          </>
        )}
        
        {/* Mountains in background */}
        <div className="absolute bottom-0 w-full" style={{ height: '180px', zIndex: 1 }}>
          {/* Far mountains */}
          <div 
            className="absolute bottom-0 w-full"
            style={{ 
              height: '100px',
              background: 'linear-gradient(180deg, rgba(103, 58, 183, 0.5) 0%, rgba(98, 79, 130, 0.7) 100%)'
            }}
          >
            <svg width={gameWidth} height="100" viewBox={`0 0 ${gameWidth} 100`} fill="none">
              <path d="M0,100 L80,40 L120,70 L200,20 L240,50 L320,30 L320,100 Z" fill="rgba(103, 58, 183, 0.4)" />
            </svg>
          </div>
          
          {/* Closer mountains */}
          <div 
            className="absolute bottom-0 w-full"
            style={{ 
              height: '70px',
              background: 'linear-gradient(180deg, rgba(76, 175, 80, 0.5) 0%, rgba(27, 94, 32, 0.6) 100%)'
            }}
          >
            <svg width={gameWidth} height="70" viewBox={`0 0 ${gameWidth} 70`} fill="none">
              <path d="M0,70 L40,40 L80,60 L130,20 L160,40 L190,30 L230,50 L270,20 L320,30 L320,70 Z" fill="rgba(56, 142, 60, 0.5)" />
            </svg>
          </div>
        </div>
        
        {/* City Skyline with improved styling */}
        <div 
          className="absolute bottom-0 w-full"
          style={{ height: '120px', zIndex: 2 }}
        >
          {/* City Buildings */}
          <div className="absolute bottom-0 w-full flex items-end" style={{ height: '80px' }}>
            {/* Building 1 */}
            <div className="h-12 w-12 bg-blue-400 opacity-80 mx-1 shadow-md">
              <div className="grid grid-cols-2 gap-1 p-1">
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
                <div className="h-2 w-2 bg-yellow-300"></div>
              </div>
            </div>
            
            {/* Building 2 */}
            <div className="h-20 w-14 bg-purple-300 opacity-80 mx-1 shadow-md">
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
              </div>
            </div>
            
            {/* Building 3 - Skyscraper */}
            <div className="h-24 w-12 bg-gray-400 opacity-80 mx-1 relative shadow-md">
              <div className="absolute top-0 left-0 w-full h-full grid grid-cols-2 gap-1 p-1">
                {Array(10).fill(0).map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="h-2 w-2 bg-yellow-300"></div>
                    <div className="h-2 w-2 bg-blue-200"></div>
                  </React.Fragment>
                ))}
              </div>
              {/* Antenna */}
              <div className="absolute -top-2 left-5 w-1 h-4 bg-gray-600"></div>
            </div>
            
            {/* Building 4 */}
            <div className="h-16 w-16 bg-blue-300 opacity-80 mx-1 shadow-md">
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
              </div>
            </div>
            
            {/* Building 5 */}
            <div className="h-28 w-14 bg-indigo-300 opacity-80 mx-1 shadow-md">
              <div className="grid grid-cols-2 gap-1 p-1">
                {Array(8).fill(0).map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="h-2 w-2 bg-yellow-300"></div>
                    <div className="h-2 w-2 bg-blue-200"></div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Building 6 */}
            <div className="h-16 w-10 bg-teal-300 opacity-80 mx-1 shadow-md">
              <div className="grid grid-cols-2 gap-1 p-1">
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
                <div className="h-2 w-2 bg-yellow-300"></div>
              </div>
            </div>
            
            {/* Building 7 */}
            <div className="h-20 w-16 bg-blue-300 opacity-80 mx-1 shadow-md">
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
                <div className="h-2 w-2 bg-yellow-300"></div>
                <div className="h-2 w-2 bg-blue-200"></div>
              </div>
            </div>
          </div>
          
          {/* Ground with grass and road */}
          <div className="absolute bottom-0 w-full h-6">
            <div className="absolute bottom-0 w-full h-6 bg-gray-700"></div>
            <div className="absolute bottom-4 w-full h-2 bg-yellow-500"></div>
            <div className="absolute bottom-2 w-full h-2 bg-green-700"></div>
          </div>
        </div>
        
        {/* Bird */}
        <div 
          className="absolute"
          style={{
            left: `${gameWidth / 2 - 12}px`,
            top: `${birdPosition}px`,
            width: '24px',
            height: '24px',
            transform: `rotate(${birdVelocity * 3}deg)`,
            transition: gameFrozen ? 'none' : 'transform 0.1s',
            zIndex: 10
          }}
        >
          {/* Bird Body */}
          <div className="absolute w-full h-full rounded-full bg-yellow-400"></div>
          
          {/* Bird Face/Eyes */}
          <div className="absolute w-3 h-3 rounded-full bg-white left-4 top-2">
            <div className="absolute w-1 h-1 rounded-full bg-black left-1 top-1"></div>
          </div>
          <div className="absolute w-2 h-2 rounded-full bg-white left-3 top-3"></div>
          
          {/* Bird Beak */}
          <div className="absolute w-4 h-4 rounded-sm bg-orange-500 left-0 top-3"></div>
          
          {/* Bird Wing */}
          <div 
            className="absolute w-4 h-2 rounded-full left-4 top-5"
            style={{
              backgroundColor: '#CB5920',
              transform: gameFrozen ? 'none' : `rotate(${Math.sin(Date.now() / 200) * 20}deg)`,
            }}
          ></div>
        </div>
        
        {/* Pipes with depth effect */}
        {pipes.map((pipe) => (
          <React.Fragment key={pipe.id}>
            <div className="absolute" style={{ zIndex: 5 }}>
              {renderPipe(pipe, 'top')}
            </div>
            <div className="absolute" style={{ zIndex: 5 }}>
              {renderPipe(pipe, 'bottom')}
            </div>
          </React.Fragment>
        ))}
        
        {/* Game UI Overlay */}
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white z-20">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">Flappy Bird</h2>
            <p className="mb-6">Tap or press Space to start</p>
            <button 
              className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transform transition hover:scale-105"
              onClick={startGame}
            >
              Play
            </button>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white z-20">
            <h2 className="text-3xl font-bold mb-2 text-red-500">Game Over</h2>
            <p className="mb-1 text-lg">Score: {score}</p>
            <p className="mb-4 text-lg">High Score: {highScore}</p>
            <button 
              className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transform transition hover:scale-105"
              onClick={startGame}
            >
              Play Again
            </button>
          </div>
        )}
        
        {gameStarted && !gameOver && (
          <div className="absolute top-4 left-0 w-full text-center text-white font-bold text-2xl z-20">
            <div className="bg-black bg-opacity-50 rounded-full inline-block px-4 py-1">
              {score}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-700">
        <p className="text-sm">Tap/click or press Space to make the bird fly</p>
      </div>
    </div>
  );
};

export default FlappyBird;