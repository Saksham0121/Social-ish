import React from 'react';
import Navbar from '../components/Navbar';
import FeaturesGrid from '../components/FeatureCard';
import Chatbot from '../components/Chatbot';

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col bg-[#E2D6C3] relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          backgroundImage: "url('src/Assets/homepage_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

      <Navbar />
      <div className="flex">
        <div className="w-1/2 p-12 flex items-center">
          <div>
            <h1 className="font-darumadrop text-7xl -translate-y-20 font-bold mb-6 text-[#3A220E]">
              Just The Right Amount of Social.
            </h1>
            <p className="text-xl text-brown -translate-y-20 mb-8">
              Connect, play, and explore in a comfortable, engaging way.
            </p>
            
          </div>
        </div>
        <div className="w-1/2">
          <FeaturesGrid />
        </div>
      </div>
      <Chatbot />
    </div>
      </div>
  );
};

export default HomePage;