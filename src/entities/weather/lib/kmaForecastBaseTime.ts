const BASE_TIMES = ['2300', '2000', '1700', '1400', '1100', '0800', '0500', '0200'] as const;
const KMA_API_DELAY_MINUTES = 45;

type SeoulParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export function getVillageForecastBaseDateTime(now: Date = new Date()): {
  base_date: string;
  base_time: string;
} {
  const seoulNow = toSeoulDateTimeParts(now);
  const safeNow = subtractMinutesFromSeoulTime(seoulNow, KMA_API_DELAY_MINUTES);

  const hhmm = `${to2DigitString(safeNow.hour)}${to2DigitString(safeNow.minute)}`;

  const picked = BASE_TIMES.find((t) => t <= hhmm);
  if (picked) {
    return { base_date: toYmd(safeNow), base_time: picked };
  }

  // 02:00 이전에는 전날 23:00 사용
  const prevDay = subtractMinutesFromSeoulTime({ ...safeNow, hour: 0, minute: 0 }, 1);
  return { base_date: toYmd(prevDay), base_time: '2300' };
}

function toSeoulDateTimeParts(date: Date): SeoulParts {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(date);
  const lookup = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value;

  const year = Number(lookup('year'));
  const month = Number(lookup('month'));
  const day = Number(lookup('day'));
  const hour = Number(lookup('hour'));
  const minute = Number(lookup('minute'));

  return { year, month, day, hour, minute };
}

function to2DigitString(n: number): string {
  return String(n).padStart(2, '0');
}

function toYmd(parts: Pick<SeoulParts, 'year' | 'month' | 'day'>): string {
  return `${parts.year}${to2DigitString(parts.month)}${to2DigitString(parts.day)}`;
}

function subtractMinutesFromSeoulTime(parts: SeoulParts, minutesToSubtract: number): SeoulParts {
  const base = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute));
  const next = new Date(base.getTime() - minutesToSubtract * 60 * 1000);

  const year = next.getUTCFullYear();
  const month = next.getUTCMonth() + 1;
  const day = next.getUTCDate();
  const hour = next.getUTCHours();
  const minute = next.getUTCMinutes();

  return { year, month, day, hour, minute };
}
