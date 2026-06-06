const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');

// GET /api/applications (my applications)
router.get('/', auth, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate('opportunityId')
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/applications/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('opportunityId');
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }
    if (application.studentId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(application);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Application not found' });
    }
    res.status(500).send('Server Error');
  }
});

// PUT /api/applications/:id/withdraw
router.put('/:id/withdraw', auth, async (req, res) => {
  try {
    let application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }
    if (application.studentId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Simplification: we'll just delete it or set status to rejected/withdrawn
    await Application.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Application withdrawn' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Application not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
