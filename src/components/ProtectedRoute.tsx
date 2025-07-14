"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true, redirectTo = "/login" }) => {
  const { isAuthenticated, loading, user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && (!isAuthenticated || !user || !profile)) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated && user && profile) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, loading, router, requireAuth, redirectTo, user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && (!isAuthenticated || !user || !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  if (!requireAuth && isAuthenticated && user && profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3A6D] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

