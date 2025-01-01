import React from 'react';
import { Plus, Pencil, Trash2, Layers, Building } from 'lucide-react';
import { Floor, Building as BuildingType } from '../../../types';
import { supabase } from '../../../lib/supabase';

interface FloorsListProps {
  buildings: BuildingType[];
  floors: Floor[];
  onAddClick: () => void;
  onEditClick: (floor: Floor) => void;
}

export const FloorsList: React.FC<FloorsListProps> = ({
  buildings,
  floors,
  onAddClick,
  onEditClick,
}) => {
  const handleDelete = async (floorId: string) => {
    if (confirm('Are you sure you want to delete this floor?')) {
      const { error } = await supabase.from('floors').delete().eq('id', floorId);
      if (error) {
        console.error('Error deleting floor:', error);
        return;
      }
      window.location.reload();
    }
  };

  const getBuildingName = (buildingId: string): string => {
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.name : 'Unknown Building';
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <Layers className="h-6 w-6 text-purple-500 mr-2" />
          Floors
        </h2>
        <button
          onClick={onAddClick}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Floor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {floors.map((floor) => (
          <div
            key={floor.id}
            className="p-4 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{floor.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Building className="h-4 w-4 mr-2" />
                  {getBuildingName(floor.building_id)}
                </div>
                <p className="text-sm text-gray-500">Level {floor.level}</p>
                {floor.description && (
                  <p className="text-sm text-gray-500">{floor.description}</p>
                )}
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  floor.status === 'active' ? 'bg-green-100 text-green-800' :
                  floor.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {floor.status}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditClick(floor)}
                  className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(floor.id)}
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