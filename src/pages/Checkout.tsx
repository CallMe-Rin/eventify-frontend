import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { AttendeeForm } from "@/features/checkout/components/AttendeeForm";
import { PaymentMethodSelector } from "@/features/checkout/components/PaymentMethodSelector";
import { OrderSummaryCard } from "@/features/checkout/components/OrderSummaryCard";
import { useCheckout } from "@/hooks/useCheckout";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useAuthContext } from "@/hooks/useAuthContext";
import * as checkoutApi from "@/api/checkout";
import * as eventsApi from "@/api/events";
import { formatIDR } from "@/types/index";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract eventId and ticketTierId from URL search params (not path params)
  const eventId = searchParams.get("eventId");
  const ticketTierId = searchParams.get("ticketTierId");
  const quantityParam = searchParams.get("quantity");
  const quantity = Math.max(1, Math.min(100, Number(quantityParam) || 1));

  // Get authenticated user from context
  const auth = useAuthContext();
  const userId = auth?.profile?.id;
  const isAuthenticated = auth?.isAuthenticated;

  // Form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth guard: Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !auth?.isLoading) {
      // Store the intended destination for post-login redirect
      const returnUrl = `/checkout?eventId=${eventId}&ticketTierId=${ticketTierId}&quantity=${quantity}`;
      localStorage.setItem("redirectAfterLogin", returnUrl);
      toast.error("Please sign in to proceed with checkout");
      navigate("/login");
    }
  }, [
    isAuthenticated,
    auth?.isLoading,
    eventId,
    ticketTierId,
    quantity,
    navigate,
  ]);

  // Fetch event with tiers (ALL HOOKS MUST BE HERE)
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", eventId || ""],
    queryFn: () => eventsApi.fetchEventById(eventId || ""),
    enabled: !!eventId && !!userId,
  });

  // Fetch ticket tiers
  const { data: ticketTiers, isLoading: tiersLoading } = useQuery({
    queryKey: ["ticket-tiers", eventId || ""],
    queryFn: () => eventsApi.fetchTicketTiersByEventId(eventId || ""),
    enabled: !!eventId && !!userId,
  });

  // Find the selected ticket tier
  const selectedTicketTier = ticketTiers?.find((t) => t.id === ticketTierId);
  const basePrice = selectedTicketTier
    ? selectedTicketTier.price * quantity
    : 0;

  // Checkout state management
  const checkout = useCheckout({
    userId: userId || "",
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

  // Check for loading states including auth
  const isAuthLoading = auth?.isLoading;

  // Validation checks - early return if missing required params
  if (!isAuthLoading && (!eventId || !ticketTierId)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Checkout URL</h1>
            <p className="text-gray-600 mb-6">
              Missing required parameters. Please make sure you're coming from
              an event page.
            </p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!checkout.attendeeInfo.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!checkout.attendeeInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkout.attendeeInfo.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    if (!checkout.attendeeInfo.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle checkout submission
  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (priceCalculation.finalPayable === 0 && !checkout.appliedCoupon) {
      toast.error("Invalid checkout state");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create transaction
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

      // Add cashback points if earned
      if (priceCalculation.cashbackEarned > 0) {
        await checkoutApi.updateUserPoints(
          userId!,
          priceCalculation.cashbackEarned,
          "cashback",
        );
      }

      toast.success("Checkout successful!");
      navigate(`/events/${eventId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading =
    isAuthLoading || eventLoading || tiersLoading || checkout.pointsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
            <Button onClick={() => navigate("/")}>
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
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">{event.title}</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendee Form */}
            <AttendeeForm
              attendeeInfo={checkout.attendeeInfo}
              onUpdate={checkout.updateAttendeeInfo}
              errors={formErrors}
            />

            {/* Payment Method */}
            <PaymentMethodSelector
              selectedMethod={checkout.selectedPaymentMethod}
              onChange={checkout.setSelectedPaymentMethod}
            />

            {/* Checkout Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleCheckout}
                disabled={isSubmitting}
                size="lg"
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Checkout -{" "}
                    {formatIDR(priceCalculation.finalPayable)}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <OrderSummaryCard
              eventTitle={event.title}
              ticketTierName={selectedTicketTier.name}
              quantity={quantity}
              calculation={priceCalculation}
              userPoints={checkout.userPoints}
              pointsUsed={checkout.pointsUsed}
              appliedCoupon={checkout.appliedCoupon}
              couponCode={checkout.couponCode}
              couponError={checkout.couponError}
              isValidatingCoupon={checkout.couponValidating}
              onApplyCoupon={checkout.applyCoupon}
              onRemoveCoupon={checkout.removeCoupon}
              onPointsChange={checkout.updatePointsUsed}
              setCouponCode={checkout.setCouponCode}
            />
          </div>
        </div>

        {/* Mobile Only: Hidden on Desktop */}
        <div className="lg:hidden mt-8">
          <Separator />
          <div className="mt-4 sticky bottom-0 bg-white p-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Total Payable</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatIDR(priceCalculation.finalPayable)}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
