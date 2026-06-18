

/**
 * @typedef {Object} Lead
 * @property {string|number} id - Unique identifier.
 * @property {string} name - Contact person name.
 * @property {string} company - Organization/startup name.
 * @property {string} status - Lead stage.
 * @property {string} [createdAt] - ISO format or friendly date string.
 */

/**
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - Array of lead data objects.
 */

/**
 * PipelineOverview Component
 * Renders a segmented horizontal bar representing the distribution of leads across sales pipeline stages.
 *
 * @param {PipelineOverviewProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered PipelineOverview component.
 */
const PipelineOverview = ({ leads = [] }) => {
  const totalLeads = leads.length;

  // Configuration for pipeline stages including custom styling tokens
  const stageConfig = {
    'New': {
      color: 'bg-primary',
      textColor: 'text-primary',
      bgLight: 'bg-primary/10',
      border: 'border-primary/20',
    },
    'Contacted': {
      color: 'bg-warning',
      textColor: 'text-warning',
      bgLight: 'bg-warning/10',
      border: 'border-warning/20',
    },
    'Meeting Scheduled': {
      color: 'bg-success',
      textColor: 'text-success',
      bgLight: 'bg-success/10',
      border: 'border-success/20',
    },
    'Proposal Sent': {
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      bgLight: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
    'Won': {
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgLight: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    'Lost': {
      color: 'bg-danger',
      textColor: 'text-danger',
      bgLight: 'bg-danger/10',
      border: 'border-danger/20',
    },
  };

  // Calculate lead counts and percentages per stage
  const pipelineSegments = Object.keys(stageConfig).map((stage) => {
    const count = leads.filter((lead) => lead.status === stage).length;
    const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
    
    return {
      stage,
      count,
      percentage,
      ...stageConfig[stage],
    };
  });

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-850 shadow-sm space-y-6">
      {/* Component Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Pipeline Overview
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Visual distribution of lead stages in the current sales cycle.
        </p>
      </div>

      {/* Segmented Horizontal Bar */}
      {totalLeads > 0 ? (
        <div className="space-y-4">
          <div className="w-full h-4.5 bg-slate-100 dark:bg-slate-900 rounded-full flex overflow-hidden">
            {pipelineSegments.map(
              (segment) =>
                segment.count > 0 && (
                  <div
                    key={segment.stage}
                    style={{ width: `${segment.percentage}%` }}
                    className={`${segment.color} h-full transition-all duration-500 relative group`}
                    title={`${segment.stage}: ${segment.count} (${segment.percentage.toFixed(1)}%)`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-md whitespace-nowrap z-10 dark:bg-slate-800">
                      {segment.stage}: {segment.count} ({segment.percentage.toFixed(1)}%)
                    </div>
                  </div>
                )
            )}
          </div>

          {/* Detailed Metric Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
            {pipelineSegments.map((segment) => (
              <div
                key={segment.stage}
                className={`flex flex-col p-3 rounded-xl border border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-200`}
              >
                {/* Stage Badge & Label */}
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${segment.color}`}></span>
                  <span className="text-xs font-semibold text-slate-650 dark:text-slate-300 truncate">
                    {segment.stage}
                  </span>
                </div>

                {/* Quantitative metrics */}
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {segment.count}
                  </span>
                  <span className={`text-[10px] font-bold ${segment.textColor}`}>
                    {segment.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Empty placeholder state
        <div className="py-8 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-850 rounded-xl">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            No pipeline leads recorded.
          </p>
        </div>
      )}
    </div>
  );
};

export default PipelineOverview;
