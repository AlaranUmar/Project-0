import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Bell, LogOut, Moon, Sun } from "lucide-react"; // Using LogOut for a cleaner look

import AppSidebar from "@/components/ui/AppSidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/feautures/auth/authService";

function DashboardLayout() {
  const { user, role } = useAuth();
  const [page, setPage] = useState(null);

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background text-foreground transition-colors duration-300 overflow-hidden">
          {/* Sidebar */}
          <AppSidebar username={user?.email} role={role} setPage={setPage} />

          {/* Main Content Wrapper */}
          <main className="flex flex-1 flex-col h-screen overflow-hidden">
            {/* STICKY TOP BAR */}
            <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1" />
                <div className="h-4 w-[1px] bg-border mx-1 hidden md:block" />
                <h1 className="text-sm font-medium md:text-base capitalize">
                  {page || "Dashboard"}
                </h1>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDark(!isDark)}
                  title="Toggle Theme"
                >
                  {isDark ? (
                    <Sun className="size-5" />
                  ) : (
                    <Moon className="size-5" />
                  )}
                </Button>

                <Link to="notifications">
                  <Button variant="ghost" size="icon" className="text-warning">
                    <Bell className="size-5" />
                  </Button>
                </Link>

                <div className="h-6 w-[1px] bg-border mx-1" />

                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="h-9 gap-2 rounded-lg px-4 flex items-center shadow-sm"
                >
                  <LogOut className="size-4 shrink-0" />
                  <span className="hidden md:inline text-xs font-semibold">
                    Logout
                  </span>
                </Button>
              </div>
            </header>

            {/* SCROLLABLE CONTENT AREA */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 md:p-4">
              <div className="mx-auto max-w-7xl w-full">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default DashboardLayout;
