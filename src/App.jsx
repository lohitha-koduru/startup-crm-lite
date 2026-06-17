
// Import BrowserRouter to establish routing context for our React single-page app.
import { BrowserRouter } from 'react-router-dom';
// Import the Sidebar component to lay out on the left.
import Sidebar from './components/common/Sidebar';
// Import AppRoutes which houses our lazy-loaded page route definitions.
import AppRoutes from './routes';

/**
 * App component
 * Acts as the entrypoint wrapper, configuring router context, base layouts, and layout alignments.
 */
function App() {
  return (
    // Wrap with BrowserRouter to allow children (e.g. NavLink) to access navigation parameters.
    <BrowserRouter>
      {/* Root layout wrapper with custom fonts */}
      <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-roboto transition-colors duration-300 dark:bg-slate-900/60 dark:text-slate-100">
        
        {/* Left vertical sidebar (Desktop fixed, Mobile sliding overlay) */}
        <Sidebar />

        {/* 
          Main content frame offset.
          Uses 'md:pl-64' on screens larger than mobile to shift elements from behind the fixed sidebar.
        */}
        <div className="flex-grow flex flex-col md:pl-64">
          
          {/* Main layout container holding our pages */}
          <main className="flex-grow">
            <AppRoutes />
          </main>

          {/* Persistent global footer */}
          <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/50 bg-white/40 dark:border-slate-800/40 dark:bg-slate-950/20 dark:text-slate-500">
            <p>&copy; {new Date().getFullYear()} Startup CRM Lite. Designed for fast and lightweight lead management.</p>
          </footer>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
