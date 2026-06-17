

/**
 * @typedef {Object} Lead
 * @property {string|number} id - Unique identifier.
 * @property {string} name - Contact person name.
 * @property {string} company - Organization/startup name.
 * @property {string} status - Lead stage (e.g. "New", "Contacted", "Qualified", "Proposal Sent", "Closed Won").
 * @property {string} value - Financial deal value.
 * @property {string} dateAdded - Date string when the lead was added.
 */

/**
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - Array of lead data objects.
 */

/**
 * RecentLeads Component
 * Renders a clean list of the 5 most recently added leads in a responsive table.
 *
 * @param {RecentLeadsProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered RecentLeads component.
 */
const RecentLeads = ({ leads = [] }) => {
  // Sort leads by date added (descending) and take the top 5
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 5);

  /**
   * Helper function to extract initials from a lead's name for the avatar indicator.
   *
   * @param {string} name - The name of the lead.
   * @returns {string} The first letters of the name (up to 2 characters).
   */
  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  /**
   * Helper function to format ISO date strings into a cleaner layout.
   *
   * @param {string} dateStr - Date string.
   * @returns {string} Formatted date text.
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Status-to-Badge styling map to match the application's overall design system
  const statusStyles = {
    'New': 'bg-primary/10 text-primary border-primary/20',
    'Contacted': 'bg-warning/10 text-warning border-warning/20',
    'Qualified': 'bg-success/10 text-success border-success/20',
    'Proposal Sent': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    'Closed Won': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-sm overflow-hidden">
      {/* Table Header Section */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-850">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Recent Leads
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Review the newest startup accounts added to the system.
        </p>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 dark:bg-slate-900/20 dark:border-slate-850 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Name / Company</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Deal Value</th>
              <th className="py-4 px-6">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors"
                >
                  {/* Name and Company column with Initial Avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-xs text-slate-650 dark:text-slate-350 border border-slate-200/40 dark:border-slate-800">
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                          {lead.name}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                          {lead.company}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        statusStyles[lead.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-900'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  {/* Financial value */}
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                      {lead.value}
                    </span>
                  </td>

                  {/* Date added */}
                  <td className="py-4 px-6 text-xs text-slate-450 dark:text-slate-500 font-medium">
                    {formatDate(lead.dateAdded)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-12 text-center">
                  <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">
                    No leads available.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;
