const express = require('express');
const router = express.Router();
const {
  applyForOpportunity,
  getStudentApplications,
  getOpportunityApplications,
  updateApplicationStatus,
  getAllApplications,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, applyForOpportunity);
router.get('/student', protect, getStudentApplications);
router.get('/opportunity/:opportunityId', protect, adminOnly, getOpportunityApplications);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);
router.get('/', protect, adminOnly, getAllApplications);

module.exports = router;
