import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, AlertCircle } from 'lucide-react';

const HostelTab = () => {
  const initialRules = [
    "Check-in time: 6:00 PM on weekdays, 8:00 PM on weekends",
    "No visitors allowed in rooms after 9:00 PM",
    "Maintain cleanliness in common areas and personal rooms",
    "No smoking or alcohol consumption within hostel premises",
    "Report any maintenance issues to the warden immediately",
    "Internet usage is monitored and should be for academic purposes",
    "Noise levels should be kept to minimum during study hours (7-10 PM)",
    "Students must inform warden before leaving for extended periods",
    "Mess timings: Breakfast (7-9 AM), Lunch (12-2 PM), Dinner (7-9 PM)",
    "Emergency contact numbers should be updated with hostel administration"
  ];

  const [hostelRules, setHostelRules] = useState(initialRules);
  const [isEditing, setIsEditing] = useState(false);
  const [editableRules, setEditableRules] = useState([...initialRules]);
  const [saveStatus, setSaveStatus] = useState('');

  // Load rules from localStorage on component mount
  useEffect(() => {
    const loadRules = () => {
      try {
        // In a real environment, you would use localStorage
         const savedRules = localStorage.getItem('hostelRules');
         if (savedRules) {
           const parsedRules = JSON.parse(savedRules);
           setHostelRules(parsedRules);
           setEditableRules([...parsedRules]);
         }
        
        // For demo purposes in this environment, we'll simulate loading
        // In your actual implementation, uncomment the localStorage code above
        console.log('Rules would be loaded from localStorage here');
      } catch (error) {
        console.error('Error loading rules:', error);
        setSaveStatus('Error loading saved rules');
      }
    };

    loadRules();
  }, []);

  // Save rules to localStorage
  const saveRulesToStorage = (rules) => {
    try {
      // In a real environment, you would use localStorage
      localStorage.setItem('hostelRules', JSON.stringify(rules));
      
      // For demo purposes, we'll simulate saving
      console.log('Rules would be saved to localStorage:', rules);
      setSaveStatus('Rules saved successfully!');
      
      // Alternative: Save to backend API
      // fetch('/api/hostel-rules', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ rules })
      // });
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving rules:', error);
      setSaveStatus('Error saving rules');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditableRules([...hostelRules]);
  };

  const handleSave = () => {
    // Filter out empty rules
    const filteredRules = editableRules.filter(rule => rule.trim() !== '');
    setHostelRules(filteredRules);
    saveRulesToStorage(filteredRules);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableRules([...hostelRules]);
    setIsEditing(false);
  };

  const handleRuleChange = (index, value) => {
    const updatedRules = [...editableRules];
    updatedRules[index] = value;
    setEditableRules(updatedRules);
  };

  const handleAddRule = () => {
    setEditableRules([...editableRules, '']);
  };

  const handleDeleteRule = (index) => {
    const updatedRules = editableRules.filter((_, i) => i !== index);
    setEditableRules(updatedRules);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hostel Accommodation Rules</h2>
        <div className="flex items-center space-x-2">
          {saveStatus && (
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm ${
              saveStatus.includes('Error') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              <AlertCircle size={14} />
              <span>{saveStatus}</span>
            </div>
          )}
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={16} />
              <span>Edit Rules</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {(isEditing ? editableRules : hostelRules).map((rule, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              {index + 1}
            </div>
            {isEditing ? (
              <div className="flex-1 flex items-center space-x-2">
                <textarea
                  value={rule}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md resize-none min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter rule..."
                />
                <button
                  onClick={() => handleDeleteRule(index)}
                  className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete rule"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed flex-1">{rule}</p>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-4">
          <button
            onClick={handleAddRule}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors border-2 border-dashed border-blue-300"
          >
            <Plus size={16} />
            <span>Add New Rule</span>
          </button>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Important Notice</h4>
        <p className="text-yellow-700 text-sm">
          All hostel residents must comply with the above rules. Violation of any rule may result in 
          disciplinary action including warnings, fines, or termination of hostel accommodation.
        </p>
      </div>
    </div>
  );
};

export default HostelTab;