import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Users,
  Trophy,
  FileText,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';

// Import subcomponents
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import { useLeads } from '../context/LeadContext';

/**
 * @typedef {Object} Lead
 * @property {string|number} id - Unique identifier.
 * @property {string} name - Contact person name.
 * @property {string} company - Organization/startup name.
 * @property {string} email - Email address.
 * @property {string} phone - Phone number.
 * @property {string} status - Lead stage.
 * @property {string} source - Lead acquisition channel.
 * @property {string} createdAt - ISO date string.
 */

/**
 * Dashboard Component
 * Serves as the primary admin panel landing page for Startup CRM Lite.
 * Integrates KPI metrics, sales funnel distributions, recent records, and quick links.
 * Lead data is sourced from the global LeadContext (localStorage-backed).
 *
 * @returns {React.JSX.Element} The rendered Dashboard page.
 */
const Dashboard = () => {
  const navigate = useNavigate();

  /** Reads the shared, localStorage-backed lead store from context. */
  const { leads } = useLeads();

  // Derive quantitative stats from context leads
  const totalLeads = leads.length;
  const wonCount = leads.filter((l) => l.status === 'Won').length;
  const proposalsSentCount = leads.filter((l) => l.status === 'Proposal Sent').length;

  /** Leads that are still open (not Won or Lost). */
  const activeDealsCount = leads.filter(
    (l) => l.status !== 'Won' && l.status !== 'Lost'
  ).length;

  /**
   * Action handler: Navigate to leads management page
   */
  const handleAddLead = () => {
    toast.success('Redirecting to Lead creation...');
    setTimeout(() => {
      navigate('/leads');
    }, 600);
  };

  /**
   * Action handler: Navigate to all leads listing
   */
  const handleViewAllLeads = () => {
    navigate('/leads');
  };

  /**
   * Action handler: Export lead data as CSV and trigger browser download
   */
  const handleExportData = () => {
    if (!leads || leads.length === 0) {
      toast.error('No lead records available to export.');
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            // Generate CSV content with appropriate headers
            const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Status', 'Source', 'Created At'];
            
            const escapeCSV = (val) => {
              if (val === null || val === undefined) return '';
              const str = String(val);
              // Handle quotes, commas, and line breaks according to RFC 4180
              if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            };

            const rows = leads.map((lead) => [
              escapeCSV(lead.id),
              escapeCSV(lead.name),
              escapeCSV(lead.company),
              escapeCSV(lead.email),
              escapeCSV(lead.phone),
              escapeCSV(lead.status),
              escapeCSV(lead.source),
              escapeCSV(lead.createdAt)
            ]);

            const csvString = [headers, ...rows].map((row) => row.join(',')).join('\n');
            
            // Create a Blob and trigger direct browser download
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `leads-export-${new Date().toISOString().slice(0, 10)}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            resolve();
          } catch (error) {
            reject(error);
          }
        }, 1500);
      }),
      {
        loading: 'Preparing lead CSV data...',
        success: 'Lead records exported successfully!',
        error: 'Export failed, please try again.',
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0d0d0e] p-6 sm:p-8 font-roboto">
      {/* Toast Notification Provider */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              CRM Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
              Welcome back. Here is the operational status of your sales funnel.
            </p>
          </div>
          
          {/* Header Controls */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200/60 shadow-sm text-slate-650 dark:bg-slate-950 dark:border-slate-800/80 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              June 16, 2026
            </span>
          </div>
        </div>

        {/* KPI Stats Grid */}
        {/* Responsive grid: 1 column on mobile, 2 on tablet (md), 4 on desktop (lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Leads"
            value={totalLeads}
            icon={Users}
            change="+14.2%"
            color="primary"
          />
          <StatsCard
            title="Won Leads"
            value={wonCount}
            icon={Trophy}
            change="+20.0%"
            color="success"
          />
          <StatsCard
            title="Proposals Sent"
            value={proposalsSentCount}
            icon={FileText}
            change="+8.5%"
            color="warning"
          />
          <StatsCard
            title="Active Deals"
            value={activeDealsCount}
            icon={TrendingUp}
            change="+15.3%"
            color="success"
          />
        </div>

        {/* Main Dashboard Layout Columns */}
        {/* Responsive layout: stacked full-width on mobile/tablet, 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Pipeline Overview Chart & Recent Leads Table */}
          <div className="space-y-8">
            <PipelineOverview leads={leads} />
            <RecentLeads leads={leads} />
          </div>

          {/* Column 2: Quick Actions & Conversion Target Goal Dial */}
          <div className="space-y-8">
            <QuickActions
              onAddLead={handleAddLead}
              onViewAll={handleViewAllLeads}
              onExport={handleExportData}
            />

            {/* Target Conversion Widget */}
            <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-white rounded-2xl p-6 border border-slate-200/60 dark:border-slate-850 shadow-sm space-y-6 relative overflow-hidden transition-colors duration-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full filter blur-xl"></div>
              
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Conversion Goal</h3>
              </div>

              <div className="flex flex-col items-center justify-center pt-2">
                {/* SVG Dial Progress Bar */}
                <div className="relative flex items-center justify-center w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      className="stroke-primary"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={339}
                      strokeDashoffset={339 - (339 * 82) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">82%</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      Reached
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversion Statistics */}
              <div className="space-y-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-850">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Target Rate</span>
                  <span className="font-semibold text-slate-900 dark:text-white">15.0%</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Current Rate</span>
                  <span className="font-semibold text-success">12.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
