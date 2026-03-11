import { supabase } from "@/lib/supabaseClient";

/**
 * Checkout cart using Supabase
 * Automation: The database trigger 'after_sale_item_insert' now handles stock_movements.
 */
export async function checkoutCart(
  cart,
  profile,
  locationId,
  customerId = null,
) {
  if (!cart?.length) throw new Error("Cart is empty");
  if (!profile?.id) throw new Error("Invalid user");
  if (!locationId) throw new Error("Location not set");

  // 1. Create the Sale record
  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({
      created_by: profile.id,
      location_id: locationId,
      amount: totalAmount,
      customer_id: customerId,
    })
    .select()
    .single();

  if (saleError) throw saleError;

  const saleItemsPayload = cart.map((item) => ({
    sale_id: sale.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.quantity * item.price,
  }));

  const { error: saleItemsError } = await supabase
    .from("sale_items")
    .insert(saleItemsPayload);

  if (saleItemsError) {
    // Note: In a production app, you might want to delete the 'sale' record here
    // if the items fail, or use a Database RPC for atomic transactions.
    throw saleItemsError;
  }

  return sale;
}
