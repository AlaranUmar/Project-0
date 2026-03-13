import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  User2,
  Bus,
  Building2,
  ShoppingCart,
} from "lucide-react";
export const sidebarMenu = {
  owner: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Branches", path: "/branches", icon: Building2 },
    { name: "Staffs", path: "/staffs", icon: User2 },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Transfers", path: "/transfers", icon: Bus },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Branches", path: "/branches", icon: Building2 },
    { name: "Staffs", path: "/staffs", icon: User2 },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Transfers", path: "/transfers", icon: Bus },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ],
  
  manager: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Transfers", path: "/transfers", icon: Bus },
    { name: "Reports", path: "/reports", icon: BarChart3 },
  ],

  cashier: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
  ],
};
