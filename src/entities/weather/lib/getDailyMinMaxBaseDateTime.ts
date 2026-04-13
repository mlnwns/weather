import { subtractMinutesFromSeoulTime, toSeoulDateTimeParts, toYmd } from './seoulDateTime';

export function getDailyMinMaxBaseDateTime(now: Date = new Date()): {
  base_date: string;
  base_time: '2300';
} {
  const seoulNow = toSeoulDateTimeParts(now);
  const prevDay = subtractMinutesFromSeoulTime({ ...seoulNow, hour: 0, minute: 0 }, 1);
  return { base_date: toYmd(prevDay), base_time: '2300' };
}
