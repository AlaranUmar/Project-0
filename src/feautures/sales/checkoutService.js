import { supabase } from "@/lib/supabaseClient";

export async function checkoutCart(
  cart,
  payments,
  profile,
  locationId,
  customerId = null,
) {
  if (!cart?.length) throw new Error("Cart is empty");
  if (!payments?.length) throw new Error("Payment required");
  if (!profile?.id) throw new Error("Invalid user");
  if (!locationId) throw new Error("No location");

  const items = cart.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
  }));

  const { data, error } = await supabase.rpc("create_offline_sale", {
    p_location_id: locationId,
    p_customer_id: customerId,
    p_items: items,
    p_payments: payments,
  });

  if (error) throw error;

  return data;
}
