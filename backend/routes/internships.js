const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

// GET /api/internships
router.get('/', auth, async (req, res) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/internships/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ msg: 'Internship not found' });
    res.json(internship);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Internship not found' });
    }
    res.status(500).send('Server Error');
  }
});

// POST /api/internships/:id/apply
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ msg: 'Internship not found' });

    let application = await Application.findOne({ studentId: req.user.id, opportunityId: req.params.id });
    if (application) {
      return res.status(400).json({ msg: 'Already applied' });
    }

    application = new Application({
      studentId: req.user.id,
      opportunityId: req.params.id,
      opportunityType: 'Internship'
    });

    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
