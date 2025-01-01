import React from 'react';
import { Building as BuildingIcon, Layers } from 'lucide-react';
import { Building, Floor } from '../types';

interface RoomLocationProps {
  building: Building;
  floor: Floor | undefined;
}

export const RoomLocation: React.FC<RoomLocationProps> = ({ building, floor }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center text-gray-600">
        <BuildingIcon className="h-5 w-5 mr-3" />
        <div>
          <p className="font-medium text-gray-900">{building.name}</p>
          <p className="text-sm text-gray-500">{building.location}</p>
        </div>
      </div>
      
      {floor && (
        <div className="flex items-center text-gray-600">
          <Layers className="h-5 w-5 mr-3" />
          <div>
            <p className="font-medium text-gray-900">{floor.name}</p>
            <p className="text-sm text-gray-500">Level {floor.level}</p>
          </div>
        </div>
      )}
    </div>
  );
};