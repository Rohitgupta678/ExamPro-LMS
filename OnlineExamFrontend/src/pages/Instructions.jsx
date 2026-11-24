import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Play, ArrowLeft } from 'lucide-react';

const Instructions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const exam = location.state?.exam || { title: "Sample Exam", duration: 60, totalMarks: 100 };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-100">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h2>
        <div className="flex gap-6 text-gray-600 mb-8 border-b pb-6 font-medium">
          <span>Duration: <b className="text-gray-900">{exam.duration} mins</b></span>
          <span>Total Marks: <b className="text-gray-900">{exam.totalMarks}</b></span>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-100">
          <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-4 text-lg">
            <AlertCircle size={20}/> Examination Rules
          </h3>
          <ul className="list-disc ml-5 text-gray-700 space-y-3">
            <li>Do not refresh the page or close the tab during the exam.</li>
            <li>The timer will start immediately after clicking "Start Exam".</li>
            <li>You can navigate between questions using the palette.</li>
            <li>Ensure you have a stable internet connection before proceeding.</li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/exam')}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Play size={20} /> Start Exam Now
        </button>
      </div>
    </div>
  );
};

export default Instructions;