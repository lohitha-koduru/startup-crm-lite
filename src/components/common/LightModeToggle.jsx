import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * LightModeToggle Component
 * An animated pill-shaped toggle switch that lets users flip between
 * dark mode (default) and light mode. Persists via ThemeContext.
 *
 * @param {{ compact?: boolean }} props
 */
const LightModeToggle = ({ compact = false }) => {
  const { isLightMode, toggleTheme } = useTheme();

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
        className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all duration-300"
      >
        <div className="relative h-5 w-5 flex-shrink-0">
          <Sun
            className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
              isLightMode
                ? 'opacity-0 rotate-90 scale-0'
                : 'opacity-100 rotate-0 scale-100 text-amber-400'
            }`}
          />
          <Moon
            className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
              isLightMode
                ? 'opacity-100 rotate-0 scale-100 text-indigo-500'
                : 'opacity-0 -rotate-90 scale-0'
            }`}
          />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
      className="group relative flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ease-in-out text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80"
    >
      {/* Animated icon container */}
      <div className="relative h-4.5 w-4.5 flex-shrink-0">
        {/* Sun icon — visible in dark mode (offering switch to light) */}
        <Sun
          className={`absolute inset-0 h-4.5 w-4.5 transition-all duration-300 ${
            isLightMode
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100 text-amber-400'
          }`}
        />
        {/* Moon icon — visible in light mode (offering switch to dark) */}
        <Moon
          className={`absolute inset-0 h-4.5 w-4.5 transition-all duration-300 ${
            isLightMode
              ? 'opacity-100 rotate-0 scale-100 text-indigo-500'
              : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>

      {/* Label text */}
      <span className="select-none">
        {isLightMode ? 'Dark Mode' : 'Light Mode'}
      </span>

      {/* Pill toggle indicator */}
      <div className="ml-auto flex-shrink-0">
        <div
          className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${
            isLightMode
              ? 'bg-indigo-500'
              : 'bg-slate-700 dark:bg-slate-600'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
              isLightMode ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </button>
  );
};

export default LightModeToggle;
