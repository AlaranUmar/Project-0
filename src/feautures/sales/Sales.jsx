import { supabase } from "@/lib/supabaseClient";

export async function getSales() {
  const { data, error } = await supabase
    .from("sales_with_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
// [
//   {
//     id: "9ea43139-cfad-48d0-8388-f5bc8e27d395",
//     created_at: "2026-03-11T12:32:24.075067+00:00",
//     created_by: "858d3527-8469-498b-8607-130d9c0976ad",
//     location_id: "2c88ca07-89f8-44f9-8219-b0e446d9a861",
//     transaction_type: "walk_in",
//     customer_id: null,
//     amount: 75000,
//     payment_method: "cash",
//   },
//   {
//     id: "216d87fd-162f-4dbc-a262-a48e5f884a31",
//     created_at: "2026-03-11T12:32:42.080819+00:00",
//     created_by: "858d3527-8469-498b-8607-130d9c0976ad",
//     location_id: "2c88ca07-89f8-44f9-8219-b0e446d9a861",
//     transaction_type: "walk_in",
//     customer_id: null,
//     amount: 25000,
//     payment_method: "cash",
//   },
//   {
//     id: "5d6ce48f-a336-491e-bef4-51e5ca959436",
//     created_at: "2026-03-11T12:50:02.02441+00:00",
//     created_by: "858d3527-8469-498b-8607-130d9c0976ad",
//     location_id: "2c88ca07-89f8-44f9-8219-b0e446d9a861",
//     transaction_type: "walk_in",
//     customer_id: null,
//     amount: 25000,
//     payment_method: "cash",
//   },
//   {
//     id: "e788846d-fec6-4a66-8e13-0c2334b36e56",
//     created_at: "2026-03-11T12:54:21.466189+00:00",
//     created_by: "858d3527-8469-498b-8607-130d9c0976ad",
//     location_id: "2c88ca07-89f8-44f9-8219-b0e446d9a861",
//     transaction_type: "walk_in",
//     customer_id: null,
//     amount: 25000,
//     payment_method: "cash",
//   },
//   {
//     id: "0cf1caae-3b1c-4723-96ff-29abd6cceb59",
//     created_at: "2026-03-11T12:54:53.079742+00:00",
//     created_by: "858d3527-8469-498b-8607-130d9c0976ad",
//     location_id: "2c88ca07-89f8-44f9-8219-b0e446d9a861",
//     transaction_type: "walk_in",
//     customer_id: null,
//     amount: 25000,
//     payment_method: "cash",
//   },
//   {
//     id: "8601bef5-d17e-4a0f-8cbc-72659a42bc45",
//     created_at: "2026-03-11T12:57:29.356762+00:00",
//     created_by: "858d3527-8469-498b-8607-130d9c0976ad",
//     location_id: "2c88ca07-89f8-44f9-8219-b0e446d9a861",
//     transaction_type: "walk_in",
//     customer_id: null,
//     amount: 25000,
//     payment_method: "cash",
//   },
//   {
//     id: "b4b8e63e-2b0c-4b15-b582-a663ca759b87",
//     created_at: "2026-03-11T13:04:00.210039+00:00",
//     created_by: "858d3527-8469-498b-8607-130d9c0976ad",
//     location_id: "2c88ca07-89f8-44f9-8219-b0e446d9a861",
//     transaction_type: "walk_in",
//     customer_id: null,
//     amount: 10,
//     payment_method: "cash",
//   },
//   {
//     id: "f5ba328f-332a-4d8a-9659-4fbfcc0cc2b2",
//     created_at: "2026-03-11T13:22:26.158641+00:00",
//     created_by: "858d3527-8469-498b-8607-130d9c0976ad",
//     location_id: "2c88ca07-89f8-44f9-8219-b0e446d9a861",
//     transaction_type: "walk_in",
//     customer_id: null,
//     amount: 12000,
//     payment_method: "cash",
//   },
// ];
// these are sample data
// function to sum total sale
export function sumSales(sales) {
  return sales.reduce((total, sale) => total + sale.amount, 0);
}
