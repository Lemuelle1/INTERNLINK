const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  dueDate: { type: Date, required: true },
  tags: { type: [String], default: [] },
  matchPercentage: { type: Number, required: true },
  shortDescription: { type: String, required: true }
});

module.exports = mongoose.model('Internship', InternshipSchema);
