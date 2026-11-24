import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Clock } from 'lucide-react';

const StudentProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real progress data from the backend
    // For now, we'll simulate fetching combined data from the DB
    const fetchData = async () => {
      try {
        // In a real app, you'd have an API like /api/progress that joins students, courses, exams, and certificates
        // For this demo, we will fetch certificates and courses to show live database data
        const certsRes = await axios.get('http://localhost:5000/api/certificates/1');
        const coursesRes = await axios.get('http://localhost:5000/api/courses');
        
        // Construct a realistic view based on database data
        const liveData = [
          {
            studentName: "Rohit Gupta",
            courseName: coursesRes.data[0]?.title || "Java Programming",
            progress: 100,
            examStatus: "Passed",
            certificate: certsRes.data.length > 0 ? "Issued" : "Pending",
            certCode: certsRes.data[0]?.certificate_code
          },
          {
            studentName: "Sneha Patel",
            courseName: coursesRes.data[1]?.title || "Python Data Science",
            progress: 60,
            examStatus: "Not Attempted",
            certificate: "Pending",
            certCode: null
          }
        ];
        
        setProgressData(liveData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading student progress...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Student Progress & Certificates</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Student</th>
              <th className="p-4 font-semibold">Course</th>
              <th className="p-4 font-semibold">Progress</th>
              <th className="p-4 font-semibold">Exam Status</th>
              <th className="p-4 font-semibold">Certificate</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {progressData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">{row.studentName}</td>
                <td className="p-4 text-gray-600">{row.courseName}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-[80px]">
                      <div className={`h-1.5 rounded-full ${row.progress === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${row.progress}%` }}></div>
                    </div>
                    <span className={`text-xs font-bold ${row.progress === 100 ? 'text-green-600' : 'text-yellow-600'}`}>{row.progress}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`font-bold text-sm px-2 py-1 rounded ${row.examStatus === 'Passed' ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>
                    {row.examStatus}
                  </span>
                </td>
                <td className="p-4">
                  {row.certificate === "Issued" ? (
                    <span className="flex items-center gap-1 text-blue-600 font-bold text-sm"><Award size={16}/> Issued</span>
                  ) : (
                    <span className="text-gray-400 text-sm font-medium">Pending</span>
                  )}
                </td>
                <td className="p-4">
                  {row.certificate === "Issued" ? (
                    <button className="text-blue-600 hover:underline text-sm font-semibold">View Cert</button>
                  ) : (
                    <button className="text-gray-400 text-sm font-semibold cursor-not-allowed">View Cert</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StudentProgress;