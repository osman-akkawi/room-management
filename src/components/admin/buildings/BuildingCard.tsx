import React from 'react';
import { Building, Floors, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { BuildingWithFloors } from '../../../types';

interface BuildingCardProps {
  building: BuildingWithFloors;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  isSelected,
  onClick,
  onEdit,
}) => {
  const getStatusIcon = () => {
    switch (building.status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'inactive':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-blue-100">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{building.name}</h3>
            <p className="text-sm text-gray-500">{building.location}</p>
          </div>
        </div>
        {getStatusIcon()}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <Floors className="h-4 w-4 mr-1" />
          <span>{building.floors?.length || 0} Floors</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Edit
        </button>
      </div>
    </div>
  );
};