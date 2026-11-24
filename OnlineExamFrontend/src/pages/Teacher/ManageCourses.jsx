import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Video, FileText } from 'lucide-react';

const ManageCourses = () => {
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null); 

  const initialFormState = { title: '', subject: '', description: '', thumbnail_url: '', video_url: '', pdf_url: '' };
  const [formData, setFormData] = useState(initialFormState);

  const fetchCourses = () => {
    axios.get('http://localhost:5000/api/courses').then(res => setCourses(res.data));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/courses/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/courses', formData);
      }
      setShowModal(false);
      setFormData(initialFormState);
      setEditingId(null);
      fetchCourses(); 
    } catch (err) { alert("Error saving course"); }
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title || '',
      subject: course.subject || '',
      description: course.description || '',
      thumbnail_url: course.thumbnail_url || '',
      video_url: course.video_url || '',
      pdf_url: course.pdf_url || ''
    });
    setEditingId(course.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this course?")) {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      fetchCourses();
    }
  };

  const getImageUrl = (url) => {
    if (url && url.trim() !== '') return url;
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-800">Course Management</h1>
        <button onClick={() => { setFormData(initialFormState); setEditingId(null); setShowModal(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 font-semibold shadow-md transition">
          <Plus size={18} /> Create New Course
        </button>
      </div>

      {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="course-card-fixed bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition">
            {/* Fixed Image */}
            <img 
              src={getImageUrl(course.thumbnail_url)} 
              alt={course.title} 
              className="course-image-fixed group-hover:scale-105 transition-transform duration-500" 
            />
            
            {/* Fixed Content */}
            <div className="course-content-fixed">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="course-title-fixed text-lg font-bold text-gray-800">{course.title}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                    <button onClick={() => handleEdit(course)} className="text-blue-600 bg-blue-50 p-1.5 rounded-md hover:bg-blue-100"><Edit size={14}/></button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-600 bg-red-50 p-1.5 rounded-md hover:bg-red-100"><Trash2 size={14}/></button>
                  </div>
                </div>
                <p className="course-desc-fixed text-sm text-gray-500 mb-4">{course.description}</p>
              </div>
              
              <div className="flex gap-2">
                <a href={course.video_url || '#'} target="_blank" rel="noreferrer" className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-xs font-bold flex justify-center items-center gap-1.5 hover:bg-blue-100 transition"><Video size={14}/> Video</a>
                <a href={course.pdf_url || '#'} target="_blank" rel="noreferrer" className="flex-1 bg-purple-50 text-purple-700 py-2 rounded-lg text-xs font-bold flex justify-center items-center gap-1.5 hover:bg-purple-100 transition"><FileText size={14}/> PDF</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Code remains unchanged... */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingId ? 'Edit Course' : 'Create New Course'}</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} type="text" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24"></textarea>
              </div>
              
              <div className="grid grid-cols-1 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Media Links</p>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Thumbnail Image URL</label>
                  <input value={formData.thumbnail_url} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} type="url" placeholder="https://example.com/image.jpg" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Video Lesson URL</label>
                  <input value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} type="url" placeholder="https://youtube.com/..." className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">PDF Notes URL</label>
                  <input value={formData.pdf_url} onChange={e => setFormData({...formData, pdf_url: e.target.value})} type="url" placeholder="https://drive.google.com/..." className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-md transition">{editingId ? 'Update Course' : 'Publish Course'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;