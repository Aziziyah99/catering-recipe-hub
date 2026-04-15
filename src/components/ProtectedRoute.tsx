import { useState, useEffect } from "react";
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

  // Track whether we've ever finished loading the role
  const [roleEverResolved, setRoleEverResolved] = useState(false);

  useEffect(() => {
    if (!roleLoading && user && role !== null) {
      setRoleEverResolved(true);
    }
  }, [roleLoading, user, role]);

  const needsAdmin = requiredRole === "admin";
  const waitingForRole = needsAdmin && !!user && !roleEverResolved && (roleLoading || role === null);

  // ⏳ Wait until everything is fully ready
  if (loading || waitingForRole) {
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
    needsAdmin &&
    role !== "admin"
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

