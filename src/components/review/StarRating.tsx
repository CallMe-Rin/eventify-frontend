import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-9 h-9',
};

export function StarRating({
  value,
  onChange,
  disabled = false,
  size = 'md',
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleMouseEnter = (starIndex: number) => {
    if (!disabled) {
      setHoverValue(starIndex);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const handleClick = (starIndex: number) => {
    if (!disabled) {
      onChange(starIndex);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div
      className="flex gap-1"
      onMouseLeave={handleMouseLeave}
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = starIndex <= displayValue;

        return (
          <button
            key={starIndex}
            type="button"
            className={cn(
              'transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
              disabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:scale-110',
            )}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onClick={() => handleClick(starIndex)}
            disabled={disabled}
            role="radio"
            aria-checked={value === starIndex}
            aria-label={`${starIndex} star${starIndex > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors duration-150',
                isFilled
                  ? 'fill-gold text-gold'
                  : 'fill-transparent text-muted-foreground hover:text-warning/60',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

// Read-only version for displaying ratings
interface StarRatingDisplayProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export function StarRatingDisplay({
  value,
  size = 'sm',
  showValue = false,
}: StarRatingDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= value;
          const isPartial = starIndex > value && starIndex - 1 < value;

          return (
            <Star
              key={starIndex}
              className={cn(
                sizeClasses[size],
                isFilled
                  ? 'fill-warning text-warning'
                  : isPartial
                  ? 'fill-warning/50 text-warning'
                  : 'fill-transparent text-muted-foreground',
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
