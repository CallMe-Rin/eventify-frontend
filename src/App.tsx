import { BrowserRouter, Routes, Route } from "react-router";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster as Sonner, Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import EventDetailPage from "./pages/EventDetail";
import DashboardHome from "./pages/dashboardHome";

const queryClient = new QueryClient();

export default function App() {
  return (
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
            <Route path="/dashboard" element={<DashboardHome />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
