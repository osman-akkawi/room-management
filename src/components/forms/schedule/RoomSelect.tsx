import React from 'react';
import { Room } from '../../../types';

interface RoomSelectProps {
  rooms: Room[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const RoomSelect: React.FC<RoomSelectProps> = ({
  rooms = [],
  value,
  onChange,
  error
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Room</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Select a room</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name} (Capacity: {room.capacity})
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};