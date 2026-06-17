/**
 * @file LeadTable.jsx
 * @description Tabular view of all CRM leads with sortable columns and row actions.
 *
 * Columns: Name / Company, Status, Email, Source, Date Added, Actions.
 * Each data row includes Edit and Delete icon buttons.
 *
 * Used alongside LeadCard in a toggle view on the Leads page.
 */

import { Pencil, Trash2, ArrowUpDown, Inbox } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from './StatusBadge';

/**
 * @typedef {Object} Lead
 * @property {string|number} id
 * @property {string} name
 * @property {string} company
 * @property {string} email
 * @property {string} [phone]
 * @property {string} status
 * @property {string} source
 * @property {string} dateAdded
 */

/**
 * @typedef {Object} LeadTableProps
 * @property {Lead[]} leads            - Array of leads to render.
 * @property {function(Lead): void}   onEdit   - Open edit modal for a lead.
 * @property {function(string|number): void} onDelete - Delete a lead by id.
 */

/** Sortable column definitions. */
const COLUMNS = [
  { key: 'name',      label: 'Name / Company', sortable: true  },
  { key: 'status',    label: 'Status',         sortable: true  },
  { key: 'email',     label: 'Email',          sortable: false },
  { key: 'source',    label: 'Source',         sortable: true  },
  { key: 'dateAdded', label: 'Date Added',     sortable: true  },
  { key: 'actions',   label: 'Actions',        sortable: false },
];

/**
 * LeadTable Component
 * Renders all leads in a responsive, sortable HTML table.
 *
 * @param {LeadTableProps} props
 * @returns {JSX.Element}
 */
const LeadTable = ({ leads, onEdit, onDelete }) => {
  /**
   * @typedef {'asc'|'desc'} SortDir
   * @typedef {{ key: string, dir: SortDir }} SortState
   */
  const [sort, setSort] = useState({ key: 'dateAdded', dir: 'desc' });

  /**
   * Toggles sort direction or switches sort key.
   *
   * @param {string} key
   */
  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  };

  /**
   * Returns sorted copy of the leads array according to current `sort` state.
   *
   * @returns {Lead[]}
   */
  const sortedLeads = [...leads].sort((a, b) => {
    const valA = a[sort.key] ?? '';
    const valB = b[sort.key] ?? '';
    const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Leads table">

          {/* ── Table head ── */}
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-850">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap ${col.key === 'actions' ? 'text-right' : ''}`}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                      aria-label={`Sort by ${col.label}`}
                    >
                      {col.label}
                      <ArrowUpDown
                        className={`h-3 w-3 transition-colors ${
                          sort.key === col.key ? 'text-primary' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Table body ── */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            {sortedLeads.length > 0 ? (
              sortedLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors"
                >
                  {/* Name / Company */}
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {lead.name}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {lead.company}
                    </div>
                  </td>

                  {/* Status badge */}
                  <td className="py-4 px-5">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Email */}
                  <td className="py-4 px-5">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
                    >
                      {lead.email}
                    </a>
                  </td>

                  {/* Source */}
                  <td className="py-4 px-5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {lead.source}
                    </span>
                  </td>

                  {/* Date Added */}
                  <td className="py-4 px-5">
                    <time className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(lead.dateAdded).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(lead)}
                        aria-label={`Edit ${lead.name}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(lead.id)}
                        aria-label={`Delete ${lead.name}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* ── Empty state ── */
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900">
                      <Inbox className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      No leads match your current filters.
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Try adjusting your search or status filter.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Row count footer ── */}
      {sortedLeads.length > 0 && (
        <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-850">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Showing <span className="font-semibold text-slate-600 dark:text-slate-300">{sortedLeads.length}</span> lead{sortedLeads.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadTable;
