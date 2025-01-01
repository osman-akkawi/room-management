import { Room, Schedule, Course, Instructor } from '../../../../types';
import { formatScheduleTime } from '../../../../utils/dateUtils';

export const findEmptyTimeSlots = (
  room: Room,
  schedules: Schedule[],
  date: Date = new Date()
) => {
  const roomSchedules = schedules
    .filter(s => s.room_id === room.id)
    .filter(s => new Date(s.start_time).toDateString() === date.toDateString())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const timeSlots: { start: Date; end: Date }[] = [];
  let currentTime = new Date(date);
  currentTime.setHours(8, 0, 0, 0); // Start at 8 AM
  const endTime = new Date(date);
  endTime.setHours(18, 0, 0, 0); // End at 6 PM

  roomSchedules.forEach(schedule => {
    const scheduleStart = new Date(schedule.start_time);
    if (currentTime < scheduleStart) {
      timeSlots.push({
        start: new Date(currentTime),
        end: new Date(scheduleStart)
      });
    }
    currentTime = new Date(schedule.end_time);
  });

  if (currentTime < endTime) {
    timeSlots.push({
      start: new Date(currentTime),
      end: new Date(endTime)
    });
  }

  return timeSlots;
};

export const findInstructorAvailability = (
  instructor: Instructor,
  schedules: Schedule[],
  courses: Course[],
  date: Date = new Date()
) => {
  const instructorCourses = courses.filter(c => c.instructor_id === instructor.id);
  const instructorSchedules = schedules
    .filter(s => 
      instructorCourses.some(c => c.id === s.course_id) &&
      new Date(s.start_time).toDateString() === date.toDateString()
    )
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  return {
    busySlots: instructorSchedules,
    hasConflicts: instructorSchedules.some((s1, i) => 
      instructorSchedules.some((s2, j) => 
        i !== j && 
        new Date(s1.start_time) < new Date(s2.end_time) && 
        new Date(s2.start_time) < new Date(s1.end_time)
      )
    )
  };
};

export const suggestAlternativeSlots = (
  room: Room,
  schedules: Schedule[],
  duration: number = 60 // duration in minutes
) => {
  const emptySlots = findEmptyTimeSlots(room, schedules);
  return emptySlots.filter(slot => {
    const slotDuration = (slot.end.getTime() - slot.start.getTime()) / (1000 * 60);
    return slotDuration >= duration;
  });
};