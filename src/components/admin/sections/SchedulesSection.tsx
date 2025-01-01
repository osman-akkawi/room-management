import React, { useState } from 'react';
import { Room, Course, Schedule, Instructor, Building, Floor } from '../../../types';
import { ScheduleList } from '../schedules/ScheduleList';
import { ScheduleModal } from '../schedules/ScheduleModal';

interface SchedulesSectionProps {
  rooms: Room[];
  buildings: Building[];
  floors: Floor[];
  schedules: Schedule[];
  courses: Course[];
  instructors: Instructor[];
}

export const SchedulesSection: React.FC<SchedulesSectionProps> = ({
  rooms,
  buildings,
  floors,
  schedules,
  courses,
  instructors,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | undefined>();
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedSchedule(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (schedule: Schedule) => {
    setModalMode('edit');
    setSelectedSchedule(schedule);
    setSelectedRoom(rooms.find(r => r.id === schedule.room_id));
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedSchedule(undefined);
    setSelectedRoom(undefined);
    // Trigger refresh of schedules data
  };

  return (
    <>
      <ScheduleList
        rooms={rooms}
        buildings={buildings}
        floors={floors}
        schedules={schedules}
        courses={courses}
        instructors={instructors}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
      />

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        schedule={selectedSchedule}
        room={selectedRoom}
        courses={courses}
        instructors={instructors}
        rooms={rooms}
        onSuccess={handleSuccess}
      />
    </>
  );
};