import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Course, Instructor } from '../../../types';
import { supabase } from '../../../lib/supabase';

interface EditCourseFormProps {
  course: Course;
  instructors: Instructor[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditCourseForm: React.FC<EditCourseFormProps> = ({
  course,
  instructors,
  onSuccess,
  onCancel,
}) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<Course>({
    defaultValues: course
  });

  const onSubmit = async (data: Course) => {
    try {
      setError(null);
      const { error: updateError } = await supabase
        .from('courses')
        .update({
          name: data.name,
          code: data.code,
          instructor_id: data.instructor_id,
        })
        .eq('id', course.id);

      if (updateError) throw updateError;
      onSuccess();
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Course Name</label>
        <input
          type="text"
          {...register('name', { required: 'Course name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Course Code</label>
        <input
          type="text"
          {...register('code', { required: 'Course code is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Instructor</label>
        <select
          {...register('instructor_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select an instructor</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.name} - {instructor.department}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Update Course
        </button>
      </div>
    </form>
  );
};