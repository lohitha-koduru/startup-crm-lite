import React from 'react';
import { Zap, ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';

const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const SalesVelocityCard = ({ velocityData, prevVelocityData }) => {
  const current = velocityData?.velocity || 0;
  const previous = prevVelocityData?.velocity || 0;

  // Compute delta trend
  let changeText = '0%';
  let isPositive = true;
  let isNeutral = true;

  if (previous > 0) {
    const pct = Math.round(((current - previous) / previous) * 100);
    changeText = `${pct >= 0 ? '+' : ''}${pct}%`;
    isPositive = pct >= 0;
    isNeutral = pct === 0;
  } else if (current > 0) {
    changeText = '+100%';
    isPositive = true;
    isNeutral = false;
  }

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-6 shadow-sm flex flex-col h-full justify-between hover:shadow-md transition-all duration-350">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            Sales Velocity Widget
            <div className="relative group">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2.5 rounded-lg shadow-xl w-48 text-center leading-normal z-10 dark:bg-slate-800">
                Formula: (Opps × Win Rate% × Avg Size) ÷ Cycle Length. Measures deal value closed per day.
              </div>
            </div>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Speed at which deals move through your pipeline.
          </p>
        </div>
        <div className="p-2 bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-xl">
          <Zap className="h-4.5 w-4.5 animate-pulse" />
        </div>
      </div>

      {/* Main Metric */}
      <div className="my-6">
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {formatINR(current)}
          <span className="text-xs font-semibold text-slate-450 dark:text-slate-400 normal-case ml-1">/ day</span>
        </div>

        {/* Comparison trend */}
        <div className="flex items-center gap-1.5 mt-2">
          {isNeutral ? (
            <span className="text-xs font-bold text-slate-400">No change vs previous period</span>
          ) : (
            <>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${
                  isPositive
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/25 dark:text-emerald-450'
                    : 'bg-rose-50 text-rose-600 dark:bg-rose-950/25 dark:text-rose-450'
                }`}
              >
                {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {changeText}
              </span>
              <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">
                vs previous period
              </span>
            </>
          )}
        </div>
      </div>

      {/* Formula Variables Listing */}
      <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-4 dark:border-slate-900 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="p-2.5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850/50 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Opportunities</span>
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">
            {velocityData?.opps || 0} active
          </span>
        </div>
        <div className="p-2.5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850/50 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Win Rate</span>
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">
            {velocityData?.winRate || 0}%
          </span>
        </div>
        <div className="p-2.5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850/50 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Avg Deal Size</span>
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">
            {formatINR(velocityData?.avgDealSize || 0)}
          </span>
        </div>
        <div className="p-2.5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850/50 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Sales Cycle</span>
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">
            {velocityData?.avgSalesCycle || 0} days
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalesVelocityCard;
