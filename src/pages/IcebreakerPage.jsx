import React, { useState, useEffect, useRef } from 'react';
import {  AnimatePresence } from 'framer-motion';

const icebreakers = [
  {
    question: "What's Your Go-To Comfort Food?",
    id: 1,
    decoration: "food"
  },
  {
    question: "If You Could Travel Anywhere Tomorrow, Where Would You Go?",
    id: 2,
    decoration: "travel"
  },
  {
    question: "What's The Best Book You've Read Recently?",
    id: 3,
    decoration: "book"
  },
  {
    question: "Do You Have Any Unusual Talents?",
    id: 4,
    decoration: "talent"
  },
  {
    question: "What's Your Favorite Way To Spend A Rainy Day?",
    id: 5,
    decoration: "rainy"
  },
  {
    question: "If You Could Have Dinner With Anyone, Who Would It Be?",
    id: 6,
    decoration: "dinner"
  }
];

// Decorative SVG elements for each icebreaker type
const DecorationIcon = ({ type }) => {
  switch (type) {
    case "food":
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-15">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#8B4513" strokeWidth="1" />
          <path d="M30,45 Q50,25 70,45 Q75,65 50,70 Q25,65 30,45 Z" fill="none" stroke="#8B4513" strokeWidth="0.8" />
          <path d="M50,30 L50,40 M40,35 L60,35" stroke="#8B4513" strokeWidth="0.8" />
        </svg>
      );
    case "travel":
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-15">
          <path d="M20,70 L80,70" stroke="#8B4513" strokeWidth="1" />
          <path d="M30,70 L30,50 L60,50 L60,70" fill="none" stroke="#8B4513" strokeWidth="0.8" />
          <path d="M35,50 L35,40 L55,40 L55,50" fill="none" stroke="#8B4513" strokeWidth="0.8" />
          <circle cx="45" cy="60" r="3" fill="#8B4513" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-15">
          <path d="M30,30 L30,70 L70,70 L70,30 Z" fill="none" stroke="#8B4513" strokeWidth="0.8" />
          <path d="M50,30 L50,70" stroke="#8B4513" strokeWidth="0.8" />
          <path d="M35,40 L45,40 M35,50 L45,50 M35,60 L45,60" stroke="#8B4513" strokeWidth="0.8" />
        </svg>
      );
    case "talent":
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-15">
          <path d="M35,65 C35,40 65,40 65,65" fill="none" stroke="#8B4513" strokeWidth="0.8" />
          <circle cx="50" cy="35" r="10" fill="none" stroke="#8B4513" strokeWidth="0.8" />
          <path d="M30,75 L70,75" stroke="#8B4513" strokeWidth="0.8" />
        </svg>
      );
    case "rainy":
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-15">
          <path d="M30,40 Q50,20 70,40 Q80,50 70,60 Q50,70 30,60 Q20,50 30,40 Z" fill="none" stroke="#8B4513" strokeWidth="0.8" />
          <path d="M35,65 L35,75 M45,70 L45,80 M55,70 L55,80 M65,65 L65,75" stroke="#8B4513" strokeWidth="0.8" />
        </svg>
      );
    case "dinner":
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-15">
          <circle cx="50" cy="50" r="25" fill="none" stroke="#8B4513" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="#8B4513" strokeWidth="0.8" />
          <path d="M35,35 L65,65 M35,65 L65,35" stroke="#8B4513" strokeWidth="0.8" />
        </svg>
      );
    default:
      return null;
  }
};

