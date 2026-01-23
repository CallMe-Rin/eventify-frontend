import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/layout/Layout';

export default function CheckoutSkeleton() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back button skeleton */}
        <div className="mb-2">
          <Skeleton className="h-10 w-24 rounded-full bg-secondary" />
        </div>

        {/* Main Layout */}
        <main className="container mx-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Summary Skeleton */}
              <div className="flex gap-4 bg-card rounded-xl p-4 border mb-8">
                <Skeleton className="w-24 h-24 rounded-lg shrink-0 bg-secondary" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4 bg-secondary" />
                  <Skeleton className="h-4 w-1/2 bg-secondary" />
                  <Skeleton className="h-4 w-2/3 bg-secondary" />
                </div>
              </div>

              {/* Ticket Tiers Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 bg-secondary" />
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-4 border space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-32 bg-secondary" />
                        <Skeleton className="h-4 w-48 bg-secondary" />
                      </div>
                      <Skeleton className="h-6 w-20 bg-secondary" />
                    </div>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24 bg-secondary" />
                      <Skeleton className="h-9 w-24 rounded-lg bg-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Order Summary Skeleton */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Price Breakdown Card Skeleton */}
                <div className="bg-card rounded-xl p-6 border space-y-4">
                  {/* Order Summary Header */}
                  <Skeleton className="h-6 w-32 bg-secondary" />

                  {/* Ticket Info */}
                  <div className="space-y-2 pb-4 border-b">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24 bg-secondary" />
                      <Skeleton className="h-4 w-20 bg-secondary" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32 bg-secondary" />
                      <Skeleton className="h-4 w-16 bg-secondary" />
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="space-y-2 pb-4 border-b">
                    <Skeleton className="h-4 w-20 bg-secondary" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-lg bg-secondary" />
                      <Skeleton className="h-10 flex-1 rounded-lg bg-secondary" />
                      <Skeleton className="h-10 w-10 rounded-lg bg-secondary" />
                    </div>
                  </div>

                  {/* Points Section */}
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-28 bg-secondary" />
                      <Skeleton className="h-4 w-24 bg-secondary" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-lg bg-secondary" />
                  </div>

                  {/* Coupon Section */}
                  <div className="space-y-3 pb-4 border-b">
                    <Skeleton className="h-4 w-32 bg-secondary" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 flex-1 rounded-lg bg-secondary" />
                      <Skeleton className="h-10 w-20 rounded-lg bg-secondary" />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16 bg-secondary" />
                      <Skeleton className="h-4 w-24 bg-secondary" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-28 bg-secondary" />
                      <Skeleton className="h-4 w-20 bg-secondary" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32 bg-secondary" />
                      <Skeleton className="h-4 w-20 bg-secondary" />
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <Skeleton className="h-6 w-20 bg-secondary" />
                      <Skeleton className="h-6 w-28 bg-secondary" />
                    </div>
                  </div>
                </div>

                {/* Submit Button Skeleton (Desktop) */}
                <div className="hidden lg:block">
                  <Skeleton className="h-12 w-full rounded-xl bg-secondary" />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Bar Skeleton */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-16">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-48 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Mobile padding */}
        <div className="lg:hidden h-32" />
      </div>
    </Layout>
  );
}
