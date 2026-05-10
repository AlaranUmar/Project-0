/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserProfile } from "@/feautures/users/profileService";
import { logoutUser } from "@/feautures/auth/authService";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize session on mount
    async function initAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        const currentSession = data.session;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    // Listen for auth changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (!session) {
          setRole(null);
          setProfile(null);
          setLoading(false);
        }
      },
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    async function getRole() {
      if (!user) return;

      try {
        setLoading(true);
        const userProfile = await getUserProfile(user.id);

        // Security Guard: Prevent customers from accessing admin/dashboard areas
        if (userProfile?.user_role === "customer") {
          await logoutUser();
          setRole(null);
          setProfile(null);
          toast.error("Access Denied: Customers cannot access this dashboard.");
          return;
        }

        setRole(userProfile?.user_role);
        setProfile(userProfile);
      } catch (error) {
        toast.error("Failed to load user profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getRole();
  }, [user]);

  const value = {
    user,
    session,
    role,
    loading,
    profile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
