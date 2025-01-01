import React from 'react';
import { Instructor } from '../../../types';

interface InstructorSelectProps {
  instructors: Instructor[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const InstructorSelect: React.FC<InstructorSelectProps> = ({
  instructors = [], // Provide default empty array
  value,
  onChange,
  error
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Instructor</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Select an instructor</option>
        {instructors?.map((instructor) => (
          <option key={instructor.id} value={instructor.id}>
            {instructor.name} - {instructor.department}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};