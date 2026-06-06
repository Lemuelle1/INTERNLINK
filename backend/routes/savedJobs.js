const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SavedJob = require('../models/SavedJob');

// GET /api/saved-jobs
router.get('/', auth, async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ studentId: req.user.id })
      .populate('opportunityId')
      .sort({ savedDate: -1 });
    res.json(savedJobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/saved-jobs
router.post('/', auth, async (req, res) => {
  const { opportunityId, opportunityType } = req.body;
  try {
    let savedJob = await SavedJob.findOne({ studentId: req.user.id, opportunityId });
    if (savedJob) {
      return res.status(400).json({ msg: 'Job already saved' });
    }

    savedJob = new SavedJob({
      studentId: req.user.id,
      opportunityId,
      opportunityType
    });

    await savedJob.save();
    res.json(savedJob);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/saved-jobs/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const savedJob = await SavedJob.findById(req.params.id);
    if (!savedJob) {
      return res.status(404).json({ msg: 'Saved job not found' });
    }
    if (savedJob.studentId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await SavedJob.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Job removed from saved list' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Saved job not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
