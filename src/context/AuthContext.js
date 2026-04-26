"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          console.log('AuthContext: Session initialized', !!session);
          setSession(session);
          setUser(session?.user ?? null);
          setInitialized(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initAuth();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      console.log('AuthContext: Auth state change', event);
      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setSession(session);
        setUser(session?.user ?? null);
      } else if (event === "INITIALIZATION_COMPLETE") {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    setUser(null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = useMemo(() => ({ user, session, loading, initialized, signIn, signOut }), [user, session, loading, initialized]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      loading: true,
      initialized: false,
      signIn: async () => {},
      signOut: async () => {},
    };
  }
  return context;
}

export function useRequireAuth(redirectTo = "/login") {
  const { user, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, initialized, router, redirectTo]);

  if (loading || !initialized) {
    return null;
  }

  return user;
}
