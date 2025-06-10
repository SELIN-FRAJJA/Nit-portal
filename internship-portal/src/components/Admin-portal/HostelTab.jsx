// src/components/HostelTab.jsx
import React from 'react';

const HostelTab = () => {
  const hostelRules = [
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
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Hostel Accommodation Rules</h2>
      <div className="space-y-4">
        {hostelRules.map((rule, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              {index + 1}
            </div>
            <p className="text-gray-700 leading-relaxed">{rule}</p>
          </div>
        ))}
      </div>
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