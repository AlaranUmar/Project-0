import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPage from "@/feautures/auth/LoginPage";

import DashboardLayout from "@/layouts/DashboardLayout";
import CustomersPage from "@/pages/dashboard/CustomersPage";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import ProductsPage from "@/pages/dashboard/ProductsPage";
import ReportsPage from "@/pages/dashboard/ReportsPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import PublicRoute from "@/components/shared/PublicRoute";
import SalesPage from "@/pages/dashboard/SalesPage";
import BranchesPage from "@/pages/dashboard/BranchesPage";
import BranchDetailsPage from "@/pages/dashboard/BranchDetailsPage";
import StaffsPage from "@/pages/dashboard/StaffsPage";
import TransfersPage from "@/pages/dashboard/TransfersPage";
import WarehouseDetailsPage from "@/pages/dashboard/WarehouseDetailsPage";
import ProductsSale from "@/feautures/dashboard/Products-Sale";

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
            <Route path="products-sale" element={<ProductsSale />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="branches/:id" element={<BranchDetailsPage />} />
            <Route path="warehouses/:id" element={<WarehouseDetailsPage />} />
            <Route path="staffs" element={<StaffsPage />} />
            <Route path="sales" element={<SalesPage />} />
            {/* <Route path="customers" element={<CustomersPage />} /> */}
            <Route path="transfers" element={<TransfersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            {/* <Route path="settings" element={<SettingsPage />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
