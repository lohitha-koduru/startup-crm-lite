import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import AppRoutes from './routes';
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * Inner layout wrapper to apply conditionally authenticated layouts.
 * Hides sidebars and footer structures on Login / Register pages.
 */
function AppContent() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#09090a] flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  // Clean layout (no sidebars/headers) for public pages
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#09090a] flex items-center justify-center font-roboto w-full">
        <main className="w-full">
          <AppRoutes />
        </main>
      </div>
    );
  }

  // Standard Authenticated Dashboard Layout
  return (
    <div className="w-full max-w-[1440px] min-h-screen bg-slate-50/50 text-slate-800 flex flex-col md:flex-row relative dark:bg-slate-900/60 dark:text-slate-100 shadow-2xl border-x border-slate-200/30 dark:border-slate-850/30">
      
      {/* Left vertical sidebar */}
      <Sidebar />

      {/* Main content frame */}
      <div className="flex-grow flex flex-col min-w-0 pb-16 md:pb-0">
        
        {/* Main layout container holding pages */}
        <main className="flex-grow">
          <AppRoutes />
        </main>

        {/* Persistent global footer */}
        <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/50 bg-white/40 dark:border-slate-850/40 dark:bg-slate-950/20 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} Startup CRM Lite. Designed for fast and lightweight lead management.</p>
        </footer>

      </div>

    </div>
  );
}

/**
 * App component
 * Acts as the entrypoint wrapper, configuring router contexts and AuthProviders.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-100 dark:bg-[#09090a] flex items-center justify-center font-roboto transition-colors duration-200">
          <AppContent />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
