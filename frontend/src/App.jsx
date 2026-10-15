import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Units from './pages/Units';
import Calendar from './pages/Calendar';
import Clients from './pages/Clients';
import Drivers from './pages/Drivers';
import Payments from './pages/Financials/Payments';
import Expenses from './pages/Financials/Expenses';
import Tracking from './pages/Tracking';
import Messages from './pages/Messages';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { style: { background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' } },
          error: { style: { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/units" element={<Units />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/financials/payments" element={<Payments />} />
          <Route path="/financials/expenses" element={<Expenses />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
