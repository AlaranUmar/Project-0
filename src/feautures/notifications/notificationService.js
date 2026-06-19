import { supabase } from "@/lib/supabaseClient";

export async function getNotifications() {
  const { data, error } = await supabase.rpc("get_notifications");

  if (error) throw error;

  return data ?? [];
}
export async function getUnreadNotificationCount() {
  const { data, error } = await supabase.rpc("get_unread_notification_count");

  if (error) throw error;

  return data ?? 0;
}

export async function markNotificationRead(notificationId) {
  const { error } = await supabase.rpc("mark_notification_read", {
    p_notification_id: notificationId,
  });

  if (error) throw error;
}

export async function markAllNotificationsRead() {
  const { error } = await supabase.rpc("mark_all_notifications_read");

  if (error) throw error;
}

export async function archiveNotification(notificationId) {
  const { error } = await supabase.rpc("archive_notification", {
    p_notification_id: notificationId,
  });

  if (error) throw error;
}

export async function getAlerts() {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}
