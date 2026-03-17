import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

Deno.serve(async (req) => {
  try {
    // ✅ Get request data
    const { email, role } = await req.json()

    if (!email || !role) {
      return new Response(JSON.stringify({ error: "Missing email or role" }), { status: 400 })
    }

    // ✅ Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // ✅ Get current user from token
    const token = req.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return new Response(JSON.stringify({ error: "No auth token" }), { status: 401 })
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid user" }), { status: 401 })
    }

    const userId = userData.user.id

    // ✅ Get creator role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404 })
    }

    const creatorRole = profile.role

    // 🔥 ROLE PERMISSION LOGIC
    const canCreateCashier =
      creatorRole === "owner" ||
      creatorRole === "admin" ||
      creatorRole === "manager"

    if (role === "cashier" && !canCreateCashier) {
      return new Response(JSON.stringify({ error: "Not allowed to create cashier" }), { status: 403 })
    }

    // ❌ Block creating higher roles for now
    if (role !== "cashier") {
      return new Response(JSON.stringify({ error: "Only cashier creation allowed for now" }), { status: 403 })
    }

    // ✅ Create user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: "temporary123", // later we improve this
      email_confirm: true,
    })

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), { status: 400 })
    }

    // ✅ Insert into profiles
    await supabaseAdmin.from("profiles").insert({
      id: newUser.user.id,
      role: "cashier",
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})