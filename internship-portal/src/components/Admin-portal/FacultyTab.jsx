import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyTab = ({
  windowState, setWindowState, windowLoading, windowError, windowSubmitting, handleWindowChange, handleWindowSubmit,
  studentAppWindow, setStudentAppWindow, studentAppWindowLoading, studentAppWindowError, studentAppWindowSubmitting, handleStudentAppWindowChange, handleStudentAppWindowSubmit,
  resultWindow, setResultWindow, resultLoading, resultError, resultSubmitting, handleResultChange, handleResultSubmit,
  reportWindow, setReportWindow, reportLoading, reportError, reportSubmitting, handleReportChange, handleReportSubmit
}) => {
  const [facultyList, setFacultyList] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [offeringFilter, setOfferingFilter] = useState('All');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Data for modal
  const [applications, setApplications] = useState([]);
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [finalizedStudents, setFinalizedStudents] = useState([]);

  const [loadingApps, setLoadingApps] = useState(false);
  const [appsError, setAppsError] = useState(null);
  const [loadingAccepted, setLoadingAccepted] = useState(false);
  const [acceptedError, setAcceptedError] = useState(null);
  const [loadingFinalized, setLoadingFinalized] = useState(false);
  const [finalizedError, setFinalizedError] = useState(null);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/faculty');
        setFacultyList(response.data);
        setFilteredFaculty(response.data);
      } catch (err) {
        setError('Failed to load faculty data');
      } finally {
        setLoading(false);
      }
    };
    fetchFacultyData();
  }, []);

  useEffect(() => {
    let filtered = facultyList;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.facultyName.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q)
      );
    }
    if (departmentFilter !== 'All') {
      filtered = filtered.filter(f => f.department === departmentFilter);
    }
    if (offeringFilter !== 'All') {
      const isOffering = offeringFilter === 'Offering';
      filtered = filtered.filter(f => !!f.internshipOffering === isOffering);
    }
    setFilteredFaculty(filtered);
  }, [searchQuery, departmentFilter, offeringFilter, facultyList]);

  const departmentOptions = Array.from(new Set(facultyList.map(f => f.department)));

  // Open modal and fetch all three data sets
  const openModal = faculty => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
    fetchApplications(faculty.email, faculty.department);
    fetchAcceptedStudents(faculty.email);
    fetchFinalizedStudents(faculty.email);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFaculty(null);
    setApplications([]);
    setAcceptedStudents([]);
    setFinalizedStudents([]);
    setAppsError(null);
    setAcceptedError(null);
    setFinalizedError(null);
  };

  const fetchApplications = async (facultyEmail, department) => {
    setLoadingApps(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/facultyapplications', {
        params: { facultyEmail, department }
      });
      setApplications(res.data);
    } catch {
      setAppsError('Failed to load applications');
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchAcceptedStudents = async facultyEmail => {
    setLoadingAccepted(true);
    try {
      const res = await axios.get('http://localhost:5000/api/faculty/accepted-students', {
        params: { facultyEmail }
      });
      setAcceptedStudents(res.data);
    } catch {
      setAcceptedError('Failed to load accepted students');
    } finally {
      setLoadingAccepted(false);
    }
  };

  const fetchFinalizedStudents = async facultyEmail => {
    setLoadingFinalized(true);
    try {
      const res = await axios.get('http://localhost:5000/api/faculty/finalized-students', {
        params: { facultyEmail }
      });
      setFinalizedStudents(res.data);
    } catch {
      setFinalizedError('Failed to load finalized students');
    } finally {
      setLoadingFinalized(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading faculty data...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Faculty Internship Offerings</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={departmentFilter}
          onChange={e => setDepartmentFilter(e.target.value)}
        >
          <option value="All">All Departments</option>
          {departmentOptions.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={offeringFilter}
          onChange={e => setOfferingFilter(e.target.value)}
        >
          <option value="All">All Offerings</option>
          <option value="Offering">Offering</option>
          <option value="Not Offering">Not Offering</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offering</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFaculty.length > 0 ? (
              filteredFaculty.map(faculty => (
                <tr key={faculty._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{faculty.facultyName}</div>
                    <div className="text-sm text-gray-500">{faculty.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {faculty.internshipOffering ? (
                      <span className="px-2 inline-flex text-xs rounded-full bg-green-100 text-green-800">Offering</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs rounded-full bg-gray-100 text-gray-800">Not Offering</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => openModal(faculty)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md"
                    >View Details</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="px-6 py-4 text-center">No matching faculty found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500">×</button>

            {/* 1. Faculty Details */}
            <h3 className="text-xl font-semibold mb-4">{selectedFaculty.facultyName}</h3>
            <div className="mb-6 space-y-1">
              <div><strong>Email:</strong> {selectedFaculty.email}</div>
              <div><strong>Department:</strong> {selectedFaculty.department}</div>
              {selectedFaculty.internshipOffering && (
                <>  
                  <div><strong>Domains:</strong> {selectedFaculty.internshipOffering.domains.join(', ')}</div>
                  <div><strong>Type:</strong> {selectedFaculty.internshipOffering.paid}</div>
                  <div><strong>Duration:</strong> {new Date(selectedFaculty.internshipOffering.startDate).toLocaleDateString()} - {new Date(selectedFaculty.internshipOffering.endDate).toLocaleDateString()}</div>
                </>
              )}
            </div>

            {/* 2. Received Applications */}
            <h4 className="text-lg font-medium mb-2">Received Applications</h4>
            {loadingApps ? <p>Loading applications...</p> : appsError ? <p className="text-red-600">{appsError}</p> : (
              <ul className="mb-6 space-y-2">
                {applications.map(app => (
                  <li key={app._id} className="p-3 border rounded-md">
                    <strong>Student:</strong> {app.name} <br/>
                    <strong>Email:</strong> {app.email} <br/>
                    <strong>Department:</strong> {app.department}
                  </li>
                ))}
              </ul>
            )}

            {/* 3. Accepted Students */}
            <h4 className="text-lg font-medium mb-2">Accepted Students</h4>
            {loadingAccepted ? <p>Loading accepted students...</p> : acceptedError ? <p className="text-red-600">{acceptedError}</p> : (
              <ul className="mb-6 space-y-2">
                {acceptedStudents.map(student => (
                  <li key={student._id} className="p-3 border rounded-md">
                    <strong>Name:</strong> {student.name} <br/>
                    <strong>Email:</strong> {student.email} <br/>
                    <strong>Dept:</strong> {student.department}
                  </li>
                ))}
              </ul>
            )}

            {/* 4. Finalized Students */}
            <h4 className="text-lg font-medium mb-2">Finalized Students</h4>
            {loadingFinalized ? <p>Loading finalized students...</p> : finalizedError ? <p className="text-red-600">{finalizedError}</p> : (
              <ul className="space-y-2">
                {finalizedStudents.map(student => (
                  <li key={student._id} className="p-3 border rounded-md">
                    <strong>Name:</strong> {student.name} <br/>
                    <strong>Email:</strong> {student.email} <br/>
                    <strong>Dept:</strong> {student.department} <br/>
                    <strong>Year:</strong> {student.currentYear}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyTab;