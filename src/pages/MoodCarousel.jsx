import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, Music, Volume2, Heart, Share2, Pause } from 'lucide-react';

const MoodCarousel = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(3); // Start with middle card active
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState([false, false, false, false, false, false, false]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const carouselRef = useRef(null);
  const audioRef = useRef(null);
  
  // Sample mood cards data - replace URLs with actual YouTube playlist links
  const moodCards = [
    { id: 1, title: "CALM & COZY", image: "src/Assets/calmCozy.jpeg", playlistUrl: "https://www.youtube.com/watch?v=jO2viLEW-1A&list=RDQM6kxYRcZhHgs&start_radio=1" },
    { id: 2, title: "SOFT & GENTLE", image: "src/Assets/softGentle.jpeg", playlistUrl: "https://youtube.com/playlist?list=PLn7MDcB_f91fNExr4gSl4SiRmE90dy5QF&si=8D0DS3C7bje9VwpE" },
    { id: 3, title: "SWEET & NOSTALGIC", image: "src/Assets/sweetNostalgic.jpeg", playlistUrl: "https://youtu.be/LqgxOmbkvAA?si=ukO8F1NOia7XOpmm"},
    { id: 4, title: "UPBEAT & FUN", image: "src/Assets/upbat_and_fun.jpeg", playlistUrl: "https://youtube.com/playlist?list=PLgzTt0k8mXzF2fleyxQ17JxeccHFC8Gxp&si=FbEWoTlD4S5yYWlP" },
    { id: 5, title: "DREAMY & CALM", image: "src/Assets/dreamy_and_calm.jpeg", playlistUrl: "https://youtube.com/playlist?list=PLHixPvcKjkxBmPF7Ty6vk0qJdKaY2Z7XH&si=bP-r05rJY_Farna1" },
    { id: 6, title: "RELAXED & FOCUS", image: "src/Assets/relaxedFocus.jpeg", playlistUrl: "https://youtu.be/xgc1SlB9gk4?si=yQX6IJQA_Jgbwn7z" },
    { id: 7, title: "AMBIENT & CHILL", image: "src/Assets/ambient_and_chill.jpeg", playlistUrl: "https://youtu.be/FPEJZ2NN8wE?si=Mg_RnTAcdRL3Oyxs" },
  ];

  // Play background audio when component mounts
  useEffect(() => {
    // In a real implementation, you would use an actual audio file
    // This is just a mock implementation since we can't load external audio files
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    // Mock play function since we can't load a real audio file in this environment
    const mockPlay = () => {
      console.log("Playing background audio");
      setIsAudioPlaying(true);
    };
    
    // Call mockPlay instead of actual audio.play()
    mockPlay();
    
    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handler functions for navigation
  const handleBackToWebsite = () => {
    navigate('/');
  };

  const toggleBackgroundAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };
  
  const handleCardClick = (index) => {
    if (index === activeIndex) {
      // Toggle play state for active card
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        // Open YouTube playlist when active card is clicked and not already playing
        window.open(moodCards[index].playlistUrl, '_blank');
      }
    } else {
      // Set card as active if it's not already active
      setActiveIndex(index);
      setIsPlaying(false);
    }
  };
  
  const toggleFavorite = (index, e) => {
    e.stopPropagation(); // Prevent card click
    const newFavorites = [...isFavorite];
    newFavorites[index] = !newFavorites[index];
    setIsFavorite(newFavorites);
    
    // Show tooltip
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };
  
  const handleShare = (index, e) => {
    e.stopPropagation(); // Prevent card click
    const moodTitle = moodCards[index].title;
    const shareText = `Check out this ${moodTitle} playlist!`;
    
    if (navigator.share) {
      navigator.share({
        title: `${moodTitle} Music Playlist`,
        text: shareText,
        url: moodCards[index].playlistUrl,
      })
      .catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${moodCards[index].playlistUrl}`)
        .then(() => {
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 2000);
        });
    }
  };
  
  // Fixed scrolling functions to prevent glitching
  const scrollToPrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? moodCards.length - 1 : prevIndex - 1
    );
    setIsPlaying(false);
  };
  
  const scrollToNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === moodCards.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(false);
  };
  
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') scrollToPrev();
      if (e.key === 'ArrowRight') scrollToNext();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Fixed card positioning function to prevent glitching
  const getCardStyle = (index) => {
    // Calculate minimum distance between cards (accounting for wrapping)
    const calculateDistance = (idx1, idx2, length) => {
      const directDist = Math.abs(idx1 - idx2);
      const wrapDist = length - directDist;
      return Math.min(directDist, wrapDist);
    };
    
    // Calculate if the card is to the left or right of active (accounting for wrapping)
    const isToTheRight = (idx, activeIdx, length) => {
      if (idx === activeIdx) return false;
      const directDist = Math.abs(idx - activeIdx);
      const wrapDist = length - directDist;
      
      if (directDist <= wrapDist) {
        return idx > activeIdx;
      } else {
        return idx < activeIdx;
      }
    };
    
    // Get minimum distance to active card
    const distance = calculateDistance(index, activeIndex, moodCards.length);
    const toTheRight = isToTheRight(index, activeIndex, moodCards.length);
    
    // Default styling
    let translateX = 0;
    let scale = 1;
    let zIndex = 30 - distance; // Higher z-index for cards closer to active
    let opacity = 1;
    let rotate = 0;
    
    if (distance === 0) {
      // Active card
      translateX = 0;
      scale = 1;
      zIndex = 30;
    } else if (distance <= 2) {
      // Cards close to active (within 2 positions)
      const direction = toTheRight ? 1 : -1;
      translateX = direction * (120 + (distance - 1) * 80);
      scale = 0.85 - (distance * 0.05);
      rotate = direction * (8 * distance);
    } else {
      // Cards further away
      const direction = toTheRight ? 1 : -1;
      translateX = direction * 280;
      scale = 0.7;
      zIndex = 5;
      rotate = direction * 15;
    }
    
    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
      zIndex,
      opacity,
      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Smoother, bouncy transition
    };
  };

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/api/placeholder/1920/1080')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-amber-50 bg-opacity-80 z-0"></div>

      {/* Decorative floating music notes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-amber-800 opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {i % 2 === 0 ? '♪' : '♫'}
          </div>
        ))}
      </div>

      {/* Animation keyframes defined inline */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-150px) rotate(180deg); }
            100% { transform: translateY(-300px) rotate(360deg); opacity: 0; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .music-badge {
            transition: all 0.3s ease;
          }
          .music-badge:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
        `
      }} />

      {/* Back button */}
      <button 
        onClick={handleBackToWebsite}
        className="absolute top-7 left-8 z-50 flex items-center text-stone-800 hover:text-amber-800 transition-colors px-4 py-2 rounded-full hover:bg-amber-100"
      >
        <ChevronLeft size={24} className="mr-1" />
        
      </button>
      
      {/* Background music toggle button */}
      <button 
        onClick={toggleBackgroundAudio}
        className="absolute top-6 right-6 z-50 flex items-center justify-center bg-amber-800 text-white p-3 rounded-full shadow-lg hover:bg-amber-900 transition-all hover:scale-105"
        aria-label={isAudioPlaying ? "Pause background music" : "Play background music"}
      >
        {isAudioPlaying ? (
          <Pause size={24} />
        ) : (
          <Music size={24} />
        )}
      </button>
      
      {/* Header */}
      <div className="w-full text-center mb-8 z-10">
        <h1 
          className="text-4xl md:text-6xl font-bold text-stone-800" 
          style={{ 
            fontFamily: "slackey",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          Find Your Mood
        </h1>
        <p className="text-amber-800 mt-2 text-lg">Select a mood to start listening</p>
      </div>
      
      {/* Tooltip for share/favorite actions */}
      {showTooltip && (
        <div className="fixed top-6 right-6 bg-amber-900 text-white py-2 px-4 rounded-md shadow-lg z-50 animate-fadeIn">
          {isFavorite.some(fav => fav) ? "Added to favorites!" : "Link copied to clipboard!"}
        </div>
      )}
      
      {/* Carousel container */}
      <div className="relative w-full max-w-5xl h-96 flex items-center justify-center z-10 perspective-1000">
        {/* Navigation buttons */}
        <button 
          onClick={scrollToPrev}
          className="absolute left-4 md:left-8 z-40 rounded-full p-3 shadow-lg hover:bg-amber-100 transition-all hover:scale-110"
        >
          <ChevronLeft size={32} />
        </button>
        
        <div ref={carouselRef} className="relative w-full h-full flex items-center justify-center">
          {moodCards.map((card, index) => (
            <div
              key={card.id}
              className="absolute cursor-pointer"
              style={{
                ...getCardStyle(index),
                width: '280px', // Larger cards
                height: '340px',
              }}
              onClick={() => handleCardClick(index)}
            >
              <div 
                className={`w-full h-full rounded-xl overflow-hidden shadow-xl flex flex-col ${index === activeIndex ? 'ring-4 ring-amber-500' : ''}`}
                style={{
                  animation: index === activeIndex && isPlaying ? 'pulse 2s infinite' : 'none',
                  background: 'white', // Solid background instead of transparent
                  boxShadow: index === activeIndex ? '0 10px 25px rgba(146, 64, 14, 0.3)' : '0 5px 15px rgba(0,0,0,0.1)'
                }}
              >
                <div className="w-full h-4/5 overflow-hidden relative">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                  
                  {/* Card overlay with actions */}
                  <div className="absolute top-0 right-0 m-3 flex flex-col space-y-3">
                    <button
                      onClick={(e) => toggleFavorite(index, e)}
                      className="bg-white p-2 rounded-full hover:bg-amber-100 transition-all hover:scale-110 shadow-md"
                    >
                      <Heart size={22} fill={isFavorite[index] ? "#ef4444" : "none"} color={isFavorite[index] ? "#ef4444" : "#71717a"} />
                    </button>
                    
                    <button
                      onClick={(e) => handleShare(index, e)}
                      className="bg-white p-2 rounded-full hover:bg-amber-100 transition-all hover:scale-110 shadow-md"
                    >
                      <Share2 size={22} color="#71717a" />
                    </button>
                  </div>
                  
                  {/* Song count badge */}
                  <div 
                    className="music-badge absolute bottom-3 left-3 bg-amber-900 py-2 px-4 rounded-lg text-white text-sm font-medium flex items-center shadow-lg"
                  >
                    <Music size={18} className="mr-2" />
                    <span className="mr-1">{card.songs}</span> 
                    <span>{card.songs === 1 ? 'song' : 'songs'}</span>
                  </div>
                  
                  {/* Play indicator */}
                  {index === activeIndex && isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="flex space-x-2">
                        <div className="w-2 h-12 bg-white animate-bounce" style={{animationDelay: '0s'}}></div>
                        <div className="w-2 h-16 bg-white animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-10 bg-white animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        <div className="w-2 h-14 bg-white animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-8 bg-white animate-bounce" style={{animationDelay: '0.3s'}}></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`w-full h-1/5 flex items-center justify-center ${index === activeIndex ? 'bg-amber-900 text-amber-50' : 'bg-[#E0B980] text-amber-900'}`}
                >
                  <div className="flex items-center justify-center">
                    {index === activeIndex && isPlaying && <Volume2 size={20} className="mr-2 animate-pulse" />}
                    <h3 className="text-xl font-bold">{card.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={scrollToNext}
          className="absolute right-4 md:right-8 z-40 bg-white rounded-full p-3 shadow-lg hover:bg-amber-100 transition-all hover:scale-110"
        >
          <ChevronRight size={36} />
        </button>
      </div>
      
      {/* Indicator dots - Enhanced */}
      <div className="flex justify-center mt-8 space-x-3 z-10">
        {moodCards.map((_, index) => (
          <button
            key={index}
            className={`transition-all rounded-full shadow-md ${
              index === activeIndex 
                ? 'bg-amber-800 w-10 h-3' 
                : 'bg-amber-400 w-3 h-3 hover:bg-amber-600'
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Currently playing info - Enhanced */}
      {isPlaying && (
        <div className="mt-8 py-3 px-6 bg-amber-800 text-white rounded-full shadow-lg animate-fadeIn z-10 flex items-center">
          <Volume2 size={20} className="mr-3 animate-pulse" />
          <span className="font-medium">Now Playing: {moodCards[activeIndex].title}</span>
        </div>
      )}
    </div>
  );
};

export default MoodCarousel;