import React from 'react';
import { Plus, Building, Pencil, Trash2 } from 'lucide-react';
import { Building as BuildingType } from '../../types';
import { supabase } from '../../lib/supabase';

interface BuildingsListProps {
  buildings: BuildingType[];
  selectedBuilding: BuildingType | null;
  onBuildingSelect: (building: BuildingType) => void;
  onAddClick: () => void;
  onEditClick: (building: BuildingType) => void;
}

export const BuildingsList: React.FC<BuildingsListProps> = ({
  buildings,
  selectedBuilding,
  onBuildingSelect,
  onAddClick,
  onEditClick,
}) => {
  const handleDelete = async (buildingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this building?')) {
      const { error } = await supabase.from('buildings').delete().eq('id', buildingId);
      if (error) {
        console.error('Error deleting building:', error);
        return;
      }
      window.location.reload();
    }
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <Building className="h-6 w-6 text-blue-500 mr-2" />
          Buildings
        </h2>
        <button
          onClick={onAddClick}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Building
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildings.map((building) => (
          <div
            key={building.id}
            onClick={() => onBuildingSelect(building)}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              selectedBuilding?.id === building.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{building.name}</h3>
                <p className="text-sm text-gray-500">{building.location}</p>
                <span className={`inline-block px-2 py-1 mt-2 text-xs rounded-full ${
                  building.status === 'active' ? 'bg-green-100 text-green-800' :
                  building.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {building.status}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick(building);
                  }}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(building.id, e)}
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