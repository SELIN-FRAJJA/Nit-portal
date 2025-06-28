import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab, isDurationSet, forceDuration }) => {
  const tabs = [
    { id: 'duration', label: 'Duration', icon: 'Calendar' },
    { id: 'faculty', label: 'Faculty', icon: 'Users' },
    { id: 'students', label: 'Students', icon: 'Book' },
    { id: 'certificates', label: 'Certificates', icon: 'Award' },
    { id: 'hostel', label: 'Hostel Accommodation', icon: 'Home' }
  ];

  return (
    <div className="bg-white pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                // Prevent navigation if forcing duration tab
                if (forceDuration && tab.id !== 'duration') return;
                
                // Prevent navigation if duration not set
                if (tab.id !== 'duration' && !isDurationSet) return;
                
                setActiveTab(tab.id);
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${
                (tab.id !== 'duration' && !isDurationSet) || (forceDuration && tab.id !== 'duration')
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              disabled={
                (tab.id !== 'duration' && !isDurationSet) || 
                (forceDuration && tab.id !== 'duration')
              }
            >
              {tab.label}
              {tab.id !== 'duration' && !isDurationSet && (
                <span className="ml-1 text-xs text-red-500">*</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;