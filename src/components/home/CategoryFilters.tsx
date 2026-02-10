import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Filter } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useLocations } from '@/hooks/useLocations';

interface CategoryFiltersProps {
  selectedCategory: string;
  selectedLocation: string;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
}

export default function CategoryFilters({
  selectedCategory,
  selectedLocation,
  onCategoryChange,
  onLocationChange,
}: CategoryFiltersProps) {
  const { data: categories = [] } = useCategories();
  const { locations } = useLocations();

  return (
    <section className="border-b border-border bg-card/50 px-4 sm:px-0">
      <div className="max-w-7xl mx-auto py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar lg:pb-0 rounded-full">
            <button
              onClick={() => onCategoryChange('all')}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all hover:cursor-pointer',
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
              )}
            >
              <Filter className="h-4 w-4" />
              All Events
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all hover:cursor-pointer',
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
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
              <SelectTrigger className="w-48 rounded-full border-muted bg-muted/50 hover:cursor-pointer">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-1">
                <SelectItem
                  value="all"
                  className="rounded-lg hover:cursor-pointer font-medium"
                >
                  All Locations
                </SelectItem>
                {locations.map((location) => (
                  <SelectItem
                    key={location.id}
                    value={location.id}
                    className="rounded-lg hover:cursor-pointer"
                  >
                    {location.name}
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
