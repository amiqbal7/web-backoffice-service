import { DatePicker as BaseDatePicker, Calendar as BaseCalendar } from 'antd';
import type { Moment } from 'moment';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';

export const DatePicker = BaseDatePicker.generatePicker<Moment>(momentGenerateConfig);
export const Calendar = BaseCalendar.generateCalendar<Moment>(momentGenerateConfig);
