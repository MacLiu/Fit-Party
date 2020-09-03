import moment from "moment";

export const prettyDate: (date: Date) => string = date => {
  const month = date.toLocaleDateString('default', {month: 'long'});
  const day = date.toLocaleDateString('default', {day: 'numeric'});
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const prettyCalendarMonth: (date: string) => string = date => {
  const d = new Date(date);
  const month = d.toLocaleDateString('default', {month: 'long'});
  const year = d.getFullYear();
  return `${month} ${year}`;
}

export const prettyDateSlashes: (date: Date) => string = date => {
  const month = date.toLocaleDateString('default', {month: 'numeric'});
  const day = date.toLocaleDateString('default', {day: 'numeric'});
  const year = date.getFullYear();
  return `${month}/${day}/${year % 100}`;
};

export function getUTCDate(date: Date): string {
  return moment.utc(date).format('YYYY-MM-DD');
}

export function stringToLocalDate(str: string) {
  return new Date(str).toLocaleDateString();
}

export function stringToFormattedDate(str: string) {
  const d = new Date(str);
  return dateToFormattedString(d);
}

export function dateToFormattedString(date: Date) {
  let month = date.toLocaleDateString('default', {month: 'numeric'});
  if (month.length === 1) {
    month = '0' + month;
  }
  const day = date.toLocaleDateString('default', {day: 'numeric'});
  const year = date.toLocaleDateString('default', {year: 'numeric'});

  return `${year}-${month}-${day}`;
}

export function getCurrentFormattedDate() {
  const d = new Date();
  return dateToFormattedString(d);
}

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const dayAbbreviations = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

export function getDayAbbreviation(date: Date) {
  const day = date.toLocaleString('default', { weekday: 'long' });
  return dayAbbreviations[days.findIndex(d => d === day)];
}
