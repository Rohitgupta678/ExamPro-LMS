import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Clock, PlayCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyExams = () => {
  const navigate = useNavigate();
  const studentId = 1; // Replace with actual user ID from localStorage if needed

  const [exams, setExams] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ALL exams and the student's ENROLLED courses (to check progress)
        const [examsRes, coursesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/exams'),
          axios.get(`http://localhost:5000/api/student/${studentId}/enrolled-courses`)
        ]);

        setExams(examsRes.data);
        setEnrolledCourses(coursesRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCourseProgress = (courseId) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    return course ? course.progress : 0;
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading exams...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">My Examinations</h1>
        <p className="text-gray-500 mt-1">View and take your available tests. Complete 100% of a course to unlock its exam.</p>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm border text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">No exams available</h3>
          <p className="text-gray-500">Check back later for new exams.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => {
            const progress = getCourseProgress(exam.course_id);
            const isUnlocked = progress === 100;

            return (
              <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    isUnlocked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isUnlocked ? 'Ready' : 'Locked'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1">{exam.title}</h3>
                <p className="text-gray-500 text-sm mb-4">Subject: {exam.subject}</p>

                <div className="flex gap-4 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                  <span className="flex items-center gap-1"><Clock size={16} className="text-blue-500"/> {exam.duration_minutes} mins</span>
                  <span className="flex items-center gap-1"><FileText size={16} className="text-yellow-500"/> {exam.total_marks} marks</span>
                </div>

                {isUnlocked ? (
                  <button 
                    onClick={() => navigate(`/student/exam/${exam.id}`)}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <PlayCircle size={18}/> Start Exam
                  </button>
                ) : (
                  <div>
                    <button 
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2.5 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock size={18}/> Locked
                    </button>
                    <p className="text-xs text-center text-red-500 mt-2">Complete the course to unlock.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyExams;