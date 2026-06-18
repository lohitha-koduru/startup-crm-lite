/**
 * @file EmptyState.jsx
 * @description Friendly empty state displayed on the Leads page when
 * no leads match the active search query or status filter.
 *
 * Renders two distinct variants:
 *  1. **No leads at all** — the pipeline is completely empty; prompt the
 *     user to add their first lead.
 *  2. **No matches** — leads exist but none match the current query /
 *     filter; suggest clearing the filters or adjusting the search.
 *
 * @param {{
 *   totalLeads: number,
 *   onAdd: () => void,
 *   onClearFilters: () => void
 * }} props
 */

import { Search, Users, Plus, FilterX } from 'lucide-react';

/**
 * EmptyState Component
 *
 * @param {{
 *   totalLeads: number,
 *   onAdd: () => void,
 *   onClearFilters: () => void
 * }} props
 * @returns {JSX.Element}
 */
const EmptyState = ({ totalLeads, onAdd, onClearFilters }) => {
  /** True when the pipeline has leads but none match the current filters. */
  const isFiltered = totalLeads > 0;

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 animate-[fadeIn_0.25s_ease]">

      {/* Icon bubble */}
      <div
        className={`
          w-20 h-20 rounded-3xl flex items-center justify-center
          ${isFiltered
            ? 'bg-amber-50 dark:bg-amber-900/20'
            : 'bg-primary/10 dark:bg-primary/15'}
        `}
      >
        {isFiltered ? (
          <Search className="h-9 w-9 text-amber-400 dark:text-amber-300" aria-hidden="true" />
        ) : (
          <Users className="h-9 w-9 text-primary/60" aria-hidden="true" />
        )}
      </div>

      {/* Copy */}
      <div className="text-center max-w-xs">
        <p className="text-base font-bold text-slate-800 dark:text-slate-200">
          {isFiltered ? 'No leads found' : 'Your pipeline is empty'}
        </p>

        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">
          {isFiltered
            ? 'No leads match your current search or filter. Try adjusting your query or clearing the filters.'
            : "You haven't added any leads yet. Hit the button below to start building your pipeline."}
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="
              inline-flex items-center gap-2
              px-4 py-2.5 rounded-xl
              border border-slate-200 dark:border-slate-700
              text-sm font-semibold text-slate-600 dark:text-slate-300
              hover:bg-slate-50 dark:hover:bg-slate-800
              active:scale-95 transition-all duration-150
            "
          >
            <FilterX className="h-4 w-4" aria-hidden="true" />
            Clear Filters
          </button>
        )}

        <button
          type="button"
          onClick={onAdd}
          className="
            inline-flex items-center gap-2
            px-5 py-2.5 rounded-xl
            bg-primary hover:bg-primary/90
            text-white text-sm font-semibold
            shadow-lg shadow-primary/20
            active:scale-95 transition-all duration-150
          "
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add New Lead
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
