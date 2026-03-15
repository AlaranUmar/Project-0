import { supabase } from "@/lib/supabaseClient";

export async function getTransfers() {
  const { data, error } = await supabase.from("transfers_overview").select("*");
  if (error) console.error(error);
  console.log(data);
  return data;
}

export async function approveTransfer(transferId, items = [], sourceBranchId) {
  const formattedItems = items.map((i) => ({
    product_id: i.product_id,
    approved: i.approved,
    quantity: i.quantity,
  }));

  const { error } = await supabase.rpc("approve_transfer", {
    p_transfer_id: transferId,
    p_approved_items: formattedItems,
    p_source_location: sourceBranchId,
  });

  if (error) {
    console.error("Approve transfer error:", error);
    throw error; // Throw so the UI can handle the error
  }
}

export async function handle_dispatch(transferId) {
  const { error } = await supabase.rpc("dispatch_transfer", {
    p_transfer_id: transferId,
  });
  if (error) {
    console.error("dispatch transfer error:", error);
    throw error; // Throw so the UI can handle the error
  }
}

export async function handle_receive(transferId) {
  const { error } = await supabase.rpc("receive_transfer", {
    p_transfer_id: transferId,
  });
  if (error) {
    console.error("Receive transfer error:", error);
    throw error; // Throw so the UI can handle the error
  }
}
export async function handle_request(branchId, items) {
  const { error } = await supabase.rpc("request_transfer", {
    p_to_location_id: branchId,
    p_items: items,
  });
  if (error) {
    console.error("Request transfer error:", error);
    throw error; // Throw so the UI can handle the error
  }
}
