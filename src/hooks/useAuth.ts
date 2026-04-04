import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "editor" | "viewer";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const isMountedRef = useRef(true);
  const lastUserIdRef = useRef<string | null>(null);

  const fetchRole = useCallback(async (userId: string) => {
    setRoleLoading(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!isMountedRef.current) {
      return;
    }

    if (!error && data?.role) {
      setRole(data.role as AppRole);
    } else {
      setRole(null);
    }
    setRoleLoading(false);
  }, []);

  const syncSession = useCallback((nextSession: Session | null) => {
    const nextUser = nextSession?.user ?? null;
    const nextUserId = nextUser?.id ?? null;
    const userChanged = lastUserIdRef.current !== nextUserId;

    lastUserIdRef.current = nextUserId;
    setSession(nextSession);
    setUser(nextUser);

    if (!nextUserId) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    if (userChanged) {
      void fetchRole(nextUserId);
    }
  }, [fetchRole]);

  useEffect(() => {
    isMountedRef.current = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();

      if (!isMountedRef.current) {
        return;
      }

      syncSession(initialSession);
      setLoading(false);

      const authListener = supabase.auth.onAuthStateChange((event, nextSession) => {
        if (!isMountedRef.current || event === "INITIAL_SESSION") {
          return;
        }

        syncSession(nextSession);
        setLoading(false);
      });

      subscription = authListener.data.subscription;
    };

    void initializeAuth();

    return () => {
      isMountedRef.current = false;
      subscription?.unsubscribe();
    };
  }, [syncSession]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error && data.session) {
      lastUserIdRef.current = data.session.user.id;
      setSession(data.session);
      setUser(data.session.user);
      setLoading(false);
      void fetchRole(data.session.user.id);
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    lastUserIdRef.current = null;
    setUser(null);
    setSession(null);
    setRole(null);
    setRoleLoading(false);
    setLoading(false);
  };

  const isAdmin = role === "admin";
  const canEdit = role === "admin" || role === "editor";

  return { user, session, role, loading, roleLoading, signUp, signIn, signOut, isAdmin, canEdit, fetchRole };
}
