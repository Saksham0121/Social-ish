import React, { useState, useEffect } from 'react';
import { ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';

const GameCabinet = ({ game, isHovered, isSelected, onHover, onSelect }) => {
  return (
    <div 
      className="relative flex flex-col items-center cursor-pointer transition-all duration-300 p-4"
      onMouseEnter={() => onHover(game.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(game.id)}
    >
      {/* Cabinet Image Container */}
      <div className="relative mb-4 transform transition-all duration-300 hover:scale-105">
        {/* REPLACE THIS IMAGE TAG WITH YOUR CUSTOM PNG CABINET IMAGE */}
        <div className="relative w-36 h-44">
          {/* Cabinet Base Image - This is your non-highlighted cabinet */}
          <img 
            src={game.cabinetImage} 
            alt={`${game.name} cabinet`} 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Selection highlight background */}
      {(isHovered || isSelected) && (
        <>
          <div className="absolute inset-0 bg-neutral-400 -z-10 rounded-lg"></div>
          {isSelected && (
            <div className="absolute inset-0 bg-neutral-400 -z-10 rounded-lg animate-pulse opacity-50"></div>
          )}
        </>
      )}
    </div>
  );
};

const GamesPage = () => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [selectedGame, setSelectedGame] = useState('snake-game');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  
  // REPLACE THE IMAGE PATHS WITH YOUR ACTUAL PNG IMAGE PATHS
  const games = [
    { 
      id: 'flappy-bird', 
      name: 'Flappy Bird', 
      cabinetImage: 'src/Assets/flappy_bird_cabinet.png',
      description: 'Navigate a bird through pipes by tapping to flap. How far can you go?'
    },
    { 
      id: 'paint-grid', 
      cabinetImage: 'src/Assets/Paint grid cabinet.png',
      description: 'Express your creativity by filling in pixels to create amazing art.'
    },
    { 
      id: '2048', 
      name: '2048', 
      cabinetImage: 'src/Assets/2048 cabinet.png',
      description: 'Combine tiles to reach the elusive 2048 tile in this addictive puzzle game.'
    },
    { 
      id: 'snake-game', 
      cabinetImage: 'src/Assets/snake cabinet.png',
      description: 'Control a hungry snake as it grows longer with each piece of food. Don\'t hit the walls or yourself!'
    }
  ];

  // Sound effect simulation
  useEffect(() => {
    if (soundEnabled && hoveredGame) {
      // Would play hover sound here
    }
  }, [hoveredGame, soundEnabled]);

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 300);
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50 relative overflow-hidden">
      {/* Decorative background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 border-t border-l border-neutral-400 rounded-tl-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 border-b border-r border-neutral-400 rounded-br-full"></div>
        <div className="absolute top-1/4 right-0 w-32 h-32 border-t border-r border-neutral-400 rounded-tr-full opacity-30"></div>
        <div className="absolute bottom-1/4 left-0 w-32 h-32 border-b border-l border-neutral-400 rounded-bl-full opacity-30"></div>
      </div>
      
      {/* Header with navigation */}
      <header className="p-6 flex justify-between items-center z-10">
        <Link to="/" className="text-neutral-800 hover:text-neutral-600 transition-colors">
          <ChevronLeft size={28} />
        </Link>
        
        <button 
          className="text-neutral-800 hover:text-neutral-600 transition-colors p-2 rounded-full"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>
      
      {/* Games Title with outline effect */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-6xl font-bold" style={{ 
          WebkitTextStroke: '2px #1c1917',
          color: 'transparent',
          textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
        }}>
          GAMES
        </h1>
      </div>
      
      {/* Game selection grid */}
      <div className="flex-1 flex justify-center items-center z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-4 max-w-3xl">
          {games.map((game) => (
            <GameCabinet 
              key={game.id}
              game={game}
              isHovered={hoveredGame === game.id}
              isSelected={selectedGame === game.id}
              onHover={setHoveredGame}
              onSelect={handleGameSelect}
            />
          ))}
        </div>
      </div>
      
      {/* Game description panel */}
      <div className="p-4 mt-4 text-center max-w-lg mx-auto text-neutral-700">
        {selectedGame && (
          <p className="font-mono text-sm">
            {games.find(g => g.id === selectedGame)?.description || ''}
          </p>
        )}
      </div>
      
      {/* Selection overlay flash effect */}
      {showOverlay && (
        <div className="absolute inset-0 bg-amber-100 opacity-20 z-50 pointer-events-none animate-fadeOut"></div>
      )}
      
      {/* Add custom animation CSS */}
      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 0.2; }
          to { opacity: 0; }
        }
        .animate-fadeOut {
          animation: fadeOut 300ms ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GamesPage;