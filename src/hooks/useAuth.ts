import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "editor" | "viewer";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const hasResolvedInitialSession = useRef(false);

  const fetchRole = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    if (!error && data) {
      setRole(data.role as AppRole);
    } else {
      setRole(null);
    }
  }, []);

  const applySession = useCallback((nextSession: Session | null, deferRoleFetch = false) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);

    if (!nextSession?.user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const loadRole = () => {
      void fetchRole(nextSession.user.id).finally(() => {
        setLoading(false);
      });
    };

    setLoading(true);

    if (deferRoleFetch) {
      window.setTimeout(loadRole, 0);
      return;
    }

    loadRole();
  }, [fetchRole]);

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        hasResolvedInitialSession.current = true;

        if (!isMounted) {
          return;
        }

        applySession(nextSession, event !== "INITIAL_SESSION");
      }
    );

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!isMounted || hasResolvedInitialSession.current) {
        return;
      }

      hasResolvedInitialSession.current = true;
      applySession(initialSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  const isAdmin = role === "admin";
  const canEdit = role === "admin" || role === "editor";

  return { user, session, role, loading, signUp, signIn, signOut, isAdmin, canEdit, fetchRole };
}
