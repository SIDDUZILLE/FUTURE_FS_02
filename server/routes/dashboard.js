const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard metrics and recent leads
// @access  Private (Admin)
router.get('/stats', protect, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });

    // Recent 5 leads
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      recentLeads
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;
