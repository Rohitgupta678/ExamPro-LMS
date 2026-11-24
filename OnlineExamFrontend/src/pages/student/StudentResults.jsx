import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, CheckCircle, XCircle } from 'lucide-react';

const StudentResults = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real exams from MySQL
        const examsRes = await axios.get('http://localhost:5000/api/exams');
        setExams(examsRes.data);

        // Mocking student results for now (Student ID 1)
        // Later, you can create an endpoint /api/results/1 to fetch this from MySQL
        setResults([
          { id: 1, studentId: 1, examId: 1, score: 85, totalMarks: 100, completedAt: "2026-11-20T10:30:00" },
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading results...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Exam Results</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-medium">Exam Name</th>
              <th className="p-4 font-medium">Score</th>
              <th className="p-4 font-medium">Percentage</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.map(res => {
              // Find the exam title from the database data
              const exam = exams.find(e => e.id === res.examId);
              const percentage = (res.score / res.totalMarks) * 100;
              const isPass = percentage >= 40; // You can change this passing mark

              return (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-800">{exam?.title || 'Unknown Exam'}</td>
                  <td className="p-4 font-bold text-gray-800">{res.score} / {res.totalMarks}</td>
                  <td className="p-4 text-blue-600 font-semibold">{percentage.toFixed(1)}%</td>
                  <td className="p-4">
                    {isPass ? (
                      <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded w-fit"><CheckCircle size={16}/> Passed</span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded w-fit"><XCircle size={16}/> Failed</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-semibold">
                      <Download size={16}/> PDF Report
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StudentResults;