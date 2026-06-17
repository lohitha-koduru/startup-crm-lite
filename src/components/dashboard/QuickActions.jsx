import { Plus, Users, Download } from 'lucide-react';

/**
 * @typedef {Object} QuickActionsProps
 * @property {function} [onAddLead] - Callback function when "Add New Lead" is clicked.
 * @property {function} [onViewAll] - Callback function when "View All Leads" is clicked.
 * @property {function} [onExport] - Callback function when "Export Data" is clicked.
 */

/**
 * QuickActions Component
 * Renders a widget containing shortcut action buttons to run common workflow operations.
 *
 * @param {QuickActionsProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered QuickActions component.
 */
const QuickActions = ({ onAddLead, onViewAll, onExport }) => {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-850 shadow-sm space-y-6">
      {/* Widget Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Quick Actions
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Perform frequent CRM operations instantly.
        </p>
      </div>

      {/* Actions Button Stack */}
      <div className="flex flex-col gap-3">
        {/* Add New Lead button */}
        <button
          onClick={onAddLead}
          className="flex items-center justify-center gap-2 w-full px-4.5 py-3 bg-primary hover:bg-primary/95 text-white font-semibold text-sm rounded-xl shadow-md shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          Add New Lead
        </button>

        {/* View All Leads button */}
        <button
          onClick={onViewAll}
          className="flex items-center justify-center gap-2 w-full px-4.5 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850/80 text-slate-750 dark:text-slate-200 border border-slate-250/60 dark:border-slate-800 font-semibold text-sm rounded-xl active:scale-[0.98] transition-all cursor-pointer"
        >
          <Users className="h-4.5 w-4.5 text-primary" />
          View All Leads
        </button>

        {/* Export Data button */}
        <button
          onClick={onExport}
          className="flex items-center justify-center gap-2 w-full px-4.5 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850/80 text-slate-750 dark:text-slate-200 border border-slate-250/60 dark:border-slate-800 font-semibold text-sm rounded-xl active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download className="h-4.5 w-4.5 text-success" />
          Export Leads CSV
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
