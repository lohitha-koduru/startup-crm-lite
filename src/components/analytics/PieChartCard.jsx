import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Custom active shape for slice expansion on hover
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

// Custom tooltip renderer
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-semibold border border-slate-800 animate-fadeIn dark:bg-slate-950">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{data.name}</p>
        <p className="text-white mt-1 font-bold text-sm">{data.value} Leads</p>
        <p className="text-emerald-400 text-[10px] mt-0.5">{data.percentage}% of pipeline</p>
      </div>
    );
  }
  return null;
};

export const PieChartCard = ({ data = [] }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-350">
      {/* Card Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Lead Status Distribution
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Quantitative ratio of pipeline stages.
        </p>
      </div>

      {totalLeads > 0 ? (
        <div className="flex-grow flex flex-col justify-between mt-4">
          {/* Chart Wrapper with relative position for the center absolute text */}
          <div className="relative h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Absolute Centered Doughnut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
                {totalLeads}
              </span>
              <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider mt-1.5">
                Total Leads
              </span>
            </div>
          </div>

          {/* Legends Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 border-t border-slate-50 pt-4 dark:border-slate-900">
            {data.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-2 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850/50 rounded-xl"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {entry.name}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {entry.value}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                    {entry.percentage}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center min-h-[300px] border border-dashed border-slate-100 dark:border-slate-850 rounded-xl mt-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            No pipeline leads recorded.
          </p>
        </div>
      )}
    </div>
  );
};

export default PieChartCard;
