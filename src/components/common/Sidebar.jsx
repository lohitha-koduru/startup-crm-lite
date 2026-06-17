import { useState } from 'react';
// Import NavLink and Link from react-router-dom to handle SPA links and active states.
import { NavLink, Link } from 'react-router-dom';
// Import beautiful, sleek icons from lucide-react.
import { LayoutDashboard, Users, BarChart3, Menu, X, Sparkles, User, LogOut } from 'lucide-react';

/**
 * Sidebar Component
 * Replaces the Navbar. Fits to the left side of the display on desktop screens.
 * Contains responsive mobile menus utilizing overlay sheets.
 */
const Sidebar = () => {
  // State Hook to handle mobile side drawer visibility.
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Helper function to construct classes for the navigation items dynamically.
   * Leverages the 'isActive' callback parameter exposed by NavLink.
   * Highlights active vertical menu items with side borders.
   * 
   * @param {Object} navProps - Object containing isActive boolean property.
   * @returns {string} String of compiled Tailwind utility classes.
   */
  const getNavLinkClass = ({ isActive }) => {
    // Shared core styles for navigation links.
    const baseClasses = 'relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ease-in-out hover:pl-5';
    
    if (isActive) {
      // High-accent premium state style when the route matches the path.
      return `${baseClasses} bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-l-4 border-indigo-600 dark:border-indigo-500 rounded-l-none`;
    }
    
    // Smooth default state when route is not active.
    return `${baseClasses} text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80 border-l-4 border-transparent`;
  };

  // NavItems configuration helper array
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/leads', label: 'Leads', icon: Users },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <>
      {/* 1. MOBILE TOP STICKY HEADER */}
      {/* Hidden on desktop. Sticky on mobile so that users can toggle sidebar. */}
      <div className="md:hidden sticky top-0 z-40 w-full flex items-center justify-between px-6 h-16 border-b border-slate-200/50 bg-white/85 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-950/85">
        {/* Mobile brand link */}
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-lg shadow-sm">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-800 dark:text-slate-100">
            Startup<span className="text-indigo-600 dark:text-indigo-400 font-semibold">CRM</span>
          </span>
        </Link>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* 2. MOBILE OVERLAY DRAWER PANEL */}
      {/* Leverages absolute/fixed positioning to cover screen on mobile screens. */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Glassmorphic backdrop backdrop-blur overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer content drawer panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-850 p-6 animate-slideIn">
            {/* Close Button element inside mobile drawer header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-850">
              <span className="font-extrabold text-lg text-slate-855 dark:text-slate-100">
                Menu Navigation
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close Sidebar Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile NavLinks list container */}
            <nav className="flex-1 mt-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={getNavLinkClass}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Drawer User Profile Section at bottom */}
            <div className="mt-auto border-t border-slate-100 pt-4 dark:border-slate-850">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate dark:text-slate-150">Admin User</p>
                  <p className="text-[10px] text-slate-400 truncate">admin@crm.lite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DESKTOP SIDEBAR VIEW */}
      {/* Fixed on the left, permanent block, hidden on smaller devices. */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:left-0 md:z-30 bg-white border-r border-slate-200/50 dark:bg-slate-950 dark:border-slate-850/60 shadow-sm transition-all duration-300">
        
        {/* Brand Header area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200/40 dark:border-slate-850/60">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-xl shadow-md shadow-indigo-500/25 group-hover:rotate-6 transition-transform duration-300">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-slate-100">
              Startup<span className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg ml-0.5">CRM</span>
            </span>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={getNavLinkClass}>
                <Icon className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Persistent User Info box at the bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850/80 bg-slate-50/40 dark:bg-slate-900/20">
          <div className="flex items-center gap-3">
            {/* User Avatar Circle */}
            <div className="h-9 w-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/10 font-bold text-sm">
              AD
            </div>
            {/* Meta Details */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Admin Profile</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">admin@crm.lite</p>
            </div>
            <button 
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
