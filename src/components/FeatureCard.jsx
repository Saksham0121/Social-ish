import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { 
    image: "src/Assets/Interests_card.png", 
    title: 'Interests',
    position: 'left-[0%] top-[40%]',
    zIndex: 'z-30',
    width: 'w-64',
    height: 'h-68',
    route: '/interests'
  },
  { 
    image: "src/Assets/Games_card.png", 
    title: 'Games',
    position: 'left-[30%] top-[30%]',
    zIndex: 'z-40',
    width: 'w-72',
    height: 'h-52',
    route: '/games'
  },
  { 
    image: "src/Assets/Music_card.png", 
    title: 'Music',
    position: 'right-[3%] top-[25%]',
    zIndex: 'z-50',
    width: 'w-80',
    height: 'h-100',
    route: '/music'
  },
  { 
    image: "src/Assets/Findpeople_card.png", 
    title: 'Meet People',
    position: 'left-[25%] top-[56%]',
    zIndex: 'z-40',
    width: 'w-68',
    height: 'h-64',
    route: '/meetpeople'
  },
  { 
    image: "src/Assets/Icebreakers_card.png", 
    title: 'Icebreakers',
    position: 'right-[15%] top-[4%]',
    zIndex: 'z-60',
    width: 'w-84',
    height: 'h-60',
    route: '/icebreakers'
  },
  { 
    image: "src/Assets/Calzone_card.png", 
    title: 'Calm Zone',
    position: 'left-[5%] top-[10%]',
    zIndex: 'z-10',
    width: 'w-80',
    height: 'h-68',
    route: '/calmzone'
  }
];

const FeatureCard = ({ image, title, position, zIndex, width, height, isHovered, onHover, onLeave, route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <div 
      className={`
        absolute ${position} ${zIndex}
        transition-all duration-300 ease-in-out
        ${isHovered ? '-translate-y-8' : ''}
        cursor-pointer
        ${width} ${height}
      `}
      style={{
        transformOrigin: 'center'
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
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
    <div className=" relative w-full h-screen overflow-hidden">
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