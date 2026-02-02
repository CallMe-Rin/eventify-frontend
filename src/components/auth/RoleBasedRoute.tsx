import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "@/hooks/useAuthContext";
import type { AppRole } from "@/hooks/useAuth";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: AppRole[];
  fallbackPath?: string;
}

/**
 * RoleBasedRoute component for protecting routes based on user role
 *
 * @param children - The component to render if access is allowed
 * @param allowedRoles - Array of roles that can access this route
 * @param fallbackPath - Path to redirect to if user doesn't have required role (default: "/login")
 */
export function RoleBasedRoute({
  children,
  allowedRoles,
  fallbackPath = "/login",
}: RoleBasedRouteProps) {
  const { isAuthenticated, role, isLoading } = useAuthContext();
  const location = useLocation();

  // Show nothing while loading auth state
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect to login and save the intended location
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // If authenticated but role not allowed, redirect to fallback
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // User has permission, render children
  return <>{children}</>;
}
