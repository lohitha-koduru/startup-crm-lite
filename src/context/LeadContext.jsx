import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Lead object shape:
 * {
 *   id: string,
 *   name: string,
 *   company: string,
 *   email: string,
 *   phone: string,
 *   status: 'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost',
 *   source: 'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other',
 *   createdAt: string
 * }
 */

/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {string} name
 * @property {string} company
 * @property {string} email
 * @property {string} phone
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source
 * @property {string} createdAt
 */

/**
 * @typedef {Object} LeadContextValue
 * @property {Lead[]} leads
 * @property {(leadData: Omit<Lead, 'id' | 'createdAt'>) => Lead} addLead
 * @property {(id: string, leadData: Partial<Lead>) => void} updateLead
 * @property {(id: string) => void} deleteLead
 * @property {(id: string) => Lead|undefined} getLeadById
 */

const STORAGE_KEY = 'startup-crm-leads';
/** @type {Lead[]} */
const INITIAL_LEADS = [
  {
    id: '1',
    name: 'Alice Vance',
    company: 'NovaTech Solutions',
    email: 'alice@novatech.io',
    phone: '+1 (555) 019-2834',
    status: 'New',
    source: 'Website',
    createdAt: '2026-06-15T09:00:00.000Z',
  },
  {
    id: '2',
    name: 'Bob Sterling',
    company: 'Apex Global',
    email: 'bob@apexglobal.co',
    phone: '+1 (555) 014-9218',
    status: 'Contacted',
    source: 'LinkedIn',
    createdAt: '2026-06-12T11:30:00.000Z',
  },
  {
    id: '3',
    name: 'Clara Oswald',
    company: 'Chronos Inc',
    email: 'clara@chronos.org',
    phone: '+1 (555) 017-3849',
    status: 'Proposal Sent',
    source: 'Referral',
    createdAt: '2026-06-16T14:15:00.000Z',
  },
  {
    id: '4',
    name: 'David Miller',
    company: 'Quantum Labs',
    email: 'david@quantumlabs.dev',
    phone: '+1 (555) 011-8293',
    status: 'Won',
    source: 'Cold Call',
    createdAt: '2026-06-10T08:45:00.000Z',
  },
  {
    id: '5',
    name: 'Eva Green',
    company: 'Vertigo Media',
    email: 'eva@vertigo.media',
    phone: '+1 (555) 016-4720',
    status: 'Contacted',
    source: 'Email Campaign',
    createdAt: '2026-06-14T16:00:00.000Z',
  },
];


/**
 * Stores the global lead state and lead CRUD functions.
 *
 * @type {React.Context<LeadContextValue|null>}
 */
export const LeadContext = createContext(null);

/**
 * Reads saved leads from localStorage.
 *
 * @returns {Lead[]} The stored leads array, or an empty array when unavailable.
 */
const getInitialLeads = () => {
  try {
    const storedLeads = window.localStorage.getItem(STORAGE_KEY);

    return storedLeads
      ? JSON.parse(storedLeads)
      : INITIAL_LEADS;
  } catch (error) {
    console.error('Failed to load leads from localStorage:', error);
    return INITIAL_LEADS;
  }
};

/**
 * Creates a stable unique lead identifier.
 *
 * @returns {string} A UUID when available, otherwise a timestamp-based id.
 */
const createLeadId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return String(Date.now());
};

/**
 * Provides lead state and CRUD helpers to the application.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element} The provider-wrapped React subtree.
 */
export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState(getInitialLeads);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (error) {
      console.error('Failed to save leads to localStorage:', error);
    }
  }, [leads]);

  /**
   * Adds a new lead with a generated id and creation timestamp.
   *
   * @param {Omit<Lead, 'id' | 'createdAt'>} leadData The lead form values.
   * @returns {Lead} The newly created lead.
   */
  const addLead = useCallback((leadData) => {
    const newLead = {
      ...leadData,
      id: createLeadId(),
      createdAt: new Date().toISOString(),
    };

    setLeads((currentLeads) => [newLead, ...currentLeads]);
    return newLead;
  }, []);

  /**
   * Updates an existing lead by id.
   *
   * @param {string} id The id of the lead to update.
   * @param {Partial<Lead>} leadData The lead fields to merge into the existing record.
   * @returns {void}
   */
  const updateLead = useCallback((id, leadData) => {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === id ? { ...lead, ...leadData, id: lead.id, createdAt: lead.createdAt } : lead
      )
    );
  }, []);

  /**
   * Deletes a lead by id.
   *
   * @param {string} id The id of the lead to delete.
   * @returns {void}
   */
  const deleteLead = useCallback((id) => {
    setLeads((currentLeads) => currentLeads.filter((lead) => lead.id !== id));
  }, []);

  /**
   * Finds a lead by id.
   *
   * @param {string} id The id of the lead to find.
   * @returns {Lead|undefined} The matching lead, if one exists.
   */
  const getLeadById = useCallback(
    (id) => leads.find((lead) => lead.id === id),
    [leads]
  );

  const value = useMemo(
    () => ({
      leads,
      addLead,
      updateLead,
      deleteLead,
      getLeadById,
    }),
    [leads, addLead, updateLead, deleteLead, getLeadById]
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
};

/**
 * Reads the lead context value.
 *
 * @returns {LeadContextValue} The lead context value.
 * @throws {Error} When used outside of LeadProvider.
 */
export const useLeads = () => {
  const context = useContext(LeadContext);

  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider.');
  }

  return context;
};
