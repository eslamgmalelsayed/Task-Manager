"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Clean URL from fragments (removes access_token from URL)
  const cleanUrl = () => {
    if (typeof window !== "undefined" && window.location.hash) {
      const url = new URL(window.location.href);
      url.hash = "";
      window.history.replaceState({}, document.title, url.toString());
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
        } else {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          // Clean URL after getting session
          cleanUrl();
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession?.user?.email);

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      // Clean URL on auth state changes
      cleanUrl();

      // Handle different auth events
      switch (event) {
        case "SIGNED_IN":
          if (currentSession?.user) {
            // Only redirect if we're on auth pages, but not password reset pages
            const currentPath = window.location.pathname;
            if (
              currentPath.includes("/login") ||
              currentPath.includes("/register")
            ) {
              router.push("/");
            }
            // Don't redirect if user is on forgot-password or reset-password pages
            // These pages handle their own navigation
          }
          break;
        case "SIGNED_OUT":
          router.push("/login");
          break;
        case "TOKEN_REFRESHED":
          console.log("Token refreshed");
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }

      // Clear any stored data
      localStorage.removeItem("registrationEmail");

      // Clean URL
      cleanUrl();

      // Redirect to login after signout
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
