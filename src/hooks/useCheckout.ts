import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
  DiscountCoupon,
  AttendeeInfo,
  PaymentMethod,
} from '@/types/checkout';
import * as checkoutApi from '@/api/checkout';

interface UseCheckoutProps {
  userId: string;
  quantity: number;
  ticketPrice: number;
  eventId?: string;
}

export function useCheckout({
  userId,
  quantity,
  ticketPrice,
  eventId,
}: UseCheckoutProps) {
  const basePrice = ticketPrice * quantity;

  // Attendee info state
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>('credit-card');

  // Voucher state (event specific coupons)
  const [appliedVoucher, setAppliedVoucher] = useState<DiscountCoupon | null>(
    null,
  );
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);

  // Coupon state (user owned, general coupons)
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(
    null,
  );
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Points state
  const [pointsUsed, setPointsUsed] = useState(0);

  // Fetch user points
  const { data: userPoints = 0, isLoading: pointsLoading } = useQuery({
    queryKey: ['user-points', userId],
    queryFn: () => checkoutApi.fetchUserPoints(),
    enabled: !!userId,
  });

  // Validate voucher mutation (event specific)
  const validateVoucherMutation = useMutation({
    mutationFn: (code: string) => {
      if (!eventId) {
        throw new Error('Event ID is required for voucher validation');
      }
      return checkoutApi.fetchVoucherByCode(code, eventId);
    },
    onSuccess: (voucher) => {
      // Validate expiration
      const now = new Date();
      const validFrom = new Date(voucher.validFrom);
      const validUntil = new Date(voucher.validUntil);

      if (now < validFrom || now > validUntil) {
        setVoucherError('Voucher has expired or not yet valid');
        setAppliedVoucher(null);
        return;
      }

      // Check if active
      if (!voucher.isActive) {
        setVoucherError('Voucher is not active');
        setAppliedVoucher(null);
        return;
      }

      // Check usage limit
      if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
        setVoucherError('Voucher usage limit reached');
        setAppliedVoucher(null);
        return;
      }

      // Check minimum purchase
      if (voucher.minPurchase && basePrice < voucher.minPurchase) {
        setVoucherError(
          `Minimum purchase of Rp ${voucher.minPurchase.toLocaleString()} required for this voucher`,
        );
        setAppliedVoucher(null);
        return;
      }

      setAppliedVoucher(voucher);
      setVoucherError(null);
      setVoucherCode('');
    },
    onError: (error) => {
      setVoucherError(
        error instanceof Error ? error.message : 'Invalid voucher code',
      );
      setAppliedVoucher(null);
    },
  });

  // Validate coupon mutation (user owned, general)
  const validateCouponMutation = useMutation({
    mutationFn: (code: string) => checkoutApi.fetchCouponByCode(code),
    onSuccess: (coupon) => {
      // Coupons should NOT be event specific (that's for vouchers)
      if (coupon.eventId) {
        setCouponError(
          'This is an event voucher. Please use the voucher field instead.',
        );
        setAppliedCoupon(null);
        return;
      }

      // Validate expiration
      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validUntil = new Date(coupon.validUntil);

      if (now < validFrom || now > validUntil) {
        setCouponError('Coupon has expired or not yet valid');
        setAppliedCoupon(null);
        return;
      }

      // Check if active
      if (!coupon.isActive) {
        setCouponError('Coupon is not active');
        setAppliedCoupon(null);
        return;
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        setCouponError('Coupon usage limit reached');
        setAppliedCoupon(null);
        return;
      }

      // Check minimum purchase
      if (coupon.minPurchase && basePrice < coupon.minPurchase) {
        setCouponError(
          `Minimum purchase of Rp ${coupon.minPurchase.toLocaleString()} required for this coupon`,
        );
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponError(null);
      setCouponCode('');
    },
    onError: (error) => {
      setCouponError(
        error instanceof Error ? error.message : 'Invalid coupon code',
      );
      setAppliedCoupon(null);
    },
  });

  // Apply voucher handler
  const applyVoucher = useCallback(
    (code: string) => {
      if (!code.trim()) {
        setVoucherError('Please enter a voucher code');
        return;
      }
      if (!eventId) {
        setVoucherError('Event information is missing');
        return;
      }
      validateVoucherMutation.mutate(code.trim().toUpperCase());
    },
    [validateVoucherMutation, eventId],
  );

  // Remove voucher handler
  const removeVoucher = useCallback(() => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setVoucherError(null);
  }, []);

  // Apply coupon handler
  const applyCoupon = useCallback(
    (code: string) => {
      if (!code.trim()) {
        setCouponError('Please enter a coupon code');
        return;
      }
      validateCouponMutation.mutate(code.trim().toUpperCase());
    },
    [validateCouponMutation],
  );

  // Remove coupon handler
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode('');
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
    appliedVoucher,
    voucherCode,
    voucherError,
    appliedCoupon,
    couponCode,
    couponError,
    pointsUsed,
    userPoints,

    // Handlers
    updateAttendeeInfo,
    setSelectedPaymentMethod,
    applyVoucher,
    removeVoucher,
    applyCoupon,
    removeCoupon,
    updatePointsUsed,
    setVoucherCode,
    setCouponCode,

    // Validation
    isAttendeeFormValid,

    // Loading states
    pointsLoading,
    voucherValidating: validateVoucherMutation.isPending,
    couponValidating: validateCouponMutation.isPending,
  };
}
