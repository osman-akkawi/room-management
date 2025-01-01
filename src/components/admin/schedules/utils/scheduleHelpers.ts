import { Room, Building, Floor } from '../../../../types';

export const getRoomDetails = (
  room: Room,
  buildings: Building[],
  floors: Floor[]
) => {
  const building = buildings?.find(b => b.id === room.building_id);
  if (!building) return null;

  const floor = floors?.find(f => f.building_id === building.id);
  if (!floor) return null;

  return { building, floor };
};