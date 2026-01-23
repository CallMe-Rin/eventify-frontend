import { useState } from 'react';
import type { PriceBreakdown, Voucher, Coupon } from '@/types/api';
import { formatIDR } from '@/types/api';
import {
  Coins,
  Tag,
  Gift,
  Percent,
  Minus,
  Plus,
  X,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface PriceBreakdownCardProps {
  breakdown: PriceBreakdown;
  ticketName: string;
  quantity: number;
  ticketPrice: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  // Points
  userPoints: number;
  pointsToUse: number;
  onPointsChange: (points: number) => void;
  // Voucher
  voucher: Voucher | null;
  voucherError: string | null;
  onApplyVoucher: (code: string) => void;
  onRemoveVoucher: () => void;
  isVoucherLoading?: boolean;
  // Coupon
  coupon: Coupon | null;
  couponError: string | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  isCouponLoading?: boolean;
}

export function PriceBreakdownCard({
  breakdown,
  ticketName,
  quantity,
  ticketPrice,
  maxQuantity,
  onQuantityChange,
  userPoints,
  pointsToUse,
  onPointsChange,
  voucher,
  voucherError,
  onApplyVoucher,
  onRemoveVoucher,
  isVoucherLoading = false,
  coupon,
  couponError,
  onApplyCoupon,
  onRemoveCoupon,
  isCouponLoading = false,
}: PriceBreakdownCardProps) {
  const [voucherCode, setVoucherCode] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [showPointsSlider, setShowPointsSlider] = useState(pointsToUse > 0);

  const handleApplyVoucher = () => {
    if (voucherCode.trim()) {
      onApplyVoucher(voucherCode.trim());
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      onApplyCoupon(couponCode.trim());
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherCode('');
    onRemoveVoucher();
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    onRemoveCoupon();
  };

  const maxPointsUsable = Math.min(userPoints, breakdown.subtotal);

  return (
    <div className="bg-card border rounded-xl p-5 space-y-5">
      <h3 className="font-semibold text-lg">Order Summary</h3>

      {/* Ticket Details */}
      <div className="flex justify-between items-start pb-4 border-b">
        <div>
          <p className="font-medium">{ticketName}</p>
          <p className="text-sm text-muted-foreground">
            {formatIDR(ticketPrice)} × {quantity}
          </p>
        </div>
        <span className="font-medium">{formatIDR(breakdown.subtotal)}</span>
      </div>

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Quantity
        </label>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="h-10 w-10 rounded-xl hover:cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-16 text-center text-xl font-semibold tabular-nums">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              onQuantityChange(Math.min(maxQuantity, quantity + 1))
            }
            disabled={quantity >= maxQuantity}
            className="h-10 w-10 rounded-xl hover:cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {maxQuantity < 10 && (
          <p className="text-xs text-muted-foreground text-center">
            Only {maxQuantity} tickets left
          </p>
        )}
      </div>

      {/* Discount Section */}
      {ticketPrice > 0 && (
        <div className="space-y-4 pt-4 border-t">
          {/* Voucher Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Event Voucher
            </label>
            {voucher ? (
              <div className="flex items-center justify-between bg-primary/10 text-primary px-3 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">{voucher.code}</span>
                  <span className="text-sm">
                    (-
                    {voucher.discountType === 'percentage'
                      ? `${voucher.discountValue}%`
                      : formatIDR(voucher.discountValue)}
                    )
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary hover:text-primary/80"
                  onClick={handleRemoveVoucher}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter voucher code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  className={cn(
                    'rounded-xl py-5',
                    voucherError && 'border-destructive',
                  )}
                />
                <Button
                  onClick={handleApplyVoucher}
                  disabled={!voucherCode.trim() || isVoucherLoading}
                  variant="secondary"
                  className="py-5 rounded-xl hover:cursor-pointer"
                >
                  {isVoucherLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
            )}
            {voucherError && (
              <p className="text-xs text-destructive">{voucherError}</p>
            )}
          </div>

          {/* Coupon Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              Discount Coupon
            </label>
            {coupon ? (
              <div className="flex items-center justify-between bg-success/10 text-success px-3 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">{coupon.code}</span>
                  <span className="text-sm">
                    (-
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}%`
                      : formatIDR(coupon.discountValue)}
                    )
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-success hover:text-success/80"
                  onClick={handleRemoveCoupon}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className={cn(
                    'rounded-xl py-5',
                    couponError && 'border-destructive',
                  )}
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || isCouponLoading}
                  variant="secondary"
                  className="py-5 rounded-xl hover:cursor-pointer"
                >
                  {isCouponLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
            )}
            {couponError && (
              <p className="text-xs text-destructive">{couponError}</p>
            )}
          </div>

          {/* Points Usage */}
          {userPoints > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Coins className="h-4 w-4 text-gold" />
                  Use Points
                </label>
                <span className="text-xs text-muted-foreground">
                  Available: {userPoints.toLocaleString()} pts
                </span>
              </div>

              {!showPointsSlider ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl py-4 hover:cursor-pointer"
                  onClick={() => setShowPointsSlider(true)}
                >
                  Apply points discount
                </Button>
              ) : (
                <div className="space-y-3 bg-muted/50 p-3 rounded-xl">
                  <Slider
                    value={[pointsToUse]}
                    onValueChange={([value]) => onPointsChange(value)}
                    max={maxPointsUsable}
                    step={1000}
                    className="w-full hover:cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Using: {pointsToUse.toLocaleString()} pts
                    </span>
                    <span className="font-medium text-gold">
                      -{formatIDR(pointsToUse)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-destructive hover:bg-transparent hover:text-destructive/70 hover:cursor-pointer"
                    onClick={() => {
                      onPointsChange(0);
                      setShowPointsSlider(false);
                    }}
                  >
                    Remove points
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Discount Summary */}
      {breakdown.totalDiscount > 0 && (
        <div className="space-y-2 pt-4 border-t border-dashed">
          {breakdown.pointsDiscount > 0 && (
            <DiscountLine
              icon={<Coins className="size-4 text-gold" />}
              label="Points Discount"
              amount={-breakdown.pointsDiscount}
            />
          )}
          {breakdown.voucherDiscount > 0 && (
            <DiscountLine
              icon={<Tag className="size-4 text-primary" />}
              label="Voucher Discount"
              amount={-breakdown.voucherDiscount}
            />
          )}
          {breakdown.couponDiscount > 0 && (
            <DiscountLine
              icon={<Gift className="size-4 text-success" />}
              label="Coupon Discount"
              amount={-breakdown.couponDiscount}
            />
          )}
        </div>
      )}

      {/* Total Savings */}
      {breakdown.totalDiscount > 0 && (
        <div className="flex justify-between items-center text-sm bg-accent text-primary px-3 py-2 rounded-xl">
          <div className="flex items-center gap-2">
            <Percent className="size-4" />
            <span>Total Savings</span>
          </div>
          <span className="font-semibold">
            {formatIDR(breakdown.totalDiscount)}
          </span>
        </div>
      )}

      {/* Grand Total */}
      <div className="border-t pt-4 flex justify-between items-center">
        <span className="font-semibold text-lg">Total Payment</span>
        <span className="font-bold text-2xl text-primary">
          {formatIDR(breakdown.total)}
        </span>
      </div>
    </div>
  );
}

function DiscountLine({
  icon,
  label,
  amount,
}: {
  icon: React.ReactNode;
  label: string;
  amount: number;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-success font-medium">{formatIDR(amount)}</span>
    </div>
  );
}
