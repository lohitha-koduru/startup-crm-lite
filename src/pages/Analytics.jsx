
// Import Recharts charting components for visualization.
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
// Import icons from lucide-react.
import { TrendingUp, Zap, Clock, Target } from 'lucide-react';

/**
 * Analytics Component
 * Displays statistical insights (path: /analytics) using Recharts.
 * Shows performance KPI widgets, pipeline distribution bar charts, and historical lead trends.
 */
const Analytics = () => {
  // Mock historical data for Lead Acquisition over a 6-month period.
  const acquisitionData = [
    { month: 'Jan', leads: 400, qualified: 120 },
    { month: 'Feb', leads: 550, qualified: 210 },
    { month: 'Mar', leads: 480, qualified: 180 },
    { month: 'Apr', leads: 700, qualified: 310 },
    { month: 'May', leads: 850, qualified: 420 },
    { month: 'Jun', leads: 1248, qualified: 482 }
  ];

  // Mock data for sources driving CRM leads.
  const sourceData = [
    { source: 'LinkedIn', count: 480, color: '#4F46E5' },
    { source: 'Google Ads', count: 320, color: '#3B82F6' },
    { source: 'Cold Outreach', count: 210, color: '#10B981' },
    { source: 'Referrals', count: 180, color: '#F59E0B' },
    { source: 'Product Hunt', count: 150, color: '#EC4899' }
  ];

  return (
    // Outer scrollable viewport
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/60 p-6 sm:p-8 font-roboto">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title and Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Performance Analytics
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Real-time monitoring of acquisition channels, rates, and conversion pipelines.
            </p>
          </div>
          {/* Active stats indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold dark:bg-indigo-950/20 dark:text-indigo-400">
            <Zap className="h-4 w-4 text-indigo-550 animate-pulse" />
            Auto-Refreshes hourly
          </div>
        </div>

        {/* Analytics Top Cards / Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Conversion Rate */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                <Target className="h-5 w-5" />
              </div>
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[11px]">Average Conversion Rate</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">12.3%</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">+1.8% MoM</span>
            </div>
          </div>

          {/* Card 2: Average Sales Cycle */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-450">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[11px]">Avg. Sales Cycle Length</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">14 Days</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">-2 Days MoM</span>
            </div>
          </div>

          {/* Card 3: Lead Velocity Index */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-indigo-950/30 dark:text-amber-450">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-slate-450 font-bold uppercase tracking-wider text-[11px]">Lead Velocity Index</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">+24.5%</span>
              <span className="text-xs font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-lg">Accelerating</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Acquisition Trends Area Chart */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Lead Acquisition Trends</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Comparing total leads generated vs. qualified conversions</p>
            </div>
            
            {/* Chart Wrapper Container with constrained height */}
            <div className="h-72 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={acquisitionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {/* Linear color gradient definition for leads */}
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                    {/* Linear color gradient definition for qualified leads */}
                    <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  {/* Subtle dotted background grid lines */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  {/* Total leads area layer */}
                  <Area type="monotone" dataKey="leads" name="Total Leads" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" />
                  {/* Qualified leads area layer */}
                  <Area type="monotone" dataKey="qualified" name="Qualified Leads" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorQualified)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Leads by Acquisition Channels Bar Chart */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Acquisition Channels</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Distribution of leads acquired per outreach channel</p>
            </div>

            {/* Chart Wrapper Container */}
            <div className="h-72 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="source" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  {/* Dynamic colored bars with customized rounded borders */}
                  <Bar dataKey="count" name="Leads Count" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Analytics;
