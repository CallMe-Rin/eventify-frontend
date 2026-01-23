import FilterSidebar from '@/components/discover/FilterSidebar';

import EventCard from '@/components/home/EventCard';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useEventsWithTiers } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';
import { EVENT_CATEGORIES, EVENT_TYPES, type EventCategory } from '@/types/api';
import {
  AlertCircle,
  Loader2,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 8;

const SORT_OPTIONS = [
  {
    value: 'date_asc',
    label: 'Start Time (Soonest)',
  },
  {
    value: 'date_desc',
    label: 'Start Time (Latest)',
  },
  {
    value: 'price_asc',
    label: 'Price (Low to High)',
  },
  {
    value: 'price_desc',
    label: 'Price (High to Low)',
  },
  {
    value: 'rating_desc',
    label: 'Rating (Highest)',
  },
];

export default function DiscoverPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date_asc');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>(
    [],
  );
  const [eventType, setEventType] = useState('all');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data from API
  const {
    data: events = [],
    isPending: isEventsLoading,
    isError: isEventsError,
    refetch: refetchEvents,
  } = useEventsWithTiers();

  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedLocation('All Locations');
    setSelectedCategories([]);
    setEventType('all');
    setOnlineOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedLocation !== 'All Locations' ||
    selectedCategories.length > 0 ||
    eventType !== 'all' ||
    onlineOnly ||
    searchQuery.length > 0;

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.shortDescription.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query),
      );
    }

    // Location filter
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(
        (event) => event.location === selectedLocation,
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) =>
        selectedCategories.includes(event.category),
      );
    }

    // Event type filter
    if (eventType === 'paid') {
      filtered = filtered.filter((event) => !event.isFree);
    } else if (eventType === 'free') {
      filtered = filtered.filter((event) => event.isFree);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'price_asc': {
          const priceA = a.isFree
            ? 0
            : Math.min(...a.ticketTiers.map((t) => t.price));
          const priceB = b.isFree
            ? 0
            : Math.min(...b.ticketTiers.map((t) => t.price));
          return priceA - priceB;
        }
        case 'price_desc': {
          const priceA = a.isFree
            ? 0
            : Math.min(...a.ticketTiers.map((t) => t.price));
          const priceB = b.isFree
            ? 0
            : Math.min(...b.ticketTiers.map((t) => t.price));
          return priceB - priceA;
        }
        case 'rating_desc':
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    events,
    searchQuery,
    selectedLocation,
    selectedCategories,
    eventType,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length);

  // Loading skeleton for event cards
  const EventSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="aspect-16/10 rounded-xl bg-secondary" />
      <Skeleton className="h-4 w-3/4 bg-secondary" />
      <Skeleton className="h-4 w-1/2 bg-secondary" />
      <Skeleton className="h-4 w-1/4 bg-secondary" />
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
          <p className="text-muted-foreground">
            Find amazing events happening around you
          </p>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-warp items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {selectedLocation !== 'All Locations' && (
              <Badge variant="secondary" className="gap-1 pl-2">
                {selectedLocation}
                <button
                  onClick={() => setSelectedLocation('All Locations')}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                >
                  <X className="h-3 w-3 hover:cursor-pointer" />
                </button>
              </Badge>
            )}
            {eventType !== 'all' && (
              <Badge variant="secondary" className="gap-1 pl-2">
                {EVENT_TYPES.find((t) => t.value === eventType)?.label}
                <button
                  onClick={() => setEventType('all')}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                >
                  <X className="h-3 w-3 hover:cursor-pointer" />
                </button>
              </Badge>
            )}
            {selectedCategories.map((cat: EventCategory) => (
              <Badge key={cat} variant="secondary" className="gap-1 pl-2">
                {EVENT_CATEGORIES.find((c) => c.value === cat)?.label}
                <button
                  onClick={() => toggleCategory(cat)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                >
                  <X className="h-3 w-3 hover:cursor-pointer" />
                </button>
              </Badge>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-destructive hover:text-destructive/70 rounded-xl hover:bg-transparent hover:cursor-pointer"
            >
              <Trash2 />
            </Button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl border bg-card p-6">
              <FilterSidebar
                selectedLocation={selectedLocation}
                onLocationChange={(location) => {
                  setSelectedLocation(location);
                  setCurrentPage(1);
                }}
                selectedCategories={selectedCategories}
                onCategoryToggle={toggleCategory}
                eventType={eventType}
                onEventTypeChange={(type) => {
                  setEventType(type);
                  setCurrentPage(1);
                }}
                onlineOnly={onlineOnly}
                onOnlineOnlyChange={setOnlineOnly}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Result Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                          {(selectedLocation !== 'All Locations' ? 1 : 0) +
                            (eventType !== 'all' ? 1 : 0) +
                            selectedCategories.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-80 overflow-y-auto p-6 pt-0"
                  >
                    <SheetHeader>
                      <SheetTitle className="sr-only">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar
                        selectedLocation={selectedLocation}
                        onLocationChange={(location) => {
                          setSelectedLocation(location);
                          setCurrentPage(1);
                        }}
                        selectedCategories={selectedCategories}
                        onCategoryToggle={toggleCategory}
                        eventType={eventType}
                        onEventTypeChange={(type) => {
                          setEventType(type);
                          setCurrentPage(1);
                        }}
                        onlineOnly={onlineOnly}
                        onOnlineOnlyChange={setOnlineOnly}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onClearFilters={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-muted-foreground">
                  {isEventsLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading events...
                    </span>
                  ) : (
                    <>
                      Showing{' '}
                      <span className="font-medium text-foreground">
                        {filteredEvents.length > 0
                          ? `${startItem} - ${endItem}`
                          : '0'}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium text-foreground">
                        {filteredEvents.length}
                      </span>{' '}
                      events
                    </>
                  )}
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Sort by:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px] bg-card rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-1">
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="rounded-xl"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isEventsLoading && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <EventSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {isEventsError && !isEventsLoading && (
              <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 px-4 text-center">
                <div className="mb-4 rounded-full bg-destructive/10 p-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Failed to load events
                </h3>
                <p className="mb-4 text-muted-foreground max-w-sm">
                  Unable to connect to the server.
                </p>
                <Button
                  onClick={() => refetchEvents()}
                  variant="outline"
                  className="gap-2 rounded-full hover:cursor-pointer"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}

            {/* Event Grid */}
            {!isEventsLoading && !isEventsError && (
              <>
                {paginatedEvents.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {paginatedEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 px-4 text-center">
                    <div className="mb-4 rounded-full bg-muted p-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">
                      No events found
                    </h3>
                    <p className="mb-4 text-muted-foreground max-w-sm">
                      Try adjusting your filters or search criteria to find more
                      events
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear all filters
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {!isEventsLoading && !isEventsError && totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className={cn(
                          'cursor-pointer',
                          currentPage === 1 && 'pointer-events-none opacity-50',
                        )}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Show first page, last page, current page and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      },
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={cn(
                          'cursor-pointer',
                          currentPage === totalPages &&
                            'pointer-events-none opacity-50',
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
