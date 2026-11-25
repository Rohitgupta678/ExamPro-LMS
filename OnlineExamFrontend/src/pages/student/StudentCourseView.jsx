// // // import React, { useState, useEffect } from 'react';
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import axios from 'axios';
// // // import { ArrowLeft, PlayCircle, FileText, CheckCircle } from 'lucide-react';

// // // const StudentCourseView = () => {
// // //   const { id } = useParams();
// // //   const navigate = useNavigate();
  
// // //   // Get student ID (defaults to 1 if not found in localStorage)
// // //   const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
// // //   const studentId = loggedInUser.id || 1; 
  
// // //   const [course, setCourse] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [isCompleted, setIsCompleted] = useState(false);

// // //   useEffect(() => {
// // //     // Fetch course details
// // //     axios.get(`http://localhost:5000/api/courses`)
// // //       .then(res => {
// // //         const foundCourse = res.data.find(c => c.id === parseInt(id));
// // //         setCourse(foundCourse);
// // //         setLoading(false);
// // //       })
// // //       .catch(err => {
// // //         console.error("Error fetching course:", err);
// // //         setLoading(false);
// // //       });
// // //   }, [id]);

// // //   const handleCompleteCourse = async () => {
// // //     console.log("=== BUTTON CLICKED ===");
// // //     console.log("Sending data:", { student_id: studentId, course_id: id });

// // //     try {
// // //       const res = await axios.post('http://127.0.0.1:5000/api/student/complete-course', {
// // //         student_id: parseInt(studentId),
// // //         course_id: parseInt(id)
// // //       });
      
// // //       console.log("=== SERVER RESPONSE ===");
// // //       console.log(res.data);
      
// // //       setIsCompleted(true);
// // //       alert("Success! Course marked as completed. The exam is now unlocked.");
// // //       navigate('/student/dashboard');
      
// // //     } catch (err) {
// // //       console.log("=== ERROR ===");
// // //       console.log(err);
// // //       alert(`Error: ${err.response?.data?.message || err.message}`);
// // //     }
// // //   };

// // //   if (loading) return <div className="p-10 text-center">Loading...</div>;
// // //   if (!course) return <div className="p-10 text-center text-red-500">Course not found.</div>;

// // //   const imageUrl = course.thumbnail_url && course.thumbnail_url.trim() !== '' 
// // //     ? course.thumbnail_url 
// // //     : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

// // //   return (
// // //     <div className="p-8 bg-gray-50 min-h-screen">
// // //       <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-6 transition cursor-pointer">
// // //         <ArrowLeft size={20} /> Back to Dashboard
// // //       </button>

// // //       {/* Hero Header */}
// // //       <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
// // //         <div className="h-64 w-full relative">
// // //           <img src={imageUrl} alt={course.title} className="w-full h-full object-cover" />
// // //           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
// // //           <div className="absolute bottom-0 left-0 p-8 text-white">
// // //             <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{course.subject || 'General'}</span>
// // //             <h1 className="text-4xl font-extrabold mt-3">{course.title}</h1>
// // //             <p className="text-gray-200 mt-2 max-w-2xl">{course.description}</p>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
// // //         {/* Left Column: Content */}
// // //         <div className="lg:col-span-2 space-y-6">
// // //           <h2 className="text-2xl font-bold text-gray-800">Course Content</h2>
// // //           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
// // //             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
// // //               <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><PlayCircle size={20}/></div> Module 1: Video Lesson
// // //             </h3>
// // //             <div className="space-y-3">
// // //               {course.video_url && (
// // //                 <a href={course.video_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition">
// // //                   <div className="flex items-center gap-3"><PlayCircle className="text-blue-600" size={24} /><span className="font-medium text-gray-700">1.1 Watch Video Lesson</span></div>
// // //                   <span className="text-sm text-gray-500">Click to watch</span>
// // //                 </a>
// // //               )}
// // //               {course.pdf_url && (
// // //                 <a href={course.pdf_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition">
// // //                   <div className="flex items-center gap-3"><FileText className="text-purple-600" size={24} /><span className="font-medium text-gray-700">1.2 Download Notes</span></div>
// // //                   <span className="text-sm text-gray-500">Download PDF</span>
// // //                 </a>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Right Column: Action Button */}
// // //         <div className="space-y-6">
// // //           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
// // //             <h3 className="font-bold text-gray-800 mb-4 text-lg">Track your progress</h3>
// // //             <p className="text-sm text-gray-500 mb-6">Click the button below once you have finished the lesson materials to unlock the exam.</p>
            
