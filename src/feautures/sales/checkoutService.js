import { supabase } from "@/lib/supabaseClient";

export async function checkoutCart(
  cart,
  profile,
  locationId,
  customerId = null,
) {
  if (!cart?.length) throw new Error("Cart is empty");
  if (!profile?.id) throw new Error("Invalid user");
  if (!locationId) throw new Error("Location not set");

  const items = cart.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { data, error } = await supabase.rpc("create_offline_sale", {
    p_location_id: locationId,
    p_payment_method: "cash",
    p_items: JSON.parse(JSON.stringify(items)), // 🔥 FIX
    p_customer_id: customerId,
  });

  if (error) throw error;

  return data;
}
