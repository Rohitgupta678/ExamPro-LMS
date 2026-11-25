// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const [role, setRole] = useState('student'); // 'student', 'teacher', 'admin'

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // In a real app, you would send email/password to the backend to verify.
//     // For now, we will just save the role and a default ID (1) to localStorage.
    
//     localStorage.setItem('role', role); 
    
//     if (role === 'teacher') navigate('/teacher/dashboard');
//     else if (role === 'admin') navigate('/admin/dashboard');
//     else navigate('/student/dashboard');
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-navy">
//       <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
//         <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">ExamPro Login</h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex gap-2 mb-4">
//             {['student', 'teacher'].map((r) => (
//               <button
//                 type="button"
//                 key={r}
//                 onClick={() => setRole(r)}
//                 className={`flex-1 py-2 rounded-lg font-semibold capitalize ${role === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
//               >
//                 {r}
//               </button>
//             ))}
//           </div>

//           <input type="email" placeholder="Email" defaultValue="test@test.com" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
//           <input type="password" placeholder="Password" defaultValue="123" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
          
//           <button type="submit" className="w-full bg-navy text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition">
//             Login as {role}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
// export default Login;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send request to backend
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        role
      });
      const userData = response.data.user;

      localStorage.setItem('role', role);
      localStorage.setItem('name', userData.name || 'User');
      localStorage.setItem('email', userData.email || email);

      if (response.status === 200) {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('role', response.data.role);
        
        // Redirect based on role
        if (role === 'teacher') navigate('/teacher/dashboard');
        else navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">ExamPro Login</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-4">
            {['student', 'teacher'].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg font-semibold capitalize transition ${
                  role === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? 'Logging in...' : `Login as ${role}`}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;