const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  amount: { type: String, required: true },
  dueDate: { type: Date, required: true },
  tags: { type: [String], default: [] },
  matchPercentage: { type: Number, required: true },
  shortDescription: { type: String, required: true }
});

module.exports = mongoose.model('Scholarship', ScholarshipSchema);
