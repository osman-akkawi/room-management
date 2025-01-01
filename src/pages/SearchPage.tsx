import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { RoomCard } from '../components/RoomCard';
import { Calendar } from '../components/Calendar';
import { RoomDetails } from '../components/RoomDetails';
import { useStore } from '../store/useStore';
import { Room } from '../types';
import { searchRooms } from '../utils/search';

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const { 
    rooms, 
    buildings, 
    schedules, 
    courses,
    floors, 
    fetchRooms, 
    fetchBuildings, 
    fetchSchedules, 
    fetchCourses,
    fetchFloors 
  } = useStore();

  useEffect(() => {
    fetchRooms();
    fetchBuildings();
    fetchSchedules();
    fetchCourses();
    fetchFloors();
  }, []);

  const filteredRooms = searchRooms(searchQuery, rooms, buildings, courses, floors);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Available Rooms
        </h1>
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search by room number, building, location, course code, or facilities..."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard 
                key={room.id} 
                room={room}
                searchQuery={searchQuery}
                onClick={() => setSelectedRoom(room)}
              />
            ))}
            {filteredRooms.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">No rooms found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Calendar
            schedules={schedules}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>

      {selectedRoom && (
        <RoomDetails
          room={selectedRoom}
          building={buildings.find(b => b.id === selectedRoom.building_id)}
          floor={floors.find(f => f.building_id === selectedRoom.building_id)}
          schedules={schedules.filter(s => {
            const scheduleDate = new Date(s.start_time);
            return s.room_id === selectedRoom.id && 
                   scheduleDate.toDateString() === selectedDate.toDateString();
          })}
          courses={courses}
          searchQuery={searchQuery}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
};