import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The title/label of the metric.
 * @property {string|number} value - The main metric value to display.
 * @property {React.ComponentType<{className?: string}>} icon - The Lucide icon component.
 * @property {string} change - The percentage change text (e.g., "+12.5%" or "-3.2%").
 * @property {'primary' | 'success' | 'warning' | 'danger'} color - The theme color name for styling.
 */

/**
 * StatsCard Component
 * Displays a single KPI metric with a background icon, main value, and visual trend indicators.
 *
 * @param {StatsCardProps} props - The component properties.
 * @returns {React.JSX.Element} The rendered StatsCard component.
 */
const StatsCard = ({ title, value, icon: Icon, change, color = 'primary' }) => {
  const isNegative = change.startsWith('-');
  const isNeutral = change.startsWith('0') || !change.startsWith('+') && !change.startsWith('-');

  // Map theme colors to specific Tailwind utility classes defined in index.css
  const colorMap = {
    primary: {
      text: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20 hover:border-primary/40',
      iconBg: 'bg-primary text-white',
      shadow: 'hover:shadow-primary/5',
    },
    success: {
      text: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20 hover:border-success/40',
      iconBg: 'bg-success text-white',
      shadow: 'hover:shadow-success/5',
    },
    warning: {
      text: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20 hover:border-warning/40',
      iconBg: 'bg-warning text-white',
      shadow: 'hover:shadow-warning/5',
    },
    danger: {
      text: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/20 hover:border-danger/40',
      iconBg: 'bg-danger text-white',
      shadow: 'hover:shadow-danger/5',
    },
  };

  const activeColor = colorMap[color] || colorMap.primary;

  return (
    <div className={`relative overflow-hidden bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-850 shadow-sm hover:shadow-lg transition-all duration-300 ${activeColor.shadow} ${activeColor.border}`}>
      {/* Decorative background glow matching the color scheme */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform duration-500 group-hover:scale-110 ${activeColor.bg}`}></div>
      
      <div className="flex items-center justify-between">
        {/* Metric Label */}
        <span className="text-slate-400 dark:text-slate-500 text-xs font-bold tracking-wider uppercase">
          {title}
        </span>
        
        {/* Icon wrapper */}
        <div className={`p-2.5 rounded-xl shadow-sm ${activeColor.iconBg}`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        {/* Big Number */}
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>

        {/* Change Indicator */}
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-bold ${
            isNegative
              ? 'text-danger bg-danger/10'
              : isNeutral
              ? 'text-warning bg-warning/10'
              : 'text-success bg-success/10'
          }`}
        >
          {isNegative ? (
            <ArrowDownRight className="h-3.5 w-3.5" />
          ) : isNeutral ? (
            <span className="w-1.5 h-1.5 rounded-full bg-warning mr-1"></span>
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5" />
          )}
          {change}
        </span>
      </div>

      {/* Subtext description */}
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
        vs. last month
      </p>
    </div>
  );
};

export default StatsCard;
