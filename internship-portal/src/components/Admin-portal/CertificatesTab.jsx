// src/components/CertificatesTab.jsx
import React from 'react';
import { Award, Save } from 'lucide-react';

const CertificatesTab = ({ 
  certificateAccess, 
  setCertificateAccess, 
  handleCertificateSubmit 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Certificate Management</h2>
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-3">Faculty Certificate Generation Access</h3>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Allow Access to faculty on generating certificate?
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="certificateAccess"
                value="allowed"
                checked={certificateAccess === 'allowed'}
                onChange={(e) => setCertificateAccess(e.target.value)}
                className="mr-2 text-blue-600"
              />
              <span className="text-green-600 font-medium">Allowed</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="certificateAccess"
                value="not-allowed"
                checked={certificateAccess === 'not-allowed'}
                onChange={(e) => setCertificateAccess(e.target.value)}
                className="mr-2 text-blue-600"
              />
              <span className="text-red-600 font-medium">Not Allowed</span>
            </label>
          </div>
        </div>
        
        <button
          onClick={handleCertificateSubmit}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Save size={18} />
          <span>Save Certificate Settings</span>
        </button>
      </div>
    </div>
  );
};

export default CertificatesTab;