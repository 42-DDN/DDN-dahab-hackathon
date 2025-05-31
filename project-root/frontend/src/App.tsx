import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import SellerLayout from './layouts/SellerLayout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import SellerManagement from './pages/admin/SellerManagement';
import FeesManagement from './pages/admin/FeesManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import Settings from './pages/admin/Settings';

// Seller Pages
import SellerHome from './pages/seller/SellerHome';
import BuyOption from './pages/seller/BuyOption';
import SellOption from './pages/seller/SellOption';
import InvoiceManagement from './pages/seller/InvoiceManagement';
import Inventory from './pages/seller/Inventory';

// Protected Route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: ('admin' | 'seller')[];
}> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="sellers" element={<SellerManagement />} />
            <Route path="fees" element={<FeesManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Seller Routes */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SellerHome />} />
            <Route path="home" element={<SellerHome />} />
            <Route path="buy" element={<BuyOption />} />
            <Route path="sell" element={<SellOption />} />
            <Route path="invoices" element={<InvoiceManagement />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 