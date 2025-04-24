  // import { useState, useEffect } from 'react';
  // import { ChevronLeft } from 'lucide-react';
  // import { Link, useNavigate } from 'react-router-dom';

  // // Orbiting Profile Pictures Animation Component
  // const OrbitingProfiles = ({ isScanning }) => {
  //   const [profiles, setProfiles] = useState([]);
  //   const [waveRadius, setWaveRadius] = useState(0);
    
  //   useEffect(() => {
  //     // Create initial profiles
  //     const initialProfiles = [];
  //     const numProfiles = 7;
      
  //     // Predefined profile types for more realistic photos
  //     const profileTypes = [
  //       'women', 'men', 'human', 'people'
  //     ];
      
  //     for (let i = 0; i < numProfiles; i++) {
  //       initialProfiles.push({
  //         id: i,
  //         radius: Math.random() * 120 + 80, // Larger radius for bigger orbit
  //         speed: Math.random() * 0.005 + 0.001, // Slower speed (reduced from 0.01 to 0.005)
  //         angle: (Math.PI * 2 * i) / numProfiles,
  //         size: Math.random() * 15 + 25, // Size for profile pictures
  //         // Use placeholder images for profiles
  //         imageUrl: `src/Assets/coolPP.jpeg${100}/${100}?text=${profileTypes[i % profileTypes.length]}`
  //       });
  //     }
      
  //     setProfiles(initialProfiles);
      
  //     // Animation loop
  //     const animationInterval = setInterval(() => {
  //       setProfiles(prevProfiles => 
  //         prevProfiles.map(profile => ({
  //           ...profile,
  //           angle: profile.angle + profile.speed
  //         }))
  //       );
  //     }, 16);
      
  //     return () => clearInterval(animationInterval);
  //   }, []);
    
  //   // Wave effect animation when scanning starts
  //   useEffect(() => {
  //     if (isScanning) {
  //       setWaveRadius(0); // Reset wave radius
        
  //       const waveInterval = setInterval(() => {
  //         setWaveRadius(prev => {
  //           if (prev >= 250) {
  //             return 0; // Reset wave when it reaches maximum size
  //           }
  //           return prev + 2; // Speed of wave expansion
  //         });
  //       }, 16);
        
  //       return () => clearInterval(waveInterval);
  //     } else {
  //       setWaveRadius(0); // Hide wave when not scanning
  //     }
  //   }, [isScanning]);
    
  //   return (
  //     <div className="relative w-full h-full">
  //       {/* Transparent circles in background */}
  //       <div className="absolute w-112 h-112 bg-purple-100 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
  //       <div className="absolute w-96 h-96 bg-purple-200 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
  //       <div className="absolute w-72 h-72 bg-purple-300 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
  //       <div className="absolute w-56 h-56 bg-purple-400 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
  //       <div className="absolute w-40 h-40 bg-purple-500 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        
  //       {/* Wave effect circle - only visible when scanning */}
  //       {isScanning && (
  //         <div 
  //           className="absolute rounded-full border-2 border-blue-400 border-opacity-70 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
  //           style={{
  //             width: `${waveRadius * 2}px`,
  //             height: `${waveRadius * 2}px`,
  //             opacity: Math.max(0, 1 - waveRadius / 250),
  //             transition: 'opacity 0.1s ease-out'
  //           }}
  //         ></div>
  //       )}
        
  //       {/* Center point - Your profile */}
  //       <div className="absolute w-16 h-16 bg-white rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-lg p-1">
  //         <img 
  //           src="src/Assets/tanjiroo.jpg" 
  //           alt="Your Profile" 
  //           className="w-full h-full rounded-full object-cover"
  //         />
  //       </div>
        
  //       {/* Orbiting profile pictures */}
  //       {profiles.map(profile => {
  //         const x = Math.cos(profile.angle) * profile.radius;
  //         const y = Math.sin(profile.angle) * profile.radius;
          
  //         return (
  //           <div 
  //             key={profile.id}
  //             className="absolute rounded-full shadow-md z-20 border-2 border-white overflow-hidden"
  //             style={{
  //               width: `${profile.size}px`,
  //               height: `${profile.size}px`,
  //               left: `calc(50% + ${x}px)`,
  //               top: `calc(50% + ${y}px)`,
  //               transform: 'translate(-50%, -50%)',
  //               transition: 'all 0.1s linear'
  //             }}
  //           >
  //             <img
  //               src="src/Assets/zenitsuu.jpg"
  //               alt={`Profile ${profile.id}`}
  //               className="w-full h-full object-cover"
  //             />
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  // // Main Component
  // export default function BluetoothFinderPage() {
  //   const navigate = useNavigate();
  //   const [isScanning, setIsScanning] = useState(false);
  //   const [nearbyPeople, setNearbyPeople] = useState([]);
  //   const [friendRequests, setFriendRequests] = useState({});
  //   const [notifications, setNotifications] = useState([]);
    
  //   const toggleScan = () => {
  //     setIsScanning(!isScanning);
      
  //     if (!isScanning) {
  //       // Simulate finding nearby people with match percentages and interests
  //       const mockPeople = [
  //         { 
  //           id: 1, 
  //           name: "Saksham", 
  //           distance: "5m away", 
  //           signal: "Strong",
  //           matchPercentage: 87,
  //           interests: ["Music", "Photography", "Travel"]
  //         },
  //         { 
  //           id: 2, 
  //           name: "Tanisha", 
  //           distance: "12m away", 
  //           signal: "Medium",
  //           matchPercentage: 73,
  //           interests: ["Sports", "Tech", "Movies"]
  //         },
  //         { 
  //           id: 3, 
  //           name: "Ishita", 
  //           distance: "15m away", 
  //           signal: "Medium",
  //           matchPercentage: 65,
  //           interests: ["Cooking", "Books", "Hiking"]
  //         },
  //         { 
  //           id: 4, 
  //           name: "Udit", 
  //           distance: "23m away", 
  //           signal: "Weak",
  //           matchPercentage: 52,
  //           interests: ["Gaming", "Art", "Fitness"]
  //         },
  //         { 
  //           id: 5, 
  //           name: "Arjav", 
  //           distance: "28m away", 
  //           signal: "Weak",
  //           matchPercentage: 48,
  //           interests: ["Dancing", "Yoga", "Painting"]
  //         },
  //         { 
  //           id: 6, 
  //           name: "Shaurya", 
  //           distance: "32m away", 
  //           signal: "Weak",
  //           matchPercentage: 45,
  //           interests: ["Swimming", "Cycling", "Reading"]
  //         },
  //       ];
        
  //       // Simulating gradual discovery
  //       const timer1 = setTimeout(() => setNearbyPeople([mockPeople[0]]), 800);
  //       const timer2 = setTimeout(() => setNearbyPeople([mockPeople[0], mockPeople[1]]), 2000);
  //       const timer3 = setTimeout(() => setNearbyPeople([mockPeople[0], mockPeople[1], mockPeople[2]]), 3500);
  //       const timer4 = setTimeout(() => setNearbyPeople([mockPeople[0], mockPeople[1], mockPeople[2], mockPeople[3]]), 5000);
  //       const timer5 = setTimeout(() => setNearbyPeople([...mockPeople.slice(0, 5)]), 6500);
  //       const timer6 = setTimeout(() => setNearbyPeople(mockPeople), 8000);
        
  //       return () => {
  //         clearTimeout(timer1);
  //         clearTimeout(timer2);
  //         clearTimeout(timer3);
  //         clearTimeout(timer4);
  //         clearTimeout(timer5);
  //         clearTimeout(timer6);
  //       };
  //     } else {
  //       // Clear the list when scanning stops
  //       setNearbyPeople([]);
  //     }
  //   };
    
  //   // Handler functions for navigation
  //   const handleBackToWebsite = () => {
  //     navigate('/');
  //   };
    
  //   // Handler for sending a connect/friend request
  //   const handleConnect = (person) => {
  //     // Check if a friend request has already been sent
  //     if (friendRequests[person.id]) {
  //       return;
  //     }
      
  //     // Update the state to track that a friend request has been sent to this person
  //     setFriendRequests(prev => ({
  //       ...prev,
  //       [person.id]: true
  //     }));
      
  //     // Show a notification
  //     const newNotification = {
  //       id: Date.now(),
  //       message: `Friend request sent to ${person.name}!`,
  //       type: 'success'
  //     };
      
  //     setNotifications(prev => [...prev, newNotification]);
      
  //     // Remove notification after 3 seconds
  //     setTimeout(() => {
  //       setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
  //     }, 3000);
      
  //     // Here you would typically make an API call to your backend
  //     // Example:
  //     // api.sendFriendRequest(person.id)
  //     //   .then(() => {
  //     //     // Handle success
  //     //   })
  //     //   .catch(error => {
  //     //     // Handle error, maybe remove from friendRequests state
  //     //     setFriendRequests(prev => {
  //     //       const updated = {...prev};
  //     //       delete updated[person.id];
  //     //       return updated;
  //     //     });
  //     //   });
  //   };
    
  //   // Handler for opening the chat page
  //   const handleMessage = (person) => {
  //     // Navigate to chat page with the person's information
  //     navigate(`/chatpage/${person.id}`, { state: { person } });
  //   };
    
  //   return (
  //     <div className="h-screen w-full flex flex-col bg-amber-50">
        
  //       {/* Header */}
  //       <div className="relative z-10 p-4 flex items-center">
  //         {/* Back button */}
  //       <button 
  //         onClick={handleBackToWebsite}
  //         className="absolute top-7 left-8 z-50 flex items-center text-stone-800 hover:text-amber-800 transition-colors px-4 py-2 rounded-full hover:bg-amber-100">
  //         <ChevronLeft size={32} className="mr-1" />
  //       </button>

  //         <h1 className="text-4xl font-bold text-center flex-grow translate-y-5" style={{ fontFamily: "Slackey", letterSpacing: "2px", color: "#593e25" }}>
  //           Find People Nearby
  //         </h1>
  //       </div>
        
  //       {/* Notifications */}
  //       <div className="fixed top-4 right-4 z-50">
  //         {notifications.map((notification) => (
  //           <div 
  //             key={notification.id}
  //             className={`mb-2 p-3 rounded-lg shadow-lg text-white ${
  //               notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
  //             } transition-opacity duration-300 flex items-center`}
  //           >
  //             {notification.type === 'success' ? (
  //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
  //                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  //               </svg>
  //             ) : (
  //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
  //                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  //               </svg>
  //             )}
  //             {notification.message}
  //           </div>
  //         ))}
  //       </div>
        
  //       {/* Main content */}
  //       <div className="flex-1 flex flex-col md:flex-row p-8 relative z-10">
  //         {/* Left side - Orbiting profiles */}
  //         <div className="w-full md:w-1/2 h-96 md:h-auto m-4 bg-gray-100 bg-opacity-60 rounded-xl overflow-hidden shadow-xl" style={{ minHeight: "400px" }}>
  //           <div className="w-full h-full p-4">
  //             <OrbitingProfiles isScanning={isScanning} />
  //           </div>
  //         </div>
          
  //         {/* Right side - People list with fixed height and scrolling */}
  //         <div className="w-full md:w-1/2 md:pl-6 flex flex-col m-4">
  //           <div className="bg-gray-100 bg-opacity-70 rounded-xl shadow-xl flex-1 p-6 flex flex-col" style={{ minHeight: "400px", height: "400px" }}>
  //             <div className="flex justify-between items-center mb-4">
  //               <h2 className="text-2xl font-bold" style={{ color: "#593e25" }}>Nearby</h2>
  //               <button 
  //                 onClick={toggleScan} 
  //                 className={`px-5 py-2 rounded-lg bg-amber-800 font-medium transition-colors ${
  //                   isScanning 
  //                     ? "bg-red-600 hover:bg-red-700 text-white" 
  //                     : "bg-amber-700 hover:bg-amber-800 text-white"
  //                 }`}
  //               >
  //                 {isScanning ? "Stop Scanning" : "Start Scanning"}
  //               </button>
  //             </div>
              
  //             {/* Scrollable container for the people list */}
  //             <div className="overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '320px', minHeight: '530px' }}>
  //               {nearbyPeople.length > 0 ? (
  //                 <ul className="space-y-4">
  //                   {nearbyPeople.map(person => (
  //                     <li 
  //                       key={person.id} 
  //                       className="bg-amber-100 bg-opacity-80 p-4 rounded-lg animate-fade-in shadow-md"
  //                     >
  //                       {/* Person info */}
  //                       <div className="flex items-center mb-3">
  //                         <div className="bg-gray-200 rounded-full w-14 h-14 flex items-center justify-center mr-4 overflow-hidden">
  //                           <img 
  //                             src={`src/Assets/coolPP.jpeg?text=${person.name.substring(0, 2)}`} 
  //                             alt={person.name} 
  //                             className="w-full h-full object-cover"
  //                           />
  //                         </div>
  //                         <div className="flex-grow">
  //                           <div className="font-bold text-lg" style={{ color: "#593e25" }}>{person.name}</div>
  //                           <div className="flex items-center">
  //                             <div className="text-sm text-gray-500 mr-2">Match:</div>
  //                             <div className="bg-gray-200 h-4 w-24 rounded-full overflow-hidden">
  //                               <div 
  //                                 className="h-full rounded-full" 
  //                                 style={{ 
  //                                   width: `${person.matchPercentage}%`,
  //                                   backgroundColor: person.matchPercentage > 75 ? '#4CAF50' : 
  //                                                   person.matchPercentage > 60 ? '#FFC107' : '#FF5722'
  //                                 }}
  //                               ></div>
  //                             </div>
  //                             <div className="ml-2 text-sm font-medium" style={{ color: "#593e25" }}>
  //                               {person.matchPercentage}%
  //                             </div>
  //                           </div>
  //                         </div>
  //                       </div>
                        
  //                       {/* Common interests */}
  //                       <div className="mb-3 pl-16">
  //                         <div className="text-xs text-gray-500">Common Interests:</div>
  //                         <div className="flex flex-wrap mt-1">
  //                           {person.interests.map((interest, index) => (
  //                             <span 
  //                               key={index}
  //                               className="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
  //                             >
  //                               {interest}
  //                             </span>
  //                           ))}
  //                         </div>
  //                       </div>
                        
  //                       {/* Action buttons */}
  //                       <div className="flex justify-end space-x-2 mt-2">
  //                         <Link to={'/chat'}
  //                           onClick={() => handleMessage(person)}
  //                           className="bg-white hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
  //                         >
  //                           Message
  //                         </Link>
  //                         <button 
  //                           onClick={() => handleConnect(person)}
  //                           className={`${
  //                             friendRequests[person.id] 
  //                               ? 'bg-green-600 hover:bg-green-700' 
  //                               : 'bg-amber-700 hover:bg-amber-800'
  //                           } text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
  //                           disabled={friendRequests[person.id]}
  //                         >
  //                           {friendRequests[person.id] ? 'Request Sent' : 'Connect'}
  //                         </button>
  //                       </div>
  //                     </li>
  //                   ))}
  //                 </ul>
  //               ) : (
  //                 <div className="h-full flex items-center justify-center text-gray-500 text-lg">
  //                   {isScanning 
  //                     ? "Scanning for nearby people..." 
  //                     : "Click 'Start Scanning' to find people nearby"}
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
        
  //       {/* Custom styles for scrollbar */}
  //       <style jsx global>{`
  //         .custom-scrollbar::-webkit-scrollbar {
  //           width: 6px;
  //         }
          
  //         .custom-scrollbar::-webkit-scrollbar-track {
  //           background: rgba(0, 0, 0, 0.05);
  //           border-radius: 10px;
  //         }
          
  //         .custom-scrollbar::-webkit-scrollbar-thumb {
  //           background: rgba(0, 0, 0, 0.15);
  //           border-radius: 10px;
  //         }
          
  //         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  //           background: rgba(0, 0, 0, 0.25);
  //         }
          
  //         @keyframes fadeIn {
  //           from { opacity: 0; transform: translateY(10px); }
  //           to { opacity: 1; transform: translateY(0); }
  //         }
          
  //         .animate-fade-in {
  //           animation: fadeIn 0.5s ease-out forwards;
  //         }
  //       `}</style>
  //     </div>
  //  
  // 
  //  );
  // }



  //////////////////////////////////////////////////////////////////////////////
  import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Geolocation service to manage location tracking and proximity detection
