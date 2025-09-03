"use client";

import { useAuth } from "@/redux/customHooks";
import { selectAuth } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
  requireAuth?: boolean;
  fallbackRoute?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
  fallbackRoute = "/signin",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, getRole, isHydrated } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Wait for hydration before making routing decisions
    if (!isHydrated) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      setIsRedirecting(true);
      router.replace(fallbackRoute);
      return;
    }

    // Check role requirement
    if (requiredRole && user) {
      const userRole = user.role?.toLowerCase();
      const requiredRoleLower = requiredRole.toLowerCase();

      if (userRole !== requiredRoleLower) {
        setIsRedirecting(true);
        // Redirect to appropriate dashboard based on user's actual role
        const redirectRoute =
          userRole === "admin" ? "/admin" : userRole === "user" ? "/user" : "/";
        router.replace(redirectRoute);
        return;
      }
    }

    setIsRedirecting(false);
  }, [
    isHydrated,
    isAuthenticated,
    user,
    requiredRole,
    requireAuth,
    router,
    fallbackRoute,
  ]);

  // Show loading while hydrating or redirecting
  if (!isHydrated || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4157FE]"></div>
      </div>
    );
  }

  // Don't render if user doesn't have access
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (
    requiredRole &&
    user?.role?.toLowerCase() !== requiredRole.toLowerCase()
  ) {
    return null;
  }

  return <>{children}</>;
}
