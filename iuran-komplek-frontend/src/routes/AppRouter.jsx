import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ResidentsPage from '../pages/ResidentsPage';
import HousesPage from '../pages/HousesPage';
import DueTypesPage from '../pages/DueTypesPage';
import PaymentsPage from '../pages/PaymentsPage';
import ExpensesPage from '../pages/ExpensesPage';
import ReportsPage from '../pages/ReportsPage';
import PrivateRoute from './PrivateRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
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
          <Route path="jenis-iuran" element={<DueTypesPage />} />
          <Route path="pembayaran" element={<PaymentsPage />} />
          <Route path="pengeluaran" element={<ExpensesPage />} />
          <Route path="laporan-bulanan" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
