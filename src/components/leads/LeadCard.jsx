/**
 * @file LeadCard.jsx
 * @description Card-style layout for a single CRM lead record.
 *
 * Renders the lead's name, company, contact details, pipeline status,
 * and exposes Edit (pencil) and Delete (trash) action buttons.
 *
 * Used in the mobile-first card grid view of the Leads page.
 */

import { Pencil, Trash2, Mail, Phone, Globe } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * @typedef {Object} Lead
 * @property {string|number} id      - Unique identifier.
 * @property {string}        name    - Contact person full name.
 * @property {string}        company - Organisation name.
 * @property {string}        email   - Email address.
 * @property {string}        [phone] - Optional phone number.
 * @property {string}        status  - Pipeline stage label.
 * @property {string}        source  - Acquisition channel.
 * @property {string}        dateAdded - ISO date string.
 */

/**
 * @typedef {Object} LeadCardProps
 * @property {Lead}               lead     - The lead data to display.
 * @property {function(Lead): void} onEdit   - Callback to open edit modal for this lead.
 * @property {function(string|number): void} onDelete - Callback to delete this lead by id.
 */

/**
 * LeadCard Component
 * Displays a single lead's details in a visually rich card with action controls.
 *
 * @param {LeadCardProps} props
 * @returns {JSX.Element}
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  /**
   * Derives avatar initials from the contact's full name.
   *
   * @param {string} name
   * @returns {string} Up to 2 uppercase initials.
   */
  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <article
      className="group relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      aria-label={`Lead card for ${lead.name} at ${lead.company}`}
    >
      {/* Top accent bar keyed on status — subtle coloured stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />

      <div className="p-5 space-y-4">
        {/* ── Header row: avatar + name + status ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Initials avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
              {getInitials(lead.name)}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                {lead.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                {lead.company}
              </p>
            </div>
          </div>

          <StatusBadge status={lead.status} className="flex-shrink-0" />
        </div>

        {/* ── Contact details ── */}
        <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <li className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <a
              href={`mailto:${lead.email}`}
              className="truncate hover:text-primary transition-colors"
            >
              {lead.email}
            </a>
          </li>
          {lead.phone && (
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
              <span>{lead.phone}</span>
            </li>
          )}
          <li className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span>{lead.source}</span>
          </li>
        </ul>

        {/* ── Footer: date + actions ── */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-850">
          <time className="text-[11px] text-slate-400 dark:text-slate-500">
            Added {new Date(lead.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </time>

          <div className="flex items-center gap-1">
            {/* Edit button */}
            <button
              type="button"
              onClick={() => onEdit(lead)}
              aria-label={`Edit lead ${lead.name}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => onDelete(lead.id)}
              aria-label={`Delete lead ${lead.name}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default LeadCard;
