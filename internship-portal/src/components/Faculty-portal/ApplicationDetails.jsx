import React from 'react';
import {
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  User,
  FileText,      // ← add this
} from 'lucide-react';

export default function ApplicationDetails({
  application,
  onAccept,
  onDecline,
  onGoBack,
  onLogout,
}) {
  const handleAccept = async () => {
    try {
      await onAccept(application._id);
      onGoBack();
    } catch (err) {
      console.error('Error accepting application:', err);
    }
  };

  const handleDecline = async () => {
    try {
      await onDecline(application._id);
      onGoBack();
    } catch (err) {
      console.error('Error declining application:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={onGoBack} className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Back to Applications
          </button>
          <button onClick={onLogout} className="text-gray-600 hover:text-gray-800">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow p-8 space-y-6">
          {/* Basic Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{application.name}</h1>
            <p className="text-xl text-indigo-600 font-medium">{application.domain}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div className="flex items-center space-x-2"><Mail /><span>{application.email}</span></div>
            <div className="flex items-center space-x-2"><Phone /><span>{application.phone}</span></div>
            {application.otherPhone && (
              <div className="flex items-center space-x-2"><Phone /><span>{application.otherPhone}</span></div>
            )}
            <div className="flex items-center space-x-2"><User /><span>{application.studentDepartment || application.department}</span></div>
            <div className="flex items-center space-x-2"><GraduationCap /><span>{application.collegeName}</span></div>
            <div className="flex items-center space-x-2">
              <Calendar />
              <span>
                {new Date(application.startDate).toLocaleDateString()} –{' '}
                {new Date(application.endDate).toLocaleDateString()}
              </span>
            </div>
            {application.address && (
              <div className="flex items-center space-x-2"><MapPin /><span>{application.address}</span></div>
            )}
            {application.cgpa && (
              <div className="flex items-center space-x-2">
                <span className="font-medium">CGPA:</span> <span>{application.cgpa}</span>
              </div>
            )}
            {application.experience && (
              <div className="flex items-center space-x-2">
                <span className="font-medium">Experience:</span> <span>{application.experience}</span>
              </div>
            )}
            {application.areaOfInterest && (
              <div className="flex items-center space-x-2">
                <span className="font-medium">Area of Interest:</span> <span>{application.areaOfInterest}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <span className="font-medium">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  application.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : application.status === 'declined'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {application.status}
              </span>
            </div>
          </div>

          {/* Documents Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
            <div className="grid gap-3 text-sm text-gray-700">
              {application.resumeUrl && (
                <div className="flex items-center space-x-2">
                  <FileText />
                  <a
                    href={`http://localhost:5000${application.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Resume
                  </a>
                </div>
              )}
              {application.aadhaarUrl && (
                <div className="flex items-center space-x-2">
                  <FileText />
                  <a
                    href={`http://localhost:5000${application.aadhaarUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Aadhaar
                  </a>
                </div>
              )}
              {application.idCardUrl && (
                <div className="flex items-center space-x-2">
                  <FileText />
                  <a
                    href={`http://localhost:5000${application.idCardUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    College ID Card
                  </a>
                </div>
              )}
              {application.nocUrl && (
                <div className="flex items-center space-x-2">
                  <FileText />
                  <a
                    href={`http://localhost:5000${application.nocUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    NOC
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6 mt-8">
            <button
              onClick={handleAccept}
              className="flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
            >
              <Check className="w-5 h-5" />
              <span>Accept</span>
            </button>
            <button
              onClick={handleDecline}
              className="flex items-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700"
            >
              <X className="w-5 h-5" />
              <span>Decline</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
