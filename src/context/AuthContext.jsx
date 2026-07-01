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

  // 1. Initialize session on mount and listen to auth changes
  useEffect(() => {
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

  // 2. Fetch profile data and handle authorization
  useEffect(() => {
    let isMounted = true;

    async function getRole() {
      // If there is no user logged in, clear profile states and exit
      if (!user?.id) {
        if (isMounted) {
          setRole(null);
          setProfile(null);
        }
        return;
      }

      // Guard: Skip API call if profile is already loaded for this exact user
      if (profile?.id === user.id) return;

      try {
        setLoading(true);
        const userProfile = await getUserProfile(user.id);

        if (!isMounted) return;

        // Security Guard: Prevent customers from accessing dashboard areas
        if (userProfile?.user_role === "customer") {
          setRole(null);
          setProfile(null);
          toast.error("Access Denied: Customers cannot access this dashboard.");
          await logoutUser();
          return;
        }

        setRole(userProfile?.user_role);
        setProfile(userProfile);
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to load user profile");
          console.error(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    getRole();

    return () => {
      isMounted = false;
    };
    // Track user.id and profile.id primitives to prevent re-running on reference updates
  }, [user?.id, profile?.id]);

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
