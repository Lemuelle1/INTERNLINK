const Opportunity = require('../models/Opportunity');

// @desc    Get all opportunities with optional filtering and search
// @route   GET /api/opportunities
// @access  Public
exports.getOpportunities = async (req, res, next) => {
  try {
    const { type, search } = req.query;
    let query = {};

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single opportunity details
// @route   GET /api/opportunities/:id
// @access  Public
exports.getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private/Admin
exports.createOpportunity = async (req, res, next) => {
  try {
    const { title, company, location, type, description, requirements, stipend, duration, deadline } = req.body;

    const opportunity = await Opportunity.create({
      title,
      company,
      location,
      type,
      description,
      requirements,
      stipend: stipend || 'Unpaid',
      duration: duration || 'Flexible',
      deadline,
      createdBy: req.user.id,
    });

    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an opportunity
// @route   PUT /api/opportunities/:id
// @access  Private/Admin
exports.updateOpportunity = async (req, res, next) => {
  try {
    const { title, company, location, type, description, requirements, stipend, duration, deadline } = req.body;

    let opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Update fields
    opportunity.title = title || opportunity.title;
    opportunity.company = company || opportunity.company;
    opportunity.location = location || opportunity.location;
    opportunity.type = type || opportunity.type;
    opportunity.description = description || opportunity.description;
    opportunity.requirements = requirements || opportunity.requirements;
    opportunity.stipend = stipend !== undefined ? stipend : opportunity.stipend;
    opportunity.duration = duration || opportunity.duration;
    opportunity.deadline = deadline || opportunity.deadline;

    const updatedOpportunity = await opportunity.save();
    res.json(updatedOpportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private/Admin
exports.deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    await opportunity.deleteOne();
    res.json({ message: 'Opportunity removed successfully' });
  } catch (error) {
    next(error);
  }
};
