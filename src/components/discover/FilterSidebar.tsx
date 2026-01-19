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

interface FilterSidebarProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;

  selectedCategories: EventCategory[];
  onCategoryToggle: (category: EventCategory) => void;

  eventType: string;
  onEventTypeChange: (type: string) => void;

  onlineOnly: boolean;
  onOnlineOnlyChange: (value: boolean) => void;

  searchQuery: string;
  onSearchChange: (query: string) => void;

  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function FilterSidebar({
  selectedLocation,
  onLocationChange,
  selectedCategories,
  onCategoryToggle,
  eventType,
  onEventTypeChange,
  onlineOnly,
  onOnlineOnlyChange,
  searchQuery,
  onSearchChange,
  onClearFilters,
  hasActiveFilters,
}: FilterSidebarProps) {
  const [locationOpen, setLocationOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);

  const { data: locations = [] } = useLocations();

  // Handle the Online Switch Toggle
  const handleOnlineToggle = (checked: boolean) => {
    onOnlineOnlyChange(checked);
    if (checked) {
      // If switch turned ON, force location to Online
      onLocationChange("Online");
    } else {
      // If switch turned OFF, reset to All Locations
      onLocationChange("All Locations");
    }
  };

  // Handle specific Location Selection
  const handleLocationSelect = (locationName: string) => {
    onLocationChange(locationName);
    if (locationName !== "Online") {
      onOnlineOnlyChange(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-8 gap-1 text-primary hover:text-primary/80 hover:bg-transparent rounded-xl cursor-pointer"
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
          checked={onlineOnly || selectedLocation === "Online"}
          onCheckedChange={handleOnlineToggle}
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
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          {locations.slice(0, 8).map((location) => (
            <button
              key={location.id}
              onClick={() => {
                handleLocationSelect(location.name);
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
                onEventTypeChange(type.value);
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
              onClick={() => onCategoryToggle(category.value)}
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
