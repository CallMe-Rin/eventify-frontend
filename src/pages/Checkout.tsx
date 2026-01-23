import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

import { useCheckout } from '@/hooks/useCheckout';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { useAuthContext } from '@/hooks/useAuthContext';
import * as checkoutApi from '@/api/checkout';
import * as eventsApi from '@/api/events';
import { formatIDR } from '@/types/api';
import { toast } from 'sonner';
import { PriceBreakdownCard } from '@/features/checkout/components/PriceBreakdownCard';
import { TicketTierSelector } from '@/features/checkout/components/TicketTierSelector';
import { ConfirmationDialog } from '@/features/checkout/components/ConfirmationDialog';
import CheckoutSkeleton from '@/features/checkout/components/CheckoutSkeleton';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract eventId and ticketTierId from URL search params
  const eventId = searchParams.get('eventId');
  const ticketTierId = searchParams.get('ticketTierId');
  const quantityParam = searchParams.get('quantity');
  const quantity = Math.max(1, Math.min(100, Number(quantityParam) || 1));

  // Get authenticated user from context
  const auth = useAuthContext();
  const userId = auth?.profile?.id;
  const isAuthenticated = auth?.isAuthenticated;

  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId || ''],
    queryFn: () => eventsApi.fetchEventById(eventId || ''),
    enabled: !!eventId && !!userId,
  });

  // Fetch ticket tiers
  const { data: ticketTiers, isLoading: tiersLoading } = useQuery({
    queryKey: ['ticket-tiers', eventId || ''],
    queryFn: () => eventsApi.fetchTicketTiersByEventId(eventId || ''),
    enabled: !!eventId && !!userId,
  });

  // Find the selected ticket tier from fetched tiers
  const selectedTicketTier = ticketTiers?.find((t) => t.id === ticketTierId);

  // Calculate base price
  const basePrice = selectedTicketTier
    ? selectedTicketTier.price * quantity
    : 0;

  // Initialize checkout hook
  const checkout = useCheckout({
    userId: userId || '',
    quantity,
    ticketPrice: selectedTicketTier?.price || 0,
  });

  // Price calculation
  const priceCalculation = usePriceCalculation({
    basePrice,
    appliedCoupon: checkout.appliedCoupon,
    pointsUsed: checkout.pointsUsed,
    maxPointsAvailable: checkout.userPoints,
  });

  const isLoading =
    auth?.isLoading ||
    eventLoading ||
    tiersLoading ||
    checkout.pointsLoading ||
    !userId;

  useEffect(() => {
    // Only run auth check after loading is complete
    if (!isLoading && !isAuthenticated) {
      const returnUrl = `/checkout?eventId=${eventId}&ticketTierId=${ticketTierId}&quantity=${quantity}`;
      localStorage.setItem('redirectAfterLogin', returnUrl);
      toast.error('Please sign in to proceed with checkout');
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, eventId, ticketTierId, quantity, navigate]);

  // Format date range
  const formatDateRange = () => {
    if (!event) return '';
    const start = new Date(event.date);
    const end = event.endDate ? new Date(event.endDate) : null;

    const startStr = start.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    if (end) {
      const endStr = end.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = `${start.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${end.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })} WIB`;
      return `${startStr} - ${endStr}, ${timeStr}`;
    }
    return `${startStr}, ${start.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })} WIB`;
  };

  // Handle checkout submission
  const handleCheckout = async () => {
    if (priceCalculation.finalPayable === 0 && !checkout.appliedCoupon) {
      toast.error('Invalid checkout state');
      return;
    }

    setIsSubmitting(true);
    try {
      await checkoutApi.createTransaction(
        userId!,
        eventId!,
        ticketTierId!,
        quantity,
        priceCalculation.finalPayable,
        priceCalculation.couponDiscount,
        priceCalculation.pointsUsed,
        checkout.appliedCoupon?.id,
      );

      if (priceCalculation.cashbackEarned > 0) {
        await checkoutApi.updateUserPoints(
          userId!,
          priceCalculation.cashbackEarned,
          'cashback',
        );
      }

      toast.success('Checkout successful!');
      navigate(`/events/${eventId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  if (!eventId || !ticketTierId) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-26">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Checkout URL</h1>
            <p className="text-secondary-foreground mb-6">
              Missing required parameters. Please make sure you're coming from
              an event page.
            </p>
            <Button onClick={() => navigate('/')} className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event || !selectedTicketTier) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Event or Ticket Not Found
            </h1>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-2">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-0 gap-1 rounded-full hover:bg-secondary hover:cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Main Layout */}
        <main className="container mx-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Ticket Selector */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Summary */}
              <div className="flex gap-4 bg-card rounded-xl p-4 border mb-8">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg truncate">{event.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="size-4" />
                    <span>{formatDateRange()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="size-4" />
                    <span>
                      {event.venue}, {event.location}
                    </span>
                  </div>
                </div>
              </div>
              {/* Ticket Tier */}
              <TicketTierSelector
                tiers={ticketTiers || []}
                selectedTier={selectedTicketTier}
                onSelect={(tier) => {
                  navigate(
                    `/checkout?eventId=${eventId}&ticketTierId=${tier.id}&quantity=${quantity}`,
                    { replace: true },
                  );
                }}
              />
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                <PriceBreakdownCard
                  breakdown={{
                    subtotal: basePrice,
                    pointsDiscount: priceCalculation.pointsUsed,
                    voucherDiscount: 0,
                    couponDiscount: priceCalculation.couponDiscount,
                    totalDiscount:
                      priceCalculation.pointsUsed +
                      priceCalculation.couponDiscount,
                    total: priceCalculation.finalPayable,
                  }}
                  ticketName={selectedTicketTier.name}
                  quantity={quantity}
                  ticketPrice={selectedTicketTier.price}
                  maxQuantity={selectedTicketTier.quantity || 100}
                  onQuantityChange={(newQty) => {
                    navigate(
                      `/checkout?eventId=${eventId}&ticketTierId=${ticketTierId}&quantity=${newQty}`,
                      { replace: true },
                    );
                  }}
                  userPoints={checkout.userPoints}
                  pointsToUse={checkout.pointsUsed}
                  onPointsChange={checkout.updatePointsUsed}
                  voucher={null}
                  voucherError={null}
                  onApplyVoucher={() => {}}
                  onRemoveVoucher={() => {}}
                  isVoucherLoading={false}
                  coupon={checkout.appliedCoupon}
                  couponError={null}
                  onApplyCoupon={() => {}}
                  onRemoveCoupon={() => {}}
                />
                {/* Desktop Submit Button */}
                <div className="hidden lg:block">
                  <Button
                    onClick={() => setShowConfirmation(true)}
                    disabled={isSubmitting}
                    className="w-full h-12 text-base rounded-xl hover:cursor-pointer"
                    size="lg"
                  >
                    <ShoppingCart className="size-5 mr-2" />
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Confirmation Dialog */}
        {selectedTicketTier && (
          <ConfirmationDialog
            open={showConfirmation}
            onOpenChange={setShowConfirmation}
            onConfirm={handleCheckout}
            isLoading={isSubmitting}
            eventTitle={event.title}
            ticketName={selectedTicketTier.name}
            quantity={quantity}
            priceBreakdown={{
              subtotal: basePrice,
              pointsDiscount: priceCalculation.pointsUsed,
              voucherDiscount: 0,
              couponDiscount: priceCalculation.couponDiscount,
              totalDiscount:
                priceCalculation.pointsUsed + priceCalculation.couponDiscount,
              total: priceCalculation.finalPayable,
            }}
          />
        )}

        {/* Mobile Bottom Bar */}
        {!showConfirmation && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-16">
                <span className="text-xl font-bold text-primary">
                  {formatIDR(priceCalculation.finalPayable)}
                </span>
                <span>
                  <Button
                    onClick={() => setShowConfirmation(true)}
                    disabled={isSubmitting}
                    className="w-full h-12 text-base rounded-xl hover:cursor-pointer mx-1"
                    size="sm"
                  >
                    <ShoppingCart className="size-5 mr-2" />
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile padding to prevent content from being hidden by fixed bottom bar */}
        <div className="lg:hidden h-32" />
      </div>
    </Layout>
  );
}
