import React from 'react';
import { Plus, BookOpen, Pencil, Trash2, User } from 'lucide-react';
import { Course, Instructor } from '../../types';
import { supabase } from '../../lib/supabase';

interface CoursesListProps {
  courses: Course[];
  instructors: Instructor[];
  onAddClick: () => void;
  onEditClick: (course: Course) => void;
}

export const CoursesList: React.FC<CoursesListProps> = ({
  courses = [],
  instructors = [],
  onAddClick,
  onEditClick,
}) => {
  const handleDelete = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) {
        console.error('Error deleting course:', error);
        return;
      }
      window.location.reload();
    }
  };

  const getInstructorName = (instructorId: string | null): string => {
    if (!instructorId) return 'No instructor assigned';
    const instructor = instructors.find((i) => i.id === instructorId);
    return instructor ? instructor.name : 'No instructor assigned';
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <BookOpen className="h-6 w-6 text-indigo-500 mr-2" />
          Courses
        </h2>
        <button
          onClick={onAddClick}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-500">Code: {course.code}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2" />
                  {getInstructorName(course.instructor_id)}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditClick(course)}
                  className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};