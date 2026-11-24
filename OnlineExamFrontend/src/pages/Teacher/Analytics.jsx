import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/StatCard';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Java', students: 40, passed: 35 },
  { name: 'Python', students: 30, passed: 22 },
  { name: 'Web Dev', students: 50, passed: 40 },
];

const pieData = [
  { name: 'Passed', value: 97 },
  { name: 'Failed', value: 23 },
];
const COLORS = ['#22c55e', '#ef4444'];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Platform Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="120" icon={<Users size={24} className="text-blue-600"/>} color="bg-blue-100" />
        <StatCard title="Courses Created" value="3" icon={<BookOpen size={24} className="text-purple-600"/>} color="bg-purple-100" />
        <StatCard title="Certificates Issued" value="35" icon={<Award size={24} className="text-yellow-600"/>} color="bg-yellow-100" />
        <StatCard title="Avg. Pass Rate" value="80%" icon={<TrendingUp size={24} className="text-green-600"/>} color="bg-green-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Course Enrollments vs Passes</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Enrolled" />
                <Bar dataKey="passed" fill="#22c55e" radius={[4, 4, 0, 0]} name="Passed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Overall Exam Results</h2>
          <div className="h-72 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;