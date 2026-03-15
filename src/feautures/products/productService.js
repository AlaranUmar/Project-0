import { supabase } from "@/lib/supabaseClient";

export async function getProducts() {
  const { data, error } = await supabase.from("product_view").select("*");
  if (error) throw error;
  console.log(data);
  return data;
}
export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data;
}
export async function getLocations() {
  const { data, error } = await supabase.from("locations").select("*");
  if (error) throw error;
  return data;
}
export async function getTags() {
  const { data, error } = await supabase.from("tags").select("*");
  if (error) throw error;
  return data;
}

export async function createCategory(name) {
  const { data, error } = await supabase
    .from("categories")
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createTag(name) {
  const { data, error } = await supabase
    .from("tags")
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data;
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
