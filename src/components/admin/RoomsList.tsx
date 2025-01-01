import React from 'react';
import { Plus, Users, Pencil, Trash2, Tv, Wifi } from 'lucide-react';
import { Room, Building } from '../../types';
import { supabase } from '../../lib/supabase';

interface RoomsListProps {
  building: Building;
  rooms: Room[];
  selectedRoom: Room | null;
  onRoomSelect: (room: Room) => void;
  onAddClick: () => void;
  onEditClick: (room: Room) => void;
}

export const RoomsList: React.FC<RoomsListProps> = ({
  building,
  rooms,
  selectedRoom,
  onRoomSelect,
  onAddClick,
  onEditClick,
}) => {
  const buildingRooms = rooms.filter((room) => room.building_id === building.id);

  const handleDelete = async (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this room?')) {
      const { error } = await supabase.from('rooms').delete().eq('id', roomId);
      if (error) {
        console.error('Error deleting room:', error);
        return;
      }
      window.location.reload();
    }
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility) {
      case 'projector':
        return <Tv className="h-4 w-4" />;
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <Users className="h-6 w-6 text-green-500 mr-2" />
          Rooms in {building.name}
        </h2>
        <button
          onClick={onAddClick}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildingRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onRoomSelect(room)}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              selectedRoom?.id === room.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{room.name}</h3>
                <p className="text-sm text-gray-500">Capacity: {room.capacity}</p>
                <div className="mt-2 flex items-center gap-2">
                  {room.facilities.map((facility) => (
                    <span key={facility} className="flex items-center px-2 py-1 text-xs bg-gray-100 rounded-full">
                      {getFacilityIcon(facility)}
                      <span className="ml-1">{facility}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick(room);
                  }}
                  className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(room.id, e)}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};