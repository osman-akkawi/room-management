import React from 'react';
import { Schedule, Room, Course, Instructor, Building, Floor } from '../../../types';
import { RoomScheduleCard } from './RoomScheduleCard';
import { getRoomDetails } from './utils/scheduleHelpers';

interface ScheduleListProps {
  rooms: Room[];
  buildings: Building[];
  floors: Floor[];
  schedules: Schedule[];
  courses: Course[];
  instructors: Instructor[];
  onAddClick: () => void;
  onEditClick: (schedule: Schedule) => void;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  rooms,
  buildings,
  floors,
  schedules,
  courses,
  instructors,
  onAddClick,
  onEditClick,
}) => {
  return (
    <div className="space-y-8">
      {rooms.map(room => {
        const details = getRoomDetails(room, buildings, floors);
        if (!details) return null;

        return (
          <RoomScheduleCard
            key={room.id}
            room={room}
            building={details.building}
            floor={details.floor}
            schedules={schedules}
            courses={courses}
            instructors={instructors}
            onAddClick={onAddClick}
            onEditClick={onEditClick}
          />
        );
      })}
      {rooms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No rooms available for scheduling</p>
        </div>
      )}
    </div>
  );
};