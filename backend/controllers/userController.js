const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, bio, skills, avatarUrl, cvUrl } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills;
      } else if (typeof skills === 'string') {
        user.skills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
    }
    
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (cvUrl) user.cvUrl = cvUrl;

    const updatedUser = await user.save();
    
    // Don't send back password
    const userRes = updatedUser.toObject();
    delete userRes.password;

    res.json(userRes);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload CV document
// @route   POST /api/users/upload-cv
// @access  Private
exports.uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF or image file' });
    }

    // Resolve the upload path (remote URL from Cloudinary or local static path)
    const fileUrl = req.file.path.startsWith('http')
      ? req.file.path
      : `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Update user's CV url in database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cvUrl = fileUrl;
    await user.save();

    res.json({
      message: 'CV uploaded successfully',
      cvUrl: fileUrl,
    });
  } catch (error) {
    next(error);
  }
};
