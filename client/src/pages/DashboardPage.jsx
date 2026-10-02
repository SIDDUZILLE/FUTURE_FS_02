import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Users, 
  Sparkles, 
  PhoneCall, 
  CheckCircle, 
  ArrowRight,
  RefreshCw,
  Eye
} from 'lucide-react';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
    recentLeads: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      {/* Page Header */}
      <div className="toolbar">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Lead Overview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Real-time pipeline metrics and most recent incoming inquiries
          </p>
        </div>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={fetchDashboardData} 
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Leads</div>
            <div className="stat-value">{stats.totalLeads}</div>
          </div>
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">New Leads</div>
            <div className="stat-value">{stats.newLeads}</div>
          </div>
          <div className="stat-icon amber">
            <Sparkles size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Contacted Leads</div>
            <div className="stat-value">{stats.contactedLeads}</div>
          </div>
          <div className="stat-icon purple">
            <PhoneCall size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Converted Leads</div>
            <div className="stat-value">{stats.convertedLeads}</div>
          </div>
          <div className="stat-icon emerald">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Recent Leads Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Leads</h2>
          <Link to="/admin/leads" className="btn btn-secondary btn-sm">
            <span>View All Leads</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Source</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading recent leads...
                  </td>
                </tr>
              ) : stats.recentLeads && stats.recentLeads.length > 0 ? (
                stats.recentLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td style={{ fontWeight: 600 }}>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.company || '-'}</td>
                    <td>{lead.source || 'Website'}</td>
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td>{formatDate(lead.createdAt)}</td>
                    <td>
                      <Link 
                        to={`/admin/leads/${lead._id}`} 
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No leads recorded yet. Try submitting an inquiry through the public contact form!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
