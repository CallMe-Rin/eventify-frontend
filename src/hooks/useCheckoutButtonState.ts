import { useAuthContext } from "@/hooks/useAuthContext";

/**
 * Hook to determine if checkout button should be enabled
 * Returns true if user is authenticated and has customer role
 */
export function useCheckoutButtonState() {
  const { isAuthenticated, role, isLoading } = useAuthContext();

  const isCheckoutDisabled =
    isLoading || !isAuthenticated || role !== "customer";

  const checkoutDisabledReason = (() => {
    if (isLoading) return "Loading...";
    if (!isAuthenticated) return "Sign in to checkout";
    if (role !== "customer") return "Only customers can checkout";
    return null;
  })();

  return {
    isCheckoutDisabled,
    checkoutDisabledReason,
  };
}
