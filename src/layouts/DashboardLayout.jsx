import AppSidebar from "@/components/ui/AppSidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/feautures/auth/authService";
import { Bell, DoorClosedLocked } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  async function handleLogout() {
    await logoutUser();
  }
  const { user, role } = useAuth();
  const [page, setPage] = useState(null);
  return (
    <SidebarProvider>
      <AppSidebar username={user.email} role={role} setPage={setPage} />
      <main className="flex flex-col w-full">
        <header className="flex h-16 items-center justify-between border-b px-4 sticky top-0 z-50 bg-white">
          <SidebarTrigger />
          <h1 className="font-semibold">{page}</h1>
          <div className="flex gap-3 md:gap-5">
            <span className="p-2 rounded-full bg-black">
              <Bell className="text-white size-4 md:size-5 "/>
            </span>
            <Button variant="destructive" onClick={handleLogout}>
              <DoorClosedLocked/>
            Logout
          </Button>
          </div>
        </header>
        <div className="flex-1 p-2 md:p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardLayout;
