import React, { createContext, useContext, useEffect, useState } from 'react';
import { GeolocationState } from '../types';

interface LocationContextType {
  location: GeolocationState;
  requestLocation: () => void;
  setUserCoordinates: (lat: number, lng: number, city?: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Default center: Sarita Vihar / Saket area, New Delhi for hospital distance demonstration
const DEFAULT_LAT = 28.5355;
const DEFAULT_LNG = 77.2882;

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
    city: 'New Delhi',
    address: 'Sarita Vihar, Mathura Road, New Delhi',
    loading: false,
    error: null,
    permissionGranted: false,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser. Using default city center.',
        permissionGranted: false,
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          city: 'Current Location',
          address: `GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
          loading: false,
          error: null,
          permissionGranted: true,
        });
      },
      (err) => {
        let msg = 'Unable to fetch precise location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission denied. Showing nearby hospitals relative to default Metro area.';
        }
        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: msg,
          permissionGranted: false,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const setUserCoordinates = (lat: number, lng: number, city?: string) => {
    setLocation((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      city: city || 'Selected Location',
      permissionGranted: true,
    }));
  };

  useEffect(() => {
    // Attempt location request on initial mount
    requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, requestLocation, setUserCoordinates }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
};
