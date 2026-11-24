import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Video, FileText, LogOut, 
  CheckSquare, Award, BarChart2, Users, Menu, X 
} from 'lucide-react';

const Sidebar = () => {
  const role = localStorage.getItem('role') || 'student'; 
  const [isOpen, setIsOpen] = useState(true);

  const studentLinks = [
    { path: '/student/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20}/> },
    { path: '/student/courses', name: 'My Courses', icon: <BookOpen size={20}/> },
    { path: '/student/exams', name: 'My Examinations', icon: <FileText size={20}/> },
    { path: '/student/results', name: 'Examination Results', icon: <CheckSquare size={20}/> },
    { path: '/student/certificates', name: 'My Certificates', icon: <Award size={20}/> },
    { path: '/student/materials', name: 'Study Materials', icon: <Video size={20}/> },
  ];

  const teacherLinks = [
    { path: '/teacher/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20}/> },
    { path: '/teacher/courses', name: 'Manage Courses', icon: <BookOpen size={20}/> },
    { path: '/teacher/exams', name: 'Manage Exams', icon: <FileText size={20}/> },
    { path: '/teacher/students', name: 'Student Progress', icon: <Users size={20}/> },
    { path: '/teacher/analytics', name: 'Analytics', icon: <BarChart2 size={20}/> },
  ];

  const links = role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-[#0f172a] text-white flex flex-col shadow-xl z-20 min-h-screen transition-all duration-300 relative`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="absolute -right-3 top-20 bg-blue-600 rounded-full p-1 text-white hover:bg-blue-700 transition"
      >
        {isOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      <div className="h-16 flex items-center justify-center border-b border-slate-700">
        <h1 className={`text-xl font-bold tracking-wider text-blue-400 ${!isOpen && 'hidden'}`}>ExamPro</h1>
        {!isOpen && <BookOpen className="text-blue-400" size={24} />}
      </div>

      <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${!isOpen && 'justify-center'}`
            }
            title={!isOpen ? link.name : ''}
          >
            {link.icon}
            {isOpen && <span>{link.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={() => { localStorage.clear(); window.location.href='/'; }} 
          className={`flex items-center gap-3 text-red-400 hover:text-red-300 w-full px-4 py-2 ${!isOpen && 'justify-center'}`}
        >
          <LogOut size={20} /> {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;