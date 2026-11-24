// import React from 'react';
// import { User } from 'lucide-react';

// const StudentProfile = () => {
//   return (
//     <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]">
//       <div className="bg-slate-100 p-4 rounded-full mb-4">
//         <User size={48} className="text-slate-600" />
//       </div>
//       <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
//       <p className="text-gray-500 max-w-md">Update your personal details, change password, and view academic information.</p>
//     </div>
//   );
// };

// export default StudentProfile;
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Camera, Mail, BookOpen, Phone, MapPin, 
  Calendar, Award, Lock, Save, Edit3, CheckCircle 
} from 'lucide-react';

const StudentProfile = () => {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Default profile state (matches your dashboard user Rohit Gupta)
  const [profile, setProfile] = useState({
    fullName: 'Rohit Gupta',
    email: 'student@test.com',
    studentId: 'STU-2026-084',
    course: 'B.Sc. Computer Science',
    semester: 'Semester 4',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    dob: '2004-05-15',
    bio: 'Passionate full-stack developer and AI enthusiast preparing for technical certifications.',
    avatar: null // Stores Base64 or Image URL
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  // Load saved profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('student_profile_data');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Profile Picture Upload & Preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes
  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('student_profile_data', JSON.stringify(profile));
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    
    // TODO: Connect your backend API here (e.g., axios.put('/api/student/profile', profile))
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswords({ current: '', newPass: '', confirmPass: '' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm">
          <CheckCircle size={20} />
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Top Banner & Avatar Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Blue Cover Header */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

        <div className="px-8 pb-8">
          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-6 gap-4">
            {/* Avatar Upload Container */}
            <div className="relative group w-28 h-28">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-md flex items-center justify-center">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-slate-400" />
                )}
              </div>

              {/* Camera Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                title="Change Profile Picture"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition cursor-pointer"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Edit / Save Action Button */}
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm cursor-pointer"
                >
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm cursor-pointer"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Student Title Summary */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">{profile.fullName}</h1>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                {profile.studentId}
              </span>
            </div>
            <p className="text-gray-500 mt-1">{profile.course} • {profile.semester}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Academic Summary & Password */}
        <div className="space-y-6">
          {/* Academic Stats Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="text-blue-600" size={20} />
              Academic Overview
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Enrolled Courses</span>
                <span className="font-semibold text-gray-800">60</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Exams Completed</span>
                <span className="font-semibold text-gray-800">1</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Average Score</span>
                <span className="font-semibold text-emerald-600">85%</span>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <form onSubmit={handlePasswordUpdate} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Lock className="text-blue-600" size={20} />
              Change Password
            </h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirmPass}
                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Right Column: Editable Personal & Course Information */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-5">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
            Personal & Academic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <User size={15} className="text-gray-400" /> Full Name
              </label>
              <input
                type="text"
                name="fullName"
                disabled={!isEditing}
                value={profile.fullName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Mail size={15} className="text-gray-400" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                disabled={!isEditing}
                value={profile.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Course / Program */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <BookOpen size={15} className="text-gray-400" /> Enrolled Course / Stream
              </label>
              <select
                name="course"
                disabled={!isEditing}
                value={profile.course}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
                <option value="B.Sc. Information Technology">B.Sc. Information Technology</option>
                <option value="BAF (Accounting & Finance)">BAF (Accounting & Finance)</option>
                <option value="B.Com (Bachelor of Commerce)">B.Com (Bachelor of Commerce)</option>
                <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
              </select>
            </div>

            {/* Semester / Year */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Award size={15} className="text-gray-400" /> Current Semester / Year
              </label>
              <input
                type="text"
                name="semester"
                disabled={!isEditing}
                value={profile.semester}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Phone size={15} className="text-gray-400" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                disabled={!isEditing}
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Calendar size={15} className="text-gray-400" /> Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                disabled={!isEditing}
                value={profile.dob}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
              <MapPin size={15} className="text-gray-400" /> City / Address
            </label>
            <input
              type="text"
              name="location"
              disabled={!isEditing}
              value={profile.location}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* About / Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Me / Bio
            </label>
            <textarea
              name="bio"
              rows="3"
              disabled={!isEditing}
              value={profile.bio}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;