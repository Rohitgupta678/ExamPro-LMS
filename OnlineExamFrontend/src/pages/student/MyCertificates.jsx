// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Award, Download, Printer } from 'lucide-react';

// const MyCertificates = () => {
//   const [certificates, setCertificates] = useState([]);
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     // Fetch student certificates (Assuming Student ID 1 is logged in)
//     axios.get('http://localhost:5000/api/certificates/1').then(res => {
//       setCertificates(res.data);
//     });

//     // Fetch courses to get course titles
//     axios.get('http://localhost:5000/api/courses').then(res => {
//       setCourses(res.data);
//     });
//   }, []);

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-gray-800">My Certificates</h1>
      
//       {certificates.length === 0 ? (
//         <div className="text-center p-10 bg-white rounded-xl shadow-sm border">
//           <Award size={48} className="mx-auto text-gray-300 mb-4" />
//           <h2 className="text-lg font-bold text-gray-600">No certificates yet</h2>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {certificates.map(cert => {
//             const course = courses.find(c => c.id === cert.course_id);
//             return (
//               <div key={cert.id} className="bg-white rounded-xl shadow-md border-t-8 border-blue-600 p-8 relative overflow-hidden">
//                 {/* Watermark */}
//                 <Award size={150} className="absolute -right-10 -bottom-10 text-blue-50 opacity-50" />
                
//                 <div className="relative z-10">
//                   <div className="flex justify-between items-start mb-6">
//                     <div>
//                       <h2 className="text-xl font-bold text-gray-800">Certificate of Completion</h2>
//                       <p className="text-gray-500 text-sm">ExamPro LMS</p>
//                     </div>
//                     <Award size={32} className="text-blue-600" />
//                   </div>

//                   <p className="text-sm text-gray-500 mb-1">This is to certify that</p>
//                   <h3 className="text-2xl font-extrabold text-blue-800 mb-4">Rohit Gupta</h3>
                  
//                   <p className="text-sm text-gray-500 mb-1">has successfully completed the course</p>
//                   <h4 className="text-lg font-bold text-gray-800 mb-6">{course?.title || 'Course'}</h4>

