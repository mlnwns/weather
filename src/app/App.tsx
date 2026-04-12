import { useVillageForecastQuery } from '@/entities/weather';
import { convertLatLonToGrid } from '@/entities/weather/lib/convertLatLonToGrid';
import { useGeolocation } from '@/shared/hooks/useGeolocation';

function App() {
  const { lat, lon } = useGeolocation();
  const grid = convertLatLonToGrid(lat, lon);

  const { data, isLoading, isError } = useVillageForecastQuery({
    base_date: '20260411',
    base_time: '0200',
    nx: grid.nx,
    ny: grid.ny,
  });

  if (isLoading) return <div>로딩 중</div>;
  if (isError) return <div>에러 발생</div>;

  return <div>날씨 데이터</div>;
}

export default App;
