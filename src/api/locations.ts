import { axiosInstance } from '@/lib/axiosInstance';
import type { Location } from '@/types/api';

export const locationKeys = {
  all: ['locations'] as const,
};

// Fetch all locations (public endpoint)
export async function fetchLocations(): Promise<Location[]> {
  const { data } = await axiosInstance.get<{ data: Location[] }>(
    '/api/locations',
  );
  return Array.isArray(data) ? data : data.data || [];
}
