import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { formatIDR } from "@/types/index";
import type { DiscountCoupon, PriceCalculation } from "@/types/checkout";

interface OrderSummaryCardProps {
  eventTitle: string;
  ticketTierName: string;
  quantity: number;
  calculation: PriceCalculation;
  userPoints: number;
  pointsUsed: number;
  appliedCoupon: DiscountCoupon | null;
  couponCode: string;
  couponError: string | null;
  isValidatingCoupon: boolean;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onPointsChange: (points: number) => void;
  setCouponCode: (code: string) => void;
}

export function OrderSummaryCard({
  eventTitle,
  ticketTierName,
  quantity,
  calculation,
  userPoints,
  pointsUsed,
  appliedCoupon,
  couponCode,
  couponError,
  isValidatingCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onPointsChange,
  setCouponCode,
}: OrderSummaryCardProps) {
  const [usePoints, setUsePoints] = useState(false);
  const maxUsablePoints = Math.min(
    userPoints,
    calculation.finalPayable + pointsUsed,
  );

  const handlePointsToggle = (checked: boolean) => {
    setUsePoints(checked);
    if (checked) {
      // Auto-apply max usable points
      onPointsChange(maxUsablePoints);
    } else {
      onPointsChange(0);
    }
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      onApplyCoupon(couponCode);
    }
  };

  return (
    <Card className="sticky top-4 p-6 space-y-6">
      {/* Order Items */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">{eventTitle}</p>
          <p className="text-gray-600">{ticketTierName}</p>
          <p className="text-gray-600">Quantity: {quantity}</p>
        </div>
      </div>

      <Separator />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">
            {formatIDR(calculation.basePrice)}
          </span>
        </div>

        {/* Coupon Discount */}
        {calculation.couponDiscount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span className="text-sm">Discount ({appliedCoupon?.code})</span>
            <span className="font-medium">
              -{formatIDR(calculation.couponDiscount)}
            </span>
          </div>
        )}

        {/* Points Used */}
        {calculation.pointsUsed > 0 && (
          <div className="flex justify-between items-center text-blue-600">
            <span className="text-sm">Points Used</span>
            <span className="font-medium">
              -{formatIDR(calculation.pointsUsed)}
            </span>
          </div>
        )}

        {/* Cashback */}
        {calculation.cashbackEarned > 0 && (
          <div className="flex justify-between items-center text-purple-600 bg-purple-50 p-2 rounded">
            <span className="text-sm">Cashback Points Earned</span>
            <span className="font-medium">
              +{formatIDR(calculation.cashbackEarned)}
            </span>
          </div>
        )}
      </div>

      <Separator />

      {/* Coupon Section */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Discount Coupon</Label>
        {appliedCoupon ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-green-700">
                {appliedCoupon.code}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveCoupon}
                className="h-6 text-xs"
              >
                Remove
              </Button>
            </div>
            <p className="text-xs text-green-600">
              {appliedCoupon.discount_type === "percentage"
                ? `${appliedCoupon.discount_value}% off`
                : `${formatIDR(appliedCoupon.discount_value)} off`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleCouponSubmit} className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={isValidatingCoupon}
                className="text-sm"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!couponCode.trim() || isValidatingCoupon}
                className="px-4"
              >
                {isValidatingCoupon ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    <span className="hidden sm:inline">Applying</span>
                  </>
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
            {couponError && (
              <p className="text-xs text-red-600">{couponError}</p>
            )}
          </form>
        )}
      </div>

      {/* Points Section */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Use Points</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              id="use-points"
              checked={usePoints}
              onCheckedChange={handlePointsToggle}
              disabled={userPoints === 0}
            />
            <label
              htmlFor="use-points"
              className="text-sm cursor-pointer flex-1"
            >
              Use {formatIDR(userPoints)} available points
            </label>
          </div>

          {usePoints && userPoints > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 mb-2">
                Up to {formatIDR(maxUsablePoints)} can be used
              </p>
              <input
                type="range"
                min="0"
                max={maxUsablePoints}
                value={pointsUsed}
                onChange={(e) => onPointsChange(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-blue-700 mt-2">
                <span>0</span>
                <span className="font-medium">{formatIDR(pointsUsed)}</span>
                <span>{formatIDR(maxUsablePoints)}</span>
              </div>
            </div>
          )}

          {userPoints === 0 && (
            <p className="text-xs text-gray-500">No points available</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Total Price */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Payable</span>
          <span className="text-blue-600">
            {formatIDR(calculation.finalPayable)}
          </span>
        </div>
        {calculation.finalPayable === 0 && (
          <p className="text-xs text-gray-500">
            Payment complete with coupon and points!
          </p>
        )}
      </div>
    </Card>
  );
}
