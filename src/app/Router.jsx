import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoginPage from "@/feautures/auth/LoginPage";

import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import ProductsPage from "@/pages/dashboard/ProductsPage";
import ReportsPage from "@/pages/dashboard/ReportsPage";
import PublicRoute from "@/components/shared/PublicRoute";
import SalesPage from "@/pages/dashboard/SalesPage";

import StaffsPage from "@/pages/dashboard/StaffsPage";
import TransfersPage from "@/pages/dashboard/TransfersPage";
import ProductsSale from "@/feautures/dashboard/Products-Sale";
import NotificationsPage from "@/pages/dashboard/NotificationsPage";
import ProductDetailsPage from "@/pages/dashboard/ProductDetailsPage";
import LocationsPage from "@/pages/dashboard/LocationsPage";
import LocationDetailsPage from "@/pages/dashboard/LocationDetailsPage";
import StaffDetailsPage from "@/pages/dashboard/StaffDetailsPage";

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
            <Route
              path="/products/:productId"
              element={<ProductDetailsPage />}
            />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="locations/:id" element={<LocationDetailsPage />} />

            <Route path="staffs" element={<StaffsPage />} />
            <Route path="staffs/:id" element={<StaffDetailsPage />} />

            <Route path="sales" element={<SalesPage />} />
            <Route path="transfers" element={<TransfersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
