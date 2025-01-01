import { Room, Schedule, Course, Instructor, Building, Floor } from '../../../../types';
import { findEmptyTimeSlots, findInstructorAvailability, suggestAlternativeSlots } from './scheduleAnalyzer';
import { formatScheduleTime } from '../../../../utils/dateUtils';
import { format, isToday, parseISO } from 'date-fns';

export const processScheduleQuery = (
  query: string,
  rooms: Room[],
  schedules: Schedule[],
  courses: Course[],
  instructors: Instructor[],
  buildings: Building[] = [],
  floors: Floor[] = []
): string => {
  const lowerQuery = query.toLowerCase();

  // Helper function to get room details
  const getRoomDetails = (room: Room) => {
    const building = buildings.find(b => b.id === room.building_id);
    const floor = floors.find(f => f.building_id === building?.id);
    return { building, floor };
  };

  // Find empty slots for a room
  if (lowerQuery.includes('empty') && lowerQuery.includes('room')) {
    const roomNumber = lowerQuery.match(/room\s+(\w+)/i)?.[1];
    if (!roomNumber) {
      return "Please specify a room number (e.g., 'show empty slots for room 101')";
    }

    const room = rooms.find(r => r.name.toLowerCase() === roomNumber.toLowerCase());
    if (!room) {
      const availableRooms = rooms.map(r => r.name).join(', ');
      return `Room ${roomNumber} not found. Available rooms are: ${availableRooms}`;
    }

    const emptySlots = findEmptyTimeSlots(room, schedules);
    if (emptySlots.length === 0) {
      return `Room ${room.name} is fully booked today. Would you like me to suggest alternative rooms?`;
    }

    return `Empty time slots for Room ${room.name} today:\n${emptySlots
      .map(slot => `- ${formatScheduleTime(slot.start.toISOString(), slot.end.toISOString())}`)
      .join('\n')}`;
  }

  // Room capacity query
  if (lowerQuery.includes('capacity') || lowerQuery.includes('how many')) {
    const roomNumber = lowerQuery.match(/room\s+(\w+)/i)?.[1];
    if (!roomNumber) {
      return "Please specify a room number (e.g., 'what is the capacity of room 101')";
    }

    const room = rooms.find(r => r.name.toLowerCase() === roomNumber.toLowerCase());
    if (!room) {
      return `Room ${roomNumber} not found.`;
    }

    const { building } = getRoomDetails(room);
    return `Room ${room.name} in ${building?.name || 'Unknown Building'} has a capacity of ${room.capacity} people.`;
  }

  // Room facilities query
  if (lowerQuery.includes('facilities') || lowerQuery.includes('equipment')) {
    const roomNumber = lowerQuery.match(/room\s+(\w+)/i)?.[1];
    if (!roomNumber) {
      return "Please specify a room number (e.g., 'what facilities does room 101 have')";
    }

    const room = rooms.find(r => r.name.toLowerCase() === roomNumber.toLowerCase());
    if (!room) {
      return `Room ${roomNumber} not found.`;
    }

    if (room.facilities.length === 0) {
      return `Room ${room.name} has no special facilities.`;
    }

    return `Room ${room.name} is equipped with: ${room.facilities.join(', ')}.`;
  }

  // Building location query
  if (lowerQuery.includes('where') || lowerQuery.includes('location')) {
    const buildingName = lowerQuery.match(/building\s+(\w+)/i)?.[1];
    if (!buildingName) {
      return "Please specify a building name (e.g., 'where is building A')";
    }

    const building = buildings.find(b => 
      b.name.toLowerCase().includes(buildingName.toLowerCase())
    );
    if (!building) {
      return `Building ${buildingName} not found.`;
    }

    return `${building.name} is located at ${building.location}.`;
  }

  // Course schedule query
  if (lowerQuery.includes('when') && lowerQuery.includes('course')) {
    const courseCode = lowerQuery.match(/course\s+(\w+)/i)?.[1];
    if (!courseCode) {
      return "Please specify a course code (e.g., 'when is course CS101')";
    }

    const course = courses.find(c => 
      c.code.toLowerCase().includes(courseCode.toLowerCase())
    );
    if (!course) {
      return `Course ${courseCode} not found.`;
    }

    const courseSchedules = schedules.filter(s => s.course_id === course.id);
    if (courseSchedules.length === 0) {
      return `No schedules found for ${course.name} (${course.code}).`;
    }

    const todaySchedules = courseSchedules.filter(s => isToday(parseISO(s.start_time)));
    const response = [`Schedule for ${course.name} (${course.code}):`];

    if (todaySchedules.length > 0) {
      response.push('\nToday:');
      todaySchedules.forEach(schedule => {
        const room = rooms.find(r => r.id === schedule.room_id);
        response.push(`- ${formatScheduleTime(schedule.start_time, schedule.end_time)} in Room ${room?.name || 'Unknown'}`);
      });
    }

    return response.join('\n');
  }

  // Instructor schedule query
  if (lowerQuery.includes('instructor') || lowerQuery.includes('teacher')) {
    const instructorName = lowerQuery.match(/instructor\s+(\w+)/i)?.[1] || 
                          lowerQuery.match(/teacher\s+(\w+)/i)?.[1];
    if (!instructorName) {
      const instructorList = instructors.map(i => i.name).join(', ');
      return `Please specify an instructor name. Available instructors: ${instructorList}`;
    }

    const instructor = instructors.find(i => 
      i.name.toLowerCase().includes(instructorName.toLowerCase())
    );
    if (!instructor) {
      return `Instructor "${instructorName}" not found. Please check the name and try again.`;
    }

    const { busySlots, hasConflicts } = findInstructorAvailability(
      instructor,
      schedules,
      courses
    );

    let response = `Schedule for ${instructor.name}:\n`;
    response += `Department: ${instructor.department}\n`;
    response += `Specializations: ${instructor.specializations.join(', ')}\n\n`;

    if (busySlots.length > 0) {
      response += 'Today\'s Schedule:\n' + busySlots
        .map(s => {
          const course = courses.find(c => c.id === s.course_id);
          const room = rooms.find(r => r.id === s.room_id);
          return `- ${formatScheduleTime(s.start_time, s.end_time)} (${course?.name || 'Unknown course'} in Room ${room?.name || 'Unknown room'})`;
        })
        .join('\n');

      if (hasConflicts) {
        response += '\n\n⚠️ Warning: Schedule has time conflicts!';
      }
    } else {
      response += '\nNo scheduled sessions today.';
    }

    return response;
  }

  // Room availability query
  if (lowerQuery.includes('available') || lowerQuery.includes('free')) {
    const currentTime = new Date();
    const availableRooms = rooms.filter(room => {
      const roomSchedules = schedules.filter(s => s.room_id === room.id);
      return room.status === 'available' && !roomSchedules.some(schedule => {
        const start = new Date(schedule.start_time);
        const end = new Date(schedule.end_time);
        return currentTime >= start && currentTime <= end;
      });
    });

    if (availableRooms.length === 0) {
      return 'No rooms are currently available.';
    }

    const response = ['Currently available rooms:'];
    availableRooms.forEach(room => {
      const { building, floor } = getRoomDetails(room);
      response.push(`- Room ${room.name} (${building?.name || 'Unknown Building'}, Floor ${floor?.name || 'Unknown'}) - Capacity: ${room.capacity}`);
    });

    return response.join('\n');
  }

  // Help message for unrecognized queries
  return `I can help you with:
- Finding empty slots (e.g., "show empty slots for room 101")
- Room capacity (e.g., "what is the capacity of room 101")
- Room facilities (e.g., "what facilities does room 101 have")
- Building locations (e.g., "where is building A")
- Course schedules (e.g., "when is course CS101")
- Instructor schedules (e.g., "show availability for instructor Smith")
- Room availability (e.g., "which rooms are available now")

What would you like to know?`;
};