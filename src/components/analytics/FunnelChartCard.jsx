import React from 'react';
import { FunnelChart, Funnel, Cell, LabelList, ResponsiveContainer, Tooltip } from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';

// Custom tooltip for funnel stages
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-semibold border border-slate-800 animate-fadeIn dark:bg-slate-950">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{data.stage} Stage</p>
        <p className="text-white mt-1 font-bold text-sm">{data.count} Leads</p>
        <div className="space-y-1 mt-1.5 pt-1.5 border-t border-slate-800 text-[11px] text-slate-350">
          <p className="flex justify-between gap-4">
            <span>Overall Conversion:</span>
            <span className="font-bold text-emerald-400">{data.conversionRate}%</span>
          </p>
          {data.dropOffRate > 0 && (
            <p className="flex justify-between gap-4">
              <span>Drop-off from prev:</span>
              <span className="font-bold text-rose-400">{data.dropOffRate}%</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const FunnelChartCard = ({ data = [] }) => {
  const total = data.length > 0 ? data[0].count : 0;

  // Map fields for Recharts Funnel component
  const funnelData = data.map((item) => ({
    ...item,
    name: item.stage,
    value: item.count,
    fill: STATUS_COLORS[item.stage] || '#64748B',
  }));

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-350">
      {/* Card Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Sales Funnel Visualization
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Historical stage-by-stage progression & drop-off rates.
        </p>
      </div>

      {total > 0 ? (
        <div className="flex-grow flex flex-col justify-between mt-6">
          {/* Funnel chart container */}
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart margin={{ top: 10, bottom: 10, left: 10, right: 90 }}>
                <Tooltip content={<CustomTooltip />} />
                <Funnel
                  data={funnelData}
                  dataKey="value"
                  isAnimationActive
                  animationDuration={850}
                >
                  {funnelData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} style={{ outline: 'none' }} />
                  ))}
                  <LabelList
                    position="right"
                    fill="#64748B"
                    stroke="none"
                    dataKey="name"
                    fontSize={11}
                    fontWeight={600}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          {/* Funnel Metrics Table */}
          <div className="space-y-2.5 mt-4 border-t border-slate-50 pt-4 dark:border-slate-900">
            {data.map((stage, idx) => {
              const fill = STATUS_COLORS[stage.stage] || '#64748B';
              return (
                <div key={idx} className="flex items-center justify-between text-xs">
                  {/* Left: Stage Label and Bullet */}
                  <div className="flex items-center gap-2 w-1/4">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: fill }} />
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{stage.stage}</span>
                  </div>

                  {/* Mid: Progress Bar of Conversion */}
                  <div className="flex-grow mx-4 max-w-[45%] bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stage.conversionRate}%`,
                        backgroundColor: fill,
                      }}
                    />
                  </div>

                  {/* Right: Quantities */}
                  <div className="flex items-center justify-end gap-3 text-right w-1/4 font-semibold text-slate-500 dark:text-slate-400">
                    <span className="text-slate-850 dark:text-slate-100 font-bold">{stage.count}</span>
                    <span className="text-[10px] w-8">{stage.conversionRate}%</span>
                    <span className="text-[10px] text-rose-500 w-8">
                      {stage.dropOffRate > 0 ? `-${stage.dropOffRate}%` : '0%'}
                    </span>
                  </div>
                </div>
              );
            })}
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

export default FunnelChartCard;
