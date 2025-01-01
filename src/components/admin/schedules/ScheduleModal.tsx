import React from 'react';
import { Modal } from '../../modals/Modal';
import { Schedule, Room, Course, Instructor } from '../../../types';
import { ScheduleForm } from '../../forms/ScheduleForm';
import { EditScheduleForm } from '../../forms/edit/EditScheduleForm';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  schedule?: Schedule;
  room?: Room;
  courses: Course[];
  instructors: Instructor[];
  rooms: Room[];
  onSuccess: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  mode,
  schedule,
  room,
  courses,
  instructors,
  rooms,
  onSuccess,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add New Schedule' : 'Edit Schedule'}
    >
      {mode === 'add' ? (
        <ScheduleForm
          rooms={rooms}
          courses={courses}
          instructors={instructors}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      ) : schedule && room ? (
        <EditScheduleForm
          schedule={schedule}
          room={room}
          courses={courses}
          instructors={instructors}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      ) : null}
    </Modal>
  );
};