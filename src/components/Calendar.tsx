import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Schedule } from '../types';

interface CalendarProps {
  schedules: Schedule[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  schedules,
  selectedDate,
  onDateSelect,
}) => {
  const weekStart = startOfWeek(selectedDate);
  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  const getScheduleColor = (schedule: Schedule) => {
    return schedule.room_id ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className={`p-4 text-center cursor-pointer hover:bg-gray-50 ${
              isSameDay(day, selectedDate) ? 'bg-blue-50' : 'bg-white'
            }`}
            onClick={() => onDateSelect(day)}
          >
            <div className="font-semibold text-sm text-gray-900">
              {format(day, 'EEE')}
            </div>
            <div className="mt-1 text-lg">
              {format(day, 'd')}
            </div>
            <div className="mt-2 space-y-1">
              {schedules
                .filter((schedule) =>
                  isSameDay(new Date(schedule.start_time), day)
                )
                .map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`text-xs rounded px-1 py-0.5 truncate ${getScheduleColor(schedule)}`}
                  >
                    {format(new Date(schedule.start_time), 'HH:mm')}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};