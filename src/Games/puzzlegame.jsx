import React, { useState, useEffect } from 'react';
import { Shuffle, Eye, EyeOff } from 'lucide-react';
// Import the image at the top level
import Torii_Gate from '../Assets/Torii_Gate.jpeg';

const JigsawPuzzle = () => {
  // Configuration - REDUCED for easier gameplay
  const rows = 3; // Reduced from 5
  const columns = 4; // Reduced from 7
  const totalPieces = rows * columns;

  // State
  const [pieces, setPieces] = useState([]);
  const [solved, setSolved] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Initialize puzzle pieces
  useEffect(() => {
    initializePuzzle();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (startTime && !solved) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, solved]);

  const initializePuzzle = () => {
    const newPieces = [];
    for (let i = 0; i < totalPieces; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      newPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        row,
        col
      });
    }
    shufflePieces(newPieces);
    setStartTime(Date.now());
    setCurrentTime(Date.now());
    setSolved(false);
    setMoves(0);
  };

  const shufflePieces = (piecesArray) => {
    const shuffled = [...piecesArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i].currentPosition, shuffled[j].currentPosition] = 
      [shuffled[j].currentPosition, shuffled[i].currentPosition];
    }
    setPieces(shuffled);
  };

  const handlePieceSelect = (pieceId) => {
    if (solved) return;
    
    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else {
      // Swap positions
      const newPieces = [...pieces];
      const piece1 = newPieces.find(p => p.id === selectedPiece);
      const piece2 = newPieces.find(p => p.id === pieceId);
      
      const temp = piece1.currentPosition;
      piece1.currentPosition = piece2.currentPosition;
      piece2.currentPosition = temp;
      
      setPieces(newPieces);
      setSelectedPiece(null);
      setMoves(moves + 1);
      
      // Check if puzzle is solved
      const isSolved = newPieces.every(piece => piece.currentPosition === piece.correctPosition);
      if (isSolved) {
        setSolved(true);
      }
    }
  };

  const resetPuzzle = () => {
    initializePuzzle();
    setShowHint(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const formatTime = () => {
    if (!startTime || !currentTime) return "00:00";
    const totalSeconds = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Coastal Scene Jigsaw Puzzle</h1>
      
      <div className="flex flex-wrap justify-between w-full mb-4 gap-2">
        <div className="flex items-center">
          <span className="mr-2">Time:</span>
          <span className="font-mono">{formatTime()}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Moves:</span>
          <span className="font-mono">{moves}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleHint}
            className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            {showHint ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
          <button 
            onClick={resetPuzzle}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            <Shuffle className="w-4 h-4 mr-1" /> Shuffle
          </button>
        </div>
      </div>

      {solved && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-full">
          <strong>Congratulations!</strong> You solved the puzzle in {moves} moves and {formatTime()}!
        </div>
      )}
      
      {/* Hint Image */}
      {showHint && (
        <div className="mb-4 relative w-full max-w-md border-4 border-yellow-400 rounded-lg overflow-hidden">
          <img 
            src={Torii_Gate} 
            alt="Puzzle Hint" 
            className="w-full object-cover"
          />
          <div className="absolute top-0 left-0 bg-yellow-400 text-xs px-2 py-1">
            HINT
          </div>
        </div>
      )}
      
      <div 
        className="grid gap-2 bg-gray-200 p-4 rounded-lg shadow-lg"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          width: '100%',
          aspectRatio: `${columns}/${rows}`
        }}
      >
        {pieces.sort((a, b) => a.currentPosition - b.currentPosition).map((piece) => (
          <div
            key={piece.id}
            onClick={() => handlePieceSelect(piece.id)}
            className={`relative overflow-hidden cursor-pointer transition-all border-2 ${
              selectedPiece === piece.id ? 'ring-4 ring-blue-500 z-10' : ''
            } ${piece.currentPosition === piece.correctPosition ? 'border-green-500' : 'border-gray-400'}`}
            style={{
              aspectRatio: '1/1'
            }}
          >
            {/* The background image is positioned to show just the piece's portion */}
            <div 
              className="w-full h-full bg-cover"
              style={{
                backgroundImage: `url(${Torii_Gate})`,
                backgroundSize: `${columns * 100}% ${rows * 100}%`,
                backgroundPosition: `${(piece.id % columns) / (columns - 1) * 100}% ${Math.floor(piece.id / columns) / (rows - 1) * 100}%`,
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Click on a piece to select it, then click another piece to swap their positions.</p>
        <p>If you get stuck, use the "Show Hint" button to see the complete image.</p>
      </div>
    </div>
  );
};

export default JigsawPuzzle;