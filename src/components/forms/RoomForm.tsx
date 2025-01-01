import React from 'react';
import { useForm } from 'react-hook-form';
import { Room, Building } from '../../types';
import { supabase } from '../../lib/supabase';

interface RoomFormProps {
  building: Building;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({ building, onSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Room, 'id' | 'created_at'>>();

  const onSubmit = async (data: Omit<Room, 'id' | 'created_at'>) => {
    try {
      const roomData = {
        ...data,
        building_id: building.id,
        facilities: data.facilities || []
      };
      const { error } = await supabase.from('rooms').insert(roomData);
      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Room Name</label>
        <input
          type="text"
          {...register('name', { required: 'Room name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Capacity</label>
        <input
          type="number"
          {...register('capacity', { 
            required: 'Capacity is required',
            min: { value: 1, message: 'Capacity must be at least 1' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Facilities</label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('facilities')}
              value="projector"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Projector</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('facilities')}
              value="wifi"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Wi-Fi</label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
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
          Create Room
        </button>
      </div>
    </form>
  );
};