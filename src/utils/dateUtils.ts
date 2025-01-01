import { format } from 'date-fns';

export const formatScheduleTime = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return `${format(start, 'MMM d, yyyy h:mm a')} - ${format(end, 'h:mm a')}`;
};