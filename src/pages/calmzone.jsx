import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CalmZone() {
  const navigate = useNavigate();
  const [activeAudio, setActiveAudio] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('nature');
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handler functions for navigation
  const handleBackToWebsite = () => {
    navigate('/');
  };

  const categories = {
    nature: [
      { id: 'ocean-waves', name: 'OCEAN WAVES', src: '/audio/ocean-waves.mp3' },
      { id: 'rainfall-thunder', name: 'RAINFALL & THUNDER', src: '/audio/rainfall-thunder.mp3' },
      { id: 'forest-ambiance', name: 'FOREST AMBIANCE', src: '/audio/forest-ambiance.mp3' },
      { id: 'winter-winds', name: 'WINTER WINDS', src: '/audio/winter-winds.mp3' },
    ],
    ambient: [
      { id: 'space-ambient', name: 'SPACE AMBIENT', src: '/audio/space-ambient.mp3' },
      { id: 'city-rain', name: 'CITY RAIN', src: '/audio/city-rain.mp3' },
      { id: 'cafe-sounds', name: 'CAFE SOUNDS', src: '/audio/cafe-sounds.mp3' },
      { id: 'white-noise', name: 'WHITE NOISE', src: '/audio/white-noise.mp3' },
    ],
    instrumental: [
      { id: 'piano-melody', name: 'PIANO MELODY', src: '/audio/piano-melody.mp3' },
      { id: 'acoustic-guitar', name: 'ACOUSTIC GUITAR', src: '/audio/acoustic-guitar.mp3' },
      { id: 'ambient-synth', name: 'AMBIENT SYNTH', src: '/audio/ambient-synth.mp3' },
      { id: 'meditation-bowls', name: 'MEDITATION BOWLS', src: '/audio/meditation-bowls.mp3' },
    ],
    guided: [
      { id: 'breathing-exercise', name: 'BREATHING EXERCISE', src: '/audio/breathing-exercise.mp3' },
      { id: 'body-scan', name: 'BODY SCAN', src: '/audio/body-scan.mp3' },
      { id: 'mindfulness', name: 'MINDFULNESS', src: '/audio/mindfulness.mp3' },
      { id: 'sleep-meditation', name: 'SLEEP MEDITATION', src: '/audio/sleep-meditation.mp3' },
    ],
  };

  // Images for each category
  const categoryImages = {
    nature: 'src/Assets/calmzoneassets/nature_sounds.jpg',
    ambient: '/api/placeholder/400/320',
    instrumental: '/api/placeholder/400/320',
    guided: '/api/placeholder/400/320',
  };

  const playAudio = (audioId) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (activeAudio === audioId) {
      setActiveAudio(null);
      setIsPlaying(false);
    } else {
      setActiveAudio(audioId);
      setIsPlaying(true);
      
      // In a real implementation, you would use the actual audio element
      const selectedAudio = Object.values(categories)
        .flat()
        .find(item => item.id === audioId);
      
      if (selectedAudio && audioRef.current) {
        audioRef.current.src = selectedAudio.src;
        audioRef.current.play().catch(err => console.error("Audio playback error:", err));
        console.log(`Playing: ${selectedAudio.name}`);
      }
    }
  };

  // Get the active category's audio items
  const activeItems = categories[currentCategory] || [];

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center">
        
      {/* Back button */}
      <button 
        onClick={handleBackToWebsite}
        className="absolute top-6 left-6 z-50 flex items-center text-stone-800 hover:text-amber-800 transition-colors bg-white px-4 py-2 rounded-full hover:bg-amber-100 shadow-md">
        <ArrowLeft size={24} className="mr-1" />
        <span>Back</span>
      </button>

      {/* Main content */}
      <div className="container w-1/2 px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center mb-12">
          <h1 className="text-4xl font-bold text-center flex-grow font-slackey text-stone-800 tracking-wider">Calm Zone</h1>
        </div>
        <div className='flex bg-amber-100 items-center'></div>
        <div className="flex flex-col h-col items-center md:flex-row gap-10">
          {/* Left side - Categories in a 2x2 grid with wider buttons */}
          <div className="w-full md:w-1/2 grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setCurrentCategory('nature')}
                className={`flex flex-row items-center justify-start rounded-lg py-3 px-4 ${currentCategory === 'nature' ? 'bg-amber-600' : 'bg-amber-700'} hover:bg-amber-600 transition-colors`}
              >
                <span className="text-2xl mr-3">🌲</span>
                <span className="text-sm tracking-wider">NATURE</span>
              </button>

              <button 
                onClick={() => setCurrentCategory('ambient')}
                className={`flex flex-row items-center justify-start rounded-lg py-3 px-4 ${currentCategory === 'ambient' ? 'bg-amber-600' : 'bg-amber-700'} hover:bg-amber-600 transition-colors`}
              >
                <span className="text-2xl mr-3">🎧</span>
                <span className="text-sm tracking-wider">AMBIENT</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setCurrentCategory('instrumental')}
                className={`flex flex-row items-center justify-start rounded-lg py-3 px-4 ${currentCategory === 'instrumental' ? 'bg-amber-600' : 'bg-amber-700'} hover:bg-amber-600 transition-colors`}
              >
                <span className="text-2xl mr-3">🎵</span>
                <span className="text-sm tracking-wider">INSTRUMENTAL</span>
              </button>

              <button 
                onClick={() => setCurrentCategory('guided')}
                className={`flex flex-row items-center justify-start rounded-lg py-3 px-4 ${currentCategory === 'guided' ? 'bg-amber-600' : 'bg-amber-700'} hover:bg-amber-600 transition-colors`}
              >
                <span className="text-2xl mr-3">🧘</span>
                <span className="text-sm tracking-wider">GUIDED</span>
              </button>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 bg-amber-200 rounded-lg p-8">
            <div className="mb-6">
              <img 
                src={categoryImages[currentCategory]} 
                alt={`${currentCategory} scene`} 
                className="w-full h-48 object-cover rounded-md shadow-md" 
              />
            </div>

            <div className="space-y-3">
              {activeItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <button 
                    onClick={() => playAudio(item.id)}
                    className={`flex items-center ${activeAudio === item.id ? 'text-stone-800 font-medium' : 'text-stone-600'} hover:text-stone-800 transition-colors`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-800 text-white mr-3 shadow-sm">
                      {activeAudio === item.id ? '■' : '▶'}
                    </div>
                    <span className="text-lg tracking-wider">{item.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element that would actually play the sounds */}
      <audio ref={audioRef} loop />
    </div>
  );
}