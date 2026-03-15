import { supabase } from "@/lib/supabaseClient";

export async function getStaffs() {
  const { data, error } = await supabase.from("owner_staff_view").select("*");
  if (error) throw error;
  return data;
}
export async function getStaff(userId) {
  const { data, error } = await supabase
    .from("staff_details")
    .select("*")
    .eq("profile_id", userId)
    .single();
  if (error) throw error;
  return data;
}