//                   <div className="flex justify-between items-end border-t border-gray-200 pt-4 mt-8">
//                     <div>
//                       <p className="text-xs text-gray-400">Certificate ID</p>
//                       <p className="font-mono text-sm font-bold text-gray-700">{cert.certificate_code}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-gray-400">Issue Date</p>
//                       <p className="font-bold text-gray-700">{new Date(cert.issue_date).toLocaleDateString()}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-2 mt-6">
//                     <button className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"><Download size={16}/> Download PDF</button>
//                     <button className="flex-1 flex justify-center items-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200"><Printer size={16}/> Print</button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };
// export default MyCertificates;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Award, Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  const certificateRefs = useRef({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = user.id || 1;

    axios.get(`http://localhost:5000/api/certificates/${studentId}`)
      .then(res => setCertificates(res.data))
      .catch(err => console.error("Error fetching certificates:", err));

    axios.get('http://localhost:5000/api/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error("Error fetching courses:", err));
  }, []);

  const handleDownloadPDF = async (cert, courseTitle) => {
    const element = certificateRefs.current[cert.id];
    if (!element) return;

    try {
      setDownloadingId(cert.id);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 5, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${courseTitle.replace(/\s+/g, '_')}_${cert.certificate_code}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to download certificate PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePrint = (certId) => {
    const printContent = certificateRefs.current[certId];
    if (!printContent) return;
    
    const winPrint = window.open('', '', 'width=1100,height=800');
    winPrint.document.write('<html><head><title>Certificate</title>');
    winPrint.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    winPrint.document.write('</head><body class="flex justify-center items-center h-screen bg-white">');
    winPrint.document.write(printContent.innerHTML);
    winPrint.document.write('</body></html>');
    winPrint.document.close();
    winPrint.focus();
    setTimeout(() => {
      winPrint.print();
      winPrint.close();
    }, 500);
  };

  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const studentName = loggedInUser.fullName || loggedInUser.name || 'Rohit Manikchand Gupta';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-gray-800">My Certificates</h1>
      
      {certificates.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Award size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-bold text-gray-600">No certificates yet</h2>
        </div>
      ) : (
        <div className="space-y-10">
          {certificates.map(cert => {
            const course = courses.find(c => c.id === cert.course_id);
            const courseTitle = course?.title || cert.course_title || 'Web Design & Development';

            return (
              <div key={cert.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                
                {/* Certificate Render Container with Safe Hex Colors */}
                <div 
                  ref={el => certificateRefs.current[cert.id] = el}
                  className="p-10 relative text-center font-serif"
                  style={{ 
                    width: '100%', 
                    minHeight: '620px', 
                    backgroundColor: '#fffdf9',
                    border: '10px double #1e3a8a',
                    color: '#1f2937'
                  }}
                >
                  {/* Header / College Branding */}
                  <div className="relative z-10 mb-4">
                    <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#1e3a8a' }}>Kandivli Education Society's</p>
                    <h2 className="text-lg font-extrabold tracking-wide mt-1" style={{ color: '#090d16' }}>
                      B. K. SHROFF COLLEGE OF ARTS &amp; M. H. SHROFF COLLEGE OF COMMERCE
                    </h2>
                    <p className="text-[11px] mt-1" style={{ color: '#4b5563' }}>
                      Autonomous College • NAAC Re-accredited 'A' Grade • ISO 9001:2015 Certified
                    </p>
                  </div>

                  <hr style={{ borderTop: '2px solid #d97706', width: '70%', margin: '15px auto' }} />

                  {/* Certificate Title */}
                  <div className="relative z-10 my-3">
                    <h1 className="text-2xl font-bold uppercase tracking-wider" style={{ color: '#1e3a8a' }}>Certificate of Completion</h1>
                    <p className="text-xs italic mt-0.5" style={{ color: '#6b7280' }}>Value-added Certificate Course</p>
                  </div>

                  {/* Body Content */}
                  <div className="relative z-10 space-y-2 my-4">
                    <p className="text-sm italic" style={{ color: '#4b5563' }}>This is to certify that</p>
                    
                    <h3 className="text-2xl font-bold" style={{ color: '#172554', textDecoration: 'underline', textDecorationColor: '#d97706' }}>
                      {studentName}
                    </h3>
                    
                    <p className="text-sm" style={{ color: '#374151' }}>
                      of <span className="font-semibold">B.Sc INFORMATION TECHNOLOGY</span> programme
                    </p>
                    
                    <p className="text-xs" style={{ color: '#6b7280' }}>
                      Class: <b>FYBScIT</b> &nbsp;|&nbsp; Div: <b>A</b> &nbsp;|&nbsp; Roll No.: <b>FDIT057A</b>
                    </p>

                    <p className="text-sm mt-2" style={{ color: '#4b5563' }}>has successfully completed the course on</p>
                    
                    <h4 className="text-xl font-bold" style={{ color: '#9a3412' }}>{courseTitle}</h4>
                    
                    <p className="text-xs" style={{ color: '#4b5563' }}>
                      and has earned <b style={{ color: '#1e3a8a' }}>'2' Credit</b> in the Academic Year <b>2023 - 2024</b> (Duration: 32 Hours).
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="relative z-10 flex justify-between items-end mt-10 pt-4 text-xs" style={{ borderTop: '1px solid #d1d5db' }}>
                    <div className="text-left">
                      <p className="font-mono font-bold" style={{ color: '#374151' }}>{cert.certificate_code || 'KES/EXPRO/2026/084'}</p>
                      <p className="text-[10px]" style={{ color: '#9ca3af' }}>Certificate Reference ID</p>
                    </div>

                    <div className="text-center">
                      <p className="text-base font-bold" style={{ color: '#1e3a8a', fontFamily: 'cursive' }}>Dr. V. S. Kannan</p>
                      <div style={{ borderTop: '1px solid #9ca3af', width: '130px', margin: '2px auto 0', paddingTop: '2px', color: '#4b5563' }}>Controller of Examination</div>
                    </div>

                    <div className="text-center">
                      <p className="text-base font-bold" style={{ color: '#1e3a8a', fontFamily: 'cursive' }}>Dr. L. Bhushan</p>
                      <div style={{ borderTop: '1px solid #9ca3af', width: '130px', margin: '2px auto 0', paddingTop: '2px', color: '#4b5563' }}>Principal</div>
                    </div>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-3 p-4 bg-gray-50 border-t border-gray-200">
                  <button 
                    onClick={() => handleDownloadPDF(cert, courseTitle)}
                    disabled={downloadingId === cert.id}
                    className="flex-1 flex justify-center items-center gap-2 bg-blue-900 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-950 transition cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    <Download size={18}/> 
                    {downloadingId === cert.id ? 'Generating PDF...' : 'Download Official PDF'}
                  </button>
                  <button 
                    onClick={() => handlePrint(cert.id)}
                    className="flex-1 flex justify-center items-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition cursor-pointer shadow-sm"
                  >
                    <Printer size={18}/> Print Certificate
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;