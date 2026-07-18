import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

// Setiap halaman baru di-load saat benar-benar dibuka (code splitting),
// bukan digabung semua jadi satu file JS besar di awal.
const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ResidentsPage = lazy(() => import("../pages/ResidentsPage"));
const HousesPage = lazy(() => import("../pages/HousesPage"));
const PaymentsPage = lazy(() => import("../pages/PaymentsPage"));
const ExpensesPage = lazy(() => import("../pages/ExpensesPage"));
const ReportsPage = lazy(() => import("../pages/ReportsPage"));

function PageLoading() {
  return <div className="page-loading">Memuat halaman...</div>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="penghuni" element={<ResidentsPage />} />
            <Route path="rumah" element={<HousesPage />} />
            <Route path="pembayaran" element={<PaymentsPage />} />
            <Route path="pengeluaran" element={<ExpensesPage />} />
            <Route path="laporan-bulanan" element={<ReportsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
