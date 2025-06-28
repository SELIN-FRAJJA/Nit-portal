import React from 'react';
import { FileText, User, Mail, Phone, Book, Calendar, Home } from 'lucide-react';

export default function StudentDetailView({ formData }) {
  // Helper to display file names
  const getFileName = (file) => {
    if (!file) return "Not uploaded";
    return file.name || (typeof file === 'string' ? file.split('/').pop() : "Uploaded");
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="mr-2 h-5 w-5" /> Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="Full Name" value={formData.name} />
          <DetailField label="Email" value={formData.email} icon={<Mail />} />
          <DetailField label="Phone" value={formData.phone} icon={<Phone />} />
          <DetailField label="Alternate Phone" value={formData.otherPhone} />
          <DetailField label="Aadhaar Number" value={formData.aadharNumber} />
          <DetailField label="CGPA" value={formData.cgpa} />
        </div>
      </div>

      {/* College Information */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Book className="mr-2 h-5 w-5" /> College Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="College Name" value={formData.collegeName} />
          <DetailField label="Department" value={formData.department} />
          <DetailField label="Current Year" value={formData.currentYear} />
          <DetailField label="Area of Interest" value={formData.areaOfInterest} />
          <DetailField label="Domain of Interest" value={formData.interestedDomain} />
          <DetailField label="Experience" value={formData.experience} />
        </div>
      </div>

      {/* Family Information */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Home className="mr-2 h-5 w-5" /> Family Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="Father's Name" value={formData.fatherName} />
          <DetailField label="Mother's Name" value={formData.motherName} />
          <DetailField label="Father's Phone" value={formData.fatherPhone} />
          <DetailField label="Mother's Phone" value={formData.motherPhone} />
          <DetailField label="Address" value={formData.address} spanFull />
        </div>
      </div>

      {/* Documents */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="mr-2 h-5 w-5" /> Documents
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentField label="Aadhaar Card" file={formData.aadhaarFile} />
          <DocumentField label="College ID Card" file={formData.idCardFile} />
          <DocumentField label="NOC Letter" file={formData.nocFile} />
          <DocumentField label="Resume" file={formData.resumeFile} />
        </div>
      </div>
    </div>
  );
}

const DetailField = ({ label, value, icon, spanFull = false }) => (
  <div className={spanFull ? "md:col-span-2" : ""}>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="flex items-center mt-1">
      {icon && <span className="mr-2 text-gray-400">{icon}</span>}
      <p className="text-base">{value || "Not provided"}</p>
    </div>
  </div>
);

const DocumentField = ({ label, file }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-base text-blue-600 font-medium truncate">
      {file ? (file.name || "Uploaded") : "Uploaded"}
    </p>
  </div>
);