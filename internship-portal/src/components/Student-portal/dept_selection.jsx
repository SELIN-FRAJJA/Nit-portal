// src/components/StepTwo.jsx
import { AlertCircle, ChevronDown } from 'lucide-react';

export default function StepTwo({ formData, handleChange, departments, errors }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Faculty Department Selection</h2>

      {/* Show student's department for reference */}
      {formData.department && (
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Your Department:</span> {formData.department}
          </p>
        </div>
      )}

      {/* Faculty Department Select */}
      <div>
        <label htmlFor="facultyDepartment" className="block text-sm font-medium text-gray-700 mb-1">
          Select Faculty Department for Internship <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="facultyDepartment"
            name="facultyDepartment"
            value={formData.facultyDepartment || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.facultyDepartment ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none`}
          >
            <option value="">Select a department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        {errors.facultyDepartment && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />{errors.facultyDepartment}
          </p>
        )}
      </div>

      {/* Info Box if faculty department selected */}
      {formData.facultyDepartment && (
        <div className="p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-800">Department Information</h3>
          <p className="text-sm text-blue-700 mt-1">
            The {formData.facultyDepartment} department offers internships in various specialized areas.
            Continue to the next step to select a faculty supervisor for your internship.
          </p>
        </div>
      )}
      
      {/* Cross-department internship note */}
      {formData.department && formData.facultyDepartment && formData.department !== formData.facultyDepartment && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Note:</span> You're applying for an internship in the {formData.facultyDepartment} department 
            while being a {formData.department} student. This is perfectly fine for interdisciplinary learning!
          </p>
        </div>
      )}
    </div>
  );
}