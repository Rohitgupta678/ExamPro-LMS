import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ListPlus } from 'lucide-react';

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);

  const [examForm, setExamForm] = useState({ title: '', subject: '', duration_minutes: 60, total_marks: 100, passing_percentage: 40, exam_date: '', course_id: 1 });
  const [qForm, setQForm] = useState({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' });

  const fetchExams = () => {
    axios.get('http://localhost:5000/api/exams').then(res => setExams(res.data));
  };

  useEffect(() => { fetchExams(); }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      // Format the date for MySQL (YYYY-MM-DD HH:MM:SS)
      const formattedDate = new Date(examForm.exam_date).toISOString().slice(0, 19).replace('T', ' ');
      
      await axios.post('http://localhost:5000/api/exams', { ...examForm, exam_date: formattedDate });
      setShowExamModal(false);
      fetchExams();
    } catch (err) { alert("Error creating exam"); }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/questions', { ...qForm, exam_id: selectedExamId });
      alert("Question added successfully!");
      setQForm({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' });
    } catch (err) { alert("Error adding question"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Examinations</h1>
        <button onClick={() => setShowExamModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-semibold shadow-sm">
          <Plus size={18} /> Create New Exam
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-medium">Exam Title</th>
              <th className="p-4 font-medium">Subject</th>
              <th className="p-4 font-medium">Duration</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exams.map(exam => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">{exam.title}</td>
                <td className="p-4 text-gray-600">{exam.subject}</td>
                <td className="p-4 text-gray-600">{exam.duration_minutes} mins</td>
                <td className="p-4">
                  <button onClick={() => { setSelectedExamId(exam.id); setShowQuestionModal(true); }} className="text-green-600 font-semibold text-sm flex items-center gap-1 hover:underline">
                    <ListPlus size={16}/> Add Questions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE EXAM MODAL */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleCreateExam} className="bg-white p-6 rounded-xl w-[500px] shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Create Exam</h2>
            <div className="space-y-3">
              <input required value={examForm.title} onChange={e => setExamForm({...examForm, title: e.target.value})} type="text" placeholder="Exam Title (e.g. Java Final)" className="w-full border p-2 rounded" />
              <input required value={examForm.subject} onChange={e => setExamForm({...examForm, subject: e.target.value})} type="text" placeholder="Subject (e.g. CS101)" className="w-full border p-2 rounded" />
              <div className="flex gap-4">
                <input required value={examForm.duration_minutes} onChange={e => setExamForm({...examForm, duration_minutes: e.target.value})} type="number" placeholder="Duration (mins)" className="w-full border p-2 rounded" />
                <input required value={examForm.total_marks} onChange={e => setExamForm({...examForm, total_marks: e.target.value})} type="number" placeholder="Total Marks" className="w-full border p-2 rounded" />
              </div>
              <div className="flex gap-4">
                <input required value={examForm.passing_percentage} onChange={e => setExamForm({...examForm, passing_percentage: e.target.value})} type="number" placeholder="Passing %" className="w-full border p-2 rounded" />
                <input required value={examForm.exam_date} onChange={e => setExamForm({...examForm, exam_date: e.target.value})} type="datetime-local" className="w-full border p-2 rounded text-gray-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowExamModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Exam</button>
            </div>
          </form>
        </div>
      )}

      {/* ADD QUESTIONS MODAL */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddQuestion} className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add MCQ Question</h2>
              <button type="button" onClick={() => setShowQuestionModal(false)} className="text-gray-400 hover:text-gray-700 font-bold">X</button>
            </div>
            
            <textarea required value={qForm.question_text} onChange={e => setQForm({...qForm, question_text: e.target.value})} placeholder="Enter the question here..." className="w-full border p-3 rounded-lg mb-4 h-20"></textarea>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input required value={qForm.option_a} onChange={e => setQForm({...qForm, option_a: e.target.value})} placeholder="Option A" className="border p-2 rounded" />
              <input required value={qForm.option_b} onChange={e => setQForm({...qForm, option_b: e.target.value})} placeholder="Option B" className="border p-2 rounded" />
              <input required value={qForm.option_c} onChange={e => setQForm({...qForm, option_c: e.target.value})} placeholder="Option C" className="border p-2 rounded" />
              <input required value={qForm.option_d} onChange={e => setQForm({...qForm, option_d: e.target.value})} placeholder="Option D" className="border p-2 rounded" />
            </div>

            <div className="mb-6">
              <label className="text-sm font-bold text-gray-700 mb-2 block">Correct Answer:</label>
              <select value={qForm.correct_option} onChange={e => setQForm({...qForm, correct_option: e.target.value})} className="border p-2 rounded w-full bg-gray-50">
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">Save Question & Add Another</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default ManageExams;