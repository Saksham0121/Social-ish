import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Orbiting Profile Pictures Animation Component
const OrbitingProfiles = ({ isScanning }) => {
  const [profiles, setProfiles] = useState([]);
  const [waveRadius, setWaveRadius] = useState(0);
  
  useEffect(() => {
    // Create initial profiles
    const initialProfiles = [];
    const numProfiles = 7;
    
    // Predefined profile types for more realistic photos
    const profileTypes = [
      'women', 'men', 'human', 'people'
    ];
    
    for (let i = 0; i < numProfiles; i++) {
      initialProfiles.push({
        id: i,
        radius: Math.random() * 120 + 80, // Larger radius for bigger orbit
        speed: Math.random() * 0.005 + 0.001, // Slower speed (reduced from 0.01 to 0.005)
        angle: (Math.PI * 2 * i) / numProfiles,
        size: Math.random() * 15 + 25, // Size for profile pictures
        // Use placeholder images for profiles
        imageUrl: `src/Assets/coolPP.jpeg${100}/${100}?text=${profileTypes[i % profileTypes.length]}`
      });
    }
    
    setProfiles(initialProfiles);
    
    // Animation loop
    const animationInterval = setInterval(() => {
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => ({
          ...profile,
          angle: profile.angle + profile.speed
        }))
      );
    }, 16);
    
    return () => clearInterval(animationInterval);
  }, []);
  
  // Wave effect animation when scanning starts
  useEffect(() => {
    if (isScanning) {
      setWaveRadius(0); // Reset wave radius
      
      const waveInterval = setInterval(() => {
        setWaveRadius(prev => {
          if (prev >= 250) {
            return 0; // Reset wave when it reaches maximum size
          }
          return prev + 2; // Speed of wave expansion
        });
      }, 16);
      
      return () => clearInterval(waveInterval);
    } else {
      setWaveRadius(0); // Hide wave when not scanning
    }
  }, [isScanning]);
  
  return (
    <div className="relative w-full h-full">
      {/* Transparent circles in background */}
      <div className="absolute w-112 h-112 bg-purple-100 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-96 h-96 bg-purple-200 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-72 h-72 bg-purple-300 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-56 h-56 bg-purple-400 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-40 h-40 bg-purple-500 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Wave effect circle - only visible when scanning */}
      {isScanning && (
        <div 
          className="absolute rounded-full border-2 border-blue-400 border-opacity-70 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${waveRadius * 2}px`,
            height: `${waveRadius * 2}px`,
            opacity: Math.max(0, 1 - waveRadius / 250),
            transition: 'opacity 0.1s ease-out'
          }}
        ></div>
      )}
      
      {/* Center point - Your profile */}
      <div className="absolute w-16 h-16 bg-white rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-lg p-1">
        <img 
          src="src/Assets/tanjiroo.jpg" 
          alt="Your Profile" 
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      
      {/* Orbiting profile pictures */}
      {profiles.map(profile => {
        const x = Math.cos(profile.angle) * profile.radius;
        const y = Math.sin(profile.angle) * profile.radius;
        
        return (
          <div 
            key={profile.id}
            className="absolute rounded-full shadow-md z-20 border-2 border-white overflow-hidden"
            style={{
              width: `${profile.size}px`,
              height: `${profile.size}px`,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.1s linear'
            }}
          >
            <img
              src="src/Assets/zenitsuu.jpg"
              alt={`Profile ${profile.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
};

// Main Component
export default function BluetoothFinderPage() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyPeople, setNearbyPeople] = useState([]);
  const [friendRequests, setFriendRequests] = useState({});
  const [notifications, setNotifications] = useState([]);
  
  const toggleScan = () => {
    setIsScanning(!isScanning);
    
    if (!isScanning) {
      // Simulate finding nearby people with match percentages and interests
      const mockPeople = [
        { 
          id: 1, 
          name: "Saksham", 
          distance: "5m away", 
          signal: "Strong",
          matchPercentage: 87,
          interests: ["Music", "Photography", "Travel"]
        },
        { 
          id: 2, 
          name: "Tanisha", 
          distance: "12m away", 
          signal: "Medium",
          matchPercentage: 73,
          interests: ["Sports", "Tech", "Movies"]
        },
        { 
          id: 3, 
          name: "Ishita", 
          distance: "15m away", 
          signal: "Medium",
          matchPercentage: 65,
          interests: ["Cooking", "Books", "Hiking"]
        },
        { 
          id: 4, 
          name: "Udit", 
          distance: "23m away", 
          signal: "Weak",
          matchPercentage: 52,
          interests: ["Gaming", "Art", "Fitness"]
        },
        { 
          id: 5, 
          name: "Arjav", 
          distance: "28m away", 
          signal: "Weak",
          matchPercentage: 48,
          interests: ["Dancing", "Yoga", "Painting"]
        },
        { 
          id: 6, 
          name: "Shaurya", 
          distance: "32m away", 
          signal: "Weak",
          matchPercentage: 45,
          interests: ["Swimming", "Cycling", "Reading"]
        },
      ];
      
      // Simulating gradual discovery
      const timer1 = setTimeout(() => setNearbyPeople([mockPeople[0]]), 800);
      const timer2 = setTimeout(() => setNearbyPeople([mockPeople[0], mockPeople[1]]), 2000);
      const timer3 = setTimeout(() => setNearbyPeople([mockPeople[0], mockPeople[1], mockPeople[2]]), 3500);
      const timer4 = setTimeout(() => setNearbyPeople([mockPeople[0], mockPeople[1], mockPeople[2], mockPeople[3]]), 5000);
      const timer5 = setTimeout(() => setNearbyPeople([...mockPeople.slice(0, 5)]), 6500);
      const timer6 = setTimeout(() => setNearbyPeople(mockPeople), 8000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
      };
    } else {
      // Clear the list when scanning stops
      setNearbyPeople([]);
    }
  };
  
  // Handler functions for navigation
  const handleBackToWebsite = () => {
    navigate('/');
  };
  
  // Handler for sending a connect/friend request
  const handleConnect = (person) => {
    // Check if a friend request has already been sent
    if (friendRequests[person.id]) {
      return;
    }
    
    // Update the state to track that a friend request has been sent to this person
    setFriendRequests(prev => ({
      ...prev,
      [person.id]: true
    }));
    
    // Show a notification
    const newNotification = {
      id: Date.now(),
      message: `Friend request sent to ${person.name}!`,
      type: 'success'
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
    
    // Here you would typically make an API call to your backend
    // Example:
    // api.sendFriendRequest(person.id)
    //   .then(() => {
    //     // Handle success
    //   })
    //   .catch(error => {
    //     // Handle error, maybe remove from friendRequests state
    //     setFriendRequests(prev => {
    //       const updated = {...prev};
    //       delete updated[person.id];
    //       return updated;
    //     });
    //   });
  };
  
  // Handler for opening the chat page
  const handleMessage = (person) => {
    // Navigate to chat page with the person's information
    navigate(`/chatpage/${person.id}`, { state: { person } });
  };
  
  return (
    <div className="h-screen w-full flex flex-col bg-amber-50">
      
      {/* Header */}
      <div className="relative z-10 p-4 flex items-center">
        {/* Back button */}
        <button 
          onClick={handleBackToWebsite}
          className="absolute top-8 left-8 z-50 flex items-center text-{#593e25} px-4 py-2 ">
          <ArrowLeft size={24} className="mr-1" />
        </button>

        <h1 className="text-4xl font-bold text-center flex-grow translate-y-5" style={{ fontFamily: "Slackey", letterSpacing: "2px", color: "#593e25" }}>
          Find People Nearby
        </h1>
      </div>
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`mb-2 p-3 rounded-lg shadow-lg text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } transition-opacity duration-300 flex items-center`}
          >
            {notification.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {notification.message}
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row p-8 relative z-10">
        {/* Left side - Orbiting profiles */}
        <div className="w-full md:w-1/2 h-96 md:h-auto m-4 bg-gray-100 bg-opacity-60 rounded-xl overflow-hidden shadow-xl" style={{ minHeight: "400px" }}>
          <div className="w-full h-full p-4">
            <OrbitingProfiles isScanning={isScanning} />
          </div>
        </div>
        
        {/* Right side - People list with fixed height and scrolling */}
        <div className="w-full md:w-1/2 md:pl-6 flex flex-col m-4">
          <div className="bg-gray-100 bg-opacity-70 rounded-xl shadow-xl flex-1 p-6 flex flex-col" style={{ minHeight: "400px", height: "400px" }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold" style={{ color: "#593e25" }}>Nearby</h2>
              <button 
                onClick={toggleScan} 
                className={`px-5 py-2 rounded-lg bg-amber-800 font-medium transition-colors ${
                  isScanning 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-amber-700 hover:bg-amber-800 text-white"
                }`}
              >
                {isScanning ? "Stop Scanning" : "Start Scanning"}
              </button>
            </div>
            
            {/* Scrollable container for the people list */}
            <div className="overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '320px', minHeight: '530px' }}>
              {nearbyPeople.length > 0 ? (
                <ul className="space-y-4">
                  {nearbyPeople.map(person => (
                    <li 
                      key={person.id} 
                      className="bg-amber-100 bg-opacity-80 p-4 rounded-lg animate-fade-in shadow-md"
                    >
                      {/* Person info */}
                      <div className="flex items-center mb-3">
                        <div className="bg-gray-200 rounded-full w-14 h-14 flex items-center justify-center mr-4 overflow-hidden">
                          <img 
                            src={`src/Assets/coolPP.jpeg?text=${person.name.substring(0, 2)}`} 
                            alt={person.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="font-bold text-lg" style={{ color: "#593e25" }}>{person.name}</div>
                          <div className="flex items-center">
                            <div className="text-sm text-gray-500 mr-2">Match:</div>
                            <div className="bg-gray-200 h-4 w-24 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${person.matchPercentage}%`,
                                  backgroundColor: person.matchPercentage > 75 ? '#4CAF50' : 
                                                  person.matchPercentage > 60 ? '#FFC107' : '#FF5722'
                                }}
                              ></div>
                            </div>
                            <div className="ml-2 text-sm font-medium" style={{ color: "#593e25" }}>
                              {person.matchPercentage}%
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Common interests */}
                      <div className="mb-3 pl-16">
                        <div className="text-xs text-gray-500">Common Interests:</div>
                        <div className="flex flex-wrap mt-1">
                          {person.interests.map((interest, index) => (
                            <span 
                              key={index}
                              className="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex justify-end space-x-2 mt-2">
                        <Link to={'/chat'}
                          onClick={() => handleMessage(person)}
                          className="bg-white hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Message
                        </Link>
                        <button 
                          onClick={() => handleConnect(person)}
                          className={`${
                            friendRequests[person.id] 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-amber-700 hover:bg-amber-800'
                          } text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
                          disabled={friendRequests[person.id]}
                        >
                          {friendRequests[person.id] ? 'Request Sent' : 'Connect'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-lg">
                  {isScanning 
                    ? "Scanning for nearby people..." 
                    : "Click 'Start Scanning' to find people nearby"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom styles for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.25);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}