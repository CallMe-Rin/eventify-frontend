import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star, Users, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatEventDate,
  formatEventTime,
  formatIDR,
  type EventWithTiers,
  EVENT_CATEGORIES,
} from "@/types/api";

interface EventCardProps {
  event: EventWithTiers;
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  const categoryInfo = EVENT_CATEGORIES.find((c) => c.value === event.category);
  const lowestPrice = event.isFree
    ? 0
    : Math.min(...event.ticketTiers.map((t) => t.price));
  const totalTickets = event.ticketTiers.reduce(
    (sum, t) => sum + t.quantity,
    0
  );
  const soldTickets = event.ticketTiers.reduce((sum, t) => sum + t.sold, 0);
  const availableTickets = totalTickets - soldTickets;
  const isAlmostSoldOut =
    availableTickets < totalTickets * 0.1 && availableTickets > 0;
  const isSoldOut = availableTickets === 0;

  return (
    <Link
      to={`/events/${event.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-xl",
        featured ? "md:flex-row" : ""
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "md:w-1/2" : "aspect-16/10"
        )}
      >
        <img
          src={event.coverImage}
          alt={event.title}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
            featured ? "aspect-16/10 md:aspect-auto" : ""
          )}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {event.isFree && (
            <Badge className="bg-success text-success-foreground">Free</Badge>
          )}
          {isAlmostSoldOut && !isSoldOut && (
            <Badge variant="destructive">Almost Sold Out</Badge>
          )}
          {isSoldOut && (
            <Badge
              variant="secondary"
              className="bg-muted-foreground text-muted"
            >
              Sold Out
            </Badge>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute bottom-3 left-3">
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm"
          >
            {categoryInfo?.icon} {categoryInfo?.label}
          </Badge>
        </div>

        {/* Rating */}
        {event.averageRating && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="text-xs font-medium">{event.averageRating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("flex flex-1 flex-col p-4", featured ? "md:p-6" : "")}>
        {/* Date */}
        <div className="mb-2 flex items-center gap-2 text-sm text-primary">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">{formatEventDate(event.date)}</span>
          <span className="text-muted-foreground">
            • {formatEventTime(event.date)}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "mb-2 font-bold leading-tight transition-colors group-hover:text-primary",
            featured ? "text-xl md:text-2xl" : "text-lg"
          )}
        >
          {event.title}
        </h3>

        {/* Description (only for featured) */}
        {featured && (
          <p className="mb-4 line-clamp-2 text-muted-foreground">
            {event.shortDescription}
          </p>
        )}

        {/* Location */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {event.venue}, {event.location}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            {event.isFree ? (
              <span className="text-lg font-bold text-success">Free</span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-muted-foreground">From</span>
                <span className="text-lg font-bold">
                  {formatIDR(lowestPrice)}
                </span>
              </div>
            )}
          </div>

          {featured ? (
            <Button className="gap-2 rounded-full">
              Get Tickets
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{availableTickets} left</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
