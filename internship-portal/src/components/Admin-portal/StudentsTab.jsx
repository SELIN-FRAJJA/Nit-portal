// src/components/StudentsTab.jsx
import React from 'react';
import { Book } from 'lucide-react';

const StudentsTab = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Management</h2>
      <div className="text-center py-12">
        <Book className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Student Management Panel</h3>
        <p className="text-gray-500">
          This section will contain student enrollment, academic records, and performance tracking features.
        </p>
      </div>
    </div>
  );
};

export default StudentsTab;