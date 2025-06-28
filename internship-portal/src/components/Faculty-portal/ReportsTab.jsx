import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function ReportsTab({ facultyEmail }) {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [studentNameFilter, setStudentNameFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/faculty/reports?facultyEmail=${encodeURIComponent(facultyEmail)}`
        );
        const data = await res.json();
        setReports(data);
        setFilteredReports(data);
      } catch (err) {
        setReports([]);
        setFilteredReports([]);
      } finally {
        setLoading(false);
      }
    }

    if (facultyEmail) fetchReports();
  }, [facultyEmail]);

  useEffect(() => {
    const filtered = reports.filter((report) =>
      (report.studentId?.name || '').toLowerCase().includes(studentNameFilter.toLowerCase()) &&
      (report.title || '').toLowerCase().includes(titleFilter.toLowerCase()) &&
      (report.domain || '').toLowerCase().includes(domainFilter.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [studentNameFilter, titleFilter, domainFilter, reports]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600 text-lg">Loading reports...</div>
    );
  }

  if (selected) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-xl p-6 space-y-4">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-black"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">Report Details</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Student:</strong> {selected.studentId?.name} ({selected.studentId?.email})</p>
            <p><strong>Title:</strong> {selected.title}</p>
            <p><strong>Domain:</strong> {selected.domain}</p>
            <p><strong>Remarks:</strong> {selected.remarks || '—'}</p>
            <p>
              <strong>PDF:</strong>{' '}
              <a
                href={selected.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                View / Download
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Submitted Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Student Name"
          value={studentNameFilter}
          onChange={(e) => setStudentNameFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Filter by Title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Filter by Domain"
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-gray-500 text-center">No matching reports found.</div>
      ) : (
        <div className="max-w-5xl mx-auto overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Domain</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-800">{report.studentId?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{report.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{report.domain}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(report)}
                      className="text-white bg-black px-3 py-1.5 rounded hover:bg-gray-800 text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
