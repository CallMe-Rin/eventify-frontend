import { useAuth } from '@/hooks/useAuth';

/**
 * Hook to determine if checkout button should be enabled
 * Returns true if user is authenticated and has customer role
 */
export function useCheckoutButtonState() {
  const { isAuthenticated, role, isLoading } = useAuth();

  const isCheckoutDisabled =
    isLoading || !isAuthenticated || role !== 'CUSTOMER';

  const checkoutDisabledReason = (() => {
    if (isLoading) return 'Loading...';
    if (!isAuthenticated) return 'Sign in to checkout';
    if (role !== 'CUSTOMER') return 'Only customers can checkout';
    return null;
  })();

  return {
    isCheckoutDisabled,
    checkoutDisabledReason,
  };
}
