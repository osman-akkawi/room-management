import React from 'react';
import { Room, Building, Floor, Schedule, Course, Instructor } from '../../../../types';
import { SchedulesList } from '../../SchedulesList';

interface RoomScheduleCardProps {
  room: Room;
  building: Building;
  floor: Floor;
  schedules: Schedule[];
  courses: Course[];
  instructors: Instructor[];
  onAddClick: () => void;
  onEditClick: (schedule: Schedule) => void;
}

export const RoomScheduleCard: React.FC<RoomScheduleCardProps> = ({
  room,
  building,
  floor,
  schedules,
  courses,
  instructors,
  onAddClick,
  onEditClick,
}) => {
  const roomSchedules = schedules.filter(s => s.room_id === room.id);

  return (
    <SchedulesList
      room={room}
      building={building}
      floor={floor}
      schedules={roomSchedules}
      courses={courses}
      instructors={instructors}
      onAddClick={onAddClick}
      onEditClick={onEditClick}
    />
  );
};