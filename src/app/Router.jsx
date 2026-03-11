import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPage from "@/feautures/auth/LoginPage";

import DashboardLayout from "@/layouts/DashboardLayout";
import CustomersPage from "@/pages/dashboard/CustomersPage";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import OrdersPage from "@/pages/dashboard/OrdersPage";
import ProductsPage from "@/pages/dashboard/ProductsPage";
import ReportsPage from "@/pages/dashboard/ReportsPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import PublicRoute from "@/components/shared/PublicRoute";
import SalesPage from "@/pages/dashboard/SalesPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="branches" element={<OrdersPage />} />
            <Route path="staffs" element={<ReportsPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="transfers" element={<CustomersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
