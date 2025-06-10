// src/components/StepThree.jsx
import { AlertCircle, ChevronDown } from 'lucide-react';

export default function StepThree({ 
  formData, 
  handleFacultySelect,  // Changed from handleChange to handleFacultySelect
  facultyByDepartment, 
  errors 
}) {
  // Get faculties for the selected FACULTY department (not student's department)
  const faculties = formData.facultyDepartment 
    ? facultyByDepartment[formData.facultyDepartment] || []
    : [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Faculty Selection</h2>

      {/* Show selected faculty department */}
      <div className="mb-2">
        <p className="text-sm text-gray-600">
          Faculty Department: <span className="font-medium">{formData.facultyDepartment}</span>
        </p>
      </div>

      {/* Faculty Select */}
      <div>
        <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
          Select Faculty Member <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="faculty"
            name="faculty"
            value={formData.faculty || ''}
            onChange={(e) => {
              // Find the selected faculty object
              const selectedFaculty = faculties.find(
                f => f.name === e.target.value
              );
              
              // Call handler with both name and email
              if (selectedFaculty) {
                handleFacultySelect(
                  selectedFaculty.name,
                  selectedFaculty.email
                );
              } else {
                // Handle case when "Select a faculty member" is chosen
                handleFacultySelect('', '');
              }
            }}
            className={`w-full px-3 py-2 border ${errors.faculty ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none`}
            disabled={!formData.facultyDepartment}
          >
            <option value="">
              {formData.facultyDepartment ? 'Select a faculty member' : 'Please select a department first'}
            </option>
            {faculties.map((faculty, index) => (
              <option key={index} value={faculty.name}>
                {faculty.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        {errors.faculty && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />{errors.faculty}
          </p>
        )}
      </div>

      {/* Show faculty count for selected department */}
      {formData.facultyDepartment && (
        <div className="text-sm text-gray-600">
          Available faculty members: {faculties.length}
        </div>
      )}

      {/* Info Box if faculty selected */}
      {formData.faculty && (
        <div className="p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-800">Faculty Information</h3>
          <p className="text-sm text-blue-700 mt-1">
            <span className="font-medium">{formData.faculty}</span> from the {formData.facultyDepartment} department 
            is accepting internship applications. Continue to the next step to complete your application details.
          </p>
          {formData.facultyEmail && (
            <p className="text-xs text-blue-600 mt-1">
              Contact: {formData.facultyEmail}
            </p>
          )}
        </div>
      )}

      {/* No faculty available message */}
      {formData.facultyDepartment && faculties.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            No faculty members are currently available for internships in the {formData.facultyDepartment} department. 
            Please select a different department or contact the administration.
          </p>
        </div>
      )}
    </div>
  );
}