import React, { useState } from 'react';
import { Building, X, Search } from 'lucide-react';
import { Room, Building as BuildingType } from '../../../../../types';

interface ViewAllRoomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  buildings: BuildingType[];
}

export const ViewAllRoomsModal: React.FC<ViewAllRoomsModalProps> = ({
  isOpen,
  onClose,
  rooms,
  buildings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const getBuildingName = (buildingId: string): string => {
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.name : 'Unknown Building';
  };

  const filteredRooms = rooms.filter(room => {
    const searchString = searchQuery.toLowerCase();
    const buildingName = getBuildingName(room.building_id).toLowerCase();
    return (
      room.name.toLowerCase().includes(searchString) ||
      buildingName.includes(searchString) ||
      room.status.toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Room Availability</h3>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rooms..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                {filteredRooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-400" />
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{room.name}</p>
                        <p className="text-sm text-gray-500">{getBuildingName(room.building_id)}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-sm text-gray-500">Capacity: {room.capacity}</span>
                          {room.facilities.map((facility) => (
                            <span key={facility} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                              {facility}
                            </span>
                          ))}
                        </div>
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
                {filteredRooms.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No rooms found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};