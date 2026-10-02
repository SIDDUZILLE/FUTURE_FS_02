const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('crm_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      // If we are in an admin route and token expired, redirect to login
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  // Public Contact Lead
  submitPublicLead: async (leadData) => {
    const res = await fetch(`${API_BASE}/leads/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    return handleResponse(res);
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Leads
  getLeads: async ({ search = '', status = 'All' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);

    const res = await fetch(`${API_BASE}/leads?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getLeadById: async (id) => {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createLead: async (leadData) => {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leadData)
    });
    return handleResponse(res);
  },

  updateLead: async (id, leadData) => {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(leadData)
    });
    return handleResponse(res);
  },

  deleteLead: async (id) => {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateLeadStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/leads/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  addLeadNote: async (id, text) => {
    const res = await fetch(`${API_BASE}/leads/${id}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text })
    });
    return handleResponse(res);
  },

  addLeadFollowUp: async (id, { date, note }) => {
    const res = await fetch(`${API_BASE}/leads/${id}/followups`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date, note })
    });
    return handleResponse(res);
  }
};
