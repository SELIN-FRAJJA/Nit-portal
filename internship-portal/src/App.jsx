// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // <-- add this
import InternshipPortal from './InternshipPortal';
import FacultyPortal from './FacultyPortal';
import UnifiedLoginPage from './components/UnifiedLoginPage';
import StudentAuthPage from './components/StudentAuthPage';
import StudentDetails from './components/Student-portal/student_detail';
import LoginSignup from './components/Admin-portal/LoginForm';
import AdminPortal from './components/Admin-portal/AdminPortal';
import ResultPage from './components/Student-portal/ResultPage';

function App() {
  const [loginType, setLoginType] = useState(null); // 'student' | 'faculty' | 'admin'
  const [studentAuthenticated, setStudentAuthenticated] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentId, setStudentId] = useState(null); // <-- track studentId
  const [showAdminLogin, setShowAdminLogin] = useState(true);

  // Add state for admin login and signup forms
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', password: '' });
  const [adminSignupForm, setAdminSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleLogout = () => {
    setLoginType(null);
    setStudentAuthenticated(false);
    setAdminAuthenticated(false);
    setShowAdminLogin(true);
    setAdminLoginForm({ email: '', password: '' });
    setAdminSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
    setStudentId(null);
    setStudentEmail('');
  };

  // Updated: Accept both email and id
  const handleStudentAuthSuccess = (email, _id) => {
    setStudentEmail(email);
    setStudentId(_id);
    setStudentAuthenticated(true);
  };

  const handleAdminAuthSuccess = () => {
    setAdminAuthenticated(true);
  };

  const handleBackToLoginType = () => {
    setLoginType(null);
    setStudentAuthenticated(false);
    setAdminAuthenticated(false);
    setShowAdminLogin(true);
    setAdminLoginForm({ email: '', password: '' });
    setAdminSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
    setStudentId(null);
    setStudentEmail('');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              {!loginType ? (
                <UnifiedLoginPage onLoginTypeSelect={setLoginType} />
              ) : loginType === 'student' && !studentAuthenticated ? (
                <StudentAuthPage 
                  onAuthSuccess={(email, _id) => handleStudentAuthSuccess(email, _id)} // Pass both
                  onBack={handleBackToLoginType} 
                />
              ) : loginType === 'student' && studentAuthenticated ? (
                <>
                  <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Internship Management System</h1>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </nav>
                  <main className="mt-6">
                    <InternshipPortal email={studentEmail} studentId={studentId} />
                  </main>
                </>
              ) : loginType === 'faculty' ? (
                <>
                  <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Internship Management System</h1>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </nav>
                  <main className="mt-6">
                    <FacultyPortal />
                  </main>
                </>
              ) : loginType === 'admin' && !adminAuthenticated ? (
                <LoginSignup
                  onAuthSuccess={handleAdminAuthSuccess}
                  onBack={handleBackToLoginType}
                  showLogin={showAdminLogin}
                  setShowLogin={setShowAdminLogin}
                  loginForm={adminLoginForm}
                  setLoginForm={setAdminLoginForm}
                  signupForm={adminSignupForm}
                  setSignupForm={setAdminSignupForm}
                  handleLogin={() => {
                    // hardcoded credentials
                    if (
                      adminLoginForm.email === 'admin@nitt.edu' &&
                      adminLoginForm.password === '123'
                    ) {
                      handleAdminAuthSuccess();
                    } else {
                      alert('Invalid admin email or password');
                    }
                  }}
                  handleSignup={async () => {
                    try {
                      const response = await fetch('http://localhost:5000/api/admin/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(adminSignupForm)
                      });
                      if (!response.ok) {
                        let errorText;
                        const responseText = await response.text();
                        try {
                          const errorData = JSON.parse(responseText);
                          errorText = errorData.error || 'Unknown error';
                        } catch (e) {
                          errorText = responseText;
                        }
                        alert('Signup failed: ' + errorText);
                        return;
                      }
                      alert('Signup successful! Please login.');
                      setShowAdminLogin(true);
                      setAdminSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
                    } catch (error) {
                      alert('Signup failed: ' + error.message);
                    }
                  }}
                  showPassword={false}
                  setShowPassword={() => {}}
                  showConfirmPassword={false}
                  setShowConfirmPassword={() => {}}
                />
              ) : loginType === 'admin' && adminAuthenticated ? (
                <AdminPortal 
                  onLogout={handleLogout}
                />
              ) : null}
            </div>
          }
        />
        <Route
          path="/student/result"
          element={
            <ResultPage
              studentId={studentId}
              email={studentEmail}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
