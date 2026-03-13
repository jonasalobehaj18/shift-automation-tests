import { addDays, format } from 'date-fns';

export const formatDateForInsert = (date: Date): string => {
  return format(date, 'dd.MM.yyyy');
};

export const formattedNextDayDateForInput = (): string => {
  return formattedNextDay;
};

export const now = new Date();
export const formattedTodayDate = formatDateForInsert(now);
export const formattedNextDay = formatDateForInsert(addDays(now, 1));
export const formattedDayAfterNext = formatDateForInsert(addDays(now, 2));

export const formattedTodayDateForDisplay = format(now, 'dd/MM/yyyy');
export const formattedTodayDateWithDashForDisplay = format(
  new Date(),
  'dd-MM-yyyy',
);

export const formattedNextDayForDisplay = format(addDays(now, 1), 'dd/MM/yyyy');

export function getLastYearToNewYear(): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  return `${currentYear - 1}-${currentYear}`;
}

export const year =
  now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
