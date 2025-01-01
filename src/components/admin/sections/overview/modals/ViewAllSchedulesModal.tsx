import React from 'react';
import { Clock, X, Search } from 'lucide-react';
import { Schedule, Course } from '../../../../../types';
import { formatScheduleTime } from '../../../../../utils/dateUtils';

interface ViewAllSchedulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: Schedule[];
  courses: Course[];
}

export const ViewAllSchedulesModal: React.FC<ViewAllSchedulesModalProps> = ({
  isOpen,
  onClose,
  schedules,
  courses,
}) => {
  if (!isOpen) return null;

  const getScheduleColor = (schedule: Schedule) => {
    return schedule.room_id ? 'bg-red-50 text-red-800' : 'bg-gray-50 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Today's Schedule</h3>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search schedules..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {schedules.map((schedule) => {
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
                })}
                {schedules.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No schedules found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};