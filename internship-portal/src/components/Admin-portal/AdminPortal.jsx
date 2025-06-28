import React, { useState, useEffect } from 'react';
import FacultyTab from './FacultyTab';
import StudentsTab from './StudentsTab';
import CertificatesTab from './CertificatesTab';
import HostelTab from './HostelTab';
import axios from 'axios';

// Instructions Modal Component
const InstructionsModal = ({ isOpen, onClose, instructions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Admin Instructions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed text-gray-700">
              {instructions || 'No instructions available.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPortal = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [resultWindow, setResultWindow] = useState({ startDate: '', endDate: '' });
  const [resultLoading, setResultLoading] = useState(false);
  const [resultError, setResultError] = useState(null);
  const [resultSubmitting, setResultSubmitting] = useState(false);
  const [reportWindow, setReportWindow] = useState({ startDate: '', endDate: '' });
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [isDurationSet, setIsDurationSet] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(() => {
    const firstLoginDone = localStorage.getItem('firstLoginCompleted') === 'true';
    return !firstLoginDone;
  });
  
  // Instructions state
  const [showInstructions, setShowInstructions] = useState(false);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [instructions, setInstructions] = useState(`**Admin Dashboard --- Instruction Page**

**Welcome, Admin!**
This instruction page will guide you through setting up the required date windows for managing faculty and student internship processes.

**Step 1: Specify Dates for Internship Windows and Overall Duration**

You need to define dates for the following five windows:

**🗓️ 1. Overall Internship Duration**

- Purpose:
  To define the complete internship period for the batch.

- Action Required:
  Set the Start Date and End Date that encompass all the other windows listed below.

**1️⃣ Faculty Internship Duration **

- Purpose:
  To allow faculty members to submit the internship duration and related details.

- Action Required:
  Set the Start Date and End Date during which faculty can enter or update their internship details.

**2️⃣ Student Internship Application **

- Purpose:
  To allow students to submit their internship applications.

- Action Required:
  Set the Start Date and End Date for students to submit their internship application forms.

**3️⃣ Faculty Finalizing Student Applications **

- Purpose:
  To allow faculty to accept or decline student internship applications.

- Action Required:
  Set the Start Date and End Date for faculty to review and finalize the list of students.

**4️⃣ Final Student Approval Submission Window**

- Purpose:
  To allow students to submit their final internship approval after result publication.

- Action Required:
  Set the Start Date and End Date for final student approvals.

**Step 2: How to Set Dates**

1. Go to Dashboard
2. Edit Dates
3. Enter the Start Date and End Date for each of the five windows
4. Confirm and Update the configuration

**Important Notes**

- All windows must fall within the overall internship duration.
- Ensure timelines are clearly communicated to faculty and students.
- You can edit window dates later if adjustments are needed.

✅ By completing these steps, you will ensure a smooth, transparent, and efficient internship workflow for both faculty and students.`);

  // Hardcoded admin credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin@nitt.edu',
    password: '123'
  };
  
  // Window (date range) state
  const [windowState, setWindowState] = useState({ startDate: '', endDate: '' });
  const [windowLoading, setWindowLoading] = useState(false);
  const [windowError, setWindowError] = useState(null);
  const [windowSubmitting, setWindowSubmitting] = useState(false);
  const [studentAppWindow, setStudentAppWindow] = useState({ startDate: '', endDate: '' });
  const [studentAppWindowLoading, setStudentAppWindowLoading] = useState(false);
  const [studentAppWindowError, setStudentAppWindowError] = useState(null);
  const [studentAppWindowSubmitting, setStudentAppWindowSubmitting] = useState(false);

  // ADD MISSING ACCEPTANCE WINDOW STATE
  const [acceptanceWindow, setAcceptanceWindow] = useState({ startDate: '', endDate: '' });
  const [acceptanceWindowLoading, setAcceptanceWindowLoading] = useState(false);
  const [acceptanceWindowError, setAcceptanceWindowError] = useState(null);
  const [acceptanceWindowSubmitting, setAcceptanceWindowSubmitting] = useState(false);

  // Load instructions from memory on component mount
  useEffect(() => {
    const savedInstructions = sessionStorage.getItem('adminInstructions');
    if (savedInstructions) {
      setInstructions(savedInstructions);
    }
  }, []);

  // Save instructions to memory
  const saveInstructions = (newInstructions) => {
    setInstructions(newInstructions);
    sessionStorage.setItem('adminInstructions', newInstructions);
    
    // If you want to save to backend, uncomment below:
    try {
      axios.post('http://localhost:5000/api/admin/instructions', { 
        instructions: newInstructions 
      });
    } catch (error) {
      console.error('Failed to save instructions to backend:', error);
    }
  };

  // Fetch current submission window on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/window')
      .then(res => {
        const { startDate, endDate } = res.data;
        setWindowState({
          startDate: startDate ? startDate.slice(0, 10) : '',
          endDate: endDate ? endDate.slice(0, 10) : ''
        });
        // Check if duration is set
        const durationSet = !!(startDate && endDate);
        setIsDurationSet(durationSet);
        // Show modal if duration is not set
        if (!durationSet) {
          setShowDurationModal(true);
        }
      })
      .catch(() => {
        setWindowError('Failed to load submission window');
        setIsDurationSet(false);
        setShowDurationModal(true);
      });
  }, []);

  // ADD MISSING ACCEPTANCE WINDOW HANDLER
  const handleSaveAcceptanceWindow = async () => {
    setAcceptanceWindowError(null);
    setAcceptanceWindowSubmitting(true);

    const { startDate, endDate } = acceptanceWindow;
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      setAcceptanceWindowError('Please enter a valid date range');
      setAcceptanceWindowSubmitting(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/admin/acceptance-window', { startDate, endDate });
      // Handle success if needed
    } catch (error) {
      setAcceptanceWindowError('Failed to update acceptance window');
    } finally {
      setAcceptanceWindowSubmitting(false);
    }
  };

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
      setIsDurationSet(true);
      setShowDurationModal(false);
      setIsFirstLogin(false);
      localStorage.setItem('firstLoginCompleted', 'true'); // Mark first login as done
    } catch {
      setWindowError('Failed to update submission window');
    } finally {
      setWindowSubmitting(false);
    }
  };

  // Fetch report window
  useEffect(() => {
    setReportLoading(true);
    axios.get('http://localhost:5000/api/report-window')
      .then(res => {
        if (res.data.startDate && res.data.endDate) {
          setReportWindow({
            startDate: res.data.startDate.slice(0, 10),
            endDate: res.data.endDate.slice(0, 10),
          });
        }
      })
      .catch(() => setReportError('Failed to load report window'))
      .finally(() => setReportLoading(false));
  }, []);

  // Add handler
  const handleStudentAppWindowChange = e => {
    const { name, value } = e.target;
    setStudentAppWindow(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentAppWindowSubmit = async e => {
    e.preventDefault();
    setStudentAppWindowError(null);
    setStudentAppWindowSubmitting(true);

    const { startDate, endDate } = studentAppWindow;
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      setStudentAppWindowError('Please enter a valid date range');
      setStudentAppWindowSubmitting(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/admin/student-app-window', { startDate, endDate });
    } catch {
      setStudentAppWindowError('Failed to update student application window');
    } finally {
      setStudentAppWindowSubmitting(false);
    }
  };

  // Report window handlers
  const handleReportChange = e => {
    const { name, value } = e.target;
    setReportWindow(prev => ({ ...prev, [name]: value }));
  };

  const handleReportSubmit = async e => {
    e.preventDefault();
    setReportError(null);
    setReportSubmitting(true);

    const { startDate, endDate } = reportWindow;
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      setReportError('Please enter a valid date range');
      setReportSubmitting(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/admin/report-window', { startDate, endDate });
    } catch {
      setReportError('Failed to update report window');
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleResultChange = e => {
    const { name, value } = e.target;
    setResultWindow(prev => ({ ...prev, [name]: value }));
  };

  const handleResultSubmit = async e => {
    e.preventDefault();
    setResultError(null);
    setResultSubmitting(true);

    const { startDate, endDate } = resultWindow;
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      setResultError('Please enter a valid date range');
      setResultSubmitting(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/admin/result-window', { startDate, endDate });
    } catch {
      setResultError('Failed to update result window');
    } finally {
      setResultSubmitting(false);
    }
  };

  const handleTabNavigation = (tabId) => {
    if (tabId !== 'duration' && !isDurationSet) {
      alert("Please set the duration before accessing other sections.");
      return;
    }
    
    setActiveTab(tabId);
  };

  const forceDuration = isFirstLogin && !isDurationSet;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-25">
            <div className="flex items-center space-x-3">
              <img src="/logo-nit.png" alt="NIT Logo" className="w-15 h-15" />
              <div>
                <h1 className="font-bold text-xl text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">NIT-T Management Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Instructions Button */}
              <button
                onClick={() => setShowInstructions(true)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition-colors"
                title="View Instructions"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        instructions={instructions}
      />

      {/* Duration Setup Modal */}
      {showDurationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Initial Setup Required</h2>
            <p className="text-gray-600 mb-6 text-center">
              Before using the admin portal, please set the duration window for submissions.
            </p>
            
            <form onSubmit={handleWindowSubmit} className="space-y-4">
              {windowError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                  {windowError}
                </div>
              )}
              
              <div>
                <label htmlFor="modalStartDate" className="block font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="modalStartDate"
                  value={windowState.startDate}
                  onChange={handleWindowChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="modalEndDate" className="block font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="modalEndDate"
                  value={windowState.endDate}
                  onChange={handleWindowChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={windowSubmitting}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {windowSubmitting ? 'Saving...' : 'Save Duration Settings'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <button
              onClick={() => setActiveTab(null)}
              className="mb-6 px-4 py-2 bg-gray-100 text-white rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Dashboard
            </button>
            
            {/* Duration Tab */}
            {activeTab === 'duration' && (
              <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Overall Internship Duaration</h2>
                <form onSubmit={handleWindowSubmit} className="space-y-5">
                  {windowError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                      {windowError}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="block font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={windowState.startDate}
                      onChange={handleWindowChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="block font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={windowState.endDate}
                      onChange={handleWindowChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={windowSubmitting}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {windowSubmitting ? 'Updating...' : 'Update Duration Window'}
                  </button>
                </form>
              </div>
            )}

            {/* Manage Windows Tab */}
            {activeTab === 'manage-windows' && (
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Internship Process Timelines</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Faculty Internship Window */}
                  <div className="bg-white p-6 rounded shadow text-black">
                    <h2 className="text-xl font-semibold mb-4">Faculty Internship Duration</h2>
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

                  {/* Student Application Window */}
                  <div className="bg-white p-6 rounded shadow text-black">
                    <h2 className="text-xl font-semibold mb-4">Student Application </h2>
                    {studentAppWindowLoading ? (
                      <p>Loading...</p>
                    ) : (
                      <form onSubmit={handleStudentAppWindowSubmit} className="space-y-4">
                        {studentAppWindowError && <p className="text-red-600">{studentAppWindowError}</p>}
                        <div>
                          <label htmlFor="studentStartDate" className="block font-medium mb-1">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            id="studentStartDate"
                            value={studentAppWindow.startDate}
                            onChange={handleStudentAppWindowChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="studentEndDate" className="block font-medium mb-1">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            id="studentEndDate"
                            value={studentAppWindow.endDate}
                            onChange={handleStudentAppWindowChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={studentAppWindowSubmitting}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {studentAppWindowSubmitting ? 'Updating...' : 'Update Window'}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Faculty Acceptance Window Section */}
                  <div className="bg-white p-6 rounded shadow text-black">
                    <h3 className="text-xl font-semibold mb-4">Faculty Acceptance </h3>
                    {acceptanceWindowError && <p className="text-red-600 mb-4">{acceptanceWindowError}</p>}
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveAcceptanceWindow();
                    }} className="space-y-4">
                      <div>
                        <label htmlFor="acceptanceStartDate" className="block font-medium mb-1">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          id="acceptanceStartDate"
                          value={acceptanceWindow.startDate}
                          onChange={(e) =>
                            setAcceptanceWindow((prev) => ({ ...prev, startDate: e.target.value }))
                          }
                          className="border border-gray-300 rounded px-3 py-2 w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="acceptanceEndDate" className="block font-medium mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          id="acceptanceEndDate"
                          value={acceptanceWindow.endDate}
                          onChange={(e) =>
                            setAcceptanceWindow((prev) => ({ ...prev, endDate: e.target.value }))
                          }
                          className="border border-gray-300 rounded px-3 py-2 w-full"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={acceptanceWindowSubmitting}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {acceptanceWindowSubmitting ? 'Saving...' : 'Update Window'}
                      </button>
                    </form>
                  </div>

                  {/* Result Publication Window */}
                  <div className="bg-white p-6 rounded shadow text-black">
                    <h2 className="text-xl font-semibold mb-4">Student Finalization</h2>
                    {resultLoading ? (
                      <p>Loading...</p>
                    ) : (
                      <form onSubmit={handleResultSubmit} className="space-y-4">
                        {resultError && <p className="text-red-600">{resultError}</p>}
                        <div>
                          <label htmlFor="resultStartDate" className="block font-medium mb-1">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            id="resultStartDate"
                            value={resultWindow.startDate}
                            onChange={handleResultChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="resultEndDate" className="block font-medium mb-1">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            id="resultEndDate"
                            value={resultWindow.endDate}
                            onChange={handleResultChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={resultSubmitting}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {resultSubmitting ? 'Updating...' : 'Update Window'}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Report Submission Window */}
                  <div className="bg-white p-6 rounded shadow text-black">
                    <h2 className="text-xl font-semibold mb-4">Report Submission </h2>
                    {reportLoading ? (
                      <p>Loading...</p>
                    ) : (
                      <form onSubmit={handleReportSubmit} className="space-y-4">
                        {reportError && <p className="text-red-600">{reportError}</p>}
                        <div>
                          <label htmlFor="reportStartDate" className="block font-medium mb-1">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            id="reportStartDate"
                            value={reportWindow.startDate}
                            onChange={handleReportChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="reportEndDate" className="block font-medium mb-1">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            id="reportEndDate"
                            value={reportWindow.endDate}
                            onChange={handleReportChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={reportSubmitting}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {reportSubmitting ? 'Updating...' : 'Update Window'}
                        </button>
                      </form>
                    )}
                  </div>  
                </div>
              </div>
            )}

            {/* Faculty Tab */}
            {activeTab === 'faculty' && (
              <FacultyTab
                windowState={windowState}
                setWindowState={setWindowState}
                windowLoading={windowLoading}
                windowError={windowError}
                windowSubmitting={windowSubmitting}
                handleWindowChange={handleWindowChange}
                handleWindowSubmit={handleWindowSubmit}
                
                studentAppWindow={studentAppWindow}
                setStudentAppWindow={setStudentAppWindow}
                studentAppWindowLoading={studentAppWindowLoading}
                studentAppWindowError={studentAppWindowError}
                studentAppWindowSubmitting={studentAppWindowSubmitting}
                handleStudentAppWindowChange={handleStudentAppWindowChange}
                handleStudentAppWindowSubmit={handleStudentAppWindowSubmit}
                
                resultWindow={resultWindow}
                setResultWindow={setResultWindow}
                resultLoading={resultLoading}
                resultError={resultError}
                resultSubmitting={resultSubmitting}
                handleResultChange={handleResultChange}
                handleResultSubmit={handleResultSubmit}
                
                reportWindow={reportWindow}
                setReportWindow={setReportWindow}
                reportLoading={reportLoading}
                reportError={reportError}
                reportSubmitting={reportSubmitting}
                handleReportChange={handleReportChange}
                handleReportSubmit={handleReportSubmit}
              />
            )}
            
            {/* Students Tab */}
            {activeTab === 'students' && <StudentsTab />}
            
            {/* Certificates Tab */}
            {activeTab === 'certificates' && <CertificatesTab />}
            
            {/* Hostel Tab */}
            {activeTab === 'hostel' && <HostelTab />}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Admin Dashboard</h1>
              <p className="text-xl text-gray-600">NIT-T Management Portal</p>
            </div>
            
            <div className="w-full max-w-6xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Welcome to Admin Portal
              </h2>
              <p className="text-gray-600 mb-10 text-center max-w-2xl mx-auto">
                Manage all aspects of the internship program through the sections below.<br></br> <br></br> 
                Click i button to view instructions on how to set up the internship process.
              </p>
              
              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Duration Card */}
                <div 
                  onClick={() => handleTabNavigation('duration')}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center"
                >
                  <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Duration Settings</h3>
                  <p className="text-gray-600 mb-4">
                    Configure submission windows and deadlines
                  </p>
                  <button className="text-blue-600 font-medium hover:text-blue-800">
                    Configure →
                  </button>
                </div>

                {/* Manage Windows Card */}
                <div 
                  onClick={() => isDurationSet && handleTabNavigation('manage-windows')}
                  className={`bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center text-center ${
                    isDurationSet 
                      ? 'border-gray-200 hover:shadow-md transition-shadow cursor-pointer' 
                      : 'border-gray-100 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className={`rounded-full p-3 mb-4 ${
                    isDurationSet ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Time Windows</h3>
                  <p className="text-gray-600 mb-4">
                    Configure internship process timelines
                  </p>
                  {isDurationSet ? (
                    <button className="text-pink-600 font-medium hover:text-pink-800">
                      Configure →
                    </button>
                  ) : (
                    <span className="text-sm text-red-500 font-medium">
                      Set duration first
                    </span>
                  )}
                </div>
                                
                {/* Faculty Card */}
                <div 
                  onClick={() => isDurationSet && handleTabNavigation('faculty')}
                  className={`bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center text-center ${
                    isDurationSet 
                      ? 'border-gray-200 hover:shadow-md transition-shadow cursor-pointer' 
                      : 'border-gray-100 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className={`rounded-full p-3 mb-4 ${
                    isDurationSet ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Faculty Management</h3>
                  <p className="text-gray-600 mb-4">
                    Manage faculty preferences and assignments
                  </p>
                  {isDurationSet ? (
                    <button className="text-green-600 font-medium hover:text-green-800">
                      Manage →
                    </button>
                  ) : (
                    <span className="text-sm text-red-500 font-medium">
                      Set duration first
                    </span>
                  )}
                </div>
                
                {/* Students Card */}
                <div 
                  onClick={() => isDurationSet && handleTabNavigation('students')}
                  className={`bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center text-center ${
                    isDurationSet 
                      ? 'border-gray-200 hover:shadow-md transition-shadow cursor-pointer' 
                      : 'border-gray-100 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className={`rounded-full p-3 mb-4 ${
                    isDurationSet ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Records</h3>
                  <p className="text-gray-600 mb-4">
                    View and manage student applications and data
                  </p>
                  {isDurationSet ? (
                    <button className="text-purple-600 font-medium hover:text-purple-800">
                      View Records →
                    </button>
                  ) : (
                    <span className="text-sm text-red-500 font-medium">
                      Set duration first
                    </span>
                  )}
                </div>

                {/* Certificates Card */}
                <div 
                  onClick={() => isDurationSet && handleTabNavigation('certificates')}
                  className={`bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center text-center ${
                    isDurationSet 
                      ? 'border-gray-200 hover:shadow-md transition-shadow cursor-pointer' 
                      : 'border-gray-100 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className={`rounded-full p-3 mb-4 ${
                    isDurationSet ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificates</h3>
                  <p className="text-gray-600 mb-4">
                    Manage certificate generation and access
                  </p>
                  {isDurationSet ? (
                    <button className="text-yellow-600 font-medium hover:text-yellow-800">
                      Manage Certificates →
                    </button>
                  ) : (
                    <span className="text-sm text-red-500 font-medium">
                      Set duration first
                    </span>
                  )}
                </div>
                
                {/* Hostel Card */}
                <div 
                  onClick={() => isDurationSet && handleTabNavigation('hostel')}
                  className={`bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center text-center ${
                    isDurationSet 
                      ? 'border-gray-200 hover:shadow-md transition-shadow cursor-pointer' 
                      : 'border-gray-100 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className={`rounded-full p-3 mb-4 ${
                    isDurationSet ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Hostel Accommodation</h3>
                  <p className="text-gray-600 mb-4">
                    Manage student hostel rules
                  </p>
                  {isDurationSet ? (
                    <button className="text-indigo-600 font-medium hover:text-indigo-800">
                      Manage Hostels →
                    </button>
                  ) : (
                    <span className="text-sm text-red-500 font-medium">
                      Set duration first
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Duration warning message */}
            {!isDurationSet && (
              <div className="mt-12 p-5 bg-yellow-50 border border-yellow-200 rounded-xl text-center max-w-2xl">
                <p className="text-yellow-700 text-lg">
                  <span className="font-bold">Important:</span> Please configure the duration settings 
                  before accessing other administration sections.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;