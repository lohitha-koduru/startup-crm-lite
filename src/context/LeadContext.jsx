import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService.js';

export const LeadContext = createContext(null);

/**
 * LeadProvider Component
 * Manages sales pipeline lead records state using backend API operations.
 */
export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });

  /**
   * Fetches leads from the backend API.
   * 
   * @param {Object} [params={}] - Filter and pagination params: { status, search, page, limit, sortBy, sortOrder }
   */
  const fetchLeads = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await leadService.getLeads(params);
      // Response structure: { success: true, data: Array, pagination: {...} }
      const payload = response.data || response;
      
      // If unwrapped from axios directly or standard payload layout
      const leadsList = Array.isArray(payload) ? payload : (payload.data || []);
      const pagData = payload.pagination || { total: leadsList.length, page: 1, limit: 20, pages: 1 };
      
      setLeads(leadsList);
      setPagination(pagData);
    } catch (error) {
      console.error('Error fetching leads:', error);
      const errMsg = error.response?.data?.message || 'Failed to load leads from database';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Auto-fetch leads on provider mount if authenticated.
   */
  useEffect(() => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      fetchLeads();
    }
  }, [fetchLeads]);

  /**
   * Adds a new lead via the backend API.
   * 
   * @param {Object} leadData - The lead creation values.
   */
  const addLead = useCallback(async (leadData) => {
    setIsLoading(true);
    try {
      const response = await leadService.createLead(leadData);
      const newLead = response.data || response;
      
      // Prepend to current local leads state array
      setLeads((currentLeads) => [newLead, ...currentLeads]);
      
      toast.success(`${newLead.name} added to your pipeline!`, {
        iconTheme: { primary: '#22C55E', secondary: '#fff' },
      });
      return newLead;
    } catch (error) {
      console.error('Error adding lead:', error);
      const errMsg = error.response?.data?.message || 'Failed to add lead';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Updates an existing lead via the backend API.
   * 
   * @param {string} id - The lead database identifier.
   * @param {Object} leadData - The fields to update.
   */
  const updateLead = useCallback(async (id, leadData) => {
    setIsLoading(true);
    try {
      const response = await leadService.updateLead(id, leadData);
      const updatedLead = response.data || response;
      
      // Update entry in local state array
      setLeads((currentLeads) =>
        currentLeads.map((lead) => (lead._id === id || lead.id === id ? updatedLead : lead))
      );
      
      toast.success(`${updatedLead.name} updated successfully.`);
      return updatedLead;
    } catch (error) {
      console.error('Error updating lead:', error);
      const errMsg = error.response?.data?.message || 'Failed to update lead';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Deletes a lead by id via the backend API.
   * 
   * @param {string} id - The lead database identifier.
   */
  const deleteLead = useCallback(async (id) => {
    setIsLoading(true);
    try {
      // Find the name before deleting to display a clean toast message
      const targetLead = leads.find((l) => l._id === id || l.id === id);
      const leadName = targetLead ? targetLead.name : 'Lead';

      await leadService.deleteLead(id);
      
      // Remove entry from local state array
      setLeads((currentLeads) => currentLeads.filter((lead) => lead._id !== id && lead.id !== id));
      
      toast.error(`${leadName} has been removed.`, {
        iconTheme: { primary: '#EF4444', secondary: '#fff' },
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      const errMsg = error.response?.data?.message || 'Failed to delete lead';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [leads]);

  /**
   * Finds a lead by id locally in the loaded state.
   * 
   * @param {string} id - The lead database identifier.
   * @returns {Object|undefined} The matching lead object.
   */
  const getLeadById = useCallback(
    (id) => leads.find((lead) => lead._id === id || lead.id === id),
    [leads]
  );

  const value = useMemo(
    () => ({
      leads,
      isLoading,
      pagination,
      fetchLeads,
      addLead,
      updateLead,
      deleteLead,
      getLeadById,
    }),
    [leads, isLoading, pagination, fetchLeads, addLead, updateLead, deleteLead, getLeadById]
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
};

/**
 * Custom hook to consume lead states and mutations.
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider.');
  }
  return context;
};
