import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatCard from '../../components/StatCard';
import { BookOpen, CheckCircle, Clock, FileText, PlayCircle, Lock } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const studentId = 1; // Replace with actual logged-in user ID
  
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch enrolled courses (now includes progress) and all exams
        const [coursesRes, examsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/student/${studentId}/enrolled-courses`),
          axios.get('http://localhost:5000/api/exams')
        ]);
        
        setCourses(coursesRes.data);
        setExams(examsRes.data);
        setResults([{ id: 1, examId: examsRes.data[0]?.id || 1, score: 85, totalMarks: 100, studentId: 1 }]); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImageUrl = (url) => {
    if (url && url.trim() !== '') return url;
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  // Helper to find the progress of the course linked to an exam
  const getCourseProgress = (examCourseId) => {
    const enrolledCourse = courses.find(c => c.id === examCourseId);
    return enrolledCourse ? enrolledCourse.progress : 0;
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading dashboard data...</div>;

  return (
    <div className="space-y-8 pb-10 p-6 bg-gray-50 min-h-screen">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Enrolled Courses" value={courses.length} icon={<BookOpen size={24} className="text-blue-600"/>} color="bg-blue-100" />
        <StatCard title="Available Exams" value={exams.length} icon={<Clock size={24} className="text-yellow-600"/>} color="bg-yellow-100" />
        <StatCard title="Exams Completed" value={results.length} icon={<CheckCircle size={24} className="text-green-600"/>} color="bg-green-100" />
        <StatCard title="Average Score" value="85%" icon={<FileText size={24} className="text-purple-600"/>} color="bg-purple-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Courses & Results */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">My Enrolled Courses</h2>
              <button onClick={() => navigate('/student/available')} className="text-blue-600 text-sm font-semibold hover:underline">+ Enroll New Course</button>
            </div>
            
            {courses.length === 0 ? (
              <div className="bg-white p-10 rounded-xl shadow-sm border text-center">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-700">No courses enrolled yet</h3>
                <button onClick={() => navigate('/student/available')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 mt-4">Browse Courses</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition group">
                    <div className="h-32 relative overflow-hidden bg-gray-100">
                      <img src={getImageUrl(course.thumbnail_url)} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                      
                      {/* REAL PROGRESS BAR */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${course.progress || 0}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-4">
                        <span>Progress</span><span>{course.progress || 0}%</span>
                      </div>
                      
                      <button onClick={() => navigate(`/student/courses/${course.id}`)} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold group-hover:bg-blue-600 transition">
                        <PlayCircle size={16}/> Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Results Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Recent Results</h2>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-medium">Exam Name</th>
                  <th className="p-4 font-medium">Score</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map(res => {
                  const exam = exams.find(e => e.id === res.examId);
                  const pct = (res.score / res.totalMarks) * 100;
                  return (
                    <tr key={res.id} className="hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-800">{exam?.title || 'Exam'}</td>
                      <td className="p-4 font-bold text-blue-600">{res.score} / {res.totalMarks}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${pct >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {pct >= 40 ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="p-4">
                         <button onClick={() => navigate('/student/results')} className="text-blue-600 text-sm font-semibold hover:underline">View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Upcoming Exams (WITH LOCK LOGIC) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Exams</h2>
          
          {exams.map(exam => {
            // Check if student has 100% progress in the course linked to this exam
            const progress = getCourseProgress(exam.course_id);
            const isUnlocked = progress === 100;

            return (
              <div key={exam.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition relative overflow-hidden">
                <h3 className="font-bold text-gray-800 text-lg">{exam.title}</h3>
                <p className="text-gray-500 text-sm mb-4">Subject: {exam.subject || 'General'}</p>
                
                <div className="flex gap-4 text-sm text-gray-600 mb-5 bg-gray-50 p-3 rounded-lg">
                  <span className="flex items-center gap-1"><Clock size={16} className="text-blue-500"/> {exam.duration_minutes} mins</span>
                  <span className="flex items-center gap-1"><FileText size={16} className="text-yellow-500"/> {exam.total_marks} marks</span>
                </div>
                
                {/* LOCK / UNLOCK BUTTON LOGIC */}
                {isUnlocked ? (
                  <button 
                    onClick={() => navigate(`/student/exam/${exam.id}`)}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Start Exam
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button 
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2.5 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock size={16}/> Locked
                    </button>
                    <p className="text-xs text-center text-red-500 font-medium">Complete 100% of the course to unlock</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;