// Animated fingerprint for page corners
const PageCorner = ({ position }) => {
  const posClasses = {
    "top-left": "top-0 left-0 rotate-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
    "bottom-left": "bottom-0 left-0 rotate-270"
  };
  
  return (
    <div className={`absolute w-16 h-16 ${posClasses[position]}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-10">
        <path d="M0,0 L100,0 L100,100 Z" fill="#8B4513" />
        <path d="M10,0 C15,20 30,30 50,25 C70,20 80,10 90,0" fill="none" stroke="#8B4513" strokeWidth="0.5" strokeDasharray="2,1" />
      </svg>
    </div>
  );
};

const IcebreakersBook = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const bookRef = useRef(null);
  
  // Handle next page
  const nextPage = () => {
    if (currentPage < icebreakers.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setDirection('right');
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Handle previous page
  const prevPage = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setDirection('left');
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Reset animation flag after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 700);
    
    return () => clearTimeout(timer);
  }, [currentPage]);
  
  // Add subtle tilt effect on book hover
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!bookRef.current || isAnimating) return;
      
      const book = bookRef.current;
      const rect = book.getBoundingClientRect();
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = ((y - centerY) / centerY) * 2; // Max 2 degree tilt
      const tiltY = ((x - centerX) / centerX) * -2; // Max 2 degree tilt
      
      book.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };
    
    const handleMouseLeave = () => {
      if (!bookRef.current) return;
      bookRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      setIsHovering(false);
    };
    
    const handleMouseEnter = () => {
      setIsHovering(true);
    };
    
    const book = bookRef.current;
    if (book) {
      book.addEventListener('mousemove', handleMouseMove);
      book.addEventListener('mouseleave', handleMouseLeave);
      book.addEventListener('mouseenter', handleMouseEnter);
    }
    
    return () => {
      if (book) {
        book.removeEventListener('mousemove', handleMouseMove);
        book.removeEventListener('mouseleave', handleMouseLeave);
        book.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, [isAnimating]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
         style={{
           background: 'radial-gradient(circle at center, #fff8e8 0%, #f5e9c9 100%)'
         }}>
      {/* Vintage paper texture overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] opacity-30"></div>
      
      {/* Decorative ink splatters */}
      <div className="absolute top-12 left-12 opacity-5">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <path d="M20,100 C20,60 60,20 100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 Z" fill="none" stroke="#8B4513" strokeWidth="0.5" />
          <path d="M40,100 C40,70 70,40 100,40 C130,40 160,70 160,100 C160,130 130,160 100,160 C70,160 40,130 40,100 Z" fill="none" stroke="#8B4513" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="5" fill="#8B4513" opacity="0.5" />
          <circle cx="120" cy="80" r="3" fill="#8B4513" opacity="0.3" />
          <circle cx="80" cy="120" r="3" fill="#8B4513" opacity="0.3" />
          <circle cx="70" cy="70" r="2" fill="#8B4513" opacity="0.2" />
          <circle cx="130" cy="130" r="2" fill="#8B4513" opacity="0.2" />
        </svg>
      </div>
      
      <div className="absolute bottom-12 right-12 opacity-5">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <path d="M20,100 C20,60 60,20 100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 Z" fill="none" stroke="#8B4513" strokeWidth="0.5" />
          <path d="M40,100 C40,70 70,40 100,40 C130,40 160,70 160,100 C160,130 130,160 100,160 C70,160 40,130 40,100 Z" fill="none" stroke="#8B4513" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="5" fill="#8B4513" opacity="0.5" />
          <circle cx="120" cy="80" r="3" fill="#8B4513" opacity="0.3" />
          <circle cx="80" cy="120" r="3" fill="#8B4513" opacity="0.3" />
          <circle cx="70" cy="70" r="2" fill="#8B4513" opacity="0.2" />
          <circle cx="130" cy="130" r="2" fill="#8B4513" opacity="0.2" />
        </svg>
      </div>
      
      {/* Background swirl patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path d="M0,500 C200,300 300,100 500,100 C700,100 800,300 1000,500 C800,700 700,900 500,900 C300,900 200,700 0,500 Z" 
                  fill="none" 
                  stroke="#8B4513" 
                  strokeWidth="1" 
                  opacity="0.2" />
            <path d="M0,500 C150,400 250,200 500,200 C750,200 850,400 1000,500 C850,600 750,800 500,800 C250,800 150,600 0,500 Z" 
                  fill="none" 
                  stroke="#8B4513" 
                  strokeWidth="1" 
                  opacity="0.2" />
            <path d="M100,500 C250,350 350,150 500,150 C650,150 750,350 900,500 C750,650 650,850 500,850 C350,850 250,650 100,500 Z" 
                  fill="none" 
                  stroke="#8B4513" 
                  strokeWidth="1" 
                  opacity="0.2" />
          </svg>
        </div>
      </div>
      
      {/* Header with logo */}
      <div className="w-full max-w-4xl px-6 py-4 flex items-center z-10">
        <button 
          onClick={() => {}} 
          className="text-brown-900 hover:text-brown-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        {/* Title with decorative elements */}
        <div className="relative mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-brown-900 font-slackey tracking-wider" 
              style={{ textShadow: '1px 1px 3px rgba(139, 69, 19, 0.3)' }}>
            Icebreakers
          </h1>
          
          {/* Decorative underline */}
          <div className="w-full h-1 mt-1 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-800 to-transparent opacity-20"></div>
          </div>
        </div>
      </div>
      
      {/* Subtitle */}
      <h2 className="text-xl text-brown-800 font-medium mb-8 italic z-10">
        Something To Keep Your Conversations Going.
      </h2>
      
      {/* Book container with 3D effect */}
      <div
        ref={bookRef}
        className="relative w-full max-w-2xl aspect-[4/3] rounded-lg overflow-hidden z-10
                 transition-all duration-500 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          boxShadow: isHovering
            ? '0 30px 60px -15px rgba(0,0,0,0.4), 0 10px 20px -10px rgba(0,0,0,0.3)'
            : '0 25px 50px -12px rgba(0,0,0,0.25), 0 8px 16px -8px rgba(0,0,0,0.2)'
        }}
      >
        {/* Book background with gradient and leather texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-900 opacity-80">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30"></div>
        </div>
        
        {/* Book cover edges - vintage leather look */}
        <div className="absolute inset-0 border-8 border-amber-800 rounded-lg opacity-30"></div>
        <div className="absolute inset-2 border-4 border-amber-700 rounded-lg opacity-20"></div>
        
        {/* Gold foil effects */}
        <div className="absolute inset-x-12 top-4 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
        <div className="absolute inset-x-12 bottom-4 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
        <div className="absolute inset-y-12 left-4 w-px bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-50"></div>
        <div className="absolute inset-y-12 right-4 w-px bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-50"></div>
        
        {/* Book inner area */}
        <div className="absolute inset-8 bg-amber-100 rounded-sm overflow-hidden">
          {/* Book spine and binding */}
          <div className="absolute left-1/2 top-0 h-full w-8 bg-gradient-to-r from-amber-900 to-amber-800 transform -translate-x-1/2 z-10"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-300 to-transparent transform -translate-x-1/2 z-20"></div>
          
          {/* Stitching details */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="w-6 h-1 my-4 bg-amber-200 opacity-60 rounded-full" 
                style={{ 
                  marginTop: `${i * 30 + 20}px`,
                  boxShadow: '0 0 3px rgba(255, 225, 125, 0.5)'
                }}
              ></div>
            ))}
          </div>
          
          {/* Left and right pages */}
          <div className="absolute inset-0 flex">
            {/* Pages with animation */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                custom={direction}
                initial={direction === 'right' ? 
                  { rotateY: 90, x: '50%', transformOrigin: 'left center', boxShadow: '-10px 0 15px rgba(0,0,0,0.2)' } : 
                  { rotateY: -90, x: '-50%', transformOrigin: 'right center', boxShadow: '10px 0 15px rgba(0,0,0,0.2)' }
                }
                animate={{ 
                  rotateY: 0, 
                  x: 0,
                  boxShadow: '0 0 0 rgba(0,0,0,0)'
                }}
                exit={direction === 'right' ? 
                  { rotateY: -90, x: '-50%', transformOrigin: 'right center', boxShadow: '10px 0 15px rgba(0,0,0,0.2)' } : 
                  { rotateY: 90, x: '50%', transformOrigin: 'left center', boxShadow: '-10px 0 15px rgba(0,0,0,0.2)' }
                }
                transition={{ 
                  type: 'tween', 
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier curve for a more natural page turn
                }}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
                className="absolute inset-0 flex"
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* Book pages */}
                <div className="w-1/2 h-full p-6 flex items-center justify-center bg-gradient-to-r from-amber-100 to-amber-50">
                  <div className="w-full h-full border-r border-amber-200 relative flex items-center justify-center">
                    {/* Decorative page corners */}
                    <PageCorner position="top-left" />
                    <PageCorner position="bottom-left" />
                    
                    {/* Page number */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-amber-800 opacity-30 font-serif italic">
                      {currentPage * 2 + 1}
                    </div>
                    
                    {/* Left page content - vintage illustration */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <DecorationIcon type={icebreakers[currentPage].decoration} />
                      
                      {/* Decorative divider */}
                      <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-800 to-transparent opacity-20"></div>
                      
                      {/* Small explanatory text */}
                      <p className="text-xs text-center font-serif italic text-amber-800 opacity-50 max-w-xs">
                        Great conversations often start with simple questions.
                        This question might reveal someone's personality and values.
                      </p>
                    </div>
                    
                    {/* Page styling lines */}
                    <div className="absolute bottom-12 right-4 w-16 h-16">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="absolute bottom-0 right-0 w-full h-px bg-amber-800 opacity-10 transform -rotate-45 origin-bottom-right translate-y-4" 
                             style={{ top: `${i * 3}px` }}></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-1/2 h-full p-6 flex items-center justify-center bg-gradient-to-l from-amber-100 to-amber-50">
                  <div className="w-full h-full flex flex-col items-center justify-center text-center relative">
                    {/* Decorative page corners */}
                    <PageCorner position="top-right" />
                    <PageCorner position="bottom-right" />
                    
                    {/* Page number */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-amber-800 opacity-30 font-serif italic">
                      {currentPage * 2 + 2}
                    </div>
                    
                    {/* Decorative frame around question */}
                    <div className="absolute inset-8 border border-amber-800 opacity-10 rounded-sm"></div>
                    <div className="absolute inset-10 border border-amber-800 opacity-5 rounded-sm"></div>
                    
                    {/* Decorative corners for frame */}
                    {['top-left', 'top-right', 'bottom-right', 'bottom-left'].map(corner => {
                      const [vertical, horizontal] = corner.split('-');
                      return (
                        <div 
                          key={corner} 
                          className={`absolute w-3 h-3 border-amber-800 opacity-20
                                     ${vertical === 'top' ? 'top-8' : 'bottom-8'} 
                                     ${horizontal === 'left' ? 'left-8' : 'right-8'}`}
                          style={{
                            borderTop: vertical === 'top' ? '1px solid' : 'none',
                            borderBottom: vertical === 'bottom' ? '1px solid' : 'none',
                            borderLeft: horizontal === 'left' ? '1px solid' : 'none',
                            borderRight: horizontal === 'right' ? '1px solid' : 'none'
                          }}
                        />
                      );
                    })}
                    
                    {/* Question text with vintage styling */}
                    <div className="relative">
                      {/* Decorative quotation marks */}
                      <div className="absolute -top-6 -left-6 text-3xl font-serif text-amber-800 opacity-15">❝</div>
                      <div className="absolute -bottom-6 -right-6 text-3xl font-serif text-amber-800 opacity-15">❞</div>
                      
                      <h3 className="text-2xl md:text-3xl font-serif text-brown-800 leading-tight px-8"
                          style={{ textShadow: '1px 1px 1px rgba(139, 69, 19, 0.1)' }}>
                        {icebreakers[currentPage].question}
                      </h3>
                    </div>
                    
                    {/* Page styling lines */}
                    <div className="absolute bottom-12 left-4 w-16 h-16">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="absolute bottom-0 left-0 w-full h-px bg-amber-800 opacity-10 transform rotate-45 origin-bottom-left translate-y-4" 
                             style={{ top: `${i * 3}px` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <button 
          onClick={prevPage}
          disabled={currentPage === 0 || isAnimating}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full
                     bg-gradient-to-br from-amber-50 to-amber-100 shadow-md border border-amber-200
                     transition-all duration-300
                     ${currentPage === 0 || isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:from-amber-100 hover:to-amber-200 hover:shadow-lg'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextPage}
          disabled={currentPage === icebreakers.length - 1 || isAnimating}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full
                     bg-gradient-to-br from-amber-50 to-amber-100 shadow-md border border-amber-200
                     transition-all duration-300
                     ${currentPage === icebreakers.length - 1 || isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:from-amber-100 hover:to-amber-200 hover:shadow-lg'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Bookmark ribbon */}
        <div className="absolute top-0 right-1/3 w-8 h-28 bg-red-700 z-20 rounded-b-lg shadow-md transform rotate-6 origin-top-center">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800"></div>
          <div className="absolute inset-x-0 bottom-0 h-2 bg-red-900 opacity-30 rounded-b-lg"></div>
        </div>
      </div>
      
      {/* Page indicator */}
      <div className="mt-6 flex space-x-4 z-10">
        {icebreakers.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setDirection(index > currentPage ? 'right' : 'left');
                setCurrentPage(index);
              }
            }}
            disabled={isAnimating}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentPage === index 
              ? 'bg-amber-800 scale-125 shadow-sm' 
              : 'bg-amber-400 bg-opacity-30 hover:bg-amber-500 hover:bg-opacity-40'} ${isAnimating ? 'cursor-not-allowed' : ''}`}
          />
        ))}
      </div>
      
      {/* Instruction text */}
      <p className="mt-4 text-sm text-amber-800 opacity-70 italic z-10">
        Click the arrows to turn pages or use the dots below to navigate directly
      </p>
    </div>
  );
};

export default IcebreakersBook;