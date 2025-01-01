import React from 'react';
import { Users, Tv, Wifi } from 'lucide-react';
import { Room } from '../types';
import { highlightText } from '../utils/highlight';

interface RoomCardProps {
  room: Room;
  searchQuery: string;
  onClick?: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, searchQuery, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Room {highlightText(room.name, searchQuery)}
        </h3>
        <span className={`px-2 py-1 rounded-full text-sm ${
          room.status === 'available' ? 'bg-green-100 text-green-800' :
          room.status === 'occupied' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {room.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span>Capacity: {room.capacity}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {room.facilities.includes('projector') && (
            <span className="flex items-center text-sm text-gray-500">
              <Tv className="h-4 w-4 mr-1" />
              Projector
            </span>
          )}
          {room.facilities.includes('wifi') && (
            <span className="flex items-center text-sm text-gray-500">
              <Wifi className="h-4 w-4 mr-1" />
              Wi-Fi
            </span>
          )}
        </div>
      </div>
    </div>
  );
};