import React from 'react';
import { FileText } from 'lucide-react';

const MyExams = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-yellow-50 p-4 rounded-full mb-4">
        <FileText size={48} className="text-yellow-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">My Examinations</h1>
      <p className="text-gray-500 max-w-md">View upcoming exams, read instructions, and start your AI-proctored tests.</p>
    </div>
  );
};

export default MyExams;