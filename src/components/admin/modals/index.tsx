import React from 'react';
import { Building, Room, Course, Schedule, Instructor, Floor } from '../../../types';
import { Modal } from '../../modals/Modal';
import { BuildingForm } from '../../forms/BuildingForm';
import { RoomForm } from '../../forms/RoomForm';
import { CourseForm } from '../../forms/CourseForm';
import { InstructorForm } from '../../forms/InstructorForm';
import { ScheduleForm } from '../../forms/ScheduleForm';
import { FloorForm } from '../../forms/FloorForm';
import { EditBuildingForm } from '../../forms/edit/EditBuildingForm';
import { EditRoomForm } from '../../forms/edit/EditRoomForm';
import { EditCourseForm } from '../../forms/edit/EditCourseForm';
import { EditInstructorForm } from '../../forms/edit/EditInstructorForm';
import { EditScheduleForm } from '../../forms/edit/EditScheduleForm';
import { EditFloorForm } from '../../forms/edit/EditFloorForm';

interface AdminModalsProps {
  modalStates: {
    building: boolean;
    room: boolean;
    course: boolean;
    instructor: boolean;
    schedule: boolean;
    floor: boolean;
  };
  editStates: {
    building: Building | null;
    room: Room | null;
    course: Course | null;
    instructor: Instructor | null;
    schedule: Schedule | null;
    floor: Floor | null;
  };
  data: {
    buildings: Building[];
    rooms: Room[];
    courses: Course[];
    schedules: Schedule[];
    instructors: Instructor[];
    floors: Floor[];
  };
  selectedBuilding: Building | null;
  selectedRoom: Room | null;
  onClose: (type: string) => void;
  onSuccess: () => void;
}

export const AdminModals: React.FC<AdminModalsProps> = ({
  modalStates,
  editStates,
  data,
  selectedBuilding,
  selectedRoom,
  onClose,
  onSuccess,
}) => {
  return (
    <>
      {/* Add Modals */}
      <Modal
        isOpen={modalStates.building}
        onClose={() => onClose('building')}
        title="Add New Building"
      >
        <BuildingForm onSuccess={onSuccess} onCancel={() => onClose('building')} />
      </Modal>

      <Modal
        isOpen={modalStates.floor}
        onClose={() => onClose('floor')}
        title="Add New Floor"
      >
        <FloorForm
          buildings={data.buildings}
          onSuccess={onSuccess}
          onCancel={() => onClose('floor')}
        />
      </Modal>

      <Modal
        isOpen={modalStates.room}
        onClose={() => onClose('room')}
        title="Add New Room"
      >
        {selectedBuilding && (
          <RoomForm
            building={selectedBuilding}
            onSuccess={onSuccess}
            onCancel={() => onClose('room')}
          />
        )}
      </Modal>

      <Modal
        isOpen={modalStates.course}
        onClose={() => onClose('course')}
        title="Add New Course"
      >
        <CourseForm
          instructors={data.instructors}
          onSuccess={onSuccess}
          onCancel={() => onClose('course')}
        />
      </Modal>

      <Modal
        isOpen={modalStates.instructor}
        onClose={() => onClose('instructor')}
        title="Add New Instructor"
      >
        <InstructorForm
          onSuccess={onSuccess}
          onCancel={() => onClose('instructor')}
        />
      </Modal>

      <Modal
        isOpen={modalStates.schedule}
        onClose={() => onClose('schedule')}
        title="Schedule a Room"
      >
        <ScheduleForm
          rooms={data.rooms}
          courses={data.courses}
          instructors={data.instructors}
          onSuccess={onSuccess}
          onCancel={() => onClose('schedule')}
        />
      </Modal>

      {/* Edit Modals */}
      <Modal
        isOpen={!!editStates.building}
        onClose={() => onClose('building')}
        title="Edit Building"
      >
        {editStates.building && (
          <EditBuildingForm
            building={editStates.building}
            onSuccess={onSuccess}
            onCancel={() => onClose('building')}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!editStates.floor}
        onClose={() => onClose('floor')}
        title="Edit Floor"
      >
        {editStates.floor && (
          <EditFloorForm
            floor={editStates.floor}
            buildings={data.buildings}
            onSuccess={onSuccess}
            onCancel={() => onClose('floor')}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!editStates.room}
        onClose={() => onClose('room')}
        title="Edit Room"
      >
        {editStates.room && (
          <EditRoomForm
            room={editStates.room}
            onSuccess={onSuccess}
            onCancel={() => onClose('room')}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!editStates.course}
        onClose={() => onClose('course')}
        title="Edit Course"
      >
        {editStates.course && (
          <EditCourseForm
            course={editStates.course}
            instructors={data.instructors}
            onSuccess={onSuccess}
            onCancel={() => onClose('course')}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!editStates.instructor}
        onClose={() => onClose('instructor')}
        title="Edit Instructor"
      >
        {editStates.instructor && (
          <EditInstructorForm
            instructor={editStates.instructor}
            onSuccess={onSuccess}
            onCancel={() => onClose('instructor')}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!editStates.schedule}
        onClose={() => onClose('schedule')}
        title="Edit Schedule"
      >
        {editStates.schedule && selectedRoom && (
          <EditScheduleForm
            schedule={editStates.schedule}
            room={selectedRoom}
            courses={data.courses}
            instructors={data.instructors}
            onSuccess={onSuccess}
            onCancel={() => onClose('schedule')}
          />
        )}
      </Modal>
    </>
  );
};