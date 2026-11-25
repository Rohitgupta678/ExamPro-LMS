import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
//import { Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        ...formData,
        role: role
      });

      if (response.status === 201) {
        alert("Registration Successful! Please login.");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create an Account</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selection */}
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
            type="text" 
            placeholder="Full Name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
          />
          
          <input 
            type="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? 'Registering...' : `Register as ${role}`}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;