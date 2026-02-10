import CategoryFilters from '@/components/home/CategoryFilters';
import EventGrid from '@/components/home/EventGrid';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import Hero from '@/components/home/Hero';
import Newsletter from '@/components/home/Newsletter';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useEventsWithTiers } from '@/hooks/useEvents';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const {
    data: events = [],
    isPending: isEventsLoading,
    isError: isEventsError,
    refetch: refetchEvents,
  } = useEventsWithTiers(9);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const categoryMatch =
        selectedCategory === 'all' || event.categoryId === selectedCategory;
      const locationMatch =
        selectedLocation === 'all' || event.locationId === selectedLocation;
      return categoryMatch && locationMatch;
    });
  }, [events, selectedCategory, selectedLocation]);

  return (
    <Layout>
      <Hero />
      <CategoryFilters
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
        onCategoryChange={setSelectedCategory}
        onLocationChange={setSelectedLocation}
      />

      {/* Loading State */}
      {isEventsLoading && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2 bg-secondary" />
            <Skeleton className="h-5 w-64 bg-secondary" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-16/10 rounded-xl bg-secondary" />
                <Skeleton className="h-4 w-3/4 bg-secondary" />
                <Skeleton className="h-4 w-1/2 bg-secondary" />
                <Skeleton className="h-4 w-1/4 bg-secondary" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error State */}
      {isEventsError && !isEventsLoading && (
        <section className="max-w-7xl mx-auto py-16">
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 px-4 max-w-7xl text-center">
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
        </section>
      )}
      {/* Success State */}
      {!isEventsLoading && !isEventsError && (
        <EventGrid
          events={filteredEvents}
          title="Upcoming Events"
          subtitle="Discover what's happening around you"
        />
      )}
      <FeaturedCategories />
      <Newsletter />
    </Layout>
  );
}
