const mongoose = require('mongoose');
// TODO: define PeerReview schema
const PeerReviewSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('PeerReview', PeerReviewSchema);
