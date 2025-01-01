import React, { useState } from 'react';
import { Building } from 'lucide-react';
import { Room, Building as BuildingType } from '../../../../types';
import { ViewAllRoomsModal } from './modals/ViewAllRoomsModal';

interface RoomAvailabilityProps {
  rooms: Room[];
  buildings: BuildingType[];
}

export const RoomAvailability: React.FC<RoomAvailabilityProps> = ({ rooms = [], buildings = [] }) => {
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  // Show only first 3 rooms in preview
  const previewRooms = rooms.slice(0, 3);

  const getBuildingName = (buildingId: string): string => {
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.name : 'Unknown Building';
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Room Availability</h2>
          <button 
            onClick={() => setIsViewAllOpen(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {previewRooms.map((room) => (
            <div key={room.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-400" />
                <div className="ml-4">
                  <p className="font-medium text-gray-900">{room.name}</p>
                  <p className="text-sm text-gray-500">{getBuildingName(room.building_id)}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                room.status === 'available' ? 'text-green-700 bg-green-100' :
                room.status === 'occupied' ? 'text-red-700 bg-red-100' :
                'text-yellow-700 bg-yellow-100'
              }`}>
                {room.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ViewAllRoomsModal
        isOpen={isViewAllOpen}
        onClose={() => setIsViewAllOpen(false)}
        rooms={rooms}
        buildings={buildings}
      />
    </>
  );
};