import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handler functions for navigation
  const handleBackToWebsite = () => {
    navigate('/');  // Navigate to homepage
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Login logic would go here
    console.log('Login attempt with:', username, password);
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
            {/* Back to Website Button */}
            <div className="self-start mb-4 mt-2 sm:mt-0 sm:translate-y-5 sm:translate-x-5">
              <button 
                onClick={handleBackToWebsite} 
                className="text-base sm:text-lg flex items-center text-gray-800 font-medium hover:text-gray-600 transition"
                aria-label="Back to website"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back To Website
              </button>
            </div>
            
            <div className="w-full max-w-md py-2 sm:py-4 mx-auto flex-1 flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-sacramento-regular mb-6 sm:mb-10 text-center sm:text-left sm:-translate-y-10 text-gray-800">
                Welcome Back!
              </h1>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="block text-gray-800 font-bold mb-1">Username</label>
                  <input 
                    id="username"
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 sm:p-3 bg-[#D5C9B6] rounded mb-3 border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-800 font-bold mb-1">Password</label>
                  <div className="relative">
                    <input 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full p-2 sm:p-3 bg-[#D5C9B6] mb-6 sm:mb-10 rounded border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                      required
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 -translate-y-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 -translate-y-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-black text-white p-3 sm:p-4 rounded-xl font-bold hover:bg-gray-900 transition"
                >
                  Login
                </button>
              </form>
              
              <div className="mt-3 text-center sm:text-left">
                <p className="text-gray-700">
                  <Link to="/forgot-password" className="text-black font-bold underline hover:text-gray-700 transition">
                    Forgot Password?
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

export default LoginPage;