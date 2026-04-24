const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getFreelancers,
  getFreelancerById,
  updateFreelancerProfile
} = require('../controllers/freelancerController');

router.get('/', getFreelancers);
router.get('/:id', getFreelancerById);
router.put('/profile', authMiddleware, updateFreelancerProfile);

module.exports = router;
