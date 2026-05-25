const mongoose = require('mongoose');
// TODO: define Opportunity schema
const OpportunitySchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('Opportunity', OpportunitySchema);
