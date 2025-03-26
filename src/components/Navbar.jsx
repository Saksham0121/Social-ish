import React from 'react';
import { Link2, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center p-4  shadow-light">
            <div className="text-2xl font-bold text-orange-500">Social-ish</div>


            <div className="flex items-center translate-x- space-x-14">
                <div className="group relative">
                    <a href="#" className="hover:text-orange-500 transition-colors">
                        Home
                        <div className="absolute left-0 bottom-[-5px] h-[2px] w-0 group-hover:w-full bg-orange-500 transition-all duration-300"></div>
                    </a>
                </div>
                <div className="group relative">
                    <a href="#" className="hover:text-orange-500 transition-colors">
                        Settings
                        <div className="absolute left-0 bottom-[-5px] h-[2px] w-0 group-hover:w-full bg-orange-500 transition-all duration-300"></div>
                    </a>
                </div>
                <div className="group relative">
                    <a href="#" className="hover:text-orange-500 transition-colors">
                        Friends
                        <div className="absolute left-0 bottom-[-5px] h-[2px] w-0 group-hover:w-full bg-orange-500 transition-all duration-300"></div>
                    </a>
                </div>
                <div className="group relative">
                    <a href="#" className="hover:text-orange-500 transition-colors">
                        About Us
                        <div className="absolute left-0 bottom-[-5px] h-[2px] w-0 group-hover:w-full bg-orange-500 transition-all duration-300"></div>
                    </a>
                </div>
                <div className="group relative">
                    <a href="#" className="hover:text-orange-500 transition-colors">
                        Help
                        <div className="absolute left-0 bottom-[-5px] h-[2px] w-0 group-hover:w-full bg-orange-500 transition-all duration-300"></div>
                    </a>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-orange-500">Login</Link>
                <Link to="/signup" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Signup</Link>
                <User className="text-gray-600 hover:text-orange-500 cursor-pointer" />
            </div>


        </nav>
    );
};

export default Navbar;