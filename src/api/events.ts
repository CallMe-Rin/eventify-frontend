import { axiosInstance } from "@/lib/axiosInstance";
import type { EventItem, EventWithTiers, TicketTier } from "@/types/api";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};

export const ticketTierKeys = {
  all: ["ticket-tiers"] as const,
  byEvent: (eventId: string) =>
    [...ticketTierKeys.all, "event", eventId] as const,
};

// Fetch all events
export async function fetchEvents(): Promise<EventItem[]> {
  const { data } = await axiosInstance.get<EventItem[]>("/events");
  return data;
}

// Fetch event by ID
export async function fetchEventById(id: string): Promise<EventItem> {
  const { data } = await axiosInstance.get<EventItem>(`/events/${id}`);
  return data;
}

// Fetch ticket tiers by event ID
export async function fetchTicketTiersByEventId(
  eventId: string,
): Promise<TicketTier[]> {
  const { data } = await axiosInstance.get<TicketTier[]>("/ticket-tiers", {
    params: { eventId },
  });
  return data;
}

// Fetch event with tiers
export async function fetchEventWithTiers(id: string): Promise<EventWithTiers> {
  const [event, ticketTiers] = await Promise.all([
    fetchEventById(id),
    fetchTicketTiersByEventId(id),
  ]);
  return { ...event, ticketTiers };
}

// Fetch events with tiers
export async function fetchEventsWithTiers(): Promise<EventWithTiers[]> {
  const [events, allTicketTiers] = await Promise.all([
    fetchEvents(),
    axiosInstance.get<TicketTier[]>("ticket-tiers").then((res) => res.data),
  ]);
  return events.map((event) => ({
    ...event,
    ticketTiers: allTicketTiers.filter((tier) => tier.eventId === event.id),
  }));
}
