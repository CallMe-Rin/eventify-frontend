// Mock Users
export interface MockUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  referral_code: string;
  role: "customer" | "organizer";
  points: number;
  created_at: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "user-001",
    email: "john@example.com",
    name: "John Doe",
    avatar_url: undefined,
    phone: "+62812345678",
    bio: "Event enthusiast",
    referral_code: "JOHN2024",
    role: "customer",
    points: 50000,
    created_at: new Date().toISOString(),
  },
  {
    id: "user-002",
    email: "jane@example.com",
    name: "Jane Smith",
    avatar_url: undefined,
    phone: "+62887654321",
    bio: "Event organizer",
    referral_code: "JANE2024",
    role: "organizer",
    points: 0,
    created_at: new Date().toISOString(),
  },
];

// Mock Transactions
export interface MockTransaction {
  id: string;
  user_id: string;
  event_id: string;
  ticket_tier_id: string;
  quantity: number;
  total_amount: number;
  discount_amount: number;
  points_used: number;
  coupon_id?: string;
  status:
    | "waiting_payment"
    | "admin_confirm"
    | "done"
    | "rejected"
    | "expired"
    | "canceled";
  created_at: string;
  expires_at: string;
}

export const mockTransactions: MockTransaction[] = [
  {
    id: "tx-001",
    user_id: "user-001",
    event_id: "evt-001",
    ticket_tier_id: "tier-001",
    quantity: 2,
    total_amount: 500000,
    discount_amount: 0,
    points_used: 0,
    status: "done",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "tx-002",
    user_id: "user-001",
    event_id: "evt-002",
    ticket_tier_id: "tier-002",
    quantity: 1,
    total_amount: 150000,
    discount_amount: 50000,
    points_used: 0,
    status: "waiting_payment",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Coupons
export interface MockCoupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
}

export const mockCoupons: MockCoupon[] = [
  {
    id: "coupon-001",
    code: "SAVE10",
    discount_type: "percentage",
    discount_value: 10,
    min_purchase: 100000,
    max_discount: 50000,
    usage_limit: 100,
    used_count: 45,
    valid_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "coupon-002",
    code: "FLAT25K",
    discount_type: "fixed",
    discount_value: 25000,
    min_purchase: 200000,
    usage_limit: 50,
    used_count: 20,
    valid_from: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Storage for runtime data (simulating database)
let transactionsStore = [...mockTransactions];
let currentUser: MockUser | null = null;

export const mockDb = {
  // Auth
  getCurrentUser: () => currentUser,
  setCurrentUser: (user: MockUser | null) => {
    currentUser = user;
  },

  // Users
  findUserByEmail: (email: string) => mockUsers.find((u) => u.email === email),
  createUser: (user: MockUser) => {
    mockUsers.push(user);
    return user;
  },

  // Transactions
  getTransactionsByUserId: (userId: string) =>
    transactionsStore.filter((t) => t.user_id === userId),

  getTransactionsByEventIds: (eventIds: string[]) =>
    transactionsStore.filter((t) => eventIds.includes(t.event_id)),

  createTransaction: (tx: Omit<MockTransaction, "id" | "created_at">) => {
    const newTx: MockTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    transactionsStore.push(newTx);
    return newTx;
  },

  // Coupons
  findCouponByCode: (code: string) => {
    const now = new Date().toISOString();
    return mockCoupons.find(
      (c) =>
        c.code === code.toUpperCase() &&
        c.valid_from <= now &&
        c.valid_until >= now
    );
  },

  // Points
  getUserPoints: (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    return user?.points || 0;
  },
};