// // //             <button 
// // //               onClick={handleCompleteCourse}
// // //               disabled={isCompleted}
// // //               className={`w-full py-3 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 text-lg cursor-pointer ${
// // //                 isCompleted 
// // //                   ? 'bg-gray-400 text-white cursor-not-allowed' 
// // //                   : 'bg-blue-600 text-white hover:bg-blue-700' 
// // //               }`}
// // //             >
// // //               <CheckCircle size={20}/> {isCompleted ? 'Completed!' : 'Complete Lesson'}
// // //             </button>
// // //           </div>
// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default StudentCourseView;
// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { ArrowLeft, PlayCircle, FileText, CheckCircle } from 'lucide-react';

// // const StudentCourseView = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
  
// //   // Get student ID safely from localStorage
// //   const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
// //   const studentId = loggedInUser.id || 1; 
  
// //   const [course, setCourse] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [isCompleted, setIsCompleted] = useState(false);

// //   useEffect(() => {
// //     // Fetch course details
// //     axios.get(`http://localhost:5000/api/courses`)
// //       .then(res => {
// //         const foundCourse = res.data.find(c => c.id === parseInt(id));
// //         setCourse(foundCourse);
// //         setLoading(false);
// //       })
// //       .catch(err => {
// //         console.error("Error fetching course:", err);
// //         setLoading(false);
// //       });
// //   }, [id]);

// //   const handleCompleteCourse = async () => {
// //     try {
// //       await axios.post('http://127.0.0.1:5000/api/student/complete-course', {
// //         student_id: parseInt(studentId),
// //         course_id: parseInt(id)
// //       });
      
// //       setIsCompleted(true);
// //       alert("Success! Course marked as completed. The exam is now unlocked.");
// //       navigate('/student/dashboard');
      
// //     } catch (err) {
// //       console.error(err);
// //       alert(`Error: ${err.response?.data?.message || err.message}`);
// //     }
// //   };

// //   if (loading) return <div className="p-10 text-center text-gray-500">Loading course details...</div>;
// //   if (!course) return <div className="p-10 text-center text-red-500">Course not found.</div>;

// //   const imageUrl = course.thumbnail_url && course.thumbnail_url.trim() !== '' 
// //     ? course.thumbnail_url 
// //     : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

// //   return (
// //     <div className="p-8 bg-gray-50 min-h-screen">
      
// //       {/* Back Button */}
// //       <button 
// //         onClick={() => navigate('/student/dashboard')} 
// //         className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-6 transition cursor-pointer"
// //       >
// //         <ArrowLeft size={20} /> Back to Dashboard
// //       </button>

// //       {/* Hero Header Banner */}
// //       <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
// //         <div className="h-64 w-full relative">
// //           <img src={imageUrl} alt={course.title} className="w-full h-full object-cover" />
// //           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
// //           <div className="absolute bottom-0 left-0 p-8 text-white">
// //             <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
// //               {course.subject || 'General'}
// //             </span>
// //             <h1 className="text-4xl font-extrabold mt-3">{course.title}</h1>
// //             <p className="text-gray-200 mt-2 max-w-2xl text-sm md:text-base">{course.description}</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main Grid Layout */}
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
// //         {/* Left Column: Course Content */}
// //         <div className="lg:col-span-2 space-y-6">
// //           <h2 className="text-2xl font-bold text-gray-800">Course Content</h2>
// //           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
// //             <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
// //               <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><PlayCircle size={20}/></div> 
// //               Module 1: Video Lesson
// //             </h3>
            
// //             <div className="space-y-3">
// //               {course.video_url ? (
// //                 <a 
// //                   href={course.video_url} 
// //                   target="_blank" 
// //                   rel="noreferrer" 
// //                   className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition"
// //                 >
// //                   <div className="flex items-center gap-3">
// //                     <PlayCircle className="text-blue-600" size={24} />
// //                     <span className="font-medium text-gray-700">1.1 Watch Video Lesson</span>
// //                   </div>
// //                   <span className="text-sm text-gray-500 font-medium">Click to watch</span>
// //                 </a>
// //               ) : (
// //                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-400 text-sm">
// //                   No video link provided for this course.
// //                 </div>
// //               )}

