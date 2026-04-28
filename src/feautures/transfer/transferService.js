import { supabase } from "@/lib/supabaseClient";

export async function getTransfers() {
  const { data, error } = await supabase
    .from("transfers")
    .select(
      `
      *,
      from_location:locations!transfers_from_location_id_fkey(id, name),
      to_location:locations!transfers_to_location_id_fkey(id, name),
      requester:staff_details!transfers_requested_by_fkey(
        profiles(full_name)
      ),
      dispatcher:profiles!transfers_dispatched_by_fkey(full_name),
      receiver:profiles!transfers_received_by_fkey(full_name),
      approver:profiles!transfers_approved_by_fkey(full_name),
      items:transfer_items(*)
    `,
    )
    .order("requested_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    throw error;
  }
  return data;
}

export async function handle_request(branchId, items) {
  if (!branchId) {
    throw new Error("Branch ID is missing");
  }

  if (!items?.length) {
    throw new Error("No items selected");
  }

  const payload = items.map((i) => ({
    product_id: i.product_id,
    quantity: Number(i.quantity),
  }));

  console.log("RPC Payload:", {
    p_to_location_id: branchId,
    p_items: payload,
  });

  const { data, error } = await supabase.rpc("request_transfer", {
    p_to_location_id: branchId,
    p_items: payload,
  });

  if (error) {
    console.error("Supabase RPC Error:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function create_transfer({
  from_location_id,
  to_location_id,
  items,
}) {
  if (!from_location_id || !to_location_id) {
    throw new Error("Branch ID(s) missing");
  }

  if (!items?.length) {
    throw new Error("No items selected");
  }

  const payload = items.map((i) => ({
    product_id: i.product_id,
    quantity: Number(i.quantity),
  }));

  console.log("RPC Payload:", {
    p_from_location_id: from_location_id,
    p_to_location_id: to_location_id,
    p_items: payload,
  });

  const { data, error } = await supabase.rpc("create_transfer", {
    p_from_location_id: from_location_id,
    p_to_location_id: to_location_id,
    p_items: payload,
  });

  if (error) {
    console.error("Supabase RPC Error:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function approveTransfer(transferId, items, sourceBranchId) {
  const { error } = await supabase.rpc("approve_transfer", {
    p_transfer_id: transferId,
    p_approved_items: items,
    p_source_location: sourceBranchId,
  });
  if (error) throw error;
}

export async function rejectTransfer(transferId) {
  const { error } = await supabase.rpc("reject_transfer", {
    p_transfer_id: transferId,
  });
  if (error) throw error;
}

export async function handle_dispatch(transferId) {
  const { error } = await supabase.rpc("dispatch_transfer", {
    p_transfer_id: transferId,
  });
  if (error) throw error;
}

export async function handle_receive(transferId) {
  const { error } = await supabase.rpc("receive_transfer", {
    p_transfer_id: transferId,
  });
  if (error) throw error;
}
