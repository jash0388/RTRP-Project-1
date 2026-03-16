import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/SubmitReport';
import ReportHistory from './pages/ReportHistory';
import UserProfile from './pages/UserProfile';
import PoliceDashboard from './pages/PoliceDashboard';
import PoliceReports from './pages/PoliceReports';
import AdminDashboard from './pages/AdminDashboard';
import AdminReports from './pages/AdminReports';
import AdminUsers from './pages/AdminUsers';
import Analytics from './pages/Analytics';

// Layout
import AppLayout from './components/layout/AppLayout';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;

  // If roles are specified, check access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to role-appropriate dashboard
    switch (user?.role) {
      case 'admin': return <Navigate to="/admin" />;
      case 'police': return <Navigate to="/police" />;
      default: return <Navigate to="/dashboard" />;
    }
  }

  return children;
}

// Redirect to role-appropriate dashboard after login
function RoleDashboardRedirect() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'admin': return <Navigate to="/admin" />;
    case 'police': return <Navigate to="/police" />;
    default: return <Navigate to="/dashboard" />;
  }
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={isAuthenticated ? <RoleDashboardRedirect /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

      {/* ===== CITIZEN ROUTES (user role only) ===== */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['user']}>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/submit-report" element={
        <ProtectedRoute allowedRoles={['user']}>
          <AppLayout><SubmitReport /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/report-history" element={
        <ProtectedRoute allowedRoles={['user']}>
          <AppLayout><ReportHistory /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['user']}>
          <AppLayout><UserProfile /></AppLayout>
        </ProtectedRoute>
      } />

      {/* ===== POLICE ROUTES (police role only) ===== */}
      <Route path="/police" element={
        <ProtectedRoute allowedRoles={['police']}>
          <AppLayout><PoliceDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/police/reports" element={
        <ProtectedRoute allowedRoles={['police']}>
          <AppLayout><PoliceReports /></AppLayout>
        </ProtectedRoute>
      } />

      {/* ===== ADMIN ROUTES (admin role only) ===== */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AppLayout><AdminDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AppLayout><AdminReports /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AppLayout><AdminUsers /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AppLayout><Analytics /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
