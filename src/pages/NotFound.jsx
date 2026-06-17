
// Import Link component to navigate back home without triggering full page reloads.
import { Link } from 'react-router-dom';
// Import beautiful visual icons from lucide-react.
import { Compass, Home, HelpCircle } from 'lucide-react';

/**
 * NotFound Component
 * Serves as the fallback 404 page (path: *) when no matching route definitions are hit.
 * Features full page centered layouts, custom error indicators, and a return-home action button.
 */
const NotFound = () => {
  return (
    // Centered outer container with gradient light background.
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-slate-50/30 px-6 font-roboto dark:bg-slate-900/40">
      
      {/* Visual illustration box */}
      <div className="relative mb-6 text-indigo-600">
        {/* Large stylized 404 header backdrop */}
        <h1 className="text-9xl font-extrabold tracking-widest text-slate-100 dark:text-slate-800 select-none">
          404
        </h1>
        {/* Absolute-positioned floating compass icon indicating lost direction */}
        <div className="absolute inset-0 flex items-center justify-center animate-bounce">
          <Compass className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>

      {/* Narrative block */}
      <div className="text-center max-w-md space-y-3">
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
          Out of Orbit!
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed dark:text-slate-400">
          The requested resource at this URL path could not be located. It might have been moved, renamed, or temporarily deactivated.
        </p>
      </div>

      {/* Call to action navigation links */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        
        {/* Primary CTA: Navigate back to the Dashboard (/) */}
        <Link 
          to="/" 
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/15 active:scale-95 transition-all"
        >
          <Home className="h-4.5 w-4.5" />
          Back to Dashboard
        </Link>
        
        {/* Secondary Info Button */}
        <a 
          href="mailto:support@startupcrm.lite"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl shadow-sm transition-colors dark:bg-slate-950 dark:border-slate-850 dark:text-slate-300"
        >
          <HelpCircle className="h-4.5 w-4.5 text-indigo-500" />
          Contact Support
        </a>

      </div>

    </div>
  );
};

export default NotFound;
