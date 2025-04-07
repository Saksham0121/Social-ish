import { useEffect, useState } from 'react';
import cloudicon from '../Assets/cloudicon.png';


export default function MovingCloudsBackground({ cloudImageUrl = cloudicon }) {
  const [clouds, setClouds] = useState([]);
  
  useEffect(() => {
    // Generate initial clouds with random positions
    const initialClouds = Array.from({ length: 6 }, (_, index) => ({
      id: index,
      top: `${Math.random() * 40}%`,
      left: `${Math.random() * 100}%`,
      scale: 0.5 + Math.random() * 0.5,
      speed: 20 + Math.random() * 30, // Seconds to cross the screen
      delay: Math.random() * 5, // Random delay for varied movement
      rotation: Math.random() * 10 - 5, // Small random rotation
    }));
    
    setClouds(initialClouds);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen overflow-hidden  bg-amber-100" style={{ zIndex: -10 }}>
      {/* Clouds */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute"
          style={{
            top: cloud.top,
            left: cloud.left,
            transform: `scale(${cloud.scale}) rotate(${cloud.rotation}deg)`,
            animation: `moveCloud ${cloud.speed}s linear ${cloud.delay}s infinite`,
          }}
        >
          <CustomCloud imageUrl={cloudImageUrl} />
        </div>
      ))}
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes moveCloud {
          0% {
            transform: translateX(-100%) scale(${clouds.length > 0 ? clouds[0].scale : 1}) rotate(${clouds.length > 0 ? clouds[0].rotation : 0}deg);
          }
          100% {
            transform: translateX(100vw) scale(${clouds.length > 0 ? clouds[0].scale : 1}) rotate(${clouds.length > 0 ? clouds[0].rotation : 0}deg);
          }
        }
      `}</style>
    </div>
  );
}

// Custom Cloud component that uses an image
function CustomCloud({ imageUrl }) {
  // For demo purposes, using a placeholder
  // In a real app, you would use the imageUrl prop
  return (
    <div style={{ width: '500px', height: '300px' }}>
      {/* Real usage would be: */}
      {/* <img src={imageUrl} alt="Cloud" className="w-full h-full object-contain" /> */}
      
      {/* For demo with placeholder: */}
      <img src={cloudicon} alt="Cloud" className="w-full h-full object-contain" />
    </div>
  );
}