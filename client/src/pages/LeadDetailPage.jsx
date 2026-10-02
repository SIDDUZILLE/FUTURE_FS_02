import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Globe, 
  MessageSquare, 
  CalendarClock, 
  Plus, 
  CheckCircle,
  FileText
} from 'lucide-react';

export const LeadDetailPage = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Note form state
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  // Follow-up form state
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);

  // Status update state
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchLeadDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getLeadById(id);
      setLead(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch lead details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLeadDetails();
  }, [fetchLeadDetails]);

  // Temporary success flash
  const flashSuccess = (msg) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  // Status Change handler
  const handleStatusChange = async (newStatus) => {
    if (!lead || lead.status === newStatus) return;
    try {
      setStatusLoading(true);
      const updated = await api.updateLeadStatus(lead._id, newStatus);
      setLead(updated);
      flashSuccess(`Lead status updated to ${newStatus}`);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  // Add Note handler
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    try {
      setNoteLoading(true);
      const updated = await api.addLeadNote(lead._id, noteText.trim());
      setLead(updated);
      setNoteText('');
      flashSuccess('Note added successfully');
    } catch (err) {
      setError(err.message || 'Failed to add note');
    } finally {
      setNoteLoading(false);
    }
  };

  // Add Follow-up handler
  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpDate || !followUpNote.trim()) {
      setError('Both date and follow-up note are required');
      return;
    }

    try {
      setFollowUpLoading(true);
      const updated = await api.addLeadFollowUp(lead._id, {
        date: followUpDate,
        note: followUpNote.trim()
      });
      setLead(updated);
      setFollowUpDate('');
      setFollowUpNote('');
      flashSuccess('Follow-up scheduled successfully');
    } catch (err) {
      setError(err.message || 'Failed to schedule follow-up');
    } finally {
      setFollowUpLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading lead details...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Lead Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          The requested lead could not be located.
        </p>
        <Link to="/admin/leads" className="btn btn-primary">
          Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Top navigation */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link 
          to="/admin/leads" 
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={14} />
          <span>Back to All Leads</span>
        </Link>
      </div>

      {successNotice && <div className="alert-success" style={{ marginBottom: '1rem' }}>{successNotice}</div>}
      {error && <div className="alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="lead-grid">
        {/* Left Column: Lead Overview */}
        <div>
          <div className="card">
            <div className="card-header">
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {lead.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StatusBadge status={lead.status} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Created: {formatDate(lead.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Quick Status Selector */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Change Status
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['New', 'Contacted', 'Converted'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`btn btn-sm ${lead.status === s ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handleStatusChange(s)}
                      disabled={statusLoading}
                    >
                      {lead.status === s && <CheckCircle size={13} />}
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info fields */}
              <div className="form-row" style={{ marginBottom: '1rem' }}>
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={13} />
                    <span>Email Address</span>
                  </div>
                  <div className="info-value">
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={13} />
                    <span>Phone Number</span>
                  </div>
                  <div className="info-value">
                    {lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : '-'}
                  </div>
                </div>
              </div>

              <div className="form-row" style={{ marginBottom: '1.25rem' }}>
                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building2 size={13} />
                    <span>Company</span>
                  </div>
                  <div className="info-value">{lead.company || '-'}</div>
                </div>

                <div className="info-item">
                  <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Globe size={13} />
                    <span>Lead Source</span>
                  </div>
                  <div className="info-value">{lead.source || 'Website'}</div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MessageSquare size={13} />
                  <span>Inquiry / Message</span>
                </div>
                <div 
                  style={{ 
                    background: '#f8fafc', 
                    padding: '1rem', 
                    borderRadius: '6px', 
                    border: '1px solid var(--border-color)',
                    fontSize: '0.9375rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {lead.message || 'No message provided.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notes & Follow-ups */}
        <div>
          {/* Notes Section */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} style={{ color: 'var(--primary)' }} />
                <h3 className="card-title">Notes ({lead.notes?.length || 0})</h3>
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleAddNote} style={{ marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Called client and discussed pricing..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={3}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm" 
                  disabled={noteLoading || !noteText.trim()}
                >
                  <Plus size={14} />
                  <span>{noteLoading ? 'Adding...' : 'Add Note'}</span>
                </button>
              </form>

              {/* Notes List */}
              <div className="history-list">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.map((n, idx) => (
                    <div key={n._id || idx} className="history-item">
                      <div className="history-date">
                        {formatDate(n.createdAt)}
                      </div>
                      <div className="history-text">{n.text}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                    No notes recorded yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Follow-up Section */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarClock size={18} style={{ color: '#059669' }} />
                <h3 className="card-title">Follow-ups ({lead.followUps?.length || 0})</h3>
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleAddFollowUp} style={{ marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8125rem' }}>Follow-up Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8125rem' }}>Follow-up Note</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Call client regarding quotation"
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm" 
                  disabled={followUpLoading || !followUpDate || !followUpNote.trim()}
                >
                  <Plus size={14} />
                  <span>{followUpLoading ? 'Scheduling...' : 'Add Follow-up'}</span>
                </button>
              </form>

              {/* Follow-ups List */}
              <div className="history-list">
                {lead.followUps && lead.followUps.length > 0 ? (
                  lead.followUps.map((f, idx) => (
                    <div key={f._id || idx} className="history-item" style={{ borderLeft: '3px solid #059669' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '0.8125rem', color: '#047857', marginBottom: '0.2rem' }}>
                        <Calendar size={13} />
                        <span>Date: {f.date}</span>
                      </div>
                      <div className="history-text">{f.note}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                        Added: {formatDate(f.createdAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                    No follow-ups scheduled yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
