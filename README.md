# Eventify

Modern event management platform built with React, TypeScript, and Vite. Allows users to discover, book, and manage event tickets while organizers can create and manage events with comprehensive analytics.

## Tech Stack

- **Core**: React, TypeScript, Vite
- **Routing**: React Router
- **State Management**: TanStack Query (server state)
- **Styling**: Tailwind CSS v4, Shadcn UI
- **Authentication**: Better Auth, Supabase
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **HTTP Client**: Axios

## Features

### For Customers

- Browse and search events with filters (category, location, price)
- Debounced search functionality
- Event details with ticket tiers and pricing
- Secure checkout with payment proof upload
- Transaction management with status tracking
- Point and coupon redemption system
- Referral code registration
- Event reviews and ratings
- Profile management

### For Organizers

- Event creation and management
- Dashboard analytics with graphical visualizations
- Transaction management (accept/reject payments)
- Attendee list tracking
- Voucher and promotion creation
- Revenue statistics (daily, monthly, yearly)

## Project Structure

```
src/
├── api/              # API service functions
├── assets/           # Static assets
├── components/       # Reusable UI components
│   ├── ui/          # Shadcn UI components
│   ├── auth/        # Authentication components
│   ├── checkout/    # Checkout flow components
│   ├── discover/    # Event discovery components
│   ├── home/        # Homepage components
│   ├── layout/      # Layout components
│   ├── review/      # Review components
│   └── transaction/ # Transaction components
├── config/           # Configuration files (Supabase)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── pages/            # Route components
├── services/         # External services (storage)
├── types/            # TypeScript interfaces
└── App.tsx           # Root component
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd eventify-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file based on `env.example`:

```bash
cp env.example .env
```

4. Configure environment variables:

```env
VITE_API_URL=http://localhost:2000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Key Features Implementation

### Protected Routes

Role-based route protection using `RoleBasedRoute` component ensures customers and organizers only access authorized pages.

### Real-time Transaction Updates

TanStack Query manages server state with automatic refetching and optimistic updates.

### Debounced Search

Custom `useDebounce` hook prevents excessive API calls during search input.

### Payment Flow

- 2-hour countdown timer for payment proof upload
- Automatic transaction expiration
- Transaction status tracking with badges

### Responsive Design

Fully responsive with mobile first approach using Tailwind CSS breakpoints.

## API Integration

All API calls are centralized in `src/api/` directory:

- `events.ts` - Event CRUD operations
- `transactions.ts` - Transaction management
- `reviews.ts` - Review submission
- `checkout.ts` - Checkout process
- `categories.ts` - Category fetching
- `locations.ts` - Location data

## License

MIT
