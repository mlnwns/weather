import {
  subtractMinutesFromSeoulTime,
  to2DigitString,
  toSeoulDateTimeParts,
  toYmd,
} from './seoulDateTime';

const BASE_TIMES = ['2300', '2000', '1700', '1400', '1100', '0800', '0500', '0200'] as const;
const KMA_API_DELAY_MINUTES = 45;

export function getForecastBaseDateTime(now: Date = new Date()): {
  base_date: string;
  base_time: string;
} {
  const seoulNow = toSeoulDateTimeParts(now);
  const safeNow = subtractMinutesFromSeoulTime(seoulNow, KMA_API_DELAY_MINUTES);

  const safeNowTimeHHmm = `${to2DigitString(safeNow.hour)}${to2DigitString(safeNow.minute)}`;

  const pickedBaseTimeHHmm = BASE_TIMES.find((baseTimeHHmm) => baseTimeHHmm <= safeNowTimeHHmm);
  if (pickedBaseTimeHHmm) {
    return { base_date: toYmd(safeNow), base_time: pickedBaseTimeHHmm };
  }

  const prevDay = subtractMinutesFromSeoulTime({ ...safeNow, hour: 0, minute: 0 }, 1);
  return { base_date: toYmd(prevDay), base_time: '2300' };
}
