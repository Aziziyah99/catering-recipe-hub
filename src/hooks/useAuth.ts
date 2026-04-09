import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthChangeEvent, User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "editor" | "viewer";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const isMountedRef = useRef(true);
  const lastUserIdRef = useRef<string | null>(null);
  const authReadyRef = useRef(false);
  const roleRequestRef = useRef(0);

  const fetchRole = useCallback(async (userId: string) => {
    const requestId = ++roleRequestRef.current;
    setRoleLoading(true);

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!isMountedRef.current || requestId !== roleRequestRef.current || lastUserIdRef.current !== userId) {
      return;
    }

    if (!error && data?.role) {
      setRole(data.role as AppRole);
    } else {
      setRole(null);
    }

    setRoleLoading(false);
  }, []);

  const applySession = useCallback((
    nextSession: Session | null,
    options: { forceRoleRefresh?: boolean; event?: AuthChangeEvent } = {},
  ) => {
    if (!isMountedRef.current) {
      return;
    }

    const { forceRoleRefresh = false, event } = options;
    const nextUser = nextSession?.user ?? null;
    const nextUserId = nextUser?.id ?? null;
    const previousUserId = lastUserIdRef.current;
    const userChanged = previousUserId !== nextUserId;

    if (!nextUserId) {
      const shouldIgnoreTransientEmptySession = event !== "SIGNED_OUT" && !!previousUserId;

      if (shouldIgnoreTransientEmptySession) {
        return;
      }

      lastUserIdRef.current = null;
      setSession(null);
      setUser(null);
      roleRequestRef.current += 1;
      setRole(null);
      setRoleLoading(false);
      return;
    }

    lastUserIdRef.current = nextUserId;
    setSession(nextSession);
    setUser(nextUser);

    if (userChanged || forceRoleRefresh) {
      void fetchRole(nextUserId);
    }
  }, [fetchRole]);

  useEffect(() => {
    isMountedRef.current = true;
    authReadyRef.current = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isMountedRef.current) {
        return;
      }

      applySession(nextSession, {
        forceRoleRefresh: event === "SIGNED_IN" || event === "USER_UPDATED",
        event,
      });

      if (event !== "INITIAL_SESSION") {
        authReadyRef.current = true;
        setLoading(false);
      }
    });

    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();

      if (!isMountedRef.current) {
        return;
      }

      const currentUserId = lastUserIdRef.current;
      const initialUserId = initialSession?.user?.id ?? null;
      const shouldHydrateSession = !authReadyRef.current || (!!initialUserId && !currentUserId);

      if (shouldHydrateSession) {
        applySession(initialSession, { event: "INITIAL_SESSION" });
      }

      authReadyRef.current = true;
      setLoading(false);
    };

    void initializeAuth();

    return () => {
      isMountedRef.current = false;
      authReadyRef.current = false;
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      applySession(data.session ?? null, { forceRoleRefresh: true, event: "SIGNED_IN" });
      setLoading(false);
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      applySession(null, { event: "SIGNED_OUT" });
      setLoading(false);
    }
  };

  const authReady = !loading && (!user || !roleLoading);
  const isAdmin = role === "admin";
  const canEdit = role === "admin" || role === "editor";

  return { user, session, role, loading, roleLoading, authReady, signUp, signIn, signOut, isAdmin, canEdit, fetchRole };
}
