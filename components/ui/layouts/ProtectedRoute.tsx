"use client";

import { useAuth } from "@/redux/customHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const { isAuthenticated, isHydrated, user, getRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for hydration to complete
    if (!isHydrated) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(fallbackRoute);
      return;
    }

    // Check role-based access
    if (
      requiredRole &&
      getRole()?.toLowerCase() !== requiredRole.toLowerCase()
    ) {
      // Redirect unauthorized users to appropriate dashboard
      const userRole = getRole()?.toLowerCase();
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "user") {
        router.push("/user");
      } else {
        router.push("/");
      }
      return;
    }
  }, [
    isAuthenticated,
    isHydrated,
    user,
    requiredRole,
    requireAuth,
    router,
    getRole,
    fallbackRoute,
  ]);

  // Show loading during hydration
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4157FE]"></div>
      </div>
    );
  }

  // Don't render if user doesn't have access
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requiredRole && getRole()?.toLowerCase() !== requiredRole.toLowerCase()) {
    return null;
  }

  return <>{children}</>;
}
