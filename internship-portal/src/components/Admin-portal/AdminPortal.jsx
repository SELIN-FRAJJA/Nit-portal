// src/components/Admin-portal/AdminPortal.jsx
import React, { useState, useEffect } from 'react';
import LoginSignup from './LoginSignup';
import FacultyTab from './FacultyTab';
import StudentsTab from './StudentsTab';
import CertificatesTab from './CertificatesTab';
import HostelTab from './HostelTab';
import TabNavigation from './TabNavigation';
import axios from 'axios';


const AdminPortal = ({ isLoggedIn, onLogout }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('faculty');
  
  // Auth form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  
  // Window (date range) state
  const [windowState, setWindowState] = useState({ startDate: '', endDate: '' });
  const [windowLoading, setWindowLoading] = useState(false);
  const [windowError, setWindowError] = useState(null);
  const [windowSubmitting, setWindowSubmitting] = useState(false);
  

  // Faculty form states
  const [facultyData, setFacultyData] = useState({
    internshipInterest: '',
    internshipDomain: '',
    paidStatus: '',
    startDate: '',
    endDate: ''
  });
  
  // Certificate access state
  const [certificateAccess, setCertificateAccess] = useState('');

  // Fetch current submission window on mount
  useEffect(() => {
    setWindowLoading(true);
    axios.get('http://localhost:5000/api/admin/window')
      .then(res => {
        const { startDate, endDate } = res.data;
        setWindowState({
          startDate: startDate.slice(0, 10),
          endDate: endDate.slice(0, 10)
        });
      })
      .catch(() => setWindowError('Failed to load submission window'))
      .finally(() => setWindowLoading(false));
  }, []);

  const handleWindowChange = e => {
    const { name, value } = e.target;
    setWindowState(prev => ({ ...prev, [name]: value }));
  };

  const handleWindowSubmit = async e => {
    e.preventDefault();
    setWindowError(null);
    setWindowSubmitting(true);

    const { startDate, endDate } = windowState;
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      setWindowError('Please enter a valid date range');
      setWindowSubmitting(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/admin/window', { startDate, endDate });
    } catch {
      setWindowError('Failed to update submission window');
    } finally {
      setWindowSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="opacity-90">Secure Access Dashboard</p>
          </div>
          <LoginSignup
            showLogin={showLogin}
            setShowLogin={setShowLogin}
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            signupForm={signupForm}
            setSignupForm={setSignupForm}
            handleLogin={() => {}}
            handleSignup={() => {}}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <span className="text-white">👤</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">NITT Management Portal</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-4 gap-6">
        {/* Left date-range window */}
        <div className="col-span-1 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Submission Window</h2>
          {windowLoading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleWindowSubmit} className="space-y-4">
              {windowError && <p className="text-red-600">{windowError}</p>}
              <div>
                <label htmlFor="startDate" className="block font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={windowState.startDate}
                  onChange={handleWindowChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={windowState.endDate}
                  onChange={handleWindowChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={windowSubmitting}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {windowSubmitting ? 'Updating...' : 'Update Window'}
              </button>
            </form>
          )}
        </div>

        {/* Right content area */}
        <div className="col-span-3">
          {activeTab === 'faculty' && (
            <FacultyTab
              facultyData={facultyData}
              setFacultyData={setFacultyData}
              handleFacultySubmit={() => alert('Faculty data saved!')}
            />
          )}
          {activeTab === 'students' && <StudentsTab />}
          {activeTab === 'certificates' && (
            <CertificatesTab
              certificateAccess={certificateAccess}
              setCertificateAccess={setCertificateAccess}
              handleCertificateSubmit={() => alert('Certificate settings saved!')}
            />
          )}
          {activeTab === 'hostel' && <HostelTab />}
        </div>
      </div>
    </div>
  );
};



export default AdminPortal;
