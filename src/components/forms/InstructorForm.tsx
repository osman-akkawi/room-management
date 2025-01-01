import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Instructor } from '../../types';
import { supabase } from '../../lib/supabase';

interface InstructorFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface InstructorFormData extends Omit<Instructor, 'id' | 'created_at'> {}

export const InstructorForm: React.FC<InstructorFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<InstructorFormData>();

  const onSubmit = async (data: InstructorFormData) => {
    try {
      setError(null);
      // Convert comma-separated specializations to array
      const formattedData = {
        ...data,
        specializations: data.specializations
          ? (data.specializations as string).split(',').map(s => s.trim())
          : [],
      };
      const { error: insertError } = await supabase.from('instructors').insert(formattedData);
      if (insertError) throw insertError;
      onSuccess();
    } catch (err) {
      console.error('Error creating instructor:', err);
      setError('Failed to create instructor. Please try again.');
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
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Department</label>
        <input
          type="text"
          {...register('department', { required: 'Department is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Specializations (comma-separated)
        </label>
        <input
          type="text"
          {...register('specializations')}
          placeholder="e.g., Mathematics, Physics, Computer Science"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
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
          Create Instructor
        </button>
      </div>
    </form>
  );
};