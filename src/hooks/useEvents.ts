import { eventKeys, fetchEvents, fetchEventsWithTiers } from "@/api/events";
import { useQuery } from "@tanstack/react-query";

export function useEvents() {
  return useQuery({
    queryKey: eventKeys.list(),
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEventsWithTiers() {
  return useQuery({
    queryKey: [...eventKeys.lists(), "with-tiers"],
    queryFn: fetchEventsWithTiers,
    staleTime: 1000 * 60 * 5,
  });
}
