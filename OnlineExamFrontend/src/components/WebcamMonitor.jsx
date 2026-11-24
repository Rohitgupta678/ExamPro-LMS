import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react';

const WebcamMonitor = ({ onWarning }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Initializing...");
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setStatus("Camera Denied");
      }
    };
    startCamera();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append("file", blob, "frame.jpg");
          
          try {
            const res = await axios.post('http://127.0.0.1:8000/analyze_frame', formData);
            const data = res.data;
            
            setStatus(data.status);
            
            if (data.warning) {
              setIsWarning(true);
              // Send warning to the parent Exam.jsx component
              if (onWarning) onWarning(data.warning); 
            } else {
              setIsWarning(false);
            }
          } catch (err) {
            setStatus("Backend Disconnected");
          }
        }, 'image/jpeg', 0.8);
      }
    }, 1000); // Send every 1 second for faster detection

    return () => clearInterval(interval);
  }, [onWarning]);

  return (
    <div className="bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-700 w-full">
      <div className="flex justify-between items-center mb-3 text-white">
        <span className="flex items-center gap-2 font-semibold"><Camera size={18} /> AI Proctoring</span>
        <span className="text-xs text-green-400 animate-pulse">● Live</span>
      </div>
      
      <div className={`relative bg-black rounded-xl overflow-hidden h-48 md:h-64 border-4 transition-colors duration-200 ${isWarning ? 'border-red-500' : 'border-green-500'}`}>
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className={`absolute bottom-0 left-0 right-0 p-3 text-sm font-bold text-center transition-colors duration-200 
          ${isWarning ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {status}
        </div>
      </div>
    </div>
  );
};

export default WebcamMonitor;