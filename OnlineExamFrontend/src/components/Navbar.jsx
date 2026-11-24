import React from 'react';
import { Bell, User, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'student'; 
  const name = role === 'teacher' ? 'Prof. Sharma' : 'Rohit';
  
  return (
    <header className="bg-white h-16 shadow-sm border-b border-gray-200 flex items-center justify-between px-8 z-10">
      
      {/* Logo Section */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/${role}/dashboard`)}>
        <div className="bg-blue-600 p-1.5 rounded-md">
           <BookOpen className="text-white" size={18} />
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">ExamPro</span>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-6">
        <h2 className="text-gray-600 font-medium hidden md:block">Welcome back, {name}!</h2>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-1 rounded-lg">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-bold text-gray-800">{name} Gupta</p>
              <p className="text-gray-500 text-xs">{role}@test.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;