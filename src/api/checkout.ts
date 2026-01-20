import { axiosInstance } from "@/lib/axiosInstance";
import type {
  DiscountCoupon,
  Transaction,
  CheckoutResponse,
} from "@/types/checkout";

// Fetch user by ID
export async function fetchUser(userId: string) {
  const { data } = await axiosInstance.get(`/users/${userId}`);
  return data;
}

// Fetch user points balance
export async function fetchUserPoints(userId: string): Promise<number> {
  const { data } = await axiosInstance.get(`/user-points?userId=${userId}`);
  if (Array.isArray(data)) {
    return data.reduce(
      (sum: number, point: { amount: number }) => sum + point.amount,
      0,
    );
  }
  return (data as { amount?: number }).amount || 0;
}

// Fetch user coupons (owned by user)
export async function fetchUserCoupons(
  userId: string,
): Promise<DiscountCoupon[]> {
  const { data } = await axiosInstance.get(`/user-coupons?userId=${userId}`);
  return Array.isArray(data) ? data : [];
}

// Validate and fetch coupon by code
export async function fetchCouponByCode(code: string): Promise<DiscountCoupon> {
  const { data } = await axiosInstance.get(
    `/coupons?code=${code.toUpperCase()}`,
  );
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }
  throw new Error("Coupon not found");
}

// Create transaction (checkout)
export async function createTransaction(
  userId: string,
  eventId: string,
  ticketTierId: string,
  quantity: number,
  totalAmount: number,
  discountAmount: number,
  pointsUsed: number,
  couponId?: string,
): Promise<CheckoutResponse> {
  const transaction: Partial<Transaction> = {
    userId,
    eventId,
    ticketTierId,
    quantity,
    totalAmount,
    discountAmount,
    pointsUsed,
    couponId,
    status: "waiting_payment",
  };

  const { data } = await axiosInstance.post<CheckoutResponse>(
    "/transactions",
    transaction,
  );
  return data;
}

// Update user points (add cashback)
export async function updateUserPoints(
  userId: string,
  amount: number,
  source: "referral" | "purchase" | "bonus" | "cashback",
): Promise<{ id: string; userId: string; amount: number }> {
  const { data } = await axiosInstance.post("/user-points", {
    userId,
    amount,
    source,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  });
  return data;
}

// Validate coupon for checkout
export async function validateCoupon(
  couponCode: string,
  cartAmount: number,
): Promise<{ valid: boolean; coupon?: DiscountCoupon; error?: string }> {
  try {
    const coupon = await fetchCouponByCode(couponCode);

    // Check expiration
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);

    if (now < validFrom || now > validUntil) {
      return { valid: false, error: "Coupon has expired or not yet valid" };
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { valid: false, error: "Coupon usage limit reached" };
    }

    // Check minimum purchase
    if (coupon.min_purchase && cartAmount < coupon.min_purchase) {
      return {
        valid: false,
        error: `Minimum purchase of ${coupon.min_purchase} required`,
      };
    }

    return { valid: true, coupon };
  } catch {
    return { valid: false, error: "Coupon not found or invalid" };
  }
}
