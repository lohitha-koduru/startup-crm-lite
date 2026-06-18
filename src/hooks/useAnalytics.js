import { useState, useEffect, useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import * as helpers from '../utils/analyticsHelpers';

export const useAnalytics = () => {
  const { leads } = useLeads();
  const [filterType, setFilterType] = useState('30days'); // default 'Last 30 Days'
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);

  // Trigger brief visual loading transition when filter changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [filterType, customRange]);

  // Determine current date range bounds
  const dateRange = useMemo(() => {
    const end = new Date();
    let start = new Date();

    switch (filterType) {
      case '7days':
        start.setDate(end.getDate() - 7);
        break;
      case '30days':
        start.setDate(end.getDate() - 30);
        break;
      case '90days':
        start.setDate(end.getDate() - 90);
        break;
      case 'year':
        start = new Date(end.getFullYear(), 0, 1);
        break;
      case 'custom':
        if (customRange.start && customRange.end) {
          return {
            start: new Date(customRange.start),
            end: new Date(customRange.end),
            duration: new Date(customRange.end) - new Date(customRange.start),
          };
        }
        // Fallback if custom range is incomplete
        start.setDate(end.getDate() - 30);
        break;
      default:
        start.setDate(end.getDate() - 30);
    }

    return {
      start,
      end,
      duration: end - start,
    };
  }, [filterType, customRange]);

  // Determine previous date range bounds for delta comparisons
  const prevDateRange = useMemo(() => {
    const end = new Date(dateRange.start.getTime() - 1);
    const start = new Date(end.getTime() - dateRange.duration);
    return { start, end };
  }, [dateRange]);

  // Memoize filtered leads for the active period
  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads.filter((l) => {
      if (!l?.createdAt) return false;
      const date = new Date(l.createdAt);
      return date >= dateRange.start && date <= dateRange.end;
    });
  }, [leads, dateRange]);

  // Memoize filtered leads for the previous period
  const prevFilteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads.filter((l) => {
      if (!l?.createdAt) return false;
      const date = new Date(l.createdAt);
      return date >= prevDateRange.start && date <= prevDateRange.end;
    });
  }, [leads, prevDateRange]);

  // Compute stats for current period
  const stats = useMemo(() => {
    const totalLeads = filteredLeads.length;
    
    const wonLeads = filteredLeads.filter((l) => l.status === 'Won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    
    const pipelineValue = helpers.getPipelineValue(filteredLeads);
    const wonRevenue = helpers.getWonRevenue(filteredLeads);
    const avgSalesCycle = helpers.getAverageSalesCycle(filteredLeads);
    const lostRate = helpers.getLostRate(filteredLeads);

    return {
      totalLeads,
      conversionRate,
      pipelineValue,
      wonRevenue,
      avgSalesCycle,
      lostRate,
    };
  }, [filteredLeads]);

  // Compute stats for previous period (to show arrows & percentage improvements)
  const prevStats = useMemo(() => {
    const totalLeads = prevFilteredLeads.length;
    const wonLeads = prevFilteredLeads.filter((l) => l.status === 'Won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    const pipelineValue = helpers.getPipelineValue(prevFilteredLeads);
    const wonRevenue = helpers.getWonRevenue(prevFilteredLeads);
    const avgSalesCycle = helpers.getAverageSalesCycle(prevFilteredLeads);
    const lostRate = helpers.getLostRate(prevFilteredLeads);

    return {
      totalLeads,
      conversionRate,
      pipelineValue,
      wonRevenue,
      avgSalesCycle,
      lostRate,
    };
  }, [prevFilteredLeads]);

  // Aggregate charts data using ALL leads (since monthly trends must show last 6 months)
  const chartsData = useMemo(() => {
    const allLeads = leads || [];
    return {
      statusDistribution: helpers.getStatusDistribution(filteredLeads), // status uses filtered range
      funnelData: helpers.getFunnelData(filteredLeads), // funnel uses filtered range
      monthlyLeads: helpers.getMonthlyLeads(allLeads),
      monthlyConversion: helpers.getConversionByMonth(allLeads),
      monthlyRevenue: helpers.getRevenueByMonth(allLeads),
      leadSources: helpers.getLeadSourceStats(filteredLeads), // source uses filtered range
      salesVelocity: helpers.getSalesVelocity(filteredLeads),
      prevSalesVelocity: helpers.getSalesVelocity(prevFilteredLeads),
      forecast: helpers.getForecastRevenue(allLeads),
      topPerformers: helpers.getTopPerformers(filteredLeads), // performance uses filtered range
      heatmapData: helpers.getActivityHeatmapData(allLeads),
    };
  }, [leads, filteredLeads, prevFilteredLeads]);

  return {
    filteredLeads,
    stats,
    prevStats,
    chartsData,
    loading,
    filterType,
    setFilterType,
    customRange,
    setCustomRange,
  };
};
