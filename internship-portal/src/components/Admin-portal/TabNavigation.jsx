// src/components/TabNavigation.jsx
import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'faculty', label: 'Faculty', icon: 'Users' },
    { id: 'students', label: 'Students', icon: 'Book' },
    { id: 'certificates', label: 'Certificates', icon: 'Award' },
    { id: 'hostel', label: 'Hostel Accommodation', icon: 'Home' }
  ];

  return (
    <div className="bg-white border-b pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-white-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;