const useGeolocationService = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const watchIdRef = useRef(null);

  // Start tracking user location
  const startTracking = () => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return false;
    }

    // Clear any previous errors
    setLocationError(null);

    // Options for high accuracy and frequent updates
    const options = {
      enableHighAccuracy: true, // Use GPS if available
      maximumAge: 10000,        // Accept positions that are up to 10 seconds old
      timeout: 15000           // Wait up to 15 seconds for a position
    };

    try {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        error => {
          setLocationError(error.message);
          return false;
        },
        options
      );

      // Set up continuous tracking
      watchIdRef.current = navigator.geolocation.watchPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        error => {
          setLocationError(error.message);
        },
        options
      );

      return true;
    } catch (err) {
      setLocationError("Failed to initialize location tracking");
      return false;
    }
  };

  // Stop tracking user location
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Calculate distance between two coordinates in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula to calculate distance between two points on Earth
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in meters
  };

  return {
    userLocation,
    locationError,
    startTracking,
    stopTracking,
    calculateDistance
  };
};

// Mock API service to simulate server communication
const useMockProximityAPI = () => {
  // In a real app, this would be replaced with actual API calls
  
  // Simulate fetching nearby users from a server
  const fetchNearbyUsers = async (latitude, longitude, maxDistance = 100) => {
    // This would be a real API call in production
    // For example: return await api.get('/nearby-users', { latitude, longitude, maxDistance });
    
    // Mock server data - in a real app, this would come from your backend
    const mockServerUsers = [
      { 
        id: 1, 
        name: "Saksham", 
        latitude: latitude + 0.0001, // Slightly different location
        longitude: longitude + 0.0002,
        lastUpdate: Date.now() - 60000, // 1 minute ago
        interests: ["Music", "Photography", "Travel"],
        profileImage: "src/Assets/coolPP.jpeg"
      },
      { 
        id: 2, 
        name: "Tanisha", 
        latitude: latitude - 0.0003,
        longitude: longitude + 0.0001,
        lastUpdate: Date.now() - 120000, // 2 minutes ago
        interests: ["Sports", "Tech", "Movies"],
        profileImage: "src/Assets/coolPP.jpeg"
      },
      { 
        id: 3, 
        name: "Ishita", 
        latitude: latitude + 0.0005,
        longitude: longitude - 0.0004,
        lastUpdate: Date.now() - 180000, // 3 minutes ago
        interests: ["Cooking", "Books", "Hiking"],
        profileImage: "src/Assets/coolPP.jpeg"
      },
      { 
        id: 4, 
        name: "Udit", 
        latitude: latitude - 0.0007,
        longitude: longitude - 0.0002,
        lastUpdate: Date.now() - 240000, // 4 minutes ago
        interests: ["Gaming", "Art", "Fitness"],
        profileImage: "src/Assets/coolPP.jpeg"
      },
      { 
        id: 5, 
        name: "Arjav", 
        latitude: latitude + 0.0008,
        longitude: longitude - 0.0009,
        lastUpdate: Date.now() - 300000, // 5 minutes ago
        interests: ["Dancing", "Yoga", "Painting"],
        profileImage: "src/Assets/coolPP.jpeg"
      },
      { 
        id: 6, 
        name: "Shaurya", 
        latitude: latitude - 0.0010,
        longitude: longitude + 0.0011,
        lastUpdate: Date.now() - 360000, // 6 minutes ago
        interests: ["Swimming", "Cycling", "Reading"],
        profileImage: "src/Assets/coolPP.jpeg"
      },
    ];
    
    // Add a slight delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return mockServerUsers;
  };
  
  // Simulate broadcasting user's location to server
  const broadcastLocation = async (userId, latitude, longitude) => {
    // This would be a real API call in production
    // For example: return await api.post('/update-location', { userId, latitude, longitude });
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true };
  };
  
  // Simulate sending a connection request
  const sendConnectionRequest = async (fromUserId, toUserId) => {
    // This would be a real API call in production
    // For example: return await api.post('/connection-requests', { fromUserId, toUserId });
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true, requestId: `req-${Date.now()}` };
  };
  
  return {
    fetchNearbyUsers,
    broadcastLocation,
    sendConnectionRequest
  };
};

