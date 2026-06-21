import {
  LayoutDashboard,
  Package,
  // Users,
  BarChart3,
  // Settings,
  User2,
  Bus,
  Building2,
  ShoppingCart,
  Scale,
  Bell,
} from "lucide-react";
export const sidebarMenu = {
  owner: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Locations", path: "/locations", icon: Building2 },
    { name: "Staffs", path: "/staffs", icon: User2 },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Transfers", path: "/transfers", icon: Bus },
    { name: "Notifications", path: "/notifications", icon: Bell },
  ],
  admin: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Locations", path: "/locations", icon: Building2 },
    { name: "Staffs", path: "/staffs", icon: User2 },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Transfers", path: "/transfers", icon: Bus },
  ],

  manager: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Products-sale", path: "/products-sale", icon: Scale },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Staffs", path: "/staffs", icon: User2 },
    { name: "Transfers", path: "/transfers", icon: Bus },
    { name: "Notifications", path: "/notifications", icon: Bell },
  ],

  cashier: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products-sale", path: "/products-sale", icon: Scale },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Notifications", path: "/notifications", icon: Bell },
  ],
};
