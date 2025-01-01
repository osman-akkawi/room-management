import React from 'react';
import { useForm } from 'react-hook-form';
import { Floor, Building } from '../../types';
import { supabase } from '../../lib/supabase';

interface FloorFormProps {
  buildings: Building[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const FloorForm: React.FC<FloorFormProps> = ({
  buildings,
  onSuccess,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Floor, 'id' | 'created_at'>>();

  const onSubmit = async (data: Omit<Floor, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('floors').insert(data);
      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating floor:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Floor Name</label>
        <input
          type="text"
          {...register('name', { required: 'Floor name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Building</label>
        <select
          {...register('building_id', { required: 'Building is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="">Select a building</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
        {errors.building_id && <p className="mt-1 text-sm text-red-600">{errors.building_id.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Level</label>
        <input
          type="number"
          {...register('level', { 
            required: 'Level is required',
            min: { value: -5, message: 'Level must be between -5 and 200' },
            max: { value: 200, message: 'Level must be between -5 and 200' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
        >
          Create Floor
        </button>
      </div>
    </form>
  );
};