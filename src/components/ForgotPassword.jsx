import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handler function for navigation
  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      
      // Optional: Automatically redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      let errorMessage = 'Failed to send password reset email';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
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
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('src/Assets/bgSocialish.png')"
        }}
      ></div>
      
      {/* Main Content - Responsive container */}
      <div className="flex flex-1 z-10 justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12 m-2 sm:m-4">
        <div className="flex flex-col md:flex-row w-full max-w-6xl h-auto sm:h-[calc(100vh-120px)] shadow-lg rounded-lg overflow-hidden">
          {/* Left Section with Line Art - Hidden on small screens */}
          <div className="hidden sm:block w-full md:w-1/2 relative">
            <div className="h-full">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url('src/Assets/loginleftwala.png')"
                }}
              ></div>
            </div>
          </div>
          
          {/* Right Section with Form */}
          <div className="w-full md:w-1/2 bg-[#E2D6C3] p-4 sm:p-6 flex flex-col overflow-y-auto">
            {/* Back to Login Button */}
            <div className="self-start mb-4 mt-2 sm:mt-0 sm:translate-y-5 sm:translate-x-5">
              <button 
                onClick={handleBackToLogin} 
                className="text-base sm:text-lg flex items-center text-gray-800 font-medium hover:text-gray-600 transition"
                aria-label="Back to login"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back To Login
              </button>
            </div>
            
            <div className="w-full max-w-md py-2 sm:py-4 mx-auto flex-1 flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-sacramento-regular mb-6 sm:mb-10 text-center sm:text-left sm:-translate-y-10 text-gray-800">
                Reset Password
              </h1>
              
              {message && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{message}</div>}
              {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-800 font-bold mb-1">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 sm:p-3 bg-[#D5C9B6] rounded mb-3 border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Enter your email address"
                    required
                  />
                  <p className="text-sm text-gray-600">We'll send a password reset link to this email</p>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-black text-white p-3 sm:p-4 rounded-xl font-bold hover:bg-gray-900 transition"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Reset Password'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-700">
                  Remember your password?{' '}
                  <Link to="/login" className="text-black font-bold hover:underline transition">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;