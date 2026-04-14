export function mapSkyToLabel(code: number): string {
  switch (code) {
    case 1:
      return '맑음';
    case 3:
      return '구름많음';
    case 4:
      return '흐림';
    default:
      return '하늘';
  }
}

export function mapPtyToLabel(code: number): string {
  switch (code) {
    case 1:
      return '비';
    case 2:
      return '비/눈';
    case 3:
      return '눈';
    case 4:
      return '소나기';
    default:
      return '강수';
  }
}
