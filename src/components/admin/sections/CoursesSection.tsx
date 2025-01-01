import React from 'react';
import { Course, Instructor } from '../../../types';
import { CoursesList } from '../CoursesList';

interface CoursesSectionProps {
  courses: Course[];
  instructors: Instructor[];
  onAddClick: () => void;
  onEditClick: (course: Course) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  instructors,
  onAddClick,
  onEditClick,
}) => {
  return (
    <CoursesList
      courses={courses}
      instructors={instructors}
      onAddClick={onAddClick}
      onEditClick={onEditClick}
    />
  );
};