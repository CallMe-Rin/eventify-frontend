import { type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Button } from "@/components/ui/button";

/**
 * CheckoutProtected component that enforces customer role requirement
 * Displays an error message if user is not a customer
 */
export function CheckoutProtected({ children }: { children: ReactNode }) {
  const { isAuthenticated, role, isLoading } = useAuthContext();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // If organizer, show error message
  if (isAuthenticated && role === "organizer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border bg-card p-8 text-center shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>

            <h2 className="mb-2 text-2xl font-bold">Access Denied</h2>
            <p className="mb-6 text-muted-foreground">
              Organizers cannot perform checkouts. Please use a customer account
              to book tickets.
            </p>

            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
            >
              Go to Organizer Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated customer or not authenticated (will be handled elsewhere)
  return <>{children}</>;
}
