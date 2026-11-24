// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { ArrowLeft, PlayCircle, FileText, CheckCircle, Clock } from 'lucide-react';

// // const StudentCourseView = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [course, setCourse] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     // Fetch the specific course details
// //     axios.get(`http://localhost:5000/api/courses/${id}`)
// //       .then(res => {
// //         setCourse(res.data);
// //         setLoading(false);
// //       })
// //       .catch(err => {
// //         console.error("Error fetching course:", err);
// //         setLoading(false);
// //       });
// //   }, [id]);

// //   if (loading) {
// //     return <div className="flex justify-center items-center h-screen text-gray-500">Loading course details...</div>;
// //   }

// //   if (!course) {
// //     return <div className="flex justify-center items-center h-screen text-red-500">Course not found.</div>;
// //   }

// //   // Fallback Image
// //   const imageUrl = course.thumbnail_url && course.thumbnail_url.trim() !== '' 
// //     ? course.thumbnail_url 
// //     : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

// //   return (
// //     <div className="p-8 bg-gray-50 min-h-screen">
      
// //       {/* Back Button */}
// //       <button 
// //         onClick={() => navigate('/student/dashboard')}
// //         className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-6 transition"
// //       >
// //         <ArrowLeft size={20} /> Back to Dashboard
// //       </button>

// //       {/* Hero Header */}
// //       <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
// //         <div className="h-64 w-full relative">
// //           <img src={imageUrl} alt={course.title} className="w-full h-full object-cover" />
// //           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
// //           <div className="absolute bottom-0 left-0 p-8 text-white">
// //             <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
// //               {course.subject || 'General'}
// //             </span>
// //             <h1 className="text-4xl font-extrabold mt-3">{course.title}</h1>
// //             <p className="text-gray-200 mt-2 max-w-2xl">{course.description}</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main Content Grid */}
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
// //         {/* Left Column: Course Content */}
// //         <div className="lg:col-span-2 space-y-6">
// //           <h2 className="text-2xl font-bold text-gray-800">Course Content</h2>
          
// //           {/* Module 1 */}
// //           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
// //             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
// //               <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><PlayCircle size={20}/></div>
// //               Module 1: Introduction
// //             </h3>
// //             <div className="space-y-3">
// //               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition">
// //                 <div className="flex items-center gap-3">
// //                   <PlayCircle className="text-blue-600" size={24} />
// //                   <span className="font-medium text-gray-700">1.1 Welcome to the Course</span>
// //                 </div>
// //                 <span className="text-sm text-gray-500">10:00 min</span>
// //               </div>
// //               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition">
// //                 <div className="flex items-center gap-3">
// //                   <FileText className="text-purple-600" size={24} />
// //                   <span className="font-medium text-gray-700">1.2 Course Syllabus PDF</span>
// //                 </div>
// //                 <span className="text-sm text-gray-500">Download</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Module 2 */}
// //           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
// //             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
// //               <div className="bg-green-100 text-green-600 p-1.5 rounded-lg"><PlayCircle size={20}/></div>
// //               Module 2: Core Concepts
// //             </h3>
// //             <div className="space-y-3">
// //               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition">
// //                 <div className="flex items-center gap-3">
// //                   <PlayCircle className="text-blue-600" size={24} />
// //                   <span className="font-medium text-gray-700">2.1 Understanding the Basics</span>
// //                 </div>
// //                 <span className="text-sm text-gray-500">15:30 min</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Right Column: Actions & Progress */}
// //         <div className="space-y-6">
// //           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
// //             <h3 className="font-bold text-gray-800 mb-4">Your Progress</h3>
// //             <div className="mb-2 flex justify-between text-sm font-medium text-gray-600">
// //               <span>Completion</span>
// //               <span>65%</span>
// //             </div>
// //             <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
// //               <div className="bg-green-500 h-3 rounded-full" style={{ width: '65%' }}></div>
// //             </div>
            
// //             <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-md">
// //               <PlayCircle size={20}/> Resume Learning
// //             </button>
// //           </div>

// //           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
// //             <h3 className="font-bold text-gray-800 mb-4">Course Materials</h3>
// //             <ul className="space-y-3">
// //               <li className="flex items-center gap-3 text-gray-600 hover:text-blue-600 cursor-pointer">
// //                 <FileText size={18} /> Lecture Notes.pdf
// //               </li>
// //               <li className="flex items-center gap-3 text-gray-600 hover:text-blue-600 cursor-pointer">
// //                 <FileText size={18} /> Assignment 1.docx
// //               </li>
// //             </ul>
// //           </div>

// //           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
// //             <h3 className="font-bold text-gray-800 mb-4">Course Instructor</h3>
// //             <div className="flex items-center gap-3">
// //               <div className="bg-blue-100 text-blue-600 p-3 rounded-full font-bold text-xl">
// //                 PS
// //               </div>
// //               <div>
// //                 <p className="font-semibold text-gray-800">Prof. Sharma</p>
// //                 <p className="text-sm text-gray-500">CS Department</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default StudentCourseView;
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ArrowLeft, PlayCircle, FileText, CheckCircle } from 'lucide-react';

// const StudentCourseView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const studentId = 1; // Replace with actual user ID
  
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isCompleted, setIsCompleted] = useState(false);

