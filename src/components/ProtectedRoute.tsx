import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import type { AppRole } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
  requiredRole?: AppRole;
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, role, loading, roleLoading } = useAuthContext();

  const waitingForAdminRole =
    requiredRole === "admin" &&
    !!user &&
    roleLoading;

  // ⏳ Wait until everything is fully ready
  if (loading || waitingForAdminRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 🚫 Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // 🚫 Not admin (ONLY after role is confirmed)
  if (
    requiredRole === "admin" &&
    role !== "admin"
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

