import React from 'react';
import { Plus, Users, Pencil, Trash2, GraduationCap, Mail } from 'lucide-react';
import { Instructor } from '../../types';
import { supabase } from '../../lib/supabase';

interface InstructorsListProps {
  instructors: Instructor[];
  onAddClick: () => void;
  onEditClick: (instructor: Instructor) => void;
}

export const InstructorsList: React.FC<InstructorsListProps> = ({
  instructors = [],
  onAddClick,
  onEditClick,
}) => {
  const handleDelete = async (instructorId: string) => {
    if (confirm('Are you sure you want to delete this instructor?')) {
      const { error } = await supabase.from('instructors').delete().eq('id', instructorId);
      if (error) {
        console.error('Error deleting instructor:', error);
        return;
      }
      window.location.reload();
    }
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <Users className="h-6 w-6 text-teal-500 mr-2" />
          Instructors
        </h2>
        <button
          onClick={onAddClick}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Instructor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {instructors.map((instructor) => (
          <div
            key={instructor.id}
            className="p-4 rounded-lg border border-gray-200 hover:border-teal-200 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{instructor.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-2" />
                  {instructor.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {instructor.department}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {instructor.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditClick(instructor)}
                  className="p-1 text-gray-500 hover:text-teal-600 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(instructor.id)}
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