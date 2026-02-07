import { axiosInstance } from '@/lib/axiosInstance';
import type { DiscountCoupon, CheckoutResponse } from '@/types/api';
import type { CreateTransactionRequest } from '@/types/api';
import type { UserPoints } from '@/types/user';

// Fetch current user profile (requires auth)
export async function fetchCurrentUser() {
  const { data } = await axiosInstance.get('/api/users/current');
  return data.data || data;
}

// Fetch user points (requires auth)
export async function fetchUserPoints(userId: string): Promise<number> {
  try {
    const { data } = await axiosInstance.get<{ data: UserPoints[] }>(
      '/api/users/current',
      { params: { userId } },
    );
    const points = Array.isArray(data) ? data : data.data || [];
    return points.reduce((sum, point) => sum + point.amount, 0);
  } catch {
    return 0;
  }
}

// Fetch user owned coupons (requires auth)
export async function fetchUserCoupons(
  userId: string,
): Promise<DiscountCoupon[]> {
  try {
    const { data } = await axiosInstance.get<{ data: DiscountCoupon[] }>(
      '/api/coupons',
      { params: { userId } },
    );
    const coupons = data.data || [];
    return Array.isArray(coupons) ? coupons : [];
  } catch {
    return [];
  }
}

// Fetch coupon by code (public endpoint)
export async function fetchCouponByCode(code: string): Promise<DiscountCoupon> {
  try {
    const { data } = await axiosInstance.get<{ data: DiscountCoupon[] }>(
      '/api/coupons',
      { params: { code: code.toUpperCase() } },
    );
    const coupons = Array.isArray(data) ? data : data.data || [];
    if (coupons.length > 0) {
      return coupons[0];
    }
    throw new Error('Coupon not found');
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Coupon not found or invalid';
    throw new Error(message);
  }
}

// Validate coupon by code (public endpoint)
export async function validateCoupon(
  couponCode: string,
  eventId: string,
  amount: number,
): Promise<{
  isValid: boolean;
  coupon?: DiscountCoupon;
  discountAmount?: number;
  message?: string;
}> {
  try {
    const { data } = await axiosInstance.post('/api/coupons/validate', {
      couponCode: couponCode.toUpperCase(),
      eventId,
      amount,
    });

    if (data.data) {
      return {
        isValid: true,
        coupon: data.data.coupon,
        discountAmount: data.data.discountAmount,
      };
    }
    return { isValid: false };
  } catch (error) {
    return {
      isValid: false,
      message: error instanceof Error ? error.message : 'Invalid coupon',
    };
  }
}

// List public coupons (for reference, public endpoint)
export async function fetchCoupons() {
  try {
    const { data } = await axiosInstance.get<{ data: DiscountCoupon[] }>(
      '/api/coupons',
    );
    return Array.isArray(data) ? data : data.data || [];
  } catch {
    return [];
  }
}

// Create transaction (requires auth)
export async function createTransaction(
  eventId: string,
  ticketTierId: string,
  quantity: number,
  pointsUsed: number,
  couponCode?: string,
): Promise<CheckoutResponse> {
  const request: CreateTransactionRequest = {
    eventId,
    ticketTierId,
    quantity,
    pointsUsed,
    couponCode,
  };

  const { data } = await axiosInstance.post<{ data: CheckoutResponse }>(
    '/api/transactions',
    request,
  );
  return data.data || data;
}

// Add user points (requires auth)
// Note: This might be triggered by referrals or purchase rewards
export async function addUserPoints(
  userId: string,
  amount: number,
  source: 'referral' | 'purchase' | 'bonus' | 'cashback',
) {
  const { data } = await axiosInstance.post('/api/user-points', {
    userId,
    amount,
    source,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  });
  return data.data || data;
}

// Update user points (requires auth)
// Used for cashback or point deduction after transaction
export async function updateUserPoints(
  userId: string,
  amount: number,
  type: 'cashback' | 'deduction',
) {
  if (type === 'cashback') {
    return addUserPoints(userId, amount, 'cashback');
  } else {
    // For deduction, send negative amount
    return addUserPoints(userId, -amount, 'purchase');
  }
}

// Validate coupon for checkout (legacy helper function)
export async function validateCouponForCheckout(
  couponCode: string,
  cartAmount: number,
): Promise<{ valid: boolean; coupon?: DiscountCoupon; error?: string }> {
  try {
    const result = await validateCoupon(couponCode, '', cartAmount);
    if (result.isValid && result.coupon) {
      return { valid: true, coupon: result.coupon };
    }
    return { valid: false, error: result.message || 'Invalid coupon' };
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error ? error.message : 'Coupon not found or invalid',
    };
  }
}
