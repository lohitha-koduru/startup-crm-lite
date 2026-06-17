/**
 * @file StatusBadge.jsx
 * @description Pill-shaped colored badge for displaying lead pipeline status.
 *
 * Each status maps to a unique color combination so reps can scan the
 * pipeline at a glance without reading the text.
 */

/**
 * Color configuration keyed by status label.
 * Uses Tailwind utility classes backed by the app's CSS theme variables.
 */
const STATUS_STYLES = {
  'New':                'bg-slate-100  text-slate-600  border-slate-200  dark:bg-slate-800  dark:text-slate-300  dark:border-slate-700',
  'Contacted':          'bg-blue-50    text-blue-700   border-blue-100   dark:bg-blue-950/30 dark:text-blue-400  dark:border-blue-900/40',
  'Meeting Scheduled':  'bg-warning/10 text-warning    border-warning/20',
  'Proposal Sent':      'bg-indigo-50  text-indigo-700 border-indigo-100  dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/40',
  'Won':                'bg-success/10 text-success    border-success/20',
  'Lost':               'bg-danger/10  text-danger     border-danger/20',
};

/**
 * @typedef {Object} StatusBadgeProps
 * @property {string} status - The lead status label to render.
 * @property {string} [className] - Additional Tailwind classes for layout overrides.
 */

/**
 * StatusBadge Component
 * Renders a compact, colour-coded pill badge for a lead's pipeline stage.
 *
 * @param {StatusBadgeProps} props
 * @returns {JSX.Element}
 */
const StatusBadge = ({ status, className = '' }) => {
  const styles = STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
