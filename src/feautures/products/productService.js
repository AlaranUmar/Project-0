import { supabase } from "@/lib/supabaseClient";

export async function updateProducts(product) {
  const { data, error } = await supabase.rpc("update_product", {
    p_id: product.product_id,
    p_name: product.product_name,
    p_price: product.price,
    p_reorder_level: product.reorder_level,
    p_image_url: product.image_url,
  });

  if (error) throw error;
  return data;
}

export async function getTags() {
  const { data, error } = await supabase.from("tags").select("*");
  if (error) throw error;
  return data;
}

export async function restockProduct(productId, locationId, quantity) {
  const { error } = await supabase.rpc("restock_product", {
    p_product_id: productId,
    p_location_id: locationId,
    p_quantity: quantity,
  });

  if (error) throw error;
}

export async function createProduct(product) {
  try {
    const { data, error } = await supabase.rpc("create_product_with_stock", {
      p_name: product.name,
      p_price: product.price,
      p_cost: product.cost_price,
      p_category: product.category_id,
      p_reorder: product.reorder_level || 12,
      p_location: product.location_id,
      p_stock: product.initial_stock || 0,
      p_tags: product.tags || [],
    });

    if (error) throw error;
    return data[0];
  } catch (err) {
    console.error("Error creating product:", err);
    throw err;
  }
}

export async function getProducts() {
  const { data, error } = await supabase.from("products").select(`
      *,
      categories(name),
      products_tags(tags(id, name)),
      inventory(quantity, location_id)
    `);
  if (error) throw error;
  return data;
}

/**
 * TODO: Loading function / Add Tag & Category
 * Added upsert logic so you don't get errors if a tag exists.
 */
export async function createTag(name) {
  const { data, error } = await supabase
    .from("tags")
    .upsert({ name }, { onConflict: "name" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createCategory(name) {
  const { data, error } = await supabase
    .from("categories")
    .upsert({ name }, { onConflict: "name" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * TODO: Edit tag & category feature
 * Explicitly handling the inventory update and movement log.
 */

export async function updateProductImage(productId, imageUrl) {
  const { data, error } = await supabase
    .from("products")
    .update({ image_url: imageUrl, updated_at: new Date() })
    .eq("id", productId);
  if (error) throw error;
  return data;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}
