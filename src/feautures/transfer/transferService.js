import { supabase } from "@/lib/supabaseClient";

export async function getTransfers() {
  const { data, error } = await supabase.from("transfers_overview").select("*");
  if (error) console.error(error);
  return data;
}

export async function approveTransfer(transferId, items) {
  const { error } = await supabase.rpc("approve_transfer", {
    p_transfer_id: transferId,
    p_approved_items: JSON.stringify(items),
  });
  if (error) console.error(error);
}

export async function handle_dispatch(transferId) {
  const { error } = await supabase.rpc("dispatch_transfer", {
    p_transfer_id: transferId,
  });
  if (error) console.error(error);
}

export async function handle_receive(transferId) {
  const { error } = await supabase.rpc("receive_transfer", {
    p_transfer_id: transferId,
  });
  if (error) console.error(error);
}
