const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opportunityId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'opportunityType' },
  opportunityType: { type: String, required: true, enum: ['Internship', 'Scholarship'] },
  savedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);
