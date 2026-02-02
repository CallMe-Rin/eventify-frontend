import { Skeleton } from '@/components/ui/skeleton';

export function TransactionCardSkeleton() {
  return (
    <div className="bg-card border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          {/* Event Image Skeleton */}
          <Skeleton className="w-20 h-20 rounded-lg bg-secondary" />

          {/* Event Info Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 bg-secondary" /> {/* Title */}
            <Skeleton className="h-4 w-24 bg-secondary" />{' '}
            {/* Tier × Quantity */}
            <div className="flex items-center gap-2 mt-1">
              <Skeleton className="size-3 rounded-full bg-secondary" />{' '}
              {/* Calendar icon */}
              <Skeleton className="h-3 w-32 bg-secondary" /> {/* DateTime */}
            </div>
          </div>
        </div>

        {/* Status & Price Skeleton */}
        <div className="text-right space-y-2">
          <Skeleton className="h-6 w-24 ml-auto bg-secondary" />{' '}
          {/* Status Badge */}
          <Skeleton className="h-6 w-20 ml-auto bg-secondary" /> {/* Price */}
        </div>
      </div>
    </div>
  );
}
