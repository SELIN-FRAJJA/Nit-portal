// ✅ Updated UnifiedLoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UnifiedLoginPage = ({ onLoginTypeSelect }) => {
  const [durationSet, setDurationSet] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/window')
      .then(res => {
        const now = new Date();
        const start = new Date(res.data.startDate);
        const end = new Date(res.data.endDate);
        setDurationSet(now >= start && now <= end);
      })
      .catch(() => setDurationSet(false));
  }, []);

  const handleLoginClick = (type) => {
    if (!durationSet && (type === 'student' || type === 'faculty')) {
      alert('Internship window is not yet set by admin. Please wait.');
      return;
    }
    onLoginTypeSelect(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-blue-900 text-white p-6 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-white p-2 shadow-md">
              <img src="/logo-nit.png" alt="Institute Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold">National Institute of Technology</h1>
              <h2 className="text-lg">Tiruchirappalli</h2>
              <div className="flex space-x-8 text-sm mt-1">
                <span>राष्ट्रीय प्रौद्योगिकी संस्थान तिरुचिरापल्ली</span>
                <span>தேசிய தொழில்நுட்ப கழகம்</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-b-lg p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">Select Login Type</h2>

          <div className="max-w-md mx-auto space-y-6">
            <button
              onClick={() => handleLoginClick('faculty')}
              className="w-full bg-red-800 text-white py-4 rounded-lg hover:bg-red-900 transition-colors font-medium"
            >
              Faculty Login
            </button>
            <button
              onClick={() => handleLoginClick('student')}
              className="w-full bg-teal-600 text-white py-4 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Student Login
            </button>
            <button
              onClick={() => handleLoginClick('admin')}
              className="w-full bg-indigo-700 text-white py-4 rounded-lg hover:bg-indigo-800 transition-colors font-medium"
            >
              Admin Login
            </button>
          </div>
        </div>

        <div className="bg-blue-900 text-white text-center py-3 rounded-b-lg mt-4">
          <p className="text-sm">Developed and Maintained by Computer Support Group, NIT-T</p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
