const express = require('express');
const Internship = require('../models/Internship');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const internships = await Internship.find().sort({ title: 1 });
    res.json(internships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load internships.' });
  }
});

module.exports = router;
