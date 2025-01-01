import React from 'react';
import { Users, Building, BookOpen, Layers } from 'lucide-react';
import { StatCard } from './overview/StatCard';
import { SchedulePreview } from './overview/SchedulePreview';
import { RoomAvailability } from './overview/RoomAvailability';
import { ChatSection } from './overview/ChatSection';
import { Room, Building as BuildingType, Schedule, Course } from '../../../types';

interface DashboardOverviewProps {
  stats: {
    buildings: number;
    rooms: number;
    instructors: number;
    courses: number;
    schedules: number;
    floors: number;
  };
  rooms: Room[];
  buildings: BuildingType[];
  schedules: Schedule[];
  courses: Course[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  stats,
  rooms,
  buildings,
  schedules,
  courses,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Buildings"
          value={stats.buildings}
          icon={Building}
          trend="+2.5%"
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Floors"
          value={stats.floors}
          icon={Layers}
          trend="+3.8%"
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          title="Active Rooms"
          value={stats.rooms}
          icon={Building}
          trend="+4.3%"
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Instructors"
          value={stats.instructors}
          icon={Users}
          trend="+1.2%"
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Active Courses"
          value={stats.courses}
          icon={BookOpen}
          trend="+3.1%"
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SchedulePreview schedules={schedules} courses={courses} />
          <RoomAvailability rooms={rooms} buildings={buildings} />
        </div>
        <ChatSection />
      </div>
    </div>
  );
};