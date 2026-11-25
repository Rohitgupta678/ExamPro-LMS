// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import DashboardLayout from './layouts/DashboardLayout';


// // Auth
// import Login from './pages/Login';
// import Register from './pages/Register'; // Add this import


// // Student Pages
// import StudentDashboard from './pages/student/StudentDashboard';
// import StudentCourses from './pages/student/StudentCourses';
// import CourseDetails from './pages/student/CourseDetails';
// import StudentResults from './pages/student/StudentResults';
// import AvailableCourses from './pages/student/AvailableCourses';
// import StudyMaterials from './pages/student/StudyMaterials';
// import MyExams from './pages/student/MyExams';
// import StudentProfile from './pages/student/StudentProfile';
// import MyCertificates from './pages/student/MyCertificates';
// import Exam from './pages/student/Exam';
// import StudentCourseView from './pages/student/StudentCourseView';
// //import AvailableCourses from './pages/student/AvailableCourses';




// // Teacher Pages
// import TeacherDashboard from './pages/Teacher/TeacherDashboard';
// import ManageExams from './pages/Teacher/ManageExams';
// import ViewResults from './pages/Teacher/ViewResults';
// import ManageCourses from './pages/Teacher/ManageCourses'; // NEW
// import StudentProgress from './pages/Teacher/StudentProgress'; // NEW
// import Analytics from './pages/Teacher/Analytics'; // NEW

// // Existing Exam Pages (AI Proctoring)
// import Instructions from './pages/Instructions';
// //import Exam from './pages/student/Exam';
// import Result from './pages/Result';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* --- STUDENT ROUTES --- */}
//         <Route element={<DashboardLayout />}>
//           <Route path="/student/dashboard" element={<StudentDashboard />} />
//           <Route path="/student/courses" element={<StudentCourses />} />
//           <Route path="/student/results" element={<StudentResults />} />
//           <Route path="/student/available" element={<AvailableCourses />} />
//           <Route path="/student/materials" element={<StudyMaterials />} />
//           <Route path="/student/exams" element={<MyExams />} />
//           <Route path="/student/profile" element={<StudentProfile />} />
//           <Route path="/student/certificates" element={<MyCertificates />} /> 
//             <Route path="/student/courses/:courseId" element={<CourseDetails />} /> 
//             <Route path="/student/exam/:examId" element={<Exam />} />
//             <Route path="/student/courses/:id" element={<StudentCourseView />} /> 

            




//         </Route>

//         {/* --- TEACHER ROUTES --- */}
//         <Route element={<DashboardLayout />}>
//           <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
//           <Route path="/teacher/exams" element={<ManageExams />} />
//           <Route path="/teacher/results" element={<ViewResults />} />
//           <Route path="/teacher/courses" element={<ManageCourses />} />
//           <Route path="/teacher/students" element={<StudentProgress />} />
//           <Route path="/teacher/analytics" element={<Analytics />} />
//         </Route>

//         {/* --- FULL SCREEN EXAM (AI PROCTORING) --- */}
//         <Route path="/instructions" element={<Instructions />} />
//         <Route path="/exam" element={<Exam />} />
//         <Route path="/result" element={<Result />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';

// Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import CourseDetails from './pages/student/CourseDetails';
import StudentCourseView from './pages/student/StudentCourseView'; // <-- ADDED THIS IMPORT
import StudentResults from './pages/student/StudentResults';
import AvailableCourses from './pages/student/AvailableCourses';
import StudyMaterials from './pages/student/StudyMaterials';
import MyExams from './pages/student/MyExams';
import StudentProfile from './pages/student/StudentProfile';
import MyCertificates from './pages/student/MyCertificates';
import Exam from './pages/student/Exam';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import ManageExams from './pages/Teacher/ManageExams';
import ViewResults from './pages/Teacher/ViewResults';
import ManageCourses from './pages/Teacher/ManageCourses';
import StudentProgress from './pages/Teacher/StudentProgress';
import Analytics from './pages/Teacher/Analytics';

// Existing Exam Pages (AI Proctoring)
import Instructions from './pages/Instructions';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- STUDENT ROUTES --- */}
        <Route element={<DashboardLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/available" element={<AvailableCourses />} />
          <Route path="/student/materials" element={<StudyMaterials />} />
          <Route path="/student/exams" element={<MyExams />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/certificates" element={<MyCertificates />} /> 
          <Route path="/student/courses/:id" element={<StudentCourseView />} /> 
          <Route path="/student/exam/:examId" element={<Exam />} />
        </Route>

        {/* --- TEACHER ROUTES --- */}
        <Route element={<DashboardLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/exams" element={<ManageExams />} />
          <Route path="/teacher/results" element={<ViewResults />} />
          <Route path="/teacher/courses" element={<ManageCourses />} />
          <Route path="/teacher/students" element={<StudentProgress />} />
          <Route path="/teacher/analytics" element={<Analytics />} />
        </Route>

        {/* --- FULL SCREEN EXAM (AI PROCTORING) --- */}
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;