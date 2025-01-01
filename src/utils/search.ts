import { Room, Course, Building, Floor } from '../types';

export const searchRooms = (
  query: string,
  rooms: Room[],
  buildings: Building[],
  courses: Course[],
  floors: Floor[]
): Room[] => {
  const searchString = query.toLowerCase();
  
  return rooms.filter((room) => {
    const building = buildings.find(b => b.id === room.building_id);
    const floor = floors.find(f => f.building_id === building?.id);
    const relatedCourses = courses.filter(course => 
      rooms.some(r => r.id === room.id)
    );
    
    const searchableText = [
      room.name,
      building?.name,
      building?.location,
      floor?.name,
      floor?.level.toString(),
      ...room.facilities,
      ...relatedCourses.map(c => c.code),
      ...relatedCourses.map(c => c.name),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(searchString);
  });
};