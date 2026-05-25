const mongoose = require('mongoose');
// TODO: define Application schema
const ApplicationSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('Application', ApplicationSchema);
