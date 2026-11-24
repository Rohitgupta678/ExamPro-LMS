import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, PlayCircle, FileText, CheckCircle } from 'lucide-react';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all courses and find the specific one (or create a specific API endpoint)
    axios.get('http://localhost:5000/api/courses').then(res => {
      const found = res.data.find(c => c.id === parseInt(courseId));
      setCourse(found);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [courseId]);

  if (loading) return <div className="p-10 text-center">Loading course...</div>;
  if (!course) return <div className="p-10 text-center text-red-500">Course not found!</div>;

  // Helper to convert YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url; // For MP4 or already embedded links
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-4">
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white relative">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-blue-100 mb-4">{course.description}</p>
          <div className="flex gap-4 text-sm font-medium">
            <span className="bg-white/20 px-3 py-1 rounded-full">Subject: {course.subject}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Teacher: Prof. Sharma</span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Video & Module Content */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Module 1: Introduction</h2>
            
            {/* Video Player */}
            <div className="bg-black rounded-xl overflow-hidden aspect-video shadow-md relative group">
              {course.video_url ? (
                getEmbedUrl(course.video_url).includes('youtube') ? (
                  <iframe 
                    src={getEmbedUrl(course.video_url)} 
                    title="Course Video" 
                    className="w-full h-full" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video src={course.video_url} controls className="w-full h-full"></video>
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 flex-col">
                  <PlayCircle size={48} className="mb-2 opacity-50" />
                  <p>No video uploaded yet</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border">
               <div className="flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle size={20}/></div>
                 <div>
                   <p className="font-bold text-gray-800">Mark as completed</p>
                   <p className="text-xs text-gray-500">Track your progress</p>
                 </div>
               </div>
               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700">Complete Lesson</button>
            </div>
          </div>

          {/* Right Column: Study Materials */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Study Materials</h2>
            
            <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="text-purple-600" size={24}/>
                <div>
                  <h3 className="font-bold text-purple-900 text-sm">Course Notes (PDF)</h3>
                  <p className="text-xs text-purple-700">Downloadable material</p>
                </div>
              </div>
              {course.pdf_url ? (
                 <a href={course.pdf_url} target="_blank" rel="noreferrer" className="block w-full text-center bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition">
                   Download PDF
                 </a>
              ) : (
                <p className="text-xs text-center text-purple-400">No notes uploaded</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default CourseDetails;