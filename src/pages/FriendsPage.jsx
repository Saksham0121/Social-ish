import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, UserCircle, MessageCircle, X, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const FriendsPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // User data state
  const [userData, setUserData] = useState({
    username: "",
    profilePictureIndex: 0,
    connections: [],
    friendRequests: [],
    sentRequests: [] // Added for tracking sent requests
  });

  // Friends and requests state
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [processingRequest, setProcessingRequest] = useState(false);
  const [removingFriend, setRemovingFriend] = useState(false);

  // New states for user search and friend requests
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Profile picture options
  const profileOptions = [
    "src/Assets/blue.jpeg",
    "src/Assets/brown.jpeg",
    "/src/Assets/pink.jpeg",
    "src/Assets/green.jpeg"
  ];

  // Fetch user data and friends on component mount
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
          const userData = userDoc.data();
          setUserData(userData);
          
          // Fetch friend requests
          const friendRequestsData = userData.friendRequests || [];
          setFriendRequests(friendRequestsData);
          
          // Fetch connected friends
          await fetchConnections(userData.connections || []);
        } else {
          setError("User profile not found. Please set up your profile first.");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load friends data. Please try again.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth, navigate]);

  // Fetch connections/friends details
  const fetchConnections = async (connectionIds) => {
    try {
      const friendsData = [];
      
      for (const friendId of connectionIds) {
        const friendDoc = await getDoc(doc(db, 'users', friendId));
        if (friendDoc.exists()) {
          friendsData.push({
            id: friendId,
            ...friendDoc.data()
          });
        }
      }
      
      setFriends(friendsData);
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  // Filter friends based on search term
  const filteredFriends = friends.filter(friend => 
    friend.username && friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle accepting friend request
  const handleAcceptRequest = async (request) => {
    try {
      setProcessingRequest(true);
      const currentUser = auth.currentUser;
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Add the user to connections
      await updateDoc(userDocRef, {
        connections: arrayUnion(request.id),
        friendRequests: userData.friendRequests.filter(req => req.id !== request.id)
      });
      
      // Add current user to requester's connections
      const requesterDocRef = doc(db, 'users', request.id);
      await updateDoc(requesterDocRef, {
        connections: arrayUnion(currentUser.uid),
        sentRequests: arrayRemove(currentUser.uid) // Remove from sent requests
      });
      
      // Update local state
      setFriendRequests(prevRequests => 
        prevRequests.filter(req => req.id !== request.id)
      );
      
      // Add to friends list
      const requesterDoc = await getDoc(requesterDocRef);
      if (requesterDoc.exists()) {
        setFriends(prevFriends => [
          ...prevFriends, 
          { 
            id: request.id, 
            ...requesterDoc.data()
          }
        ]);
      }

      // Update userData state to reflect changes
      setUserData(prev => ({
        ...prev,
        connections: [...prev.connections, request.id],
        friendRequests: prev.friendRequests.filter(req => req.id !== request.id)
      }));
      
      setProcessingRequest(false);
    } catch (err) {
      console.error("Error accepting request:", err);
      setProcessingRequest(false);
      alert("Failed to accept friend request. Please try again.");
    }
  };

  // Handle declining friend request
  const handleDeclineRequest = async (requestId) => {
    try {
      setProcessingRequest(true);
      const currentUser = auth.currentUser;
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Update Firestore
      await updateDoc(userDocRef, {
        friendRequests: userData.friendRequests.filter(req => req.id !== requestId)
      });
      
      // Update local state
      setFriendRequests(prevRequests => 
        prevRequests.filter(req => req.id !== requestId)
      );
      
      // Update the sender's sentRequests
      const senderDocRef = doc(db, 'users', requestId);
      await updateDoc(senderDocRef, {
        sentRequests: arrayRemove(currentUser.uid)
      });

      // Update userData state
      setUserData(prev => ({
        ...prev,
        friendRequests: prev.friendRequests.filter(req => req.id !== requestId)
      }));
      
      setProcessingRequest(false);
    } catch (err) {
      console.error("Error declining request:", err);
      setProcessingRequest(false);
      alert("Failed to decline friend request. Please try again.");
    }
  };

  // Handle removing a friend
  const handleRemoveFriend = async (friendId) => {
    try {
      setRemovingFriend(true);
      const currentUser = auth.currentUser;
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Remove friend from user's connections and sentRequests
      await updateDoc(userDocRef, {
        connections: arrayRemove(friendId),
        sentRequests: arrayRemove(friendId)
      });
      
      // Remove user from friend's connections and their sentRequests 
      const friendDocRef = doc(db, 'users', friendId);
      await updateDoc(friendDocRef, {
        connections: arrayRemove(currentUser.uid),
        sentRequests: arrayRemove(currentUser.uid)
      });
      
      // Also remove from friend's friendRequests if there was a pending request
      // This is to ensure there are no leftover request objects
      const friendDoc = await getDoc(friendDocRef);
      if (friendDoc.exists()) {
        const friendData = friendDoc.data();
        const updatedFriendRequests = (friendData.friendRequests || [])
          .filter(req => req.id !== currentUser.uid);
        
        if (updatedFriendRequests.length !== (friendData.friendRequests || []).length) {
          await updateDoc(friendDocRef, {
            friendRequests: updatedFriendRequests
          });
        }
      }
      
      // Update local state
      setFriends(prevFriends => 
        prevFriends.filter(friend => friend.id !== friendId)
      );
      
      // Update userData state
      setUserData(prev => ({
        ...prev,
        connections: prev.connections.filter(id => id !== friendId),
        sentRequests: (prev.sentRequests || []).filter(id => id !== friendId)
      }));
      
      setRemovingFriend(false);
    } catch (err) {
      console.error("Error removing friend:", err);
      setRemovingFriend(false);
      alert("Failed to remove friend. Please try again.");
    }
  };

  // Handle chat button click
  const handleChatClick = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  // Handle searching for users
  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearchingUsers(true);
      const usersRef = collection(db, "users");
      
      // Query by username (case insensitive-like search)
      const q = query(usersRef, where("username", ">=", searchQuery), where("username", "<=", searchQuery + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      
      const foundUsers = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== auth.currentUser.uid) {
          foundUsers.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });
      
      setSearchResults(foundUsers);
      setSearchingUsers(false);
    } catch (err) {
      console.error("Error searching users:", err);
      setSearchingUsers(false);
      alert("Failed to search for users. Please try again.");
    }
  };

  // Send friend request - FIXED
  const sendFriendRequest = async (userId, username) => {
    try {
      setSendingRequest(true);
      const currentUser = auth.currentUser;
      
      // Get latest current user data
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        throw new Error("User data not found");
      }
      
      const freshUserData = userDocSnap.data();
      
      // Get latest recipient data
      const recipientRef = doc(db, 'users', userId);
      const recipientSnap = await getDoc(recipientRef);
      
      if (!recipientSnap.exists()) {
        throw new Error("Recipient user not found");
      }
      
      const recipientData = recipientSnap.data();
      
      // Check if already sent request with fresh data
      if (freshUserData.sentRequests?.includes(userId)) {
        alert("You've already sent a friend request to this user.");
        setSendingRequest(false);
        return;
      }
      
      // Check if already friends with fresh data
      if (freshUserData.connections?.includes(userId)) {
        alert("You're already friends with this user.");
        setSendingRequest(false);
        return;
      }
      
      // Check if there's already a friend request from this person
      const existingRequest = (recipientData.friendRequests || [])
        .find(req => req.id === currentUser.uid);
      
      if (existingRequest) {
        // Request already exists, probably due to a stale UI state
        alert("A friend request has already been sent to this user.");
        setSendingRequest(false);
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
        sentRequests: arrayUnion(userId)
      });
      
      // Add the friend request to recipient's friendRequests array
      // Use the complete friend request object
      const updatedFriendRequests = [...(recipientData.friendRequests || []), friendRequest];
      
      await updateDoc(recipientRef, {
        friendRequests: updatedFriendRequests
      });
      
      // Update local state
      setUserData({
        ...freshUserData,
        sentRequests: [...(freshUserData.sentRequests || []), userId]
      });
      
      setSendingRequest(false);
      alert(`Friend request sent to ${username}!`);
      
      // Remove the user from search results once request is sent
      setSearchResults(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error("Error sending friend request:", err);
      setSendingRequest(false);
      alert("Failed to send friend request. Please try again.");
    }
  };

  const toggleSearchModal = () => {
    setShowSearchModal(!showSearchModal);
    if (!showSearchModal) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading friends...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-10 overflow-hidden font-[Amethysta]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 transition-all duration-500 ease-in-out"
        style={{ backgroundImage: "url('src/Assets/bgSocialish.png')" }}
      ></div>

      {/* Back Arrow */}
      <ArrowLeft 
        className="absolute top-5 left-5 text-amber-900 cursor-pointer hover:text-amber-700 transition-transform duration-300 transform hover:scale-110"
        size={30}
        onClick={() => navigate('/')}
      />

      {/* Add Friend Button */}
      <button
        className="absolute top-5 right-5 bg-amber-700 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-amber-800 transition-all duration-300"
        onClick={toggleSearchModal}
      >
        <UserPlus size={20} />
        <span>Add Friend</span>
      </button>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-10">
        {/* Friends Section */}
        <div className="w-full md:w-120 bg-[#E2D6C3] rounded-2xl shadow-2xl p-8 transition-transform duration-500 h-120">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-serif text-black transition-all duration-300 ease-in-out transform">
              Friends
            </h2>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#CAB699] w-full block p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10 transition-all duration-300"
              placeholder="Search friends..."
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white transition-transform duration-300" size={18} />
          </div>

          {/* Friends List */}
          <div className="space-y-4 overflow-y-auto h-72 pr-2 scrollbar-custom">
            <style jsx>{`
              .scrollbar-custom::-webkit-scrollbar {
                width: 8px;
              }
              .scrollbar-custom::-webkit-scrollbar-track {
                background: #E2D6C3;
                border-radius: 10px;
              }
              .scrollbar-custom::-webkit-scrollbar-thumb {
                background: #CAB699;
                border-radius: 10px;
                border: 2px solid #E2D6C3;
              }
              .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                background: #B09B7C;
              }
              .scrollbar-custom {
                scrollbar-width: thin;
                scrollbar-color: #CAB699 #E2D6C3;
              }
            `}</style>
            
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div 
                  key={friend.id} 
                  className="bg-[#CAB699] p-3 rounded-lg flex items-center shadow-md justify-between transform transition-transform duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                      <img 
                        src={profileOptions[friend.profilePictureIndex || 0]} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-black text-lg">{friend.username}</span>
                  </div>
                  <div className="flex space-x-3">
                    <MessageCircle 
                      className="w-6 h-6 text-white cursor-pointer hover:text-gray-900 transition-transform duration-300" 
                      onClick={() => handleChatClick(friend.id)}
                    />
                    <X 
                      className="w-6 h-6 text-white cursor-pointer hover:text-red-600 transition-transform duration-300" 
                      onClick={() => handleRemoveFriend(friend.id)}
                      title="Remove friend"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No friends found. Add some friends to get started!</p>
                <button 
                  onClick={toggleSearchModal}
                  className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  Search for Friends
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Requests Section */}
        <div className="w-full md:w-120 bg-[#E2D6C3] rounded-2xl shadow-2xl p-8 transform transition-transform duration-500 h-120">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-serif text-black transition-all duration-300 ease-in-out transform">
              Requests
            </h2>
          </div>
          
          {/* Requests List */}
          <div className="space-y-5 overflow-y-auto h-64 pr-2 scrollbar-custom">
            {friendRequests.length > 0 ? (
              friendRequests.map((request) => (
                <div 
                  key={request.id} 
                  className="bg-[#CAB699] p-3 rounded-lg shadow-md flex flex-col items-center w-full "
                >
                  <div className="flex items-center mb-3 w-full justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                        <img 
                          src={profileOptions[request.profilePictureIndex || 0]} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-black text-lg">{request.username}</span>
                    </div>
                  </div>
                  <div className="flex space-x-4 w-full justify-center">
                    <button 
                      onClick={() => handleAcceptRequest(request)}
                      disabled={processingRequest}
                      className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-800 transition-shadow duration-300 shadow-md hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleDeclineRequest(request.id)}
                      disabled={processingRequest}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-shadow duration-300 shadow-md hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No pending friend requests.</p>
                <p className="mt-2">
                  Share your username from your profile to connect with friends!
                </p>
                <button 
                  onClick={() => navigate('/profile')}
                  className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  Go to Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#E2D6C3] rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-serif text-black">Find Friends</h3>
              <X 
                className="w-6 h-6 cursor-pointer hover:text-gray-700" 
                onClick={toggleSearchModal}
              />
            </div>
            
            <div className="mb-4 flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#CAB699] flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Search by username..."
              />
              <button
                onClick={searchUsers}
                disabled={searchingUsers || !searchQuery.trim()}
                className="bg-amber-700 text-white px-4 py-2 rounded-r-lg hover:bg-amber-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {searchingUsers ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            <div className="mt-4 max-h-64 overflow-y-auto scrollbar-custom">
              {searchResults.length > 0 ? ( 
                searchResults.map((user) => (
                  <div 
                    key={user.id} 
                    className="bg-[#CAB699] mb-2 p-3 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                        <img 
                          src={profileOptions[user.profilePictureIndex || 0]} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-black text-lg">{user.username}</span>
                    </div>
                    <button
                      onClick={() => sendFriendRequest(user.id, user.username)}
                      disabled={sendingRequest}
                      className="px-3 py-1 rounded-lg text-white bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Add Friend
                    </button>
                  </div>
                ))
              ) : searchQuery && !searchingUsers ? (
                <p className="text-center py-2 text-gray-600">No users found with that username.</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;