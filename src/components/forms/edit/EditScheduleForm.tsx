import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { Room, Course, Schedule, Instructor } from '../../../types';
import { CourseSelect } from '../schedule/CourseSelect';
import { InstructorSelect } from '../schedule/InstructorSelect';
import { TimeRangeSelect } from '../schedule/TimeRangeSelect';
import { DeleteConfirmationModal } from '../../modals/DeleteConfirmationModal';
import { useScheduleMutation } from '../schedule/useScheduleMutation';

interface EditScheduleFormProps {
  schedule: Schedule;
  room: Room;
  courses: Course[];
  instructors: Instructor[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface EditScheduleFormData extends Schedule {
  instructor_id: string;
}

export const EditScheduleForm: React.FC<EditScheduleFormProps> = ({
  schedule,
  room,
  courses,
  instructors,
  onSuccess,
  onCancel,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<EditScheduleFormData>({
    defaultValues: {
      ...schedule,
      instructor_id: courses.find(c => c.id === schedule.course_id)?.instructor_id || ''
    }
  });

  const { editSchedule, removeSchedule, loading } = useScheduleMutation();

  const handleDelete = async () => {
    try {
      const { error: deleteError } = await removeSchedule(schedule.id);
      if (deleteError) throw deleteError;
      onSuccess();
    } catch (err) {
      setError('Failed to delete schedule. Please try again.');
    }
  };

  const onSubmit = async (data: EditScheduleFormData) => {
    try {
      setError(null);

      if (!data.course_id) {
        setError('Please select a course');
        return;
      }

      // Validate that end time is after start time
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);
      
      if (end <= start) {
        setError('End time must be after start time');
        return;
      }

      const { error: updateError } = await editSchedule(data);
      
      if (updateError) {
        setError(updateError.message);
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Failed to update schedule. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <CourseSelect
          courses={courses}
          value={watch('course_id') || ''}
          onChange={(value) => {
            setValue('course_id', value);
            setValue('instructor_id', '');
          }}
        />

        <InstructorSelect
          instructors={instructors}
          value={watch('instructor_id') || ''}
          onChange={(value) => setValue('instructor_id', value)}
        />

        <TimeRangeSelect
          startTime={watch('start_time') || ''}
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

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Schedule
          </button>
          
          <div className="flex space-x-3">
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
              {loading ? 'Updating...' : 'Update Schedule'}
            </button>
          </div>
        </div>
      </form>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule? This action cannot be undone."
      />
    </>
  );
};