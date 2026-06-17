/**
 * @file Leads.jsx
 * @description Lead Management page for Startup CRM Lite.
 *
 * Features:
 *  - Full CRUD: create, read, update, delete leads.
 *  - Modal form (LeadForm) for add / edit operations.
 *  - React Hot Toast notifications (green on create/update, red on delete).
 *  - Live search across name, company, and email.
 *  - Status filter tab bar.
 *  - Toggle between Card grid view (mobile-first) and Table view (desktop-first).
 *  - Sample seed data so the page is non-empty on first load.
 */

import { useState, useMemo, useCallback, useId } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus,
  Search,
  LayoutGrid,
  Table2,
  X,
  SlidersHorizontal,
} from 'lucide-react';

import LeadForm  from '../components/leads/LeadForm';
import LeadCard  from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';

// ─── Seed data ──────────────────────────────────────────────────────────────

/**
 * @type {import('../components/leads/LeadCard').Lead[]}
 * Pre-populated sample leads so the page looks rich on first load.
 * In Phase 8 this will be replaced with real API data.
 */
const SEED_LEADS = [
  {
    id: 'seed-1',
    name: 'Eleanor Vance',
    company: 'Aether Bio',
    email: 'eleanor@aether.bio',
    phone: '+1 (555) 234-5678',
    status: 'Qualified',           // mapped to our new "Won" palette — kept as-is for variety
    source: 'LinkedIn',
    dateAdded: '2026-06-15T08:30:00Z',
  },
  {
    id: 'seed-2',
    name: 'Oliver Queen',
    company: 'Star Industries',
    email: 'oliver@star.corp',
    phone: '+1 (555) 876-5432',
    status: 'Proposal Sent',
    source: 'Referral',
    dateAdded: '2026-06-14T14:15:00Z',
  },
  {
    id: 'seed-3',
    name: 'Selina Kyle',
    company: 'Nighthawk Security',
    email: 'selina@nighthawk.io',
    phone: '+1 (555) 345-6789',
    status: 'New',
    source: 'Website',
    dateAdded: '2026-06-16T09:00:00Z',
  },
  {
    id: 'seed-4',
    name: 'Arthur Dent',
    company: 'Deep Thought AI',
    email: 'arthur@deepthought.tech',
    phone: '+1 (555) 456-7890',
    status: 'Contacted',
    source: 'Cold Call',
    dateAdded: '2026-06-13T10:45:00Z',
  },
  {
    id: 'seed-5',
    name: 'Bruce Banner',
    company: 'Gamma Labs',
    email: 'banner@gamma.org',
    phone: '+1 (555) 901-2345',
    status: 'Won',
    source: 'Email Campaign',
    dateAdded: '2026-06-12T11:20:00Z',
  },
  {
    id: 'seed-6',
    name: 'Tony Stark',
    company: 'Stark Industries',
    email: 'tony@stark.com',
    phone: '+1 (555) 321-4567',
    status: 'Won',
    source: 'Referral',
    dateAdded: '2026-06-11T06:00:00Z',
  },
  {
    id: 'seed-7',
    name: 'Carol Danvers',
    company: 'Hala Tech',
    email: 'carol@hala.tech',
    phone: '+1 (555) 789-0123',
    status: 'Meeting Scheduled',
    source: 'LinkedIn',
    dateAdded: '2026-06-10T18:25:00Z',
  },
  {
    id: 'seed-8',
    name: 'Peter Parker',
    company: 'Daily Bugle Digital',
    email: 'peter@dailybugle.com',
    phone: '+1 (555) 654-3210',
    status: 'Lost',
    source: 'Other',
    dateAdded: '2026-06-09T13:00:00Z',
  },
];

// ─── Status filter tabs ──────────────────────────────────────────────────────

const STATUS_FILTERS = [
  'All',
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];

// ─── ID generator helper ─────────────────────────────────────────────────────

