import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import StepOne from './components/Student-portal/student_detail';
import StepThree from './components/Student-portal/faculty_selection';
import StepFour from './components/Student-portal/intern_detail';
import ChoiceForm from './components/Student-portal/ChoiceForm';
import { useNavigate } from 'react-router-dom';
import StudentDetailView from './components/Student-portal/student_detail_view';

export default function InternshipPortal(props) {
  const MAX_APPLICATIONS = 5;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', collegeName: '', email: '', phone: '', otherPhone: '', captcha: '',
    department: '', currentYear: '', faculty: '', facultyEmail: '',
    startDate: '', endDate: '', studentType: '', cgpa: '', areaOfInterest: '',
    interestedDomain: '', experience: '', aadhaarFile: null, idCardFile: null,
    nocFile: null, resumeFile: null, facultyDepartment: ''
  });
  const [appWindow, setAppWindow] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationCount, setApplicationCount] = useState(0);
  const [studentId, setStudentId] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSubmittedMessage, setShowSubmittedMessage] = useState(false);
  const [choices, setChoices] = useState([{ facultyDepartment: '', faculty: '', facultyEmail: '', selectedDomain: ''  }]);
  const [departments, setDepartments] = useState([]);
  const [facultyByDepartment, setFacultyByDepartment] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [submittedApplications, setSubmittedApplications] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    title: '',
    domain: '',
    remarks: '',
    reportFile: null
  });
  const [reportWindow, setReportWindow] = useState(null);
  const [finalized, setFinalized] = useState(null);

  // Fetch and update application count & remaining slots
  const fetchApplicationCount = async (email) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/applications/count?email=${encodeURIComponent(email)}`
      );
      const { count } = await res.json();
      setApplicationCount(count);
    } catch (err) {
      console.error('Failed to fetch application count:', err);
    }
  };

  useEffect(() => {
    async function checkApplicationWindow() {
      try {
        const res = await fetch('http://localhost:5000/api/student-app-window');
        const data = await res.json();
        setAppWindow(data);
      } catch (err) {
        console.error('Failed to check application window:', err);
        setAppWindow({
          showApplication: false,
          message: 'Failed to load application status'
        });
      }
    }
    checkApplicationWindow();
  }, []);

  useEffect(() => {
    async function checkFinalized() {
      if (!formData.email) return;
      try {
        const res = await fetch(`http://localhost:5000/api/applications/finalized?email=${encodeURIComponent(formData.email)}`);
        const data = await res.json();
        if (data && data.facultyEmail) {
          setFinalized(data);
        } else {
          setFinalized(null);
        }
      } catch (e) {
        setFinalized(null);
      }
    }
    checkFinalized();
  }, [formData.email]);


  useEffect(() => {
    async function fetchApplications() {
      if (appWindow && !appWindow.showApplication && formData.email) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/applications/student?studentEmail=${encodeURIComponent(formData.email)}`
          );
          const data = await res.json();
          setSubmittedApplications(data);
        } catch (err) {
          console.error('Failed to fetch applications:', err);
        }
      }
    }
    fetchApplications();
  }, [appWindow, formData.email]);

  // Fetch report window status
  useEffect(() => {
    async function checkReportWindow() {
      try {
        const res = await fetch('http://localhost:5000/api/report-window');
        const data = await res.json();
        setReportWindow(data);
      } catch (err) {
        console.error('Failed to check report window:', err);
      }
    }
    checkReportWindow();
  }, []);

  useEffect(() => {
    async function fetchAvailableFaculties() {
      try {
        const res = await fetch('http://localhost:5000/api/faculty/available');
        const data = await res.json();
        const grouped = {};
        data.forEach(fac => {
          if (!grouped[fac.department]) grouped[fac.department] = [];
          grouped[fac.department].push({
            name: fac.facultyName,
            email: fac.email,
            startDate: fac.internshipOffering?.startDate,
            domains: fac.internshipOffering?.domains || [],
            endDate: fac.internshipOffering?.endDate
          });
        });
        setFacultyByDepartment(grouped);
        setDepartments(Object.keys(grouped));
      } catch (err) {
        console.error('Error fetching available faculty:', err);
      }
    }
    fetchAvailableFaculties();
  }, []);

  // INITIALIZE on mount
  useEffect(() => {
    const studentRaw = localStorage.getItem('studentInfo');
    if (!studentRaw) return;

    const student = JSON.parse(studentRaw);
    setFormData(fd => ({
      ...fd,
      name: student.name || '',
      email: student.email || '',
      collegeName: student.collegeName || '',
      department: student.department || '',
      currentYear: student.currentYear || '',
      phone: student.phone || '',
    }));
    if (student._id) setStudentId(student._id);
    if (student.applications?.length) {
      const latest = student.applications[student.applications.length - 1];
      setApplicationId(latest._id);
      setStep(2);
    }

    fetchApplicationCount(student.email);
  }, []);

  // UTILS
  const remainingSlots = MAX_APPLICATIONS - applicationCount;

  // INPUT HANDLERS
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
    setErrors(err => ({ ...err, [name]: '' }));
  };

  const handleFileChange = e => {
    const { name, files } = e.target;
    setFormData(fd => ({ ...fd, [name]: files[0] }));
  };

  const handleFacultySelect = (name, email) => {
    setFormData(fd => ({ ...fd, faculty: name, facultyEmail: email }));
    setErrors(err => ({ ...err, faculty: '' }));
  };

  // Report handlers
  const handleReportChange = e => {
    const { name, value } = e.target;
    setReportData(prev => ({ ...prev, [name]: value }));
  };

  const handleReportFileChange = e => {
    setReportData(prev => ({ ...prev, reportFile: e.target.files[0] }));
  };

  const handleReportSubmit = async () => {
    if (!studentId) {
      alert("Student information is missing. Please refresh the page.");
      return;
    }
    if (!finalized || !finalized.facultyEmail) {
      alert("You must have finalized your internship before submitting a report!");
      return;
    }

    if (!reportData.reportFile || !reportData.title || !reportData.domain) {
      alert("All fields and a PDF file are required!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('studentId', studentId);
      formData.append('facultyEmail', finalized.facultyEmail);
      formData.append('title', reportData.title);
      formData.append('domain', reportData.domain);
      formData.append('remarks', reportData.remarks);
      formData.append('reportFile', reportData.reportFile);

      const response = await fetch('http://localhost:5000/api/reports/submit', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Report submission failed');
      }
      alert('Report submitted successfully!');
      setShowReportForm(false);
      setReportData({
        title: '',
        domain: '',
        remarks: '',
        reportFile: null
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report');
    }
  };

  // VALIDATION
  const validateStep = stepIdx => {
    const errs = {};
    if (stepIdx === 1) {
      ['name','email','phone','collegeName','department','captcha','currentYear']
        .forEach(k => { if (!formData[k]) errs[k] = 'Required'; });
    }
    if (stepIdx === 2 && !formData.facultyDepartment) errs.facultyDepartment = 'Select department';
    if (stepIdx === 3 && !formData.faculty) errs.faculty = 'Select faculty';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  // STEP 1: BASIC SUBMIT
  const basicSubmit = async () => {
    if (applicationCount >= MAX_APPLICATIONS) {
      alert('You have reached the maximum number of applications.');
      return;
    }
    if (!validateStep(1)) return;

    setSubmitting(true);
    const payload = new FormData();
    Object.entries(formData).forEach(([k,v]) => v && payload.append(k,v));

    try {
      const res = await fetch('http://localhost:5000/api/applications/basic-submit', {
        method: 'POST', body: payload
      });
      const data = await res.json();
      setApplicationId(data.applicationId);
      setShowSubmittedMessage(true);
      fetchApplicationCount(formData.email);
    } catch {
      alert('Error on basic submit.');
    } finally {
      setSubmitting(false);
      setShowPreviewModal(false);
    }
  };

  // STEP 2: MULTIPLE DUPLICATE
  const createMultipleApplications = async () => {
    if (applicationCount >= MAX_APPLICATIONS) return;
    const valid = choices.filter(
      c => c.facultyDepartment && c.faculty && c.facultyEmail && c.preferredStart && c.preferredEnd
    );
    if (!valid.length) {
      alert('Please pick at least one faculty in your choices.');
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/duplicate-multiple`,
        { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({choices: valid.slice(0, remainingSlots)}) }
      );
      if (!res.ok) throw await res.json();
      setSubmitted(true);
      fetchApplicationCount(formData.email);
    } catch (err) {
      alert(err.error || 'Error submitting multiple applications.');
    }
  };

  // STEP 3: SINGLE DUPLICATE
  const createNewApplication = async () => {
    if (applicationCount >= MAX_APPLICATIONS) return;
    if (!validateStep(3)) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/duplicate`,
        { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            faculty: formData.faculty,
            facultyEmail: formData.facultyEmail,
            facultyDepartment: formData.facultyDepartment,
            startDate: formData.startDate,
            endDate: formData.endDate
          })
        }
      );
      if (!res.ok) throw await res.json();
      setSubmitted(true);
      fetchApplicationCount(formData.email);
    } catch (err) {
      alert(err.error || 'Error submitting application.');
    }
  };

  // Reset choices when starting a new application
  const startNewApplication = () => {
    setChoices(Array(remainingSlots).fill({
      facultyDepartment: '',
      faculty: '',
      facultyEmail: ''
    }).slice(0, 1)); // Start with 1 choice
    setSubmitted(false);
    setStep(2);
  };

  // RENDER LOGIC
  const renderStep = () => {
    if (applicationCount >= MAX_APPLICATIONS+1) {
      return (
        <div className="text-center p-6">
          <AlertCircle className="mx-auto text-red-600 w-12 h-12" />
          <h2 className="text-xl font-semibold mt-4">Max Applications Reached</h2>
          <p className="mt-2 text-gray-600">You can only submit up to {MAX_APPLICATIONS} applications.</p>
        </div>
      );
    }

    if (showSubmittedMessage && step === 1) {
      return (
        <div className="text-center p-6">
          <CheckCircle className="mx-auto text-green-600 w-12 h-12" />
          <h2 className="text-xl font-semibold mt-4">Basic Details Saved!</h2>
          <p className="mt-2 text-gray-600">
            You can now select your faculty choices.
          </p>
          <button
            onClick={() => {
              setChoices([{ facultyDepartment: '', faculty: '', facultyEmail: '' }]); // Reset choices
              setStep(2);
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next: Select Faculty Choices
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <>
            <StepOne
              formData={formData}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              errors={errors}
            />
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              >
                <span>Preview Application</span>
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <p className="text-blue-900">
                {applicationCount > 0
                  ? `You have submitted ${applicationCount-1} applications. You can submit ${remainingSlots+1} more.`
                  : 'Select your faculty choices.'}
              </p>
            </div>
            <h3 className="text-lg font-semibold text-black">
              Faculty Selection (Choices {applicationCount}/{MAX_APPLICATIONS})
            </h3>
            <ChoiceForm
              choices={choices}
              setChoices={setChoices}
              departments={departments}
              facultyByDepartment={facultyByDepartment}
              applicationCount={applicationCount}
              maxApplications={MAX_APPLICATIONS}
              remainingSlots={remainingSlots}
              errors={errors}
            />
            <button
              onClick={createMultipleApplications}
              disabled={applicationCount >= MAX_APPLICATIONS}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Submit Choices
            </button>
          </div>
        );
      case 3:
        return (
          <>
            <StepThree
              formData={formData}
              handleFacultySelect={handleFacultySelect}
              facultyByDepartment={facultyByDepartment}
              errors={errors}
            />
            <button
              onClick={createNewApplication}
              disabled={applicationCount >= MAX_APPLICATIONS}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Single Choice
            </button>
          </>
        );
      default:
        return null;
    }
  };

  // --- MAIN RETURN ---
  if (appWindow === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading application status...</p>
      </div>
    );
  }
  

    // ---- APPLICATION CLOSED ----
  if (!appWindow.showApplication) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 relative">
        {/* Top-right buttons */}
        <div className="absolute top-4 right-6 z-10 flex flex-col gap-4">
          <button
            onClick={() => setShowProfileModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            View Profile
          </button>

          <button
            onClick={() => navigate('/student/result', { state: { email: formData.email } })}
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
          >
            View Result
          </button>

          {/* Submit Internship Report Button */}
          {reportWindow?.showReport && finalized && (
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
              onClick={() => setShowReportForm(true)}
            >
              Submit Internship Report
            </button>
          )}
        </div>

        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded shadow p-6 text-center text-black">
            <h2 className="text-xl font-semibold mb-4 text-black">Application Status</h2>
            <p className="mb-4">{appWindow.message}</p>

            {/* Submitted applications */}
            {new Date() >= new Date(appWindow.startDate) && submittedApplications.length > 0 && (
              <div className="mt-8 text-left">
                <h3 className="text-lg font-semibold mb-4">Faculties Who Have Accepted You</h3>
                <div className="space-y-4">
                  {submittedApplications
                    .filter(app => app.status === "accepted" && app.faculty && app.facultyDepartment)
                    .map((app, index) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium">Faculty:</span>
                          <span>{app.faculty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Department:</span>
                          <span>{app.facultyDepartment}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {appWindow.startDate && (
              <div className="text-sm text-gray-600 mt-4 text-black">
                <p>
                  Application Period: {new Date(appWindow.startDate).toDateString()} to{' '}
                  {new Date(appWindow.endDate).toDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto text-black">
              <div className="flex justify-between items-center p-4 border-b text-black">
                <h3 className="text-xl font-semibold text-black">Student Profile</h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <StudentDetailView formData={formData} />
              </div>
              <div className="p-4 border-t flex justify-end text-black">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Form Modal */}
        {showReportForm && (
          <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow p-8 max-w-2xl w-full mx-auto relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setShowReportForm(false)}
              >
                <X size={22} />
              </button>
              <h2 className="text-xl font-semibold mb-4 text-black">Submit Internship Report</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={reportData.title}
                  onChange={handleReportChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Domain</label>
                <input
                  type="text"
                  name="domain"
                  value={reportData.domain}
                  onChange={handleReportChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Remarks (optional)</label>
                <textarea
                  name="remarks"
                  value={reportData.remarks}
                  onChange={handleReportChange}
                  className="w-full border px-3 py-2 rounded min-h-[80px] resize-y"
                  rows={4}
                  placeholder="Enter your remarks (optional)"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Upload Report (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleReportFileChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleReportSubmit}
                type="button"
              >
                Submit
              </button>
              <button
                className="ml-4 px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowReportForm(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* View Profile Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowProfileModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          View Profile
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* === Main Application Content === */}
        <div className="flex-1 bg-white rounded shadow p-4">
          {submitted && step > 1 ? (
            <div className="text-center">
              <CheckCircle className="mx-auto text-green-600 w-12 h-12" />
              <h2 className="text-2xl font-semibold mt-4">Submitted!</h2>
              <p className="mt-2 text-gray-600">
                {step === 2
                  ? `You have submitted ${applicationCount - 1} applications. ${remainingSlots + 1} slots remaining.`
                  : `${remainingSlots} slots remaining.`}
              </p>
              {remainingSlots > 0 && (
                <button
                  onClick={startNewApplication}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Submit Another Application
                </button>
              )}
            </div>
          ) : (
            renderStep()
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">Student Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <StudentDetailView formData={formData} />
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">Application Preview</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <StepFour formData={formData} />
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-white"
              >
                Cancel
              </button>
              <button
                onClick={basicSubmit}
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-green-300"
              >
                {submitting ? 'Submitting...' : 'Submit Basic Info'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
