const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

// @desc    Apply for an opportunity
// @route   POST /api/applications
// @access  Private (Student only)
exports.applyForOpportunity = async (req, res, next) => {
  try {
    const { opportunityId, coverLetter } = req.body;

    // Check if opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check user profile (ensure they have uploaded a CV)
    const user = await User.findById(req.user.id);
    if (!user || !user.cvUrl) {
      return res.status(400).json({ message: 'Please upload your CV in your Profile before applying!' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      opportunity: opportunityId,
      student: req.user.id,
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this opportunity' });
    }

    // Create application
    const application = await Application.create({
      opportunity: opportunityId,
      student: req.user.id,
      coverLetter,
      cvUrl: user.cvUrl, // Capture the CV URL at the time of application
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's applications
// @route   GET /api/applications/student
// @access  Private (Student only)
exports.getStudentApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('opportunity')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a specific opportunity
// @route   GET /api/applications/opportunity/:opportunityId
// @access  Private (Admin only)
exports.getOpportunityApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ opportunity: req.params.opportunityId })
      .populate('student', '-password')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (Admin only)
exports.getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('opportunity')
      .populate('student', '-password')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin only)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json({
      message: `Application status updated to ${status}`,
      application,
    });
  } catch (error) {
    next(error);
  }
};
