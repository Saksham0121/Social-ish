import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProfileSettings = () => {
  // User data state (would normally come from authentication context)
  const [userData, setUserData] = useState({
    username: "johndoe123",
    fullname: "John Doe",
    email: "johndoe@example.com",
    dob: "1990-01-01",
    gender: "Male",
    phoneNo: "+1 234 567 8900",
    status: "Hey there! I'm using Social-ish"
  });

  // Editable fields state
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  // Profile picture options and selection
  const [selectedProfile, setSelectedProfile] = useState(0);
  const profileOptions = [
    "/api/placeholder/100/100",
    "/api/placeholder/100/100",
    "/api/placeholder/100/100",
    "/api/placeholder/100/100"
  ];

  // Handle editing field
  const startEditing = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  // Save edited field
  const saveEdit = () => {
    if (editingField) {
      setUserData({
        ...userData,
        [editingField]: editValue
      });
      setEditingField(null);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingField(null);
  };

  return (
    <div className="max-h-screen bg-gray-50">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('src/Assets/bgSocialish.png')"
        }}
      ></div>
      {/* Background image placeholder - you'll provide this yourself */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex justify-start items-center text-amber-700 hover:text-amber-900">
          <ArrowLeft className="mr-2" size={30} />
        </Link>
      </div>

      

      <div className="container mx-auto px-4 pt-8 relative z-10">
        {/* Back button */}
        {/* <Link to="/" className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-6">
          <ArrowLeft className="mr-2" size={20} />
          <span className="font-medium">Back to Home</span>
        </Link> */}

        {/* Profile section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          {/* Profile header with image */}
          <div className="flex flex-col items-center pt-12 pb-6">
            <div className="relative">
              <img 
                src={profileOptions[selectedProfile]} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-amber-500"
              />
            </div>
            <h1 className="text-2xl font-bold mt-4 text-gray-800">{userData.fullname}</h1>
          </div>

          {/* Profile details */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Left side - User details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2 text-amber-700">User Information</h2>
              
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
                  <p className="font-medium">{userData.fullname}</p>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData.email}</p>
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
                      <p className="font-medium">{userData.dob}</p>
                      <button 
                        onClick={() => startEditing('dob', userData.dob)}
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
                      <p className="font-medium">{userData.gender}</p>
                      <button 
                        onClick={() => startEditing('gender', userData.gender)}
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
                      <p className="font-medium">{userData.phoneNo}</p>
                      <button 
                        onClick={() => startEditing('phoneNo', userData.phoneNo)}
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
                <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-amber-700">Status</h2>
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
                <h2 className="text-xl font-semibold border-b pb-2 mb-4 text-amber-700">Profile Picture</h2>
                <div className="grid grid-cols-4 gap-4">
                  {profileOptions.map((profile, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedProfile(index)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selectedProfile === index ? 'border-amber-500' : 'border-transparent'}`}
                    >
                      <img 
                        src={profile} 
                        alt={`Profile ${index + 1}`} 
                        className="w-full h-16 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Save button at bottom */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;