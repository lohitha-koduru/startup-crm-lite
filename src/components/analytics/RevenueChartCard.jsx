import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Indian currency formatter
const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

// Custom tooltip renderer
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-semibold border border-slate-800 animate-fadeIn dark:bg-slate-950">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{data.label}</p>
        <p className="text-emerald-450 mt-1 font-bold text-sm">{formatINR(payload[0].value)} Won</p>
      </div>
    );
  }
  return null;
};

export const RevenueChartCard = ({ data = [] }) => {
  const hasRevenue = data.some((item) => item.revenue > 0);

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-350">
      {/* Card Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Revenue Analytics
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Monthly won deal values over the last 6 months.
        </p>
      </div>

      {hasRevenue ? (
        <div className="flex-grow mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <defs>
                {/* Linear gradient definition */}
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-850" />
              <XAxis
                dataKey="name"
                stroke="#94A3B8"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
                  return `₹${val}`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Won Revenue"
                stroke="#22C55E"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationBegin={0}
                animationDuration={950}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center min-h-[288px] border border-dashed border-slate-100 dark:border-slate-850 rounded-xl mt-6">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            No revenue records closed in this period.
          </p>
        </div>
      )}
    </div>
  );
};

export default RevenueChartCard;
