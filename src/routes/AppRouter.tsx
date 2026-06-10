import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import DashboardPage from '../pages/DashboardPage';
import DailyEntryPage from '../pages/DailyEntryPage';
import ExpensesPage from '../pages/ExpensesPage';
import StaffPayrollPage from '../pages/StaffPayrollPage';
import StockPage from '../pages/StockPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import AggregatorsPage from '../pages/AggregatorsPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/daily" element={<DailyEntryPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/staff" element={<StaffPayrollPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/aggregators" element={<AggregatorsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
