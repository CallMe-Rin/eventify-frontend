import { type Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar, Frown, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import EventCard from "./EventCard";

interface EventGridProps {
  events: Event[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  emptyMessage?: string;
}

export default function EventGrid({
  events,
  title = "Upcoming Events",
  subtitle,
  showViewAll = true,
  emptyMessage = "No events found",
}: EventGridProps) {
  if (events.length === 0) {
    return (
      <section className="container mx-auto py-12 px-4 sm:px-0">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Frown className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">{emptyMessage}</h3>
          <p className="mb-6 text-muted-foreground">
            Try adjusting your filters or search terms to find what you're
            looking for.
          </p>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Browse All Events
          </Button>
        </div>
      </section>
    );
  }

  // Split events: first one featured, rest in grid
  const [featuredEvent, ...gridEvents] = events;

  return (
    <section className="container mx-auto py-12 px-4 sm:px-0">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Button
            variant="ghost"
            className="hidden gap-2 sm:inline-flex rounded-full"
            asChild
          >
            <Link to="/events">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Featured Event */}
      {featuredEvent && (
        <div className="mb-8">
          <EventCard event={featuredEvent} featured />
        </div>
      )}

      {/* Event Grid */}
      {gridEvents.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gridEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Mobile View All */}
      {showViewAll && (
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/events">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
