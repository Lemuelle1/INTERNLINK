const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/profile/:id (or we can just use me to get my profile)
router.get('/:id', auth, async (req, res) => {
  try {
    const profile = await User.findById(req.params.id).select('-password');
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// PUT /api/profile
router.put('/', auth, async (req, res) => {
  const {
    name, university, programOfStudy, year, gpa, graduationYear,
    skills, bio, phone, linkedin, github, portfolio, profileComplete
  } = req.body;

  const profileFields = {};
  if (name) profileFields.name = name;
  if (university) profileFields.university = university;
  if (programOfStudy) profileFields.programOfStudy = programOfStudy;
  if (year) profileFields.year = year;
  if (gpa) profileFields.gpa = gpa;
  if (graduationYear) profileFields.graduationYear = graduationYear;
  if (skills) profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
  if (bio) profileFields.bio = bio;
  if (phone) profileFields.phone = phone;
  if (linkedin) profileFields.linkedin = linkedin;
  if (github) profileFields.github = github;
  if (portfolio) profileFields.portfolio = portfolio;
  if (profileComplete) profileFields.profileComplete = profileComplete;

  try {
    let user = await User.findById(req.user.id);
    if (user) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: profileFields },
        { new: true }
      ).select('-password');
      return res.json(user);
    }
    res.status(404).json({ msg: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
