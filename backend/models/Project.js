const mongoose = require('mongoose');
// TODO: define Project schema
const ProjectSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('Project', ProjectSchema);
