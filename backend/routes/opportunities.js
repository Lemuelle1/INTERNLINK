const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getOpportunities);
router.get('/:id', getOpportunityById);
router.post('/', protect, adminOnly, createOpportunity);
router.put('/:id', protect, adminOnly, updateOpportunity);
router.delete('/:id', protect, adminOnly, deleteOpportunity);

module.exports = router;
