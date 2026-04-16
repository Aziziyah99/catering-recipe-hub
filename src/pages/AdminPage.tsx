import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AppRole } from "@/hooks/useAuth";

interface UserWithRole {
  user_id: string;
  email: string;
  role: AppRole;
  role_id: string;
}

const AdminPage = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, loading: authLoading, roleLoading } = useAuthContext();
  const { toast } = useToast();

  const fetchedRef = useRef(false);

  const fetchUsers = useCallback(async () => {
    if (!currentUser?.id) {
      return;
    }

    setLoading(true);

    // Use security-definer function to get emails from auth.users
    const { data, error } = await supabase.rpc("get_user_roles_with_email");

    if (error) {
      toast({ title: "Failed to load users", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const mapped: UserWithRole[] = (data || []).map((r: any) => ({
      user_id: r.user_id,
      email: r.email || r.user_id,
      role: r.role as AppRole,
      role_id: r.id,
    }));

    setUsers(mapped);
    setLoading(false);
  }, [currentUser, toast]);

  useEffect(() => {
    if (authLoading || !currentUser?.id || fetchedRef.current) {
      return;
    }

    fetchedRef.current = true;
    fetchUsers();
  }, [authLoading, currentUser?.id, fetchUsers]);

  const updateRole = async (roleId: string, userId: string, newRole: AppRole) => {
    if (userId === currentUser?.id && newRole !== "admin") {
      toast({ title: "Cannot change your own role", description: "You can't remove your own admin access.", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("id", roleId);

    if (error) {
      toast({ title: "Failed to update role", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated" });
      fetchUsers();
    }
  };

  const roleBadgeColor = (role: AppRole) => {
    switch (role) {
      case "admin": return "destructive";
      case "editor": return "default";
      case "viewer": return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-3 px-4 py-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage user access and roles
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              User Roles
            </CardTitle>
            <CardDescription>
              Admin — full access &amp; user management · Editor — add/edit recipes &amp; inventory · Viewer — read only
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No users found.</p>
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <div
                    key={u.role_id}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {u.email[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">
                          {u.email}
                          {u.user_id === currentUser?.id && (
                            <Badge variant="outline" className="ml-2">You</Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{u.user_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={roleBadgeColor(u.role)}>{u.role}</Badge>
                      {u.user_id !== currentUser?.id && (
                        <Select
                          value={u.role}
                          onValueChange={(val) => updateRole(u.role_id, u.user_id, val as AppRole)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPage;