/** Generates a lightweight unique id string for new leads. */
const makeId = () => `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Leads Component (Page)
 * Orchestrates the full lead management experience: listing, filtering,
 * adding, editing, and deleting CRM leads.
 *
 * @returns {JSX.Element}
 */
const Leads = () => {
  // ── State ─────────────────────────────────────────────────────────────────

  /** Master list of all leads in the system. */
  const [leads, setLeads] = useState(SEED_LEADS);

  /** Controls modal open/closed state. */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * The lead currently being edited.
   * `null` means the modal is in create mode.
   * @type {[import('../components/leads/LeadCard').Lead|null, function]}
   */
  const [selectedLead, setSelectedLead] = useState(null);

  /** Controlled search query string. */
  const [searchQuery, setSearchQuery] = useState('');

  /** Active status filter tab. */
  const [activeStatus, setActiveStatus] = useState('All');

  /** View mode: 'card' (grid) or 'table'. */
  const [viewMode, setViewMode] = useState('table');

  // Unique id for the modal's aria-labelledby
  const modalTitleId = useId();

  // ── Derived / memoised data ───────────────────────────────────────────────

  /**
   * Filtered leads derived from `leads`, `searchQuery`, and `activeStatus`.
   * Memoised to avoid recomputing on every unrelated render.
   */
  const filteredLeads = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q);
      const matchesStatus =
        activeStatus === 'All' || lead.status === activeStatus;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, activeStatus]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  /** Opens the modal in create mode. */
  const handleOpenCreate = useCallback(() => {
    setSelectedLead(null);
    setIsModalOpen(true);
  }, []);

  /**
   * Opens the modal in edit mode, pre-seeding form with the given lead.
   *
   * @param {import('../components/leads/LeadCard').Lead} lead
   */
  const handleOpenEdit = useCallback((lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  }, []);

  /** Closes the modal and clears the selected lead. */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLead(null);
  }, []);

  /**
   * Handles form submission from LeadForm.
   * Creates a new lead or updates an existing one depending on `selectedLead`.
   *
   * @param {import('../components/leads/LeadForm').LeadFormData} formData
   */
  const handleFormSubmit = useCallback(
    (formData) => {
      if (selectedLead) {
        // ── UPDATE ──
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLead.id ? { ...l, ...formData } : l
          )
        );
        toast.success(`${formData.name} updated successfully.`, {
          style: { fontWeight: '600' },
        });
      } else {
        // ── CREATE ──
        const newLead = {
          ...formData,
          id: makeId(),
          dateAdded: new Date().toISOString(),
        };
        setLeads((prev) => [newLead, ...prev]);
        toast.success(`${formData.name} added to your pipeline!`, {
          style: { fontWeight: '600' },
          iconTheme: { primary: '#22C55E', secondary: '#fff' },
        });
      }
      handleCloseModal();
    },
    [selectedLead, handleCloseModal]
  );

  /**
   * Deletes a lead by id with a confirmation toast.
   *
   * @param {string|number} id
   */
  const handleDelete = useCallback((id) => {
    const target = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast.error(`${target?.name ?? 'Lead'} has been removed.`, {
      style: { fontWeight: '600' },
      iconTheme: { primary: '#EF4444', secondary: '#fff' },
    });
  }, [leads]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/60 p-6 sm:p-8 font-roboto">
      {/* Toast notification portal */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Lead Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Track, qualify, and close startup opportunities across your pipeline.
            </p>
          </div>

          {/* Add new lead CTA */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
            Add New Lead
          </button>
        </div>

        {/* ── Toolbar: search + status filters + view toggle ── */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-4 shadow-sm space-y-4">

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search box */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                id="leads-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, or email…"
                aria-label="Search leads"
                className="block w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-label="Table view"
                aria-pressed={viewMode === 'table'}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-800 text-primary shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <Table2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('card')}
                aria-label="Card view"
                aria-pressed={viewMode === 'card'}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'card'
                    ? 'bg-white dark:bg-slate-800 text-primary shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Status filter tab strip */}
          <div
            role="tablist"
            aria-label="Filter leads by status"
            className="flex flex-wrap gap-1.5"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-400 self-center mr-1 flex-shrink-0" />
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                role="tab"
                aria-selected={activeStatus === status}
                type="button"
                onClick={() => setActiveStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeStatus === status
                    ? 'bg-slate-900 text-white dark:bg-primary dark:text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {status}
                {/* Show count badge on each tab */}
                <span
                  className={`ml-1.5 ${
                    activeStatus === status
                      ? 'text-slate-300'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {status === 'All'
                    ? leads.length
                    : leads.filter((l) => l.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Content: Card grid OR Table ── */}
        {viewMode === 'card' ? (
          filteredLeads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyState onAdd={handleOpenCreate} />
          )
        ) : (
          <LeadTable
            leads={filteredLeads}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}

      </div>

      {/* ── Modal overlay ── */}
      {isModalOpen && (
        // Backdrop
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Dimmed background */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleCloseModal}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-850 overflow-hidden animate-[fadeInUp_0.2s_ease]">

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-850">
              <div>
                <h2
                  id={modalTitleId}
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  {selectedLead ? 'Edit Lead' : 'Add New Lead'}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {selectedLead
                    ? `Updating details for ${selectedLead.name}`
                    : 'Fill in the details to add a new lead to your pipeline.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Close modal"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body: the form */}
            <div className="p-6">
              <LeadForm
                initialData={selectedLead}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseModal}
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// ─── Empty state sub-component ───────────────────────────────────────────────

/**
 * EmptyState Component
 * Displayed in card view when no leads match the active filters.
 *
 * @param {{ onAdd: function(): void }} props
 * @returns {JSX.Element}
 */
const EmptyState = ({ onAdd }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
      <Search className="h-7 w-7 text-primary/60" />
    </div>
    <div className="text-center">
      <p className="font-semibold text-slate-700 dark:text-slate-300">
        No leads found
      </p>
      <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
        Try a different search or filter — or add a brand-new lead.
      </p>
    </div>
    <button
      type="button"
      onClick={onAdd}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
    >
      <Plus className="h-4 w-4" />
      Add New Lead
    </button>
  </div>
);

export default Leads;
