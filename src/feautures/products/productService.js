import { supabase } from "@/lib/supabaseClient";

/* ================================================================= */
/* CORE PRODUCT OPERATIONS */
/* ================================================================= */

/**
 * Creates a brand new product profile along with its initial inventory balance distribution.
 */
export async function createProduct(product) {
  try {
    const { data, error } = await supabase.rpc("create_product_with_stock", {
      p_name: product.name,
      p_price: product.price,
      p_cost: product.cost_price,
      p_category: product.category_id,
      p_reorder: product.reorder_level ?? 12,
      p_location: product.location_id,
      p_stock: product.initial_stock ?? 0,
      p_tags: product.tags ?? [],
    });

    if (error) throw error;
    return data?.[0] ?? data;
  } catch (err) {
    console.error(
      "Critical error inside createProduct registry execution:",
      err,
    );
    throw err;
  }
}

/**
 * Retrieves a summary listing of all registered products including baseline metrics.
 */
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
 * Fetches data for a specific product by its unique identifier,
 * resolving category metadata and nested warehouse location inventory levels.
 */
export async function getProductById(productId) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        name
      ),
      inventory (
        id,
        quantity,
        location_id,
        locations (
          id,
          name,
          type,
          address
        )
      )
    `,
    )
    .eq("id", productId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Updates primary configurations and properties of an existing product profile.
 */
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

/**
 * Explicitly updates the asset image reference pointing to storage hosts.
 */
export async function updateProductImage(productId, imageUrl) {
  const { data, error } = await supabase
    .from("products")
    .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ================================================================= */
/* INVENTORY MANAGEMENT & MOVEMENTS */
/* ================================================================= */

/**
 * Triggers safe allocation changes to update specific location quantities
 * and log verifiable ledger movements automatically inside the database.
 */
export async function restockProduct(productId, locationId, quantity) {
  const { data, error } = await supabase.rpc("restock_product", {
    p_product_id: productId,
    p_location_id: locationId,
    p_quantity: quantity,
  });

  if (error) throw error;
  return data;
}

/**
 * Returns historical tracking movements of items sliding across spatial bounds,
 * locations, adjustments, or write-off sequences.
 */
export async function getProductMovements(productId) {
  const { data, error } = await supabase
    .from("stock_movements")
    .select(
      `
      id,
      quantity_change,
      notes,
      created_at,
      locations (
        name
      )
    `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

/* ================================================================= */
/* OPERATIONAL PERFORMANCE & SALES */
/* ================================================================= */

/**
 * Pulls recent point-of-sale operational records linked directly to this asset.
 */
export async function getProductSales(productId) {
  const { data, error } = await supabase
    .from("sale_items")
    .select(
      `
      id,
      quantity,
      subtotal,
      sale_id,
      created_at
    `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

/* ================================================================= */
/* TAXONOMY: CATEGORIES & TAGS */
/* ================================================================= */

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

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

export async function getTags() {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createTag(name) {
  const { data, error } = await supabase
    .from("tags")
    .upsert({ name }, { onConflict: "name" })
    .select()
    .single();

  if (error) throw error;
  return data;
}
