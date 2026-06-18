import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom tooltip renderer
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-semibold border border-slate-800 animate-fadeIn dark:bg-slate-950">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{data.label}</p>
        <p className="text-white mt-1 font-bold text-sm">{payload[0].value} Leads Acquired</p>
      </div>
    );
  }
  return null;
};

export const BarChartCard = ({ data = [] }) => {
  const hasData = data.some((item) => item.leads > 0);

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-350">
      {/* Card Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Monthly Leads Trend
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Historical breakdown of total leads generated.
        </p>
      </div>

      {hasData ? (
        <div className="flex-grow mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                {/* Dotted grid lines styling */}
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
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.04)', radius: 8 }} />
              <Bar
                dataKey="leads"
                name="Leads"
                fill="#2563EB"
                radius={[6, 6, 0, 0]}
                barSize={32}
                animationBegin={0}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center min-h-[288px] border border-dashed border-slate-100 dark:border-slate-850 rounded-xl mt-6">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            No lead acquisitions in the selected period.
          </p>
        </div>
      )}
    </div>
  );
};

export default BarChartCard;
