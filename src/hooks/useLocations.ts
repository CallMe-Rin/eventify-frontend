import { useQuery } from '@tanstack/react-query';
import { fetchLocations } from '@/api/locations';
import { useMemo } from 'react';
import type { Location } from '@/types/api';

export function useLocations() {
  // Fetch locations with caching
  const {
    data: locations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });

  const locationMap = useMemo(() => {
    const map = new Map<string, string>();
    locations.forEach((loc: Location) => {
      map.set(loc.id, loc.name);
    });
    return map;
  }, [locations]);

  function getLocationName(locationId: string): string {
    return locationMap.get(locationId) || locationId;
  }

  return {
    locations,
    locationMap,
    getLocationName,
    isLoading,
    error,
  };
}
