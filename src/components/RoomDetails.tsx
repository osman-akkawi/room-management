import React from 'react';
import { X, Users, Tv, Wifi, Clock } from 'lucide-react';
import { Room, Schedule, Course, Building, Floor } from '../types';
import { formatScheduleTime } from '../utils/dateUtils';
import { RoomLocation } from './RoomLocation';
import { highlightText } from '../utils/highlight';

interface RoomDetailsProps {
  room: Room;
  building?: Building;
  floor?: Floor;
  schedules: Schedule[];
  courses: Course[];
  searchQuery: string;
  onClose: () => void;
}

export const RoomDetails: React.FC<RoomDetailsProps> = ({
  room,
  building,
  floor,
  schedules,
  courses,
  searchQuery,
  onClose,
}) => {
  const roomSchedules = schedules.filter((schedule) => schedule.room_id === room.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">
              Room {highlightText(room.name, searchQuery)}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {/* Room Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                room.status === 'available' ? 'bg-green-100 text-green-800' :
                room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {room.status}
              </span>
            </div>

            {/* Room Details */}
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-3" />
                <span>Capacity: {room.capacity} people</span>
              </div>
              
              {building && <RoomLocation building={building} floor={floor} />}
            </div>

            {/* Facilities */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-3">
                {room.facilities.includes('projector') && (
                  <div className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    <Tv className="h-4 w-4 mr-2" />
                    Projector
                  </div>
                )}
                {room.facilities.includes('wifi') && (
                  <div className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    <Wifi className="h-4 w-4 mr-2" />
                    Wi-Fi
                  </div>
                )}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Today's Schedule</h3>
              <div className="space-y-3">
                {roomSchedules.length > 0 ? (
                  roomSchedules.map((schedule) => {
                    const course = courses.find(c => c.id === schedule.course_id);
                    return (
                      <div
                        key={schedule.id}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <Clock className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {course?.name || 'Unnamed Course'} ({highlightText(course?.code || 'N/A', searchQuery)})
                          </p>
                          <p className="text-sm text-gray-600">
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
          </div>
        </div>
      </div>
    </div>
  );
};