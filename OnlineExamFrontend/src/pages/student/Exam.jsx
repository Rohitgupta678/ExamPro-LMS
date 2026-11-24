import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, AlertTriangle, ShieldAlert, Loader } from 'lucide-react';
import WebcamMonitor from '../../components/WebcamMonitor';

const Exam = () => {
  const navigate = useNavigate();
  const { examId } = useParams(); // ✅ Gets exam ID from the URL

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); 
  
  const [warnings, setWarnings] = useState([]);
  const [warningCount, setWarningCount] = useState(0);
  const [showFinalWarning, setShowFinalWarning] = useState(false);

  // 1. Fetch Exam & Questions
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const [examRes, questionsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/exams/${examId}`),
          axios.get(`http://localhost:5000/api/exams/${examId}/questions`)
        ]);
        setExam(examRes.data);
        setQuestions(questionsRes.data);
        setTimeLeft(examRes.data.duration_minutes * 60); 
        setLoading(false);
      } catch (err) {
        console.error("Error loading exam:", err);
        setLoading(false);
      }
    };
    if (examId) fetchExamData();
  }, [examId]);

  // 2. Unlock Audio
  useEffect(() => {
    const unlockAudio = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
      }
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    return () => document.removeEventListener('click', unlockAudio);
  }, []);

  // 3. Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) addWarning("Warning! Tab switching detected.");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 4. Copy Detection
  useEffect(() => {
    const preventCopy = (e) => {
      e.preventDefault();
      addWarning("Warning! Copying is disabled.");
    };
    document.addEventListener("copy", preventCopy);
    return () => document.removeEventListener("copy", preventCopy);
  }, []);

  // 5. Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) return; 
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { 
          clearInterval(timer); 
          handleSubmit(true); 
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const addWarning = (msg) => {
    setWarningCount(prev => {
      if (prev + 1 === 3) setShowFinalWarning(true);
      return prev + 1;
    });
    setWarnings(prev => [...prev, { time: new Date().toLocaleTimeString(), msg }]);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(msg);
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOptionSelect = (option) => setAnswers({ ...answers, [currentQ]: option });
  const toggleMark = () => setMarked({ ...marked, [currentQ]: !marked[currentQ] });

  // 6. Submit and Save to Database
  const handleSubmit = async (forceSubmit = false) => {
    if (!forceSubmit && !window.confirm("Are you sure you want to submit the exam?")) {
      return;
    }

    try {
      // Calculate Score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        // Check if the selected answer matches the correct option
        if (answers[idx] === q.correct_option) {
          correctCount++;
        }
      });

      // Prepare Payload (Using examId correctly)
      const payload = {
        student_id: parseInt(localStorage.getItem('userId')) || 1, 
        exam_id: parseInt(examId), // ✅ FIX: Using examId from URL params
        score: parseInt(correctCount),
        total_marks: parseInt(exam.total_marks)
      };

      console.log("Submitting Payload:", payload);

      await axios.post('http://localhost:5000/api/results', payload);
      
      alert("Exam submitted successfully!");
      navigate('/student/results');
      
    } catch (error) {
      console.error("Submission Error Details:", error.response?.data || error.message);
      alert(`Failed to save result. Server says: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader className="animate-spin text-blue-600" size={48}/></div>;
  if (!exam || questions.length === 0) return <div className="p-10 text-center text-red-500">Exam not found or has no questions.</div>;

  const q = questions[currentQ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative select-none">
      {showFinalWarning && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border-t-4 border-red-500">
            <ShieldAlert size={64} className="text-red-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Final Warning</h2>
            <p className="text-gray-600 mb-6">Multiple suspicious activities detected.</p>
            <button onClick={() => { setShowFinalWarning(false); setWarningCount(0); }} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700">I Understand</button>
          </div>
        </div>
      )}

      <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
        <h2 className="font-bold text-lg">{exam.title}</h2>
        <div className="flex items-center gap-4">
          {warningCount > 0 && (
            <div className="flex items-center gap-1 text-red-400 bg-red-950/50 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              <AlertTriangle size={16} /> Warnings: {warningCount}
            </div>
          )}
          <div className="flex items-center gap-2 bg-slate-700 px-4 py-1 rounded-full">
            <Clock size={18} className="text-yellow-400"/>
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-slate-800">Question {currentQ + 1} <span className="text-sm text-gray-500 font-normal">of {questions.length}</span></h3>
            <button onClick={toggleMark} className={`px-3 py-1 rounded text-sm font-semibold ${marked[currentQ] ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
              {marked[currentQ] ? 'Unmark Review' : 'Mark for Review'}
            </button>
          </div>
          
          <p className="text-lg mb-8 text-slate-800">{q.question_text}</p>
          
          <div className="space-y-3">
            {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, i) => (
              <label key={i} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${answers[currentQ] === i+1 ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                <input type="radio" name={`q-${currentQ}`} checked={answers[currentQ] === i+1} onChange={() => handleOptionSelect(i+1)} className="w-4 h-4 text-blue-600 mr-3"/>
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-10">
            <button disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50">Previous</button>
            {currentQ === questions.length - 1 ? (
              <button onClick={() => handleSubmit(false)} className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"><CheckCircle size={18}/> Submit Exam</button>
            ) : (
              <button onClick={() => setCurrentQ(currentQ + 1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Next</button>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-4">
          <WebcamMonitor onWarning={addWarning} />

          <div className="bg-white rounded-xl shadow-sm p-4 flex-1 overflow-y-auto max-h-64 border border-gray-200">
            <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">Proctoring Log</h4>
            {warnings.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No activity detected.</p>
            ) : (
              <ul className="space-y-2">
                {warnings.map((w, i) => (
                  <li key={i} className="text-xs p-2 bg-red-50 text-red-700 rounded border-l-4 border-red-500 flex flex-col">
                    <span className="font-bold text-gray-800">{w.time}</span>
                    <span>{w.msg}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Question Palette</h4>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => {
                let statusColor = "bg-gray-100 text-gray-600";
                if (answers[idx]) statusColor = "bg-green-500 text-white";
                if (marked[idx]) statusColor = "bg-purple-500 text-white";
                if (idx === currentQ) statusColor += " ring-2 ring-blue-500 ring-offset-2";
                return (
                  <button key={idx} onClick={() => setCurrentQ(idx)} className={`h-10 w-10 rounded-lg font-bold flex items-center justify-center transition ${statusColor}`}>
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;