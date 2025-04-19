import React, { useState } from 'react';
import { FaSearch, FaUserCircle, FaCommentDots, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import for routing

const FriendsPage = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([
    { id: 1, username: 'Unnati Sachdeva' },
    { id: 2, username: 'Saksham Sahu' },
    { id: 3, username: 'Medha Dikshit' },
    { id: 4, username: 'Saransh Sethi' }
  ]);

  const [friendRequests, setFriendRequests] = useState([
    { id: 1, username: 'Tanisha Gupta' },
    { id: 2, username: 'Ishita Singh' },
    { id: 3, username: 'Shaurya Bansal' },
  ]);

  // Filter friends based on search term
  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcceptRequest = (requestId) => {
    const requestToAccept = friendRequests.find(request => request.id === requestId);
    
    setFriendRequests(friendRequests.filter(request => request.id !== requestId));
    
    setFriends([...friends, { 
      id: requestToAccept.id, 
      username: requestToAccept.username 
    }]);
  };

  const handleDeclineRequest = (requestId) => {
    setFriendRequests(friendRequests.filter(request => request.id !== requestId));
  };

  // Handle chat button click
  const handleChatClick = () => {
    navigate(`/chat/`); // Navigate to chat page with friend ID
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-10 overflow-hidden font-[Amethysta]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 transition-all duration-500 ease-in-out"
        style={{ backgroundImage: "url('src/Assets/bgSocialish.png')" }}
      ></div>

      {/* Back Arrow */}
      <FaArrowLeft 
        className="absolute top-5 left-5 text-[#4D2C27] text-3xl cursor-pointer hover:text-gray-600 transition-transform duration-300 transform hover:scale-110"
        onClick={() => navigate('/')} // Using navigate instead of direct location change
      />

      <div className="relative z-10 w-full max-w-5xl flex justify-center space-x-10">
        {/* Friends Section */}
        <div className="w-6/12 bg-[#E2D6C3] rounded-2xl shadow-2xl p-8 transition-transform duration-500 ">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-font-serif text-black transition-all duration-300 ease-in-out transform">
              Friends
            </h2>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#CAB699] w-full block p-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 transition-all duration-300"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white transition-transform duration-300" />
          </div>

          {/* Friends List */}
          <div className="space-y-4">
            {filteredFriends.map((friend) => (
              <div 
                key={friend.id} 
                className="bg-[#CAB699] p-3 rounded-lg flex items-center shadow-md justify-between transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center">
                  <FaUserCircle className="w-10 h-10 text-white mr-4 transition-all duration-300 ease-in-out transform hover:scale-125" />
                  <span className="font-medium text-black text-lg">{friend.username}</span>
                </div>
                <FaCommentDots 
                  className="w-6 h-6 text-white cursor-pointer hover:text-gray-900 transition-transform duration-300" 
                  onClick={() => handleChatClick(friend.id)} // Added click handler
                />
              </div>
            ))}
          </div>
        </div>

        {/* Requests Section */}
        <div className="w-6/12 bg-[#E2D6C3] rounded-2xl shadow-2xl p-8 transform transition-transform duration-500">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-font-serif text-black transition-all duration-300 ease-in-out transform ">
              Requests
            </h2>
          </div>
          <div className="space-y-5">
            {friendRequests.map((request) => (
              <div 
                key={request.id} 
                className="bg-[#CAB699] p-3 rounded-lg shadow-md flex flex-col items-center w-10/12 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-3 w-full justify-between">
                  <div className="flex items-center">
                    <FaUserCircle className="w-10 h-10 text-white mr-4 transition-all duration-300 ease-in-out transform hover:scale-125" />
                    <span className="font-medium text-black text-lg">{request.username}</span>
                  </div>
                </div>
                <div className="flex space-x-4 w-full justify-center">
                  <button 
                    onClick={() => handleAcceptRequest(request.id)}
                    className="bg-[#B9A58C] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#A4957C] transition-shadow duration-300 shadow-md hover:shadow-xl"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleDeclineRequest(request.id)}
                    className="bg-[#B9A58C] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#A4957C] transition-shadow duration-300 shadow-md hover:shadow-xl"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;