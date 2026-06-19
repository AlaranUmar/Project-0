import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useNotificationRealtime(onNotification) {
  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        onNotification,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNotification]);
}
