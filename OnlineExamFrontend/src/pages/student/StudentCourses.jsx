import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, FileText, Video, BookOpen } from 'lucide-react';

const StudentCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch live courses from the Express/MySQL backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading your courses...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Enrolled Courses</h1>
      
      {courses.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-bold text-gray-600">No courses enrolled yet</h2>
          <p className="text-gray-500">Go to "Available Courses" to enroll in new subjects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{course.title}</h2>
              <p className="text-sm text-gray-500 mb-4">Subject: {course.subject}</p>
              <p className="text-gray-600 mb-6 text-sm">{course.description}</p>
              
              <div className="space-y-2">
                <button 
                  onClick={() => navigate(`/student/courses/${course.id}`)} 
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  <Video size={18}/> Watch Lectures
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 p-3 rounded-lg font-medium hover:bg-gray-100 transition border border-gray-200">
                  <FileText size={18}/> Download Notes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;