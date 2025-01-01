import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Room, Course, Schedule, Instructor } from '../../types';
import { CourseSelect } from './schedule/CourseSelect';
import { InstructorSelect } from './schedule/InstructorSelect';
import { TimeRangeSelect } from './schedule/TimeRangeSelect';
import { RoomSelect } from './schedule/RoomSelect';
import { useScheduleMutation } from './schedule/useScheduleMutation';

interface ScheduleFormProps {
  rooms: Room[];
  courses: Course[];
  instructors: Instructor[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface ScheduleFormData {
  room_id: string;
  course_id: string;
  instructor_id?: string; // Temporary field for UI only
  start_time: string;
  end_time: string;
  recurring: boolean;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  rooms = [],
  courses = [],
  instructors = [],
  onSuccess,
  onCancel,
}) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue } = useForm<ScheduleFormData>();
  const { createSchedule, loading } = useScheduleMutation();
  
  const startTime = watch('start_time');
  const courseId = watch('course_id');
  const instructorId = watch('instructor_id');
  const roomId = watch('room_id');

  // Filter courses based on selected instructor
  const filteredCourses = instructorId 
    ? courses.filter(course => course.instructor_id === instructorId)
    : courses;

  // Update course selection when instructor changes
  useEffect(() => {
    if (instructorId) {
      // Clear course selection if current course doesn't belong to selected instructor
      const currentCourse = courses.find(c => c.id === courseId);
      if (currentCourse && currentCourse.instructor_id !== instructorId) {
        setValue('course_id', '');
      }
    }
  }, [instructorId, courseId, courses, setValue]);

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      setError(null);
      
      if (!data.course_id) {
        setError('Please select a course');
        return;
      }

      if (!data.room_id) {
        setError('Please select a room');
        return;
      }

      // Validate that end time is after start time
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);
      
      if (end <= start) {
        setError('End time must be after start time');
        return;
      }

      // Remove instructor_id before sending to API
      const { instructor_id, ...scheduleData } = data;
      const { error: createError } = await createSchedule(scheduleData);
      
      if (createError) {
        setError(createError.message);
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Failed to create schedule. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <InstructorSelect
        instructors={instructors}
        value={instructorId || ''}
        onChange={(value) => setValue('instructor_id', value)}
      />

      <CourseSelect
        courses={filteredCourses}
        value={courseId || ''}
        onChange={(value) => setValue('course_id', value)}
      />

      <RoomSelect
        rooms={rooms}
        value={roomId || ''}
        onChange={(value) => setValue('room_id', value)}
      />

      <TimeRangeSelect
        startTime={startTime || ''}
        endTime={watch('end_time') || ''}
        onStartTimeChange={(value) => setValue('start_time', value)}
        onEndTimeChange={(value) => setValue('end_time', value)}
      />

      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('recurring')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Recurring Schedule</label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Schedule'}
        </button>
      </div>
    </form>
  );
};