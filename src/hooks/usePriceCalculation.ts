import { useMemo } from "react";
import type { DiscountCoupon, PriceCalculation } from "@/types/checkout";

interface UsePriceCalculationProps {
  basePrice: number;
  appliedCoupon: DiscountCoupon | null;
  pointsUsed: number;
  maxPointsAvailable: number;
}

export function usePriceCalculation({
  basePrice,
  appliedCoupon,
  pointsUsed,
  maxPointsAvailable,
}: UsePriceCalculationProps): PriceCalculation {
  return useMemo(() => {
    const calculation: PriceCalculation = {
      basePrice,
      couponDiscount: 0,
      pointsUsed: 0,
      finalPayable: basePrice,
      cashbackEarned: 0,
    };

    // Apply coupon discount
    if (appliedCoupon) {
      let discount = 0;

      if (appliedCoupon.discount_type === "percentage") {
        discount = Math.floor((basePrice * appliedCoupon.discount_value) / 100);
      } else if (appliedCoupon.discount_type === "fixed") {
        discount = appliedCoupon.discount_value;
      }

      // Cap discount with max_discount if set
      if (appliedCoupon.max_discount) {
        discount = Math.min(discount, appliedCoupon.max_discount);
      }

      calculation.couponDiscount = discount;
      calculation.finalPayable = basePrice - discount;
    }

    // Apply points (validate points don't exceed available and current payable)
    const validPointsUsed = Math.min(
      pointsUsed,
      maxPointsAvailable,
      calculation.finalPayable,
    );
    calculation.pointsUsed = validPointsUsed;
    calculation.finalPayable -= validPointsUsed;

    // Handle cashback: if coupon discount exceeds what was needed for price
    if (appliedCoupon && calculation.finalPayable < 0) {
      calculation.cashbackEarned = Math.abs(calculation.finalPayable);
      calculation.finalPayable = 0;
    }

    // Ensure final payable is never negative
    calculation.finalPayable = Math.max(0, calculation.finalPayable);

    return calculation;
  }, [basePrice, appliedCoupon, pointsUsed, maxPointsAvailable]);
}
