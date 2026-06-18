/**
 * @file Leads.jsx
 * @description Lead Management page for Startup CRM Lite.
 *
 * Features:
 *  - Full CRUD: create, read, update, delete leads.
 *  - Modal form (LeadForm) for add / edit operations.
 *  - React Hot Toast notifications (green on create/update, red on delete).
 *  - Debounced live search (300 ms) across name, company, and email via SearchBar.
 *  - Status filter tab bar with per-status counts via FilterBar.
 *  - Smart EmptyState: differentiates zero-total vs. zero-after-filtering.
 *  - Toggle between Card grid view (mobile-first) and Table view (desktop-first).
 *  - Lead state sourced from global LeadContext (localStorage-backed).
 */

import { useState, useMemo, useCallback, useId } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, LayoutGrid, Table2, X } from 'lucide-react';

import LeadForm    from '../components/leads/LeadForm';
import LeadCard    from '../components/leads/LeadCard';
import LeadTable   from '../components/leads/LeadTable';
import SearchBar   from '../components/common/SearchBar';
import FilterBar   from '../components/common/FilterBar';
import EmptyState  from '../components/common/EmptyState';
import useDebounce from '../hooks/useDebounce';
import { useLeads } from '../context/LeadContext';

// Seed data, status filters, and ID generation are all handled by LeadContext.

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Leads Component (Page)
 * Orchestrates the full lead management experience: listing, filtering,
 * adding, editing, and deleting CRM leads.
 *
 * @returns {JSX.Element}
 */
const Leads = () => {
  // ── Context ───────────────────────────────────────────────────────────────

  /**
   * Reads the global lead store and CRUD helpers from LeadContext.
   * Mutations are persisted to localStorage automatically by the provider.
   */
  const { leads, addLead, updateLead, deleteLead } = useLeads();

  // ── State ─────────────────────────────────────────────────────────────────

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
   * Debounced copy of `searchQuery` — updates 300 ms after the user stops
   * typing, preventing a filter recompute on every keystroke.
   */
  const debouncedSearch = useDebounce(searchQuery, 300);

  /**
   * Filtered leads derived from `leads`, `debouncedSearch`, and `activeStatus`.
   * Memoised to avoid recomputing on every unrelated render.
   */
  const filteredLeads = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return leads
      .filter((lead) => activeStatus === 'All' || lead.status === activeStatus)
      .filter(
        (lead) =>
          lead.name.toLowerCase().includes(q) ||
          lead.company.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q)
      );
  }, [leads, debouncedSearch, activeStatus]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  /** Resets both search query and status filter back to their initial values. */
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('All');
  }, []);

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
   * Delegates to `addLead` (create) or `updateLead` (edit) from LeadContext.
   * ID generation and `createdAt` timestamping are handled by the context.
   *
   * @param {import('../components/leads/LeadForm').LeadFormData} formData
   */
  const handleFormSubmit = useCallback(
    (formData) => {
      if (selectedLead) {
        // ── UPDATE ── delegate to context; ID stays unchanged
        updateLead(selectedLead.id, formData);
        toast.success(`${formData.name} updated successfully.`, {
          style: { fontWeight: '600' },
        });
      } else {
        // ── CREATE ── context auto-assigns id + createdAt
        addLead(formData);
        toast.success(`${formData.name} added to your pipeline!`, {
          style: { fontWeight: '600' },
          iconTheme: { primary: '#22C55E', secondary: '#fff' },
        });
      }
      handleCloseModal();
    },
    [selectedLead, handleCloseModal, addLead, updateLead]
  );

  /**
   * Deletes a lead by id, then shows a toast notification.
   * Delegates removal to `deleteLead` from LeadContext (localStorage-synced).
   *
   * @param {string} id - The id of the lead to remove.
   */
  const handleDelete = useCallback((id) => {
    const target = leads.find((l) => l.id === id);
    deleteLead(id);
    toast.error(`${target?.name ?? 'Lead'} has been removed.`, {
      style: { fontWeight: '600' },
      iconTheme: { primary: '#EF4444', secondary: '#fff' },
    });
  }, [leads, deleteLead]);

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
            {/* Debounced search box */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

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

          {/* Status filter bar with per-status counts */}
          <FilterBar
            activeFilter={activeStatus}
            onFilterChange={setActiveStatus}
            leads={leads}
          />
        </div>

        {/* ── Content: Card grid OR Table ── */}
        {viewMode === 'card' ? (
          filteredLeads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-all duration-300">
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
            <EmptyState
              totalLeads={leads.length}
              onAdd={handleOpenCreate}
              onClearFilters={handleClearFilters}
            />
          )
        ) : filteredLeads.length > 0 ? (
          <LeadTable
            leads={filteredLeads}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ) : (
          <EmptyState
            totalLeads={leads.length}
            onAdd={handleOpenCreate}
            onClearFilters={handleClearFilters}
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

export default Leads;
