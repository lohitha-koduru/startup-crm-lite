import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

/**
 * Lazy loading page components.
 * React.lazy allows us to load components dynamically. This splits our code into smaller chunks,
 * so the user only downloads the code for the page they are actively viewing.
 * 
 * Each import path corresponds to the actual page file.
 */
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * LoadingSpinner represents a high-fidelity loading indicator.
 * Shown as a fallback placeholder while Vite resolves the chunk for the lazy loaded page.
 */
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      {/* Container for spinner with relative positioning */}
      <div className="relative w-14 h-14">
        {/* Static background track circle */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
        {/* Active spinning colored ring segment */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
      {/* Animated text hint */}
      <p className="text-sm font-semibold tracking-wide text-slate-500 animate-pulse font-roboto">
        Synchronizing Dashboard Data...
      </p>
    </div>
  );
};

/**
 * AppRoutes defines the Route architecture for Startup CRM Lite.
 * Wrap `<Routes>` with `<Suspense>` to handle transition states for lazy-loaded components.
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Route pointing to the main Dashboard page (path: /) */}
        <Route path="/" element={<Dashboard />} />

        {/* Route pointing to the Lead Management page (path: /leads) */}
        <Route path="/leads" element={<Leads />} />

        {/* Route pointing to the Analytics and Reports page (path: /analytics) */}
        <Route path="/analytics" element={<Analytics />} />

        {/* Wildcard path '*' matches any route not defined above, yielding a custom 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
