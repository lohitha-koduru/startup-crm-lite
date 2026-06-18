import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom tooltip renderer
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-semibold border border-slate-800 animate-fadeIn dark:bg-slate-950">
        <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">{data.name}</p>
        <p className="text-white mt-1 font-bold text-sm">{payload[0].value} Leads</p>
      </div>
    );
  }
  return null;
};

export const LeadSourceChart = ({ data = [] }) => {
  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-350">
      {/* Card Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Lead Source Analytics
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Distribution of leads across various acquisition channels.
        </p>
      </div>

      {totalLeads > 0 ? (
        <div className="flex-grow mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" className="dark:stroke-slate-850" />
              <XAxis
                type="number"
                stroke="#94A3B8"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94A3B8"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.04)', radius: 6 }} />
              <Bar
                dataKey="value"
                name="Leads"
                fill="#6366F1"
                radius={[0, 6, 6, 0]}
                barSize={18}
                animationBegin={0}
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center min-h-[288px] border border-dashed border-slate-100 dark:border-slate-850 rounded-xl mt-6">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            No source metrics recorded.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadSourceChart;
