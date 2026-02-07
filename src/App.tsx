import { BrowserRouter, Routes, Route } from 'react-router';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster as Sonner, Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RoleBasedRoute } from './components/auth/RoleBasedRoute';
import { CheckoutProtected } from './components/checkout/CheckoutProtected';
import HomePage from './pages/Home';
import EventDetailPage from './pages/EventDetail';
import DashboardHome from './pages/OrganizerDashboard';
import DiscoverPage from './pages/Discover';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import CheckoutPage from './pages/Checkout';
import TransactionsPage from './pages/Transactions';
import ReviewFormPage from './pages/Review';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route
                path="/checkout"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CheckoutProtected>
                      <CheckoutPage />
                    </CheckoutProtected>
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/events/:eventId/checkout"
                element={
                  <RoleBasedRoute allowedRoles={['customer']}>
                    <CheckoutProtected>
                      <CheckoutPage />
                    </CheckoutProtected>
                  </RoleBasedRoute>
                }
              />
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/review/:eventId" element={<ReviewFormPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