// //               {course.pdf_url && (
// //                 <a 
// //                   href={course.pdf_url} 
// //                   target="_blank" 
// //                   rel="noreferrer" 
// //                   className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition"
// //                 >
// //                   <div className="flex items-center gap-3">
// //                     <FileText className="text-purple-600" size={24} />
// //                     <span className="font-medium text-gray-700">1.2 Download Notes</span>
// //                   </div>
// //                   <span className="text-sm text-gray-500 font-medium">Download PDF</span>
// //                 </a>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Right Column: Progress & Completion Card */}
// //         <div className="space-y-6">
// //           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
// //             <h3 className="font-bold text-gray-800 mb-2 text-lg">Track your progress</h3>
// //             <p className="text-sm text-gray-500 mb-6">Click the button below once you have finished the lesson materials to unlock the exam[cite: 8].</p>
            
// //             <button 
// //               onClick={handleCompleteCourse}
// //               disabled={isCompleted}
// //               className={`w-full py-3.5 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 text-base cursor-pointer ${
// //                 isCompleted 
// //                   ? 'bg-gray-400 text-white cursor-not-allowed' 
// //                   : 'bg-blue-600 text-white hover:bg-blue-700' 
// //               }`}
// //             >
// //               <CheckCircle size={20}/> {isCompleted ? 'Completed!' : 'Complete Lesson'}
// //             </button>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // // export default StudentCourseView;
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ArrowLeft, PlayCircle, FileText, CheckCircle } from 'lucide-react';

// const StudentCourseView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   // Get student ID safely from localStorage
//   const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const studentId = loggedInUser.id || 1; 
  
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
//       await axios.post('http://127.0.0.1:5000/api/student/complete-course', {
//         student_id: parseInt(studentId),
//         course_id: parseInt(id)
//       });
      
//       setIsCompleted(true);
//       alert("Success! Course marked as completed. The exam is now unlocked.");
//       navigate('/student/dashboard');
      
//     } catch (err) {
//       console.error(err);
//       alert(`Error: ${err.response?.data?.message || err.message}`);
//     }
//   };

//   if (loading) return <div className="p-10 text-center text-gray-500">Loading course details...</div>;
//   if (!course) return <div className="p-10 text-center text-red-500">Course not found.</div>;

//   // Helper to convert YouTube watch URLs to embed format if needed
//   const getEmbedUrl = (url) => {
//     if (!url) return '';
//     if (url.includes('embed/')) return url;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
      
//       {/* Back Button */}
//       <button 
//         onClick={() => navigate('/student/dashboard')} 
//         className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-6 transition cursor-pointer"
//       >
//         <ArrowLeft size={20} /> Back to Dashboard
//       </button>

//       {/* Main Grid Layout matching your screenshot */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* Left Column: Module & Video Player */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-bold text-gray-800">Module 1: Introduction</h2>
//           </div>

//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            
//             {/* Video Player Box */}
//             <div className="relative w-full h-[380px] bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
//               {course.video_url ? (
//                 <iframe 
//                   src={getEmbedUrl(course.video_url)} 
//                   title={course.title}
//                   className="w-full h-full border-0"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 ></iframe>
//               ) : (
//                 <div className="text-white text-center p-6">
//                   <PlayCircle size={48} className="mx-auto mb-2 text-blue-500" />
//                   <p>No video available for this course.</p>
//                 </div>
//               )}
//             </div>

//             {/* Mark as Completed Bar inside the video card area */}
//             <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm mt-4">
//               <div className="flex items-center gap-3">
//                 <div className="text-green-600"><CheckCircle size={24} /></div>
//                 <div>
//                   <h4 className="font-bold text-gray-800 text-sm">Mark as completed</h4>
//                   <p className="text-xs text-gray-500">Track your progress</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={handleCompleteCourse}
//                 disabled={isCompleted}
//                 className={`px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer ${
//                   isCompleted 
//                     ? 'bg-gray-400 text-white cursor-not-allowed' 
//                     : 'bg-blue-600 text-white hover:bg-blue-700' 
//                 }`}
//               >
//                 {isCompleted ? 'Completed!' : 'Complete Lesson'}
//               </button>
//             </div>

