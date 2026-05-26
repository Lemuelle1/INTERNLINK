const express = require('express');
const router = express.Router();
const { updateProfile, uploadCV } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.put('/profile', protect, updateProfile);
router.post('/upload-cv', protect, upload.single('cv'), uploadCV);

module.exports = router;
