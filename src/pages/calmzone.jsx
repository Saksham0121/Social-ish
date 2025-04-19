import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Info, X, Play, Square, ChevronLeft } from 'lucide-react';

export default function CalmZone() {
  const navigate = useNavigate();
  const [activeAudio, setActiveAudio] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('nature');
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showInfo, setShowInfo] = useState(false);
  const timerRef = useRef(null);

  // Handler functions for navigation
  const handleBackToWebsite = () => {
    navigate('/');
  };

  const categories = {
    nature: [
      { id: 'ocean-waves', name: 'OCEAN WAVES', src: 'src/Assets/calmzoneassets/ocean_waves.mp3', description: 'Gentle ocean waves crashing on a sandy shore. Perfect for relaxation and sleep.' },
      { id: 'rainfall-thunder', name: 'RAINFALL & THUNDER', src: 'src/Assets/calmzoneassets/rainfall_thunder.mp3', description: 'Soothing rainfall with occasional distant thunder. Creates a cozy atmosphere.' },
      { id: 'forest-ambiance', name: 'FOREST AMBIANCE', src: 'src/Assets/calmzoneassets/forest_ambience.mp3', description: 'Immersive forest sounds with birds chirping and leaves rustling in the breeze.' },
      { id: 'winter-winds', name: 'WINTER WINDS', src: 'src/Assets/calmzoneassets/winter_winds.mp3', description: 'Howling winter winds and subtle creaking of snow. Great for focus and concentration.' },
    ],
    ambient: [
      { id: 'green-noise', name: 'GREEN', src: 'src/Assets/calmzoneassets/green_noise.mp3', description: 'Deep space ambient sounds with ethereal tones. Ideal for deep meditation.' },
      { id: 'city-rain', name: 'CITY RAIN', src: 'src/Assets/calmzoneassets/city_sounds.mp3', description: 'Rain falling on city streets with distant traffic sounds. Perfect urban ambiance.' },
      { id: 'cafe-sounds', name: 'CAFE SOUNDS', src: 'src/Assets/calmzoneassets/cafe_sounds.mp3', description: 'Gentle murmur of a cafe with distant conversations and occasional clinks of cups.' },
      { id: 'white-noise', name: 'WHITE NOISE', src: 'src/Assets/calmzoneassets/white_noise.mp3', description: 'Pure white noise to mask distractions and improve focus during work or study.' },
    ],
    instrumental: [
      { id: 'piano-melody', name: 'PIANO MELODY', src: 'src/Assets/calmzoneassets/piano_melody.mp3', description: 'Soft piano melodies with a gentle, relaxing tempo. Helps calm the mind.' },
      { id: 'acoustic-guitar', name: 'ACOUSTIC GUITAR', src: 'src/Assets/calmzoneassets/acoustic_guitar.mp3', description: 'Soothing acoustic guitar instrumentals perfect for unwinding after a long day.' },
      { id: 'ambient-synth', name: 'AMBIENT SYNTH', src: 'src/Assets/calmzoneassets/ambient_synth.mp3', description: 'Atmospheric synthesizer tones that create a floating, dreamy ambiance.' },
      { id: 'sitar-melody', name: 'SITAR MELODY', src: 'src/Assets/calmzoneassets/sitar_melody.mp3', description: 'Traditional singing bowls with rich resonant tones. Ideal for meditation.' },
    ],
    guided: [
      { id: 'breathing-exercise', name: 'BREATHING EXERCISE', src: 'src/Assets/calmzoneassets/breathing_exercise.mp3', description: 'Guided breathing exercise to reduce stress and anxiety.' },
      { id: 'body-scan', name: 'BODY SCAN', src: 'src/Assets/calmzoneassets/body_scan.mp3', description: 'Guided body scan meditation to release tension throughout the body.' },
      { id: 'mindfulness', name: 'MINDFULNESS', src: 'src/Assets/calmzoneassets/mindfullness_meditation.mp3', description: 'Mindfulness practice to bring awareness to the present moment.' },
      { id: 'sleep-meditation', name: 'SLEEP MEDITATION', src: 'src/Assets/calmzoneassets/sleep_meditation.mp3', description: 'Guided meditation designed to help you fall asleep naturally.' },
    ],
  };

  // Images for each category
  const categoryImages = {
    nature: 'src/Assets/calmzoneassets/nature_sounds.jpg',
    ambient: 'src/Assets/calmzoneassets/ambientNoises.jpg',
    instrumental: 'src/Assets/calmzoneassets/instrumental.jpg',
    guided: 'src/Assets/calmzoneassets/meditaion.jpg',
  };

  // Icons for each category
  const categoryIcons = {
    nature: '🌲',
    ambient: '🎧',
    instrumental: '🎵',
    guided: '🧘',
  };

  // Function to play audio
  const playAudio = (audioId) => {
    // Check if we're clicking on the currently active audio
    if (activeAudio === audioId) {
      stopAudio();
      return;
    }
    
    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Find the selected audio
    const selectedAudio = Object.values(categories)
      .flat()
      .find(item => item.id === audioId);
    
    if (selectedAudio) {
      // Set the active audio ID
      setActiveAudio(audioId);
      setIsPlaying(true);
      
      // Create a new audio element if none exists
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      // Set audio properties
      audioRef.current.src = selectedAudio.src;
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      
      // Play the audio with error handling
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`Playing ${selectedAudio.name}`);
          })
          .catch(error => {
            console.error("Audio playback error:", error);
            // Reset state if playback fails
            setActiveAudio(null);
            setIsPlaying(false);
          });
      }
    }
  };

  // Function to stop audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setActiveAudio(null);
    setIsPlaying(false);
    stopTimer();
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (audioRef.current.volume > 0) {
        audioRef.current.volume = 0;
        setVolume(0);
      } else {
        audioRef.current.volume = 0.7;
        setVolume(0.7);
      }
    }
  };

  // stopTimer function
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimerActive(false);
    }
  };

  // Show info modal for the currently selected audio
  const toggleInfoModal = () => {
    setShowInfo(!showInfo);
  };

  // Get the active audio item info
  const getActiveAudioInfo = () => {
    if (!activeAudio) return null;
    
    return Object.values(categories)
      .flat()
      .find(item => item.id === activeAudio);
  };

  // Add event listeners to the audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    
    // Add event listeners
    const handleEnded = () => {
      setActiveAudio(null);
      setIsPlaying(false);
    };
    
    const handleError = (e) => {
      console.error("Audio error:", e);
      setActiveAudio(null);
      setIsPlaying(false);
    };
    
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    
    // Clean up when component unmounts
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      if (timerRef.current) clearInterval(timerRef.current);
      audio.pause();
    };
  }, []);

  // Get the active category's audio items
  const activeItems = categories[currentCategory] || [];
  const activeAudioInfo = getActiveAudioInfo();

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center"
    style={{backgroundImage: "url('src/Assets/homepage_bg.png')"}}>
        
      {/* Back button */}
      <button 
        onClick={handleBackToWebsite}
        className="absolute top-7 left-8 z-50 flex items-center text-stone-800 hover:text-amber-800 transition-colors px-4 py-2 rounded-full hover:bg-amber-100 ">
        <ChevronLeft size={32} className="mr-1" />
      </button>

      {/* Main content */}
      <div className="container max-w-6xl px-4 py-12 relative z-10">
        {/* Header */}
        <div className="flex items-center mb-12">
          <h1 className="text-5xl font-bold text-center flex-grow font-slackey text-stone-800 tracking-wider">Calm Zone</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left side - Categories and controls */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            {/* Categories grid - Moved down with justify-center */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {Object.keys(categories).map(category => (
                <button 
                  key={category}
                  onClick={() => setCurrentCategory(category)}
                  className={`flex flex-row items-center justify-start rounded-xl py-4 px-5 ${
                    currentCategory === category 
                      ? 'bg-amber-600 shadow-lg' 
                      : 'bg-amber-700 opacity-80'
                  } hover:bg-amber-600 transition-all transform hover:scale-105 text-white`}
                >
                  <span className="text-3xl mr-3">{categoryIcons[category]}</span>
                  <span className="text-lg tracking-wider uppercase">{category}</span>
                </button>
              ))}
            </div>

            {/* Volume controls */}
            <div className="bg-white bg-opacity-80 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-stone-800">Volume</h3>
                <button onClick={toggleMute} className="text-stone-600 hover:text-stone-800">
                  {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
              </div>
              
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Right side - Sound selector with current category image */}
          <div className="w-full lg:w-1/2">
            <div className="bg-amber-100 rounded-xl shadow-lg overflow-hidden">
              {/* Category image */}
              <div className="relative">
                <img 
                  src={categoryImages[currentCategory]} 
                  alt={`${currentCategory} scene`} 
                  className="w-full h-64 object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                <h2 className="absolute bottom-4 left-6 text-2xl font-bold text-white uppercase tracking-wider">
                  {currentCategory} Sounds
                </h2>
              </div>

              {/* Sound buttons */}
              <div className="p-6 space-y-4">
                {activeItems.map(item => (
                  <div key={item.id} className="group">
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => playAudio(item.id)}
                        className={`flex items-center flex-grow ${
                          activeAudio === item.id 
                            ? 'text-amber-800 font-medium' 
                            : 'text-stone-600'
                        } hover:text-stone-800 transition-colors`}
                      >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          activeAudio === item.id 
                            ? 'bg-stone-800' 
                            : 'bg-stone-800'
                        } text-white mr-4 shadow-md transition-all transform group-hover:scale-110`}>
                          {activeAudio === item.id ? <Square size={16} /> : <Play size={16} />}
                        </div>
                        <span className="text-lg tracking-wider">{item.name}</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          if (activeAudio === item.id) {
                            toggleInfoModal();
                          }
                        }}
                        className="text-stone-500 hover:text-amber-700 p-2"
                        aria-label="Show information"
                      >
                        <Info size={18} />
                      </button>
                    </div>
                    
                    {/* Short description preview */}
                    <p className="text-sm text-stone-500 ml-14 mt-1 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}