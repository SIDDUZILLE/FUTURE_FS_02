import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { LeadModal } from '../components/LeadModal';
import { DeleteModal } from '../components/DeleteModal';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  SlidersHorizontal,
  UserX
} from 'lucide-react';

export const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getLeads({ search, status: statusFilter });
      setLeads(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle manual Add Lead
  const handleAddLead = async (formData) => {
    await api.createLead(formData);
    fetchLeads();
  };

  // Handle Edit Lead
  const handleOpenEdit = (lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleUpdateLead = async (formData) => {
    if (!selectedLead) return;
    await api.updateLead(selectedLead._id, formData);
    fetchLeads();
  };

  // Handle Delete Lead
  const handleOpenDelete = (lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLead) return;
    try {
      setDeleteLoading(true);
      await api.deleteLead(selectedLead._id);
      setIsDeleteModalOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (err) {
      setError(err.message || 'Failed to delete lead');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      {/* Top action bar */}
      <div className="toolbar">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Leads Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Browse, search, filter, and maintain client lead records
          </p>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>+ Add Lead</span>
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="toolbar" style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
        <div className="toolbar-left">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: '150px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
        </div>

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={fetchLeads} 
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Created Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{lead.name}</div>
                      {lead.company && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {lead.company}
                        </div>
                      )}
                    </td>
                    <td>{lead.email}</td>
                    <td>{lead.phone || '-'}</td>
                    <td>{lead.source || 'Website'}</td>
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td>{formatDate(lead.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                        <Link 
                          to={`/admin/leads/${lead._id}`} 
                          className="btn btn-secondary btn-icon"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          className="btn btn-secondary btn-icon"
                          title="Edit Lead"
                          onClick={() => handleOpenEdit(lead)}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          className="btn btn-secondary btn-icon"
                          style={{ color: '#ef4444' }}
                          title="Delete Lead"
                          onClick={() => handleOpenDelete(lead)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <UserX size={36} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                    <p style={{ fontWeight: 500 }}>No leads match your criteria.</p>
                    <p style={{ fontSize: '0.8125rem' }}>Try clearing your search or status filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      <LeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddLead}
        title="+ Add New Lead"
      />

      {/* Edit Lead Modal */}
      <LeadModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLead(null);
        }}
        onSave={handleUpdateLead}
        lead={selectedLead}
        title="Edit Lead Details"
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLead(null);
        }}
        onConfirm={handleConfirmDelete}
        leadName={selectedLead?.name}
        loading={deleteLoading}
      />
    </div>
  );
};
