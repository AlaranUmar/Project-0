import React from "react";

function Initials({ name }) {
  return (
    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
      {getInitials(name)}
    </div>
  );
}

export default Initials;

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
