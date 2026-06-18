/**
 * @file FilterBar.jsx
 * @description Row of status-filter buttons for the Leads page.
 *
 * Features:
 *  - Renders a button for each status in STATUS_FILTERS
 *  - Active button is highlighted with the `primary` brand colour
 *  - Each button shows the count of leads that match that status
 *  - SlidersHorizontal icon prefix for visual affordance
 *  - Smooth colour transitions on hover and selection
 *
 * @param {{
 *   activeFilter: string,
 *   onFilterChange: (filter: string) => void,
 *   leads: Array<{ status: string }>
 * }} props
 */

import { SlidersHorizontal } from 'lucide-react';

/** Canonical ordered list of status filters shown in the bar. */
const STATUS_FILTERS = [
  'All',
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];

/**
 * FilterBar Component
 *
 * @param {{
 *   activeFilter: string,
 *   onFilterChange: (filter: string) => void,
 *   leads: Array<{ status: string }>
 * }} props
 * @returns {JSX.Element}
 */
const FilterBar = ({ activeFilter, onFilterChange, leads }) => {
  /**
   * Returns the number of leads that match a given filter label.
   *
   * @param {string} filter
   * @returns {number}
   */
  const countFor = (filter) =>
    filter === 'All'
      ? leads.length
      : leads.filter((l) => l.status === filter).length;

  return (
    <div
      role="tablist"
      aria-label="Filter leads by status"
      className="flex flex-wrap items-center gap-1.5"
    >
      {/* Decorative filter icon */}
      <SlidersHorizontal
        className="h-4 w-4 text-slate-400 self-center mr-1 flex-shrink-0"
        aria-hidden="true"
      />

      {STATUS_FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        const count = countFor(filter);

        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(filter)}
            className={`
              inline-flex items-center gap-1
              px-3 py-1.5 rounded-lg
              text-xs font-semibold tracking-wide
              transition-all duration-200
              ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/30 scale-[1.03]'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }
            `}
          >
            {filter}

            {/* Count badge */}
            <span
              className={`
                tabular-nums
                ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}
              `}
            >
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
