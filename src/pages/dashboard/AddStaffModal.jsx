import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddStaffModal({ onStaffAdded }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
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
      const res = await fetch("/api/invite-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage(data.message);

      setEmail("");
      setRole("staff");

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
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
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
