import React from 'react';
import { Instructor } from '../../../types';
import { InstructorsList } from '../InstructorsList';

interface InstructorsSectionProps {
  instructors: Instructor[];
  onAddClick: () => void;
  onEditClick: (instructor: Instructor) => void;
}

export const InstructorsSection: React.FC<InstructorsSectionProps> = ({
  instructors,
  onAddClick,
  onEditClick,
}) => {
  return (
    <InstructorsList
      instructors={instructors}
      onAddClick={onAddClick}
      onEditClick={onEditClick}
    />
  );
};