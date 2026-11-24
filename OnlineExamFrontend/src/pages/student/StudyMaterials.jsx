import React from 'react';
import { Video } from 'lucide-react';

const StudyMaterials = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-purple-50 p-4 rounded-full mb-4">
        <Video size={48} className="text-purple-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Study Materials</h1>
      <p className="text-gray-500 max-w-md">Access PDF notes and video lectures uploaded by your teachers.</p>
    </div>
  );
};

export default StudyMaterials;