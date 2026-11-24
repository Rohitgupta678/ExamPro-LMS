import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
};
export default StatCard;