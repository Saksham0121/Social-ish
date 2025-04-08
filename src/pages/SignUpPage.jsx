import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { auth,db } from '../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

const SignupForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is already signed in, redirect to homepage
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleBackToWebsite = () => {
    navigate('/');  // Navigate to homepage
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      setLoading(false);
      return;
    }

    try {
      // Check if username already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('Username already exists. Please choose another one.');
        setLoading(false);
        return;
      }
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with full name as display name
      await updateProfile(user, {
        displayName: fullName
      });

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        username,
        email,
        createdAt: new Date().toISOString()
      });

      // Redirect to homepage
      navigate('/');
    } catch (error) {
      let errorMessage = 'An error occurred during signup';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#E2D6C3] relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          backgroundImage: "url('src/Assets/bgSocialish.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      
      {/* Main Content - Fixed height with margins */}
      <div className="flex flex-1 z-10 justify-center items-center px-4 md:px-8 lg:px-12 m-4">
        <div className="flex flex-col md:flex-row w-full max-w-6xl h-[calc(100vh-120px)] shadow-lg rounded-lg overflow-hidden">
          {/* Left Section with Line Art and Decorations */}
          <div className="w-full md:w-1/2 relative">
            {/* Abstract line art background - ensure it fits */}
            <div className="h-full">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: "url('src/Assets/loginleftwala.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
            </div>
          </div>
          
          {/* Right Section with Form */}
          <div className="w-full md:w-1/2 bg-[#E2D6C3] p-6 flex flex-col overflow-y-auto">
            {/* Back to Website Button */}
            <div className="self-start mb-4">
              <button 
                onClick={handleBackToWebsite} 
                className="flex items-center text-gray-800 font-medium hover:text-gray-600 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back To Website
              </button>
            </div>
            
            <div className="w-full max-w-md py-4 mx-auto flex-1 flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-script mb-2 text-gray-800">Welcome!</h1>
              <p className="mb-4 text-gray-700">Create A Free Account Or Login To Get Started With Social-Ish</p>
              
              {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block text-gray-800 font-bold mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2 bg-[#D5C9B6] rounded border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-800 font-bold mb-1">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 bg-[#D5C9B6] rounded border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-gray-800 font-bold mb-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-[#D5C9B6] rounded border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>
                
                <div className="mb-4 relative">
                  <label className="block text-gray-800 font-bold mb-1">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 bg-[#D5C9B6] rounded border-none focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10"
                    required
                  />
                  <button 
                    type="button" 
                    className="absolute top-9 right-3 text-gray-700 hover:text-black"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-black text-white p-2 rounded font-bold hover:bg-gray-900 transition"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              
              <div className="mt-3 text-center">
                <p className="text-gray-700">
                  Already Have An Account ? <Link to="/login" className="text-black font-bold underline hover:text-gray-700 transition">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;