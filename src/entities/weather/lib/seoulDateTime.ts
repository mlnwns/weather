export type SeoulDateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export function toSeoulDateTimeParts(date: Date): SeoulDateTimeParts {
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

export function to2DigitString(n: number): string {
  return String(n).padStart(2, '0');
}

export function toYmd(parts: Pick<SeoulDateTimeParts, 'year' | 'month' | 'day'>): string {
  return `${parts.year}${to2DigitString(parts.month)}${to2DigitString(parts.day)}`;
}

export function getSeoulYmdFromEpochMs(epochMs: number): string {
  return toYmd(toSeoulDateTimeParts(new Date(epochMs)));
}

export function subtractMinutesFromSeoulTime(
  parts: SeoulDateTimeParts,
  minutesToSubtract: number,
): SeoulDateTimeParts {
  const base = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute));
  const next = new Date(base.getTime() - minutesToSubtract * 60 * 1000);

  const year = next.getUTCFullYear();
  const month = next.getUTCMonth() + 1;
  const day = next.getUTCDate();
  const hour = next.getUTCHours();
  const minute = next.getUTCMinutes();

  return { year, month, day, hour, minute };
}
