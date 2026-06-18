/**
 * @file SearchBar.jsx
 * @description Reusable controlled search input with:
 *  - Lucide `Search` icon on the left
 *  - Lucide `X` clear button that appears when there is text
 *  - Accessible aria-label on the input
 *  - Smooth focus ring and transition styles
 *
 * Debounce is handled by the parent via the `useDebounce` hook so this
 * component stays purely presentational and fully controlled.
 *
 * @param {{ value: string, onChange: (val: string) => void }} props
 */

import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 *
 * @param {{ value: string, onChange: (val: string) => void }} props
 * @returns {JSX.Element}
 */
const SearchBar = ({ value, onChange }) => (
  <div className="relative flex-1 max-w-sm group">
    {/* Magnifying-glass icon */}
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary pointer-events-none transition-colors duration-200"
      aria-hidden="true"
    />

    {/* Controlled text input */}
    <input
      id="leads-search"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by name, company, or email..."
      aria-label="Search leads by name, company, or email"
      autoComplete="off"
      className="
        block w-full pl-9 pr-9 py-2.5 text-sm
        bg-slate-50 dark:bg-slate-900/40
        border border-slate-200 dark:border-slate-800
        rounded-xl outline-none
        text-slate-900 dark:text-white
        placeholder:text-slate-400 dark:placeholder:text-slate-500
        focus:border-primary focus:ring-2 focus:ring-primary/20
        transition-all duration-200
      "
    />

    {/* Clear button — only visible when there is text */}
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-slate-400 hover:text-slate-700 dark:hover:text-slate-200
          transition-colors duration-150
          focus:outline-none focus:text-slate-700
        "
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    )}
  </div>
);

export default SearchBar;
