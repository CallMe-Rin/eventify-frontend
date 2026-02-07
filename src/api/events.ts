import { axiosInstance } from '@/lib/axiosInstance';
import type { EventItem, EventWithTiers, TicketTier } from '@/types/api';

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};

export const ticketTierKeys = {
  all: ['ticket-tiers'] as const,
  byEvent: (eventId: string) =>
    [...ticketTierKeys.all, 'event', eventId] as const,
};

// Fetch all events (public endpoint)
export async function fetchEvents(): Promise<EventItem[]> {
  const { data } = await axiosInstance.get<{ data: EventItem[] }>(
    '/api/events',
  );
  return Array.isArray(data) ? data : data.data || [];
}

// Fetch event by ID (public endpoint)
export async function fetchEventById(id: string): Promise<EventItem> {
  const { data } = await axiosInstance.get<{ data: EventItem }>(
    `/api/events/${id}`,
  );
  return data.data || data;
}

// Fetch ticket tiers from event (extract from event data)
export async function fetchTicketTiersByEventId(
  eventId: string,
): Promise<TicketTier[]> {
  const event = await fetchEventById(eventId);
  const eventWithTiers = event as EventWithTiers;
  return eventWithTiers.ticketTiers || [];
}

// Search events (public endpoint)
export async function searchEvents(
  query: string,
  filters?: Record<string, unknown>,
) {
  const params = { q: query, ...filters };
  const { data } = await axiosInstance.get<{ data: EventItem[] }>(
    '/api/events/search',
    { params },
  );
  return Array.isArray(data) ? data : data.data || [];
}

// Fetch events with tiers (combines event and ticket tier data)
export async function fetchEventsWithTiers(): Promise<EventWithTiers[]> {
  const events = await fetchEvents();
  // Events from backend already include ticket tiers in the response
  return events as EventWithTiers[];
}

// Fetch event with tiers
export async function fetchEventWithTiers(id: string): Promise<EventWithTiers> {
  const event = await fetchEventById(id);
  // Event from backend should already include ticket tiers
  return event as EventWithTiers;
}

// Create event (requires auth, organizer only)
export async function createEvent(data: any) {
  const { data: response } = await axiosInstance.post('/api/events', data);
  return response.data || response;
}

// Update event (requires auth, organizer only)
export async function updateEvent(id: string, data: any) {
  const { data: response } = await axiosInstance.patch(
    `/api/events/${id}`,
    data,
  );
  return response.data || response;
}

// Delete event (requires auth, organizer only)
export async function deleteEvent(id: string) {
  const { data: response } = await axiosInstance.delete(`/api/events/${id}`);
  return response;
}

// Get organizer's events (requires auth)
export async function getOrganizerEvents() {
  const { data } = await axiosInstance.get('/api/organizer/events');
  return data.data || [];
}
