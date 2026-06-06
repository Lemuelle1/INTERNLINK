const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');

// GET /api/scholarships
router.get('/', auth, async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json(scholarships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/scholarships/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ msg: 'Scholarship not found' });
    res.json(scholarship);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Scholarship not found' });
    }
    res.status(500).send('Server Error');
  }
});

// POST /api/scholarships/:id/apply
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ msg: 'Scholarship not found' });

    let application = await Application.findOne({ studentId: req.user.id, opportunityId: req.params.id });
    if (application) {
      return res.status(400).json({ msg: 'Already applied' });
    }

    application = new Application({
      studentId: req.user.id,
      opportunityId: req.params.id,
      opportunityType: 'Scholarship'
    });

    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
