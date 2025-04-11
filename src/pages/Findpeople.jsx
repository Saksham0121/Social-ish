import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, UserPlus, MessageCircle, Award } from 'lucide-react';

export default function BluetoothSimulation() {
  const [scanning, setScanning] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [orbitingUsers, setOrbitingUsers] = useState([]);
  const orbitRef = useRef(null);
  const animationRef = useRef(null);
  const framesRef = useRef(0);
  
  // Mock users data
  const mockUsers = [
    {
      id: 1,
      name: "ABCGDYE",
      distance: "5m away",
      matchRate: 85,
      avatar: "/api/placeholder/50/50",
      interests: ["Photography", "Hiking", "Jazz"],
      position: { x: 0, y: 0 },
      radius: 120,
      speed: 0.0005,
      angle: Math.random() * Math.PI * 2
    },
    {
      id: 2,
      name: "BCDUICI",
      distance: "12m away",
      matchRate: 70,
      avatar: "/api/placeholder/50/50",
      interests: ["Gaming", "Movies", "Food"],
      position: { x: 0, y: 0 },
      radius: 160,
      speed: 0.0007,
      angle: Math.random() * Math.PI * 2
    },
    {
      id: 3,
      name: "JVIVNDKI",
      distance: "8m away",
      matchRate: 92,
      avatar: "/api/placeholder/50/50",
      interests: ["Reading", "Tech", "Coffee"],
      position: { x: 0, y: 0 },
      radius: 180,
      speed: 0.0003,
      angle: Math.random() * Math.PI * 2
    },
    {
      id: 4,
      name: "Q5RF21",
      distance: "15m away",
      matchRate: 78,
      avatar: "/api/placeholder/50/50",
      interests: ["Swimming", "Art", "Travel"],
      position: { x: 0, y: 0 },
      radius: 140,
      speed: 0.0006,
      angle: Math.random() * Math.PI * 2
    },
    {
      id: 5,
      name: "ZXC432",
      distance: "7m away",
      matchRate: 65,
      avatar: "/api/placeholder/50/50",
      interests: ["Cooking", "Music", "Biking"],
      position: { x: 0, y: 0 },
      radius: 200,
      speed: 0.0004,
      angle: Math.random() * Math.PI * 2
    }
  ];

  // Start scanning and add users one by one
  const startScanning = () => {
    setScanning(true);
    setOrbitingUsers([]);
    setNearbyUsers([]);
    
    // Add users one by one with delays
    mockUsers.forEach((user, index) => {
      setTimeout(() => {
        setOrbitingUsers(prev => [...prev, user]);
        
        // Add all users to the nearby list over time
        setTimeout(() => {
          setNearbyUsers(prev => [...prev, user]);
        }, 1000); // Delay before showing in the nearby list
        
        // Stop scanning after all users are added
        if (index === mockUsers.length - 1) {
          setTimeout(() => setScanning(false), 1000);
        }
      }, index * 2000); // Add a new user every 2 seconds
    });
  };

  // Orbit animation
  useEffect(() => {
    const animate = () => {
      if (!orbitRef.current) return;
      
      const userElements = orbitRef.current.querySelectorAll('.user-orbit');
      
      userElements.forEach((el, i) => {
        if (i < orbitingUsers.length) {
          const user = orbitingUsers[i];
          user.angle += user.speed;
          
          // Calculate orbital positions
          const x = Math.cos(user.angle) * user.radius;
          const y = Math.sin(user.angle) * user.radius;
          
          el.style.transform = `translate(${x}px, ${y}px)`;
        }
      });
      
      framesRef.current++;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [orbitingUsers]);

  // Component cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-amber-50 flex flex-col">
      {/* Header with wavy design */}
      <div className="bg-blue-400 w-full p-4 flex items-center relative overflow-hidden">
        <ChevronLeft className="text-black z-10" size={28} />
        <h1 className="text-4xl font-bold text-center flex-1 text-black font-mono tracking-wide z-10">
          Find People Nearby
        </h1>
        
        {/* Decorative waves */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute border-t border-black"
              style={{
                width: '200%',
                height: '40px',
                top: `${i * 15}px`,
                left: '-50%',
                transform: `rotate(${i % 2 ? 2 : -2}deg)`,
                opacity: 0.7 - (i * 0.05)
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Main Content - Fixed height container */}
      <div className="flex-1 p-4 bg-amber-50 flex items-center justify-center">
        <div className="w-full max-w-6xl h-128 flex flex-col md:flex-row bg-stone-200 rounded-lg shadow-lg overflow-hidden">
          
          {/* Left side - Orbit Visualization with fixed height */}
          <div className="w-full md:w-1/2 h-full relative overflow-hidden bg-stone-100" ref={orbitRef}>
            {/* Concentric circles */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-gray-300 opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-gray-300 opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-gray-300 opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-gray-300 opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-gray-300 opacity-60"></div>
            
            {/* Center user (you) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center overflow-hidden shadow-md">
                <img src="/api/placeholder/64/64" alt="You" className="w-full h-full" />
              </div>
            </div>
            
            {/* Orbiting users */}
            {mockUsers.map((user, index) => (
              <div 
                key={user.id}
                className={`absolute user-orbit transition-transform duration-500 ease-in-out ${index >= orbitingUsers.length ? 'opacity-0' : 'opacity-100'}`}
                style={{ 
                  top: '50%',
                  left: '50%',
                  transform: 'translate(0, 0)',
                  zIndex: 10
                }}
              >
                <div 
                  className="rounded-full bg-white border-2 border-gray-300 flex items-center justify-center overflow-hidden shadow-sm transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: '40px',
                    height: '40px',
                  }}
                >
                  <img src={user.avatar} alt={user.name} className="w-full h-full" />
                </div>
              </div>
            ))}
            
            {/* Decorative curves */}
            <div className="absolute bottom-0 right-0 w-40 h-40 opacity-10">
              <div className="absolute w-full h-full border-r-2 border-b-2 border-black rounded-tl-full"></div>
            </div>
            <div className="absolute top-0 left-0 w-60 h-60 opacity-10">
              <div className="absolute w-full h-full border-r-2 border-b-2 border-black rounded-tl-full transform rotate-180"></div>
            </div>
          </div>
          
          {/* Right side - User list with fixed height */}
          <div className="w-full md:w-1/2 h-full flex flex-col bg-stone-100">
            {/* Fixed header area */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-3xl font-serif mb-4">Nearby</h2>
              
              {/* Scan button */}
              <button 
                onClick={startScanning} 
                disabled={scanning}
                className={`px-6 py-2 rounded-lg font-medium ${scanning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
              >
                {scanning ? 'Scanning...' : 'Start Bluetooth Scan'}
              </button>
            </div>
            
            {/* Scrollable content area with fixed height */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Scanning message */}
              {scanning && nearbyUsers.length === 0 && (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-pulse text-gray-500">Scanning for nearby users...</div>
                </div>
              )}
              
              {/* Empty state */}
              {!scanning && nearbyUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Press "Start Bluetooth Scan" to find nearby users
                </div>
              )}
              
              {/* User cards in scrollable area */}
              <div className="space-y-3">
                {nearbyUsers.map(user => (
                  <div 
                    key={user.id} 
                    className="bg-amber-200 rounded-lg p-3 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-stone-100 rounded-full overflow-hidden flex items-center justify-center">
                          <img src={user.avatar} alt={user.name} className="w-full h-full" />
                        </div>
                        <div className="ml-2">
                          <span className="font-mono text-lg">{user.name}</span>
                          <p className="text-xs text-gray-600">{user.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Award size={16} className="text-yellow-500 mr-1" />
                        <span className="font-medium text-sm">{user.matchRate}%</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.interests.map((interest, idx) => (
                        <span key={idx} className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">
                          {interest}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-2">
                      <button 
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center text-sm"
                      >
                        <UserPlus size={14} className="mr-1" />
                        Connect
                      </button>
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded flex items-center text-sm"
                      >
                        <MessageCircle size={14} className="mr-1" />
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}