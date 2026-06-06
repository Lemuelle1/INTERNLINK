const express = require('express');
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Internship = require('../models/Internship');
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email !== 'admin@internlink.com' || password !== 'Admin123!') {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
  res.json({ token, role: 'admin' });
});

// Get Admin Stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    res.json({
      totalStudents: 48234,
      totalStudentsGrowth: 12,
      totalApplications: 12891,
      applicationsGrowth: 8,
      activeOpportunities: 347,
      opportunitiesGrowth: 23,
      scholarportals: 89,
      scholarshipGrowth: 4
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Students
router.get('/students', adminAuth, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email university programOfStudy');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Opportunities
router.get('/opportunities', adminAuth, async (req, res) => {
  try {
    const internships = await Internship.find();
    const scholarships = await Scholarship.find();
    const combined = [
      ...internships.map(i => ({ ...i._doc, type: 'internship' })),
      ...scholarships.map(s => ({ ...s._doc, type: 'scholarship' }))
    ];
    res.json(combined);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Opportunity
router.post('/opportunities', adminAuth, async (req, res) => {
  const { title, type, organization, description, location, salary } = req.body;
  try {
    if (type === 'internship') {
      const opp = new Internship({ title, organization, description, location, salary, active: true });
      await opp.save();
      res.status(201).json(opp);
    } else if (type === 'scholarship') {
      const opp = new Scholarship({ title, organization, description, active: true });
      await opp.save();
      res.status(201).json(opp);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Opportunity
router.put('/opportunities/:id', adminAuth, async (req, res) => {
  try {
    const updated = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true }) ||
                    await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Opportunity
router.delete('/opportunities/:id', adminAuth, async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Applications
router.get('/applications', adminAuth, async (req, res) => {
  try {
    const apps = await Application.find().populate('studentId', 'name email').sort('-appliedDate');
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Application Status
router.put('/applications/:id/status', adminAuth, async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Analytics Data
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    res.json({
      applicationTrends: [
        { month: 'Jan', internships: 850, scholarships: 420 },
        { month: 'Feb', internships: 1100, scholarships: 580 },
        { month: 'Mar', internships: 950, scholarships: 490 },
        { month: 'Apr', internships: 1050, scholarships: 520 },
        { month: 'May', internships: 1200, scholarships: 610 },
        { month: 'Jun', internships: 1150, scholarships: 590 }
      ],
      opportunitiesByField: [
        { field: 'Engineering', percentage: 38 },
        { field: 'Business', percentage: 24 },
        { field: 'Data Science', percentage: 18 },
        { field: 'Design', percentage: 12 },
        { field: 'Other', percentage: 8 }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