//           </div>
//         </div>

//         {/* Right Column: Study Materials Card */}
//         <div className="space-y-6">
//           <h2 className="text-xl font-bold text-gray-800">Study Materials</h2>
          
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
//             <div className="flex items-start gap-3 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
//               <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mt-0.5">
//                 <FileText size={20} />
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-800 text-sm">Course Notes (PDF)</h4>
//                 <p className="text-xs text-gray-500 mt-0.5">Downloadable material</p>
//               </div>
//             </div>

//             {course.pdf_url ? (
//               <a 
//                 href={course.pdf_url} 
//                 target="_blank" 
//                 rel="noreferrer"
//                 className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition shadow-md flex items-center justify-center gap-2 cursor-pointer block text-center"
//               >
//                 Download PDF
//               </a>
//             ) : (
//               <div className="text-center text-xs text-gray-400 py-2">
//                 No PDF notes attached.
//               </div>
//             )}
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
import { ArrowLeft, PlayCircle, FileText, CheckCircle, BookOpen, User } from 'lucide-react';

const StudentCourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Safely retrieve student ID from localStorage (checks user object or direct studentId)
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = loggedInUser.id || localStorage.getItem('studentId') || 1; 
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Fetch course details
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
    console.log("=== COMPLETING COURSE ===", { student_id: parseInt(studentId), course_id: parseInt(id) });
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/student/complete-course', {
        student_id: parseInt(studentId),
        course_id: parseInt(id)
      });
      
      console.log("=== RESPONSE ===", res.data);
      setIsCompleted(true);
      alert("Success! Course marked as completed. The exam is now unlocked.");
      navigate('/student/dashboard');
      
    } catch (err) {
      console.error("Error completing course:", err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading course details...</div>;
  if (!course) return <div className="p-10 text-center text-red-500">Course not found.</div>;

  // Helper to convert YouTube watch URLs to embed format if needed
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/student/dashboard')} 
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-6 transition cursor-pointer"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      {/* Clean Subject & Teacher Blue Banner */}
      <div className="bg-blue-600 text-white px-6 py-3.5 rounded-xl shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <BookOpen size={18} />
          <span className="font-semibold text-sm">Subject: <span className="font-normal">{course.subject || 'General'}</span></span>
        </div>
        <div className="flex items-center gap-2.5">
          <User size={18} />
          <span className="font-semibold text-sm">Teacher: <span className="font-normal">{course.teacher_name || 'Prof. Sharma'}</span></span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Module & Video Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Module 1: Introduction</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            
            {/* Video Player Box */}
            <div className="relative w-full h-[380px] bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
              {course.video_url ? (
                <iframe 
                  src={getEmbedUrl(course.video_url)} 
                  title={course.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-white text-center p-6">
                  <PlayCircle size={48} className="mx-auto mb-2 text-blue-500" />
                  <p>No video available for this course.</p>
                </div>
              )}
            </div>

            {/* Mark as Completed Bar */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm mt-4">
              <div className="flex items-center gap-3">
                <div className="text-green-600"><CheckCircle size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Mark as completed</h4>
                  <p className="text-xs text-gray-500">Track your progress to unlock exam</p>
                </div>
              </div>
              <button 
                onClick={handleCompleteCourse}
                disabled={isCompleted}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer ${
                  isCompleted 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700' 
                }`}
              >
                {isCompleted ? 'Completed!' : 'Complete Lesson'}
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Study Materials Card */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Study Materials</h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mt-0.5">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Course Notes (PDF)</h4>
                <p className="text-xs text-gray-500 mt-0.5">Downloadable material</p>
              </div>
            </div>

            {course.pdf_url ? (
              <a 
                href={course.pdf_url} 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition shadow-md flex items-center justify-center gap-2 cursor-pointer block text-center"
              >
                Download PDF
              </a>
            ) : (
              <div className="text-center text-xs text-gray-400 py-2">
                No PDF notes attached.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentCourseView;