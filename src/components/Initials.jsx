import React from "react";

function Initials({ name }) {
  return (
    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
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
