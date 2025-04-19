import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function AboutUs() {
  
  const navigate = useNavigate();
  
  // Handler functions for navigation
  const handleBackToWebsite = () => {
    navigate('/');
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 p-4 text-center">
      
      {/* Back button */}
      <button 
        onClick={handleBackToWebsite}
        className="absolute top-6 left-6 z-50 flex items-center text-stone-800 hover:text-amber-800 transition-colors px-4 py-2 rounded-full hover:bg-amber-100">
        <ChevronLeft size={32} className="mr-1" />
      </button>
      <div className="max-w-4xl mx-auto">
        {/* Header with horizontal lines */}
        <div className="flex items-center justify-center my-6">
          <div className="border-t border-amber-700 flex-grow"></div>
          <h1 className="mx-4 text-5xl font-bold font-slackey text-{#593e25} tracking-wide px-2">SOCIAL-ISH</h1>
          <div className="border-t border-amber-700 flex-grow"></div>
        </div>
        
        {/* Tagline */}
        <h2 className="text-2xl font-slackey font-semibold text-amber-900 mb-8 tracking-wide">Just The Right Amount Of Social</h2>
        
        {/* Main content */}
        <div className="text-xl text-amber-800 leading-relaxed max-w-3xl mx-auto">
          <p className="mb-6">
            We Created This Platform With A Simple Mission: To Make
            Socializing Easier And More Comfortable For Introverts.
            Large Gatherings And Traditional Social Spaces Can Feel
            Overwhelming, So We Built A Space Where Connections
            Happen Naturally And At Your Own Pace.
          </p>
          <p className="mb-6">
            Here, You Can Meet Like-Minded Individuals, Play Relaxing Games To
            Ease Social Anxiety, And Even Chat With Our Supportive AI
            Companion.
          </p>
          <p className="mb-6">
            Whether You're Looking For Deep Conversations Or Just A Quiet Space To Be Yourself, Our
            Community Is Designed To Help You Feel At Home.
          </p>
        </div>
      </div>
    </div>
  );
}