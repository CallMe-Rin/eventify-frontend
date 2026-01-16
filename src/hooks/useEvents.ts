import {
  eventKeys,
  fetchEventById,
  fetchEventWithTiers,
  fetchEvents,
  fetchEventsWithTiers,
} from "@/api/events";
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

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => fetchEventById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEventWithTiers(id: string) {
  return useQuery({
    queryKey: [...eventKeys.detail(id), "with-tiers"],
    queryFn: () => fetchEventWithTiers(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
