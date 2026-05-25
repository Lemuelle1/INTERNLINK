const express = require('express');
const router = express.Router();

router.use('/auth',          require('./auth'));
router.use('/users',         require('./users'));
router.use('/opportunities', require('./opportunities'));
router.use('/applications',  require('./applications'));
router.use('/teams',         require('./teams'));
router.use('/projects',      require('./projects'));
router.use('/reviews',       require('./peerReviews'));
router.use('/admin',         require('./admin'));

module.exports = router;