//   useEffect(() => {
//     // Fetch course details
//     axios.get(`http://localhost:5000/api/courses`)
//       .then(res => {
//         const foundCourse = res.data.find(c => c.id === parseInt(id));
//         setCourse(foundCourse);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Error fetching course:", err);
//         setLoading(false);
//       });
//   }, [id]);

//   const handleCompleteCourse = async () => {
//     try {
//       await axios.post('http://localhost:5000/api/student/complete-course', {
//         student_id: studentId,
//         course_id: id
//       });
//       setIsCompleted(true);
//       alert("Course Completed! You can now take the exam.");
//       navigate('/student/dashboard'); // Go back to dashboard to see unlocked exam
//     } catch (err) {
//       alert("Error completing course");
//     }
//   };

//   if (loading) return <div className="p-10 text-center">Loading...</div>;
//   if (!course) return <div className="p-10 text-center text-red-500">Course not found.</div>;

//   const imageUrl = course.thumbnail_url && course.thumbnail_url.trim() !== '' 
//     ? course.thumbnail_url 
//     : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-6 transition">
//         <ArrowLeft size={20} /> Back to Dashboard
//       </button>

//       <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
//         <div className="h-64 w-full relative">
//           <img src={imageUrl} alt={course.title} className="w-full h-full object-cover" />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
//           <div className="absolute bottom-0 left-0 p-8 text-white">
//             <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{course.subject || 'General'}</span>
//             <h1 className="text-4xl font-extrabold mt-3">{course.title}</h1>
//             <p className="text-gray-200 mt-2 max-w-2xl">{course.description}</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           <h2 className="text-2xl font-bold text-gray-800">Course Content</h2>
          
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><PlayCircle size={20}/></div> Module 1: Video Lesson
//             </h3>
//             <div className="space-y-3">
//               <a href={course.video_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition">
//                 <div className="flex items-center gap-3"><PlayCircle className="text-blue-600" size={24} /><span className="font-medium text-gray-700">1.1 Watch Video Lesson</span></div>
//                 <span className="text-sm text-gray-500">Click to watch</span>
//               </a>
//               <a href={course.pdf_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition">
//                 <div className="flex items-center gap-3"><FileText className="text-purple-600" size={24} /><span className="font-medium text-gray-700">1.2 Download Notes</span></div>
//                 <span className="text-sm text-gray-500">Download PDF</span>
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDEBAR: ACTION BUTTON */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
//             <h3 className="font-bold text-gray-800 mb-4 text-lg">Completed the Course?</h3>
//             <p className="text-sm text-gray-500 mb-6">Click the button below to unlock the final exam.</p>
            
//             <button 
//               onClick={handleCompleteCourse}
//               className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2 text-lg"
//             >
//               <CheckCircle size={20}/> Mark as Completed
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentCourseView;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, PlayCircle, FileText, CheckCircle } from 'lucide-react';

const StudentCourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Dynamically grab logged-in user ID from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = loggedInUser.id || 1; 
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // 1. Fetch course details
    axios.get(`http://localhost:5000/api/courses`)
      .then(res => {
        const foundCourse = res.data.find(c => c.id === parseInt(id));
        setCourse(foundCourse);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching course:", err);
        setLoading(false);
      });
  }, [id]);

  const handleCompleteCourse = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/student/complete-course', {
        student_id: studentId,
        course_id: parseInt(id)
      });
      
      if (res.status === 200) {
        setIsCompleted(true);
        alert("Course Completed! You can now take the exam.");
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error("Completion error:", err);
      alert("Error completing course. Please check your backend connection.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!course) return <div className="p-10 text-center text-red-500">Course not found.</div>;

  const imageUrl = course.thumbnail_url && course.thumbnail_url.trim() !== '' 
    ? course.thumbnail_url 
    : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-6 transition cursor-pointer">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-64 w-full relative">
          <img src={imageUrl} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{course.subject || 'General'}</span>
            <h1 className="text-4xl font-extrabold mt-3">{course.title}</h1>
            <p className="text-gray-200 mt-2 max-w-2xl">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Course Content</h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><PlayCircle size={20}/></div> Module 1: Video Lesson
            </h3>
            <div className="space-y-3">
              {course.video_url && (
                <a href={course.video_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition">
                  <div className="flex items-center gap-3"><PlayCircle className="text-blue-600" size={24} /><span className="font-medium text-gray-700">1.1 Watch Video Lesson</span></div>
                  <span className="text-sm text-gray-500">Click to watch</span>
                </a>
              )}
              {course.pdf_url && (
                <a href={course.pdf_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition">
                  <div className="flex items-center gap-3"><FileText className="text-purple-600" size={24} /><span className="font-medium text-gray-700">1.2 Download Notes</span></div>
                  <span className="text-sm text-gray-500">Download PDF</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: ACTION BUTTON */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Track your progress</h3>
            <p className="text-sm text-gray-500 mb-6">Click the button below once you have finished the lesson materials.</p>
            
            {/* <button 
              onClick={handleCompleteCourse}
              disabled={isCompleted}
              className={`w-full py-3 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 text-lg cursor-pointer ${
                isCompleted ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <CheckCircle size={20}/> {isCompleted ? 'Completed!' : 'Complete Lesson'}
            </button> */}
            <button 
  onClick={() => {
    alert("Button clicked successfully!");
    handleCompleteCourse();
  }}
  disabled={isCompleted}
  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2 text-lg cursor-pointer"
>
  <CheckCircle size={20}/> {isCompleted ? 'Completed!' : 'Complete Lesson'}
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseView;