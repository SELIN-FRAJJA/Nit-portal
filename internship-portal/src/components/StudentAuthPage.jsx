import React, { useState, useEffect } from 'react';

const StudentAuthPage = ({ onAuthSuccess, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructions, setInstructions] = useState('');

  // Load instructions from localStorage or use default
  useEffect(() => {
    const savedInstructions = localStorage.getItem('studentPortalInstructions');
    if (savedInstructions) {
      setInstructions(savedInstructions);
    } else {
      const defaultInstructions = `**🎓 Student Portal Instructions**

Welcome to the Student Internship Portal! Please follow these instructions carefully to register and apply for your internship preferences.

**✅ 1️⃣ Sign Up or Sign In**

- New Students:
  - Click Sign Up if you are registering for the first time.
  - Provide all required information accurately.

- Existing Students:
  - Click Sign In to log in with your registered email ID and password.

**✅ 2️⃣ Complete Your Profile & Upload Documents:**

Fill in personal, academic, and contact details including Aadhaar, CGPA, and area of interest.
Upload documents: Aadhaar, College ID, Resume, and NOC.
Mention accommodation type and complete captcha verification to finish registration.

**✅ 3️⃣ Select Faculty Choices**

After completing your profile:

- Select up to five faculty choices for your internship.
- For each choice:
  - Select the Department
  - Select the Faculty Member
  - Select the Domain/Area relevant to your interest

Note: You must select at least one choice and a maximum of five.

**✅ 4️⃣ Submit and Complete**

- Review all the information and uploaded documents.
- Ensure your faculty choices are correct.
- Click Submit to complete your registration and choice submission.

Your application will then be processed for internship allocation based on the preferences you provided.

📌 Important Tips

- Double-check all details and documents before submitting.
- Use a valid email and phone number for communication.
- Contact the admin immediately if you need to edit any details after submission.
- Follow all deadlines for each stage as shared by the admin.`;
      setInstructions(defaultInstructions);
      localStorage.setItem('studentPortalInstructions', defaultInstructions);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setLoading(true);
    try {
      const baseUrl = 'http://localhost:5000';
      const url = isSignUp ? `${baseUrl}/api/student/signup` : `${baseUrl}/api/student/login`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred');
      } else {
        const infoRes = await fetch(`${baseUrl}/api/student/email/${encodeURIComponent(formData.email)}`);
        const student = await infoRes.json();

        localStorage.setItem('studentInfo', JSON.stringify(student));
        onAuthSuccess(student.email);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const renderInstructionLine = (line, index) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <h3 key={index} className="text-lg font-bold text-blue-600 mt-4 mb-2">
          {line.replace(/\*\*/g, '')}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      return (
        <li key={index} className="ml-4 text-gray-700 mb-1">
          {line.substring(2)}
        </li>
      );
    } else if (line.trim() === '') {
      return <br key={index} />;
    } else {
      return (
        <p key={index} className="text-gray-700 mb-2">
          {line}
        </p>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 relative">
        {/* Instructions Button */}
        <button
          onClick={() => setShowInstructions(true)}
          className="absolute top-4 right-4 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors"
          title="View Instructions"
        >
          i
        </button>

        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          {isSignUp ? 'Student Sign Up' : 'Student Sign In'}
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <div className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-gray-600 mb-1" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="email">College Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="your.name@college.edu"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {isSignUp && (
            <div>
              <label className="block text-gray-600 mb-1" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setIsSignUp(false); setError(''); }}
                className="text-green-600 hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => { setIsSignUp(true); setError(''); }}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-gray-500 hover:underline"
          >
            Back to Login Type Selection
          </button>
        </div>
      </div>

      {/* Instructions Modal - Preview Only */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Student Portal Instructions</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-semibold text-gray-700 mb-2">Instructions:</h4>
                <div className="prose prose-sm max-w-none">
                  {instructions.split('\n').map((line, index) => renderInstructionLine(line, index))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAuthPage;
