import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import axios from 'axios';

const StudentsTab = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [studentNameFilter, setStudentNameFilter] = useState('');
  const [studentEmailFilter, setStudentEmailFilter] = useState('');
  const [facultyNameFilter, setFacultyNameFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  useEffect(() => {
    const fetchFinalizedStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/finalized-students');
        setStudents(res.data);
        setFilteredStudents(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching students:', err);
        setLoading(false);
      }
    };

    fetchFinalizedStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.studentName.toLowerCase().includes(studentNameFilter.toLowerCase()) &&
      student.studentEmail.toLowerCase().includes(studentEmailFilter.toLowerCase()) &&
      student.facultyName.toLowerCase().includes(facultyNameFilter.toLowerCase()) &&
      student.facultyDepartment.toLowerCase().includes(departmentFilter.toLowerCase())&&
      (statusFilter === '' || 
        (statusFilter === 'joined' && student.hasJoined) ||
        (statusFilter === 'not-joined' && !student.hasJoined))
      );
    setFilteredStudents(filtered);
  }, [studentNameFilter, studentEmailFilter, facultyNameFilter, departmentFilter, students]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Management</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Filter by Student Name"
          value={studentNameFilter}
          onChange={(e) => setStudentNameFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Filter by Student Email"
          value={studentEmailFilter}
          onChange={(e) => setStudentEmailFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Filter by Faculty Name"
          value={facultyNameFilter}
          onChange={(e) => setFacultyNameFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Filter by Department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full"
        />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">All Statuses</option>
            <option value="joined">Joined</option>
            <option value="not-joined">Not Joined</option>
          </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <Loader className="animate-spin mx-auto text-blue-600" size={48} />
          <p>Loading student data...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No matching students found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{student.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{student.studentEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{student.facultyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{student.facultyDepartment}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                    {student.hasJoined ? (
                      <span className="text-green-600 font-medium">Joined</span>
                    ) : (
                      <span className="text-gray-500">Not Joined</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentsTab;
