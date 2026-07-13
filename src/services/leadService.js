import api from './api.js';

/**
 * Lead Service Client wrapper interfacing with CRUD and aggregate lead endpoints.
 * All functions unwrap the Axios response, returning direct payload data.
 */
const leadService = {
  /**
   * Retrieves a paginated and filtered list of leads.
   * @param {Object} params - Query parameters including { status, search, page, limit, sortBy, sortOrder }.
   * @returns {Promise<Object>} Response payload containing leads list and pagination metadata.
   */
  getLeads: async (params) => {
    const response = await api.get('/api/leads', { params });
    return response.data;
  },

  /**
   * Registers a new lead.
   * @param {Object} leadData - Lead fields: { name, company, email, phone, status, source, notes }.
   * @returns {Promise<Object>} Response payload containing the saved lead document.
   */
  createLead: async (leadData) => {
    const response = await api.post('/api/leads', leadData);
    return response.data;
  },

  /**
   * Modifies an existing lead's fields.
   * @param {string} id - Lead database identifier.
   * @param {Object} leadData - Updated fields map.
   * @returns {Promise<Object>} Response payload containing the updated lead document.
   */
  updateLead: async (id, leadData) => {
    const response = await api.put(`/api/leads/${id}`, leadData);
    return response.data;
  },

  /**
   * Updates only the status field on a lead.
   * @param {string} id - Lead database identifier.
   * @param {string} status - New pipeline status string.
   * @returns {Promise<Object>} Response payload containing the updated lead document.
   */
  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/api/leads/${id}/status`, { status });
    return response.data;
  },

  /**
   * Deletes a lead record.
   * @param {string} id - Lead database identifier.
   * @returns {Promise<Object>} Response payload verifying deletion success.
   */
  deleteLead: async (id) => {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  },

  /**
   * Retrieves aggregate KPI stats and status distribution metrics.
   * Interfaces with GET /api/leads/stats
   * @returns {Promise<Object>} Response payload containing stats aggregates.
   */
  getLeadStats: async () => {
    const response = await api.get('/api/leads/stats');
    return response.data;
  },

  /**
   * Retrieves 6-month trailing leads totals and conversion statistics.
   * Interfaces with GET /api/leads/monthly-stats
   * @returns {Promise<Object>} Response payload containing monthly arrays.
   */
  getMonthlyStats: async () => {
    const response = await api.get('/api/leads/monthly-stats');
    return response.data;
  },
};

export default leadService;
