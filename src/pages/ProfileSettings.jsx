import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Check, X, Share2, Users, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, updateProfile, updateEmail, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const ProfilePage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    username: "",
    fullname: "",
    email: "",
    dob: "",
    gender: "",
    phoneNo: "",
    status: "Hey there! I'm using Social-ish",
    profilePictureIndex: 0,
    connections: [], // Track connections
    sentRequests: [], // Track sent friend requests
    friendRequests: [] // Track received friend requests
  });

  // Editable fields state
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  // Profile picture options and selection
  const [selectedProfile, setSelectedProfile] = useState(0);
  const profileOptions = [
    "src/Assets/blue.jpeg",
    "src/Assets/brown.jpeg",
    "/src/Assets/pink.jpeg",
    "src/Assets/green.jpeg"
  ];

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is authenticated
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // Get basic info from auth object
        const basicUserData = {
          username: user.displayName?.split(' ')[0] || '',
          fullname: user.displayName || '',
          email: user.email || '',
        };

        // Get additional info from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        let additionalData = {};
        if (userDoc.exists()) {
          additionalData = userDoc.data();
          // Set the selected profile from Firestore if it exists
          if (additionalData.profilePictureIndex !== undefined) {
            setSelectedProfile(additionalData.profilePictureIndex);
          }
        } else {
          // Create user document if it doesn't exist
          await setDoc(userDocRef, {
            userId: user.uid,
            dob: '',
            gender: '',
            phoneNo: user.phoneNumber || '',
            status: "Hey there! I'm using Social-ish",
            profilePictureIndex: 0,
            connections: [],
            sentRequests: [],
            friendRequests: [],
            createdAt: new Date()
          });
        }

        // Merge data
        setUserData({
          ...basicUserData,
          ...additionalData
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data. Please try again.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth, navigate]);

  // Handle searching for users
  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      
      // Query by username (case insensitive search would require a different approach in Firestore)
      const q = query(usersRef, where("username", ">=", searchQuery), where("username", "<=", searchQuery + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      
      const foundUsers = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.userId !== auth.currentUser.uid) {
          foundUsers.push({
            id: doc.id,
            ...userData
          });
        }
      });
      
      setNearbyUsers(foundUsers);
      setLoading(false);
      setShowShareModal(true);
    } catch (err) {
      console.error("Error searching users:", err);
      setLoading(false);
      alert("Failed to search for users. Please try again.");
    }
  };

  // Send friend request
  const sendFriendRequest = async (userId, username) => {
    try {
      setSendingRequest(true);
      const currentUser = auth.currentUser;
      
      // Check if already sent request
      if (userData.sentRequests?.includes(userId)) {
        alert("You've already sent a friend request to this user.");
        setSendingRequest(false);
        return;
      }
      
      // Update current user's sentRequests
      const currentUserRef = doc(db, 'users', currentUser.uid);
      await updateDoc(currentUserRef, {
        sentRequests: arrayUnion(userId)
      });
      
      // Update local state
      setUserData({
        ...userData,
        sentRequests: [...(userData.sentRequests || []), userId]
      });
      
      // Add request to recipient's friendRequests array
      const recipientRef = doc(db, 'users', userId);
      await updateDoc(recipientRef, {
        friendRequests: arrayUnion({
          id: currentUser.uid,
          username: userData.username,
          profilePictureIndex: userData.profilePictureIndex || 0,
          timestamp: new Date().getTime()
        })
      });
      
      setSendingRequest(false);
      alert(`Friend request sent to ${username}!`);
    } catch (err) {
      console.error("Error sending friend request:", err);
      setSendingRequest(false);
      alert("Failed to send friend request. Please try again.");
    }
  };

  // Handle editing field
  const startEditing = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  // Save edited field
  const saveEdit = async () => {
    if (!editingField) return;
    
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);
      
      // Update state optimistically
      setUserData({
        ...userData,
        [editingField]: editValue
      });
      
      // Handle Firebase Auth fields
      if (editingField === 'fullname') {
        await updateProfile(user, { displayName: editValue });
      } else if (editingField === 'email') {
        await updateEmail(user, editValue);
      } else {
        // Update in Firestore
        await updateDoc(userDocRef, {
          [editingField]: editValue
        });
      }
      
      setEditingField(null);
    } catch (err) {
      console.error("Error updating field:", err);
      alert("Failed to update. Please try again.");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingField(null);
  };

  // Save all changes
  const saveAllChanges = async () => {
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);
      
      // Save profile picture selection to Firestore
      await updateDoc(userDocRef, {
        profilePictureIndex: selectedProfile,
        username: userData.username // Ensure username is saved
      });
      
      alert("All changes saved successfully!");
    } catch (err) {
      console.error("Error saving changes:", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Something went wrong while logging out.");
    }
  };
  
  // Fetch sent requests status
  const fetchSentRequests = async () => {
    try {
      const currentSentRequests = userData.sentRequests || [];
      if (currentSentRequests.length === 0) {
        setNearbyUsers([]);
        setShowShareModal(true);
        return;
      }
      
      const sentRequestUsers = [];
      for (const userId of currentSentRequests) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          sentRequestUsers.push({
            id: userId,
            ...userDoc.data()
          });
        }
      }
      
      setNearbyUsers(sentRequestUsers);
      setShowShareModal(true);
    } catch (err) {
      console.error("Error fetching sent requests:", err);
      alert("Failed to load sent requests. Please try again.");
    }
  };

  // Username sharing modal
  const UsernameSharingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-lg md:text-xl font-semibold text-amber-900">Share Username & Add Friends</h3>
          <button 
            onClick={() => setShowShareModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Username display with copy functionality */}
        <div className="mb-4 md:mb-6 bg-amber-50 p-3 md:p-4 rounded-lg">
          <p className="text-gray-600 mb-2 text-sm">Your username:</p>
          <div className="flex items-center justify-between bg-white p-2 rounded border">
            <span className="font-semibold text-base md:text-lg overflow-hidden text-ellipsis">{userData.username}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(userData.username);
                alert('Username copied to clipboard!');
              }}
              className="text-amber-700 hover:text-amber-900 flex-shrink-0 ml-2"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
        
        {/* Search section */}
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search users by username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border rounded-l p-2 md:p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button 
              onClick={searchUsers}
              className="bg-amber-700 text-white py-2 md:py-3 px-3 md:px-4 rounded-r hover:bg-amber-800 transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* User results */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h4 className="font-medium text-amber-900 text-sm md:text-base">Users</h4>
            <div className="flex space-x-2 md:space-x-3">
              <button 
                onClick={fetchSentRequests}
                className="text-amber-700 hover:text-amber-900 text-xs md:text-sm flex items-center"
              >
                <UserPlus size={14} className="mr-1" /> Sent Requests
              </button>
              <button 
                onClick={searchUsers}
                className="text-amber-700 hover:text-amber-900 text-xs md:text-sm flex items-center"
              >
                <Users size={14} className="mr-1" /> All Users
              </button>
            </div>
          </div>
          
          {/* Users list with scrollable area */}
          <div className="overflow-y-auto" style={{ maxHeight: '40vh' }}>
            {nearbyUsers.length > 0 ? (
              nearbyUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 md:p-3 border-b hover:bg-amber-50 transition-colors">
                  <div className="flex items-center overflow-hidden">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden mr-2 md:mr-3 border-2 border-amber-200 flex-shrink-0">
                      <img 
                        src={profileOptions[user.profilePictureIndex || 0]} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium text-gray-800 text-sm md:text-base truncate">{user.username}</p>
                      <p className="text-xs text-gray-500 truncate w-full">{user.status}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => sendFriendRequest(user.id, user.username)}
                    disabled={userData.sentRequests?.includes(user.id) || sendingRequest}
                    className={`px-2 md:px-3 py-1 md:py-2 rounded-full text-xs md:text-sm transition-colors ml-2 flex-shrink-0 ${
                      userData.sentRequests?.includes(user.id) 
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                        : sendingRequest
                          ? 'bg-amber-300 text-white cursor-wait'
                          : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    {userData.sentRequests?.includes(user.id) ? 'Request Sent' : 'Add Friend'}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8 md:py-10 flex flex-col items-center">
                <Users size={32} className="text-gray-300 mb-2" />
                <p className="text-sm">No users found</p>
                <p className="text-xs mt-1">Try searching with a different username</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm md:text-base">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-md max-w-md w-full">
          <p className="text-red-600 mb-4 text-sm md:text-base">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm md:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url('src/Assets/bgSocialish.png')" // Replace with your background image
        }}
      ></div>
      
      <div className="absolute top-4 left-4 z-50">
        <Link to="/" className="flex items-center text-amber-700 hover:text-amber-900">
          <ArrowLeft className="mr-1" size={24} />
        </Link>
      </div>

      <div className="container mx-auto px-4 pt-12 md:pt-16 pb-6 relative z-10">
        {/* Profile section */}
        <div className="bg-[#E2D6C3] rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          {/* Profile header with image */}
          <div className="flex flex-col items-center pt-8 md:pt-12 pb-4 md:pb-6">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
                <img 
                  src={profileOptions[selectedProfile]}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold mt-3 md:mt-4 text-gray-800">{userData.fullname}</h1>
            
            {/* Share Username Button */}
            <button 
              onClick={() => setShowShareModal(true)}
              className="mt-2 flex items-center text-amber-700 hover:text-amber-900 text-sm md:text-base"
            >
              <Share2 size={16} className="mr-1" />
              <span>Share Username & Find Friends</span>
            </button>
          </div>

          {/* Profile details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
            {/* Left side - User details */}
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-lg md:text-xl font-semibold border-b pb-2 text-amber-900">User Information</h2>
              
              {/* Username */}
              <div className="flex justify-between items-center">
                <div className="w-full">
                  <p className="text-xs md:text-sm text-gray-500">Username</p>
                  {editingField === 'username' ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm w-full"
                      />
                      <button onClick={saveEdit} className="ml-2 text-green-600 flex-shrink-0">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600 flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium text-sm md:text-base truncate">{userData.username}</p>
                      <button 
                        onClick={() => startEditing('username', userData.username)}
                        className="ml-2 text-amber-600 hover:text-amber-800 flex-shrink-0"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Full Name */}
              <div className="flex justify-between items-center">
                <div className="w-full">
                  <p className="text-xs md:text-sm text-gray-500">Full Name</p>
                  {editingField === 'fullname' ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm w-full"
                      />
                      <button onClick={saveEdit} className="ml-2 text-green-600 flex-shrink-0">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600 flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium text-sm md:text-base truncate">{userData.fullname}</p>
                      <button 
                        onClick={() => startEditing('fullname', userData.fullname)}
                        className="ml-2 text-amber-600 hover:text-amber-800 flex-shrink-0"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Email */}
              <div className="flex justify-between items-center">
                <div className="w-full">
                  <p className="text-xs md:text-sm text-gray-500">Email</p>
                  {editingField === 'email' ? (
                    <div className="flex items-center">
                      <input
                        type="email"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm w-full"
                      />
                      <button onClick={saveEdit} className="ml-2 text-green-600 flex-shrink-0">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600 flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium text-sm md:text-base truncate">{userData.email}</p>
                      <button 
                        onClick={() => startEditing('email', userData.email)}
                        className="ml-2 text-amber-600 hover:text-amber-800 flex-shrink-0"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Date of Birth */}
              <div className="flex justify-between items-center">
                <div className="w-full">
                  <p className="text-xs md:text-sm text-gray-500">Date of Birth</p>
                  {editingField === 'dob' ? (
                    <div className="flex items-center">
                      <input
                        type="date"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm w-full"
                      />
                      <button onClick={saveEdit} className="ml-2 text-green-600 flex-shrink-0">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600 flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium text-sm md:text-base truncate">{userData.dob || 'Not set'}</p>
                      <button 
                        onClick={() => startEditing('dob', userData.dob || '')}
                        className="ml-2 text-amber-600 hover:text-amber-800 flex-shrink-0"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Gender */}
              <div className="flex justify-between items-center">
                <div className="w-full">
                  <p className="text-xs md:text-sm text-gray-500">Gender</p>
                  {editingField === 'gender' ? (
                    <div className="flex items-center">
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm w-full"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      <button onClick={saveEdit} className="ml-2 text-green-600 flex-shrink-0">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600 flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium text-sm md:text-base truncate">{userData.gender || 'Not set'}</p>
                      <button 
                        onClick={() => startEditing('gender', userData.gender || '')}
                        className="ml-2 text-amber-600 hover:text-amber-800 flex-shrink-0"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Phone Number */}
              <div className="flex justify-between items-center">
                <div className="w-full">
                  <p className="text-xs md:text-sm text-gray-500">Phone Number</p>
                  {editingField === 'phoneNo' ? (
                    <div className="flex items-center">
                      <input
                        type="tel"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm w-full"
                      />
                      <button onClick={saveEdit} className="ml-2 text-green-600 flex-shrink-0">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600 flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium text-sm md:text-base truncate">{userData.phoneNo || 'Not set'}</p>
                      <button 
                        onClick={() => startEditing('phoneNo', userData.phoneNo || '')}
                        className="ml-2 text-amber-600 hover:text-amber-800 flex-shrink-0"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right side - Status and Profile icons */}
            <div>
              {/* Status */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold border-b pb-2 mb-3 md:mb-4 text-amber-900">Status</h2>
                {editingField === 'status' ? (
                  <div>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border rounded p-2 h-24 md:h-32 text-sm"
                      placeholder="Update your status..."
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button 
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs md:text-sm mr-2"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-xs md:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 md:p-4 rounded relative">
                    <p className="text-gray-700 text-sm md:text-base">{userData.status}</p>
                    <button 
                      onClick={() => startEditing('status', userData.status)}
                      className="absolute top-2 right-2 text-amber-600 hover:text-amber-800"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Profile Picture Selection */}
              <div>
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-amber-900">Profile Picture</h2>
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                  {profileOptions.map((profile, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedProfile(index)}
                      className={`cursor-pointer ${selectedProfile === index ? ' rounded-full' : ''}`}
                    >
                      <div className="rounded-full overflow-hidden w-12 h-12 md:w-16 md:h-16">
                        <img 
                          src={profile} 
                          alt={`Profile ${index + 1}`} 
                          className="w-full h-full object-cover"/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save and Logout buttons */}
        <div className="mt-4 flex justify-center md:justify-end px-4 md:px-6 py-4 max-w-4xl mx-auto">
          <button 
            onClick={saveAllChanges}
            className="px-4 md:px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-900 font-medium text-sm md:text-base">
            Save Changes
          </button>
          <button
            onClick={handleLogout}
            className="ml-3 md:ml-4 bg-amber-700 hover:bg-amber-900 text-white px-4 md:px-6 py-2 rounded-md font-medium text-sm md:text-base">
            Logout
          </button>
        </div>
      </div>
      
      {/* Username Sharing Modal */}
      {showShareModal && <UsernameSharingModal />}
    </div>
  );
};

export default ProfilePage;