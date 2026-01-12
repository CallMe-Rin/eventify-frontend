import { eventsWithTiers } from "@/components/data/mockEvents";
import CategoryFilters from "@/components/home/CategoryFilters";
import EventGrid from "@/components/home/EventGrid";

import FeaturedCategories from "@/components/home/FeaturedCategories";
import Hero from "@/components/home/Hero";
import Newsletter from "@/components/home/Newsletter";
import Layout from "@/components/layout/Layout";

import { type EventCategory } from "@/types";
import { useMemo, useState } from "react";

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<
    EventCategory | "all"
  >("all");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const filteredEvents = useMemo(() => {
    return eventsWithTiers.filter((event) => {
      const categoryMatch =
        selectedCategory === "all" || event.category === selectedCategory;
      const locationMatch =
        selectedLocation === "All Locations" ||
        event.location === selectedLocation;
      return categoryMatch && locationMatch;
    });
  }, [selectedCategory, selectedLocation]);
  return (
    <Layout>
      <Hero />
      <CategoryFilters
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
        onCategoryChange={setSelectedCategory}
        onLocationChange={setSelectedLocation}
      />
      <EventGrid
        events={filteredEvents}
        title="Upcoming Events"
        subtitle="Discover what's happening around you"
      />
      <FeaturedCategories />
      <Newsletter />
    </Layout>
  );
}
