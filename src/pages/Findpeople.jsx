import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, collection, query, getDocs, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Make sure this path is correct for your project

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
        speed: Math.random() * 0.005 + 0.001, // Slower speed
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
      <div className="absolute w-full h-full bg-purple-100 bg-opacity-20 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
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
  const auth = getAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyPeople, setNearbyPeople] = useState([]);
  const [friendRequests, setFriendRequests] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // User data state
  const [userData, setUserData] = useState({
    username: "",
    profilePictureIndex: 0,
    connections: [],
    friendRequests: [],
    sentRequests: []
  });

  // Profile picture options
  const profileOptions = [
    "src/Assets/blue.jpeg",
    "src/Assets/brown.jpeg",
    "/src/Assets/pink.jpeg",
    "src/Assets/green.jpeg"
  ];

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is authenticated
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // Get user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
        } else {
          setError("User profile not found. Please set up your profile first.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again.");
      }
    };

    fetchUserData();
  }, [auth, navigate]);
  
  const toggleScan = async () => {
    setIsScanning(!isScanning);
    
    if (!isScanning) {
      await fetchNearbyUsers();
    } else {
      // Clear the list when scanning stops
      setNearbyPeople([]);
    }
  };

  // Fetch nearby users from Firebase
  const fetchNearbyUsers = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      
      // Get current user's connections and sent requests to filter them out
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error("User data not found");
      }
      
      const userData = userDoc.data();
      const connections = userData.connections || [];
      const sentRequests = userData.sentRequests || [];
      
      // Query users from Firestore
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        limit(10) // Limit to prevent fetching too many users
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedUsers = [];
      
      querySnapshot.forEach((doc) => {
        // Skip current user and already connected users
        if (doc.id !== currentUser.uid && 
            !connections.includes(doc.id) && 
            !sentRequests.includes(doc.id)) {
          
          const userData = doc.data();
          
          // Generate a random match percentage and distance for demo purposes
          const matchPercentage = Math.floor(Math.random() * 50) + 40; // 40-90%
          const distance = Math.floor(Math.random() * 30) + 5; // 5-35m
          
          // Generate random interests
          const allInterests = ["Music", "Photography", "Travel", "Sports", "Tech", 
                               "Movies", "Cooking", "Books", "Hiking", "Gaming", 
                               "Art", "Fitness", "Dancing", "Yoga", "Painting"];
          
          // Select 2-4 random interests
          const numInterests = Math.floor(Math.random() * 3) + 2;
          const interests = [];
          const interestsCopy = [...allInterests];
          
          for (let i = 0; i < numInterests; i++) {
            if (interestsCopy.length === 0) break;
            const index = Math.floor(Math.random() * interestsCopy.length);
            interests.push(interestsCopy[index]);
            interestsCopy.splice(index, 1);
          }
          
          fetchedUsers.push({
            id: doc.id,
            name: userData.username,
            distance: `${distance}m away`,
            signal: distance < 10 ? "Strong" : distance < 20 ? "Medium" : "Weak",
            matchPercentage,
            interests,
            profilePictureIndex: userData.profilePictureIndex || 0
          });
        }
      });
      
      // Simulate gradual discovery (same as your original code)
      const revealUsers = (users, delay = 800) => {
        if (users.length === 0) {
          setLoading(false);
          return;
        }
        
        const timers = [];
        const batchSize = Math.ceil(users.length / 6); // Divide into 6 batches
        
        for (let i = 1; i <= 6; i++) {
          const timer = setTimeout(() => {
            const displayCount = Math.min(i * batchSize, users.length);
            setNearbyPeople(users.slice(0, displayCount));
            
            if (i === 6) {
              setLoading(false);
            }
          }, delay * i);
          
          timers.push(timer);
        }
        
        return () => timers.forEach(clearTimeout);
      };
      
      revealUsers(fetchedUsers);
      
    } catch (err) {
      console.error("Error fetching nearby users:", err);
      setLoading(false);
      setError("Failed to fetch nearby users. Please try again.");
    }
  };
  
  // Handler functions for navigation
  const handleBackToWebsite = () => {
    navigate('/');
  };
  
  // Send friend request
  const handleConnect = async (person) => {
    try {
      // Check if already sent
      if (friendRequests[person.id]) {
        return;
      }
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      // Get latest current user data
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        throw new Error("User data not found");
      }
      
      const freshUserData = userDocSnap.data();
      
      // Get recipient user data
      const recipientRef = doc(db, 'users', person.id);
      const recipientSnap = await getDoc(recipientRef);
      
      if (!recipientSnap.exists()) {
        throw new Error("Recipient user not found");
      }
      
      const recipientData = recipientSnap.data();
      
      // Check if already sent request
      if (freshUserData.sentRequests?.includes(person.id)) {
        // Show notification that request was already sent
        showNotification(`You've already sent a friend request to ${person.name}.`, 'info');
        
        // Update state to show "Request Sent" in UI
        setFriendRequests(prev => ({
          ...prev,
          [person.id]: true
        }));
        
        return;
      }
      
      // Check if already friends
      if (freshUserData.connections?.includes(person.id)) {
        showNotification(`You're already friends with ${person.name}.`, 'info');
        return;
      }
      
      // Create the friend request object
      const friendRequest = {
        id: currentUser.uid,
        username: freshUserData.username,
        profilePictureIndex: freshUserData.profilePictureIndex || 0,
        timestamp: new Date().getTime()
      };
      
      // Update current user's sentRequests
      await updateDoc(userDocRef, {
        sentRequests: arrayUnion(person.id)
      });
      
      // Add the friend request to recipient's friendRequests array
      const updatedFriendRequests = [...(recipientData.friendRequests || []), friendRequest];
      
      await updateDoc(recipientRef, {
        friendRequests: updatedFriendRequests
      });
      
      // Update local state to reflect sent request
      setFriendRequests(prev => ({
        ...prev,
        [person.id]: true
      }));
      
      // Show a success notification
      showNotification(`Friend request sent to ${person.name}!`, 'success');
      
    } catch (err) {
      console.error("Error sending friend request:", err);
      showNotification("Failed to send friend request. Please try again.", 'error');
    }
  };
  
  // Helper function to show notifications
  const showNotification = (message, type = 'success') => {
    const newNotification = {
      id: Date.now(),
      message,
      type
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  };
  
  // Handler for opening the chat page
  const handleMessage = (person) => {
    // Navigate to chat page with the person's information
    navigate(`/chat`, { state: { person } });
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
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`mb-2 p-3 rounded-lg shadow-lg text-white ${
              notification.type === 'success' ? 'bg-green-500' : 
              notification.type === 'error' ? 'bg-red-500' : 
              'bg-blue-500'
            } transition-opacity duration-300 flex items-center`}
          >
            {notification.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : notification.type === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
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
                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                  isScanning 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-amber-700 hover:bg-amber-800 text-white"
                }`}
                disabled={loading}
              >
                {loading ? "Scanning..." : isScanning ? "Stop Scanning" : "Start Scanning"}
              </button>
            </div>
            
            {/* Scrollable container for the people list */}
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1" style={{ maxHeight: '520px' }}>
              {error && (
                <div className="text-center py-4 bg-red-100 rounded-lg text-red-700 mb-4">
                  {error}
                </div>
              )}
              
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
                            src={profileOptions[person.profilePictureIndex]} 
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
                  {loading 
                    ? "Scanning for nearby people..." 
                    : isScanning 
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