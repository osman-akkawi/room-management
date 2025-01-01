import React from 'react';
import { Course } from '../../../types';

interface CourseSelectProps {
  courses: Course[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CourseSelect: React.FC<CourseSelectProps> = ({
  courses = [], // Provide default empty array
  value,
  onChange,
  error
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Course</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Select a course</option>
        {courses?.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name} ({course.code})
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};