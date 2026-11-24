import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, CheckCircle, XCircle } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total } = location.state || { score: 0, total: 100 };
  const percentage = (score / total) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <Award size={40} />
        </div>
        <h2 className="text-3xl font-bold text-navy mb-2">Exam Completed!</h2>
        <p className="text-gray-500 mb-8">Your responses have been submitted successfully.</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="text-5xl font-bold text-primary mb-2">{score} <span className="text-2xl text-gray-400">/ {total}</span></div>
          <p className="text-gray-600 font-medium">Percentage: {percentage.toFixed(2)}%</p>
        </div>

        <div className="flex justify-center gap-6 mb-8 text-sm">
          <div className="flex flex-col items-center text-green-600">
            <CheckCircle size={24} className="mb-1" />
            <span>{(score/10)} Correct</span>
          </div>
          <div className="flex flex-col items-center text-red-500">
            <XCircle size={24} className="mb-1" />
            <span>{10 - (score/10)} Incorrect</span>
          </div>
        </div>

        <button onClick={() => navigate('/dashboard')} className="w-full bg-navy text-white py-3 rounded-lg font-bold hover:bg-secondary transition">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
export default Result;