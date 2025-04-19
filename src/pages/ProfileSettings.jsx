import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, updateProfile, updateEmail, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';


const ProfilePage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // User data state
  const [userData, setUserData] = useState({
    username: "",
    fullname: "",
    email: "",
    dob: "",
    gender: "",
    phoneNo: "",
    status: "Hey there! I'm using Social-ish",
    profilePictureIndex: 0
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
        profilePictureIndex: selectedProfile
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
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url('src/Assets/bgSocialish.png')" // Replace with your background image
        }}
      ></div>
      
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center text-amber-700 hover:text-amber-900">
          <ArrowLeft className="mr-2" size={30} />
        </Link>
      </div>

      <div className="container mx-auto px-4 pt-16 relative z-10">
        {/* Profile section */}
        <div className="bg-[#E2D6C3] rounded-lg shadow-md overflow-hidden max-w-8xl mx-auto">
          {/* Profile header with image */}
          <div className="flex flex-col items-center pt-12 pb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden  ">
                <img 
                  src={profileOptions[selectedProfile]}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold mt-4 text-gray-800">{userData.fullname}</h1>
          </div>

          {/* Profile details */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Left side - User details */}
            <div className="space-y-4 ml-4">
              <h2 className="text-xl font-semibold border-b pb-2 text-amber-900">User Information</h2>
              
              {/* Username */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{userData.username}</p>
                </div>
              </div>
              
              {/* Full Name */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  {editingField === 'fullname' ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm"
                      />
                      <button onClick={saveEdit} className="ml-2 text-green-600">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium">{userData.fullname}</p>
                      <button 
                        onClick={() => startEditing('fullname', userData.fullname)}
                        className="ml-2 text-amber-600 hover:text-amber-800"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Email */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  {editingField === 'email' ? (
                    <div className="flex items-center">
                      <input
                        type="email"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm"
                      />
                      <button onClick={saveEdit} className="ml-2 text-green-600">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium">{userData.email}</p>
                      <button 
                        onClick={() => startEditing('email', userData.email)}
                        className="ml-2 text-amber-600 hover:text-amber-800"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Date of Birth */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  {editingField === 'dob' ? (
                    <div className="flex items-center">
                      <input
                        type="date"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm"
                      />
                      <button onClick={saveEdit} className="ml-2 text-green-600">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium">{userData.dob || 'Not set'}</p>
                      <button 
                        onClick={() => startEditing('dob', userData.dob || '')}
                        className="ml-2 text-amber-600 hover:text-amber-800"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Gender */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  {editingField === 'gender' ? (
                    <div className="flex items-center">
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      <button onClick={saveEdit} className="ml-2 text-green-600">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium">{userData.gender || 'Not set'}</p>
                      <button 
                        onClick={() => startEditing('gender', userData.gender || '')}
                        className="ml-2 text-amber-600 hover:text-amber-800"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Phone Number */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  {editingField === 'phoneNo' ? (
                    <div className="flex items-center">
                      <input
                        type="tel"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border rounded p-1 text-sm"
                      />
                      <button onClick={saveEdit} className="ml-2 text-green-600">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="ml-1 text-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="font-medium">{userData.phoneNo || 'Not set'}</p>
                      <button 
                        onClick={() => startEditing('phoneNo', userData.phoneNo || '')}
                        className="ml-2 text-amber-600 hover:text-amber-800"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right side - Status and Profile icons */}
            <div>
              {/* Status */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-amber-900">Status</h2>
                {editingField === 'status' ? (
                  <div>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border rounded p-2 h-32"
                      placeholder="Update your status..."
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button 
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm mr-2"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded relative">
                    <p className="text-gray-700">{userData.status}</p>
                    <button 
                      onClick={() => startEditing('status', userData.status)}
                      className="absolute top-2 right-2 text-amber-600 hover:text-amber-800"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Profile Picture Selection */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-amber-900">Profile Picture</h2>
                <div className="grid grid-cols-4 gap-4">
                  {profileOptions.map((profile, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedProfile(index)}
                      className={`cursor-pointer ${selectedProfile === index ? 'border-transparent' : 'border-2 border-transparent'}`}
                    >
                      <div className="rounded-full overflow-hidden w-16 h-16">
                        <img 
                          src={profile} 
                          alt={`Profile ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Save button at bottom */}
        </div>
          <div className="px-6 py-4 flex justify-end">
            <button 
              onClick={saveAllChanges}
              className="px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-900 font-medium">
              Save Changes
            </button>
            <button
              onClick={handleLogout}
              className="ml-4 bg-amber-700 hover:bg-amber-900 text-white px-6 py-2 rounded-md font-medium">
              Logout
            </button>
          </div>
      </div>
    </div>
  );
};

export default ProfilePage;