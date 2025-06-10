// src/components/FacultyTab.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyTab = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/faculty');
        setFacultyList(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching faculty data:', err);
        setError('Failed to load faculty data');
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading faculty data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Faculty Internship Offerings</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Faculty Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Internship Offering
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {facultyList.map((faculty) => (
              <tr key={faculty._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{faculty.facultyName}</div>
                  <div className="text-sm text-gray-500">{faculty.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {faculty.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {faculty.internshipOffering ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Offering
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Not Offering
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {faculty.internshipOffering ? (
                    <div className="space-y-1">
                      <div>
                        <span className="font-medium">Domains:</span>{' '}
                        {faculty.internshipOffering.domains.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>{' '}
                        {faculty.internshipOffering.paid}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>{' '}
                        {new Date(faculty.internshipOffering.startDate).toLocaleDateString()} -{' '}
                        {new Date(faculty.internshipOffering.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    'No internship offering'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyTab;