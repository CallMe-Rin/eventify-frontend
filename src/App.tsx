import { BrowserRouter, Routes, Route } from "react-router";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster as Sonner, Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/Home";
import EventDetailPage from "./pages/EventDetail";
import DashboardHome from "./pages/OrganizerDashboard";
import DiscoverPage from "./pages/Discover";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import CheckoutPage from "./pages/Checkout";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route
                path="/events/:eventId/checkout"
                element={<CheckoutPage />}
              />
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/discover" element={<DiscoverPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
