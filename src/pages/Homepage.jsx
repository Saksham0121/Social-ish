import React from 'react';
import { UserCircle } from 'lucide-react';

const Homepage = () => {
  return (
    <div className="flex flex-col h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 to-amber-700 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-wider text-center">Social-ish</h1>

          <div className="flex items-center gap-4">
            <button className="hover:underline">Login</button>
            <button className="hover:underline">Signup</button>
            <div className="bg-white rounded-full p-1">
              <UserCircle className="h-6 w-6 text-amber-900" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-amber-800 bg-opacity-90 px-4 py-2 text-white shadow-md">
        <div className="container mx-auto flex justify-center gap-8">
          <a href="#" className="text-xl font-semibold hover:underline">Home</a>
          <a href="#" className="text-xl font-semibold hover:underline">Settings</a>
          <a href="#" className="text-xl font-semibold hover:underline">Friends</a>
          <a href="#" className="text-xl font-semibold hover:underline">About Us</a>
          <a href="#" className="text-xl font-semibold hover:underline">Help</a>
        </div>
      </nav>

      {/* Main Content - Network Visualization */}
      <main className="flex-1 relative">
        {/* Network Visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 800 500">
            {/* Lines connecting nodes */}
            <line x1="200" y1="150" x2="300" y2="250" stroke="#5D4037" strokeWidth="2" />
            <line x1="200" y1="150" x2="100" y2="250" stroke="#5D4037" strokeWidth="2" />
            <line x1="100" y1="250" x2="50" y2="350" stroke="#5D4037" strokeWidth="2" />
            <line x1="100" y1="250" x2="200" y2="350" stroke="#5D4037" strokeWidth="2" />
            <line x1="100" y1="250" x2="150" y2="400" stroke="#5D4037" strokeWidth="2" />
            <line x1="400" y1="150" x2="300" y2="250" stroke="#5D4037" strokeWidth="2" />
            <line x1="400" y1="150" x2="500" y2="250" stroke="#5D4037" strokeWidth="2" />
            <line x1="400" y1="150" x2="350" y2="350" stroke="#5D4037" strokeWidth="2" />
            <line x1="350" y1="350" x2="500" y2="350" stroke="#5D4037" strokeWidth="2" />
            <line x1="600" y1="150" x2="500" y2="350" stroke="#5D4037" strokeWidth="2" />
            <line x1="600" y1="150" x2="700" y2="250" stroke="#5D4037" strokeWidth="2" />
            <line x1="700" y1="250" x2="650" y2="350" stroke="#5D4037" strokeWidth="2" />
            <line x1="600" y1="400" x2="500" y2="350" stroke="#5D4037" strokeWidth="2" />
            <line x1="500" y1="350" x2="300" y2="250" stroke="#5D4037" strokeWidth="2" />
            <line x1="500" y1="350" x2="450" y2="450" stroke="#5D4037" strokeWidth="2" />

            {/* Main nodes */}
            <g transform="translate(200,150)">
              <circle cx="0" cy="0" r="50" fill="#4E342E" />
              <text x="0" y="5" fill="#E0E0E0" textAnchor="middle" fontSize="14">Interests</text>
            </g>
            <g transform="translate(400,150)">
              <circle cx="0" cy="0" r="50" fill="#4E342E" />
              <text x="0" y="5" fill="#E0E0E0" textAnchor="middle" fontSize="14">Games</text>
            </g>
            <g transform="translate(600,150)">
              <circle cx="0" cy="0" r="50" fill="#E0E0E0" />
              <text x="0" y="5" fill="#4E342E" textAnchor="middle" fontSize="14">Find People</text>
            </g>
            <g transform="translate(100,250)">
              <circle cx="0" cy="0" r="50" fill="#4E342E" />
              <text x="0" y="5" fill="#E0E0E0" textAnchor="middle" fontSize="14">Calm Zone</text>
            </g>
            <g transform="translate(350,350)">
              <circle cx="0" cy="0" r="50" fill="#4E342E" />
              <text x="0" y="5" fill="#E0E0E0" textAnchor="middle" fontSize="14">Music</text>
            </g>
            <g transform="translate(500,350)">
              <circle cx="0" cy="0" r="50" fill="#4E342E" />
              <text x="0" y="5" fill="#E0E0E0" textAnchor="middle" fontSize="14">Icebreakers</text>
            </g>

            {/* Small nodes */}
            <circle cx="50" cy="350" r="15" fill="#4E342E" />
            <circle cx="150" cy="400" r="15" fill="#4E342E" />
            <circle cx="300" cy="250" r="15" fill="#4E342E" />
            <circle cx="450" cy="450" r="15" fill="#4E342E" />
            <circle cx="650" cy="350" r="15" fill="#4E342E" />
            <circle cx="700" cy="250" r="15" fill="#4E342E" />
          </svg>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-amber-100 py-4 text-center text-amber-900">
        <p className="text-2xl font-semibold">"Just The Right Amount Of Social."</p>
      </footer>
    </div>
  );
};

export default Homepage;