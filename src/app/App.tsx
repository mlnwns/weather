import { useVillageForecastQuery } from '@/entities/weather';

function App() {
  const { data, isLoading, isError } = useVillageForecastQuery({
    base_date: '20260411',
    base_time: '0200',
    nx: 60,
    ny: 127,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생</div>;

  console.log('날씨 데이터:', data?.items.item);

  return <div>날씨 데이터</div>;
}

export default App;
