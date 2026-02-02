import { useState, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  DiscountCoupon,
  AttendeeInfo,
  PaymentMethod,
} from "@/types/checkout";
import * as checkoutApi from "@/api/checkout";

interface UseCheckoutProps {
  userId: string;
  quantity: number;
  ticketPrice: number;
}

export function useCheckout({
  userId,
  quantity,
  ticketPrice,
}: UseCheckoutProps) {
  const basePrice = ticketPrice * quantity;

  // Attendee info state
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo>({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("credit-card");

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(
    null,
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  // Points state
  const [pointsUsed, setPointsUsed] = useState(0);

  // Fetch user points
  const { data: userPoints = 0, isLoading: pointsLoading } = useQuery({
    queryKey: ["user-points", userId],
    queryFn: () => checkoutApi.fetchUserPoints(userId),
  });

  // Validate coupon mutation
  const validateCouponMutation = useMutation({
    mutationFn: (code: string) => checkoutApi.fetchCouponByCode(code),
    onSuccess: (coupon) => {
      // Validate expiration
      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validUntil = new Date(coupon.valid_until);

      if (now < validFrom || now > validUntil) {
        setCouponError("Coupon has expired or not yet valid");
        setAppliedCoupon(null);
        return;
      }

      // Check usage limit
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        setCouponError("Coupon usage limit reached");
        setAppliedCoupon(null);
        return;
      }

      // Check minimum purchase
      if (coupon.min_purchase && basePrice < coupon.min_purchase) {
        setCouponError(
          `Minimum purchase of ${coupon.min_purchase} required for this coupon`,
        );
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponError(null);
      setCouponCode("");
    },
    onError: (error) => {
      setCouponError(
        error instanceof Error ? error.message : "Invalid coupon code",
      );
      setAppliedCoupon(null);
    },
  });

  // Apply coupon handler
  const applyCoupon = useCallback(
    (code: string) => {
      if (!code.trim()) {
        setCouponError("Please enter a coupon code");
        return;
      }
      validateCouponMutation.mutate(code.trim().toUpperCase());
    },
    [validateCouponMutation],
  );

  // Remove coupon handler
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  }, []);

  // Update attendee info handler
  const updateAttendeeInfo = useCallback((info: Partial<AttendeeInfo>) => {
    setAttendeeInfo((prev) => ({ ...prev, ...info }));
  }, []);

  // Update points used handler
  const updatePointsUsed = useCallback(
    (points: number) => {
      setPointsUsed(Math.min(points, userPoints));
    },
    [userPoints],
  );

  // Validate attendee form
  const isAttendeeFormValid = useCallback((): boolean => {
    return (
      attendeeInfo.fullName.trim().length > 0 &&
      attendeeInfo.email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeInfo.email) &&
      attendeeInfo.phoneNumber.trim().length > 0
    );
  }, [attendeeInfo]);

  return {
    // State
    basePrice,
    attendeeInfo,
    selectedPaymentMethod,
    appliedCoupon,
    couponCode,
    couponError,
    pointsUsed,
    userPoints,

    // Handlers
    updateAttendeeInfo,
    setSelectedPaymentMethod,
    applyCoupon,
    removeCoupon,
    updatePointsUsed,
    setCouponCode,

    // Validation
    isAttendeeFormValid,

    // Loading states
    pointsLoading,
    couponValidating: validateCouponMutation.isPending,
  };
}
