import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Building, Room, Course, Instructor, Schedule, Floor } from '../types';
import { DashboardLayout } from '../components/admin/layout/DashboardLayout';
import { AdminSections } from '../components/admin/sections';
import { AdminModals } from '../components/admin/modals';

export const AdminDashboard: React.FC = () => {
  const {
    buildings,
    rooms,
    courses,
    schedules,
    instructors,
    floors,
    fetchBuildings,
    fetchRooms,
    fetchInstructors,
    fetchCourses,
    fetchSchedules,
    fetchFloors,
  } = useStore();

  const [currentSection, setCurrentSection] = useState('overview');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  // Modal States
  const [modalStates, setModalStates] = useState({
    building: false,
    room: false,
    course: false,
    instructor: false,
    schedule: false,
    floor: false,
  });

  // Edit States
  const [editStates, setEditStates] = useState({
    building: null as Building | null,
    room: null as Room | null,
    course: null as Course | null,
    instructor: null as Instructor | null,
    schedule: null as Schedule | null,
    floor: null as Floor | null,
  });

  useEffect(() => {
    fetchBuildings();
    fetchRooms();
    fetchInstructors();
    fetchCourses();
    fetchSchedules();
    fetchFloors();
  }, []);

  const handleSuccess = () => {
    // Reset all modal states
    setModalStates({
      building: false,
      room: false,
      course: false,
      instructor: false,
      schedule: false,
      floor: false,
    });
    
    // Reset all edit states
    setEditStates({
      building: null,
      room: null,
      course: null,
      instructor: null,
      schedule: null,
      floor: null,
    });
    
    // Refresh data
    fetchBuildings();
    fetchRooms();
    fetchInstructors();
    fetchCourses();
    fetchSchedules();
    fetchFloors();
  };

  return (
    <DashboardLayout currentSection={currentSection} onSectionChange={setCurrentSection}>
      <div className="space-y-8">
        <AdminSections
          currentSection={currentSection}
          data={{
            buildings,
            rooms,
            courses,
            schedules,
            instructors,
            floors,
          }}
          selectedBuilding={selectedBuilding}
          selectedRoom={selectedRoom}
          onBuildingSelect={setSelectedBuilding}
          onRoomSelect={setSelectedRoom}
          onAddClick={(type) => setModalStates({ ...modalStates, [type]: true })}
          onEditClick={(type, item) => setEditStates({ ...editStates, [type]: item })}
        />
      </div>

      <AdminModals
        modalStates={modalStates}
        editStates={editStates}
        data={{
          buildings,
          rooms,
          courses,
          schedules,
          instructors,
          floors,
        }}
        selectedBuilding={selectedBuilding}
        selectedRoom={selectedRoom}
        onClose={(type) => {
          setModalStates({ ...modalStates, [type]: false });
          setEditStates({ ...editStates, [type]: null });
        }}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  );
};