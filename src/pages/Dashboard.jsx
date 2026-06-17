import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Users,
  Trophy,
  FileText,
  DollarSign,
  Calendar,
  Target
} from 'lucide-react';

// Import subcomponents
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';

/**
 * @typedef {Object} Lead
 * @property {string|number} id - Unique identifier.
 * @property {string} name - Contact person name.
 * @property {string} company - Organization/startup name.
 * @property {string} email - Email address.
 * @property {string} phone - Phone number.
 * @property {string} status - Lead stage.
 * @property {string} value - Deal value string (e.g., "$50,000").
 * @property {string} dateAdded - ISO date string.
 */

/**
 * Dashboard Component
 * Serves as the primary admin panel landing page for Startup CRM Lite.
 * Integrates KPI metrics, sales funnel distributions, recent records, and quick links.
 *
 * @returns {React.JSX.Element} The rendered Dashboard page.
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Mock lead dataset to feed the widgets
  const [leads] = useState([
    {
      id: 1,
      name: 'Eleanor Vance',
      company: 'Aether Bio',
      email: 'eleanor@aether.bio',
      phone: '+1 (555) 234-5678',
      status: 'Qualified',
      value: '$45,000',
      dateAdded: '2026-06-15T08:30:00Z',
    },
    {
      id: 2,
      name: 'Oliver Queen',
      company: 'Star Industries',
      email: 'oliver@star.corp',
      phone: '+1 (555) 876-5432',
      status: 'Proposal Sent',
      value: '$120,000',
      dateAdded: '2026-06-14T14:15:00Z',
    },
    {
      id: 3,
      name: 'Selina Kyle',
      company: 'Nighthawk Security',
      email: 'selina@nighthawk.io',
      phone: '+1 (555) 345-6789',
      status: 'New',
      value: '$28,500',
      dateAdded: '2026-06-16T09:00:00Z',
    },
    {
      id: 4,
      name: 'Arthur Dent',
      company: 'Deep Thought AI',
      email: 'arthur@deepthought.tech',
      phone: '+1 (555) 456-7890',
      status: 'Contacted',
      value: '$15,000',
      dateAdded: '2026-06-13T10:45:00Z',
    },
    {
      id: 5,
      name: 'Bruce Banner',
      company: 'Gamma Labs',
      email: 'banner@gamma.org',
      phone: '+1 (555) 901-2345',
      status: 'Closed Won',
      value: '$88,000',
      dateAdded: '2026-06-12T11:20:00Z',
    },
    {
      id: 6,
      name: 'Tony Stark',
      company: 'Stark Industries',
      email: 'tony@stark.com',
      phone: '+1 (555) 321-4567',
      status: 'Closed Won',
      value: '$500,000',
      dateAdded: '2026-06-16T06:00:00Z',
    },
    {
      id: 7,
      name: 'Carol Danvers',
      company: 'Hala Tech',
      email: 'carol@hala.tech',
      phone: '+1 (555) 789-0123',
      status: 'New',
      value: '$75,000',
      dateAdded: '2026-06-15T18:25:00Z',
    },
  ]);

  // Derive quantitative stats from state
  const totalLeads = leads.length;
  const closedWonCount = leads.filter((l) => l.status === 'Closed Won').length;
  const proposalsSentCount = leads.filter((l) => l.status === 'Proposal Sent').length;

  // Compute total deal pipeline valuation dynamically
  const pipelineValue = leads.reduce((sum, lead) => {
    const numericVal = parseFloat(lead.value.replace(/[^0-9.]/g, '')) || 0;
    return sum + numericVal;
  }, 0);

  const formattedPipelineValue = `$${(pipelineValue / 1000).toFixed(1)}k`;

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
   * Action handler: Simulate lead data export
   */
  const handleExportData = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
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
        {/* Responsive grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Leads"
            value={totalLeads}
            icon={Users}
            change="+14.2%"
            color="primary"
          />
          <StatsCard
            title="Closed Won"
            value={closedWonCount}
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
            title="Pipeline Value"
            value={formattedPipelineValue}
            icon={DollarSign}
            change="+15.3%"
            color="success"
          />
        </div>

        {/* Main Dashboard Layout Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visuals & Tables (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-8">
            <PipelineOverview leads={leads} />
            <RecentLeads leads={leads} />
          </div>

          {/* Quick Actions & Target Goals (1/3 width on desktop) */}
          <div className="space-y-8">
            <QuickActions
              onAddLead={handleAddLead}
              onViewAll={handleViewAllLeads}
              onExport={handleExportData}
            />

            {/* Target Conversion Widget */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-850 dark:bg-slate-950 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full filter blur-xl"></div>
              
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold">Conversion Goal</h3>
              </div>

              <div className="flex flex-col items-center justify-center pt-2">
                {/* SVG Dial Progress Bar */}
                <div className="relative flex items-center justify-center w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      className="stroke-slate-800"
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
                    <span className="text-3xl font-extrabold">82%</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Reached
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversion Statistics */}
              <div className="space-y-3 pt-2 text-xs border-t border-slate-800">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Target Rate</span>
                  <span className="font-semibold text-white">15.0%</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
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
