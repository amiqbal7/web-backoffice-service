import moment from 'moment';

export function dateFormatTimestamp(date: Date | string) {
  return moment(date).format('YYYY-MM-DD hh:mm:ss');
}

export function dateCalendar(date: Date | string) {
  return moment(date).calendar();
}
