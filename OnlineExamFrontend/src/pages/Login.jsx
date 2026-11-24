import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student'); // 'student', 'teacher', 'admin'

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('role', role); // Save role for Sidebar to read
    
    if (role === 'teacher') navigate('/teacher/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">ExamPro Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-4">
            {['student', 'teacher'].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg font-semibold capitalize ${role === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {r}
              </button>
            ))}
          </div>

          <input type="email" placeholder="Email" defaultValue="test@test.com" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          <input type="password" placeholder="Password" defaultValue="123" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          
          <button type="submit" className="w-full bg-navy text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition">
            Login as {role}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;