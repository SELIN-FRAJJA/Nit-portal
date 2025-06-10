// === COMPLETE UPDATED InternshipPortal.jsx ===

import { useState, useEffect } from 'react';
import facultyList from '../NIT_Trichy_Faculty_List.json';
import { AlertCircle, CheckCircle, ChevronDown, Loader } from 'lucide-react';
import StepOne from './components/Student-portal/student_detail';
import StepTwo from './components/Student-portal/dept_selection';
import StepThree from './components/Student-portal/faculty_selection';
import StepFour from './components/Student-portal/intern_detail';

export default function InternshipPortal() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', collegeName: '', email: '', phone: '', otherPhone: '', captcha: '',
    department: '', currentYear: '', faculty: '', facultyEmail: '',
    startDate: '', endDate: '', studentType: '', cgpa: '', areaOfInterest: '',
    interestedDomain: '', experience: '', aadhaarFile: null, idCardFile: null,
    nocFile: null, resumeFile: null, facultyDepartment: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationCount, setApplicationCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [showSubmittedMessage, setShowSubmittedMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleFacultySelect = (facultyName, facultyEmail) => {
    setFormData(prev => ({ ...prev, faculty: facultyName, facultyEmail }));
    if (errors.faculty) setErrors(prev => ({ ...prev, faculty: '' }));
  };

  const checkApplicationLimit = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/count?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setApplicationCount(data.count);
    } catch (err) {
      console.error('Failed to fetch application count:', err);
    }
  };

  useEffect(() => {
  const stored = localStorage.getItem('studentInfo');
  if (!stored) return;

  const student = JSON.parse(stored);

  setFormData(prev => ({
    ...prev,
    name: student.name || '',
    email: student.email || '',
    collegeName: student.collegeName || '',
    department: student.department || '',
    currentYear: student.currentYear || '',
    phone: student.phone || ''
  }));

  if (student?._id) setStudentId(student._id);

  if (student?.applications?.length > 0) {
    const latest = student.applications[student.applications.length - 1];
    setApplicationId(latest._id);
    setStep(2);  // ✅ Skip to dept selection
  } else {
    setStep(1);  // default to step 1
  }
}, []);

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name) newErrors.name = "Required";
      if (!formData.email) newErrors.email = "Required";
      if (!formData.phone) newErrors.phone = "Required";
      if (!formData.collegeName) newErrors.collegeName = "Required";
      if (!formData.department) newErrors.department = "Required";
      if (!formData.captcha) newErrors.captcha = "Complete captcha";
      if (!formData.currentYear) newErrors.currentYear = "Select year";
    } else if (step === 2) {
      if (!formData.facultyDepartment) newErrors.facultyDepartment = "Select department";
    } else if (step === 3) {
      if (!formData.faculty) newErrors.faculty = "Select faculty";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreviewSubmit = () => {
    if (validateStep(1)) setShowPreview(true);
  };

  const basicSubmit = async () => {
    if (applicationCount >= 5) {
      alert("Max 5 applications reached");
      return;
    }
    setSubmitting(true);
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([k, v]) => v && formDataToSubmit.append(k, v));

    try {
      const res = await fetch('http://localhost:5000/api/applications/basic-submit', {
        method: 'POST', body: formDataToSubmit
      });
      const data = await res.json();
      setApplicationId(data.applicationId);
      setShowPreview(false);
      setShowSubmittedMessage(true);
    } catch (err) {
      alert("Error submitting application");
    } finally {
      setSubmitting(false);
    }
  };

  const createNewApplication = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${applicationId}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faculty: formData.faculty,
          facultyEmail: formData.facultyEmail,
          facultyDepartment: formData.facultyDepartment
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Error submitting application");
        return;
      }

      const data = await res.json();
      setSubmitted(true);
    } catch (err) {
      alert("Error creating new application");
    }
  };

  // Update the resetForm function:
const resetForm = () => {
  setFormData(prev => ({
    ...prev,
    faculty: '',
    facultyEmail: '',
    facultyDepartment: '',
  }));
  setStep(3);
  setSubmitted(false);
  setShowSubmittedMessage(false);
  setErrors({});
};

  const departmentsSet = new Set();
  const facultyByDepartment = {};
  facultyList.forEach(({ Department, Name, Email }) => {
    if (!departmentsSet.has(Department)) {
      departmentsSet.add(Department);
      facultyByDepartment[Department] = [];
    }
    facultyByDepartment[Department].push({ name: Name, email: Email });
  });
  const departments = Array.from(departmentsSet);

  const renderStep = () => {
    if (showSubmittedMessage) {
    return (
      <div className="text-center">
        <p className="text-blue-900">Details submitted. Click Next to continue.</p>
        <button
          onClick={(resetForm) => {
            // resetForm();
            setStep(2);
            setShowSubmittedMessage(false);
          }}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    );
  }

    switch (step) {
      case 1: return (
        <div>
          <StepOne formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} errors={errors} />
          <button onClick={handlePreviewSubmit} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Preview & Submit</button>
          {showPreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-[80%] max-h-[90vh] overflow-y-auto">
                <StepFour formData={formData} />
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setShowPreview(false)} className="mr-4 text-white-600">Cancel</button>
                  <button onClick={basicSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      case 2:
        return (
          <div>
            <StepTwo
              formData={formData}
              handleChange={handleChange}
              departments={departments}
              errors={errors}
            />
            <button
              onClick={() => {
                if (validateStep(2)) setStep(3);
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        );

      case 3: return (
          <div>
            <StepThree formData={formData} handleFacultySelect={handleFacultySelect} facultyByDepartment={facultyByDepartment} errors={errors} />
            <button onClick={createNewApplication} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
              Submit Application
            </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
        { submitted ? (
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-600 w-12 h-12" />
            <h2 className="text-2xl font-semibold mt-4">Application Submitted!</h2>
            <p className="mt-2 text-gray-600">Your application has been sent to {formData.faculty}.</p>
            <button 
              onClick={() => {
                setStep(2);
                setSubmitted(false);
              }} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          renderStep()
        )}
      </div>
    </div>
  );
}
