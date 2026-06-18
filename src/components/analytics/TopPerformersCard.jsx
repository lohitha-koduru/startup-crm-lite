import React from 'react';
import { Medal, Trophy } from 'lucide-react';

const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const TopPerformersCard = ({ reps = [] }) => {
  // Avatars initials helper
  const getInitials = (name) => {
    return name.slice(0, 2).toUpperCase();
  };

  // Rank badge styling helper
  const getRankBadgeClass = (index) => {
    if (index === 0) return 'bg-amber-100 text-amber-700 dark:bg-amber-950/45 dark:text-amber-400 border border-amber-300/30';
    if (index === 1) return 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border border-slate-300/30';
    if (index === 2) return 'bg-amber-600/10 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500 border border-amber-800/20';
    return 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-450';
  };

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-350 justify-between">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            Top Performers
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Ranked sales reps by total closed won deal revenue.
          </p>
        </div>
        <div className="p-2 bg-yellow-50 text-yellow-650 dark:bg-yellow-950/20 dark:text-yellow-405 rounded-xl">
          <Trophy className="h-4.5 w-4.5" />
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex-grow my-4 space-y-3.5">
        {reps.length > 0 ? (
          reps.map((rep, idx) => {
            const rankBadgeClass = getRankBadgeClass(idx);
            
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-900/25 border border-slate-100 dark:border-slate-850/55 rounded-2xl hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-200"
              >
                {/* Rep Details */}
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center ${rankBadgeClass}`}>
                    {idx + 1}
                  </span>

                  {/* Avatar initials */}
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-200/10">
                    {getInitials(rep.name)}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-100 block">
                      {rep.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold">
                      {rep.deals} deals closed
                    </span>
                  </div>
                </div>

                {/* Closed won values */}
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                    {formatINR(rep.revenue)}
                  </span>
                  {idx === 0 && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-600 uppercase tracking-wider">
                      <Medal className="h-3 w-3" /> MVP Leader
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center min-h-[200px] border border-dashed border-slate-100 dark:border-slate-850 rounded-xl">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              No sales representatives have closed deals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPerformersCard;
