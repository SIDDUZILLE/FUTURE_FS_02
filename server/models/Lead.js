const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const followUpSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  company: {
    type: String,
    default: '',
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  source: {
    type: String,
    default: 'Website',
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Converted'],
    default: 'New'
  },
  notes: [noteSchema],
  followUps: [followUpSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
