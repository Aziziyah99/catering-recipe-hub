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
  const waitingForAdminRole = requiredRole === "admin" && !!user && roleLoading;

  if (loading || waitingForAdminRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole === "admin" && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
