import React from 'react';
import { Building, Room } from '../../../types';
import { BuildingsList } from '../BuildingsList';
import { RoomsList } from '../RoomsList';

interface BuildingsSectionProps {
  buildings: Building[];
  rooms: Room[];
  selectedBuilding: Building | null;
  selectedRoom: Room | null;
  onBuildingSelect: (building: Building) => void;
  onRoomSelect: (room: Room) => void;
  onAddBuilding: () => void;
  onAddRoom: () => void;
  onEditBuilding: (building: Building) => void;
  onEditRoom: (room: Room) => void;
}

export const BuildingsSection: React.FC<BuildingsSectionProps> = ({
  buildings,
  rooms,
  selectedBuilding,
  selectedRoom,
  onBuildingSelect,
  onRoomSelect,
  onAddBuilding,
  onAddRoom,
  onEditBuilding,
  onEditRoom,
}) => {
  return (
    <>
      <BuildingsList
        buildings={buildings}
        selectedBuilding={selectedBuilding}
        onBuildingSelect={onBuildingSelect}
        onAddClick={onAddBuilding}
        onEditClick={onEditBuilding}
      />
      {selectedBuilding && (
        <RoomsList
          building={selectedBuilding}
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomSelect={onRoomSelect}
          onAddClick={onAddRoom}
          onEditClick={onEditRoom}
        />
      )}
    </>
  );
};