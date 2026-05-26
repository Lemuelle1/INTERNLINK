const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending',
  },
  coverLetter: {
    type: String,
    required: [true, 'Please add a cover letter'],
  },
  cvUrl: {
    type: String,
    required: [true, 'Please provide a CV URL for this application'],
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Application', ApplicationSchema);
