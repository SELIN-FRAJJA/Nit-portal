import { ChevronDown, PlusCircle, Trash2 } from 'lucide-react';

export default function ChoiceForm({ 
  choices, 
  setChoices, 
  departments, 
  facultyByDepartment,
  applicationCount,
  errors,
  remainingSlots 
}) {
    console.log("ChoiceForm props:", { choices, departments });

    if (!Array.isArray(choices)) return <div>Choices missing</div>;
    if (!Array.isArray(departments)) return <div>Departments missing</div>;

  const addChoice = () => {
    if (choices.length < remainingSlots+1) {
      setChoices([...choices, { facultyDepartment: '', faculty: '', facultyEmail: '', startDate: '', endDate: '', preferredStart: '', preferredEnd: '' }]);
    }
  };

  const removeChoice = (index) => {
    if (choices.length > 1) {
      const newChoices = [...choices];
      newChoices.splice(index, 1);
      setChoices(newChoices);
    }
  };

  const updateChoice = (index, field, value) => {
    const newChoices = [...choices];
    newChoices[index][field] = value;

    // Reset faculty if department changes
    if (field === 'facultyDepartment') {
      newChoices[index].faculty = '';
      newChoices[index].facultyEmail = '';
      newChoices[index].startDate = '';
      newChoices[index].endDate = '';
      newChoices[index].preferredStart = '';
      newChoices[index].preferredEnd = '';
    }

    // If faculty selected, set email and date range
    if (field === 'faculty') {
      const selected = facultyByDepartment[newChoices[index].facultyDepartment]
        ?.find(f => f.name === value);
      newChoices[index].facultyEmail = selected?.email || '';
      newChoices[index].startDate = selected?.startDate || '';
      newChoices[index].endDate = selected?.endDate || '';
      newChoices[index].preferredStart = '';
      newChoices[index].preferredEnd = '';
    }

    setChoices(newChoices);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {choices.length < remainingSlots+1 && (
          <button 
            onClick={addChoice}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <PlusCircle className="mr-1 h-4 w-4" /> Add Choice
          </button>
        )}
      </div>

      <div className="space-y-4">
        {choices.map((choice, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3 text-black">
              <h3 className="font-medium">Choice #{applicationCount+index}</h3>
              {choices.length > 1 && (
                <button 
                  onClick={() => removeChoice(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            {/* Department Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={choice.facultyDepartment || ''}
                  onChange={e => updateChoice(index, 'facultyDepartment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select department</option>
                  {departments.map((dept, i) => (
                    <option key={i} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Faculty Selection */}
            {choice.facultyDepartment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty Member <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={choice.faculty || ''}
                    onChange={e => updateChoice(index, 'faculty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select faculty member</option>
                    {(facultyByDepartment[choice.facultyDepartment] || []).map((faculty, i) => (
                      <option key={i} value={faculty.name}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Domain Radio Selection */}
            {choice.faculty && facultyByDepartment[choice.facultyDepartment] && (() => {
            const selectedFaculty = facultyByDepartment[choice.facultyDepartment].find(f => f.name === choice.faculty);
            const domains = (selectedFaculty?.domains || []).filter(Boolean);
            return domains.length ? (
                <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain Offered</label>
                <div className="flex flex-wrap gap-4">
                    {domains.map((domain, dIdx) => (
                    <label key={dIdx} className="flex items-center space-x-2 text-black">
                        <input
                        type="radio"
                        name={`selectedDomain_${index}`}  // name must be unique per choice!
                        value={domain}
                        checked={choice.selectedDomain === domain}
                        onChange={e => updateChoice(index, 'selectedDomain', domain)}
                        className="mr-1"
                        required
                        />
                        <span>{domain}</span>
                    </label>
                    ))}
                </div>
                </div>
            ) : null;
            })()}


            {/* Date Range Selection */}
            {choice.faculty && choice.startDate && choice.endDate && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Start Date</label>
                <input
                  type="date"
                  min={choice.startDate.slice(0,10)}
                  max={choice.endDate.slice(0,10)}
                  value={choice.preferredStart || ''}
                  onChange={e => updateChoice(index, 'preferredStart', e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                  required
                />
                <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Preferred End Date</label>
                <input
                  type="date"
                  min={choice.startDate.slice(0,10)}
                  max={choice.endDate.slice(0,10)}
                  value={choice.preferredEnd || ''}
                  onChange={e => updateChoice(index, 'preferredEnd', e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  Allowed window: {choice.startDate.slice(0,10)} to {choice.endDate.slice(0,10)}
                </div>
              </div>
            )}

            {/* Faculty Info */}
            {choice.faculty && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">{choice.faculty}</span> ({choice.facultyEmail})
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 bg-gray-50 rounded-md text-black">
        <p className="text-sm">
          Applications submitted: {applicationCount-1}/5
        </p>
        <p className="text-xs text-gray-500 mt-1">
          You can submit up to 5 applications in total.
        </p>
      </div>
    </div>
  );
}
