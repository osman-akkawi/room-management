import React from 'react';
import { useForm } from 'react-hook-form';
import { Floor, Building } from '../../../types';
import { supabase } from '../../../lib/supabase';

interface EditFloorFormProps {
  floor: Floor;
  buildings: Building[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditFloorForm: React.FC<EditFloorFormProps> = ({
  floor,
  buildings,
  onSuccess,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Floor>({
    defaultValues: floor
  });

  const onSubmit = async (data: Floor) => {
    try {
      const { error } = await supabase
        .from('floors')
        .update({
          name: data.name,
          building_id: data.building_id,
          level: data.level,
          description: data.description,
          status: data.status
        })
        .eq('id', floor.id);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error updating floor:', error);
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
          Update Floor
        </button>
      </div>
    </form>
  );
};