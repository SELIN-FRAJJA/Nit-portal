import React, { useState, useEffect } from 'react';
import ApplicationList from './ApplicationList';
import axios from 'axios';

export default function FacultyDashboard({
  facultyEmail,
  facultyDepartment,
  onLogout,
  onViewApplication,
  onAccept,
  onDecline,
}) {
  const [activeTab, setActiveTab] = useState('applications');
  const [internshipData, setInternshipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] = useState({
    offerInternship: '', // 'Yes' | 'No'
    domains: '',
    paid: '',            // 'Paid' | 'Unpaid'
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (!facultyEmail) return;
    setLoading(true);
    axios
      .get('http://localhost:5000/api/faculty/internship-form', {
        params: { email: facultyEmail },
      })
      .then(res => {
        const off = res.data.internshipOffering;
        if (off) {
          setInternshipData(off);
          setFormState({
            offerInternship: 'Yes',
            domains: (off.domains || []).join(', '),
            paid: off.paid || '',
            startDate: off.startDate?.slice(0, 10) || '',
            endDate: off.endDate?.slice(0, 10) || '',
          });
          setIsEditing(false);
        } else {
          setInternshipData(null);
          setFormState(prev => ({ ...prev, offerInternship: 'No' }));
          setIsEditing(true);
        }
      })
      .catch(() => setError('Failed to load internship data'))
      .finally(() => setLoading(false));
  }, [facultyEmail]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setFormSubmitting(true);

    if (formState.offerInternship === 'No') {
      try {
        await axios.post('http://localhost:5000/api/faculty/internship-form', {
          email: facultyEmail,
        });
        setInternshipData(null);
        setSuccessMessage('Internship offering has been cleared.');
        setIsEditing(false);
      } catch {
        setError('Failed to clear internship offering.');
      } finally {
        setFormSubmitting(false);
      }
      return;
    }

    const { domains, paid, startDate, endDate } = formState;
    if (!domains.trim() || !paid || !startDate || !endDate) {
      setError('Please fill in all fields.');
      setFormSubmitting(false);
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      setFormSubmitting(false);
      return;
    }

    try {
      const payload = {
        email: facultyEmail,
        domains: domains.split(',').map(d => d.trim()).filter(Boolean),
        paid,
        startDate,
        endDate,
      };
      const res = await axios.post('http://localhost:5000/api/faculty/internship-form', payload);
      setInternshipData(res.data.faculty.internshipOffering);
      setSuccessMessage('Internship offering updated successfully.');
      setIsEditing(false);
    } catch {
      setError('Failed to submit internship offering.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
        <button onClick={onLogout} className="text-red-600 hover:text-red-800">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('applications')}
          className={`${activeTab === 'applications' ? 'border-indigo-600 text-indigo-600' : 'text-gray-500'}
            px-4 py-2 -mb-px border-b-2`}
        >
          Applications
        </button>
        <button
          onClick={() => setActiveTab('internshipForm')}
          className={`${activeTab === 'internshipForm' ? 'border-indigo-600 text-indigo-600' : 'text-gray-500'}
            ml-4 px-4 py-2 -mb-px border-b-2`}
        >
          Internship Offering Form
        </button>
      </div>

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <ApplicationList
          facultyEmail={facultyEmail}
          facultyDepartment={facultyDepartment}
          onLogout={onLogout}
          onViewApplication={onViewApplication}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      )}

      {/* Internship Form Tab */}
      {activeTab === 'internshipForm' && (
        <div>
          {loading ? (
            <p>Loading internship offering...</p>
          ) : (
            <>
              {/* Summary View */}
              {!isEditing && internshipData && (
                <div className="bg-white p-6 rounded shadow max-w-lg">
                  <h2 className="text-2xl font-semibold mb-4">Your Current Internship Offering</h2>
                  <p><strong>Domains:</strong> {internshipData.domains.join(', ')}</p>
                  <p><strong>Type:</strong> {internshipData.paid}</p>
                  <p><strong>Duration:</strong> {new Date(internshipData.startDate).toLocaleDateString()} to {new Date(internshipData.endDate).toLocaleDateString()}</p>
                  <p className="text-gray-600 mt-2">You can edit your offering anytime before the submission deadline.</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* No-Offering View */}
              {!isEditing && !internshipData && (
                <div className="bg-white p-6 rounded shadow max-w-lg text-center">
                  <h2 className="text-xl font-semibold mb-4">No Active Internship Offering</h2>
                  <p className="text-gray-600">You have not submitted any internship offering yet. You can choose to offer or skip.</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Offer Internship
                  </button>
                </div>
              )}

              {/* Form View */}
              {isEditing && (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white p-6 rounded shadow max-w-lg space-y-6"
                >
                  <h2 className="text-2xl font-semibold">Internship Offering Form</h2>
                  {error && <p className="text-red-600">{error}</p>}
                  {successMessage && <p className="text-green-600">{successMessage}</p>}

                  {/* Yes/No Choice */}
                  <div>
                    <label className="block font-medium mb-2">
                      Do you want to offer internships?
                    </label>
                    <label className="inline-flex items-center mr-6">
                      <input
                        type="radio"
                        name="offerInternship"
                        value="Yes"
                        checked={formState.offerInternship === 'Yes'}
                        onChange={handleChange}
                        required
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="offerInternship"
                        value="No"
                        checked={formState.offerInternship === 'No'}
                        onChange={handleChange}
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>

                  {/* Additional Fields if Yes */}
                  {formState.offerInternship === 'Yes' && (
                    <>
                      <div>
                        <label htmlFor="domains" className="block font-medium mb-2">
                          Domains (comma-separated)
                        </label>
                        <input
                          id="domains"
                          name="domains"
                          value={formState.domains}
                          onChange={handleChange}
                          className="border border-gray-300 rounded px-3 py-2 w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2">Paid or Unpaid:</label>
                        <label className="inline-flex items-center mr-6">
                          <input
                            type="radio"
                            name="paid"
                            value="Paid"
                            checked={formState.paid === 'Paid'}
                            onChange={handleChange}
                            required
                          />
                          <span className="ml-2">Paid</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="paid"
                            value="Unpaid"
                            checked={formState.paid === 'Unpaid'}
                            onChange={handleChange}
                          />
                          <span className="ml-2">Unpaid</span>
                        </label>
                      </div>
                      <div>
                        <label htmlFor="startDate" className="block font-medium mb-2">
                          Start Date
                        </label>
                        <input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={formState.startDate}
                          onChange={handleChange}
                          className="border border-gray-300 rounded px-3 py-2 w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block font-medium mb-2">
                          End Date
                        </label>
                        <input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={formState.endDate}
                          onChange={handleChange}
                          className="border border-gray-300 rounded px-3 py-2 w-full"
                          required
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {formSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
