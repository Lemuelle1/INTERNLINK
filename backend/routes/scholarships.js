const express = require('express');
const Scholarship = require('../models/Scholarship');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ name: 1 });
    res.json(scholarships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load scholarships.' });
  }
});

module.exports = router;
