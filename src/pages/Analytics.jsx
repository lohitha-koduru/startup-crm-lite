import React from 'react';
import { useLeads } from '../context/LeadContext';
import { useAnalytics } from '../hooks/useAnalytics';

// Import subcomponents
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

/**
 * Analytics Page Component
 * Orchestrates date filters, KPI summarizations, data charts, and advanced CRM projections.
 */
export const Analytics = () => {
  const { leads } = useLeads();
  const {
    stats,
    prevStats,
    chartsData,
    loading,
    filterType,
    setFilterType,
    customRange,
    setCustomRange,
  } = useAnalytics();

  // 1. If database has no leads at all, show the empty state immediately
  if (!leads || leads.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-[#0d0d0e] p-6 sm:p-8 font-roboto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Track sales performance and growth trends.
            </p>
          </div>
          <EmptyAnalyticsState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0d0d0e] p-6 sm:p-8 font-roboto transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
              Track sales performance and growth trends.
            </p>
          </div>
        </div>

        {/* Filters Panel */}
        <AnalyticsFilters
          filterType={filterType}
          setFilterType={setFilterType}
          customRange={customRange}
          setCustomRange={setCustomRange}
        />

        {/* Main Dashboard Render */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards Row */}
            <StatsCards stats={stats} prevStats={prevStats} />

            {/* Layout Grid: 2 columns on Desktop/Tablet (md+), 1 column on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Row 1: Pie Chart & Funnel Chart */}
              <div className="h-full">
                <PieChartCard data={chartsData.statusDistribution} />
              </div>
              <div className="h-full">
                <FunnelChartCard data={chartsData.funnelData} />
              </div>

              {/* Row 2: Bar Chart & Line Chart */}
              <div className="h-full">
                <BarChartCard data={chartsData.monthlyLeads} />
              </div>
              <div className="h-full">
                <LineChartCard data={chartsData.monthlyConversion} />
              </div>

              {/* Row 3: Revenue Chart & Lead Source Chart */}
              <div className="h-full">
                <RevenueChartCard data={chartsData.monthlyRevenue} />
              </div>
              <div className="h-full">
                <LeadSourceChart data={chartsData.leadSources} />
              </div>

              {/* Row 4: Heatmap & Top Performers */}
              <div className="h-full">
                <ActivityHeatmap data={chartsData.heatmapData} />
              </div>
              <div className="h-full">
                <TopPerformersCard reps={chartsData.topPerformers} />
              </div>

              {/* Row 5: Forecast Card & Sales Velocity Card */}
              <div className="h-full">
                <ForecastCard forecastData={chartsData.forecast} />
              </div>
              <div className="h-full">
                <SalesVelocityCard
                  velocityData={chartsData.salesVelocity}
                  prevVelocityData={chartsData.prevSalesVelocity}
                />
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analytics;
