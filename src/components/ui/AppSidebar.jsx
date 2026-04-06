import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";

import { User2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { sidebarMenu } from "@/feautures/dashboard/sideBarMenu";

function AppSidebar({ username, role, setPage }) {
  const { pathname } = useLocation();

  const navItems = useMemo(() => sidebarMenu?.[role] ?? [], [role]);

  // Keep page title logic separate from menu highlight logic
  useEffect(() => {
    const currentItem = navItems.find(
      (item) =>
        pathname === item.path ||
        (item.path !== "/" && pathname.startsWith(item.path)),
    );

    if (currentItem) {
      setPage(currentItem.name);
    } else if (pathname.startsWith("/branches/")) {
      setPage("Branch Details");
    } else {
      setPage("Dashboard");
    }
  }, [pathname, navItems, setPage]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <span className="font-bold px-2 group-data-[collapsible=icon]:hidden">
            MyApp
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                // FIXED: Exact match prevents '/products-sale' from highlighting '/products'
                const isActive = pathname === item.path;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90 transition-all"
                    >
                      <Link to={item.path}>
                        <item.icon
                          className={
                            isActive ? "text-current" : "text-muted-foreground"
                          }
                        />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
              <div className="font-bold tracking-wider flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {username ? (
                  username.substring(0, 2).toUpperCase()
                ) : (
                  <User2 className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {username || "User"}
                </span>
                <span className="truncate text-xs capitalize opacity-70">
                  {role}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
