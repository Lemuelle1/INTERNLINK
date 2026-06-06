const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  amount: { type: String, required: true },
  dueDate: { type: Date, required: true },
  tags: [{ type: String }],
  description: { type: String, required: true },
  matchPercentage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
