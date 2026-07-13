import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Lazy loading page components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * LoadingSpinner represents a high-fidelity loading indicator.
 */
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-semibold tracking-wide text-slate-500 animate-pulse font-roboto">
        Synchronizing Data...
      </p>
    </div>
  );
};

/**
 * ProtectedRoute component
 * Restricts rendering to authenticated users with a valid token.
 * Otherwise, redirects non-authenticated traffic to the /login page.
 */
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  // If restoring auth session from token, hold rendering
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render children routes if token exists, otherwise redirect to login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * AppRoutes defines the Route architecture for Startup CRM Lite.
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* Wildcard 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
