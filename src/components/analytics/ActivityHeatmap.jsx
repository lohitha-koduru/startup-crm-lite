import React from 'react';
import { Flame } from 'lucide-react';

export const ActivityHeatmap = ({ data = [] }) => {
  // Determine color density classes based on activity count
  const getColorClass = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850';
    if (count === 1) return 'bg-indigo-100 dark:bg-indigo-950/40 hover:bg-indigo-200 text-indigo-700';
    if (count === 2) return 'bg-indigo-300 dark:bg-indigo-800/60 hover:bg-indigo-400 text-white';
    if (count === 3) return 'bg-indigo-500 dark:bg-indigo-650 hover:bg-indigo-600 text-white';
    return 'bg-indigo-700 dark:bg-indigo-500 hover:bg-indigo-800 text-white';
  };

  const totalActivities = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-350 justify-between">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            Activity Heatmap
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Density of outreach and creation tasks in the last 30 days.
          </p>
        </div>
        <div className="p-2 bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-xl">
          <Flame className="h-4.5 w-4.5" />
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="my-5">
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2.5">
          {data.map((day, idx) => {
            const colorClass = getColorClass(day.count);
            return (
              <div key={idx} className="relative group flex items-center justify-center">
                {/* Heatmap box */}
                <div
                  className={`w-9 h-9 rounded-xl cursor-pointer transition-all duration-150 border border-slate-200/20 dark:border-slate-850 ${colorClass}`}
                />

                {/* GitHub-style Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-950 text-white text-[10px] p-2.5 rounded-xl shadow-xl w-36 text-center leading-normal z-20 pointer-events-none border border-slate-850">
                  <p className="font-bold text-[11px] border-b border-slate-800 pb-1">{day.displayDate}</p>
                  <p className="mt-1 font-semibold text-emerald-400">{day.count} Activities</p>
                  <div className="text-[9px] text-slate-400 mt-1 space-y-0.5 text-left pl-1">
                    <p>• Created: {day.details.created} leads</p>
                    <p>• Calls: {day.details.calls} logged</p>
                    <p>• Meetings: {day.details.meetings} set</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Legend Footer */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-900 text-xs font-semibold text-slate-400 select-none">
        <span>Total: {totalActivities} actions</span>
        <div className="flex items-center gap-1 text-[10px]">
          <span>Less</span>
          <span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200/10" />
          <span className="w-3 h-3 rounded bg-indigo-100 dark:bg-indigo-950/40" />
          <span className="w-3 h-3 rounded bg-indigo-300 dark:bg-indigo-800/60" />
          <span className="w-3 h-3 rounded bg-indigo-500 dark:bg-indigo-650" />
          <span className="w-3 h-3 rounded bg-indigo-700 dark:bg-indigo-500" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
