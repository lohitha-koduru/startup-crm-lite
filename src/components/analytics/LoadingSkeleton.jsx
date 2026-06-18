import React from 'react';

/**
 * LoadingSkeleton Component
 * Displays animated, glassmorphic layout skeletons during state transition.
 */
export const LoadingSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-sm space-y-3"
          >
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
            <div className="h-8 bg-slate-350 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
          </div>
        ))}
      </div>

      {/* Row 1: Pie + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2 w-1/3">
                <div className="h-5 bg-slate-250 dark:bg-slate-800 rounded" />
                <div className="h-3.5 bg-slate-200 dark:bg-slate-900 rounded" />
              </div>
              <div className="h-8 bg-slate-100 dark:bg-slate-900 rounded w-1/6" />
            </div>
            <div className="h-72 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-8 border-dashed border-slate-200 dark:border-slate-800 animate-spin duration-1000" />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Bar + Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-sm space-y-4"
          >
            <div className="space-y-2 w-1/3">
              <div className="h-5 bg-slate-250 dark:bg-slate-800 rounded" />
              <div className="h-3.5 bg-slate-200 dark:bg-slate-900 rounded" />
            </div>
            <div className="h-72 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-end justify-between p-6 gap-3">
              {[...Array(12)].map((_, j) => (
                <div
                  key={j}
                  style={{ height: `${20 + Math.random() * 70}%` }}
                  className="bg-slate-200 dark:bg-slate-800 rounded-t w-full"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
