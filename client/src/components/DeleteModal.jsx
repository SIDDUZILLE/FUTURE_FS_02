import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const DeleteModal = ({ isOpen, onClose, onConfirm, leadName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ef4444' }}>
            <AlertTriangle size={20} />
            <h3 className="modal-title" style={{ fontSize: '1.05rem' }}>Confirm Deletion</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={loading}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center', padding: '1.75rem 1.5rem' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 500 }}>
            Are you sure you want to delete this lead?
          </p>
          {leadName && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Lead: <strong>{leadName}</strong>. This action cannot be undone.
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
