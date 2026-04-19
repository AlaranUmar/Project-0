// import React, { useEffect, useState, useMemo } from "react";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   getNotifications,
//   markNotificationRead,
//   markAllNotificationsRead,
// } from "@/feautures/notifications/notificationService";

// export default function OwnerNotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [search, setSearch] = useState("");

//   const fetchNotifications = async () => {
//     const data = await getNotifications();
//     setNotifications(data || []);
//   };

//   useEffect(() => {
//     fetchNotifications();

//     const interval = setInterval(fetchNotifications, 15000);

//     return () => clearInterval(interval);
//   }, []);

//   const stats = useMemo(
//     () => ({
//       total: notifications.length,
//       unread: notifications.filter((n) => !n.read).length,
//       transfers: notifications.filter((n) => n.type === "transfer").length,
//       stock: notifications.filter((n) => n.type === "stock").length,
//     }),
//     [notifications],
//   );

//   const filtered = useMemo(
//     () =>
//       notifications.filter((n) =>
//         n.message.toLowerCase().includes(search.toLowerCase()),
//       ),
//     [notifications, search],
//   );

//   const handleRead = async (id) => {
//     await markNotificationRead(id);
//     fetchNotifications();
//   };

//   const handleMarkAll = async () => {
//     await markAllNotificationsRead();
//     fetchNotifications();
//   };

//   return (
//     <div className="p-2 space-y-4">
//       {/* STATS */}
//       <div className="grid gap-2 md:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
//         {Object.entries(stats).map(([label, value]) => (
//           <Card key={label}>
//             <CardHeader>
//               <CardTitle className="text-sm capitalize">{label}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-lg font-semibold">{value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* NOTIFICATIONS */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>Notifications</CardTitle>

//           <Button size="sm" onClick={handleMarkAll}>
//             Mark All Read
//           </Button>
//         </CardHeader>

//         <CardContent>
//           <Input
//             placeholder="Search notifications..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="mb-4"
//           />

//           <div className="space-y-2">
//             {filtered.map((n) => (
//               <div
//                 key={n.id}
//                 className={`border rounded-lg p-3 flex justify-between items-center
//                 ${!n.read ? "bg-muted/40" : ""}`}
//               >
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium">{n.message}</p>

//                   <p className="text-xs text-muted-foreground">
//                     {new Date(n.created_at).toLocaleString()}
//                   </p>
//                 </div>

//                 {!n.read && (
//                   <Button size="sm" onClick={() => handleRead(n.id)}>
//                     Mark Read
//                   </Button>
//                 )}
//               </div>
//             ))}

//             {filtered.length === 0 && (
//               <p className="text-sm text-muted-foreground text-center py-6">
//                 No notifications found
//               </p>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import React from "react";

function OwnerNotificationsPage() {
  return <div>OwnerNotificationsPage</div>;
}

export default OwnerNotificationsPage;
