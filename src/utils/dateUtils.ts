
import { format, isToday, isTomorrow, isYesterday, addDays, isAfter, differenceInDays } from "date-fns";

export type SmartDateFormat = 'Today' | 'Tomorrow' | 'Yesterday' | 'In X days' | 'X days ago' | 'Full date';

export function formatDate(date: Date): string {
  if (!date) return '';
  
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  const now = new Date();
  const days = differenceInDays(date, now);
  
  if (days > 0 && days < 7) {
    return `In ${days} day${days > 1 ? 's' : ''}`;
  }
  
  if (days < 0 && days > -7) {
    return `${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} ago`;
  }
  
  return format(date, 'MMM d, yyyy');
}

export function getDueDateClass(date: Date | null): string {
  if (!date) return '';
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (isToday(date)) {
    return 'due-today';
  }
  
  if (isTomorrow(date)) {
    return 'due-tomorrow';
  }
  
  if (isAfter(now, date)) {
    return 'due-overdue';
  }
  
  return 'due-future';
}

export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}
