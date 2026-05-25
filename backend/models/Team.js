const mongoose = require('mongoose');
// TODO: define Team schema
const TeamSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('Team', TeamSchema);
