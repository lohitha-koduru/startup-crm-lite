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
  // --- JUNE 2026 ---
  {
    id: 'lead_june_1',
    name: 'Alice Vance',
    company: 'NovaTech Solutions',
    email: 'alice@novatech.io',
    phone: '+1 (555) 019-2834',
    status: 'Won',
    source: 'Website',
    value: 85000,
    owner: 'Sarah',
    createdAt: '2026-06-02T10:00:00.000Z',
    contactedAt: '2026-06-03T11:30:00.000Z',
    meetingAt: '2026-06-05T14:00:00.000Z',
    proposalAt: '2026-06-08T10:00:00.000Z',
    wonAt: '2026-06-12T15:30:00.000Z',
  },
  {
    id: 'lead_june_2',
    name: 'Bob Sterling',
    company: 'Apex Global',
    email: 'bob@apexglobal.co',
    phone: '+1 (555) 014-9218',
    status: 'Contacted',
    source: 'LinkedIn',
    value: 45000,
    owner: 'Alex',
    createdAt: '2026-06-05T11:30:00.000Z',
    contactedAt: '2026-06-06T14:20:00.000Z',
  },
  {
    id: 'lead_june_3',
    name: 'Clara Oswald',
    company: 'Chronos Inc',
    email: 'clara@chronos.org',
    phone: '+1 (555) 017-3849',
    status: 'Proposal Sent',
    source: 'Referral',
    value: 120000,
    owner: 'David',
    createdAt: '2026-06-01T09:15:00.000Z',
    contactedAt: '2026-06-02T11:00:00.000Z',
    meetingAt: '2026-06-05T15:30:00.000Z',
    proposalAt: '2026-06-10T10:15:00.000Z',
  },
  {
    id: 'lead_june_4',
    name: 'David Miller',
    company: 'Quantum Labs',
    email: 'david@quantumlabs.dev',
    phone: '+1 (555) 011-8293',
    status: 'Won',
    source: 'Cold Call',
    value: 62000,
    owner: 'Sarah',
    createdAt: '2026-06-08T08:45:00.000Z',
    contactedAt: '2026-06-09T10:00:00.000Z',
    meetingAt: '2026-06-11T16:00:00.000Z',
    proposalAt: '2026-06-13T11:00:00.000Z',
    wonAt: '2026-06-16T14:00:00.000Z',
  },
  {
    id: 'lead_june_5',
    name: 'Eva Green',
    company: 'Vertigo Media',
    email: 'eva@vertigo.media',
    phone: '+1 (555) 016-4720',
    status: 'Meeting Scheduled',
    source: 'Email Campaign',
    value: 28000,
    owner: 'Alex',
    createdAt: '2026-06-10T16:00:00.000Z',
    contactedAt: '2026-06-12T09:30:00.000Z',
    meetingAt: '2026-06-15T10:00:00.000Z',
  },
  {
    id: 'lead_june_6',
    name: 'Frank Castle',
    company: 'Punisher Tactical',
    email: 'frank@punishertactical.com',
    phone: '+1 (555) 012-3456',
    status: 'Lost',
    source: 'LinkedIn',
    value: 50000,
    owner: 'David',
    createdAt: '2026-06-04T09:00:00.000Z',
    contactedAt: '2026-06-05T10:30:00.000Z',
  },
  {
    id: 'lead_june_7',
    name: 'Grace Hopper',
    company: 'Cobol Systems',
    email: 'grace@cobolsystems.edu',
    phone: '+1 (555) 013-5791',
    status: 'New',
    source: 'Website',
    value: 35000,
    owner: 'Sarah',
    createdAt: '2026-06-14T14:00:00.000Z',
  },

  // --- MAY 2026 ---
  {
    id: 'lead_may_1',
    name: 'Henry Cavill',
    company: 'Steel Productions',
    email: 'henry@steelprod.com',
    phone: '+1 (555) 015-2468',
    status: 'Won',
    source: 'Referral',
    value: 150000,
    owner: 'Sarah',
    createdAt: '2026-05-02T10:00:00.000Z',
    contactedAt: '2026-05-03T11:00:00.000Z',
    meetingAt: '2026-05-06T15:00:00.000Z',
    proposalAt: '2026-05-10T14:30:00.000Z',
    wonAt: '2026-05-18T16:00:00.000Z',
  },
  {
    id: 'lead_may_2',
    name: 'Iris West',
    company: 'Central Picture',
    email: 'iris@centralpicture.news',
    phone: '+1 (555) 016-1357',
    status: 'Won',
    source: 'LinkedIn',
    value: 75000,
    owner: 'Alex',
    createdAt: '2026-05-10T09:00:00.000Z',
    contactedAt: '2026-05-11T10:00:00.000Z',
    meetingAt: '2026-05-13T14:00:00.000Z',
    proposalAt: '2026-05-16T11:00:00.000Z',
    wonAt: '2026-05-22T12:00:00.000Z',
  },
  {
    id: 'lead_may_3',
    name: 'Jack Ryan',
    company: 'Apex Intelligence',
    email: 'jack@apexintel.gov',
    phone: '+1 (555) 017-9876',
    status: 'Lost',
    source: 'Cold Call',
    value: 95000,
    owner: 'David',
    createdAt: '2026-05-12T14:00:00.000Z',
    contactedAt: '2026-05-14T09:00:00.000Z',
    meetingAt: '2026-05-18T15:00:00.000Z',
  },
  {
    id: 'lead_may_4',
    name: 'Kate Bishop',
    company: 'Hawkeye Archery',
    email: 'kate@hawkeyearchery.com',
    phone: '+1 (555) 018-8765',
    status: 'Won',
    source: 'Website',
    value: 42000,
    owner: 'Alex',
    createdAt: '2026-05-15T11:00:00.000Z',
    contactedAt: '2026-05-16T13:00:00.000Z',
    meetingAt: '2026-05-20T10:30:00.000Z',
    proposalAt: '2026-05-22T16:00:00.000Z',
    wonAt: '2026-05-28T14:30:00.000Z',
  },
  {
    id: 'lead_may_5',
    name: 'Loki Laufeyson',
    company: 'Asgardian Mischief',
    email: 'loki@tva.org',
    phone: '+1 (555) 019-7654',
    status: 'Proposal Sent',
    source: 'Other',
    value: 180000,
    owner: 'David',
    createdAt: '2026-05-20T13:00:00.000Z',
    contactedAt: '2026-05-21T11:00:00.000Z',
    meetingAt: '2026-05-24T15:00:00.000Z',
    proposalAt: '2026-05-27T10:00:00.000Z',
  },

  // --- APRIL 2026 ---
  {
    id: 'lead_apr_1',
    name: 'Bruce Wayne',
    company: 'Wayne Enterprises',
    email: 'bruce@waynecorp.com',
    phone: '+1 (555) 012-9876',
    status: 'Won',
    source: 'Referral',
    value: 250000,
    owner: 'Sarah',
    createdAt: '2026-04-05T10:00:00.000Z',
    contactedAt: '2026-04-06T11:00:00.000Z',
    meetingAt: '2026-04-08T15:00:00.000Z',
    proposalAt: '2026-04-12T14:00:00.000Z',
    wonAt: '2026-04-18T16:30:00.000Z',
  },
  {
    id: 'lead_apr_2',
    name: 'Diana Prince',
    company: 'Themyscira Ltd',
    email: 'diana@amazon.org',
    phone: '+1 (555) 013-8765',
    status: 'Won',
    source: 'Website',
    value: 130000,
    owner: 'Alex',
    createdAt: '2026-04-10T14:00:00.000Z',
    contactedAt: '2026-04-12T09:00:00.000Z',
    meetingAt: '2026-04-15T11:30:00.000Z',
    proposalAt: '2026-04-18T10:00:00.000Z',
    wonAt: '2026-04-25T15:00:00.000Z',
  },
  {
    id: 'lead_apr_3',
    name: 'Clark Kent',
    company: 'Daily Planet',
    email: 'clark@dailyplanet.com',
    phone: '+1 (555) 014-7654',
    status: 'Lost',
    source: 'LinkedIn',
    value: 30000,
    owner: 'David',
    createdAt: '2026-04-12T11:00:00.000Z',
    contactedAt: '2026-04-13T13:00:00.000Z',
    meetingAt: '2026-04-17T10:00:00.000Z',
  },
  {
    id: 'lead_apr_4',
    name: 'Barry Allen',
    company: 'S.T.A.R. Labs',
    email: 'barry@starlabs.dev',
    phone: '+1 (555) 015-6543',
    status: 'Won',
    source: 'Cold Call',
    value: 55000,
    owner: 'Sarah',
    createdAt: '2026-04-18T09:00:00.000Z',
    contactedAt: '2026-04-19T10:00:00.000Z',
    meetingAt: '2026-04-20T14:00:00.000Z',
    proposalAt: '2026-04-22T16:00:00.000Z',
    wonAt: '2026-04-26T11:00:00.000Z',
  },

  // --- MARCH 2026 ---
  {
    id: 'lead_mar_1',
    name: 'Peter Parker',
    company: 'Parker Industries',
    email: 'peter@spidey.dev',
    phone: '+1 (555) 016-5432',
    status: 'Won',
    source: 'LinkedIn',
    value: 40000,
    owner: 'Alex',
    createdAt: '2026-03-02T10:00:00.000Z',
    contactedAt: '2026-03-04T11:00:00.000Z',
    meetingAt: '2026-03-08T15:00:00.000Z',
    proposalAt: '2026-03-12T14:00:00.000Z',
    wonAt: '2026-03-17T16:00:00.000Z',
  },
  {
    id: 'lead_mar_2',
    name: 'Tony Stark',
    company: 'Stark Industries',
    email: 'tony@stark.com',
    phone: '+1 (555) 017-4321',
    status: 'Won',
    source: 'Referral',
    value: 300000,
    owner: 'Sarah',
    createdAt: '2026-03-08T09:00:00.000Z',
    contactedAt: '2026-03-09T10:00:00.000Z',
    meetingAt: '2026-03-12T14:30:00.000Z',
    proposalAt: '2026-03-16T11:00:00.000Z',
    wonAt: '2026-03-24T16:30:00.000Z',
  },
  {
    id: 'lead_mar_3',
    name: 'Steve Rogers',
    company: 'Brooklyn Shield',
    email: 'steve@shield.mil',
    phone: '+1 (555) 018-3210',
    status: 'Lost',
    source: 'Cold Call',
    value: 45000,
    owner: 'David',
    createdAt: '2026-03-15T14:00:00.000Z',
    contactedAt: '2026-03-17T09:00:00.000Z',
  },
  {
    id: 'lead_mar_4',
    name: 'Natasha Romanoff',
    company: 'Red Room Media',
    email: 'natasha@widow.org',
    phone: '+1 (555) 019-2109',
    status: 'Won',
    source: 'Website',
    value: 88000,
    owner: 'David',
    createdAt: '2026-03-20T11:00:00.000Z',
    contactedAt: '2026-03-22T10:00:00.000Z',
    meetingAt: '2026-03-25T14:00:00.000Z',
    proposalAt: '2026-03-28T16:00:00.000Z',
    wonAt: '2026-03-31T12:00:00.000Z',
  },

  // --- FEBRUARY 2026 ---
  {
    id: 'lead_feb_1',
    name: 'Wanda Maximoff',
    company: 'Hex Designs',
    email: 'wanda@hex.io',
    phone: '+1 (555) 020-1098',
    status: 'Won',
    source: 'Website',
    value: 95000,
    owner: 'Sarah',
    createdAt: '2026-02-04T10:00:00.000Z',
    contactedAt: '2026-02-05T11:00:00.000Z',
    meetingAt: '2026-02-08T15:00:00.000Z',
    proposalAt: '2026-02-12T14:00:00.000Z',
    wonAt: '2026-02-18T16:00:00.000Z',
  },
  {
    id: 'lead_feb_2',
    name: 'Stephen Strange',
    company: 'Sanctum Consultancy',
    email: 'stephen@kamartaj.org',
    phone: '+1 (555) 021-0987',
    status: 'Won',
    source: 'Referral',
    value: 110000,
    owner: 'Alex',
    createdAt: '2026-02-10T14:00:00.000Z',
    contactedAt: '2026-02-12T09:00:00.000Z',
    meetingAt: '2026-02-15T11:30:00.000Z',
    proposalAt: '2026-02-18T10:00:00.000Z',
    wonAt: '2026-02-23T15:00:00.000Z',
  },
  {
    id: 'lead_feb_3',
    name: 'Thor Odinson',
    company: 'Mjolnir Power',
    email: 'thor@thunder.org',
    phone: '+1 (555) 022-9876',
    status: 'Lost',
    source: 'Cold Call',
    value: 125000,
    owner: 'David',
    createdAt: '2026-02-12T11:00:00.000Z',
    contactedAt: '2026-02-14T13:00:00.000Z',
  },
  {
    id: 'lead_feb_4',
    name: 'Carol Danvers',
    company: 'Starforce Logistics',
    email: 'carol@marvel.com',
    phone: '+1 (555) 023-8765',
    status: 'Won',
    source: 'LinkedIn',
    value: 140000,
    owner: 'Sarah',
    createdAt: '2026-02-15T09:00:00.000Z',
    contactedAt: '2026-02-16T10:00:00.000Z',
    meetingAt: '2026-02-18T14:00:00.000Z',
    proposalAt: '2026-02-20T16:00:00.000Z',
    wonAt: '2026-02-25T11:00:00.000Z',
  },

  // --- JANUARY 2026 ---
  {
    id: 'lead_jan_1',
    name: 'Arthur Curry',
    company: 'Atlantis Water Corp',
    email: 'arthur@atlantis.com',
    phone: '+1 (555) 024-7654',
    status: 'Won',
    source: 'Website',
    value: 78000,
    owner: 'Alex',
    createdAt: '2026-01-05T10:00:00.000Z',
    contactedAt: '2026-01-06T11:00:00.000Z',
    meetingAt: '2026-01-08T15:00:00.000Z',
    proposalAt: '2026-01-12T14:00:00.000Z',
    wonAt: '2026-01-19T16:00:00.000Z',
  },
  {
    id: 'lead_jan_2',
    name: 'Victor Stone',
    company: 'Cyborg Tech',
    email: 'vic@cyborg.net',
    phone: '+1 (555) 025-6543',
    status: 'Won',
    source: 'LinkedIn',
    value: 135000,
    owner: 'David',
    createdAt: '2026-01-12T14:00:00.000Z',
    contactedAt: '2026-01-13T09:00:00.000Z',
    meetingAt: '2026-01-15T11:30:00.000Z',
    proposalAt: '2026-01-18T10:00:00.000Z',
    wonAt: '2026-01-26T15:00:00.000Z',
  },
  {
    id: 'lead_jan_3',
    name: 'Hal Jordan',
    company: 'Green Light Corp',
    email: 'hal@ferris.com',
    phone: '+1 (555) 026-5432',
    status: 'Lost',
    source: 'Cold Call',
    value: 50000,
    owner: 'Sarah',
    createdAt: '2026-01-15T11:00:00.000Z',
    contactedAt: '2026-01-16T13:00:00.000Z',
  },
  {
    id: 'lead_jan_4',
    name: 'Oliver Queen',
    company: 'Queen Consolidated',
    email: 'oliver@queen.com',
    phone: '+1 (555) 027-4321',
    status: 'Won',
    source: 'Referral',
    value: 220000,
    owner: 'Sarah',
    createdAt: '2026-01-18T09:00:00.000Z',
    contactedAt: '2026-01-19T10:00:00.000Z',
    meetingAt: '2026-01-20T14:00:00.000Z',
    proposalAt: '2026-01-22T16:00:00.000Z',
    wonAt: '2026-01-28T11:00:00.000Z',
  }
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
    const now = new Date().toISOString();
    const val = leadData.value !== undefined && leadData.value !== '' ? Number(leadData.value) : 0;
    const owner = leadData.owner || 'Sarah';
    
    const newLead = {
      ...leadData,
      value: val,
      owner,
      id: createLeadId(),
      createdAt: now,
      contactedAt: leadData.status !== 'New' ? now : undefined,
      meetingAt: ['Meeting Scheduled', 'Proposal Sent', 'Won'].includes(leadData.status) ? now : undefined,
      proposalAt: ['Proposal Sent', 'Won'].includes(leadData.status) ? now : undefined,
      wonAt: leadData.status === 'Won' ? now : undefined,
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
      currentLeads.map((lead) => {
        if (lead.id === id) {
          const now = new Date().toISOString();
          const updated = { ...lead, ...leadData };

          if (leadData.value !== undefined) {
            updated.value = leadData.value !== '' ? Number(leadData.value) : 0;
          }

          if (leadData.status && leadData.status !== lead.status) {
            if (leadData.status === 'Contacted' && !updated.contactedAt) updated.contactedAt = now;
            if (leadData.status === 'Meeting Scheduled') {
              if (!updated.contactedAt) updated.contactedAt = now;
              if (!updated.meetingAt) updated.meetingAt = now;
            }
            if (leadData.status === 'Proposal Sent') {
              if (!updated.contactedAt) updated.contactedAt = now;
              if (!updated.meetingAt) updated.meetingAt = now;
              if (!updated.proposalAt) updated.proposalAt = now;
            }
            if (leadData.status === 'Won') {
              if (!updated.contactedAt) updated.contactedAt = now;
              if (!updated.meetingAt) updated.meetingAt = now;
              if (!updated.proposalAt) updated.proposalAt = now;
              if (!updated.wonAt) updated.wonAt = now;
            }
          }
          return updated;
        }
        return lead;
      })
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
