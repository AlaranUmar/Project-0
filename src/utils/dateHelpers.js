import { format, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

export const getChartLabel = (date: Date, view: 'day' | 'week' | 'month' | 'year') => {
  switch (view) {
    case 'day':
      return format(date, 'HH:mm'); // e.g., 14:00
    case 'week':
      return format(date, 'eeee');  // e.g., Monday
    case 'month':
      return `Week ${format(date, 'w')}`; // e.g., Week 14
    case 'year':
      return format(date, 'MMM');   // e.g., Jan
    default:
      return format(date, 'PP');
  }
};