import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { 
    image: "src/Assets/Interests_card.png", 
    position: 'left-[1%] top-[37%]',
    zIndex: 'z-30',
    width: 'w-64',
    height: 'h-68',
    route: '/interests'
  },
  { 
    image: "src/Assets/Games_card.png", 
    position: 'left-[32%] top-[28%]',
    zIndex: 'z-40',
    width: 'w-76',
    height: 'h-52',
    route: '/games'
  },
  { 
    image: "src/Assets/Music_card.png", 
    position: 'right-[9%] top-[26%]',
    zIndex: 'z-50',
    width: 'w-80',
    height: 'h-100',
    route: '/mood'
  },
  { 
    image: "src/Assets/Findpeople_card.png", 
    position: 'left-[25%] top-[51%]',
    zIndex: 'z-40',
    width: 'w-68',
    height: 'h-64',
    route: '/findpeople'
  },
  { 
    image: "src/Assets/Icebreakers_card.png", 
    position: 'right-[19%] top-[4%]',
    zIndex: 'z-60',
    width: 'w-84',
    height: 'h-60',
    route: '/icebreakers'
  },
  { 
    image: "src/Assets/Calzone_card.png", 
    position: 'left-[9%] top-[8%]',
    zIndex: 'z-10',
    width: 'w-80',
    height: 'h-68',
    route: '/calmzone'
  }
];

const FeatureCard = ({ image, title, position, zIndex, width, height, isHovered, onHover, onLeave, route }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`absolute flex flex-col items-center justify-start  transition-all duration-300 ease-in-out cursor-pointer ${zIndex} ${position} ${width} ${height} ${
        isHovered ? '-translate-y-8 scale-105' : ''
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={() => navigate(route)}
    >
      <h2 className="text-lg font-bold text-black mb-2 text-center">{title}</h2>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

const FeaturesGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          {...feature}
          isHovered={hoveredIndex === index}
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
        />
      ))}
    </div>
  );
};

export default FeaturesGrid;