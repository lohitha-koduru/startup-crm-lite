import { STATUS_COLORS } from '../constants/analyticsColors';

/**
 * Pure functions for Startup CRM Lite analytics calculations.
 * Features strict null-safety, defensive defaults, and memoization-friendly structures.
 */

// Helper to format Date objects to YYYY-MM-DD
const formatDateStr = (date) => {
  if (!date) return '';
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch {
    return '';
  }
};

// Helper to check if a date is within a range
const isDateInRange = (dateStr, startDate, endDate) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d >= new Date(startDate) && d <= new Date(endDate);
};

// Helper to generate the last 6 months labels (e.g., ['Jan', 'Feb', ...])
const getLast6MonthsRange = () => {
  const months = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      name: monthNames[d.getMonth()],
      monthNum: d.getMonth(),
      year: d.getFullYear(),
      label: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`,
    });
  }
  return months;
};

/**
 * 1. getStatusDistribution(leads)
 * Groups leads by status and maps to shortened names.
 */
export const getStatusDistribution = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const total = leads.length;
  if (total === 0) return [];

  // Group by status
  const counts = {};
  leads.forEach((l) => {
    let status = l?.status || 'New';
    // Map database labels to shorter labels
    if (status === 'Meeting Scheduled') status = 'Meeting';
    if (status === 'Proposal Sent') status = 'Proposal';
    counts[status] = (counts[status] || 0) + 1;
  });

  // Calculate percentages and add colors
  return Object.keys(counts).map((status) => {
    const count = counts[status];
    const percentage = Math.round((count / total) * 100);
    return {
      name: status,
      value: count,
      percentage,
      color: STATUS_COLORS[status] || '#64748B',
    };
  });
};

/**
 * 2. getMonthlyLeads(leads)
 * Group lead volume created by month for the last 6 months.
 */
export const getMonthlyLeads = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const months = getLast6MonthsRange();

  return months.map((m) => {
    const count = leads.filter((l) => {
      if (!l?.createdAt) return false;
      const createdDate = new Date(l.createdAt);
      return createdDate.getMonth() === m.monthNum && createdDate.getFullYear() === m.year;
    }).length;

    return {
      name: m.name,
      label: m.label,
      leads: count,
    };
  });
};

/**
 * 3. getConversionByMonth(leads)
 * Calculates monthly conversion rate (Won/Total) for the last 6 months.
 */
export const getConversionByMonth = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const months = getLast6MonthsRange();

  return months.map((m) => {
    const monthlyLeads = leads.filter((l) => {
      if (!l?.createdAt) return false;
      const createdDate = new Date(l.createdAt);
      return createdDate.getMonth() === m.monthNum && createdDate.getFullYear() === m.year;
    });

    const total = monthlyLeads.length;
    const won = monthlyLeads.filter((l) => l?.status === 'Won').length;
    const rate = total > 0 ? Math.round((won / total) * 100) : 0;

    return {
      name: m.name,
      label: m.label,
      rate,
    };
  });
};

/**
 * 4. getRevenueByMonth(leads)
 * Tallies total won deal values per month using wonAt falling back to createdAt.
 */
export const getRevenueByMonth = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const months = getLast6MonthsRange();
  const wonLeads = leads.filter((l) => l?.status === 'Won');

  return months.map((m) => {
    const revenue = wonLeads.reduce((sum, l) => {
      const dateStr = l?.wonAt || l?.createdAt;
      if (!dateStr) return sum;
      const date = new Date(dateStr);
      if (date.getMonth() === m.monthNum && date.getFullYear() === m.year) {
        return sum + (Number(l?.value) || 0);
      }
      return sum;
    }, 0);

    return {
      name: m.name,
      label: m.label,
      revenue,
    };
  });
};

/**
 * 5. getPipelineValue(leads)
 * Sum of all active lead values (excluding Won and Lost).
 */
export const getPipelineValue = (leads = []) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((l) => l?.status !== 'Won' && l?.status !== 'Lost')
    .reduce((sum, l) => sum + (Number(l?.value) || 0), 0);
};

/**
 * 6. getWonRevenue(leads)
 * Sum of won deal values.
 */
export const getWonRevenue = (leads = []) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((l) => l?.status === 'Won')
    .reduce((sum, l) => sum + (Number(l?.value) || 0), 0);
};

/**
 * 7. getAverageSalesCycle(leads)
 * Computes average days between createdAt and wonAt for Won leads.
 */
export const getAverageSalesCycle = (leads = []) => {
  if (!Array.isArray(leads)) return 0;
  const wonLeads = leads.filter((l) => l?.status === 'Won' && l?.createdAt && l?.wonAt);
  if (wonLeads.length === 0) return 0;

  const totalDays = wonLeads.reduce((sum, l) => {
    const created = new Date(l.createdAt);
    const won = new Date(l.wonAt);
    const diffTime = Math.max(0, won - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);

  return Math.round(totalDays / wonLeads.length);
};

/**
 * 8. getLostRate(leads)
 * Ratio of lost leads to total leads.
 */
export const getLostRate = (leads = []) => {
  if (!Array.isArray(leads) || leads.length === 0) return 0;
  const lost = leads.filter((l) => l?.status === 'Lost').length;
  return Math.round((lost / leads.length) * 100);
};

/**
 * 9. getLeadSourceStats(leads)
 * Counts leads by source and sorts descending.
 */
export const getLeadSourceStats = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const counts = {};
  leads.forEach((l) => {
    const source = l?.source || 'Other';
    counts[source] = (counts[source] || 0) + 1;
  });

  return Object.keys(counts)
    .map((source) => ({
      name: source,
      value: counts[source],
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * 10. getFunnelData(leads)
 * Calculates historical conversion & drop-off for funnel stages.
 * Stages: New -> Contacted -> Meeting -> Proposal -> Won
 */
export const getFunnelData = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const total = leads.length;
  if (total === 0) return [];

  // Count leads that reached each stage (using status transitions & current status fallbacks)
  const reachedNew = total;
  const reachedContacted = leads.filter((l) => l?.contactedAt || l?.status !== 'New').length;
  const reachedMeeting = leads.filter(
    (l) => l?.meetingAt || ['Meeting Scheduled', 'Meeting', 'Proposal Sent', 'Proposal', 'Won'].includes(l?.status)
  ).length;
  const reachedProposal = leads.filter(
    (l) => l?.proposalAt || ['Proposal Sent', 'Proposal', 'Won'].includes(l?.status)
  ).length;
  const reachedWon = leads.filter((l) => l?.wonAt || l?.status === 'Won').length;

  const rawStages = [
    { name: 'New', value: reachedNew },
    { name: 'Contacted', value: reachedContacted },
    { name: 'Meeting', value: reachedMeeting },
    { name: 'Proposal', value: reachedProposal },
    { name: 'Won', value: reachedWon },
  ];

  return rawStages.map((stage, idx, arr) => {
    const conversionRate = total > 0 ? Math.round((stage.value / total) * 100) : 0;
    
    // Drop-off rate is relative to previous stage
    let dropOffRate = 0;
    if (idx > 0) {
      const prevVal = arr[idx - 1].value;
      dropOffRate = prevVal > 0 ? Math.round(((prevVal - stage.value) / prevVal) * 100) : 0;
    }

    return {
      stage: stage.name,
      count: stage.value,
      conversionRate,
      dropOffRate,
    };
  });
};

/**
 * 11. getSalesVelocity(leads)
 * Sales Velocity = (Opportunities * Win Rate * Avg Deal Size) / Avg Sales Cycle Length
 */
export const getSalesVelocity = (leads = []) => {
  if (!Array.isArray(leads) || leads.length === 0) return { velocity: 0, comparison: 0 };

  // Opportunities = Active leads (New, Contacted, Meeting, Proposal)
  const opps = leads.filter((l) => l?.status !== 'Won' && l?.status !== 'Lost').length;
  
  // Win Rate = Won / (Won + Lost)
  const wonCount = leads.filter((l) => l?.status === 'Won').length;
  const lostCount = leads.filter((l) => l?.status === 'Lost').length;
  const closedCount = wonCount + lostCount;
  const winRate = closedCount > 0 ? wonCount / closedCount : 0.2; // fallback default 20% if none closed

  // Avg Deal Size of all leads with values
  const leadsWithVal = leads.filter((l) => Number(l?.value) > 0);
  const avgDealSize = leadsWithVal.length > 0
    ? leadsWithVal.reduce((sum, l) => sum + Number(l.value), 0) / leadsWithVal.length
    : 25000; // default 25,000 fallback

  // Avg Sales Cycle Length
  const avgSalesCycle = getAverageSalesCycle(leads) || 14; // default 14 days fallback

  // Calculate velocity: deal value closed per day
  const velocity = Math.round((opps * winRate * avgDealSize) / avgSalesCycle);

  return {
    velocity,
    opps,
    winRate: Math.round(winRate * 100),
    avgDealSize: Math.round(avgDealSize),
    avgSalesCycle,
  };
};

/**
 * 12. getForecastRevenue(leads)
 * Predicted revenue based on won revenue of last 6 months.
 */
export const getForecastRevenue = (leads = []) => {
  if (!Array.isArray(leads)) return { forecast: 0, confidence: 70, growthTrend: '0%' };
  const monthlyRev = getRevenueByMonth(leads);
  
  const revenues = monthlyRev.map((m) => m.revenue);
  const activeMonths = revenues.filter((r) => r > 0).length;
  const avgRevenue = revenues.reduce((sum, r) => sum + r, 0) / (activeMonths || 1);

  // Growth Trend: Compare average of last 3 months vs previous 3 months
  const last3 = revenues.slice(-3).reduce((sum, r) => sum + r, 0);
  const prev3 = revenues.slice(0, 3).reduce((sum, r) => sum + r, 0);
  
  let growth = 0;
  if (prev3 > 0) {
    growth = ((last3 - prev3) / prev3) * 100;
  } else if (last3 > 0) {
    growth = 15; // default conservative growth if no historical baseline
  }

  const growthFactor = 1 + (growth / 100);
  const forecast = Math.round(avgRevenue * Math.max(0.5, Math.min(2, growthFactor)));

  // Confidence based on lead volume & consistency of sales
  const wonCount = leads.filter((l) => l?.status === 'Won').length;
  let confidence = 75;
  if (wonCount > 15) confidence = 90;
  else if (wonCount > 5) confidence = 82;
  else if (wonCount === 0) confidence = 50;

  const growthTrendStr = growth >= 0 ? `+${Math.round(growth)}%` : `${Math.round(growth)}%`;

  return {
    forecast,
    confidence,
    growthTrend: growthTrendStr,
  };
};

/**
 * 13. getTopPerformers(leads)
 * Leaderboard ranking of rep owners by won revenue.
 */
export const getTopPerformers = (leads = []) => {
  if (!Array.isArray(leads)) return [];
  const wonLeads = leads.filter((l) => l?.status === 'Won');
  const reps = {};

  wonLeads.forEach((l) => {
    const owner = l?.owner || 'Sarah';
    const val = Number(l?.value) || 0;
    if (!reps[owner]) {
      reps[owner] = { name: owner, revenue: 0, deals: 0 };
    }
    reps[owner].revenue += val;
    reps[owner].deals += 1;
  });

  return Object.values(reps)
    .sort((a, b) => b.revenue - a.revenue);
};

/**
 * 14. getActivityHeatmapData(leads)
 * Contribution activity count per day for the last 30 days.
 */
export const getActivityHeatmapData = (leads = []) => {
  if (!Array.isArray(leads)) return [];

  // Generate date array for the last 30 days up to today
  const activityMap = {};
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const dateStr = formatDateStr(date);
    activityMap[dateStr] = {
      date: dateStr,
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: 0,
      details: { created: 0, meetings: 0, calls: 0 }
    };
  }

  // Populate activity details
  leads.forEach((l) => {
    // 1. Lead Created
    const createdStr = formatDateStr(l?.createdAt);
    if (activityMap[createdStr]) {
      activityMap[createdStr].count += 1;
      activityMap[createdStr].details.created += 1;
    }

    // 2. Call/Contacted
    const contactedStr = formatDateStr(l?.contactedAt);
    if (activityMap[contactedStr]) {
      activityMap[contactedStr].count += 1;
      activityMap[contactedStr].details.calls += 1;
    }

    // 3. Meeting Scheduled
    const meetingStr = formatDateStr(l?.meetingAt);
    if (activityMap[meetingStr]) {
      activityMap[meetingStr].count += 1;
      activityMap[meetingStr].details.meetings += 1;
    }
  });

  return Object.values(activityMap);
};
