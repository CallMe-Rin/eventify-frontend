import { EVENT_CATEGORIES, type EventCategory } from "@/types";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Filter } from "lucide-react";
import { LOCATIONS } from "../data/mockEvents";

interface CategoryFiltersProps {
  selectedCategory: EventCategory | "all";
  selectedLocation: string;
  onCategoryChange: (category: EventCategory | "all") => void;
  onLocationChange: (location: string) => void;
}

export default function CategoryFilters({
  selectedCategory,
  selectedLocation,
  onCategoryChange,
  onLocationChange,
}: CategoryFiltersProps) {
  return (
    <section className="border-b border-border bg-card/50 px-4 sm:px-0">
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:pb-0">
            <button
              onClick={() => onCategoryChange("all")}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Filter className="h-4 w-4" />
              All Events
            </button>
            {EVENT_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  selectedCategory === category.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Location Filter */}
          <div className="flex shrink-0 items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedLocation} onValueChange={onLocationChange}>
              <SelectTrigger className="w-48 rounded-full border-muted bg-muted/50">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-1">
                {LOCATIONS.map((location) => (
                  <SelectItem
                    key={location}
                    value={location}
                    className="rounded-lg"
                  >
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
