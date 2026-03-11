import { supabase } from "@/lib/supabaseClient";

export async function loginUser(email, password) {
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
  if (error) throw error;
  return data;  
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
