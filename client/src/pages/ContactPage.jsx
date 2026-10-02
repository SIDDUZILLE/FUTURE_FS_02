import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CheckCircle2, Send, Lock } from 'lucide-react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    source: 'Website Contact Form'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!formData.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.submitPublicLead(formData);
      setSuccessMessage(res.message || 'Your inquiry has been submitted successfully.');
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        source: 'Website Contact Form'
      });
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-page-wrapper">
      <div className="public-card">
        <div className="public-header">
          <h1>Get In Touch</h1>
          <p>Have questions or need assistance? Send us your message and our team will reach out promptly.</p>
        </div>

        {submitted ? (
          <div>
            <div className="alert-success">
              <CheckCircle2 size={36} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Thank You!
              </h3>
              <p style={{ fontSize: '0.95rem' }}>{successMessage}</p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setSubmitted(false)}
              >
                Submit Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="alert-error">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+1 (555) 234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company / Organization</label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  className="form-control"
                  placeholder="Acme Tech"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="source">How Did You Find Us? (Source)</label>
              <select
                id="source"
                name="source"
                className="form-control"
                value={formData.source}
                onChange={handleChange}
              >
                <option value="Website Contact Form">Website Contact Form</option>
                <option value="Google Search">Google Search</option>
                <option value="Social Media">Social Media</option>
                <option value="Referral">Friend / Referral</option>
                <option value="Advertisement">Online Advertisement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message <span className="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="form-control"
                placeholder="Tell us about your requirements or questions..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              <Send size={16} />
              <span>{loading ? 'Submitting Lead...' : 'Submit Lead'}</span>
            </button>
          </form>
        )}

        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <Link 
            to="/admin/login" 
            style={{ fontSize: '0.8125rem', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Lock size={12} />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
