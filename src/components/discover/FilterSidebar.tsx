import { EVENT_CATEGORIES, EVENT_TYPES, type EventCategory } from "@/types/api";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, RefreshCcw, Search } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Input } from "../ui/input";
import { useLocations } from "@/hooks/useLocations";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export default function FilterSidebar() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>(
    [],
  );
  const [eventType, setEventType] = useState("all");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Collapsible states
  const [locationOpen, setLocationOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);

  const { data: locations = [] } = useLocations();

  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedLocation("All Locations");
    setSelectedCategories([]);
    setEventType("all");
    setOnlineOnly(false);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedLocation !== "All Locations" ||
    selectedCategories.length > 0 ||
    eventType !== "all" ||
    onlineOnly ||
    searchQuery.length > 0;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 gap-1 text-primary hover:text-primary"
          disabled={!hasActiveFilters}
        >
          <RefreshCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Online Toggle */}
      <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
        <Label htmlFor="online-events" className="font-medium">
          Online Events
        </Label>
        <Switch
          id="online-events"
          checked={onlineOnly}
          onCheckedChange={setOnlineOnly}
        ></Switch>
      </div>

      {/* Location */}
      <Collapsible open={locationOpen} onOpenChange={setLocationOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-primary font-medium hover:text-primary/80">
          Location
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform",
              locationOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-1">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Location"
              className="pl-9 bg-background rounded-xl"
            />
          </div>
          {locations.slice(0, 8).map((location) => (
            <button
              key={location.id}
              onClick={() => {
                setSelectedLocation(location.name);
                setCurrentPage(1);
              }}
              className={cn(
                "block w-full rounded-full px-3 py-2 text-left text-sm transition-colors",
                selectedLocation === location.name
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted",
              )}
            >
              {location.name}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Separator */}
      <Separator />

      {/* Event Type */}
      <Collapsible open={typeOpen} onOpenChange={setTypeOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-primary font-medium hover:text-primary/80">
          Event Type
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform",
              typeOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-1">
          {EVENT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setEventType(type.value);
                setCurrentPage(1);
              }}
              className={cn(
                "block w-full rounded-full px-3 py-2 text-left text-sm transition-colors",
                eventType === type.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted",
              )}
            >
              {type.label}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Separator */}
      <Separator />

      {/* Category */}
      <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-primary font-medium hover:text-primary/80">
          Category
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform",
              categoryOpen && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-1">
          {EVENT_CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => toggleCategory(category.value)}
              className={cn(
                "flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-sm transition-colors",
                selectedCategories.includes(category.value)
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted",
              )}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
