import React from 'react';
import {
  Users,
  Target,
  TrendingUp,
  Trophy,
  Clock,
  Skull,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Indian currency formatter
const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export const StatsCards = ({ stats, prevStats }) => {
  // Utility to calculate percentage change
  const getChange = (current, previous, invertGood = false) => {
    if (!previous || previous === 0) {
      if (current > 0) return { text: '+100%', isPositive: !invertGood, isNeutral: false };
      return { text: '0%', isPositive: false, isNeutral: true };
    }
    const diff = current - previous;
    const percentage = Math.round((diff / previous) * 100);
    const sign = percentage >= 0 ? '+' : '';
    
    // For metrics like Lost Rate or Sales Cycle: LOWER is better (invertGood = true)
    let isPositive = percentage >= 0;
    if (invertGood) {
      isPositive = percentage <= 0;
    }

    return {
      text: `${sign}${percentage}%`,
      isPositive,
      rawPct: percentage,
      isNeutral: percentage === 0
    };
  };

  const totalLeadsChange = getChange(stats.totalLeads, prevStats.totalLeads);
  const conversionRateChange = getChange(stats.conversionRate, prevStats.conversionRate);
  const pipelineValueChange = getChange(stats.pipelineValue, prevStats.pipelineValue);
  const wonRevenueChange = getChange(stats.wonRevenue, prevStats.wonRevenue);
  
  // Sales cycle: LOWER is better
  const avgSalesCycleChange = getChange(stats.avgSalesCycle, prevStats.avgSalesCycle, true);
  
  // Lost rate: LOWER is better
  const lostRateChange = getChange(stats.lostRate, prevStats.lostRate, true);

  const cards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      change: totalLeadsChange,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Target,
      change: conversionRateChange,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400',
    },
    {
      title: 'Pipeline Value',
      value: formatINR(stats.pipelineValue),
      icon: TrendingUp,
      change: pipelineValueChange,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400',
    },
    {
      title: 'Won Revenue',
      value: formatINR(stats.wonRevenue),
      icon: Trophy,
      change: wonRevenueChange,
      color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400',
    },
    {
      title: 'Average Sales Cycle',
      value: `${stats.avgSalesCycle} Days`,
      icon: Clock,
      change: avgSalesCycleChange,
      color: 'bg-sky-50 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400',
    },
    {
      title: 'Lost Rate',
      value: `${stats.lostRate}%`,
      icon: Skull,
      change: lostRateChange,
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const trend = card.change;
        const arrowUp = trend.rawPct >= 0;

        return (
          <div
            key={i}
            className="group bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
          >
            {/* Header: Title + Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider truncate">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl flex-shrink-0 ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-4 space-y-1">
              <div className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
                {card.value}
              </div>

              {/* Trend Delta indicator */}
              <div className="flex items-center gap-1">
                {trend.isNeutral ? (
                  <span className="text-[10px] font-bold text-slate-400">No change</span>
                ) : (
                  <>
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-lg ${
                        trend.isPositive
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/25 dark:text-emerald-450'
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/25 dark:text-rose-450'
                      }`}
                    >
                      {arrowUp ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {trend.text}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                      vs prev
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
