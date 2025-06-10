// src/components/StepFour.jsx
import { AlertCircle } from 'lucide-react';

export default function StepFour({ formData, handleChange, handleFileChange, errors }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Internship Summary</h2>

      {/* Summary Info */}
      <div className="bg-gray-50 p-4 rounded-md space-y-4">
        <h3 className="font-medium text-gray-700 border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Full Name:</span> {formData.name || '—'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">College Email:</span> {formData.email || '—'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Phone:</span> {formData.phone || '—'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Alternate Phone:</span> {formData.otherPhone || '—'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Aadhaar Number:</span> {formData.aadharNumber || '—'}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md space-y-4">
        <h3 className="font-medium text-gray-700 border-b pb-2">Academic & Skill Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">College Name:</span> {formData.collegeName || '—'}
          </p>
          {/* Fixed: Display student's department (this is what the student entered) */}
          <p className="text-gray-600">
            <span className="font-medium">Student Department:</span> {formData.department || '—'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Current Year:</span> {formData.currentYear || '—'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">CGPA:</span> {formData.cgpa ? `${formData.cgpa}/10` : '—'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Area of Interest:</span> {formData.areaOfInterest || '—'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Experience:</span> {formData.experience || '—'}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md space-y-4">
        <h3 className="font-medium text-gray-700 border-b pb-2">Internship Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Start Date:</span> {formData.startDate || '—'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">End Date:</span> {formData.endDate || '—'}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Accommodation Type:</span> {formData.studentType || '—'}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md space-y-4">
        <h3 className="font-medium text-gray-700 border-b pb-2">Uploaded Documents</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Aadhaar Card: 
              {formData.aadhaarFile ? (
                <span className="text-green-600 ml-1">{formData.aadhaarFile.name}</span>
              ) : (
                <span className="text-red-500 ml-1">Not uploaded</span>
              )}
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              College ID Card: 
              {formData.idCardFile ? (
                <span className="text-green-600 ml-1">{formData.idCardFile.name}</span>
              ) : (
                <span className="text-red-500 ml-1">Not uploaded</span>
              )}
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Resume: 
              {formData.resumeFile ? (
                <span className="text-green-600 ml-1">{formData.resumeFile.name}</span>
              ) : (
                <span className="text-red-500 ml-1">Not uploaded</span>
              )}
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>S
            <span>
              NOC: 
              {formData.nocFile ? (
                <span className="text-green-600 ml-1">{formData.nocFile.name}</span>
              ) : (
                <span className="text-red-500 ml-1">Not uploaded</span>
              )}
            </span>
          </li>
        </ul>
      </div>

      {/* Optional Edit Message */}
      <p className="text-sm text-gray-500 mt-4">
        If you need to make any changes, go back to the previous steps.
      </p>
    </div>
  );
}