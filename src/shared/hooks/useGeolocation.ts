import { useState, useEffect } from 'react';

interface GeolocationState {
  lat: number;
  lon: number;
}

const DEFAULT_LOCATION: GeolocationState = {
  lat: 37.5665,
  lon: 126.978,
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>(DEFAULT_LOCATION);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        setLocation(DEFAULT_LOCATION);
      },
    );
  }, []);

  return location;
};
