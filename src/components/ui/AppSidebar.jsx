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
import { SidebarCloseButton } from "./sidebarCloseButton";
import { useEffect, useMemo } from "react";
import { sidebarMenu } from "@/feautures/dashboard/sideBarMenu";
function AppSidebar({ username, role, setPage }) {
  const location = useLocation();
  const navItems = useMemo(() => {
    return sidebarMenu[role] || [];
  }, [role]);
  useEffect(() => {
    const currentItem = navItems.find(
      (item) => item.path === location.pathname,
    );

    if (currentItem) {
      setPage(currentItem.name);
    } else if (location.pathname.startsWith("/branches/")) {
      setPage("Branch Details");
    } else {
      setPage("Dashboard");
    }
  }, [location.pathname, navItems, setPage]);
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarCloseButton />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={"space-y-3"}>
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
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
            <SidebarMenuButton className={"h-15 flex gap-3 py-2"}>
              <div className="bg-primary h-8 w-8 rounded-2xl flex justify-center items-center p-1">
                <User2 className="text-white" size={40} />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold truncate overflow-hidden max-w-40">
                  {username}
                </p>
                <span className="capitalize bg-primary/80 text-white px-2 py-0.5 rounded-2xl w-fit text-xs ">
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
