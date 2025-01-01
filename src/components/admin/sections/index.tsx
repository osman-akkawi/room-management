import React from 'react';
import { Building, Room, Course, Schedule, Instructor, Floor } from '../../../types';
import { DashboardOverview } from './DashboardOverview';
import { BuildingsSection } from './BuildingsSection';
import { FloorsSection } from './FloorsSection';
import { InstructorsSection } from './InstructorsSection';
import { CoursesSection } from './CoursesSection';
import { SchedulesSection } from './SchedulesSection';

interface AdminSectionsProps {
  currentSection: string;
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
  onBuildingSelect: (building: Building) => void;
  onRoomSelect: (room: Room) => void;
  onAddClick: (type: string) => void;
  onEditClick: (type: string, item: any) => void;
}

export const AdminSections: React.FC<AdminSectionsProps> = ({
  currentSection,
  data,
  selectedBuilding,
  selectedRoom,
  onBuildingSelect,
  onRoomSelect,
  onAddClick,
  onEditClick,
}) => {
  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return (
          <DashboardOverview
            stats={{
              buildings: data.buildings.length,
              rooms: data.rooms.length,
              instructors: data.instructors.length,
              courses: data.courses.length,
              schedules: data.schedules.length,
              floors: data.floors.length,
            }}
            rooms={data.rooms}
            buildings={data.buildings}
            schedules={data.schedules}
            courses={data.courses}
          />
        );
      case 'buildings':
        return (
          <BuildingsSection
            buildings={data.buildings}
            rooms={data.rooms}
            selectedBuilding={selectedBuilding}
            selectedRoom={selectedRoom}
            onBuildingSelect={onBuildingSelect}
            onRoomSelect={onRoomSelect}
            onAddBuilding={() => onAddClick('building')}
            onAddRoom={() => onAddClick('room')}
            onEditBuilding={(building) => onEditClick('building', building)}
            onEditRoom={(room) => onEditClick('room', room)}
          />
        );
      case 'floors':
        return (
          <FloorsSection
            buildings={data.buildings}
            floors={data.floors}
            onAddClick={() => onAddClick('floor')}
            onEditClick={(floor) => onEditClick('floor', floor)}
          />
        );
      case 'instructors':
        return (
          <InstructorsSection
            instructors={data.instructors}
            onAddClick={() => onAddClick('instructor')}
            onEditClick={(instructor) => onEditClick('instructor', instructor)}
          />
        );
      case 'courses':
        return (
          <CoursesSection
            courses={data.courses}
            instructors={data.instructors}
            onAddClick={() => onAddClick('course')}
            onEditClick={(course) => onEditClick('course', course)}
          />
        );
      case 'schedules':
        return (
          <SchedulesSection
            rooms={data.rooms}
            buildings={data.buildings}
            floors={data.floors}
            schedules={data.schedules}
            courses={data.courses}
            instructors={data.instructors}
            onAddClick={() => onAddClick('schedule')}
            onEditClick={(schedule) => onEditClick('schedule', schedule)}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderSection()}</>;
};