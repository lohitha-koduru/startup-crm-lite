import React from 'react';
import { CalendarRange, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';

const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const ForecastCard = ({ forecastData }) => {
  const forecastVal = forecastData?.forecast || 0;
  const confidence = forecastData?.confidence || 70;
  const growth = forecastData?.growthTrend || '0%';
  const isPositive = !growth.startsWith('-');

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-6 shadow-sm flex flex-col h-full justify-between hover:shadow-md transition-all duration-350">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            Revenue Forecast
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Machine projection for next month's won revenue.
          </p>
        </div>
        <div className="p-2 bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl">
          <CalendarRange className="h-4.5 w-4.5" />
        </div>
      </div>

      {/* Main Metric */}
      <div className="my-6">
        <span className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider block">
          Predicted Revenue Next Month
        </span>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          {formatINR(forecastVal)}
        </div>

        {/* Growth Trend Badge */}
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${
              isPositive
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/25 dark:text-emerald-450'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/25 dark:text-rose-450'
            }`}
          >
            {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {growth}
          </span>
          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
            Projected Trend
          </span>
        </div>
      </div>

      {/* Confidence Score Gauge */}
      <div className="space-y-2.5 border-t border-slate-50 pt-4 dark:border-slate-900">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-indigo-500" />
            Forecast Confidence
          </span>
          <span className="text-slate-850 dark:text-slate-100 font-bold">{confidence}%</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-indigo-650"
            style={{ width: `${confidence}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
          Confidence is calculated based on historical deal quantity, monthly revenue standard deviation, and representative consistency.
        </p>
      </div>
    </div>
  );
};

export default ForecastCard;
