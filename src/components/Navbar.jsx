import React from 'react';
import { Link2, CircleUserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext'; // Import the auth context

const Navbar = () => {
    const { currentUser } = useAuth(); // Get current user

    return (
        <nav className="flex justify-between items-center p-4 shadow-light">
            <div className="text-3xl font-darumadrop text-[#DAAA64] transition-all duration-300 hover:text-amber-700 hover:scale-110 hover:rotate-2">
                Social-ish
            </div>

            <div className="flex items-center translate-x- space-x-14">
                <div className="group relative">
                    <Link to="/" className="hover:text-amber-900 text-2xl font-darumadrop transition-colors">
                        Home
                        <div className="absolute left-0 bottom-[-5px] h-[2px] w-0 group-hover:w-full bg-amber-900 transition-all duration-300"></div>
                    </Link>
                </div>
                <div className="group relative">
                    <Link to="/profile" className="hover:text-amber-900 text-2xl font-darumadrop transition-colors">
                        Profile
                        <div className="absolute left-0 bottom-[-5px] h-[2px] w-0 group-hover:w-full bg-amber-900 transition-all duration-300"></div>
                    </Link>
                </div>
                <div className="group relative">
                    <Link to="/friendspage" className="hover:text-amber-900 text-2xl font-darumadrop transition-colors">
                        Friends
                        <div className="absolute left-0 bottom-[-5px] h-[2px] w-0 group-hover:w-full bg-amber-900 transition-all duration-300"></div>
                    </Link>
                </div>
                <div className="group relative">
                    <Link to="/aboutus" className="hover:text-amber-900 text-2xl font-darumadrop transition-colors">
                        About Us
                        <div className="absolute left-0 bottom-[-5px] h-[2px] w-0 group-hover:w-full bg-amber-900 transition-all duration-300"></div>
                    </Link>
                </div>
                <div className="group relative">
                    <Link to="/help" className="hover:text-amber-900 text-2xl font-darumadrop transition-colors">
                        Help
                        <div className="absolute left-0 bottom-[-5px] h-[2px] w-0 group-hover:w-full bg-amber-900 transition-all duration-300"></div>
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {!currentUser ? (
                    <>
                        <Link to="/login" className="font-bold hover:text-amber-700">Login</Link>
                        <Link to="/signup" className="font-bold hover:text-amber-700">Signup</Link>
                    </>
                ) : (
                    <Link to="/profile">
                        <CircleUserRound className="text-black hover:text-amber-700 cursor-pointer" />
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;