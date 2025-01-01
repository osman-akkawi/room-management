import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Schedule, Course } from '../../../../types';
import { formatScheduleTime } from '../../../../utils/dateUtils';
import { ViewAllSchedulesModal } from './modals/ViewAllSchedulesModal';

interface SchedulePreviewProps {
  schedules: Schedule[];
  courses: Course[];
}

export const SchedulePreview: React.FC<SchedulePreviewProps> = ({ schedules = [], courses = [] }) => {
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const getScheduleColor = (schedule: Schedule) => {
    return schedule.room_id ? 'bg-red-50 text-red-800' : 'bg-gray-50 text-gray-800';
  };

  // Show only first 3 schedules in preview
  const previewSchedules = schedules.slice(0, 3);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
          <button 
            onClick={() => setIsViewAllOpen(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {previewSchedules.length > 0 ? (
            previewSchedules.map((schedule) => {
              const course = courses.find(c => c.id === schedule.course_id);
              return (
                <div
                  key={schedule.id}
                  className={`flex items-center p-4 rounded-lg ${getScheduleColor(schedule)}`}
                >
                  <Clock className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">
                      {course?.name || 'Unknown Course'}
                    </p>
                    <p className="text-sm opacity-75">
                      {formatScheduleTime(schedule.start_time, schedule.end_time)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No schedules for today</p>
          )}
        </div>
      </div>

      <ViewAllSchedulesModal
        isOpen={isViewAllOpen}
        onClose={() => setIsViewAllOpen(false)}
        schedules={schedules}
        courses={courses}
      />
    </>
  );
};