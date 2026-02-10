import { useMemo } from 'react';
import type { DiscountCoupon, PriceCalculation } from '@/types/checkout';

interface UsePriceCalculationProps {
  basePrice: number;
  appliedVoucher: DiscountCoupon | null;
  appliedCoupon: DiscountCoupon | null;
  pointsUsed: number;
  maxPointsAvailable: number;
}

export function usePriceCalculation({
  basePrice,
  appliedVoucher,
  appliedCoupon,
  pointsUsed,
  maxPointsAvailable,
}: UsePriceCalculationProps): PriceCalculation & {
  voucherDiscount: number;
} {
  return useMemo(() => {
    const calculation = {
      basePrice,
      voucherDiscount: 0,
      couponDiscount: 0,
      pointsUsed: 0,
      finalPayable: basePrice,
      cashbackEarned: 0,
    };

    let currentPayable = basePrice;

    // Apply voucher discount first (event specific)
    if (appliedVoucher) {
      let discount = 0;

      if (appliedVoucher.discountType === 'PERCENTAGE') {
        discount = Math.floor(
          (currentPayable * appliedVoucher.discountValue) / 100,
        );
      } else if (appliedVoucher.discountType === 'FIXED') {
        discount = appliedVoucher.discountValue;
      }

      // Cap discount with maxDiscount if set
      if (appliedVoucher.maxDiscount) {
        discount = Math.min(discount, appliedVoucher.maxDiscount);
      }

      // Ensure discount doesn't exceed current payable
      discount = Math.min(discount, currentPayable);

      calculation.voucherDiscount = discount;
      currentPayable -= discount;
    }

    // Apply coupon discount second (user owned)
    if (appliedCoupon) {
      let discount = 0;

      if (appliedCoupon.discountType === 'PERCENTAGE') {
        discount = Math.floor(
          (currentPayable * appliedCoupon.discountValue) / 100,
        );
      } else if (appliedCoupon.discountType === 'FIXED') {
        discount = appliedCoupon.discountValue;
      }

      // Cap discount with maxDiscount if set
      if (appliedCoupon.maxDiscount) {
        discount = Math.min(discount, appliedCoupon.maxDiscount);
      }

      // Ensure discount doesn't exceed current payable
      discount = Math.min(discount, currentPayable);

      calculation.couponDiscount = discount;
      currentPayable -= discount;
    }

    // Apply points (validate points don't exceed available and current payable)
    const validPointsUsed = Math.min(
      pointsUsed,
      maxPointsAvailable,
      currentPayable,
    );
    calculation.pointsUsed = validPointsUsed;
    currentPayable -= validPointsUsed;

    // Ensure final payable is never negative
    calculation.finalPayable = Math.max(0, currentPayable);

    return calculation;
  }, [
    basePrice,
    appliedVoucher,
    appliedCoupon,
    pointsUsed,
    maxPointsAvailable,
  ]);
}
