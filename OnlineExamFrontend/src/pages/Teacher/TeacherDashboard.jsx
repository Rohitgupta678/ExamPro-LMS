import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../../components/StatCard';
import { Users, FileText, BookOpen, AlertTriangle } from 'lucide-react';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, examsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/courses'),
          axios.get('http://localhost:5000/api/exams')
        ]);
        
        setCourses(coursesRes.data);
        setExams(examsRes.data);
        
        // Mock results (Replace with real /api/results endpoint)
        setResults([{ id: 1, studentId: 1, studentName: 'Rohit Gupta', examId: examsRes.data[0]?.id || 1, score: 85, totalMarks: 100, warnings: 2 }]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading teacher data...</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-500">Manage your courses and monitor student exams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Courses" value={courses.length} icon={<BookOpen size={24} className="text-blue-600"/>} color="bg-blue-100" />
        <StatCard title="Total Students" value="45" icon={<Users size={24} className="text-green-600"/>} color="bg-green-100" />
        <StatCard title="Exams Created" value={exams.length} icon={<FileText size={24} className="text-purple-600"/>} color="bg-purple-100" />
        <StatCard title="AI Alerts Flagged" value="3" icon={<AlertTriangle size={24} className="text-red-600"/>} color="bg-red-100" />
      </div>

      {/* Recent Results with AI Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Exam Submissions & AI Flags</h2>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4 font-medium">Student Name</th>
                <th className="p-4 font-medium">Exam</th>
                <th className="p-4 font-medium">Score</th>
                <th className="p-4 font-medium">AI Warnings</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map(res => {
                const exam = exams.find(e => e.id === res.examId);
                return (
                  <tr key={res.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{res.studentName}</td>
                    <td className="p-4 text-gray-600">{exam?.title || 'Exam'}</td>
                    <td className="p-4 font-bold text-green-600">{res.score}/{res.totalMarks}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${res.warnings > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {res.warnings} Warnings
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:underline text-sm font-semibold">View Log</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;