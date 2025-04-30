import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookPageTurner() {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState(1);
  const [isPageTurning, setIsPageTurning] = useState(false);
  const numOfPapers = 7;
  const maxLocation = numOfPapers + 1;
  const [pageSound] = useState(new Audio('/page-flip.mp3'));

  // Handler functions for navigation
  const handleBackToWebsite = () => {
    navigate('/');
  };

  const icebreakers = [
    "What's something you've always wanted to learn or try but haven't yet?",
    "Do you have a favorite hobby or activity that helps you unwind?",
    "What's one thing on your bucket list you're excited to check off?",
    "What's a movie you can watch over and over again?",
    "If you could travel anywhere right now, where would you go?",
    "What's a small thing that makes your day better?",
    "If you could live in any time period, past or future, which one would you choose?"
  ];

  const openBook = () => ({
    bookStyle: "translate-x-1/2",
    prevBtnStyle: "-translate-x-32",
    nextBtnStyle: "translate-x-32"
  });

  const closeBook = (isAtBeginning) => ({
    // Modified this to make the end position centered instead of translate-x-full
    bookStyle: isAtBeginning ? "translate-x-0" : "translate-x-1/5",
    prevBtnStyle: "translate-x-0",
    nextBtnStyle: "translate-x-0"
  });

  const goNextPage = () => {
    if (currentLocation < maxLocation && !isPageTurning) {
      setIsPageTurning(true);
      try {
        pageSound.play();
      } catch (e) {
        console.log("Audio couldn't play");
      }
      setCurrentLocation(currentLocation + 1);
      setTimeout(() => setIsPageTurning(false), 1000);
    }
  };

  const goPrevPage = () => {
    if (currentLocation > 1 && !isPageTurning) {
      setIsPageTurning(true);
      try {
        pageSound.play();
      } catch (e) {
        console.log("Audio couldn't play");
      }
      setCurrentLocation(currentLocation - 1);
      setTimeout(() => setIsPageTurning(false), 1000);
    }
  };

  const getStyles = () => {
    if (currentLocation === 1) return { ...closeBook(true), coverVisible: true };
    if (currentLocation === maxLocation) return { ...closeBook(false), backCoverVisible: true };
    return { ...openBook(), coverVisible: false, backCoverVisible: false };
  };

  const styles = getStyles();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNextPage();
      if (e.key === 'ArrowLeft') goPrevPage();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLocation, isPageTurning]);

  return (
    <div className="flex justify-center items-center h-screen bg-amber-50">
      {/* Wooden table background with texture */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/api/placeholder/1200/800')",
          filter: "brightness(0.9) contrast(1.1)"
        }}
      ></div>
      {/* Back button */}
      <button 
        onClick={handleBackToWebsite}
        className="absolute top-7 left-8 z-50 flex items-center text-stone-800 hover:text-amber-800 transition-colors px-4 py-2 rounded-full hover:bg-amber-100 ">
        <ChevronLeft size={32} className="mr-1" />
      </button>
      
      {/* Ambient lighting effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-amber-950/30"></div>
      
      {/* Book shadow on table - more realistic */}
      <div className="absolute bottom-8 w-96 h-8 bg-black/30 rounded-full blur-md transform-gpu"></div>
      
      <div className="relative w-full max-w-4xl h-[600px] flex justify-center items-center">
        {/* Prev Button */}
        <button 
          onClick={goPrevPage}
          className={`absolute left-8 z-50 text-amber-800 border-none cursor-pointer transition-all duration-700 ease-in-out hover:scale-110 ${styles.prevBtnStyle} ${isPageTurning ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
          disabled={currentLocation === 1 || isPageTurning}
        >
          <svg className="h-12 w-12 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Book */}
        <div 
          className={`relative w-[500px] h-[700px] transition-all duration-700 ease-in-out ${styles.bookStyle} rounded-md perspective-1000 book-shadow`}
        >
          {/* Book thickness/pages edge */}
          <div className="absolute right-0 top-0 w-2 h-full bg-amber-100 z-10 shadow-inner before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-amber-200/20 before:via-amber-100/10 before:to-amber-200/20 page-edge-effect"></div>
          
          {/* Book spine with lighter color to match amber-100 cover */}
          <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-amber-200 to-amber-100 rounded-l-md z-50 flex items-center justify-center">
            <div className="h-3/5 w-1 bg-amber-500 rounded-full"></div>
          </div>
          
          {/* Front Cover - Changed to amber-100 */}
          {styles.coverVisible && (
            <div className="absolute w-full h-full z-30 transform transition-transform duration-300 book-cover">
              <div className="absolute w-full h-full flex flex-col items-center justify-center bg-amber-100 shadow-2xl border-2 border-amber-200 rounded-r-lg rounded-l-sm leather-texture">
                
                <div className="absolute bottom-2 right-2 w-10 h-10 corner-protector-br"></div>
                
                
                {/* Gold embossing effect with decorative border - adjusted for lighter background */}
                <div className="w-4/5 h-2/5 border-4 border-double border-amber-400/40 rounded-md flex items-center justify-center p-4 relative mt-32">
                  <div className="absolute inset-0 m-4 border border-amber-400/20"></div>
                  
                  <h1 className="text-5xl font-bold font-serif text-center text-amber-700 drop-shadow-lg py-4 gold-emboss">
                    Icebreakers
                  </h1>
                  
                  {/* Decorative divider */}
                  <div className="absolute bottom-1/4 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
                </div>
                
                <p className="text-lg text-amber-700/90 mt-8 font-serif italic gold-emboss">Questions to spark conversation</p>
                
                {/* Author line */}
                <p className="absolute bottom-16 text-sm text-amber-700/70 font-serif italic gold-emboss">Compiled with care</p>
                
                {/* Decorative bottom flourish */}
                <div className="absolute bottom-8 w-32 h-8 flex items-center justify-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
                  <div className="absolute w-8 h-1 bg-amber-400/30"></div>
                  <div className="absolute w-4 h-4 rounded-full border border-amber-400/30 bg-gradient-to-br from-amber-300/20 to-amber-400/20"></div>
                </div>
                
              </div>
            </div>
          )}

          {/* Pages */}
          {currentLocation < maxLocation && icebreakers.map((question, index) => (
            <div
              key={index}
              className="absolute w-full h-full"
              style={{
                zIndex: currentLocation <= index + 1 ? numOfPapers - index : index + 1,
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                transform: currentLocation > index + 1 ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                transition: isPageTurning ? 'transform 1.2s cubic-bezier(0.3, 0.1, 0.2, 1)' : 'transform 1.2s cubic-bezier(0.3, 0.1, 0.2, 1)'
              }}
            >
              {/* Front of the page - with realistic paper texture and slight curvature */}
              <div className="absolute w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-r-lg shadow-md backface-hidden flex flex-col items-center justify-center p-12 page-front">
                {/* Decorative book page elements */}
                <div className="w-full h-1 border-b border-amber-200/70 mb-12"></div>
                
                {/* Question with decorative quotes */}
                <div className="relative p-8 w-full flex-grow flex items-center justify-center">
                  {/* Top left quote mark */}
                  <div className="absolute top-0 left-0 text-6xl text-amber-300/40 font-serif leading-none">"</div>
                  
                  <p className="text-2xl font-serif text-center text-amber-900 leading-relaxed px-8 py-4 relative z-10">
                    {question}
                  </p>
                  
                  {/* Bottom right quote mark */}
                  <div className="absolute bottom-0 right-0 text-6xl text-amber-300/40 font-serif leading-none">"</div>
                </div>
                
                <div className="w-full h-1 border-b border-amber-200/70 mt-12"></div>
                
                {/* Realistic paper texture */}
                <div className="absolute inset-0 opacity-10 bg-repeat z-0 paper-texture"></div>
                
                {/* Page curl hint on hover */}
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-amber-200/20 to-transparent rounded-tl-lg page-curl-hint"></div>
              </div>

              {/* Back of the page - slightly different texture */}
              <div className="absolute w-full h-full bg-gradient-to-br from-amber-100/90 to-amber-50/90 rounded-r-lg shadow-inner rotate-y-180 backface-hidden page-back">
                {/* Subtle paper texture with more grain */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-amber-100/80"></div>
                
                {/* Light age spots/foxing effect */}
                <div className="absolute inset-0 opacity-5 foxing-effect"></div>
                
                {/* Page curl shadow */}
                <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-amber-200/30 to-transparent"></div>
              </div>
            </div>
          ))}

          {/* Back Cover - also changed to match front cover */}
          {styles.backCoverVisible && (
            <div className="absolute w-full h-full z-30 book-back-cover">
              <div className="absolute w-full h-full flex items-center justify-center bg-amber-100 shadow-2xl border-2 border-amber-200 rounded-r-lg rounded-l-sm leather-texture">
                <div className="w-24 h-24 rounded-full bg-amber-300/20 flex items-center justify-center border-2 border-amber-400/30 gold-emboss">
                  <span className="font-serif text-amber-700/90 text-lg">End</span>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute bottom-8 w-1/2 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button 
          onClick={goNextPage}
          className={`absolute right-8 z-50 text-amber-800 border-none cursor-pointer transition-all duration-700 ease-in-out hover:scale-110 ${styles.nextBtnStyle} ${isPageTurning ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
          disabled={currentLocation === maxLocation || isPageTurning}
        >
          <svg className="h-12 w-12 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Tailwind Custom */}
      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .book-shadow {
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5), 
                      0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .gold-emboss {
          text-shadow: 0 1px 1px rgba(0,0,0,0.2),
                      0 -1px 1px rgba(255,255,255,0.1);
        }
        .leather-texture {
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          box-shadow: inset 0 0 100px rgba(0,0,0,0.1);
        }
        .page-edge-effect {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
        }
        .paper-texture {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E");
        }
        .foxing-effect {
          background-image: radial-gradient(circle at 10% 20%, rgba(130, 80, 0, 0.1) 1px, transparent 1px),
                           radial-gradient(circle at 80% 40%, rgba(130, 80, 0, 0.1) 1px, transparent 1px),
                           radial-gradient(circle at 30% 70%, rgba(130, 80, 0, 0.1) 2px, transparent 2px),
                           radial-gradient(circle at 60% 90%, rgba(130, 80, 0, 0.1) 1px, transparent 1px);
          background-size: 100% 100%;
        }
        .page-front, .page-back {
          border-radius: 0 2px 2px 0;
          box-shadow: inset 0 0 30px rgba(0,0,0,0.03);
        }
        .page-curl-hint {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .page-front:hover .page-curl-hint {
          opacity: 1;
        }
        .corner-protector-tl {
          background-image: linear-gradient(135deg, rgba(215, 180, 100, 0.4) 0%, transparent 50%);
          border-top-left-radius: 4px;
          box-shadow: inset 1px 1px 0 rgba(255, 215, 0, 0.2);
        }
        .corner-protector-tr {
          background-image: linear-gradient(225deg, rgba(215, 180, 100, 0.4) 0%, transparent 50%);
          border-top-right-radius: 4px;
          box-shadow: inset -1px 1px 0 rgba(255, 215, 0, 0.2);
        }
        .corner-protector-bl {
          background-image: linear-gradient(45deg, rgba(215, 180, 100, 0.4) 0%, transparent 50%);
          border-bottom-left-radius: 4px;
          box-shadow: inset 1px -1px 0 rgba(255, 215, 0, 0.2);
        }
        .corner-protector-br {
          background-image: linear-gradient(315deg, rgba(215, 180, 100, 0.4) 0%, transparent 50%);
          border-bottom-right-radius: 4px;
          box-shadow: inset -1px -1px 0 rgba(255, 215, 0, 0.2);
        }
        .medallion-effect {
          box-shadow: inset 0 0 10px rgba(0,0,0,0.3),
                      0 0 10px rgba(255,215,0,0.1);
        }
        .weathered-overlay {
          background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}