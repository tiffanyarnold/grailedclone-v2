"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type UserRole = "admin" | "seller" | "buyer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Keep backward compat alias
export type User = AuthUser;

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  loginModalOpen: boolean;
  loginModalMode: "login" | "signup";
  openLoginModal: (mode?: "login" | "signup") => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  isLoading: true,
  loginModalOpen: false,
  loginModalMode: "login",
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<"login" | "signup">("login");

  const openLoginModal = (mode: "login" | "signup" = "login") => {
    setLoginModalMode(mode);
    setLoginModalOpen(true);
  };
  const closeLoginModal = () => setLoginModalOpen(false);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, role")
      .eq("id", userId)
      .single();

    if (data) {
      setUser({ id: data.id, name: data.name, email: data.email, role: data.role as UserRole });
      return;
    }

    // Profile row missing (e.g. DB trigger failed on first signup).
    // Recover by fetching the auth user's metadata and upserting a profile row.
    if (error?.code === "PGRST116") {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const fallbackName = (authUser.user_metadata?.name as string | undefined) || authUser.email || "User";
        const fallbackEmail = authUser.email || "";
        const { data: upserted } = await supabase
          .from("profiles")
          .upsert({ id: userId, name: fallbackName, email: fallbackEmail, role: "buyer" })
          .select("id, name, email, role")
          .single();
        if (upserted) {
          setUser({ id: upserted.id, name: upserted.name, email: upserted.email, role: upserted.role as UserRole });
        }
      }
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Hold isLoading=true while we fetch the profile so pages that check
        // `!authLoading && !user` don't flash-redirect in the gap between the
        // SIGNED_IN event firing and the profile load completing.
        setIsLoading(true);
        loadProfile(session.user.id).finally(() => setIsLoading(false));
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: "buyer" } },
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // Always send users back to the home page on logout
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, loginModalOpen, loginModalMode, openLoginModal, closeLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
