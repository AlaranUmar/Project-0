/* eslint-disable react-refresh/only-export-components */
import { supabase } from "@/lib/supabaseClient";
import { getUserProfile } from "@/feautures/users/profileService";
import { logoutUser } from "@/feautures/auth/authService";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      setSession(session);
      setUser(session?.user ?? null);

      setLoading(false);
    }
    initAuth();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          setRole(null);
        }
        setLoading(false);
      },
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    async function getRole() {
      if (!user) {
        return;
      }
      try {
        setLoading(true);
        const profile = await getUserProfile(user.id);

        if (profile.user_role === "customer") {
          await logoutUser();
          alert("Customers cannot access this dashboard");
          setRole(null);
          return;
        }
        setRole(profile.user_role);
        setProfile(profile);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    getRole();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, session, role, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
