import { getVillageForecast } from '@/entities/weather';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getVillageForecast({
          base_date: '20260411',
          base_time: '0200',
          nx: 60,
          ny: 127,
        });

        console.log('날씨 데이터:', data.items.item);
      } catch (error) {
        console.error('API 호출 실패:', error);
      }
    };

    fetchWeather();
  }, []);

  return <div>날씨 데이터 테스트</div>;
}

export default App;
