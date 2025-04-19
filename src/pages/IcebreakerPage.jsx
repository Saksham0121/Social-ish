import { useState } from 'react';

export default function BookPageTurner() {
  const [currentLocation, setCurrentLocation] = useState(1);
  const numOfPapers = 7;
  const maxLocation = numOfPapers + 1;

  const icebreakers = [
    "What’s something you’ve always wanted to learn or try but haven’t yet?",
    "Do you have a favorite hobby or activity that helps you unwind?",
    "What’s one thing on your bucket list you’re excited to check off?",
    "What's a movie you can watch over and over again?",
    "If you could travel anywhere right now, where would you go?",
    "What's a small thing that makes your day better?",
    "If you could live in any time period, past or future, which one would you choose?"
  ];

  const openBook = () => ({
    bookStyle: "translate-x-1/2",
    prevBtnStyle: "-translate-x-[180px]",
    nextBtnStyle: "translate-x-[180px]"
  });

  const closeBook = (isAtBeginning) => ({
    bookStyle: isAtBeginning ? "translate-x-0" : "translate-x-full",
    prevBtnStyle: "translate-x-0",
    nextBtnStyle: "translate-x-0"
  });

  const goNextPage = () => {
    if (currentLocation < maxLocation) {
      setCurrentLocation(currentLocation + 1);
    }
  };

  const goPrevPage = () => {
    if (currentLocation > 1) {
      setCurrentLocation(currentLocation - 1);
    }
  };

  const getStyles = () => {
    if (currentLocation === 1) return { ...closeBook(true), coverVisible: true };
    if (currentLocation === maxLocation) return { ...closeBook(false), backCoverVisible: true };
    return { ...openBook(), coverVisible: false, backCoverVisible: false };
  };

  const styles = getStyles();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 transition-all duration-500 ease-in-out"
        style={{ backgroundImage: "url('src/Assets/bgSocialish.png')" }}
      ></div>
      <div className="relative w-full max-w-4xl h-[600px] flex justify-center items-center">
        {/* Prev Button */}
        <button 
          onClick={goPrevPage}
          className={`absolute left-8 z-50 text-blue-600 border-none cursor-pointer transition-all duration-700 ease-in-out hover:scale-110 ${styles.prevBtnStyle}`}
          disabled={currentLocation === 1}
        >
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Book */}
        <div 
          className={`relative w-[500px] h-[700px] transition-all duration-700 ease-in-out ${styles.bookStyle} shadow-[inset_10px_0_20px_rgba(0,0,0,0.2),0_0_15px_rgba(0,0,0,0.3)] rounded-md`}
        >
          {/* Front Cover */}
          {styles.coverVisible && (
            <div className="absolute w-full h-full z-30">
              <div className="absolute w-full h-full flex items-center justify-center bg-[#fff6db] shadow-2xl border-[8px] border-double border-[#5a3e2b] rounded-md">
                <h1 className="text-5xl font-bold font-slackey text-center text-[#4b2e2b] drop-shadow-lg">
                  Icebreakers
                </h1>
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
                transformOrigin: 'left',
                transform: currentLocation > index + 1 ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                transition: 'transform 1s ease-in-out'
              }}
            >
              {/* Front of the page */}
              <div className="absolute w-full h-full bg-[#fff6db] border-[4px] border-[#3b2f2f] rounded-2xl shadow-md backface-hidden flex items-center justify-center p-8">
                <p className="text-2xl font-serif text-center text-[#4b2e2e]">{question}</p>
              </div>

              {/* Back of the page */}
              <div className="absolute w-full h-full bg-[#fff6db]/70 border-[4px] border-[#3b2f2f] rounded-2xl shadow-inner rotate-y-180 backface-hidden"></div>
            </div>
          ))}

          {/* Back Cover (single page view) */}
          {currentLocation === maxLocation && (
            <div className="absolute w-full h-full z-30">
              <div className="absolute w-full h-full flex items-center justify-center bg-[#fff6db] shadow-2xl border-[8px] border-double border-[#3b2f2f] rounded-3xl">
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button 
          onClick={goNextPage}
          className={`absolute right-8 z-50 text-blue-600 border-none cursor-pointer transition-all duration-700 ease-in-out hover:scale-110 ${styles.nextBtnStyle}`}
          disabled={currentLocation === maxLocation}
        >
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      `}</style>
    </div>
  );
}
