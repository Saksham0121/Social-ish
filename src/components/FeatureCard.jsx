import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { 
    image: "src/Assets/Interests_card.png", 
    title: 'Interests',
    position: 'left-[4%] top-[37%]',
    zIndex: 'z-30',
    width: 'w-64',
    height: 'h-68',
    route: '/interests'
  },
  { 
    image: "src/Assets/Games_card.png", 
    title: 'Games',
    position: 'left-[29%] top-[30%]',
    zIndex: 'z-40',
    width: 'w-76',
    height: 'h-52',
    route: '/games'
  },
  { 
    image: "src/Assets/Music_card.png", 
    title: 'Music',
    position: 'right-[12%] top-[27%]',
    zIndex: 'z-50',
    width: 'w-80',
    height: 'h-100',
    route: '/mood'
  },
  { 
    image: "src/Assets/Findpeople_card.png", 
    title: 'Find People',
    position: 'left-[25%] top-[58%]',
    zIndex: 'z-40',
    width: 'w-68',
    height: 'h-64',
    route: '/findpeople'
  },
  { 
    image: "src/Assets/Icebreakers_card.png", 
    title: 'Icebreakers',
    position: 'right-[23%] top-[4%]',
    zIndex: 'z-60',
    width: 'w-84',
    height: 'h-60',
    route: '/icebreakers'
  },
  { 
    image: "src/Assets/Calzone_card.png", 
    title: 'Calm Zone',
    position: 'left-[9%] top-[10%]',
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