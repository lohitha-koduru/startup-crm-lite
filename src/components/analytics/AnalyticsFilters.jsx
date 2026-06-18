import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * AnalyticsFilters Component
 * Allows filtering of CRM metrics by predefined intervals or a custom calendar range.
 */
export const AnalyticsFilters = ({
  filterType,
  setFilterType,
  customRange,
  setCustomRange,
}) => {
  const options = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setCustomRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 p-4 rounded-2xl shadow-sm transition-all duration-300">
      {/* Interval Selector Controls */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-900 rounded-xl w-full sm:w-auto">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilterType(opt.value)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              filterType === opt.value
                ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm border border-slate-200/30'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Custom Date Pickers (visible only when 'custom' is active) */}
      {filterType === 'custom' && (
        <div className="flex items-center gap-2.5 w-full sm:w-auto animate-fadeIn select-none">
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 h-3.5 w-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="date"
              name="start"
              value={customRange.start}
              onChange={handleCustomDateChange}
              aria-label="Start date"
              className="pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-xs font-semibold rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 dark:text-white"
            />
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">to</span>
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 h-3.5 w-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="date"
              name="end"
              value={customRange.end}
              onChange={handleCustomDateChange}
              aria-label="End date"
              className="pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 text-xs font-semibold rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;
