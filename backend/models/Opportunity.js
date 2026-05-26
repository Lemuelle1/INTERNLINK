const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['internship', 'scholarship'],
    required: [true, 'Please specify if it is an internship or scholarship'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  requirements: {
    type: String,
    required: [true, 'Please add requirements'],
  },
  stipend: {
    type: String,
    default: 'Unpaid',
  },
  duration: {
    type: String,
    default: 'Flexible',
  },
  deadline: {
    type: Date,
    required: [true, 'Please specify the deadline date'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
