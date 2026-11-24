import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AvailableCourses = () => {
  const navigate = useNavigate();
  const studentId = 1; // Replace with actual logged-in user ID
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('http://localhost:5000/api/enroll', {
        student_id: studentId,
        course_id: courseId
      });
      alert("Successfully Enrolled! Check your dashboard.");
      navigate('/student/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Error enrolling in course");
    }
  };

  const getImageUrl = (url) => {
    return url && url.trim() !== '' ? url : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  if (loading) return <div className="p-10 text-center">Loading courses...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Courses to Enroll</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
            <img src={getImageUrl(course.thumbnail_url)} alt={course.title} className="w-full h-40 object-cover" />
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit mb-2">{course.subject}</span>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-1">{course.description}</p>
              
              <button 
                onClick={() => handleEnroll(course.id)} 
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
              >
                <BookOpen size={18}/> Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCourses;