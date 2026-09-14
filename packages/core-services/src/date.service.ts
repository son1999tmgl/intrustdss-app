import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

/**
 * Tiện ích xử lý ngày tháng hiện đại bằng Dayjs
 */
export const DateService = {
  formatDateTime(date?: string | number | Date, format = 'DD/MM/YYYY HH:mm'): string {
    if (!date) return '-';
    return dayjs(date).format(format);
  },

  formatDate(date?: string | number | Date, format = 'DD/MM/YYYY'): string {
    if (!date) return '-';
    return dayjs(date).format(format);
  },

  fromNow(date?: string | number | Date): string {
    if (!date) return '-';
    return dayjs(date).fromNow();
  },

  nowIso(): string {
    return dayjs().toISOString();
  },

  isValid(date: any): boolean {
    return dayjs(date).isValid();
  },
};
