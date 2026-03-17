import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient"; // make sure you have this

export default function AddStaffModal({ onStaffAdded }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("cashier");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddStaff = async () => {
    if (!email) {
      setMessage("Please enter an email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // ✅ get logged in user session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in");
      }

      // ✅ call edge function
      const res = await fetch(
        "https://lcfgfizlwkeyphpjzoxr.supabase.co/functions/v1/invite-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`, // 🔥 VERY IMPORTANT
          },
          body: JSON.stringify({
            email,
            role, // should be "cashier"
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage("Staff invited successfully");

      setEmail("");
      setRole("cashier");

      if (onStaffAdded) {
        onStaffAdded();
      }
    } catch (err) {
      setMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add Staff</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Input
            placeholder="Staff Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="cashier">Cashier</option>
          </select>

          <Button onClick={handleAddStaff} disabled={loading}>
            {loading ? "Sending..." : "Invite Staff"}
          </Button>
        </div>

        {message && (
          <p className="text-sm text-center text-gray-600">{message}</p>
        )}
      </CardContent>
    </Card>
  );
}
