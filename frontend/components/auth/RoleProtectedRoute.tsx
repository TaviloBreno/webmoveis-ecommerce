"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<"admin" | "employee" | "customer">;
  fallbackUrl?: string;
}

export default function RoleProtectedRoute({ 
  children, 
  allowedRoles,
  fallbackUrl = "/perfil"
}: RoleProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.push(fallbackUrl);
    }
  }, [isAuthenticated, user, allowedRoles, fallbackUrl, router]);

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
