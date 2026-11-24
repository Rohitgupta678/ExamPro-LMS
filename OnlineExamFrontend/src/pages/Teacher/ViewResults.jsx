import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, AlertTriangle } from 'lucide-react';

const ViewResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real results from Node.js backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/results')
      .then(res => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching results:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading student results...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Student Results & Proctoring Logs</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-medium">Student</th>
              <th className="p-4 font-medium">Exam</th>
              <th className="p-4 font-medium">Score</th>
              <th className="p-4 font-medium">AI Flags</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No results found in the database yet.</td>
              </tr>
            ) : (
              results.map(res => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-800">{res.student_name}</td>
                  <td className="p-4 text-gray-600">{res.exam_title}</td>
                  <td className="p-4 font-bold text-blue-600">{res.score} / {res.total_marks}</td>
                  <td className="p-4">
                    {/* Note: We will add real warning counts from the DB later */}
                    <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded w-fit">
                      Clean
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="text-blue-600 hover:underline text-sm font-semibold flex items-center gap-1">
                      <Download size={14}/> Excel
                    </button>
                    <button className="text-purple-600 hover:underline text-sm font-semibold">View AI Logs</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ViewResults;