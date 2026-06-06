const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  dueDate: { type: Date, required: true },
  tags: [{ type: String }],
  description: { type: String, required: true },
  matchPercentage: { type: Number, default: 0 }, // Simulated for now
  remote: { type: Boolean, default: false },
  requirements: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
