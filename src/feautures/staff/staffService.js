import { supabase } from "@/lib/supabaseClient";

export async function getStaffs() {
  const { data, error } = await supabase.from("staff_summary_view").select("*");
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
export async function getStaffDetails(staffId = null) {
  let query = supabase
    .from("staff_summary_view")
    .select(
      "id, full_name, email, role, salary, branch_name, is_active, hired_at",
    );

  if (staffId) {
    query = query.eq("id", staffId).single();
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
