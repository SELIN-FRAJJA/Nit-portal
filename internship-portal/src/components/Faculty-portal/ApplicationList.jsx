import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Download } from 'lucide-react';
import axios from 'axios';

export default function ApplicationList({
  facultyEmail,
  facultyDepartment,
  onLogout,
  onViewApplication,
  onAccept,
  onDecline,
}) {
  const [facultyName, setFacultyName] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacultyName = async () => {
      if (!facultyEmail) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/faculty?email=${encodeURIComponent(facultyEmail)}`
        );
        setFacultyName(response.data.name);
      } catch (err) {
        console.error('Error fetching faculty name:', err);
        setFacultyName('');
      }
    };
    fetchFacultyName();
  }, [facultyEmail]);

const fetchApplications = async () => {
  if (!facultyEmail) {
    setApplications([]);
    return;
  }
  setLoading(true);
  setError(null);

  try {
    let url = `http://localhost:5000/api/applications?facultyEmail=${encodeURIComponent(facultyEmail)}`;
    if (facultyDepartment) {
      url += `&department=${encodeURIComponent(facultyDepartment)}`;
    }

    const response = await axios.get(url);
    console.log('→ [fetchApplications] status:', response.status);
    console.log('→ [fetchApplications] data:', response.data);

    if (Array.isArray(response.data)) {
      setApplications(response.data);
    } else {
      console.error('Unexpected data format:', response.data);
      setApplications([]);
      setError('Invalid data format received');
    }
  } catch (err) {
    console.error('Error fetching applications:', err);
    setApplications([]);
    setError('Failed to load applications');
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchApplications();
  }, [facultyEmail, facultyDepartment]);

  const downloadExcel = async (type) => {
    const endpoint = type === 'accepted' ? 'accepted-excel' : 'rejected-excel';
    try {
      const response = await axios.get(
        `http://localhost:5000/api/applications/${endpoint}?facultyEmail=${encodeURIComponent(facultyEmail)}`,
        { responseType: 'blob' }
      );
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${type}_applications_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(`Error downloading ${type} applications:`, err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-full text-white">
            {/* user icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 12a3 3 0 11-6 0 3 3 0 016 0zm0 5a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Welcome {facultyName},</h2>
            <p className="text-sm text-gray-500">{facultyEmail}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => downloadExcel('accepted')} className="flex items-center space-x-1 bg-green-50 px-3 py-2 rounded-lg hover:bg-green-100 text-green-700">
            <Download className="w-4 h-4" />
            <span>Accepted</span>
          </button>
          <button onClick={() => downloadExcel('rejected')} className="flex items-center space-x-1 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 text-red-700">
            <Download className="w-4 h-4" />
            <span>Rejected</span>
          </button>
          <button onClick={onLogout} className="ml-4 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Intern Applications</h2>
        <p className="text-gray-600">Review and manage student internship applications</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading applications...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-gray-900">No Pending Applications</p>
          <p className="text-gray-600">All applications have been reviewed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{app.name}</h3>
                  <p className="text-indigo-600 font-medium mb-2">{app.domain}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>🎓 {app.collegeName}</span>
                    <span>📅 {new Date(app.startDate).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      app.status === 'declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{app.status}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => onViewApplication(app)} className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div><strong>Department:</strong> {app.department}</div>
                <div><strong>Year:</strong> {app.currentYear}</div>
                <div><strong>Phone:</strong> {app.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}