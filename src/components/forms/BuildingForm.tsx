import React from 'react';
import { useForm } from 'react-hook-form';
import { Building } from '../../types';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import { useOptimisticMutation } from '../../hooks/useOptimisticMutation';

interface BuildingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const BuildingForm: React.FC<BuildingFormProps> = ({ onSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Building, 'id' | 'created_at'>>();
  const { addBuilding } = useStore();
  const { mutate, error: mutationError } = useOptimisticMutation<Building>();

  const onSubmit = async (data: Omit<Building, 'id' | 'created_at'>) => {
    const newBuilding = {
      ...data,
      id: crypto.randomUUID(), // Temporary ID for optimistic update
      created_at: new Date().toISOString(),
    };

    await mutate(
      async () => {
        const { data: insertedData, error } = await supabase
          .from('buildings')
          .insert(data)
          .select()
          .single();

        return { data: insertedData, error };
      },
      {
        optimisticUpdate: () => addBuilding(newBuilding),
        onSuccess,
        onError: (error) => {
          console.error('Error creating building:', error);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mutationError && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {mutationError.message}
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
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          {...register('location', { required: 'Location is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
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
          Create Building
        </button>
      </div>
    </form>
  );
};