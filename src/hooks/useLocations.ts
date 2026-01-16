import { fetchLocations, locationKeys } from "@/api/locations";
import { useQuery } from "@tanstack/react-query";

export function useLocations() {
  return useQuery({
    queryKey: locationKeys.all,
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 30,
  });
}
