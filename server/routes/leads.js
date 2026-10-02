const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

// ==========================================
// PUBLIC CONTACT FORM ROUTE
// ==========================================

// @route   POST /api/leads/contact
// @desc    Submit a new lead from public contact form
// @access  Public
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, company, message, source } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const lead = new Lead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      message: message.trim(),
      source: source && source.trim() ? source.trim() : 'Website Form',
      status: 'New'
    });

    const savedLead = await lead.save();

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully.',
      lead: savedLead
    });
  } catch (error) {
    console.error('Public lead submission error:', error);
    res.status(500).json({ message: 'Server error while submitting lead' });
  }
});

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================

// @route   GET /api/leads
// @desc    Get all leads with search and filter
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    // Filter by status if provided and not "All"
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search by name, email, company, or message
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { company: regex },
        { message: regex }
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('Fetch leads error:', error);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

// @route   GET /api/leads/:id
// @desc    Get lead details by ID
// @access  Private (Admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    console.error('Fetch lead detail error:', error);
    res.status(500).json({ message: 'Failed to fetch lead details' });
  }
});

// @route   POST /api/leads
// @desc    Admin manually creates a new lead
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const { name, email, phone, company, message, source, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const lead = new Lead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      message: message ? message.trim() : 'Added by Admin',
      source: source && source.trim() ? source.trim() : 'Manual',
      status: status || 'New'
    });

    const savedLead = await lead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    console.error('Manual lead creation error:', error);
    res.status(500).json({ message: 'Failed to create lead' });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update lead details
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, email, phone, company, message, source, status } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (name) lead.name = name.trim();
    if (email) lead.email = email.trim().toLowerCase();
    if (phone !== undefined) lead.phone = phone.trim();
    if (company !== undefined) lead.company = company.trim();
    if (message) lead.message = message.trim();
    if (source) lead.source = source.trim();
    if (status) lead.status = status;

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Failed to update lead' });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Failed to delete lead' });
  }
});

// @route   PATCH /api/leads/:id/status
// @desc    Quickly update lead status
// @access  Private (Admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['New', 'Contacted', 'Converted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.status = status;
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update lead status' });
  }
});

// @route   POST /api/leads/:id/notes
// @desc    Add a note to lead
// @access  Private (Admin)
router.post('/:id/notes', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Note text cannot be empty' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.notes.unshift({
      text: text.trim(),
      createdAt: new Date()
    });

    const updatedLead = await lead.save();
    res.status(201).json(updatedLead);
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Failed to add note' });
  }
});

// @route   POST /api/leads/:id/followups
// @desc    Add a follow-up to lead
// @access  Private (Admin)
router.post('/:id/followups', protect, async (req, res) => {
  try {
    const { date, note } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Follow-up date is required' });
    }
    if (!note || !note.trim()) {
      return res.status(400).json({ message: 'Follow-up note is required' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.followUps.unshift({
      date,
      note: note.trim(),
      createdAt: new Date()
    });

    const updatedLead = await lead.save();
    res.status(201).json(updatedLead);
  } catch (error) {
    console.error('Add follow-up error:', error);
    res.status(500).json({ message: 'Failed to add follow-up' });
  }
});

module.exports = router;
