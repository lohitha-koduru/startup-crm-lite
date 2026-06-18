// Import BrowserRouter to establish routing context for our React single-page app.
import { BrowserRouter } from 'react-router-dom';
// Import the Sidebar component to lay out on the left.
import Sidebar from './components/common/Sidebar';
// Import AppRoutes which houses our lazy-loaded page route definitions.
import AppRoutes from './routes';

/**
 * App component
 * Acts as the entrypoint wrapper, configuring router context, centered layout container,
 * and background styles.
 */
function App() {
  return (
    // Wrap with BrowserRouter to allow children (e.g. NavLink) to access navigation parameters.
    <BrowserRouter>
      {/* Outer viewport wrapper centering the app container on extra large screens */}
      <div className="min-h-screen bg-slate-100 dark:bg-[#09090a] flex items-center justify-center font-roboto transition-colors duration-200">
        
        {/* 
          Centered Application Inner Container (Fluid max-w-1440px).
          Constrains width on massive displays, centers the layout, and adds side borders/shadows for premium styling.
        */}
        <div className="w-full max-w-[1440px] min-h-screen bg-slate-50/50 text-slate-800 flex flex-col md:flex-row relative dark:bg-slate-900/60 dark:text-slate-100 shadow-2xl border-x border-slate-200/30 dark:border-slate-850/30">
          
          {/* Left vertical sidebar (Desktop/Tablet inline flex-shrink-0, Mobile sliding overlay) */}
          <Sidebar />

          {/* 
            Main content frame.
            Sits next to the sidebar using normal flexbox flow.
            Adapts spacing layout on mobile with bottom-bar padding (pb-16).
          */}
          <div className="flex-grow flex flex-col min-w-0 pb-16 md:pb-0">
            
            {/* Main layout container holding our pages */}
            <main className="flex-grow">
              <AppRoutes />
            </main>

            {/* Persistent global footer */}
            <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/50 bg-white/40 dark:border-slate-850/40 dark:bg-slate-950/20 dark:text-slate-500">
              <p>&copy; {new Date().getFullYear()} Startup CRM Lite. Designed for fast and lightweight lead management.</p>
            </footer>

          </div>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
