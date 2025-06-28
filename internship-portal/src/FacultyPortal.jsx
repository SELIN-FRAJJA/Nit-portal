import React, { useState, useEffect } from 'react';
import ApplicationDetails from './components/Faculty-portal/ApplicationDetails';
import FacultyDashboard from './components/Faculty-portal/FacultyDashboard';
import Login from './components/Faculty-portal/Login';
import Signup from './components/Faculty-portal/Signup';
import ErrorBoundary from './components/Faculty-portal/ErrorBoundary';
import axios from 'axios';
import ReportsTab from './components/Faculty-portal/ReportsTab';

export default function FacultyPortal() {
  const [currentView, setCurrentView] = useState('login');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [emailStatus, setEmailStatus] = useState('');
  const [error, setError] = useState('');
  const [loggedInFacultyEmail, setLoggedInFacultyEmail] = useState('');
  const [applications, setApplications] = useState([]);
  const [loggedInFacultyDepartment, setLoggedInFacultyDepartment] = useState('');
  const [activeTab, setActiveTab] = useState('internshipForm');

  const fetchApplications = async () => {
    if (!loggedInFacultyEmail) {
      setApplications([]);
      return;
    }
    try {
      let url = `http://localhost:5000/api/applications?facultyEmail=${encodeURIComponent(loggedInFacultyEmail)}`;
      if (loggedInFacultyDepartment) url += `&department=${encodeURIComponent(loggedInFacultyDepartment)}`;
      const response = await axios.get(url);
      if (response.status >= 200 && response.status < 300 && Array.isArray(response.data)) {
        setApplications(response.data);
        setError('');
      } else {
        setApplications([]);
        setError('Failed to load applications');
      }
    } catch {
      setError('Failed to load applications');
      setApplications([]);
    }
  };

    useEffect(() => {
      fetchApplications();
    }, [loggedInFacultyEmail, loggedInFacultyDepartment]);
  

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setCurrentView('applicationDetails');
  };

  const [acceptanceWindow, setAcceptanceWindow] = useState({
    showAcceptance: true,
    message: '',
    startDate: '',
    endDate: ''
  });
  const [isAcceptanceOpen, setIsAcceptanceOpen] = useState(true);

  const handleAcceptApplication = async (applicationId) => {
    if (!isAcceptanceOpen) {
      setError("You cannot accept applications outside of the acceptance window.");
      return;
    }
    try {
      await axios.patch(`http://localhost:5000/api/applications/${applicationId}/status`, { status: 'accepted' });
      await fetchApplications();
      setCurrentView('applications');
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error accepting application:', error);
      setError('Failed to accept application');
    }
  };

  const handleDeclineApplication = async (applicationId) => {
    if (!isAcceptanceOpen) {
      setError("You cannot decline applications outside of the acceptance window.");
      return;
    }
    try {
      await axios.patch(`http://localhost:5000/api/applications/${applicationId}/status`, { status: 'declined' });
      await fetchApplications();
      setCurrentView('applications');
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error declining application:', error);
      setError('Failed to decline application');
    }
  };

  const handleLogout = () => {
    setCurrentView('login');
    setSelectedApplication(null);
    setEmailStatus('');
    setLoggedInFacultyEmail('');
    setLoggedInFacultyDepartment('');
    setActiveTab('applications');
  };

  const switchToSignup = () => setCurrentView('signup');
  const switchToLogin = () => setCurrentView('login');

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      if (!loggedInFacultyEmail) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/faculty?email=${encodeURIComponent(loggedInFacultyEmail)}`);
        setLoggedInFacultyDepartment(res.data.department || '');
      } catch {
        setLoggedInFacultyDepartment('');
      }
    };
    fetchFacultyDetails();
  }, [loggedInFacultyEmail]);

  useEffect(() => {
    const fetchAcceptanceWindow = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faculty/acceptance-window');
        setAcceptanceWindow(response.data);
        const now = new Date();
        setIsAcceptanceOpen(
          now >= new Date(response.data.startDate) && now <= new Date(response.data.endDate)
        );
      } catch (err) {
        console.error('Failed to fetch acceptance window:', err);
        setIsAcceptanceOpen(true); // Default to allowing actions if check fails
      }
    };

    fetchAcceptanceWindow();
  }, []);

  return (
    <>
      {emailStatus && <div className="max-w-4xl mx-auto px-4 pt-4"><div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">{emailStatus}</div></div>}
      {error && <div className="max-w-4xl mx-auto px-4 pt-4"><div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div></div>}

      {currentView === 'login' && (
        <Login
          onLoginSuccess={(email) => {
            setLoggedInFacultyEmail(email);
            setCurrentView('applications');
          }}
          switchToSignup={switchToSignup}
          setError={setError}
        />
      )}

      {currentView === 'signup' && (
        <Signup
          onSignupSuccess={switchToLogin}
          switchToLogin={switchToLogin}
          setError={setError}
        />
      )}

      {currentView === 'applications' && (
        <ErrorBoundary>
              <FacultyDashboard
                facultyEmail={loggedInFacultyEmail}
                facultyDepartment={loggedInFacultyDepartment}
                onLogout={handleLogout}
                onViewApplication={handleViewApplication}
                onAccept={handleAcceptApplication}
                onDecline={handleDeclineApplication}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </ErrorBoundary>
          )}

      {currentView === 'applicationDetails' && selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          onAccept={handleAcceptApplication}
          onDecline={handleDeclineApplication}
          onGoBack={() => setCurrentView('applications')}
          isAcceptanceOpen={isAcceptanceOpen}
        />
      )}
    </>
  );
}