// Orbiting Profile Pictures Animation Component
const OrbitingProfiles = ({ isScanning, nearbyUsers }) => {
  const [profiles, setProfiles] = useState([]);
  const [waveRadius, setWaveRadius] = useState(0);
  
  useEffect(() => {
    // Update profiles based on nearby users when available
    if (nearbyUsers && nearbyUsers.length > 0) {
      const updatedProfiles = nearbyUsers.slice(0, 7).map((user, index) => ({
        id: user.id,
        radius: Math.random() * 120 + 80, // Larger radius for bigger orbit
        speed: Math.random() * 0.005 + 0.001, // Slower speed
        angle: (Math.PI * 2 * index) / nearbyUsers.length,
        size: Math.random() * 15 + 25, // Size for profile pictures
        imageUrl: user.profileImage || `src/Assets/coolPP.jpeg`
      }));
      
      setProfiles(updatedProfiles);
    } else {
      // Create placeholder profiles when no nearby users
      const initialProfiles = [];
      const numProfiles = 7;
      
      for (let i = 0; i < numProfiles; i++) {
        initialProfiles.push({
          id: i,
          radius: Math.random() * 120 + 80,
          speed: Math.random() * 0.005 + 0.001,
          angle: (Math.PI * 2 * i) / numProfiles,
          size: Math.random() * 15 + 25,
          imageUrl: `src/Assets/coolPP.jpeg`
        });
      }
      
      setProfiles(initialProfiles);
    }
    
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
  }, [nearbyUsers]);
  
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
              src={profile.imageUrl || "src/Assets/zenitsuu.jpg"}
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
  const [scanningStatus, setScanningStatus] = useState("idle"); // idle, requesting, scanning, error
  const currentUserIdRef = useRef("user-123"); // In a real app, this would come from auth context
  
  // Use our custom hooks
  const geo = useGeolocationService();
  const proximityAPI = useMockProximityAPI();
  
  // Location update interval reference
  const locationUpdateIntervalRef = useRef(null);
  
  // Function to calculate signal strength based on distance
  const getSignalStrength = (distance) => {
    if (distance < 10) return "Strong";
    if (distance < 30) return "Medium";
    if (distance < 50) return "Weak";
    return "Very weak";
  };
  
  // Function to format distance for display
  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    } else {
      return `${(distance / 1000).toFixed(1)}km away`;
    }
  };
  
  // Function to calculate match percentage based on shared interests
  // In a real app, this would use a more sophisticated algorithm
  const calculateMatchPercentage = (user) => {
    // Mock user interests - in a real app would come from user profile
    const myInterests = ["Music", "Tech", "Travel", "Gaming", "Sports", "Movies", "Books"];
    
    if (!user.interests || user.interests.length === 0) {
      return 50; // Default match percentage
    }
    
    // Count matching interests
    const matchingInterests = user.interests.filter(interest => 
      myInterests.includes(interest)
    );
    
    // Calculate percentage, minimum 30%
    const matchPercentage = Math.round(30 + (matchingInterests.length / myInterests.length) * 70);
    
    return Math.min(matchPercentage, 95); // Cap at 95% to keep it realistic
  };
  
  // Start scanning for nearby users
  const startScanning = async () => {
    setScanningStatus("requesting");
    
    // Request location permission and start tracking
    const locationStarted = geo.startTracking();
    
    if (!locationStarted) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `Location access denied. Please enable location services to find nearby people.`,
        type: 'error'
      }]);
      setScanningStatus("error");
      return;
    }
    
    setIsScanning(true);
    setScanningStatus("scanning");
    
    // Set up interval to periodically search for nearby users and update our location
    locationUpdateIntervalRef.current = setInterval(async () => {
      if (geo.userLocation) {
        try {
          // Broadcast our location to the server
          await proximityAPI.broadcastLocation(
            currentUserIdRef.current,
            geo.userLocation.latitude,
            geo.userLocation.longitude
          );
          
          // Fetch nearby users
          const nearbyUsers = await proximityAPI.fetchNearbyUsers(
            geo.userLocation.latitude,
            geo.userLocation.longitude,
            100 // Max distance in meters
          );
          
          // Process and display nearby users with distance calculation
          const processedUsers = nearbyUsers.map(user => {
            const distance = geo.calculateDistance(
              geo.userLocation.latitude,
              geo.userLocation.longitude,
              user.latitude,
              user.longitude
            );
            
            return {
              ...user,
              distance: distance,
              distanceText: formatDistance(distance),
              signal: getSignalStrength(distance),
              matchPercentage: calculateMatchPercentage(user)
            };
          });
          
          // Sort by distance
          processedUsers.sort((a, b) => a.distance - b.distance);
          
          // Update state with nearby users
          setNearbyPeople(processedUsers);
        } catch (error) {
          console.error("Error updating location or fetching nearby users:", error);
          
          // Show error notification only once
          const errorNotification = {
            id: Date.now(),
            message: "Error connecting to server. Retrying...",
            type: 'error'
          };
          
          setNotifications(prev => [...prev, errorNotification]);
          
          // Remove notification after 3 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== errorNotification.id));
          }, 3000);
        }
      }
    }, 5000); // Update every 5 seconds
  };
  
  // Stop scanning for nearby users
  const stopScanning = () => {
    // Clear update interval
    if (locationUpdateIntervalRef.current) {
      clearInterval(locationUpdateIntervalRef.current);
      locationUpdateIntervalRef.current = null;
    }
    
    // Stop location tracking
    geo.stopTracking();
    
    // Update states
    setIsScanning(false);
    setScanningStatus("idle");
    setNearbyPeople([]);
  };
  
  // Toggle scan state
  const toggleScan = () => {
    if (isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (locationUpdateIntervalRef.current) {
        clearInterval(locationUpdateIntervalRef.current);
      }
      geo.stopTracking();
    };
  }, []);
  
  // Handler functions for navigation
  const handleBackToWebsite = () => {
    navigate('/');
  };
  
  // Handler for sending a connect/friend request
  const handleConnect = async (person) => {
    // Check if a friend request has already been sent
    if (friendRequests[person.id]) {
      return;
    }
    
    try {
      // Send connection request to the server
      const result = await proximityAPI.sendConnectionRequest(
        currentUserIdRef.current,
        person.id
      );
      
      if (result.success) {
        // Update the state to track that a friend request has been sent
        setFriendRequests(prev => ({
          ...prev,
          [person.id]: true
        }));
        
        // Show a success notification
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
      } else {
        throw new Error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      
      // Show error notification
      const errorNotification = {
        id: Date.now(),
        message: `Failed to send request to ${person.name}. Please try again.`,
        type: 'error'
      };
      
      setNotifications(prev => [...prev, errorNotification]);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== errorNotification.id));
      }, 3000);
    }
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
          className="absolute top-7 left-8 z-50 flex items-center text-stone-800 hover:text-amber-800 transition-colors px-4 py-2 rounded-full hover:bg-amber-100">
          <ChevronLeft size={32} className="mr-1" />
        </button>

        <h1 className="text-4xl font-bold text-center flex-grow translate-y-5" style={{ fontFamily: "Slackey", letterSpacing: "2px", color: "#593e25" }}>
          Find People Nearby
        </h1>
      </div>
      
      {/* Location permission status */}
      {scanningStatus === "requesting" && (
        <div className="fixed top-0 left-0 w-full bg-blue-500 text-white p-2 text-center z-40">
          Requesting location access... Please allow location permission when prompted.
        </div>
      )}
      
      {/* Error status */}
      {scanningStatus === "error" && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white p-2 text-center z-40">
          Location access denied. Please enable location services in your browser settings.
        </div>
      )}
      
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
            <OrbitingProfiles isScanning={isScanning} nearbyUsers={nearbyPeople} />
          </div>
        </div>
        
        {/* Right side - People list with fixed height and scrolling */}
        <div className="w-full md:w-1/2 md:pl-6 flex flex-col m-4">
          <div className="bg-gray-100 bg-opacity-70 rounded-xl shadow-xl flex-1 p-6 flex flex-col" style={{ minHeight: "400px", height: "400px" }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold" style={{ color: "#593e25" }}>Nearby</h2>
              <button 
                onClick={toggleScan} 
                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                  isScanning 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-amber-700 hover:bg-amber-800 text-white"
                } ${scanningStatus === "requesting" ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={scanningStatus === "requesting"}
              >
                {isScanning ? "Stop Scanning" : "Start Scanning"}
              </button>
            </div>
            
            {/* Scrollable container for the people list */}
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1" style={{ maxHeight: '320px' }}>
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
                            src={person.profileImage || `src/Assets/coolPP.jpeg`}
                            alt={person.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="font-bold text-lg" style={{ color: "#593e25" }}>{person.name}</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">{person.distanceText}</span>
                            <span className="mx-1">•</span>
                            <span className="mr-2">Signal: {person.signal}</span>
                          </div>
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
                          {person.interests && person.interests.map((interest, index) => (
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
                        <button
                          onClick={() => handleMessage(person)}
                          className="bg-white hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Message
                        </button>
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
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  {isScanning ? (
                    <>
                      <div className="animate-pulse mb-4">
                        <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-lg mb-2">Scanning for nearby people...</p>
                      <p className="text-sm text-center max-w-md">
                        Searching for other users within 100 meters of your location. This may take a moment...
                      </p>
                    </>
                  ) : (
                    <>
                      <svg className="w-12 h-12 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg mb-2">Not currently scanning</p>
                      <p className="text-sm text-center max-w-md">
                        Click 'Start Scanning' to find people nearby. This uses your location to find other users in your vicinity.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Location status info */}
            {geo.userLocation && isScanning && (
              <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                <p>Your location: {geo.userLocation.latitude.toFixed(6)}, {geo.userLocation.longitude.toFixed(6)}</p>
                <p>Accuracy: ±{Math.round(geo.userLocation.accuracy || 0)}m • Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            )}
            
            {geo.locationError && (
              <div className="mt-4 pt-3 border-t border-red-200 text-xs text-red-500">
                <p>Location error: {geo.locationError}</p>
                <p>Please check your browser settings and ensure location services are enabled.</p>
              </div>
            )}
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
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}