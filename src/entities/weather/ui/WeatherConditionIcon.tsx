import clearIcon from '@/shared/assets/icons/clear.svg';
import mostlyCloudyIcon from '@/shared/assets/icons/mostly_cloudy.svg';
import overcastIcon from '@/shared/assets/icons/overcast.svg';
import rainIcon from '@/shared/assets/icons/rain.svg';
import showerIcon from '@/shared/assets/icons/shower.svg';
import snowIcon from '@/shared/assets/icons/snow.svg';

type WeatherConditionIconProps = {
  label?: string | null;
  className?: string;
};

function getIconSrcByLabel(label: string): string | null {
  switch (label) {
    case '맑음':
      return clearIcon;
    case '구름많음':
      return mostlyCloudyIcon;
    case '흐림':
      return overcastIcon;
    case '비':
      return rainIcon;
    case '비/눈':
      return rainIcon;
    case '눈':
      return snowIcon;
    case '소나기':
      return showerIcon;
    case '하늘':
      return mostlyCloudyIcon;
    case '강수':
      return rainIcon;
    default:
      return null;
  }
}

export function WeatherConditionIcon({ label, className }: WeatherConditionIconProps) {
  if (!label) return null;
  const src = getIconSrcByLabel(label);
  if (!src) return null;

  return <img src={src} alt={label} className={className} />;
}
