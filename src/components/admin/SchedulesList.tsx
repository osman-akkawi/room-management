import React from 'react';
import { Plus, Calendar, Pencil, Trash2, Clock, BookOpen, User } from 'lucide-react';
import { Room, Schedule, Course, Instructor, Building, Floor } from '../../types';
import { formatScheduleTime } from '../../utils/dateUtils';
import { supabase } from '../../lib/supabase';

interface SchedulesListProps {
  room: Room;
  building: Building;
  floor: Floor;
  schedules: Schedule[];
  courses: Course[];
  instructors: Instructor[];
  onAddClick: () => void;
  onEditClick: (schedule: Schedule) => void;
}

export const SchedulesList: React.FC<SchedulesListProps> = ({
  room,
  building,
  floor,
  schedules,
  courses,
  instructors = [],
  onAddClick,
  onEditClick,
}) => {
  const roomSchedules = schedules.filter((schedule) => schedule.room_id === room.id);

  const handleDelete = async (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      const { error } = await supabase.from('schedules').delete().eq('id', scheduleId);
      if (error) {
        console.error('Error deleting schedule:', error);
        return;
      }
      window.location.reload();
    }
  };

  const getScheduleColor = (schedule: Schedule) => {
    return schedule.room_id ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200';
  };

  const getInstructorName = (courseId: string): string => {
    const course = courses?.find((c) => c.id === courseId);
    if (!course || !course.instructor_id) return 'No instructor assigned';
    const instructor = instructors?.find((i) => i.id === course.instructor_id);
    return instructor ? instructor.name : 'No instructor assigned';
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-purple-500 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Room {room.name} Schedule
              </h2>
              <p className="text-sm text-gray-500">
                {building.name} • Floor {floor.name} • Level {floor.level}
              </p>
            </div>
          </div>
          <button
            onClick={onAddClick}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </button>
        </div>
        <div className="mt-2 flex items-center space-x-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Capacity: {room.capacity}
          </span>
          {room.facilities.map((facility) => (
            <span
              key={facility}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {facility}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {roomSchedules.map((schedule) => {
          const course = courses?.find((c) => c.id === schedule.course_id);
          const instructorName = getInstructorName(schedule.course_id);
          
          return (
            <div
              key={schedule.id}
              className={`p-4 rounded-lg border ${getScheduleColor(schedule)} transition-colors`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
                    <div>
                      <h3 className="font-medium text-gray-900">{course?.name || 'Unknown Course'}</h3>
                      <p className="text-sm text-gray-500">Course Code: {course?.code || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatScheduleTime(schedule.start_time, schedule.end_time)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    Instructor: {instructorName}
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  {schedule.recurring && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Recurring
                    </span>
                  )}
                  <button
                    onClick={() => onEditClick(schedule)}
                    className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {roomSchedules.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No schedules found for this room</p>
            <button
              onClick={onAddClick}
              className="mt-4 inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add your first schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
};