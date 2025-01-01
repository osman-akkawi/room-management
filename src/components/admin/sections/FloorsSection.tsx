import React from 'react';
import { Building, Floor } from '../../../types';
import { FloorsList } from '../floors/FloorsList';

interface FloorsSectionProps {
  buildings: Building[];
  floors: Floor[];
  onAddClick: () => void;
  onEditClick: (floor: Floor) => void;
}

export const FloorsSection: React.FC<FloorsSectionProps> = ({
  buildings,
  floors,
  onAddClick,
  onEditClick,
}) => {
  return (
    <FloorsList
      buildings={buildings}
      floors={floors}
      onAddClick={onAddClick}
      onEditClick={onEditClick}
    />
  );
};