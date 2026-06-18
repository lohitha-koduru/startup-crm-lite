import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Plus } from 'lucide-react';

/**
 * EmptyAnalyticsState Component
 * Displayed when there is no lead data available in the system or matching the selected filters.
 */
export const EmptyAnalyticsState = ({ title = 'No analytics available yet', showCTA = true }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[450px] p-8 bg-white dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm text-center">
      {/* Icon frame */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-4">
        <BarChart3 className="h-10 w-10 stroke-[2]" />
      </div>

      {/* Texts */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        Add your first lead to start tracking business performance, pipelines, conversion trends, and forecasting.
      </p>

      {/* CTA Button */}
      {showCTA && (
        <button
          type="button"
          onClick={() => navigate('/leads')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          Add Lead
        </button>
      )}
    </div>
  );
};

export default EmptyAnalyticsState;
